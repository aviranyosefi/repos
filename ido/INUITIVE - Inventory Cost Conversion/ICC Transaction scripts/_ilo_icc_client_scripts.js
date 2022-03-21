var selecteditemID;

function get_COGS_account(subsidiaryID) {

	var rec = nlapiLoadRecord('subsidiary', subsidiaryID);
	var cogsAccID = rec.getFieldValue('custrecord_ilo_subsidiary_cogs_acc');

	var fields = [ 'name', 'number' ];

	var cogsName = nlapiLookupField('account', cogsAccID, 'name');

	var cogsAcc = {
		cogsID : cogsAccID,
		cogsName : cogsName
	};

	return cogsAcc;
}

function getAllSerials() {

	var searchSerials = nlapiLoadSearch(null, 'customsearch_ilo_icc_allserials_search');

	var allserials = [];
	var resultsSerials =[];
	var resultContacts = [];
	var searchid = 0;
	var resultset = searchSerials.runSearch();
	var rs;
	

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allserials.push(resultContacts[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allserials != null) {
				allserials.forEach(function(line) {
					
					
					resultsSerials.push({
					
						serialName : line.getValue('inventorynumber'),
						serialID : line.getValue('internalid'),
						serialLocation : line.getValue('location'),
						qty_onhand : line.getValue('quantityonhand'),
						item : line.getValue('item')
					
					});
		
				
					
					
				});

			};
			
			return resultsSerials;

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

function clientPageInit(type){
	
	try{
		
		var selectedSubsid = nlapiGetFieldValue('subsidiary');
		
		var cogs = get_COGS_account(selectedSubsid);
		
		nlapiSetFieldValue('custbody_ilo_icc_cogs_acc', cogs.cogsID, null, null);
		
		
	}catch(err){
		console.log(err);
		
		var a = nlapiGetFieldValue('subsidiary')
		
	}

   
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
function icc_fieldChange(type, name, linenum){
	
	if (name == 'subsidiary') {
		
	var selectedSubsid = nlapiGetFieldValue('subsidiary');
	
	var cogs = get_COGS_account(selectedSubsid);
	
	nlapiSetFieldValue('custbody_ilo_icc_cogs_acc', cogs.cogsID, null, null);
	
}
	
	if (name == 'custcol_ilo_icc_initial_item') {
		
		selecteditemID = nlapiGetCurrentLineItemValue('line', 'custcol_ilo_icc_initial_item');
		
		setLineValues(selecteditemID);
		
	}
	
	if (name == 'custbody_ilo_icc_draft_inv') {
		
		var getDraftInvID = nlapiGetFieldValue('custbody_ilo_icc_draft_inv');
		
		var invRec = nlapiLoadRecord('invoice', getDraftInvID);
		var draftCustomer = invRec.getFieldValue('entity');
		
		nlapiSetFieldValue('custbody_ilo_icc_customer', draftCustomer);
	}
	
	if (name == 'custcol_ilo_icc_serial_num') {
		
		
		if(nlapiGetCurrentLineItemValue('line', 'custcol_ilo_icc_serials_out') == undefined) {
			
			var selectedSerial = nlapiGetCurrentLineItemText('line', 'custcol_ilo_icc_serial_num');
			nlapiSetCurrentLineItemValue('line', 'custcol_ilo_icc_serials_out', selectedSerial);
			
		}
			var selectedSerial = nlapiGetCurrentLineItemText('line', 'custcol_ilo_icc_serial_num');		
			var serialsSelected = nlapiGetCurrentLineItemValue('line', 'custcol_ilo_icc_serials_out');
			
			nlapiSetCurrentLineItemValue('line', 'custcol_ilo_icc_serials_out', serialsSelected+'\r\n'+selectedSerial);


	}
}




function setLineValues(selecteditemID) {
	
	var getSubsid = nlapiGetFieldValue('subsidiary');
	var allItems = get_all_items(getSubsid);
	
	
	var selectedItem;
	for(var i = 0; i<allItems.length; i++) {
		if(allItems[i].itemID == selecteditemID) {
			selectedItem =allItems[i];
		}
	}


	try{

	var itemRec= nlapiLoadRecord(selectedItem.itemType, selectedItem.itemID);

	var getUnits = itemRec.getFieldValue('stockunit');
	if(getUnits == '1') {
		getUnits = 'Each';
	}
	

	
	nlapiSetCurrentLineItemValue('line', 'custcol_ilo_icc_units', getUnits);
	nlapiSetCurrentLineItemValue('line', 'amount', '0');
	
	nlapiDisableLineItemField('line', 'account', true);
	nlapiDisableLineItemField('line', 'amount', true);
	
	
	var cogsLine = get_COGS_account(getSubsid);
	nlapiSetCurrentLineItemValue('line', 'account', cogsLine.cogsID);
	
	var selectedLocation = nlapiGetFieldValue('custbody_ilo_icc_location');
	var locations = itemRec.lineitems.locations;
	console.log(locations);

	locations.forEach(function(element) {

	if(element.location == selectedLocation) {

	nlapiSetCurrentLineItemValue('line', 'custcol_ilo_icc_qty_onhand', element.quantityonhand);
	try{
		nlapiSetCurrentLineItemValue('line', 'custcol_ilo_icc_initital_cost', element.averagecostmli);
	}catch(err) {
		alert('This item does not have an average cost.');
		nlapiSetCurrentLineItemValue('line', 'custcol_ilo_icc_initital_cost', '0.00');
	}
	
	}
	});

	}catch(err) {

	alert('ERROR ' + err);

	}
	
	try{
		
		function setInventoryInformation(selecteditemID, invNumbers) {
				var invNumbers = getAllSerials();

		var arr = [];
			
			var selectedLocation = nlapiGetFieldValue('custbody_ilo_icc_location');	


						invNumbers.forEach(function(line) {
		if(line.serialLocation == selectedLocation && line.item == selecteditemID) {


		arr.push(line);

		}
							
							
						});
			
			return arr;
		}

		//var selecteditemID = '32';
		var check = setInventoryInformation(selecteditemID);
		console.log(check);

		var spacebetween = '        ';
		var str = '';
		for(var x = 0; x<check.length; x++) {

		str += check[x].serialName +spacebetween+ check[x].qty_onhand +'\n';



		}

		nlapiSetCurrentLineItemValue('line','custcol_ilo_icc_inv_info', str );

	}
	catch(err) {
		
		console.log(err);
		
	}


		
}


	

