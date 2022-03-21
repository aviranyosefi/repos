/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Oct 2018     idor
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
function beforeLoad_create_PrintButton(type, form, request)
{
	    if (type == 'view') {

		if (nlapiGetContext().getExecutionContext() == 'userinterface') {
			
          form.addButton('custpage_print_customerrefund', 'Print', 'callPrintSuitelet()');
          form.setScript('customscript_kab_cr_cs'); // id of client script

		}
	}


}