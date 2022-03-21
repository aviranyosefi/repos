//function getCustomerAddressBook() {
//	var record = nlapiLoadRecord('customer', 400);
//	var numberOfAddresses = record.getLineItemCount('addressbook');
//
//	for (var i = 1; i <= numberOfAddresses; i++) {
//		var internalid = record
//				.getLineItemValue('addressbook', 'internalid', i);
//		var defaultshipping = record.getLineItemValue('addressbook',
//				'defaultshipping', i);
//		var defaultbilling = record.getLineItemValue('addressbook',
//				'defaultbilling', i);
//		var label = record.getLineItemValue('addressbook', 'label', i);
//		var address = record.getLineItemValue('addressbook', 'addrtext', i);
//		
//		console.log(address);
//	}
//}
//
//getCustomerAddressBook();


function something() {
var record = nlapiLoadRecord('customer', 81, {recordmode: 'dynamic'});

console.log(record);

var contactName = record.getLineItemValue('contactroles', 'contactname', 1);
console.log("Contact Name: " + contactName);

var contactAddress = record.getLineItemValue('addressbook', 'addrtext', 1);
console.log("Contact Address: " + contactAddress);


var contactPhone = record.getLineItemValue('addressbook', 'phone', 1);
console.log("Contact Phone: " + contactPhone);
}

something();

