var current_ref = nlapiGetFieldValue('custbody_vendor_eference_num');

function SaveRecord() {

    var referance = nlapiGetFieldValue('custbody_vendor_eference_num');
    var vendor = nlapiGetFieldValue('entity');
    if (referance != '' && referance != current_ref) {
        var res = searchValue(referance, vendor);
        if (res.length > 0) {
            alert('The value in the field VENDOR REFERENCE # is already exists');
            return false;
        }
        else return true;
    }
    else return true;

}



function searchValue(ref, vendor) {


    var results = [];



    var columns = new Array();
    columns[0] = new nlobjSearchColumn('entity');
    columns[1] = new nlobjSearchColumn('custbody_vendor_eference_num');



    var filters = new Array();
    filters[0] = new nlobjSearchFilter('entity', null, 'is', vendor)
    filters[1] = new nlobjSearchFilter('custbody_vendor_eference_num', null, 'is', ref)
    filters[2] = new nlobjSearchFilter('mainline', null, 'is', 'T')


    var search = nlapiCreateSearch('itemreceipt', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {

        for (var i = 0; i < returnSearchResults.length; i++) {

            results.push({

                entity: returnSearchResults[i].getValue('entity'),
                name: returnSearchResults[i].getValue('custbody_vendor_eference_num')
            });

        }
        return results;
    }


}