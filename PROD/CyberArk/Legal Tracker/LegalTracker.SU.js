/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define(["N/task"], function (task) {
    function onRequest(context) {
        var errorLodId = context.request.parameters.errorLodId;
        executeScheduled(errorLodId);
    }

    function executeScheduled(errorLodId) {
        var scriptTask = task.create({
            taskType: task.TaskType.MAP_REDUCE,
            scriptId: "customscript_legaltracker",
            deploymentId: null,
            params: {
                'custscript_legal_tracker_errorid': errorLodId
            }
        });
        var scriptTaskId = scriptTask.submit();
        log.debug("scriptTaskId", scriptTaskId);
    }

    return {
        onRequest: onRequest
    };
});
