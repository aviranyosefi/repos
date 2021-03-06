/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/search', 'N/ui/dialog'],
    function (search, dialog) {
        var DEFUALT_LOCATION = 30; // Dangot - Sales (מכירה)
        var rec;
        var firstEntity = null;
        function pageInit(scriptContext) {
            rec = rec || scriptContext.currentRecord;
            var recType = rec.type;
            if (recType == 'salesorder' || recType == 'supportcase') {
                fieldId = 'company'
                if (recType == 'salesorder') fieldId = 'entity'
                debugger;
                checkEntityData(fieldId);
            }
        }
        function fieldChanged(scriptContext) {
            debugger;
            rec = rec || scriptContext.currentRecord;
            var recType = rec.type;
            var sublistId = scriptContext.sublistId;
            var fieldId = scriptContext.fieldId;
            if (sublistId == 'item' && fieldId == 'custcol_end_customer' && (recType == 'salesorder' || recType == 'estimate')) {
                var end_customer = rec.getCurrentSublistValue('item', 'custcol_end_customer');
                var ismultishipto = rec.getValue('ismultishipto');
                if (!isNullOrEmpty(end_customer) && ismultishipto) {
                    var addrressId = getOtherNameAddress(end_customer)
                    if (!isNullOrEmpty(addrressId)) {
                        rec.setCurrentSublistValue('item', 'shipaddress', addrressId);
                    }
                    else {
                        let options = {
                            title: 'There is no address for OTHER NAME',
                            message: 'There is no address for OTHER NAME'
                        };
                        function success() {
                            rec.setCurrentSublistValue('item', 'shipaddress', '');
                            return false;
                        }
                        dialog.alert(options).then(success)
                        //alert('The selected item is connected to account ' + accountData.name + ' that is under budgetary control by account and ' + fieldForCheck + '.\nPlease enter a ' + fieldForCheck + '.')
                        return false;
                    }
                }
            }
            else if (fieldId == 'custbody_end_customer' && (recType == 'salesorder' || recType == 'estimate')) {
              
                var end_customer = rec.getValue('custbody_end_customer');
                if (!isNullOrEmpty(end_customer)) {
                    var addrressId = getOtherNameAddress(end_customer)
                    if (!isNullOrEmpty(addrressId)) {
                        rec.setValue('shipaddresslist', addrressId);
                    }
                }
            }
            //else if ((fieldId == 'entity' && (recType == 'salesorder' || recType == 'estimate' )) || (fieldId == 'company' && recType == 'supportcase')) {
            //    debugger;
            //    checkEntityData(fieldId);
            //}
            return true;
        }
        function postSourcing(scriptContext) {
            rec = rec || scriptContext.currentRecord;
            var recType = rec.type;
            var sublistId = scriptContext.sublistId;
            var fieldId = scriptContext.fieldId;
            if (sublistId == 'item' && fieldId == 'item' && (recType == 'salesorder' || recType == 'estimate')) {
                debugger;
                var sale_type = rec.getValue('custbody_dangot_sale_type')
                if (sale_type == 1 || sale_type == 2 || sale_type == 3) {
                    rec.setCurrentSublistValue('item', 'inventorylocation', DEFUALT_LOCATION);
                }
            }
            else if ((fieldId == 'entity' && (recType == 'salesorder' || recType == 'estimate')) || (fieldId == 'company' && recType == 'supportcase')) {
                debugger;
                checkEntityData(fieldId);
            }
            return true;
        }
        function isNullOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function getOtherNameAddress(end_customer) {
            var customer_address_id = search.lookupFields({ type: 'othername', id: end_customer, columns: ['custentity_customer_address_id'] })['custentity_customer_address_id']
            if (customer_address_id.length > 0) {
                return customer_address_id[0].value;
            }
        }
        function checkEntityData(fieldId) {
            var entity = rec.getValue(fieldId);
            if (!isNullOrEmpty(entity) && firstEntity != entity) {
                firstEntity = entity;
                var customer_alerts = search.lookupFields({ type: search.Type.CUSTOMER, id: entity, columns: ['custentity_dangot_customer_alerts'] }).custentity_dangot_customer_alerts;
                if (!isNullOrEmpty(customer_alerts)) {
                    let options = {
                        title: '<p style="text-align:right;" dir="rtl">הערה ללקוח</p>',
                        message: '<p style="text-align:right;" dir="rtl">' + customer_alerts + '</p>'
                    };
                    dialog.alert(options)
                }
            }
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            postSourcing: postSourcing,
        };
    });


