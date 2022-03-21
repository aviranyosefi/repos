/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Aug 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
var subsidiarySelected;

function inventory_cost_conversion(request, response){
	
	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('Inventory Cost Conversion');
		form.addSubmitButton('Continue');
		
		var selectSubsidiary = form.addField('custpage_select_subsidiary','select', 'Choose Subsidary', 'SUBSIDIARY', null);
		
		var toNextPage = form.addField('custpage_ilo_tonextpage','text', 'tosend');
		toNextPage.setDefaultValue('next');
		toNextPage.setDisplayType('hidden');
		
		
		response.writePage(form);
		
	}// end of first if
	
	else if ((request.getParameter('custpage_ilo_tonextpage') == 'next') && (request.getParameter('custpage_select_subsidiary') != '')){
	
		var getSubsid = request.getParameter('custpage_select_subsidiary');
		var subsidRec = nlapiLoadRecord('subsidiary', getSubsid);
		subsidiarySelected = getSubsid;
		var subsidName = subsidRec.getFieldValue('name');
		
		
		var parametersForm = nlapiCreateForm('Inventory Cost Conversion');
		parametersForm.addSubmitButton('Continue');
		
		var hiddenSubsidID = parametersForm.addField('custpage_hidden_subsid', 'text', 'hidden_subsid_id');
		hiddenSubsidID.setDefaultValue(getSubsid);
		hiddenSubsidID.setDisplayType('hidden');
		
		//////HEADER FIELDS//////
		var headersGroup = parametersForm.addFieldGroup('custpage_header_group','Header Information');
		
		
		var today = sysDate();
		var todayDate = nlapiStringToDate(today);
		var selectDate = parametersForm.addField('custpage_choose_date', 'date', 'Date', null, 'custpage_header_group');
		selectDate.setDefaultValue(todayDate);
		selectDate.setMandatory(true);
		
		var descriptionHeader = parametersForm.addField('custpage_description_header', 'textarea', 'Description', null, 'custpage_header_group');
		
		var ICC_tranNum = parametersForm.addField('custpage_icc_trannum', 'text', 'ICC Transaction Number', null, 'custpage_header_group');
		
		var cogsAccountObj = get_COGS_account(getSubsid);
		var cogsAccountField = parametersForm.addField('custpage_cogs_account','text', 'COGS Account', null, 'custpage_header_group');
		cogsAccountField.setDisplayType('inline');
		cogsAccountField.setDefaultValue(cogsAccountObj.cogsName);
		cogsAccountField.setLayoutType('normal', 'startcol');
		
		
		var subsidiarySelected = parametersForm.addField('custpage_selected_subsidiary','text', 'Subsidiary', null, 'custpage_header_group');
		subsidiarySelected.setDisplayType('inline');
		subsidiarySelected.setDefaultValue(subsidName);
		
		var draftInvoices;
		try{
		draftInvoices = get_draft_invoices(getSubsid);
		}catch(err){
			draftInvoices = [];
		}
		var selectDraftInvoices = parametersForm.addField('custpage_select_draft', 'select', 'Select Draft Invoices', null, 'custpage_header_group');
		selectDraftInvoices.addSelectOption('', '');
		if(draftInvoices != []) {
		for(var i = 0; i<draftInvoices.length; i++) {
			selectDraftInvoices.addSelectOption(draftInvoices[i].recID, draftInvoices[i].docNumber);
		}
	}
		
		var customerFromInvoice = parametersForm.addField('custpage_customer_fromdraft','text','Customer', null, 'custpage_header_group');

		var locationsList = getLocationsAll(getSubsid);
		var selectLocations = parametersForm.addField('custpage_select_location','select','Select Location', null, 'custpage_header_group');
		selectLocations.setMandatory( true );
		selectLocations.addSelectOption('', '');
		for(var i = 0; i<locationsList.length; i++) {
			selectLocations.addSelectOption(locationsList[i], locationsList[i]);
		}
		
		
	//////end of HEADER FIELDS//////
		
	//////SUBLIST FIELDS//////
		
		var linesGroup = parametersForm.addFieldGroup('custpage_line_group','Line Information');
		
		var convSubList = parametersForm.addSubList('custpage_results_sublist', 'inlineeditor', 'Lines', 'custpage_line_group');	
//			
			var allItems = get_all_items();
			var conv_initalItem = convSubList.addField('custpage_convsublist_initial', 'select','Initial Item', null);
			conv_initalItem.addSelectOption('', '');
			for(var i = 0; i<allItems.length; i++) {
				conv_initalItem.addSelectOption(allItems[i].itemID, allItems[i].itemName);
			}
			
			var conv_description = convSubList.addField('custpage_convsublist_description', 'text','Description');
			
			
			var conv_convertedItem = convSubList.addField('custpage_convsublist_converted', 'select','Converted Item', null);
			conv_convertedItem.addSelectOption('', '');
			for(var i = 0; i<allItems.length; i++) {
				conv_convertedItem.addSelectOption(allItems[i].itemID, allItems[i].itemName);
			}
			
			var conv_units = convSubList.addField('custpage_convsublist_units', 'text', 'Units');
			var conv_quantity_on_hand = convSubList.addField('custpage_convsublist_quantity_hand', 'text', 'Quantity On Hand');
			var conv_quantity_initial = convSubList.addField('custpage_convsublist_quantity_initial', 'text', 'Quantity of Initial Item');
			var conv_quantity_converted = convSubList.addField('custpage_convsublist_quantity_converted', 'text', 'Quantity of Converted Item');
			var conv_bins = convSubList.addField('custpage_convsublist_bin', 'select', 'Bin');
			var conv_inv_detail = convSubList.addField('custpage_convsublistinv_detail', 'text', 'Inventory Detail');
			
			
			var to = nlapiGetContext();
			var bd = to.getRemainingUsage();
			
			nlapiLogExecution('DEBUG', 'usage left', bd);
			
			
			parametersForm.setScript('customscript_ilo_icc_client_scripts');
		response.writePage(parametersForm);
	}
	
	
	//LAST PAGE OF SUITELET
	else if (request.getParameter('custpage_to_end') == 'end'){ 
		
var getData = request.getParameter('custpage_data_field');
var dataLines = JSON.parse(getData);

var subsid = getSubsidiaries(request.getParameter('custpage_conv_subsid'));
var cogsAccountID = get_COGS_account(subsid);



//var itemid = getItemID(itemname)


var iccHeaderFields = {
		
		//Header Object
		 icc_date : request.getParameter('custpage_conv_date'),
		 icc_description_header : request.getParameter('custpage_conv_description'),
		 icc_cogs_acc : cogsAccountID.cogsID,
		 icc_subsidName : request.getParameter('custpage_conv_subsid'),
		 icc_subsidID : subsid,
		 icc_draft_invoice : request.getParameter('custpage_conv_draftinvoice'),
		 icc_location : getLocations(request.getParameter('custpage_conv_location')),
		 icc_customer : request.getParameter('custpage_conv_draftcustomer'),
		
};




var iccRec = nlapiCreateRecord('customtransaction_ilo_icc_transaction');

//Header Fields 
iccRec.setFieldValue('subsidiary', iccHeaderFields.icc_subsidID);
iccRec.setFieldValue('trandate', iccHeaderFields.icc_date);
iccRec.setFieldValue('custbody_ilo_icc_description', iccHeaderFields.icc_description_header);
iccRec.setFieldValue('custbody_ilo_icc_cogs_acc',iccHeaderFields.icc_cogs_acc);
iccRec.setFieldValue('custbody_ilo_icc_draft_inv',iccHeaderFields.icc_draft_invoice);
iccRec.setFieldValue('custbody_ilo_icc_customer',iccHeaderFields.icc_customer);
iccRec.setFieldValue('custbody_ilo_icc_location', iccHeaderFields.icc_location);


//Line Fields
dataLines.forEach(function(line) {
	

	
	iccRec.selectNewLineItem('line');
	iccRec.setCurrentLineItemValue('line', 'account', iccHeaderFields.icc_cogs_acc);
	iccRec.setCurrentLineItemValue('line', 'amount', '0.00');
	iccRec.setCurrentLineItemValue('line', 'custcol_ilo_icc_initial_item', getItemID(line.initialitem));
	iccRec.setCurrentLineItemValue('line', 'custcol_ilo_icc_converted_item', getItemID(line.converteditem));
	iccRec.setCurrentLineItemValue('line', 'custcol_ilo_icc_description', line.description);
	iccRec.setCurrentLineItemValue('line', 'custcol_ilo_icc_units', line.units);
	iccRec.setCurrentLineItemValue('line', 'custcol_ilo_icc_qty_onhand', line.qty_onhand);
	iccRec.setCurrentLineItemValue('line', 'custcol_ilo_icc_qty_initial', line.qty_initial);
	iccRec.setCurrentLineItemValue('line', 'custcol_ilo_icc_qty_converted', line.qty_converted);
	iccRec.setCurrentLineItemValue('line', 'custcol_ilo_icc_bin', line.bin);
	iccRec.setCurrentLineItemValue('line', 'custcol_ilo_icc_inv_detail', line.invdetail);
	iccRec.commitLineItem('line'); 
	    
});

var icc_id = nlapiSubmitRecord(iccRec);



nlapiScheduleScript('customscript_ilo_icc_create_adjts_ss', 'customdeploy_ilo_icc_create_adjts_ss_dep', {custscript_ilo_ss_icc_id: icc_id});


var jsn = JSON.stringify(iccHeaderFields);

		
		response.write(jsn);
		
		
		
		
		
	}
	
	
	else if (request.getParameter('custpage_select_location') != ' '){
						
		var iccHeaderObject = {
				
				//Header Object
				 icc_date : request.getParameter('custpage_choose_date'),
				 icc_description_header : request.getParameter('custpage_description_header'),
				 icc_cogs_acc : request.getParameter('custpage_cogs_account'),
				 icc_subsidiary : request.getParameter('custpage_selected_subsidiary'),
				 icc_draft_invoice : request.getParameter('custpage_select_draft'),
				 icc_location : request.getParameter('custpage_select_location'),
				 icc_customer : request.getParameter('custpage_customer_fromdraft'),
				
		};
		var getSublistData = request.getParameter('custpage_results_sublistdata');
		var getSublistCols = request.getParameter('custpage_results_sublistlabels');
		

		function getSublistValues(colOrVal) {
			var jsonStr = JSON.stringify(colOrVal);
			var res = jsonStr.replaceAll("\\u0001", ",");
			//var re = /\s*,\s*/;
			//var splitted = res.split(re);
			var cols = res.replace(/\\/g, '');
			return cols;
			
		}
		
		var a = getSublistValues(getSublistCols);
		var b = getSublistValues(getSublistData);
		
		
		function splitMulti(str, tokens){
	        var tempChar = tokens[0]; // We can use the first token as a temporary join character
	        for(var i = 0; i < tokens.length; i++){
	            str = str.split(tokens[i]).join(tempChar);
	        }
	        str = str.split(tempChar);
	        return str;
	}
		
		var allHeaders = splitMulti(a, [',', ':'])
		var allLines = splitMulti(b, [',', 'u0002']);
		var eachLine =[];
		
		var i,j,temparray,chunk = 9;
		for (i=0,j=allLines.length; i<j; i+=chunk) {
		    temparray = allLines.slice(i,i+chunk);
		    // do whatever
		    eachLine.push(temparray);
		}
			
	var checkLines = JSON.stringify(eachLine);
	var headerFields = JSON.stringify(iccHeaderObject);
	var checkHeaders = JSON.stringify(allHeaders);
	
	var convForm = nlapiCreateForm('Creating Conversion');
	convForm.addSubmitButton('Execute');
	
	
	//var convInfo = convForm.addField('custpage_conv_info','text','Date', null, 'custpage_convheader_group');
	var convInfo = convForm.addField('custpage_conv_info','inlinehtml', '', null, null);
	convInfo.setDefaultValue('<font size="2"><b>Executing this form, will create an ICC record for this conversion and two adjustments for each line accordingly.<br><br></b>');
	convInfo.setLayoutType('outsideabove', 'startrow');
	
	var convHeadersGroup = convForm.addFieldGroup('custpage_convheader_group','Header Information');
	
	
	//header fields
	var convDate = convForm.addField('custpage_conv_date','text','Date', null, 'custpage_convheader_group');
	convDate.setDisplayType('inline');
	convDate.setDefaultValue(iccHeaderObject.icc_date);
	
	var convDescription = convForm.addField('custpage_conv_description','longtext','Description', null, 'custpage_convheader_group');
	convDescription.setDisplayType('inline');
	convDescription.setDefaultValue(iccHeaderObject.icc_description_header);
	
	var convCogsAcc = convForm.addField('custpage_conv_cogsacc','text','COGS Account', null, 'custpage_convheader_group');
	convCogsAcc.setDisplayType('inline');
	convCogsAcc.setDefaultValue(iccHeaderObject.icc_cogs_acc);
	
	var convSubsidiary = convForm.addField('custpage_conv_subsid','text','Subsidiary', null, 'custpage_convheader_group');
	convSubsidiary.setDisplayType('inline');
	convSubsidiary.setDefaultValue(iccHeaderObject.icc_subsidiary);
	
	var convLocation = convForm.addField('custpage_conv_location','text','Location', null, 'custpage_convheader_group');
	convLocation.setDisplayType('inline');
	convLocation.setDefaultValue(iccHeaderObject.icc_location);
	
	var convDraftInvoice = convForm.addField('custpage_conv_draftinvoice','text','Draft Invoice', null, 'custpage_convheader_group');
	convDraftInvoice.setDisplayType('inline');
	convDraftInvoice.setDefaultValue(iccHeaderObject.icc_draft_invoice);
	
	var convDraftCustomer = convForm.addField('custpage_conv_draftcustomer','text','Customer', null, 'custpage_convheader_group');
	convDraftCustomer.setDisplayType('inline');
	convDraftCustomer.setDefaultValue(iccHeaderObject.icc_customer);
	
	
	var toEnd = convForm.addField('custpage_to_end', 'text', 'sendtoend');
	toEnd.setDisplayType('hidden');
	toEnd.setDefaultValue('end');
	//////SUBLIST FIELDS//////
	
	var linesGroup = convForm.addFieldGroup('custpage_line_group','Line Information');
	
	var convSubList = convForm.addSubList('custpage_conv_sublist', 'list', 'Lines', 'custpage_line_group');	

		var conv_initalItem = convSubList.addField('custpage_convsublist_initial', 'text','Initial Item', null);
		
		var conv_description = convSubList.addField('custpage_convsublist_description', 'text','Description');
		
	
		var conv_convertedItem = convSubList.addField('custpage_convsublist_converted', 'text','Converted Item', null);
		var conv_units = convSubList.addField('custpage_convsublist_units', 'text', 'Units');
		var conv_quantity_on_hand = convSubList.addField('custpage_convsublist_quantity_hand', 'text', 'Quantity On Hand');
		var conv_quantity_initial = convSubList.addField('custpage_convsublist_quantity_initial', 'text', 'Quantity of Initial Item');
		var conv_quantity_converted = convSubList.addField('custpage_convsublist_quantity_converted', 'text', 'Quantity of Converted Item');
		var conv_bins = convSubList.addField('custpage_convsublist_bin', 'text', 'Bin');
		var conv_inv_detail = convSubList.addField('custpage_convsublist_inv_detail', 'text', 'Inventory Detail');
		
var test;


var something;
var currLine;
for(var i = 0; i<eachLine.length; i++) {
	
	currLine = eachLine[i];
	
	for(var x = 0; x<currLine.length; x++) {
		

		if (currLine[0].charAt(0) === '"') {
			currLine[0] = currLine[0].substr(1);
		}
		if (currLine[8].charAt(0) === '"') {
			currLine[8] = ' ';
		}
		

		convSubList.setLineItemValue('custpage_convsublist_initial', i+1, getItemName(currLine[0]));
		convSubList.setLineItemValue('custpage_convsublist_description', i+1, currLine[1]);
		convSubList.setLineItemValue('custpage_convsublist_converted', i+1,  getItemName(currLine[2]));
		convSubList.setLineItemValue('custpage_convsublist_units', i+1, currLine[3]);
		convSubList.setLineItemValue('custpage_convsublist_quantity_hand', i+1, currLine[4]);
		convSubList.setLineItemValue('custpage_convsublist_quantity_initial', i+1, currLine[5]);
		convSubList.setLineItemValue('custpage_convsublist_quantity_converted', i+1, currLine[6]);
		convSubList.setLineItemValue('custpage_convsublist_bin', i+1, currLine[7]);
		convSubList.setLineItemValue('custpage_convsublist_inv_detail', i+1, currLine[8]);
		
		//nlapiLogExecution('DEBUG', 'currLine[8]', currLine[8])
	}
	
	
}


	
	


		
//		var gto = JSON.stringify(eachLine)
//		response.write(gto);

	//	convForm.setScript('customscript_ilo_icc_client_scripts');

var dataField = convForm.addField('custpage_data_field','longtext','data-field', null, 'custpage_convheader_group');
dataField.setDisplayType('hidden');


	convForm.setScript('customscript_ilo_icc_client_end');

	response.writePage(convForm)
	
	}
	

	
}//end of suitlet




