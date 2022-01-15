function validateLine() {
    var invDetail = nlapiViewLineItemSubrecord('inventory', 'inventorydetail', nlapiGetCurrentLineItemIndex('inventory'));

    if (!isNullOrEmpty(invDetail)) {
        var assign = invDetail.getChildMachineRecordManager('inventoryassignment');
        fromfieldIdx = assign.getFieldNames().indexOf('inventorystatus');
        tofieldIdx = assign.getFieldNames().indexOf('toinventorystatus');
        for (i = 1; i <= assign.rows.length; i++) { 
            if (tofieldIdx != -1 && fromfieldIdx != -1) {// inventorystatus field idx on the assignment
                if (assign.rows[i - 1][fromfieldIdx] == assign.rows[i - 1][tofieldIdx]) {
                    continue;
                }
                else {
                    alert('The From and To Status on inventory detail line has to be the same');
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
        return true;
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}