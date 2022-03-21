/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Dec 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function addBudgetClass_Filtered_Field(type, form, request){
	
	
	var b = nlapiInsertSelectOption('custcol_cseg3', '1', 'hello');
  };
