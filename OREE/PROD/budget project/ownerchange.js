function ownerchange(type) {
    var results = nlapiLoadSearch(null, 'customsearch_owner_inconsistency_abu_cbu'); //search name Identify Owners Inconsistency ABU VS CBU [AY]
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
        var cbu = nlapiLoadRecord('customrecord_control_budgeting_unit', s[i].getValue('internalid'));
        cbu.setFieldValue('custrecord_cbu_owner', s[i].getValue('custrecord_abu_owner', 'CUSTRECORD_BUDGETING_UNIT'));
        var rec = nlapiSubmitRecord(cbu);
        nlapiLogExecution('debug', ' submited record: ', rec);
    }
}

/*
 * // old search 
    var results = nlapiLoadSearch(null, 'customsearch_abu_identify_owners_level'); //search name NR identify owners level
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
        var cbu = nlapiLoadRecord('customrecord_control_budgeting_unit', s[i].getValue('internalid'));
        cbu.setFieldValue('owner', s[i].getValue('owner', 'CUSTRECORD_BUDGETING_UNIT'));
        var rec = nlapiSubmitRecord(cbu);
        nlapiLogExecution('debug', ' submited record: ', rec);
    }
 */


customsearch_owner_inconsistency_abu_cbu