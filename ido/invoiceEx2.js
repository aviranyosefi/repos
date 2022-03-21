(function() {



    /////////////////////////////////
	//////////PAYMENT DATE///////////
	/////////////////////////////////
	
	//in this case we have changed the invoice - because the last was faulty/inconsistent
	
	var newInv = nlapiLoadRecord("invoice", 507);
	
	var lineitems = newInv.lineitems;
	
console.log(newInv);
		
var paymentRecId;

		var link = lineitems.links;
		for(var i = 0; i<link.length; i++) {
			paymentRecId = link[i];
		}

		var paymentRecId = paymentRecId.id;
//		console.log(paymentRecId);
//		
		var payment = nlapiLoadRecord("customerpayment", paymentRecId);
		console.log(payment);
	})();
