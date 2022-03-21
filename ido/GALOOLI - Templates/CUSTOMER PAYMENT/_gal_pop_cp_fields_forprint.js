/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Apr 2019     idor
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
function populate_fields_for_print(type){
	
	
	var rec = nlapiLoadRecord('customerpayment', nlapiGetRecordId());
	
	var whtAmt = rec.getFieldValue('custpage_4601_withheld');
	rec.setFieldValue('custbody_gal_wht_custpayment_total', whtAmt)
	
	nlapiSubmitRecord(rec)
  
}
