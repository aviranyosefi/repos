/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 May 2018     idor
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
function rev_recog_after_submit(type) {
	
	
	try{
		
		var recID = nlapiGetRecordId();
		var recType = nlapiGetRecordType();
		
		var rec = nlapiLoadRecord(recType, recID);
		
		var source = rec.getFieldValue('source');

			
	// get values from the body
	var licenseStartDate = rec.getFieldValue('custbody_ilo_license_start');
	var licenseEndDate = rec.getFieldValue('custbody_ilo_license_end');
	
	var lineCount = rec.getLineItemCount('item');
	
	for(var i = 1; i<=lineCount; i++) {		
		//populate column fields
		if (licenseStartDate != null || undefined || '') {
		
			 rec.setLineItemValue('item','custcolzuoraservicestartdate2', i, licenseStartDate);
		}
		if (licenseEndDate != null || undefined || '') {
			
			 rec.setLineItemValue('item','custcolzuoraserviceenddate2', i, licenseEndDate);
		}

	}

	//submit record
	nlapiSubmitRecord(rec);
	
		
	}
	catch(err) {
		nlapiLogExecution('error', 'err', err)
		return true;
		
	}
}