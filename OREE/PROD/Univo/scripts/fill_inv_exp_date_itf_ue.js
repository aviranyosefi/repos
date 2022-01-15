function aftersubmit() {
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());

    var count = rec.getLineItemCount('item');
    for (i = 1; i <= count; i++) {
        var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
        //subrecord = rec.getLineItemValue('item', 'inventorydetail', i); 
        if (subrecord != "" && subrecord != null) {
            var invDetailID = subrecord.id;
            nlapiLogExecution('DEBUG', 'invDetailID: ', subrecord.id);
            if (invDetailID != "" && invDetailID != null) {
                res = getInventoryDetails(invDetailID);
                if (!isNullOrEmpty(res)) {
                    rec.setLineItemValue('item', 'custcol_inventory_exp_date', i, res[0].expDates);
                    nlapiLogExecution('DEBUG', 'res[0].expDates: ', res[0].expDates);
                    rec.setLineItemValue('item', 'custcol_serials', i, res[0].serials);
                    nlapiLogExecution('DEBUG', 'res[0].serials: ', res[0].serials);
                }
            }
        }
    }
    var submition = nlapiSubmitRecord(rec, null, true);
    nlapiLogExecution('DEBUG', 'submition: ', submition);
}

function getInventoryDetails(invDetailID) {
    filters = [];
    columns = [];
    var results = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('internalid','inventorynumber').setSort());
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('expirationdate'));
    columns.push(new nlobjSearchColumn('quantity'));

    var search = nlapiCreateSearch('inventorydetail', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        //var cols = resultslice.getColumns();
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {
        var seriaels = '';
        var expDates = '';
        for (var i = 0; i < returnSearchResults.length; i++) {
            seriaels += returnSearchResults[i].getValue('inventorynumber', 'inventorynumber') + '(' + returnSearchResults[i].getValue('quantity')+')'+ '\n';
            expDates += returnSearchResults[i].getValue('expirationdate') + '\n';
        }
        results.push({
            serials: seriaels,
            expDates: expDates
        })
    }
    return results;
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}