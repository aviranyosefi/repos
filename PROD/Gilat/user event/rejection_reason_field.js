function afterSubmmit() {

    
    var CreateFrom =nlapiGetFieldValue('record');
    nlapiLogExecution('debug', 'CreateFrom', CreateFrom)

    if (CreateFrom != null && CreateFrom != '') {
        
        var rec = nlapiLoadRecord('customrecord_ticket', CreateFrom);      
        var field = rec.getFieldValue('custrecord_ticket_update_last_modify')
        if (field == 'T') { rec.setFieldValue('custrecord_ticket_update_last_modify', 'F'); }
        else { rec.setFieldValue('custrecord_ticket_update_last_modify', 'T');}
        
        nlapiSubmitRecord(rec);
        


    }

}