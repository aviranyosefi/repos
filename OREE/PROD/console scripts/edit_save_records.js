function editSaveByLoadSearch_account() {

    var results = nlapiLoadSearch(null, 'customsearch832');
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
        try {
            var 
            type = s[i].getValue("type")
            if (type == "CustInvc") { type = "invoice"; }
            else if (type == "Opprtnty") { type = "opportunity"; }
            else if (type == "SalesOrd") { type = "salesorder"; }
            else if (type == "Estimate") { type = "estimate"; }
            id = s[i].id;
            nlapiLogExecution('debug', 'Id: ' + id, '');
            var rec = nlapiLoadRecord(type, id);
            var verification = nlapiSubmitRecord(rec, null, true);
            //console.log('s = ' + i + ' - account:' + verification);
            nlapiLogExecution('debug', 's = ' + i + 'rec type:' + type, 'id:' + verification);
            //nlapiGetContext().getRemainingUsage = function () { return 1000; }
        }catch (e) {
            //console.log('error: s = ' + i + ' - record:' + verification);
            //console.log('detail: ' + e);
            nlapiLogExecution('debug', 'error with rec: ', id);
            nlapiLogExecution('debug', 'exception:  ', e);
            continue;
        }
    }
}