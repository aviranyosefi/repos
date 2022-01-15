
function Save() {
    
    var id = nlapiGetRecordId()
    var customer = nlapiGetFieldValue('custrecord_agreement_customer');
    var start_date = nlapiGetFieldValue('custrecord_agreement_start_date');
    var end_date = nlapiGetFieldValue('custrecord_agreement_end_date');



    if (!CheckValidationDate(start_date, end_date)) {
        alert('תאריך סיום קטן מתאריך ההתחלה');
        return false;
    }
    var res = customer_agreement(customer);

    if (id == '' && res.length > 1) {
        alert('לא ניתן להקים הסכם חדש , ללקוח זה קיים יותר מהסכם אחד');
        return false;
    }
   
    for (var i = 0; i < res.length; i++) {
        if (id != res[i].id) {
            if (!checkDate(res[i].fromDate, res[i].toDate, start_date)) {
                alert('לא ניתן לשמור את ההסכם , תאריכים חופפים להסכם אחר: ' + res[i].name)
                return false;
            }
        }
    }
    return true;
}

function checkDate(dateFrom, dateTo, dateCheck) {
    debugger;
    if (isNullOrEmpty(dateTo)) { dateTo = '1/1/2090'}
    //var d1 = dateFrom.split("/");
    var d2 = dateTo.split("/");
    var c = dateCheck.split("/");

    //var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);  // -1 because months are from 0 to 11
    var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
    var check = new Date(c[2], parseInt(c[1]) - 1, c[0]);
    if (check <= to) {
        return false;
    }
       
    return true;
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

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function CheckValidationDate(from, to) {
    if (isNullOrEmpty(to)) { return true }
    else {

        var d1 = from.split("/");
        var d2 = to.split("/");
        var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);  // -1 because months are from 0 to 11
        var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
        if (to < from) {
            return false;
        }
    }
    return true;
}