function save_warranty_ap() {
    try
    {
        var rec = nlapiLoadRecord('itemreceipt', nlapiGetRecordId());
        var count = rec.getLineItemCount('item');
        nlapiLogExecution('debug', 'save_warranty_ap' + count, ' internalId:' + nlapiGetRecordId());
        for (var i = 1; i <= count; i++) {
            var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
            var inv = subrecord.id; nlapiLogExecution('debug', 'save_warranty_ap-loop' + i, ' inv:' + inv);
            var war_month = rec.getLineItemValue("item", "custcol_vendor_warranty_months", i);
            var date = rec.getFieldValue('trandate');
            var invarray = getInventoryDetails(inv);
            var to_date = nlapiDateToString(nlapiAddMonths(nlapiStringToDate(date), war_month));
            nlapiLogExecution('debug', 'save_warranty_ap', ' invarray:' + invarray);
            invarray.forEach(function (inventorynum) {
                nlapiLogExecution('debug', 'save_warranty_ap', ' inventorynum:' + inventorynum);               
                var fields = [];
                fields.push('custitemnumber_vendor_warranty_start_date')
                fields.push('custitemnumber_vendor_warranty_end_date')
                var values = [];
                values.push(date)
                values.push(to_date)
                nlapiSubmitField('inventorynumber', inventorynum, fields, values);

            });
        }
    }
    catch (e) {
        nlapiLogExecution('error', 'save_warranty_ap', ' error:' + e);
    }
}

function getInventoryDetails(invDetailID) {
    nlapiLogExecution('debug', 'getInventoryDetails' , ' invDetailID:' + invDetailID);
    var serials = "";
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('internalid', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('quantity'));
    columns.push(new nlobjSearchColumn('binnumber'));
    count = 0;
    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    var res = [];
    if (results != null) {
        results.forEach(function (line) {
            var invent = line.getValue('internalid', 'inventorynumber');
            res.push(invent);
        });
    }
    return res;
}