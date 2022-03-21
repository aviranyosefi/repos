


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

function contactAdderAction() {

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
				
				
				
				conts.push({		
				contactString : contString,
				contactID : contID,
				contactRole : contRole
				});
				}

				console.log(conts);

				
				
				
				var contactField = document.getElementById('contacts_contact_display');
				var contactID_field = document.getElementById('hddn_contacts_contact_fs');
				var roleField = document.getElementById('hddn_contactrole30');
				var addContact = document.getElementById('addcontact');


				
				
				var j = 0;                     
				function contactAdder () {          
				setTimeout(function () {    
  
	  
	  if(conts[j].contactRole === '1' ) {
	  
				contactField.value = conts[j].contactString;

				contactID_field.value = conts[j].contactID;

				roleField.value = '1';

				addContact.click();
				contactField.value = '';
	  
	  }
	  	  if(conts[j].contactRole === '2' ) {
	  
				contactField.value = conts[j].contactString;

				contactID_field.value = conts[j].contactID;

				roleField.value = '2';

				addContact.click();
				contactField.value = '';
	  
	  }
	  
	  
      j++;                     
      if (j < conts.length) {            
         contactAdder();            
      }                        
   }, 500);
}

contactAdder(); 

}
