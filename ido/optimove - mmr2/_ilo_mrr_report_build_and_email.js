

function getExRates() {
	

var allSec=[];
var secondaryExRates = [];
var searchmulti = nlapiLoadSearch(null, 'customsearch_ilo_multibook_exrate_search');
var resultsmulti = [];
var searchid = 0;
var resultset = searchmulti.runSearch();
var rs;

do {
    var resultslice = resultset.getResults(searchid, searchid + 1000);
    for (rs in resultslice) {
        
    	allSec.push(resultsmulti[resultslice[rs].id] = resultslice[rs]);
        searchid++;
    }
} while (resultslice.length >= 1000);

		if (allSec != null) {
			allSec.forEach(function(line) {
				
				secondaryExRates[line.getValue('internalid')] = line.getValue('exchangerate');
				
			});

		};
		
		
		//to get secondary exRate = secondaryExRates[23058] //index is record id of transaction
		return secondaryExRates;
}

var accPeriods = getAccountingPeriods();



function buildAndSendMRR_report(type) {
	
	try{
		

	var currentContext = nlapiGetContext();
	//var getPeriodStart = request.getParameter('custpage_select_periodfrom');
	//var getPeriodEnd = request.getParameter('custpage_select_periodto');
	//var range = getPeriodRange(accPeriods, getPeriodStart, getPeriodEnd);
	
	var getPeriodStart = currentContext.getSetting('SCRIPT', 'custscript_mrr_period_start');
	var getPeriodEnd = currentContext.getSetting('SCRIPT', 'custscript_mrr_period_end')
	var range = currentContext.getSetting('SCRIPT', 'custscript_mrr_period_range');
	var sendTo = currentContext.getSetting('SCRIPT', 'custscript_mrr_email_address');
		
	nlapiLogExecution('debug', 'getPeriodStart', getPeriodStart);
	nlapiLogExecution('debug', 'getPeriodEnd', getPeriodEnd)
	nlapiLogExecution('debug', 'range', range)
	nlapiLogExecution('debug', 'sendTo', sendTo)
	
nlapiLogExecution('debug', 'got to schedueld script', 'true')

var resultsArr = [];
var all = [];
var searchmulti = nlapiLoadSearch(null, 'customsearch_ilo_opti_mrr');
var resultsmulti = [];
var searchid = 0;
var resultset = searchmulti.runSearch();
var rs;

nlapiLogExecution('debug', 'search loaded', 'search loaded')

do {
	var resultslice = resultset.getResults(searchid, searchid + 1000);
	for (rs in resultslice) {
		
		all.push(resultsmulti[resultslice[rs].id] = resultslice[rs]);
		searchid++;
	}
} while (resultslice.length >= 1000);



nlapiLogExecution('debug', 'all', JSON.stringify(all))

		if (all != null) {
for(var i = 0; i<all.length; i++) {
	
	
	nlapiLogExecution('debug', 'getText(postingperiod)', JSON.stringify(all[i].getText('postingperiod')))
	
	
	if(range.indexOf(all[i].getText('postingperiod')) != -1) {
		
		var lineMemo = all[i].getValue('memo').replace(/(\r\n|\n|\r)/gm," ");
		var memoMain = all[i].getValue('memomain').replace(/(\r\n|\n|\r)/gm," ");

			resultsArr.push({
			
			date : all[i].getValue('trandate'),
			period: all[i].getText('postingperiod').replace(/,/g , " "),
			type : all[i].getText('type'),
			optimoveID : all[i].getValue('custentity1', 'customer').replace(/,/g , " "),
			name : all[i].getText('entity').replace(/,/g , " "),
			item : all[i].getText('item').replace(/,/g , " "),
			currency : all[i].getText('currency'),
			quantity : all[i].getValue('quantity'),
			formulaNumeric :  all[i].getValue('formulanumeric'),
			fxamount : all[i].getValue('fxamount'),
			exchangeRate : all[i].getValue('exchangeRate'),
			rate : all[i].getValue('rate').replace(/,/g , " "),
			amount: all[i].getValue('amount').replace(/,/g , " "),
			recurring : all[i].getText('custcol8'),
			oneTimeRetro : all[i].getText('custcol1').replace(/,/g , " "),
			optimoveRate : all[i].getValue('custcol_oprate').replace(/,/g , " "),
			optimoveExRate : all[i].getValue('custcol_opexrate').replace(/,/g , " "),
			fromDate : all[i].getValue('custcol_fromdate').replace(/,/g , " "),
			toDate : all[i].getValue('custcol_todate').replace(/,/g , " "),
			lineMemo : lineMemo.replace(/,/g , " "),
			memoMain : memoMain.replace(/,/g , " "),
			custCategory : all[i].getText('category', 'customer').replace(/,/g , " "),
			custTerms : all[i].getText('terms', 'customer').replace(/,/g , " "),
			billingCountry : all[i].getText('billcountry').replace(/,/g , " "),
			billingStateProvince : all[i].getValue('billstate').replace(/,/g , " "),
			docNumber : all[i].getValue('tranid'),
			account : all[i].getText('account').replace(/,/g , ""),
			batchNumber : all[i].getValue('custbody_ilo_batch_number').replace(/,/g , ""),
			recID : all[i].id,
			lineNumber : all[i].getValue('line'),
			subsid : all[i].getText('subsidiary')
			
			});

	}//end of range
}

		};
		
nlapiLogExecution('debug', 'got results', 'got results')

var secondaryExRates = getExRates();

nlapiLogExecution('debug', 'got getExRates', 'got getExRates')

var data = '';

for(var i = 0; i<resultsArr.length; i++) {
	
	var name = resultsArr[i].name;
	if(name.indexOf(",") > -1) {
		name.replace(/,/g , "");
	}
	var lineNumber = resultsArr[i].lineNumber;
	var currRecID = resultsArr[i].recID;


	
	//data += resultsArr[i].docNumber+","+resultsArr[i].lineNumber+","+resultsArr[i].date+","+resultsArr[i].period+","+resultsArr[i].type+","+resultsArr[i].optimoveID+","+name+","+resultsArr[i].item+","+resultsArr[i].currency+","+resultsArr[i].quantity+","+parseFloat(resultsArr[i].fxamount) / parseFloat(resultsArr[i].quantity).toFixed(2)+","+resultsArr[i].fxamount+","+resultsArr[i].exchangeRate+","+resultsArr[i].rate+","+resultsArr[i].amount+","+resultsArr[i].recurring+","+resultsArr[i].oneTimeRetro+","+resultsArr[i].optimoveRate+","+resultsArr[i].optimoveExRate+","+resultsArr[i].fromDate+","+resultsArr[i].toDate+","+resultsArr[i].lineMemo+","+resultsArr[i].memoMain+","+resultsArr[i].custCategory+","+resultsArr[i].custTerms+","+resultsArr[i].billingCountry+","+resultsArr[i].billingStateProvince+","+resultsArr[i].account+","+resultsArr[i].batchNumber+","+secondaryExRates[resultsArr[i].recID]+","+parseFloat(resultsArr[i].fxamount) * parseFloat(secondaryExRates[resultsArr[i].recID]).toFixed(2)+","+resultsArr[i].subsid+ "\n";
	data += ' '+","+resultsArr[i].date+","+resultsArr[i].period+","+resultsArr[i].type+","+resultsArr[i].optimoveID+","+name+","+resultsArr[i].item+","+resultsArr[i].currency+","+resultsArr[i].quantity+","+parseFloat(resultsArr[i].fxamount) / parseFloat(resultsArr[i].quantity).toFixed(2)+","+resultsArr[i].fxamount+","+resultsArr[i].exchangeRate+","+resultsArr[i].rate+","+resultsArr[i].amount+","+resultsArr[i].recurring+","+resultsArr[i].oneTimeRetro+","+resultsArr[i].optimoveRate+","+resultsArr[i].optimoveExRate+","+resultsArr[i].fromDate+","+resultsArr[i].toDate+","+resultsArr[i].lineMemo+","+resultsArr[i].memoMain+","+resultsArr[i].custCategory+","+resultsArr[i].custTerms+","+resultsArr[i].billingCountry+","+resultsArr[i].billingStateProvince+","+resultsArr[i].docNumber+","+resultsArr[i].account+","+resultsArr[i].batchNumber+","+resultsArr[i].lineNumber+","+parseFloat(resultsArr[i].fxamount) * parseFloat(secondaryExRates[resultsArr[i].recID]).toFixed(2)+","+resultsArr[i].subsid+","+secondaryExRates[resultsArr[i].recID]+ "\n";
	
}

nlapiLogExecution('debug', 'creating csv', 'creating csv')

var csv_download = "*,Date,Period,Type,Optimove ID,Name,Item,Currency,Quantity,Item Rate TRX Currency,Total Line TRX Currency,Exchange Rate,Item Rate USD,Total Line USD,Recurring,One Time/Retro,Optimove Rate,Optimove Exchange Rate,From,To,Line Memo, Billing Period,Vertical,Terms,Country,State/Province,Document Number,Account,Upload Batch Number,Line No.,Local Book Amount,Subsidiary,Local Book Exchange Rate"+ "\n" +data;
//var csv_download =  "Document Number,Line No.,Date,Period,Type,Optimove ID,Name,Item,Currency,Quantity,Item Rate TRX Currency,Total Line TRX Currency,Exchange Rate,Item Rate USD, Total Line USD,Recurring,One Time/Retro,Optimove Rate,Optimove Exchange Rate,From,To,Line Memo,Billing Period,Vertical,Terms,Country,State/Province,Account,Upload Batch Number,Local Book Exchange Rate,Local Book Amount,Subsidiary"+ "\n" +data;

var today = new Date();
var todayStr = nlapiDateToString(today)

var csvfile = nlapiCreateFile("MRR CSV File - " + todayStr, "CSV", csv_download);
csvfile.setFolder(-15);
var file = nlapiSubmitFile(csvfile);

nlapiLogExecution('debug', 'created csv and submitted' ,  'created csv and submitted')

if (file != null) {
	
	var reportAttachment = nlapiLoadFile(file)
	
	nlapiSendEmail('3211', sendTo, 'MRR CSV File - '+ todayStr, 'Attached is the CSV file of the MRR Report', null, null, null, reportAttachment, null, null, null)
	nlapiLogExecution('debug', 'email sent' ,  'email sent')
}
	}catch(err){
		nlapiLogExecution('debug', 'err', err)
	}
}




function getAccountingPeriods() {

	var searchPeriods = nlapiLoadSearch(null,
			'customsearch_ilo_acc_period_search');

	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchPeriods.runSearch();
	var rs;

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

			allResults.push({

				periodname : line.getValue('periodname'),

			});

		});
	}
	;

	return allResults;
};

function getPeriodRange(accPeriods, start, end) {

	var periodStr = [];
	for(var i = 0; i<accPeriods.length; i++) {

	periodStr.push(accPeriods[i].periodname);
	}

	var endIndex = periodStr.indexOf(end);

	var startIndex = periodStr.indexOf(start);
	
	var selection = periodStr.slice(startIndex, endIndex+1);

	return selection;
	};
	
	
	String.prototype.replaceAll = function(search, replacement) {
	    var target = this;
	    return target.replace(new RegExp(search, 'g'), replacement);
	};
