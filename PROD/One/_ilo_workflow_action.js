function workflow_action() {

    var context = nlapiGetContext();
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId())
    nlapiLogExecution('debug', ' nlapiGetRecordId()', nlapiGetRecordId()) 
    var custom_id = rec.getFieldValue('custbody_trx_approval_log');
    if ( custom_id != null && custom_id != undefined && custom_id != "") {    
        nlapiSubmitField('customrecord_transactions_approval_log', custom_id, 'custrecord_end_date', new Date())
        var reject = context.getSetting('SCRIPT', 'custscript_reject');
        if (reject != '' && reject != null && reject != undefined) {
            nlapiSubmitField('customrecord_transactions_approval_log', custom_id, 'custrecord_action', reject)
        }
        else { nlapiSubmitField('customrecord_transactions_approval_log', custom_id, 'custrecord_action', context.getSetting('SCRIPT', 'custscript_status')) }
        nlapiSubmitField('customrecord_transactions_approval_log', custom_id, 'custrecord_approved_or_rejected_by', context.getUser()) 
    }

}