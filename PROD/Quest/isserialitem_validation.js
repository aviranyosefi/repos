/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/search'],
    function ( search ) {
        function fieldChanged(scriptContext) {
            debugger;
            var rec = scriptContext.currentRecord;
            var name = scriptContext.fieldId;
            if (name == 'custrecord_spare_part_item') {
                var isserialitem = false;
                var item = rec.getValue({ fieldId: 'custrecord_spare_part_item' });
                if (!isNullOrEmpty(item)) {
                    var fieldLookUp = search.lookupFields({ type: 'item', id: item, columns: ['isserialitem'] });
                    isserialitem = fieldLookUp.isserialitem;
                }
                rec.setValue('custrecord_sp_is_serialized', isserialitem);
            }
            else if (name == 'custevent_replacing_item') {
                var isserialitem = false;
                var item = rec.getValue({ fieldId: 'custevent_replacing_item' });
                if (!isNullOrEmpty(item)) {
                    var fieldLookUp = search.lookupFields({ type: 'item', id: item, columns: ['isserialitem'] });
                    isserialitem = fieldLookUp.isserialitem;
                }
                rec.setValue('custevent_is_serialized', isserialitem);
            }
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