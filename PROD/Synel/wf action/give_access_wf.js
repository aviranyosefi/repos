function give_access_wf() {
    try { 
        var recID = nlapiGetRecordId();
        var rec = nlapiLoadRecord('contact', recID);
        nlapiLogExecution('debug', '', 'recID: ' + recID);
        var company = rec.getFieldValue('company')
        var email = rec.getFieldValue('email')
        if (!isNullOrEmpty(company) && !isNullOrEmpty(email) ) {
            var customeRec = nlapiLoadRecord('customer', company);
            var lineContact = customeRec.findLineItemValue('contactroles', 'contact', recID);
            if (lineContact != "-1") {
                customeRec.setLineItemValue('contactroles', 'giveaccess', lineContact, 'T')
                customeRec.setLineItemValue('contactroles', 'sendemail', lineContact, 'T')
                nlapiSubmitRecord(customeRec);
            }
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'error',  e);
    }  
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}


