/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 May 2018     idor
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
function syg_populate_emp(type){
	
	try{
		
		var rec = nlapiLoadRecord('expensereport', nlapiGetRecordId());
		var employee = rec.getFieldValue('entity')
		var travelRecord = rec.getFieldValue('custbody_travel_record')
		var lineCount = nlapiGetLineItemCount('expense')
		
		
 		for(var i = 1; i<=lineCount; i++) {
 			
 			rec.setLineItemValue('expense', 'custcol_employee', i, employee);
 			if(travelRecord != null || undefined || '') {
 				rec.setLineItemValue('expense', 'custcol_ilo_travel_number_column', i, travelRecord);	
 				
 			}
		
		}
		
		nlapiSubmitRecord(rec)

	}
	catch(err){
		
		nlapiLogExecution('error', 'err', err)
		return true;
	}
  
}
