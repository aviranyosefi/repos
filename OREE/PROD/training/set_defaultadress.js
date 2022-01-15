// JavaScript source code
function aftersubmit(){
    var rec = nlapiLoadRecord('purchaseorder', nlapiGetRecordId());
    var vendor = rec.getFieldValue('entity');

    if (vendor != '' && vendor != undefined && vendor != null) {
        //var address = nlapiLookupField('vendor', vandor, 'defaultaddress');
        var vendor_rec = nlapiLoadRecord('vendor', vendor);
        var address = vendor_rec.getFieldValue('defaultaddress');
        if (address != '' && address != undefined && address != null) {
            rec.setFieldValue('custbody_default_address', address);
            var res = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', 'Result:', res);
        }
    }
}