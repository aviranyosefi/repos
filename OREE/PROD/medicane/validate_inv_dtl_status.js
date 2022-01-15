function validateLine() {
    var invDetail = nlapiViewLineItemSubrecord('inventory', 'inventorydetail', nlapiGetCurrentLineItemIndex('inventory'));

    if (!isNullOrEmpty(invDetail)) {
        var allowd = nlapiLookupField('location', nlapiGetFieldValue('location'), 'custrecord_available_status');
        if (!isNullOrEmpty(allowd)) {
            var assign = invDetail.getChildMachineRecordManager('inventoryassignment');
            for (i = 1; i <= assign.rows.length; i++) {
                fieldIdx = assign.fieldNames.indexOf('inventorystatus');
                if (fieldIdx != -1) {// inventorystatus field idx on the assignment
                    fromStatus = assign.rows[i-1][fieldIdx];
                    isAllowed = allowd.indexOf(fromStatus);
                    if (isAllowed == -1) {
                        continue;
                    }
                    else {
                        alert('The From Status on inventory detail line: '+ i +' is not allowed from this location');
                        return false;
                    }
                }
                else { // no inventorystatus field on the assignment
                    return true;
                }
            }
            return true;
        }
        else {
            alert('there is no allowd statuses for this location');
            return false;
        }

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