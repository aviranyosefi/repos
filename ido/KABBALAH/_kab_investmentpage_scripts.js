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
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */


function invst_afterSubmit(){
	
	try{
		

	var recID = nlapiGetRecordId();
	var recType = nlapiGetRecordType();
	
	var rec = nlapiLoadRecord(recType, recID);
	
	var price = rec.getFieldValue('custrecord_kab_invst_price');
	var qty = rec.getFieldValue('custrecord_kab_invst_qty');
	
if(price != null && qty != null) {
	
	var total = price*qty;
	total.toFixed(2)
	
	nlapiSubmitField(recType, recID, 'custrecord_kab_invst_total', total)
	
}

	
	}catch(err){
		nlapiLogExecution('error', 'err', err)
	}
	
}