function validateLine() {
    var invDetail = nlapiViewLineItemSubrecord('inventory', 'inventorydetail', nlapiGetCurrentLineItemIndex('inventory'));

    if (!isNullOrEmpty(invDetail)) {
        var assign = invDetail.getChildMachineRecordManager('inventoryassignment');
        fromfieldIdx = assign.fieldNames.indexOf('inventorystatus');
        for (i = 1; i <= assign.rows.length; i++) {
            if (fromfieldIdx != -1) {// inventorystatus field idx on the assignment
                if (assign.rows[i - 1][fromfieldIdx]) {
                    continue;
                }
            }
            else { // no inventorystatus field on the assignment
                return true;
            }
        }
        return true;
    }
    else {
        return true;
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getStatusName(id) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', id)

    var search = nlapiCreateSearch('inventorystatus', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {

        return returnSearchResults[0].getValue('name')

    }
    else { return ''; }

}

function getItemType(item) {

    var results;

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custitemdefault_location_for_adjustmen');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', item)

    var search = nlapiCreateSearch('item', filters, columns);
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        return SearchResults[0].getValue('custitemdefault_location_for_adjustmen');
    }
    else {
        return -1;
    }
    
} 