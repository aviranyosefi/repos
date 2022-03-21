function tofes_yud_alef(request, response){
	
	var accPeriods = getAccountingPeriods();

	
	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('Tofes Yud Alef');
		form.addSubmitButton('Continue');
		
		var searchFilterGroup = form.addFieldGroup('custpage_search_group','Filters');
		
		var assetTypeGroup = form.addFieldGroup('custpage_assettype_group', 'Asset Types');
				
		
		var selectPeriodFrom = form.addField('custpage_select_periodfrom','select','From Period', null, 'custpage_search_group');
		selectPeriodFrom.setMandatory( true );
		selectPeriodFrom.addSelectOption('', '');
		for(var i = 0; i<accPeriods.length; i++) {
			selectPeriodFrom.addSelectOption(accPeriods[i].periodname, accPeriods[i].periodname);
		}
		selectPeriodFrom.setDefaultValue('Jan 2018');
		var selectPeriodTo = form.addField('custpage_select_periodto','select', 'To Period', null, 'custpage_search_group');
		selectPeriodTo.setMandatory( true );
		selectPeriodTo.addSelectOption('', '');
		for(var i = 0; i<accPeriods.length; i++) {
			selectPeriodTo.addSelectOption(accPeriods[i].periodname, accPeriods[i].periodname);
		}
		selectPeriodTo.setDefaultValue('Sep 2018');
		
		var selectSubsidiary = form.addField('custpage_select_subsidiary','select', 'Subsidary', 'SUBSIDIARY', 'custpage_search_group');
		selectSubsidiary.setMandatory( true );
		var selectBookType = form.addField('custpage_select_booktype','select', 'Select Book', null, 'custpage_search_group');
		selectBookType.setMandatory( true );
		selectBookType.addSelectOption('', '');
		selectBookType.addSelectOption('a', 'Primary Accounting Book');
		selectBookType.addSelectOption('b', 'Secondary Accounting Book');
//		var selectLanguage = form.addField('custpage_select_lang', 'select', 'Select Language', null, 'custpage_search_group');
//		selectLanguage.addSelectOption('', '');
//		selectLanguage.addSelectOption('a', 'English');
//		selectLanguage.addSelectOption('b', 'Hebrew');
	
		var assetTypes = getTypes();
		
		var asset_type_MultiSelect = form.addField('custpage_select_type','multiselect', 'Select Asset Type', null, 'custpage_assettype_group');

		for (var i = 0; i<assetTypes.length; i++) {
		
			asset_type_MultiSelect.addSelectOption(assetTypes[i].internalid, assetTypes[i].type_name);	
		}

			
		var toNextPage = form.addField('custpage_ilo_tonextpage','text', 'tosend');
		toNextPage.setDefaultValue('next');
		toNextPage.setDisplayType('hidden');

		response.writePage(form);

		}//end of first if
	
	
	//ASSET LEVEL REPORT//
	else if (request.getParameter('custpage_ilo_tonextpage') == 'next'){
		
		
		var searchAll = 'customsearch_ilo_ty_activities_3';
		var search_OB_primary_COST = 'customsearch_ilo_ty_pb_cost_ob';
		var search_OB_primary_DPRN = 'customsearch_ilo_ty_pb_dprn_ob';
		
		var search_OB_secondary_COST = 'customsearch_ilo_ty_sb_cost_ob';
		var search_OB_secondary_DPRN = 'customsearch_ilo_ty_sb_dprn_ob';
		
		var selectedSubsid = request.getParameter('custpage_select_subsidiary');
		var selectedBook = request.getParameter('custpage_select_booktype');
		var selectedLang = request.getParameter('custpage_select_lang');
		
		var getAssetTypes = request.getParameterValues('custpage_select_type');
		var selectedAssetTypes = JSON.stringify(getAssetTypes);		

		
		var getPeriodStart = request.getParameter('custpage_select_periodfrom')
		var getPeriodEnd = request.getParameter('custpage_select_periodto');
		
		var accPeriods = getAccountingPeriods();
		
		var all = getAllActivities(selectedBook, selectedSubsid, searchAll);
		
//		nlapiLogExecution('debug', 'all', JSON.stringify(all, null ,2))
	
		var range = getPeriodRange(accPeriods, getPeriodStart, getPeriodEnd);
		
		var OBrange = getOBPeriodRange(accPeriods, getPeriodStart);
		nlapiLogExecution('debug', 'all', JSON.stringify(OBrange, null ,2))

      
		var allAssets = getAllAssets();
	

		var AllLines = {};
		var OBAllLines = {};
		
				allAssets.forEach(function(asset) {

					AllLines[asset] = [];
					OBAllLines[asset] = [];
				});

		for(var i = 0; i<all.length; i++) {
			
			if(range.indexOf(all[i].tran_acc_period) != -1) {
				


			for(var x = 0; x<allAssets.length; x++) {

			if (all[i].asset == allAssets[x]) {

								
				AllLines[allAssets[x]][AllLines[allAssets[x]].length ] = all[i];
						}
				}
			}//end of range
			
			if(OBrange.indexOf(all[i].tran_acc_period) != -1) {

		
				
				for(var x = 0; x<allAssets.length; x++) {
				
				if (all[i].asset == allAssets[x]) {
				
									
					OBAllLines[allAssets[x]][OBAllLines[allAssets[x]].length ] = all[i];
							}
					}
				}//end of OB range
			
			
		}
		
		//nlapiLogExecution('debug', 'AllLines', JSON.stringify(AllLines['IL0011']))
		//nlapiLogExecution('debug', 'OBAllLines', JSON.stringify(OBAllLines['IL0011']))
		

		var allTypes = getTypes();

		
		var AllTypes = {};
		allTypes.forEach(function(type) {
			AllTypes[type.type_name] = [];
		});
		var typeKeys = Object.keys(AllTypes)
		
		var allArr = [];
		
		for(var i = 0; i<allAssets.length; i++) {
			
		var makeLine = makeSingleLine(allAssets[i], AllLines[allAssets[i]], OBAllLines[allAssets[i]]);
		
		for(var x = 0; x<typeKeys.length; x++) {
			if(makeLine.asset_type == typeKeys[x]) {
				AllTypes[typeKeys[x]].push(makeLine)
			}	
			
		}	
		}
		

		for(var x = 0; x<typeKeys.length; x++) {
			

			var currType = AllTypes[typeKeys[x]];
			
			
			var costOB_sum = [];
			var costAcq_sum = [];
			var costDisposal_sum = [];
			var costWritedown_sum = [];
			var costTotal_sum = [];
			var dprnOB_sum = [];
			var dprnDprn_sum = [];
			var dprnDisposal_sum = [];
			var dprnWritedown_sum = [];
			var dprnTotal_sum = [];
			var totalTotal_sum = [];
			
			var totalObj = {
					
					  internalid : '',
					  asset_type : '',
					  asset_description :'',
					  asset_name : 'TOTAL',
					  purchase_date: '',
					  annual_perc : '',
					  cost_openbalance : '',
					  cost_acq: '',
					  cost_disposal: '',
					  cost_writedown: '',
					  cost_total: '',
					  dprn_openbalance : '',
					  dprn_dprn: '',
					  dprn_disposal: '',
					  dprn_writedown: '',
					  dprn_total: '',
					  line_total: '',				  
			}

			if(currType.length == 0) {
				
				totalObj.asset_type = typeKeys[x];
				totalObj.cost_openbalance = '0.00';
				totalObj.cost_acq = '0.00';
				totalObj.cost_disposal = '0.00';
				totalObj.cost_writedown = '0.00';
				totalObj.cost_total = '0.00';
				totalObj.dprn_openbalance = '0.00';
				totalObj.dprn_dprn = '0.00';
				totalObj.dprn_disposal = '0.00';
				totalObj.dprn_writedown = '0.00';
				totalObj.dprn_total = '0.00';
				totalObj.line_total = '0.00';
				
				
			}else{
				
				for(var i = 0; i<currType.length; i++) {
					
					 costOB_sum.push(parseFloat(currType[i].cost_openbalance));
					 costAcq_sum.push(parseFloat(currType[i].cost_acq));
					 costDisposal_sum.push(parseFloat(currType[i].cost_disposal));
					 costWritedown_sum.push(parseFloat(currType[i].cost_writedown));
					 costTotal_sum.push(parseFloat(currType[i].cost_total));
					 dprnOB_sum.push(parseFloat(currType[i].dprn_openbalance));
					 dprnDprn_sum.push(parseFloat(currType[i].dprn_dprn));
					 dprnDisposal_sum.push(parseFloat(currType[i].dprn_disposal));
					 dprnWritedown_sum.push(parseFloat(currType[i].dprn_writedown));
					 dprnTotal_sum.push(parseFloat(currType[i].dprn_total));
					 totalTotal_sum.push(parseFloat(currType[i].line_total));

						totalObj.asset_type = currType[i].asset_type;
			}
			
				totalObj.cost_openbalance = costOB_sum.reduce(add, 0).toFixed(2);
				totalObj.cost_acq = costAcq_sum.reduce(add, 0).toFixed(2);
				totalObj.cost_disposal = costDisposal_sum.reduce(add, 0).toFixed(2);
				totalObj.cost_writedown = costWritedown_sum.reduce(add, 0).toFixed(2);
				totalObj.cost_total = costTotal_sum.reduce(add, 0).toFixed(2);
				totalObj.dprn_openbalance = dprnOB_sum.reduce(add, 0).toFixed(2);
				totalObj.dprn_dprn = dprnDprn_sum.reduce(add, 0).toFixed(2);
				totalObj.dprn_disposal = dprnDisposal_sum.reduce(add, 0).toFixed(2);
				totalObj.dprn_writedown = dprnWritedown_sum.reduce(add, 0).toFixed(2);
				totalObj.dprn_total = dprnTotal_sum.reduce(add, 0).toFixed(2);
				totalObj.line_total = totalTotal_sum.reduce(add, 0).toFixed(2);
			}
			

			currType.push(totalObj)  
		}	


		for(var y = 0; y<typeKeys.length; y++) {
			allArr.push(AllTypes[typeKeys[y]]);			
		}	
		
		
		var GrandTotalObj = {
				
				  internalid : '',
				  asset_type : '',
				  asset_description :'',
				  asset_name : 'GRAND TOTAL',
				  purchase_date: '',
				  annual_perc : '',
				  cost_openbalance : '',
				  cost_acq: '',
				  cost_disposal: '',
				  cost_writedown: '',
				  cost_total: '',
				  dprn_openbalance : '',
				  dprn_dprn: '',
				  dprn_disposal: '',
				  dprn_writedown: '',
				  dprn_total: '',
				  line_total: '',				  
		}
	
		var grand_costOB_sum = [];
		var grand_costAcq_sum = [];
		var grand_costDisposal_sum = [];
		var grand_costWritedown_sum = [];
		var grand_costTotal_sum = [];
		var grand_dprnOB_sum = [];
		var grand_dprnDprn_sum = [];
		var grand_dprnDisposal_sum = [];
		var grand_dprnWritedown_sum = [];
		var grand_dprnTotal_sum = [];
		var grand_totalTotal_sum = [];
		
		var flattened=[];
		
		for (var i=0; i<allArr.length; ++i) {
		    var current = allArr[i];
		    for (var j=0; j<current.length; j++) {
		    	
		    	if(current[j].asset_name == 'TOTAL') {
		    		grand_costOB_sum.push(parseFloat(current[j].cost_openbalance));
		    		grand_costAcq_sum.push(parseFloat(current[j].cost_acq));
		    		grand_costDisposal_sum.push(parseFloat(current[j].cost_disposal));
		    		grand_costWritedown_sum.push(parseFloat(current[j].cost_writedown));
		    		grand_costTotal_sum.push(parseFloat(current[j].cost_total));
		    		grand_dprnOB_sum.push(parseFloat(current[j].dprn_openbalance));
		    		grand_dprnDprn_sum.push(parseFloat(current[j].dprn_dprn));
		    		grand_dprnDisposal_sum.push(parseFloat(current[j].dprn_disposal));
		    		grand_dprnWritedown_sum.push(parseFloat(current[j].dprn_writedown));
		    		grand_dprnTotal_sum.push(parseFloat(current[j].dprn_total));
		    		grand_totalTotal_sum.push(parseFloat(current[j].line_total));
		    	}
		    	flattened.push(current[j]);
		    }
		        
		}
		
		GrandTotalObj.cost_openbalance = grand_costOB_sum.reduce(add, 0).toFixed(2);
		GrandTotalObj.cost_acq = grand_costAcq_sum.reduce(add, 0).toFixed(2);
		GrandTotalObj.cost_disposal = grand_costDisposal_sum.reduce(add, 0).toFixed(2);
		GrandTotalObj.cost_writedown = grand_costWritedown_sum.reduce(add, 0).toFixed(2);
		GrandTotalObj.cost_total = grand_costTotal_sum.reduce(add, 0).toFixed(2);
		GrandTotalObj.dprn_openbalance = grand_dprnOB_sum.reduce(add, 0).toFixed(2);
		GrandTotalObj.dprn_dprn = grand_dprnDprn_sum.reduce(add, 0).toFixed(2);
		GrandTotalObj.dprn_disposal = grand_dprnDisposal_sum.reduce(add, 0).toFixed(2);
		GrandTotalObj.dprn_writedown = grand_dprnWritedown_sum.reduce(add, 0).toFixed(2);
		GrandTotalObj.dprn_total = grand_dprnTotal_sum.reduce(add, 0).toFixed(2);
		GrandTotalObj.line_total = grand_totalTotal_sum.reduce(add, 0).toFixed(2);
		
		flattened.push(GrandTotalObj);
		
		var HTMLlines = makeHTMLlines(flattened);
		
	var htmlLines = HTMLlines.toString().replace(/,/g,'');
		
		
		var resultsForm = nlapiCreateForm('Tofes Yud Alef - Asset Level Report');
		
		var subsidName = nlapiLookupField('subsidiary', selectedSubsid, 'name');
		//var subsidTikNik = nlapiLookupField('subsidiary', selectedSubsid, 'custrecordil_tiknik');
		//var subsidVatReg = nlapiLookupField('subsidiary', selectedSubsid, 'custrecordil_tax_payer_id_subsidary');
		var accBookName = getAccountingBookName(selectedBook);

		var tableGroup = resultsForm.addFieldGroup('custpage_table_group', 'Results');
		
	
			 var htmlHeader = resultsForm.addField('custpage_header', 'inlinehtml');
		     htmlHeader.setDefaultValue("<span style='font-size:18px'>"+subsidName+" - "+accBookName+"</span><br><br>" +
		    		 "<span style='font-size:18px'>"+getPeriodStart+" - "+getPeriodEnd+"</span><br>"); 
//		     		"<span style='font-size:18px'>"+subsidTikNik+" : ��� �������</span><br>" +
//		     		"<span style='font-size:18px'>"+subsidVatReg+" : .�.�</span>");
		     
		     var table =  "<style> table.tya_table {border-collapse: collapse; border: 1px solid black;}th.tya_header {text-align:center; font-weight: bold;border: 1px solid black; padding: 5px;} td.tya_cell {text-align:center; border: 1px solid black; padding: 5px;} tr.mouse_over {text-align:center; border: 2px solid black; background-color: yellow; font-size: 15px; padding: 5px;} td.tya_cell_total {text-align:center; border: 1px solid black; padding: 5px;}</style>" +
		     
		     "<br><br>"+
		     "<table class='tya_table' style='width:100%'> "+
		     "<thead> "+
		     "<tr>"+
		     "<th class='tya_header hideView' style='width:150px'></th>"+
		     "<th class='tya_header' style='width:150px'>ASSET</th> "+
		     "<th class='tya_header' style='width:150px'>ASSET TYPE</th>"+
		     "<th class='tya_header' style='width:150px'>ASSET DESCRIPTION</th>"+
		     "<th class='tya_header' style='width:150px'>PURCHASE DATE</th>"+
		     "<th class='tya_header' style='width:150px'>ANNUAL DPRN %</th>"+
		     "<th class='tya_header' style='width:150px'>COST - OPEN BALANCE</th>"+
		     "<th class='tya_header' style='width:150px'>COST - ACQUISITION</th>"+
		     "<th class='tya_header' style='width:150px'>COST - DISPOSAL</th>"+
		     "<th class='tya_header' style='width:150px'>COST - WRITE DOWN</th>"+
		     "<th class='tya_header' style='width:150px'>COST - TOTAL</th>"+
		     "<th class='tya_header' style='width:150px'>DPRN - OPEN BALANCE</th>"+
		     "<th class='tya_header' style='width:150px'>DPRN - DEPRECIATION</th>"+
		     "<th class='tya_header' style='width:150px'>DPRN - DISPOSAL</th>"+
		     "<th class='tya_header' style='width:150px'>DPRN - WRITE DOWN</th>"+
		     "<th class='tya_header' style='width:150px'>DPRN - TOTAL</th>"+
		     "<th class='tya_header' style='width:150px'>TOTAL</th>"+
		     "</tr>"+
		     "</thead> "+
		     
		     
		     htmlLines+

		     
		     "</table>";
		     

		     
		 var htmlTable = resultsForm.addField('custpage_table', 'inlinehtml', null, 'custpage_table_group');
		 htmlTable.setDefaultValue(table)
		 htmlTable.setLayoutType('outsidebelow', 'startcol')

	
//allAssets[i], AllLines[allAssets[i]], OBAllLines[allAssets[i]]
//var json1 = JSON.stringify(flattened, null, 2)
//response.write(json1)

//var checkranges = 'In range : '+ JSON.stringify(range) + '-------' + 'OB range : '+ JSON.stringify(OBrange);

//var checkLines = lines
//response.write(lines)
	//	nlapiLogExecution('debug', 'selectedSubsid', selectedSubsid)
	//	resultsForm.setScript('customscript_ilo_tofes_yud_alef_client');
		     
		     

		 resultsForm.addButton('custpage_print_pdf', 'Print PDF', null)
		 resultsForm.addButton('custpage_print_csv', 'Export CSV', null)
		resultsForm.setScript('customscript_ilo_tya_client')
		response.writePage(resultsForm);
	}
	


}


