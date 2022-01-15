// JavaScript source code


Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}

updatebudgetunits('customrecord_control_budgeting_unit');
//updatebudgetunits('customrecord_annual_budgeting_unit');

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
            try {

                var budget = nlapiLookupField('customrecord_control_budgeting_unit', s[i].getId(), 'custrecord_buc_budget_amt');
                budget = parseFloat(budget);
                if (budget.countDecimals() > 2) {
                    //debugger;
                    var rec = nlapiLoadRecord(recType, s[i].getId());
                    var verification = nlapiSubmitRecord(rec);
                    console.log('verification ID= ' + verification);
                }
                nlapiGetContext().getRemainingUsage = function () { return 1000; }
            } catch (e) {
                console.log('error: s = ' + i + ' - record:' + verification);
                console.error(e);
                continue;
            }
        }
    } catch (e) {
        console.error(e);
    }
}