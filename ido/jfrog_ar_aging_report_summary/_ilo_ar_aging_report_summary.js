
function aging_report_sumary(request, response){
	
	if (request.getMethod() == 'GET') {
		
		var startForm = nlapiCreateForm('JFrog A/R Aging Report - Summary');
		
		var resultsField = startForm.addField('custpage_results', 'longtext', 'results');
		resultsField.setDisplayType('hidden');
		
		
		var grandTotals = startForm.addField('custpage_grandtotals', 'longtext', 'grandtotals');
		grandTotals.setDisplayType('hidden');
		
		var totalAll = startForm.addField('custpage_alltotal', 'text', 'alltotal');
		totalAll.setDisplayType('hidden');
		
		var totalnoCurr = startForm.addField('custpage_total_nocurr', 'text', 'total_nocurr');
		totalnoCurr.setDisplayType('hidden');
		
		var percLTD = startForm.addField('custpage_percltd', 'text', 'percltd');
		percLTD.setDisplayType('hidden');
		var percINC = startForm.addField('custpage_percinc', 'text', 'percinc');
		percINC.setDisplayType('hidden');
		var percSAS = startForm.addField('custpage_percsas', 'text', 'percsas');
		percSAS.setDisplayType('hidden');
		
		var totLTD = startForm.addField('custpage_totltd', 'text', 'totltd');
		totLTD.setDisplayType('hidden');
		var totINC = startForm.addField('custpage_totinc', 'text', 'totinc');
		totINC.setDisplayType('hidden');
		var totSAS = startForm.addField('custpage_totsas', 'text', 'totsas');
		totSAS.setDisplayType('hidden');
		
		
		
		var totalNoCurrent = startForm.addField('custpage_total_no_current', 'text', 'totnocurr');
		totalNoCurrent.setDisplayType('hidden');
		
		
		
		var grandTotal = startForm.addField('custpage_grandtotal', 'text', 'grandtotal');
		grandTotal.setDisplayType('hidden');
		
		startForm.addSubmitButton('Load Report');
		
		startForm.setScript('customscript_ilo_aging_report_cs');
		response.writePage(startForm);
		
		
		
	}
	else{
	
	var check = request.getParameter('custpage_results');
	var totals = request.getParameter('custpage_grandtotals');
	
	var allTotal = request.getParameter('custpage_alltotal');
	var noCurrTotal = request.getParameter('custpage_total_nocurr');
	
	var ltdPerc = request.getParameter('custpage_percltd');
	var incPerc = request.getParameter('custpage_percinc');
	var sasPerc = request.getParameter('custpage_percsas');
	
	var ltdTotal = request.getParameter('custpage_totltd');
	var incTotal = request.getParameter('custpage_totinc');
	var sasTotal = request.getParameter('custpage_totsas');
	
	var noCurrentTotal = request.getParameter('custpage_total_no_current');
	
	var totalGrand = request.getParameter('custpage_grandtotal');
	
	var reportObj = JSON.parse(check);
	var totalsObj = JSON.parse(totals);
	
	
	var reportForm = nlapiCreateForm('JFrog A/R Aging Report - Summary');
	
	var resultsSubList = reportForm.addSubList('custpage_results_sublist',
			'list', 'Report', null);
	
	var res_Subsidiary = resultsSubList.addField(
			'custpage_sublist_subsidiary', 'text', 'Subsidiary');
	
	var res_Current = resultsSubList.addField(
			'custpage_sublist_current', 'currency', 'Current');

	var res_one_to_thirty = resultsSubList.addField(
			'custpage_sublist_one_to_thirty', 'currency', '1 - 30 Days');
	
	var res_thirtyone_to_sixty = resultsSubList.addField(
			'custpage_sublist_thirtyone_to_sixty', 'currency', '31 - 60 Days');

	var res_sixtyone_to_ninety = resultsSubList.addField(
			'custpage_sublist_sixtyone_to_ninety', 'currency', '61 - 90 Days');

	var res_over_ninetyone = resultsSubList.addField(
			'custpage_sublist_over_ninetyone', 'currency', '91 Days and Over');

	var res_Totals = resultsSubList.addField('custpage_sublist_totals',
			'currency', 'Total without Current');
	
	var res_Totals_no_current = resultsSubList.addField('custpage_sublist_totals_no_curr',
			'currency', 'Total Outstanding');
	
	


	
	
	for(var i = 0; i<reportObj.length; i++) {
		
		
		resultsSubList.setLineItemValue('custpage_sublist_subsidiary', i + 1,reportObj[i].subsidiary);
		resultsSubList.setLineItemValue('custpage_sublist_current', i + 1, reportObj[i].current);
		resultsSubList.setLineItemValue('custpage_sublist_one_to_thirty', i + 1,reportObj[i].one_to_thirty);
		resultsSubList.setLineItemValue('custpage_sublist_thirtyone_to_sixty', i + 1, reportObj[i].thirtyone_to_sixty);
		resultsSubList.setLineItemValue('custpage_sublist_sixtyone_to_ninety', i + 1,reportObj[i].sixtyone_to_ninety);
		resultsSubList.setLineItemValue('custpage_sublist_over_ninetyone', i + 1, reportObj[i].over_ninetyone);
		resultsSubList.setLineItemValue('custpage_sublist_totals', i + 1,reportObj[i].total_no_current);
		resultsSubList.setLineItemValue('custpage_sublist_totals_no_curr', i + 1,reportObj[i].subsid_total);
	}
	
	var strVar="";
	strVar += "<table style=\"border: 2px solid black; font-size: 16px; border-collapse:collapse;\">";
	strVar += "  <tr style=\"line-height: 50px; text-align: center;\">";
	strVar += "    <td width=\"150\" style=\"border: 2px solid black ;\">";
	strVar += "    <\/td>";
	strVar += "    <td width=\"150\" style=\"border: 2px solid black;\">";
	strVar += "      <b>JFROG LTD<\/b>";
	strVar += "    <\/td>";
	strVar += "    <td width=\"150\" style=\"border: 2px solid black;\">";
	strVar += "      <b>JFROG INC<\/b>";
	strVar += "    <\/td>";
	strVar += "    <td width=\"150\" style=\"border: 2px solid black;\">";
	strVar += "      <b>JFROG SAS<\/b>";
	strVar += "    <\/td>";
	strVar += "    <td width=\"170\" style=\"border: 2px solid black;\">";
	strVar += "      <b>GRAND TOTAL<\/b>";
	strVar += "    <\/td>";
	strVar += "  <\/tr>";
	strVar += "  <tr style=\"border: 2px solid black;line-height: 50px; text-align: center;\">";
	strVar += "    <td width=\"150\" style=\"border: 2px solid black;\">";
	strVar += "      <b>Past Due Date - Total<\/b>";
	strVar += "    <\/td>";
	strVar += "    <td style=\"border: 2px solid black;\">";
	strVar +=       ltdTotal;
	strVar += "    <\/td>";
	strVar += "    <td style=\"border: 2px solid black;\">";
	strVar += 		incTotal;
	strVar += "    <\/td>";
	strVar += "    <td style=\"border: 2px solid black;\">";
	strVar += 		sasTotal;
	strVar += "    <\/td>";
	strVar += "    <td style=\"border: 2px solid black;\">";
	strVar += 		noCurrentTotal;
	strVar += "    <\/td>";
	strVar += "  <\/tr>";
	strVar += "  <tr style=\"border: 2px solid black;line-height: 50px; text-align: center;\">";
	strVar += "    <td style=\"border: 2px solid black;\">";
	strVar += "      <b> %<\/b>";
	strVar += "    <\/td>";
	strVar += "    <td style=\"border: 2px solid black;\">";
	strVar += 		ltdPerc;
	strVar += "    <\/td>";
	strVar += "    <td style=\"border: 2px solid black;\">";
	strVar += 		incPerc;
	strVar += "    <\/td>";
	strVar += "    <td style=\"border: 2px solid black;\">";
	strVar += 		sasPerc;
	strVar += "    <\/td>";
	strVar += "    <td style=\"border: 2px solid black;\">";
	strVar += 		totalGrand;
	strVar += "    <\/td>";
	strVar += "  <\/tr>";
	strVar += "";
	strVar += "";
	strVar += "<\/table>";
	
	
	
	
	
	var ltdPercent = reportForm.addField('custpage_ltd_percent','inlinehtml', 'Session Number', null, null);
	ltdPercent.setDefaultValue(strVar);
	


	

	nlapiLogExecution('DEBUG', 'totals', totals);
	nlapiLogExecution('DEBUG', 'check', check);
	var refreshBTN = reportForm.addButton('custpage_ilo_refresh', 'Refresh','go_back();');
	reportForm.setScript('customscript_ilo_aging_report_cs');
	response.writePage(reportForm);
	}
}
