(function() {

	var inv = nlapiLoadRecord("invoice", 8670);
	console.log(inv);
	
	/////////////////////////////////
	/////////INVOICE DETAILS/////////
	/////////////////////////////////
	
	var customerName = inv.fields.entityname;
	var subsidiaryID = inv.fields.subsidiary;
	var subsidiaryName = nlapiLookupField ( 'invoice' , 8670 , 'subsidiary', true);
	var invTotal = parseFloat(inv.fields.total);
	var invCurreny = inv.fields.currencyname;
	
	console.log("/////INVOICE DETAILS/////");
	console.log("Customer Name: " + customerName);
	console.log("Invoice Subsidiary: " + subsidiaryName);
	console.log("Invoice Total: ¤" + invTotal);
	console.log("Invoice Currency: " + invCurreny);
	
	//////////////////////////////////////////
	//////////CALCULATE TOTAL IN USD//////////
	//////////////////////////////////////////
	
	var exRate = parseFloat(inv.fields.exchangerate);
	var totalUSD = "";
	function calcUSD() {
		totalUSD = invTotal / exRate;
	}
	calcUSD();
	
	console.log("Invoice Total in USD: $" + totalUSD);
	
	/////////////////////////////////
	//////////ITEM DETAILS///////////
	/////////////////////////////////
	
	
	var lineitems = inv.lineitems;
	
	if('item' in lineitems) {
		
		var item = lineitems.item;
		item.forEach(function(a) {

			var itemName = a.item_display;
			var itemTaxCode = a.taxcode;
			var itemGrossAmt = a.grossamt;
			var itemShipCarrier = a.shipcarrier_display;
			
			console.log("/////ITEM DETAILS/////");
			console.log("Item Name: " + itemName);
			console.log("Item Taxcode: " + itemTaxCode);
			console.log("Item Gross Amount: ¤" + itemGrossAmt);
			console.log("Item Shipping Carrier: " +itemShipCarrier);
		
		});
	}else{ alert("no items");}
	
	
	
	})();
