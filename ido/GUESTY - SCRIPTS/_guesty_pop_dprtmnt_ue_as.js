/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Dec 2018     idor
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
function populateDepartment(type) {

	try{
		

	
	var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());

	var dprt = rec.getFieldValue('department');

	var lineCount = rec.getLineItemCount('item');

	for (var i = 0; i < lineCount; i++) {

		rec.setLineItemValue('item', 'department', i + 1, dprt)

	}

	nlapiSubmitRecord(rec)
	}catch(err) {
	nlapiLogExecution('debug', 'err', err)	
	}
}
