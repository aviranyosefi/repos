//example - GDG2114CU710FG054_001
//example - GDG2114CU710FG054_002 
//example - GDG2114CU710FG054_003

var mode = '';

function pageInit(type) {

    mode = type;
    return;
}


function FieldChanged(type, name) {
   
    if (mode == 'create' && name == 'custrecord_md_bag_number' && !isNullOrEmpty(nlapiGetFieldValue('custrecord_md_bag_number'))) {
        var inv_num_id = nlapiGetFieldValue('custrecord_md_bag_number');
        var bag_num = nlapiGetFieldText('custrecord_md_bag_number');
        nlapiLogExecution('DEBUG', 'bag number:' + bag_num, 'inventory number id:' + inv_num_id);
        var res = Search(bag_num);
        if (!isNullOrEmpty(res)) {
            nlapiSetFieldValue('custrecord_md_batch_number', res[0].batch_number);
            nlapiSetFieldValue('custrecord_quantity', res[0].qtyOh);
        }
        
    }
}

function saverecord() {
    var inv_num_id = nlapiGetFieldValue('custrecord_md_bag_number');
    var carton_num = nlapiGetFieldValue('custrecord_md_carton');
    if (!isNullOrEmpty(inv_num_id) && !isNullOrEmpty(carton_num)) {
        nlapiSubmitField('inventorynumber', inv_num_id, 'custitemnumber_carton_number', carton_num);
    }
    return true;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function Search(inv_num) {
    var filters = new Array();
    var s = [];
    var searchid = 0;
    var columns = new Array();
    var result = [];

    var search = nlapiLoadSearch(null, 'customsearch650');
    search.addFilter(new nlobjSearchFilter('inventorynumber', null, 'is', inv_num));
    
    var runSearch = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s.length > 0) {
        for (var i = 0; i < s.length; i++) {
            result.push({
                qtyOh: s[i].getValue('quantityonhand'),
                batch_number: s[i].getValue('custitemnumber_md_batch_number'),
            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach result ', JSON.stringify(result));
    return result;
}