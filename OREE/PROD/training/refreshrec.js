function validatenudgetfields() {

    updatebudgetunits('customrecord_control_budgeting_unit');
    updatebudgetunits('customrecord_annual_budgeting_unit');
}

function updatebudgetunits(recType) {
    try {
        var results = nlapiCreateSearch(recType, null, null);
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
            var rec = nlapiLoadRecord(recType, s[i].getId());
            var verification = nlapiSubmitRecord(rec);
            nlapiLogExecution('DEBUG', 'verification ID= ', verification);
            nlapiGetContext().getRemainingUsage = function () { return 1000; }
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error: ', e);
    }
}

