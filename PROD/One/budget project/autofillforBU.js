function aftersubmit() {

    var total_actual = 0;
    var total_Encumbrance = 0;
    var total_Release = 0;
    var total_Inventory = 0;
    var availableFunds = 0;
    var Id = nlapiGetRecordId();
    var rec = nlapiLoadRecord(nlapiGetRecordType(), Id);

    //summing the amount of all 'actual' transactions related to the current ABU 
    // search name: ABU Actual Details [Sublist] Line
    total_actual = sumAmount_from_search('customsearch_abu_actual_details_sublist', Id); 
    if (total_actual == null || total_actual == undefined || isNaN(total_actual) == true || total_actual == '') {
        total_actual = 0;
    }
    total_actual = parseFloat(total_actual);
    rec.setFieldValue('custrecord_bu_annual_actual_amount', total_actual, false);
    nlapiLogExecution('debug', ' total_actual: ', total_actual);

    //summing the amount of all 'Encumbrance' transactions related to the current ABU 
    // search name: ABU Actual Details [Sublist] Line
    total_Encumbrance = sumAmount_from_search('customsearch_abu_encumbrance_details_sub', Id);
    if (total_Encumbrance == null || total_Encumbrance == undefined || isNaN(total_Encumbrance) == true || total_Encumbrance == '') {
        total_Encumbrance = 0;
    }
    total_Encumbrance = parseFloat(total_Encumbrance);
    rec.setFieldValue('custrecord_bu_annual_encumbrance_amount', total_Encumbrance);//, false
    nlapiLogExecution('debug', ' total_Encumbrance: ', total_Encumbrance);

    total_Release = sumAmount_from_search('customsearch_abu_encumbrance_release_sub', Id);
    if (total_Release == null || total_Release == undefined || isNaN(total_Release) == true || total_Release == '') {
        total_Release = 0;
    }
    total_Release = parseFloat(total_Release);
    rec.setFieldValue('custrecord_bu_encumbrance_release', total_Release);//, false
    nlapiLogExecution('debug', ' total_Release: ', total_Release);


    total_Inventory = sumAmount_from_search('customsearch_abu_actual_body', Id);
    if (total_Inventory == null || total_Inventory == undefined || isNaN(total_Inventory) == true || total_Inventory == '') {
        total_Inventory = 0;
    }
    total_Inventory = parseFloat(total_Inventory);
    total_actual += total_Inventory;
    rec.setFieldValue('custrecord_bu_annual_actual_amount', total_actual, false);
    nlapiLogExecution('debug', ' total_Inventory: ', total_Inventory);

    var temp = parseFloat(total_Encumbrance + total_actual);
    var tempBudget = parseFloat(rec.getFieldValue('custrecord_annual_budget')).toFixed(2);
    rec.setFieldValue('custrecord_annual_budget', tempBudget);// Round for two numbers after decimal point 

    availableFunds = (tempBudget - temp + (total_Release));
    availableFunds = availableFunds.toFixed(2);
    rec.setFieldValue('custrecord_abu_avaliable_funds', availableFunds);//, false
    nlapiLogExecution('debug', ' availableFunds: ', availableFunds);

    var verification = nlapiSubmitRecord(rec);
    nlapiLogExecution('DEBUG', 'verification ID= ', verification);
}


function sumAmount_from_search(searchId, Id) {
    //var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    //var Id = rec.getFieldValue('id');
    var results = nlapiLoadSearch(null, searchId); 
    //var results = nlapiLoadSearch(null, 'customsearch629');

    if (searchId == 'customsearch_abu_actual_details_sublist') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budgeting_unit', 'is', Id));
    }
    if (searchId == 'customsearch_abu_encumbrance_details_sub') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budgeting_unit', 'is', Id));
    }
    if (searchId == 'customsearch_abu_encumbrance_release_sub') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budgeting_unit', 'is', Id));
    }
    if (searchId == 'customsearch_abu_actual_body') {
        results.addFilter(new nlobjSearchFilter('internalid', 'CUSTBODY_ANNUAL_BUDGETING_UNIT', 'is', Id));
    }
    var scriptType = results.scriptId;
    var runSearch = results.runSearch();
    var s = [];
    var searchid = 0;
    var total_amount = 0;

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    for (var i = 0; i < s.length; i++) {


        if (searchId == 'customsearch_abu_actual_details_sublist' || searchId == 'customsearch_abu_actual_body') {
            total_amount += parseFloat(s[i].getValue('amount'));
        }
      else {
            total_amount += parseFloat(s[i].getValue('formulanumeric'));
        }

    }

    if (total_amount == null || total_amount == undefined) {
        return 0;
    }
    else {
        total_amount = parseFloat(total_amount);
        var fixed = total_amount.toFixed(2);
        return fixed;
    }
}


