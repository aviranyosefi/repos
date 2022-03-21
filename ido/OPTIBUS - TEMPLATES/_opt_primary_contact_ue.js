/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Feb 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function _update_billing_contact(type){
		
	var recType = 'customer';
	var recID = nlapiGetRecordId();
	
	var currentRec = nlapiLoadRecord(recType, recID);
	
	
try{
	
	var contact = getCustomersContacts(recID);
	
	if(contact != []) {
		
		nlapiLogExecution('debug', 'contact', JSON.stringify(contact))
		nlapiSubmitField('customer', recID, 'custentity_opt_primary_billing_contact',contact[0].contact_salute+' '+contact[0].contact_name, null);
		return true;
	}


	
	
	
}catch(err){
nlapiLogExecution('debug', 'err', err)
	nlapiSubmitField('customer', recID, 'custentity_opt_primary_billing_contact', '', null);
return true;
}
  
}




function getCustomersContacts(company) {

	var searchContacts = nlapiLoadSearch(null, 'customsearch_opt_primary_contact_search');
	

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
					
				if(line.getValue('company') == company){	
					
					invContacts.push({
					
					contact_name : line.getValue('entityid'),
					contact_company : line.getValue('company'),
					contact_salute : line.getValue('salutation')

					});

					}
				});

			};
			
			return invContacts;

	}