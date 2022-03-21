/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Feb 2018     idor
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
function _populate_item_displayname(type){
	
	var recType = nlapiGetRecordType();
	var recID = nlapiGetRecordId();
	
	var currentRec = nlapiLoadRecord(recType, recID);

		try{
			
		var lineCount = currentRec.getLineItemCount('item');
		
		for(var i = 1; i<=lineCount; i++) {
			
		var currItem = currentRec.getLineItemValue('item', 'item', i);
		
		var itemDisplayID = nlapiLookupField('item', currItem, 'itemid');
		var itemDisplayName = nlapiLookupField('item', currItem, 'displayname');
		
		var displayName = itemDisplayName;
		if(displayName == '' || displayName == null || displayName == undefined) {
			displayName = itemDisplayID
		}

		currentRec.setLineItemValue('item', 'custcol_biodata_item_display_name', i, displayName);

		}
		nlapiSubmitRecord(currentRec)
		
		}catch(err){
			nlapiLogExecution('debug', 'err', err)
		}

  
}
