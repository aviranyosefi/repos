function getAllInvContacts(getRecID) {

	var searchContacts = nlapiLoadSearch(null, 'customsearch_ilo_contact_invoice_search');

	searchContacts.addFilter( new nlobjSearchFilter('internalid', 'transaction', 'anyof', getRecID));
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


function getAllItems() {

	var searchItems= nlapiLoadSearch(null, 'customsearch_ilo_automail_item_search');

	var allItems = [];
	var items =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchItems.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allItems.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allItems != null) {
				allItems.forEach(function(line) {
					
					items.push(line.getValue('internalid'));
				
					
					
				});

			};
			
			return items;

	}
	

	var checkItems = getAllItems();
	var checkItemsLicense = [];
	//var allContacts = getAllInvContacts();
	
	var attachment;
	
	
function firstMailAfterSubmit(type){
		
	var getRecID = nlapiGetRecordId();
	
	var allContacts = getAllInvContacts(getRecID);
	
	var itemsArr = [];
	var itemName;
	var itemID;

		var lineCount = nlapiGetLineItemCount('item');
		if (lineCount > 0) {
			for (var i = 1; i <= lineCount; i++) {
				itemName = nlapiGetLineItemValue('item', 'name', i);
	itemsArr.push(itemName);
	itemID = nlapiGetLineItemValue('item', 'item', i);
	checkItemsLicense.push(itemID);
					}
					}
		
		//check if item invoice should include license dates or not
		
					
					
					var ticketItem = '6000010 Tickets';
					var zuoraReference = nlapiGetFieldValue('custbodyzuorareferencenumber');
					if(itemsArr.indexOf(ticketItem) == -1 && zuoraReference == "") {
  
///////////email variables///////////
	var fromUser;
	var mailSubsidiary;
	var senderFullName;
	var senderFirstName;
	var mailCC;
	var licenseOwner = nlapiGetFieldValue('custbody_ilo_license_owner');
	
	var licenseDates = 'License keys were sent to the following email address: '+licenseOwner+'.';
	
	var hasAttachment = nlapiGetFieldValue('custbody_ilo_invmail_attachment');
	
	var contactFirstName;
	var emailArr = [];
	
///////////email variables///////////	
	
	var context = nlapiGetContext();
	var currUser = '10160'//Natalie's user//  context.user; //internal id of sender (Marina, Natalie)
	var empRec = nlapiLoadRecord('employee', currUser);
	senderFullName = empRec.getFieldValue('altname'); //name of sender (Marina, Natalie)
	var splitName = senderFullName.split(' ');
	senderFirstName = splitName[0];
	var thisSubsidiary = nlapiGetFieldValue('subsidiary');
	if(thisSubsidiary == '1') {
		mailSubsidiary = "LTD";
		mailCC = ['ar.il@jfrog.com', 'salesops@jfrog.com'];
	}
	if(thisSubsidiary == '2') {
		mailSubsidiary = "INC";
		mailCC = ['ar@jfrog.com', 'salesops@jfrog.com'];;
	}
	if(thisSubsidiary == '4') {
		mailSubsidiary = "SAS";
		mailCC = ['ar.fr@jfrog.com', 'salesops@jfrog.com'];
	}
		
	var customerID = nlapiGetFieldValue('entity');
	var thisInvoice = nlapiGetRecordId();
	var thisInvoiceName = nlapiGetFieldValue('tranid');
	var thisInvoicePO = nlapiGetFieldValue('otherrefnum');
	
	var PO_statement = '';
	
	var noPO = ['Email Approval', 'Signed Quote'];
	
	if(noPO.indexOf(thisInvoicePO) == -1) {
		PO_statement = ' / PO#'+thisInvoicePO;
	}

	
	
	var thisInvoiceContacts = [];
	
	var thisCustomMessage = nlapiGetFieldValue('message');
	
	
	for(var x = 0; x<allContacts.length; x++) {
		
		if(allContacts[x].contact_inv == thisInvoiceName) {
			
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

	
	
	
	//var customerRec = nlapiLoadRecord('customer', customerID);
	var checkifMailed = nlapiGetFieldValue('custbody_ilo_invmail_yes_no_mailed');
	
	var sendFirstMail = nlapiGetFieldValue('custbody_ilo_invmail_firstmail');
	
	nlapiLogExecution('DEBUG', 'checkifMailed', checkifMailed);
	nlapiLogExecution('DEBUG', 'sendFirstMail', sendFirstMail);
	nlapiLogExecution('DEBUG', 'thisSubsidiary', thisSubsidiary);
	nlapiLogExecution('DEBUG', 'thisInvoiceContacts', JSON.stringify(thisInvoiceContacts));
	nlapiLogExecution('DEBUG', 'contactFirstName', JSON.stringify(contactFirstName));
	nlapiLogExecution('DEBUG', 'emailArr', JSON.stringify(emailArr));
	
	
	
if(sendFirstMail == 'T' && checkifMailed == "") {
	
	nlapiLogExecution('DEBUG', 'tosend', 'yes i would send');
	
	if(mailSubsidiary == "LTD") {
		
		var pleaseForward = ".";
		if(contactFirstName != 'AP') {
			pleaseForward = '. If you are not the correct contact, please forward this invoice to your AP department.<br>';
		}
		
		var addMessage = "";
		if(thisCustomMessage != "") {
				addMessage = '<br>'+thisCustomMessage+'<br>';
		}
		
		var addLicenseDates = '';
		var findOne = function (haystack, arr) {
		    return arr.some(function (v) {
		        return haystack.indexOf(v) >= 0;
		    });
		};

		var checklicenseDates = findOne(checkItems, checkItemsLicense);
		
		if(checklicenseDates == false) {
			addLicenseDates = '<br>License keys were sent to the following email address: '+licenseOwner+'.<br>';
		}
		
	var fromId = currUser; //Authors' Internal ID
	attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
	if(hasAttachment != "") {
		attachment = nlapiLoadFile(hasAttachment);
	}

	var sbj = 'JFrog LTD Invoice #'+thisInvoiceName+PO_statement;
	var msg = 'Dear '+contactFirstName+',<br><br> \n\rAttached please find JFrog LTD. invoice #'+thisInvoiceName+pleaseForward+addLicenseDates+'<br>Payment should be executed by a bank wire to our account (all detailed on top of the invoice).<br>'+addMessage+'<br>Feel free to contact us for any further information you may need.<br>Best regards,<br>'+senderFirstName+'<br><br><p style="color:#43a047;font-size:14px;">JFrog is keeping the environment green. For a hard copy invoice, please contact: <span style="color:#43a047;font-size:14px;text-decoration:underline;">ar.il@jfrog.com</span></p><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
	var attachRec = new Object(); 
	attachRec['entity']=customerID; //attach email to customer record
	attachRec['transaction']=thisInvoice; //attach email to invoice record
	//multiple email addresses
	//Recipient is a comma separated list of email addresses
		
	nlapiSendEmail(fromId,emailArr, sbj, msg, mailCC, null, attachRec, attachment);
	
	
	nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_yes_no_mailed', '1');
	nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_ogsender', senderFullName+'-'+currUser);
	}
	
	if(mailSubsidiary == "INC") {
		
		var pleaseForward = ".";
		if(contactFirstName != 'AP') {
			pleaseForward = '. If you are not the correct contact, please forward this invoice to your AP department.<br>';
		}
		
		var addMessage = "";
		if(thisCustomMessage != "") {
				addMessage = '<br>'+thisCustomMessage+'<br>';
		}
		
		var addLicenseDates = '';
		var findOne = function (haystack, arr) {
		    return arr.some(function (v) {
		        return haystack.indexOf(v) >= 0;
		    });
		};

		var checklicenseDates = findOne(checkItems, checkItemsLicense);
		
		if(checklicenseDates == false) {
			addLicenseDates = '<br>License keys were sent to the following email address: '+licenseOwner+'.<br>';
		}
		
		var fromId = currUser; //Authors' Internal ID
		attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
		if(hasAttachment != "") {
			attachment = nlapiLoadFile(hasAttachment);
		}
		var sbj = 'JFrog INC Invoice #'+thisInvoiceName+PO_statement;
		var msg = 'Dear '+contactFirstName+',<br><br> \n\rAttached please find JFrog INC. invoice #'+thisInvoiceName+pleaseForward+addLicenseDates+'<br>Payment can be made by an ACH/wire payment to our JFrog INC. bank account (details can be found on invoice).<br>'+addMessage+'<br>Feel free to contact us for any further information you may need.<br>Best regards,<br>'+senderFirstName+'<br><br><p style="color:#43a047;font-size:14px;">JFrog is keeping the environment green. For a hard copy invoice, please contact: <span style="color:#43a047;font-size:14px;text-decoration:underline;">ar@jfrog.com</span></p><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
		var attachRec = new Object(); 
		attachRec['entity']=customerID; //attach email to customer record
		attachRec['transaction']=thisInvoice; //attach email to invoice record
		//multiple email addresses
		//Recipient is a comma separated list of email addresses
		nlapiSendEmail(fromId,emailArr, sbj, msg, mailCC, null, attachRec, attachment);
		
		nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_yes_no_mailed', '1');
		nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_ogsender', senderFullName+'-'+currUser);
		}
	
	if(mailSubsidiary == "SAS") {
		
		var pleaseForward = ".";
		if(contactFirstName != 'AP') {
			pleaseForward = '. If you are not the correct contact, please forward this invoice to your AP department.<br>';
		}
		
		var addMessage = "";
		if(thisCustomMessage != "") {
				addMessage = '<br>'+thisCustomMessage+'<br>';
		}
		
		var addLicenseDates = '';
		var findOne = function (haystack, arr) {
		    return arr.some(function (v) {
		        return haystack.indexOf(v) >= 0;
		    });
		};

		var checklicenseDates = findOne(checkItems, checkItemsLicense);
		
		if(checklicenseDates == false) {
			addLicenseDates = '<br>License keys were sent to the following email address: '+licenseOwner+'.<br>';
		}
		
	var fromId = currUser; //Authors' Internal ID
	attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
	if(hasAttachment != "") {
		attachment = nlapiLoadFile(hasAttachment);
	}
	var sbj = 'JFrog SAS Invoice #'+thisInvoiceName+PO_statement;
	var msg = 'Dear '+contactFirstName+',<br><br> \n\rAttached please find JFrog SAS. invoice #'+thisInvoiceName+pleaseForward+addLicenseDates+'<br>Payment should be executed by a bank wire to our account (all detailed on top of the invoice).<br>'+addMessage+'<br>Feel free to contact us for any further information you may need.<br>Best regards,<br>'+senderFirstName+'<br><br><p style="color:#43a047;font-size:14px;">JFrog is keeping the environment green. For a hard copy invoice, please contact: <span style="color:#43a047;text-decoration:underline;">ar.fr@jfrog.com</span></p><br><span style="color:#43a047">'+senderFullName+' | Accounts Receivable | JFrog </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | Fax. <u>+972-9-8659977</u> </span><br><span style="color:#a9a9a9"> U.S Toll Free Number: <u>1-888-704-0670</u></span><br><br>';
	var attachRec = new Object(); 
	attachRec['entity']=customerID; //attach email to customer record
	attachRec['transaction']=thisInvoice; //attach email to invoice record
	//multiple email addresses
	//Recipient is a comma separated list of email addresses
	nlapiSendEmail(fromId,emailArr, sbj, msg, mailCC, null, attachRec, attachment);
	
	nlapiSubmitField('invoice', thisInvoice, ' custbody_ilo_invmail_yes_no_mailed', '1');
	nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_ogsender', senderFullName+'-'+currUser);
	
	}
}
	
}else{

	nlapiLogExecution('DEBUG', 'tosend', 'wouldnt send');
	
}

}
