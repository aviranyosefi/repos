var context = nlapiGetContext();

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

/////////////////////////////

function ARRNewProccess() {
    try {
        var result = getSecondProccessList();
        nlapiLogExecution('debug', 'result ' + result.length, JSON.stringify(result));
        if (result != null) {
            var curr = '';
            for (var m = 0; m < result.length; m++) {
                Context(context);
                if (curr != result[m].internalid) {
                    if (m != 0) {
                        var id = nlapiSubmitRecord(rec);
                        nlapiLogExecution('debug', 'id ', id);
                        var rec = nlapiLoadRecord('revenuearrangement', result[m].internalid);
                        curr = result[m].internalid;
                    }
                    else {
                        var rec = nlapiLoadRecord('revenuearrangement', result[m].internalid);
                        curr = result[m].internalid;
                    }
                }
                try {  
                     rec.setLineItemValue('revenueelement', 'custcol_item_tier', result[m].line ,result[m].tier )                     
                } catch (e) { }
            }
            var id = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', 'id ', id);
        }
    } catch (e) {
    }

}

function getSecondProccessList() {

    var loadedSearch = nlapiLoadSearch(null, 'customsearch_element_tier_update');
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

            results.push({
                internalid: s[i].getValue("internalid", "revenueArrangement", null),
                line: s[i].getValue("line", "revenueArrangement", null), 
                tier: s[i].getValue("custcol_item_tier", "sourceTransaction", null),

            });
        }
    }

    return results;
}

