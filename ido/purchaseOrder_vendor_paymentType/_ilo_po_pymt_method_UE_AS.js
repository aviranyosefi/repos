/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 May 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function po_pymt_method_afterSubmit(type, form, request){
	
	
	var session_country = nlapiGetFieldValue('nexus_country');
	if (session_country == 'IL') {

		
		var pymtMethod = nlapiGetFieldValue('custbody_ilo_payment_method');
		var vendorSlct = nlapiGetFieldValue('entity');
		
		if(pymtMethod == '') {
			
			var vendRec = nlapiLoadRecord('vendor', vendorSlct);
			
			var pymtType = vendRec.getFieldValue('custentity_ilo_field_payment_method');
			
			nlapiLogExecution('DEBUG', 'pymtType', pymtType);
			
			nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody_ilo_payment_method', pymtType);
			
			
		}



	
	
}
 
}
