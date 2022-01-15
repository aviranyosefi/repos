function aftersubmit() {

    var total_actual = 0;
    var total_Encumbrance = 0;
    var total_Release = 0;
    var total_Inventory = 0;
    var availableFunds = 0;
    var Id = nlapiGetRecordId();
    var rec = nlapiLoadRecord(nlapiGetRecordType(), Id);
    total_actual = sumAmount_from_search('customsearch_cbu_actual_details_sublist',Id);
    if (total_actual == null || total_actual == undefined || isNaN(total_actual) == true || total_actual == '') {
        total_actual = 0;
    }
    total_actual = parseFloat(total_actual);
    rec.setFieldValue('custrecord_buc_total_actual', total_actual, false);
    nlapiLogExecution('debug', ' total_actual: ', total_actual);


    total_Encumbrance = sumAmount_from_search('customsearch_cbu_encumbrance_details_sub', Id);
    if (total_Encumbrance == null || total_Encumbrance == undefined || isNaN(total_Encumbrance) == true || total_Encumbrance == '') {
        total_Encumbrance = 0;
    }
    total_Encumbrance = parseFloat(total_Encumbrance);
    rec.setFieldValue('custrecord_buc_total_encumbrance', total_Encumbrance);//, false
    nlapiLogExecution('debug', ' total_Encumbrance: ', total_Encumbrance);

    total_Release = sumAmount_from_search('customsearch_cbu_encumbrance_release_sub', Id);
    if (total_Release == null || total_Release == undefined || isNaN(total_Release) == true || total_Release == '') {
        total_Release = 0;
    }
    total_Release = parseFloat(total_Release);
    rec.setFieldValue('custrecord_bcu_encumbrance_release', total_Release);//, false
    nlapiLogExecution('debug', ' total_Release: ', total_Release);

    total_Inventory = sumAmount_from_search('customsearch_cbu_actual_body', Id);
    if (total_Inventory == null || total_Inventory == undefined || isNaN(total_Inventory) == true || total_Inventory == '') {
        total_Inventory = 0;
    }
    total_Inventory = parseFloat(total_Inventory);
    total_actual += total_Inventory;
    rec.setFieldValue('custrecord_buc_total_actual', total_actual, false);
    nlapiLogExecution('debug', ' total_Inventory: ', total_Inventory);

    var temp = parseFloat(total_Encumbrance + total_actual);
    var tempBudget = parseFloat(rec.getFieldValue('custrecord_buc_budget_amt')).toFixed(2);
    rec.setFieldValue('custrecord_buc_budget_amt', tempBudget);// Round for two numbers after decimal point 

    availableFunds = (tempBudget - temp + (total_Release));
    availableFunds = availableFunds.toFixed(2);
    rec.setFieldValue('custrecord_cbu_available_funds', availableFunds);//, false
    nlapiLogExecution('debug', ' availableFunds: ', availableFunds);

    var verification = nlapiSubmitRecord(rec);
    nlapiLogExecution('DEBUG', 'verification ID= ', verification);

}


