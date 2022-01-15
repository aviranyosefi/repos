
function updateIventoryDetails(type) {
    try { 
        if (type != 'delete') {
            var recId = nlapiGetRecordId();
            if (type != 'create') {
                var newRec = nlapiGetNewRecord();
                var oldRec = nlapiGetOldRecord();
                var new_batch_category = newRec.getFieldValue('custrecordbatch_category')
                var old_batch_category = oldRec.getFieldValue('custrecordbatch_category')
            }
            else {
                var rec = nlapiLoadRecord('customrecord_medicane_lot', recId);
                var new_batch_category = rec.getFieldValue('custrecordbatch_category');
                var old_batch_category = '';
            }
            nlapiLogExecution('ERROR', 'new_batch_category: ' + new_batch_category + ' old_batch_category: ' + old_batch_category, 'type: ' +type);
            if (new_batch_category != old_batch_category) {
                if (!isNullOrEmpty(new_batch_category)) {
                    var ItemReceiptList = getItemReceipt(recId);
                    var ITrec = nlapiLoadRecord('itemreceipt', ItemReceiptList[0], { recordmode: 'dynamic' });                
                    var medicane_lot_display = ITrec.getLineItemValue('item', 'custcol_medicane_lot_display', 1);
                    var serials = getInventoryID(medicane_lot_display);
                    nlapiLogExecution('ERROR', 'serials', serials)
                    if (!isNullOrEmpty(serials)) {
                        var INVrec = nlapiLoadRecord('inventorynumber', serials);
                        INVrec.setFieldValue('custitemnumber_batch_category', new_batch_category)
                        nlapiSubmitRecord(INVrec);
                    }                  
                }
            }
        }                              
    } catch (e) { nlapiLogExecution('ERROR', 'error', e);}
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getInventoryID(medicane_lot_display) {
    nlapiLogExecution('ERROR', 'medicane_lot_display', medicane_lot_display)
    filters = [];
    columns = [];
    var inventname = '';
    filters.push(new nlobjSearchFilter('inventorynumber', null, 'is', medicane_lot_display));
    columns.push(new nlobjSearchColumn('internalid'));
  
    var result = nlapiSearchRecord('inventorynumber', null, filters, columns) || [];
    if (result != null) {       
         inventname = result[0].getValue('internalid');     
    }

    return inventname;
}

function getItemReceipt(id) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custcol_medicane_lot', null, 'anyof', id)
    //filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T')

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












