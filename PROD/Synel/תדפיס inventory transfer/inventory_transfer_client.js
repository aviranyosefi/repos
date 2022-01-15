function printButton() {

    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_inventory_transfer_suitlet', 'customdeploy_inventory_transfer_suitlet', false);
    createdPdfUrl += '&Recid=' + nlapiGetRecordId();
    window.open(createdPdfUrl);

}
