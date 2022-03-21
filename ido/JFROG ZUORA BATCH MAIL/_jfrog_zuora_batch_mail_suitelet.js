var clickURL = 'https://4511400-sb1.app.netsuite.com/app/accounting/transactions/custinvc.nl?id='

	
function inv_batch_zuora(request, response){
	
	if (request.getMethod() == 'GET') {
	
	var form = nlapiCreateForm('Send JFrog LTD Zuora Invoices');
	form.addSubmitButton('Continue');
	
	var searchFilterGroup = form.addFieldGroup('custpage_search_group','Filters');
	
	
	var selectDateFrom = form.addField('custpage_select_datefrom','date','From', 'Date', 'custpage_search_group');
	selectDateFrom.setMandatory( true );
	var selectDateTo = form.addField('custpage_select_dateto','date', 'To', 'Date', 'custpage_search_group');
	selectDateTo.setMandatory( true );
	var selectSubsidiary = form.addField('custpage_select_subsidiary','select', 'Subsidary', 'SUBSIDIARY', 'custpage_search_group');
	selectSubsidiary.setDefaultValue('1');
	selectSubsidiary.setDisplayType('disabled')


	//field to send to next stage;
	var toNextPage = form.addField('custpage_ilo_tonextpage','text', 'tosend');
	toNextPage.setDefaultValue('next');
	toNextPage.setDisplayType('hidden');

	response.writePage(form);
	}
	
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
		
		var newEmailJob = nlapiCreateRecord('customrecord_jfrog_zuora_batch_job');
		newEmailJob.setFieldValue('name', getTodaysDate() + ' - Zuora Invoices To Send');
		newEmailJob.setFieldValue('custrecord_jfrog_zuo_email_data_array', email_data);
		newEmailJob.setFieldValue('custrecord_jfrog_zuo_remove_data_array', remove_data);
		var jobID = nlapiSubmitRecord(newEmailJob);
		
		nlapiScheduleScript('customscript_jfrog_zuora_batch_sender_ss', 'customdeploy_jfrog_zuo_btch_snder_ss_dep', {custscript_jfrog_ss_data_id: jobID});

		
		response.writePage(endForm);
	}// end of last elseif
	
	else if(request.getParameter('custpage_ilo_tonextpage') == 'next') {
		
		
		var getDateFrom = request.getParameter('custpage_select_datefrom');
		var getDateTo = request.getParameter('custpage_select_dateto');
		
		var resultsForm = nlapiCreateForm('Send JFrog LTD Zuora Invoices - Results');
		resultsForm.addSubmitButton('Next');
		
		
		//hidden resource fields
		var toSendField = resultsForm.addField('custpage_ilo_tosend','longtext', 'tosend');
		toSendField.setDisplayType('hidden');
		var toRemoveField = resultsForm.addField('custpage_ilo_toremove','longtext', 'toremove');
		toRemoveField.setDisplayType('hidden');
				
	
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

		var res_Currency = resultsSubList.addField(
				'custpage_resultssublist_currency', 'text', 'Currency');

		var res_Amount = resultsSubList.addField(
				'custpage_resultssublist_amount', 'text', 'Amount');
			
		
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


		var rem_Currency = toremoveSubList.addField(
				'custpage_toremove_currency', 'text', 'Currency');

		var rem_Amount = toremoveSubList.addField(
				'custpage_toremove_amount', 'text', 'Amount');
		
		
		
		var getResults = getSelection(getDateFrom, getDateTo);
		
		nlapiLogExecution('debug', 'getResults', JSON.stringify(getResults))
		
		for (var i = 0; i < getResults.length; i++) {
			
			resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i + 1,getResults[i].date);
			resultsSubList.setLineItemValue('custpage_resultssublist_view', i + 1, clickURL+getResults[i].internalid);
			resultsSubList.setLineItemValue('custpage_resultssublist_tranid', i + 1, getResults[i].doc_num);
			resultsSubList.setLineItemValue('custpage_resultssublist_customer', i + 1,getResults[i].customer);
			resultsSubList.setLineItemValue('custpage_resultssublist_customerid', i + 1,getResults[i].customerID);			
			resultsSubList.setLineItemValue('custpage_resultssublist_currency', i + 1,getResults[i].currency);
			resultsSubList.setLineItemValue('custpage_resultssublist_amount', i + 1,getResults[i].amount);
			resultsSubList.setLineItemValue('custpage_resultssublist_subsidiary', i + 1, 'JFrog LTD');
			resultsSubList.setLineItemValue('custpage_resultssublist_internalid', i + 1,getResults[i].internalid);
			
			toremoveSubList.setLineItemValue('custpage_toremove_trandate', i + 1,getResults[i].date);
			toremoveSubList.setLineItemValue('custpage_toremove_view', i + 1, clickURL+getResults[i].internalid);
			toremoveSubList.setLineItemValue('custpage_toremove_tranid', i + 1,getResults[i].doc_num);
			toremoveSubList.setLineItemValue('custpage_toremove_customer', i + 1,getResults[i].customer);
			resultsSubList.setLineItemValue('custpage_resultssublist_customerid', i + 1,getResults[i].customerID);		
			toremoveSubList.setLineItemValue('custpage_toremove_currency', i + 1,getResults[i].currency);
			toremoveSubList.setLineItemValue('custpage_toremove_amount', i + 1,getResults[i].amount);
			toremoveSubList.setLineItemValue('custpage_toremove_subsidiary', i + 1,'JFrog LTD');
			toremoveSubList.setLineItemValue('custpage_toremove_internalid', i + 1,getResults[i].internalid);
		
		}
		resultsForm.setScript('customscript_jfrog_zuora_batch_client');
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


		var rev_Currency = reviewSubList.addField(
				'custpage_review_currency', 'text', 'Currency');

		var rev_Amount = reviewSubList.addField(
				'custpage_review_amount', 'text', 'Amount');
		
	
		
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

		var rem_rev_Currency = toremove_revSubList.addField(
				'custpage_toremove_rev_currency', 'text', 'Currency');

		var rem_rev_Amount = toremove_revSubList.addField(
				'custpage_toremove_rev_amount', 'text', 'Amount');
		
		
		var rev_ToSend = JSON.parse(toSend);
		var rev_ToRemove = JSON.parse(toRemove);
		
