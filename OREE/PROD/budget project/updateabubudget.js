function updatebudget(type) {
    var results = nlapiLoadSearch(null, 'customsearch_summary_of_control_unit');// search name summary of control unit amount to annual amount
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
        var ABUid = s[i].getValue('internalid', "CUSTRECORD_BUDGETING_UNIT", "GROUP");
        //var ABURec = nlapiLoadRecord('customrecord_annual_budgeting_unit', ABUid);
        var newBudget = s[i].getValue('custrecord_buc_budget_amt', null, 'sum');
        //ABURec.setFieldValue('custrecord_annual_budget', newBudget);
        nlapiSubmitField('customrecord_annual_budgeting_unit', ABUid, 'custrecord_annual_budget', newBudget, true);
    }
}