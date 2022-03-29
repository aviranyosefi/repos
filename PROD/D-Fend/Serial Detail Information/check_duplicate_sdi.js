function ValidateRec() {
    var typeRec = nlapiGetRecordType();
    nlapiLogExecution('DEBUG', 'typeRec ', typeRec)  
    var RecId = nlapiGetRecordId();
    var block = true;
    var item = nlapiGetFieldValue('custrecord_sd_item');
    var serial = nlapiGetFieldValue('custrecord_sd_serial_number');
    if (!isNullOrEmpty(item) && !isNullOrEmpty(serial)) {
        var sdiList = getSdi(item, serial);
        if (RecId == "" && sdiList.length > 0) { block = false } // type create
        else if (RecId != "") {
            if (sdiList.length > 1) { block = false }
            else if (sdiList.length == 1) {
                if (RecId != sdiList[0].id) { block = false }
            }
        }
    }
    if (block) { return true }
    else {
        alert('Serial Detail Information already exists.\nID: ' + sdiList[0].id + ', Name: ' + sdiList[0].name);
        return false;
    }
    
    return true
}


function getSdi(item, serial ) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_sd_item', null, 'anyof', item)
    filters[1] = new nlobjSearchFilter('custrecord_sd_serial_number', null, 'is', serial)
    filters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F')

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');

    var search = nlapiCreateSearch('customrecord_serial_detail_information', filters, columns);

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
                name: s[i].getValue('name')
            });  
        }
    
    }
    return results;
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}