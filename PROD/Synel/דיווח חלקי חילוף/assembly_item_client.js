
function printButton() {
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var emp_loction = nlapiLookupField('employee', rec.getFieldValue('assigned'), 'location')
    if (isNullOrEmpty(emp_loction)) {// (rec.getFieldValue('category') == '3' || rec.getFieldValue('category') == '1') &&
        alert('לא ניתן לדווח חלקי חילוף - לא מוגדר רכב עבור הטכנאי הנוכחי')
    }
    else {
        var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_assambly_item_screen_nochbx', 'customdeploy_item_assembly_suitelet_dep', false);
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