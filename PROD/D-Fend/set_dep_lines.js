/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

define(['N/record'],
    function (record) { 
        function beforeSubmit(context) {
            try {
                if (context.type == context.UserEventType.CREATE ) {
                    var rec = context.newRecord;               
                    var dept = rec.getValue('custbody_dept_to_lines');
                    if (!isNullOrEmpty(dept)) {
                        var count = rec.getLineCount({ sublistId: 'line' });
                        for (var i = 0; i < count; i++) {
                            rec.setSublistValue({ sublistId: 'line', fieldId: 'department', line: i, value: dept });
                        }
                    }   
                }
            
            } catch (e) {

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

