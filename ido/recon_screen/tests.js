var selectedAcc = '';
var selectSubsid = '';
var inpDate_from = '';
var inpDate_to = '';
var recon_Y_N = '';
var selectedBook = '';
var selectedValidateBy = '';
var reconSessionID;

var searchResults;

function cc_recon() {

	if (request.getMethod() == 'GET') {

		var ccAccounts = [];

		var fils = new Array();
		fils[0] = new nlobjSearchFilter('balance', null, 'notequalto', '0.00');

		var cols = new Array();
		cols[0] = new nlobjSearchColumn('name');
		cols[1] = new nlobjSearchColumn('type').setSort();

		var s = nlapiSearchRecord('account', null, fils, cols);
		if (s != null) {

			for (var i = 0; i < s.length; i++) {
				if (s[i].getValue('name') == '') {
					continue;
				}

				ccAccounts.push({
					acc_id : s[i].id,
					acc_name : s[i].getValue('name'),
					acc_type : s[i].getValue('type')
				});

			}

		}

		var form = nlapiCreateForm('Credit Card Reconciliation');
		form.addSubmitButton('Load');

		var selectCCAccount = form.addField('custpage_select_ccaccount',
				'select', 'Select Account', null, 'null');
		selectCCAccount.addSelectOption('', '');
		for (var i = 0; i < ccAccounts.length; i++) {
			selectCCAccount.addSelectOption(ccAccounts[i].acc_id,
					ccAccounts[i].acc_name);
		}


		var selectSubsidiary = form.addField('custpage_select_subsidiary',
				'select', 'Subsidary', 'SUBSIDIARY');

		var selectBookType = form.addField('custpage_select_booktype',
				'select', 'Select Book', null, null);
		selectBookType.addSelectOption('', '');
		selectBookType.addSelectOption('a', 'Primary Accounting Book');
		selectBookType.addSelectOption('b', 'Secondary Accounting Book');

		var selectValidation = form.addField('custpage_select_validation_by',
				'select', 'Validate By', null, null);
		selectValidation.addSelectOption('', '');
		selectValidation.addSelectOption('a', 'Orginal Currency');
		selectValidation.addSelectOption('b', 'Accounting Currency');

		var fromDate = form.addField('custpage_ilo_cc_recon_fromdate', 'date',
				'From Date', null, null);
		fromDate.setDefaultValue('01/01/16');
		fromDate.setBreakType('startcol');

		var toDate = form.addField('custpage_ilo_cc_recon_todate', 'date',
				'To Date', null, null);
		toDate.setDefaultValue('31/12/17');

		var selectRecon = form.addField('custpage_select_recon', 'select',
				'Reconciled', null, null);
		selectRecon.addSelectOption('', '');
		selectRecon.addSelectOption('a', 'Yes');
		selectRecon.addSelectOption('b', 'No');
		selectRecon.addSelectOption('c', 'Both');

		var checkStage = form.addField('custpage_ilo_check_stage', 'text',
				'check', null, null);
		checkStage.setDefaultValue('stageOne');
		checkStage.setDisplayType('hidden');

		response.writePage(form);

	}

	else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // sublist
		// stage
		
		//get expense accounts for manual recon dropdown
		var expAccounts = [];

		var filters = new Array();
		filters[0] = new nlobjSearchFilter('type', null, 'anyof', 'Expense');
		var cols = new Array();
		cols[0] = new nlobjSearchColumn('name');

		var s_exp = nlapiSearchRecord('account', null, filters, cols);
		if (s_exp != null) {

			for (var i = 0; i < s_exp.length; i++) {
				if (s_exp[i].getValue('name') == '') {
					continue;
				}

				expAccounts.push({
					acc_id : s_exp[i].id,
					acc_name : s_exp[i].getValue('name')
				});

			}

		}

		selectedAcc = request.getParameter('custpage_select_ccaccount');
		selectSubsid = request.getParameter('custpage_select_subsidiary');
		inpDate_from = request.getParameter('custpage_ilo_cc_recon_fromdate');
		inpDate_to = request.getParameter('custpage_ilo_cc_recon_todate');
		recon_Y_N = request.getParameter('custpage_select_recon');
		selectedBook = request.getParameter('custpage_select_booktype');
		selectedValidateBy = request.getParameter('custpage_select_validation_by');
		
		var reconData = [];
		reconData.push({j_account : selectedAcc,
						j_subsib : selectSubsid,
						j_recon_Y_N : recon_Y_N});
		reconSessionID = makeSessionID();
		
		tranSearch(inpDate_from, inpDate_to, selectSubsid, selectedAcc);

		var reconForm = nlapiCreateForm('Credit Card Reconciliation');
		reconForm.addSubmitButton();
		
		//SUMMARY FIELDS
		
		var sum_fieldGroup = reconForm.addFieldGroup('custpage_sum_group', 'Summary');

		var sum_booktype = reconForm.addField('custpage_summary_booktype', 'text', 'Book Type', null,'custpage_sum_group');
		sum_booktype.setLayoutType('normal', 'startrow');
		sum_booktype.setDefaultValue(selectedBook);
		var sum_validate_by = reconForm.addField('custpage_summary_validateby', 'text', 'Validation By', null, 'custpage_sum_group');
		sum_validate_by.setLayoutType('normal');
		sum_validate_by.setDefaultValue(selectedValidateBy);
		var sum_total = reconForm.addField('custpage_summary_total', 'text', 'Deficit Total', null, 'custpage_sum_group');
		sum_total.setLayoutType('normal');
		sum_total.setDefaultValue('0.00');
		var sum_credit_total = reconForm.addField('custpage_summary_credit_total', 'text', 'Credit Total', null, 'custpage_sum_group');
		sum_credit_total.setLayoutType('normal');
		sum_credit_total.setDefaultValue('');
		var sum_debit_total = reconForm.addField('custpage_summary_debit_total', 'text', 'Debit Total', null, 'custpage_sum_group');
		sum_debit_total.setLayoutType('normal');
		sum_debit_total.setDefaultValue('');
		

	

		

		//RESULTS SUBLIST
		var resultsSubList = reconForm.addSubList('custpage_results_sublist',
				'inlineeditor', 'Results', null);

		var res_CheckBox = resultsSubList.addField(
				'custpage_resultssublist_checkbox', 'checkbox', 'Reconciled');

		var res_TranId = resultsSubList.addField(
				'custpage_resultssublist_tranid', 'text', 'Transaction Number');

		var res_TranType = resultsSubList.addField(
				'custpage_resultssublist_trantype', 'text', 'Type');

		var res_Payee = resultsSubList.addField(
				'custpage_resultssublist_payee', 'text', 'Payee');

		var res_Employee = resultsSubList.addField(
				'custpage_resultssublist_employee', 'text', 'Employee');

		var res_TravelNum = resultsSubList.addField(
				'custpage_resultssublist_travelnum', 'text', 'Travel Ref');

		var res_TranDate = resultsSubList.addField(
				'custpage_resultssublist_trandate', 'date', 'Transaction Date');

		var res_AccPeriod = resultsSubList.addField(
				'custpage_resultssublist_accountperiod', 'text',
				'Posting Period');

		var res_Currency = resultsSubList.addField(
				'custpage_resultssublist_currency', 'text', 'Currency');

		var res_ExRate = resultsSubList.addField(
				'custpage_resultssublist_exrate', 'text', 'Exchange Rate');

		var res_Original_Amt = resultsSubList.addField(
				'custpage_resultssublist_og_amt', 'text', 'Original Amount');

		var res_Primary_Amt = resultsSubList.addField(
				'custpage_resultssublist_primary_amt', 'text',
				'Primary Book Amount');

		var res_Secondary_Amt = resultsSubList.addField(
				'custpage_resultssublist_secondary_amt', 'text',
				'Secondary Book Amount');

		var res_Recon_Comment = resultsSubList.addField(
				'custpage_resultssublist_recon_comment', 'text', 'Comments');

		var res_Recon_Number = resultsSubList.addField(
				'custpage_resultssublist_recon_sessionid', 'text',
				'Reconciliation Session ID');

		var totalCol = [];
		for (var i = 0; i < searchResults.length; i++) {

			resultsSubList.setLineItemValue('custpage_resultssublist_tranid',i + 1, searchResults[i].tranNumber);
			resultsSubList.setLineItemValue('custpage_resultssublist_trantype',i + 1, searchResults[i].tranType);
			resultsSubList.setLineItemValue('custpage_resultssublist_payee',i + 1, searchResults[i].vendorPayee);
			resultsSubList.setLineItemValue('custpage_resultssublist_trandate',i + 1, searchResults[i].tranDate);
			resultsSubList.setLineItemValue('custpage_resultssublist_accountperiod', i + 1,searchResults[i].postingPeriod);
			resultsSubList.setLineItemValue('custpage_resultssublist_currency',i + 1, searchResults[i].currency);
			resultsSubList.setLineItemValue('custpage_resultssublist_exrate',i + 1, searchResults[i].exRate);
			resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryBookAmt);
			totalCol.push(searchResults[i].primaryBookAmt);
			if (searchResults[i].primaryBookAmt == "NaN") {
				resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1, '0');
				totalCol.push('0');
			}

			resultsSubList.setLineItemValue('custpage_resultssublist_og_amt',i + 1, searchResults[i].ogTotalPayment);
			totalCol.push(searchResults[i].ogTotalPayment);
			if (searchResults[i].tranType == 'Journal') {
				resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1, searchResults[i].journal_Amt);
				totalCol.push(searchResults[i].journal_Amt);
			}

			resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1, searchResults[i].secondaryBookAmt);
			totalCol.push(searchResults[i].secondaryBookAmt);
			if (searchResults[i].tranType == 'Bill Payment') {
				resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryBookAmt);
				totalCol.push(searchResults[i].secondaryBookAmt);
			}
			if (searchResults[i].primaryBookAmt == "NaN") {
				resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1, '0');
				totalCol.push('0');
			}

			resultsSubList.setLineItemValue('custpage_resultssublist_recon_sessionid', i + 1, reconSessionID);
		}
		

		var all = JSON.stringify(searchResults);
		var totalColJson = JSON.stringify(totalCol);
		
		
		var manualReconGroup = reconForm.addFieldGroup('custpage_manual_recon_group', 'Manual Reconciliation Closure');
		var manualReconMemo = reconForm.addField('custpage_manual_recon_memo', 'text', 'Memo', null, 'custpage_manual_recon_group');
		var manualReconBtn = reconForm.addButton('custpage_manual_recon', 'Manual Reconciliation Closure', 'manual_recon_closure();');
		
		
		var selectExpAccount = reconForm.addField('custpage_select_expaccount',
				'select', 'Select Expense Account', null, 'custpage_manual_recon_group');
		selectExpAccount.addSelectOption('', '');
		for (var i = 0; i < expAccounts.length; i++) {
			selectExpAccount.addSelectOption(expAccounts[i].acc_id,
					expAccounts[i].acc_name);
		}
		var hiddenField = reconForm.addField('custpage_recon_data', 'text', 'reconDataLabel');
		hiddenField.setDisplayType('hidden');
		hiddenField.setDefaultValue(JSON.stringify(reconData));
		reconForm.setScript('customscript_ilo_cc_recon_client_scripts');
		response.writePage(reconForm);
		
		var a = nlapiGetContext();
		var b = a.getRemainingUsage();
		nlapiLogExecution("DEBUG", 'usage', b);
	}

};

