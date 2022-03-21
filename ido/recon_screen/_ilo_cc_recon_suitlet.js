var selectedAcc = '';
var selectSubsid = '';
var inpDate_from = '';
var inpDate_to = '';
var recon_Y_N = '';
var selectedBook = '';
var selectedValidateBy = '';
var reconSessionID;
var loadSessionID;

var ccAccounts = [];
var searchResults;
var loadResults;

var all = [];
var secondaryExRates = [];

var searchmulti = nlapiLoadSearch(null, 'customsearch_ilo_multibook_exrate_search');
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
			all.forEach(function(line) {
				
				secondaryExRates[line.getValue('internalid')] = line.getValue('exchangerate');
				
			});

		};
		
		
		//to get secondary exRate = secondaryExRates[23058] //index is record id of transaction
	
var allRecon = 	getAllRecons();


function cc_recon() {

	if (request.getMethod() == 'GET') {
		
		nlapiLogExecution('DEBUG', 'allRecon', JSON.stringify(allRecon.length));

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

		var form = nlapiCreateForm('Account Reconciliation');
		form.addSubmitButton('Load');

		var searchReconGroup = form.addFieldGroup('custpage_search_group',
				'Create Session');
		var loadReconGroup = form.addFieldGroup('custpage_load_group',
				'Load Session');

		var selectCCAccount = form.addField('custpage_select_ccaccount',
				'select', 'Select Account', null, 'custpage_search_group');
		selectCCAccount.addSelectOption('', '');
		for (var i = 0; i < ccAccounts.length; i++) {
			selectCCAccount.addSelectOption(ccAccounts[i].acc_id,
					ccAccounts[i].acc_name);
		}

		var cntxt = nlapiGetContext();
		var thisSub = cntxt.subsidiary;
		var selectSubsidiary = form.addField('custpage_select_subsidiary',
				'select', 'Subsidary', 'SUBSIDIARY', 'custpage_search_group');
		selectSubsidiary.setDefaultValue(thisSub)
		
		var selectBookType = form.addField('custpage_select_booktype',
				'select', 'Select Book', null, 'custpage_search_group');
		selectBookType.addSelectOption('', '');
		selectBookType.addSelectOption('a', 'Primary Accounting Book');
		selectBookType.addSelectOption('b', 'Secondary Accounting Book');

		var selectValidation = form.addField('custpage_select_validation_by',
				'select', 'Validate By', null, 'custpage_search_group');
		selectValidation.addSelectOption('', '');
		selectValidation.addSelectOption('a', 'Orginal Currency');
		selectValidation.addSelectOption('b', 'Accounting Currency');

		var selectCurrency = form.addField('custpage_select_currency',
				'select', 'Select Currency', 'CURRENCY',
				'custpage_search_group');
		var currencyInfo = form.addField('custpage_currency_info',
				'inlinehtml', '', null, 'custpage_search_group');
		currencyInfo
				.setDefaultValue('<font size="2"><b>If validation is by Original Currency - choose which currency to validate by.</b>');

		var fromDate = form.addField('custpage_ilo_cc_recon_fromdate', 'date',
				'From Date', null, 'custpage_search_group');
		fromDate.setDefaultValue('01/02/17');
		fromDate.setBreakType('startcol');

		var toDate = form.addField('custpage_ilo_cc_recon_todate', 'date',
				'To Date', null, 'custpage_search_group');
		toDate.setDefaultValue('28/02/17');

		var selectRecon = form.addField('custpage_select_recon', 'select',
				'Reconciled', null, 'custpage_search_group');
		selectRecon.addSelectOption('', '');
		selectRecon.addSelectOption('a', 'Yes');
		selectRecon.addSelectOption('b', 'No');
		selectRecon.addSelectOption('c', 'Both');

		var checkStage = form.addField('custpage_ilo_check_stage', 'text',
				'check', null, 'custpage_search_group');
		checkStage.setDefaultValue('stageOne');
		checkStage.setDisplayType('hidden');

		var baseUrl = request.getURL();
		var suitletID = request.getParameter('script');
		var deployID = request.getParameter('deploy');
		var js = JSON.stringify(suitletID);
		var backHome = form.addField('custpage_ilo_back_home', 'text',
				'link back home', null, 'custpage_search_group');
		backHome.setDefaultValue(baseUrl + '?script=' + suitletID + '&deploy='
				+ deployID);
		backHome.setDisplayType('hidden');

		var loadSession = form.addField('custpage_ilo_load_session', 'text',
				'Session ID', null, 'custpage_load_group');
		// loadSession.setDefaultValue('');
		response.writePage(form);

	} else if (request.getParameter('custpage_ilo_toend') == 'toEnd') {
		
		var newReconSesNumber = request.getParameter('custpage_ilo_reconsessionnumber');
		var reconSelectedAccount = request.getParameter('custpage_ilo_recon_account');

		
		nlapiLogExecution('DEBUG', 'got to the else', 'got to the else');
		
		var endForm = nlapiCreateForm('Reconciliation Session Details');
		
		var sessionNumber = endForm.addField('custpage_ilo_end_session','inlinehtml', 'Session Number', null, null);
		sessionNumber.setDefaultValue('<font size="3"><b> Session ID : '+ newReconSesNumber + '</b>');
		sessionNumber.setLayoutType('normal', 'startcol');
		
		var sessionAcc = endForm.addField('custpage_ilo_acc_session','inlinehtml', 'Session Account', null, null);
		sessionAcc.setDefaultValue('<font size="3"><b> Reconciled from Account : '+ reconSelectedAccount + '</b>');
		sessionAcc.setLayoutType('normal');
		
		var getReconciledBy = endForm.addField('custpage_ilo_recon_by','inlinehtml', 'Session Account', null, null);
		var getContext = nlapiGetContext();
		var reconBy = getContext.name;
		getReconciledBy.setDefaultValue('<font size="3"><b> Reconciled by : '+ reconBy + '</b>');
		getReconciledBy.setLayoutType('normal');
		
		
		
		
		response.writePage(endForm);

	} else if (request.getParameter('custpage_ilo_load_session') == ''
			|| request.getParameter('custpage_ilo_load_session') == null) { // sublist
		// stage
		nlapiLogExecution("DEBUG", "checkLine", '121-firstline'
				+ 'loadsession: '
				+ request.getParameter('custpage_ilo_load_session'));
		selectedAcc = request.getParameter('custpage_select_ccaccount');
		selectSubsid = request.getParameter('custpage_select_subsidiary');
		inpDate_from = request.getParameter('custpage_ilo_cc_recon_fromdate');
		inpDate_to = request.getParameter('custpage_ilo_cc_recon_todate');
		recon_Y_N = request.getParameter('custpage_select_recon');
		selectedBook = request.getParameter('custpage_select_booktype');
		selectedValidateBy = request
				.getParameter('custpage_select_validation_by');
		selectedCurrency = request.getParameter('custpage_select_currency');

		loadSessionID = request.getParameter('custpage_ilo_load_session');

		var backHome_recon = request.getParameter('custpage_ilo_back_home');

		if (selectedBook == 'a' || 'b') {

			// get expense accounts for manual recon dropdown
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
						acc_name : s_exp[i].getValue('name'),
					});

				}
				;
				nlapiLogExecution("DEBUG", "checkLine",
						'159-expense account search');
			}

			// get selected account Name
			var accName = nlapiLookupField('account', selectedAcc, 'name');
			nlapiLogExecution("DEBUG", "checkLine", '167-accName_lookupfield');

			var reconData = [];
			reconData.push({
				j_account : selectedAcc,
				j_subsib : selectSubsid,
				j_recon_Y_N : recon_Y_N,
			});
			reconSessionID = makeSessionID().toString();

			
			try {
				tranSearch(inpDate_from, inpDate_to, selectSubsid, selectedAcc,
						selectedCurrency);

				var reconForm = nlapiCreateForm('Account Reconciliation - '
						+ reconSessionID);
				var to_backHome_recon = reconForm.addField(
						'custpage_ilo_to_back_home_recon', 'text',
						'link back home', null, 'custpage_sum_group');
				to_backHome_recon.setDefaultValue(backHome_recon);
				to_backHome_recon.setDisplayType('hidden');
				var reconSessionIDField = reconForm.addField(
						'custpage_ilo_rec_session', 'text', 'reconsession', null,
						'custpage_sum_group');
				reconSessionIDField.setDefaultValue(reconSessionID);
				reconSessionIDField.setDisplayType('hidden');
				reconForm.addSubmitButton();

				// SUMMARY FIELDS

				var sum_fieldGroup = reconForm.addFieldGroup('custpage_sum_group',
						'Summary');

				var selectedAccount = reconForm.addField(
						'custpage_summary_selected_account', 'text',
						'Selected Account', null, 'custpage_sum_group');
				selectedAccount.setDefaultValue(accName);
				var sum_booktype = reconForm.addField('custpage_summary_booktype',
						'text', 'Book Type', null, 'custpage_sum_group');
				sum_booktype.setLayoutType('normal', 'startrow');
				sum_booktype.setDefaultValue(selectedBook);
				var sum_validate_by = reconForm.addField(
						'custpage_summary_validateby', 'text', 'Validation By',
						null, 'custpage_sum_group');
				sum_validate_by.setLayoutType('normal');
				sum_validate_by.setDefaultValue(selectedValidateBy);
				var sum_total = reconForm.addField('custpage_summary_total',
						'text', 'Deficit Total', null, 'custpage_sum_group');
				sum_total.setLayoutType('normal');
				sum_total.setDefaultValue('0');
				var sum_credit_total = reconForm.addField(
						'custpage_summary_credit_total', 'text', 'Credit Total',
						null, 'custpage_sum_group');
				sum_credit_total.setLayoutType('normal');
				sum_credit_total.setDefaultValue('');
				var sum_debit_total = reconForm.addField(
						'custpage_summary_debit_total', 'text', 'Debit Total',
						null, 'custpage_sum_group');
				sum_debit_total.setLayoutType('normal');
				sum_debit_total.setDefaultValue('');

				var sum_closing_memo = reconForm.addField(
						'custpage_summary_close_memo', 'text', 'Session Memo',
						null, 'custpage_sum_group');
				sum_closing_memo.setLayoutType('normal', 'startrow');

				var currAccountSelected = reconForm.addField(
						'custpage_summary_curr_account', 'text',
						'Selected Account', null, 'custpage_sum_group');
				currAccountSelected.setDefaultValue(selectedAcc);
				currAccountSelected.setDisplayType('hidden');
				nlapiLogExecution("DEBUG", "checkLine", '215-sum_fieldGroup');

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
						'Secondary Book Amount');


				var res_Recon_Number = resultsSubList.addField(
						'custpage_resultssublist_recon_sessionid', 'text',
						'Reconciliation Session ID');

				var res_Recid = resultsSubList.addField(
						'custpage_resultssublist_recon_recid', 'text', 'recid');
				res_Recid.setDisplayType('hidden');

				var totalCol = [];
				