function getAccountingPeriods() {

	var searchPeriods = nlapiLoadSearch(null,
			'customsearch_ilo_acc_period_search');

	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchPeriods.runSearch();
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

				periodname : line.getValue('periodname'),

			});

		});
	}
	;

	return allResults;
};

function getPeriodRange(accPeriods, start, end) {

	var periodStr = [];
	for(var i = 0; i<accPeriods.length; i++) {

	periodStr.push(accPeriods[i].periodname);
	}

	var endIndex = periodStr.indexOf(end);

	var startIndex = periodStr.indexOf(start);
	
	var selection = periodStr.slice(startIndex, endIndex+1);

	return selection;
	};
	
	function getOBPeriodRange(accPeriods, getPeriodStart) {

		var periodStr = [];
		for(var i = 0; i<accPeriods.length; i++) {

		periodStr.push(accPeriods[i].periodname);
		}

		var endIndex = periodStr.indexOf(getPeriodStart);

		var startIndex = periodStr.indexOf('Jan 2001');
		
		var selection = periodStr.slice(0, endIndex);

		return selection;
		};
	

function getTypes() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('internalid');

	var s = nlapiSearchRecord('customrecord_ncfar_assettype', null, null, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {

			var typeName = s[i].getValue('name');
			
				
			resultsArr.push({
				type_name : s[i].getValue('name'),
				internalid : s[i].getValue('internalid'),

			});
			
		}

	}

	return resultsArr;
}


