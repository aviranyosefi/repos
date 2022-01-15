var context = nlapiGetContext();
var results = nlapiLoadSearch(null, 'customsearch_req_pending_my_approval_2_3');
var runSearch = results.runSearch();
var s = [];
var searchid = 0;
var counter = 1;
var rec = null;
var itemCount = 0;

do {
    var resultslice = runSearch.getResults(searchid, searchid + 1000);
    for (var rs in resultslice) {
        s.push(resultslice[rs]);
        searchid++;
    }
} while (resultslice != null && resultslice.length >= 1000);

for (i = 0; i < s.length; i++) {
    try {
        var recId = s[i].getValue('internalid',null,'Group');
        var recType = 'purchaserequisition';
        var rec = nlapiLoadRecord(recType, recId);

        itemCount = rec.getLineItemCount('item');
        if (itemCount > 0) {
            rec.setFieldValue('location', rec.getLineItemValue('item', 'location', 1));
            var submition = nlapiSubmitRecord(rec);
            console.log(counter + '- Submittion - tranID: ' + submition + ', location: ' + nlapiGetFieldText('location'));
        }
        
        nlapiGetContext().getRemainingUsage = function () { return 1000; }
            
        //}
    } catch (e) {
        console.log('error with rec: ' + recId + ', type: ' + recType);
        console.log('exception:  ' + e.message);
        continue;
    }
    counter++;
}
