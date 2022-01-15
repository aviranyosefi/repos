function fill() {
    try {

        var serial, serials, subrecord, isUpdate = false;
        var rec = nlapiLoadRecord('itemfulfillment', nlapiGetRecordId());
        var itemCount = rec.getLineItemCount('item');



        var gruop = [];
        if (itemCount > 0) {
            for (var i = 1; i <= itemCount; i++) {                                         
                    subrecord = "";
                    subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
                   
                    if (subrecord != "" && subrecord != null) {
                        var invDetailID = subrecord.id;
                        if (invDetailID != "" && invDetailID != null) {
                            nlapiLogExecution('debug', 'invDetailID()', invDetailID)
                            serials = "";
                            serials = getInventoryDetails(invDetailID);
                            nlapiLogExecution('debug', 'serials()', serials)

                            if (serials != "" && serials != null) {
                                rec.setLineItemValue('item', 'custcol_invserials', i, serials);
                                isUpdate = true;
                            }
                        }
                    }
                
            }

            if (isUpdate) nlapiSubmitRecord(rec);

        }

    } catch (err) {
        nlapiLogExecution('error', 'fillFields()', err)
    }
}


function getInventoryDetails(invDetailID) {
    var serials = "";
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('quantity'));
    count = 0;
    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    if (results != null) {
        results.forEach(function (line) {
            var inventname = line.getValue('inventorynumber', 'inventorynumber');
            var quantity = line.getValue('quantity');
            //           if (serials.length > 990)
            //               return serials;
            if (quantity != null && quantity > 1)
                serials += inventname + " " + quantity + "<br>";
            else
                serials += inventname + " ";
            count++;
        });
    }

    return serials;
}


