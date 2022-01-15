
function packge_on_fulfillment() {
    try { 

        var context = nlapiGetContext();
        var fulfillment = context.getSetting('SCRIPT', 'custscript_packge_on_fulfillment');

        var rec = nlapiLoadRecord('itemfulfillment', fulfillment);

        var pd_id = rec.getLineItemValue('recmachcustrecord_pd_fulfillment_no', 'id', 1)
        
        if (pd_id != '' && pd_id != null) {

            var pd_rec = nlapiLoadRecord('customrecord_package_detail', pd_id);
            nlapiSubmitRecord(pd_rec)
        }

            
             
    } catch (err) {
        nlapiLogExecution('error', 'packge_on_fulfillment()', err)
    }
    
}



