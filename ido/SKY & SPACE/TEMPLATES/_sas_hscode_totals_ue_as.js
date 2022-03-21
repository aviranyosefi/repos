/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 Apr 2019     idor
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
function getHSTotals(type){
	
	try{
		
		var rec = nlapiLoadRecord('invoice', nlapiGetRecordId());
		
		var lineCount = rec.getLineItemCount('item');
		
		var hsArr = []
		
		for(var i = 0; i<lineCount; i++) {
			
			hsArr.push({
				hsCode : rec.getLineItemValue('item', 'custcol_hs_code_inv', i+1),
				amt: rec.getLineItemValue('item', 'amount', i+1),
			})
			
		}
		
		console.log(hsArr)
		
	}catch(err) {
		nlapiLogExecution('debug', 'err', err)
	}
  
}
