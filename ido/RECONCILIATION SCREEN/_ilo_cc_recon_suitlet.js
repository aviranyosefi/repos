var allJE = [];
var sameRec = [];

var markedTrans;
var newJournalEntry;		
var reconSes;
var selectAccount;
var recsAndLines = [];

var isNew;
var dataArr;

var selectedBook;
var selectedValBy;

var selectedAcc = '';
var selectSubsid = '';
var inpDate_from = '';
var inpDate_to = '';
var recon_Y_N = '';
var selectedBook = '';
var selectedValidateBy = '';
var reconSessionID;
var loadSessionID;

var jeMultiple;
var thejeAmt;
var linesInJE;
var jeEntries = [];

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
var allReconChecks = getAllReconChecks();
var allReconChecksArr = [];

for(var x = 0; x<allReconChecks.length; x++) {
	allReconChecksArr.push(allReconChecks[x].check_tranNum);
}
var cleanRecons = [];

for(var i = 0; i<allRecon.length; i++) {

if(allRecon[i] != "") {

cleanRecons.push(allRecon[i]);
}

}

var recoveryIDrec = nlapiSearchRecord('customrecord_ilo_recon_recovery_point');
var recoveryID = recoveryIDrec[0].id;



function cc_recon() {

	if (request.getMethod() == 'GET') {
		
		nlapiLogExecution('DEBUG', 'im here', 'firstpage');
		
		//nlapiLogExecution('DEBUG', 'allRecon', JSON.stringify(allRecon.length));

		var fils = new Array();
		fils[0] = new nlobjSearchFilter('balance', null, 'notequalto', '0.00');
		fils[1] = new nlobjSearchFilter('type', null, 'noneof', ['Expense', 'Income', 'COGS', 'AcctRec', 'AcctPay', 'Bank']);
		

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

		var selectSubsidiary = form.addField('custpage_select_subsidiary',
				'select', 'Subsidary', 'SUBSIDIARY', 'custpage_search_group');


		var selectBookType = form.addField('custpage_select_booktype',
				'select', 'Select Book', null, 'custpage_search_group');
		selectBookType.addSelectOption('', '');
		selectBookType.addSelectOption('a', 'Primary Accounting Book');
		selectBookType.addSelectOption('b', 'Local Accounting Book');

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
		fromDate.setDefaultValue('01/01/17');
		fromDate.setBreakType('startcol');

		var toDate = form.addField('custpage_ilo_cc_recon_todate', 'date',
				'To Date', null, 'custpage_search_group');
		toDate.setDefaultValue('31/01/17');


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
		
		nlapiLogExecution('DEBUG', 'im here', 'statuspage');
		
		var newReconSesNumber = request.getParameter('custpage_ilo_reconsessionnumber');
		var reconSelectedAccount = request.getParameter('custpage_ilo_recon_account');
		var markedTrans = request.getParameter('custpage_ilo_marked');

		
		nlapiLogExecution('DEBUG', 'got to the else', 'got to the else');
		
		var endForm = nlapiCreateForm('Reconciliation Session Details');
		
		var sessionNumber = endForm.addField('custpage_ilo_end_session','inlinehtml', 'Session Number', null, null);
		sessionNumber.setDefaultValue('<font size="3"><b> Session ID : '+ newReconSesNumber +'</b>');
		sessionNumber.setLayoutType('normal', 'startcol');
		
		var sessionAcc = endForm.addField('custpage_ilo_acc_session','inlinehtml', 'Session Account', null, null);
		sessionAcc.setDefaultValue('<font size="3"><b> Reconciled from Account : '+ reconSelectedAccount + '</b>');
		sessionAcc.setLayoutType('normal');
		
		var getReconciledBy = endForm.addField('custpage_ilo_recon_by','inlinehtml', 'Session Account', null, null);
		var getContext = nlapiGetContext();
		var reconBy = getContext.name;
		getReconciledBy.setDefaultValue('<font size="3"><b> Reconciled by : '+ reconBy + '</b>');
		getReconciledBy.setLayoutType('normal');
		
		var continueToRecon = endForm.addField('custpage_ilo_continuerecon','text', 'continueRecon', null, null);
		continueToRecon.setDefaultValue('cont');
		continueToRecon.setDisplayType('hidden');
		
		var marked = endForm.addField('custpage_ilo_marked_lines', 'longtext', 'markedLines', null, null);
		
//	    var file = nlapiLoadFile('20435');
//	    var content = file.getValue();
//	    content = markedTrans;
//	    file = nlapiCreateFile(file.getName(), 'PLAINTEXT', content);
//	    file.setFolder(-15);
//	    nlapiSubmitFile(file);
	    
		marked.setDefaultValue(markedTrans);
		marked.setDisplayType('hidden');
		
		var contBtn = endForm.addSubmitButton("Continue");
		
		
		response.writePage(endForm);

	} 
	else if (request.getParameter('custpage_ilo_continuerecon') == 'cont' || (request.getParameter('custpage_ilo_finish') == '')) {
		
		nlapiLogExecution('DEBUG', 'im here', 'contpage');
		nlapiSetFieldValue('custpage_ilo_load_session', 'nothing');
		
		markedTrans = request.getParameter('custpage_ilo_marked_lines');
		
		if(markedTrans == null) {
			
			markedTrans = request.getParameter('custpage_ilo_isnewsession');
	
		}
	
		
		nlapiLogExecution("DEBUG", 'markedParam', markedTrans);
		
		var dataArr = JSON.parse(markedTrans);
	
		
		
	     var recs = [];
			
	     
	     for( var i = 0; i<dataArr.length; i++) {
	    	 
	    	 if(dataArr[i].rec_id != null || undefined) {
	    		 
	    		 recs.push(dataArr[i].rec_id);
	    	 }
	    	 if(dataArr[i].reconSession != null || undefined) {
	    		 
	    		 reconSes = dataArr[i].reconSession;
	    	 }
	    	 if(dataArr[i].selectedAcc != null || undefined) {
	    		 
	    		 selectAccount = dataArr[i].selectedAcc;
	    	 }
	    	 if(dataArr[i].booktypeSelected != null || undefined) {
	    		 
	    		 selectedBook = dataArr[i].booktypeSelected;
	    	 }
	    	 
	    	 if(dataArr[i].validationSelected != null || undefined) {
	    		 
	    		 selectedValBy = dataArr[i].validationSelected;
	    	 }
 
	    	 if(dataArr[i].rec_id != undefined || null ) {
	    		 
	    		 recsAndLines.push({
	    			 docID : dataArr[i].rec_id,
	    			 docLine : dataArr[i].doc_line, 
	    	 });

	     }
	    	 if(dataArr[i].newJournal != null || undefined) {
	    		
	    		 recsAndLines.push({
	    			 docID : dataArr[i].newJournal,
	    			 docLine : '0',

	    	 });
	
	    	 }
	     }
	     
	      //do whatever you want
	     var js = JSON.stringify(recsAndLines);
	    	 nlapiLogExecution("DEBUG", 'recsAndLines-92', js);
	    	// nlapiLogExecution("DEBUG", 'newJournalEntry', newJournalEntry);
	    	 
	 
  

	     var reconForm = nlapiCreateForm('Reconciliation : '+reconSes);
	    
	     reconForm.addSubmitButton('Reconcile');
	     
	
			
			var isNewSession = reconForm.addField('custpage_ilo_isnewsession', 'longtext', 'newsession', null, 'custpage_load_group');
			isNewSession.setDisplayType('hidden');
			var recoveryRec = nlapiLoadRecord("customrecord_ilo_recon_recovery_point", recoveryID);
			var oldSes = recoveryRec.getFieldValue('custrecord_ilo_recon_curr_session');
			
			isNewSession.setDefaultValue(oldSes);
			
	     
		 var sum_fieldGroup = reconForm.addFieldGroup('custpage_sum_cont_group',
			'Summary');
		     
		 var sessionMemo = reconForm.addField('custpage_ilo_sesmemo', 'text', 'Reconciliation Session Memo', null, 'custpage_sum_cont_group').setMandatory(true);
		
	     var sessionBook = reconForm.addField('custpage_ilo_sesbook', 'text', 'Book Type', null, 'custpage_sum_cont_group');
	     if(selectedBook == 'a') {
	    	  sessionBook.setDefaultValue('Primary Book');
	 	     sessionBook.setLayoutType('normal', 'startcol');
	     }
	     if(selectedBook == 'b') {
	    	  sessionBook.setDefaultValue('Local Book');
	 	     sessionBook.setLayoutType('normal', 'startcol');
	     }
	     
	     
	   
	     var sessionValBy = reconForm.addField('custpage_ilo_sesvalby', 'text', 'Validation By', null, 'custpage_sum_cont_group');
	     if(selectedValBy == 'a') {
	    	   sessionValBy.setDefaultValue('Original Currency');
	     }
	     if(selectedValBy == 'b') {
	    	   sessionValBy.setDefaultValue('Accounting Currency');
	     }
	  
	     var reconSessionTotal = reconForm.addField('custpage_ilo_sestotal', 'text', 'Session Total', null, 'custpage_sum_cont_group');
	    // reconSessionTotal.setDefaultValue(selectedValBy);
	     
	     var sessionField = reconForm.addField('custpage_ilo_ses', 'text', 'ses', null, null);
	     sessionField.setDefaultValue(reconSes);
	     sessionField.setDisplayType('hidden');
	     var accountField = reconForm.addField('custpage_ilo_acc', 'text', 'acc', null, null);
	     accountField.setDefaultValue(selectAccount);
	     accountField.setDisplayType('hidden');
	     
	     var finish = reconForm.addField('custpage_ilo_finish', 'text', 'finsh', null, 'custpage_sum_cont_group');
	     finish.setDisplayType('hidden');
	     
	     var recsToRecon = [];
	     
	     if(markedTrans != null) {
	    	 
	    	 for(var x = 0; x<recsAndLines.length; x++) {
	    		 
	    		 if(recsAndLines[x].docLine == undefined) {
	    			 recsAndLines[x].docLine = '0';
	    		 }
	    		 
	    		 recsToRecon.push(recsAndLines[x].docID);
	    	 }
	    	 
	    	 nlapiLogExecution("DEBUG", "recsToRecon", JSON.stringify(recsToRecon));
	     
			cont_tranSearch(recsToRecon, selectAccount, newJournalEntry);
	     }
	     
			// RESULTS SUBLIST
			var resultsSubList = reconForm
					.addSubList('custpage_results_sublist', 'list',
							'Results', null);
			resultsSubList.addMarkAllButtons();

			var res_CheckBox = resultsSubList.addField(
					'custpage_resultssublist_checkbox', 'checkbox', 'Select');
			res_CheckBox.setDefaultValue('T');


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
			
//			if(searchResults != null) {
			for (var i = 0; i < searchResults.length; i++) {
				
				// resultsSubList.setLineItemValue('custpage_resultssublist_reconciled',i
				// + 1, searchResults[i].reconciled);
				resultsSubList.setLineItemValue('custpage_resultssublist_recon_recid', i + 1,searchResults[i].recID);
				resultsSubList.setLineItemValue('custpage_resultssublist_tran_linenum', i + 1, searchResults[i].lineNum);
				resultsSubList.setLineItemValue('custpage_resultssublist_tranid', i + 1,searchResults[i].tranNumber);
				resultsSubList.setLineItemValue('custpage_resultssublist_trantype', i + 1,searchResults[i].tranType);
				resultsSubList.setLineItemValue('custpage_resultssublist_payee', i + 1,searchResults[i].vendorPayee);
				resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i + 1,searchResults[i].tranDate);
				resultsSubList.setLineItemValue('custpage_resultssublist_accountperiod', i + 1,searchResults[i].postingPeriod);
				resultsSubList.setLineItemValue('custpage_resultssublist_currency', i + 1,searchResults[i].currency);
				resultsSubList.setLineItemValue('custpage_resultssublist_exrate', i + 1,searchResults[i].exRate);
				resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primary_Amt);
				

				resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].ogTotalPayment);;
			
				
				
				if (searchResults[i].primary_Amt == "NaN") {
					resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1, '0');
			
				}
				// billOGTotalPayment
				if (searchResults[i].tranType == "Bill") {
					
					resultsSubList.setLineItemValue('custpage_resultssublist_travelnum', i + 1,searchResults[i].travelNum);
					
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
					resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
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
					
					resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
					resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
					resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
					if(searchResults[i].secondaryAmt == 'NaN') {
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1, '0');
					}
					

				
				}

				
				if (searchResults[i].tranType == 'Deposit') {
					
					resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
					resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
					resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
				}
				
					
				if (searchResults[i].tranType == 'Check') {
					
					resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
					resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
					resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
				}
					
				if (searchResults[i].tranType == 'Invoice') {
					resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
					resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].signedAmt);
					resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
					
				}
				if (searchResults[i].primaryBookAmt == "NaN") {
					resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt',i + 1, '0');
				
				}

			}

	      
		//	var st = JSON.stringify(recs);
			//response.write('Next suitlet' + dataArr);
	    //  response.write('Next suitlet' + st);
			reconForm.setScript('customscript_ilo_recon_client_submit');
			response.writePage(reconForm);
	   }
	
	
	else if(request.getParameter('custpage_ilo_finish') == 'finish') {
		
		   var finalForm = nlapiCreateForm("Account Reconciled");
		   response.writePage(finalForm);
	}
	
			

	else if (request.getParameter('custpage_ilo_load_session') == ''
			|| request.getParameter('custpage_ilo_load_session') == null) { // sublist
		// stage
		
		nlapiLogExecution('DEBUG', 'im here', 'loadpage');
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
			var currCheck;

			var filters = new Array();
			filters[0] = new nlobjSearchFilter('type', null, 'anyof', 'Expense');
			filters[1] = new nlobjSearchFilter('subsidiary', null, 'is', '1');
			filters[2] = new nlobjSearchFilter('parent', null, 'noneof', '@NONE@');
			var cols = new Array();
			cols[0] = new nlobjSearchColumn('name');

			var s_exp = nlapiSearchRecord('account', null, filters, cols);
			if (s_exp != null) {

				for (var i = 0; i < s_exp.length; i++) {
					if (s_exp[i].getValue('name') == '') {
						continue;
					}

//					currCheck = s_exp[i].getValue('name');
//					var count = (currCheck.match(/:/g) || []).length;
//					if (count == 2) {
						expAccounts.push({
							acc_id : s_exp[i].id,
							acc_name : s_exp[i].getValue('name'),
						});
					//}

				};
				
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
			reconSessionID = makeSessionID().toString()+'/'+selectedAcc;
			
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
						'float', 'Deficit Total', null, 'custpage_sum_group');
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


				var currAccountSelected = reconForm.addField(
						'custpage_summary_curr_account', 'text',
						'Selected Account', null, 'custpage_sum_group');
				currAccountSelected.setDefaultValue(selectedAcc);
				currAccountSelected.setDisplayType('hidden');
				nlapiLogExecution("DEBUG", "checkLine", '215-sum_fieldGroup');

				// RESULTS SUBLIST
				var resultsSubList = reconForm
						.addSubList('custpage_results_sublist', 'list',
								'Results', null);
				 resultsSubList.addMarkAllButtons();
				 resultsSubList.addButton('custpage_ilo_calculatedeficit', 'Calculate Deficit', 'calculateDeficit()');

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

				var totalCol = [];
				
				
//		if(searchResults != null) {
				for (var i = 0; i < searchResults.length; i++) {
					
					// resultsSubList.setLineItemValue('custpage_resultssublist_reconciled',i
					// + 1, searchResults[i].reconciled);
					resultsSubList.setLineItemValue('custpage_resultssublist_recon_recid', i + 1,searchResults[i].recID);
					resultsSubList.setLineItemValue('custpage_resultssublist_tran_linenum', i + 1, searchResults[i].lineNum);
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
						
						resultsSubList.setLineItemValue('custpage_resultssublist_travelnum', i + 1,searchResults[i].travelNum);
						
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].ogTotalPayment);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].billPrimaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
						
				if(searchResults[i].billLineAmt != undefined) {
					
							resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i +1 ,searchResults[i].billLineAmt );
							resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].billLinePrimary);
							resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].billLineSecondary);
							resultsSubList.setLineItemValue('custpage_resultssublist_tran_linenum', i + 1,searchResults[i].vendBillLineNum);
								
				}

						
					}
					if (searchResults[i].tranType == "Bill Payment") {
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
					}

					if (searchResults[i].tranType == "Payment") {
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
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
						resultsSubList.setLineItemValue('custpage_resultssublist_tran_linenum', i + 1,searchResults[i].credMemoLineNum);
						

					}

					if (searchResults[i].tranType == 'Journal') {
					
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
						if(searchResults[i].secondaryAmt == 'NaN') {
							resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1, '0');
						}
						
					//nlapiLogExecution("DEBUG", 'checkJELineNumber', JSON.stringify(searchResults[i].lineNum));
						resultsSubList.setLineItemValue('custpage_resultssublist_tran_linenum', i + 1,searchResults[i].jeLineNumber);
						
					}
					

					
					if (searchResults[i].tranType == 'Deposit') {
						
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
					}
					
						
					if (searchResults[i].tranType == 'Check') {
						
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
					}
						
					if (searchResults[i].tranType == 'Invoice') {
						resultsSubList.setLineItemValue('custpage_resultssublist_primary_amt', i + 1,searchResults[i].primaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', i + 1,searchResults[i].OGAmount);
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt', i + 1,searchResults[i].secondaryAmt);
						resultsSubList.setLineItemValue('custpage_resultssublist_tran_linenum', i + 1,searchResults[i].invLineNum);
					//	totalCol.push(searchResults[i].secondaryAmt);
					}
					if (searchResults[i].primaryBookAmt == "NaN") {
						resultsSubList.setLineItemValue('custpage_resultssublist_secondary_amt',i + 1, '0');
						totalCol.push('0');
					}

			
				
				if (allJE != null) {
					
					for (var x = 0; x < allJE.length; x++) {
						
						//var ogAmts = getCreditAmt('journalentry',allJE[x], selectedAcc);	
						
					
							
							if(searchResults[i].recID == allJE[x]) {					

								var ogAmts = getCreditAmt('journalentry',allJE[x], selectedAcc);	
								
								for(var k = 0; k<ogAmts.length; k++) {
							
								resultsSubList.setLineItemValue('custpage_resultssublist_og_amt', x + 1,ogAmts[k].ogAmt);
							//	sameRec.push(ogAmts[k]);

							}
						}	
						
					}
										
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
					
					nlapiLogExecution('DEBUG', 'check-982 a and a', 'got here');

					manualReconCurr = reconForm.addField('custpage_manual_recon_currency', 'select', 'Currency','CURRENCY', 'custpage_manual_recon_group').setMandatory(true);
				}

//				if (selectedValidateBy == 'a') {
//					manualReconCurr = reconForm.addField('custpage_manual_recon_currency', 'select', 'Currency',null, 'custpage_manual_recon_group').setMandatory(true);
//					manualReconCurr.setDefaultValue(selectedCurrency);
//					nlapiLogExecution('DEBUG', 'check-990 a', selectedCurrency);
//				}

				var manualReconBtn = reconForm.addButton('custpage_manual_recon','Manual Reconciliation Closure', 'manual_recon_closure();');

				var selectExpAccount = reconForm.addField('custpage_select_expaccount', 'select','Select Expense Account', null,'custpage_manual_recon_group');
				selectExpAccount.addSelectOption('', '');
				for (var i = 0; i < expAccounts.length; i++) {
					selectExpAccount.addSelectOption(expAccounts[i].acc_id,
							expAccounts[i].acc_name);

				}
				nlapiLogExecution("DEBUG", "checkLine",
						'369-after expenseAccount search loop');
				var hiddenField = reconForm.addField('custpage_recon_data', 'longtext','reconDataLabel');
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
				

				var markedLine = reconForm.addField('custpage_ilo_marked', 'text', 'markedtocontinue', null, 'custpage_sum_group');
				markedLine.setDisplayType('hidden');
				
				
				reconForm.setScript('customscript_ilo_recon_client_scripts');
				nlapiLogExecution("DEBUG", "checkLine", '370-end');
				response.writePage(reconForm);
//		}
		

			}
			catch(err) {
				//no results endPage
				
				var noSearchResultsForm = nlapiCreateForm('No Results');
				nlapiLogExecution('DEBUG', 'err', err);
				var noLoadDetails = noSearchResultsForm.addField('custpage_ilo_nosearchresults','inlinehtml', 'no search results', null, null);
				noLoadDetails.setDefaultValue('<font size="2"><b>No transactions were found. Please check the date range and account selected.'+err+'</b>');
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
			loaded_SubList.addMarkAllButtons();

			var load_CheckBox = loaded_SubList.addField(
					'custpage_loadedsublist_checkbox', 'checkbox', 'Reconciled');
			

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
			
			
			//var testAcc = '434';
			
			nlapiLogExecution('DEBUG', 'loadResults', JSON.stringify(loadResults));
			for (var i = 0; i < loadResults.length; i++) {
				
//				if(loadArr[j].account == testAcc) {
//					continue
//				}

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
				
				
				if (loadResults[i].tranType == "Bill") {
					
					loaded_SubList.setLineItemValue('custpage_loadedsublist_travelnum', i + 1,loadResults[i].travelNum);
					
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].billPrimaryAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].billLineAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].billLineSecondary);
					
			if(loadResults[i].billLineAmt != undefined) {
				
				loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i +1 ,loadResults[i].billLineAmt );
				loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].billLinePrimary);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].billLineSecondary);
						
			}

					
				}

				if (loadResults[i].tranType == "Payment") {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].primaryAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].OGAmount);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);

				}

				if (loadResults[i].tranType == 'Journal') {
					
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].primaryAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].OGAmount);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);
					

				}

				
				if (loadResults[i].tranType == "Bill Payment") {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].primaryAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].OGAmount);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);
				}
				
				if (loadResults[i].tranType == 'Deposit') {
					
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].primaryAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].OGAmount);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);
				}
										
				
				if (loadResults[i].tranType == "Credit Memo") {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].ogTotalPayment);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].billCreditOGAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);
				}
				
				if (loadResults[i].tranType == "Bill Credit") {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].primaryAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].OGAmount);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', i + 1,loadResults[i].secondaryAmt);
				}

				if (loadResults[i].tranType == 'Invoice') {
					loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', i + 1,loadResults[i].primaryAmt);
					loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', i + 1,loadResults[i].OGAmount);
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
			
	
			var count = loaded_SubList.getLineItemCount();
			
			for(var x = 0; x<allReconChecks.length; x++) {
			if(allReconChecks[x].check_reconSession == inputSessionID) {
					
				loaded_SubList.setLineItemValue('custpage_loadedsublist_tranid',count + 1, allReconChecks[x].check_tranNum);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_trantype',count + 1, 'Check');
				loaded_SubList.setLineItemValue('custpage_loadedsublist_payee',count + 1, ' ');
				loaded_SubList.setLineItemValue('custpage_loadedsublist_trandate',count + 1, allReconChecks[x].check_tranDate);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_accountperiod', count + 1, allReconChecks[x].check_period);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_currency',count + 1, allReconChecks[x].check_currency);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_exrate',count + 1, allReconChecks[x].check_exrate);			
				loaded_SubList.setLineItemValue('custpage_loadedsublist_primary_amt', count + 1, allReconChecks[x].check_primAmount);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_og_amt', count + 1, allReconChecks[x].check_ogAmount);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_secondary_amt', count + 1, allReconChecks[x].check_secAmount);
				loaded_SubList.setLineItemValue('custpage_loadedsublist_recon_sessionid', count + 1, inputSessionID);
				
			}
		}
			


			loadForm.setScript('customscript_ilo_recon_client_scripts');
			//var all = JSON.stringify(loadResults);
			// response.write(all);
			response.writePage(loadForm);
