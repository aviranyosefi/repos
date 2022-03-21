/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Aug 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function getSerialNumber(request, response){
	
	try{
	
	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('Serial Number History');
		form.addSubmitButton('Search');
		
		var sum_fieldGroup = form.addFieldGroup('custpage_sum_group','Summary');
		
		var searchSerial = form.addField('custpage_search_serial', 'text', 'Serial Number', null);
		searchSerial.setLayoutType('outsideabove', 'startrow');
		var spacingField = form.addField('custpage_search_spacing', 'text', ' ', null, null);
		spacingField.setDisplayType('inline');
		spacingField.setLayoutType('outsideabove', 'startrow');
		
		var sum_item = form.addField('custpage_summary_item','url', 'Item', null, 'custpage_sum_group');
		sum_item.setDisplayType('inline');
		

		
		var sum_description = form.addField('custpage_summary_description','text', 'Description', null, 'custpage_sum_group');
		sum_description.setDisplayType('inline');
		var sum_item_type = form.addField('custpage_summary_item_type','text', 'Type', null, 'custpage_sum_group');
		sum_item_type.setDisplayType('inline');
		var sum_status = form.addField('custpage_summary_status','text', 'Status', null, 'custpage_sum_group');
		sum_status.setDisplayType('inline');
//		var sum_last_assembly = form.addField('custpage_summary_last_assem','url', 'Last Assembly build', null, 'custpage_sum_group');
//		sum_last_assembly.setDisplayType('inline');
		var sum_date = form.addField('custpage_summary_date','text', 'Date', null, 'custpage_sum_group');
		sum_date.setDisplayType('inline');
		var sum_subsidiary = form.addField('custpage_summary_subsidiary','text', 'Subsidiary', null, 'custpage_sum_group');
		sum_subsidiary.setDisplayType('inline');
		var sum_location = form.addField('custpage_summary_location','text', 'Location', null, 'custpage_sum_group');
		sum_location.setDisplayType('inline');
		var sum_bin = form.addField('custpage_summary_bin','text', 'Bin', null, 'custpage_sum_group');
		sum_bin.setDisplayType('inline');
		
		
		var baseUrl = request.getURL();
		var suitletID = request.getParameter('script');
		var deployID = request.getParameter('deploy');
		var backHome = form.addField('custpage_ilo_back_home', 'text','link back home', null, 'custpage_search_group');
		backHome.setDefaultValue(baseUrl + '?script=' + suitletID + '&deploy='+ deployID);
		backHome.setDisplayType('hidden');
		
		response.writePage(form);
		
	}
	
	else {
		
		var serialSelected = request.getParameter('custpage_search_serial');
		
		var serials = getAllSerials(serialSelected);
		
		var gh = nlapiGetContext();
		var rt = gh.getRemainingUsage();
		
		nlapiLogExecution('DEBUG', 'usage left - beginning of else line-70 ', rt);
		
		
		//nlapiLogExecution('debug', 'serialSelected', serialSelected)
		
		var urlBack = request.getParameter('custpage_ilo_back_home');
		

		
		//nlapiLogExecution('DEBUG', 'urlBack', urlBack);
		
		var resForm = nlapiCreateForm('Serial Number History');

		var backBTN = resForm.addButton('custpage_loadpage_back', 'Clear','go_back();');

		
		var to_backHome_recon = resForm.addField(
				'custpage_ilo_to_back_home', 'text',
				'link back home', null, 'custpage_sum_group');
		to_backHome_recon.setDefaultValue(urlBack);
		to_backHome_recon.setDisplayType('hidden');
		
		//SUMMARY HEADER FIELDS
		var sum_fieldGroup = resForm.addFieldGroup('custpage_sum_group','Summary');

		var selectedSerial = resForm.addField('custpage_summary_selected_serial', 'text','Serial Number', null, null);
		selectedSerial.setDefaultValue(serialSelected);
		selectedSerial.setLayoutType('outsideabove', 'startrow');
		var spacingField = resForm.addField('custpage_search_spacing', 'text', ' ', null, null);
		spacingField.setDisplayType('inline');
		spacingField.setLayoutType('outsideabove', 'startrow');
		var sum_item = resForm.addField('custpage_summary_item','url', 'Item', null, 'custpage_sum_group');
		sum_item.setDisplayType('inline');
		

		
		
		
		var sum_description = resForm.addField('custpage_summary_description','text', 'Description', null, 'custpage_sum_group');
		sum_description.setDisplayType('inline');
		var sum_item_type = resForm.addField('custpage_summary_item_type','text', 'Type', null, 'custpage_sum_group');
		sum_item_type.setDisplayType('inline');
		var sum_status = resForm.addField('custpage_summary_status','text', 'Status', null, 'custpage_sum_group');
		sum_status.setDisplayType('inline');
//		var sum_last_assembly = resForm.addField('custpage_summary_last_assem','url', 'Last Assembly build', null, 'custpage_sum_group');
//		sum_last_assembly.setDisplayType('inline');
//		sum_last_assembly.setLayoutType('normal', 'startcol');

		var sum_date = resForm.addField('custpage_summary_date','text', 'Date', null, 'custpage_sum_group');
		sum_date.setDisplayType('inline');
		var sum_subsidiary = resForm.addField('custpage_summary_subsidiary','text', 'Subsidiary', null, 'custpage_sum_group');
		sum_subsidiary.setDisplayType('inline');
		var sum_location = resForm.addField('custpage_summary_location','text', 'Location', null, 'custpage_sum_group');
		sum_location.setDisplayType('inline');
		var sum_bin = resForm.addField('custpage_summary_bin','text', 'Bin', null, 'custpage_sum_group');
		sum_bin.setDisplayType('inline');
		
		
		// RESULTS TRANSACTIONS SUBLIST
		var resultsSubList = resForm.addSubList('custpage_results_sublist', 'list','Transactions', null);
		var res_viewTran = resultsSubList.addField('custpage_resultssublist_viewtran', 'url', ' ');
		res_viewTran.setLinkText('View');
		var res_Created = resultsSubList.addField('custpage_resultssublist_created', 'text', 'Created');

		var res_TranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'text','Transaction Date');

		var res_TranType = resultsSubList.addField('custpage_resultssublist_trantype', 'text', 'Transaction Type');

		var res_TranNum = resultsSubList.addField('custpage_resultssublist_trannum', 'text', 'Transaction Number');
		
		var res_Warranty = resultsSubList.addField('custpage_resultssublist_warranty', 'text', 'Warranty');
		
		var res_Item = resultsSubList.addField('custpage_resultssublist_item', 'text', 'Item');

		var res_Location = resultsSubList.addField('custpage_resultssublist_location', 'text', 'Location');
		
		var res_Bin = resultsSubList.addField('custpage_resultssublist_bin', 'text','Bin');
		
		var res_Quantity = resultsSubList.addField('custpage_resultssublist_quantity', 'text','Quantity');

		
		var res_viewCreated = resultsSubList.addField('custpage_resultssublist_viewcreated', 'url', ' ');
		res_viewCreated.setLinkText('View');
		var res_CreatedFrom = resultsSubList.addField('custpage_resultssublist_createdfrom', 'text','Created From');
		
		var res_viewEmployee = resultsSubList.addField('custpage_resultssublist_viewemp', 'url', ' ');
		res_viewEmployee.setLinkText('View');
		var res_CreatedBy = resultsSubList.addField('custpage_resultssublist_createdby', 'text','Created By');
		
		nlapiLogExecution('DEBUG', 'usage left - beginning of else line-159 - before getTransactions() ', rt);
		
		try{
			var getAllresults = getTransactions(serialSelected);
}catch(err) {
	nlapiLogExecution('debug', 'getTransactions', err)
}
	
		
		var itemID = getAllresults[getAllresults.length-1].itemid;
		


		nlapiLogExecution('DEBUG', 'usage left - beginning of else line-172 - before getSerialID() ', rt);
		
		try{
			var serialID =  getSerialID(itemID, serialSelected, serials);
		}catch(err) {
			nlapiLogExecution('debug', 'getSerialID', err)
		}
		nlapiLogExecution('debug', 'serialID-firs', serialID)
		nlapiLogExecution('debug', 'itemID', itemID)
		nlapiLogExecution('debug', 'serialSelected', serialSelected)
		
		try{
			var results = getSerialTrans(serialSelected, itemID, serialID);
		}catch(err) {
			nlapiLogExecution('debug', 'getSerialTrans', err)
		}
		
		var to = nlapiGetContext();
		var bd = to.getRemainingUsage();
		
		nlapiLogExecution('DEBUG', 'usage left - after getSerialTrans', bd);
		


		var itemID;
		var lastType;
		var lastTranID;
		var lastBin;
		var tranNum;
		

		
		nlapiLogExecution('DEBUG', 'usage left - before setLineItemValue', bd);
		for(var i = 0; i<results.length; i++) {
			

		
			
			resultsSubList.setLineItemValue('custpage_resultssublist_created', i + 1,results[i].datecreated);
			resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i + 1,results[i].trandate);
			resultsSubList.setLineItemValue('custpage_resultssublist_trantype', i + 1,results[i].trantype);
			resultsSubList.setLineItemValue('custpage_resultssublist_viewtran', i + 1,results[i].trannumber_view);
			resultsSubList.setLineItemValue('custpage_resultssublist_trannum', i + 1,results[i].trannumber);
			resultsSubList.setLineItemValue('custpage_resultssublist_item', i + 1,results[i].item);
			resultsSubList.setLineItemValue('custpage_resultssublist_location', i + 1,results[i].location);
			resultsSubList.setLineItemValue('custpage_resultssublist_bin', i + 1,results[i].binnumber);
			resultsSubList.setLineItemValue('custpage_resultssublist_quantity', i + 1,results[i].quantity);
			resultsSubList.setLineItemValue('custpage_resultssublist_createdfrom', i + 1,results[i].createdfrom);
			resultsSubList.setLineItemValue('custpage_resultssublist_viewcreated', i + 1,results[i].createdFromView);
			resultsSubList.setLineItemValue('custpage_resultssublist_createdby', i + 1,results[i].createdby);
			resultsSubList.setLineItemValue('custpage_resultssublist_viewemp', i + 1,results[i].createdbyView);
			resultsSubList.setLineItemValue('custpage_resultssublist_warranty', i + 1,getWarranty(results[i].warranty));
			

			
			
			itemID = results[0].itemid;
			lastType = getType(results[0].trantype);
			lastTranID = results[0].tranid;
			lastBin = results[0].binnumber;
			lastlocation = results[0].location
			
			if(lastlocation != undefined || null | '') {
				
				sum_location.setDefaultValue(lastlocation);
		
	}
			

			
			
		}
		
		

		//nlapiLogExecution('DEBUG', 'lastType', lastType);
		
		function getItemHeaderDetails (lastType, lastTranID, lastBin, itemID) {
			try{
				var itemRec;
				try{
				 itemRec = nlapiLoadRecord('serializedassemblyitem', itemID);
				}catch(err){
					itemRec = nlapiLoadRecord('serializedinventoryitem', itemID);
				}
				//var itemRec = nlapiLoadRecord('serializedassemblyitem', itemID);
				var itemName = itemRec.getFieldValue('itemid');
				var itemDesc = itemRec.getFieldValue('displayname');
				var itemType = itemRec.getFieldValue('itemtypename');
				//var itemSubsid = itemRec.getFieldText('subsidiary');


				//Setting Header Fields
				sum_item.setLinkText(itemName).setDefaultValue( "https://system.netsuite.com" + nlapiResolveURL( 'RECORD', 'serializedassemblyitem', itemID) );
				sum_description.setDefaultValue(itemDesc);
				sum_item_type.setDefaultValue(itemType);
				
				//sum_location.setDefaultValue(buildLocation);
				
				if(lastType != null) {
					
					var buildRec = nlapiLoadRecord(lastType, lastTranID);
					var buildDate = buildRec.getFieldValue('trandate');
					var buildName = buildRec.getFieldValue('tranid');
					var buildLocation = buildRec.getFieldText('location');
					var buildSubsid = buildRec.getFieldText('subsidiary')
					
					sum_date.setDefaultValue(buildDate);
					
					if(lastType == 'assemblybuild' || lastType == 'assemblyunbuild') {
					sum_last_assembly.setLinkText(buildName).setDefaultValue( "https://system.netsuite.com" + nlapiResolveURL( 'RECORD', lastType, lastTranID) );
					}
					//sum_location.setDefaultValue(buildLocation);
					sum_subsidiary.setDefaultValue(buildSubsid);
					sum_bin.setDefaultValue(lastBin)
				}

			}
			catch(err)
			{
				nlapiLogExecution('DEBUG', 'item err', err);
			}
			
		}
