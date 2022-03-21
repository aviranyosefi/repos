/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 May 2018     idor
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
function _getCountryID(type){
	
	try{
		

	
	var rec	= nlapiLoadRecord('invoice', nlapiGetRecordId());
	var name = rec.getFieldText('custbody_enduser_country');
	var internalid = rec.getFieldValue('custbody_enduser_country');

	nlapiLogExecution('debug', 'country', name +' - '+internalid);
	
	}catch(err){
		nlapiLogExecution('debug', 'err', err)
	}
  
}
