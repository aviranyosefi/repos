/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Jan 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function getSelectedInvoicesOnsubmit() {
	
	var lineCount = nlapiGetLineItemCount('custpage_results_sublist');
	var jobsToRun = [];
	
	for(var i = 0; i<lineCount; i++) {
		
		var isChecked = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i+1);
		var invInternalID = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_internalid', i+1);
		var trandate = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trandate', i+1);
		if(isChecked == 'T') {
			
			jobsToRun.push({invID : invInternalID,
							dateToUse : trandate
								});
		}
		
		
	}
	
	var jobs = JSON.stringify(jobsToRun);
	
		nlapiSetFieldValue('custpage_jfrog_invtouse', jobs, null, null)
	

	return true;
	
}