/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Jan 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */


	var journalCreated = '';

	var newJournal = '';
	var accountSelected;
	var booktypeSelected;
	var validationSelected;
	var currentTotal;
	var session_total;
	
	var currAccount;

	
function recon_client_PageInit(type){

	var getExpenseAccount = nlapiGetFieldValue('custpage_select_expaccount');
	console.log(getExpenseAccount);
	var debitTotal;
	var creditTotal;
	var credit_total = [];
	var debit_total = [];
	
	var original_total = [];
	var primary_total = [];
	var secondary_total = [];
	var sum_original;
	var sum_primary;
	var sum_secondary;

	
	 booktypeSelected = nlapiGetFieldValue('custpage_summary_booktype');
	if(booktypeSelected == 'a') {
		nlapiSetFieldValue('custpage_summary_booktype', 'Primary Book');
	}
	if(booktypeSelected == 'b') {
		nlapiSetFieldValue('custpage_summary_booktype', 'Secondary Book');
	}
	
	 validationSelected = nlapiGetFieldValue('custpage_summary_validateby');
	if(validationSelected == 'a') {
		nlapiSetFieldValue('custpage_summary_validateby', 'Original Currency');
	}
	if(validationSelected == 'b') {
		nlapiSetFieldValue('custpage_summary_validateby', 'Accounting Currency');
	}
	
	function getTotals() {


		var debitTotal;
	var creditTotal;
	var credit_total = [];
	var debit_total = [];
	
	var original_total = [];
	var primary_total = [];
	var secondary_total = [];
	var sum_original;
	var sum_primary;
	var sum_secondary;
	
	
	
	var lineCount = nlapiGetLineItemCount('custpage_results_sublist');
console.log(lineCount);


	for (var x = 1; x<=lineCount; x++) {
			
	sum_original = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_og_amt', x);
	sum_primary = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_primary_amt', x);
	sum_secondary = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_secondary_amt', x);
	
original_total.push(parseFloat(sum_original));
primary_total.push(parseFloat(sum_primary));
secondary_total.push(parseFloat(sum_secondary));
	 
 }// end of lineCount loop
	
	console.log(original_total);
	
	
		if(booktypeSelected == 'a' && validationSelected == 'a' ) { //PrimaryBook and Original Currency selected

		session_total = getTotalSum(original_total);
		for(var i = 0; i<original_total.length; i++) {
			if(original_total[i] < 0) {
				credit_total.push(original_total[i]);
			}
			if(original_total[i] > 0) {
				debit_total.push(original_total[i]);
			}
		}
		creditTotal = getTotalSum(credit_total);
		debitTotal = getTotalSum(debit_total);
		console.log('credit total = ' + creditTotal);
		console.log('debit total = ' +debitTotal);
		nlapiSetFieldValue('custpage_summary_credit_total', creditTotal.toFixed(2));
		nlapiSetFieldValue('custpage_summary_debit_total', debitTotal.toFixed(2));
	}
	
		if(booktypeSelected == 'a' && validationSelected == 'b') { //PrimaryBook and Accounting Currency selected

		session_total = getTotalSum(primary_total);
		for(var i = 0; i<primary_total.length; i++) {
			if(primary_total[i] < 0) {
				credit_total.push(primary_total[i]);
			}
			if(primary_total[i] > 0) {
				debit_total.push(primary_total[i]);
			}
		}
		creditTotal = getTotalSum(credit_total);
		debitTotal = getTotalSum(debit_total);
		console.log('credit total = ' + creditTotal);
		console.log('debit total = ' +debitTotal);
		nlapiSetFieldValue('custpage_summary_credit_total', creditTotal.toFixed(2));
		nlapiSetFieldValue('custpage_summary_debit_total', debitTotal.toFixed(2));
	}
	
	if(booktypeSelected == 'b' && validationSelected == 'b' ) { //SecondaryBook and Accounting Currency selected
		

		session_total = getTotalSum(secondary_total);
		for(var i = 0; i<secondary_total.length; i++) {
			if(secondary_total[i] < 0) {
				credit_total.push(secondary_total[i]);
			}
			if(secondary_total[i] > 0) {
				debit_total.push(secondary_total[i]);
			}
		}
		creditTotal = getTotalSum(credit_total);
		debitTotal = getTotalSum(debit_total);
		console.log('credit total = ' + creditTotal);
		console.log('debit total = ' +debitTotal);
		nlapiSetFieldValue('custpage_summary_credit_total', creditTotal.toFixed(2));
		nlapiSetFieldValue('custpage_summary_debit_total', debitTotal.toFixed(2));
	}
	
	
	
	function getTotalSum(a) {
	var selectedValidation = a;

	var total = 0;

	for ( var i = 0 ; i < selectedValidation.length ; i++ ) {
	    total = total + selectedValidation[i];
	}

	//use what you like here
	console.log("The total selectedValidation is: " + total.toFixed(2));
	return total;
}
}

getTotals();

	}


