function beforSubmit() {

    var reasonRec = nlapiLoadRecord('customrecord_rejection_reason', nlapiGetRecordId());
    var CreateFrom = reasonRec.getFieldValue('custrecord_rr_transaction');
    nlapiLogExecution('debug', 'CreateFrom', CreateFrom)
    if (CreateFrom != null && CreateFrom != '') {     
        var rec = nlapiLoadRecord('purchaseorder', CreateFrom);      
        rec.setFieldValue('custbody_rejected_reason', reasonRec.getFieldValue('custrecord_rr_rejection_reason'));     
        nlapiSubmitRecord(rec);      
    }
}