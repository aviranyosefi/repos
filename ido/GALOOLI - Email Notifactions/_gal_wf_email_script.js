/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Feb 2018     idor
 *
 */

/**
 * @returns {Void} Any or no return value
 */
function workflowAction_emailtest() {
	
///*	var allContacts = getAllContacts();
//	var customer = '1183';
//	
//	var customerContacts = [];
//	
//	for(var i = 0; i<allContacts.length; i++){
//		
//		if(allContacts[i].company == customer) {
//			
//			customerContacts.push(allContacts[i]);
//		}
//	
//		
//	}
//	
//	
//	console.log(customerContacts)
//	*/
	
	try{
	
		   nlapiLogExecution('debug', 'Entered email script', 'TRUE');

    var rec = nlapiGetNewRecord();
//    var custid = rec.getFieldValue('entity');
//    nlapiLogExecution('debug', 'custid', custid);
	
	var fromId = '617'; //Asaf's employee
	var recipient = 'asaf.yadigar@one1up.com'
	
	var inv = nlapiPrintRecord('TRANSACTION','5780','PDF',null);
	var statement = nlapiLoadFile('6073');

	var sbj = 'Galooli LTD – Follow up';
	var msg = 'test test test'
	var attachRec = new Object(); 
	attachRec['entity']= '1181'; //attach email to customer record
	attachRec['transaction']= '5780'; //attach email to invoice record
	//multiple email addresses
	//Recipient is a comma separated list of email addresses
	var attachment = [inv, statement];
	nlapiSendEmail(fromId, recipient, sbj, msg, null, null, attachRec, attachment);
	

	
	}catch(err){
		nlapiLogExecution('debug', 'err', err)
	}

}



function getAllContacts() {

var columns = new Array();
	columns[0] = new nlobjSearchColumn('entityid');
	columns[1] = new nlobjSearchColumn('company');
	columns[2] = new nlobjSearchColumn('email');
	columns[3] = new nlobjSearchColumn('custentity_invoice_notification');
	columns[4] = new nlobjSearchColumn('custentity_payment_notification');
	columns[5] = new nlobjSearchColumn('custentity_statement_notification');

	var searchFAM = nlapiCreateSearch('contact', null, columns)
	
	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();
	

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allSelection
					.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allSelection != null) {
		allSelection.forEach(function(line) {

			
		theResults.push({

			name : line.getValue(cols[0]),
			company : line.getValue(cols[1]),
			email : line.getValue(cols[2]),
			send_inv: line.getValue(cols[3]),
			send_pymt: line.getValue(cols[4]),
			send_statemnt: line.getValue(cols[5]),


		});

		});

	};
	
return theResults;
	
	}