function UpdateMDBatch() {   
    debugger; 
        
        var recId = nlapiGetRecordId();
        var mdRec = nlapiLoadRecord('customrecord_medicane_lot', recId);
        var batch_category = mdRec.getFieldValue('custrecordbatch_category')
        if (!isNullOrEmpty(batch_category)) {           
            var ItemReceiptList = getItemReceipt(recId);    
            var rec = nlapiLoadRecord('itemreceipt', ItemReceiptList[0], { recordmode: 'dynamic' });
            rec.setLineItemValue('item', 'custcol_serial_to_upd', 1, batch_category);
            nlapiSubmitRecord(rec);           
        }
        window.location.reload();   
}
function getItemReceipt(inventorynumber) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('altname');
   
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custbody_medicane_lot', null, 'anyof', inventorynumber)
    filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T')

    var search = nlapiCreateSearch('itemreceipt', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var result = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            result.push(s[i].id);
        }     
    }
    return result;
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
