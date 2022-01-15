function fieldChange(type, mame) {
    if (name == 'entity') {
        var res = customer_agreement(customer);
    }

}

function customer_agreement(customer) {


    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_agreement_start_date');
    columns[1] = new nlobjSearchColumn('custrecord_agreement_end_date');
    columns[2] = new nlobjSearchColumn('name');



    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_agreement_customer', null, 'is', customer)
    filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F')



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
                fromDate: s[i].getValue('custrecord_agreement_start_date'),
                toDate: s[i].getValue('custrecord_agreement_end_date'),

            });

        }
        return results;
    }

}