function sumAmount_from_search(searchId, Id) {
    //var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    //var Id = rec.getFieldValue('id');
    var results = nlapiLoadSearch(null, searchId);
    //var results = nlapiLoadSearch(null, 'customsearch629');

    if (searchId == 'customsearch_cbu_actual_details_sublist') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
    }
    if (searchId == 'customsearch_cbu_encumbrance_details_sub') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
    }
    if (searchId == 'customsearch_cbu_encumbrance_release_sub') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
    }
    if (searchId == 'customsearch_cbu_actual_body') {
        results.addFilter(new nlobjSearchFilter('internalid', 'CUSTBODY_CONTROL_BUDGETING_UNIT', 'is', Id));
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


        if (searchId == 'customsearch_cbu_actual_details_sublist' || searchId == 'customsearch_cbu_actual_body') {
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
    var Id = nlapiGetRecordId();
    var rec = nlapiLoadRecord(nlapiGetRecordType(), Id);
    total_actual = sumAmount_from_search('customsearch_cbu_actual_details_sublist',Id);
    if (total_actual == null || total_actual == undefined || isNaN(total_actual) == true || total_actual == '') {
        total_actual = 0;
    }
    total_actual = parseFloat(total_actual);
    rec.setFieldValue('custrecord_buc_total_actual', total_actual, false);
    nlapiLogExecution('debug', ' total_actual: ', total_actual);


    total_Encumbrance = sumAmount_from_search('customsearch_cbu_encumbrance_details_sub', Id);
    if (total_Encumbrance == null || total_Encumbrance == undefined || isNaN(total_Encumbrance) == true || total_Encumbrance == '') {
        total_Encumbrance = 0;
    }
    total_Encumbrance = parseFloat(total_Encumbrance);
    rec.setFieldValue('custrecord_buc_total_encumbrance', total_Encumbrance);//, false
    nlapiLogExecution('debug', ' total_Encumbrance: ', total_Encumbrance);

    total_Release = sumAmount_from_search('customsearch_cbu_encumbrance_release_sub', Id);
    if (total_Release == null || total_Release == undefined || isNaN(total_Release) == true || total_Release == '') {
        total_Release = 0;
    }
    total_Release = parseFloat(total_Release);
    rec.setFieldValue('custrecord_bcu_encumbrance_release', total_Release);//, false
    nlapiLogExecution('debug', ' total_Release: ', total_Release);
    var temp = parseFloat(total_Encumbrance + total_actual);
    var tempBudget = parseFloat(rec.getFieldValue('custrecord_buc_budget_amt')).toFixed(2);


    availableFunds = (tempBudget - temp + (total_Release));
    rec.setFieldValue('custrecord_cbu_available_funds', availableFunds);//, false
    nlapiLogExecution('debug', ' availableFunds: ', availableFunds);

    var verification = nlapiSubmitRecord(rec);
    nlapiLogExecution('DEBUG', 'verification ID= ', verification);

}


function sumAmount_from_search(searchId, Id) {
    //var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    //var Id = rec.getFieldValue('id');
    var results = nlapiLoadSearch(null, searchId);
    //var results = nlapiLoadSearch(null, 'customsearch629');

    if (searchId == 'customsearch_cbu_actual_details_sublist') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
    }
    if (searchId == 'customsearch_cbu_encumbrance_details_sub') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
    }
    if (searchId == 'customsearch_cbu_encumbrance_release_sub') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
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


        if (searchId == 'customsearch_cbu_actual_details_sublist') {
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
    var Id = nlapiGetRecordId();
    var rec = nlapiLoadRecord(nlapiGetRecordType(), Id);
    total_actual = sumAmount_from_search('customsearch_cbu_actual_details_sublist',Id);
    if (total_actual == null || total_actual == undefined || isNaN(total_actual) == true || total_actual == '') {
        total_actual = 0;
    }
    total_actual = parseFloat(total_actual);
    rec.setFieldValue('custrecord_buc_total_actual', total_actual, false);
    nlapiLogExecution('debug', ' total_actual: ', total_actual);


    total_Encumbrance = sumAmount_from_search('customsearch_cbu_encumbrance_details_sub', Id);
    if (total_Encumbrance == null || total_Encumbrance == undefined || isNaN(total_Encumbrance) == true || total_Encumbrance == '') {
        total_Encumbrance = 0;
    }
    rec.setFieldValue('custrecord_buc_total_encumbrance', total_Encumbrance);//, false
    nlapiLogExecution('debug', ' total_Encumbrance: ', total_Encumbrance);
    var verification = nlapiSubmitRecord(rec);
    nlapiLogExecution('DEBUG', 'verification ID= ', verification);

}


