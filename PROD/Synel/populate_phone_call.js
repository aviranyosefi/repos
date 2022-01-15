function afterSubmit() {
    var recId = nlapiGetRecordId();
    var rec = nlapiLoadRecord('phonecall', recId)
    var quoteText = rec.getFieldText('transaction');
    if (quoteText.indexOf('Quote') > -1) {
        var quote = rec.getFieldValue('transaction');
        nlapiSubmitField('estimate', quote, 'custbody_last_phone_call_activity', recId)
    }  
}