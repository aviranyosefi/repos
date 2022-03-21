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
	
	var status = rec.getFieldValue('statusRef')
	
	if(status == 'pendingReceipt' || 'partiallyReceived') {
		
	
	var lineCount = rec.getLineItemCount('item');
	var arr = [];
	
		for(var i = 1; i<=lineCount; i++) {
			 
 			var reqID = rec.getLineItemValue('item', 'custcol_jfrog_req_link', i)

 			arr.push({	
 				reqID : reqID
			});

 			var reqName = nlapiLookupField('purchaserequisition', reqID, 'tranid');
 			rec.setLineItemValue('item', 'custcol_jfrog_req_link', i, reqName)
		}
		nlapiLogExecution('debug', 'arr', JSON.stringify(arr))
		
 		if(arr != []) {
 			arr.forEach(function(line) {
 		
 				var req_rec = nlapiLoadRecord('purchaserequisition',line.reqID);
 				var lineCount = req_rec.getLineItemCount('item');
 				
 				for(var i = 1; i<=lineCount; i++) {
 					 
 						req_rec.setLineItemValue('item', 'isclosed', i, 'T')

 				}
 				
 					nlapiSubmitRecord(req_rec)

 	 			});
 			
 			
 		}// if arr != []
 	
	}//check status
	}

  	catch(err) {
		nlapiLogExecution('debug', 'err', err)
	}
}
