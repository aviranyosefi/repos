/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Dec 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */

function getSelectedInvoicesOnsubmit() {
	
	var lineCount = nlapiGetLineItemCount('custpage_results_sublist');
	var jobsToRun = [];
	
	for(var i = 0; i<lineCount; i++) {
		
		var isChecked = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i+1);
		var invInternalID = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_internalid', i+1);
		if(isChecked == 'T') {
			
			jobsToRun.push(invInternalID);
		}
		
		
	}
	
	var jobs = JSON.stringify(jobsToRun);
	
	var emailJobs = nlapiGetFieldValue('custpage_ismail_jobs')
	var printJobs = nlapiGetFieldValue('custpage_ilo_invtoprint')
	
	if(emailJobs == null) {
		nlapiSetFieldValue('custpage_ilo_invtoprint', jobs, null, null)
	}
	if(printJobs == null) {
		nlapiSetFieldValue('custpage_ismail_jobs', jobs, null, null)
	}
//	try{
//		nlapiSetFieldValue('custpage_ismail_jobs', jobs, null, null)
//	}catch(err) {
//		nlapiSetFieldValue('custpage_ilo_invtoprint', jobs, null, null)
//	}
	
	return true;
	
}



function batchPrintFieldChanged(type, name, linenum){
	
	try{
		

	
	console.log('type : ' + type)
	console.log('name : ' + name)
	console.log('linenum : ' + linenum)
	
	if(name === 'custpage_resultssublist_printlayout') {
		
		console.log('layout changed');
		var invoiceID = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_internalid', linenum);
		var layoutType = nlapiGetLineItemText('custpage_results_sublist', 'custpage_resultssublist_printlayout', linenum);

		console.log('invoiceID : ' + invoiceID)
		console.log('layoutType : ' + layoutType)
		
		if (layoutType === 'Detailed') {

			var fields = new Array();
			var values = new Array();
			fields[0] = 'custbody_ilinv_detailed_layout';
			values[0] = 'T';
			fields[1] = 'custbody_ilinv_sum_layout';
			values[1] = 'F';

			var updatefields = nlapiSubmitField('invoice', invoiceID, fields, values, 'T');
			window.onbeforeunload = null;
			location.reload();
		}
		if (layoutType === 'Summarized') {

			var fields = new Array();
			var values = new Array();
			fields[0] = 'custbody_ilinv_detailed_layout';
			values[0] = 'F';
			fields[1] = 'custbody_ilinv_sum_layout';
			values[1] = 'T';

			var updatefields = nlapiSubmitField('invoice', invoiceID, fields, values, 'T');
			window.onbeforeunload = null;
			location.reload();
		}
		
	
	}
	}catch(err) {
		nlapiLogExecution('error', 'err updating print layout', err)
	}
}

window.onbeforeunload = function() {
    return true;
}