/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/ui/message'],

    function (currentRecord, message) {
        var rec;
        saveRecord = function (context) {
            debugger;
            rec = rec || currentRecord.get();
            if (rec.type == 'noninventoryitem') {
                var subtype = rec.getValue('subtype')
                if (subtype == 'Resale' || subtype == 'Sale') {
                    //var classField = rec.getField({ fieldId: 'class' });
                    //classField.isMandatory = true;
                    //nlapiSetFieldMandatory('class', true)
                    var classVal = rec.getValue('class');
                    if (isNullOrEmpty(classVal)) {
                         message.create({
                             title: "Please enter value(s) for: Class",
                             message: "Please enter value(s) for: Class",
                            type: message.Type.ERROR,
                            duration: 50000
                        }).show();
                        return false
                    }
                }
            }
            return true;
        };
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
             
    return {
        saveRecord: saveRecord, 
    };
    
});