//		if(searchResults != null) {
				for (var i = 0; i < searchResults.length; i++) {
					
					// resultsSubList.setLineItemValue('custpage_resultssublist_reconciled',i
					// + 1, searchResults[i].reconciled);
					resultsSubList.setLineItemValue('custpage_resultssublist_recon_recid', i + 1,searchResults[i].recID);
					resultsSubList.setLineItemValue('custpage_resultssublist_tranid', i + 1,searchResults[i].tranNumber);
					resultsSubList.setLineItemValue('custpage_resultssublist_trantype', i + 1,searchResults[i].tranType);
					resultsSubList.setLineItemValue('custpage_resultssublist_payee', i + 1,searchResults[i].vendorPayee);
					resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i + 1,searchResults[i].tranDate);
					resultsSubList.setLineItemValue('custpage_resultssublist_accountperiod', i + 1,searchResults[i].postingPeriod);
					resultsSubList.setLineItemValue('custpage_resultssublist_currency', i + 1,searchResults[i].currency);
					resultsSubList.setLineItemValue('custpage_resultssublist_exrate', i + 1,searchResults[i].exRate);
					resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primary_Amt);
					
					totalCol.push(searchResults[i].primary_Amt);

					resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].ogTotalPayment);;
					totalCol.push(searchResults[i].ogTotalPayment);
					
					
					if (searchResults[i].primary_Amt == "NaN") {
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1, '0');
						totalCol.push('0');
					}
					// billOGTotalPayment
					if (searchResults[i].tranType == "Bill") {
						
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].ogTotalPayment);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].billPrimaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
						
				if(searchResults[i].billLineAmt != undefined) {
					
							resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i +1 ,searchResults[i].billLineAmt );
							resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].billLinePrimary);
							resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].billLineSecondary);
							
				}

						
					}
					if (searchResults[i].tranType == "Bill Payment") {
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
					}

					if (searchResults[i].tranType == "Payment") {
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].signedAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);

					}
					
					if (searchResults[i].tranType == "Credit Memo") {
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].signedAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);

					}
					
					if (searchResults[i].tranType == "Bill Credit") {
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);

					}

					if (searchResults[i].tranType == 'Journal') {
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].journal_Amt);
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].journalPrimaryAmt);
						var secondaryAmtJournal = searchResults[i].secondaryAmt;
						if(secondaryAmtJournal == 'NaN') {
							secondaryAmtJournal = 'Book Specific';
						}
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,secondaryAmtJournal);
						

						totalCol.push(searchResults[i].journal_Amt);
					}

					if (searchResults[i].tranType == 'Invoice') {
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].signedAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
						totalCol.push(searchResults[i].secondaryAmt);
					}
					if (searchResults[i].primaryBookAmt == "NaN") {
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt',i + 1, '0');
						totalCol.push('0');
					}

				}
				nlapiLogExecution("DEBUG", "checkLine",
						'317-searchResults after Loop');

				var all = JSON.stringify(searchResults);
				var totalColJson = JSON.stringify(totalCol);

				var currencyOptions = getCurrencies(selectSubsid);
				nlapiLogExecution("DEBUG", "checkLine", '322-getCurrencies');

				var manualReconGroup = reconForm.addFieldGroup('custpage_manual_recon_group','Manual Reconciliation Closure');
				var manualReconMemo = reconForm.addField('custpage_manual_recon_memo', 'text', 'Memo', null,'custpage_manual_recon_group');
				var manualReconCurr;

				if ((selectedBook == 'a') && (selectedValidateBy == 'b')) { // validate
					// by
					// accounting
					// currency
					// -
					// Primary
					// Book
					manualReconCurr = reconForm.addField('custpage_manual_recon_currency', 'select', 'Currency',null, 'custpage_manual_recon_group');
					manualReconCurr.addSelectOption('', '');
					for (var i = 0; i < currencyOptions.length; i++) {
						manualReconCurr.addSelectOption(
								currencyOptions[i].currency_id,
								currencyOptions[i].currency_name);
						if (currencyOptions[i].currency_isPrimary == 'T') {
							manualReconCurr
									.setDefaultValue(currencyOptions[i].currency_id);
						}
					}
				}
				if ((selectedBook == 'b') && (selectedValidateBy == 'b')) { // validate
					// by
					// accounting
					// currency
					// -
					// Secondary
					// Book
					manualReconCurr = reconForm.addField('custpage_manual_recon_currency', 'select', 'Currency', null, 'custpage_manual_recon_group').setMandatory(true);
					manualReconCurr.addSelectOption('', '');
					for (var i = 0; i < currencyOptions.length; i++) {
						manualReconCurr.addSelectOption(
								currencyOptions[i].currency_id,
								currencyOptions[i].currency_name);
						if (currencyOptions[i].currency_isPrimary == 'F') {
							manualReconCurr
									.setDefaultValue(currencyOptions[i].currency_id);
							nlapiLogExecution("DEBUG", "checkLine",
									'347-currencyOptions');
						}
					}
				}
				if (((selectedBook == 'b') && (selectedValidateBy == 'a'))
						|| ((selectedBook == 'a') && (selectedValidateBy == 'a'))) {

					manualReconCurr = reconForm.addField('custpage_manual_recon_currency', 'select', 'Currency','CURRENCY', 'custpage_manual_recon_group').setMandatory(true);
				}

				if (selectedValidateBy == 'a') {
					manualReconCurr = reconForm.addField('custpage_manual_recon_currency', 'select', 'Currency',null, 'custpage_manual_recon_group').setMandatory(true);
					manualReconCurr.setDefaultValue(selectedCurrency);
				}

				var manualReconBtn = reconForm.addButton('custpage_manual_recon','Manual Reconciliation Closure', 'manual_recon_closure();');

				var selectExpAccount = reconForm.addField('custpage_select_expaccount', 'select','Select Expense Account', null,'custpage_manual_recon_group');
				selectExpAccount.addSelectOption('', '');
				for (var i = 0; i < expAccounts.length; i++) {
					selectExpAccount.addSelectOption(expAccounts[i].acc_id,
							expAccounts[i].acc_name);

				}
				nlapiLogExecution("DEBUG", "checkLine",
						'369-after expenseAccount search loop');
				var hiddenField = reconForm.addField('custpage_recon_data', 'text','reconDataLabel');
				hiddenField.setDisplayType('hidden');
				hiddenField.setDefaultValue(JSON.stringify(reconData));
				var recon_backBTN = reconForm.addButton('custpage_reconpage_back','Back', 'go_back_recon();');

				
				
				///end screen fields
				var sendToEnd = reconForm.addField('custpage_ilo_toend', 'text','sendToEnd', null, 'custpage_sum_group');
				sendToEnd.setDefaultValue('toEnd');
				sendToEnd.setDisplayType('hidden');
				
				var getReconSessionNumber = reconForm.addField('custpage_ilo_reconsessionnumber', 'text','reconSessionNumber', null, 'custpage_sum_group');
				getReconSessionNumber.setDefaultValue(reconSessionID);
				getReconSessionNumber.setDisplayType('hidden');
				
				var getReconAccount = reconForm.addField('custpage_ilo_recon_account', 'text','reconAccount', null, 'custpage_sum_group');
				getReconAccount.setDefaultValue(accName);
				getReconAccount.setDisplayType('hidden');
				


				reconForm.setScript('customscript_ilo_recon_client_scripts');
				nlapiLogExecution("DEBUG", "checkLine", '370-end');
				response.writePage(reconForm);
