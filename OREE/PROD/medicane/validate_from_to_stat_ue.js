function beforesubmit() {
    var inv_count = nlapiGetLineItemCount('inventory');

    for (j = 1; j <= inv_count; j++) {
        nlapiSelectLineItem('inventory', j);
        var invDetail = nlapiViewLineItemSubrecord('inventory', 'inventorydetail', nlapiGetCurrentLineItemIndex('inventory'));
        nlapiLogExecution('DEBUG', 'invDetail', invDetail);
       


        invDetail.selectLineItem('inventoryassignment', 1);

        nlapiLogExecution('DEBUG', 'inventory status: ' + invDetail.getCurrentLineItemValue('inventoryassignment','inventorystatus'));
        if (!isNullOrEmpty(invDetail)) {
            var assign_count = invDetail.getLineItemCount('inventoryassignment')
            nlapiLogExecution('DEBUG', 'inventory count: ' + assign_count);

            for (i = 1; i <= assign_count; i++) {

                invDetail.selectLineItem('inventoryassignment', i);
                var fromStats = invDetail.getCurrentLineItemValue('inventoryassignment', 'inventorystatus');
                nlapiLogExecution('DEBUG', 'inventory from status: ' + fromStats);

                var toStats = invDetail.getCurrentLineItemValue('inventoryassignment', 'toinventorystatus');
                nlapiLogExecution('DEBUG', 'inventory to status: ' + toStats);
                if (fromStats != toStats) {
                    throw nlapiCreateError("ERROR", 'The From and To Status on inventory detail line has to be the same. line: ' + j + ' inventory detail line: '+ i, false);
                    return false;
                }
                
            }
            return true;
           /* var assign = invDetail.getChildMachineRecordManager('inventoryassignment');
            fromfieldIdx = assign.getFieldNames().indexOf('inventorystatus');
            tofieldIdx = assign.getFieldNames().indexOf('toinventorystatus');
            for (i = 1; i <= assign.rows.length; i++) {
                if (tofieldIdx != -1 && fromfieldIdx != -1) {// inventorystatus field idx on the assignment
                    if (assign.rows[i - 1][fromfieldIdx] == assign.rows[i - 1][tofieldIdx]) {
                        nlapiLogExecution('DEBUG', 'statuses on line ' + j + ' row: ' + i - 1 + ' are the same', assign.rows[i - 1][fromfieldIdx]);
                        continue;
                    }
                    else {
                        nlapiLogExecution('DEBUG', 'statuses on line ' + j + ' row: ' + i - 1 + ' are different', assign.rows[i - 1][fromfieldIdx]);
                        //return false;
                    }
                }
                else { // no inventorystatus field on the assignment
                    nlapiLogExecution('DEBUG', 'no inventorystatus field on the assignment', '');
                }
            }*/
        }
        else {
            nlapiLogExecution('DEBUG', 'no inventory detail on line: ' +j, '');
        }
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}