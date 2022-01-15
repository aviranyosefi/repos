function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        rec = nlapiLoadRecord('inventorytransfer', nlapiGetRecordId())
        var toLoc = rec.getFieldValue('transferlocation');
        if (!isNullOrEmpty(toLoc))  {
            var flag = nlapiLookupField('location', toLoc, 'custrecord_contractor_warehouse')
            if (flag == 'T') {
                form.setScript('customscript_inventory_transfer_client'); // client script id
                form.addButton('custpage_button_print', 'הדפס תעודת מסירה לקבלן', 'printButton()');  
            }
        }   
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}











