/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Dec 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function getEnvURL() {
	
	var getOrigin = window.location.origin;
	
	
	nlapiSetFieldValue('custpage_originvalue', getOrigin)

	
	return true;
}