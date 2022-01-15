var context = nlapiGetContext();


function editSaveByLoadSearch_account() {

    var results = nlapiLoadSearch(null, 'customsearch_accounts_missing_classifica');
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
            id = s[i].getValue("internalid")

            var rec = nlapiLoadRecord('account', id);
            var verification = nlapiSubmitRecord(rec, null, true);
            //console.log('s = ' + i + ' - account:' + verification);
            nlapiLogExecution('debug', 's = ' + i, 'account:' + verification);

            if (context.getRemainingUsage() < 150) {
                nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }

            //nlapiGetContext().getRemainingUsage = function () { return 1000; }
        } catch (e) {
            //console.log('error: s = ' + i + ' - record:' + verification);
            //console.log('detail: ' + e);
            nlapiLogExecution('debug', 'error with rec: ', id);
            nlapiLogExecution('debug', 'exception:  ', e);
            continue;
        }
    }
}