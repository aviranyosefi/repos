var thisInvoiceContacts = [];
var printContact = [];



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


function setContactsToInvoice(type) {
	
	var context = nlapiGetContext();
	var invoiceID = context.getSetting('SCRIPT', 'custscript_ilo_invoice_id');
	
	nlapiLogExecution('DEBUG', 'checks', 'this is the invoice id ' + invoiceID);
	
	
	var rec = nlapiLoadRecord('invoice', invoiceID);
	var getCompanyID = rec.getFieldValue('entity');
	var getTranID = rec.getFieldValue('tranid');
	
	var allContacts = getAllInvContacts();
	
		for (var x = 0; x < allContacts.length; x++) {
	
			if ((allContacts[x].contact_company === getCompanyID) && (allContacts[x].contact_inv === getTranID)) {
	
				thisInvoiceContacts.push(allContacts[x]);
			}
	
		}
	
		for (var i = 0; i < thisInvoiceContacts.length; i++) {
	
			if (thisInvoiceContacts[i].contact_role === '2') {
				
				var fields = new Array();
				var values = new Array();
				fields[0] = 'custbody_ilo_jfrog_contact';
				values[0] = thisInvoiceContacts[i].contact_id;
				fields[1] = 'custbody_ilo_contact_email';
				values[1] = thisInvoiceContacts[i].contact_email;
				fields[2] = 'custbody_ilo_contact_phone';
				values[2] = thisInvoiceContacts[i].contact_phone;
				fields[3] = 'custbody_ilo_contact_name';
				values[3] = thisInvoiceContacts[i].contact_name;

				var updatefields = nlapiSubmitField('invoice', invoiceID ,fields, values);
	

			}
		}

	

}
