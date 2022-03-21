/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Jan 2018     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

var customerName = '';
var tranResults;
var afterDueDateResults;
var transToPrint;

function customer_statement_suitelet(request, response){
	
	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('Customer Statements');
		form.addSubmitButton('Continue');
		
		var searchFilterGroup = form.addFieldGroup('custpage_search_group','Search');		
		var dateRangeGroup = form.addFieldGroup('custpage_dates_group','Date Range');		
		
		var selectCustomer = form.addField('custpage_select_customer','select', 'Customer', 'CUSTOMER', 'custpage_search_group');

		
		var selectDateFrom = form.addField('custpage_select_datefrom','date','From', 'Date', 'custpage_dates_group');
		selectDateFrom.setMandatory( true );
		var selectDateTo = form.addField('custpage_select_dateto','date', 'To', 'Date', 'custpage_dates_group');
		selectDateTo.setMandatory( true );
		


		var toNextPage = form.addField('custpage_ilo_tonextpage','text', 'tosend');
		toNextPage.setDefaultValue('next');
		toNextPage.setDisplayType('hidden');


		response.writePage(form);

		}//end of first if
	
	else if (request.getParameter('custpage_ilo_tonextpage') == 'next'){
		
		var customerSelected = request.getParameter('custpage_select_customer');
		nlapiLogExecution('debug', 'customerSelected', customerSelected)
		var fromDate = request.getParameter('custpage_select_datefrom');
		//nlapiLogExecution('debug', 'fromDate', fromDate)
		var toDate = request.getParameter('custpage_select_dateto');
		//nlapiLogExecution('debug', 'toDate', toDate)
		
		var getUser = nlapiGetContext().user
		// get fields and values to change on employee-level form for search
		var fields = new Array();
		var values = new Array();
		fields[0] = 'custentity_financial_report_start_date';
		values[0] = fromDate;
		fields[1] = 'custentity_financial_report_end_date';
		values[1] = toDate;
		 //update and submit vendor-level form
		var updatefields = nlapiSubmitField('employee', getUser, fields, values);

		var resultsForm = nlapiCreateForm('Customer Statement for Review');
		resultsForm.addSubmitButton('Create PDF');
		
		var today = new Date();
		var todayStr = nlapiDateToString(today);
		
		var openBalances = getAllOpenBalances(fromDate);
		var allTransactions = getAllTransactions(fromDate,toDate);
		//nlapiLogExecution('debug', 'allTransactions', JSON.stringify(allTransactions, null ,2))

		
		var OBResults = getOBresults(customerSelected, openBalances)
		 tranResults = getTranresults(customerSelected, allTransactions);
		//nlapiLogExecution('debug', 'tranResults', JSON.stringify(tranResults, null ,2))
		afterDueDateResults = getTransAfterDueDate(tranResults, toDate)
		
		tranRESULTS = tranResults;
		
		 if(OBResults.length > 1) {
			 tranResults.unshift(OBResults[1]) //adds the open balance obj to end of tranResults array	 
		 }
		 if(OBResults.length == 1) {
			 tranResults.unshift(OBResults[0]) //adds the open balance obj to end of tranResults array	 
		 }

		
		 //nlapiLogExecution('debug', 'tranRESULTS', JSON.stringify(tranRESULTS, null ,2))
		
		var resultsSubList = resultsForm.addSubList('custpage_results_sublist', 'list', null, null);
		
		 customerName = nlapiLookupField('customer', customerSelected, 'companyname');
		
		 var htmlHeader = resultsForm.addField('custpage_header', 'inlinehtml');
		     htmlHeader.setDefaultValue("<span style='font-size:21px'><b>"+customerName+"</b></span><br><span style='font-size:18px'>"+fromDate+" - "+toDate+"</span>");
	
		
		var res_recordType = resultsSubList.addField('custpage_resultssublist_rectype', 'text','Record Type');
		var res_tranType = resultsSubList.addField('custpage_resultssublist_trantype', 'text','Transaction Type');
		var res_invRef = resultsSubList.addField('custpage_resultssublist_invref', 'text','Reference Invoice');
		var res_currency = resultsSubList.addField('custpage_resultssublist_currency', 'text','Currency');
		var res_tranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'text','Transaction Date');
		var res_dueDate = resultsSubList.addField('custpage_resultssublist_duedate', 'text', 'Transaction Due Date');
		var res_amtUSD = resultsSubList.addField('custpage_resultssublist_amtusd', 'text', 'Amount USD');
		var res_amtOG = resultsSubList.addField('custpage_resultssublist_amtog', 'text', 'Balance');

		

		
		var lineLength = tranResults.length +1;
		var tots = getTotalTransactions(customerSelected, allTransactions);

		
		var totalOB;
		var totalTrans;
		
		 if(OBResults.length > 1) {
			  totalOB = parseFloat(OBResults[1].amt_usd);
				 totalTrans = parseFloat(tots[0].tot_usd);
		 }
		 if(OBResults.length == 1) {
				 totalOB = parseFloat(OBResults[0].amt_usd);
				 totalTrans = parseFloat(tots[0].tot_usd);
		 }
		
		var TOTAL = totalOB+totalTrans;
		var totalAsOf  = TOTAL-afterDueDateResults;
		

		
		var to = nlapiGetContext();
		var bd = to.getRemainingUsage();
		nlapiLogExecution('debug', 'getRemainingUsage', bd)
		
		var toPrint = resultsForm.addField('custpage_ilo_toprint','text', 'toprint');
		toPrint.setDefaultValue('print');
		toPrint.setDisplayType('hidden');
		
		var vals_customerid = resultsForm.addField('custpage_vals_customerid', 'text', 'vals_customerid');
		vals_customerid.setDefaultValue(customerSelected);
		vals_customerid.setDisplayType('hidden');
		var vals_fromDate = resultsForm.addField('custpage_vals_fromdate', 'date', 'vals_fromDate');
		vals_fromDate.setDefaultValue(fromDate);
		vals_fromDate.setDisplayType('hidden');
		var vals_toDate = resultsForm.addField('custpage_vals_todate', 'date', 'vals_toDate');
		vals_toDate.setDefaultValue(toDate);
		vals_toDate.setDisplayType('hidden');
		
		
		var totalAsOfObj = {				
				recordtype : 'Balance : ' +toDate+ '',
				customer : '',
				trantype : '',
				trandate : '',
				duedate : '',
				amt_usd : totalAsOf,
				amt_og : '',
				customerid : '',
				currency : '',
				refInvoice : '',
				hasInstallment : ''	
		}
		
		
		var beforeAsOf = [];
		var afterAsOf = [];
		
		for(var x = 0; x<tranResults.length;x++) {
			
			var currDate = nlapiStringToDate(tranResults[x].duedate);
			var enddate = nlapiStringToDate(toDate);
			
			if(currDate <= enddate) {
				
				beforeAsOf.push(tranResults[x]);
			}
			if(currDate > enddate) {
				
				afterAsOf.push(tranResults[x]);
			}
			
			
		}

	
		
		
		
		var TOTALObj = {				
				recordtype : 'Total Balance',
				customer : '',
				trantype : '',
				trandate : '',
				duedate : '',
				amt_usd : TOTAL,
				amt_og : '',
				customerid : '',
				currency : '',
				refInvoice : '',
				hasInstallment : ''	
		}
		
		afterAsOf.unshift(totalAsOfObj);
		afterAsOf.push(TOTALObj)
		
		var allStatement = beforeAsOf.concat(afterAsOf);
		
		
		if(allStatement != undefined) {
			
			var array = [];
		
			for(var i = 0; i<allStatement.length; i++) {
		

			var runningTotal = 0;
			var res;
			var recType = allStatement[i].recordtype

			nlapiLogExecution('debug', 'allStatement)', JSON.stringify(allStatement))
			
			if( allStatement[i].recordtype != "") {

				if(allStatement[i].recordtype.indexOf('Balance : ') != -1) {
					array.push('0');
				}
//				if(allStatement[i].amt_og == '') {
//				array.push('0');
//			}
					 array.push(allStatement[i].amt_usd)
	
			}

			nlapiLogExecution('debug', 'getRunningTotal-array', JSON.stringify(array, null, 2))
			var runningTotal = getRunningTotal(array);
			
			nlapiLogExecution('debug', 'runningTotal', JSON.stringify(runningTotal, null, 2))

		
			
				resultsSubList.setLineItemValue('custpage_resultssublist_rectype',i+1 , allStatement[i].recordtype);
				resultsSubList.setLineItemValue('custpage_resultssublist_trantype',i+1 ,allStatement[i].trantype);
				resultsSubList.setLineItemValue('custpage_resultssublist_invref',i+1 ,allStatement[i].refInvoice);
				resultsSubList.setLineItemValue('custpage_resultssublist_currency',i+1 ,allStatement[i].currency);
				resultsSubList.setLineItemValue('custpage_resultssublist_trandate',i+1 ,allStatement[i].trandate);
				if(allStatement[i].recordtype != 'Open Balance') {
					resultsSubList.setLineItemValue('custpage_resultssublist_duedate',i+1 ,allStatement[i].duedate);
				}
				if(allStatement[i].recordtype != 'Open Balance') {
				resultsSubList.setLineItemValue('custpage_resultssublist_amtusd',i+1 ,formatNumber(parseFloat(allStatement[i].amt_usd).toFixed(2)));
				}
				
				if(allStatement[i].trantype == '') {	
				resultsSubList.setLineItemValue('custpage_resultssublist_amtog', 1 ,formatNumber(parseFloat(allStatement[0].amt_usd).toFixed(2)));
				}
				for(var x = 1; x<runningTotal.length-1; x++) {
//					if(runningTotal[x] == '0.00') {			
//						resultsSubList.setLineItemValue('custpage_resultssublist_amtog',x+1 ,'');
//					}else{
					if(runningTotal[x] != 0)
						resultsSubList.setLineItemValue('custpage_resultssublist_amtog',x+1 ,formatNumber(parseFloat(runningTotal[x]).toFixed(2)));	
					//}
					
				}
				
			}
			
			
	
			
		}
		
		
		
		
		
		
		
