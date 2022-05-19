/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/currentRecord'],
    function (currentRecord) {
        var rec;
        function fieldChanged(scriptContext) {
            rec = rec || currentRecord.get();
            var fieldId = scriptContext.fieldId;  
            if (fieldId == 'category') {
                debugger;
                var category = rec.getValue(fieldId);
                if (category == 1) {                   
                    var related_customer = scriptContext.currentRecord.getField({ fieldId: 'custentity_related_customer' });
                    related_customer.isMandatory = true;
                }
            }
        }
        function isNullOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            fieldChanged: fieldChanged,
        };
    });


