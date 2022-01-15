//var allMails = allStatementEmailsSent()

function statements_control(request, response) {

    if (request.getParameter('custpage_page') == '1') {

        var lineCount = request.getLineItemCount('custpage_res_sublist');
        var date = request.getParameter('custpage_date')
	    var selectedCustomers = [];

	    for(var i = 0; i<lineCount; i++) {
		    var selected = request.getLineItemValue('custpage_res_sublist','custpage_res_process',i+1);
		    if (selected == 'T') {
			    selectedCustomers.push(request.getLineItemValue('custpage_res_sublist','custpage_res_internalid',i+1))
		    }
	    }

        var form = nlapiCreateForm('Sending Customer Statements...');

	    var today = new Date();
	    var todayStr = nlapiDateToString(today);	

        var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
	    htmlHeader.setDefaultValue("<p style='font-size:20px'>The statements are currently being sent to the selected customers.</p><br><br>Please click <a href='https://system.eu2.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&datefrom="+todayStr+"&dateto="+todayStr+"&scripttype=523&primarykey=523'>here</a> in order to be redirected to the status page.");

	     var selectedCustomers = JSON.stringify(selectedCustomers)

        nlapiLogExecution('debug', 'selectedCustomers', JSON.stringify(selectedCustomers, null, 2))

	    var params = {
            custscript_customers_tosend_statement: selectedCustomers,
            custscript_stat_date: date,
	    };

        nlapiScheduleScript('customscript_customer_statements_ss', null, params);
    }
    else {
        var form = nlapiCreateForm('Send Customer Statements');
        form.addSubmitButton('Refresh');
        form.setScript('customscript_customer_statements_cs');
        form.addFieldGroup('custpage_batch_group', 'Select Subsidiary');

        var selectSubsid = form.addField('custpage_select_subsid', 'select', 'Subsidiary', 'SUBSIDIARY', 'custpage_batch_group');
        selectSubsid.setLayoutType('normal', 'startcol')
        var sub_data = request.getParameter('custpage_select_subsid');
        selectSubsid.setDefaultValue(sub_data);

        var customerField = form.addField('custpage_select_customer', 'select', 'Customer', 'customer', 'custpage_batch_group');
        customerField.setLayoutType('normal', 'startcol')
        var customer = request.getParameter('custpage_select_customer');
        customerField.setDefaultValue(customer);

        var dateField = form.addField('custpage_date', 'date', 'STATEMENT DATE', null, 'custpage_batch_group').setMandatory(true)
        dateField.setLayoutType('normal', 'startcol')
        var date = request.getParameter('custpage_date');
        dateField.setDefaultValue(date);

        form.addField('custpage_page', 'text', 'Next Page', null, null).setDisplayType('hidden');

        form.addButton('customscript_continue', 'Send', 'Continue()');

        if (!isNullOrEmpty(sub_data)) {
            var getCustomerResults = getCustomers(sub_data, customer , date);
            if (getCustomerResults.length > 0) {               
                var subList = form.addSubList('custpage_res_sublist', 'list', 'Results', null);
                subList.addMarkAllButtons()
                subList.addField('custpage_res_internalid', 'text', 'Internal ID').setDisplayType('hidden');
                subList.addField('custpage_res_process', 'checkbox', 'Process')
                subList.addField('custpage_res_customername', 'text', 'Customer');
                subList.addField('custpage_res_customerbalance', 'text', 'Balance - ' + todayStr);
                subList.addField('custpage_res_customercurrency', 'text', 'Currency');

                if (getCustomerResults != null || getCustomerResults != []) {

                    for (var i = 0; i < getCustomerResults.length; i++) {

                        subList.setLineItemValue('custpage_res_internalid', i + 1, getCustomerResults[i].customerID);
                        subList.setLineItemValue('custpage_res_process', i + 1, 'T');
                        subList.setLineItemValue('custpage_res_customername', i + 1, getCustomerResults[i].customerName);
                        subList.setLineItemValue('custpage_res_customerbalance', i + 1, getCustomerResults[i].customerBalance);
                        subList.setLineItemValue('custpage_res_customercurrency', i + 1, getCustomerResults[i].customerCurrency);                      
                    }
                }
            }
        }
    }	
    response.writePage(form);
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getCustomers(subsid, customer , date) {

    var savedSearch = nlapiLoadSearch(null, 'customsearch_customer_statement'); //customer/transaction search 
    if (!isNullOrEmpty(subsid)) {
        savedSearch.addFilter(new nlobjSearchFilter('subsidiary', null, 'anyof', subsid));
    }
    if (!isNullOrEmpty(customer)) {
        savedSearch.addFilter(new nlobjSearchFilter('name', null, 'anyof', customer));
    }
    if (!isNullOrEmpty(date)) {
        savedSearch.addFilter(new nlobjSearchFilter('trandate', null, 'onorbefore', date));
    }

    
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
				customerName : element.getText(cols[0]),
				customerBalance : element.getValue(cols[1]),
				customerCurrency : element.getText(cols[0])
				
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