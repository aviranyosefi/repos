/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Jan 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function opt_batchPrint_hide_PageInit(type){
	
	nlapiSetFieldVisibility('custpage_selectfield',false);
	nlapiSetFieldVisibility('custpage_ilo_multi_subsidiary',false);
	nlapiSetFieldVisibility('custpage_ilo_multi_customer',false);
	nlapiSetFieldVisibility('custpage_ilo_multi_fromdate',false);
	nlapiSetFieldVisibility('custpage_ilo_multi_todate',false);
	
   
}