//		}
		


			}
			catch(err) {
				//no results endPage
				
				var noSearchResultsForm = nlapiCreateForm('No Results');
				var noLoadDetails = noSearchResultsForm.addField('custpage_ilo_nosearchresults','inlinehtml', 'no search results', null, null);
				noLoadDetails.setDefaultValue('<font size="2"><b>No transactions were found. Please check the date range and account selected.</b>');
				noLoadDetails.setLayoutType('normal', 'startcol');
				response.writePage(noSearchResultsForm);
			}
			
		}

	} // end of stage one
	else if (request.getParameter('custpage_ilo_load_session') != null || request.getParameter('custpage_ilo_rec_session') != null) {

		var inputSessionID = request.getParameter('custpage_ilo_load_session');
		var backHome = request.getParameter('custpage_ilo_back_home');
		var selectedAccLoad = request.getParameter('custpage_select_ccaccount');
		var noResults;
		
		try {
			loadSessionSearch(inputSessionID); // load session loadARR
			
//			if(loadResults != null) {

			var sesMemo;
			var sessionMemo = loadResults[0].session_memo_body;
			var sessionMemo_col = loadResults[0].session_memo_col;
			if (sessionMemo == '') {
				sesMemo = sessionMemo_col;
			}
			if (sessionMemo_col == '') {
				sesMemo = sessionMemo;
			}
			var loadForm = nlapiCreateForm('Session No: ' + inputSessionID + ' - '+ sesMemo);
			var load_backBTN = loadForm.addButton('custpage_loadpage_back', 'Back','go_back();');
			var unreconcileBTN = loadForm.addButton('custpage_unreconcile_btn','Remove Reconciliation', 'unreconcile();');
			var to_backHome = loadForm.addField('custpage_ilo_to_back_home','text', 'link back home', null, 'custpage_search_group');
			to_backHome.setDefaultValue(backHome);
			to_backHome.setDisplayType('hidden');
			

			// RESULTS SUBLIST
			var loaded_SubList = loadForm.addSubList('custpage_loaded_sublist',
					'list', 'Results', null);

			var load_CheckBox = loaded_SubList.addField(
					'custpage_loadedsublist_checkbox', 'checkbox', 'Reconciled');
			load_CheckBox.setDefaultValue('T');

			var load_TranId = loaded_SubList.addField(
					'custpage_loadedsublist_tranid', 'text', 'Transaction Number');

			var load_TranType = loaded_SubList.addField(
					'custpage_loadedsublist_trantype', 'text', 'Type');

			var load_Payee = loaded_SubList.addField(
					'custpage_loadedsublist_payee', 'text', 'Payee');

			var load_Employee = loaded_SubList.addField(
					'custpage_loadedsublist_employee', 'text', 'Employee');

			var load_TravelNum = loaded_SubList.addField(
					'custpage_loadedsublist_travelnum', 'text', 'Travel Ref');

			var load_TranDate = loaded_SubList.addField(
					'custpage_loadedsublist_trandate', 'date', 'Transaction Date');

			var load_AccPeriod = loaded_SubList.addField(
					'custpage_loadedsublist_accountperiod', 'text',
					'Posting Period');

			var load_Currency = loaded_SubList.addField(
					'custpage_loadedsublist_currency', 'text', 'Currency');

			var load_ExRate = loaded_SubList.addField(
					'custpage_loadedsublist_exrate', 'text', 'Exchange Rate');

			var load_Original_Amt = loaded_SubList.addField(
					'custpage_loadedsublist_og_amt', 'text', 'Original Amount');

			var load_Primary_Amt = loaded_SubList.addField(
					'custpage_loadedsublist_primary_amt', 'text',
					'Primary Book Amount');

			var load_Secondary_Amt = loaded_SubList.addField(
					'custpage_loadedsublist_secondary_amt', 'text',
					'Secondary Book Amount');

			var load_Recon_Number = loaded_SubList.addField(
					'custpage_loadedsublist_recon_sessionid', 'text',
					'Reconciliation Session ID');

			var load_Recid = loaded_SubList.addField(
					'custpage_loadedsublist_recon_recid', 'text', 'recid');
			load_Recid.setDisplayType('hidden');

			var totalCol_load = [];
			
			
			for (var i = 0; i < loadResults.length; i++) {

				loaded_SubList.setLineItemValue(
						'custpage_loadedsublist_recon_recid', i + 1,loadResults[i].recID);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_tranid',i + 1, loadResults[i].tranNumber);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_trantype',i + 1, loadResults[i].tranType);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_payee',i + 1, loadResults[i].vendorPayee);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_trandate',i + 1, loadResults[i].tranDate);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_accountperiod', i + 1,loadResults[i].postingPeriod);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_currency',i + 1, loadResults[i].currency);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_exrate',i + 1, loadResults[i].exRate);


				loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt',i + 1, loadResults[i].ogTotalPayment);
				totalCol_load.push(loadResults[i].ogTotalPayment);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].primaryAmt);
				totalCol_load.push(loadResults[i].primary_Amt);
				
				

				if (loadResults[i].tranType == "Payment") {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].ogTotalPayment);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].custPaymentOGAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);

				}

				if (loadResults[i].tranType == 'Journal') {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].journal_Amt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].journalPrimaryAmt);
					//loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);
					var secondaryAmtJournal = loadResults[i].secondaryAmt;
					if(secondaryAmtJournal == 'NaN') {
						secondaryAmtJournal = 'Book Specific';
					}
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,secondaryAmtJournal);
				}

				
				if (loadResults[i].tranType == "Bill Payment") {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].vendPaymentOGAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);
				}
				if (loadResults[i].tranType == "Bill") {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].ogTotalPayment);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].billPrimaryAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);
				}
				
				if (loadResults[i].tranType == "Bill Credit") {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].ogTotalPayment);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].billCredPrimaryAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);
				}

				if (loadResults[i].tranType == 'Invoice') {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);
					
				}


				if (loadResults[i].primaryBookAmt == "NaN") {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1, '0');
					totalCol_load.push('0');
				}

				loaded_SubList.setLineItemValue(
						'custpage_loadedsublist_recon_sessionid', i + 1,
						inputSessionID);
			}

			loadForm.setScript('customscript_ilo_recon_client_scripts');
			var all = JSON.stringify(loadResults);
			// response.write(all);
			response.writePage(loadForm);