function recon_client_ValidateLine(type) {
	var valueToAdd;
	var valueToSubtract;
	
	var checked = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox');

	if(checked == 'T') {
		if(booktypeSelected == 'a' && validationSelected == 'a' ) { //PrimaryBook and Original Currency selected
			valueToAdd = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_resultssublist_og_amt');
			currentTotal = nlapiGetFieldValue('custpage_summary_total');
			nlapiSetFieldValue('custpage_summary_total', (parseFloat(currentTotal)+parseFloat(valueToAdd)).toFixed(2));
//			return true;
		}
		
		if(booktypeSelected == 'a' && validationSelected == 'b') { //PrimaryBook and Accounting Currency selected
			valueToAdd = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_resultssublist_primary_amt');
			currentTotal = nlapiGetFieldValue('custpage_summary_total');
			nlapiSetFieldValue('custpage_summary_total', (parseFloat(currentTotal)+parseFloat(valueToAdd)).toFixed(2));
//			return true;
			
		}
		
		if(booktypeSelected == 'b' && validationSelected == 'b' ) { //SecondaryBook and Accouting Currency selected
			valueToAdd = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_resultssublist_secondary_amt');
			currentTotal = nlapiGetFieldValue('custpage_summary_total');
			nlapiSetFieldValue('custpage_summary_total', (parseFloat(currentTotal)+parseFloat(valueToAdd)).toFixed(2));
//			return true;
		}
		
	}
	
	if(checked == 'F') {
		if(booktypeSelected == 'a' && validationSelected == 'a' ) { //PrimaryBook and Original Currency selected
			valueToSubtract = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_resultssublist_og_amt');
			currentTotal = nlapiGetFieldValue('custpage_summary_total');
			nlapiSetFieldValue('custpage_summary_total', (parseFloat(currentTotal)-parseFloat(valueToSubtract)).toFixed(2));
//			return true;
		}
		
		if(booktypeSelected == 'a' && validationSelected == 'b') { //PrimaryBook and Accounting Currency selected
			valueToSubtract = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_resultssublist_primary_amt');
			currentTotal = nlapiGetFieldValue('custpage_summary_total');
			nlapiSetFieldValue('custpage_summary_total', (parseFloat(currentTotal)-parseFloat(valueToSubtract)).toFixed(2));
//			return true;
			
		}
		
		if(booktypeSelected == 'b' && validationSelected == 'b' ) { //SecondaryBook and Accouting Currency selected
			valueToSubtract = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_resultssublist_secondary_amt');
			currentTotal = nlapiGetFieldValue('custpage_summary_total');
			nlapiSetFieldValue('custpage_summary_total', (parseFloat(currentTotal)-parseFloat(valueToSubtract)).toFixed(2));
//			return true;
		}
		
	}

	
//	var selectedVendPayment = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_resultssublist_recon_recid');
//	var selectedVendPaymentType = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trantype');
//	var selectedVendPaymentChecked = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox');
//	var allResultLines = nlapiGetLineItemCount('custpage_results_sublist');
//	console.log("allResultLines", allResultLines)
//	var sameVendPayments = [];
//	var sameVendPaymentsRemove = [];
//	
//	if(selectedVendPaymentType == 'Bill Payment') {
//		console.log(selectedVendPayment)
//		
//		var lineCountVendPayment = nlapiGetLineItemCount('custpage_results_sublist');
//		
//		for (var x = 0; x<=lineCountVendPayment; x++) { 
//			
//			var vp = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_recon_recid', x +1)
//			sameVendPayments.push(vp);
//		}
//	
//		for(var k = 0; k<sameVendPayments.length; k++) {
//			if(sameVendPayments[k] == selectedVendPayment) {
//				nlapiSetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', k +1, 'T');
//			}
//		}
//	}

	

return true;
}



