function printButton() {
    //lotId = nlapiGetFieldValue('custbody_medicane_sub_lot')
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_md_lot_sticker_print_suite', 'customdeploymd_lot_stick_pri_suitele_dep', false);
    createdPdfUrl += '&id=' + nlapiGetRecordId();  
            window.open(createdPdfUrl);   
}