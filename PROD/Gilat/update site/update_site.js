function afterSubmit() {

    nlapiLogExecution('debug', ' debug', 'debug');
    rec = nlapiLoadRecord('customrecord_ib_service_type', nlapiGetRecordId())
    var is_service = rec.getFieldValue('custrecord_ib_is_service')
    if (is_service == 'T') {
        var status = rec.getFieldValue('custrecord_ib_service_status')
        var site = rec.getFieldValue('custrecord_ib_site')
        if (status == '1') {  // Activated         
            nlapiSubmitField('customrecord_site', site, 'custrecord_site_status', 1) //  Active
        }
     
    } //   if (is_service == 'T')

}




