/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Jan 2018     idor
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
function populate_class_afterSubmit(type){
	
	if(type == 'create' || 'edit') {
		
		try{

			var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
			nlapiLogExecution('debug', 'rec', rec)
			
			var linecount = rec.getLineItemCount('item');
			nlapiLogExecution('debug', 'linecount', linecount)
			
			var headerClass = rec.getFieldValue('class')
				nlapiLogExecution('debug', 'headerClass', headerClass);
			
			
			for(var i = 1; i<=linecount; i++) {
				
				if(rec.getLineItemValue('item', 'class', i) == '' ) {
				
				rec.setLineItemValue('item', 'class', i, headerClass);
				
				}
				
			}

			nlapiSubmitRecord(rec)
			
			
		}
		catch(err) {
			
			nlapiLogExecution('debug', 'err', err);
		}
		
		
		
		
		
	}

  
}
