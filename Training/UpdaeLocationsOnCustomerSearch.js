// JavaScript source code
var loadedSearch = nlapiLoadSearch(null, 'customsearch586');
var runSearch = loadedSearch.runSearch();
var results = runSearch.getResults(0, 50);
var rec, isUpdate;

for (var i = 0; i < results.length && results != null; i++) {
    isUpdate = false;
    rec = nlapiLoadRecord(results[i].type, results[i].id);
    if (rec != null && rec != "") {
        var itemCount = rec.getLineItemCount('item');
        var location_value = rec.getFieldValue('location');
        if (location_value != "" && itemCount > 0) {
            for (var j = 1; j <= itemCount; j++) {
                item_location = rec.getLineItemValue('item', 'location', j);
                if (item_location == "" || item_location == null) {
                    rec.setLineItemValue('item', 'location', j, location_value);
                    isUpdate = true;
                }
            }
            if (isUpdate) nlapiSubmitRecord(rec);
        }
    }
}