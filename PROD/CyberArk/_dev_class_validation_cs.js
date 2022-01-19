/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/search'],
    function (search) {
        function validateLine(context) {
            debugger;
            var classLine = context.currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'class',
            });
            if (isNullOrEmpty(classLine)) {
                var departmentLine = context.currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'department',
                });
                if (!isNullOrEmpty(departmentLine)) {
                    var mandatory = getClassMandatory(departmentLine)
                    if (mandatory) { alert('Class field is mandatory for this department'); return false}
                }
            }
            return true                     
        }
        function getClassMandatory(department) {
            var SearchObj = search.create({
                type: "department",
                filters:
                    [
                        ["internalid", "anyof", department]
                    ],
                columns:
                    [
                        "custrecord_cbr_class_mandatory"
                    ]
            });
            SearchObj.run().each(function (result) {
                mandatory = result.getValue({ name: "custrecord_cbr_class_mandatory" });
            });
            return mandatory;
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            validateLine: validateLine,
        };
    });