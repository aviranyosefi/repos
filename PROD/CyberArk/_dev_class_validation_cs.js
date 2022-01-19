/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/search' , 'N/runtime'],
    function (search,runtime) {
        function validateLine(context) {
            debugger;
			var userObj = runtime.getCurrentUser();
			var role = userObj.role
            var classLine = context.currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'class',
            });
            if (isNullOrEmpty(classLine)) {
                var mandatory = context.currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_cbr_is_class_mandatory',
                });
                if (mandatory) {
					alert('Class field is mandatory for this department'); return false
                    //var mandatory = getData(departmentLine)
					//var mandatory= search.lookupFields({ type: search.Type.DEPARTMENT, id: departmentLine, columns: 'custrecord_cbr_class_mandatory' })['custrecord_cbr_class_mandatory'];                 
                    //if (mandatory) { alert('Class field is mandatory for this department'); return false}
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