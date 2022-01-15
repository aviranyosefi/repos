function pageLoad() {

    var id = nlapiGetRecordId();
    var type = nlapiGetRecordType();
    if (id == "" && type =="inventoryitem") {
        var locations = getRMALocations();
        var count = nlapiGetLineItemCount('locations');
        for (var i = 1; i <= count; i++) {
            var locationID = nlapiGetLineItemValue('locations', 'location', i)
            if (locations[locationID] != undefined) {
                nlapiSetLineItemValue('locations', 'defaultreturncost', i, '0.00')
            }
        }
    }  
}

function getRMALocations() {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_location_classification', null, 'anyof', 3)

    var search = nlapiCreateSearch('location', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            results[s[i].id] = {
                id: s[i].id
            }
        }
        return results;
    }
}