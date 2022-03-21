/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Dec 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */




function saveSearchRes() {
	var all = '';
	var toSaveArr = [];
	var contactEmails = [];
	
	var allow = '';
	
	var nameTosave = nlapiGetFieldValue('custpage_results_namesave');
	var forcedNametoSave = nlapiGetFieldValue('custpage_ilo_res_title');
	var checkifLoaded = nlapiGetFieldValue('custpage_ilo_checkifbatchloaded');
	var batchLoadedID = nlapiGetFieldValue('custpage_ilo_checkifbatchloadedid');
	console.log(checkifLoaded);
	console.log(batchLoadedID);
	
	var lineCount = nlapiGetLineItemCount('custpage_results_sublist');
	
	if(lineCount == 1) {
		alert('Unable to print single invoice as batch. Please select more invoices.');
	}
	
	
	function getSelection(){
	for (var x = 0; x<lineCount; x++) {
		
		
		var s_checked = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', x +1);
		var s_tranid = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_tranid', x +1);
		var s_trantype = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trantype', x +1);
		var s_trandate = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trandate', x +1);
		var s_customerName = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_customer', x +1);
		var s_contactEmail = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_contactmail', x +1);
		var s_customerID = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_customerid', x +1);
		var s_totalAmt = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_totalamt', x +1);
		var s_totalTax = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_totaltax', x +1);
		var s_printType = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_printtype', x +1);
		var s_docID = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_docid', x +1);
		var s_getPrintType = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_printtype', x +1);

		if(s_checked == 'T' && s_contactEmail != '') {
		
		toSaveArr.push(s_docID);
		
			contactEmails.push({
			docID : s_docID,
			docName : s_tranid,
			contMail : s_contactEmail,
			customerID : s_customerID,
			customerName: s_customerName,
			printType : s_getPrintType
			
		});
				
		} //end of if(s_checked == 'T')
		
	}// end of lineCount loop
	console.log(toSaveArr);
	}
	
	
	getSelection();
	var newSavedSearch = nlapiCreateRecord('customrecord_ilo_multi_search_result');
	if(nameTosave == ''){
		nameTosave = forcedNametoSave;
	}
	newSavedSearch.setFieldValue("name", nameTosave);
	var all = JSON.stringify(toSaveArr);
	var contMails = JSON.stringify(contactEmails);
	newSavedSearch.setFieldValue("custrecord_ilo_multi_search_resarr", all);
	newSavedSearch.setFieldValue("custrecord_ilo_multi_search_contemail", contMails);
	nlapiSetFieldValue('custpage_toprintresults', all);
	nlapiSetFieldValue('custpage_tomailresults', contMails);
	nlapiSubmitRecord(newSavedSearch);
	
	
	
	return true;
	
	
	//var all = JSON.stringify(toSaveArr);
	alert('You have successfully saved these search results.');
	
	
	if(checkifLoaded != undefined) {
		getSelection();
		nlapiSubmitField('customrecord_ilo_multi_search_result', batchLoadedID, 'custrecord_ilo_multi_search_resarr', all, null);
		nlapiSubmitField('customrecord_ilo_multi_search_result', batchLoadedID, 'custrecord_ilo_multi_search_contemail', contMails, null);
		if (nameTosave == undefined) {
			nlapiSetFieldValue('custpage_results_namesave', checkifLoaded);
		}
		nlapiSetFieldValue('custpage_toprintresults', all);
		nlapiSetFieldValue('custpage_tomailresults', contMails);
		return true;
	};
	
};

