/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Aug 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSaveRecord(){


    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged(type, name, linenum){
	
	if (name == 'custpage_convsublist_initial') {
		
		var selecteditemID = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_convsublist_initial');
		
		setLineValues(selecteditemID);
	
	};
	
	
	
 
}



function setLineValues(selecteditemID) {
	
	var getSubsid = nlapiGetFieldValue('custpage_hidden_subsid');
	var allItems = get_all_items(getSubsid);
	
	nlapiSetCurrentLineItemValue('custpage_results_sublist', 'custpage_convsublist_converted', selecteditemID);
	
	var selectedItem;
	for(var i = 0; i<allItems.length; i++) {
		if(allItems[i].itemID == selecteditemID) {
			selectedItem =allItems[i];
		}
	}
	var selectedLocation = nlapiGetFieldValue('custpage_select_location')

	try{

	var itemRec= nlapiLoadRecord(selectedItem.itemType, selectedItem.itemID);

	var getUnits = itemRec.getFieldValue('stockunit');
	if(getUnits == '1') {
		getUnits = 'Each';
	}
	nlapiSetCurrentLineItemValue('custpage_results_sublist', 'custpage_convsublist_units', getUnits);
	
	var locations = itemRec.lineitems.locations;

	locations.forEach(function(element) {

	if(element.location_display == selectedLocation) {

	nlapiSetCurrentLineItemValue('custpage_results_sublist', 'custpage_convsublist_quantity_hand', element.quantityonhand);
	}
	});

	}catch(err) {

	alert('ERROR ' + err);

	}

		
}




function get_all_items(getSubsid) {
	
	var searchItems = nlapiLoadSearch(null,'customsearch_ilo_all_inventory_items');

	
	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchItems.runSearch();
	var rs;

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allSelection
					.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allSelection != null) {
		allSelection.forEach(function(line) {

			allResults.push({
			
			itemName: line.getValue('itemid'),
			itemID : line.getValue('internalid'),
			itemDisplayName : line.getValue('displayname'),
			itemType : getType(line.getValue('type'))
			
			});

		});

	};	
	return allResults;
	}

function getType(type) {

	var theType = '';

	if (type == 'Kit') {
		theType = 'kititem';
	}
	if (type == 'Assembly') {
		theType = 'assemblyitem';
	}
	if (type == 'InvtPart') {
		theType = 'inventoryitem';
	}
	if (type == 'Discount') {
		theType = 'discountitem';
	}
	if (type == 'OthCharge') {
		theType = 'otherchargeitem';
	}
	if (type == 'Service') {
		theType = 'serviceitem';
	}
	
	if( type == 'Subtotal') {
		theType = 'subtotalitem';
	}
	
	if( type == 'Payment') {
		theType = 'paymentitem';
	}
	return theType;
};

var iccLinesArr = [];
function getAllLines() {
	
	var lineCount = nlapiGetLineItemCount('custpage_results_sublist');

	for(var i = 0; i<=lineCount.length; i++) {
		
		 var icc_initial_item = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_convsublist_initial', i+1);
		 var icc_converted_item = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_convsublist_converted', i+1);
		 var icc_description_line = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_convsublist_description', i+1);
		 var icc_units = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_convsublist_units', i+1);
		 var icc_qty_onhand = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_convsublist_quantity_hand', i+1);
		 var icc_qty_initial = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_convsublist_quantity_initial', i+1);
		 var icc_qty_converted = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_convsublist_quantity_converted', i+1);
		 var icc_bin = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_convsublist_bin', i+1);
		 var icc_inv_detail = nlapiGetLineItemValue('custpage_results_sublist', 'custpage_inv_detail', i+1);
		
		iccLinesArr.push({
			
			icc_initial_item : icc_initial_item,
			icc_converted_item : icc_converted_item,
			icc_description_line : icc_description_line,
			icc_units : icc_units,
			icc_qty_onhand : icc_qty_onhand,
			icc_qty_initial : icc_qty_initial,
			icc_qty_converted : icc_qty_converted,
			icc_bin : icc_bin,
			icc_inv_detail : icc_inv_detail,
			
			
		});
		
	}
	return iccLinesArr;
}