
function _dev_pop_contacts_inEmail(type, form, request) {
    //check proper context
	if (type != 'create') return;
    var context = nlapiGetContext();
    if (context.getExecutionContext() != 'userinterface') return;
    if (!request) return;


    var getCustomerContacts = getCustomersContacts(nlapiGetFieldValue('recipient'))
    
  nlapiLogExecution('debug', 'in message', 'in message')
  nlapiLogExecution('debug', 'type', type)
  nlapiLogExecution('debug', 'request', request)
  //nlapiLogExecution('debug', 'getCustomer', getCustomer)
  
  nlapiLogExecution('debug', 'getCustomerContacts', JSON.stringify(getCustomerContacts, null ,2))
    if(getCustomerContacts != []) {
    	
    	for(var i = 0; i<getCustomerContacts.length; i++) {
    		
    		//nlapiSetLineItemValue('otherrecipientslist', 'otherrecipientslist', i+1, getCustomerContacts[i].contactID)
    		
    	 nlapiSelectNewLineItem('otherrecipientslist');
   		 nlapiSetCurrentLineItemValue('otherrecipientslist', 'otherrecipient', getCustomerContacts[i].contactID);
   		 nlapiSetCurrentLineItemValue('otherrecipientslist', 'email', getCustomerContacts[i].contactEmail); 
   		nlapiSetCurrentLineItemValue('otherrecipientslist', 'toRecipients', 'T');
   		 nlapiCommitLineItem('otherrecipientslist');
    	}
    	
    	
    }
    
 
}

function getCustomersContacts(customerID) {
    nlapiLogExecution('debug', 'customerID', customerID)
    var toReturn = [];
    if (!isNullOrEmpty(customerID)){		
	var results = [];	
	var customerIDArr = [customerID]

	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'company', null, 'anyof', customerIDArr);


	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'entityid' );
	columns[1] = new nlobjSearchColumn( 'company' );
	columns[2] = new nlobjSearchColumn( 'email' );
	columns[3] = new nlobjSearchColumn('contactrole');
	columns[4] = new nlobjSearchColumn('internalid');
	columns[5] = new nlobjSearchColumn('custentity_ncs_contact_distrib_list')


	var search = nlapiCreateSearch( 'contact', filters, columns );
	var resultset = search.runSearch();
	results = resultset.getResults(0, 1000);


	if(results != []) {
	results.forEach(function(line) {
		
		var checkIfInDistributionList = line.getValue('custentity_ncs_contact_distrib_list');
		
	if(checkIfInDistributionList == 'T') {

	toReturn.push({
	contactName : line.getValue('entityid'),
	contactEmail: line.getValue('email'),
	contactRole: line.getText('contactrole'),
	contactID: line.getValue('internalid')
	})
		}//if role == 'Invoice Contact'
	
	});
	}
		
	}
	

	return toReturn;
	}
	
function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}