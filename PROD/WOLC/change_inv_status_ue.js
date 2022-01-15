function after(type) {
    try { 
        var typeRec = nlapiGetRecordType()
        var rec = nlapiLoadRecord(typeRec, nlapiGetRecordId(), { recordmode: 'dynamic' })
        if (typeRec == 'itemreceipt') {
            var inv_count = rec.getLineItemCount('item');
            for (j = 1; j <= inv_count; j++) {
                var item = rec.getLineItemValue('item', 'item', j);
                var itemStatus = nlapiLookupField('item', item, 'custitem_default_status_for_purchase')
                if (!isNullOrEmpty(itemStatus)) {
                    rec.selectLineItem('item', j);
                    invDetail = rec.editCurrentLineItemSubrecord('item', 'inventorydetail');
                    var assign_count = invDetail.getLineItemCount('inventoryassignment')
                    nlapiLogExecution('DEBUG', 'inventory count: ' + assign_count);
                    for (var i = 1; i <= assign_count; i++) {
                        invDetail.selectLineItem('inventoryassignment', i);
                        invDetail.setCurrentLineItemValue('inventoryassignment', 'inventorystatus', itemStatus);
                        invDetail.commitLineItem('inventoryassignment')
                    }
                    invDetail.commit();
                    rec.commitLineItem('item');
                }
            }     
        }
        else if (typeRec == 'assemblybuild') {
            var item = rec.getFieldValue('item');
            var itemStatus = nlapiLookupField('item', item, 'custitem_default_status_for_manufactur')
            if (!isNullOrEmpty(itemStatus)) {
                var invDetail = rec.editSubrecord('inventorydetail');
                nlapiLogExecution('DEBUG', 'invDetail : ', invDetail);
                var assign_count = invDetail.getLineItemCount('inventoryassignment')
                nlapiLogExecution('DEBUG', 'inventory count: ' + assign_count);
                for (var i = 1; i <= assign_count; i++) {
                    invDetail.selectLineItem('inventoryassignment', i);
                    invDetail.setCurrentLineItemValue('inventoryassignment', 'inventorystatus', itemStatus);
                    invDetail.commitLineItem('inventoryassignment')
                }
                invDetail.commit();
            }     
        }
        nlapiSubmitRecord(rec)  
    } catch (e) {

    }

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}