/**
 * Version    Date            Author           Remarks
 * 1.00       6 Apri 2022  Maya Katz Libhaber
 */
function emailButtonInvoice() {
    var rec = nlapiLoadRecord('invoice', nlapiGetRecordId());
    debugger;
    var customerId = rec.getFieldValue('entity');
    var isNeededToSendMail = nlapiLookupField('customer', customerId, 'custentity_send_automatic_invoices');
    if (isNeededToSendMail == 'F') {
        var firstMail = rec.getFieldValue('custbody_bill_email_address');
        var secondMail = rec.getFieldValue('custbody_tyto_bill_email_address_2');
        if (isNullOrEmpty(firstMail) && isNullOrEmpty(secondMail)) {
            alert('Can not send email, the bill email address is not set');
        }
        else if (!isNullOrEmpty(firstMail) || !isNullOrEmpty(secondMail)) {
            if (confirm("Press Ok to confirm sending email to:\n" +
                rec.getFieldValue('custbody_bill_email_address') + "\n" +
                rec.getFieldValue('custbody_tyto_bill_email_address_2')) == true) {
                var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_invoice_mail_su', 'customdeploy_invoice_mail_su', false);
                createdPdfUrl += '&Recid=' + nlapiGetRecordId();
                window.open(createdPdfUrl);
            } else {
                return false;
            }
        }
        else if (isNullOrEmpty(secondMail)) {
            if (confirm("Press Ok to confirm sending email to:\n" +
                rec.getFieldValue('custbody_bill_email_address')) == true) {
                var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_invoice_mail_su', 'customdeploy_invoice_mail_su', false);
                createdPdfUrl += '&Recid=' + nlapiGetRecordId();
                window.open(createdPdfUrl);
            } else {
                return false;
            }
        }
    } else
    {
        alert('It is not allowed to send automatic invoices to this customer');
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
