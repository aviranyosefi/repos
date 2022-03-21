

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

		var searchContacts = nlapiLoadSearch(null,'customsearch_ilo_contact_search_all');

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
				
				var hasContacts = JSON.stringify(conts)

				if(hasContacts == '[]') {
					
					alert('This customer does not have any contacts.')
				};
				
				
				if(hasContacts != '[]') {
				var contactField = document.getElementById('inpt_contact32');
				var contactID_field = document.getElementById('hddn_contact32');
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

	}//check if company has contacts	
}//check if not new
}
