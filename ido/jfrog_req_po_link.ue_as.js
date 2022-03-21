/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Apr 2018     idor
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
function populate_reqlink_po(type){
	try{
		
	
	
	var rec = nlapiLoadRecord('purchaseorder', nlapiGetRecordId());
	var lineCount = rec.getLineItemCount('item');
	var arr = [];
	
		for(var i = 1; i<=lineCount; i++) {
			 
 			var reqID = rec.getLineItemValue('item', 'linkedorder', i)
 			var reqLink = nlapiLookupField('purchaserequisition', reqID, 'tranid');

 			arr.push({
 				reqLink : reqLink,	
 				reqID : reqID
			});

		}
		
		nlapiLogExecution('debug', 'arr', JSON.stringify(arr))
	}

  	catch(err) {
		nlapiLogExecution('debug', 'err', err)
	}
}
