//60004
//M1300160
var shipstatus = nlapiGetFieldValue('shipstatus');
var message = '';

function beforSubmit(type) {  
    nlapiLogExecution('debug', 'type ', type)
    if (type != 'delete') {
        if (nlapiGetFieldValue('shipstatus') == 'C') {
            var cretedfrom = nlapiGetFieldValue('cretedfrom');
            var rec = nlapiLoadRecord('salesorder', cretedfrom);
            var sale_type = rec.getFieldValue('custbody_sale_type');  
            if (sale_type != '5') {
                var itemCount = nlapiGetLineItemCount('item');
                for (var i = 1; i <= itemCount; i++) {
                    var itemreceive = nlapiGetLineItemValue('item', 'itemreceive', i);
                    if (itemreceive == 'T') {
                        var item = nlapiGetLineItemValue('item', 'item', i);
                        var subrecord = nlapiViewLineItemSubrecord('item', 'inventorydetail', i);
                        if (subrecord != "" && subrecord != null) {
                            var invDetailID = subrecord.id;
                            if (invDetailID != "" && invDetailID != null) {
                                var serials = getInventoryDetails(invDetailID);
                                if (serials != "" && serials != null) {
                                    var serialCount = serials.split(',');
                                    for (var m = 0; m < serialCount.length; m++) {
                                        if (serialCount[m] != '') {
                                            nlapiLogExecution('debug', 'serialCount[m] ', serialCount[m])
                                            var ifAlredyExsist = serachCoffeeMachineEqu(item, serialCount[m]);
                                            if (ifAlredyExsist == '0') {
                                                message += 'שורה: ' + i + ' סריאלי: ' + serialCount[m] + '\n';
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }
    }
        if (message != '') {
           // alert('לא ניתן לבצע משלוח. \nלא קיים כרטיס ציוד מכונה עבור סריאלי\n' + message)
            throw nlapiCreateError("ERROR", 'לא ניתן לבצע משלוח. \nלא קיים כרטיס ציוד מכונה עבור סריאלי\n' + message, false);
        }
}
function getInventoryDetails(invDetailID) {
    var serials = "";
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID ));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));

    count = 0;
    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    if (results != null) {
        results.forEach(function (line) {
            var inventname = line.getValue('inventorynumber', 'inventorynumber');

            serials += inventname + ",";
            count++;
        });
    }
    //nlapiLogExecution('debug', ' serials serials', serials);
    return serials;
}
function serachCoffeeMachineEqu(item, serial) {

    var filtersInvoice = new Array();
    filtersInvoice[0] = new nlobjSearchFilter('custrecord_coffee_equipment_item', null, 'anyof', item);
    filtersInvoice[1] = new nlobjSearchFilter('custrecord_inventory_number', null, 'is', getInventoryNumnerId(serial, item));

    var search = nlapiCreateSearch('customrecord_coffee_machine_equip', filtersInvoice, null);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    do {

        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    try {
        if (s.length > 0) return s[0].id
        else return 0;
    }
    catch (e) {
        return 0;
    }
    return 0;

}
function getInventoryNumnerId(serial, item) {
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('inventorynumber', null, 'is', serial));
    filters.push(new nlobjSearchFilter('item', null, 'anyof', item));
    columns.push(new nlobjSearchColumn('internalid'));

    count = 0;
    results = nlapiSearchRecord('inventorynumber', null, filters, columns) || [];
    if (results != null) {
        return results[0].getValue('internalid');
    }
    return '';
}

//function shipstatusChange(type, name) {
//    debugger;
//    if (name == 'shipstatus' && nlapiGetFieldValue('shipstatus') == 'C' && nlapiGetRecordId() != "") {
//        var itemCount = nlapiGetLineItemCount('item');
//        for (var i = 1; i <= itemCount; i++) {
//            var itemreceive = nlapiGetLineItemValue('item', 'itemreceive', i);
//            if (itemreceive == 'T') {
//                var item = nlapiGetLineItemValue('item', 'item', i);
//                var subrecord = nlapiViewLineItemSubrecord('item', 'inventorydetail', i);
//                if (subrecord != "" && subrecord != null) {
//                    var invDetailID = subrecord.recordmanager.activeRow[0];
//                    var serials = getInventoryDetails(invDetailID);
//                    if (serials != "" && serials != null) {
//                        var serialCount = serials.split(',');
//                        for (var m = 0; m < serialCount.length; m++) {
//                            if (serialCount[m] != '') {
//                                var ifAlredyExsist = serachCoffeeMachineEqu(item, serialCount[m]);
//                                if (ifAlredyExsist == '0') {
//                                    message += 'שורה: ' + i + ' סריאלי: ' + serialCount[m] + '\n';
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//        }
//        if (message != '') {
//            alert('לא ניתן לבצע משלוח. \nלא קיים כרטיס ציוד מכונה עבור סריאלי\n' + message)
//            message = '';
//            nlapiSetFieldValue('shipstatus', shipstatus);
//        }

//    }
//}
//function SaveFF() {
//    debugger;
//    var itemCount = nlapiGetLineItemCount('item');
//    for (var i = 1; i <= itemCount; i++) {
//        var itemreceive = nlapiGetLineItemValue('item', 'itemreceive', i);
//        if (itemreceive == 'T') {
//            var item = nlapiGetLineItemValue('item', 'item', i);
//            var subrecord = nlapiViewLineItemSubrecord('item', 'inventorydetail', i);
//            if (subrecord != "" && subrecord != null) {
//                var assign = subrecord.getChildMachineRecordManager('inventoryassignment');
//                for (var m = 0; m < assign.activeRow.length; m++) {
//                    fieldIdx = assign.fieldNames.indexOf('issueinventorynumber');
//                    if (fieldIdx != -1) {
//                        serialRec = assign.activeRow[m][fieldIdx];
//                        if (!isNullOrEmpty(serialRec)) {
//                            var ifAlredyExsist = serachCoffeeMachineEqu(serialRec);
//                            if (ifAlredyExsist == '0') {
//                                var rec = nlapiLoadRecord('inventorynumber', serialRec);
//                                var serial = rec.getFieldValue('inventorynumber')
//                                message += 'שורה: ' + i + ' סריאלי: ' + serial + '\n';
//                            }
//                        }
//                    }
//                }
//            }
//        }
//    }
//    if (message != '') {
//        alert('לא ניתן לבצע משלוח. \nלא קיים כרטיס ציוד מכונה עבור סריאלי\n' + message)
//        message = '';
//        return false;
//    }
//    return true;
//}

