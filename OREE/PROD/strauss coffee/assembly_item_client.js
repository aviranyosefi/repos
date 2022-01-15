
function printButton() {
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var loction = nlapiLookupField('employee', rec.getFieldValue('assigned'), 'location')
    if ((rec.getFieldValue('category') == '3' || rec.getFieldValue('category') == '1') && isNullOrEmpty(loction)) {
        alert('לא ניתן לדווח חלקי חילוף - לא מוגדר מחסן עבור הטכנאי הנוכחי')
    }
    else {
        var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_assembly_item_screen_sl', 'customdeploy_item_assembly_suitelet_dep', false);
        createdPdfUrl += '&RecId=' + nlapiGetRecordId() + '&isApp=F';
        window.open(createdPdfUrl);
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}