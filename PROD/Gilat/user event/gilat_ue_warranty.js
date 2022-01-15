function save_warranty_ap() {
    try
    {
        var rec = nlapiLoadRecord('itemreceipt', nlapiGetRecordId());
        var count = rec.getLineItemCount('item');
        nlapiLogExecution('debug', 'save_warranty_ap' + count, ' internalId:' + nlapiGetRecordId());
        for (var i = 1; i <= count; i++) {
            var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
            var inv = subrecord.id; nlapiLogExecution('debug', 'save_warranty_ap-loop' + i, ' inv:' + inv);
            var war_month = rec.getLineItemValue("item", "custcol_vendor_warrantydisp", i);
            var date = rec.getFieldValue('trandate');
            var invarray = getInventoryDetails(inv);
            var to_date = nlapiDateToString(nlapiAddMonths(nlapiStringToDate(date), war_month));
            nlapiLogExecution('debug', 'save_warranty_ap', ' invarray:' + invarray);
            invarray.forEach(function (inventorynum) {
                nlapiLogExecution('debug', 'save_warranty_ap', ' inventorynum:' + inventorynum);
                nlapiSubmitField('inventorynumber', inventorynum, 'custitemnumber_vendor_warranty_from', date);
                nlapiSubmitField('inventorynumber', inventorynum, 'custitemnumber_warranty_exp_date', to_date);
            });
        }
    }
    catch (e) {
        nlapiLogExecution('error', 'save_warranty_ap', ' error:' + e);
    }
}

function save_warranty_ar() {
    try
    {
        var rec = nlapiLoadRecord('itemfulfillment', nlapiGetRecordId());
        if (rec.getFieldValue('status') != 'Shipped')
            return true;
        var count = rec.getLineItemCount('item');
        for (var i = 1; i <= count; i++) {
            var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
            if (subrecord != null && subrecord != '') {
                var inv = subrecord.id;
                var war_month = rec.getLineItemValue("item", "custcol_customer_warrantydisp", i);
                var date = rec.getFieldValue('trandate');
                //var inventorynum = getInventoryDetails(inv);
                var invarray = getInventoryDetails(inv);
                var to_date = nlapiDateToString(nlapiAddMonths(nlapiStringToDate(date), war_month));
                invarray.forEach(function (inventorynum) {
                    nlapiSubmitField('inventorynumber', inventorynum, 'custitemnumber_customer_warranty_from', date);
                    nlapiSubmitField('inventorynumber', inventorynum, 'custitemnumber_vendor_warranty_to', to_date);
                });
            }
        }
    }
    catch (e) {
        nlapiLogExecution('error', 'save_warranty_ar', ' error:' + e);
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