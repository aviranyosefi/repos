var context = nlapiGetContext();
function start() {
    try {
        var journalsList = getjournalsList();
        for (var m = 0; m < journalsList.length; m++) {
            Context(context);
            if (!isNullOrEmpty(journalsList[m])) {
                try {
                    var rec = nlapiLoadRecord('journalentry', journalsList[m]);
                    //nlapiSubmitField('journalentry', journalsList[m], 'custbody_bank_journal_ind', 'T')
                } catch (e) {
                    nlapiLogExecution('error', 'nlapiSubmitField  journal id: ' + journalsList[m], e);
                    var rec = nlapiLoadRecord('advintercompanyjournalentry', journalsList[m]);
                    updateJournals(rec);
                }
                
            }
        
        }
    } catch (e) {
        nlapiLogExecution('error', 'error ', e);
    }
}
function updateJournals(rec) {
    rec.setFieldValue('custbody_bank_journal_ind', 'T')
    nlapiSubmitRecord(rec, null, true);
}

//nr cash flow update journals
function getjournalsList() {

    var loadedSearch = nlapiLoadSearch(null, 'customsearch_cf_update_journals');
    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);
    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
            results.push(s[i].getValue("internalid", null, "GROUP"))           
        }
    }
    //var recKeys = Object.keys(results);
    return results;

}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function Context(context) {

    //nlapiLogExecution('DEBUG', 'context.getRemainingUsage()', context.getRemainingUsage());
    if (context.getRemainingUsage() < 1250) {
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



