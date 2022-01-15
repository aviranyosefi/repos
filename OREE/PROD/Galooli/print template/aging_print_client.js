
function printButton() {
    
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_aging_print_suitlet', 'customdeploy_aging_print_suitlet_dep', false);
            createdPdfUrl += '&id=' + nlapiGetRecordId();
           
            window.open(createdPdfUrl);
   
}