function tranSearch(inpDate_from, inpDate_to, selectSubsid, selectedAcc) {

	var resultsArr = [];

	var filters = new Array();

	filters[0] = new nlobjSearchFilter('subsidiary', null, 'is', selectSubsid);
	filters[1] = new nlobjSearchFilter('account', null, 'anyof', selectedAcc);
	filters[2] = new nlobjSearchFilter('trandate', null, 'onorafter',
			inpDate_from);
	filters[3] = new nlobjSearchFilter('trandate', null, 'onorbefore',
			inpDate_to);
	filters[4] = new nlobjSearchFilter('type', null, 'noneof', 'Transfer');

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('transactionnumber');
	cols[1] = new nlobjSearchColumn('trandate');
	cols[2] = new nlobjSearchColumn('postingperiod');
	cols[3] = new nlobjSearchColumn('currency');
	cols[4] = new nlobjSearchColumn('exchangerate');
	cols[5] = new nlobjSearchColumn('entity');
	cols[6] = new nlobjSearchColumn('type');
	cols[7] = new nlobjSearchColumn('tranid');
	cols[8] = new nlobjSearchColumn('total');
	cols[9] = new nlobjSearchColumn('amount');


	var s = nlapiSearchRecord('transaction', null, filters, cols);

	for (var i = 0; i < s.length; i++) {
				

		resultsArr
				.push({
					tranNumber : s[i].getValue('transactionnumber'),
					tranDate : s[i].getValue('trandate'),
					postingPeriod : s[i].getText('postingperiod'),
					currency : s[i].getText('currency'),
					exRate : s[i].getValue('exchangerate'),
					vendorPayee : s[i].getText('entity'),
					tranType : s[i].getText('type'),
					tranID : s[i].getValue('tranID'),
					ogTotalPayment : s[i].getValue('total'),
					recID : s[i].id
				});

	}
	
	for (var j = 0; j<resultsArr.length; j++) {
		if(resultsArr[j].tranType == 'Journal') {
			
			resultsArr[j].journal_Amt = getCreditAmt('journalentry', resultsArr[j].recID);
		}
		
	}

	searchResults = resultsArr;

};

function getCreditAmt(a, b) {

	a = 'journalentry';

	var creditAmt = [];
	var thisAcc;
	var credit;
	var debit;
	var currAcc = selectedAcc;
	
	var theRec = nlapiLoadRecord(a, b);
		var lineCount = theRec.getLineItemCount('line');
		if (lineCount > 0) {
			for (var i = 1; i <= lineCount; i++) {
				thisAcc = theRec.getLineItemValue('line', 'account', i);

				if(thisAcc == currAcc) {
				credit = theRec.getLineItemValue('line', 'credit', i);
				debit = theRec.getLineItemValue('line', 'debit', i);
				
				}
			}


		if(credit == null) {
			creditAmt.push(debit);
			}
			if(credit != null) {
			creditAmt.push(pos_to_neg(credit).toFixed(2).toString());
			}
	}

	return creditAmt;

}


function makeSessionID() {
	var date = new Date();
	var timestamp = date.getTime();
	
	return parseInt(timestamp);
}



function pos_to_neg(num)  {
	return -Math.abs(num);  
}  

