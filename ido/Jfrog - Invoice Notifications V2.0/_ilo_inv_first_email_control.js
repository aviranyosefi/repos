/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Jul 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

var clickURL = 'https://system.eu2.netsuite.com/app/accounting/transactions/custinvc.nl?id='

function inv_batch_firstmail(request, response){
	
	if (request.getMethod() == 'GET') {
	
	var form = nlapiCreateForm('Send First Email Batch');
	form.addSubmitButton('Continue');
	
	var searchFilterGroup = form.addFieldGroup('custpage_search_group','Filters');
	
	
	var selectDateFrom = form.addField('custpage_select_datefrom','date','From', 'Date', 'custpage_search_group');
	selectDateFrom.setMandatory( true );
	var selectDateTo = form.addField('custpage_select_dateto','date', 'To', 'Date', 'custpage_search_group');
	selectDateTo.setMandatory( true );
	var selectSubsidiary = form.addField('custpage_select_subsidiary','select', 'Subsidary', 'SUBSIDIARY', 'custpage_search_group');
	var selectCreatedBy = form.addField('custpage_select_createdby','select', 'Created By', 'EMPLOYEE', 'custpage_search_group');
	var selectFinanceRep = 	form.addField('custpage_select_financerep', 'select', 'Finance Rep.','636', 'custpage_search_group');
	
	var ticketInvoice = form.addField('custpage_ticket_invoice','checkbox', 'Only Ticket Invoices', 'custpage_search_group');

	
	//field to send to next stage;
	var toNextPage = form.addField('custpage_ilo_tonextpage','text', 'tosend');
	toNextPage.setDefaultValue('next');
	toNextPage.setDisplayType('hidden');

	response.writePage(form);

	}//end of first if
	
	else if (request.getParameter('custpage_ilo_end') == 'end'){
		
		var endForm = nlapiCreateForm('END');
		
		var finalSend = request.getParameter('custpage_ilo_end_send');
		var finalRemove = request.getParameter('custpage_ilo_end_remove');
		
		var end_send = [];
		var end_remove = [];
		
		nlapiLogExecution('DEBUG', 'finalSend', finalSend)
			nlapiLogExecution('DEBUG', 'finalRemove', finalRemove)
		
		var jobObj_email = JSON.parse(finalSend);
		var jobObj_remove = JSON.parse(finalRemove);
		
		for(var i = 0; i<jobObj_email.length; i++) {
			
			end_send.push({
				rec_id : jobObj_email[i].recID,
				subsid : jobObj_email[i].subsidiary,
			})
		}
		
		for(var x = 0; x<jobObj_remove.length; x++) {
			
			end_remove.push({
				rec_id : jobObj_remove[x].recID,
			})
		}
		
		var email_data = JSON.stringify(end_send);
		var remove_data = JSON.stringify(end_remove);
		
		var newEmailJob = nlapiCreateRecord('customrecord_ilo_firstmail_batch_job');
		newEmailJob.setFieldValue('name', getTodaysDate() + ' - Emails To Send');
		newEmailJob.setFieldValue('custrecord_ilo_email_data_array', email_data);
		newEmailJob.setFieldValue('custrecord_ilo_remove_data_array', remove_data);
		var jobID = nlapiSubmitRecord(newEmailJob);
		
		nlapiScheduleScript('customscript_ilo_inv_firstmail_batch_ss', 'customdeploy_ilo_firstmail_batch_ss_dep', {custscript_ilo_ss_data_id: jobID});

		
		response.writePage(endForm);
	}// end of last elseif
	
	else if(request.getParameter('custpage_ilo_tonextpage') == 'next') {
		
		
		
		var getDateFrom = request.getParameter('custpage_select_datefrom');
		var getDateTo = request.getParameter('custpage_select_dateto');
		var getSubsidiary = request.getParameter('custpage_select_subsidiary');
		var getCreatedBy = request.getParameter('custpage_select_createdby');
		var financeRep = request.getParameter('custpage_select_financerep')
		
		var invoiceTickets = request.getParameter('custpage_ticket_invoice');
				
		
		var resultsForm = nlapiCreateForm('Send First Email Batch');
		resultsForm.addSubmitButton('Next');
		
		
		//hidden resource fields
		var toSendField = resultsForm.addField('custpage_ilo_tosend','longtext', 'tosend');
		toSendField.setDisplayType('hidden');
		var toRemoveField = resultsForm.addField('custpage_ilo_toremove','longtext', 'toremove');
		toRemoveField.setDisplayType('hidden');
		

		
//		 var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove
//				 ', 'startrow');
//				  htmlHeader
//				  .setDefaultValue("<p style='font-size:20px'>We pride ourselves on providing the best
//				  services and customer satisfaction. Please take a moment to fill out our survey.</
//				 p><br><br>");

		
	
		// To Send SUBLIST
		var resultsSubList = resultsForm
				.addSubList('custpage_results_sublist', 'list',
						'To Send', null);
		 resultsSubList.addMarkAllButtons();

		var res_CheckBox_toSend = resultsSubList.addField(
				'custpage_resultssublist_checkbox', 'checkbox', 'Send Email');
		
		var res_InternalID = resultsSubList.addField(
				'custpage_resultssublist_internalid', 'text',
				'Internal Id');
		res_InternalID.setDisplayType('hidden');
		
		var res_TranDate = resultsSubList.addField(
				'custpage_resultssublist_trandate', 'date',
				'Transaction Date');
		
		var res_AccPeriod = resultsSubList.addField(
				'custpage_resultssublist_accountperiod', 'text',
				'Posting Period');

		var res_TranId_view = resultsSubList.addField(
				'custpage_resultssublist_view', 'url',
				' ').setLinkText('View');
		
		var res_TranId = resultsSubList.addField(
				'custpage_resultssublist_tranid', 'text',
				'Transaction Number');
		
		var res_Customer = resultsSubList.addField(
				'custpage_resultssublist_customer', 'text', 'Customer');

		var res_Customer_ID = resultsSubList.addField(
				'custpage_resultssublist_customerid', 'text', 'Customer ID');
		
		var res_Subsidiary = resultsSubList.addField(
				'custpage_resultssublist_subsidiary', 'text', 'Subsidiary');

		var res_PrintName = resultsSubList.addField(
				'custpage_resultssublist_printname', 'text', 'Print Name');

		var res_PrintEmail = resultsSubList.addField(
				'custpage_resultssublist_printemail', 'text', 'Print Email');

		var res_Currency = resultsSubList.addField(
				'custpage_resultssublist_currency', 'text', 'Currency');

		var res_Amount = resultsSubList.addField(
				'custpage_resultssublist_amount', 'text', 'Amount');
		
		var res_CreatedBy = resultsSubList.addField(
				'custpage_resultssublist_createdby', 'text', 'Created By');
		
		
		// To Mark as Sent(Remove) SUBLIST
		var toremoveSubList = resultsForm
				.addSubList('custpage_toremove_sublist', 'list',
						'Mark as Sent', null);
		toremoveSubList.addMarkAllButtons();
		
		var rem_Alert = toremoveSubList.addField('custpage_toremove_alert', 'text', 'Alert');
		rem_Alert.setDefaultValue('You are removing transaction from list.');

		var rem_CheckBox_toRemove = toremoveSubList.addField(
				'custpage_toremove_checkbox', 'checkbox', 'Mark as Sent');

		
		var rem_InternalID = toremoveSubList.addField(
				'custpage_toremove_internalid', 'text',
				'Internal Id');
		rem_InternalID.setDisplayType('hidden');
		
		var rem_TranDate = toremoveSubList.addField(
				'custpage_toremove_trandate', 'date',
				'Transaction Date');
		
		var rem_AccPeriod = toremoveSubList.addField(
				'custpage_toremove_accountperiod', 'text',
				'Posting Period');
		
		var rem_TranId_view = toremoveSubList.addField(
				'custpage_toremove_view', 'url',
				' ').setLinkText('View');

		var rem_TranId = toremoveSubList.addField(
				'custpage_toremove_tranid', 'text',
				'Transaction Number');
		
		var rem_Customer = toremoveSubList.addField(
				'custpage_toremove_customer', 'text', 'Customer');

		var rem_Customer_ID = toremoveSubList.addField(
				'custpage_toremove_customerid', 'text', 'Customer ID');
		
		var rem_Subsidiary = toremoveSubList.addField(
				'custpage_toremove_subsidiary', 'text', 'Subsidiary');

		var rem_PrintName = toremoveSubList.addField(
				'custpage_toremove_printname', 'text', 'Print Name');

		var rem_PrintEmail = toremoveSubList.addField(
				'custpage_toremove_printemail', 'text', 'Print Email');

		var rem_Currency = toremoveSubList.addField(
				'custpage_toremove_currency', 'text', 'Currency');

		var rem_Amount = toremoveSubList.addField(
				'custpage_toremove_amount', 'text', 'Amount');
		
		var rem_CreatedBy = toremoveSubList.addField(
				'custpage_toremove_createdby', 'text', 'Created By');
		
		
		var getResults = getSelection(getDateTo, getDateFrom, getSubsidiary, getCreatedBy, invoiceTickets, financeRep);
		
		for (var i = 0; i < getResults.length; i++) {
			
			resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i + 1,getResults[i].date);
			resultsSubList.setLineItemValue('custpage_resultssublist_view', i + 1, clickURL+getResults[i].internalid);
			resultsSubList.setLineItemValue('custpage_resultssublist_tranid', i + 1, getResults[i].doc_num);
			resultsSubList.setLineItemValue('custpage_resultssublist_customer', i + 1,getResults[i].customer);
			resultsSubList.setLineItemValue('custpage_resultssublist_customerid', i + 1,getResults[i].customer_id);
			resultsSubList.setLineItemValue('custpage_resultssublist_accountperiod', i + 1,getResults[i].period);
			resultsSubList.setLineItemValue('custpage_resultssublist_currency', i + 1,getResults[i].currency);
			resultsSubList.setLineItemValue('custpage_resultssublist_amount', i + 1,getResults[i].amount);
			resultsSubList.setLineItemValue('custpage_resultssublist_createdby', i + 1,getResults[i].created_by);
			resultsSubList.setLineItemValue('custpage_resultssublist_printname', i + 1,getResults[i].print_name);
			resultsSubList.setLineItemValue('custpage_resultssublist_printemail', i + 1,getResults[i].print_email);
			resultsSubList.setLineItemValue('custpage_resultssublist_subsidiary', i + 1,getResults[i].subsidiary);
			resultsSubList.setLineItemValue('custpage_resultssublist_internalid', i + 1,getResults[i].internalid);
			
			toremoveSubList.setLineItemValue('custpage_toremove_trandate', i + 1,getResults[i].date);
			toremoveSubList.setLineItemValue('custpage_toremove_view', i + 1, clickURL+getResults[i].internalid);
			toremoveSubList.setLineItemValue('custpage_toremove_tranid', i + 1,getResults[i].doc_num);
			toremoveSubList.setLineItemValue('custpage_toremove_customer', i + 1,getResults[i].customer);
			toremoveSubList.setLineItemValue('custpage_toremove_customerid', i + 1,getResults[i].customer_id);
			toremoveSubList.setLineItemValue('custpage_toremove_accountperiod', i + 1,getResults[i].period);
			toremoveSubList.setLineItemValue('custpage_toremove_currency', i + 1,getResults[i].currency);
			toremoveSubList.setLineItemValue('custpage_toremove_amount', i + 1,getResults[i].amount);
			toremoveSubList.setLineItemValue('custpage_toremove_createdby', i + 1,getResults[i].created_by);
			toremoveSubList.setLineItemValue('custpage_toremove_printname', i + 1,getResults[i].print_name);
			toremoveSubList.setLineItemValue('custpage_toremove_printemail', i + 1,getResults[i].print_email);
			toremoveSubList.setLineItemValue('custpage_toremove_subsidiary', i + 1,getResults[i].subsidiary);
			toremoveSubList.setLineItemValue('custpage_toremove_internalid', i + 1,getResults[i].internalid);
		
		}
		resultsForm.setScript('customscript_ilo_inv_firstmail_client');
		response.writePage(resultsForm);
		
	}//end of first results page
	

	
	else if ((request.getParameter('custpage_ilo_tosend') != '') || (request.getParameter('custpage_ilo_toremove') != '')) {
		
		var toSend = request.getParameter('custpage_ilo_tosend');
		var toRemove = request.getParameter('custpage_ilo_toremove');
		
		nlapiLogExecution('DEBUG', 'toRemove', toRemove)
		
//		var all = toSend +' ------------ '+toRemove;
		
		var lastForm = nlapiCreateForm('Review Before Send');
		lastForm.addSubmitButton('Execute');
		
		
		//field to send to next stage;
		var toEnd = lastForm.addField('custpage_ilo_end','text', 'toend');
		toEnd.setDefaultValue('end');
		toEnd.setDisplayType('hidden');
		
		var toEnd_Send = lastForm.addField('custpage_ilo_end_send', 'longtext', 'toendsend');
		toEnd_Send.setDisplayType('hidden');
		toEnd_Send.setDefaultValue(toSend);
		var toEnd_Remove = lastForm.addField('custpage_ilo_end_remove', 'longtext', 'toendremove');
		toEnd_Remove.setDisplayType('hidden');
		toEnd_Remove.setDefaultValue(toRemove);
		

		// To Send SUBLIST
		var reviewSubList = lastForm
				.addSubList('custpage_review_sublist', 'list',
						'To Send', null);
		
		var rev_InternalID = reviewSubList.addField(
				'custpage_review_internalid', 'text',
				'Internal Id');
		rev_InternalID.setDisplayType('hidden');
		
		var rev_TranDate = reviewSubList.addField(
				'custpage_review_trandate', 'date',
				'Transaction Date');
		
		var rev_AccPeriod = reviewSubList.addField(
				'custpage_review_accountperiod', 'text',
				'Posting Period');
		
		var rev_TranId_view = reviewSubList.addField(
				'custpage_review_view', 'url',
				' ').setLinkText('View');

		var rev_TranId = reviewSubList.addField(
				'custpage_review_tranid', 'text',
				'Transaction Number');
		
		var rev_Customer = reviewSubList.addField(
				'custpage_review_customer', 'text', 'Customer');

		var rev_Customer_ID = reviewSubList.addField(
				'custpage_review_customerid', 'text', 'Customer ID');
		
		var rev_Subsidiary = reviewSubList.addField(
				'custpage_review_subsidiary', 'text', 'Subsidiary');

		var rev_PrintName = reviewSubList.addField(
				'custpage_review_printname', 'text', 'Print Name');

		var rev_PrintEmail = reviewSubList.addField(
				'custpage_review_printemail', 'text', 'Print Email');

		var rev_Currency = reviewSubList.addField(
				'custpage_review_currency', 'text', 'Currency');

		var rev_Amount = reviewSubList.addField(
				'custpage_review_amount', 'text', 'Amount');
		
		var rev_CreatedBy = reviewSubList.addField(
				'custpage_review_createdby', 'text', 'Created By');
		
		
		
		// To Mark as Sent(Remove) SUBLIST
		var toremove_revSubList = lastForm
				.addSubList('custpage_rev_toremove_sublist', 'list',
						'Mark as Sent', null);
		
		var rem_rev_InternalID = toremove_revSubList.addField(
				'custpage_toremove_rev_internalid', 'text',
				'Internal Id');
		rem_rev_InternalID.setDisplayType('hidden');
		
		var rem_rev_TranDate = toremove_revSubList.addField(
				'custpage_toremove_rev_trandate', 'date',
				'Transaction Date');
		
		var rem_rev_AccPeriod = toremove_revSubList.addField(
				'custpage_toremove_rev_accountperiod', 'text',
				'Posting Period');
		
		var rem_TranId_view = toremove_revSubList.addField(
				'custpage_toremove_rev_view', 'url',
				' ').setLinkText('View');

		var rem_rev_TranId = toremove_revSubList.addField(
				'custpage_toremove_rev_tranid', 'text',
				'Transaction Number');
		
		var rem_rev_Customer = toremove_revSubList.addField(
				'custpage_toremove_rev_customer', 'text', 'Customer');

		var rem_rev_Customer_ID = toremove_revSubList.addField(
				'custpage_toremove_rev_customerid', 'text', 'Customer ID');
		
		var rem_rev_Subsidiary = toremove_revSubList.addField(
				'custpage_toremove_rev_subsidiary', 'text', 'Subsidiary');

		var rem_rev_PrintName = toremove_revSubList.addField(
				'custpage_toremove_rev_printname', 'text', 'Print Name');

		var rem_rev_PrintEmail = toremove_revSubList.addField(
				'custpage_toremove_rev_printemail', 'text', 'Print Email');

		var rem_rev_Currency = toremove_revSubList.addField(
				'custpage_toremove_rev_currency', 'text', 'Currency');

		var rem_rev_Amount = toremove_revSubList.addField(
				'custpage_toremove_rev_amount', 'text', 'Amount');
		
		var rem_rev_CreatedBy = toremove_revSubList.addField(
				'custpage_toremove_rev_createdby', 'text', 'Created By');
		
		var rev_ToSend = JSON.parse(toSend);
		var rev_ToRemove = JSON.parse(toRemove);
		
//		nlapiLogExecution('DEBUG', 'tosend - review', toSend);
		
		for(var x = 0; x<rev_ToSend.length; x++) {
			
			reviewSubList.setLineItemValue('custpage_review_trandate', x + 1,rev_ToSend[x].date);
			reviewSubList.setLineItemValue('custpage_review_view', x + 1, clickURL+rev_ToSend[x].recID);
			reviewSubList.setLineItemValue('custpage_review_tranid', x + 1,rev_ToSend[x].docNum);
			reviewSubList.setLineItemValue('custpage_review_customer', x + 1,rev_ToSend[x].customer);
			reviewSubList.setLineItemValue('custpage_review_customerid', x + 1,rev_ToSend[x].customerID);
			reviewSubList.setLineItemValue('custpage_review_accountperiod', x + 1,rev_ToSend[x].period);
			reviewSubList.setLineItemValue('custpage_review_currency', x + 1,rev_ToSend[x].currency);
			reviewSubList.setLineItemValue('custpage_review_amount', x + 1,rev_ToSend[x].amount);
			reviewSubList.setLineItemValue('custpage_review_createdby', x + 1,rev_ToSend[x].createdBy);
			reviewSubList.setLineItemValue('custpage_review_printname', x + 1,rev_ToSend[x].printName);
			reviewSubList.setLineItemValue('custpage_review_printemail', x + 1,rev_ToSend[x].printEmail);
			reviewSubList.setLineItemValue('custpage_review_subsidiary', x + 1,rev_ToSend[x].subsidiary);
			reviewSubList.setLineItemValue('custpage_review_internalid', x + 1,rev_ToSend[x].recID);
			
		}
		
		for(var x = 0; x<rev_ToRemove.length; x++) {
			
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_trandate', x + 1,rev_ToRemove[x].date);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_view', x + 1, clickURL+rev_ToRemove[x].recID);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_tranid', x + 1,rev_ToRemove[x].docNum);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_customer', x + 1,rev_ToRemove[x].customer);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_customerid', x + 1,rev_ToRemove[x].customerID);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_accountperiod', x + 1,rev_ToRemove[x].period);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_currency', x + 1,rev_ToRemove[x].currency);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_amount', x + 1,rev_ToRemove[x].amount);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_createdby', x + 1,rev_ToRemove[x].createdBy);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_printname', x + 1,rev_ToRemove[x].printName);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_printemail', x + 1,rev_ToRemove[x].printEmail);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_subsidiary', x + 1,rev_ToRemove[x].subsidiary);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_internalid', x + 1,rev_ToRemove[x].recID);
			
		}
		
		
		response.writePage(lastForm);
	}// end of review page


}








