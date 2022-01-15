var tran_id;
var context = nlapiGetContext();
var rec;
function create_coffee_machine_equ() { 
    try {
        tran_id = context.getSetting('SCRIPT', 'custscript_tran_id');
        var tran_type = context.getSetting('SCRIPT', 'custscript_tran_type');
        nlapiLogExecution('debug', 'tran_type: ' + tran_type, 'tran_id: ' + tran_id)
        rec = nlapiLoadRecord(tran_type, tran_id);
        var ordertype = rec.getFieldValue('ordertype');
        nlapiLogExecution('debug', 'ordertype ', ordertype);
        if (tran_type == 'itemreceipt' &&  ordertype != 'TrnfrOrd') {
            var itemCount = rec.getLineItemCount('item');
            if (ordertype == 'PurchOrd') {
                var data = [];
                var exchangerate = rec.getFieldValue('exchangerate');
                for (var i = 1; i <= itemCount; i++) {
                    Context(context);
                    nlapiLogExecution('debug', 'line ', i);
                    var item = rec.getLineItemValue('item', 'item', i);
                    var itemName = rec.getLineItemText('item', 'item', i);
                    var location = rec.getLineItemValue('item', 'location', i);
                    var rate = rec.getLineItemValue('item', 'rate', i);
                    var is_mobile = nlapiLookupField('item', item, 'custitem_is_mobile');
                    var machine_input_voltage = nlapiLookupField('item', item, 'custitem_machine_input_voltage');
                    var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
                    if (subrecord != "" && subrecord != null) {
                        nlapiLogExecution('debug', 'subrecord()', subrecord.id)
                        var invDetailID = subrecord.id;
                        if (invDetailID != "" && invDetailID != null) {
                            var serials = getInventoryDetails(invDetailID);
                            if (serials != "" && serials != null) {
                                var serialCount = serials.split(',');
                                nlapiLogExecution('debug', 'serialCount length() ' + serialCount.length, serials);
                                var itemType = nlapiLookupField('item', item, 'custitem_second_level_category')
                                var itemDescription = nlapiLookupField('item', item, 'description')
                                //var itemDisplayname = nlapiLookupField('item', item, 'displayname')

                                for (var m = 0; m < serialCount.length; m++) {
                                    if (serialCount[m] != '') {
                                        var ifAlredyExsist = serachCoffeeMachineEqu(item, serialCount[m]);
                                        if (ifAlredyExsist > 0) {
                                            nlapiLogExecution('debug', 'Coffee Machine Equipment ifAlredyExsist ', ifAlredyExsist);
                                        }
                                        else {
                                            data.push({         /// for serial items
                                                name: serialCount[m] + ' ' + itemDescription,
                                                type: itemType,
                                                serial: serialCount[m],
                                                item: item,
                                                description: itemDescription,
                                                location: location,
                                                rate: exchangerate * rate,
                                                is_mobile: is_mobile,
                                                machine_input_voltage: machine_input_voltage
                                            });
                                        }
                                    }// if (serialCount[m] != '')
                                } // for (var m = 0; m < serialCount.length; m++)

                            }//if (serials != "" && serials != null)

                        }// if (invDetailID != "" && invDetailID != null) 

                    } //if (subrecord != "" && subrecord != null) 

                } //  for (var i = 1; i <= itemCount; i++)
                if (data.length > 0) {
                    //try { nlapiScheduleScript('customscript_create_install_base_ss', 'customdeploy_create_install_base_ss_dep', { custscript_data: JSON.stringify(data) }) } catch (e) { }
                    createCoffeeMachineEqu(data);
                }
            }// if (ordertype == 'PurchOrd')
            else if (ordertype == 'RtnAuth') {
                for (var i = 1; i <= itemCount; i++) {
                    Context(context);
                    //var location = rec.getFieldValue('location');
                    var location = rec.getLineItemValue('item', 'location', i);
                    nlapiLogExecution('debug', 'line ', i);
                    var item = rec.getLineItemValue('item', 'item', i);
                    var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
                    if (subrecord != "" && subrecord != null) {
                        nlapiLogExecution('debug', 'subrecord()', subrecord.id)
                        var invDetailID = subrecord.id;
                        if (invDetailID != "" && invDetailID != null) {
                            var serials = getInventoryDetails(invDetailID);
                            if (serials != "" && serials != null) {
                                var serialCount = serials.split(',');
                                nlapiLogExecution('debug', 'serialCount length() ' + serialCount.length, serials);
                                for (var m = 0; m < serialCount.length; m++) {
                                    if (serialCount[m] != '') {
                                        var ifAlredyExsist = serachCoffeeMachineEqu(item, serialCount[m]);
                                        if (ifAlredyExsist > 0) {
                                            nlapiLogExecution('debug', 'Coffee Machine Equipment ', ifAlredyExsist);
                                            //updateCoffeeMachineEqu(ifAlredyExsist, 'RtnAuth', location, '3277', '4')//SB
                                            updateCoffeeMachineEqu(ifAlredyExsist, 'RtnAuth', location, '217', '4') // PROD
                                            
                                        }
                                    }// if (serialCount[m] != '')
                                } // for (var m = 0; m < serialCount.length; m++)
                            }
                        }
                    }
                }
            } //else if (ordertype == 'RtnAuth')
        }// if (tran_type == 'itemreceipt')
        else if (tran_type == 'inventorytransfer') {
            var itemCount = rec.getLineItemCount('inventory');
            for (var i = 1; i <= itemCount; i++) {
                nlapiLogExecution('debug', 'line ', i);
                Context(context);
                var location = rec.getFieldValue('transferlocation');
                var item = rec.getLineItemValue('inventory', 'item', i);
                var subrecord = rec.viewLineItemSubrecord('inventory', 'inventorydetail', i);
                if (subrecord != "" && subrecord != null) {
                    nlapiLogExecution('debug', 'subrecord()', subrecord.id)
                    var invDetailID = subrecord.id;
                    if (invDetailID != "" && invDetailID != null) {
                        var serials = getInventoryDetails(invDetailID);
                        if (serials != "" && serials != null) {
                            var serialCount = serials.split(',');
                            nlapiLogExecution('debug', 'serialCount length() ' + serialCount.length, serials);
                            for (var m = 0; m < serialCount.length; m++) {
                                if (serialCount[m] != '') {
                                    var ifAlredyExsist = serachCoffeeMachineEqu(item, serialCount[m]);
                                    if (ifAlredyExsist > 0) {
                                        nlapiLogExecution('debug', 'Coffee Machine Equipment ', ifAlredyExsist);
                                        updateCoffeeMachineEqu(ifAlredyExsist, 'itfAndInvTran', location, null, null);
                                    }
                                }// if (serialCount[m] != '')
                            } // for (var m = 0; m < serialCount.length; m++)
                        }
                    }
                }
            }
        } //else if (tran_type == 'inventorytransfer')        
        else if (tran_type == 'itemreceipt' && ordertype == 'TrnfrOrd') {
            var itemCount = rec.getLineItemCount('item');
            for (var i = 1; i <= itemCount; i++) {
                Context(context);             
                nlapiLogExecution('debug', 'line ', i);
                var item = rec.getLineItemValue('item', 'item', i);
                var location = rec.getLineItemValue('item', 'location', i);            
                var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);              
                if (subrecord != "" && subrecord != null) {
                    nlapiLogExecution('debug', 'subrecord()', subrecord.id)
                    var invDetailID = subrecord.id;
                    if (invDetailID != "" && invDetailID != null) {
                        var serials = getInventoryDetails(invDetailID);
                        if (serials != "" && serials != null) {
                            var serialCount = serials.split(',');
                            nlapiLogExecution('debug', 'serialCount length() ' + serialCount.length, serials);
                            for (var m = 0; m < serialCount.length; m++) {
                                if (serialCount[m] != '') {
                                    var ifAlredyExsist = serachCoffeeMachineEqu(item, serialCount[m]);
                                    if (ifAlredyExsist > 0) {
                                        nlapiLogExecution('debug', 'Coffee Machine Equipment ', ifAlredyExsist);
                                        updateCoffeeMachineEqu(ifAlredyExsist, 'TrnfrOrd', location, null, null)
                                    }
                                }// if (serialCount[m] != '')
                            } // for (var m = 0; m < serialCount.length; m++)
                        }
                    }
                }
            }
        }
        else if (tran_type == 'itemfulfillment' && ordertype == 'SalesOrd') {
            var shipstatus = rec.getFieldValue('shipstatus')
            if (shipstatus == 'C') {
                var itemCount = rec.getLineItemCount('item');
                for (var i = 1; i <= itemCount; i++) {
                    Context(context);
                    nlapiLogExecution('debug', 'line ', i);
                    var customer = rec.getFieldValue('entity')
                    var item = rec.getLineItemValue('item', 'item', i);
                    var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
                    if (subrecord != "" && subrecord != null) {
                        nlapiLogExecution('debug', 'subrecord()', subrecord.id)
                        var invDetailID = subrecord.id;
                        if (invDetailID != "" && invDetailID != null) {
                            var serials = getInventoryDetails(invDetailID);
                            if (serials != "" && serials != null) {
                                var serialCount = serials.split(',');
                                nlapiLogExecution('debug', 'serialCount length() ' + serialCount.length, serials);
                                for (var m = 0; m < serialCount.length; m++) {
                                    if (serialCount[m] != '') {
                                        var ifAlredyExsist = serachCoffeeMachineEqu(item, serialCount[m]);
                                        if (ifAlredyExsist > 0) {
                                            nlapiLogExecution('debug', 'Coffee Machine Equipment ', ifAlredyExsist);
                                            updateCoffeeMachineEqu(ifAlredyExsist, 'SalesOrd', '', customer, null);
                                        }
                                    }// if (serialCount[m] != '')
                                } // for (var m = 0; m < serialCount.length; m++)
                            }
                        }
                    }
                }
            }      
        }//else if (tran_type == 'itemfulfillment' && ordertype == 'SalesOrd') 
        else if (tran_type == 'supportcase') {
            var status = rec.getFieldValue('status');
            var machine = rec.getFieldValue('custevent_machine');
            var internal_case_type = rec.getFieldValue('custevent_internal_case_type');
            var machine_location = rec.getFieldValue('custevent_machine_location');           
            if (status == '2') { // 4.4
                var newStatus = '3'; // בשיפוץ
                var supportcase = 'supportcase'
            }
            else if (status == '6' && (internal_case_type == '6' || internal_case_type == '10')) { //4.5
                var newStatus = '2'; // משופץ
                var supportcase = '4.5'
                
            }
            else if (status == '6' && internal_case_type == '12') { // 4.6
                var newStatus = '5'; // מושבת
                var supportcase = '4.6'
            }
            else if (status == '6' && (internal_case_type == '1' || internal_case_type == '8' || internal_case_type == '9')) { // 4.8           
                var supportcase = 'supportcase2';
                var newStatus = '';
            }
            else if (status == '6' && internal_case_type != '2') { // 4.9
                var supportcase = 'supportcase1';
                var newStatus = '';
            }
            updateCoffeeMachineEqu(machine, supportcase, machine_location, null, newStatus);
            

        } //   else if (tran_type == 'supportcase')
        else if (tran_type == 'inventoryadjustment') {
            var adjustment_reason = rec.getFieldValue('custbody_adjustment_reason');
            if (adjustment_reason == '2') {
                var itemCount = rec.getLineItemCount('inventory');
                for (var i = 1; i <= itemCount; i++) {
                    nlapiLogExecution('debug', 'line ', i);
                    Context(context);
                    var item = rec.getLineItemValue('inventory', 'item', i);
                    var subrecord = rec.viewLineItemSubrecord('inventory', 'inventorydetail', i);
                    if (subrecord != "" && subrecord != null) {
                        nlapiLogExecution('debug', 'subrecord()', subrecord.id)
                        var invDetailID = subrecord.id;
                        if (invDetailID != "" && invDetailID != null) {
                            var serials = getInventoryDetails(invDetailID);
                            if (serials != "" && serials != null) {
                                var serialCount = serials.split(',');
                                nlapiLogExecution('debug', 'serialCount length() ' + serialCount.length, serials);
                                for (var m = 0; m < serialCount.length; m++) {
                                    if (serialCount[m] != '') {
                                        var ifAlredyExsist = serachCoffeeMachineEqu(item, serialCount[m]);
                                        if (ifAlredyExsist > 0) {
                                            nlapiLogExecution('debug', 'Coffee Machine Equipment ', ifAlredyExsist);
                                            updateCoffeeMachineEqu(ifAlredyExsist, 'inventoryadjustment', '', '', '');
                                        }
                                    }// if (serialCount[m] != '')
                                } // for (var m = 0; m < serialCount.length; m++)
                            }
                        }
                    }
                }
            }          
        } // else if (tran_type == 'inventoryadjustment')
    }// try
    catch (e) {
        nlapiLogExecution('debug', 'create_coffee_machine_equ error ' , e);
    }
 
}

