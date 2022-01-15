var context = nlapiGetContext();
var execontext = nlapiGetContext().getExecutionContext()

function beforeload(type) {
    nlapiLogExecution('debug', 'beforeload type =  ', type);

    if (type == 'copy') {
        nlapiSetFieldValue('custbody_copied_bill', 'T');
        //getVendbillAttachments(BillId);
    }
    // do stuff
}



//function beforesubmit(type) {
//    nlapiLogExecution('debug', 'beforesubmit type =  ', type);
 
//    if (type == 'copy') {
//        nlapiSetFieldValue('custbody_copied_bill', 'T');
//        //getVendbillAttachments(BillId);
//    }
//    // do stuff
//}


function aftersubmit(type) {
    var copied = nlapiGetFieldValue('custbody_copied_bill');
    //nlapiLogExecution('debug', 'copied =  ', copied);
    nlapiLogExecution('debug', 'aftersubmit type =  ', type);
    reId = nlapiGetRecordId();
    nlapiLogExecution('debug', 'reId =  ', reId);
    if (type == 'create' && copied =='T') {
       
        var file = getVendbillAttachments(reId);

        if (!isNullOrEmpty(file)) {
            nlapiLogExecution('debug', 'file.length =  ', file.length);
            for (i = 0; i < file.length; i++) {
                try {
                    nlapiDetachRecord('file', file[i].fileID, nlapiGetRecordType(), nlapiGetRecordId());
                    nlapiLogExecution('debug', 'file detached =  ', file[i].fileID);
                } catch (e) {
                    nlapiLogExecution('debug', 'error:  ',e);
                }
            }

        }

        nlapiSetFieldValue('custbody_copied_bill','F');

    }
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
            if (line.getValue('name', 'file') != '') {
                toReturn.push({
                    fileName: line.getValue('name', 'file'),
                    fileID: line.getValue('internalid', 'file'),
                    fileURL: line.getValue('url', 'file')
                })
            }
        });
    }

    return toReturn;
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0) || val.length == 0) {
        return true;
    }
    return false;
}