var context = nlapiGetContext();
var employeeId = context.user;
var data = context.getSetting('SCRIPT', 'custscript_data');
var errArr = new Array();
var sList = new Array();
var printStat = '';

function so_to_fulfilment() {
    try {

        nlapiLogExecution('DEBUG', 'fulfilment', data);
        var dataArr = JSON.parse(data)
        for (y = 0; y < dataArr.length; y++) {
            Context(context);
            var status = getStatus(dataArr[0].status);
            if (status == "B") {
                printStat = "packed";
            }
            else {
                printStat = "shipped";
            }
            try {
                if (isNullOrEmpty(status)) { status = getStatus(dataArr[i].status) }
                var rec = nlapiLoadRecord('itemfulfillment', dataArr[y].itf_id);
                rec.setFieldValue('shipstatus', status)
                var submition = nlapiSubmitRecord(rec);
                if (submition != -1) {
                    sList.push({
                        sales_order: dataArr[y].sales_order,
                        region: dataArr[y].region,
                        ff_id: submition,
                        itf_tranid: dataArr[y].itf_tranid,
                        city: dataArr[y].city
                    })
                }
            }
            catch (e) {
                errArr.push({
                    sales_order: dataArr[y].sales_order,
                    region: dataArr[y].region,
                    status: 'Failed',
                    error: e,
                    ff_id: submition,
                    itf_tranid: dataArr[y].itf_tranid,
                    city: dataArr[y].city
                })
                nlapiLogExecution('ERROR', 'error', e);
                continue;
            }
        }
        nlapiLogExecution('DEBUG', 'before send mail', '');
        summaryEmail(employeeId);

    } catch (e) {
        nlapiSendEmail(employeeId, employeeId, 'item Fuilfillments status change summary', 'An error occurred while trying to change status \n Error description: ' + e);
    }
}

function summaryEmail(employeeId) {
    nlapiLogExecution('DEBUG', 'inside send mail', '');
    try {
        var date = new Date();
        var subject = "Item Fuilfillments status change summary ";
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
            "<p style='color:black; font-size:100%;'>The process of change item fuilfillments status has been completed. </p> " +
            "<p style='color: black; font-size:85%;'>New Status: " + printStat +"</p>";
            "<p style='color: black; font-size:70%;'>Here is a summary of the results:</p></div>";

        var successTbl = '<p style= \'font-weight: bold ;color: green; font-size:140%; \'>Total: ' + sList.length + ' succeeded</p><br>';
        if (sList != null && sList != '') {
            successTbl += "<table style = \"width: 100 %;\" >";
            // for th
            successTbl += "<tr><th>FF TranId</th><th>Region</th><th>City</th><th>SO</th></tr>";
            for (var v in sList) {
                successTbl += "<tr><td>" + sList[v].itf_tranid + "</td>";
                successTbl += "<td>" + sList[v].region + "</td>";
                successTbl += "<td>" + sList[v].city + "</td>";
                successTbl += "<td>" + sList[v].sales_order + "</td>"
                successTbl += "</tr>";
            }
            successTbl += "</table>"
        }

        var failTbl = '<p style= \'font-weight: bold ;color: red; font-size:140%; \'> Total: ' + errArr.length + ' failed</p><br>';
        if (errArr != null && errArr != '') {
            failTbl += "<table style = \"width: 100 %;\" >";
            // for th
            failTbl += "<tr><th>FF TranId</th><th>Region</th><th>City</th><th>SO</th><th>Error</th></tr>";
            for (var s in errArr) {
                failTbl += "<tr><td>" + errArr[s].itf_tranid + "</td><td>" + errArr[s].region + "</td><td>" + errArr[s].city + "</td><td>" + errArr[s].sales_order + "</td><td>" + errArr[s].error + "</td></tr>"
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

function Context(context) {

    //nlapiLogExecution('DEBUG', 'context.getRemainingUsage()', context.getRemainingUsage());
    if (context.getRemainingUsage() < 150) {
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

function getStatus(status) {

    if (status == 'picked') {
        return 'B'
    }
    else if (status == 'packed') {
        return 'C'
    }
    return '';
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}