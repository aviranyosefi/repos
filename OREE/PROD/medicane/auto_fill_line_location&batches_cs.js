
function FieldChanged(type, name, linenum) {
    if (name == 'item') {
        if (!isNullOrEmpty(nlapiGetFieldValue('adjlocation'))) {
            var header_location = nlapiGetFieldValue('adjlocation');
            nlapiSetCurrentLineItemValue('inventory', 'location', header_location);
            setTimeout(function () {
                nlapiSetCurrentLineItemValue('inventory', 'location', header_location);
            }, 500);
        }
        else {
            alert('Please enter value for Adjustment Location Field');
        }
        if (!isNullOrEmpty(nlapiGetFieldValue('custbody_medicane_lot'))) {
            var header_Batch = nlapiGetFieldValue('custbody_medicane_lot');
            nlapiSetCurrentLineItemValue('inventory', 'custcol_medicane_lot', header_Batch);
        }
        else if (!isNullOrEmpty(nlapiGetFieldValue('custbody_production_lot_in'))){
            var header_Lot = nlapiGetFieldValue('custbody_production_lot_in');
            nlapiSetCurrentLineItemValue('inventory', 'custcol_medicane_production_lot', header_Lot);
        }
        else {
            alert('Please enter value for Medicane Batch # or Production Lot Field');
        }
    }
    else if (name == 'adjlocation' && !isNullOrEmpty(nlapiGetFieldValue('adjlocation'))) {
        lineCount = nlapiGetLineItemCount('inventory');
        for (i = 1; i <= lineCount; i++) {
            nlapiSelectLineItem('invetory', i);
            if (nlapiGetCurrentLineItemIndex('inventory') == i) {
                nlapiSetCurrentLineItemValue('inventory', 'location', nlapiGetFieldValue('adjlocation'));
                nlapiCommitLineItem('invetory');
            }

            //nlapiSetLineItemValue('inventory', 'location', i, nlapiGetFieldValue('adjlocation'));
        } 
    }
    else if (name == 'custbody_medicane_lot' && !isNullOrEmpty(nlapiGetFieldValue('custbody_medicane_lot'))) {
        lineCount = nlapiGetLineItemCount('inventory');
        for (i = 1; i <= lineCount; i++) {
            nlapiSelectLineItem('invetory', i);
            if (nlapiGetCurrentLineItemIndex('inventory') == i) {
                nlapiSetCurrentLineItemValue('inventory', 'custcol_medicane_lot', nlapiGetFieldValue('custbody_medicane_lot'));
                nlapiCommitLineItem('invetory');
            }

            //nlapiSetLineItemValue('inventory', 'location', i, nlapiGetFieldValue('adjlocation'));
        }
    }
    else if (name == 'custbody_production_lot_in' && !isNullOrEmpty(nlapiGetFieldValue('custbody_production_lot_in'))) {
        lineCount = nlapiGetLineItemCount('inventory');
        for (i = 1; i <= lineCount; i++) {
            nlapiSelectLineItem('invetory', i);
            if (nlapiGetCurrentLineItemIndex('inventory') == i) {
                nlapiSetCurrentLineItemValue('inventory', 'custcol_medicane_production_lot', nlapiGetFieldValue('custbody_production_lot_in'));
                nlapiCommitLineItem('invetory');
            }

            //nlapiSetLineItemValue('inventory', 'location', i, nlapiGetFieldValue('adjlocation'));
        }
    }
}

function saverecord() {
    lineCount = nlapiGetLineItemCount('inventory');
    for (i = 1; i <= lineCount; i++) {
        nlapiSelectLineItem('invetory', i, false);
        if (nlapiGetCurrentLineItemIndex('inventory') == i) {
            nlapiSetCurrentLineItemValue('inventory', 'location', nlapiGetFieldValue('adjlocation'));
            nlapiSetCurrentLineItemValue('inventory', 'custcol_medicane_production_lot', nlapiGetFieldValue('custbody_production_lot_in'));
            nlapiSetCurrentLineItemValue('inventory', 'custcol_medicane_lot', nlapiGetFieldValue('custbody_medicane_lot'));
            nlapiCommitLineItem('invetory');
        }


        //nlapiSetLineItemValue('inventory', 'location', i, nlapiGetFieldValue('adjlocation'));
    }
    return true;
}

function lineinit() {
    console.log('line init');
    var header_location = nlapiGetFieldValue('adjlocation');

    if (!isNullOrEmpty(header_location)) {
        nlapiSetCurrentLineItemValue('inventory', 'location', header_location, true); 
    }
    else {
        return true;
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

///
//nlapiSetFieldValue('subsidiary', '9')
//nlapiSetFieldValue('custbody_adjustment_reason', '4')
//nlapiSetFieldValue('adjlocation', '12')
