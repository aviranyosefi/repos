
function sendtEmail() {
    try {
        var context = nlapiGetContext();
        nlapiLogExecution('debug', 'sendtEmail:  ','sendtEmail')     
        var reciever = context.getSetting('SCRIPT', 'custscript_user_reject');
        var internalid = nlapiGetRecordId();
        var type = nlapiGetRecordType();
        nlapiLogExecution('debug', 'internalid: ' + internalid +' ,type: ' + type, 'reciever: '+ reciever )
        if (type == 'vendorbill') {          
            var rec = nlapiLoadRecord('vendorbill', internalid);
            if (rec.getFieldValue('custbody_receiver_approval') == '1') {
                rec.setFieldValue('custbody_tolerance_approver', '2');
            }
            else {
                rec.setFieldValue('custbody_receiver_approval', '2');
            }           
            nlapiSubmitRecord(rec, { disabletriggers: true, enablesourcing: true });         
        }
        else if (type == 'vendorcredit') {
            var rec = nlapiLoadRecord('vendorcredit', internalid);          
            rec.setFieldValue('custbody_receiver_approval', '2');                      
            nlapiSubmitRecord(rec, { disabletriggers: true, enablesourcing: true });
        }
        var TOuser = rec.getFieldValue('custbody_il_bill_creator')
        suiteletEmail(reciever, TOuser, 'rejected', type, internalid);
    
    } catch (e) {

    }
}


