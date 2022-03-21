	var attachmentID;
	
function spindat() {
	
	var recID;
	var attachmentID;
	var attachedInvoice;
	
	//sending first email;
	var context = nlapiGetContext();
	var currUser = context.user;
	
	recID = nlapiGetRecordId();


	nlapiSetFieldValue('custbody_ilo_invmail_firstmail', 'T', null, null);

	alert('Invoice is ready to email. Please save to contine\n\n***PLEASE NOTE***\r\rIf you do not want to email this invoice, click CANCEL, and do not save.');
	
	//checkForAttachments();

}






var thisInvoiceContacts = [];
var printContact = [];

var getCompanyID = nlapiGetFieldValue('entity');
var getTranID = nlapiGetFieldValue('tranid');

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
					contact_phone : line.getValue('phone'),
					contact_email : line.getValue('email'),
					contact_inv : invTranID,
				    contact_role : line.getValue('contactrole')
					
					});

					
				});

			};
			
			return invContacts;

	}




function contactAdderAction() {
	
	//checkForAttachments();
	
	var checkIfNew = nlapiGetRecordId();
	
//	alert('checkIfNew : ' + checkIfNew);
	if(checkIfNew == "") {
		alert('This invoice needs to be saved first before contacts can be added.')
	}
	
	if(checkIfNew != "") {
	
	
	var thisInvoiceContacts = [];
	var printContact = [];

	var getCompanyID = nlapiGetFieldValue('entity');

	function getAllInvContacts() {

		var searchContacts = nlapiLoadSearch(null,
				'customsearch_ilo_contact_search_all');

		var allcontacts = [];
		var invContacts = [];
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

				allcontacts
						.push(resultContacts[resultslice[rs].id] = resultslice[rs]);
				searchid++;
			}
		} while (resultslice.length >= 1000);

		if (allcontacts != null) {
			allcontacts.forEach(function(line) {


				invContacts.push({

						contact_id : line.getValue('internalid'),
						contact_name : line.getValue('entityid'),
						contact_company_id : line.getValue('company'),
						contact_company_name : line.getText('company'),
						contact_email : line.getValue('email'),
						contact_phone : line.getValue('phone'),
						contact_role : line.getValue('contactrole')

				});

			});

		};
		

		return invContacts;

	}
	


		var allContacts = getAllInvContacts();
		

	
					for(var x = 0; x<allContacts.length; x++) {
					
							
					if(allContacts[x].contact_company_id === getCompanyID ) {
						
						thisInvoiceContacts.push(allContacts[x]);
					}
					
				
				}


				var contString;
				var contID;
				var contRole;
				
				var conts = [];
				
				
				for(var i = 0; i<thisInvoiceContacts.length; i++) {
				
				
				contString = thisInvoiceContacts[i].contact_company_name+' : ' +thisInvoiceContacts[i].contact_name;
				contID = thisInvoiceContacts[i].contact_id;
				contRole =  thisInvoiceContacts[i].contact_role;
				contEmail = thisInvoiceContacts[i].contact_email;
				contPhone = thisInvoiceContacts[i].contact_phone;
				contName = thisInvoiceContacts[i].contact_name;
				
				
				
				conts.push({		
				contactString : contString,
				contactID : contID,
				contactRole : contRole,
				contactEmail : contEmail,
				contactName : contName,
				contactPhone : contPhone
				});
				}

				console.log(conts);

				
				
				
				var contactField = document.getElementById('contacts_contact_display');
				var contactID_field = document.getElementById('hddn_contacts_contact_fs');
				//var roleField = document.getElementById('hddn_contactrole23');
				//if (roleField == null) {
				//	roleField = document.getElementById('hddn_contactrole19');
				//}
      
     			 var roleField =  document.getElementsByName('contactrole');
      			 var roleFieldInput = roleField[0];
				var addContact = document.getElementById('addcontact');


				
				
				var j = 0;                     
				function contactAdder () {          
				setTimeout(function () {    
  
	  
	  if(conts[j].contactRole === '1' ) {
	  
				contactField.value = conts[j].contactString;

				contactID_field.value = conts[j].contactID;

				roleFieldInput.value = '1';

				addContact.click();
				contactField.value = '';
	  
	  }
	  	  if(conts[j].contactRole === '2' ) {
	  
				contactField.value = conts[j].contactString;

				contactID_field.value = conts[j].contactID;

				roleFieldInput.value = '2';

				addContact.click();
				contactField.value = '';
				
				var recID = nlapiGetRecordId();
				
				var fields = new Array();
				var values = new Array();
				fields[0] = 'custbody_ilo_jfrog_contact';
				values[0] = conts[j].contactID;
				fields[1] = 'custbody_ilo_contact_email';
				values[1] = conts[j].contactEmail;
				fields[2] = 'custbody_ilo_contact_phone';
				values[2] = conts[j].contactPhone;
				fields[3] = 'custbody_ilo_contact_name';
				values[3] = conts[j].contactName;
				
				
				nlapiSetFieldValue(fields[0], values[0]);
				nlapiSetFieldValue(fields[1], values[1]);
				nlapiSetFieldValue(fields[2], values[2]);
				nlapiSetFieldValue(fields[3], values[3]);
				
		
				
				
	  
	  }
	  
	  
      j++;                     
      if (j < conts.length) {            
         contactAdder();            
      }                        
   }, 500);
}

