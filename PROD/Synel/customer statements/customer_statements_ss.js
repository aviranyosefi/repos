var currentContext = nlapiGetContext();

function sendCustomerStatements() {
	
    var customersToSend = currentContext.getSetting('SCRIPT', 'custscript_customers_tosend_statement');
    var statementDate = currentContext.getSetting('SCRIPT', 'custscript_stat_date');
    
	
	nlapiLogExecution('debug', 'customersToSend', customersToSend)
	
	var res = JSON.parse(customersToSend);

	//var contactsSearchResults = getAllContacts();
	
	if(res != null || res != [] || res != '' || res != null) {
		
		for(var i = 0; i<res.length; i++) {
			try{
				
	    	 var dnow = new Date();
	    	    var timeexe = (dnow - dstart) / 1000 / 3600;
	    	    if (currentContext.getRemainingUsage() < 800 || timeexe >= 0.15) { //0.2
	    	    	  var dstart = new Date();
	    	        var state = nlapiYieldScript();
	    	        if (state.status == 'FAILURE') {
	    	            nlapiLogExecution('ERROR', 'Error', ' Failed to yield script sendCustomerStatements');
	    	        }
	    	        else if (state.status == 'RESUME') {
	    	            nlapiLogExecution("AUDIT", 'sendCustomerStatements', "Resuming script due to: " + state.reason + ",  " + state.size);
	    	        }
	    	    }
			
		
	    	    nlapiLogExecution('debug', 'res[i]', JSON.stringify(res[i]))
                create_statement_email(res[i], statementDate)
				
			}catch(err) {
				nlapiLogExecution('debug', 'err', JSON.stringify(err))
			}
			
			
			
		}
	}//end of if(res != null || res != [] || res != '' || res != null)
}




function create_statement_email(customerID, statementDate)
{
	
	try{


	var customerRec = nlapiLoadRecord('customer', customerID);
	nlapiLogExecution('debug', 'custid', 'id = ' + customerID);
	
	var customerName = customerRec.getFieldValue('altname')
    var email = customerRec.getFieldValue('email')
	if(customerName == null || customerName == undefined || customerName == '' ) {
		customerName = ''
	}
	var customerNumber = customerRec.getFieldValue('entityid')
		if(customerNumber == null || customerNumber == undefined || customerNumber == '' ) {
			customerNumber = ''
	}
	
	var customerSubject = customerNumber+' '+customerName


	//var today = new Date();
	//var statementDate = nlapiDateToString(today);	

	//var allContacts = contactsSearchResults;
	
	//var contacts = getContacts(customerID, allContacts);
	//var emails = '';
	//if(contacts != [] || contacts != null) {	
	//	emails =  contacts.toString();	
	//}
	
	
	var INC_subject = '('+customerSubject+')כרטסת לקוח'
        var INC_msg = '<p style="text-align:right;" dir="rtl">לקוח יקר, ' +
            '<br><br> מצ"ב כרטסת לקוח.<br><br>' ;
	
	
    if (email != '' ) { //302_CyberArk USA
		
        var sendFrom = '-5'; //accounts receivable employee
        var sendTo = email;

		var sendCC = null;
		var sbj = INC_subject;
		var body = INC_msg;
		nlapiLogExecution('debug', 'sendTo', sendTo)
		nlapiLogExecution('debug', 'Would send to INC', INC_msg)

		//create an array to set the STATEMENT properties(optional)
		var sdate = new Array();
		sdate.statementdate = statementDate; 
		sdate.openonly = 'T'; 
		sdate.formnuber = 166; 
		
		
		//print the statement to a PDF file object
		var file = nlapiPrintRecord('STATEMENT', customerID, 'PDF', sdate);

		var attachRec = new Object();
		attachRec['entity'] = customerID; //attach email to customer record
		

		//send the email
		nlapiSendEmail(sendFrom, sendTo, sbj, body, sendCC,null,attachRec, file, true);

		
	}


	
	}catch(err) {
		nlapiLogExecution('error', 'send email err', JSON.stringify(err));

	}
}



function getCustomers() {

    var savedSearch = nlapiLoadSearch(null, 'customsearch_cbr_cstmer_statement_search'); //customer/transaction search

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
				
			results.push(element.getValue(cols[0]));	
		});

	}
	return results;

}

function getContacts(customerID, allContacts) {
	
	var emails = [];
	
	for(var i = 0; i<allContacts.length; i++) {
		
		if(allContacts[i].customerID == customerID) {
			
			emails.push(allContacts[i].contactEmails)
		}
	}
	
	return emails;
	
}

function getAllContacts() {

    var savedSearch = nlapiLoadSearch(null, 'customsearch_dev_aging_contact_search'); //customer/transaction search
    
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
				contactEmails : element.getValue(cols[2])
		});	
		});

	}
	return results;

}