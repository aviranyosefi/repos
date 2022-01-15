function printButton() {
    //lotId = nlapiGetFieldValue('custbody_medicane_sub_lot')
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_bal_cel_stick_print_sl', 'customdeploy_bal_cel_stick_print_sl_dep', false);
    createdPdfUrl += '&id=' + nlapiGetRecordId();  
            window.open(createdPdfUrl);   
}