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
	
	var currcontext = nlapiGetContext();
	
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
		
		var sendTo = form.addField('custpage_ilo_email', 'email', 'Send Report To', null,'custpage_search_group')
		sendTo.setDefaultValue(currcontext.email);
		
		
		var toNextPage = form.addField('custpage_ilo_tonextpage','text', 'tosend');
		toNextPage.setDefaultValue('next');
		toNextPage.setDisplayType('hidden');
		
		response.writePage(form)
	}
	
	else if (request.getParameter('custpage_ilo_tonextpage') == 'next'){
		
		var getPeriodStart = request.getParameter('custpage_select_periodfrom');
		var getPeriodEnd = request.getParameter('custpage_select_periodto');
		var range = getPeriodRange(accPeriods, getPeriodStart, getPeriodEnd);
		var getSendTo = request.getParameter('custpage_ilo_email')
		
		var reportForm = nlapiCreateForm('MRR Report - In Progress');
		
		 var htmlHeader = reportForm.addField('custpage_header', 'inlinehtml');
		 htmlHeader.setLayoutType('startrow', 'none')
	     htmlHeader.setDefaultValue("<span style='font-size:18px'>The MRR report is currently being created and will be sent to - <span style='color:blue;'>"+getSendTo+"</span> - once completed.</span>");
		
			

			
		 var params = {
				 custscript_mrr_period_start: getPeriodStart,
				 custscript_mrr_period_end: getPeriodEnd,
				 custscript_mrr_period_range: JSON.stringify(range),
				 custscript_mrr_email_address: getSendTo
					 										};
			 
			 nlapiScheduleScript('customscript_ilo_mrr_report_build_email', 'customdeploy_ilo_mrr_report_buildmail_de', params);
	
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