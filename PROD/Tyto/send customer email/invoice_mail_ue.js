/**
 * Version    Date            Author           Remarks
 * 1.00       6 Apri 2022  Maya Katz Libhaber
 */
function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        var user = nlapiGetContext().user;
        var showBtn = nlapiLookupField('employee', user, 'custentity_show_email_button')
        if (showBtn == 'T') {
            form.setScript('customscript_invoice_mailValidation_cs');
            form.addButton('custpage_button_email', 'Send Invoice To Customer', 'emailButtonInvoice()');
        }
    }
}

