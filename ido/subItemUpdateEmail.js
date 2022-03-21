/**
 * Module Description
 * 
 * Version Date Author Remarks 1.00 31 Aug 2016 idor
 * 
 */

// this function loads a record and checks if record has the property
// "contactroles"
function changeContactsEmail(x) {

	var custObj = nlapiLoadRecord('customer', x, null);

	var custObjLineItems = custObj.lineitems;

	// if the record has "contactroles"
	if ('contactroles' in custObjLineItems) {

		var contacts = custObjLineItems.contactroles;
		contacts.forEach(function(a) {

			var a = a.email;
			a = a.substring(0, a.indexOf('@')); // remove everything after and
												// including "@"
			var b = '@one1up.com';
			console.log(a + b); // concat the two values
		});

		// if the record does not have any contacts
	} else {
		alert('no contacts');
	}

};

// the function is called by passing a customer ID as an argument
changeContactsEmail(317);
