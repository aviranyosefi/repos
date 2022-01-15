
var soRec;
function printButton() {    
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_kit_print_suitlet', 'customdeploy_kit_print_suitlet', false);
    createdPdfUrl += '&Recid=' + nlapiGetRecordId() + '&RecType=' + nlapiGetRecordType(); 
    window.open(createdPdfUrl);  
}
function printButtonCI() {
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_kit_print_suitlet', 'customdeploy_kit_print_suitlet', false);
    createdPdfUrl += '&Recid=' + nlapiGetRecordId() + '&RecType=' + nlapiGetRecordType() + '&ci=T';
    window.open(createdPdfUrl);
}

function pageLoad() {
    var createdfrom = nlapiGetFieldValue('createdfrom');
    if (!isNullOrEmpty(createdfrom)) {
    soRec = nlapiLoadRecord('salesorder', createdfrom);    
    var count = nlapiGetLineItemCount('item');
    for (var i = 1; i <= count; i++) {
        var line = nlapiGetLineItemValue('item', 'line', i);
        qty_to_bill = qtyToBill(line);
        nlapiSetLineItemValue('item', 'custcol_df_quantity_to_bill', i, qty_to_bill);
        }
    }
}

function qtyToBill(line) {
    var soCount = soRec.getLineItemCount('item');
    for (var i = 1; i <= soCount; i++) {

        var soLine = soRec.getLineItemValue('item', 'line', i);
        if (soLine == line)
            return soRec.getLineItemValue('item', 'quantity', i);
    }
    return '';

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
