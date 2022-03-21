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
		
		
		var allPeriods = [];
		var getPeriod = [];

		var searchmulti = nlapiLoadSearch(null, 'customsearch_ilo_posting_period_search');
		var resultsmulti = [];
		var searchid = 0;
		var resultset = searchmulti.runSearch();
		var rs;

		do {
		    var resultslice = resultset.getResults(searchid, searchid + 1000);
		    for (rs in resultslice) {
		        
				allPeriods.push(resultsmulti[resultslice[rs].id] = resultslice[rs]);
		        searchid++;
		    }
		} while (resultslice.length >= 1000);

				if (allPeriods != null) {
					allPeriods.forEach(function(line) {
						
						getPeriod[line.getValue('internalid')] = line.getValue('periodname');
						
					});

				};
				
				



var currIndex;


var recoveryIDrec = nlapiSearchRecord('customrecord_ilo_recon_recovery_point');
var recoveryID = recoveryIDrec[0].id;


function client_submit_PageInit(type){
	
	fromReload();
	
	
	
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
		

		if(getBookType == 'Primary Book' && getValBy == 'Original Currency' ) { //PrimaryBook and Original Currency selected

		sesTotal = getTotalSum(original_total);

		nlapiSetFieldValue('custpage_ilo_sestotal', sesTotal.toFixed(2));
	}
	
		if(getBookType == 'Primary Book' && getValBy == 'Accounting Currency' ) { //PrimaryBook and Accounting Currency selected

		sesTotal = getTotalSum(primary_total);

		nlapiSetFieldValue('custpage_ilo_sestotal', sesTotal.toFixed(2));
	}

			if(getBookType == 'Local Book' && getValBy == 'Accounting Currency' ) { //PrimaryBook and Accounting Currency selected

		sesTotal = getTotalSum(secondary_total);

		nlapiSetFieldValue('custpage_ilo_sestotal', sesTotal.toFixed(2));
	}

	}

	getTotals();


		
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
		
		
		
function fromReload() {
	var letsCheck = checkReload();
	console.log(letsCheck);


	   if(letsCheck.custrecord_ilo_recon_return != 'return') {
		   console.log('no return');
	   }
	   else{
		   
		   currIndex = parseInt(letsCheck.custrecord_ilo_recovery_point);
		   
		   nlapiSetFieldValue('custpage_ilo_sesmemo', letsCheck.custrecord_ilo_recon_memo_return);
		   

		   setTimeout(function(){   saveRecon(currIndex); }, 2000);
		 
		   
		   
	   }
}
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function reconcileSubmit(){
	
	saveRecon(currIndex);
    return true;
}




