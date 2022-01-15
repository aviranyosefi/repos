function printButtonCart() {
    //lotId = nlapiGetFieldValue('custbody_medicane_sub_lot')
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_drying_cart_stick_print_sl', 'customdeploy_dry_crt_stick_print_sl_dep', false);
    createdPdfUrl += '&id=' + nlapiGetRecordId();  
            window.open(createdPdfUrl);   
}