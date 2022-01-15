var context = nlapiGetContext();
var results = nlapiLoadSearch(null, 'customsearch426');
var runSearch = results.runSearch();
var s = [];
var searchid = 0;
var counter = 1;
var rec = null;
var itemCount = 0;
var recloaded = false;

do {
    var resultslice = runSearch.getResults(searchid, searchid + 1000);
    for (var rs in resultslice) {
        s.push(resultslice[rs]);
        searchid++;
    }
} while (resultslice != null && resultslice.length >= 1000);

for (i = 0; i < s.length; i++) {
    try {
        var recId = s[i].id;
        var recType = s[i].type;
        var productFamily = s[i].getText('custrecord_rev_rec_product_family', 'class');
        var line = s[i].getValue('line');
        if (i == 0 || s[i-1].id != recId) {
            rec = nlapiLoadRecord(recType, recId);
            itemCount = rec.getLineItemCount('item');
            console.log(counter + '- Load Record - tranID: ' + s[i].id + ', type: ' + recType);
        }
        //if (itemCount < 21) {
            for (y = 1; y <= itemCount; y++) {
                if (rec.getLineItemValue('item', 'line', y) == line) {
                    rec.setLineItemValue('item', "custcol_rev_rec_product_family", y, productFamily);
                    if (((i + 1) == s.length) || (s[i + 1].id != recId)) {
                        var submition = nlapiSubmitRecord(rec);
                        console.log(counter + '- Submittion - tranID: ' + submition + ', type: ' + recType + ', line: ' + line + ', productFamily: ' + productFamily);
                        console.log(counter + ' ');
                    }
                    else {
                        console.log(counter + '***** update- tranID: ' + recId + ', type: ' + recType + ', line: ' + line + ', productFamily: ' + productFamily);
                    }
                    
                }
                //else {
                //    nlapiLogExecution('debug', 'R_arrangement id:' + recId + 'line: ' + line, 'does not match');
                //}
                nlapiGetContext().getRemainingUsage = function () { return 1000; }
            }
        //}
    } catch (e) {
        console.log('error with rec: ' + recId + ', type: ' + recType);
        console.log('exception:  ' + e);
        continue;
    }
    counter++;
}
