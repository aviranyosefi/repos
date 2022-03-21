/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       06 May 2018     idor
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
function checkIfComponent_aftersubmit(type){
	
	try{
		
		if(type == 'create' || 'edit') {
			
		
		var recID = nlapiGetRecordId();
		var recType = nlapiGetRecordType();
		
		var rec = nlapiLoadRecord(recType, recID);

		var lineCount = rec.getLineItemCount('item');

 		for(var i = 1; i<=lineCount; i++) {

 			rec.setLineItemValue('item', 'custcol_gal_is_kit_component', i, 'T');
		}
		
 		nlapiSubmitRecord(rec);
		}
	}
	catch(err) {
		
	nlapiLogExecution('debug', 'err', err)	
	
		
	}
  
}
