/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Feb 2018     idor
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
function getShippingHandling_acc_ue(type){
	
	var recID = nlapiGetRecordId();
	
	if(type == 'create' || 'edit'){
		
		try{

		var rec = nlapiLoadRecord('invoice',1903);		
		var lineCount = rec.getLineItemCount('item');
		
		for(var i = 1; i<=lineCount; i++){
			
			var acc = rec.getLineItemValue('item', 'account', i);
			
			nlapiLogExecution('debug', 'acc', acc)
			
		}
		
		
		}catch(err){
			nlapiLogExecution('debug', 'err', err)
		}	
		
		
	}//if type == 'create' || 'edit'
}