//		var json1 = 'OPEN BALANCES : ' + JSON.stringify(OBResults);
//		var json2 = 'BEFORE : ' + JSON.stringify(beforeAsOf, null ,2);
//		var endate = toDate
//		var json3 = 'ALL : ' +  JSON.stringify(allStatement, null ,2);
//		response.write(json3)
		response.writePage(resultsForm)
		
	}
	else if (request.getParameter('custpage_ilo_toprint') == 'print'){
		
		
		var customerSelected = request.getParameter('custpage_vals_customerid');
		var fromDate = request.getParameter('custpage_vals_fromdate');
		var toDate = request.getParameter('custpage_vals_todate');

		var customerNameToPrint = nlapiLookupField('customer', customerSelected, 'companyname');
		
		
		var today = new Date();
		var todayStr = nlapiDateToString(today);
		
		var openBalances = getAllOpenBalances(fromDate);
		var allTransactions = getAllTransactions(fromDate,toDate);
		
		//nlapiLogExecution('debug', 'allTransactions', JSON.stringify(allTransactions, null, 2))
		
		var OBResults = getOBresults(customerSelected, openBalances)
		 tranResults = getTranresults(customerSelected, allTransactions)
		 
		 afterDueDateResults = getTransAfterDueDate(tranResults, toDate)
		 
		 if(OBResults.length > 1) {
			 tranResults.unshift(OBResults[1]) //adds the open balance obj to end of tranResults array	 
		 }
		 if(OBResults.length == 1) {
			 tranResults.unshift(OBResults[0]) //adds the open balance obj to end of tranResults array	 
		 }
		
		 
		var tots = getTotalTransactions(customerSelected, allTransactions);
		var totalOB;
		var totalTrans;
		
		 if(OBResults.length > 1) {
			  totalOB = parseFloat(OBResults[1].amt_usd);
				 totalTrans = parseFloat(tots[0].tot_usd);
		 }
		 if(OBResults.length == 1) {
				 totalOB = parseFloat(OBResults[0].amt_usd);
				 totalTrans = parseFloat(tots[0].tot_usd);
		 }
		var TOTAL = totalOB+totalTrans;
		var TotalAsOf = TOTAL - afterDueDateResults
		
		
	    var temp = nlapiLoadFile('2515').getValue();
	   
		var startTag = temp.indexOf("start") -7; 
	    var endTag = temp.indexOf("end") +9; 
	    
	    var firstHalf = temp.substring(0, startTag);
	    var secondHalf = temp.substring(endTag,temp.length-1);


	    var to = nlapiGetContext();
		var bd = to.getRemainingUsage();
		nlapiLogExecution('debug', 'checking - getRemainingUsage', bd)
	    
		var dynList = '';
		
		
		var totalAsOfObj = {				
				recordtype : 'Balance : '+toDate+'',
				customer : '',
				trantype : '',
				trandate : '',
				duedate : '',
				amt_usd : TotalAsOf,
				amt_og : '',
				customerid : '',
				currency : '',
				refInvoice : '',
				hasInstallment : ''	
		}
		
		
		var beforeAsOf = [];
		var afterAsOf = [];
		
		for(var x = 0; x<tranResults.length;x++) {
			
			var currDate = nlapiStringToDate(tranResults[x].duedate);
			var enddate = nlapiStringToDate(toDate);
			
			if(currDate <= enddate) {
				
				beforeAsOf.push(tranResults[x]);
			}
			if(currDate > enddate) {
				
				afterAsOf.push(tranResults[x]);
			}
			
			
		}


		var TOTALObj = {				
				recordtype : 'Total Balance',
				customer : '',
				trantype : '',
				trandate : '',
				duedate : '',
				amt_usd : TOTAL,
				amt_og : '',
				customerid : '',
				currency : '',
				refInvoice : '',
				hasInstallment : ''	
		}
		
		afterAsOf.unshift(totalAsOfObj);
		afterAsOf.push(TOTALObj)
		
		var allStatement = beforeAsOf.concat(afterAsOf);
		

		var array = [];
		for(var i = 0; i<allStatement.length; i++) {
			
			var runningTotal = 0;
			var res;
			var recType = allStatement[i].recordtype

			nlapiLogExecution('debug', 'allStatement)', JSON.stringify(allStatement))
			
			if( allStatement[i].recordtype != "") {

				if(allStatement[i].recordtype.indexOf('Balance : ') != -1) {
					array.push('0');
				}

					 array.push(allStatement[i].amt_usd)
	
			}
		}
		
		//array.unshift('0')
		//array.push('0')
		
		var runningTotal = getRunningTotal(array);
		for(var x = 0; x<allStatement.length; x++) {
			for(var y = 0; y<runningTotal.length; y++) {
				
				allStatement[x].amt_og = runningTotal[x]
			}
			
		}
		
		nlapiLogExecution('debug', 'array - to print', JSON.stringify(runningTotal, null ,2));
		nlapiLogExecution('debug', 'allStatement - to print', JSON.stringify(allStatement, null ,2));
		allStatement[0].trandate = '';
		allStatement[0].duedate = '';
		allStatement[0].amt_usd = '';
		
		allStatement.forEach(function(line) {
			
			
			
			var row = '<tr>';
			if(line.trantype != '') {
				
				row += '<td align="center" colspan="4">' + line.recordtype + '</td>';
				row += '<td align="center" colspan="4">' + line.trantype + '</td>';
				row += '<td align="center" colspan="3">' + line.refInvoice + '</td>';
				row += '<td align="center" colspan="2">' + line.currency + '</td>';
				row += '<td align="center" colspan="3">' + line.trandate + '</td>';
				row += '<td align="center" colspan="3">' + line.duedate + '</td>';
				row += '<td align="center" colspan="4">' + formatNumber(parseFloat(line.amt_usd).toFixed(2)).replace('NaN', '') + '</td>';
				row += '<td align="center" colspan="4">' + formatNumber(parseFloat(line.amt_og).toFixed(2)) + '</td>';
				row += '</tr>';	
				
			}
			
			
			
			if(line.trantype == '') {
			row += '<td align="center" colspan="4" style="font-weight: bold; color:#444;text-overflow: ellipsis;white-space: nowrap;">' + line.recordtype + '</td>';
			row += '<td align="center" colspan="4">' + line.trantype + '</td>';
			row += '<td align="center" colspan="3">' + line.refInvoice + '</td>';
			row += '<td align="center" colspan="2">' + line.currency + '</td>';
			row += '<td align="center" colspan="3">' + line.trandate + '</td>';
			row += '<td align="center" colspan="3"></td>';
			row += '<td align="center" colspan="4"></td>';
			row += '<td align="center" colspan="4" style="font-weight: bold; color:#444">' + formatNumber(parseFloat(line.amt_usd).toFixed(2)) + '</td>';
		
			row += '</tr>';
			}
		
		    
			dynList+= row;
		
		});
		
	  
		var allTemplate = firstHalf+dynList+secondHalf.toString();	     
		
		
		var pattern = /_customer_name|_from_date|_from_date|_asterik/ig;

								var _customer_name = customerNameToPrint;
								var _from_date = fromDate;
								var _to_date = toDate;
								//var _asterik = '* Customer Installments are not included in total.'
								
								var mapObj = {
										_customer_name : _customer_name,
										_from_date : _from_date,
										_to_date : _to_date,
										//_asterik : _asterik,
							};
								

									var str = allTemplate.replace(/\{\{(.*?)\}\}/g, function(i, match) {
									    return mapObj[match];
									});
	    

		//var json = JSON.stringify(allStatement, null, 2)
	  //  response.write(json)
		//downloadData(tranRESULTS, response)
		var clean = str.replaceAll("&", "&amp;");							
									
	    downloadDataPDF(clean, response,customerNameToPrint)
	}


}


