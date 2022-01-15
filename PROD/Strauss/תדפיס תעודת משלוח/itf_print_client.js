
function printButton() {
    
        var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_itf_print_suitlet', 'customdeploy_itf_print_suitlet', false);
        createdPdfUrl += '&id=' + nlapiGetRecordId();
           
        window.open(createdPdfUrl);
   
}