var SO_rec;

function afterSubmit(type) {
    nlapiLogExecution('debug', 'type', type)
    try { nlapiScheduleScript('customscript_packge_on_fulfillment_sched', 'customdeploy_packge_on_fulfillment_dep', { custscript_packge_on_fulfillment: nlapiGetRecordId() }) } catch (e) {}
        
    if (type != 'create') {
        var newRec = nlapiGetNewRecord();
        var oldRec = nlapiGetOldRecord();
        var new_status = newRec.getFieldValue('shipstatus')
        var old_status = oldRec.getFieldValue('shipstatus')
    }
    else {
        var rec = nlapiLoadRecord('itemfulfillment', nlapiGetRecordId());
        var new_status = rec.getFieldValue('shipstatus');
        var old_status = '';
    }
    if (new_status == 'C' && (old_status != new_status)) {

        nlapiLogExecution('debug', 'new_status == ' + 'C' + '&& (old_status != new_status) ', 'true' + ' id: ' + nlapiGetRecordId())

        var rec = nlapiLoadRecord('itemfulfillment', nlapiGetRecordId());
        var createdfrom = rec.getFieldValue('createdfrom');
        try {  SO_rec = nlapiLoadRecord('salesorder', createdfrom); } catch (e) {  SO_rec = null}
        
        if (SO_rec != null && SO_rec != undefined) {
            //try { nlapiScheduleScript('customscript_update_subscription_ss', 'customdeploy_update_subscription_ss_dep', { custscript_fulfillment_id: nlapiGetRecordId() }) } catch (e) { }
            try { nlapiScheduleScript('customscript_create_install_base_ss', null, { custscript_obj_for_bi: nlapiGetRecordId() }) } catch (e) { }
            
        }//   if (SO_rec != null && SO_rec != undefined) - end
    }
}

