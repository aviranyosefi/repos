/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define([],
    function () {
        function pageInit(scriptContext) { }
        function executeFun() {
            nlapiSetFieldValue('custpage_next', '1')
            document.getElementById("submitter").click()
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            pageInit: pageInit,
            executeFun: executeFun
        };
    });