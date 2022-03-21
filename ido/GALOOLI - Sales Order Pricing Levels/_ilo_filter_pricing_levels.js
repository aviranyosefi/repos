/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Oct 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Sublist internal id
 * @param {String}
 *            name Field internal id
 * @param {Number}
 *            linenum Optional line item number, starts from 1
 * @returns {Void}
 */
	
	var ctx = nlapiGetContext();
	var role = ctx.role;
	
	var customCustomerPricingLevel = '';
	
	var approverAlert = '';
	
	var allPrices = getAllPricings();
	
var checkLines = [];

function updatePriceLevels_itemchange(type, name, linenum) {
	
	if(role == '14') {
		return true;
	}
	
	if(role != '14') {
		

	try {
		
		if(type == 'edit') {
			
			var checkArr = [];
			
			console.log('edit mode');
			
			var lineCount = nlapiGetLineItemCount('item');
			
			for(var i=0; i<lineCount; i++) {
				
				var checkLine = nlapiGetLineItemValue('item', 'custcol_ilo_gal_review_discount', i+1);
				
				if(checkLine == 'T') {
					checkArr.push('1');
					
				}
			}
//			alert(JSON.stringify(checkArr))
			if(JSON.stringify(checkArr) != '[]') {
				alert('This discount will be approved by next approver');
				approverAlert = 'alerted';
			}
		}
		if(type == 'create' || 'edit') {
			

			var a = document.getElementsByName('inpt_price')[0];
			var c = document.getElementById('inpt_price15_arrow');

			if (a != null) {
				a.addEventListener('click', function(e) {

					e.preventDefault();

					addBase_Custom_pricings();

				});
			}

			if (c != null) {
				c.addEventListener('click', function(e) {
					e.preventDefault();

					addBase_Custom_pricings();

				});

			}
			
		}


	} catch (err) {

		alert('Price Level Error - ' + err)
	}
	}//check role
}

function addBase_Custom_pricings() {
	
	var empID = nlapiGetFieldValue('custbody_so_creator');
	var checkEmpPricing = nlapiLookupField('employee', empID, 'custentity_ilo_price_level_emp');
	

	var allPrices = getPriceLevels();
	var options = [ '1', '-1' ];
	var toRemove = [];

	for (var x = 0; x < options.length; x++) {
		for (var i = 0; i < allPrices.length; i++) {

			if (options[x] != allPrices[i].internalid) {

				toRemove.push(allPrices[i].internalid);
			}

		}
	}

	var cleanToRemove = [];
	for (var x = 0; x < toRemove.length; x++) {

		if (toRemove[x] != '1') {
			cleanToRemove.push(toRemove[x])
		}

	}
	console.log(cleanToRemove)
	
	if(checkEmpPricing != "") {
		
	for (var i = 0; i < cleanToRemove.length; i++) {
		getDropdown(document.getElementsByName('price')[0]).deleteOneOption(
				cleanToRemove[i]);
	}
	}//has employee discount

	if(checkEmpPricing == "") {
		
		cleanToRemove.push('-1');
		
		for (var i = 0; i < cleanToRemove.length; i++) {
			getDropdown(document.getElementsByName('price')[0]).deleteOneOption(
					cleanToRemove[i]);
		}
		}//has employee discount
}

function getPriceLevels() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');

	var s = nlapiSearchRecord('pricelevel', null, null, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {

			resultsArr.push({
				name : s[i].getValue('name'),
				internalid : s[i].id

			});

		}

	}

	return resultsArr;

}

