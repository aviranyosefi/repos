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
	window.location = nlapiResolveURL('SUITELET', 'customscript_ilo_deposit_print_suitlet', 'customdeploy_ilo_deposit_print_suit_dep')+'&tid='+recid;
	return true;
}

function checkdis() {
	alert('working!')
}