function getSelection(dateTo, dateFrom, subsidiary, createdBy, invoiceTickets, financeRep) {

	var searchid = 'customsearch_ilo_invmail_control_search';
	
	if(invoiceTickets == 'T') {
		
		searchid = 'customsearch_ilo_invoice_ticket_search';
	}
	
	var searchInv= nlapiLoadSearch(null, searchid);
	
	
	//additional filters
	if(dateTo || dateFrom != '') {
		
		searchInv.addFilter(new nlobjSearchFilter( 'trandate', null, 'within', dateFrom, dateTo));
	}
	
	if(subsidiary != '' || null || undefined) {
		
		searchInv.addFilter(new nlobjSearchFilter( 'subsidiary', null, 'is', subsidiary));
	}
	
	if(createdBy != '' || null || undefined) {
		
		searchInv.addFilter(new nlobjSearchFilter( 'createdby', null, 'anyof', createdBy));
	}
	
	if(financeRep != '' || null || undefined) {
		
		searchInv.addFilter(new nlobjSearchFilter( 'custbody_finance_rep', null, 'anyof', financeRep));
	}
	

	var allINV = [];
	var inv_selection =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchInv.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allINV.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allINV != null) {
				allINV.forEach(function(line) {
					
					inv_selection.push({
					
					date : line.getValue('trandate'),
					internalid : line.getValue('internalid'),
					period : line.getText('postingperiod'),
					subsidiary : line.getText('subsidiary'),
					doc_num : line.getValue('tranid'),
					customer : line.getValue('companyname', 'customer'),
					customer_id : line.getValue('entityid', 'customer'),
					print_name : line.getValue('custbody_ilo_contact_name'),
					print_email : line.getValue('custbody_ilo_contact_email'),
					created_by : line.getText('createdby'),
					currency : line.getText('currency'),
					amount: line.getValue('amount'),
					attachment : line.getValue('custbody_ilo_invmail_attachment'),
					
					
					});
				
					
					
				});

			};
			
			return inv_selection;

	}

function getTodaysDate(){
	var todaysDate = new Date();
	var dd = todaysDate.getDate();
	var mm = todaysDate.getMonth()+1; //January is 0!
	var yyyy = todaysDate.getFullYear();

	if(dd<10) {
	    dd='0'+dd;
	}; 

	if(mm<10) {
	    mm='0'+mm;
	};

	todaysDate = dd+'/'+mm+'/'+yyyy;
	return todaysDate;
	}
	