function itemSelected(type, name) {
	
	var currItem = nlapiGetCurrentLineItemValue('item', 'item');
	
	try{
		if(type =='create' || 'edit'){
		
	if(role == '14') {
		console.log('is customer')
		return true;
	}

	if (type == 'item' && name == 'item' && role != '14' && currItem != '1967') {
		
		var customerID = nlapiGetFieldValue('entity');
		var customerRec = nlapiLoadRecord('customer', customerID);
		var pricingLineCount = customerRec.getLineItemCount('itempricing');
		var pricingLevel = customerRec.getLineItemValue('itempricing', 'level', 1)

		
		addBase_Custom_pricings()
		console.log('item changed');
		setTimeout(function() {

			var a = document.getElementsByName('inpt_price')[0];

			if (a != null) {
				if(pricingLevel == null) {
				a.addEventListener('click', addBase_Custom_pricings());
				a.click();
				var checkPricing = nlapiGetCurrentLineItemValue('item', 'price');
				var getBasePrice = nlapiGetCurrentLineItemValue('item', 'amount');
				
				var getItem = nlapiGetCurrentLineItemValue('item', 'item');
				var customerID = nlapiGetFieldValue('entity')
				var getRefPrices = getCustomerPriceLevels(customerID);
				for(var i = 0; i<getRefPrices.length; i++) {
					if(getRefPrices[i].item == getItem) {
						nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_ref_price', parseFloat(getRefPrices[i].price).toFixed(2));
				
					}
					if(getRefPrices[i].item != getItem) {
						nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_ref_price', parseFloat(getBasePrice).toFixed(2));

					}
				}
			
				if(checkPricing == '1') {
					nlapiDisableLineItemField('item', 'amount', true)
				}
				}//if(pricingLevel == null)
				
				if(pricingLevel != null) {
					a.addEventListener('click', addBase_Custom_pricings());
					a.click();					
					var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
					var allItems = getAllItems();
					
					var itemType = '';
					
					for(var i = 0; i<allItems.length; i++) {
						
						if(allItems[i].internalid == currentItem) {
							
							itemType = allItems[i].type;
						}
					}		
					var itemRec = nlapiLoadRecord(itemType, currentItem);
					var priceObj = customerPricing(itemRec, pricingLevel);
					

							nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_ref_price', parseFloat(priceObj.price_1_).toFixed(2));

					if(checkPricing == '1' || pricingLevel) {
						nlapiDisableLineItemField('item', 'amount', true)
					}
					}//if(pricingLevel == null)
				
				
				
			}
		}, 400);
		

		
	}
	
	if (type == 'item' && name == 'price' && role != '14' && currItem != '1967') {
		
		var checkPricing = nlapiGetCurrentLineItemValue('item', 'price')

						if(checkPricing == '1') {
					nlapiDisableLineItemField('item', 'amount', true)
				}
		if(checkPricing == '-1') {
			nlapiDisableLineItemField('item', 'amount', false)
	}
	}
	}//end of if type == create || edit
	}catch(err) {
		return true;
	}
	
	if (type == 'item' && name == 'quantity' && role != '14' && currItem != '1967') {
		
		var customerID = nlapiGetFieldValue('entity');
		var customerRec = nlapiLoadRecord('customer', customerID);
		var pricingLineCount = customerRec.getLineItemCount('itempricing');
		var pricingLevel = customerRec.getLineItemValue('itempricing', 'level', 1);
		
		
		if(pricingLevel != null) {
			var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
			var lineQty = nlapiGetCurrentLineItemValue('item', 'quantity');
						try{
							debugger;	
			var customersBasePrice =  getItemPricing(currentItem, pricingLevel, parseInt(lineQty), allPrices);	
			var allItems = getAllItems();
			
			var itemType = '';
			
			for(var i = 0; i<allItems.length; i++) {
				
				if(allItems[i].internalid == currentItem) {
					
					itemType = allItems[i].type;
				}
			}		
			var itemRec = nlapiLoadRecord(itemType, currentItem);
			var priceObj = customerPricing(itemRec, pricingLevel);
			//var customersBasePrice = priceObj.price_1_;
//			try{
//				if(parseInt(lineQty) > 200){
//					customersBasePrice = priceObj.price_2_;
//				}
//				if(parseInt(lineQty) > 1000){
//					customersBasePrice = priceObj.price_3_;
//				}
//				if(parseInt(lineQty) > 3000){
//					customersBasePrice = priceObj.price_4_;
//				}
//				if(parseInt(lineQty) > 10000){
//					customersBasePrice = priceObj.price_5_;
//				}
				
				nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_ref_price', parseFloat(customersBasePrice[0].unitPrice).toFixed(2));
				
			}catch(err){
				console.log(err)
				customersBasePrice = priceObj.price_1_;
				nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_ref_price', parseFloat(customersBasePrice).toFixed(2));
			}
			
			
			
		}
		
		

	}
	
	
	}//check role



