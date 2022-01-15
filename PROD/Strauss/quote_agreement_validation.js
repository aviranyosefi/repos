function validateFieldChange(type, name) {
    if (name == 'custbody_agreement_start_date') {
        var customer = nlapiGetFieldValue('entity');
        var toDate = customer_agreement(customer);
        var agreement_start_date = nlapiGetFieldValue('custbody_agreement_start_date');
        if (!isNullOrEmpty(toDate) && !isNullOrEmpty(agreement_start_date)) {
            if (nlapiStringToDate(agreement_start_date) <= nlapiStringToDate(toDate)) {
                alert('קיים הסכם פעיל ללקוח זה עם תאריך סיום ' + toDate + '\n אנא בחר תאריך גדול מתאריך זה ');
                nlapiSetFieldValue('custbody_agreement_start_date', '', true)
                return false;
            }
        }      
    }
    return true;
}
function customer_agreement(customer) {
    var columns = new Array();
    //columns[0] = new nlobjSearchColumn('custrecord_agreement_start_date');
    columns[0] = new nlobjSearchColumn('custrecord_agreement_end_date');
    //columns[2] = new nlobjSearchColumn('name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_agreement_customer', null, 'is', customer)
    filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F')
    filters[2] = new nlobjSearchFilter('custrecord_agreement_status', null, 'is', 1);
    
    var search = nlapiCreateSearch('customrecord_agreement', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var toDate = '';

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {         
            toDate = s[0].getValue('custrecord_agreement_end_date');      
    }
        return toDate;   
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}