//			}

		}
		catch(err) {
			var noLoadResultsForm = nlapiCreateForm('Invalid Session');
			var noLoadDetails = noLoadResultsForm.addField('custpage_ilo_noloadresults','inlinehtml', 'no load results', null, null);
			noLoadDetails.setDefaultValue('<font size="2"><b>The session that you are trying to load is either empty, has been deleted or non-existent.<br>Please try again.</b>');
			noLoadDetails.setLayoutType('normal', 'startcol');
			response.writePage(noLoadResultsForm);
		}

	} else {

	}
	;

};

function tranSearch(inpDate_from, inpDate_to, selectSubsid, selectedAcc, selectedCurrency) {
	
//	try {
		
		var search_recordIDs = [];
		var resultsArr = [];
		var multipleLines = [];
		var filters = new Array();
	
		filters[0] = new nlobjSearchFilter('subsidiary', null, 'is', selectSubsid);
		filters[1] = new nlobjSearchFilter('account', null, 'anyof', selectedAcc);
		filters[2] = new nlobjSearchFilter('trandate', null, 'onorafter',
				inpDate_from);
		filters[3] = new nlobjSearchFilter('trandate', null, 'onorbefore',
				inpDate_to);
		filters[4] = new nlobjSearchFilter('type', null, 'noneof', ['Transfer',
				'FxReval', 'PurchOrd', 'PurchReq' ]);
		filters[5] = new nlobjSearchFilter('posting', null, 'is', 'T');
		//filters[5] = new nlobjSearchFilter('mainline', null, 'is', 'T');

		if (selectedCurrency != '') {
			filters[6] = new nlobjSearchFilter('currency', null, 'is',
					selectedCurrency);
		}

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
		cols[10] = new nlobjSearchColumn('grossamount');
		cols[11] = new nlobjSearchColumn('signedamount');


		var s = nlapiSearchRecord('transaction', null, filters, cols);

		
		for (var i = 0; i < s.length; i++) {
			

			allRecon.contains(s[i].id); // true

			search_recordIDs.push(s[i].id);

			function countInArray(array, what) {
				var count = 0;
				for (var i = 0; i < array.length; i++) {
					if (array[i] === what) {
						count++;
					}
				}
				return count;
			}

			if (countInArray(search_recordIDs, s[i].id) != 1) { 
				multipleLines.push(s[i].id);
			}
			
			if(allRecon.contains(s[i].id) == false) {

			resultsArr.push({
				tranNumber : s[i].getValue('transactionnumber'),
				tranDate : s[i].getValue('trandate'),
				postingPeriod : s[i].getText('postingperiod'),
				currency : s[i].getText('currency'),
				exRate : s[i].getValue('exchangerate'),
				vendorPayee : s[i].getText('entity'),
				tranType : s[i].getText('type'),
				tranID : s[i].getValue('tranID'),
				ogTotalPayment : s[i].getValue('total'),
				recID : s[i].id,
				grossamt : s[i].getValue('grossamount'),
				signedAmt : s[i].getValue('signedamount'),
				
				
			
			});
		
			}
		}

		nlapiLogExecution("DEBUG", 'check', JSON.stringify(resultsArr));
		for (var j = 0; j < resultsArr.length; j++) {
			if (resultsArr[j].tranType == 'Journal') {
				resultsArr[j].journal_Amt = getCreditAmt('journalentry',resultsArr[j].recID);
			}
			
			if (resultsArr[j].tranType == 'Bill') {
				if(multipleLines.contains(resultsArr[j].recID)) {
					resultsArr[j].billLineAmt = (parseFloat(resultsArr[j].grossamt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].billLinePrimary = (parseFloat(resultsArr[j].billLineAmt) * (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].billLineSecondary = (parseFloat(resultsArr[j].billLineAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
				}
			}

			resultsArr[j].primary_Amt = resultsArr[j].ogTotalPayment;
			

			if (resultsArr[j].tranType == 'Bill Payment') {
				resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
				resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID]));
			}
			
			if (resultsArr[j].tranType == 'Payment') {
				resultsArr[j].signAmt = resultsArr[j].signedAmt;
				resultsArr[j].primaryAmt = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].primaryAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
			}
			
			if (resultsArr[j].tranType == 'Invoice') {
				resultsArr[j].signAmt = resultsArr[j].signedAmt;
				resultsArr[j].primaryAmt = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].primaryAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
			}
			
			if (resultsArr[j].tranType == 'Credit Memo') {
				resultsArr[j].signAmt = resultsArr[j].signedAmt;
				resultsArr[j].primaryAmt = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].primaryAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
			}
			
			if (resultsArr[j].tranType == 'Bill Credit') {
				resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
				resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID]));
			}
			
			

			if (resultsArr[j].tranType == 'Journal') {
				resultsArr[j].journalPrimaryAmt = (parseFloat(resultsArr[j].journal_Amt) * parseFloat(resultsArr[j].exRate)).toFixed(2);
				resultsArr[j].secondaryAmt = (parseFloat(resultsArr[j].journal_Amt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
				
			}
			
			if(resultsArr[j].tranType == 'Bill') {
				
				resultsArr[j].billPrimaryAmt = (parseFloat(resultsArr[j].ogTotalPayment) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].billPrimaryAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
			}
			
			
		}

		searchResults = resultsArr;
//	}
//	catch(err) {
//	    searchResults = null;
//	}


};

