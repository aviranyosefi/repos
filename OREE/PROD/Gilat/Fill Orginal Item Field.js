//Checkpoint 5400 Next Generation Threat Prevention & SandBlast (NGTX) Appliance

var Results = [];
var changedFlag = false;
loadItems();

var results = nlapiLoadSearch(null, 'customsearch623');
var runSearch = results.runSearch();
var s = [];
var searchid = 0;

do {
    var resultslice = runSearch.getResults(searchid, searchid + 1000);
    for (var rs in resultslice) {
        s.push(resultslice[rs]);
        searchid++;
    }
} while (resultslice != null && resultslice.length >= 1000);


for (i = 0; i < s.length; i++) {
    changedFlag = false;
    try {
        var recId = s[i].id;
        var recType = s[i].type;
        var line = s[i].getValue('line');
        var itemDescription = s[i].getValue('memo');
        
        var rec = nlapiLoadRecord(recType, recId);
        var itemCount = rec.getLineItemCount('item');

        for (z = 1; z <= itemCount; z++) {
            if (rec.getLineItemValue('item', 'line', z) == line) {
                for (y = 0; y < Results.length; y++) {
                    if (Results[y].description == itemDescription) {
                        var id = Results[y].id;
                        rec.setLineItemValue('item', 'custcol_scm_itemsub_original_item', z, id)
                        console.log('rec type = ' + recType + ', id= ' + recId + ', line= ' + z + ' - orig item id= ' + id);
                        changedFlag = true;
                        break;
                    }
                    else {
                        if (y == Results.length - 1) {
                            console.log('ERR - rec type = ' + recType + ', id= ' + recId + ', line= ' + z + '- no match found for description= ' + itemDescription);
                        }
                    }
                }
            }
            else {
                if (z == itemCount && changedFlag == false) {
                    console.log('ERR - rec type = ' + recType + ', id= ' + recId + ', line= ' + line + ' - line id does not exist ');
                }
            }
        }
        if (changedFlag) {
            var verification = nlapiSubmitRecord(rec);
            console.log('verification = ' + i + ' - record:' + verification);
        }
        nlapiGetContext().getRemainingUsage = function () { return 1000; }
    } catch (e) {
        console.log('error: s = ' + i + ' - record:' + recId);
        console.log('detail: ' + e);
        continue;
    }
}



//var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());


function loadItems() {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('purchasedescription');

    var search = nlapiCreateSearch('item', null, columns);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != undefined && resultslice != null && resultslice.length >= 1000);

    if (s != null) {
        var counter = 0;
        for (var i = 0; i < s.length; i++) {
            if (s[i].getValue('purchasedescription') != '') {
                Results[counter] = {
                    id: s[i].id,
                    description: s[i].getValue('purchasedescription'),
                }
                counter++;
            }
        }
    }

}