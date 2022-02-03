/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/search', 'N/ui/message'],
    function (search, message) {      
        function saveRecord(scriptContext) {
            debugger;
            var recId =scriptContext.currentRecord.id
            if (isNullOrEmpty(recId)) {
                var rec = scriptContext.currentRecord;  
                var classVal = rec.getValue({ fieldId: 'class' });
                if (!isNullOrEmpty(classVal)) {           
                    var isinactive = checkClass(classVal)  
                    if (isinactive) {
                        createError( message);
                        return false;
                    }
                }  
                var count = rec.getLineCount('item');
                for (var i = 0; i < count; i++) {
                    var classLine = rec.getSublistValue({sublistId: 'item',fieldId: 'class',line: i});
                    if (!isNullOrEmpty(classLine)) {
                        var isinactive = checkClass(classLine)
                        if (isinactive) {
                            createError( message);
                            return false;
                        }
                    }
                }
            }                                 
            return true;
        }  
        function isNullOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function createError( message) {
            message.create({
                title: "Error",
                message: "You are not allowed to choose this value at cost center field. please change to relevant value",
                type: message.Type.ERROR,
                duration: 50000
            }).show();
            
        }
        function checkClass(classVal){
            var fieldLookUp = search.lookupFields({ type: 'classification', id: classVal, columns: ['isinactive'] });
            var isinactive = fieldLookUp.isinactive
            return isinactive
        }
        return {
            saveRecord: saveRecord,         
        };
    });