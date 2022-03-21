/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 May 2019     idor
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
function updateVendorStatusOnCreate(type){
	
	if(type == 'create') {
		try{
			
	
		
		var rec = nlapiLoadRecord('customrecord_ilo_vendor_bank', nlapiGetRecordId());
		var vendorID = rec.getFieldValue('custrecord_ilo_vendor_bank_vendor')
		
		var fields = new Array()
		fields[0] = 'custentity_cbr_bank_details_updated'
		fields[1] = 'custentity_nc_vqa_vend_auth_status'

		var values = new Array()
		values[0] = 'T'
		values[1] = '5'

		nlapiSubmitField('vendor', vendorID, fields, values)
		}catch(err){
			nlapiLogExecution('error', 'err', err)
		}
		
	}
  
}
