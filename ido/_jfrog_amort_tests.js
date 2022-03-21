/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Feb 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function amortPageInit(type){
	
	alert('checking clientscript!')
   
}

function amortOnSave() {
	
	console.log('saving....')
	nlapiLogExecution('debug', 'checking if logs on save', 'TRUE!')
	
	return true;
	
}