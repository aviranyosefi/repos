/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Mar 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function jeTest(request, response){
	
	
	var reconForm = nlapiCreateForm('journal tests');
	
	// RESULTS SUBLIST
	var resultsSubList = reconForm
			.addSubList('custpage_results_sublist', 'inlineeditor',
					'Results', null);
	// resultsSubList.addMarkAllButtons();

	var res_CheckBox = resultsSubList.addField(
			'custpage_resultssublist_checkbox', 'checkbox', 'Select');


	var res_TranId = resultsSubList.addField(
			'custpage_resultssublist_tranid', 'text',
			'Transaction Number');

	var res_TranType = resultsSubList.addField(
			'custpage_resultssublist_trantype', 'text', 'Type');

	var res_Payee = resultsSubList.addField(
			'custpage_resultssublist_payee', 'text', 'Payee');

	var res_Employee = resultsSubList.addField(
			'custpage_resultssublist_employee', 'text', 'Employee');

	var res_TravelNum = resultsSubList.addField(
			'custpage_resultssublist_travelnum', 'text', 'Travel Ref');

	var res_TranDate = resultsSubList.addField(
			'custpage_resultssublist_trandate', 'date',
			'Transaction Date');

	var res_AccPeriod = resultsSubList.addField(
			'custpage_resultssublist_accountperiod', 'text',
			'Posting Period');

	var res_Currency = resultsSubList.addField(
			'custpage_resultssublist_currency', 'text', 'Currency');

	var res_ExRate = resultsSubList.addField(
			'custpage_resultssublist_exrate', 'text', 'Exchange Rate');

	var res_Original_Amt = resultsSubList
			.addField('custpage_resultssublist_og_amt', 'text',
					'Original Amount');

	var res_Primary_Amt = resultsSubList.addField(
			'custpage_resultssublist_primary_amt', 'text',
			'Primary Book Amount');

	var res_Secondary_Amt = resultsSubList.addField(
			'custpage_resultssublist_secondary_amt', 'text',
			'Local Book Amount');


	var res_Recon_Number = resultsSubList.addField(
			'custpage_resultssublist_recon_sessionid', 'text',
			'Reconciliation Session ID');

	var res_Recid = resultsSubList.addField(
			'custpage_resultssublist_recon_recid', 'text', 'recid');
	res_Recid.setDisplayType('hidden');
	
	var res_TranLine_Number = resultsSubList.addField(
			'custpage_resultssublist_tran_linenum', 'text', 'lineNum');
	res_TranLine_Number.setDisplayType('hidden');

	
	
	
	
	
	
	
	response.writePage(reconForm);
}
