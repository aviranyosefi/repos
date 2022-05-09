/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define(["N/task"], function (task) {
    function onRequest(context) {
        executeScheduled();
    }

    function executeScheduled() {
        var scriptTask = task.create({
            taskType: task.TaskType.MAP_REDUCE,
            scriptId: "customscript_legaltracker",
            deploymentId: "customdeploy1"
        });
        var scriptTaskId = scriptTask.submit();
        log.debug("scriptTaskId", scriptTaskId);
    }

    return {
        onRequest: onRequest
    };
});