function getSelectedTypes(types) {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('internalid');
	

	var s = nlapiSearchRecord('customrecord_ncfar_assettype', null, null, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {
		
		if(types.indexOf(s[i].getValue('internalid')) != -1) {

			resultsArr.push({
				type_name : s[i].getValue('name'),
				internalid : s[i].getValue('internalid'),

			});
			}
		}

	}

	return resultsArr;
	
	
}

function getAllActivities(accBook, subsidiary, search) {
	
	if(accBook == 'a') {
		accBook = '1';
	}
	if(accBook =='b') {
		accBook = '2';
	}
	

	

	var searchFAM = nlapiLoadSearch(null, search);
	searchFAM.addFilter(new nlobjSearchFilter( 'custrecord_deprhistsubsidiary', null, 'is', subsidiary));
	searchFAM.addFilter(new nlobjSearchFilter( 'custrecord_deprhistaccountingbook', null, 'anyof', accBook));

	searchFAM.addColumn(new nlobjSearchColumn( 'internalid', 'CUSTRECORD_DEPRHISTASSET' ));

	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();
	
	//nlapiLogExecution('debug', 'cols', JSON.stringify(cols, null, 2))
	

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

			accounting_book : line.getText(cols[0]),
			transaction_type : line.getText(cols[1]),
			asset : line.getText(cols[2]),
			asset_name : line.getValue(cols[5]),
			asset_type : line.getText(cols[3]),
			asset_lifetime : line.getValue(cols[4]),
			purchase_date : line.getValue(cols[6]),
			subsidiary : line.getText(cols[7]),
			net_amount : line.getValue(cols[8]),
			account : line.getValue(cols[9]),
			parent_transaction : line.getValue(cols[10]),
			tran_acc_period : line.getValue(cols[13]),
			costdprn_formula : line.getValue(cols[11]),
			internalID : line.getValue(cols[21]),
			assetID : line.getValue(cols[20])
		});

		});

	};
	


	return theResults;
}

