/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([],
    function () {
        function beforeSubmit(context) {
            try {
                if (context.type != context.UserEventType.DELETE) {
                    var rec = context.newRecord;
                    var ismultishipto = rec.getValue('ismultishipto');
                    if (!ismultishipto) {
                        var end_customer = rec.getValue('custbody_end_customer');
                        if (!isNullOrEmpty(end_customer)) {
                            var lineCount = rec.getLineCount({ sublistId: 'item' });
                            for (var i = 0; i < lineCount; i++) {
                                var item_display = rec.getSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'item_display',
                                    line: i,
                                });
                                if (item_display != 'End of Group') {
                                    rec.setSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'custcol_end_customer',
                                        line: i,
                                        value: end_customer
                                    });

                                }                                                        
                            }
                        }                       
                    }
                }
            } catch (e) { }
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            beforeSubmit: beforeSubmit,
        };
    });