function sumAmount_from_search(searchId, Id) {
    //var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    //var Id = rec.getFieldValue('id');
    var results = nlapiLoadSearch(null, searchId);
    //var results = nlapiLoadSearch(null, 'customsearch629');

    if (searchId == 'customsearch_cbu_actual_details_sublist') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
    }
    if (searchId == 'customsearch_cbu_encumbrance_details_sub') {
        results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
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


        if (searchId == 'customsearch_cbu_actual_details_sublist') {
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


/*

//debugger;
var total_actual = 0;
var total_Encumbrance = 0;
var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
total_actual = sumAmount_from_search('customsearch_cbu_actual_details_sublist');
if (total_actual == null || total_actual == undefined || isNaN(total_actual) == true || total_actual == '') {
    total_actual = 0;
}
total_actual = parseFloat(total_actual);
rec.setFieldValue('custrecord_buc_total_actual', total_actual, false);
nlapiLogExecution('debug', ' total_actual: ', total_actual);


total_Encumbrance = sumAmount_from_search('customsearch_cbu_encumbrance_details_sub');
if (total_Encumbrance == null || total_Encumbrance == undefined || isNaN(total_Encumbrance) == true || total_Encumbrance == '') {
    total_Encumbrance = 0;
}
rec.setFieldValue('custrecord_buc_total_encumbrance', total_Encumbrance);//, false
nlapiLogExecution('debug', ' total_Encumbrance: ', total_Encumbrance);
debugger;
var verification = nlapiSubmitRecord(rec);
nlapiLogExecution('DEBUG', 'verification ID= ', verification);




function sumAmount_from_search(searchId) {
    debugger;
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var Id = rec.getFieldValue('id');
    var results = nlapiLoadSearch(null, searchId);
    //var results = nlapiLoadSearch(null, 'customsearch629');

    //if (searchId == 'customsearch_cbu_actual_details_sublist') {
    //    results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
    //}
    // if (searchId == 'customsearch_cbu_encumbrance_details_sub') {
    //    results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
    //}
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


        if (searchId == 'customsearch_cbu_actual_details_sublist') {
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






////// budget unit 

/*
 *
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var Id = rec.getFieldValue('id');
    var results = nlapiLoadSearch(null, 'customsearch687');
  results.addFilter(new nlobjSearchFilter('internalidnumber', 'custcol_budgeting_unit', 'is', Id));
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
 */


/// script on transactions level


/*function aftersubmit() {
    var record = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var count = 0;
    var type = nlapiGetRecordType();
    switch (type) {
        case 'purchaseorder':

            count = rec.getLineItemCount('item');
            cbuId = record.getLineItemValue('item', 'custcol_budget_control_unit', 1);
            break;

    }
    cbuId = record.getLineItemValue('item', 'custcol_budget_control_unit', 1);
    if (cbuId != '' && cbuId != null && count > 0) {
        var total_actual = 0;
        var total_Encumbrance = 0;
        var rec = nlapiLoadRecord('customrecord_budget_control_unit', cbuId);
        for (i = 0; i < count; i++) {
            total_actual = sumAmount_from_search('customsearch629', cbuId);
            if (total_actual == null || total_actual == undefined || isNaN(total_actual) == true || total_actual == '') {
                total_actual = 0;
            }
            total_actual = parseFloat(total_actual);
            rec.setFieldValue('custrecord_buc_total_actual', total_actual, false);
            nlapiLogExecution('debug', ' total_actual: ', total_actual);

            total_Encumbrance = sumAmount_from_search('customsearch685', cbuId);
            if (total_Encumbrance == null || total_Encumbrance == undefined || isNaN(total_Encumbrance) == true || total_Encumbrance == '') {
                total_Encumbrance = 0;
            }
            rec.setFieldValue('custrecord_buc_total_encumbrance', total_Encumbrance);//, false
            nlapiLogExecution('debug', ' total_Encumbrance: ', total_Encumbrance);
            var verification = nlapiSubmitRecord(rec);
            nlapiLogExecution('DEBUG', 'verification ID= ', verification);
        }
    }
}


function sumAmount_from_search(searchId, Id) {
*//*    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var Id = rec.getFieldValue('id');*//*

var results = nlapiLoadSearch(null, searchId);


if (searchId == 'customsearch629') {
    results.addFilter(new nlobjSearchFilter('idtext', 'custcol_budget_control_unit', 'is', Id));
}
if (searchId == 'customsearch685') {
    results.addFilter(new nlobjSearchFilter('custcol_budget_control_unit', null, 'is', Id));
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


    if (searchId == 'customsearch629') {
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





 */


/*

//debugger;
var total_actual = 0;
var total_Encumbrance = 0;
var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
total_actual = sumAmount_from_search('customsearch_cbu_actual_details_sublist');
if (total_actual == null || total_actual == undefined || isNaN(total_actual) == true || total_actual == '') {
    total_actual = 0;
}
total_actual = parseFloat(total_actual);
rec.setFieldValue('custrecord_buc_total_actual', total_actual, false);
nlapiLogExecution('debug', ' total_actual: ', total_actual);


total_Encumbrance = sumAmount_from_search('customsearch_cbu_encumbrance_details_sub');
if (total_Encumbrance == null || total_Encumbrance == undefined || isNaN(total_Encumbrance) == true || total_Encumbrance == '') {
    total_Encumbrance = 0;
}
rec.setFieldValue('custrecord_buc_total_encumbrance', total_Encumbrance);//, false
nlapiLogExecution('debug', ' total_Encumbrance: ', total_Encumbrance);
debugger;
var verification = nlapiSubmitRecord(rec);
nlapiLogExecution('DEBUG', 'verification ID= ', verification);




function sumAmount_from_search(searchId) {
    debugger;
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var Id = rec.getFieldValue('id');
    var results = nlapiLoadSearch(null, searchId);
    //var results = nlapiLoadSearch(null, 'customsearch629');

    //if (searchId == 'customsearch_cbu_actual_details_sublist') {
    //    results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
    //}
    // if (searchId == 'customsearch_cbu_encumbrance_details_sub') {
    //    results.addFilter(new nlobjSearchFilter('internalid', 'custcol_budget_control_unit', 'is', Id));
    //}
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


        if (searchId == 'customsearch_cbu_actual_details_sublist') {
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






////// budget unit 

/*
 * 
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var Id = rec.getFieldValue('id');
    var results = nlapiLoadSearch(null, 'customsearch687');
  results.addFilter(new nlobjSearchFilter('internalidnumber', 'custcol_budgeting_unit', 'is', Id));
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
 */


/// script on transactions level


/*function aftersubmit() {
    var record = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var count = 0;
    var type = nlapiGetRecordType();
    switch (type) {
        case 'purchaseorder':

            count = rec.getLineItemCount('item');
            cbuId = record.getLineItemValue('item', 'custcol_budget_control_unit', 1);
            break;

    }
    cbuId = record.getLineItemValue('item', 'custcol_budget_control_unit', 1);
    if (cbuId != '' && cbuId != null && count > 0) {
        var total_actual = 0;
        var total_Encumbrance = 0;
        var rec = nlapiLoadRecord('customrecord_budget_control_unit', cbuId);
        for (i = 0; i < count; i++) {
            total_actual = sumAmount_from_search('customsearch629', cbuId);
            if (total_actual == null || total_actual == undefined || isNaN(total_actual) == true || total_actual == '') {
                total_actual = 0;
            }
            total_actual = parseFloat(total_actual);
            rec.setFieldValue('custrecord_buc_total_actual', total_actual, false);
            nlapiLogExecution('debug', ' total_actual: ', total_actual);

            total_Encumbrance = sumAmount_from_search('customsearch685', cbuId);
            if (total_Encumbrance == null || total_Encumbrance == undefined || isNaN(total_Encumbrance) == true || total_Encumbrance == '') {
                total_Encumbrance = 0;
            }
            rec.setFieldValue('custrecord_buc_total_encumbrance', total_Encumbrance);//, false
            nlapiLogExecution('debug', ' total_Encumbrance: ', total_Encumbrance);
            var verification = nlapiSubmitRecord(rec);
            nlapiLogExecution('DEBUG', 'verification ID= ', verification);
        }
    }
}


function sumAmount_from_search(searchId, Id) {
*//*    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var Id = rec.getFieldValue('id');*//*

    var results = nlapiLoadSearch(null, searchId);
    

    if (searchId == 'customsearch629') {
        results.addFilter(new nlobjSearchFilter('idtext', 'custcol_budget_control_unit', 'is', Id));
    }
    if (searchId == 'customsearch685') {
        results.addFilter(new nlobjSearchFilter('custcol_budget_control_unit', null, 'is', Id));
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


        if (searchId == 'customsearch629') {
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

