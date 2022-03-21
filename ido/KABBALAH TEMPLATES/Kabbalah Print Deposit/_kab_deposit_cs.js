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
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function callPrintSuitelet() 
{
	var recid = nlapiGetRecordId();
	
       // Pass Purchase Order Id (paramname = poid)
	window.location = nlapiResolveURL('SUITELET', 'customscript_ilo_kab_print_deposit', 'customdeploy_ilo_kab_print_deposit_dep')+'&tid='+recid;
	return true;
}

function checkdis() {
	alert('working!')
}