/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['require', 'N/url', 'N/log', 'N/record', 'N/search', 'N/ui/serverWidget', '../Common/BE.Lib.Common.js', 'N/error', 'N/runtime'], 
	function(require, url, logger, record, search, serverWidget, common, error, runtime) {
   
	var form,rec,recId,recType,eventType;
    function beforeLoad(scriptContext) {
    	initiateScript(scriptContext);
    	
    }
    
    function beforeSubmit(scriptContext) {
    	initiateScript(scriptContext);
    	
    	if(recType == 'customrecord_df_account_mapping') {
			validateAccDeptCombination(scriptContext)    			
    	}
    	
    }
    
    function afterSubmit(scriptContext) {
    	initiateScript(scriptContext);
		
    }
    
    /*
     * HELPERS
     */
    
    function validateAccDeptCombination(scriptContext) {
    	
		var accountId = rec.getValue({ fieldId: 'custrecord_df_mapping_account' });
		var departmentId = rec.getValue({ fieldId: 'custrecord_df_mapping_department' });
		
		if(!common.isNullOrEmpty(accountId) && !common.isNullOrEmpty(departmentId)) {
			
			var errMsg = ''
			
			search.create({
				type: "customrecord_df_account_mapping",
				filters:
						[
						 ["custrecord_df_mapping_account","anyof",accountId], 
					 	 "AND", 
					 	 ["custrecord_df_mapping_department","anyof",departmentId]
					 	],
				columns:
						[
						  "custrecord_df_mapping_account",
						  "custrecord_df_mapping_department",
						  "custrecord_df_mapping_category",
						  "internalid"
						 ]
			}).run().each(function(result){
								
				if(result.getValue({ name: 'internalid' }) != recId) {
					errMsg = 'Error Saving: This account and department combination already exists on a Account Mapping record with a internal ID of ' + result.getValue({ name: 'internalid' }) 
					+ ' and a Category of ' + result.getText({ name: 'custrecord_df_mapping_category' });					
				}
				
				return true;
			});
			
			if(errMsg.length > 1) {
				throw errMsg
			}
			
		}
    	
    }
    
    function initiateScript(scriptContext) {
    	form = scriptContext.form;
    	rec = scriptContext.newRecord;
    	recId = rec.id;
    	recType = rec.type;
    	eventType = scriptContext.type;
    }
    
    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
