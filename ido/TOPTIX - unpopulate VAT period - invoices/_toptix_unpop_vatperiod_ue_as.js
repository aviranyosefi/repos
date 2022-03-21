/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 Feb 2018     idor
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
function unpopulate_vatperiod_aftersubmit(type){
	
	var recType = nlapiGetRecordType();
	var recID = nlapiGetRecordId();
	
	var currentRec = nlapiLoadRecord(recType, recID);
	var getStatus = currentRec.getFieldValue('status');
	
	if(recType == 'invoice') {
		
		if(type == 'create' || 'edit') {
			
			if(getStatus == 'Pending Approval') {
				
				currentRec.setFieldValue('custbody_ilo_header_vat_period', ' ');
				nlapiSubmitRecord(currentRec);
				
			}
			
			
			
			
		}
		
		
	}
  
}
