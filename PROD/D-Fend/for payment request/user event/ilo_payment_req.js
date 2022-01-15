// JavaScript source code

function beforeLoad_addButton(type, form) {
    nlapiLogExecution('error', 'beforeLoad_addButton in PrintPdf: ', type);
    if (type == 'view') {
        form.setScript('customscript_ilo_pay_req_client'); // client script id
        form.addButton('custpage_button_pmt1', 'PMT 1', 'onclick_payment_request(1)');
        form.addButton('custpage_button_pmt2', 'PMT 2', 'onclick_payment_request(2)');
        form.addButton('custpage_button_pmt3', 'PMT 3', 'onclick_payment_request(3)');
    }
    if (type == 'copy') {
        nlapiSetFieldValue('custbody_pmt1_date', '', false, false);
        nlapiSetFieldValue('custbody_pmt2_date', '', false, false);
        nlapiSetFieldValue('custbody_pmt3_date', '', false, false);
        nlapiSetFieldValue('custbody_pmt1_rate', '', false, false);
        nlapiSetFieldValue('custbody_pmt2_rate', '', false, false);
        nlapiSetFieldValue('custbody_pmt3_rate', '', false, false);
        nlapiSetFieldValue('custbody_pmt1_ils_balance', '', false, false);
        nlapiSetFieldValue('custbody_pmt2_ils_balance', '', false, false);
        nlapiSetFieldValue('custbody_pmt3_ils_balance', '', false, false);
    }

}



