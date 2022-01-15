/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/search', 'N/ui/dialog'],
    function (search, dialog) {
        function fieldChanged(scriptContext) {
            debugger;
            var rec = scriptContext.currentRecord;
            var sublistId = scriptContext.sublistId;
            var fieldId = scriptContext.fieldId;
            if (sublistId == 'item' && fieldId == 'custcol_end_customer') {
                var end_customer = rec.getCurrentSublistValue('item', 'custcol_end_customer');
                var ismultishipto = rec.getValue('ismultishipto');
                if (!isNullOrEmpty(end_customer) && ismultishipto == true) {
                    var customer_address_id = search.lookupFields({ type: 'othername', id: end_customer, columns: ['custentity_customer_address_id'] })['custentity_customer_address_id']
                    if (customer_address_id.length >0) {
                        rec.setCurrentSublistValue('item', 'shipaddress', customer_address_id[0].value);
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
            return true;
        }         
        function isNullOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
      
        return {
            fieldChanged: fieldChanged,         
        };
    });


