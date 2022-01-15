var check_box = nlapiGetFieldValue('custrecord_preferred_mpn')
var check = false;

function validation() {
 
    if (check) {
        var id = nlapiGetRecordId();
        var item = nlapiGetFieldValue('custrecord_item');
        var res = preferred(item);
      
        if (res.length == 0) {
            var mpn = nlapiGetFieldValue('custrecord12')
            var manufacturer = nlapiGetFieldText('custrecord_manufacturer_name');         
            var type = itemSearch(item);
            nlapiSubmitField(type, item, 'mpn', mpn)
            nlapiSubmitField(type, item, 'manufacturer', manufacturer)
  
            return true;
        }
        else {

            if (res.length != 1) {
                alert('Manufacturer Prefered for this item already exists')
                return false;
            }
            else if (res[0] == id) {

                return true;
            }
            else {
                alert('Manufacturer Prefered for this item already exists')
                return false;
            }
        }
    }
    else return true;
}


function fieldchange(type, name){
    var curr_check_box = nlapiGetFieldValue('custrecord_preferred_mpn')
    if (name == 'custrecord_preferred_mpn') {
        
        if (check_box == 'F' && curr_check_box == 'T') {
            check = true;
        }
        else {
            check = false;
        }
    }

}



function preferred(item) {

    var results = [];

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_item', null, 'anyof', item)
    filters[1] = new nlobjSearchFilter('custrecord_preferred_mpn', null, 'is', 'T')

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_preferred_mpn');
    columns[1] = new nlobjSearchColumn('name');

    var search = nlapiCreateSearch('customrecord_manufacturer_parts', filters, null);

    var resultset = search.runSearch();
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            results.push(resultslice[rs].id);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    return results;
 

}


function itemSearch(item) {

    

    var columns = new Array();


    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', item)


    var search = nlapiCreateSearch('item', filters, null);
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
      
        return returnSearchResults[0].type;
    }
}


