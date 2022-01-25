var context = nlapiGetContext();
function start() {
    try {
        var FirstBillsList = FirstBillsData();
        for (var m = 0; m < FirstBillsList.length; m++) {
            Context(context);
            try {  //     
                var rec = nlapiLoadRecord('vendorbill', FirstBillsList[m].bill);
                rec.setFieldValue('custbody_cf_first_payment', FirstBillsList[m].payment)
                rec.setFieldValue('custbody_cf_first_payment_date', FirstBillsList[m].date)
                rec.setFieldValue('custbody_cf_first_payment_percent', FirstBillsList[m].perc)
                nlapiSubmitRecord(rec, null, true);
            } catch (e) {
                nlapiLogExecution('error', 'nlapiSubmitField  journal id: ' + FirstBillsList[m].bill, e);
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'error ', e);
    }
}

//NR cash flow update First Bills Data
function FirstBillsData() {

    var loadedSearch = nlapiLoadSearch(null, 'customsearch_cf_update_first_bill');
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
                bill: s[i].getValue("internalid", null, "GROUP"),
                payment: s[i].getValue("internalid", 'applyingTransaction', "MIN"),
                date: s[i].getValue("trandate", 'applyingTransaction', "MIN"),
                perc: s[i].getValue("formulanumeric", null, "MAX"),
            });
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



