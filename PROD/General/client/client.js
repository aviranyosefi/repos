/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/log', 'N/record','N/search', '../Common/NCS.Lib.Common', 'N/url', 'N/https','N/ui/dialog','N/error'],

function(currentRecord, logger, record, search, common, url, https,dialog,error) {
	var rec;
    pageInit = function(scriptContext) {
    	if ((scriptContext.mode == 'create') || (scriptContext.mode == 'edit')|| (scriptContext.mode == 'copy')) {
	    	rec = rec || currentRecord.get(); 
	    	
    	}
    };
    
    fieldChanged = function(scriptContext) {

    };

    postSourcing = function(scriptContext) {
   
    };

    sublistChanged = function(scriptContext) {

    };

    lineInit = function(scriptContext) {

	};

    validateField =function(scriptContext) {
    	  	
    };

    validateLine = function(scriptContext) {
    	  	
    };

    validateInsert = function(scriptContext) {
    	return true;
    };

    validateDelete = function(scriptContext) {
    	
    	
    };
        
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        sublistChanged: sublistChanged,
        lineInit: lineInit,
        validateField: validateField,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete,
        saveRecord: saveRecord
    };
    
});
