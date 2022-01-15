function _dev_fieldChange(type, name) {
    if (type == 'item' && name == 'item' && !isNullOrEmpty(nlapiGetCurrentLineItemValue('item', 'item'))) {
        var createdfrom = nlapiGetFieldValue('createdfrom');
        if (!isNullOrEmpty(createdfrom)) {
            var block = true;
        }
        else var block = false;
        var recType = nlapiGetRecordType();
        if (recType == 'salesorder' && block) {
            alert(' You are not allowed to add items lines.');
            nlapiSetCurrentLineItemValue('item', 'item', '');
            return false;
        }
        else return true;  
    }
}
function _dev_lineinit() {
    var recType = nlapiGetRecordType();
    var createdfrom = nlapiGetFieldValue('createdfrom');
    if (!isNullOrEmpty(createdfrom)) {
        var block = true;
    }
    else var block = false;
    nlapiSetLineItemDisabled('item', 'amount', true, nlapiGetCurrentLineItemValue('item', 'line'))   
    if (recType == 'salesorder') {
        var type = nlapiGetCurrentLineItemValue('item', 'custcol_action_type')
        if (type == '1' || type == '6' || block ) {
            nlapiSetLineItemDisabled('item', 'rate', true, nlapiGetCurrentLineItemValue('item', 'line'))
            nlapiSetLineItemDisabled('item', 'quantity', true, nlapiGetCurrentLineItemValue('item', 'line'))
            nlapiSetLineItemDisabled('item', 'amount', true, nlapiGetCurrentLineItemValue('item', 'line'))
            nlapiSetLineItemDisabled('item', 'item', true, nlapiGetCurrentLineItemValue('item', 'line'))
            return true;
        }
    }
    return true     
}
function _dev_validateLine(type) {
    var recType = nlapiGetRecordType();
    var recID = nlapiGetRecordId();
    if (recID == "" && recType == 'salesorder') {
        var createdfrom = nlapiGetFieldValue('createdfrom');
        if (!isNullOrEmpty(createdfrom)) {
            var block = true;
        }
        else var block = false;
        if (recType == 'salesorder' && block) {
            alert(' You are not allowed to update/add items lines.');
            return false;
        }
        else return true;
    }
    else if (recType == 'estimate') {
        var item = nlapiGetCurrentLineItemValue('item', 'item');
        var internal_only = nlapiLookupField('item', item, 'custitem_internal_only');
        var item = nlapiGetCurrentLineItemValue('item', 'item');
        var type = nlapiGetCurrentLineItemValue('item', 'custcol_action_type')
        if ((type == '1' || type == '6') && internal_only == 'T') {
            alert(' You are not allowed to update/add item not for sale.');
            return false;
        }
    }
    return true;
}
// validateInsert
function _dev_validateInsert(type) {
    var recType = nlapiGetRecordType();
    var createdfrom = nlapiGetFieldValue('createdfrom');
    if (!isNullOrEmpty(createdfrom)) {
        var block = true;
    }
    else var block = false;
    if (recType == 'salesorder' && block) {
        alert(' You are not allowed to add items lines.');
        return false;
    }
    else return true;
}
// validateDelete
function _dev_validateDelete(type) {
    var recType = nlapiGetRecordType();
    var createdfrom = nlapiGetFieldValue('createdfrom');
    if (!isNullOrEmpty(createdfrom)) {
        var block = true;
    }
    else var block = false;
    if (recType == 'salesorder' && block) {
        alert(' You are not allowed to remove items lines.');
        return false;
    }
    else return true;
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