function saveRecon(currIndex) {
	
try{
   
	console.log(currIndex);
	
	if(currIndex == undefined) {
		currIndex = 0;
	}

	

	
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

				
		}; //end of if(isChecked == 'T')

	};// end of lineCount loop

	console.log('outside loop : ' +toUpdate.length);
	
	for( var i = currIndex; i<=toUpdate.length; i++) {
		console.log('in update Loop');
		
		
		
		
		if(toUpdate[i].rec_type == undefined || null || '') {
			console.log('got to end');
			nlapiSetFieldValue('custpage_ilo_finish', 'finish', null, null);
			break;
		}
		
		var v = nlapiGetContext();
		var y = v.getRemainingUsage();

		var currentIndex;

		

		if(toUpdate[i].rec_type == 'Payment') { // api points - 10
			
			updateBodyFields('customerpayment', toUpdate[i].rec_id, toUpdate[i].recon_sessionID, toUpdate[i].recon_memo);
			var v = nlapiGetContext();
			var y = v.getRemainingUsage();
		
			currentIndex = i;
			
		}
		if(toUpdate[i].rec_type == 'Deposit') { // api points - 10
			
			updateBodyFields('deposit', toUpdate[i].rec_id, toUpdate[i].recon_sessionID, toUpdate[i].recon_memo);
			var v = nlapiGetContext();
			var y = v.getRemainingUsage();
			
		
		}
		if(toUpdate[i].rec_type == 'Bill Payment') { // api points - 10
			console.log('in update Loop - Bill payment');
			
			updateBodyFields('vendorpayment',toUpdate[i].rec_id, toUpdate[i].recon_sessionID, toUpdate[i].recon_memo);
			var v = nlapiGetContext();
			var y = v.getRemainingUsage();
			
			currentIndex = i;
		}
		
		if(toUpdate[i].rec_type == 'Bill') { // api points - 30
			
			try {
				var billRec = nlapiLoadRecord('vendorbill',toUpdate[i].rec_id);
				console.log('in update Loop - vendor bill');
				var b_lines = billRec.getLineItemCount('item');
				//for (var j = 1; j <= b_lines; j++) {
					//thisAcc = billRec.getFieldValue('account');
					
				vendorBillLineNum = toUpdate[i].rec_lineNum;
				if (vendorBillLineNum == '0') {
					vendorBillLineNum = '1';
				}

					//if(thisAcc == currAccount) {				
						billRec.setLineItemValue('item', 'custcol_ilo_recon_session_col',parseInt(vendorBillLineNum), toUpdate[i].recon_sessionID);
						billRec.setLineItemValue('item', 'custcol_ilo_recon_check_col', parseInt(vendorBillLineNum), 'T');
						billRec.setLineItemValue('item', 'custcol_ilo_recon_memo_col', parseInt(vendorBillLineNum), toUpdate[i].recon_memo);
						nlapiSubmitRecord(billRec, null,true);
						
				var v = nlapiGetContext();
				var y = v.getRemainingUsage();
				currentIndex = i;
			
					//}
				//}
			}
			catch(err) {
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
						nlapiSubmitRecord(billRec, null,true);
						
				var v = nlapiGetContext();
				var y = v.getRemainingUsage();
				currentIndex = i;
				
					//}
				//}
			}


			
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
			currentIndex = i;
	
			//	}
			//}
			
		}
		
		if(toUpdate[i].rec_type == 'Bill Credit') { // api points - 30
			
			try {
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
//				for (var j = 1; j <= cred_lines; j++) {
				
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
				currentIndex = i;
		
			//		}
				//}
			}
			catch(err) {
				console.log('in bill credit');
				var vendCredRec = nlapiLoadRecord('vendorcredit',toUpdate[i].rec_id);
				var cred_lines = vendCredRec.getLineItemCount('expense');
				var vc_entity = vendCredRec.getFieldValue('entityname');
				var vc_tranNum = vendCredRec.getFieldValue('transactionnumber');
				var hasRefNum = vendCredRec.getFieldValue('tranid');
				if(hasRefNum == null) {
					alert('Warning. This bill credit -'+vc_tranNum+' '+vc_entity+' ' +'-reflects the withholding tax amount for the associated bill.\nEditing is not allowed for this transaction. For more information contact yout Netsuite Administrator.') ;
					continue;
				}
//				for (var j = 1; j <= cred_lines; j++) {
				
				vendCredLineNum = toUpdate[i].rec_lineNum;
				if (vendCredLineNum == '0') {
					vendCredLineNum = '1';
				}
				//	if(thisAcc == currAccount) {				
						vendCredRec.setLineItemValue('expense', 'custcol_ilo_recon_session_col', parseInt(vendCredLineNum), toUpdate[i].recon_sessionID);
						vendCredRec.setLineItemValue('expense', 'custcol_ilo_recon_check_col', parseInt(vendCredLineNum), 'T');
						vendCredRec.setLineItemValue('expense', 'custcol_ilo_recon_memo_col', parseInt(vendCredLineNum), toUpdate[i].recon_memo);
						nlapiSubmitRecord(vendCredRec,null,true);
						
				var v = nlapiGetContext();
				var y = v.getRemainingUsage();
				currentIndex = i;
	
			//		}
				//}
			}
			

			
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
currentIndex = i;
			//}
	//	}
	}

		if(toUpdate[i].rec_type == 'Journal') {// api points - 30

			console.log('here');
			var currRec = nlapiLoadRecord('journalentry',toUpdate[i].rec_id);
			var j_lines = currRec.getLineItemCount('line');
//			jeLineNum = toUpdate[i].rec_lineNum;
//			if (jeLineNum == '0') {
//				jeLineNum = parseInt(jeLineNum)+1;
//			}
//			if (jeLineNum != '0') {
//				jeLineNum = parseInt(jeLineNum)+1;
//			}
			console.log('current account in journal ' + currAccount);
			for (var j = 1; j <= j_lines; j++) {
			thisAcc = currRec.getLineItemValue('line', 'account', j);

				if(thisAcc == currAccount) {				
					currRec.setLineItemValue('line', 'custcol_ilo_recon_session_col', j, toUpdate[i].recon_sessionID);
					currRec.setLineItemValue('line', 'custcol_ilo_recon_check_col', j, 'T');
					currRec.setLineItemValue('line', 'custcol_ilo_recon_memo_col', j, toUpdate[i].recon_memo);
					nlapiSubmitRecord(currRec);
				}
					
var a = nlapiGetContext();
var b = a.getRemainingUsage();
currentIndex = i;

				
            }
//			}

		}
		
		if(toUpdate[i].rec_type == 'Check') {// api points - 30
			
			var currencies = {
					
					1 : 'USD',
					2 : 'GBP',
					4 : 'EUR',
					5 : 'ILS',
			};
			//currently only currencies of optimove;
			
			
			

			var getCheck = nlapiLoadRecord('check',toUpdate[i].rec_id);
			var c_tranNumber = getCheck.getFieldValue('transactionnumber');
			var c_tranDate = getCheck.getFieldValue('trandate');
			var c_period = getCheck.getFieldValue('postingperiod');
			var c_exrate = getCheck.getFieldValue('exchangerate');
			var c_currency = getCheck.getFieldValue('currency');
			var c_ogAmount = getCheck.getFieldValue('usertotal');
			
			var c_primaryAmt = (parseFloat(c_ogAmount) / (parseFloat(c_exrate))).toFixed(2);
			var c_secondaryAmt = (parseFloat(c_ogAmount) * parseFloat(secondaryExRates[toUpdate[i].rec_id])).toFixed(2);
			
			

			var bankCheck = nlapiCreateRecord('customrecord_ilo_recon_bank_check');
			bankCheck.setFieldValue('custrecord_ilo_recon_bank_tran_num', c_tranNumber);
			bankCheck.setFieldValue('custrecord_ilo_recon_bank_trandate', c_tranDate);
			bankCheck.setFieldValue('custrecord_ilo_recon_bank_period', getPeriod[c_period]);
			bankCheck.setFieldValue('custrecord_ilo_recon_bank_exrate', c_exrate);
			bankCheck.setFieldValue('custrecord_ilo_recon_bank_currency', currencies[c_currency]);
			bankCheck.setFieldValue('custrecord_ilo_recon_bank_ogamount', c_ogAmount);
			bankCheck.setFieldValue('custrecord_ilo_recon_bank_prim_amount', c_primaryAmt);
			bankCheck.setFieldValue('custrecord_ilo_recon_bank_sec_amount', c_secondaryAmt);
			bankCheck.setFieldValue('custrecord_ilo_recon_bank_memo', toUpdate[i].recon_memo);
			bankCheck.setFieldValue('custrecord_ilo_recon_bank_session_id',toUpdate[i].recon_sessionID);
												
			nlapiSubmitRecord(bankCheck);
			
		}
		
		var a = nlapiGetContext();
		var currUsage = a.getRemainingUsage();
		console.log(currUsage);
		
		if(currUsage < 100) {
			
			var getMemo = nlapiGetFieldValue('custpage_ilo_sesmemo');
			toUpdate.push({end : 'end'});
			
//			console.log(currUsage);
			
			var recoveryRec = nlapiLoadRecord("customrecord_ilo_recon_recovery_point", recoveryID);
			recoveryRec.setFieldValue('custrecord_ilo_recovery_point', currentIndex);//recovery number
			recoveryRec.setFieldValue('custrecord_ilo_recon_curr_session',JSON.stringify(toUpdate));//recovery(all-data)
			recoveryRec.setFieldValue('custrecord_ilo_recon_return', 'return');
			recoveryRec.setFieldValue('custrecord_ilo_recon_length', JSON.stringify(toUpdate.length));
			recoveryRec.setFieldValue('custrecord_ilo_recon_memo_return', getMemo);
			nlapiSubmitRecord(recoveryRec);
			
			win_reload();
			break;
	
		}
		
		var upLength = nlapiLookupField('customrecord_ilo_recon_recovery_point', recoveryID, 'custrecord_ilo_recon_length');
		//var iString = currentIndex.toString();
		
		
		//console.log(iString);
		console.log(upLength);
		
		var checkEnd = JSON.stringify(toUpdate[i].end);
		var checkCurr = JSON.stringify(toUpdate[i]);

		
		console.log('this is the current i : ' +checkCurr);
		console.log('check end : ' + checkEnd );

//		
		}//end of loop toUpdates

	
	console.log('end of updates');
}
	catch(err) {
		console.log('got to the end');
		alert(JSON.stringify(err))

		alert('Reconciliation Complete for session : ' +rec_sessionID);
		nlapiSetFieldValue('custpage_ilo_finish', 'finish', null, null);
		
		if(window.onbeforeunload) {
			window.onbeforeunload = function() { null;};
		}
		location.href = 'https://system.eu1.netsuite.com/app/site/hosting/scriptlet.nl?script=246&deploy=1';
		
		
	}
		
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
		
		}
	
	
	
	function checkReload() {
		

	var check = nlapiLookupField('customrecord_ilo_recon_recovery_point', recoveryID, ['custrecord_ilo_recon_return','custrecord_ilo_recovery_point','custrecord_ilo_recon_memo_return']);
		
		return check;
		
	}
	
	function win_reload() {
		console.log('win_reload');
		if(window.onbeforeunload) {
			window.onbeforeunload = function() { null;};
		}
		for(var j = 0; j<50000; j++) {
			
		}
		
		location.reload();

		
	}