//		
		var itemCheck = getItemHeaderDetails(lastType, lastTranID, lastBin, itemID);
		

		
		
		
		var to = nlapiGetContext();
		var bd = to.getRemainingUsage();
		
		nlapiLogExecution('DEBUG', 'usage left', bd);
		
		
		resForm.setScript('customscript_ilo_serial_history_client');


		response.writePage(resForm);
		
		
//		var JSONstr = JSON.stringify(itemID);
//		response.write(JSONstr);
	}
			
}catch(err){
	
	//no results or error endPage
	
	var noSearchResultsForm = nlapiCreateForm('Serial Number History');
	nlapiLogExecution('DEBUG', 'err', err);
	var noLoadDetails = noSearchResultsForm.addField('custpage_ilo_nosearchresults','inlinehtml', 'no search results', null, null);
	noLoadDetails.setDefaultValue('<font size="2"><b>No transactions or details were found for this serial number. Please check the serial again.<br><br>'+err+'</b>');
	noLoadDetails.setLayoutType('normal', 'startcol');
	noSearchResultsForm.setScript('customscript_ilo_serial_history_client');
	response.writePage(noSearchResultsForm);
	
}
}




function getTransactions(serial) {
	//nlapiLogExecution('debug', 'serial', serial)

		var searchSerial = nlapiLoadSearch(null,'customsearch_ilo_serial_num_search');		
			searchSerial.addFilter(new nlobjSearchFilter( 'serialnumber', null, 'is', serial));
			
			
		var allSelection = [];
		var theResults = [];
		var allResults = [];
		var resultSelection = [];
		var searchid = 0;
		var resultset = searchSerial.runSearch();
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
				
				itemid : line.getValue('item'),
				serialID : line.getValue('inventorynumber', 'inventorydetail')


				});

			});

		};
		
	;
		

		return allResults;
	};
	
	
	
	
	function getSerialTrans(serial, itemID, serialID) {
		var warranty = '';
		
		nlapiLogExecution('debug', 'getSerialTrans-serial', serial)
		nlapiLogExecution('debug', 'getSerialTrans-itemID', itemID)
		nlapiLogExecution('debug', 'getSerialTrans-serialID', serialID)
		
		var resultsArr = [];
		
		var filters = new Array();
		
		filters[0] = new nlobjSearchFilter( 'item', null, 'is', itemID);
		filters[1] = new nlobjSearchFilter( 'serialnumber', null, 'is', serial);
		filters[2] = new nlobjSearchFilter( 'inventorynumber', 'inventorydetail', 'anyof', serialID);
		filters[3] = new nlobjSearchFilter( 'type', null, 'noneof', ['TrnfrOrd']);

		var cols = new Array();
		cols[0] = new nlobjSearchColumn('datecreated').setSort(true);
		cols[1] = new nlobjSearchColumn('trandate');
		cols[2] = new nlobjSearchColumn('tranid');
		cols[3] = new nlobjSearchColumn('internalid');
		cols[4] = new nlobjSearchColumn('item');
		cols[5] = new nlobjSearchColumn('location');
		cols[6] = new nlobjSearchColumn('type');
		cols[7] = new nlobjSearchColumn('quantity');
		cols[8] = new nlobjSearchColumn('binnumber', 'inventorydetail');
		cols[9] = new nlobjSearchColumn('createdfrom');
		cols[10] = new nlobjSearchColumn('createdby');
		cols[11] = new nlobjSearchColumn('inventorynumber', 'inventorydetail');


		var s = nlapiSearchRecord('transaction', null, filters, cols);
		
		if(s != null) {
			

			
			for (var i = 0; i < s.length; i++) {
				
				if(s[i].getValue('type') != 'RtnAuth') {
					
						
					resultsArr.push({
						datecreated : s[i].getValue('datecreated'),
						trandate : s[i].getValue('trandate'),
						trantype : s[i].getValue('type'),
						trannumber_view :transactionView(s[i].getValue('type'), s[i].getValue('internalid')),
						trannumber : s[i].getValue('tranid'),
						createdFromView : createdFromView(s[i].getText('createdfrom'), s[i].getValue('createdfrom')),
						tranid : s[i].getValue('internalid'),
						item : s[i].getText('item'),
						itemid : s[i].getValue('item'),
						location : s[i].getText('location'),
						quantity : s[i].getValue('quantity'),
						binnumber : s[i].getText('binnumber', 'inventorydetail'),
						inventoryDetail : s[i].getValue('inventorydetail', 'inventorydetail'),
						createdfrom : s[i].getText('createdfrom'),
						createdby : s[i].getText('createdby'),
						createdbyView : "https://system.netsuite.com" + nlapiResolveURL('RECORD', 'employee', s[i].getValue('createdby'), 'VIEW'),
						serialInvt : s[i].getValue('inventorynumber', 'inventorydetail'),
						createdfromType : s[i].getText('createdfrom'),
						warranty : s[i].getValue('internalid'),
			
							

										
						});
			}
		}

	}
		
		return resultsArr;
	};


	


