	var checkAlert = '';
	var ctx = nlapiGetContext();
	var role = ctx.role;
	var subsid = ''; //this whole script is restricted to Galooli LTD (Israel) '1'
	var customerid = '';
	var checkOverWeightAlert = '';
	var exception = '50766' //SOGIL10225 (intercompany SO with 100 lines)
		var currRec = '';
		try{
			currRec = nlapiGetRecordId()	
		}catch(err) {}


	
function getAllShippingPrices_Israel() {

	if(role != '14') {
	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('custrecord_weight');
	cols[1] = new nlobjSearchColumn('custrecord_ups_delivery_cost');
	cols[2] = new nlobjSearchColumn('custrecord_dhl_delivery_cost');

	var s = nlapiSearchRecord('customrecord_galooli_shipping_cost', null, null, cols);

	if (s != null) {


		for (var i = 0; i < s.length; i++) {

			resultsArr.push({
				weight : s[i].getValue('custrecord_weight'),
				upsPrice : s[i].getValue('custrecord_ups_delivery_cost'),
				dhlPrice : s[i].getValue('custrecord_dhl_delivery_cost'),
			});

		}

	}

	return resultsArr;
	}// is not customer role
}

	var shippingPricesIsrael = getAllShippingPrices_Israel();
	
	function getWeightsArray() {
		if(role != '14') {
			
	var arr = [];
	
	for(var i=0;i<shippingPricesIsrael.length; i++) {
	
	arr.push(shippingPricesIsrael[i].weight);
	}
	
	return arr;
		}// is not customer role	
	}
	
	var weightsArr = getWeightsArray();

	
	
