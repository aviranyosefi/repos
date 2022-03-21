/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/search', 'N/ui/dialog'],
    function (search, dialog) {
        function fieldChanged(scriptContext) {
            var rec = scriptContext.currentRecord;
            var sublistId = scriptContext.sublistId;
            var fieldId = scriptContext.fieldId;
            if (sublistId == 'item' && fieldId == 'custcol_end_customer') {
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
            else if (fieldId == 'custbody_end_customer') {
                var end_customer = rec.getValue('custbody_end_customer');
                if (!isNullOrEmpty(end_customer)) {
                    var addrressId = getOtherNameAddress(end_customer)
                    if (!isNullOrEmpty(addrressId)) {
                        rec.setValue('shipaddresslist', addrressId);
                    }
                }

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
      
        return {
            fieldChanged: fieldChanged,         
        };
    });


