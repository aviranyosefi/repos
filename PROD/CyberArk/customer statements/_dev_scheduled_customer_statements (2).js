var currentContext = nlapiGetContext();

function sendCustomerStatements() {
	
	var customersToSend = currentContext.getSetting('SCRIPT', 'custscript_customers_tosend_statement');
	
	nlapiLogExecution('debug', 'customersToSend', customersToSend)
	
	var res = JSON.parse(customersToSend);

	var contactsSearchResults = getAllContacts();
	
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
				create_statement_email(res[i], contactsSearchResults)
				
			}catch(err) {
				nlapiLogExecution('debug', 'err', JSON.stringify(err))
			}
			
			
			
		}
	}//end of if(res != null || res != [] || res != '' || res != null)
}




function create_statement_email(customerID, contactsSearchResults)
{
	
	try{


	var customerRec = nlapiLoadRecord('customer', customerID);
	nlapiLogExecution('debug', 'custid', 'id = ' + customerID);
	
	var customerName = customerRec.getFieldValue('altname')
	if(customerName == null || customerName == undefined || customerName == '' ) {
		customerName = ''
	}
	var customerNumber = customerRec.getFieldValue('entityid')
		if(customerNumber == null || customerNumber == undefined || customerNumber == '' ) {
			customerNumber = ''
	}
	
	var customerSubject = customerNumber+' '+customerName


	var today = new Date();
	var statementDate = nlapiDateToString(today);	

	var allContacts = contactsSearchResults;
	
	var contacts = getContacts(customerID, allContacts);
	var emails = '';
	if(contacts != [] || contacts != null) {	
		emails =  contacts.toString();	
	}
	
	
	var INC_subject = 'Open Invoices - Cyberark ('+customerSubject+')'
	var INC_msg = '<p>Dear Customer, <br><br> The attached is a list of your open invoices with Cyberark.<br><br>' +
					'Kindly confirm the expected payment date(s) for <u>each invoice</u> listed.<b>If you have already provided us with this information, please ignore this email. </b><br>' +
					'In addition, Please also let us know if there are any issues that may delay the payment relating to any of these invoices.<br><br>'+
        			'For questions regarding your statement, please reach out to Accounts Receivable – Accounts.Receivable@CyberArk.com'+
					'We appreciate your feedback and cooperation<br><br>' +
					'Best regards,<br>'+
					'Cyberark Software Inc, Accounts Recievable Team<br>'+
					'Email address: accountsreceivable@cyberark.com<br>'+
					'Telephone number: 617-965-1544</p>';
	
	var ROW_subject = 'Open Invoices - Cyberark ('+customerSubject+')'
	var ROW_msg = '<p>Dear Customer, <br><br> Please find attached  a list of your open invoices with Cyberark.<br><br>' +
					'Kindly confirm the expected payment date(s) for <u>each invoice</u> listed. <b> If you have already provided us with this information, then please ignore this email. </b><br>' +
					'In addition, please can you let us know if there are any issues that may delay the payment of any of these invoices.<br><br>'+
        			'For questions regarding your statement, please contact us at  – AccountReceivablesROW@cyberark.com <br>'+
					'Thanks for your feedback & cooperation. <br><br>' +
					'Best regards,<br>'+
					'Cyberark Accounts Receivables Team<br>'+
					'Email address: AccountReceivablesROW@cyberark.com<br>'+
					'Tel: +972.3.9180000 | ext.2353</p>';
	
	var IL_subject = 'חשבוניות לתשלום- סייברארק תוכנה בע"מ ('+customerSubject+')' ;
	var IL_msg = '<p dir="rtl">לקוח יקר<br><br>' + 
				'מצ"ב רשימה של כלל החשבוניות הפתוחות עם חברת סייברארק.<br><br>'+
				'אנא ממך אשר במייל חוזר את תאריכי התשלום עבור כל חשבונית ברשימה המצורפת. <b> באם כבר עדכנת את תאריכי התשלום אנא התעלם ממייל זה. </b><br><br>' + 
				'בנוסף, אנא עדכן האם יש עיכובים בתשלום ואת הסיבות לעיכוב זה.<br><br>'+
				'מודים לך על שיתוף הפעולה<br><br>'+
				'מחלקת כספים סייברארק<br>'+
				'טלפון 03-9180000 שלוחה 2344<br>'+			
				'מייל: AccountReceivablesROW@cyberark.com </p>';

	var subsid = customerRec.getFieldValue('subsidiary'); //'18 - USA' || '22' Israel
	var countrySegment = customerRec.getFieldValue('custentity_cseg_cbr_countries') //'73' is Israel

	
	
	if(subsid == '18' || subsid == '23' ) { //302_CyberArk USA
		
		var sendFrom = '25129'; //accounts receivable employee
		var sendTo = emails;
		if(sendTo == '') {//No aging contacts - get primary customer email
			sendTo = nlapiLookupField('customer', customerID, 'email')
		}
		var sendCC = 'Accountsreceivable@cyberark.com';
		var sbj = INC_subject;
		var body = INC_msg;
		nlapiLogExecution('debug', 'sendTo', sendTo)
		nlapiLogExecution('debug', 'Would send to INC', INC_msg)
		nlapiLogExecution('debug', 'countrySegment', countrySegment)

		//create an array to set the STATEMENT properties(optional)
		var sdate = new Array();
		sdate.statementdate = statementDate; 
		sdate.openonly = 'T'; 
		sdate.formnuber = 101; 
		
		
		//print the statement to a PDF file object
		var file = nlapiPrintRecord('STATEMENT', customerID, 'PDF', sdate);

		var attachRec = new Object();
		attachRec['entity'] = customerID; //attach email to customer record
		
		//last email check
		if(sendTo == '' || sendTo == null){
			sendTo = 'accountsreceivable@cyberark.com';
		}

		//send the email
		nlapiSendEmail(sendFrom, sendTo, sbj, body, sendCC,null,attachRec, file, true);

		
	}

	else if(subsid == '22' && countrySegment == '73') { //202_CyberArk ISR + Israeli Customer in hebrew
		
		var sendFrom = '198251'; //ROW accounts receivable employee
		var sendTo = emails;
		if(sendTo == '') {//No aging contacts - get primary customer email
			sendTo = nlapiLookupField('customer', customerID, 'email')
		}
		var sendCC = 'AccountReceivablesROW@cyberark.com';
		var sbj = IL_subject;
		var body = IL_msg;
		
		nlapiLogExecution('debug', 'sendTo', sendTo)
		nlapiLogExecution('debug', 'Would send to IL', IL_msg)


		
		//create an array to set the STATEMENT properties(optional)
		var sdate = new Array();
		sdate.statementdate = statementDate; 
		sdate.openonly = 'T'; 
		sdate.formnuber = 101; 
		
		
		//print the statement to a PDF file object
		var file = nlapiPrintRecord('STATEMENT', customerID, 'PDF', sdate);

		var attachRec = new Object();
		attachRec['entity'] = customerID; //attach email to customer record

		//last email check
		if(sendTo == '' || sendTo == null){
			sendTo = 'AccountReceivablesROW@cyberark.com';
		}
		
		//send the email
		nlapiSendEmail(sendFrom, sendTo, sbj, body, sendCC,null,attachRec, file, true);
				
	}
	
    else if(subsid != '18' && countrySegment != '73') { //All other subsidiaries including ISR (but country segment is not IL) -  ROW
		
		var sendFrom = '198251'; //ROW accounts receivable employee
		
		
		var sendTo = emails;
		if(sendTo == '') {//No aging contacts - get primary customer email
			sendTo = nlapiLookupField('customer', customerID, 'email')
		}
		var sendCC = 'AccountReceivablesROW@cyberark.com';
		var sbj = ROW_subject;
		var body = ROW_msg;


		//create an array to set the STATEMENT properties(optional)
		var sdate = new Array();
		sdate.statementdate = statementDate; 
		sdate.openonly = 'T'; 
		sdate.formnuber = 101; 
		
		//print the statement to a PDF file object
		var file = nlapiPrintRecord('STATEMENT', customerID, 'PDF', sdate);

		var attachRec = new Object();
		attachRec['entity'] = customerID; //attach email to customer record

		//last email check
		if(sendTo == '' || sendTo == null){
			sendTo = 'AccountReceivablesROW@cyberark.com';
		}
		
		nlapiLogExecution('debug', 'sendTo', sendTo)
		nlapiLogExecution('debug', 'Would send to ROW', ROW_msg)
		
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