function add(a, b) {
    return parseFloat(a) + parseFloat(b);
}
//function add(a, b) {
//    return a + b;
//}


function getOpenBalances_Primary(searchid, selectedSubsid) {


	var subsidName = nlapiLookupField('subsidiary', selectedSubsid, 'name');
	
	var searchFAM = nlapiLoadSearch(null,searchid);
	searchFAM.addFilter(new nlobjSearchFilter( 'custrecord_assetsubsidiary', null, 'is', selectedSubsid));
	searchFAM.addColumn(new nlobjSearchColumn( 'internalid', 'CUSTRECORD_DEPRHISTASSET' ));
	
	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();

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
			
		//	if(line.getText(cols[7]) == subsidName) {
								 

                              theResults.push({
                            	  
                              accounting_book : line.getValue(cols[0]),
                              transaction_type : line.getValue(cols[1]),
                              asset : line.getValue(cols[2]),
                              asset_name : line.getValue(cols[3]),
							  asset_type : line.getText(cols[4]),
				  			  asset_lifetime : line.getValue(cols[5]),
							  purchase_date : line.getValue(cols[6]),
							  subsidiary : line.getText(cols[7]),
							  net_amount : line.getValue(cols[8]),
							  account : line.getValue(cols[9]),
							  parent_transaction :line.getValue(cols[10]),
							  internalID : line.getValue(cols[17]),
							  assetID : line.getValue(cols[17])
							  

                              });

			//}
               });
	}; 

	return theResults;
}

