/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/task', 'N/runtime'], 
    function (task, runtime) {
        var GLOBAL_SUBSIDIARIY = 14
        function beforeSubmit(scriptContext) {
            if (scriptContext.type != scriptContext.UserEventType.DELETE) {
                var rec = scriptContext.newRecord;
                var subsidiary = rec.getValue('subsidiary')
                if (subsidiary == GLOBAL_SUBSIDIARIY)
                    rec.setValue('directrevenueposting' , true)
            }
        }
        function afterSubmit(scriptContext) {
            if (scriptContext.type != scriptContext.UserEventType.DELETE) {
                if (runtime.executionContext === runtime.ContextType.USER_INTERFACE) {
                    var rec = scriptContext.newRecord;
                    var itemId = rec.id;
                    var scriptTask = task.create({
                        taskType: task.TaskType.MAP_REDUCE,
                        scriptId: 'customscript_update_purchase_price',
                        deploymentId: null,
                        params: {
                            'custscript_item_id': itemId
                        }
                    });
                    scriptTask.submit();  
                }                 
            }          
        }
            return {
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        };
    });