function clientPageInit_shippingCost(type){
	
   
	subsid = nlapiGetFieldValue('subsidiary');
	customerid = nlapiGetFieldValue('entity');

	try{
		var customer = nlapiLoadRecord('customer', customerid);
		var isSelfPickup = customer.getFieldValue('custentity_self_pick_up');
		var needInspection = customer.getFieldValue('custentity_need_inspection');
		var shippingType = customer.getFieldValue('custentity_shipping_via');
		var minimumInspection = customer.getFieldValue('custentity_minimal_amount_for_inspection');
		
		if(isSelfPickup != null || needInspection != null) {
			nlapiSetFieldValue('custbody_self_pick_up', isSelfPickup);
			nlapiSetFieldValue('custbody_need_inspection', needInspection);
		}
	}catch(err) {
		console.log(err);
	}

	if(type == 'edit' && currRec != exception) {
		
	
		var customer = nlapiLoadRecord('customer', customerid);
		var isSelfPickup = customer.getFieldValue('custentity_self_pick_up');
		var needInspection = customer.getFieldValue('custentity_need_inspection');
		var shippingType = customer.getFieldValue('custentity_shipping_via');
		var minimumInspection = customer.getFieldValue('custentity_minimal_amount_for_inspection');
		
		
		var lineCount = nlapiGetLineItemCount('item')
		if(isSelfPickup == 'F') {
			
		
		for(var i = 1; i<=lineCount; i++) {
			
			checkAndUpdateShipping(i, customerid);

		}
		if(checkAlert == 'alert') {
			alert('The country of manufacture for this item is not IL (Israel). Please manually add the relevant shipping item and fee amount required.');
			
		}
		if(checkOverWeightAlert == 'alert') {
        	alert("This order's weight exceeds 150kg.");
        	

		}
		}
		

    		
    	if(needInspection == 'T') {
        	var currentTotal = parseFloat(nlapiGetFieldValue('subtotal'));

      	if(currentTotal > minimumInspection) {
		
		 nlapiSelectLineItem('item',lineCount);
		  nlapiCommitLineItem('item');
      	}		  
    	}

}


}
function shippingCost_fieldChange(type, name, linenum){
	
	if(role != '14') {
		
	if(subsid == '1' && currRec != exception) {
		
		if(name == 'entity') {
			var customerid = nlapiGetFieldValue('entity');
			try{
				var customer = nlapiLoadRecord('customer', customerid);
				var isSelfPickup = customer.getFieldValue('custentity_self_pick_up');
				var needInspection = customer.getFieldValue('custentity_need_inspection');
				
				if(isSelfPickup != null || needInspection != null) {
					nlapiSetFieldValue('custbody_self_pick_up', isSelfPickup);
					nlapiSetFieldValue('custbody_need_inspection', needInspection)
				}
			}catch(err) {
				console.log(err)
			}
			
		}
	

	if (type == 'item' && name == 'item' && role != '14' && subsid == '1') { //1967 inspection item in prod || 1456 - sandbox
		
		
		var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
		
		if(currentItem != '1967') {
		var currentQty = nlapiGetCurrentLineItemValue('item', 'quantity');
		if(currentQty == '') {
			currentQty = '1';
		}
	
		var allItems = getAllItems();
		
		var itemType = '';
		
		for(var i = 0; i<allItems.length; i++) {
			
			if(allItems[i].internalid == currentItem) {
				
				itemType = allItems[i].type;
			}
		}		
		
		if(itemType != '') {
			
		
		var itemRec = nlapiLoadRecord(itemType, currentItem);
		
		var manufactorCountry = itemRec.getFieldValue('countryofmanufacture');
		var itemWeight = itemRec.getFieldValue('weight');
		var weightUnit = itemRec.getFieldValue('weightunit');
		if(weightUnit == '1') {
			weightUnit = 'lb';
		}
		if(weightUnit == '2') {
			weightUnit = 'oz';
		}
		if(weightUnit == '3') {
			weightUnit = 'kg';
		}
		if(weightUnit == '4') {
			weightUnit = 'g';
		}	
		if(manufactorCountry != null || manufactorCountry != "" || manufactorCountry != undefined) {
			nlapiSetCurrentLineItemValue('item', 'custcol_ilo_countryofmanufacture', manufactorCountry);

		}
		if(manufactorCountry == null || manufactorCountry == "" || manufactorCountry == undefined || manufactorCountry != 'IL') {

				alert('The country of manufacture for this item is not IL (Israel). Please manually add the relevant shipping item and fee amount required.');

		}
		
		if(itemWeight != null || itemWeight != "" || itemWeight != undefined) {
			nlapiSetCurrentLineItemValue('item', 'custcol_ilo_item_weight_kg', itemWeight);
			nlapiSetCurrentLineItemValue('item', 'custcol_ilo_item_totalweight_kg', itemWeight*currentQty);
		}
		
	}//if(itemType != '')
	}
	}
	
	if (type == 'item' && name == 'quantity' && role != '14' && subsid == '1') {
		
		var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
		
		if(currentItem != '1967') {
		
		var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
		var currentQty = nlapiGetCurrentLineItemValue('item', 'quantity');
	
		var allItems = getAllItems();
		
		var itemType = '';
		
		for(var i = 0; i<allItems.length; i++) {
			
			if(allItems[i].internalid == currentItem) {
				
				itemType = allItems[i].type;
			}
		}		
		if(itemType != '') {
			
		
		var itemRec = nlapiLoadRecord(itemType, currentItem);
		
		var itemWeight = itemRec.getFieldValue('weight');
		var weightUnit = itemRec.getFieldValue('weightunit');
		
		if(itemWeight != null || itemWeight != "" || itemWeight != undefined) {
			try{
				nlapiSetCurrentLineItemValue('item', 'custcol_ilo_item_totalweight_kg', itemWeight*currentQty);
			}catch(err) {
				console.log('Total weight error : '+err);
			}
		
		}
		}//	if(itemType != '')
		
	}
	}
		
	if (name == 'custbody_ilo_gal_special_shipping' && role != '14' && subsid == '1') {
		
		var getShipping = nlapiGetFieldValue('shippingcost');
		var getSpecialShipping = nlapiGetFieldValue('custbody_ilo_gal_special_shipping');
		
		var currShipping = parseFloat(getShipping);
		var specialShipping = parseFloat(getSpecialShipping);
		
		var newShipping = currShipping+specialShipping;
		
		

		nlapiSetFieldValue('shippingcost', newShipping.toFixed(2));
		}

}//end of if subsid == 1
	}// is not customer role
 
}



