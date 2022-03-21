/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       06 Feb 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
var tranResults;
var customersToUpdate = [];
var afterDueDateResults;

function create_statements(type) {
    var temp = nlapiLoadFile('2515').getValue();
	try{
		
		//before we do anything first delete all old customer statements.		
		var files = getAllFiles();
		for(var x = 0; x<files.length; x++) {
			nlapiDeleteFile(files[x].fileid);
		}
		
		
		var allCustomers = getAllCustomers();
		
		//var customersToUpdate = [];
		var today = new Date();
		var todayStr = nlapiDateToString(today);

	var fourMonthsAgo = nlapiAddMonths(today, -4);
	var fourMonthsAgoStr = nlapiDateToString(fourMonthsAgo);
	
	var fromDate = fourMonthsAgoStr
	var toDate = todayStr
	
	var openBalances = getAllOpenBalances(allCustomers);
	var allTransactions = getAllTransactions(fromDate,toDate,allCustomers);

	var OBResults;
	//customersToUpdate = ['1175', '6088']
	
//	nlapiLogExecution('debug', 'customersToUpdate', JSON.stringify(customersToUpdate))
	
	for(var c = 0; c<customersToUpdate.length; c++) {
		
		var customerSelected= '';
		
		if(customersToUpdate[c] == '') {
			continue;
		}
		
		
		 customerSelected = customersToUpdate[c];

		var customerNameToPrint = nlapiLookupField('customer', customerSelected, 'companyname');
		
	
		nlapiLogExecution('debug', 'customersToUpdate', JSON.stringify(customersToUpdate, null, 2))
		
		 OBResults = getOBresults(customerSelected, openBalances)
		 tranResults = getTranresults(customerSelected, allTransactions)
		 
		 afterDueDateResults = getTransAfterDueDate(tranResults, toDate)
		 
		 if(OBResults.length > 1) {
			 tranResults.unshift(OBResults[1]) //adds the open balance obj to end of tranResults array	 
		 }
		 if(OBResults.length == 1) {
			 tranResults.unshift(OBResults[0]) //adds the open balance obj to end of tranResults array	 
		 }
		
		 
		var tots;
		var totalOB;
		var totalTrans;
		
		tots = getTotalTransactions(customerSelected, allTransactions);
		
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

			//nlapiLogExecution('debug', 'allStatement)', JSON.stringify(allStatement))
			
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
		
//		nlapiLogExecution('debug', 'array - to print', JSON.stringify(runningTotal, null ,2));
//		nlapiLogExecution('debug', 'allStatement - to print', JSON.stringify(allStatement, null ,2));
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
			row += '<td align="center" colspan="4"></td>';
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
		
		var pdf = nlapiXMLToPDF(clean);
		
		// //save pdf in filecabinet
		var customerStatements = nlapiCreateFile('Customer Statement - '+customerNameToPrint+' - '+todayStr+'.pdf', 'PDF', pdf.getValue());
		customerStatements.setFolder('2166');
		var printFileID = nlapiSubmitFile(customerStatements);

					nlapiSubmitField('customer', customerSelected, 'custentity_statement_attachment', printFileID)
					 var ctx = nlapiGetContext();
		var remainingUsage = ctx.getRemainingUsage();
		nlapiLogExecution('debug', 'checking - getRemainingUsage', remainingUsage)
		
		if (remainingUsage < 200) {
               var state = nlapiYieldScript();
               if (state.status == 'FAILURE') {
                   nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script customer statement scheduled');
               }
               else if (state.status == 'RESUME') {
                   nlapiLogExecution("AUDIT", 'customer statements galooli', "Resuming script due to: " + state.reason + ",  " + state.size);
               }
           }
	}
	

	
	}catch(err) {
		
		nlapiLogExecution('debug', 'err', err);
	}
}




function getAllOpenBalances(allCustomers) {
	
	try{
		

	//var allCustomers = getAllCustomers();

	var searchFAM = nlapiLoadSearch(null, 'customsearch_gal_custstate_openbalance_9');
	
//	nlapiLogExecution('debug', 'func - getAllOpenBalances', '')
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
			nlapiLogExecution('debug', 'customerName', customerName)
			if(customerName != ""){
			customersToUpdate.push(getCustomerID(customerName.trim(),allCustomers))
			}
		theResults.push({

			recordtype : 'Open Balance',
			customer : line.getValue(cols[1]),
//			trantype : line.getValue(cols[2]),
			trandate : line.getValue(cols[2]),
			duedate : line.getValue(cols[3]),
			amt_usd : line.getValue(cols[4]),
			amt_og : line.getValue(cols[5]),
			customerid : getCustomerID(customerName.trim(),allCustomers),
			currencyMin : line.getValue(cols[6]),
			currencyMax : line.getValue(cols[7]),
			refInvoice : ''

		});

		});

	};
	


	return theResults;
	
	}catch(err){
		nlapiLogExecution('debug', 'err - getAllOpenBalances', err)
	}
}


function getAllTransactions(fromDate,toDate, allCustomers) {
	try{
		

	//var allCustomers = getAllCustomers();
	
	var searchFAM = nlapiLoadSearch(null, 'customsearch_gal_custstate_transactions');
	
//	nlapiLogExecution('debug', 'func - getAllTransactions', '')
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
	
	}catch(err) {
		nlapiLogExecution('debug', 'err - getAllTransactions', err)
	}
}


function getAllCustomers() {
	

	var searchFAM = nlapiLoadSearch(null, 'customsearch_gal_all_customer_search');

	nlapiLogExecution('debug', 'func - getAllCustomers', '')
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
//			else{
//			
//			nlapiLogExecution('debug', 'getCustomerID','customerName : -------'+customerName + 'name : -----'+name )
//		}
		
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
		if (checkDate >= date_to) {
			res.push(tranResults[i].amt_usd)
		}
	}

	amountToSubtract = res.reduce(add, 0);

	return amountToSubtract;
}

function add(a, b) {
    return parseFloat(a) + parseFloat(b);
}


function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};




function getAllFiles() {


var folder = 2166 // the folder ID we care about

var filters = new Array();
filters[0] = new nlobjSearchFilter('internalid', null, 'is', folder);


var columns = new Array();
var filename = new nlobjSearchColumn('name', 'file');
var fileid = new nlobjSearchColumn('internalid', 'file');

columns[0] = filename;
columns[1] = fileid;


var searchResult = nlapiSearchRecord('folder', null , filters , columns);

var theResults = [];

	if (searchResult != null) {
		searchResult.forEach(function(line) {
			

		theResults.push({

			filename : line.getValue(columns[0]),
			fileid : line.getValue(columns[1]),


		});

		});

	};
	


	return theResults;

}


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
	 //   nlapiLogExecution('debug', 'memo + num', memo + ' ---- ' + num)
	   temp.push(value);
	    return value; }, 0);
	
	return temp;
	
}