function afterSubmit(type) {
    try {
        if (type != 'delete') {
            var cmId = nlapiGetRecordId();
            var cmRec = nlapiLoadRecord('customrecord_coffee_machine_equip', cmId );
            var id = cmRec.getFieldValue('custrecord_inventory_number')
            if (!isNullOrEmpty(id)) {
                var rec = nlapiLoadRecord('inventorynumber', id);
                rec.setFieldValue('custitemnumber_cme', cmId)
                nlapiSubmitRecord(rec);
            }         
        }
    } catch (e) {

    }
}

function getSerial(serial) {
    var filtersInvoice = new Array();
    filtersInvoice[0] = new nlobjSearchFilter('inventorynumber', null, 'is', serial)

    var columnsInvoice = new Array();
    columnsInvoice[0] = new nlobjSearchColumn('item');
    columnsInvoice[1] = new nlobjSearchColumn('inventorynumber');
    var searchSerial = nlapiCreateSearch('inventorynumber', filtersInvoice, columnsInvoice);
    resultset = searchSerial.runSearch();
    var resultslice = resultset.getResults(0, 0 + 1000);
    if (resultslice != null) {
        var id = resultslice[0].id

    }
   
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}