function lineinit() {
	
	try{

	
	if(role != '14') {
		if(type =='create' || 'edit'){
		
	console.log('lineinit')
	var lineCount = nlapiGetLineItemCount('item')
	var checkInspection = nlapiGetCurrentLineItemValue('item', 'item')
	console.log('shipping inspection added : ' +' lineCount ' + lineCount + ' - ' +' item '+ checkInspection)

	addBase_Custom_pricings();
	
	var checkPricing = nlapiGetCurrentLineItemValue('item', 'price')
	
		if(checkPricing != '-1') {
	nlapiDisableLineItemField('item', 'amount', true)
	}

	setTimeout(function() {

		var a = document.getElementsByName('inpt_price')[0];

		if (a != null) {
			a.addEventListener('click', addBase_Custom_pricings());
			a.click();
		}
	}, 400);
		}//end of if type == create || edit
	}//check role
	
	}catch(err) {
		return true;
	}	
}

function validateLineDiscount() {
	
	var customerID = nlapiGetFieldValue('entity');
	var customerRec = nlapiLoadRecord('customer', customerID);
	var pricingLineCount = customerRec.getLineItemCount('itempricing');
	var pricingLevel = customerRec.getLineItemValue('itempricing', 'level', 1)
	

	
	if(type == 'create' || 'edit') {
		
try{

	
	if(role != '14') {

	var checkPricingType = nlapiGetCurrentLineItemValue('item', 'price');
	var checkItem = nlapiGetCurrentLineItemValue('item', 'item');
	
	console.log('validate line pricing levels - item : ' + checkItem)
	if(checkItem == '') {
		nlapiCancelLineItem('item')
	}
//	if(pricingLevel != null) {
//		
//		var getBasePrice = nlapiGetCurrentLineItemValue('item', 'rate');
//		nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_ref_price', parseFloat(getBasePrice).toFixed(2));
//		
//	}

	debugger;
	if (checkPricingType == '-1') {
		
		console.log('validate line pricing is custom')

		var empPrices = filterPriceLevels();
		var discountAllowed = empPrices[0].percentage;

		var lineItem = nlapiGetCurrentLineItemValue('item', 'item');
		var lineTotal = parseFloat(nlapiGetCurrentLineItemValue('item', 'amount'));
		var lineQty = nlapiGetCurrentLineItemValue('item', 'quantity');
		var itemBasePrice = nlapiGetCurrentLineItemValue('item', 'custcol_ilo_gal_ref_price');
		debugger;
		if(pricingLevel != null) {
			var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
			try{
				debugger;
				var customersBasePrice =  getItemPricing(currentItem, pricingLevel, parseInt(lineQty), allPrices);	
				var allItems = getAllItems();
				
				var itemType = '';
				
				for(var i = 0; i<allItems.length; i++) {
					
					if(allItems[i].internalid == currentItem) {
						
						itemType = allItems[i].type;
					}
				}		
				var itemRec = nlapiLoadRecord(itemType, currentItem);
				var priceObj = customerPricing(itemRec, pricingLevel);
				//var customersBasePrice = priceObj.price_1_;
//				try{
//					if(parseInt(lineQty) > 200){
//						customersBasePrice = priceObj.price_2_;
//					}
//					if(parseInt(lineQty) > 1000){
//						customersBasePrice = priceObj.price_3_;
//					}
//					if(parseInt(lineQty) > 3000){
//						customersBasePrice = priceObj.price_4_;
//					}
//					if(parseInt(lineQty) > 10000){
//						customersBasePrice = priceObj.price_5_;
//					}
				
					nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_ref_price', parseFloat(customersBasePrice[0].unitPrice).toFixed(2));
					
				}catch(err){
					console.log(err)
					customersBasePrice = priceObj.price_1_;
					nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_ref_price', parseFloat(customersBasePrice).toFixed(2));
				}
			

			
			
		}
		if(itemBasePrice == "") {
			try{
				var allItems = getAllItems(); //taken from shippin cost script
				for(var i = 0; i<allItems.length; i++) {
					if(lineItem == allItems[i].internalid) {
						
						var record = nlapiLoadRecord(allItems[i].type, lineItem);
						   var pricelevel=1;
						   var itemCount = record.getLineItemCount('price1');
						   
						   if(itemCount>0){
						       for(var line=1; line<=itemCount; line++){
						        
						           var pricelevelFind = record.getLineItemValue('price1', 'pricelevel', line);   
						            
						           if(pricelevelFind == pricelevel){
						            pricelevel=  line;
						      break;
						           }
						           
						       }
						      }

						   var lastCheckBasePrice = record.getLineItemMatrixValue('price1', 'price', pricelevel, 1); 
						   itemBasePrice =  lastCheckBasePrice;
						   if(lastCheckBasePrice == null) {
							   itemBasePrice = '0.00';
						   }
						   nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_ref_price', itemBasePrice);
					}
				}
				
			}
			catch(err){
				itemBasePrice = '0';
			}

		}
		var toCalculate = itemBasePrice * lineQty;
	

		var getPercentage = GetPercentage(toCalculate, lineTotal);
		debugger;
		if(isNaN(getPercentage)){
			getPercentage = 0;
			alert("Please check this item's Base Price.")
		}
		console.log('lineTotal', lineTotal)
		console.log('itemBasePrice', itemBasePrice)
		console.log('getPercentage', getPercentage);
		console.log('validating');
		console.log('discountAllowed', parseInt(discountAllowed));

		var check = parseFloat(itemBasePrice * lineQty);
		console.log('check', check)
		console.log('checking percentage')
		

			if (getPercentage > parseInt(discountAllowed) && itemBasePrice != null) {

				if(approverAlert == '') {
					
				
					alert('This discount will be approved by next approver');
				}
			if(checkLines != undefined) {
				checkLines.push('1');
				console.log(checkLines)
			}
	
				nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_review_discount', 'T');
				nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_discount_given', getPercentage+'%');
//				alert(checkLines);
				return true;
			}
		

		if (check < 100) {
			nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_discount_given', getPercentage+'%');
			return true;
		}
		nlapiSetCurrentLineItemValue('item', 'custcol_ilo_gal_discount_given', getPercentage+'%');
		
	}//  if (checkPricingType == '-1') 

	return true;
	}//check role
	
}catch(err) {
	console.log(err)
	return true;
}
return true;
}// if type == create
	

	return true;
}