//			}

		}
		catch(err) {
			
			nlapiLogExecution('DEBUG', 'err onLOAD', err);
			var noLoadResultsForm = nlapiCreateForm('Invalid Session');
			var noLoadDetails = noLoadResultsForm.addField('custpage_ilo_noloadresults','inlinehtml', 'no load results', null, null);
			noLoadDetails.setDefaultValue('<font size="2"><b>The session that you are trying to load is either empty, has been deleted or non-existent.<br>Please try again.</b>');
			noLoadDetails.setLayoutType('normal', 'startcol');
			response.writePage(noLoadResultsForm);
		}
		
	} 

};

function tranSearch(inpDate_from, inpDate_to, selectSubsid, selectedAcc, selectedCurrency) {
	
//	try {
		
		var search_recordIDs = [];
		var resultsArr = [];
		var multipleLines = [];
		var filters = new Array();
	
		filters[0] = new nlobjSearchFilter('subsidiary', null, 'is', selectSubsid);
		filters[1] = new nlobjSearchFilter('account', null, 'is', selectedAcc);
		filters[2] = new nlobjSearchFilter('trandate', null, 'onorafter',
				inpDate_from);
		filters[3] = new nlobjSearchFilter('trandate', null, 'onorbefore',
				inpDate_to);
		filters[4] = new nlobjSearchFilter('type', null, 'noneof', ['FxReval', 'PurchOrd', 'PurchReq', 'Transfer']);
		filters[5] = new nlobjSearchFilter('posting', null, 'is', 'T');
		//filters[6] = new nlobjSearchFilter('mainline', null, 'is', 'T');

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
		cols[12] = new nlobjSearchColumn('custcol_ilo_travel_number_column');
		cols[13] = new nlobjSearchColumn('line');
		cols[14] = new nlobjSearchColumn('custcol_ilo_recon_session_col');
		cols[15] = new nlobjSearchColumn('custbody_ilo_recon_session');


		var s = nlapiSearchRecord('transaction', null, filters, cols);

		
		for (var i = 0; i < s.length; i++) {
			
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
			
			var reconCheck = s[i].id;
			
			var reconciledChecks = s[i].getValue('transactionnumber');
			
			nlapiLogExecution('DEBUG', 'reconCheckBody', reconCheck);
			
			if((cleanRecons.contains(reconCheck) == false) && (allReconChecksArr.contains(reconciledChecks) == false)) {

			resultsArr.push({
				tranNumber : s[i].getValue('transactionnumber'),
				tranDate : s[i].getValue('trandate'),
				postingPeriod : s[i].getText('postingperiod'),
				currency : s[i].getText('currency'),
				exRate : s[i].getValue('exchangerate'),
				vendorPayee : s[i].getText('entity'),
				tranType : s[i].getText('type'),
				tranID : s[i].getValue('tranid'),
				ogTotalPayment : s[i].getValue('total'),
				recID : s[i].id,
				grossamt : s[i].getValue('grossamount'),
				signedAmt : s[i].getValue('signedamount'),
				travelNum : s[i].getText('custcol_ilo_travel_number_column'),
				lineNum : s[i].getValue('line'),
				
				
			
			});
		
		}
		}

		nlapiLogExecution("DEBUG", 'check', JSON.stringify(resultsArr));
	
		for (var j = 0; j < resultsArr.length; j++) {
			
			
			if (resultsArr[j].tranType == 'Bill') {
					resultsArr[j].billLineAmt = (parseFloat(resultsArr[j].grossamt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].billLinePrimary = (parseFloat(resultsArr[j].billLineAmt) * (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].billLineSecondary = (parseFloat(resultsArr[j].billLineAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
					resultsArr[j].travelNumber = resultsArr[j].travelNum;
					resultsArr[j].vendBillLineNum = resultsArr[j].lineNum;
	
			}

			resultsArr[j].primary_Amt = resultsArr[j].ogTotalPayment;
			

			if (resultsArr[j].tranType == 'Bill Payment') {
				resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
				resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
			}
			
			if (resultsArr[j].tranType == 'Payment') {
				resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
				resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
			}
			
			if (resultsArr[j].tranType == 'Invoice') {
				resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
				resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
				resultsArr[j].invLineNum = resultsArr[j].lineNum;
			}
			
			if (resultsArr[j].tranType == 'Credit Memo') {
				resultsArr[j].signAmt = resultsArr[j].signedAmt;
				resultsArr[j].primaryAmt = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].primaryAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
				resultsArr[j].credMemoLineNum = resultsArr[j].lineNum;
			}
			
			if (resultsArr[j].tranType == 'Bill Credit') {
				resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
				resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
			}
			

			if (resultsArr[j].tranType == 'Journal') {
				
				
				resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].primaryAmt = (parseFloat(resultsArr[j].OGAmount) * (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);	
				resultsArr[j].jeLineNumber = resultsArr[j].lineNum;
				}
				
			
			if (resultsArr[j].tranType == 'Deposit') {
				resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
			resultsArr[j].OGAmount = (parseFloat(resultsArr[j].primaryAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
			resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
				
			}
			
			if(resultsArr[j].tranType == 'Check') {

				resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
				resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt = (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
					
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
		
		var str = inputSessionID;
		var res = inputSessionID.split("/");
		var testAcc= res[1];



		var filterExpression = [

		[

		[ 'custcol_ilo_recon_session_col', 'is', inputSessionID ],

		'or',

		[ 'custbody_ilo_recon_session', 'is', inputSessionID ],

		],
		'and',
		['mainline', 'is', 'T'],
//		'and',
//		['account', 'is', '434'],


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
		cols[14] = new nlobjSearchColumn('signedamount');
		cols[15] = new nlobjSearchColumn('custcol_ilo_travel_number_column');
		cols[16] = new nlobjSearchColumn('grossamount');
		cols[17] = new nlobjSearchColumn('account');
		
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
//			if((s[i].getValue('type') != 'Check') && (s[i].getValue('account') != testAcc)){
//			
//				continue;
//			}

//			if (countInArray(load_recordIDs, s[i].id) == 1) {

				loadArr.push({
							tranNumber : s[i].getValue('transactionnumber'),
							tranDate : s[i].getValue('trandate'),
							postingPeriod : s[i].getText('postingperiod'),
							currency : s[i].getText('currency'),
							exRate : s[i].getValue('exchangerate'),
							vendorPayee : s[i].getText('entity'),
							tranType : s[i].getText('type'),
							tranID : s[i].getValue('tranid'),
							ogTotalPayment : s[i].getValue('total'),
							recID : s[i].id,
							sessionID_col : s[i].getValue('custcol_ilo_recon_session_col'),
							sessionID_body : s[i].getValue('custbody_ilo_recon_session'),
							session_memo_col : s[i].getValue('custcol_ilo_recon_memo_col'),
							session_memo_body : s[i].getValue('custbody_ilo_recon_memo'),
							signedAmt : s[i].getValue('signedamount'),
							travelNum : s[i].getText('custcol_ilo_travel_number_column'),
							grossamt : s[i].getValue('grossamount'),
							account : s[i].getValue('account'),

						});
//			}
		}

		for (var j = 0; j < loadArr.length; j++) {
			

			//
			
			
			if (loadArr[j].tranType == 'Bill') {
				loadArr[j].billLineAmt = (parseFloat(loadArr[j].ogTotalPayment) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].billLinePrimary = (parseFloat(loadArr[j].billLineAmt) * (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].billLineSecondary = (parseFloat(loadArr[j].billLineAmt) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
				loadArr[j].travelNumber = loadArr[j].travelNum;

		}

			//loadArr[j].primary_Amt = loadArr[j].ogTotalPayment;
			

			if (loadArr[j].tranType == 'Bill Payment') {
				loadArr[j].primaryAmt = loadArr[j].signedAmt;
				loadArr[j].OGAmount = (parseFloat(loadArr[j].signedAmt) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].OGAmount) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
			}
			
			if (loadArr[j].tranType == 'Payment') {
				loadArr[j].primaryAmt = loadArr[j].signedAmt;
				loadArr[j].OGAmount = (parseFloat(loadArr[j].signedAmt) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].OGAmount) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
			}
			
			
			if (loadArr[j].tranType == 'Invoice') {
	
				loadArr[j].primaryAmt = loadArr[j].ogTotalPayment;
				loadArr[j].OGAmount = (parseFloat(loadArr[j].ogTotalPayment) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].OGAmount) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);

			}
			
			if(loadArr[j].tranType == 'Credit Memo') {
				loadArr[j].primaryAmt = loadArr[j].ogTotalPayment;
				loadArr[j].billCreditOGAmt = (parseFloat(loadArr[j].ogTotalPayment) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].billCreditOGAmt) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
			}

			if (loadArr[j].tranType == 'Journal') {
				loadArr[j].OGAmount = (parseFloat(loadArr[j].signedAmt) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].primaryAmt = (parseFloat(loadArr[j].OGAmount) * (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].OGAmount) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);	
			}
			
			if (loadArr[j].tranType == 'Bill Credit') {
				loadArr[j].primaryAmt = loadArr[j].signedAmt;
				loadArr[j].OGAmount = (parseFloat(loadArr[j].signedAmt) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].OGAmount) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
			}
			
			if (loadArr[j].tranType == 'Deposit') {
				loadArr[j].primaryAmt = loadArr[j].signedAmt;
				loadArr[j].OGAmount = (parseFloat(loadArr[j].primaryAmt) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt =  (parseFloat(loadArr[j].OGAmount) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);
				
			}
			
			if(loadArr[j].tranType == 'Check') {
				loadArr[j].primaryAmt = loadArr[j].signedAmt;
				loadArr[j].OGAmount = (parseFloat(loadArr[j].signedAmt) / (parseFloat(loadArr[j].exRate))).toFixed(2);
				loadArr[j].secondaryAmt = (parseFloat(loadArr[j].OGAmount) * parseFloat(secondaryExRates[loadArr[j].recID])).toFixed(2);	
					
				}
			
			

		}

		loadResults = loadArr;
		}
		catch(err) {
			loadResults = null;
		}

	
}


function getCreditAmt(a, b, c) {
	a = 'journalentry';

	var allCr = [];
	var allDr = [];

	var creditAmt = [];
	var thisAcc;
	var credit;
	var debit;
	

	var theRec = nlapiLoadRecord(a, b);
	var lineCount = theRec.getLineItemCount('line');
	if (lineCount > 0) {
		for (var i = 1; i <= lineCount; i++) {
			thisAcc = theRec.getLineItemValue('line', 'account', i);
			thisLine = theRec.getLineItemValue('line', 'line', i);

			if (thisAcc == c) {
			
				credit = theRec.getLineItemValue('line', 'credit', i);
				if(credit == '0.00') {
				credit = null;
				
				}
				var creditAmt = pos_to_neg(credit).toFixed(2).toString();
				allCr.push({
				ogAmt: creditAmt,
				lineNum : thisLine,
				jeID : b,
				});
				debit = theRec.getLineItemValue('line', 'debit', i);
				allDr.push({
				ogAmt: debit,
					lineNum : thisLine,
					jeID : b,

				});

			}
		}
		var checkCred = allCr[0].ogAmt;
if(checkCred.indexOf('0.00') != -1) {
		return allDr;
}
else{
return allCr;
}

	}

}

function getCreditAmt_Load(a, b) {
	a = 'journalentry';

	var allCr = [];
	var allDr = [];

	var creditAmt = [];
	var thisAcc;
	var credit;
	var debit;
	

	var theRec = nlapiLoadRecord(a, b);
	var lineCount = theRec.getLineItemCount('line');
	if (lineCount > 0) {
		for (var i = 1; i <= lineCount; i++) {
			thisAcc = theRec.getLineItemValue('line', 'account', i);

			//if (thisAcc == selectedAcc) {
			
				credit = theRec.getLineItemValue('line', 'credit', i);
				if(credit == '0.00') {
				credit = null;
				
				}
				allCr.push(pos_to_neg(credit).toFixed(2).toString());
				debit = theRec.getLineItemValue('line', 'debit', i);
				allDr.push(debit);

			//}
		}
if(allCr.indexOf(null) != -1) {
		return allDr[0];
}
else{
return allCr;
}

	}


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
					
//					reconTrans.push(line.getValue('custcol_ilo_recon_session_col'));
//					if(line.getValue('custbody_ilo_recon_session') != "") {
//						reconTrans.push(line.getValue('custbody_ilo_recon_session'));
//					}
					reconTrans.push(line.getValue('internalid'));
				
					
					
				});

			};
			
			return reconTrans;

	}