//		nlapiLogExecution('DEBUG', 'tosend - review', toSend);
		
		for(var x = 0; x<rev_ToSend.length; x++) {
			
			reviewSubList.setLineItemValue('custpage_review_trandate', x + 1,rev_ToSend[x].date);
			reviewSubList.setLineItemValue('custpage_review_view', x + 1, clickURL+rev_ToSend[x].recID);
			reviewSubList.setLineItemValue('custpage_review_tranid', x + 1,rev_ToSend[x].docNum);
			reviewSubList.setLineItemValue('custpage_review_customer', x + 1,rev_ToSend[x].customer);
			reviewSubList.setLineItemValue('custpage_review_customerid', x + 1,rev_ToSend[x].customerID);
			reviewSubList.setLineItemValue('custpage_review_currency', x + 1,rev_ToSend[x].currency);
			reviewSubList.setLineItemValue('custpage_review_amount', x + 1,rev_ToSend[x].amount);
			reviewSubList.setLineItemValue('custpage_review_subsidiary', x + 1,rev_ToSend[x].subsidiary);
			reviewSubList.setLineItemValue('custpage_review_internalid', x + 1,rev_ToSend[x].recID);
			
		}
		
		for(var x = 0; x<rev_ToRemove.length; x++) {
			
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_trandate', x + 1,rev_ToRemove[x].date);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_view', x + 1, clickURL+rev_ToRemove[x].recID);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_tranid', x + 1,rev_ToRemove[x].docNum);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_customer', x + 1,rev_ToRemove[x].customer);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_customerid', x + 1,rev_ToRemove[x].customerID);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_currency', x + 1,rev_ToRemove[x].currency);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_amount', x + 1,rev_ToRemove[x].amount);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_subsidiary', x + 1,rev_ToRemove[x].subsidiary);
			toremove_revSubList.setLineItemValue('custpage_toremove_rev_internalid', x + 1,rev_ToRemove[x].recID);			
		}

		response.writePage(lastForm);
	}// end of review page

}

function getSelection(dateFrom, dateTo) {
	
	nlapiLogExecution('debug', 'dateFrom', dateFrom)
		nlapiLogExecution('debug', 'dateTo', dateTo)
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'type', null, 'anyof', ['CustInvc','CustCred'])
	filters[1] = new nlobjSearchFilter( 'subsidiary', null, 'anyof', ['1'])
	filters[2] = new nlobjSearchFilter( 'shipcountry', null, 'anyof', ['IL'])
	filters[3] = new nlobjSearchFilter( 'custbodyzuorareferencenumber', null, 'isnotempty')
	filters[4] = new nlobjSearchFilter( 'mainline', null, 'is', ['T'])
	
	//additional filters
	if(dateTo || dateFrom != '') {
		
		filters.push(new nlobjSearchFilter( 'trandate', null, 'within', [dateFrom, dateTo]));
	}

	
	var columns = new Array();
    columns[0] = new nlobjSearchColumn( 'internalid' );
    columns[1] = new nlobjSearchColumn( 'trandate' )
    columns[2] = new nlobjSearchColumn( 'tranid' );
    columns[3] = new nlobjSearchColumn( 'email', 'customer' );
    columns[4] = new nlobjSearchColumn( 'createdby' );
    columns[5] = new nlobjSearchColumn( 'createdfrom' );
	columns[6] = new nlobjSearchColumn( 'currency' );
	columns[7] = new nlobjSearchColumn( 'amount' );
	columns[8] = new nlobjSearchColumn( 'name', 'file' ); 
	columns[9] = new nlobjSearchColumn( 'type' ); 
	columns[10] = new nlobjSearchColumn( 'companyname', 'customer' );
	columns[11] = new nlobjSearchColumn( 'entityid', 'customer' );

	
    var savedSearch = nlapiCreateSearch('transaction', filters, columns)
    
    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
	var results = [];
	var cols = savedSearch.getColumns();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for ( var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

	if(returnSearchResults != null) {
	returnSearchResults.forEach(function(element) {

			results.push({

				internalid : element.getValue('internalid'),
				date : element.getValue('trandate'),
				doc_num : element.getValue('tranid'),
				customer : element.getValue('email', 'customer' ),
				customerID : element.getValue('companyname', 'customer'),
				createdby : element.getText('createdby'),
				createdfrom : element.getText('createdfrom'),
				currency : element.getText('currency'),
				amount : element.getValue('amount'),
				attachment : element.getText('name', 'file'),

		});	
		});
	}
	
	return results;
	
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