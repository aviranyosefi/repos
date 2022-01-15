function aftersubmit() {
    //nlapiLogExecution('DEBUG', 'before load rec', '');
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    //nlapiLogExecution('DEBUG', 'after load rec', 'Id: ' + rec);


    var vend = rec.getFieldValue('entityname');
    var count = rec.getLineItemCount('item');
    //nlapiLogExecution('DEBUG', 'count', '=: ' + count);

    for (i = 1; i <= count; i++) {
        var lotNum = rec.getLineItemValue('item', 'custcol_unv_lot_number', i);
        if (!isNullOrEmpty(lotNum)) {
            var invNum = getInvNumber(lotNum);
            nlapiLogExecution('DEBUG', 'inventorynumber for update', 'Id: ' + invNum);
            if (invNum != -1) {
                nlapiSubmitField('inventorynumber', invNum, ['custitemnumber_vendor_lot', 'custitemnumber_vendor'], [lotNum, vend]);
                nlapiLogExecution('DEBUG', 'inventorynumber was updated', 'inventorynumber Id: ' + invNum);
            }
            else {
                nlapiLogExecution('DEBUG', 'no inventory number record for line', 'line #: ' + i);
            }
        }
        else {
            nlapiLogExecution('DEBUG', 'no unv lot number for line', 'line #: ' + i);
        }
    }


}

function getInvNumber(serial) {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('inventorynumber', null, 'is', serial);
 
    var results = nlapiCreateSearch('inventorynumber', filters, columns);
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


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}