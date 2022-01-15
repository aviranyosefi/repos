
function beforeLoad_addButton(type, form) {
   
    if (type == 'view') {

        //var cb = nlapiGetFieldValue('custbody_unv_proforma_invoice_');
       //if (cb == 'T') {
            form.setScript('customscript_proforma_print_client'); // client script id
            form.addButton('custpage_button_print', 'Print Proforma Invoice', 'printButton()');
       // }
    }          
}

function beforSubmit() {

    var cb = nlapiGetFieldValue('custbody_unv_proforma_invoice_');
    if (cb == 'T') {

        nlapiSetFieldValue('custbodycustbody_ilo_print_draft', 'T');
        nlapiSetFieldValue('custbody_proforma_invoice_date', nlapiGetFieldValue('trandate'));
        
    }
    //else {
    //    nlapiSetFieldValue('custbodycustbody_ilo_print_draft', 'F');
    //}

}