//	function checkStockStatus(statusCheck, serialSelected) {
//		
//		var stock = 'Not in Stock';
//		var serials = getAllSerials();
//		
//		for(var i = 0; i<statusCheck.length; i++) {
//			
//			if(statusCheck[i].serial == serialSelected) {
//				stock = 'In Stock';
//			}
//			
//		}
//		return stock;
//	}
	
	
	function getSerialID(itemid, serialselected, serials) {
		
		var serialID = [];
		
		//var serials = getAllSerials();
		
		for(var i = 0; i<serials.length; i++) {
		
		if(serials[i].serialName == serialselected && serials[i].item == itemid) {
		
		
		serialID.push(serials[i].serialID)
		}
		
		}
		
		return serialID;
		
		}
	
//	function setHeaderLocation(itemID, serialSelected) {
//		
//		var serialLoc = [];
//		
//		var serials = getAllSerials();
//		
//		for(var i = 0; i<serials.length; i++) {
//		
//		if(serials[i].serialName == serialSelected && serials[i].item == itemID) {
//		
//		
//			serialLoc.push(serials[i].serialLocation)
//		}
//		
//		}
//		
//		return serialLoc;
//		
//		
//	}
	

	function getType(type) {

	var theType = '';

	if (type == 'Build') {
		theType = 'assemblybuild';
	}
	if (type == 'ItemShip') {
		theType = 'itemfulfillment';
	}
	if (type == 'ItemRcpt') {
		theType = 'itemreceipt';
	}
	if (type == 'InvAdjst') {
		theType = 'inventoryadjustment';
	}
	if (type == 'InvTrnfr') {
		theType = 'inventorytransfer';
	}
	if (type == 'Unbuild') {
		theType = 'assemblyunbuild';
	}
	
	if( type == 'PurchOrd') {
		theType = 'purchaseorder';
	}
	
	if( type == 'BinWksht') {
		theType = 'binworksheet';
	}
	if( type == 'BinTrnfr') {
		theType = 'bintransfer';
	}
	
	if( type == 'TrnfrOrd') {
		theType = 'transferorder';
	}
	if( type == 'CustInvc') {
		theType = 'invoice';
	}
	if( type == 'VendBill') {
		theType = 'vendorbill';
	}
	
	
	return theType;
};