function getLocationsAll(subsidiary) {

	var searchLocations = nlapiLoadSearch(null, 'customsearch_ilo_location_search');
	searchLocations.addFilter(new nlobjSearchFilter('subsidiary', null, 'anyof', subsidiary));

	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchLocations.runSearch();
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

			allResults.push(line.getValue('name'));

		});

	};

return allResults;

}


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


function get_draft_invoices(getSubsid) {
	

	var searchDrafts = nlapiLoadSearch(null,'customsearch_ilo_draft_invoice_search');
	searchDrafts.addFilter(new nlobjSearchFilter( 'subsidiary', null, 'anyof', getSubsid));
	
	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchDrafts.runSearch();
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
			
			docNumber: line.getValue('tranid'),
			recID : line.getValue('internalid'),
			customer : line.getValue('companyname', 'customerMain')
			
			});

		});

	};
	

	return allResults;

       
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
			itemDisplayName : line.getValue('displayname')
			
			});

		});

	};
	

	return allResults;
	}

	
function sysDate() {
	var date = new Date();
	var tdate = date.getDate();
	var month = date.getMonth() + 1; // jan = 0
	var year = date.getFullYear();
	return currentDate = month + '/' + tdate + '/' + year;
	}

String.prototype.replaceAll = function(target, replacement) {
	  return this.split(target).join(replacement);
	};



	function getItemName(itemid) {

	var allItems = get_all_items();

	var itemName;

	for (var i = 0; i < allItems.length; i++) {

		if (allItems[i].itemID == itemid) {

			itemName = allItems[i].itemName

		}
	}

	return itemName;
}
	
	function getItemID(itemname) {

		var allItems = get_all_items();

		var itemID;

		for (var i = 0; i < allItems.length; i++) {

			if (allItems[i].itemName == itemname) {

				itemID = allItems[i].itemID

			}
		}

		return itemID;
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
	
	
	function getSubsidiaries(subsid) {

	var subsidiaries = [];
	var subsidID;

	var columns = [ new nlobjSearchColumn('name'),
			new nlobjSearchColumn('internalid') ];

	var arrSearchResults = nlapiSearchRecord('subsidiary', null, null, columns);

	if (arrSearchResults != null) {

		arrSearchResults.forEach(function(line) {

			subsidiaries.push({

				subsidName : line.getValue('name'),
				subsidID : line.getValue('internalid')

			});

		});
		

		for(var i = 0; i<subsidiaries.length; i++) {
			
			if(subsidiaries[i].subsidName.includes(subsid) == true) {
			
				subsidID = subsidiaries[i].subsidID;
			}
		}

	}

	return subsidID;
}
	
	function getLocations(location) {

		var locations = [];
		var locID;

		var columns = [ new nlobjSearchColumn('name'),
				new nlobjSearchColumn('internalid') ];

		var arrSearchResults = nlapiSearchRecord('location', null, null, columns);

		if (arrSearchResults != null) {

			arrSearchResults.forEach(function(line) {

				locations.push({

					locName : line.getValue('name'),
					locID : line.getValue('internalid')

				});

			});
			

			for(var i = 0; i<locations.length; i++) {
				
				if(locations[i].locName == location) {
				
					locID = locations[i].locID;
				}
			}

		}

		return locID;
	}

