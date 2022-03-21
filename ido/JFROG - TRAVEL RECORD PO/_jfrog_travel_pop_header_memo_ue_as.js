/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 Mar 2019     idor
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
function populateHeaderMemo_CSV(type){
	
	try{
		
	var rec = nlapiLoadRecord('customrecord_jfrog_travel_po', nlapiGetRecordId());
	var travelRec = rec.getFieldValue('custrecord_jfrog_travel_number');
	var purposeOfTravel = nlapiLookupField('customrecord_ilo_travel_record', travelRec, 'custrecord_ilo_travel_purpose');
	
	rec.setFieldValue('custrecord_jfrog_travel_memo', purposeOfTravel)
	nlapiSubmitRecord(rec)
	
	}catch(err) {
		nlapiLogExecution('error', 'err', err)
		
	}
  
}