function filterPriceLevels() {
	var context = nlapiGetContext();
	var role = context.role;
	var getCurrUser = context.user;
	if(role != '14') {
		


	var priceLevels = getPriceLevels()

	//console.log(priceLevels)
	var priceIDS = [];
	var empLevels = [];

	for (var i = 0; i < priceLevels.length; i++) {

		priceIDS.push(priceLevels[i].internalid)

	}

	var empID = nlapiGetFieldValue('custbody_so_creator');
	if (empID == "") {
		var context = nlapiGetContext();
		empID = getCurrUser;
	}
	if (empID != getCurrUser) {
		empID = getCurrUser
	}
	var empRec = nlapiLoadRecord('employee', empID)
	var levels = empRec.getFieldValue('custentity_ilo_price_level_emp');
	if (levels != null) {

		empLevels.push(levels);

	}
	var empPriceObj = [];

	for (var i = 0; i < empLevels.length; i++) {
		for (var j = 0; j < priceLevels.length; j++) {

			if (empLevels[i] == priceLevels[j].internalid) {

				empPriceObj.push({

					percentage : priceLevels[j].name,
					perc_id : priceLevels[j].internalid

				})

			}

		}

	}
	return empPriceObj;
	}
}

function GetPercentage($oldFigure, $newFigure)
{
    var $percentChange = (($oldFigure - $newFigure) / $oldFigure) * 100;
    return parseInt(Math.abs($percentChange));
}

