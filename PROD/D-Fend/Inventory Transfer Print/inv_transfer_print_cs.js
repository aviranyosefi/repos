function printIT() {    
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_inv_transfer_print_su', 'customdeploy_inv_transfer_print_su', false);
    createdPdfUrl += '&Recid=' + nlapiGetRecordId();
    window.open(createdPdfUrl);  
}