function validateLine_updateShippingPrice() {
	console.log('recalc function fired')
	if(role != '14') {
	if(subsid == '1' && currRec != exception ) {
		
        var customerid = nlapiGetFieldValue('entity');
    	var customerRec = nlapiLoadRecord('customer', customerid);
    	var shippingType = customerRec.getFieldValue('custentity_shipping_via');
    	var minimumInspection = parseInt(customerRec.getFieldValue('custentity_minimal_amount_for_inspection'));
		
		var checkManCountry = nlapiGetCurrentLineItemValue('item', 'custcol_ilo_countryofmanufacture')
		var checkifSelfPickup = nlapiGetFieldValue('custbody_self_pick_up');
		var needInpsection = nlapiGetFieldValue('custbody_need_inspection');
		
		if(needInpsection == 'T') {
			
	    	var currentTotal = nlapiGetFieldValue('total');
	    	
	    	var getFOB = calculateFOB(currentTotal);
	    		  
	    	var inspectionItem = '';
	      	if(currentTotal > minimumInspection) {
	      		
	      		inspectionItem = '1967' //inspection item internal id
	      	
			
		var lineCount = nlapiGetLineItemCount('item')
		var inspectionLine = '';
		var inspecLineExsists = '';
		
		var addLine = '';
		
		for(var i = 0; i<lineCount; i++) {

			var checkLine = nlapiGetLineItemValue('item', 'item', i+1);

//			alert(inspectionItem + ' : inspectionItem');
//			alert(checkLine + ' : checkLine');
			
			
			if(checkLine != "1967"){ //inspection item internal id
				addLine = 'yes'

			}
			if(checkLine == "1967"){ //inspection item internal id
			
				inspectionLine = i+1;

			}
		}
		
		
		if(addLine == 'yes' && inspectionLine == ''){
			
			
			setTimeout(function(){ 
				nlapiSelectNewLineItem('item');
		        nlapiSetCurrentLineItemValue('item', 'item', 1967); //Inspection Line
		        nlapiSetCurrentLineItemValue('item', 'quantity', 1);
		        nlapiSetCurrentLineItemValue('item', 'taxcode', '5'); //VAT UNDEF-IL
		        nlapiCommitLineItem('item');
			}, 400);

			
		}
	      	}//if(currentTotal > minimumInspection)
			
			

		}//if needs inspection
		
		if (checkManCountry == 'IL' && checkifSelfPickup == 'F'){
		
        var customerid = nlapiGetFieldValue('entity');
    	var customerRec = nlapiLoadRecord('customer', customerid);
    	var shippingType = customerRec.getFieldValue('custentity_shipping_via');
    	var minimumInspection = customerRec.getFieldValue('custentity_minimal_amount_for_inspection');
    	
    	var getTotal = nlapiGetFieldValue('total');

	
        var reCalc_TotalWeight = calculateShippingCost();
        
        var FOBcost = calculateFOB(getTotal);
        var shipPrice = getShippingPrice(shippingType, reCalc_TotalWeight);
        nlapiSetFieldValue('custbody_ilo_gal_shippingcost', shipPrice);
        nlapiSetFieldValue('custbody_ilo_gal_fob', FOBcost);

		var galooliShipping = parseFloat(nlapiGetFieldValue('custbody_ilo_gal_shippingcost'));
		var galooliInsurance = parseFloat(nlapiGetFieldValue('custbody_ilo_gal_fob'));

			var totalShip = galooliShipping + galooliInsurance;
			
			
			var getShipping = nlapiGetFieldValue('shippingcost');
			
			var addedShipping = parseFloat(totalShip+getShipping).toFixed(2)

			
			nlapiSetFieldValue('shippingcost', parseFloat(totalShip+getShipping).toFixed(2))
		
	if(reCalc_TotalWeight > 150) {
		alert("This order's weight exceeds 150kg.");
	    nlapiSetFieldValue('custbody_ilo_gal_shippingcost', '0');
        nlapiSetFieldValue('custbody_ilo_gal_fob', '0');
	}

	} //if manufactor country == 'IL' and not self pickup	
	}//if subsid == 1
	} //is not a customer
	return true;
}


