function printButton() {

    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_proforma_print_suitlet', 'customdeploy_proforma_print_suitlet_dep', false);
    createdPdfUrl += '&id=' + nlapiGetRecordId();

    window.open(createdPdfUrl);

}