contactAdder(); 

	}	
}

//function checkForAttachments() {
//
//
//
//	function getAllDocs() {
//
//		var searchDocs = nlapiLoadSearch(null, 'customsearch_ilo_folder_saved_search');
//
//		var alldocs = [];
//		var invDocs =[];
//		var resultDocs = [];
//		var searchid = 0;
//		var resultset = searchDocs.runSearch();
//		var rs;
//
//		do {
//		    var resultslice = resultset.getResults(searchid, searchid + 1000);
//		    for (rs in resultslice) {
//		        
//				alldocs.push(resultDocs[resultslice[rs].id] = resultslice[rs]);
//		        searchid++;
//		    }
//		} while (resultslice.length >= 1000);
//
//				if (alldocs != null) {
//					alldocs.forEach(function(line) {
//						
//
//						invDocs.push({
//						
//						documentID : line.getValue('internalid', 'file'),
//						documentName : line.getValue('name', 'file'),
//		
//						
//						});
//
//					});
//
//				};
//				
//				return invDocs;
//
//		}
//		
//		
//		var allDocuments = getAllDocs();
//		
//		var currTranID = nlapiGetFieldValue('tranid');
//		var currEntity = nlapiGetFieldText('entity');
//		
//		console.log(currTranID);
//		console.log(currEntity);
//		console.log(allDocuments);
//		
//		
//		
//				for (var x = 0; x < allDocuments.length; x++) {
//
//					var currDoc = allDocuments[x].documentName;
//
//					if (currDoc.includes(currTranID)) {
//
//						var getId = nlapiGetRecordId();
//						var getType = nlapiGetRecordType();
//						attachmentID = allDocuments[x].documentID;
//						nlapiSetFieldValue('custbody_ilo_invmail_attachment', attachmentID, null, null);
//						//console.log(attachmentID)
//						//nlapiSubmitField(getType, parseInt(getId), 'custbody_ilo_invmail_attachment', attachmentID);
//
//					}
//
//				}
//		
//		
//		console.log(attachmentID);
//		
//		
//		if (!String.prototype.includes) {
//		String.prototype.includes = function(search, start) {
//			'use strict';
//			if (typeof start !== 'number') {
//				start = 0;
//			}
//
//			if (start + search.length > this.length) {
//				return false;
//			} else {
//				return this.indexOf(search, start) !== -1;
//			}
//		};
//	}
//
//
//}