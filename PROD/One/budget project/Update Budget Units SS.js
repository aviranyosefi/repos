var context = nlapiGetContext();
function validatenudgetfields() {
    var control_budgeting_unit = context.getSetting('SCRIPT', 'custscript_control_budgeting_unit');
    updatebudgetunits('customrecord_control_budgeting_unit');
    updatebudgetunits('customrecord_annual_budgeting_unit');
}

function updatebudgetunits(recType) {
    try {
        var results = nlapiCreateSearch(recType, null, null);
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
            var rec = nlapiLoadRecord(recType, s[i].getId());
            var verification = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', 'recType : ' + recType, ' verification ID= ' + verification);
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
        nlapiLogExecution('debug', 'recType : ' + recType, 'Error: ' + e);
    }
}