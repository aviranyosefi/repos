function editSaveByLoadSearch() {

    var results = nlapiLoadSearch(null, 'customsearch_update_il_transaction');
    var runSearch = results.runSearch();
    var context = nlapiGetContext();
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
            var rec = nlapiLoadRecord(s[i].type, s[i].id);
            var verification = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', 's = ' + i, 'verification: ' + verification);
            if (context.getRemainingUsage() < 150) {
                nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }
        } catch (e) {
            cnlapiLogExecution('debug','error: s = ' + i + ' - record:' + verification);
            nlapiLogExecution('debug','details: ' + e);
            continue;
        }
    }
}