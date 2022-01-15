var context = nlapiGetContext();
var execontext = nlapiGetContext().getExecutionContext()

function pageInit(type) {

    if (type == 'copy') {
        alert('copy');
        URL = window.location.href;
        idIndex = URL.indexOf('id=');
        EndIdindex = URL.indexOf('&', idIndex);
        BillId = URL.substring(idIndex + 3, EndIdindex);
        getVendbillAttachments(BillId);
    }
        return;
    // do stuff
}

function getVendbillAttachments(VendBillID) {

    var results = [];
    var toReturn = [];


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('tranid');
    columns[1] = new nlobjSearchColumn('name', 'file');
    columns[2] = new nlobjSearchColumn('internalid', 'file');
    columns[3] = new nlobjSearchColumn('url', 'file');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', VendBillID)
    filters[1] = new nlobjSearchFilter('type', null, 'anyof', ['VendBill'])//'CustInvc', 'CustCred'
    filters[2] = new nlobjSearchFilter('mainline', null, 'is', 'T')


    var search = nlapiCreateSearch('transaction', filters, columns);
    var resultset = search.runSearch();
    results = resultset.getResults(0, 1000);


    if (!isNullOrEmpty(results)) {
        results.forEach(function (line) {
            toReturn.push({
                fileName: line.getValue('name', 'file'),
                fileID: line.getValue('internalid', 'file'),
                fileURL: line.getValue('url', 'file')
            })
        });
    }

    return toReturn;
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}