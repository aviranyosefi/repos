/**
 * Module Description
 * 
 * Version Date Author Remarks 1.00 30 Aug 2016 idor
 * 
 */

// GET CUSTOMER EMAIL ADDRESS//
function getCustomerEmailAddress() {

	// first load specific record
	var custObj = nlapiLoadRecord('customer', 1542, null);

	// then get 'email' field value
	var custEmail = custObj.getFieldValue('email');

	// then log result
//	console.log(custEmail);
	//aa@fake-email.com

};
getCustomerEmailAddress();

// UPDATE CUSTOMER EMAIL ADDRESS//
function updateCustomerEmailAddress() {
	
	// first load specific record
	var custObj = nlapiLoadRecord('customer', 1542, null);
	
	//initialize variable holding new/updated email address (im guessing that this will be taken from the form input inwhich new email will be typed)
	var newCustEmail = "new@mail.com";
	
	//then set new field value for email address
	custObj.setFieldValue('email', newCustEmail);
	
	//to make sure it works log result
//	console.log(custObj.getFieldValue('email'));
	//new@mail.com
};

updateCustomerEmailAddress();
nlapiLogExecution('DEBUG', 'Remaining usage after searching sales orders from today',
		context.getRemainingUsage());