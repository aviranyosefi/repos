var toSend = [];
var toRemove = [];



function firstmail_SaveRecord(){
	
	
	var toSendLineCount = nlapiGetLineItemCount('custpage_results_sublist');
	var toRemoveLineCount = nlapiGetLineItemCount('custpage_toremove_sublist');
	
	if(toSendLineCount != 0) {
		
		for(var i = 0; i<toSendLineCount; i++) {
			
			var isCheckedtoSend = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i +1);
			
			var toSend_recID = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_internalid', i +1);
			var toSend_docNum = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_tranid', i +1);
			var toSend_date = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trandate', i +1);
			var toSend_customer = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_customer', i +1);
			var toSend_customerid = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_customerid', i +1);
			var toSend_currency = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_currency', i +1);
			var toSend_amount = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_amount', i +1);
			var toSend_subsidiary = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_subsidiary', i +1);

			
			if(isCheckedtoSend == 'T') {
				
				toSend.push({
					recID : toSend_recID,
					docNum : toSend_docNum,
					date : toSend_date,
					customer : toSend_customer,
					customerID : toSend_customerid,
					currency : toSend_currency,
					amount : toSend_amount,
					subsidiary : toSend_subsidiary,

				});
				
			}
			
			var jsonString_toSend = JSON.stringify(toSend);
			
		}//end of loop TO SEND
		
		nlapiSetFieldValue('custpage_ilo_tosend',jsonString_toSend, null, null);
		
	}//end of if (toSendLineCount != 0)
	
	if(toRemoveLineCount != 0) {
		
		for(var i = 0; i<toRemoveLineCount; i++) {
			
			var isCheckedtoRemove = nlapiGetLineItemValue('custpage_toremove_sublist', 'custpage_toremove_checkbox', i +1);
			
			var toRemove_recID = nlapiGetLineItemValue('custpage_toremove_sublist', 'custpage_toremove_internalid', i +1);
			var toRemove_docNum = nlapiGetLineItemValue('custpage_toremove_sublist', 'custpage_toremove_tranid', i +1);
			var toRemove_date = nlapiGetLineItemValue('custpage_toremove_sublist', 'custpage_toremove_trandate', i +1);
			var toRemove_customer = nlapiGetLineItemValue('custpage_toremove_sublist', 'custpage_toremove_customer', i +1);
			var toRemove_customerid = nlapiGetLineItemValue('custpage_toremove_sublist', 'custpage_toremove_customerid', i +1);
			var toRemove_currency = nlapiGetLineItemValue('custpage_toremove_sublist', 'custpage_toremove_currency', i +1);
			var toRemove_amount = nlapiGetLineItemValue('custpage_toremove_sublist', 'custpage_toremove_amount', i +1);
			var toRemove_subsidiary = nlapiGetLineItemValue('custpage_toremove_sublist', 'custpage_toremove_subsidiary', i +1);

			
			if(isCheckedtoRemove == 'T') {
				
				toRemove.push({
					recID : toRemove_recID,
					docNum : toRemove_docNum,
					date : toRemove_date,
					customer : toRemove_customer,
					customerID : toRemove_customerid,
					currency : toRemove_currency,
					amount : toRemove_amount,
					subsidiary : toRemove_subsidiary,
					
				})
				
			}
			
			var jsonString_toRemove = JSON.stringify(toRemove);
			
		}//end of loop TO REMOVE
		
		nlapiSetFieldValue('custpage_ilo_toremove',jsonString_toRemove, null, null);
		
	}//end of if (toRemoveLineCount != 0)
	

    return true;
}
