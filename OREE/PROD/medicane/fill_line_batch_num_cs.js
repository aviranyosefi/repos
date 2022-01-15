function fieldChanged(type, name) {

    if (name == 'custbody_medicane_lot' && !isNullOrEmpty(nlapiGetFieldValue('custbody_medicane_lot'))) {
        debugger;
        var batch = nlapiGetFieldValue('custbody_medicane_lot')
        nlapiSelectLineItem('item', 1, true)
        nlapiSetCurrentLineItemValue('item', 'custcol_medicane_lot', batch, true);
       
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}