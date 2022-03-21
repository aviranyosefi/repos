/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Nov 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function printForms_suitlet(request, response){
	
    	var recID = request.getParameter('tid');
    	nlapiLogExecution('debug', 'internalid', 'id = ' + recID);
    
		
		var record = nlapiLoadRecord('deposit', recID); // load the record to be added
		var arr = [];
		//var lineCount = record.getLineItemCount('payment');
		var accID = record.getFieldValue('account');
		var accName = nlapiLookupField('account', accID, 'name');
		var accNumber = nlapiLookupField('account', accID, 'number');


		var accClean = accName.replace(accNumber, '')

		var payments = getAllRecs(recID);
		var paymentsTotal = [];
		nlapiLogExecution('debug', 'getAllRecs', JSON.stringify(getAllRecs, null, 2))
		for(var i = 0; i<payments.length; i++) {
			
			paymentsTotal.push(parseFloat(payments[i].amount))
		}

		var totalPayments = paymentsTotal.reduce(add, 0).toFixed(2);

		var rec_tranName = record.getFieldValue('transactionnumber');
		var currency = record.getFieldValue('currency')
		var currency_symbol = '';
		if(currency == '5') { //internal id of ILS currency
			currency = 'ש"ח';
			currency_symbol = '₪';
		}
		if(currency == '1') { //internal id of USD currency
			currency = 'דולר';
			currency_symbol = '$';
		}
		if(currency == '2') { //internal id of USD currency
			currency = 'פאונד';
			currency_symbol = '£';
		}
		if(currency == '4') { //internal id of USD currency
			currency = 'אירו';
			currency_symbol = '€';
		}
		nlapiLogExecution('debug', 'currency_symbol',currency_symbol )
		var depositTotal = totalPayments
		var depositMemo = record.getFieldValue('memo')
		if(depositMemo == null) {
			depositMemo = '';
		}
		var accountID = record.getFieldValue('account');
		var accountKey = nlapiLookupField('account', accountID, 'number');
		var accountName = nlapiLookupField('account', accountID, 'name');
		var accountDetails = nlapiLookupField('account', accountID, 'custrecord_ilo_acc_bank_details');
		var accountDetailsClean = accountDetails.split("\n").join("<br/>");
		var accountNameClean = accountName.split(":");
		var accName = accountNameClean[1];
		if(accName == undefined) {
			accName = accountNameClean[0];
		}
		
		var subsid = record.getFieldValue('subsidiary');
		var subsidName = nlapiLookupField('subsidiary', subsid, 'legalname');
		var subsidVat = nlapiLookupField('subsidiary', subsid, 'taxidnum');
		
		
		//Find generic way to get template file id
		var temp = nlapiLoadFile('5339').getValue();
		var a = temp.toString();
		
	
		
		var startlist = a.indexOf("--startlist--") +13 ; 
		var head = a.substr(0, startlist -13) ;
	    var endlist = a.indexOf("--endlist--")  ; 
		var list = a.substr(startlist, endlist-startlist);
		
		var restOfTemplate = a.substr(endlist +11, a.length );	

		var dynList = '';
	
		var lineCounter = payments.length;
		var lineNum = 0
		
		nlapiLogExecution('debug', 'payments', JSON.stringify(payments))
		payments.forEach(function(check) {
			
			if(check.date == null) {
				check.date = '';
			}
			if(check.amount == null) {
				check.amount = '';
			}
			if(check.bankNum == null) {
				check.bankNum = '';
			}
			if(check.bankBranch == null) {
				check.bankBranch = '';
			}
			if(check.bankAcc == null) {
				check.bankAcc = '';
			}
			if(check.document == null) {
				check.document = '';
			}
			if(check.checkDue == null) {
				check.checkDue = '';
			}
			
			if(check.checkNum == null) {
				check.checkNum = '';
			}
			
			if(check.paymentmethod == 'Cash') {
				check.checkDue = '';
			}
			

			
			lineNum++
			
			var line = '<tr>';

			line += '<td align="center" colspan="4">' + formatNumber(parseFloat(check.amount).toFixed(2)) + '</td>';
			line += '<td align="center" colspan="3">' + check.bankBranch +'/'+check.bankNum+ '</td>';
			line += '<td align="center" colspan="3">' + check.bankAcc + '</td>';
			line += '<td align="center" colspan="4">' + check.checkDue + '</td>';
			line += '<td align="center" colspan="4">' + check.date + '</td>';
			line += '<td align="center" colspan="3">' + check.checkNum + '</td>';
			line += '<td align="center" colspan="3">' + check.paymentmethod + '</td>';
			line += '<td align="center" colspan="3">' + check.customer + '</td>';
			line += '<td align="center" colspan="3">' + check.document + '</td></tr>';
		    
			dynList+= line;
		
		});

				
		var allTemplate = head+dynList+restOfTemplate.toString();
		
		var pattern = /_deposit_trannum|_time|_date|_currency|_currency_symbol|_total|_totallines|_memo|_acc_number|_acc_name|_acc_details|_subsid_name|_subsid_vat|_acc_bankdetails/ig;
		
									
								//Payee Information
								var _deposit_trannum = rec_tranName;
								var _time = todayTime();
								var _date = todayDate();
								var _currency = currency;
								var _currency_symbol = currency_symbol;
								var _total = parseFloat(depositTotal).toFixed(2);
								var _totallines = lineCounter;
								var _memo = depositMemo;
								var _acc_number = accountKey;
								var _acc_name = accName;
								var _acc_details = accClean;
								var _subsid_name = subsidName;
								var _subsid_vat = subsidVat;
								var _acc_bankdetails = accountDetailsClean;
	
								
								
								var mapObj = {
								_deposit_trannum : _deposit_trannum,
								_time : _time,
								_date : _date,
								_currency : _currency,
								_currency_symbol : _currency_symbol,
								_total : formatNumber(_total),
								_totallines : _totallines,
								_memo : _memo,
								_acc_number : _acc_number,
								_acc_name : _acc_name,
								_acc_details : _acc_details,
								_acc_bankdetails : _acc_bankdetails,
								_subsid_name : _subsid_name,
								_subsid_vat : _subsid_vat
								
								
	
							};
								

									var str = allTemplate.replace(/\{\{(.*?)\}\}/g, function(i, match) {
									    return mapObj[match];
									});
						
							
									//must clean all amps
//									var clean = str.replaceAll("&", "&amp;");
								
								
				
				
			//nlapiLogExecution('debug', 'lineCount', lineCount)	
				
				
				
		//downloadData(allTemplate, response, rec_tranName);
		downloadDataPDF(str, response, rec_tranName)
		
	

}


