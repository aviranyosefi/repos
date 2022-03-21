/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Nov 2016     idor
 *
 */

/**
 * @param {nlobjRequest}
 *            request Request object
 * @param {nlobjResponse}
 *            response Response object
 * @returns {Void} Any output is written via response object
 */
function exchangeRateUpdate(request, response) {
	var output;
	var effectiveDate = '';
	var forexArr = [];
	var exRates = [];
	var USD = [];
	var GBP = [];
	var JPY = [];
	var EUR = [];
	var AUD = [];
	var CAD = [];
	var DKK = [];
	var NOK = [];
	var ZAR = [];
	var SEK = [];
	var CHF = [];
	var JOD = [];
	var LBP = [];
	var EGP = [];


	var form = nlapiCreateForm("Update Exchange Rates");

	form.addSubmitButton('Update');

	if (request.getMethod() == 'GET') {
		response.writePage(form);
	}

	else {

		var output;
		var effectiveDate = '';
		var exRates = [];
		var sysExRates = [];
		var ILSline = '';
		var EURline = '';
		var USDline = '';

		    var columns = new Array();
		    columns[0] = new nlobjSearchColumn('symbol', null, null);
		    var search = nlapiSearchRecord('currency', null, null, columns);
		    for(var i=0; i<search.length; i++) {
		    	sysExRates.push(search[i].getValue(columns[0]));
		    }

			var er = nlapiRequestURL('http://www.boi.org.il/currency.xml', null, null);
			var xmlRes = er.getBody();
			output = nlapiStringToXML(xmlRes);
			var currencyCode = nlapiSelectValues(output, '//CURRENCYCODE');
			var exchangeRate = nlapiSelectValues(output, '//RATE');
			var lastUpdate = nlapiSelectValue(output, '//LAST_UPDATE');
			var exchangeRates = [];
			exchangeRates.push(exchangeRate);
			
			for(var i=0; i<exchangeRates.length; i++){
			    var obj = {};
			    for(var j=0; j<exchangeRates[i].length; j++){
			         obj[currencyCode[j]] = exchangeRates[i][j];  
			      }
			    obj["ILS"] = "1";
			    exRates.push(obj);
			}

			var exRateArr = exRates[0];
			var exRateISO = Object.keys(exRateArr);
			effectiveDate = formatDate(lastUpdate);
			
			//yen Fix (100 units)
			var jpy = exRateArr.JPY/100;


			var baseCurrencies = ['ILS','EUR','USD'];
			var ils = baseCurrencies[0];
			var eur = baseCurrencies[1];
			var usd = baseCurrencies[2];
			
			var toUpdate = [];
			//toUpdate array are the currencies that are both exsisting in the sys
			for (var i = 0; i < sysExRates.length; i++) {
			    for (var j = 0; j < exRateISO.length; j++) {
			        if (sysExRates[i] == exRateISO[j]) {
			        	toUpdate.push(exRateISO[j]);
			        }
			    }
			}
					
			//ILS Lines
			for(var i = 0; i<toUpdate.length; i++) {
				if(toUpdate[i] == 'JPY') {
					ILSline += ils+","+toUpdate[i]+","+(1/jpy).toFixed(5)+","+effectiveDate+ "\n";
				}
				else{
				ILSline += ils+","+toUpdate[i]+","+exRateArr[toUpdate[i]]+","+effectiveDate+ "\n";
				}
			}
			
			//Euro Lines
			for(var k = 0; k<toUpdate.length; k++) {
				if(toUpdate[k] == 'ILS') {
					EURline += eur+","+toUpdate[k]+","+ROTbase(1/exRateArr.EUR,exRateArr[toUpdate[k]]).toFixed(5)+","+effectiveDate+ "\n";
					}
				else if(toUpdate[k] == 'JPY') {
					
					EURline += eur+","+toUpdate[k]+","+ROTbase(exRateArr.EUR,jpy).toFixed(5)+","+effectiveDate+ "\n";
				}
				else if(toUpdate[k] == 'EUR') {
					
					EURline += eur+","+toUpdate[k]+","+ROTbase(exRateArr.EUR,exRateArr[toUpdate[k]])+","+effectiveDate+ "\n";
				}
				
				else{
					EURline += eur+","+toUpdate[k]+","+ROTbase(exRateArr.EUR,exRateArr[toUpdate[k]]).toFixed(5)+","+effectiveDate+ "\n";
					}
			}
			
			//USD Lines
			for(var m = 0; m<toUpdate.length; m++) {
				if(toUpdate[m] == 'ILS') {
					USDline += usd+","+toUpdate[m]+","+(1/exRateArr.USD).toFixed(5)+","+effectiveDate+ "\n";
					}
				else if(toUpdate[m] == 'JPY') {
					
					USDline += usd+","+toUpdate[m]+","+ROTbase(exRateArr.USD,jpy).toFixed(5)+","+effectiveDate+ "\n";
				}
				else if(toUpdate[m] == 'USD') {
					
					USDline += usd+","+toUpdate[m]+","+ROTbase(exRateArr.USD,exRateArr[toUpdate[m]])+","+effectiveDate+ "\n";
				}
				else{
					USDline += usd+","+toUpdate[m]+","+ROTbase(exRateArr.USD,exRateArr[toUpdate[m]]).toFixed(5)+","+effectiveDate+ "\n";
					}
			}


	var csv_ER_updated =  "Base Currency,Source Currency,Exchange Rate,Effective Date"+ "\n" +ILSline+EURline+USDline; 

		

		//sysExRates = current currencies in system;
		//exRateISO = most recent currencies from BOI
		//exRateArr = most recent exchange rates from BOI
		//toUpdate = currencies from the system that match currencies from BOI

	
	//nlapiLogExecution('DEBUG', toUpdate, shouldUpdate);
	}	
	var shouldUpdate = JSON.stringify(exRateArr);
	//response.write(JSON.stringify(forexArr[0].lastUpdated));
	response.write(csv_ER_updated);
};



function formatDate(initDate) {
	var justNumbers = initDate.replace(/[^a-zA-Z0-9 ]/g, "");
	var year = justNumbers.substr(0, 4);
	var month = justNumbers.substr(4, 2);
	var day = justNumbers.substr(6, 2);
	var reformatDate = month + '/' + day + '/' + year;
	return reformatDate;
	  }


//rule of three function
function ROTbase(a, b) {
	var x = b/a;
	return x;
}