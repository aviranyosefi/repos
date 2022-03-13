﻿/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/search'],
    function ( search ) {
        function fieldChanged(scriptContext) {
            debugger;
            var rec = scriptContext.currentRecord;
            var name = scriptContext.fieldId;
            if (name == 'custrecord_sp_item') {
                var isserialitem = false;
                var item = rec.getValue({ fieldId: 'custrecord_sp_item' });
                if (!isNullOrEmpty(item)) {
                    var fieldLookUp = search.lookupFields({ type: 'item', id: item, columns: ['isserialitem'] });
                    isserialitem = fieldLookUp.isserialitem;
                }
                rec.setValue('custrecord_sp_is_serialized', isserialitem);
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