
function CheckFile(request, response) {
    var file = request.getParameter('file');
    nlapiLogExecution('debug', 'file', file)
    var res =getfileData(file)
    nlapiLogExecution('debug', 'res', res)
    response.write(res)

}
function getfileData(file) {

    var data = [];
    var loadedFile = nlapiLoadFile(file);
    loadedFile.setEncoding('UTF-8')
    var loadedString = loadedFile.getValue();
    var fileLines = loadedString.split('\r\n');
    for (var i = 1; i <= fileLines.length; i++) {
        var serialsArr = [];
        if (!isNullOrEmpty(fileLines[i])) {
            var cols = fileLines[i].split(',');
            var qty = cols[2];
            if (isNullOrEmpty(qty)) { return 'fail' }
            var serial = cols[3];
            var item = cols[0];
            nlapiLogExecution('debug', 'item' + i, item)
            if (isNullOrEmpty(item)) {return 'fail'}
            var itemID = getItemId(item)
            if (itemID == 0) { return 'fail' }
            nlapiLogExecution('debug', 'itemID' + i, itemID)
            var isserialitem = nlapiLookupField('item', itemID, 'isserialitem')
            nlapiLogExecution('debug', 'isserialitem' + i, isserialitem)
            if (isserialitem == 'T') {
                if (isNullOrEmpty(serial)) {return 'fail'}
                if (data[item] != undefined) {
                    var serialsCurr = data[item].serials
                    serialsArr = serialsCurr;
                }
                if (serialsArr.indexOf(serial) > -1) { return 'fail' }
                serialsArr.push(serial);
                data[item] = {serials:serialsArr}
            }
            else {
                var islotitem = nlapiLookupField('item', itemID, 'islotitem')                
                if (islotitem == 'T') {
                    if (isNullOrEmpty(serial)) { return 'fail' }
                }
                else {
                    if (!isNullOrEmpty(serial)) { return 'fail' }
                }

            }
            //nlapiLogExecution('debug', 'item' + i, item)
        }
    }
    return 'success'
}
function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function getItemId(item) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('itemid', null, 'is', item)

    var search = nlapiCreateSearch('item', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null && s.length >0) {

        return s[0].id
    }
    return 0;
}