function getAllAssets() {


	var searchAssets = nlapiLoadSearch(null, 'customsearch_far_assetsbyid_2');

	var allassets = [];
	var resultsAssets =[];
	var resultContacts = [];
	var searchid = 0;
	var resultset = searchAssets.runSearch();
	var rs;
	

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allassets.push(resultContacts[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allassets != null) {
				allassets.forEach(function(line) {
					
					
					resultsAssets.push(line.getValue('name'));
					
				});

			};
			
			return resultsAssets;

}


function getAccountingBookName(accBook) {
	
	var accBookName = '';
		
		if(accBook == 'a') {
			accBookName = 'Primary Accounting Book'	
		}
		if(accBook == 'b') {
			accBookName = 'Secondary Accounting Book'	
		}
		
		return accBookName;
	
}

function transactionView(checkid) {
	
	try{
		
		var viewURL;
		
		viewURL = "https://system.eu2.netsuite.com" + nlapiResolveURL( 'RECORD', 'customrecord_ncfar_asset', checkid);
		
		return viewURL;
	}
	catch(err) {
		var empty = '';
		nlapiLogExecution('DEBUG', 'transactionView err', err);
		return empty;
	}
	
}

function getAnnualDPRNPerc(asset_lifetime) {

	var lifetime = asset_lifetime;

	var result = 100/parseInt(lifetime)*12;
	var perc = '%';

	var res = result.toFixed(2) + perc;
//	var res = result + perc;
//	if(res == '33.33333333333333%') {
//		res = '33.33%';
//	}
	
	
	
	return res;

	}

function assetView(checkid) {
	
	try{
		
		var viewURL;
		
		viewURL = "https://system.netsuite.com" + nlapiResolveURL( 'RECORD', 'customrecord_ncfar_asset', checkid);
		
		return viewURL;
	}
	catch(err) {
		var empty = '';
		nlapiLogExecution('DEBUG', 'transactionView err', err);
		return empty;
	}
	
}


function makeSingleLine(assetName, AllLines, OBAllLines)  {
	
	
	var lineObj = {		
		internalid: '',
		asset_type : '',
		asset_description : '',
		asset_name : assetName,
		purchase_date : '',
		annual_perc : '',
		cost_openbalance : '',
		cost_acq: '',
		cost_disposal: '',
		cost_writedown: '',
		cost_total: '',
		dprn_openbalance: '',
		dprn_dprn: '',
		dprn_disposal: '',
		dprn_writedown: '',
		dprn_total : '',
		line_total : '',	
	}
	
	var cost_sumAcq = [];
	var cost_sumDisposal = [];
	var cost_sumWriteDown = [];
	var costOB = [];

	
	//variables as integers - COST
	var int_cost_acq = 0
	var int_cost_disposal = 0
	var int_cost_writedown = 0
	var int_cost_ob = 0
	
	var dprn_sumDprn  = [];
	var dprn_sumDisposal = [];
	var dprn_sumWriteDown = [];
	var dprnOB = []
	
	//variables as integers - DPRN
	var int_dprn_dprn = 0
	var int_dprn_disposal = 0
	var int_dprn_writedown = 0
	var int_dprn_ob = 0
	
	
	
	var inRange_single = AllLines;
	var OB_single = OBAllLines;
	

		
		for(var i = 0; i<inRange_single.length; i++) {
			

			var indicator = inRange_single[i].costdprn_formula;
			var trantype = inRange_single[i].transaction_type;
			
			lineObj.internalid = inRange_single[i].assetID;
			lineObj.asset_type = inRange_single[i].asset_type;
			lineObj.asset_description = inRange_single[i].asset_name;
			lineObj.purchase_date = inRange_single[i].purchase_date;
			lineObj.annual_perc = getAnnualDPRNPerc(inRange_single[i].asset_lifetime);			
			
			if(indicator == 'COST' && trantype == 'Acquisition') {
				cost_sumAcq.push(parseFloat(inRange_single[i].net_amount));
			}
			if(indicator == 'COST' && trantype == 'Disposal') {
				cost_sumDisposal.push(parseFloat(inRange_single[i].net_amount));
			}
			if(indicator == 'COST' && trantype == 'Write-down') {
				cost_sumWriteDown.push(parseFloat(inRange_single[i].net_amount));	
			}
		
			
			if(indicator == 'DPRN' && trantype == 'Depreciation') {
				dprn_sumDprn.push(parseFloat(inRange_single[i].net_amount))	
			}
			if(indicator == 'DPRN' && trantype == 'Disposal') {
				dprn_sumDisposal.push(parseFloat(inRange_single[i].net_amount))	
			}
			if(indicator == 'DPRN' && trantype == 'Write-down') {
				dprn_sumWriteDown.push(parseFloat(inRange_single[i].net_amount))		
			}		
		
		
	}
	

	
	int_cost_acq = cost_sumAcq.reduce(add, 0)
	int_cost_disposal = cost_sumDisposal.reduce(add, 0)
	int_cost_writedown = cost_sumWriteDown.reduce(add, 0)
	lineObj.cost_acq = int_cost_acq.toFixed(2);
	lineObj.cost_disposal = int_cost_disposal.toFixed(2);
	lineObj.cost_writedown = int_cost_writedown.toFixed(2);
	
	
	int_dprn_dprn = dprn_sumDprn.reduce(add, 0);
	int_dprn_disposal = dprn_sumDisposal.reduce(add, 0);
	int_dprn_writedown = dprn_sumWriteDown.reduce(add, 0);
	lineObj.dprn_dprn = int_dprn_dprn.toFixed(2);
	lineObj.dprn_disposal = int_dprn_disposal.toFixed(2);
	lineObj.dprn_writedown = int_dprn_writedown.toFixed(2);
	
	

	
	for(var i = 0; i<OB_single.length; i++) {
		
		if(lineObj.internalid == '') {
			lineObj.internalid = OB_single[i].assetID
		}
		if(lineObj.asset_type == '') {
			lineObj.asset_type = OB_single[i].asset_type
		}
		if(lineObj.asset_description == '') {
			lineObj.asset_description = OB_single[i].asset_name
		}
		if(lineObj.purchase_date == '') {
			lineObj.purchase_date = OB_single[i].purchase_date
		}
		if(lineObj.annual_perc == '') {
			lineObj.annual_perc = getAnnualDPRNPerc(OB_single[i].asset_lifetime)
		}
		
		var indicator = OB_single[i].costdprn_formula;
		var trantype = OB_single[i].transaction_type;
		
		if(indicator == 'COST' && (trantype == 'Acquisition' || trantype == 'Disposal' || trantype == 'Write-down')) {
			costOB.push(parseFloat(OB_single[i].net_amount));	
		}

		
		if(indicator == 'DPRN' && (trantype == 'Depreciation' || trantype == 'Disposal' || trantype == 'Write-down')) {
			dprnOB.push(parseFloat(OB_single[i].net_amount));
		}	
	}
	
	
	int_cost_ob = costOB.reduce(add, 0);
	lineObj.cost_openbalance = int_cost_ob.toFixed(2);
	
	int_dprn_ob = dprnOB.reduce(add, 0);
	lineObj.dprn_openbalance = int_dprn_ob.toFixed(2);
	

	var totalCost = int_cost_acq+int_cost_disposal+int_cost_writedown+int_cost_ob
	var totalDprn = int_dprn_dprn+int_dprn_disposal+int_dprn_writedown+int_dprn_ob
	lineObj.cost_total = totalCost.toFixed(2);
	lineObj.dprn_total = totalDprn.toFixed(2);  
	
	lineObj.line_total = (totalCost + totalDprn).toFixed(2);
	

	return lineObj;
	
}

function makeHTMLlines(flattened) {
	
	var res = [];

	if (flattened != []) {
		
		flattened.forEach(function(element) {
				
			var htmlLine = '';
			var mouseoverclass='"mouse_over"';
			if(element.asset_name != 'TOTAL') {
				
//				 htmlLine = "<tr onmouseover='this.classname=" + mouseoverclass + "'>" +
				htmlLine = "<tr>" +
				    "<td class='tya_cell hideView' data-attribute='internalid' style='width:150px'><a href = "+assetView(element.internalid)+">View</a></td>"+
				    "<td class='tya_cell' data-attribute='asset' style='width:150px'>"+element.asset_name+"</td>"+
				    "<td class='tya_cell' data-attribute='assettype' style='width:150px'>"+element.asset_type+"</td>"+
				    "<td class='tya_cell' data-attribute='assetdescription' style='width:150px'>"+element.asset_description+"</td>"+
				    "<td class='tya_cell' data-attribute='purchase-date' style='width:150px'>"+element.purchase_date+"</td>"+
				    "<td class='tya_cell' data-attribute='annualperc' style='width:150px'>"+element.annual_perc+"</td>"+
				    "<td class='tya_cell' data-attribute='cost_ob' style='width:150px'>"+element.cost_openbalance+"</td>"+
				    "<td class='tya_cell' data-attribute='cost_acq' style='width:150px'>"+element.cost_acq+"</td>"+
				    "<td class='tya_cell' data-attribute='cost_dispoal' style='width:150px'>"+element.cost_disposal+"</td>"+
				    "<td class='tya_cell' data-attribute='cost_writedown' style='width:150px'>"+element.cost_writedown+"</td>"+
				    "<td class='tya_cell' data-attribute='cost_total' style='width:150px; font-weight: bold'>"+element.cost_total+"</td>"+
				    "<td class='tya_cell' data-attribute='dprn_ob' style='width:150px'>"+element.dprn_openbalance+"</td>"+
				    "<td class='tya_cell' data-attribute='dprn_dprn' style='width:150px'>"+element.dprn_dprn+"</td>"+
				    "<td class='tya_cell' data-attribute='dprn_disposal' style='width:150px'>"+element.dprn_disposal+"</td>"+
				    "<td class='tya_cell' data-attribute='dprn_writedown' style='width:150px'>"+element.dprn_writedown+"</td>"+
				    "<td class='tya_cell' data-attribute='dprn_total' style='width:150px; font-weight: bold'>"+element.dprn_total+"</td>"+
				    "<td class='tya_cell' data-attribute='total' style='width:150px; font-weight: bold'>"+element.line_total+"</td>"+
				    "</tr>";
					
					
					
			}
			if(element.asset_name == 'TOTAL' || element.asset_name == 'GRAND TOTAL') {
				 htmlLine = "<tr>"+
				    "<td class='tya_cell_total hideView' data-attribute='internalid' style='width:150px; font-weight: bold;'></td>"+
				    "<td class='tya_cell_total' data-attribute='asset' style='width:150px; font-weight: bold;'>"+element.asset_name+"</td>"+
				    "<td class='tya_cell_total' data-attribute='assettype' style='width:150px; font-weight: bold;'>"+element.asset_type+"</td>"+
				    "<td class='tya_cell_total' data-attribute='assetdescription' style='width:150px; font-weight: bold'>"+element.asset_description+"</td>"+
				    "<td class='tya_cell_total' data-attribute='purchase-date' style='width:150px; font-weight: bold'>"+element.purchase_date+"</td>"+
				    "<td class='tya_cell_total' data-attribute='annualperc' style='width:150px; font-weight: bold'>"+element.annual_perc+"</td>"+
				    "<td class='tya_cell_total' data-attribute='cost_ob' style='width:150px; font-weight: bold'>"+element.cost_openbalance+"</td>"+
				    "<td class='tya_cell_total' data-attribute='cost_acq' style='width:150px; font-weight: bold'>"+element.cost_acq+"</td>"+
				    "<td class='tya_cell_total' data-attribute='cost_dispoal' style='width:150px; font-weight: bold'>"+element.cost_disposal+"</td>"+
				    "<td class='tya_cell_total' data-attribute='cost_writedown' style='width:150px; font-weight: bold'>"+element.cost_writedown+"</td>"+
				    "<td class='tya_cell_total' data-attribute='cost_total' style='width:150px; font-weight: bold'>"+element.cost_total+"</td>"+
				    "<td class='tya_cell_total' data-attribute='dprn_ob' style='width:150px; font-weight: bold'>"+element.dprn_openbalance+"</td>"+
				    "<td class='tya_cell_total' data-attribute='dprn_dprn' style='width:150px; font-weight: bold'>"+element.dprn_dprn+"</td>"+
				    "<td class='tya_cell_total' data-attribute='dprn_disposal' style='width:150px; font-weight: bold'>"+element.dprn_disposal+"</td>"+
				    "<td class='tya_cell_total' data-attribute='dprn_writedown' style='width:150px; font-weight: bold'>"+element.dprn_writedown+"</td>"+
				    "<td class='tya_cell_total' data-attribute='dprn_total' style='width:150px; font-weight: bold'>"+element.dprn_total+"</td>"+
				    "<td class='tya_cell_total' data-attribute='total' style='width:150px; font-weight: bold'>"+element.line_total+"</td>"+
				    "</tr>";
				
				
			}

			res.push(htmlLine)
			});
		
		return res;
	}
	
	
}