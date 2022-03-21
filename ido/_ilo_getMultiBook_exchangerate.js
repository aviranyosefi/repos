/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Dec 2016     idor
 *
 */
//

var exchangeRate;
var currency;
function getExchangeRate(invoiceID) {	
	var inv = nlapiLoadRecord('invoice', invoiceID);
	var itemCount = inv.getLineItemCount('accountingbookdetail');
	for (var i=0; i<itemCount ; i++ ) { 
		
			currency = inv.getLineItemValue('accountingbookdetail', 'basecurrency', i+1);
		  exchangeRate = inv.getLineItemValue('accountingbookdetail', 'exchangerate', i+1);
	}

	console.log(exchangeRate);
	console.log(currency);
}
getExchangeRate('15741'); //internalid of invoice