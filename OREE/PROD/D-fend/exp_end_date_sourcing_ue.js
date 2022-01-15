function afterSubmit() {
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId())
    if (rec.getRecordType() == 'opportunity' || rec.getRecordType() == 'estimate') {
        nlapiSubmitField(rec.getRecordType(), rec.id,'custbody_expected_close_date', nlapiGetFieldValue('expectedclosedate'));
        nlapiLogExecution('debug', rec.getRecordType() + ':' + rec.id, 'expected close date:' + nlapiGetFieldValue('expectedclosedate'));
    }
    else if (rec.getRecordType() == 'salesorder' || rec.getRecordType() == 'invoice') {
        nlapiSubmitField(rec.getRecordType(), rec.id,'custbody_expected_close_date', nlapiGetFieldValue('trandate'));
        nlapiLogExecution('debug', rec.getRecordType()+':' +rec.id, 'expected close date:' + nlapiGetFieldValue('trandate'));
    }
}