function recon_SaveRecord(){
	
	var checkCredit = parseFloat(nlapiGetFieldValue('custpage_summary_credit_total'));
	var checkDebit = parseFloat(nlapiGetFieldValue('custpage_summary_debit_total'));
	var checkDeficit = nlapiGetFieldValue('custpage_summary_total');
	var checkLines = nlapiGetLineItemCount('custpage_results_sublist');

		if(checkLines > 0) {
		saveRecon();
		return true;
	}else{
		alert('This session is not balanced and cannot be saved.');
		   return false;
	}

 
}


function getTotalSum(a) {
	var selectedValidation = a;

	var total = 0;

	for ( var i = 0 ; i < selectedValidation.length ; i++ ) {
	    total = total + selectedValidation[i];
	}

	//use what you like here
	console.log("The total selectedValidation is: " + total.toFixed(2));
	return total;
}

function manual_recon_closure() {
	
	if(journalCreated == '' ) {
		
	var closingAmt;
	var deficitTotal;
	
	var hiddenFieldFromSuitlet = nlapiGetFieldValue('custpage_recon_data');
	var dataFromSuitelet = JSON.parse(hiddenFieldFromSuitlet);
	var getMemo = nlapiGetFieldValue('custpage_manual_recon_memo');
	if(getMemo == "") {
		alert('Please enter a memo for this Journal Entry.');
	}
	var getReconciledTotal = nlapiGetFieldValue('custpage_summary_total');
	if(getReconciledTotal == "") {
		alert('The deficit total is zero - cannot create Journal Entry.');
	}
	var getExpenseAccount = nlapiGetFieldValue('custpage_select_expaccount');
	if(getExpenseAccount == "") {
		alert('Please choose an Expense Account for this Journal Entry.');
	}
	var getCurrencyType = nlapiGetFieldValue('custpage_manual_recon_currency');
	var getAccountingBook = nlapiGetFieldValue('custpage_summary_booktype');
	var ses_total = session_total;
	if(getMemo == '') {
		alert('Please add a memo to close this reconciliation session.');
		return false;
	}
	if(getReconciledTotal == '0.00') {
		alert('This session is balanced');
		return false;	
	}else{
	console.log(dataFromSuitelet);
	var rec = nlapiCreateRecord('journalentry');
	var accountBook = '';
	if(getAccountingBook == 'Primary Book') {
		accountBook = '1';
	}
	if(getAccountingBook == 'Secondary Book') {
		accountBook = '2';
	}
	rec.setFieldValue('accountingbook', accountBook); // Setting a value for accounting book
	rec.setFieldValue('subsidiary', dataFromSuitelet[0].j_subsib);
	rec.setFieldValue('currency', getCurrencyType);
	rec.setFieldValue('memo', getMemo);
	//rec . add session id field
	rec.selectNewLineItem('line');
	closingAmt = getReconciledTotal;
	deficitTotal = parseFloat(nlapiGetFieldValue('custpage_summary_total'));
	
	if(deficitTotal < 0) {	//if deficit total is negative create the journal entry with account as credit
	rec.setCurrentLineItemValue('line', 'account',getExpenseAccount);
	console.log('closingAmt:' + closingAmt);
	closingAmt = Math.abs(closingAmt); //change from negative to positive.
	rec.setCurrentLineItemValue('line', 'debit', closingAmt);
	rec.commitLineItem('line');
	rec.selectNewLineItem('line');
	rec.setCurrentLineItemValue('line', 'account', dataFromSuitelet[0].j_account); //selected expense account from dropdown
	rec.setCurrentLineItemValue('line', 'credit', closingAmt);
	rec.commitLineItem('line');
	}
	if(deficitTotal > 0) {
	//if deficit total is positive create the journal entry with account as debit
	rec.setCurrentLineItemValue('line', 'account', dataFromSuitelet[0].j_account);
	rec.setCurrentLineItemValue('line', 'credit', closingAmt);
	rec.commitLineItem('line');
	rec.selectNewLineItem('line');
	rec.setCurrentLineItemValue('line', 'account', getExpenseAccount); //selected expense account from dropdown
	rec.setCurrentLineItemValue('line', 'debit', closingAmt);
	rec.commitLineItem('line');
	}
	var id_rec = nlapiSubmitRecord(rec);
	newJournal = id_rec;
	journalCreated = id_rec;
	alert('Journal Entry created : '+id_rec);
	
	}
	
	}else{
		alert('Journal Entry already created for this session.');
	}
}


