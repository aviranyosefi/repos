var context = nlapiGetContext();
var employeeId = context.user;
var errArr = new Array();
var sList = new Array();
var agrType;
var invoice_date = '';
function CreateInvoice() {
    try { 
        var manage_inv_log = context.getSetting('SCRIPT', 'custscript_manage_inv_log');    
        manage_inv_log = JSON.parse(manage_inv_log);
        var agrType = manage_inv_log[0].type
        nlapiLogExecution('DEBUG', 'agrType :' + agrType, 'manage_inv_log: ' + JSON.stringify(manage_inv_log));
        var bpList = getBP(agrType, manage_inv_log[0].fromdate, manage_inv_log[0].todate, manage_inv_log[0].agr, manage_inv_log[0].ib, manage_inv_log[0].employee, manage_inv_log[0].customer)
        nlapiLogExecution('DEBUG', 'bpList : ' + bpList.length, JSON.stringify(bpList));
        if (bpList.length > 0) {
            invoice_date = manage_inv_log[0].invoice_date
            SortDataPerSplit(bpList)
        }
        summaryEmail(employeeId);
    } catch (e) {
        nlapiLogExecution('error', 'error CreateInvoice ', e);
    }
}
function getBP(type_data, from_date_data, to_date_data, agr_data, ib_data, employee_line_data, customer_data) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_bp_to_inv');
        var cols = search.getColumns();
        search.addFilter(new nlobjSearchFilter('custrecord_agr_type', 'custrecord_bp_agr', 'anyof', type_data))
        if (!isNullOrEmpty(from_date_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bp_date_for_inv', null, 'onorafter', from_date_data)) }
        search.addFilter(new nlobjSearchFilter('custrecord_bp_date_for_inv', null, 'onorbefore', to_date_data))
        if (!isNullOrEmpty(agr_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bp_agr', null, 'anyof', agr_data)) }
        if (!isNullOrEmpty(ib_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bp_ib', null, 'anyof', ib_data)) }
        if (!isNullOrEmpty(employee_line_data)) { search.addFilter(new nlobjSearchFilter('owner', 'custrecord_bp_agr', 'anyof', employee_line_data)) }
        if (!isNullOrEmpty(customer_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bp_customer', null, 'anyof', customer_data)) }
        var bpList = [];
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
            for (var i = 0; i < s.length; i++) {
                bpList.push({
                    split_formula: s[i].getValue(cols[0]),
                    bp_id: s[i].id,
                });
            }
        }
        return bpList;
    } catch (e) {
        nlapiLogExecution('error', 'error getBP ', e);
    }
}
function SortDataPerSplit(bpList) {
    try {
        var data = []; 
        line = 0;
        split = bpList[0].split_formula;
        for (var m = line; m < bpList.length; m++) {                 
            if (split == bpList[m].split_formula) {
                data.push({
                    bp_id: bpList[m].bp_id,
                });
            } else {
                CreateInvoiceFromBP(data)
                split = bpList[m].split_formula;   
                var data = []; 
                data.push({
                    bp_id: bpList[m].bp_id,
                });
            }           
        }
        CreateInvoiceFromBP(data);
    } catch (e) {
        nlapiLogExecution('ERROR', 'CreateSingalInvoice Error:', e);
    }
}
function CreateInvoiceFromBP(dataToInvoce) {
    try {
        Context(context);
        nlapiLogExecution('DEBUG', 'CreateInvoiceFromBI dataToInvoce:' + dataToInvoce.length, JSON.stringify(dataToInvoce));
        for (var r = 0; r < dataToInvoce.length; r++) {
            //Context(context);
            var rec = nlapiLoadRecord('customrecord_bp', dataToInvoce[r].bp_id);
            if (r == 0) {
                var INVOICErec = nlapiCreateRecord('invoice');
                INVOICErec.setFieldValue('entity', rec.getFieldValue('custrecord_bp_customer'));                              
                INVOICErec.setFieldValue('custbody_agreement', rec.getFieldValue('custrecord_bp_agr'));  
                //INVOICErec.setFieldValue('location', 101)
                INVOICErec.setFieldValue('trandate', invoice_date)
            }
            try {         
                CreateItem(INVOICErec, rec)    
            } catch (err) {
                nlapiLogExecution('DEBUG', 'error CreateInvoiceFromBP - lines', err);
            }
        }
        try {
            var INVOICEid =  nlapiSubmitRecord(INVOICErec, null, true);
            nlapiLogExecution('debug', 'INVOICE id: ', INVOICEid);
            if (INVOICEid != -1) {                   
                sList.push({
                    agr: nlapiLookupField('customrecord_agr', rec.getFieldValue('custrecord_bp_agr'), 'name'),
                    agr_id: rec.getFieldValue('custrecord_bp_agr'),
                    invoice: nlapiLookupField('invoice', INVOICEid, 'tranid'),  
                    invoice_id: INVOICEid
                });
            }
        } catch (e) {
            nlapiLogExecution('DEBUG', 'error nlapiSubmitRecord ', e);
            errArr.push({
                error: e,
                agr: nlapiLookupField('custrecord_bp_agr', rec.getFieldValue('custrecord_bp_agr'), 'name'),
                agr_id: rec.getFieldValue('custrecord_bp_agr'),
            });          
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error CreateInvoiceFromBP ', e);
        nlapiSendEmail(employeeId, employeeId, 'Invoice create summary', 'An error occurred while trying to create Invoices \n Error description: ' + e);
    }
}
function CreateItem(INVOICErec, rec) {
    try {
        Context(context);     
        var item = rec.getFieldValue('custrecord_bp_charging_item');        
        if (isNullOrEmpty(item)) { item = 8545}       
        INVOICErec.selectNewLineItem('item');
        INVOICErec.setCurrentLineItemValue('item', 'item', item);
        INVOICErec.setCurrentLineItemValue('item', 'quantity', 1)
        INVOICErec.setCurrentLineItemValue('item', 'rate', rec.getFieldValue('custrecord_bp_amount'))
        addFieldToLine(INVOICErec,rec)                   
    } catch (e) {
        nlapiLogExecution('ERROR', 'CreateItem Error:', e);
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function Context(context) {
    if (context.getRemainingUsage() < 5000) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }
}
function addFieldToLine(INVOICErec, rec) {
    try {
        INVOICErec.setCurrentLineItemValue('item', 'custcol_bs_agr', rec.getFieldValue('custrecord_bp_agr'))
        INVOICErec.setCurrentLineItemValue('item', 'custcol_bs_bp', rec.getId())
        INVOICErec.setCurrentLineItemValue('item', 'custcol_bs_ib', rec.getFieldValue('custrecord_bp_ib'))
        INVOICErec.setCurrentLineItemValue('item', 'custcol_service_start_date', rec.getFieldValue('custrecord_bp_service_start_date'))
        INVOICErec.setCurrentLineItemValue('item', 'custcol_service_end_date', rec.getFieldValue('custrecord_bp_service_end_date'))
        INVOICErec.commitLineItem('item');     
            
    } catch (e) {
        nlapiLogExecution('ERROR', 'addFieldToLine Error:', e);
    }
    
}
function summaryEmail(employeeId) {
    nlapiLogExecution('DEBUG', 'inside send mail', 'inside send mail');
    try {
        var date = new Date();
        var subject = "Invoices create summary ";
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
            "<p style='color:black; font-size:100%;'>The process of Invoices create has been completed. </p> " +
            "<p style='color: black; font-size:100%;'>Here is a summary of the results:</p></div>";

        var successTbl = '<p style= \'font-weight: bold ;color: green; font-size:140%; \'>Total: ' + sList.length + ' succeeded</p><br>';
        if (sList != null && sList != '') {
            successTbl += "<table style = \"width: 100 %;\" >";
            // for th
            successTbl += "<tr><th>Agreement</th><th>Invoice</th></tr>";
            for (var v in sList) {
                successTbl += "<tr><td>" + GetLink(sList[v].agr, sList[v].agr_id, 'customrecord_agr')  + "</td>";
                successTbl += "<td>" + GetLink(sList[v].invoice, sList[v].invoice_id, 'invoice') + "</td>"
                successTbl += "</tr>";
            }
            successTbl += "</table>"
        }

        var failTbl = '<p style= \'font-weight: bold ;color: red; font-size:140%; \'> Total: ' + errArr.length + ' failed</p><br>';
        if (errArr != null && errArr != '') {
            failTbl += "<table style = \"width: 100 %;\" >";
            // for th
            failTbl += "<tr><th>Agreement</th><th>Error</th></tr>";
            for (var s in errArr) {
                failTbl += "<tr><td>" + GetLink(sList[v].agr, sList[v].agr_id, 'customrecord_agr') + "</td><td>" + errArr[s].error + "</td></tr > ";
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
function GetLink(name,id, type) {
    var link = "<a href='https://system.netsuite.com" + nlapiResolveURL('RECORD', type, id) + "'" + ' target="_blank">' + name + "</a>";
    return link;
}


