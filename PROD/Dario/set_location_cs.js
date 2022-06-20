/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/currentRecord'],
    function (currentRecord) {
        var rec;
        function pageInit(scriptContext) {
            rec = rec || currentRecord.get();
            try {
                if (scriptContext.mode == 'edit') {
                        updateLines()                                 
                }                                                      
            } catch (e) {
                log.error('pageInit error', e)
            }
        }
        function fieldChanged(scriptContext) {
            try {
                rec = rec || currentRecord.get(); 
                var name = scriptContext.fieldId;                                                
                if (name == 'adjlocation') {
                     updateLines()                    
                }
            } catch (e) {
                log.error('fieldChanged error', e)
            }           
        }
        function validateLine(scriptContext) {
debugger;
            rec = rec || currentRecord.get(); 
            var location = rec.getValue('adjlocation');
            rec.setCurrentSublistValue({ sublistId: 'inventory', fieldId: 'location', value: location, fireSlavingSync: true, ignoreFieldChange: true })
            return true;
        }
        function updateLines() {
            try {
                var location = rec.getValue('adjlocation');
                if (isNullOrEmpty(location)) return;
                var count = rec.getLineCount('inventory');
                for (var i = 0; i < count; i++) {    
                    var lineLoction = rec.getSublistValue({ sublistId: 'inventory', fieldId: 'location', value: location, line: i })
                    if (lineLoction == location) continue;
                    rec.selectLine({ sublistId: 'inventory', line: i })
                    rec.setCurrentSublistValue({ sublistId: 'inventory', fieldId: 'location', value: location, fireSlavingSync: true, ignoreFieldChange: true })            
                    rec.commitLine({ sublistId: 'inventory' })
                    }
            } catch (e) {
                log.error('updateLines error', e)
            }
        }
        function isNullOrEmpty(val) {
         if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
             return true;
         }
         return false;
     }       
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,  
            validateLine: validateLine
    };
 });