function pos_to_neg(num)  {
	return -Math.abs(num);  
}  

function go_back() {
	var linkBack = nlapiGetFieldValue('custpage_ilo_to_back_home');
	window.location.href = linkBack;
}

function go_back_recon () {
	
	var linkBack_recon = nlapiGetFieldValue('custpage_ilo_to_back_home_recon');
	window.location.href = linkBack_recon;	
}

function saveRecon() {
	var toUpdate = [];
	var lines = nlapiGetLineItemCount('custpage_results_sublist');
	var currAccount = nlapiGetFieldValue('custpage_summary_curr_account');
	var recon_memo = nlapiGetFieldValue('custpage_summary_close_memo');
	var rec_sessionID = nlapiGetFieldValue('custpage_ilo_rec_session');
	var sesValBook = nlapiGetFieldValue('custpage_summary_booktype');
	var sesValCurrency = nlapiGetFieldValue('custpage_summary_validateby');

	for (var x = 0; x<lines; x++) {
		
		var isChecked = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', x +1);
		var doc_id = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_recon_recid', x +1);
		var doc_type = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trantype', x +1);
		var doc_lineNum = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_tran_linenum', x +1);
		//var recon_sessionID = parseFloat(nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_recon_sessionid', x +1));
		var allMarkedRec=[];

		if(isChecked == 'T') {
		
			if(doc_lineNum != "" || null || undefined) {
				if(doc_lineNum == "undefined") {
					
					doc_lineNum = '1';
				}
				
				toUpdate.push({
					
					rec_id : doc_id,
					lineNum : doc_lineNum
					
					});				
			}
				
		}; //end of if(s_checked == 'T')

	};// end of lineCount loop
	if(newJournal != '') {
		toUpdate.push({newJournal : newJournal});
	}

	toUpdate.push({
		reconSession : rec_sessionID,
		selectedAcc : currAccount,
		sessionBook : sesValBook,
		sessionValBy : sesValCurrency});


	var stringToUpdate = JSON.stringify(toUpdate);
	console.log(toUpdate);
	nlapiSetFieldValue('custpage_ilo_marked', stringToUpdate, null, null);
};

	
//	for( var i = 0; i<toUpdate.length; i++) {
//		
//
//		if(toUpdate[i].rec_type == 'Payment') { // api points - 10
//			
//			updateBodyFields('customerpayment', toUpdate[i].rec_id, toUpdate[i].recon_sessionID, toUpdate[i].recon_memo);
//		}
//		if(toUpdate[i].rec_type == 'Bill Payment') { // api points - 10
//			
//			updateBodyFields('vendorpayment',toUpdate[i].rec_id, toUpdate[i].recon_sessionID, toUpdate[i].recon_memo);
//		}
//		if(toUpdate[i].rec_type == 'Bill') { // api points - 30
//			
////	console.log(toUpdate[i].rec_id);
////	console.log(i);
//
//			var billRec = nlapiLoadRecord('vendorbill',toUpdate[i].rec_id);
//			
//			var b_lines = billRec.getLineItemCount('expense');
//			for (var j = 1; j <= b_lines; j++) {
//				thisAcc = billRec.getFieldValue('account');
//
//				//if(thisAcc == currAccount) {				
//					billRec.setLineItemValue('expense', 'custcol_ilo_recon_session_col', j, toUpdate[i].recon_sessionID);
//					billRec.setLineItemValue('expense', 'custcol_ilo_recon_check_col', j, 'T');
//					billRec.setLineItemValue('expense', 'custcol_ilo_recon_memo_col', j, toUpdate[i].recon_memo);
//					nlapiSubmitRecord(billRec);
//					
//			var v = nlapiGetContext();
//			var y = v.getRemainingUsage();
//			console.log(y);
//				//}
//			}
//			
//		}
//		
//		if(toUpdate[i].rec_type == 'Credit Memo') { // api points - 30
//			
//			
//			var credMemoRec = nlapiLoadRecord('creditmemo',toUpdate[i].rec_id);
//			var cred_lines = credMemoRec.getLineItemCount('item');
//			thisAcc = credMemoRec.getFieldValue('account');
//			for (var j = 1; j <= cred_lines; j++) {
//			
//
//				if(thisAcc == currAccount) {				
//					credMemoRec.setLineItemValue('item', 'custcol_ilo_recon_session_col', j, toUpdate[i].recon_sessionID);
//					credMemoRec.setLineItemValue('item', 'custcol_ilo_recon_check_col', j, 'T');
//					credMemoRec.setLineItemValue('item', 'custcol_ilo_recon_memo_col', j, toUpdate[i].recon_memo);
//					nlapiSubmitRecord(credMemoRec,null,true);
//					
//			var v = nlapiGetContext();
//			var y = v.getRemainingUsage();
//			console.log(y);
//				}
//			}
//			
//		}
//		
////		if(toUpdate[i].rec_type == 'Bill Credit') { // api points - 30
////			
////			
////			var vendCredRec = nlapiLoadRecord('vendorcredit',toUpdate[i].rec_id);
////			var cred_lines = vendCredRec.getLineItemCount('expense');
////			thisAcc = vendCredRec.getFieldValue('account');
////			for (var j = 1; j <= cred_lines; j++) {
////			
////
////				if(thisAcc == currAccount) {				
////					vendCredRec.setLineItemValue('expense', 'custcol_ilo_recon_session_col', j, toUpdate[i].recon_sessionID);
////					vendCredRec.setLineItemValue('expense', 'custcol_ilo_recon_check_col', j, 'T');
////					vendCredRec.setLineItemValue('expense', 'custcol_ilo_recon_memo_col', j, toUpdate[i].recon_memo);
////					nlapiSubmitRecord(vendCredRec,null,true);
////					
////			var v = nlapiGetContext();
////			var y = v.getRemainingUsage();
////			console.log(y);
////				}
////			}
////			
////		}
//		if(toUpdate[i].rec_type == 'Invoice') { // api points - 10
//			
//			var invRec = nlapiLoadRecord('invoice',toUpdate[i].rec_id);
//			var inv_lines = invRec.getLineItemCount('item');
//			for (var j = 1; j <= inv_lines; j++) {
//				thisAcc = invRec.getFieldValue('account');
//
//				if(thisAcc == currAccount) {				
//					invRec.setLineItemValue('item', 'custcol_ilo_recon_session_col', j, toUpdate[i].recon_sessionID);
//					invRec.setLineItemValue('item', 'custcol_ilo_recon_check_col', j, 'T');
//					invRec.setLineItemValue('item', 'custcol_ilo_recon_memo_col', j, toUpdate[i].recon_memo);
//					nlapiSubmitRecord(invRec,null,true);
//					
//var p = nlapiGetContext();
//var u = p.getRemainingUsage();
//console.log(u);
//			}
//		}
//	}
//
//		if(toUpdate[i].rec_type == 'Journal') {// api points - 30
//
//			var currRec = nlapiLoadRecord('journalentry',toUpdate[i].rec_id);
//			var j_lines = currRec.getLineItemCount('line');
//			for (var j = 1; j <= j_lines; j++) {
//				thisAcc = currRec.getLineItemValue('line', 'account', j);
//
//				if(thisAcc == currAccount) {				
//					currRec.setLineItemValue('line', 'custcol_ilo_recon_session_col', j, toUpdate[i].recon_sessionID);
//					currRec.setLineItemValue('line', 'custcol_ilo_recon_check_col', j, 'T');
//					currRec.setLineItemValue('line', 'custcol_ilo_recon_memo_col', j, toUpdate[i].recon_memo);
//					nlapiSubmitRecord(currRec,null,true);
//					
//var a = nlapiGetContext();
//var b = a.getRemainingUsage();
//console.log(b);
//				
//            }
//			}
//
//		}
//		
//		if(toUpdate[i].rec_type == 'Check') {// api points - 30
//
//			var currRec = nlapiLoadRecord('check',toUpdate[i].rec_id);
//			var c_lines = currRec.getLineItemCount('expense');
//			
//			
//			for (var j = 1; j <= c_lines; j++) {
//				thisAcc = currRec.getLineItemValue('expense', 'account', j);
//
//				if(thisAcc == currAccount) {				
//					currRec.setLineItemValue('expense', 'custcol_ilo_recon_session_col', j, toUpdate[i].recon_sessionID);
//					currRec.setLineItemValue('expense', 'custcol_ilo_recon_check_col', j, 'T');
//					currRec.setLineItemValue('expense', 'custcol_ilo_recon_memo_col', j, toUpdate[i].recon_memo);
//					nlapiSubmitRecord(currRec);
//					
//var r = nlapiGetContext();
//var u = r.getRemainingUsage();
//console.log(u);
//				
//            }
//			}
//
//		}
//
//		}//end of loop toUpdates
//	
//	console.log('end of updates');
//
//		
//	};
//	
//	function updateBodyFields(rec, rec_ID, session_id, recon_memo) {
//		var fields = new Array();
//		var values = new Array();
//		fields[0] = 'custbody_ilo_recon_session';
//		values[0] = session_id;
//		fields[1] = 'custbody_ilo_recon_memo';
//		values[1] = recon_memo;
//		fields[2] = 'custbody_ilo_recon_check';
//		values[2] = 'T';
//		 //update and submit vendor-level form
//		var updatefields = nlapiSubmitField(rec, rec_ID,
//				fields, values);
//		var to = nlapiGetContext();
//		var bd = to.getRemainingUsage();
//		console.log(bd);
//		}
	
	function updateBodyFields_unreconcile(rec, rec_ID, session_id, recon_memo) {
		var fields = new Array();
		var values = new Array();
		fields[0] = 'custbody_ilo_recon_session';
		values[0] = ' ';
		fields[1] = 'custbody_ilo_recon_memo';
		values[1] = ' ';
		fields[2] = 'custbody_ilo_recon_check';
		values[2] = 'F';
		 //update and submit vendor-level form
		var updatefields = nlapiSubmitField(rec, rec_ID,
				fields, values);
		var to = nlapiGetContext();
		var bd = to.getRemainingUsage();
		console.log(bd);
		}
	

	
