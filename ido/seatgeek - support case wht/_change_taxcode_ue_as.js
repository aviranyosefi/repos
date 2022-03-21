/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 May 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function change_taxcode_ue_as(type){
	
	nlapiLogExecution('debug', 'script-running', 'yes')
	
	var rec = nlapiLoadRecord('vendorbill', 435846);
  
	var lineCount = rec.getLineItemCount('expense');

	
	for(var i = 1; i<=lineCount; i++) {
		
		rec.setLineItemValue('expense', 'custcol_4601_witaxcode_exp', i, '2') //6=dynamic || 2=regular
		
		//nlapiLogExecution('debug', 'whttaxcode', whttaxcode)
	}
	
	nlapiSubmitRecord(rec)
	nlapiLogExecution('debug', 'script-done-submit', 'yes')
	
	
}