function transactionView(checktype, checkid) {
	
	try{
		
		var viewURL;
		nlapiLogExecution('debug', 'checktype', checktype)
		viewURL = "https://system.netsuite.com" + nlapiResolveURL( 'RECORD', getType(checktype), checkid);
		
		return viewURL;
	}
	catch(err) {
		var empty = '';
		nlapiLogExecution('DEBUG', 'transactionView err', err);
		return empty;
	}
	
}

function getTypeName(value) {

	var clean = '';

	clean = value.replace(/\d+|^\s+|\s+$/g, '');

	if (clean.includes('Work Order') == true) {
		clean = 'workorder';
	}

	if (clean.includes('Sales Order') == true) {
		clean = 'salesorder';
	}

	if (clean.includes('Purchase Order') == true) {
		clean = 'purchaseorder';
	}

	if (clean.includes('Item Receipt') == true) {
		clean = 'itemreceipt';
	}

	if (clean.includes('Inventory Adjustment') == true) {
		clean = 'inventoryadjustment';
	}

	if (clean.includes('Inventory Transfer') == true) {
		clean = 'inventorytransfer';
	}

	if (clean.includes('WO Build') == true) {
		clean = 'assemblybuild';
	}
	
	
	if (clean.includes('Return Authorization') == true) {
		clean = 'returnauthorization';
	}
	
	if (clean.includes('Transfer Order') == true) {
		clean = 'transferorder';
	}

	return clean;
}