function getAllItems() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('type');
	cols[2] = new nlobjSearchColumn('isserialitem');


	var s = nlapiSearchRecord('item', null, null, cols);

	if (s != null) {

		var serialized = 'serializedinventoryitem';
		var notSerialized = 'inventoryitem';

		for (var i = 0; i < s.length; i++) {

			var type = '';

			if (s[i].getValue('isserialitem') == 'T') {

				type = serialized;
			}

			if (s[i].getValue('isserialitem') == 'F') {

				type = notSerialized;
			}

			if (s[i].getValue('type') == 'NonInvtPart') {

				type = 'noninventoryitem';
			}

			if (s[i].getValue('type') == 'Assembly' && s[i].getValue('isserialitem') == 'F') {
				
				type = 'assemblyitem';

			}
			
		if (s[i].getValue('type') == 'Assembly' && s[i].getValue('isserialitem') == 'T') {
				
				type = 'serializedassemblyitem';
			}
			
			if (s[i].getValue('type') == 'Kit') {

				type = 'kititem';
			}
			
			if (s[i].getValue('type') == 'Group') {

				type = 'itemgroup';
			}
			if (s[i].getValue('type') == 'EndGroup') {

				type = 'itemgroup';
			}

			resultsArr.push({
				name : s[i].getValue('name'),
				internalid : s[i].id,
				type : type
			});

		}

	}

	return resultsArr;

}


function calculateShippingCost() {

	var allLinesWeight = [];

		var lineCount = nlapiGetLineItemCount('item')
		for(var i = 0; i<lineCount; i++) {

			var checkCountry = nlapiGetLineItemValue('item', 'custcol_ilo_countryofmanufacture', i+1);
			var lineWeight = nlapiGetLineItemValue('item', 'custcol_ilo_item_totalweight_kg', i+1);
	
			
			if(lineWeight != '' && checkCountry == 'IL') {
			allLinesWeight.push(lineWeight);
			}
			
		}
		

	var totalWeight = allLinesWeight.reduce(add, 0);
		
		return totalWeight;

	}


function add(a, b) {
	return parseFloat(a) + parseFloat(b);
}

function closest(num, arr) {
	var curr = arr[0];
	var diff = Math.abs(num - curr);
	for (var val = 0; val < arr.length; val++) {
		var newdiff = Math.abs(num - arr[val]);
		if (newdiff < diff) {
			diff = newdiff;
			curr = arr[val];
		}
	}
	return curr;
}

function getShippingPrice(shippingType, totalweight) {

	var price = '';

	if (shippingType == null || shippingType == '') {
		alert("In order to continue, please update 'shipping via' field in this customer's record")
		return false;
	}


	
	if(totalweight != 0 || totalweight != '0') {
		totalweight = Math.ceil(totalweight);
	var tot_weight = closest(totalweight, weightsArr)
	// alert(tot_weight);

	for (var i = 0; i < shippingPricesIsrael.length; i++) {

		if (shippingPricesIsrael[i].weight == tot_weight) {

			if (shippingType == '1') { // DHL

				price = shippingPricesIsrael[i].dhlPrice
				if (price == null || price == "" || price == undefined) {
					alert('No DHL shipping price for this weight.');
				}
			}
			if (shippingType == '2') { // UPS

				price = shippingPricesIsrael[i].upsPrice
				if (price == null || price == "" || price == undefined) {
					alert('No UPS shipping price for this weight.')
				}
			}
		}
	}
	}//if total weight != 0
	if(totalweight == 0 || totalweight == '0') {
		price = '0';
	}
	
	return price;
}



