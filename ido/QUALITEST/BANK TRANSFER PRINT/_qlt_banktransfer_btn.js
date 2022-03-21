/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 May 2018     idor
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
			
			var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
			var subsid = rec.getFieldText('subsidiary');
			if(subsid.indexOf('Israel') != -1) {
			
		          form.addButton('custpage_print_banktransfer', 'Print Bank Transfer', 'callPrintSuitelet()');
		          form.setScript('customscript_qlt_banktransfer_client'); // id of client script
				
			}


		}
	}


}