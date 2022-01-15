/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 * Module pre fullfill
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Oct 2019  Moshe Barel
 *
 */
define(['N/record', 'N/http', 'N/search', 'N/format', 'N/runtime', 'N/task',],
    function (record, http, search, format, runtime, task) {
        function afterSubmit(context) {

            if (context.type != context.UserEventType.DELETE) {
                try {

                    var newRecord = context.newRecord;
                    var succeeded = newRecord.getValue({ fieldId: 'custbody_bd_succeeded' });
                    var custbody_not_for_billing = newRecord.getValue({ fieldId: 'custbody_not_for_billing' });

                    var status = newRecord.getValue({ fieldId: 'shipstatus' });
                    var ffId = newRecord.getValue("id")
                    var topic = newRecord.getValue({ fieldId: 'custbody_topic' });
                    var topicArray = ["6", "20", "19", "3", "25", "7", "18", "11", "8", "23", "4", "5", "13", "24", "26", "27", "28", "29", "30", "31", "32", "12", "14", "16", "15"];
                    var n = false;
                    for (var g = 0; g < topicArray.length; g++) {
                        if (topicArray[g] == topic) { n = true; break; }
                    }
                    log.debug('ffId:' + ffId + ' ,succeeded' + succeeded + ' ,status : ' + status, 'topic: ' + topic + ' ,n:' + n + ' ,custbody_not_for_billing:' + custbody_not_for_billing);
                    if (succeeded != true && status == 'C' && n && custbody_not_for_billing != true) {

                        var scheduledScriptTask = task.create({
                            taskType: task.TaskType.SCHEDULED_SCRIPT,
                            scriptId: 522,
                            deploymentId: null,
                            params: {
                                'custscript_ff_itegration_id': ffId,
                            }
                        });
                        scheduledScriptTask.submit();
                    }
                } catch (e) {
                    log.error(e.message);
                }
            }
        }
        return {
            afterSubmit: afterSubmit
        };
    });