function calculateFOB(total) {
	
	var lineCount = nlapiGetLineItemCount('item')
	var inspectionCost = '';
	for(var i = 0; i<lineCount; i++) {

		var checkLine = nlapiGetLineItemValue('item', 'item', i+1);
		if(checkLine == "1967"){ //shipping item internal id
			inspectionCost = nlapiGetLineItemValue('item', 'amount', i+1);
		}

	}
	if(inspectionCost != '') {
		
		total = parseFloat(total) - parseFloat(inspectionCost)
	}

	var total = parseFloat(total);

	
	var sixPointFive = 6.5;
	var percOf = (0.13 / 100) * total;

	var fob = '';

	if (sixPointFive > percOf) {

		fob = sixPointFive;
	} else {
		fob = percOf.toFixed(2);
	}

	return fob;
}

function checkAndUpdateShipping(lineNum, customerid){
	
	var itemRec;
	var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
	var currentQty = nlapiGetCurrentLineItemValue('item', 'quantity');

	var allItems = getAllItems();
	
	var itemType = '';
	
	for(var i = 0; i<allItems.length; i++) {
		
		if(allItems[i].internalid == currentItem) {
			
			itemType = allItems[i].type;
		}
	}		
	if(itemType != '') {
		
	itemRec = nlapiLoadRecord(itemType, currentItem);
	}

	if(itemRec != undefined) {
		
		
	
	
	var checkManCountry = [];
	var shippingType = nlapiLookupField('customer', customerid, 'custentity_shipping_via')
	var currentItem = nlapiGetLineItemValue('item', 'item', lineNum);
	var checkSpecialShipping = nlapiGetFieldValue('custbody_ilo_gal_special_shipping')

		var currentQty = nlapiGetLineItemValue('item', 'quantity', lineNum);
		if(currentQty == '') {
			currentQty = '1';
		}
	



		var manCountry = itemRec.getFieldValue('countryofmanufacture');
		var itemWeight = itemRec.getFieldValue('weight');
		var weightUnit = itemRec.getFieldValue('weightunit');
		if(weightUnit == '1') {
			weightUnit = 'lb';
		}
		if(weightUnit == '2') {
			weightUnit = 'oz';
		}
		if(weightUnit == '3') {
			weightUnit = 'kg';
		}
		if(weightUnit == '4') {
			weightUnit = 'g';
		}	
		if(manCountry != null || manCountry != "" || manCountry != undefined) {
			nlapiSetLineItemValue('item', 'custcol_ilo_countryofmanufacture', lineNum, manCountry);
			
			if(manCountry != 'IL' && checkSpecialShipping == '') {
				checkAlert = 'alert';
}

		}

		if(itemWeight != null || itemWeight != "" || itemWeight != undefined) {
			nlapiSetLineItemValue('item', 'custcol_ilo_item_weight_kg', lineNum, itemWeight);
			nlapiSetLineItemValue('item', 'custcol_ilo_item_totalweight_kg', lineNum, itemWeight*currentQty);
		}
		
//		var shippingCost =  calculateShippingCost();
//		var currentTotal = nlapiGetFieldValue('total');
//    	var insuranceFOB = calculateFOB(currentTotal);
//		nlapiSetFieldValue('custbody_ilo_gal_shippingcost', shippingCost)
//		nlapiSetFieldValue('custbody_ilo_gal_fob', insuranceFOB)
    	var getTotal = nlapiGetFieldValue('total');
        var reCalc_TotalWeight = calculateShippingCost();
        if(reCalc_TotalWeight > 150) {
        	checkOverWeightAlert = 'alert';
	
        }
        var FOBcost = calculateFOB(getTotal);
        var shipPrice = getShippingPrice(shippingType, reCalc_TotalWeight);
        
        nlapiSetFieldValue('custbody_ilo_gal_shippingcost', shipPrice);
		nlapiSetFieldValue('custbody_ilo_gal_fob', FOBcost);
		
		var totalShip = parseFloat(shipPrice) + parseFloat(FOBcost);

		
		nlapiSetFieldValue('shippingcost', totalShip.toFixed(2))

	}//if(itemRec != undefined)
	}

