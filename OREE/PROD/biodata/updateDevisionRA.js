var context = nlapiGetContext();

function updateDivision() {

    var results = nlapiLoadSearch(null, 'customsearch105');
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

    for (i = 0; i < s.length; i++) {
        try {
            var recId = s[i].getValue('internalid', 'revenueArrangement');
            var division = s[i].getValue('class', 'sourceTransaction');
            var line = s[i].getValue('line', 'revenueArrangement');
            var rec = nlapiLoadRecord('revenuearrangement', recId);
            var revCount = rec.getLineItemCount('revenueelement');
            for (y = 1; y <= revCount; y++) {
                if (rec.getLineItemValue('revenueelement', 'line', y) == line) {
                    rec.setLineItemValue('revenueelement', 'custcol_line_division', line, division);
                    var submition = nlapiSubmitRecord(rec);
                    nlapiLogExecution('debug', 'R_element id, R_arrangementID, line, division :', s[i].id + ', ' + submition + ', ' + line + ', ' + division);
                }
                //else {
                //    nlapiLogExecution('debug', 'R_arrangement id:' + recId + 'line: ' + line, 'does not match');
                //}
                if (context.getRemainingUsage() < 150) {
                    nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                    if (state.status == 'FAILURE') {
                        nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                    }
                    else if (state.status == 'RESUME') {
                        nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                    }
                }
            }
        } catch (e) {
            nlapiLogExecution('debug', 'error with rec: ', recId);
            nlapiLogExecution('debug', 'exception:  ', e);
            continue;
        }
    }
}
