// JavaScript source code

function beforeLoad_addButton(type, form) {
    nlapiLogExecution('error', 'beforeLoad_addButton in PrintPdf: ', type);
    if (type == 'view') {
        var hideBtn = nlapiLookupField('role', nlapiGetRole(), 'custrecord_hide_buttons_finance')
        if (hideBtn == 'F') {
            form.setScript('customscript_ilo_pay_req_client'); // client script id
            form.addButton('custpage_button_pmt1', 'Payment 1', 'onclick_payment_request(1)');
            form.addButton('custpage_button_pmt2', 'Payment 2', 'onclick_payment_request(2)');
            form.addButton('custpage_button_pmt3', 'Payment 3', 'onclick_payment_request(3)');
        }      
    }
    if (type == 'copy') {
        nlapiSetFieldValue('custbody_pmt1date', '', false, false);
        nlapiSetFieldValue('custbody_pmt2date', '', false, false);
        nlapiSetFieldValue('custbody_pmt3date', '', false, false);
        nlapiSetFieldValue('custbody_pmt1rate', '', false, false);
        nlapiSetFieldValue('custbody_pmt2rate', '', false, false);
        nlapiSetFieldValue('custbody_pmt3rate', '', false, false);
        nlapiSetFieldValue('custbody_pmt1bal', '', false, false);
        nlapiSetFieldValue('custbody_pmt2bal', '', false, false);
        nlapiSetFieldValue('custbody_pmt3bal', '', false, false);
    }

}



