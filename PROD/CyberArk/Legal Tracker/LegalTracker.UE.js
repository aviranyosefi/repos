/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define([],
    function () {
        function beforeLoad(context) {
            // internal id of the client script on file cabinet
            context.form.clientScriptModulePath = 'SuiteScripts/CyberArk/Dev/LegalTracker.CS.js';
            context.form.addButton({
                id: "custpage_setTask",
                label: "Genarate Bill",
                functionName: 'redirect'
            });
        }
        return {
            beforeLoad: beforeLoad,

        };
    });
