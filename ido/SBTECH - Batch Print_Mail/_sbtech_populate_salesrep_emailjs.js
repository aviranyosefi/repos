/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Apr 2018     idor
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
function populate_salesrep_mail(type){
	
	try{
		
		var recID = nlapiGetRecordId();
		var recType = nlapiGetRecordType();
		
		var rec = nlapiLoadRecord(recType, recID);
		
		var salesrep = rec.getFieldValue('salesrep')
		
		var salesrep_email = nlapiLookupField('employee', salesrep, 'email');
		
		nlapiSubmitField(recType, recID, 'custentity_sbtech_salesrep_email', salesrep_email, null);
		
		return true;
	}
	catch(err) {
		nlapiLogExecution('debug', 'try/catch - err', err)
		return true;
	}
  
}
