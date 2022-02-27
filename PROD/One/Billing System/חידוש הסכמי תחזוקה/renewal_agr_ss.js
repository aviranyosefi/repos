var context = nlapiGetContext();
var employeeId = context.user;
var errArr = new Array();
var sList = new Array();
function ActionScreenSS() {
    try {
        var actionType = context.getSetting('SCRIPT', 'custscript_renewal_action');
        var dataToUpdate = context.getSetting('SCRIPT', 'custscript_renewal_data');
        var dataToRemove = context.getSetting('SCRIPT', 'custscript_renewal_remove_data');   
        var statusType = context.getSetting('SCRIPT', 'custscript_renewal_status');   
        nlapiLogExecution('DEBUG', 'actionType: ' + actionType, 'statusType: ' + statusType);
        nlapiLogExecution('DEBUG', 'dataToUpdate:', dataToUpdate);
        nlapiLogExecution('DEBUG', 'dataToRemove:', dataToRemove);
        dataToUpdate = JSON.parse(dataToUpdate);  
        if (actionType == "1") { // עריכת הסכם
            UpdateAGR(dataToUpdate, statusType, actionType)
            dataToRemove = JSON.parse(dataToRemove);  
            Remove(dataToRemove, statusType)
            //var type = 'Agreement'
            //summaryEmail(employeeId, data_agr.length, type);
        }
        else if (actionType == "2") {
            UpdateAGR(dataToUpdate, statusType, actionType)
        }             
    } catch (e) {
        nlapiLogExecution('error', 'error ActionScreenSS ', e);
    }
}
function UpdateAGR(dataToUpdate, statusType, actionType ) {
    try {
        if (statusType == 1) { // פעיל
            field = 'custrecord_ib_rate'
        }
        else if (statusType == 2) { // טיוטה
            field = 'custrecord_ib_renewal_amount'
        }
        var fields = [];
        fields.push(field); 
        if (actionType == 2) { // צירוף שורות
            if (statusType == 1) {
                fields.push('custrecord_ib_customer')
                fields.push('custrecord_ib_agr')             
            }
            else {
                fields.push('custrecord_ib_new_customer')
                fields.push('custrecord_ib_new_agreement')
              
            }
        }
        for (var m = 0; m < dataToUpdate.length; m++) {
            try {    
                Context(context)
                var vals = [];
                vals.push(dataToUpdate[m].renewal_amount)
                if (actionType == 2) {
                    vals.push(dataToUpdate[m].cust_target)   
                    vals.push(dataToUpdate[m].agr_target)                                   
                }
                nlapiSubmitField('customrecord_ib', dataToUpdate[m].ib_id, fields, vals);
            } catch (e) {
                nlapiLogExecution('error', 'UpdateAGR error nlapiSubmitField ' + dataToUpdate[m].ib_id , e);
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'UpdateAGR error ', e);
    }
}
function Remove(dataToRemove, statusType) {
    try {
        if (statusType == 1) { // פעיל
            field = 'custrecord_ib_agr'
        }
        else if (statusType == 2) { // טיוטה
            field = 'custrecord_ib_new_agreement'
        }
        var fields = []; fields.push(field); 
        for (var m = 0; m < dataToRemove.length; m++) {
            try {
                Context(context)
                var vals = []; vals[0] = null; 
                nlapiSubmitField('customrecord_ib', dataToRemove[m].ib_id, fields, vals);
            } catch (e) {
                nlapiLogExecution('error', 'Remove error nlapiSubmitField ' + dataToRemove[m].ib_id, e);
            }        
        }     
    } catch (e) {
        nlapiLogExecution('error', 'Remove error ', e);
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



