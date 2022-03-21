/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Nov 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 * 
 * 
 * 
 * 
 * 
 */

function itemfulfillment_onload() {
	
	console.log('got here!');
}

function addWarranty_fieldChange(name, type){
	
	console.log('name ' + name + ' type '+ type);
	
	if(type == 'shipstatus') {
		
		console.log('fieldchnage!');
		
	var checkshipping = nlapiGetFieldValue('shipstatus');
	var linecount = nlapiGetLineItemCount('item');
	
	var linesObj = [];
	
	for(var i = 0; i<=linecount; i++) {
		
	var isSerial = nlapiGetLineItemValue('item', 'isserial', i);
	
	linesObj.push({
		isSerial : isSerial,
		line : i
	})
	
		

		
	}
	
	for(var i = 1; i<=linesObj.length; i++) {
		try{
			
		if(linesObj[i].isSerial == 'T' && checkshipping == 'C') {
			var today = new Date();
			var todayPlusOneYear = nlapiAddMonths(today, 12)
			var dateStr = nlapiDateToString(todayPlusOneYear)
			nlapiSetLineItemValue('item', 'custcol_warranty', linesObj[i].line, dateStr)
			
		}
		}catch(err) {
			continue;
		}
		
	}
	
	}
	
}