function loadSessionSearch(inputSessionID) {
	
	try {
		var inputSessionID = inputSessionID;
		var load_recordIDs = [];
		var loadArr = [];


		var filterExpression = [

		[

		[ 'custcol_ilo_recon_session_col', 'is', inputSessionID ],

		'or',

		[ 'custbody_ilo_recon_session', 'is', inputSessionID ],

		],

		];

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
		cols[10] = new nlobjSearchColumn('custcol_ilo_recon_session_col');
		cols[11] = new nlobjSearchColumn('custbody_ilo_recon_session');
		cols[12] = new nlobjSearchColumn('custcol_ilo_recon_memo_col');
		cols[13] = new nlobjSearchColumn('custbody_ilo_recon_memo');
		cols[14] = new nlobjSearchColumn('mainline');

		var s = nlapiSearchRecord('transaction', null, filterExpression, cols);


		for (var i = 0; i < s.length; i++) {

			load_recordIDs.push(s[i].id);

			function countInArray(array, what) {
				var count = 0;
				for (var i = 0; i < array.length; i++) {
					if (array[i] === what) {
						count++;
					}
				}
				return count;
			}

			if (countInArray(load_recordIDs, s[i].id) == 1) {

				loadArr.push({
							tranNumber : s[i].getValue('transactionnumber'),
							tranDate : s[i].getValue('trandate'),
							postingPeriod : s[i].getText('postingperiod'),
							currency : s[i].getText('currency'),
							exRate : s[i].getValue('exchangerate'),
							vendorPayee : s[i].getText('entity'),
							tranType : s[i].getText('type'),
							tranID : s[i].getValue('tranID'),
							ogTotalPayment : s[i].getValue('total'),
							recID : s[i].id,
							sessionID_col : s[i].getValue('custcol_ilo_recon_session_col'),
							sessionID_body : s[i].getValue('custbody_ilo_recon_session'),
							session_memo_col : s[i].getValue('custcol_ilo_recon_memo_col'),
							session_memo_body : s[i].getValue('custbody_ilo_recon_memo'),
//							primaryAmt : (parseFloat(s[i].getValue('total')) / (parseFloat(s[i]
//									.getValue('exchangerate')))).toFixed(2)

						});
			}
		}

		for (var j = 0; j < loadArr.length; j++) {
			

			
			if (loadArr[j].tranType == 'Bill') {
				loadArr[j].billPrimaryAmt = (parseFloat(loadArr[j].ogTotalPayment) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].billPrimaryAmt) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
			}

			loadArr[j].primary_Amt = loadArr[j].ogTotalPayment;
			

			if (loadArr[j].tranType == 'Bill Payment') {
				loadArr[j].primaryAmt = loadArr[j].ogTotalPayment;
				loadArr[j].vendPaymentOGAmt = (parseFloat(loadArr[j].ogTotalPayment) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].vendPaymentOGAmt) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
			}
			
			if (loadArr[j].tranType == 'Payment') {
				loadArr[j].primaryAmt = loadArr[j].ogTotalPayment;
				loadArr[j].custPaymentOGAmt = (parseFloat(loadArr[j].ogTotalPayment) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].custPaymentOGAmt) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);

			}
			if (loadArr[j].tranType == 'Invoice') {
				loadArr[j].primaryAmt = loadArr[j].ogTotalPayment;
				loadArr[j].ogTotalPayment = (parseFloat(loadArr[j].ogTotalPayment) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].ogTotalPayment) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
	
			}
			
			if(loadArr[j].tranType == 'Bill Credit') {
				loadArr[j].primaryAmt = loadArr[j].ogTotalPayment;
				loadArr[j].billCredPrimaryAmt = (parseFloat(loadArr[j].ogTotalPayment) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].billCredPrimaryAmt) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
				
			}

			if (loadArr[j].tranType == 'Journal') {
				loadArr[j].journal_Amt = getCreditAmt_Load('journalentry',loadArr[j].recID);
				//loadArr[j].journal_Amt = getCreditAmt('journalentry',loadArr[j].recID);
				loadArr[j].journalPrimaryAmt = (parseFloat(loadArr[j].journal_Amt) * parseFloat(loadArr[j].exRate)).toFixed(2);
				loadArr[j].secondaryAmt = (parseFloat(loadArr[j].journal_Amt) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
			}

		}

		loadResults = loadArr;
		}
		catch(err) {
			loadResults = null;
		}

	
}


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

			if (thisAcc == currAcc) {
				credit = theRec.getLineItemValue('line', 'credit', i);
				debit = theRec.getLineItemValue('line', 'debit', i);
			}
		}

		if (credit == null) {
			creditAmt.push(debit);
		}
		if (credit != null) {
			creditAmt.push(pos_to_neg(credit).toFixed(2).toString());
		}
	}

	return creditAmt;

}

