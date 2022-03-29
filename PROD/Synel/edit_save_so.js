function editSave() {
    var context = nlapiGetContext();
    var itf_id = context.getSetting('SCRIPT', 'custscript_itf_id');
    nlapiLogExecution('DEBUG', 'itf_id', itf_id);
    var rec = nlapiLoadRecord('itemfulfillment', itf_id);
    var ordertype = rec.getFieldValue('ordertype');
    if (ordertype == 'SalesOrd') {
        var createdfrom = rec.getFieldValue('createdfrom');
        var soRec = nlapiLoadRecord('salesorder', createdfrom);
        var id = nlapiSubmitRecord(soRec, null, true);
    }
}