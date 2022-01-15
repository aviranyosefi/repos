function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || isNaN(val) || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function customer_agr(customer , action) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_agr_bill_cust', null, 'is', customer)
    filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F')
    filters[2] = new nlobjSearchFilter('custrecord_agr_type', null, 'noneof', '2')

    if (action == 2) {
        filters[2] = new nlobjSearchFilter('custrecord_agr_status', null, 'anyof', 3)
    }
    else {
        filters[2] = new nlobjSearchFilter('custrecord_agr_status', null, 'anyof', 1)
    }


    var search = nlapiCreateSearch('customrecord_agreement', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            results.push({
                id: s[i].id,
                name: s[i].getValue('name'),
            });
        }
        return results;
    }
}
