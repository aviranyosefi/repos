/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Apr 2017     idor
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
function urlAttachment_afterSubmit(type){
	
	try{
	
	
	var thisType = nlapiGetRecordType();
	var thisID = nlapiGetRecordId();
	
	var oldURLField = nlapiGetFieldValue('custbody1');
	
	if(oldURLField != '' | null | undefined) {
		
		var fileObj = nlapiLoadFile(oldURLField);
		
		var fileURL = fileObj.getURL();
		
		//nlapiSetFieldValue('custbody_ilo_attachment_url', fileURL, null, null);
		
		nlapiSubmitField(thisType, thisID, 'custbody_ilo_attachment_url', fileURL, null);
		
	}
	
	}
	catch(err) {
		
	}
}