/*Old
function aftersubmit() {

    var total_actual = 0;
    var total_Encumbrance = 0;
    var total_Release = 0;
    var availableFunds = 0;
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    total_actual = sumAmount_from_search('customsearch_abu_actual_details_sublist');
    if (total_actual == null || total_actual == undefined || isNaN(total_actual) == true || total_actual == '') {
        total_actual = 0;
    }
    total_actual = parseFloat(total_actual);
    rec.setFieldValue('custrecord_bu_annual_actual_amount', total_actual, false);
    nlapiLogExecution('debug', ' total_actual: ', total_actual);

    total_Encumbrance = sumAmount_from_search('customsearch_abu_encumbrance_details_sub');
    if (total_Encumbrance == null || total_Encumbrance == undefined || isNaN(total_Encumbrance) == true || total_Encumbrance == '') {
        total_Encumbrance = 0;
    }
    total_Encumbrance = parseFloat(total_Encumbrance);
    rec.setFieldValue('custrecord_bu_annual_encumbrance_amount', total_Encumbrance);//, false
    nlapiLogExecution('debug', ' total_Encumbrance: ', total_Encumbrance);

    total_Release = sumAmount_from_search('customsearch_abu_encumbrance_release_sub');
    if (total_Release == null || total_Release == undefined || isNaN(total_Release) == true || total_Release == '') {
        total_Release = 0;
    }
    total_Release = parseFloat(total_Release);
    rec.setFieldValue('custrecord_bu_encumbrance_release', total_Release);//, false
    nlapiLogExecution('debug', ' total_Release: ', total_Release);

    var temp = parseFloat(total_Encumbrance + total_actual);
    var tempBudget = parseFloat(rec.getFieldValue('custrecord_annual_budget')).toFixed(2);
    availableFunds = (tempBudget - temp + (total_Release));
    rec.setFieldValue('custrecord_abu_avaliable_funds', availableFunds);//, false
    nlapiLogExecution('debug', ' availableFunds: ', availableFunds);

    var verification = nlapiSubmitRecord(rec);
    nlapiLogExecution('DEBUG', 'verification ID= ', verification);

}


function sumAmount_from_search(searchId) {
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var Id = rec.getFieldValue('id');
    var results = nlapiLoadSearch(null, searchId);
    //var results = nlapiLoadSearch(null, 'customsearch629');

    if (searchId == 'customsearch_abu_actual_details_sublist') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budgeting_unit', 'is', Id));
    }
    if (searchId == 'customsearch_abu_encumbrance_details_sub') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budgeting_unit', 'is', Id));
    }
    if (searchId == 'customsearch_abu_encumbrance_release_sub') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budgeting_unit', 'is', Id));
    }
    var scriptType = results.scriptId;
    var runSearch = results.runSearch();
    var s = [];
    var searchid = 0;
    var total_amount = 0;

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    for (var i = 0; i < s.length; i++) {


        if (searchId == 'customsearch_abu_actual_details_sublist') {
            total_amount += parseFloat(s[i].getValue('amount'));
        }
      else {
            total_amount += parseFloat(s[i].getValue('formulanumeric'));
        }

    }

    if (total_amount == null || total_amount == undefined) {
        return 0;
    }
    else {
        total_amount = parseFloat(total_amount);
        var fixed = total_amount.toFixed(2);
        return fixed;
    }
}



 */