function getAllReconChecks() {

	var searchReconChecks = nlapiLoadSearch(null, 'customsearch_ilo_reconciled_bank_checks');

	var allreconChecks = [];
	var reconChecks =[];
	var resultReconChecks = [];
	var searchid = 0;
	var resultset = searchReconChecks.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allreconChecks.push(resultReconChecks[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allreconChecks != null) {
				allreconChecks.forEach(function(line) {
					
					reconChecks.push({
					
						check_tranNum : line.getValue('custrecord_ilo_recon_bank_tran_num'),
						check_tranDate : line.getValue('custrecord_ilo_recon_bank_trandate'),
						check_period : line.getValue('custrecord_ilo_recon_bank_period'),
						check_exrate : line.getValue('custrecord_ilo_recon_bank_exrate'),
						check_currency : line.getValue('custrecord_ilo_recon_bank_currency'),
						check_ogAmount : line.getValue('custrecord_ilo_recon_bank_ogamount'),
						check_primAmount : line.getValue('custrecord_ilo_recon_bank_prim_amount'),
						check_secAmount : line.getValue('custrecord_ilo_recon_bank_sec_amount'),
						check_reconSession : line.getValue('custrecord_ilo_recon_bank_session_id'),
						check_memo : line.getValue('custrecord_ilo_recon_bank_memo'),


					})
				
					
					
				});

			};
			
			return reconChecks;

	}

Array.prototype.contains = function (v) {
    return this.indexOf(v) > -1;
};


function cont_tranSearch(recs,selectAccount, newJournalEntry) {
	
	
	nlapiLogExecution("DEBUG", "recs in function", recs);
			
			var search_recordIDs = [];
			var resultsArr = [];
			var multipleLines = [];
			var filters = new Array();
		
			filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', recs);
			filters[1] = new nlobjSearchFilter('posting', null, 'is', 'T');
			//filters[2] = new nlobjSearchFilter('account', null, 'anyof', selectAccount);
			//filters[3] = new nlobjSearchFilter('mainline', null, 'is', 'T');
			

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
			cols[12] = new nlobjSearchColumn('custcol_ilo_travel_number_column');
			cols[13] = new nlobjSearchColumn('line');
			cols[14] = new nlobjSearchColumn('item');
			cols[15] = new nlobjSearchColumn('account');


			var s = nlapiSearchRecord('transaction', null, filters, cols);

			
			
			for (var i = 0; i < s.length; i++) {
				

				//allRecon.contains(selectedAcc); // true

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
				
//				if((s[i].getValue('type') != 'Check' || 'Journal') && (s[i].getValue('account') != selectAccount)){
//					
//					continue;
//				}
				
				//if(allRecon.contains(selectedAcc) == false) {
				for(var k = 0; k<recsAndLines.length; k++) {
					
					
					if(s[i].id == recsAndLines[k].docID) {
						if(s[i].getValue('line') == recsAndLines[k].docLine) {
							
							
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
								travelNum : s[i].getText('custcol_ilo_travel_number_column'),
								lineNum : s[i].getValue('line'),
								
								
							
							});
							
							
							
						}
					}
				}


			
				//}
			}

			nlapiLogExecution("DEBUG", 'check', JSON.stringify(resultsArr));
			
			for (var j = 0; j < resultsArr.length; j++) {

				
				if (resultsArr[j].tranType == 'Bill') {
						resultsArr[j].billLineAmt = (parseFloat(resultsArr[j].grossamt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
						resultsArr[j].billLinePrimary = (parseFloat(resultsArr[j].billLineAmt) * (parseFloat(resultsArr[j].exRate))).toFixed(2);
						resultsArr[j].billLineSecondary = (parseFloat(resultsArr[j].billLineAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
						resultsArr[j].travelNumber = resultsArr[j].travelNum;
		
				}

				resultsArr[j].primary_Amt = resultsArr[j].ogTotalPayment;
				

				if (resultsArr[j].tranType == 'Bill Payment') {
					resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
					resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
				}
				
				if (resultsArr[j].tranType == 'Payment') {
					resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
					resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
				}
				
				if (resultsArr[j].tranType == 'Invoice') {
					resultsArr[j].signAmt = resultsArr[j].signedAmt;
					resultsArr[j].primaryAmt = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].primaryAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
					resultsArr[j].invLineNum = resultsArr[j].lineNum;
				}
				
				if (resultsArr[j].tranType == 'Credit Memo') {
					resultsArr[j].signAmt = resultsArr[j].signedAmt;
					resultsArr[j].primaryAmt = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].primaryAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
				}
				
				if (resultsArr[j].tranType == 'Bill Credit') {
					resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
					resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
				}
				

				if (resultsArr[j].tranType == 'Journal') {

					resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].primaryAmt = (parseFloat(resultsArr[j].OGAmount) * (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);	
					resultsArr[j].jeLineNumber = resultsArr[j].lineNum;
				}
				
				
				
				if (resultsArr[j].tranType == 'Deposit') {
					resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
				resultsArr[j].OGAmount = (parseFloat(resultsArr[j].primaryAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
				resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
					
				}
				
				if(resultsArr[j].tranType == 'Check') {
					resultsArr[j].primaryAmt = resultsArr[j].signedAmt;
					resultsArr[j].OGAmount = (parseFloat(resultsArr[j].signedAmt) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].secondaryAmt = (parseFloat(resultsArr[j].OGAmount) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
						
					}
				

				if(resultsArr[j].tranType == 'Bill') {
					
					resultsArr[j].billPrimaryAmt = (parseFloat(resultsArr[j].ogTotalPayment) / (parseFloat(resultsArr[j].exRate))).toFixed(2);
					resultsArr[j].secondaryAmt =  (parseFloat(resultsArr[j].billPrimaryAmt) * parseFloat(secondaryExRates[resultsArr[j].recID])).toFixed(2);
				}
				
				
			}

			searchResults = resultsArr;
//		}
//		catch(err) {
//		    searchResults = null;
//		}


	};
