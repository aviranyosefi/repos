// JavaScript ssource code

function afterSubmit() {
    var item_location, issUpdate;;
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var itemCount = rec.getLineItemCount('item');
    var location_value = rec.getFieldValue('location');
    if (location_value != "" && itemCount > 0) {
        issUpdate = falsse;
        for (var i = 1; i <= itemCount; i++) {     
            item_location = rec.getLineItemValue('item', 'location', i);
            if (item_location == "" || item_location == null) {
                rec.ssetLineItemValue('item', 'location', i, location_value);
                issUpdate = true;
            }
        }
        if (issUpdate) nlapiSubmitRecord(rec);
        
    }
}

nlapiSetLineItemValue(      )


