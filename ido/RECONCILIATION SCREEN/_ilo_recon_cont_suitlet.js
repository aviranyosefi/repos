     var recsAndLines = [];
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
		
var newJournalEntry;		
var reconSes;
var selectAccount;

var selectedBook;
var selectedValBy;

var linenumbers = [];

var searchResults;
var allRecon = 	getAllRecons();

function cc_recon_cont(request, response){
	
	   if(request.getMethod() == "GET")

	   {

		      //Get Item from parameter

		     var dataFromRecon = request.getParameter("item");
		     
		     var dataArr = JSON.parse(dataFromRecon);
		     
		     nlapiLogExecution("DEBUG", 'dataFromRecon-50', dataFromRecon);
		     
//		      var file = nlapiLoadFile('20435');
//		      var content = file.getValue();
//		      
//		      nlapiLogExecution("DEBUG", 'contents-file', content);
		     
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
	     
	     var recsToRecon = [];
	     
	     if(dataFromRecon != null) {
	    	 
	    	 for(var x = 0; x<recsAndLines.length; x++) {
	    		 
	    		 if(recsAndLines[x].docLine == undefined) {
	    			 recsAndLines[x].docLine = '0';
	    		 }
	    		 
	    		 recsToRecon.push(recsAndLines[x].docID);
	    	 }
	    	 
	    	 nlapiLogExecution("DEBUG", "recsToRecon", JSON.stringify(recsToRecon));
	     
			tranSearch(recsToRecon, selectAccount, newJournalEntry);
	     }
	     
			// RESULTS SUBLIST
			var resultsSubList = reconForm
					.addSubList('custpage_results_sublist', 'list',
							'Results', null);
			resultsSubList.addMarkAllButtons();

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
	   else{
		   
		  
		   var finalForm = nlapiCreateForm("Account Reconciled");
		   response.writePage(finalForm);
	   }

}


function tranSearch(recs,selectAccount, newJournalEntry) {
	
	
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
			
//			if((s[i].getValue('type') != 'Check' || 'Journal') && (s[i].getValue('account') != selectAccount)){
//				
//				continue;
//			}
			
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
//	}
//	catch(err) {
//	    searchResults = null;
//	}


};


function getCreditAmt(a, b) {
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

			if (thisAcc == selectAccount) {
			
				credit = theRec.getLineItemValue('line', 'credit', i);
				if(credit == '0.00') {
				credit = null;
				
				}
				allCr.push(pos_to_neg(credit).toFixed(2).toString());
				debit = theRec.getLineItemValue('line', 'debit', i);
				allDr.push(debit);

			}
		}
if(allCr.indexOf('0.00') != -1) {
		return allDr;
}
else{
return allCr;
}

	}


}


function pos_to_neg(num) {
	return -Math.abs(num);
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
					
					reconTrans.push(line.getValue('account'));
					
				});

			};
			
			return reconTrans;

	}