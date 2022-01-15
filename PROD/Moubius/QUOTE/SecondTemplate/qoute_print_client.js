
function printButton() {
    
         var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_qoute_print_suitlet', 'customdeploy_qoute_print_suitlet_dep', false);
            createdPdfUrl += '&id=' + nlapiGetRecordId();
           
            window.open(createdPdfUrl);
   
}