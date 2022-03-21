function getAllInvContacts() {

	var searchContacts = nlapiLoadSearch(null, 'customsearch_ilo_contact_invoice_search');

	var allcontacts = [];
	var invContacts =[];
	var resultContacts = [];
	var searchid = 0;
	var resultset = searchContacts.runSearch();
	var rs;
	
	var tranName;
	var tranNameArr;
	var invTranID;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allcontacts.push(resultContacts[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allcontacts != null) {
				allcontacts.forEach(function(line) {
					
					tranName = line.getValue('transactionname', 'transaction');
					tranNameArr = tranName.split('#');
					invTranID = tranNameArr[1];
					
					invContacts.push({
					
					contact_id : line.getValue('internalid'),
					contact_name : line.getValue('entityid'),
					contact_company : line.getValue('company'),
					contact_email : line.getValue('email'),
					contact_inv : invTranID
					
					});
		
				
					
					
				});

			};
			
			return invContacts;

	}
	

var invForLTDSAS = [];
var invForINC = [];


var firstFollow = [];
var secondFollow = [];
var afterdueThree = [];
var afterdueWeek = [];
var afterdueTwoWeek = [];

function getInvPool() {

	var searchPool = nlapiLoadSearch(null, 'customsearch_ilo_jfrog_invoice_search');

	var allinv = [];
	var invPool =[];
	var resultDocs = [];
	var searchid = 0;
	var resultset = searchPool.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allinv.push(resultDocs[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allinv != null) {
				allinv.forEach(function(line) {
					
					var defaultSender = line.getValue('custbody_ilo_invmail_ogsender');
					if(defaultSender == '') {
						defaultSender = 'Natalie Ribco-10160';
					}
					

					invPool.push({
					
						inv_created : line.getValue('trandate'),
						inv_duedate : line.getValue('duedate'),
						inv_id : line.id,
						inv_subsidiary : line.getValue('subsidiary'),
						inv_terms : line.getText('terms'),
						invdays_open : line.getValue('daysopen'),
					    invdays_overdue : line.getValue('daysoverdue'),
					    inv_name : line.getText('name'),
					    inv_hasAttachment: line.getValue('custbody_ilo_invmail_attachment'),
					    inv_tranid : line.getValue('tranid'),
					    inv_po : line.getValue('otherrefnum'),
					    inv_ogSender : defaultSender,
					    inv_customerID : line.getValue('internalid', 'customer'),
					    inv_licenseOwner : line.getValue('custbody_ilo_license_owner'),
					    inv_sendToLicenseOwner : line.getValue('custbody_ilo_invmail_sendtoowner')
	
					});

				});

			};
			
			return invPool;

	}
	
	


function invmail_sender_ltd_sas(type) {
	
	var poolMain = getInvPool();

	var currDueDate;
	
	//var sendToLicenseOwner = nlapiGetFieldValue('custbody_ilo_invmail_sendtoowner');
	
	
	
	

	for (var i = 0; i < poolMain.length; i++) {
		
		
		
		//first follow-up
		if (poolMain[i].invdays_open == 7) {
			if(poolMain[i].inv_subsidiary != '2' ) {
				
				invForLTDSAS.push(poolMain[i].inv_id);
			}


		
		}

		//first alert
		if (poolMain[i].invdays_overdue == 3) {
			if(poolMain[i].inv_subsidiary != '2' ) {
				
				invForLTDSAS.push(poolMain[i].inv_id);
			}


			
		}
		//second alert
		if (poolMain[i].invdays_overdue == 10) {

			if(poolMain[i].inv_subsidiary != '2' ) {
				
				invForLTDSAS.push(poolMain[i].inv_id);
			}
		}
		//third alert
		if (poolMain[i].invdays_overdue == 17) {
			if(poolMain[i].inv_subsidiary != '2' ) {
				
				invForLTDSAS.push(poolMain[i].inv_id);
			}
		}

		
		//second follow-up
		////add week before due date/////////
		
		currDueDate = poolMain[i].inv_duedate;
		var myDate = nlapiStringToDate(currDueDate);

		var months = myDate.getMonth();
		var days = myDate.getDate();


		var today=new Date();

		var daysBeforeDueDate =new Date(today.getFullYear(), months, days); //Month is 0-11 in JavaScript
		//Set 1 day in milliseconds
		var one_day=1000*60*60*24;
		 
		 
		var daysBefore = Math.ceil((daysBeforeDueDate.getTime()-today.getTime())/(one_day));
		
if(daysBefore == 7) {
	if(poolMain[i].inv_subsidiary != '2' ) {
		
		invForLTDSAS.push(poolMain[i].inv_id);
	}

}
	}
	
	var ToSend =[];
	

	var allContacts = getAllInvContacts();
	var attachment;
	


	nlapiLogExecution('DEBUG', 'invForLTDSAS', invForLTDSAS);
	
	if(invForLTDSAS != []) {

	var inArr = invForLTDSAS;
	

		for (var x = 0; x < poolMain.length; x++) {
		for (var i = 0; i < inArr.length; i++) {

			if (inArr[i] == poolMain[x].inv_id) {

				ToSend.push(poolMain[x]);
			}
		}
	}
	
	
	for (var i = 0; i < ToSend.length; i++) {
		
		
		
		//first follow-up
		if (ToSend[i].invdays_open == 7) {

			firstFollow.push(ToSend[i]);
		}

		//first alert
		if (ToSend[i].invdays_overdue == 3) {

			afterdueThree.push(ToSend[i]);
			
		}
		//second alert
		if (ToSend[i].invdays_overdue == 10) {

			afterdueWeek.push(ToSend[i]);
		}
		
		//third alert
		if (ToSend[i].invdays_overdue == 17) {

			afterdueTwoWeek.push(ToSend[i]);
		}

		
		//second follow-up
		////add week before due date/////////
		
		currDueDate = ToSend[i].inv_duedate;
		var myDate = nlapiStringToDate(currDueDate);

		var months = myDate.getMonth();
		var days = myDate.getDate();


		var today=new Date();

		var daysBeforeDueDate =new Date(today.getFullYear(), months, days); //Month is 0-11 in JavaScript
		//Set 1 day in milliseconds
		var one_day=1000*60*60*24;
		 
		 
		var daysBefore = Math.ceil((daysBeforeDueDate.getTime()-today.getTime())/(one_day));
		
if(daysBefore == 7) {

	secondFollow.push(ToSend[i]);
}
	}
	

//	nlapiLogExecution("DEBUG", 'ToSend', JSON.stringify(ToSend));
//	nlapiLogExecution("DEBUG", 'pool', JSON.stringify(pool));
//	nlapiLogExecution("DEBUG", 'inArr', JSON.stringify(inArr));
	
	nlapiLogExecution('DEBUG', 'firstFollow', firstFollow);
	nlapiLogExecution('DEBUG', 'secondFollow', secondFollow);
	nlapiLogExecution('DEBUG', 'afterdueThree', JSON.stringify(afterdueThree));
	nlapiLogExecution('DEBUG', 'afterdueWeek', JSON.stringify(afterdueWeek));
	nlapiLogExecution('DEBUG', 'afterdueTwoWeek', afterdueTwoWeek);
	
	
	
/////////////email variables///////////
	var fromUser;
	var mailSubsidiary;
	var senderFullName;
	var senderFirstName;
	//var mailCC = 'ar.il@jfrog.com';
	//var licenseOwner = nlapiGetFieldValue('custbody_ilo_license_owner');
	
	//var hasAttachment = nlapiGetFieldValue('custbody_ilo_invmail_attachment');
	
	var contactFirstName;

	
	if(firstFollow !=[]) {
		

		
		firstFollow.forEach(function(invoice) {
		   // console.log(element);
			//var oneINV = nlapiLoadRecord('invoice', parseInt(invoice.inv_id));
			var mailSubsidiary;
			var thisInvoiceContacts = [];
			

			
			var emailArr = [];
			
			if(invoice.inv_sendToLicenseOwner == 'T') {
				emailArr.push(invoice.inv_licenseOwner);
			}
			
			var attachment;
			
			var daysOverDue = invoice.invdays_overdue+' days overdue';
			var thisDueDate = invoice.inv_duedate;
			
			var thisInvoice = invoice.inv_id;
			
			var customerID = invoice.inv_customerID;
			
		
			var sendDetails = invoice.inv_ogSender;
			var splitName = sendDetails.split('-');
			var senderFullName = splitName[0];
			var senderID = splitName[1];

			var senderName = senderFullName.split(' ');
			var senderFirstName = senderName[0];
			
			var hasAttachment = invoice.inv_hasAttachment;
			var thisInvoiceName = invoice.inv_tranid;
			var thisInvoicePO = invoice.inv_po; 
			
			var PO_statement = '';
			
			var noPO = ['Email Approval', 'Signed Quote'];
			
			if(noPO.indexOf(thisInvoicePO) == -1) {
				PO_statement = ' / PO#'+thisInvoicePO;
			}

			
			if(invoice.inv_subsidiary == '1') {
				mailSubsidiary = 'LTD';
			}
			if(invoice.inv_subsidiary == '4') {
				mailSubsidiary = 'SAS';
			}
			for(var x = 0; x<allContacts.length; x++) {
				
				if(allContacts[x].contact_inv == invoice.inv_tranid) {
					
					thisInvoiceContacts.push(allContacts[x]);
				}
				
			}
			
			for(var i = 0; i<thisInvoiceContacts.length; i++) {
				
				if(thisInvoiceContacts.length > 1) {
					
					contactFirstName = 'AP';
					emailArr.push(thisInvoiceContacts[i].contact_email);
				}
				else{
					var contactFullName = thisInvoiceContacts[i].contact_name;
					var nameArr = contactFullName.split(" ");
					contactFirstName = nameArr[0];
					emailArr.push(thisInvoiceContacts[i].contact_email);
				}
			}

			
			if(mailSubsidiary == "LTD") {

							
			var fromId = senderID; //Authors' Internal ID
			attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
			if(hasAttachment != "") {
				attachment = nlapiLoadFile(hasAttachment);
			}

			var sbj = 'JFrog LTD Invoice #'+thisInvoiceName+PO_statement+ ' � Follow up';
			var msg = 'Dear '+contactFirstName+',<br><br> \n\rI hope this e-mail finds you well.<br><br>I would like to follow up with you, and make sure that you received invoice #'+thisInvoiceName+' sent to you via email.<br>Please let me know if there is any further information you may need.<br><br>Your reply and updates will be greatly appreciated.<br><br>Best regards,<br>'+senderFirstName+'<br><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
			var attachRec = new Object(); 
			attachRec['entity']=customerID; //attach email to customer record
			attachRec['transaction']=thisInvoice; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
				
			nlapiSendEmail(fromId,emailArr, sbj, msg, null, null, attachRec, attachment);
			
			
			}
			
			if(mailSubsidiary == "SAS") {
				

							
			var fromId = senderID; //Authors' Internal ID
			attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
			if(hasAttachment != "") {
				attachment = nlapiLoadFile(hasAttachment);
			}

			var sbj = 'JFrog SAS Invoice #'+thisInvoiceName+PO_statement+ ' � Follow up';
			var msg = 'Dear '+contactFirstName+',<br><br> \n\rI hope this e-mail finds you well.<br><br>I would like to follow up with you, and make sure that you received invoice #'+thisInvoiceName+' sent to you via email.<br>Please let me know if there is any further information you may need.<br><br>Your reply and updates will be greatly appreciated.<br><br>Best regards,<br>'+senderFirstName+'<br><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
			var attachRec = new Object(); 
			attachRec['entity']=customerID; //attach email to customer record
			attachRec['transaction']=thisInvoice; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
				
			nlapiSendEmail(fromId,emailArr, sbj, msg, null, null, attachRec, attachment);
			
			
			}
			
		});
		
		
	}
	
	if(secondFollow !=[]) {
		

		
		secondFollow.forEach(function(invoice) {
		   // console.log(element);
			//var oneINV = nlapiLoadRecord('invoice', parseInt(invoice.inv_id));
			var mailSubsidiary;
			var thisInvoiceContacts = [];
			
			var emailArr = [];
			
			if(invoice.inv_sendToLicenseOwner == 'T') {
				emailArr.push(invoice.inv_licenseOwner);
			}
			
			var attachment;
			
			var daysOverDue = invoice.invdays_overdue+' days overdue';
			var thisDueDate = invoice.inv_duedate;
			
			

			var dateObj = nlapiStringToDate(thisDueDate);
			var getMonth = dateObj.getMonth();
			var getDay = dateObj.getDate();
			var dayString = getDay.toString();
			var lastChar = dayString.substr(dayString.length - 1); // => "1"
		

			var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



			var dueDateFormat = months[getMonth]+' '+dayString;
			
			
			
			var thisInvoice = invoice.inv_id;
			
			var customerID = invoice.inv_customerID;
			
		
			var sendDetails = invoice.inv_ogSender;
			var splitName = sendDetails.split('-');
			var senderFullName = splitName[0];
			var senderID = splitName[1];

			var senderName = senderFullName.split(' ');
			var senderFirstName = senderName[0];
			
			var hasAttachment = invoice.inv_hasAttachment;
			var thisInvoiceName = invoice.inv_tranid;
			var thisInvoicePO = invoice.inv_po; 
			
			var PO_statement = '';
			
			var noPO = ['Email Approval', 'Signed Quote'];
			
			if(noPO.indexOf(thisInvoicePO) == -1) {
				PO_statement = ' / PO#'+thisInvoicePO;
			}

			if(invoice.inv_subsidiary == '1') {
				mailSubsidiary = 'LTD';
			}
			if(invoice.inv_subsidiary == '4') {
				mailSubsidiary = 'SAS';
			}
			for(var x = 0; x<allContacts.length; x++) {
				
				if(allContacts[x].contact_inv == invoice.inv_tranid) {
					
					thisInvoiceContacts.push(allContacts[x]);
				}
				
			}
			
			for(var i = 0; i<thisInvoiceContacts.length; i++) {
				
				if(thisInvoiceContacts.length > 1) {
					
					contactFirstName = 'AP';
					emailArr.push(thisInvoiceContacts[i].contact_email);
				}
				else{
					var contactFullName = thisInvoiceContacts[i].contact_name;
					var nameArr = contactFullName.split(" ");
					contactFirstName = nameArr[0];
					emailArr.push(thisInvoiceContacts[i].contact_email);
				}
			}

			
			if(mailSubsidiary == "LTD") {

							
			var fromId = senderID; //Authors' Internal ID
			attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
			if(hasAttachment != "") {
				attachment = nlapiLoadFile(hasAttachment);
			}

			var sbj = 'JFrog LTD Invoice #'+thisInvoiceName+PO_statement+ ' � Reminder';
			var msg = 'Dear '+contactFirstName+',<br><br> \n\rI hope this e-mail finds you well.<br><br>I would like to follow up with you, and make sure that you received invoice #'+thisInvoiceName+' expected to be due in about a week - '+dueDateFormat+'.<br><br>Your confirmation will be greatly appreciated.<br>Best regards,<br>'+senderFirstName+'<br><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
			var attachRec = new Object(); 
			attachRec['entity']=customerID; //attach email to customer record
			attachRec['transaction']=thisInvoice; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
				
			nlapiSendEmail(fromId,emailArr, sbj, msg, null, null, attachRec, attachment);
			
			
			}
			
			if(mailSubsidiary == "SAS") {
				
							
			var fromId = senderID; //Authors' Internal ID
			attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
			if(hasAttachment != "") {
				attachment = nlapiLoadFile(hasAttachment);
			}

			var sbj = 'JFrog SAS Invoice #'+thisInvoiceName+PO_statement+ ' � Reminder';
			var msg = 'Dear '+contactFirstName+',<br><br> \n\rI hope this e-mail finds you well.<br><br>I would like to follow up with you, and make sure that you received invoice #'+thisInvoiceName+' expected to be due in about a week - '+dueDateFormat+'.<br><br>Your confirmation will be greatly appreciated.<br>Best regards,<br>'+senderFirstName+'<br><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
			var attachRec = new Object(); 
			attachRec['entity']=customerID; //attach email to customer record
			attachRec['transaction']=thisInvoice; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
				
			nlapiSendEmail(fromId,emailArr, sbj, msg, null, null, attachRec, attachment);
			
			
			}
			
		});
		
		
	}

	if(afterdueThree !=[]) {
		

		
		afterdueThree.forEach(function(invoice) {
		   // console.log(element);
			//var oneINV = nlapiLoadRecord('invoice', parseInt(invoice.inv_id));
			var mailSubsidiary;
			var thisInvoiceContacts = [];
			
			var emailArr = [];
			
			if(invoice.inv_sendToLicenseOwner == 'T') {
				emailArr.push(invoice.inv_licenseOwner);
			}
			
			var attachment;
			
			var daysOverDue = invoice.invdays_overdue+' days overdue';
			var thisDueDate = invoice.inv_duedate;
			
			var dateObj = nlapiStringToDate(thisDueDate);
			var getMonth = dateObj.getMonth();
			var getDay = dateObj.getDate();
			var dayString = getDay.toString();
			var lastChar = dayString.substr(dayString.length - 1); // => "1"
		

			var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


			var dueDateFormat = months[getMonth]+' '+dayString;
			
			var thisInvoice = invoice.inv_id;
			
			var customerID = invoice.inv_customerID;
			
			var thisInvoiceTerms =' ('+invoice.inv_terms+')';
			
		
			var sendDetails = invoice.inv_ogSender;
			var splitName = sendDetails.split('-');
			var senderFullName = splitName[0];
			var senderID = splitName[1];

			var senderName = senderFullName.split(' ');
			var senderFirstName = senderName[0];
			
			var hasAttachment = invoice.inv_hasAttachment;
			var thisInvoiceName = invoice.inv_tranid;
			var thisInvoicePO = invoice.inv_po; 
			
			var PO_statement = '';
			
			var noPO = ['Email Approval', 'Signed Quote'];
			
			if(noPO.indexOf(thisInvoicePO) == -1) {
				PO_statement = ' / PO#'+thisInvoicePO;
			}

			
			if(invoice.inv_subsidiary == '1') {
				mailSubsidiary = 'LTD';
			}
			if(invoice.inv_subsidiary == '4') {
				mailSubsidiary = 'SAS';
			}
			for(var x = 0; x<allContacts.length; x++) {
				
				if(allContacts[x].contact_inv == invoice.inv_tranid) {
					
					thisInvoiceContacts.push(allContacts[x]);
				}
				
			}
			
			for(var i = 0; i<thisInvoiceContacts.length; i++) {
				
				if(thisInvoiceContacts.length > 1) {
					
					contactFirstName = 'AP';
					emailArr.push(thisInvoiceContacts[i].contact_email);
				}
				else{
					var contactFullName = thisInvoiceContacts[i].contact_name;
					var nameArr = contactFullName.split(" ");
					contactFirstName = nameArr[0];
					emailArr.push(thisInvoiceContacts[i].contact_email);
				}
			}
			
			if(mailSubsidiary == "LTD") {
											
			var fromId = senderID; //Authors' Internal ID
			attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
			if(hasAttachment != "") {
				attachment = nlapiLoadFile(hasAttachment);
			}

			var sbj = 'JFrog LTD Invoice #'+thisInvoiceName+PO_statement+ ' � Invoice Past Due';
			var msg = 'Dear '+contactFirstName+',<br><br> \n\rI would like to inform you that we have not received payment per invoice #'+thisInvoiceName+'.<br>Please update us with payment status. Kindly note that payment due date was '+dueDateFormat+thisInvoiceTerms+'.<br><br>Thanks in advance,<br>'+senderFirstName+'<br><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
			var attachRec = new Object(); 
			attachRec['entity']=customerID; //attach email to customer record
			attachRec['transaction']=thisInvoice; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
				
			nlapiSendEmail(fromId,emailArr, sbj, msg, null, null, attachRec, attachment);
			
			
			}
			
			if(mailSubsidiary == "SAS") {
						
			var fromId = senderID; //Authors' Internal ID
			attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
			if(hasAttachment != "") {
				attachment = nlapiLoadFile(hasAttachment);
			}

			var sbj = 'JFrog SAS Invoice #'+thisInvoiceName+PO_statement+ ' � Invoice Past Due';
			var msg = 'Dear '+contactFirstName+',<br><br> \n\rI would like to inform you that we have not received payment per invoice #'+thisInvoiceName+'.<br>Please update us with payment status. Kindly note that payment due date was '+dueDateFormat+thisInvoiceTerms+'.<br><br>Thanks in advance,<br>'+senderFirstName+'<br><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
			var attachRec = new Object(); 
			attachRec['entity']=customerID; //attach email to customer record
			attachRec['transaction']=thisInvoice; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
				
			nlapiSendEmail(fromId,emailArr, sbj, msg, null, null, attachRec, attachment);
			
			}
			
			
		});
		
		
	}
	
	if(afterdueWeek !=[]) {
		

		
		afterdueWeek.forEach(function(invoice) {
		   // console.log(element);
			//var oneINV = nlapiLoadRecord('invoice', parseInt(invoice.inv_id));
			var mailSubsidiary;
			var thisInvoiceContacts = [];
			
			var emailArr = [];
			
			if(invoice.inv_sendToLicenseOwner == 'T') {
				emailArr.push(invoice.inv_licenseOwner);
			}
			
			var attachment;
			
			var daysOverDue = invoice.invdays_overdue+' days overdue';
			var thisDueDate = invoice.inv_duedate;
			
			var dateObj = nlapiStringToDate(thisDueDate);
			var getMonth = dateObj.getMonth();
			var getDay = dateObj.getDate();
			var dayString = getDay.toString();
			var lastChar = dayString.substr(dayString.length - 1); // => "1"
		

			var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	

			var dueDateFormat = months[getMonth]+' '+dayString;
			
			var thisInvoice = invoice.inv_id;
			
			var customerID = invoice.inv_customerID;
			
		
			var sendDetails = invoice.inv_ogSender;
			var splitName = sendDetails.split('-');
			var senderFullName = splitName[0];
			var senderID = splitName[1];

			var senderName = senderFullName.split(' ');
			var senderFirstName = senderName[0];
			
			var hasAttachment = invoice.inv_hasAttachment;
			var thisInvoiceName = invoice.inv_tranid;
			var thisInvoicePO = invoice.inv_po; 
			
			var PO_statement = '';
			
			var noPO = ['Email Approval', 'Signed Quote'];
			
			if(noPO.indexOf(thisInvoicePO) == -1) {
				PO_statement = ' / PO#'+thisInvoicePO;
			}

			
			if(invoice.inv_subsidiary == '1') {
				mailSubsidiary = 'LTD';
			}
			if(invoice.inv_subsidiary == '4') {
				mailSubsidiary = 'SAS';
			}
			for(var x = 0; x<allContacts.length; x++) {
				
				if(allContacts[x].contact_inv == invoice.inv_tranid) {
					
					thisInvoiceContacts.push(allContacts[x]);
				}
				
			}
			
			for(var i = 0; i<thisInvoiceContacts.length; i++) {
				
				if(thisInvoiceContacts.length > 1) {
					
					contactFirstName = 'AP';
					emailArr.push(thisInvoiceContacts[i].contact_email);
				}
				else{
					var contactFullName = thisInvoiceContacts[i].contact_name;
					var nameArr = contactFullName.split(" ");
					contactFirstName = nameArr[0];
					emailArr.push(thisInvoiceContacts[i].contact_email);
				}

			}
			
			if(mailSubsidiary == "LTD") {
				
							
			var fromId = senderID; //Authors' Internal ID
			attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
			if(hasAttachment != "") {
				attachment = nlapiLoadFile(hasAttachment);
			}

			var sbj = 'JFrog LTD Invoice #'+thisInvoiceName+PO_statement+ ' � Invoice Past Due - 2nd Reminder';
			var msg = 'Dear '+contactFirstName+',<br><br> \n\rUnfortunately we still have not received payment per invoice #'+thisInvoiceName+' which is <b>'+daysOverDue+'</b> - due date was '+dueDateFormat+'.<br><br>Please complete payment ASAP.<br><br>Best regards,<br>'+senderFirstName+'<br><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
			var attachRec = new Object(); 
			attachRec['entity']=customerID; //attach email to customer record
			attachRec['transaction']=thisInvoice; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
				
			nlapiSendEmail(fromId,emailArr, sbj, msg, null, null, attachRec, attachment);
			
			
			}
			
			if(mailSubsidiary == "SAS") {
				
							
			var fromId = senderID; //Authors' Internal ID
			attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
			if(hasAttachment != "") {
				attachment = nlapiLoadFile(hasAttachment);
			}

			var sbj = 'JFrog SAS Invoice #'+thisInvoiceName+PO_statement+ ' � Invoice Past Due - 2nd Reminder';
			var msg = 'Dear '+contactFirstName+',<br><br> \n\rUnfortunately we still have not received payment per invoice #'+thisInvoiceName+' which is <b>'+daysOverDue+'</b> - due date was '+dueDateFormat+'.<br><br>Please complete payment ASAP.<br><br>Best regards,<br>'+senderFirstName+'<br><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
			var attachRec = new Object(); 
			attachRec['entity']=customerID; //attach email to customer record
			attachRec['transaction']=thisInvoice; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
				
			nlapiSendEmail(fromId,emailArr, sbj, msg, null, null, attachRec, attachment);
			
			}
			
		
			
		});
		
		
	}
	

	if(afterdueTwoWeek !=[]) {
		

		
		afterdueTwoWeek.forEach(function(invoice) {
		   // console.log(element);
			//var oneINV = nlapiLoadRecord('invoice', parseInt(invoice.inv_id));
			var mailSubsidiary;
			var thisInvoiceContacts = [];
			
			var emailArr = [];
				
			if(invoice.inv_sendToLicenseOwner == 'T') {
				emailArr.push(invoice.inv_licenseOwner);
			}
			
			var attachment;
			
			var daysOverDue = invoice.invdays_overdue+' days overdue';
			var thisDueDate = invoice.inv_duedate;
			
			var thisInvoice = invoice.inv_id;
			
			var customerID = invoice.inv_customerID;
			
		
			var sendDetails = invoice.inv_ogSender;
			var splitName = sendDetails.split('-');
			var senderFullName = splitName[0];
			var senderID = splitName[1];

			var senderName = senderFullName.split(' ');
			var senderFirstName = senderName[0];
			
			var hasAttachment = invoice.inv_hasAttachment;
			var thisInvoiceName = invoice.inv_tranid;
			var thisInvoicePO = invoice.inv_po; 
			
			var PO_statement = '';
			
			var noPO = ['Email Approval', 'Signed Quote'];
			
			if(noPO.indexOf(thisInvoicePO) == -1) {
				PO_statement = ' / PO#'+thisInvoicePO;
			}

			
			if(invoice.inv_subsidiary == '1') {
				mailSubsidiary = 'LTD';
			}
			if(invoice.inv_subsidiary == '4') {
				mailSubsidiary = 'SAS';
			}
			for(var x = 0; x<allContacts.length; x++) {
				
				if(allContacts[x].contact_inv == invoice.inv_tranid) {
					
					thisInvoiceContacts.push(allContacts[x]);
				}
				
			}
			
			for(var i = 0; i<thisInvoiceContacts.length; i++) {
				
				if(thisInvoiceContacts.length > 1) {
					
					contactFirstName = 'AP';
					emailArr.push(thisInvoiceContacts[i].contact_email);
				}
				else{
					var contactFullName = thisInvoiceContacts[i].contact_name;
					var nameArr = contactFullName.split(" ");
					contactFirstName = nameArr[0];
					emailArr.push(thisInvoiceContacts[i].contact_email);
				}
			}//loop over contacts (might need to move it up and close the loop first)
			
			if(mailSubsidiary == "LTD") {
				
				var pleaseForward = "";
				if(contactFirstName != 'AP') {
					pleaseForward = ' If you are not the correct contact, please forward this invoice to your AP department.';
				}
							
			var fromId = senderID; //Authors' Internal ID
			attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
			if(hasAttachment != "") {
				attachment = nlapiLoadFile(hasAttachment);
			}

			var sbj = 'JFrog LTD Invoice #'+thisInvoiceName+PO_statement+ ' � Invoice Past Due - 3rd Alert';
			var msg = 'Dear '+contactFirstName+',<br><br> \n\rWe have tried reaching you numerous times with regards to the unpaid invoice.<br>This has now become critical for us, your urgent attention to this matter will be greatly appreciated.<br><br>Thank you in advance for your prompt response.<br><br>Looking forward to your reply.<br>Best regards,<br>'+senderFirstName+'<br><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
			var attachRec = new Object(); 
			attachRec['entity']=customerID; //attach email to customer record
			attachRec['transaction']=thisInvoice; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
				
			nlapiSendEmail(fromId,emailArr, sbj, msg, null, null, attachRec, attachment);
			
			
			}
			
			if(mailSubsidiary == "SAS") {
				
				var pleaseForward = "";
				if(contactFirstName != 'AP') {
					pleaseForward = ' If you are not the correct contact, please forward this invoice to your AP department.';
				}
							
			var fromId = senderID; //Authors' Internal ID
			attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
			if(hasAttachment != "") {
				attachment = nlapiLoadFile(hasAttachment);
			}

			var sbj = 'JFrog SAS Invoice #'+thisInvoiceName+PO_statement+ ' � Invoice Past Due - 3rd Alert';
			var msg = 'Dear '+contactFirstName+',<br><br> \n\rWe have tried reaching you numerous times with regards to the unpaid invoice.<br>This has now become critical for us, your urgent attention to this matter will be greatly appreciated.<br><br>Thank you in advance for your prompt response.<br><br>Looking forward to your reply.<br>Best regards,<br>'+senderFirstName+'<br><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
			var attachRec = new Object(); 
			attachRec['entity']=customerID; //attach email to customer record
			attachRec['transaction']=thisInvoice; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
				
			nlapiSendEmail(fromId,emailArr, sbj, msg, null, null, attachRec, attachment);
			
			}
			
			
		});
		
		
	}
	
	}
}
