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
	console.log(recid)
	

	
	var suiteletURL = nlapiResolveURL('SUITELET', 'customscript_qlt_banktrans_print_suitlet', 'customdeploy_qlt_banktrans_prnt_suit_dep')+'&tid='+recid;

	openInNewTab(suiteletURL)
}


function openInNewTab(url) {
	  var win = window.open(url, '_blank');
	  win.focus();
	}