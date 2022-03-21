/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Nov 2017     idor
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
			
          form.addButton('custpage_print_cashrequest', 'Print', 'callPrintSuitelet()');
          form.setScript('customscript_ilo_gal_cr_cs'); // id of client script

		}
	}


}