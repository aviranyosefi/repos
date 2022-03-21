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
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function optibus_validateLine(type){
	
	
	var recType = nlapiGetRecordType();
	
	if(recType == 'invoice') {
		
	
	  
	var opt_qty = parseFloat(nlapiGetCurrentLineItemValue('item', 'custcol_optibus_quantity'));
	var opt_rate = parseFloat(nlapiGetCurrentLineItemValue('item', 'custcol_optibus_rate'));
	var opt_periods = parseFloat(nlapiGetCurrentLineItemValue('item', 'custcol_optibus_number_of_period'));
	var invAmt = nlapiGetCurrentLineItemValue('item', 'amount');
	
	console.log('validating line..');

	//Old validation that checked that the rate * qty == amount
	
//   if(opt_qty != '' && opt_rate != '') { // if both fields are not blank
//
//	if((parseFloat(opt_rate) * parseFloat(opt_qty)) != parseFloat(invAmt)) {
//		
//		alert('Please check Optibus rate/quantity');
//		return false;
//	}
//   }
 
	
	//New Validation that calculates amount by => (rate * qty) * number of periods
	
	var calculateAmt = (opt_qty*opt_rate) * opt_periods;
	
	nlapiSetCurrentLineItemValue('item', 'amount', calculateAmt.toFixed(2), null, null)
	
    return true;
    
	}// if invoice
	
	if(recType == 'salesorder') {
		
		
		  
		var opt_qty = nlapiGetCurrentLineItemValue('item', 'custcol_optibus_quantity');
		var opt_rate = nlapiGetCurrentLineItemValue('item', 'custcol_optibus_rate');
		var invAmt = nlapiGetCurrentLineItemValue('item', 'amount');
		var orderQty = nlapiGetCurrentLineItemValue('item', 'quantity');
		
		console.log('validating line..');
		
	   if(opt_qty != '' && opt_rate != '') { // if both fields are not blank

		if((parseFloat(opt_rate) * parseFloat(opt_qty)) != (parseFloat(invAmt)/parseFloat(orderQty))) {
			
			alert('Please check Optibus rate/quantity');
			return false;
		}
	   }
	 
		console.log('validated.');
	    return true;
	    
		} //if salesorder
	
	return true;
}
    