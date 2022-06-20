/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([],
    function () {   
        var GLOBAL_SUBSIDIARIY = 14
        function beforeSubmit(context) {
            try {
                if (context.type != context.UserEventType.DELETE) { // TODO ADD ONLY IN TYPE CREATE
                    var rec = context.newRecord;
                    var recType = rec.type;
                    if (recType == 'employee') {
                        var subsidiary = rec.getValue('subsidiary');
                        if (subsidiary == GLOBAL_SUBSIDIARIY ) {                       
                            var lineCount = rec.getLineCount({ sublistId: 'salesteam' });
                            for (var j = lineCount; j >= 0; j--) {
                                rec.removeLine({
                                    sublistId: 'salesteam',
                                    line: j,
                                    ignoreRecalc: true
                                });                           
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