function getAllOpenBalances(fromDate) {
	
	var allCustomers = getAllCustomers();

		nlapiLogExecution('debug', 'OB - fromDate', fromDate)
	var searchFAM = nlapiLoadSearch(null, 'customsearch_gal_custstate_openbalance_3');
	//searchFAM.addFilter(new nlobjSearchFilter('trandate', null, 'notafter', fromDate));

	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();
	

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allSelection
					.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allSelection != null) {
		allSelection.forEach(function(line) {
			
			var customerName = line.getValue(cols[1]).replace(/[0-9]/g, '')

		theResults.push({

			recordtype : line.getValue(cols[0]),
			customer : line.getValue(cols[1]),
			trantype : line.getValue(cols[2]),
			trandate : line.getValue(cols[3]),
			duedate : line.getValue(cols[4]),
			amt_usd : line.getValue(cols[5]),
			amt_og : line.getValue(cols[6]),
			customerid : getCustomerID(customerName.trim(),allCustomers),
			currencyMin : line.getValue(cols[7]),
			currencyMax : line.getValue(cols[8]),
			refInvoice : ''

		});

		});

	};
	


	return theResults;
}

function getAllTransactions(fromDate,toDate) {
	
	var allCustomers = getAllCustomers();
	
	var searchFAM = nlapiLoadSearch(null, 'customsearch_gal_custstate_transactions');
	searchFAM.addFilter(new nlobjSearchFilter('trandate', null, 'notbefore', fromDate));
	searchFAM.addFilter(new nlobjSearchFilter('trandate', null, 'notafter', toDate));

	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();
	

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allSelection
					.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allSelection != null) {
		allSelection.forEach(function(line) {
			
			var customerName = line.getValue(cols[1]).replace(/[0-9]/g, '')
			var tranType = line.getValue(cols[2]);
			if(tranType == 'CustInvc'){
				tranType = 'Invoice'
			}

			var recordType = line.getValue(cols[0]);
			if(recordType == 'Customer Installment') {
				recordType = '*Cust. Installment'
			}
			
			var refInv = line.getText(cols[9]).replace('Invoice #', '')

		theResults.push({
			recordtype : recordType,
			customer : line.getValue(cols[1]),
			trantype : tranType,
			trandate : line.getValue(cols[3]),
			duedate : line.getValue(cols[4]),
			amt_usd : line.getValue(cols[5]),
			amt_og : line.getValue(cols[6]),
			customerid : getCustomerID(customerName.trim(),allCustomers),
			currency : line.getText(cols[7]),
			refInvoice : refInv,
			hasInstallment : line.getValue(cols[10])

		});

		});

	};
	transToPrint = theResults
	return theResults;
}


