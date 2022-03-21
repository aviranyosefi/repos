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
function workflowAction_firstmail() {
	
    var rec = nlapiGetNewRecord();
    var custid = rec.getFieldValue('entity');
    nlapiLogExecution('debug', 'custid', custid);
	
    
    
	var allContacts = getAllContacts();
	var customerContacts = [];
	
	for(var i = 0; i<allContacts.length; i++){
		
		if(allContacts[i].company == custid) {
			
			customerContacts.push(allContacts[i]);
		}
		
	}
	
	var jsonStr = JSON.stringify(customerContacts);
	
	var sendTo = [];
	
	for(var x = 0; x<customerContacts.length; x++) {
		
		sendTo.push(customerContacts[x].email);
	}
	
	try{
	
	nlapiLogExecution('debug', 'Entered email script', 'TRUE');
	
	var customerName = nlapiLookupField('customer', custid, 'companyname');
	var tranid = rec.getFieldValue('tranid');
	var tranTotal = formatCurrency(rec.getFieldValue('total'));
	var tranCurrency = getCurrency(rec.getFieldValue('currency'));
	var tranDate = rec.getFieldValue('trandate');
	var dueDate = rec.getFieldValue('duedate');
	
	

	var fromId = '2535'; //Billing employee
	var recipient = sendTo;
	
	var attachment = nlapiPrintRecord('TRANSACTION',rec.getId(),'PDF',null);

	var sbj = 'Optimove Outstanding Invoice '+ tranid;
	var msg = '<u><b>Dear '+ customerName+',</u></b><br><br>' + 
	'This is just a friendly reminder that invoice '+ tranid+' is past due.<br>' +
	'According to our records, the invoice in the amount of <span style="background-color: rgb(255, 255, 255);">'+tranTotal+' '+tranCurrency+'</span> is currently <span style="color:#FF0000;"><strong><span dir="RTL">3</span> </strong></span> days past due.<br>' +
	'In the event you have not received the invoice, we have provided a summary below:' +
	'<ul style="list-style-type:circle;">' +
	'<li>Invoice number: '+tranid+'</li>' +
	'<li>Invoice Date: '+tranDate+'</li>' +
	'<li>Amount: '+tranTotal+' '+tranCurrency+'</li>' +
	'<li>Due Date: '+dueDate+'</li>' +
	'<li>Days past due: <span dir="RTL">3</span></li>' +
	' </ul>' +
	'We would much appreciate if you could let us know the status of this payment.<br />' +
	'<span style="color:#000000;"><span style="background-color:#FFFF00;">* Please note that our banking details have been changed, as shown on the attached invoice</span></span><br />'+
	'Kindly disregard this email if payment has already been processed.<br /><br />' +
	'Regards,<br />' +
	'<a href="mailto:Billing@optimove.com">Billing@optimove.com</a><br />';
	var attachRec = new Object(); 
	attachRec['entity']= custid; //attach email to customer record
	attachRec['transaction']= rec.getId(); //attach email to invoice record
	//multiple email addresses
	//Recipient is a comma separated list of email addresses
	nlapiSendEmail(fromId, recipient, sbj, msg, 'billing@optimove.com', null, attachRec, attachment, true);


	
	}catch(err){
		nlapiLogExecution('debug', 'err', err)
	}

}



function getAllContacts() {

var columns = new Array();
	columns[0] = new nlobjSearchColumn('entityid');
	columns[1] = new nlobjSearchColumn('company');
	columns[2] = new nlobjSearchColumn('email');

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



		});

		});

	};
	
return theResults;
	
	}


function getCurrency(currency) {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('internalid');
		cols[2] = new nlobjSearchColumn('symbol');
	

	var s = nlapiSearchRecord('currency', null, null, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {
		
			resultsArr.push({
				type_name : s[i].getValue('name'),
				internalid : s[i].getValue('internalid'),
				symbol : s[i].getValue('symbol')

			});
			
		}

	}
	
	
	var symbol = '';
	for(var x = 0; x<resultsArr.length;x++){
	
	if(resultsArr[x].internalid == currency)
	
	symbol = resultsArr[x].symbol
	}

	return symbol;
	
	
}

function formatCurrency(str) {

	if (str.indexOf(',') == -1) { //checking if value is already formatted.

		var value = parseFloat(str).toFixed(2);
		var num = value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

		return num;
	}

	return str;
	}
