var GLOBAL_SUBS = 14;
var GLOBAL_PAYMENT_METHOD = 10;
function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
        var paymentoption = rec.getFieldValue('custentity_customer_payment_method');
        var subs = rec.getFieldValue('subsidiary');
        if ( subs == GLOBAL_SUBS) {//10 - credit guard || 14 - Dangot Computers LTD
            form.setScript('customscript_credit_guard_button'); // client script id
            form.addButton('custpage_button_print', 'חיוב באשראי', 'credit_guard_button()');
        }
    }
}
