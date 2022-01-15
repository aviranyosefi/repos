var allMails = allStatementEmailsSent()

function statements_control(request, response){
	
	 if ( request.getMethod() == 'GET' )  {
	
	 var form = nlapiCreateForm('Send Customer Statements');
	
	 var batchGroup = form.addFieldGroup( 'custpage_batch_group', 'Select Subsidiary');

	 var selectSubsid = form.addField('custpage_select_subsid','select', 'Subsidiary', 'SUBSIDIARY','custpage_batch_group');
	 selectSubsid.setLayoutType('normal','startcol')

	 
	 var toNextPage = form.addField('custpage_tonextpage', 'text', 'Next Page', null,'custpage_search_group');
	 toNextPage.setDisplayType('hidden');
	 toNextPage.setDefaultValue('next');
	 form.addSubmitButton('Continue');
	 response.writePage( form );
	 }
	 
	 
	 else if (request.getParameter('custpage_tonextpage') == 'next') {

		 var subsidSelected = request.getParameter('custpage_select_subsid')
		 var getCustomerResults = getCustomers(subsidSelected);
		 
		 nlapiLogExecution('debug', 'subsidSelected', subsidSelected)
		 var subsidName = nlapiLookupField('subsidiary', subsidSelected, 'namenohierarchy')
		 
		 var resForm = nlapiCreateForm('Send Customer Statements : '+ subsidName);
		 resForm.addSubmitButton('Send Statements');
		 
		 var today = new Date();
		 var todayStr = nlapiDateToString(today)
		 
		 var subList = resForm.addSubList('custpage_res_sublist', 'list', 'Results', null);
		 subList.addMarkAllButtons()
		 
		 var internalIDColumn =  subList.addField('custpage_res_internalid', 'text', 'Internal ID');
		 internalIDColumn.setDisplayType('hidden');
		 subList.addField('custpage_res_process', 'checkbox', 'Process')
		 subList.addField('custpage_res_customername', 'text', 'Customer');
		 subList.addField('custpage_res_customerbalance', 'text', 'Balance - '+todayStr);
		 subList.addField('custpage_res_customercurrency', 'text', 'Currency');
		 subList.addField('custpage_res_lastmail', 'text', 'Last Statement Sent');

		 if(getCustomerResults != null || getCustomerResults != []) {
			 
			 for(var i = 0; i<getCustomerResults.length; i++) {
			
				 subList.setLineItemValue('custpage_res_internalid', i+1, getCustomerResults[i].customerID);
				 subList.setLineItemValue('custpage_res_process', i+1, 'T');
				 subList.setLineItemValue('custpage_res_customername', i+1, getCustomerResults[i].customerName);
				 subList.setLineItemValue('custpage_res_customerbalance', i+1, getCustomerResults[i].customerBalance);
			 	 subList.setLineItemValue('custpage_res_customercurrency', i+1, getCustomerResults[i].customerCurrency);
			 	subList.setLineItemValue('custpage_res_lastmail', i+1, getLastEmail(getCustomerResults[i].customerID, allMails));
		 } 
			 			 
		 }

		 response.writePage(resForm)

	 }
	 
	 else{
		 
		 var lineCount = request.getLineItemCount('custpage_res_sublist');
		 var selectedCustomers = [];
		 
		 for(var i = 0; i<lineCount; i++) {
			 
			 var selected = request.getLineItemValue('custpage_res_sublist','custpage_res_process',i+1);
			 if (selected == 'T') {
				 
				 selectedCustomers.push(request.getLineItemValue('custpage_res_sublist','custpage_res_internalid',i+1))
			 }
			 
		 }
		 
		 var endForm = nlapiCreateForm('Sending Customer Statements...');
			 
			var today = new Date();
			var todayStr = nlapiDateToString(today);	
			
		  var htmlHeader = endForm.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
		  htmlHeader.setDefaultValue("<p style='font-size:20px'>The statements are currently being sent to the selected customers.</p><br><br>Please click <a href='https://system.eu2.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&datefrom="+todayStr+"&dateto="+todayStr+"&scripttype=1035&primarykey=5430'>here</a> in order to be redirected to the status page.");
		 		 
		 response.writePage(endForm)
		 
		 var selectedCustomers = JSON.stringify(selectedCustomers)
		  
		nlapiLogExecution('debug', 'selectedCustomers', JSON.stringify(selectedCustomers, null, 2))
		 
		 var params = {
			 custscript_customers_tosend_statement: selectedCustomers,
				 										};
		 
		 nlapiScheduleScript('customscript_dev_schduled_cust_statement', 'customdeploy_dev_schduled_cust_state_dep', params);
		 
	
		 
	 }
}


function getCustomers(subsid) {

    var savedSearch = nlapiLoadSearch(null, 'customsearch_cbr_cstmer_statement_search'); //customer/transaction search
    
    savedSearch.addFilter(new nlobjSearchFilter('subsidiary', null, 'anyof', subsid));
    
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
				
				customerID : element.getValue(cols[0]),
				customerName : element.getValue(cols[1]),
				customerBalance : element.getValue(cols[3]),
				customerCurrency : element.getText(cols[4])
				
			});	
		});

	}
	return results;

}

function getLastEmail(customerID, allMails) {

	var res = '';

	for (var i = 0; i < allMails.length; i++) {

		if (customerID == allMails[i].customerID) {

			res = allMails[i].sentLast
		}
	}

	return res;
}


function allStatementEmailsSent() {

    var savedSearch = nlapiLoadSearch(null, 'customsearch_dev_statement_msg_search'); //email search

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
				
				customerID : element.getValue('internalid', 'customer'),
				sentLast : element.getValue('messagedate')
				
			});	
		});

	}
	return results;
}