function unreconcile() {

	
	var toUnReconcile = [];
	var unReconLines = nlapiGetLineItemCount('custpage_loaded_sublist');
	for (var j = 0; j<unReconLines; j++) {

		
		var is_unChecked = nlapiGetLineItemValue('custpage_loaded_sublist', 'custpage_loadedsublist_checkbox', j +1);
		var record_id = nlapiGetLineItemValue('custpage_loaded_sublist', 'custpage_loadedsublist_recon_recid', j +1);
		var record_type = nlapiGetLineItemValue('custpage_loaded_sublist', 'custpage_loadedsublist_trantype', j +1);
		//nlapiRemoveLineItem('custpage_loaded_sublist', j +1);
		

		if(is_unChecked == 'F') {
		
		toUnReconcile.push({
			
			checked : is_unChecked,
			rec_id : record_id,
			rec_type : record_type,
			recon_sessionID : '',
			recon_memo : ''
			
			});
		
		}; //end of if (is_unChecked == 'F')
	};// end of unReconLines loop
	console.log(toUnReconcile);
	
	for( var i = 0; i<toUnReconcile.length; i++) {
		

		if(toUnReconcile[i].rec_type == 'Payment') { // api points - 10
			
			updateBodyFields_unreconcile('customerpayment', toUnReconcile[i].rec_id, toUnReconcile[i].recon_sessionID, toUnReconcile[i].recon_memo);

		} 
		if(toUnReconcile[i].rec_type == 'Bill Payment') { // api points - 10
			
			updateBodyFields_unreconcile('vendorpayment',toUnReconcile[i].rec_id, toUnReconcile[i].recon_sessionID, toUnReconcile[i].recon_memo);

		}
		
		if(toUnReconcile[i].rec_type == 'Deposit') { // api points - 10
			
			updateBodyFields_unreconcile('deposit',toUnReconcile[i].rec_id, toUnReconcile[i].recon_sessionID, toUnReconcile[i].recon_memo);

		}
		
		
		if(toUnReconcile[i].rec_type == 'Bill') { // api points - 30
			
	
			var billRec = nlapiLoadRecord('vendorbill',toUnReconcile[i].rec_id);
			var b_lines = billRec.getLineItemCount('expense');
			for (var j = 1; j <= b_lines; j++) {

			
					billRec.setLineItemValue('expense', 'custcol_ilo_recon_session_col', j, toUnReconcile[i].recon_sessionID);
					billRec.setLineItemValue('expense', 'custcol_ilo_recon_check_col', j, 'F');
					billRec.setLineItemValue('expense', 'custcol_ilo_recon_memo_col', j, toUnReconcile[i].recon_memo);
					nlapiSubmitRecord(billRec,null,true);

			var v = nlapiGetContext();
			var y = v.getRemainingUsage();
			console.log(y);
				
			}
			
		}
		
		if(toUnReconcile[i].rec_type == 'Credit Memo') { // api points - 30
			
			
			var credMemoRec = nlapiLoadRecord('creditmemo',toUnReconcile[i].rec_id);
			var cred_lines = credMemoRec.getLineItemCount('item');
			for (var j = 1; j <= cred_lines; j++) {
			

				
					credMemoRec.setLineItemValue('item', 'custcol_ilo_recon_session_col', j, toUnReconcile[i].recon_sessionID);
					credMemoRec.setLineItemValue('item', 'custcol_ilo_recon_check_col', j, 'F');
					credMemoRec.setLineItemValue('item', 'custcol_ilo_recon_memo_col', j, toUnReconcile[i].recon_memo);
					nlapiSubmitRecord(credMemoRec,null,true);

					
			var v = nlapiGetContext();
			var y = v.getRemainingUsage();
			console.log(y);
				
			}
			
		}
		
		if(toUnReconcile[i].rec_type == 'Bill Credit') { // api points - 30
			
			
			var vendCredRec = nlapiLoadRecord('vendorcredit',toUnReconcile[i].rec_id);
			var cred_lines = vendCredRec.getLineItemCount('item');
			for (var j = 1; j <= cred_lines; j++) {
			

			
					vendCredRec.setLineItemValue('item', 'custcol_ilo_recon_session_col', j, toUnReconcile[i].recon_sessionID);
					vendCredRec.setLineItemValue('item', 'custcol_ilo_recon_check_col', j, 'F');
					vendCredRec.setLineItemValue('item', 'custcol_ilo_recon_memo_col', j, toUnReconcile[i].recon_memo);
					nlapiSubmitRecord(vendCredRec,null,true);

					
			var v = nlapiGetContext();
			var y = v.getRemainingUsage();
			console.log(y);
				
			}
			
		}
		if(toUnReconcile[i].rec_type == 'Invoice') { // api points - 30
			
			var invRec = nlapiLoadRecord('invoice',toUnReconcile[i].rec_id);
			var inv_lines = invRec.getLineItemCount('item');
			for (var j = 1; j <= inv_lines; j++) {
			
					invRec.setLineItemValue('item', 'custcol_ilo_recon_session_col', j, '');
					invRec.setLineItemValue('item', 'custcol_ilo_recon_check_col', j, 'F');
					invRec.setLineItemValue('item', 'custcol_ilo_recon_memo_col', j, '');
					nlapiSubmitRecord(invRec,null,true);
		
					
var p = nlapiGetContext();
var u = p.getRemainingUsage();
console.log(u);

		}
	}

		if(toUnReconcile[i].rec_type == 'Journal') {// api points - 30

			var currRec = nlapiLoadRecord('journalentry',toUnReconcile[i].rec_id);
			var j_lines = currRec.getLineItemCount('line');
			for (var j = 1; j <= j_lines; j++) {
			
					currRec.setLineItemValue('line', 'custcol_ilo_recon_session_col', j, toUnReconcile[i].recon_sessionID);
					currRec.setLineItemValue('line', 'custcol_ilo_recon_check_col', j, 'F');
					currRec.setLineItemValue('line', 'custcol_ilo_recon_memo_col', j, toUnReconcile[i].recon_memo);
					nlapiSubmitRecord(currRec,null,true);
				
					
var a = nlapiGetContext();
var b = a.getRemainingUsage();
console.log(b);
				
            
			}

		}
		
		if(toUnReconcile[i].rec_type == 'Check') {// api points - 30

			var currRec = nlapiLoadRecord('check',toUnReconcile[i].rec_id);
			var c_lines = currRec.getLineItemCount('expense');
			
			
			for (var j = 1; j <= c_lines; j++) {
				thisAcc = currRec.getLineItemValue('expense', 'account', j);

				//if(thisAcc == currAccount) {				
					currRec.setLineItemValue('expense', 'custcol_ilo_recon_session_col', j, toUnReconcile[i].recon_sessionID);
					currRec.setLineItemValue('expense', 'custcol_ilo_recon_check_col', j, 'F');
					currRec.setLineItemValue('expense', 'custcol_ilo_recon_memo_col', j, toUnReconcile[i].recon_memo);
					nlapiSubmitRecord(currRec);
					
var r = nlapiGetContext();
var u = r.getRemainingUsage();
console.log(u);
				
          //  }
			}

		}
		

		}//end of loop toUnReconcile
	alert('Please refresh to see updated list.');
}
	
	
