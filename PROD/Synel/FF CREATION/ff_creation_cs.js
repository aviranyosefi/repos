/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/ui/dialog', 'N/search'],
    function (currentRecord, dialog, search) {
        var rec;
        function fieldChanged(scriptContext) {
            debugger;
            rec = rec || currentRecord.get();
            fieldId = scriptContext.fieldId
            if (fieldId == 'custcol_create_single_itf') {
                var create_single_itf = rec.getCurrentSublistValue('item', fieldId);
                if (create_single_itf == true) {
                    var item = rec.getCurrentSublistValue('item', 'item');
                    if (!isNullOrEmpty(item)) {
                        var msg = checkMandatoryFields(item)
                        if (!isNullOrEmpty(msg)) {
                            let options = {
                                title: 'Please enter a mandatory fields',
                                message: msg
                            };
                            function success() {
                                rec.setCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: fieldId,
                                    value: false,
                                    fireSlavingSync: true,
                                    ignoreFieldChange: true
                                });
                            }
                            dialog.alert(options).then(success)
                            return false;
                        }
                    }
                }
            }
        }
        function checkMandatoryFields(item) {
            var msg = '';
            var itemData = search.lookupFields({ type: search.Type.ITEM, id: item, columns: ['custitem_case_indicator'] });
            var case_indicator = itemData.custitem_case_indicator
            if (!case_indicator) { msg += 'CASE INDICATOR MUST BE CHECKED<br>' }
            var qty = rec.getCurrentSublistValue('item', 'quantity');
            if (qty != 1) { msg += 'QUANTITY MUST BE EQUAL TO 1<br>' }
            var location = rec.getCurrentSublistValue('item', 'location');
            if (isNullOrEmpty(location)) { msg += 'LOCATION MUST BE POPULATE<br>' }
            var isserial = rec.getCurrentSublistValue('item', 'isserial');
            if (isserial == 'T') {
                var inventorydetail = nlapiViewCurrentLineItemSubrecord('item', 'inventorydetail')
                if (isNullOrEmpty(inventorydetail)) { msg += 'INVENTORY DETAILS MUST BE POPULATE<br>' }
            }

            return msg;
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
