/**
 *@NApiVersion 2.x
 *@NScriptType WorkflowActionScript
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 may 2022  Maya Katz Libhaber
*/

define(["N/email", "N/render", "N/record", "N/runtime", 'N/search'], function (email, render, record, runtime, search) {
    function onAction(context) {
        var emailTemplate = 4;
        var sender = runtime.getCurrentUser().id;
        //log.debug("sender", sender);
        var employeeApprover = searchEmployeesApprovers();
        if (!isNullOrEmpty(employeeApprover)) {
            //log.debug("employeeApprover", JSON.stringify(employeeApprover));
            var employeeApproverRes = employeeApprover.toString();
            //log.debug("employeeApproverRes", employeeApproverRes)
        }

        var transaction = context.newRecord;
        var transactionId = transaction.getValue("linenumber");
        transactionId = parseInt(transactionId);
       // log.debug("transactionId", transactionId);

        var mergeResult = render.mergeEmail({
            templateId: parseInt(emailTemplate),
            customRecord: {
                type: 'customrecord_ilo_vendor_bank',
                id: transactionId
            }
        });
        var emailSubject = mergeResult.subject;
        var emailBody = mergeResult.body;
        email.send({
            author: sender,
            recipients: employeeApproverRes,
            subject: emailSubject,
            body: emailBody,
            relatedRecords: {
                entityId: sender,
                customRecord: {
                    type: 'customrecord_ilo_vendor_bank',
                    id: transactionId
                }
            },
        });
    }
    function searchEmployeesApprovers() {
        var res = [];
        var employeeSearchObj = search.create({
            type: "employee",
            filters:
                [["custentity_allow_bank_acc_change", "is", "T"]],
            columns:
                [search.createColumn({ name: "internalid", label: "Internal ID" })]
        });
        var searchResults = employeeSearchObj.run();
        searchResults.each(function (result) {
            res.push(result.id);
            return true;
        });

        return res;
    }
    function isNullOrEmpty(val) {

        if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
            return true;
        }
        return false;
    }
    return {
        onAction: onAction,
    };
});
