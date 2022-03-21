/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Nov 2017     idor
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
function addWarranty_afterSubmit(type){
	
	nlapiLogExecution('debug', 'what type', type)
	
		var rec = nlapiLoadRecord('itemfulfillment', nlapiGetRecordId());
		nlapiLogExecution('debug', 'rec', rec)
		
	
	if(type == 'ship') {
		

		var linecount = rec.getLineItemCount('item');
		nlapiLogExecution('debug', 'linecount', linecount)
//		
		var linesObj = [];
		
		for(var i = 0; i<=linecount; i++) {
			
			var isSerial = rec.getLineItemValue('item', 'isserial', i+1);
			var checkKit = rec.getLineItemValue('item', 'kitlevel', i+1);
			var hasSerials = rec.getLineItemValue('item', 'custcol_ilo_invserials', i+1);
			
			linesObj.push({
			isSerial : isSerial,
			checkKit : checkKit,
			hasSerials : hasSerials
				
			})
			

		nlapiLogExecution('debug', 'hasSerials', hasSerials)
		
		try{
		
	if(isSerial == 'T') {
		var today = new Date();
		var todayPlusOneYear = nlapiAddMonths(today, 12)
		var dateStr = nlapiDateToString(todayPlusOneYear)
		nlapiLogExecution('debug', 'dateStr', dateStr);
//		if(rec.getLineItemValue('item', 'custcol_warranty', i+1) == '') {
		rec.setLineItemValue('item', 'custcol_warranty', i+1, dateStr)
//		nlapiSubmitRecord(rec)
//		}
	}
	
	if(checkKit == null && hasSerials != null) {
		nlapiLogExecution('debug', 'hasSerials != ""', 'got here')
		var today = new Date();
		var todayPlusOneYear = nlapiAddMonths(today, 12)
		var dateStr = nlapiDateToString(todayPlusOneYear)
		nlapiLogExecution('debug', 'dateStr', dateStr)
//		if(rec.getLineItemValue('item', 'custcol_warranty', i+1) == '') {
		rec.setLineItemValue('item', 'custcol_warranty', i+1, dateStr)
		
//		}
		
	}
	}catch(err) {
		nlapiLogExecution('debug', 'err', err)
		continue;
	}

			
		}
		nlapiLogExecution('debug', 'linesObj', JSON.stringify(linesObj))
		nlapiSubmitRecord(rec)
}
}