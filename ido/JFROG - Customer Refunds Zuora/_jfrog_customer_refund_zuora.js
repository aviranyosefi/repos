/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Feb 2018     idor
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
function populateAccountField(type){
	
//if customer refund is created through the Zuora Interface -
// we need to populate the correct account - 820022 Undeposited Funds - id: 118
	
	var rec = nlapiLoadRecord('customerrefund', nlapiGetRecordId());
	var isZuora = rec.getFieldValue('custbodyzuorareferencenumber');	
	try{
		if(isZuora != ''){ //checking if customer refund was created through Zuora
			
			rec.setFieldValue('account', '118'); //setting correct account
			nlapiSubmitRecord(rec); //submit record

		}//end if(isZuora != '')
	}catch(err){
		nlapiLogExecution('error', 'err', err)
	}

}
