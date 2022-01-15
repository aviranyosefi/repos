function printButton() {

    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_print_suitlet', 'customdeploy_print_suitlet', false);
    createdPdfUrl += '&Recid=' + nlapiGetRecordId();

    window.open(createdPdfUrl);

}
