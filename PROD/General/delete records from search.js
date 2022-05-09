var context = nlapiGetContext();
var results = nlapiLoadSearch(null, 'customsearch825060');
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
        var recId = s[i].id;
        var recType = s[i].type;                          
        //var rec = nlapiLoadRecord (recType,recId)
        //id = nlapiSubmitRecord(rec, null , true);
        nlapiDeleteRecord(recType, recId)
        nlapiGetContext().getRemainingUsage = function () { return 1000; }
        
    } catch (e) {
        console.log('error with rec: ' + recId + ', type: ' + recType);
        console.log('exception:  ' + e);
        continue;
    }
    counter++;
}


