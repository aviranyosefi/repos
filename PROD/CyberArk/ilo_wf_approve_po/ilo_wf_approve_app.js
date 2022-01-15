
function sendtEmail() {
    try {
        var context = nlapiGetContext();
        nlapiLogExecution('debug', 'sendtEmail:  ','sendtEmail') 
        var reciever = context.getSetting('SCRIPT', 'custscript_user');
        var internalid = nlapiGetRecordId();
        var type = nlapiGetRecordType();
        nlapiLogExecution('debug', 'internalid: ' + internalid + ' ,type: ' + type, 'reciever: ' + reciever);
        if (type == 'vendorbill') {
            var rec = nlapiLoadRecord('vendorbill', internalid);
            if (rec.getFieldValue('custbody_receiver_approval') == '1') {
                rec.setFieldValue('custbody_tolerance_approver', '1');
                var approver = 'tolerance'
            }
            else {
                rec.setFieldValue('custbody_receiver_approval', '1');
                var approver = 'receiver'
            }
            if ((approver == 'tolerance' && rec.getFieldValue('custbody_financial_approval') == '1') ||
                (approver == 'receiver' && isNullOrEmpty(rec.getFieldValue('custbody_nc_vbtol_reject_reason')))) {
                rec.setFieldValue('paymenthold', 'F');
            }
            nlapiSubmitRecord(rec, { disabletriggers: true, enablesourcing: true });
        }
        else if (type == 'vendorcredit') {
            var rec = nlapiLoadRecord('vendorcredit', internalid);
            rec.setFieldValue('custbody_receiver_approval', '1'); 
            nlapiSubmitRecord(rec, { disabletriggers: true, enablesourcing: true });
        }
        var TOuser = rec.getFieldValue('custbody_il_bill_creator')
        suiteletEmail(reciever, TOuser, 'approved', 'vendorbill', internalid);
 
    } catch (e) {

    }
}


