/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/search', 'N/ui/message', 'N/ui/dialog'],
    function (search, message, dialog) { 
        function fieldChanged(context) {     
            var rec = context.currentRecord;
            var name = context.fieldId;
            if (name == 'entity') {
                debugger;
                var entity = rec.getValue({ fieldId: 'entity' });
                if (!isNullOrEmpty(entity)) {
                    var agrID = getAgrList(entity)
                    if (!isNullOrEmpty(agrID)) rec.setValue('custbody_maintenaince_agreement', agrID);
                }               
            }
        }
        function saveRecord(context) {
            var rec = context.currentRecord;
            var maintenaince_agreement = rec.getValue('custbody_maintenaince_agreement');
            if (isNullOrEmpty(maintenaince_agreement)) {
                //message.create({
                //    title: "הסכם תחזוקה",
                //    message: "חסר הסכם תחזוקה",
                //    type: message.Type.ERROR,
                //    duration: 50000
                //}).show();  
                let options = {
                    title: 'הסכם תחזוקה',
                    message: 'חסר הסכם תחזוקה'
                };

                dialog.alert(options)
            }
            return true
        }
        function getAgrList(entity) {

            var customrecord_agreementSearchObj = search.create({
                type: "customrecord_agreement",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_agr_type", "anyof", "2"],
                        "AND",
                        ["custrecord_agr_status", "anyof", "1"],
                        "AND",
                        ["custrecord_agr_bill_cust", "anyof", entity]
                    ],
                columns: [ 'internalid']
   
            });
            var searchResultCount = customrecord_agreementSearchObj.runPaged().count;
            log.debug("result count", searchResultCount);
            if (searchResultCount == 1) {
                var agrResult = customrecord_agreementSearchObj.run().getRange(0, 1);
                var agrID = agrResult[0].getValue('internalid');
                return agrID
            }
            return '';    
        }
        function isNullOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            saveRecord: saveRecord,
            fieldChanged: fieldChanged,         
        };
    });