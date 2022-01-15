function onPageInit() {
	
	var emailsToAdd = [];
	var contactList = nlapiGetLineItemCount('custpage_contacts_sublist');
	if (contactList > 0) {		
		for(var x = 0; x<contactList; x++) {		
			nlapiSetLineItemValue('custpage_contacts_sublist','custpage_tosend', x+1, 'T');
			emailsToAdd.push(nlapiGetLineItemValue('custpage_contacts_sublist','custpage_contact_email', x+1))
		}
	}

if(emailsToAdd != []) {
	

	
	for(var i = 0; i<emailsToAdd.length; i++) {
		
		var currentRecipients = nlapiGetFieldValue('custpage_recipient_email');
		
		var updatedRecipients;
		if(currentRecipients == '') {
			updatedRecipients = emailsToAdd[i]
		}
		if (currentRecipients != '')
			updatedRecipients = currentRecipients+','+emailsToAdd[i]
		
		var check = validateEmailField(updatedRecipients);
		nlapiSetFieldValue('custpage_recipient_email', check)
		
		
	}
}
	
}

function fieldChangeContacts(name, type) {

	
if(type == 'custpage_cc_myself') {
	
	var addMyself = nlapiGetFieldValue('custpage_cc_myself');
	var context = nlapiGetContext();
	var userMail = context.email;	
	var currentCC = nlapiGetFieldValue('custpage_cc_email')
	
	if(addMyself == 'T') {

		var updatedCC; 
		if(currentCC == '') {
			updatedCC = userMail
		}
		if (currentCC != '')
			updatedCC = currentCC+','+userMail
		nlapiSetFieldValue('custpage_cc_email', updatedCC)	
	}
	
	if(addMyself == 'F') {		
		var updatedCC = currentCC.replace(userMail, '')
		nlapiSetFieldValue('custpage_cc_email', updatedCC)	
	}
}



if(type == 'custpage_cbr_email') {
	
	var currentCC = nlapiGetFieldValue('custpage_cc_email')
	var cbrContactSelected = nlapiGetFieldValue('custpage_cbr_email')
	console.log(cbrContactSelected)
		var updatedCC; 
		if(currentCC == '') {
			updatedCC = cbrContactSelected
		}
		if (currentCC != '')
			updatedCC = currentCC+','+cbrContactSelected
		nlapiSetFieldValue('custpage_cc_email', updatedCC)
	}

if(type == 'custpage_select_template') {
	

var templateSelected = nlapiGetFieldValue('custpage_select_template')
if(templateSelected == '') {
	
	nlapiSetFieldValue('custpage_email_body', '')
}else{
	
	var tempRec = nlapiLoadRecord('emailtemplate', templateSelected)
	var custpage_email_body = tempRec.getFieldValue('content')

	nlapiSetFieldValue('custpage_email_body', custpage_email_body)
	console.log('template selected', templateSelected);
	
}


}




}


function validateContactLine() {
	
	var checkSendTo = nlapiGetCurrentLineItemValue('custpage_contacts_sublist', 'custpage_tosend');
	var checkAddCC = nlapiGetCurrentLineItemValue('custpage_contacts_sublist', 'custpage_tocc');
	
	var emailToAdd = nlapiGetCurrentLineItemValue('custpage_contacts_sublist', 'custpage_contact_email');
	
	var currentRecipients = nlapiGetFieldValue('custpage_recipient_email');
	var currentCC = nlapiGetFieldValue('custpage_cc_email');
	
	if(checkSendTo == 'T') {
		
		if(currentRecipients.indexOf(emailToAdd) != -1) {
			alert('This contact is already listed as a recipient')
		}
		else{
			var updatedRecipients;
			if(currentRecipients == '') {
				updatedRecipients = emailToAdd
			}
			if (currentRecipients != '')
				updatedRecipients = currentRecipients+','+emailToAdd
			
			var check = validateEmailField(updatedRecipients);
			nlapiSetFieldValue('custpage_recipient_email', check)
		}
	}
	if(checkSendTo == 'F') {
			var updatedRecipients;
			updatedRecipients = currentRecipients.replace(emailToAdd, '');
			
			var check = validateEmailField(updatedRecipients);
			nlapiSetFieldValue('custpage_recipient_email', check)

	}
	if(checkAddCC == 'T') {
		
		if(currentCC.indexOf(emailToAdd) != -1) {
			alert('This contact is already listed as a CC')
		}
		else{
			var updatedCC; 
			if(currentCC == '') {
				updatedCC = emailToAdd
			}
			if (currentCC != '')
				updatedCC = currentCC+','+emailToAdd
			
				var check = validateEmailField(updatedCC);
				nlapiSetFieldValue('custpage_cc_email', check)

		}
	}
	if(checkAddCC == 'F') {
			var updatedCC; 
				updatedCC = currentCC.replace(emailToAdd, '');
			
				var check = validateEmailField(updatedCC);
				nlapiSetFieldValue('custpage_cc_email', check)
	}
	
	
	return true;
}



function validateEmailField(currentEmails) {

	//console.log('validate : ' +currentRecipients)
	var emailArr = [];
	var cleanStr = '';	
	if (currentEmails != '' || currentEmails != null || currentEmails != undefined) {
		
		var recipArr = currentEmails.split(',')
		//console.log(recipArr)
		if (recipArr != []) {
			
			for(var i = 0; i<recipArr.length; i++) {
				
				if(recipArr[i] != "") {
					
					emailArr.push(recipArr[i])
				}
			}

		}

	}

	res = emailArr.join()
	return res;
	
}

function previewInvoice() {
	try{
		var previewID = nlapiGetFieldValue('custpage_preview_invid');
		if(previewID != '' || previewID != null) {
			
			var fileID = previewID.split('.')
			
			previewMedia(fileID[0],false,true)	
		}
	}catch(err) {
		
		alert('An error occured while trying to preview this Invoice - please refresh the screen and try again.')
	}
	 
	
}