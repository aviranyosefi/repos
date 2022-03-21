
function getInvoice(a) {
	
//	var context1 = nlapiGetContext();
//	var usageRemaining1 = context1.getRemainingUsage();
//	console.log(1000 - usageRemaining1);
//	

	// global search on user input
	var globSearch = nlapiSearchGlobal(a);
	// get invoice ID from search result
	for (var i = 0; i < globSearch.length; i++) {
		var invID = globSearch[i].id;
	}
//	var context2 = nlapiGetContext();
//	var usageRemaining2 = context2.getRemainingUsage();
//	console.log(1000 - usageRemaining2);
	// load invoice record
	var invRecord = nlapiLoadRecord('invoice', invID);
//	console.log(invRecord);
//	console.log(" ");
//	var context3 = nlapiGetContext();
//	var usageRemaining3 = context3.getRemainingUsage();
//	console.log(1000 - usageRemaining3);

	// get relevant fields from invoice
	var custInvID = invRecord.getFieldValue ( 'tranid' ); 
	var custName = invRecord.getFieldValue ( 'entityname' );
	var custSubsidiary = nlapiLookupField('invoice', invID, 'subsidiary', true);

//	console.log("////////INVOICE DETAILS///////");
//	console.log(custInvID);
//	console.log(custName);
//	console.log(custSubsidiary);
//	console.log(" ");

//	var context4 = nlapiGetContext();
//	var usageRemaining4 = context4.getRemainingUsage();
//	console.log(1000 - usageRemaining4);
	// get item details
	var lineitems = invRecord.lineitems;

	if ('item' in lineitems) {
//		console.log("////////ITEM DETAILS///////");
		var item = lineitems.item;
		item.forEach(function(a, b) {

			var itemName = a.item_display;
			var itemPrice = a.rate;
			var itemQty = a.initquantity;
			var itemLocation = a.location_display
			var itemLineTotal = a.amount;

//			console.log("Item " + b + " Name: " + itemName);
//			console.log("Item " + b + " Unit Price: " + itemPrice);
//			console.log("Item " + b + " Quantity: " + itemQty);
//			console.log("Item " + b + " Warehouse Location: " + itemLocation);
//			console.log("Item " + b + " Line Total: " + itemLineTotal)
//
//			console.log(" ");
		});
	} else {
//		console.log("no items");
	}

	// get status details

	var invStatus = invRecord.fields.status;

	var statOpenAmtPaid = invRecord.fields.amountpaid;
	var statOpenAmtRemaining = invRecord.fields.amountremainingtotalbox;
	var statOpenBillToAddress = invRecord.fields.billaddress;

	var paymentDate = "";

	//get payment date function if invoice status is "Paid In Full"
	function getPaymentDate() {
		var paymentRecId;

		var link = lineitems.links;
		for (var i = 0; i < link.length; i++) {
			paymentRecId = link[i];
		}

		var paymentRecId1 = paymentRecId.id;
		var payment = nlapiLoadRecord("customerpayment", paymentRecId1);
		paymentDate = payment.fields.trandate;

	}


//
//	console.log("////////STATUS DETAILS///////");
//
//	console.log("Invoice Status: " + invStatus);
	// if invoice status is "Open" then retrieve amount paid/remaining and billing address
	if (invStatus == "Open") {
//		console.log("Amount Paid: " + statOpenAmtPaid);
//		console.log("Amount Remaining: " + statOpenAmtRemaining);
//		console.log("Bill to Address: " + statOpenBillToAddress);
		

	} else {
		getPaymentDate();

//		console.log("Amount Payed: " + invRecord.fields.amountpaid);
//		console.log("Payment Date: " + paymentDate);

	}

//	var context5 = nlapiGetContext();
//	var usageRemaining5 = context5.getRemainingUsage();
//	console.log(1000 - usageRemaining5);
}

//run the function by passing any invoice number as a parameter
getInvoice('INV03091383'); //this invoice number is for example