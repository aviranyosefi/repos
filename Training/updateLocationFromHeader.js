// JavaScript source code
function updateLocationFromHeader() {
    var item_location;
    //var rec = nlapiLoadRecord(nlapiGetRecordType(),nlapiGetRecordId()); 
    var rec = nlapiLoadRecord("salesorder", "71922");
    var itemCount = rec.getLineItemCount('item');
    var location_value = rec.getFieldValue('location');
    if (location_value != "" && itemCount > 0) {
        for (var i = 1; i <= itemCount; i++) {
            item_location = rec.getLineItemValue('item', 'location', i);
            if (item_location == "" || item_location == null) {
                rec.setLineItemValue('item', 'location', i, location_value);
            }
        }
        nlapiSubmitRecord(rec);
    }
}