function createCoffeeMachineEqu(data) {
    try {
        nlapiLogExecution('debug', ' data length: ' + data.length, JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {

            var CM_rec = nlapiCreateRecord('customrecord_coffee_machine_equip');

            CM_rec.setFieldValue('name', data[i].name);
            //CM_rec.setFieldValue('custrecord_equipment_type', data[i].type); // סוג מיוד
            CM_rec.setFieldValue('custrecord_inventory_number', getInventoryNumnerId(data[i].serial, data[i].item)); 
            CM_rec.setFieldValue('custrecord_coffee_equipment_item', data[i].item); // מק"ט
            CM_rec.setFieldValue('custrecord_equipment_description', data[i].description); // תיאור
            CM_rec.setFieldValue('custrecord_equipment_location_status', 1); //  במלאי <-סטטוס מיקום
            CM_rec.setFieldValue('custrecord_equipment_status', 1); // חדש <-סטטוס מצב
            CM_rec.setFieldValue('custrecord_equipment_location', data[i].location); // מחסן
            CM_rec.setFieldValue('custrecord_creation_date', new Date()); 
            CM_rec.setFieldValue('custrecord_purchase_price', data[i].rate);
            CM_rec.setFieldValue('custrecord_mobile', data[i].is_mobile); 
            CM_rec.setFieldValue('custrecord_input_voltage', data[i].machine_input_voltage); 
            CM_rec.setFieldValue('custrecord_customer', '217');// prod
            //CM_rec.setFieldValue('custrecord_customer', '3277');
            
            var id = nlapiSubmitRecord(CM_rec);
            nlapiLogExecution('debug', ' id', id);
        }

    } catch (e) {
        nlapiLogExecution('ERROR', 'error createCoffeeMachineEqu - data :' + data[i], e);
    }
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

function updateCoffeeMachineEqu(id, type, location, customer, status) {
    try {
        nlapiLogExecution('debug', 'type ', type);
        var rec = nlapiLoadRecord('customrecord_coffee_machine_equip', id);
        if (type == 'RtnAuth') {
            rec.setFieldValue('custrecord_equipment_location_status', '1') // במלאי
            rec.setFieldValue('custrecord_equipment_location', location)
            rec.setFieldValue('custrecord_customer', customer) // שטראוס קפה - פנימי
            rec.setFieldValue('custrecord_equipment_status', status) // ממתין לשיפוץ
            rec.setFieldValue('custrecord_location_at_customer', '') 
        }
        else if (type == 'itfAndInvTran') {
            rec.setFieldValue('custrecord_equipment_location', location)

        }
        else if (type == 'SalesOrd') {
            rec.setFieldValue('custrecord_equipment_location', location);
            rec.setFieldValue('custrecord_equipment_location_status', '2') // אצל לקוח
            rec.setFieldValue('custrecord_customer', customer)

        }
        else if (type == 'inventoryadjustment') {
            rec.setFieldValue('custrecord_equipment_location', location);
            rec.setFieldValue('custrecord_equipment_location_status', '5') // נגרע
            rec.setFieldValue('custrecord_customer', customer)
            rec.setFieldValue('custrecord_equipment_status', status)

        }
        else if (type == 'supportcase') {
            rec.setFieldValue('custrecord_equipment_status', status)       
        }
        else if (type == '4.5') {
            rec.setFieldValue('custrecord_equipment_status', status)         
        }
        else if (type == '4.6') {
            rec.setFieldValue('custrecord_equipment_status', status);      
            rec.setFieldValue('custrecord_telemetry', 'F');
            rec.setFieldValue('custrecord_telemetry_serial_number', '');         
        }
        else if (type == 'supportcase1') { // 4.9
            var currLocation = rec.getFieldValue('custrecord_location_at_customer');
            if (currLocation != location) {
                rec.setFieldValue('custrecord_location_at_customer', location)
            }       
        }
        else if (type == 'supportcase2') { // 4.8           
            var supportcaseRec = nlapiLoadRecord('supportcase', tran_id);
            rec.setFieldValue('custrecord_last_installation_date', supportcaseRec.getFieldValue('enddate').split(' ')[0]);
            if (rec.getFieldValue('custrecord_equipment_status') == '1') {// חדש
                rec.setFieldValue('custrecord_first_installation_date', supportcaseRec.getFieldValue('enddate').split(' ')[0]);
            }
            var currLocation = rec.getFieldValue('custrecord_location_at_customer');
            if (currLocation != location) {
                rec.setFieldValue('custrecord_location_at_customer', location);
            }          
        }
        else if (type == 'TrnfrOrd') {
            rec.setFieldValue('custrecord_equipment_location', location)
        }
        nlapiSubmitRecord(rec, null, true);
    } catch (e) {
        nlapiLogExecution('debug', 'updateCoffeeMachineEqu error ', e);
    }

}

function getInventoryDetails(invDetailID) {
    var serials = "";
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
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

function Context(context) {
    if (context.getRemainingUsage() < 150) {
        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
