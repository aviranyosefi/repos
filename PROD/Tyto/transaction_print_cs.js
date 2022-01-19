function printButtonCI() {
        var createdPdfUrl= getSuUrl()
        createdPdfUrl += '&ButtonType=' + 'ci';
        window.open(createdPdfUrl);
}
function printButtonPL() {
    var createdPdfUrl = getSuUrl()
    createdPdfUrl += '&ButtonType=' + 'pl';
    window.open(createdPdfUrl);
}
function printButtonPO() {
    var createdPdfUrl = getSuUrl()
    createdPdfUrl += '&ButtonType=' + 'po';
    window.open(createdPdfUrl);
}
function getSuUrl() {
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_transaction_print_su', 'customdeploy_transaction_print_su', false);
    createdPdfUrl += '&Recid=' + nlapiGetRecordId();
    createdPdfUrl += '&Rectype=' + nlapiGetRecordType();
    return createdPdfUrl;
}
function emailButtonPO() {
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_transaction_print_su_email', 'customdeploy1', false);
    createdPdfUrl += '&Recid=' + nlapiGetRecordId();
    window.open(createdPdfUrl);
}
