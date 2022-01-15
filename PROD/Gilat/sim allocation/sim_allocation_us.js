function after_submmit(type) {

    nlapiLogExecution('DEBUG', 'type', type);
    if (type != 'create') {
        var newRec = nlapiLoadRecord('customrecord_sim', nlapiGetRecordId()) // nlapiGetNewRecord();
        var oldRec = nlapiGetOldRecord();

        var new_sub = newRec.getFieldValue('custrecord_related_subscription')
        var old_sub = oldRec.getFieldValue('custrecord_related_subscription')

        nlapiLogExecution('DEBUG', 'old_sub', old_sub);
        nlapiLogExecution('DEBUG', 'new_sub', new_sub);
        if (old_sub != "" && old_sub != null && old_sub != undefined) {
            if (new_sub == null || new_sub == '') {
                nlapiSubmitField('customrecord_subscription', old_sub, 'custrecord_subs_customer', '')
            }
        }
    }

}
