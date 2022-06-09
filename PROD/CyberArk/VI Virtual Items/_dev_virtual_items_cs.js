/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define([],
    function () {
        var rec;
        function pageInit(scriptContext) {
            rec = rec || scriptContext.currentRecord;
            var parentQty = rec.getValue('custrecord_multi_parent_qty')
            if (isNullOrEmpty(parentQty)) {
                rec.setValue('custrecord_multi_parent_qty', 1)
                updateViQty(1)
            }
        }
        function fieldChanged(scriptContext) {
            rec = rec || scriptContext.currentRecord;
            var name = scriptContext.fieldId;
            if (name == 'custrecord_multi_parent_qty') {
                var parentQty = rec.getValue('custrecord_multi_parent_qty')
                updateViQty(parentQty)
               
            }
        }
        function updateViQty(parentQty) {
            for (var i = 1; i < 10; i++) {
                var field = 'custrecord_vi' + i + '_qty'
                var val = rec.getValue(field);
                if (!isNullOrEmpty(val)) {
                    if (isNullOrEmpty(parentQty)) clcQty = '';
                    else clcQty = val * parentQty;
                    rec.setValue({
                        fieldId: field+ '_parent',
                        value: clcQty,
                        ignoreFieldChange: true,
                        forceSyncSourcing: true
                    });
                }
            }
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            pageInit: pageInit, 
            fieldChanged: fieldChanged
        };
    });