var currencies = [                  
{name: "AUD", internalid: "6"},
{name: "CAD", internalid: "3"},
{name: "CHF", internalid: "7"},
{name: "CZK", internalid: "10"},
{name: "DKK", internalid: "5"},
{name: "EUR", internalid: "4"},
{name: "GBP", internalid: "2"},
{name: "ILS", internalid: "9"},
{name: "MXN", internalid: "8"},
{name: "USD", internalid: "1"}];
                  
                  



/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Jun 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function syg_populate_totalILS_beforeSubmit(type){
	
	var recType = nlapiGetRecordType();
	
	if (recType == 'expensereport') {
	
	try{


		var tranDate = nlapiGetFieldValue('trandate')
		var expenseLines = nlapiGetLineItemCount('expense');
		
		for(var i = 0; i<expenseLines; i++) {

			var currency = nlapiGetLineItemValue('expense', 'currency', i+1);
			var foreignAmt = nlapiGetLineItemValue('expense', 'foreignamount', i+1)
			
			if(currency == '9') {//ILS
			
				var exRateILS = parseFloat(nlapiExchangeRate('1', '9', tranDate)) //ILS to USD
				nlapiLogExecution('debug', 'exRateILS', exRateILS)
				var endExRate = 1 / exRateILS
				nlapiLogExecution('debug', 'exRateILS', endExRate)
				
				nlapiSetLineItemValue('expense', 'exchangerate', i+1, endExRate.toFixed(5))
				
			}
			if(currency != '9' || currency != '1') {//not ILS
				
				var currExRate = nlapiExchangeRate(currency, '1', tranDate)
				
				nlapiSetLineItemValue('expense', 'exchangerate', i+1, currExRate)
				
			}
			
		}

			return true;
	

	}catch(err){
		nlapiLogExecution('debug', 'err', err)
		return true;
	}
}//end of type == 'expensereport
	

}

function vendPayment_beforeLoad(type) {
	
	
	
	var recType = nlapiGetRecordType();
	
	if(recType == 'vendorpayment') {
		
		try{
			
		var totalILS;
		var newExrate;
		
		nlapiLogExecution('debug', 'rectype + type', recType + ' - ' + type)
		
		var lineCount = nlapiGetLineItemCount('apply');
		
		for(var i = 0; i<lineCount; i++) {
			
		var linetype = 	nlapiGetLineItemValue('apply', 'trantype', i+1);
		var tranID = nlapiGetLineItemValue('apply', 'internalid', i+1);
		
		if(linetype == 'ExpRept') {
			
			var exp_rep_rec = nlapiLoadRecord('expensereport', tranID);
			 totalILS = exp_rep_rec.getFieldValue('custbody_total_ils_amount');
			var accBookLine = exp_rep_rec.getLineItemCount('accountingbookdetail');
			var exRate = '';
			for (var x=0; x<accBookLine ; x++ ) { 
				newExrate = exp_rep_rec.getLineItemValue('accountingbookdetail', 'exchangerate', x+1);
			}
			
			
			
		}
			
			
		}
		nlapiSetFieldValue('custbody_total_ils_amount', totalILS, null, null);
		var lineCount = nlapiGetLineItemCount('accountingbookdetail');
		
		for(var y = 0; y<lineCount; y++) {
			//set new exchange rate at accountingbook sublist
		var exchangeRate = nlapiSetLineItemValue('accountingbookdetail', 'exchangerate', y+1, newExrate);

		}
}catch(err){
			nlapiLogExecution('debug', 'err', err)
		}
		
	}// end of recType == 'vendorpayment'
	
}