function getAllCustomers() {
	

	var searchFAM = nlapiLoadSearch(null, 'customsearch_gal_all_customer_search');


	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();
	

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allSelection
					.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allSelection != null) {
		allSelection.forEach(function(line) {

		theResults.push({

			name : line.getValue('altname'),
			companyname : line.getValue('companyname'),
			internalid : line.getValue('internalid'),

		});

		});

	};
	


	return theResults;
}


function getCustomerID(name,allCustomers){
	
	var customerID = '';
	
var allCustomers = allCustomers;
	
	for(var i = 0;i<allCustomers.length; i++) {
		
		var customerName = allCustomers[i].companyname;
		
		if(customerName == name) {
			
			customerID = allCustomers[i].internalid
		}
		
	}
	
	return customerID;
	
}

function getOBresults(customerSelected, openBalances) {
	
	var openBalanceresults = [];
	
	for(var i = 0; i<openBalances.length; i++) {
		
		if(openBalances[i].customerid == customerSelected) {
			
			if(openBalances[i].currencyMin == openBalances[i].currencyMax){
				
				openBalances[i].currency = openBalances[i].currencyMin;
			}
			if(openBalances[i].currencyMin != openBalances[i].currencyMax){
				
				openBalances[i].currency = 'Mixed';
			}
			
			openBalanceresults.push(openBalances[i])
		}
		
	}
	return openBalanceresults
}


