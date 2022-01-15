// JavaScript source code
var Results = [];

function fieldchanged(type, name) {
    nlapiLogExecution('DEBUG', 'name', name);
    if (name == 'custevent3') {
        debugger;
        var suppItem = nlapiGetFieldText('custevent3');
        var Iname = suppItem.substring(0, suppItem.indexOf(':', 0));
        var item = getItemId(Iname);
        if (item != -1) {
            nlapiSetFieldValue('item', item);
        }
        else {
            alert('Please check the Offer Support box in the Item Card');
            nlapiSetFieldValue('item', '');
        }
    }
    else if ((name == 'item' || name == 'serialnumber') && (!isNullOrEmpty(nlapiGetFieldValue('item')) && !isNullOrEmpty(nlapiGetFieldValue('serialnumber')))){
        var res = getSerialDetails(nlapiGetFieldValue('item'), nlapiGetFieldValue('serialnumber'));
        if (res != -1) {
            nlapiSetFieldValue('custevent_software_version', res[0].softVers);
            nlapiSetFieldValue('custevent_warranty_expiration_date', res[0].expDate);
        }
    }

}

function getItemId(name) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('name', null, 'is', name);
    filters[1] = new nlobjSearchFilter('offersupport', null, 'is', 'T');

    var results = nlapiCreateSearch('item', filters, columns);
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

    if (s != null && s.length > 0) {
        return s[0].getValue('internalid');
    }
    else { return -1; }
}

function getSerialDetails(item,serial) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn("custrecord_sd_software_version");
    columns[2] = new nlobjSearchColumn("custrecord_warranty_expiration_date");

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
    filters[1] = new nlobjSearchFilter('custrecord_sd_serial_number', null, 'is', serial);
    filters[2] = new nlobjSearchFilter('custrecord_sd_item', null, 'anyof', item);

    var results = nlapiCreateSearch('customrecord_serial_detail_information', filters, columns);
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

    if (s != null && s.length > 0) {
        Results[0] = {
            softVers: s[0].getValue('custrecord_sd_software_version'),
            expDate: s[0].getValue('custrecord_warranty_expiration_date'),
        }
        return Results;
    }
    else { return -1; }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}