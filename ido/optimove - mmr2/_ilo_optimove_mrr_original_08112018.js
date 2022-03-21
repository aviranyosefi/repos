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

function run_mrr(request, response) {
	

	
	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('MRR Report');
		form.addSubmitButton('Continue');
		
		var fieldGroup = form.addFieldGroup('custpage_search_group','Search');
		
		var selectPeriodFrom = form.addField('custpage_select_periodfrom','select','From Period', null, 'custpage_search_group');
		selectPeriodFrom.setMandatory( true );
		selectPeriodFrom.addSelectOption('', '');
		for(var i = 0; i<accPeriods.length; i++) {
			selectPeriodFrom.addSelectOption(accPeriods[i].periodname, accPeriods[i].periodname);
		}
		selectPeriodFrom.setDefaultValue('Jan 2017');
		var selectPeriodTo = form.addField('custpage_select_periodto','select', 'To Period', null, 'custpage_search_group');
		selectPeriodTo.setMandatory( true );
		selectPeriodTo.setLayoutType('normal', 'startcol');
		selectPeriodTo.addSelectOption('', '');
		for(var i = 0; i<accPeriods.length; i++) {
			selectPeriodTo.addSelectOption(accPeriods[i].periodname, accPeriods[i].periodname);
		}
		selectPeriodTo.setDefaultValue('Feb 2017');
		
		var toNextPage = form.addField('custpage_ilo_tonextpage','text', 'tosend');
		toNextPage.setDefaultValue('next');
		toNextPage.setDisplayType('hidden');
		
		response.writePage(form)
	}
	
	else if (request.getParameter('custpage_ilo_tonextpage') == 'next'){
		
		var getPeriodStart = request.getParameter('custpage_select_periodfrom');
		var getPeriodEnd = request.getParameter('custpage_select_periodto');
		var range = getPeriodRange(accPeriods, getPeriodStart, getPeriodEnd);
		
		nlapiLogExecution('debug', 'range', JSON.stringify(range));

	var resultsArr = [];
	var all = [];
	var searchmulti = nlapiLoadSearch(null, 'customsearch_ilo_opti_mrr');
	var resultsmulti = [];
	var searchid = 0;
	var resultset = searchmulti.runSearch();
	var rs;

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {
			
			all.push(resultsmulti[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);


			if (all != null) {
	for(var i = 0; i<all.length; i++) {
		
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
			

	var reportForm = nlapiCreateForm('MRR Report');

	
	var secondaryExRates = getExRates();

	var resultsSubList = reportForm.addSubList('custpage_results_sublist',
			'list', 'Results', null);
	
	var res_asterik = resultsSubList.addField(
			'custpage_sublist_asterik', 'text', '*');
	
	var res_Date = resultsSubList.addField(
			'custpage_sublist_date', 'date', 'Date');
	
	var res_Period = resultsSubList.addField('custpage_sublist_period',
			'text', 'Period');
	
	var res_TranType = resultsSubList.addField(
			'custpage_sublist_trantype', 'text', 'Type');
	
	
	var res_Opti_ID = resultsSubList.addField('custpage_sublist_optiid',
			'text', 'Optimove ID');

	var res_Name = resultsSubList.addField(
			'custpage_sublist_name', 'text', 'Name');

	var res_Item = resultsSubList.addField(
			'custpage_sublist_item', 'text', 'Item');

	var res_Currency = resultsSubList.addField(
			'custpage_sublist_currency', 'text', 'Currency');

	var res_Quantity = resultsSubList.addField(
			'custpage_sublist_quantity', 'text', 'Quantity');
	
	var res_FormulaNum = resultsSubList.addField(
			'custpage_sublist_formulanum', 'text', 'Item Rate TRX Currency');

	var res_FXAmount = resultsSubList.addField('custpage_sublist_fxamount',
			'text', 'Total Line TRX Currency');

	var res_ExchangeRate = resultsSubList.addField(
			'custpage_sublist_exrate', 'text', 'Exchange Rate');

	var res_Rate = resultsSubList.addField(
			'custpage_sublist_rate', 'text','Item Rate USD');

	var res_Amount = resultsSubList.addField(
			'custpage_sublist_amount', 'text','Total Line USD');

	var res_Recurring = resultsSubList.addField(
			'custpage_sublist_recurring', 'text', 'Recurring');

	var res_OneTimeRetro = resultsSubList.addField(
			'custpage_sublist_onetimeretro', 'text', 'One Time/Retro');

	var res_Opti_Rate = resultsSubList.addField(
			'custpage_sublist_optirate', 'text', 'Optimove Rate');

	var res_Opti_ExRate = resultsSubList.addField(
			'custpage_sublist_optiexrate', 'text', 'Optimove Exchange Rate');
	
	var res_FromDate = resultsSubList.addField(
			'custpage_sublist_fromdate', 'date', 'From');
	
	var res_ToDate = resultsSubList.addField(
			'custpage_sublist_todate', 'date', 'To');
	
	var res_Memo = resultsSubList.addField(
			'custpage_sublist_linememo', 'textarea', 'Line Memo');
	
	var res_MemoMain = resultsSubList.addField(
			'custpage_sublist_memomain', 'text', 'Billing Period');
	

	
	var res_custCategory = resultsSubList.addField(
			'custpage_sublist_custcategory', 'text', 'Vertical');

	var res_custTerms = resultsSubList.addField(
			'custpage_sublist_custterms', 'text', 'Terms');
	
	var res_BillingCountry = resultsSubList.addField(
			'custpage_sublist_country', 'text', 'Country');
	
	var res_BillingState = resultsSubList.addField(
			'custpage_sublist_stateprovince', 'text', 'State/Province');
	
	var res_DocumentNum = resultsSubList.addField(
			'custpage_sublist_tranid', 'text', 'Document Number');
	
	var res_Account = resultsSubList.addField(
			'custpage_sublist_account', 'text', 'Account');
	
	var res_BatchNumber = resultsSubList.addField(
			'custpage_sublist_batchnumber', 'text', 'Upload Batch Number');
	
	var res_LineNumber = resultsSubList.addField(
			'custpage_sublist_linenumber', 'text', 'Line No.');

	
	var res_SecondaryBookAmt = resultsSubList.addField(
			'custpage_sublist_seconamt', 'text', 'Local Book Amount');


	var res_Subsidiary = resultsSubList.addField('custpage_sublist_subsid', 'text', 'Subsidiary')

	var res_SecondaryBookExRate = resultsSubList.addField(
			'custpage_sublist_seconexrate', 'text', 'Local Book Exchange Rate');

	
	

	var data = '';

	for(var i = 0; i<resultsArr.length; i++) {
		
		var name = resultsArr[i].name;
		if(name.indexOf(",") > -1) {
			name.replace(/,/g , "");
		}
		var lineNumber = resultsArr[i].lineNumber;
		var currRecID = resultsArr[i].recID;

		nlapiLogExecution("DEBUG", 'recID', resultsArr[i].recID);
		
		resultsSubList.setLineItemValue('custpage_sublist_asterik', i + 1, '');
		resultsSubList.setLineItemValue('custpage_sublist_date', i + 1, resultsArr[i].date);
		resultsSubList.setLineItemValue('custpage_sublist_period', i + 1, resultsArr[i].period);
		resultsSubList.setLineItemValue('custpage_sublist_trantype', i + 1, resultsArr[i].type);
		resultsSubList.setLineItemValue('custpage_sublist_optiid', i + 1, resultsArr[i].optimoveID);
		resultsSubList.setLineItemValue('custpage_sublist_name', i + 1, name);
		resultsSubList.setLineItemValue('custpage_sublist_item', i + 1, resultsArr[i].item);
		resultsSubList.setLineItemValue('custpage_sublist_currency', i + 1, resultsArr[i].currency);
		resultsSubList.setLineItemValue('custpage_sublist_quantity', i + 1, resultsArr[i].quantity);
		resultsSubList.setLineItemValue('custpage_sublist_formulanum', i + 1, (parseFloat(resultsArr[i].fxamount) / parseFloat(resultsArr[i].quantity)).toFixed(2));
		resultsSubList.setLineItemValue('custpage_sublist_fxamount', i + 1, resultsArr[i].fxamount);
		resultsSubList.setLineItemValue('custpage_sublist_exrate', i + 1, resultsArr[i].exchangeRate);
		resultsSubList.setLineItemValue('custpage_sublist_rate', i + 1, resultsArr[i].rate);
		resultsSubList.setLineItemValue('custpage_sublist_amount', i + 1, resultsArr[i].amount);
		resultsSubList.setLineItemValue('custpage_sublist_recurring', i + 1, resultsArr[i].recurring);
		resultsSubList.setLineItemValue('custpage_sublist_onetimeretro', i + 1, resultsArr[i].oneTimeRetro);
		resultsSubList.setLineItemValue('custpage_sublist_optirate', i + 1, resultsArr[i].optimoveRate);
		resultsSubList.setLineItemValue('custpage_sublist_optiexrate', i + 1, resultsArr[i].optimoveExRate);
		resultsSubList.setLineItemValue('custpage_sublist_fromdate', i + 1, resultsArr[i].fromDate);
		resultsSubList.setLineItemValue('custpage_sublist_todate', i + 1, resultsArr[i].toDate);
		resultsSubList.setLineItemValue('custpage_sublist_linememo', i + 1, resultsArr[i].lineMemo);
		resultsSubList.setLineItemValue('custpage_sublist_memomain', i + 1, resultsArr[i].memoMain);
		resultsSubList.setLineItemValue('custpage_sublist_custcategory', i + 1, resultsArr[i].custCategory);
		resultsSubList.setLineItemValue('custpage_sublist_custterms', i + 1, resultsArr[i].custTerms);
		resultsSubList.setLineItemValue('custpage_sublist_country', i + 1, resultsArr[i].billingCountry);
		resultsSubList.setLineItemValue('custpage_sublist_stateprovince', i + 1, resultsArr[i].billingStateProvince);
		resultsSubList.setLineItemValue('custpage_sublist_tranid', i + 1, resultsArr[i].docNumber);
		resultsSubList.setLineItemValue('custpage_sublist_account', i + 1, resultsArr[i].account);
		resultsSubList.setLineItemValue('custpage_sublist_batchnumber', i + 1, resultsArr[i].batchNumber);	
		resultsSubList.setLineItemValue('custpage_sublist_linenumber', i + 1,resultsArr[i].lineNumber);
		resultsSubList.setLineItemValue('custpage_sublist_seconamt', i + 1, (parseFloat(resultsArr[i].fxamount) * parseFloat(secondaryExRates[resultsArr[i].recID])).toFixed(2));
		resultsSubList.setLineItemValue('custpage_sublist_subsid', i + 1, resultsArr[i].subsid);
		resultsSubList.setLineItemValue('custpage_sublist_seconexrate', i + 1, secondaryExRates[resultsArr[i].recID]);
			
		
		//data += resultsArr[i].docNumber+","+resultsArr[i].lineNumber+","+resultsArr[i].date+","+resultsArr[i].period+","+resultsArr[i].type+","+resultsArr[i].optimoveID+","+name+","+resultsArr[i].item+","+resultsArr[i].currency+","+resultsArr[i].quantity+","+parseFloat(resultsArr[i].fxamount) / parseFloat(resultsArr[i].quantity).toFixed(2)+","+resultsArr[i].fxamount+","+resultsArr[i].exchangeRate+","+resultsArr[i].rate+","+resultsArr[i].amount+","+resultsArr[i].recurring+","+resultsArr[i].oneTimeRetro+","+resultsArr[i].optimoveRate+","+resultsArr[i].optimoveExRate+","+resultsArr[i].fromDate+","+resultsArr[i].toDate+","+resultsArr[i].lineMemo+","+resultsArr[i].memoMain+","+resultsArr[i].custCategory+","+resultsArr[i].custTerms+","+resultsArr[i].billingCountry+","+resultsArr[i].billingStateProvince+","+resultsArr[i].account+","+resultsArr[i].batchNumber+","+secondaryExRates[resultsArr[i].recID]+","+parseFloat(resultsArr[i].fxamount) * parseFloat(secondaryExRates[resultsArr[i].recID]).toFixed(2)+","+resultsArr[i].subsid+ "\n";
		data += ' '+","+resultsArr[i].date+","+resultsArr[i].period+","+resultsArr[i].type+","+resultsArr[i].optimoveID+","+name+","+resultsArr[i].item+","+resultsArr[i].currency+","+resultsArr[i].quantity+","+parseFloat(resultsArr[i].fxamount) / parseFloat(resultsArr[i].quantity).toFixed(2)+","+resultsArr[i].fxamount+","+resultsArr[i].exchangeRate+","+resultsArr[i].rate+","+resultsArr[i].amount+","+resultsArr[i].recurring+","+resultsArr[i].oneTimeRetro+","+resultsArr[i].optimoveRate+","+resultsArr[i].optimoveExRate+","+resultsArr[i].fromDate+","+resultsArr[i].toDate+","+resultsArr[i].lineMemo+","+resultsArr[i].memoMain+","+resultsArr[i].custCategory+","+resultsArr[i].custTerms+","+resultsArr[i].billingCountry+","+resultsArr[i].billingStateProvince+","+resultsArr[i].docNumber+","+resultsArr[i].account+","+resultsArr[i].batchNumber+","+resultsArr[i].lineNumber+","+parseFloat(resultsArr[i].fxamount) * parseFloat(secondaryExRates[resultsArr[i].recID]).toFixed(2)+","+resultsArr[i].subsid+","+secondaryExRates[resultsArr[i].recID]+ "\n";
		
	}
	
	
	var csv_download = "*,Date,Period,Type,Optimove ID,Name,Item,Currency,Quantity,Item Rate TRX Currency,Total Line TRX Currency,Exchange Rate,Item Rate USD,Total Line USD,Recurring,One Time/Retro,Optimove Rate,Optimove Exchange Rate,From,To,Line Memo, Billing Period,Vertical,Terms,Country,State/Province,Document Number,Account,Upload Batch Number,Line No.,Local Book Amount,Subsidiary,Local Book Exchange Rate"+ "\n" +data;
	//var csv_download =  "Document Number,Line No.,Date,Period,Type,Optimove ID,Name,Item,Currency,Quantity,Item Rate TRX Currency,Total Line TRX Currency,Exchange Rate,Item Rate USD, Total Line USD,Recurring,One Time/Retro,Optimove Rate,Optimove Exchange Rate,From,To,Line Memo,Billing Period,Vertical,Terms,Country,State/Province,Account,Upload Batch Number,Local Book Exchange Rate,Local Book Amount,Subsidiary"+ "\n" +data;
	

	var csvfile = nlapiCreateFile("MRR CSV File", "CSV", csv_download);
	csvfile.setFolder(-15);
	var file = nlapiSubmitFile(csvfile);

	 var htmlHeader = reportForm.addField('custpage_header', 'inlinehtml');
	 htmlHeader.setLayoutType('startrow', 'none')
     htmlHeader.setDefaultValue("<span style='font-size:18px'>"+getPeriodStart+" - "+getPeriodEnd+"</span><br><span style='font-size:16px;'><a style='color:blue;' href='https://system.eu2.netsuite.com/core/media/media.nl?id="+file+"&c=4520481&h=ee0260fefa70bc5e281d&id=74401&_xt=.csv&_xd=T&e=T'>Download CSV File</a></span>");
	
	
	response.writePage(reportForm);
	}//end of else
}//end of script




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