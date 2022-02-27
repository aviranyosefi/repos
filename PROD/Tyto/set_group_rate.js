/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

define([],
    function () {
        function beforeSubmit(context) {
            var rec = context.newRecord;
            var lineCount = rec.getLineCount({ sublistId: 'item' });
            for (var i = 0; i < lineCount; i++) {
                var itemtype = rec.getSublistValue({sublistId: 'item', fieldId: 'itemtype',line: i });
                if (itemtype == 'Group') {
                    var groupRate = 0;
                    for (var m = (i+1); m < lineCount; m++) {
                        var itemtypeLine = rec.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: m });
                        if (itemtypeLine != 'EndGroup') {
                            var rate = rec.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: m });
                            groupRate += Number(rate);
                        }
                        else {
                            log.debug('custcol_group_rate: ' + groupRate, "m: " + m + " i: " + i)
                            rec.setSublistValue({ sublistId: 'item', fieldId: 'custcol_group_rate', line: i, value: groupRate.toFixed(4) });
                            break;
                        }
                    }
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
            beforeSubmit: beforeSubmit,
        };
    });