function downloadData(data, response, tranname) {
    // set content type, file name, and content-disposition (inline means display in browser)
	response.setEncoding('UTF-8');
    response.setContentType('PLAINTEXT', 'DEPOSIT #'+tranname+'.txt');
    // write response to the client
    response.write(data);
}

function downloadDataPDF(data, response, tranname) {
	
	var file = nlapiXMLToPDF( data );
	response.setEncoding('UTF-8');
	 response.setContentType('PDF', 'DEPOSIT #'+tranname+'.pdf');
	response.write( file.getValue() ); 

}

function add(a, b) {
    return parseFloat(a) + parseFloat(b);
}

function todayDate() { 
	var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; // January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}

		today = dd + '/' + mm + '/' + yyyy;
	  
	  return today;
	}	

	function todayTime() {
	  	var currentTime = new Date(),
	      hours = currentTime.getHours(),
	      minutes = currentTime.getMinutes();

		if (minutes < 10) {
		 minutes = "0" + minutes;
	  }

	var time = hours + ":" + minutes

	return time;
	  
	  
	}
	
	String.prototype.replaceAll = function(search, replacement) {
	    var target = this;
	    return target.replace(new RegExp(search, 'g'), replacement);
	};
	
	function formatNumber (num) {
	    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
	}
	
	
	
	function getAllRecs(depositID) {

		var searchItems= nlapiLoadSearch(null, 'customsearch_ilo_print_deposit_search');
		searchItems.addFilter(new nlobjSearchFilter('internalid', 'applyingtransaction', 'anyof', depositID));

		var allItems = [];
		var items =[];
		var resultItems = [];
		var searchid = 0;
		var resultset = searchItems.runSearch();
		var rs;
		
			var cols = searchItems.getColumns();

		do {
		    var resultslice = resultset.getResults(searchid, searchid + 1000);
		    for (rs in resultslice) {
		        
				allItems.push(resultItems[resultslice[rs].id] = resultslice[rs]);
		        searchid++;
		    }
		} while (resultslice.length >= 1000);

				if (allItems != null) {
					allItems.forEach(function(line) {
						
						var document = line.getValue(cols[0])
							nlapiLogExecution('debug', 'document', document)
						items.push({
						
						document : removeTranPrefix(document),
						customer : line.getValue(cols[1]),
						paymentmethod : line.getText(cols[2]),
						date : line.getValue(cols[3]),
						amount : checkIfMinus(document, line.getValue(cols[5])),
						bankBranch : line.getValue(cols[7]),
						bankNum : line.getValue(cols[8]),
						checkDue : line.getValue(cols[9]),
						bankAcc : line.getValue(cols[10]),
						checkNum : line.getValue(cols[11])

						});
					
						
						
					});

				};
				
				return items;

		}


	function removeTranPrefix(prefix) {
		var res = '';
		
		if(prefix.indexOf('Payment #') != -1) {
			res = prefix.replace('Payment #', '');
		}
		if(prefix.indexOf('Customer Refund #') != -1) {
			res = prefix.replace('Customer Refund #', 'Refund ');
		}
		
		return res;
	}
	
	function checkIfMinus(doc, amount) {
		
		var res = '';
		if(doc.indexOf('Customer Refund #') != -1) {	
			res = -Math.abs(parseFloat(amount));
		}
		else{
			res = amount;
		}
		return res;
	}