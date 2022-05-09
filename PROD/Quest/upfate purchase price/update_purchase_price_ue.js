/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/task', 'N/runtime'],
    function (task, runtime) {
        function afterSubmit(scriptContext) {
            if (scriptContext.type != scriptContext.UserEventType.DELETE) {
                if (runtime.executionContext === runtime.ContextType.USER_INTERFACE) {
                    var scriptTask = task.create({
                        taskType: task.TaskType.MAP_REDUCE,
                        scriptId: 'customscript_update_purchase_price',
                        deploymentId: null,
                    });
                    scriptTask.submit();  
                }                 
            }          
        }
        return {
            afterSubmit: afterSubmit
        };
    });