function getCustomerPriceLevels(recID) {

	var resultsArr = [];

	var rec = nlapiLoadRecord('customer', recID)

	if (rec != null) {
	
	var lineCount = rec.getLineItemCount('itempricing');
	
	for(var i = 1; i<=lineCount; i++) {
	
	resultsArr.push({
	
	item : rec.getLineItemValue('itempricing', 'item', i),
	price : rec.getLineItemValue('itempricing', 'price', i)

});
	
	}



	}

	return resultsArr;

}

function customerPricing(itemRec, priceLevel) {

	try {

		var price1Arr = '';
		var PricingArr = [];
		var customerPricingObj = [];
		var itemCount = itemRec.getLineItemCount('price1');
		if (itemCount > 0) {
			for (var line = 0; line <= itemCount; line++) {
				var pricelevel = itemRec.getLineItemValue('price1',
						'pricelevel', line);
				if (pricelevel == priceLevel) {

					var price1Arr = itemRec.lineitems.price1;

				}

			}
			if (price1Arr != '') {

				for (var i = 0; i < price1Arr.length; i++) {
					try {

						if (price1Arr[i].pricelevel == priceLevel) {

							PricingArr.push(price1Arr[i])

						}
					} catch (err) {
						continue;
					}

				}

			}
		}

		if (PricingArr[0].hasOwnProperty('price_1_')) {

			customerPricingObj.push(PricingArr[0]);

		}

		return customerPricingObj[0];

	} catch (err) {
		console.log(err)
	}

}


function getItemPricing(itemid, customerPriceLevel, qty) {

	var allPrices = getAllPricings();

	var itemPrices = [];

	for(var i = 0; i<allPrices.length; i++) {

	if(allPrices[i].itemID == itemid && allPrices[i].priceLevel == customerPriceLevel && qty >= allPrices[i].qtyRange.min && qty < allPrices[i].qtyRange.max) {

	itemPrices.push(allPrices[i])
	}

	}
	if(JSON.stringify(itemPrices) == '[]') {


	itemPrices.push(allPrices[0])
	}



	return itemPrices;

	}



	//var res = getItemPricing('374', '12', 5000);
	//console.log(res)

		function getAllPricings() {
			
			var customerEmailArr = {};

			var searchPrices = nlapiLoadSearch(null,'customsearch_ilo_item_pricing_search');

			var allPrices = [];
			var prices = [];
			var resultContacts = [];
			var searchid = 0;
			var resultset = searchPrices.runSearch();
			var rs;

			do {
				var resultslice = resultset.getResults(searchid, searchid + 1000);
				for (rs in resultslice) {

					allPrices
							.push(resultContacts[resultslice[rs].id] = resultslice[rs]);
					searchid++;
				}
			} while (resultslice.length >= 1000);

			if (allPrices != null) {
				allPrices.forEach(function(line) {


					prices.push({

							name : line.getValue('itemid'),
							itemID : line.getValue('internalid'),
							unitPrice : line.getValue('unitprice', 'pricing'),
							qtyRange : getQtyObj(line.getValue('quantityrange', 'pricing')),
							priceLevel : line.getValue('pricelevel', 'pricing'),
							

					});

				});

			};
			

			

			

			return prices;

		}


	function getQtyObj(quantityrange){

	var results =[];

	var a = quantityrange;
	var res = a.split("-");

	var qtyObj = {
	  min : parseInt(res[0]),
	  max : parseInt(res[1]),
	}  

	return qtyObj;
	  
	}