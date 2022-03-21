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


		
		var totalILS_lines = 0;
		var totalNonILS_lines = 0;
		var totalILS = 0
		
		var tranDate = nlapiGetFieldValue('trandate')
		var expenseLines = nlapiGetLineItemCount('expense');
		var totalUSD = parseFloat(nlapiGetFieldValue('total'));
		
		for(var i = 0; i<expenseLines; i++) {
			
			//nlapiSetLineItemValue('expense', 'expensedate', i+1, tranDate)
			
			var currency = nlapiGetLineItemValue('expense', 'currency', i+1);
			var foreignAmt = nlapiGetLineItemValue('expense', 'foreignamount', i+1)
			//var usdAmount = nlapiGetLineItemValue('expense', 'amount', i+1)
			
			if(currency == '9') {//ILS
			
				totalILS_lines += parseFloat(foreignAmt);
				
			}
			if(currency != '9') {//not ILS
				
				var currExRate = nlapiExchangeRate(currency, '9', tranDate)
				
				totalNonILS_lines += parseFloat(foreignAmt) * currExRate;
				
			}
			
		}
		
		totalILS = totalILS_lines+totalNonILS_lines
		
//		console.log('totalILS_lines : '+ totalILS_lines)
//		console.log('totalNonILS_lines : '+ totalNonILS_lines)
//		console.log('totalILS : '+ totalILS)
		nlapiSetFieldValue('custbody_total_ils_lines', totalILS_lines.toFixed(2), null, null);
		nlapiSetFieldValue('custbody_total_non_ils_lines', totalNonILS_lines.toFixed(2), null, null);
		nlapiSetFieldValue('custbody_total_ils_amount', totalILS.toFixed(2), null, null);
		
		var newExRate = totalILS / totalUSD
		
		var accBookLine = nlapiGetLineItemCount('accountingbookdetail');
		var exRate = '';
		for (var i=0; i<accBookLine ; i++ ) { 
			nlapiSetLineItemValue('accountingbookdetail', 'exchangerate', i+1, newExRate)
		}
		
		
		for(var x = 0; x<expenseLines; x++) {
					
			var currency = nlapiGetLineItemValue('expense', 'currency', x+1);
			
			if(currency == '9') {//ILS
				nlapiSetLineItemValue('expense', 'exchangerate', x+1, 1/newExRate)				
				
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