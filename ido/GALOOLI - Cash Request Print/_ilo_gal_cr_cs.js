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
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function callPrintSuitelet() 
{
	var recid = nlapiGetRecordId();
	
       // Pass Purchase Order Id (paramname = poid)
	window.location = nlapiResolveURL('SUITELET', 'customscript_ilo_gal_print_cashrequest', 'customdeploy_ilo_gal_print_cr_dep')+'&crid='+recid;
	return true;
}

function checkdis() {
	alert('working!')
}