function getTranresults(customerSelected, allTransactions) {
	
	var transactionResults = [];
	
	for(var x = 0; x<allTransactions.length; x++) {
		
		if(allTransactions[x].customerid == customerSelected) {
			
			transactionResults.push(allTransactions[x])
		}
		
	}
	
	
	return transactionResults;
}

function getTotalTransactions(customerSelected, allTransactions){
	

	
	var totals_usd = [];
	var totals_og = [];
	var totalsObj = [];
	
	//nlapiLogExecution('debug', 'allTransactions', JSON.stringify(allTransactions))
	
	for(var x = 0; x<allTransactions.length; x++) {
		
		if(allTransactions[x].customerid == customerSelected) {
			
			totals_usd.push(allTransactions[x].amt_usd);
			totals_og.push(allTransactions[x].amt_og);
		}
		
	}
	
	var tot_usd = totals_usd.reduce(add, 0);
	var tot_og = totals_og.reduce(add, 0);
	
	
	totalsObj.push({
		tot_usd : tot_usd,
		tot_og : tot_og
	})
	
	return totalsObj;
	
	
}


function getTransAfterDueDate(tranResults, toDate) {

	var res = [];
	var amountToSubtract = 0;

	var date_to = nlapiStringToDate(toDate);
	for (var i = 0; i < tranResults.length; i++) {

		var checkDate = nlapiStringToDate(tranResults[i].duedate)
		var recType = tranResults[i].recordtype;
		if (checkDate == date_to || checkDate > date_to) {
			res.push(tranResults[i].amt_usd)
		}
	}

	amountToSubtract = res.reduce(add, 0);

	return amountToSubtract;
}

function add(a, b) {
    return parseFloat(a) + parseFloat(b);
}

function downloadDataPDF(data, response, customerName) {
	
	var file = nlapiXMLToPDF( data );
//	response.setEncoding('windows-1252');
	response.setContentType('PDF','Customer Statement: '+customerName+'.pdf');
	response.write( file.getValue() ); 

}

function downloadData(data, response, form) {
    // set content type, file name, and content-disposition (inline means display in browser)
	response.setEncoding('UTF-8');
    response.setContentType('PLAINTEXT', 'test.txt');
    // write response to the client
    response.write(data);
}

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function getRunningTotal(array) {
	
	var temp = [];
	array.reduce(function(memo, num) { 
		
		if(num == '0' ) {
			memo = '0'
		}
		
//		if(num == '') {
//			memo = '0'
//		}
	    var value = parseFloat(memo) + parseFloat(num);
	    nlapiLogExecution('debug', 'memo + num', memo + ' ---- ' + num)
	   temp.push(value);
	    return value; }, 0);
	
	return temp;
	
}
