//Checkpoint 5400 Next Generation Threat Prevention & SandBlast (NGTX) Appliance

var changedFlag = false;
var counter = 1;

var results = nlapiLoadSearch(null, 'customsearch659');
var runSearch = results.runSearch();
var s = [];
var searchid = 0;
var itemCount = 0;

do {
    var resultslice = runSearch.getResults(searchid, searchid + 1000);
    for (var rs in resultslice) {
        s.push(resultslice[rs]);
        searchid++;
    }
} while (resultslice != null && resultslice.length >= 1000);


for (i = 0; i < s.length; i++) {
    //changedFlag = false;
    try {
        var recId = s[i].id;
        var recType = s[i].getValue('type');
        var line = s[i].getValue('line');
        var ItemClass = s[i].getValue('class', 'item');


        if (recType == "CustCred") {
            if (i == 0 || s[i - 1].id != recId) {
                rec = nlapiLoadRecord('creditmemo', recId);
                itemCount = rec.getLineItemCount('item');
                console.log(counter + '- Load Record - tranID: ' + s[i].id + ', type: ' + recType);
            }

            for (z = 1; z <= itemCount; z++) {
                if (rec.getLineItemValue('item', 'line', z) == line) {
                    rec.setLineItemValue('item', 'class', z, ItemClass)
                    console.log('rec type = ' + recType + ', id= ' + recId + ', line= ' + z + ' - item class= ' + id);
                    //changedFlag = true;
                    break;
                }
                else {
                    if (z == itemCount) {//&& changedFlag == false
                        console.log('ERR - rec type = ' + recType + ', id= ' + recId + ', line= ' + line + ' - line id does not exist ');
                    }
                }
            }
            if (((i + 1) == s.length) || (s[i + 1].id != recId)) {
                var submition = nlapiSubmitRecord(rec);
                console.log(counter + '- Submition- tranID: ' + submition + ', type: ' + recType + ', line: ' + line + ', ItemClass: ' + ItemClass );
            }
            else {
                console.log(counter + '*********** Update- tranID: ' + recId + ', type: ' + recType + ', line: ' + line + ', ItemClass: ' + ItemClass);
            }
/*            if (changedFlag) {
                var verification = nlapiSubmitRecord(rec);
                console.log('verification = ' + i + ' - record:' + verification);
            }*/
        }
        nlapiGetContext().getRemainingUsage = function () { return 1000; }
    } catch (e) {
        console.log('error: s = ' + i + ' - record:' + recId);
        console.log('detail: ' + e.message);
        continue;
    }
    counter++;
}



//var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