function getCreditAmt_Load(a, b) {
	a = 'journalentry';

	var creditAmt = [];
	var thisAcc;
	var credit;
	var debit;

	var theRec = nlapiLoadRecord(a, b);
	var lineCount = theRec.getLineItemCount('line');
	if (lineCount > 0) {
		for (var i = 1; i <= lineCount; i++) {
			//thisAcc = theRec.getLineItemValue('line', 'account', i);

			//if (thisAcc == currAcc) {
				credit = theRec.getLineItemValue('line', 'credit', i);
				debit = theRec.getLineItemValue('line', 'debit', i);

			//}
		}

		if (credit == null) {
			creditAmt.push(debit);
		}
		if (credit != null) {
			creditAmt.push(pos_to_neg(credit).toFixed(2).toString());
		}
	}

	return creditAmt;

}

function getPrimaryAmt(a, b) {
	return a * b;

}

function makeSessionID() {
	var date = new Date();
	var timestamp = date.getTime().toString();
	return parseInt(timestamp);
}

function pos_to_neg(num) {
	return -Math.abs(num);
}

function getCurrencies(subsidiary) {
	var currencies = [];

	var fils = new Array();
	fils[0] = new nlobjSearchFilter('subsidiary', null, 'is', subsidiary);

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('currency');
	cols[1] = new nlobjSearchColumn('isprimary');
	var s = nlapiSearchRecord('accountingbook', null, fils, cols);
	if (s != null) {

		for (var i = 0; i < s.length; i++) {
			if (s[i].getValue('name') == '') {
				continue;
			}

			currencies.push({
				currency_id : s[i].getValue('currency'),
				currency_name : s[i].getText('currency'),
				currency_isPrimary : s[i].getValue('isprimary')

			});

		}

	}
	return currencies;
}

function getAllRecons() {

	var searchRecon = nlapiLoadSearch(null, 'customsearch_ilo_all_recon_transactions');

	var allrecon = [];
	var reconTrans =[];
	var resultRecon = [];
	var searchid = 0;
	var resultset = searchRecon.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allrecon.push(resultRecon[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allrecon != null) {
				allrecon.forEach(function(line) {
					
					reconTrans.push(line.getValue('internalid'));
					
				});

			};
			
			return reconTrans;

	}

Array.prototype.contains = function (v) {
    return this.indexOf(v) > -1;
};








