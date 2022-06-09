/**
 * Version    Date            Author           Remarks
 * 1.00       6 Apri 2022  Maya Katz Libhaber
 */
if (nlapiGetContext().getEnvironment() == "PRODUCTION") {
    var sender = 2824;
} else {
    var sender = 3155;
}
nlapiLogExecution('debug', 'sender', sender);

var emailTemplate = '9';
var mailStatus = 5;

function suitelet_email(request, response) {

    var recID = request.getParameter('Recid');
    nlapiLogExecution('debug', 'recID', recID);
    
    try {
        var rec = nlapiLoadRecord('invoice', recID);
    }
    catch (e) {
        nlapiLogExecution('ERROR', 'error', e);
    }

    emailMerger = nlapiCreateEmailMerger(emailTemplate);//email template version of sending invoice mail
    emailMerger.setTransaction(recID);
    var mergeResult = emailMerger.merge();
    var msg = mergeResult.getBody();
    nlapiLogExecution('debug', 'msg', msg);

    var sbj = mergeResult.getSubject();
    nlapiLogExecution('debug', 'sbj', sbj);

    var emails = [];
    var email_address = rec.getFieldValue('custbody_bill_email_address');
    emails.push(email_address)
    var email_address_2 = rec.getFieldValue('custbody_tyto_bill_email_address_2');
    if (!isNullOrEmpty(email_address_2)) {
        emails.push(email_address_2)
    }
    var employeeMail = nlapiLookupField('employee', sender, 'email');
    nlapiLogExecution('debug', 'employeeMail', employeeMail);
    if (isNullOrEmpty(employeeMail)) {
        employeeMail = 'ar@tytocare.com';
    }
    var file = nlapiPrintRecord('TRANSACTION', recID, 'PDF', null);
    nlapiLogExecution('debug', 'file', file);

    var attachRec = new Object();
    attachRec['transaction'] = recID;
    nlapiLogExecution('debug', 'attachRec', attachRec);

    try {
        nlapiSendEmail(sender, emails, sbj, msg, employeeMail, null, attachRec, file);
        rec.setFieldValue('custbody_tyto_invoice_status', mailStatus);
        nlapiSubmitRecord(rec);
        var form = nlapiCreateForm('Success sending emails');
    } catch (e) {
        nlapiLogExecution('error', e, recID);
        var form = nlapiCreateForm(e)
    }
    response.writePage(form)
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
