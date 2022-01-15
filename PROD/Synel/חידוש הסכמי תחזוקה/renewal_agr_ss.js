var context = nlapiGetContext();
var employeeId = context.user;
var errArr = new Array();
var sList = new Array();

function ActionScreenSS() {
    try {
        var actionType = context.getSetting('SCRIPT', 'custscript_renewal_action');
        var data_agr = context.getSetting('SCRIPT', 'custscript_renewal_data');
        var clean_data = context.getSetting('SCRIPT', 'custscript_renewal_clean_data');    
        nlapiLogExecution('DEBUG', 'actionType:', actionType);
        nlapiLogExecution('DEBUG', 'data_agr:', data_agr);
        nlapiLogExecution('DEBUG', 'clean_data:', clean_data);
        data_agr = JSON.parse(data_agr);     
        if (actionType == "1") {
            CreateNewAgr(data_agr)
            var type = 'Agreement'
            summaryEmail(employeeId, data_agr.length, type);
        }
        else if (actionType == "2") {
            clean_data = JSON.parse(clean_data);
            clean(clean_data)
            updateRenewalNEWRATE(data_agr)
        }
        else {
            SetLinesToTarget(data_agr)
            var type = 'Agreement'
        }

        
    } catch (e) {
        nlapiLogExecution('error', 'error ActionScreenSS ', e);
    }
}
function CreateNewAgr(data_agr) {
    try {
        nlapiLogExecution('debug', 'CreateNewAgr start : ' + data_agr.length, JSON.stringify(data_agr))
        var id = -1;    
        for (var m = 0; m < data_agr.length; m++) {
            try { 
                Context(context);
                if (m == 0) {
                    var num_mon = data_agr[0].custrecord_agr_num_mon;
                    var strNewDate = data_agr[0].custrecord_agr_srt_date;
                    var agr = data_agr[0].agr;
                    var agrRec = nlapiLoadRecord('customrecord_agreement', agr)
                    var rec = nlapiCopyRecord('customrecord_agreement', agr, null)
                    if (isNullOrEmpty(num_mon)) { num_mon = 12 }
                    var newDate = nlapiAddMonths(nlapiStringToDate(strNewDate), Number(num_mon))
                    //var strNewDate = nlapiAddDays(nlapiStringToDate(agrRec.getFieldValue('custrecord_agr_renew_date')), 1)
                    rec.setFieldValue('custrecord_agr_srt_date', strNewDate);
                    rec.setFieldValue('custrecord_agr_renew_date', newDate);
                    rec.setFieldValue('custrecord_agr_end_date', newDate); 
                    var bill_cust = agrRec.getFieldValue('custrecord_agr_bill_cust');
                    var altname = nlapiLookupField('customer', bill_cust, 'altname')
                    var agreement_type = agrRec.getFieldText('custrecord_maintenance_agreement_type');
                    try {
                        newName = altname + ' - ' + strNewDate.split('/')[2] + ' - ' + nlapiDateToString(newDate).split('/')[2] + ' - ' + agreement_type
                        rec.setFieldValue('name', newName);
                    } catch (e) {
                        nlapiLogExecution('ERROR', 'new name Error:', e);
                    }
                    rec.setFieldValue('custrecord_agr_status', 3);// טיוטא 
                    rec.setFieldValue('custrecord_billing_plan_created', 'F');
                    var agr_renew_type = data_agr[m].custrecord_agr_renew_type 
                    if (agr_renew_type == "2") { // חידוש ידני            
                        rec.setFieldValue('custrecord_agr_renewal_approved', 'F');
                    }
                    else {// חידוש אוטומטי
                        rec.setFieldValue('custrecord_agr_renewal_approved', 'T');
                    }
                    rec.setFieldValue('custrecord_agr_num_mon', num_mon);
                    rec.setFieldValue('custrecord_maintenance_agreement_type', data_agr[m].custrecord_maintenance_agreement_type); //TODO
                    rec.setFieldValue('custrecord_agr_sys_type', data_agr[m].custrecord_agr_sys_type);//TODO
                    rec.setFieldValue('custrecord_agr_bill_cyc', data_agr[m].custrecord_agr_bill_cyc);
                    rec.setFieldValue('custrecord_agr_renew_type', agr_renew_type);
                    rec.setFieldValue('custrecord_agr_billing_on', data_agr[m].custrecord_agr_billing_on);
                    rec.setFieldValue('custrecord_agr_billing_description', data_agr[m].custrecord_agr_billing_description);
                    try {
                        id = nlapiSubmitRecord(rec);
                        nlapiLogExecution('DEBUG', 'NEW AGR:', id);
                        if (id != -1) {
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
                if (id != -1) { 
                    var fields = [];fields[0] = 'custrecord_agr_line_new_agr';fields[1] = 'custrecord_agr_line_renewal_amount'
                    var val = []; val[0] =id ;val[1] = data_agr[m].newRate
                    nlapiSubmitField('customrecord_agr_line', data_agr[m].agr_line, fields, val )
                }
            } catch (e) {
                nlapiLogExecution('ERROR', 'CreateNewAgr Lines Error:', e);
            }
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'CreateNewAgr Error:', e);
    }
}
function updateRenewalNEWRATE(data_agr) {
    try {
        for (var m = 0; m < data_agr.length; m++) {
            try {
                nlapiSubmitField('customrecord_agr_line', data_agr[m].agr_line, 'custrecord_agr_line_renewal_amount', data_agr[m].newRate);
            } catch (e) { }
        }
    } catch (e) {

    }

}
function clean(clean_data) {
    try {
        for (var m = 0; m < clean_data.length; m++) {
            try {
                var fields = []; fields[0] = 'custrecord_agr_line_new_agr'; fields[1] = 'custrecord_agr_line_renewal_amount'
                var val = []; val[0] = null; val[1] = ''
                nlapiSubmitField('customrecord_agr_line', clean_data[m].agr_line, fields,val);
            } catch (e) { }        
        }     
    } catch (e) {

    }
}
function SetLinesToTarget(data_agr) {
    try {
        nlapiLogExecution('debug', 'SetLinesToTarget start : ' + data_agr.length, JSON.stringify(data_agr))
        for (var m = 0; m < data_agr.length; m++) {
            try {
                Context(context);             
                var fields = []; fields[0] = 'custrecord_agr_line_new_agr'; fields[1] = 'custrecord_agr_line_renewal_amount'
                var val = []; val[0] = data_agr[m].targetAgr; val[1] = data_agr[m].newRate
                nlapiSubmitField('customrecord_agr_line', data_agr[m].agr_line, fields, val)                
            } catch (e) {
                nlapiLogExecution('ERROR', 'SetLinesToTarget Lines Error:', e);
            }
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'SetLinesToTarget Error:', e);
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