function createdFromView(checktype, checkid) {
	
try{
	
	var viewURL;
	nlapiLogExecution('debug', 'checktype2', checktype)
	viewURL = "https://system.netsuite.com" + nlapiResolveURL( 'RECORD', getTypeName(checktype), checkid);
	
	return viewURL;
}
catch(err) {
	var empty = '';
	nlapiLogExecution('DEBUG', 'createdFrom err', err);
	return empty;
}
	
}

function getAllSerials(serialName) {

	var searchSerials = nlapiLoadSearch(null, 'customsearch_ilo_inv_num_serial_search');
	searchSerials.addFilter(new nlobjSearchFilter( 'inventorynumber', null, 'is', serialName));

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


if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}

function getAllSerialsLastCheck(serial) {


	var searchFAM = nlapiLoadSearch(null,'customsearch_ilo_all_serials');
	searchFAM.addFilter(new nlobjSearchFilter( 'inventorynumber', null, 'is', serial));
	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var empty = 'no';
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	
	var resultslice = resultset.getResults(0,1000);
	if(resultslice != null) {

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
			
								
                              theResults.push({
                            	  
                              name : line.getValue('inventorynumber'),
                              location : line.getValue('location'),

                              });

	
               });
	}; 

	}
	return theResults;
	

}


function getWarranty(id) {
	var warranty = '';
	var checkWarranty;
	
	try{
			
	var rec = nlapiLoadRecord('itemfulfillment', id)

	var lineCount = rec.getLineItemCount('item');

	for(var i = 1; i<=lineCount; i++) {

	checkWarranty = rec.getLineItemValue('item', 'custcol_warranty', i);
	
	if(checkWarranty != null) {
		
		warranty = checkWarranty;
	}
	

	}
	return warranty;
	
	}catch(err) {
		
		return warranty;

	}

}