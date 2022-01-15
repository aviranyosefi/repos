var context = nlapiGetContext();
var employeeId = context.user;
var errArr = new Array();
var sList = new Array();

function ActionScreenSS() {
    try {
        var actionType = context.getSetting('SCRIPT', 'custscript_action');
        var data_agr = context.getSetting('SCRIPT', 'custscript_data_agr');
        nlapiLogExecution('DEBUG', 'actionType:', actionType);
        nlapiLogExecution('DEBUG', 'data_agr:', data_agr);
        data_agr = JSON.parse(data_agr);
        if (actionType == "3") {
            UnionAgr(data_agr)
            var type =  'Agreement'
        }
        else if (actionType == "5") {
            UpdateAgrLine(data_agr)
            var type = 'Agreement Line'
        }
        else if (actionType == "4") {
            UpdateDisBP(data_agr)
            var type = 'Agreement Line'
        }
        else if (actionType == "6") {
            data_agr = getAgreementLines(data_agr[0].agr, 1, data_agr[0].employee, actionType, data_agr[0].customer, data_agr[0].line_bus,data_agr[0].percent)
            UpdateUploadBP(data_agr)
            var type = 'Agreement Line'
        }
        else { // 1 OR 2
            data_agr = getAgreement(data_agr[0].fromdate, data_agr[0].todate, data_agr[0].agr, 2, data_agr[0].employee, actionType, data_agr[0].customer, data_agr[0].percent)
            CreateNewAgr(data_agr, actionType)
            var type = 'Agreement'
        }
        summaryEmail(employeeId, data_agr.length, type);
    } catch (e) {
        nlapiLogExecution('error', 'error ActionScreenSS ', e);
    }
}
function CreateNewAgr(data_agr, actionType) {
    try {
        nlapiLogExecution('debug', 'CreateNewAgr start : ' + data_agr.length, JSON.stringify(data_agr))
        var id;  
        for (var m = 0; m < data_agr.length; m++) {
            try { 
                Context(context);
                agr = data_agr[m].agr;
                var agrRec = nlapiLoadRecord('customrecord_agreement', agr)
                var rec = nlapiCopyRecord('customrecord_agreement', agr, null)                
                var num_mon = agrRec.getFieldValue('custrecord_agr_num_mon');
                if (isNullOrEmpty(num_mon)) { num_mon = 12}
                var newDate = nlapiAddMonths(nlapiStringToDate(data_agr[m].date), Number(num_mon))
                var strNewDate = nlapiAddDays(nlapiStringToDate(agrRec.getFieldValue('custrecord_agr_renew_date')), 1)
                rec.setFieldValue('custrecord_agr_srt_date', strNewDate);  
                rec.setFieldValue('custrecord_agr_renew_date', newDate);  
                rec.setFieldValue('custrecord_agr_end_date', newDate); 
                var bill_cust = agrRec.getFieldValue('custrecord_agr_bill_cust');               
                var altname = nlapiLookupField('customer', bill_cust, 'altname')
                var agreement_type = agrRec.getFieldText('custrecord_maintenance_agreement_type');
                try {
                    newName = altname + ' - ' + nlapiDateToString(strNewDate).split('/')[2] + ' - ' + nlapiDateToString(newDate).split('/')[2] + ' - ' + agreement_type
                    rec.setFieldValue('name', newName);
                } catch (e) { }            
                rec.setFieldValue('custrecord_agr_status', 3);// טיוטא 
                rec.setFieldValue('custrecord_billing_plan_created', 'F');
                if (actionType == "2") { // חידוש ידני            
                                
                }
                else {// חידוש אוטומטי
                    rec.setFieldValue('custrecord_agr_renewal_approved', 'T');
                }
                try { 
                    id = nlapiSubmitRecord(rec);
                    if (id != -1) {
                        UpdateAmount(agr, data_agr[m].percent, id)                 
                        nlapiSubmitField('customrecord_agreement', agr, 'custrecord_agr_next_agreement', id) 
                        sList.push({
                            agr: nlapiLookupField('customrecord_agreement', id, 'name'),              
                        });                   
                    }   
                } catch (e) {
                    errArr.push({
                        error: e,
                        agr: nlapiLookupField('customrecord_agreement', agr, 'name'),
                    });
                }
            } catch (e) {
                nlapiLogExecution('ERROR', 'CreateNewAgr Lines Error:', e);
            }
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'CreateNewAgr Error:', e);
    }
}
function UnionAgr(data_agr) {
    try {
        var id;
        for (var m = 0; m < data_agr.length; m++) {
            try {
                Context(context);
                agr = data_agr[m].agr;
                if (m == 0) {
                    nlapiLogExecution('debug', 'm ', m);
                    var agrRec = nlapiLoadRecord('customrecord_agreement', agr)
                    var rec = nlapiCopyRecord('customrecord_agreement', agr, null)
                    rec.setFieldValue('name', agrRec.getFieldValue('name'));
                    rec.setFieldValue('custrecord_agr_renew_date', data_agr[m].newToDate);
                    rec.setFieldValue('custrecord_agr_end_date', data_agr[m].newToDate);
                    rec.setFieldValue('custrecord_agr_srt_date', data_agr[m].newDate);
                    rec.setFieldValue('custrecord_agr_status', 3);// טיוטא  
                    try { 
                        id = nlapiSubmitRecord(rec);
                        if (id != -1) {
                            //nlapiLogExecution('debug', 'id', id);   
                            UpdateAmount(agr, data_agr[m].percent, id) 
                            sList.push({
                                agr: nlapiLookupField('customrecord_agreement', id, 'name'),
                            });
                        }
                    } catch (e) {
                        errArr.push({
                            error: e,
                            agr: nlapiLookupField('customrecord_agreement', agr, 'name'),
                        });
                    }
                }
                else if (id != -1 && !isNullOrEmpty(id)) {                   
                    UpdateAmount(agr, data_agr[m].percent, id)
                }
                nlapiSubmitField('customrecord_agreement', agr, 'custrecord_agr_status', 2);
            } catch (e) {
                nlapiLogExecution('ERROR', 'UnionAgr Lines Error:', e);
            }
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'UnionAgr Error:', e);
    }
}
function UpdateAgrLine(data_agr) {
    try {
        for (var m = 0; m < data_agr.length; m++) {
            try {
                Context(context);
                agr_line = data_agr[m].agr_line;
                try { 
                    nlapiSubmitField('customrecord_agr_line', agr_line, 'custrecord_agr_line_agreement', '');
                    sList.push({
                        agr: nlapiLookupField('customrecord_agreement_line', agr_line, 'name'),
                    });
                } catch (e) {
                    errArr.push({
                        error: e,
                        agr: nlapiLookupField('customrecord_agreement_line', agr_line, 'name'),
                    });
                }               
            } catch (e) {
                nlapiLogExecution('ERROR', 'UpdateAgrLine Lines Error:', e);
            }
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'UpdateAgrLine Error:', e);
    }
}
function getAgreemetLines(id) {
    var columns = new Array();
    columns.push(new nlobjSearchColumn('custrecord_agr_line_bsc_rate'))

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_agr_line_agreement', null, 'anyof', [id]);

    var search = nlapiCreateSearch('customrecord_agr_line', filters, columns);
    var resultset = search.runSearch();
    var s = [];
    var AgreemetLinesList = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            AgreemetLinesList.push({
                line_id: s[i].id,   
                line_bsc_rate: s[i].getValue('custrecord_agr_line_bsc_rate'),          
            });
        }
    }
    return AgreemetLinesList;
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function UpdateAmount(agr, percent , id) {
    var agrList = getAgreemetLines(agr);
    for (var i = 0; i < agrList.length; i++) {
        nlapiSubmitField('customrecord_agr_line', agrList[i].line_id, 'custrecord_agr_line_new_agr', id)
        var amount = agrList[i].line_bsc_rate
        if (!isNullOrEmpty(percent)) {   
            amount = Number(amount) + (Number(amount) * Number(percent)) / 100        
        }
        nlapiSubmitField('customrecord_agr_line', agrList[i].line_id, 'custrecord_agr_line_renewal_amount', amount)
    }
}
function UpdateDisBP(data_agr) {
    try {
        percent = data_agr[0].percent;
        nlapiLogExecution('debug', 'percent ', percent);
        for (var m = 0; m < data_agr.length; m++) {
            try {
                agr_line = data_agr[m].agr_line;
                newDate = data_agr[m].newDate;
                newToDate = data_agr[m].newToDate;
                newToDate = data_agr[m].newToDate;
                last_bp = data_agr[m].last_bp;
                try { 
                    getBillingPlane(agr_line, newDate, newToDate, percent, last_bp)
                    sList.push({
                        agr: nlapiLookupField('customrecord_agreement_line', agr_line, 'name'),
                    });
                } catch (e) {
                    errArr.push({
                        error: e,
                        agr: nlapiLookupField('customrecord_agreement_line', agr_line, 'name'),
                    });
                }

            } catch (e) {
                nlapiLogExecution('ERROR', 'UpdateAgrLine Lines Error:', e);
            }
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'UpdateAgrLine Error:', e);
    }
}
function getBillingPlane(agr_line_data, from_date_data, to_date_data, percent, last_bp) {

    var filters = new Array();
    filters.push(new nlobjSearchFilter('custrecord_bill_plan_inv_on', null, 'anyof', ["@NONE@"]))
    filters.push(new nlobjSearchFilter('created', null, 'onorafter', "21/04/2021"));  
    if (!isNullOrEmpty(from_date_data)) { filters.push(new nlobjSearchFilter('custrecord_bill_plan_per_str_date', null, 'onorafter', from_date_data)) }
    if (!isNullOrEmpty(to_date_data)) { filters.push(new nlobjSearchFilter('custrecord_bill_plan_per_end_date', null, 'onorbefore', to_date_data)) }
    if (!isNullOrEmpty(agr_line_data)) { filters.push(new nlobjSearchFilter('custrecord_bill_plan_agr_line', null, 'anyof', agr_line_data)) }   
    var cols = new Array();
    cols.push(new nlobjSearchColumn('custrecord_agr_line_last_billing_plan', 'custrecord_bill_plan_agr_line'));


    var results = [];
    var search = nlapiCreateSearch('customrecord_billing_plan', filters, cols);
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        nlapiLogExecution('debug', 's ', s.length);
        for (var i = 0; i < s.length; i++) {
            rec = nlapiLoadRecord('customrecord_billing_plan', s[i].id);
            rec.setFieldValue('custrecord_bill_sche_disc', percent);
            nlapiSubmitRecord(rec);           
        } 
        var lastDate = nlapiLookupField('customrecord_agr_line', agr_line_data, 'custrecord_agr_line_last_billing_plan');
        if (CreateBP(lastDate, to_date_data)) {

            nlapiScheduleScript('customscript_bs_create_bl_ss', null, { custscript_agr_line_id: agr_line_data, custscript_action_screen: to_date_data, custscript_percent: percent }) 
        }
    }
    return results;
}
function CreateBP(lastDate, to_date_data) {
    lastDate = nlapiStringToDate(lastDate)
    to_date_data = nlapiStringToDate(to_date_data)
    lastDateMM = lastDate.getMonth() + 1
    to_date_dataMM = to_date_data.getMonth() + 1
    lastDateYY = lastDate.getFullYear()
    to_date_dataYY = to_date_data.getFullYear()
    if (to_date_data > lastDate && (lastDateMM != to_date_dataMM || to_date_dataYY > lastDateYY  )) { return true }
    return false;  
}
function UpdateUploadBP(data_agr) {
    try {
        nlapiLogExecution('debug', 'data_agr: ' + data_agr.length, JSON.stringify(data_agr));
        percent = data_agr[0].percent;
        for (var m = 0; m < data_agr.length; m++) {
            try {
                agr_line = data_agr[m].agr_line;
                getBillingPlaneUpload(agr_line, percent)
                rec = nlapiLoadRecord('customrecord_agr_line', agr_line);
                var bsc_rate = rec.getFieldValue('custrecord_agr_line_bsc_rate');
                if (!isNullOrEmpty(bsc_rate)) {
                    bsc_rate = getNewRate(bsc_rate, percent)
                    rec.setFieldValue('custrecord_agr_line_bsc_rate', bsc_rate);
                    nlapiSubmitRecord(rec);
                }

            } catch (e) {
                nlapiLogExecution('ERROR', 'UpdateUploadBP Lines Error:', e);
            }
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'UpdateUploadBP Error:', e);
    }
}
function getBillingPlaneUpload(agr_line_data, percent) {
    
    var filters = new Array();
    filters.push(new nlobjSearchFilter('custrecord_bill_plan_inv_on', null, 'anyof', ["@NONE@"]))
    filters.push(new nlobjSearchFilter('created', null, 'onorafter', "21/04/2021"));
    if (!isNullOrEmpty(agr_line_data)) { filters.push(new nlobjSearchFilter('custrecord_bill_plan_agr_line', null, 'anyof', agr_line_data)) }

    //var cols = new Array();
    //cols.push(new nlobjSearchColumn('custrecord_agr_line_last_billing_plan', 'custrecord_bill_plan_agr_line'));

    var results = [];
    var search = nlapiCreateSearch('customrecord_billing_plan', filters, null);
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        nlapiLogExecution('debug', 'getBillingPlaneUpload s ' + s.length, JSON.stringify(s));
        for (var i = 0; i < s.length; i++) {
            try { 
                rec = nlapiLoadRecord('customrecord_billing_plan', s[i].id);
                var bsc_rate = rec.getFieldValue('custrecord_bill_plan_bsc_rate');
                if (!isNullOrEmpty(bsc_rate)) {
                    bsc_rate = getNewRate(bsc_rate, percent)
                    nlapiLogExecution('debug', 'bsc_rate: ', bsc_rate);
                    rec.setFieldValue('custrecord_bill_plan_bsc_rate', bsc_rate);
                    var id = nlapiSubmitRecord(rec);
                    nlapiLogExecution('debug', 'id: ', id);
                }
            } catch (e) { }
        }
    }
    return results;
}
function getNewRate(bsc_rate, percent) {
    bsc_rate = Number(bsc_rate) + Number(((bsc_rate * percent) / 100))
    return bsc_rate;
}
function getAgreement(from_date_data, to_date_data, agr_data, type_data, employee_data, action_data, customer_data, percent) {
    try {
        var filters = new Array();
        if (!isNullOrEmpty(from_date_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_renew_date', null, 'onorafter', from_date_data)) }
        if (!isNullOrEmpty(to_date_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_renew_date', null, 'onorbefore', to_date_data)) }
        if (!isNullOrEmpty(agr_data)) { filters.push(new nlobjSearchFilter('internalid', null, 'anyof', agr_data)) }
        if (!isNullOrEmpty(type_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_type', null, 'anyof', type_data)) }
        if (!isNullOrEmpty(employee_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_handled_by', null, 'anyof', employee_data)) }
        filters.push(new nlobjSearchFilter('custrecord_agr_status', null, 'noneof', '2'))
        if (action_data == '1' || action_data == '2') {
            filters.push(new nlobjSearchFilter('custrecord_agr_renew_type', null, 'anyof', action_data))
        }
        if (!isNullOrEmpty(customer_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_bill_cust', null, 'anyof', customer_data)) }
        filters.push(new nlobjSearchFilter('custrecord_agr_exc_from_action_screen', null, 'is', 'F'))

        var cols = new Array();
        cols.push(new nlobjSearchColumn('custrecord_agr_bill_cust'));
        cols.push(new nlobjSearchColumn('custrecord_agr_renew_date'));

        var search = nlapiCreateSearch('customrecord_agreement', filters, cols);
        var runSearch = search.runSearch();

        var s = [];
        var searchid = 0;
        var results = [];
        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        if (s != null) {
            for (var i = 0; i < s.length; i++) {
                var id = s[i].id
                rec = nlapiLoadRecord('customrecord_agreement', id)
                results.push({
                    agr: id,                                    
                    customer_id: s[i].getValue('custrecord_agr_bill_cust'),
                    amount: rec.getFieldValue('custrecord_agr_sum'),
                    date: s[i].getValue('custrecord_agr_renew_date'),
                    percent: percent,
                });
            }
        }
        return results;
    } catch (e) {
        nlapiLogExecution('ERROR', 'error serachAgreement', e);
        return results;
    }

}
function getAgreementLines(agr_data, type_data, employee_data, action_data, customer_data, business_line_data, percent) {
    try {
        var filters = new Array();

        if (!isNullOrEmpty(agr_data)) { filters.push(new nlobjSearchFilter('internalid', 'custrecord_agr_line_agreement', 'anyof', agr_data)) }
        if (!isNullOrEmpty(type_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_type', 'custrecord_agr_line_agreement', 'anyof', type_data)) }
        if (!isNullOrEmpty(employee_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_handled_by', 'custrecord_agr_line_agreement', 'anyof', employee_data)) }
        filters.push(new nlobjSearchFilter('custrecord_agr_status', 'custrecord_agr_line_agreement', 'noneof', '2'))
        if (!isNullOrEmpty(customer_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_bill_cust', 'custrecord_agr_line_agreement', 'anyof', customer_data)) }
        if (!isNullOrEmpty(business_line_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_line_bus_line', null, 'anyof', business_line_data)) }
        filters.push(new nlobjSearchFilter('custrecord_exclude_from_action_screen', null, 'is', 'F'))

        var search = nlapiCreateSearch('customrecord_agr_line', filters, null);
        var runSearch = search.runSearch();

        var s = [];
        var searchid = 0;
        var results = [];
        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        if (s != null) {
            for (var i = 0; i < s.length; i++) {
                var id = s[i].id
                results.push({
                    agr_line: id,                 
                    percent: percent
                });
            }
        }
        return results;
    } catch (e) {
        nlapiLogExecution('ERROR', 'error serachAgreement', e);
        return results;
    }
}
function Context(context) {

    //nlapiLogExecution('DEBUG', 'context.getRemainingUsage()', context.getRemainingUsage());
    if (context.getRemainingUsage() < 800) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        //nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }

}
function summaryEmail(employeeId, len, type) {
    nlapiLogExecution('DEBUG', 'inside send mail', 'inside send mail');
    try {
        var date = new Date();
        var subject = "Action Screen Summary ";
        var body = '<html>' +
            '<head>' +
            '<style>' +
            'table, th, td {' +
            'border: 2px solid black;' +
            'border-collapse: collapse;' +
            '}' +
            'td {' +
            'padding: 5px;' +
            'text-align: left;' +
            '}' +
            'th {' +
            'padding: 5px;' +
            'text-align: center;' +
            'background-color: #edeaea;' +
            'font-weight: bold ;' +
            '}' +
            '</style>' +
            '</head>' +
            "<div><p style= \'font-weight: bold ;font-size:110%; \'> Time stamp : " + date + "</p><br><br>" +
            "<p style='color:black; font-size:100%;'>The process of action screen has been completed. </p> " +
            "<p style='color: black; font-size:70%;'>Here is a summary of the results:</p></div>" +
            "<p style='color: black; font-size:70%;'>Number Of Lines: " + len +"</p></div>";

        var successTbl = '<p style= \'font-weight: bold ;color: green; font-size:140%; \'>Total: ' + sList.length + ' succeeded</p><br>';
        if (sList != null && sList != '') {
            successTbl += "<table style = \"width: 100 %;\" >";
            // for th
            successTbl += "<tr><th>" + type+"</th></tr>";
            for (var v in sList) {
                successTbl += "<tr><td>" + sList[v].agr + "</td>";
                successTbl += "</tr>";
            }
            successTbl += "</table>"
        }

        var failTbl = '<p style= \'font-weight: bold ;color: red; font-size:140%; \'> Total: ' + errArr.length + ' failed</p><br>';
        if (errArr != null && errArr != '') {
            failTbl += "<table style = \"width: 100 %;\" >";
            // for th
            failTbl += "<tr><th>" + type+"</th><th>Error</th></tr>";
            for (var s in errArr) {
                failTbl += "<tr><td>" + errArr[s].agr + "</td><td>" + errArr[s].error + "</td></tr > ";
            }
            failTbl += "</table>"
        }
        var list = successTbl + '<br>' + failTbl;
        body += list;
        body += '<br></html>';
        nlapiSendEmail(employeeId, employeeId, subject, body);
        nlapiLogExecution('debug', 'after email', 'email has been sent');
    } catch (e) {
        nlapiLogExecution('error', 'email()', e);
    }
}



