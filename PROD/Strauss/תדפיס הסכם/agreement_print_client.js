
function printButton() {
    
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_agreement_print_suitlet', 'customdeploy_agreement_print_suitlet', false);
        createdPdfUrl += '&id=' + nlapiGetRecordId();
           
        window.open(createdPdfUrl);
   
}