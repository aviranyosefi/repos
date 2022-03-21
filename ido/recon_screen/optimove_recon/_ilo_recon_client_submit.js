/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Mar 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function client_submit_PageInit(type){
	var getBookType = nlapiGetFieldValue('custpage_ilo_sesbook');
	var getValBy = nlapiGetFieldValue('custpage_ilo_sesvalby');
	var sesTotal;
	
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


	function getTotals() {

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


	}

	getTotals();


			if(getBookType == 'Primary Book' && getValBy == 'Original Currency' ) { //PrimaryBook and Original Currency selected

			sesTotal = getTotalSum(original_total);

			nlapiSetFieldValue('custpage_ilo_sestotal', sesTotal.toFixed(2));
		}
		
			if(getBookType == 'Primary Book' && getValBy == 'Accounting Currency' ) { //PrimaryBook and Accounting Currency selected

			sesTotal = getTotalSum(primary_total);

			nlapiSetFieldValue('custpage_ilo_sestotal', sesTotal.toFixed(2));
		}

				if(getBookType == 'Secondary Book' && getValBy == 'Accounting Currency' ) { //PrimaryBook and Accounting Currency selected

			sesTotal = getTotalSum(secondary_total);

			nlapiSetFieldValue('custpage_ilo_sestotal', sesTotal.toFixed(2));
		}
		
		function getTotalSum(a) {
		var selectedValidation = a;

		var total = 0;

		for ( var i = 0 ; i < selectedValidation.length ; i++ ) {
		    total = total + selectedValidation[i];
		}

		//use what you like here
		console.log("The total selectedValidation is: " + total.toFixed(1));
		return total;
		}
   
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function reconcileSubmit(){
	
	saveRecon();
    return true;
}




function saveRecon() {
	
	var toUpdate = [];
	var jeLineNum;
	var vendorBillLineNum;
	var invLineNum;
	var creditMemoLineNum;
	var vendCredLineNum;
	var chequeLineNum;
	var lines = nlapiGetLineItemCount('custpage_results_sublist');
	var currAccount = nlapiGetFieldValue('custpage_ilo_acc');
	var recon_memo = nlapiGetFieldValue('custpage_ilo_sesmemo');
	var rec_sessionID = nlapiGetFieldValue('custpage_ilo_ses');

	for (var x = 0; x<lines; x++) {
		
		var isChecked = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', x +1);
		var doc_id = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_recon_recid', x +1);
		var doc_type = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trantype', x +1);
		var doc_lineNum = parseInt(nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_tran_linenum', x +1));
		var allMarkedRec=[];

		if(isChecked == 'T') {
		
		toUpdate.push({
			
			rec_id : doc_id,
			rec_type : doc_type,
			recon_sessionID: rec_sessionID,
			recon_memo : recon_memo,
			rec_lineNum : doc_lineNum
			
			});

				
		}; //end of if(s_checked == 'T')

	};// end of lineCount loop

	
	for( var i = 0; i<toUpdate.length; i++) {
		console.log('in update Loop')
		

		if(toUpdate[i].rec_type == 'Payment') { // api points - 10
			
			updateBodyFields('customerpayment', toUpdate[i].rec_id, toUpdate[i].recon_sessionID, toUpdate[i].recon_memo);
		}
		if(toUpdate[i].rec_type == 'Deposit') { // api points - 10
			
			updateBodyFields('deposit', toUpdate[i].rec_id, toUpdate[i].recon_sessionID, toUpdate[i].recon_memo);
		}
		
		if(toUpdate[i].rec_type == 'Bill Payment') { // api points - 10
			console.log('in update Loop - Bill payment');
			
			updateBodyFields('vendorpayment',toUpdate[i].rec_id, toUpdate[i].recon_sessionID, toUpdate[i].recon_memo);
		}
		
		if(toUpdate[i].rec_type == 'Bill') { // api points - 30

			var billRec = nlapiLoadRecord('vendorbill',toUpdate[i].rec_id);
			console.log('in update Loop - vendor bill');
			var b_lines = billRec.getLineItemCount('expense');
			//for (var j = 1; j <= b_lines; j++) {
				//thisAcc = billRec.getFieldValue('account');
				
			vendorBillLineNum = toUpdate[i].rec_lineNum;
			if (vendorBillLineNum == '0') {
				vendorBillLineNum = '1';
			}

				//if(thisAcc == currAccount) {				
					billRec.setLineItemValue('expense', 'custcol_ilo_recon_session_col',parseInt(vendorBillLineNum), toUpdate[i].recon_sessionID);
					billRec.setLineItemValue('expense', 'custcol_ilo_recon_check_col', parseInt(vendorBillLineNum), 'T');
					billRec.setLineItemValue('expense', 'custcol_ilo_recon_memo_col', parseInt(vendorBillLineNum), toUpdate[i].recon_memo);
					nlapiSubmitRecord(billRec, true);
					
			var v = nlapiGetContext();
			var y = v.getRemainingUsage();
			console.log(y);
				//}
			//}
			
		}
		
		if(toUpdate[i].rec_type == 'Credit Memo') { // api points - 30
			
			
			var credMemoRec = nlapiLoadRecord('creditmemo',toUpdate[i].rec_id);
			var cred_lines = credMemoRec.getLineItemCount('item');
			thisAcc = credMemoRec.getFieldValue('account');
		//	for (var j = 1; j <= cred_lines; j++) {
			
			creditMemoLineNum = toUpdate[i].rec_lineNum;
			if (creditMemoLineNum == '0') {
				creditMemoLineNum = '1';
			}
			//	if(thisAcc == currAccount) {				
					credMemoRec.setLineItemValue('item', 'custcol_ilo_recon_session_col', parseInt(creditMemoLineNum), toUpdate[i].recon_sessionID);
					credMemoRec.setLineItemValue('item', 'custcol_ilo_recon_check_col', parseInt(creditMemoLineNum), 'T');
					credMemoRec.setLineItemValue('item', 'custcol_ilo_recon_memo_col', parseInt(creditMemoLineNum), toUpdate[i].recon_memo);
					nlapiSubmitRecord(credMemoRec,null,true);
					
			var v = nlapiGetContext();
			var y = v.getRemainingUsage();
			console.log(y);
			//	}
			//}
			
		}
		
		if(toUpdate[i].rec_type == 'Bill Credit') { // api points - 30
			
			console.log('in bill credit');
			var vendCredRec = nlapiLoadRecord('vendorcredit',toUpdate[i].rec_id);
			var cred_lines = vendCredRec.getLineItemCount('item');
			var vc_entity = vendCredRec.getFieldValue('entityname');
			var vc_tranNum = vendCredRec.getFieldValue('transactionnumber');
			var hasRefNum = vendCredRec.getFieldValue('tranid');
			if(hasRefNum == null) {
				alert('Warning. This bill credit -'+vc_tranNum+' '+vc_entity+' ' +'-reflects the withholding tax amount for the associated bill.\nEditing is not allowed for this transaction. For more information contact yout Netsuite Administrator.') ;
				continue;
			}
//			for (var j = 1; j <= cred_lines; j++) {
			
			vendCredLineNum = toUpdate[i].rec_lineNum;
			if (vendCredLineNum == '0') {
				vendCredLineNum = '1';
			}
			//	if(thisAcc == currAccount) {				
					vendCredRec.setLineItemValue('item', 'custcol_ilo_recon_session_col', parseInt(vendCredLineNum), toUpdate[i].recon_sessionID);
					vendCredRec.setLineItemValue('item', 'custcol_ilo_recon_check_col', parseInt(vendCredLineNum), 'T');
					vendCredRec.setLineItemValue('item', 'custcol_ilo_recon_memo_col', parseInt(vendCredLineNum), toUpdate[i].recon_memo);
					nlapiSubmitRecord(vendCredRec,null,true);
					
			var v = nlapiGetContext();
			var y = v.getRemainingUsage();
			console.log(y);
		//		}
			//}
			
		}
		if(toUpdate[i].rec_type == 'Invoice') { // api points - 10
			
			var invRec = nlapiLoadRecord('invoice',toUpdate[i].rec_id);
			var inv_lines = invRec.getLineItemCount('item');
		//	for (var j = 1; j <= inv_lines; j++) {
			invLineNum = toUpdate[i].rec_lineNum;
			if (invLineNum == '0') {
				invLineNum = '1';
			}

				//if(thisAcc == currAccount) {				
					invRec.setLineItemValue('item', 'custcol_ilo_recon_session_col', parseInt(invLineNum), toUpdate[i].recon_sessionID);
					invRec.setLineItemValue('item', 'custcol_ilo_recon_check_col', parseInt(invLineNum), 'T');
					invRec.setLineItemValue('item', 'custcol_ilo_recon_memo_col', parseInt(invLineNum), toUpdate[i].recon_memo);
					nlapiSubmitRecord(invRec);
					
var p = nlapiGetContext();
var u = p.getRemainingUsage();
console.log(u);
			//}
	//	}
	}

		if(toUpdate[i].rec_type == 'Journal') {// api points - 30

			console.log('here');
			var currRec = nlapiLoadRecord('journalentry',toUpdate[i].rec_id);
			var j_lines = currRec.getLineItemCount('line');
			jeLineNum = toUpdate[i].rec_lineNum;
//			if (jeLineNum == '0') {
//				jeLineNum = '1';
//			}
			for (var j = 1; j <= j_lines; j++) {
			thisAcc = currRec.getLineItemValue('line', 'account', j);

				if(thisAcc == currAccount) {				
					currRec.setLineItemValue('line', 'custcol_ilo_recon_session_col',j, toUpdate[i].recon_sessionID);
					currRec.setLineItemValue('line', 'custcol_ilo_recon_check_col', j, 'T');
					currRec.setLineItemValue('line', 'custcol_ilo_recon_memo_col', j, toUpdate[i].recon_memo);
					nlapiSubmitRecord(currRec);
				}
					
var a = nlapiGetContext();
var b = a.getRemainingUsage();
console.log(b);
				
            }
//			}

		}
		
		if(toUpdate[i].rec_type == 'Check') {// api points - 30

			var currRec = nlapiLoadRecord('check',toUpdate[i].rec_id);
			
			currRec.setFieldValue('entity', '2284') //recon check vendor  //2238 for sandbox
			
			var c_lines = currRec.getLineItemCount('expense');
			
			
			chequeLineNum = toUpdate[i].rec_lineNum;
			if (chequeLineNum == '0') {
				chequeLineNum = '1';
			}

				//if(thisAcc == currAccount) {				
					currRec.setLineItemValue('expense', 'custcol_ilo_recon_session_col', parseInt(chequeLineNum), toUpdate[i].recon_sessionID);
					currRec.setLineItemValue('expense', 'custcol_ilo_recon_check_col', parseInt(chequeLineNum), 'T');
					currRec.setLineItemValue('expense', 'custcol_ilo_recon_memo_col', parseInt(chequeLineNum), toUpdate[i].recon_memo);
					nlapiSubmitRecord(currRec);
					
var r = nlapiGetContext();
var u = r.getRemainingUsage();
console.log(u);
				
         //   }
		//	}

		}

		}//end of loop toUpdates
	
	console.log('end of updates');

		
	};
	
	function updateBodyFields(rec, rec_ID, session_id, recon_memo) {
		var fields = new Array();
		var values = new Array();
		fields[0] = 'custbody_ilo_recon_session';
		values[0] = session_id;
		fields[1] = 'custbody_ilo_recon_memo';
		values[1] = recon_memo;
		fields[2] = 'custbody_ilo_recon_check';
		values[2] = 'T';
		 //update and submit vendor-level form
		var updatefields = nlapiSubmitField(rec, rec_ID,
				fields, values);
		var to = nlapiGetContext();
		var bd = to.getRemainingUsage();
		console.log(bd);
		}