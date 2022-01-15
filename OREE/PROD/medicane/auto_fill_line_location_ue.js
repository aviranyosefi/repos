
function beforeSubmit() {
    lineCount = nlapiGetLineItemCount('inventory');
    for (i = 1; i <= lineCount; i++) {
        nlapiSetLineItemValue('inventory', 'location', i, nlapiGetFieldValue('adjlocation'));
        nlapiSetLineItemValue('inventory', 'custcol_medicane_lot', i, nlapiGetFieldValue('custbody_medicane_lot'));
    }
}