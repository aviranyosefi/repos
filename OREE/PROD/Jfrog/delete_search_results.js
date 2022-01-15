var context = nlapiGetContext();

function del_res_rec(type) {
    try {
        var searchId = context.getSetting('SCRIPT', 'custscriptcustscript1');
        var sList = new Array();
        var fList = new Array();
        var results = nlapiLoadSearch(null, searchId);
        var scriptType = results.scriptId;
        var runSearch = results.runSearch();
        var s = [];
        var searchid = 0;

        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        for (var i = 0; i < 30; i++) {
            if (context.getRemainingUsage() < 150) {
                nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
                var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }

            try {
                if ((i % 6) == 0) {
                    nlapiLogExecution('debug', 'i % 6', 'rec id:' + s[i].getId());
                    nlapiDeleteRecord('hejdkd', s[i].getId());
                }
                else {
                    nlapiDeleteRecord(s[i].getRecordType(), s[i].getId());
                    sList.push(s[i].getId());
                }
            }//inner try end
            catch (e) {
                fList.push({
                    id: s[i].getId(),
                    error: e,
                })
                continue;
            }//catch end
        }//for end
        email(sList, fList, scriptType);
    }//outer try end
    catch (e) {
        nlapiLogExecution('debug', 'search not found', e);
    }

}
function email(success, fail, scriptTypeN) {
    try {
        var date = new Date();
        var subject = "Deletion Report ";
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
            "<p style='color:black; font-size:160%;'>The process of deleting records according to the results of the search Id:</p><br> " +
            "<p style='color: blue; font-size:140%;'>" + scriptTypeN + "</p><br>" +
            "<p style='color:black; font-size:160%;'> has been completed.</p> <br><br>" +
            "<p style='color: black; font-size:160%;'>Here is a summary of the results:</p> <br><br></div>";

        var successTbl = '<p style= \'font-weight: bold ;font-size:140%; \'>Total: ' + success.length + ' succeeded</p><br>';
        if (success != null && success != '') {
            successTbl += "<table style = \"width: 100 %;\" >";
            // for th
            successTbl += "<tr> <th colspan=\'9\'>Id </th><tr>";
            var i = 0;
            for (v in success) {
                if ((i % 10) == 0) {
                    successTbl += "<tr>";
                    i++;
                }
                successTbl += "<td>" + success[v] + "</td>";
                i++;
                if ((i % 10) == 0) {
                    successTbl += "</tr>";
                }
            }
            successTbl += "</table>"
        }

        var failTbl = '<p style= \'font-weight: bold ;font-size:140%; \'> Total: ' + fail.length + ' failed</p><br>';
        if (fail != null && fail != '') {
            failTbl += "<table style = \"width: 100 %;\" >";
            // for th
            failTbl += "<tr><th>Id </th><th>Description</th><tr>";
            for (s in fail) {
                failTbl += "<tr><td>" + fail[s].id + "</td> <td>" + fail[s].error + "</td></tr> "
            }
            failTbl += "</table>"
        }
        var list = successTbl + '<br>' + failTbl;
        body += list;
        body += '<br></html>';
        nlapiSendEmail(2438, 2438, subject, body);
        nlapiLogExecution('debug', 'after email', 'email has been sent');
    } catch (e) {
        nlapiLogExecution('error', 'email()', e);
    }
} 