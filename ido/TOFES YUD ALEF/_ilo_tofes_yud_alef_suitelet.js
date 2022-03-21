


function tofes_yud_alef(request, response){
	
	var accPeriods = getAccountingPeriods();

	
	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('Tofes Yud Alef');
		form.addSubmitButton('Continue');
		
		var searchFilterGroup = form.addFieldGroup('custpage_search_group','Filters');
		
		var assetTypeGroup = form.addFieldGroup('custpage_assettype_group', 'Asset Types');
		
		var selectReport = form.addField('custpage_choose_report', 'select', 'Choose Report', null, 'custpage_search_group');
		selectReport.setMandatory( true );
		selectReport.addSelectOption('', '');
		selectReport.addSelectOption('a', 'Asset Type');
		selectReport.addSelectOption('b', 'Asset Level');
		
		
		var selectPeriodFrom = form.addField('custpage_select_periodfrom','select','From Period', null, 'custpage_search_group');
		selectPeriodFrom.setMandatory( true );
		selectPeriodFrom.addSelectOption('', '');
		for(var i = 0; i<accPeriods.length; i++) {
			selectPeriodFrom.addSelectOption(accPeriods[i].periodname, accPeriods[i].periodname);
		}
		selectPeriodFrom.setDefaultValue('Jan 2017');
		var selectPeriodTo = form.addField('custpage_select_periodto','select', 'To Period', null, 'custpage_search_group');
		selectPeriodTo.setMandatory( true );
		selectPeriodTo.addSelectOption('', '');
		for(var i = 0; i<accPeriods.length; i++) {
			selectPeriodTo.addSelectOption(accPeriods[i].periodname, accPeriods[i].periodname);
		}
		selectPeriodTo.setDefaultValue('Feb 2017');
		
		var selectSubsidiary = form.addField('custpage_select_subsidiary','select', 'Subsidary', 'SUBSIDIARY', 'custpage_search_group');
		selectSubsidiary.setMandatory( true );
		var selectBookType = form.addField('custpage_select_booktype','select', 'Select Book', null, 'custpage_search_group');
		selectBookType.setMandatory( true );
		selectBookType.addSelectOption('', '');
		selectBookType.addSelectOption('a', 'Primary Accounting Book');
		selectBookType.addSelectOption('b', 'Secondary Accounting Book');
		var selectLanguage = form.addField('custpage_select_lang', 'select', 'Select Language', null, 'custpage_search_group');
		selectLanguage.addSelectOption('', '');
		selectLanguage.addSelectOption('a', 'English');
		selectLanguage.addSelectOption('b', 'Hebrew');
		
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
	
	
	
	
	//ASSET TYPE REPORT//
	else if ((request.getParameter('custpage_ilo_tonextpage') == 'next') && (request.getParameter('custpage_choose_report') == 'a')){
		
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
		
		var cost_ob_primary; //also can be Secondary Book
		var dprn_ob_primary; //also can be Secondary Book
		
		
		if(selectedBook == 'b') {
			
			cost_ob_primary = getOpenBalances_Primary(search_OB_secondary_COST, selectedSubsid);
			dprn_ob_primary = getOpenBalances_Primary(search_OB_secondary_DPRN, selectedSubsid);
				
		}
		if(selectedBook == 'a') {
			
			cost_ob_primary = getOpenBalances_Primary(search_OB_primary_COST, selectedSubsid);
			dprn_ob_primary = getOpenBalances_Primary(search_OB_primary_DPRN, selectedSubsid);
			
		}
		
		



		var range = getPeriodRange(accPeriods, getPeriodStart, getPeriodEnd);
		
		var OBrange = getOBPeriodRange(accPeriods, getPeriodStart);
		
		nlapiLogExecution('debug', 'range', range)
				nlapiLogExecution('debug', 'OBrange', OBrange)
		
		
		var	typesArr;
		
		if (getAssetTypes != null) {
			typesArr = getSelectedTypes(getAssetTypes);
		}
		
		if (getAssetTypes == null) {
			typesArr = getTypes();
		}

		
		var AllTypes = {};
		
		var AllTypesOB = {};
		
		var openBalancePrimary_Cost = {}; //also can be Secondary Book
		var openBalancePrimary_Dprn = {}; //also can be Secondary Book

		typesArr.forEach(function(type) {

			AllTypes[type.type_name] = [];
			AllTypesOB[type.type_name] = [];
			openBalancePrimary_Cost[type.type_name] = [];
			openBalancePrimary_Dprn[type.type_name] = [];

		});

		var keys = Object.keys(AllTypes);
		keys.push('TOTALS');
		

		///ALL ACTIVITIES FROM nitai tofes yud alef Activities - idotest  - customsearch_ilo_ty_activities_3//
		for (var i = 0; i < all.length; i++) {

			//checking that results are in selected range

		//	if(range.indexOf(all[i].tran_acc_period) != -1) {

				for (var x = 0; x < keys.length; x++) {
					
					if(keys[x] == 'TOTALS') {
						
						AllTypes['TOTALS'] = [];
					}

					if (all[i].asset_type == keys[x]) {

						AllTypes[keys[x]][AllTypes[keys[x]].length ] = all[i];

						}
					}
				//}
			//if(OBrange.indexOf(all[i].tran_acc_period) != -1) {

				for (var x = 0; x < keys.length; x++) {
					
				if(keys[x] == 'TOTALS') {
						
					AllTypesOB['TOTALS'] = [];
					}

					if (all[i].asset_type == keys[x]) {

						AllTypesOB[keys[x]][AllTypesOB[keys[x]].length ] = all[i];

						}
					}
				//}
			}
		
		
		
		for (var i = 0; i < cost_ob_primary.length; i++) {

				for (var x = 0; x < keys.length; x++) {
					
					if(keys[x] == 'TOTALS') {
						
						openBalancePrimary_Cost['TOTALS'] = [];
						}

					if (cost_ob_primary[i].asset_type == keys[x]) {

						openBalancePrimary_Cost[keys[x]][openBalancePrimary_Cost[keys[x]].length ] = cost_ob_primary[i];

						}
					}
				

			}
		
		for (var i = 0; i < dprn_ob_primary.length; i++) {

			for (var x = 0; x < keys.length; x++) {
				
				if(keys[x] == 'TOTALS') {
					
					openBalancePrimary_Dprn['TOTALS'] = [];
					}

				if (dprn_ob_primary[i].asset_type == keys[x]) {

					openBalancePrimary_Dprn[keys[x]][openBalancePrimary_Dprn[keys[x]].length ] = dprn_ob_primary[i];

					}
				}
			

		}

		
		
		////////////////////////////////////////////////
		///AllTypes is transactions in range
		////////////////////////////////////////////////
		keys.forEach(function(key) {
			
			if(AllTypes[key] != undefined) {

			var cost_acq = [];
			var cost_disposal = [];
			var cost_writedown = [];

			var dprn_depreciation = [];
			var dprn_disposal = [];
			var dprn_writedown = [];
			
		

			for(var i = 0; i<AllTypes[key].length; i++) {
				
				
				var netAmt = JSON.stringify(AllTypes[key][i].net_amount)
				var assetId = JSON.stringify(AllTypes[key][i].asset)
			
			if((AllTypes[key][i].costdprn_formula == 'COST') && (AllTypes[key][i].transaction_type == 'Acquisition')) {
											
			cost_acq.push(AllTypes[key][i].net_amount);
						
			var summed_cost_acq = cost_acq.reduce(add, 0);
			
					}
			
			if((AllTypes[key][i].costdprn_formula == 'COST') && (AllTypes[key][i].transaction_type == 'Disposal')) {
			
				cost_disposal.push(parseFloat(AllTypes[key][i].net_amount))
			
			var summed_cost_disposal = cost_disposal.reduce(add, 0);
			
					}
			
			if((AllTypes[key][i].costdprn_formula == 'COST') && (AllTypes[key][i].transaction_type == 'Write-down')) {
			
				cost_writedown.push(parseFloat(AllTypes[key][i].net_amount))
			
			var summed_cost_writedown = cost_writedown.reduce(add, 0);
			
					}
			
			if((AllTypes[key][i].costdprn_formula == 'DPRN') && (AllTypes[key][i].transaction_type == 'Depreciation')) {
				
				dprn_depreciation.push(AllTypes[key][i].net_amount);
							
				var summed_dprn_dprn = dprn_depreciation.reduce(add, 0);
				
						}
				
				if((AllTypes[key][i].costdprn_formula == 'DPRN') && (AllTypes[key][i].transaction_type == 'Disposal')) {
				
					dprn_disposal.push(parseFloat(AllTypes[key][i].net_amount))
				
				var summed_dprn_disposal = dprn_disposal.reduce(add, 0);
				
						}
				
				if((AllTypes[key][i].costdprn_formula == 'DPRN') && (AllTypes[key][i].transaction_type == 'Write-down')) {
				
					dprn_writedown.push(parseFloat(AllTypes[key][i].net_amount))
				
				var summed_dprn_writedown = dprn_writedown.reduce(add, 0);
				
						}
				
			}
			
	
			

		AllTypes[key].push({

		cost_acq : summed_cost_acq,
		cost_disposal : summed_cost_disposal,
		cost_writedown : summed_cost_writedown,
		dprn_dprn : summed_dprn_dprn,
		dprn_disposal : summed_dprn_disposal,
		dprn_writedown : summed_dprn_writedown,
		})
		
			}//end of if AllTypes[key] != undefined
		
		});
		
		////////////////////////////////////////////////
		///AllTypesOB is transactions OPEN BALANCE
		////////////////////////////////////////////////

		
		keys.forEach(function(key) {
			
			if(AllTypesOB[key] != undefined) {
			
				var cost_acq_OB= [];
				var cost_disposal_OB= [];
				var cost_writedown_OB = [];

				var dprn_depreciation_OB = [];
				var dprn_disposal_OB = [];
				var dprn_writedown_OB = [];

				var summed_cost_acq;
				
				var summed_dprn_dprn;
				var summed_dprn_disposal;
				var summed_dprn_writedown;
				
			
			for(var i = 0; i<AllTypesOB[key].length; i++) {
				
				var netAmt = JSON.stringify(AllTypesOB[key][i].net_amount);
				var assetId = JSON.stringify(AllTypesOB[key][i].asset)
			
			if((AllTypesOB[key][i].costdprn_formula == 'COST') && (AllTypesOB[key][i].transaction_type == 'Acquisition' || AllTypesOB[key][i].transaction_type == 'Disposal' || AllTypesOB[key][i].transaction_type == 'Write-down')) {
											
				cost_acq_OB.push(AllTypesOB[key][i].net_amount);
						
			 summed_cost_acq = cost_acq_OB.reduce(add, 0);
			
					}
					
			if(AllTypesOB[key][i].costdprn_formula == 'DPRN') {
					
	if (AllTypesOB[key][i].transaction_type == 'Depreciation') {
		
		dprn_depreciation_OB.push(AllTypesOB[key][i].net_amount);
		
		 summed_dprn_dprn = dprn_depreciation_OB.reduce(add, 0);
		
	}
	if (AllTypesOB[key][i].transaction_type == 'Disposal') {
		
		dprn_disposal_OB.push(AllTypesOB[key][i].net_amount);
		
		summed_dprn_disposal = dprn_disposal_OB.reduce(add, 0);
		
	}
	if (AllTypesOB[key][i].transaction_type == 'Write-down') {
		
		dprn_writedown_OB.push(AllTypesOB[key][i].net_amount);
		
		summed_dprn_writedown = dprn_writedown_OB.reduce(add, 0);
		
	}
	
	
			}	
			
				
			}

			AllTypesOB[key].push({

				cost_acq_OB : summed_cost_acq,
				dprn_dprn_OB : summed_dprn_dprn,
				dprn_disposal_OB : summed_dprn_disposal,
				dprn_writedown_OB : summed_dprn_writedown,
		});
		
			}//end of if AllTypes[key] != undefined
			
		});
		
		
		
		keys.forEach(function(key) {
			
			var cost_OB_old= [];
			var dprn_OB_old= [];


			for(var i = 0; i<openBalancePrimary_Cost[key].length; i++) {	
				
				if(openBalancePrimary_Cost[key][i].net_amount != "") {
											
				cost_OB_old.push(openBalancePrimary_Cost[key][i].net_amount);
				
				}		
			var summed_cost_ob = cost_OB_old.reduce(add, 0);		
				
			}
			
			for(var i = 0; i<openBalancePrimary_Dprn[key].length; i++) {	
				
				if(openBalancePrimary_Dprn[key][i].net_amount != "") {
				
				dprn_OB_old.push(openBalancePrimary_Dprn[key][i].net_amount);
				
				}
			var summed_dprn_ob = dprn_OB_old.reduce(add, 0);		
				
			}
			
			openBalancePrimary_Cost[key].push({

				cost_sum_OB_old : summed_cost_ob,
		})
		
					openBalancePrimary_Dprn[key].push({

						dprn_sum_OB_old : summed_dprn_ob,
		})
		});
		
	//nlapiLogExecution('debug', 'openBalancePrimary_Dprn[key]', JSON.stringify(openBalancePrimary_Dprn['Computers']))
	

		
		
		var resultsForm = nlapiCreateForm('Tofes Yud Alef - Asset Type Report');
		

		
		var resultsSubList = resultsForm.addSubList('custpage_results_sublist', 'list', null, null);
		

		var subsidName = nlapiLookupField('subsidiary', selectedSubsid, 'name');
		var accBookName = getAccountingBookName(selectedBook);
		
		 var htmlHeader = resultsForm.addField('custpage_header', 'inlinehtml');
		     htmlHeader.setDefaultValue("<span style='font-size:18px'>"+subsidName+" - "+accBookName+"</span><br><span style='font-size:18px'>"+getPeriodStart+" - "+getPeriodEnd+"</span>");
	
		
		var res_assetType = resultsSubList.addField('custpage_resultssublist_type', 'text','Asset Type');
		var res_c_openBalance = resultsSubList.addField('custpage_resultssublist_c_openbalance', 'text','COST - Open Balance');
		var res_c_acquisition = resultsSubList.addField('custpage_resultssublist_c_acquisition', 'text','COST - Acquisition');
		var res_c_disposal = resultsSubList.addField('custpage_resultssublist_c_disposal', 'text', 'COST - Disposal');
		var res_c_writedown = resultsSubList.addField('custpage_resultssublist_c_writedown', 'text', 'COST - Write Down');
		var res_c_total = resultsSubList.addField('custpage_resultssublist_c_total', 'text', 'COST - TOTAL');
		
		var res_d_openBalance = resultsSubList.addField('custpage_resultssublist_d_openbalance', 'text','DPRN - Open Balance');
		var res_d_dprn = resultsSubList.addField('custpage_resultssublist_d_depreciation', 'text','DPRN - Depreciation');
		var res_d_disposal = resultsSubList.addField('custpage_resultssublist_d_disposal', 'text', 'DPRN - Disposal');
		var res_d_writedown = resultsSubList.addField('custpage_resultssublist_d_writedown', 'text', 'DPRN - Write Down');
		var res_d_total = resultsSubList.addField('custpage_resultssublist_d_total', 'text', 'DPRN - TOTAL');
		
		var res_netbookValue = resultsSubList.addField('custpage_resultssublist_netbook_val', 'text', 'NETBOOK VALUE');
		
		
		
		var costTotal = 0; 
		var dprnTotal = 0;
		var OBTotal_cost = 0;
		var OBTotal_dprn = 0;
		
		var netBook_total = 0;
		var OBCols;
		for( var i = 0; i<keys.length; i++) {
	
			
			var costCols = AllTypes[keys[i]];
			var OBCols = AllTypesOB[keys[i]];
			var oldOBCols_COST = openBalancePrimary_Cost[keys[i]];
			var oldOBCols_DPRN = openBalancePrimary_Dprn[keys[i]];
			

			if(costCols != undefined) {
			
			for(var x = 0; x<costCols.length; x++) {
				
				if(costCols[x].hasOwnProperty('cost_acq')) {
					
					var checkAcq = costCols[x].cost_acq;
					if(checkAcq == undefined) {
						checkAcq = '0';
					}
					var checkDisposal = costCols[x].cost_disposal;
					if(checkDisposal == undefined) {
						checkDisposal = '0';
					}
					var checkWriteDown = costCols[x].cost_writedown;
					if(checkWriteDown == undefined) {
						checkWriteDown = '0';
					}
					
					resultsSubList.setLineItemValue('custpage_resultssublist_c_acquisition',i+1 ,parseFloat(checkAcq).toFixed(2));
					resultsSubList.setLineItemValue('custpage_resultssublist_c_disposal',i+1 ,parseFloat(checkDisposal).toFixed(2));
					resultsSubList.setLineItemValue('custpage_resultssublist_c_writedown',i+1 ,parseFloat(checkWriteDown).toFixed(2));
					
					resultsSubList.setLineItemValue('custpage_resultssublist_type', i+1, keys[i]);
					
					
					costTotal = parseFloat(checkAcq) + parseFloat(checkDisposal) + parseFloat(checkWriteDown);
				}
				
	
				if(costCols[x].hasOwnProperty('dprn_dprn')) {
					
					var checkAcq_DPRN = costCols[x].dprn_dprn;
					if(checkAcq_DPRN == undefined) {
						checkAcq_DPRN = '0';
					}
					var checkDisposal_DPRN = costCols[x].dprn_disposal;
					if(checkDisposal_DPRN == undefined) {
						checkDisposal_DPRN = '0';
					}
					var checkWriteDown_DPRN = costCols[x].dprn_writedown;
					if(checkWriteDown_DPRN == undefined) {
						checkWriteDown_DPRN = '0';
					}
					
				resultsSubList.setLineItemValue('custpage_resultssublist_d_depreciation',i+1 ,parseFloat(checkAcq_DPRN).toFixed(2));
				resultsSubList.setLineItemValue('custpage_resultssublist_d_disposal',i+1 ,parseFloat(checkDisposal_DPRN).toFixed(2));
				resultsSubList.setLineItemValue('custpage_resultssublist_d_writedown',i+1 ,parseFloat(checkWriteDown_DPRN).toFixed(2));
				
				dprnTotal = parseFloat(checkAcq_DPRN) + parseFloat(checkDisposal_DPRN) + parseFloat(checkWriteDown_DPRN);
				}

			}
			
		}
			
			var dprn1;
			var dprn2;
			var dprn3;
		
			if(OBCols != undefined) {
			
			for (var j = 0; j<OBCols.length; j++) {
			if(OBCols[j] != undefined) {
				
			if(OBCols[j].hasOwnProperty('cost_acq_OB')) {
				
				var checkOBAcq = OBCols[j].cost_acq_OB;
				if(checkOBAcq == undefined) {
					checkOBAcq = '0';
				}
				
				OBTotal_cost = parseFloat(checkOBAcq)

					}
			
			if(OBCols[j].hasOwnProperty('dprn_dprn_OB')) {
				
				var checkOB_dprn = OBCols[j].dprn_dprn_OB;
				if(checkOB_dprn == undefined) {
					checkOB_dprn = '0';
				}
				
				//OBTotal_dprn 
				dprn1 = parseFloat(checkOB_dprn)

					}
			if(OBCols[j].hasOwnProperty('dprn_disposal_OB')) {
				
				var checkOB_disposal = OBCols[j].dprn_disposal_OB;
				if(checkOB_disposal == undefined) {
					checkOB_disposal = '0';
				}
				
				//OBTotal_dprn
				dprn2 = parseFloat(checkOB_disposal)

					}
			if(OBCols[j].hasOwnProperty('dprn_writedown_OB')) {
				
				var checkOB_writedown = OBCols[j].dprn_writedown_OB;
				if(checkOB_writedown == undefined) {
					checkOB_writedown = '0';
				}
				
				//OBTotal_dprn
				dprn3 = parseFloat(checkOB_writedown)

					}
			
				}
			OBTotal_dprn = dprn1+dprn2+dprn3;
			}
			
		}
			

			
			for (var k = 0; k<oldOBCols_COST.length; k++) {
				if(oldOBCols_COST[k] != undefined) {
					
				if(oldOBCols_COST[k].hasOwnProperty('cost_sum_OB_old')) {
					
					var old_open_sum = oldOBCols_COST[k].cost_sum_OB_old;
					if(old_open_sum == undefined) {
						old_open_sum = '0';
					}
					
					var OB_all = OBTotal_cost + old_open_sum;
					var allCostTotal = costTotal;
					
					resultsSubList.setLineItemValue('custpage_resultssublist_c_openbalance',i+1 ,parseFloat(OB_all).toFixed(2));
					resultsSubList.setLineItemValue('custpage_resultssublist_c_total',i+1 ,parseFloat(allCostTotal+OB_all).toFixed(2));
					}
				}
			}
			
			for (var m = 0; m<oldOBCols_DPRN.length; m++) {
				if(oldOBCols_DPRN[m] != undefined) {
					
				if(oldOBCols_DPRN[m].hasOwnProperty('dprn_sum_OB_old')) {
					
					var old_open_sum_d = oldOBCols_DPRN[m].dprn_sum_OB_old;
					if(old_open_sum_d == undefined) {
						old_open_sum_d = '0';
					}
				}
					var OB_all_dprn = OBTotal_dprn + parseFloat(old_open_sum_d);
					var allDprnTotal = dprnTotal;
					
					resultsSubList.setLineItemValue('custpage_resultssublist_d_openbalance',i+1 ,parseFloat(OB_all_dprn).toFixed(2));
					resultsSubList.setLineItemValue('custpage_resultssublist_d_total',i+1 ,parseFloat(allDprnTotal+OB_all_dprn).toFixed(2));
					
				//	
				}
			}

		}
		

		
		
		
		var v = nlapiGetContext();
		var y = v.getRemainingUsage();
		
		nlapiLogExecution('DEBUG', 'usage remaining', y)
		
//		
		resultsForm.setScript('customscript_ilo_tofes_yud_alef_client');
		response.writePage(resultsForm);
//		
//		var stringify = JSON.stringify(AllTypes[keys['Computers']]);
//		response.write(stringify);
	}
	
	//ASSET LEVEL REPORT//
	else if ((request.getParameter('custpage_ilo_tonextpage') == 'next') && (request.getParameter('custpage_choose_report') == 'b')){
		
		
		
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
		
		var cost_ob_primary; //also can be Secondary Book
		var dprn_ob_primary; //also can be Secondary Book
		
		
		if(selectedBook == 'b') {
			
			cost_ob_primary = getOpenBalances_Primary(search_OB_secondary_COST, selectedSubsid);
			dprn_ob_primary = getOpenBalances_Primary(search_OB_secondary_DPRN, selectedSubsid);
				
		}
		if(selectedBook == 'a') {
			
			cost_ob_primary = getOpenBalances_Primary(search_OB_primary_COST, selectedSubsid);
			dprn_ob_primary = getOpenBalances_Primary(search_OB_primary_DPRN, selectedSubsid);
			
		}
		
		

		var range = getPeriodRange(accPeriods, getPeriodStart, getPeriodEnd);
		
		var OBrange = getOBPeriodRange(accPeriods, getPeriodStart);
		
		
		var allAssets = getAllAssets();



		var AllLines = {};
		var OBAllLines = {};

		var openBalanceCOST = {};
		
		var openBalanceDPRN = {};
		
				allAssets.forEach(function(asset) {

					AllLines[asset] = [];
					OBAllLines[asset] = [];
					openBalanceCOST[asset] = [];
					openBalanceDPRN[asset] = [];

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
		
		for(var t = 0; t<cost_ob_primary.length; t++) {
			
			for(var x = 0; x<allAssets.length; x++) {
				
				if (cost_ob_primary[t].asset == allAssets[x]) {

									
					openBalanceCOST[allAssets[x]][openBalanceCOST[allAssets[x]].length ] = cost_ob_primary[t];
							}
					}
			
		}
		
		for(var d = 0; d<dprn_ob_primary.length; d++) {
			
			for(var x = 0; x<allAssets.length; x++) {
				
				if (dprn_ob_primary[d].asset == allAssets[x]) {

									
					openBalanceDPRN[allAssets[x]][openBalanceDPRN[allAssets[x]].length ] = dprn_ob_primary[d];
							}
					}
			
		}
		
		
		
		var assetKeys = Object.keys(AllLines);
		var linesToShow = [];
		var OBlinesToShow = [];
		var openbalance_COST = [];
		var openbalance_DPRN = [];

		for (var x = 0; x < assetKeys.length; x++) {

			if (AllLines[assetKeys[x]].length != 0) {

				linesToShow.push(AllLines[assetKeys[x]]);
			}
			if (OBAllLines[assetKeys[x]].length != 0) {

				OBlinesToShow.push(OBAllLines[assetKeys[x]]);
			}
			if (openBalanceCOST[assetKeys[x]].length != 0) {

				openbalance_COST.push(openBalanceCOST[assetKeys[x]]);
			}
			if (openBalanceDPRN[assetKeys[x]].length != 0) {

				openbalance_DPRN.push(openBalanceDPRN[assetKeys[x]]);
			}
		}

		
		
		
		var theLines = [];
		
		for(var i = 0; i<linesToShow.length; i++) {
			
			theLines.push(makeAssetLine(linesToShow[i]));
		}
		
		  var TotalLineObj = [];
		  
		  TotalLineObj.push({
		  
		  asset : 'TOTALS',
		  asset_type : '',
		  asset_description :'',
		  asset_trantype : '',
		  asset_purchasedate : '',
		  asset_lifetime :  '',
		  asset_internalid : '',
		  asset_subsid : '',
		  cost_acq : '',
		  cost_disposal : '',
		  cost_writedown : '',
		  dprn_dprn : '',
		  dprn_disposal : '',
		  dprn_writedown :'',
		  openbalance_amt : '', 
		});
		
		  theLines.push(TotalLineObj);
		  
		var obLines = [];
		
		for(var j = 0; j<OBlinesToShow.length; j++) {
				
				var obLine = makeAssetLine(OBlinesToShow[j]);
				
				//nlapiLogExecution('debug', 'obLine', makeAssetLine(OBlinesToShow[0]))
				
				obLines.push({
					
					ob_asset : obLine[0].asset,
					ob_cost_acq : obLine[0].cost_acq,
					ob_cost_disposal : obLine[0].cost_disposal,
					ob_cost_writedown : obLine[0].cost_writedown,
					ob_dprn_dprn : obLine[0].dprn_dprn,
					ob_dprn_disposal : obLine[0].dprn_disposal,
					ob_dprn_writedown : obLine[0].dprn_writedown,
					
				});
		}
		
		var check =[{"accounting_book":"Primary Accounting Book","transaction_type":"Depreciation",
			"asset":"1645","asset_name":"HSM מגרסת נייר","asset_type":"Equipment",
			"asset_lifetime":"80","purchase_date":"25/12/2016","subsidiary":"JFrog LTD",
			"net_amount":"-7.82","account":"Accumulated depreciation - Equipment","parent_transaction":"Journal #JEIL1710802",
			"tran_acc_period":"May 2017","costdprn_formula":"DPRN","costdprn_field":"",
			"internalID":"708"},{"accounting_book":"Primary Accounting Book","transaction_type":"Depreciation",
			"asset":"1645","asset_name":"HSM מגרסת נייר","asset_type":"Equipment","asset_lifetime":"80",
			"purchase_date":"25/12/2016","subsidiary":"JFrog LTD","net_amount":"-7.82",
			"account":"Accumulated depreciation - Equipment","parent_transaction":"Journal #JEIL1710718",
			"tran_acc_period":"Apr 2017","costdprn_formula":"DPRN","costdprn_field":"","internalID":"708"},
			{"accounting_book":"Primary Accounting Book","transaction_type":"Depreciation","asset":"1645",
			"asset_name":"HSM מגרסת נייר","asset_type":"Equipment","asset_lifetime":"80","purchase_date":"25/12/2016",
			"subsidiary":"JFrog LTD","net_amount":"-7.82","account":"Accumulated depreciation - Equipment",
			"parent_transaction":"Journal #JEIL1710490","tran_acc_period":"Mar 2017","costdprn_formula":"DPRN",
			"costdprn_field":"","internalID":"708"},{"accounting_book":"Primary Accounting Book",
				"transaction_type":"Depreciation","asset":"1645","asset_name":"HSM מגרסת נייר","asset_type":"Equipment",
				"asset_lifetime":"80","purchase_date":"25/12/2016","subsidiary":"JFrog LTD","net_amount":"-7.82",
				"account":"Accumulated depreciation - Equipment","parent_transaction":"Journal #JEIL1710488",
				"tran_acc_period":"Feb 2017","costdprn_formula":"DPRN","costdprn_field":"","internalID":"708"},
				{"accounting_book":"Primary Accounting Book","transaction_type":"Depreciation","asset":"1645",
					"asset_name":"HSM מגרסת נייר","asset_type":"Equipment","asset_lifetime":"80","purchase_date":"25/12/2016",
					"subsidiary":"JFrog LTD","net_amount":"-7.82","account":"Accumulated depreciation - Equipment",
					"parent_transaction":"Journal #JEIL1710469","tran_acc_period":"Jan 2017","costdprn_formula":"DPRN",
					"costdprn_field":"","internalID":"708"}];
		
		
		nlapiLogExecution('debug', 'check', JSON.stringify(makeAssetLine(check)))
		
		var openbalances = [];
//		
		for(var i = 0; i<openbalance_COST.length; i++) {
			
			for(var j = 0; j<openbalance_DPRN.length; j++) {
				
			//	if((openbalance_COST[i][0].asset_subsid && openbalance_DPRN[j][0].asset_subsid) == subsidName) {
				
				if(openbalance_COST[i][0].asset == openbalance_DPRN[j][0].asset) {
					
					openbalances.push({
						ob_COST : makeAssetLine(openbalance_COST[i]),
						ob_DPRN : makeAssetLine(openbalance_DPRN[j])
					})
					
				}// same asset
				
				//}// same subsid
				
			}
			
			
		
		}



	
		//theLines = [];
		var currentAssets = [];
		for(var i = 0; i<obLines.length; i++) {
		for(var x = 0; x<theLines.length; x++) {
		
			currentAssets.push(theLines[x][0].asset);
				
				if(theLines[x][0].asset == obLines[i].ob_asset) {
					
					theLines[x][0].obRange = obLines[i];
					
					//nlapiLogExecution('debug', 'match', 'match')
				}
			
			
			}
		}
		
		var openbalanceLines = [];
		var clean_openbalanceLines = [];
		for(var i = 0; i<openbalances.length; i++) {
			
			//var check = openbalances[i].ob_COST.asset;
			//if(currentAssets.indexOf(check) == -1) {
			openbalanceLines.push(makeOpenBalanceLine(openbalances[i]))
		//}
		}
		
		

		
		for(var i = 0; i<openbalanceLines.length; i++) {
		for(var x = 0; x<theLines.length; x++) {

			
			if(theLines[x][0].asset == openbalanceLines[i].asset) {
				
				openbalanceLines[i]['exsists'] = 'yes'
				theLines[x][0].openbalance = openbalanceLines[i];
			
				
			}

		
		}
		}
		
		for(var i = 0; i<openbalanceLines.length; i++) {
			
			if(openbalanceLines[i].hasOwnProperty('exsists') == false) {
				clean_openbalanceLines.push(openbalanceLines[i]);
				
			}
			
			
		}
		
		
		
		var resultsForm = nlapiCreateForm('Tofes Yud Alef - Asset Level Report');
		
		var resultsSubList = resultsForm.addSubList('custpage_results_sublist', 'list', null, null);
		

		var subsidName = nlapiLookupField('subsidiary', selectedSubsid, 'name');
		var accBookName = getAccountingBookName(selectedBook);
		
		
		
		 var htmlHeader = resultsForm.addField('custpage_header', 'inlinehtml');
		     htmlHeader.setDefaultValue("<span style='font-size:18px'>"+subsidName+" - "+accBookName+"</span><br><span style='font-size:18px'>"+getPeriodStart+" - "+getPeriodEnd+"</span>");
	
		var res_viewTran =  resultsSubList.addField('custpage_resultssublist_view', 'url',' ');
		res_viewTran.setLinkText('View');
	
		var res_asset = resultsSubList.addField('custpage_resultssublist_asset', 'text','Asset');
		var res_assetType = resultsSubList.addField('custpage_resultssublist_type', 'text','Asset Type');
		var res_assetDescription = resultsSubList.addField('custpage_resultssublist_asset_desc', 'text','Asset Description');
		var res_purchase_date = resultsSubList.addField('custpage_resultssublist_purchase_date', 'text','Purchase Date');
		var res_dprn_percent = resultsSubList.addField('custpage_resultssublist_dprn_percent', 'text','Annual DPRN %');
	
		var res_c_openBalance = resultsSubList.addField('custpage_resultssublist_c_openbalance', 'currency','COST - Open Balance');
		var res_c_acquisition = resultsSubList.addField('custpage_resultssublist_c_acquisition', 'currency','COST - Acquisition');
		var res_c_disposal = resultsSubList.addField('custpage_resultssublist_c_disposal', 'currency', 'COST - Disposal');
		var res_c_writedown = resultsSubList.addField('custpage_resultssublist_c_writedown', 'currency', 'COST - Write Down');
		
		var res_c_total = resultsSubList.addField('custpage_resultssublist_c_total', 'currency', 'COST - TOTAL');
		
		
		var res_d_openBalance = resultsSubList.addField('custpage_resultssublist_d_openbalance', 'currency','DPRN - Open Balance');
		var res_d_dprn = resultsSubList.addField('custpage_resultssublist_d_depreciation', 'currency','DPRN - Depreciation');
		var res_d_disposal = resultsSubList.addField('custpage_resultssublist_d_disposal', 'currency', 'DPRN - Disposal');
		var res_d_writedown = resultsSubList.addField('custpage_resultssublist_d_writedown', 'currency', 'DPRN - Write Down');
		
		var res_d_total = resultsSubList.addField('custpage_resultssublist_d_total', 'currency', 'DPRN - TOTAL');
		
		var res_total_total = resultsSubList.addField('custpage_resultssublist_d_total_total', 'currency', 'TOTAL');
		

//nlapiLogExecution('debug', 'theLines[x][0].asset', JSON.stringify(theLines[0][0].asset));
//nlapiLogExecution('debug', 'obLines[i].asset', JSON.stringify(obLines[0].ob_asset));
		
//var openbalancesLength = openbalances.length;
var lineCounter = 0;

for(var i = 0; i<clean_openbalanceLines.length; i++) {
	
//	if(openbalanceLines[i].exsists != 'yes') {
	
		//if(currentAssets.indexOf(openbalanceLines[i].asset) == -1) {
		//if(clean_openbalanceLines[i].asset_subsid == subsidName) {
			lineCounter++;
		
		resultsSubList.setLineItemValue('custpage_resultssublist_view',i+1 ,assetView(clean_openbalanceLines[i].asset_internalid));
		resultsSubList.setLineItemValue('custpage_resultssublist_type',i+1 ,clean_openbalanceLines[i].asset_type);
		resultsSubList.setLineItemValue('custpage_resultssublist_asset',i+1 ,clean_openbalanceLines[i].asset);
		resultsSubList.setLineItemValue('custpage_resultssublist_asset_desc',i+1 ,clean_openbalanceLines[i].asset_description);
		resultsSubList.setLineItemValue('custpage_resultssublist_purchase_date',i+1 ,clean_openbalanceLines[i].asset_purchasedate);
		resultsSubList.setLineItemValue('custpage_resultssublist_dprn_percent',i+1 ,clean_openbalanceLines[i].asset_lifetime);
		
		resultsSubList.setLineItemValue('custpage_resultssublist_c_openbalance',i+1 ,clean_openbalanceLines[i].openbalance_cost);
		resultsSubList.setLineItemValue('custpage_resultssublist_d_openbalance',i+1 ,clean_openbalanceLines[i].openbalance_dprn);
	//	
		//}
	//	}
//	}
	

	
}




		for(var i = 0; i<theLines.length; i++) {
			lineCounter++
			
			var total_OBCOST = '0';
			var total_OBDPRN = '0';
			var total_OBCOST1 = '0';
			var total_OBDPRN2 = '0';
			
			var checkAcq = '0';
			var checkDisposal = '0';
			var checkWriteDown = '0';
			
			var checkDprn = '0';
			var checkDprn_Disposal = '0';
			var checkDprn_WriteDown = '0';
			
			var t_checkAcq = '0';
			var t_checkDisposal = '0';
			var t_checkWriteDown = '0';
			
			var t_checkDprn = '0';
			var t_checkDprn_Disposal = '0';
			var t_checkDprn_WriteDown = '0';
			
			var OBcheckCOST = '0';
			var OBcheckDPRN = '0';
			
			var calculated_OBCOST = '0';
			var calculated_OBDPRN = '0';
			
			
			
		

				if(theLines[i][0].hasOwnProperty('openbalance')) {
					
					OBcheckCOST = parseFloat(theLines[i][0].openbalance.openbalance_cost)
					OBcheckDPRN = parseFloat(theLines[i][0].openbalance.openbalance_dprn)
					
//					t_checkAcq = parseFloat(theLines[i][0].obRange.ob_cost_acq);
//					t_checkDisposal = parseFloat(theLines[i][0].obRange.ob_cost_disposal);
//					t_checkWriteDown = parseFloat(theLines[i][0].obRange.ob_cost_writedown);
//					  
//					  t_checkDprn = parseFloat(theLines[i][0].obRange.ob_dprn_dprn);
//					  t_checkDprn_Disposal = parseFloat(theLines[i][0].obRange.ob_dprn_disposal);
//					  t_checkDprn_WriteDown = parseFloat(theLines[i][0].obRange.ob_dprn_writedown);
					  
						if(OBcheckCOST == undefined) {
							OBcheckCOST = '0';
						}
						
						if(OBcheckDPRN == undefined) {
							OBcheckDPRN = '0';

						}
										
				}
	

//				total_OBCOST1 = t_checkAcq+t_checkDisposal+t_checkWriteDown;
//				total_OBDPRN1 = t_checkDprn+t_checkDprn_Disposal+t_checkDprn_WriteDown
	
			
			
		
//			if (theLines[i][0].hasOwnProperty('openbalance')) {
//				
//				OBcheckCOST = parseFloat(theLines[i][0].openbalance.openbalance_cost)
//				OBcheckDPRN = parseFloat(theLines[i][0].openbalance.openbalance_dprn)
//				
//				if(OBcheckCOST == undefined) {
//					OBcheckCOST = '0';
//				}
//				if(OBcheckDPRN == undefined) {
//					OBcheckDPRN = '0';
//				}
//				
//			}
			
			if(theLines[i][0].hasOwnProperty('obRange')) {
				
			  checkAcq = parseFloat(theLines[i][0].obRange.ob_cost_acq);
			  checkDisposal = parseFloat(theLines[i][0].obRange.ob_cost_disposal);
			  checkWriteDown = parseFloat(theLines[i][0].obRange.ob_cost_writedown);
			  
			  checkDprn = parseFloat(theLines[i][0].obRange.ob_dprn_dprn);
			  checkDprn_Disposal = parseFloat(theLines[i][0].obRange.ob_dprn_disposal);
			  checkDprn_WriteDown = parseFloat(theLines[i][0].obRange.ob_dprn_writedown);
			  
				if(checkAcq == undefined) {
					checkAcq = '0';
				}
				if(checkDisposal == undefined) {
					checkDisposal = '0';
				}
				if(checkWriteDown == undefined) {
					checkWriteDown = '0';
				}
				
				if(checkDprn == undefined) {
					checkDprn = '0';
				}
				if(checkDprn_Disposal == undefined) {
					checkDprn_Disposal = '0';
				}
				if(checkDprn_WriteDown == undefined) {
					checkDprn_WriteDown = '0';
				}
				

			}
			

			 calculated_OBCOST = parseFloat(OBcheckCOST);
			 calculated_OBDPRN = parseFloat(OBcheckDPRN);

			total_OBCOST = calculated_OBCOST + parseFloat(checkAcq+checkDisposal+checkWriteDown)
			total_OBDPRN = calculated_OBDPRN + parseFloat(checkDprn+checkDprn_Disposal+checkDprn_WriteDown)
			
		//	total_OBCOST = parseFloat(OBcheckCOST+checkAcq+checkDisposal+checkWriteDown)
		//	total_OBDPRN = parseFloat(OBcheckDPRN+checkDprn+checkDprn_Disposal+checkDprn_WriteDown);
			
	
			
			resultsSubList.setLineItemValue('custpage_resultssublist_c_openbalance',lineCounter ,total_OBCOST.toFixed(2));
			resultsSubList.setLineItemValue('custpage_resultssublist_d_openbalance',lineCounter ,total_OBDPRN.toFixed(2));
			
			if(theLines[i][0].asset != 'TOTALS') {
			resultsSubList.setLineItemValue('custpage_resultssublist_view',lineCounter ,assetView(theLines[i][0].asset_internalid));
			}
			resultsSubList.setLineItemValue('custpage_resultssublist_type' ,lineCounter ,theLines[i][0].asset_type);
			resultsSubList.setLineItemValue('custpage_resultssublist_asset',lineCounter ,theLines[i][0].asset);
			resultsSubList.setLineItemValue('custpage_resultssublist_asset_desc',lineCounter ,theLines[i][0].asset_description);
			resultsSubList.setLineItemValue('custpage_resultssublist_purchase_date',lineCounter ,theLines[i][0].asset_purchasedate);
			resultsSubList.setLineItemValue('custpage_resultssublist_dprn_percent',lineCounter ,theLines[i][0].asset_lifetime);
//			
			resultsSubList.setLineItemValue('custpage_resultssublist_c_acquisition',lineCounter ,theLines[i][0].cost_acq);
			resultsSubList.setLineItemValue('custpage_resultssublist_c_disposal',lineCounter ,theLines[i][0].cost_disposal);
			resultsSubList.setLineItemValue('custpage_resultssublist_c_writedown',lineCounter ,theLines[i][0].cost_writedown);
//			
			resultsSubList.setLineItemValue('custpage_resultssublist_d_depreciation',lineCounter ,theLines[i][0].dprn_dprn);
			resultsSubList.setLineItemValue('custpage_resultssublist_d_disposal',lineCounter ,theLines[i][0].dprn_disposal);
			resultsSubList.setLineItemValue('custpage_resultssublist_d_writedown',lineCounter ,theLines[i][0].dprn_writedown);
			
			
			
		}
	
//		//nlapiLogExecution('debug', 'OBrange', JSON.stringify(OBrange))
//		var jsStr = JSON.stringify(theLines)
//		response.write(jsStr);
////		
		nlapiLogExecution('debug', 'selectedSubsid', selectedSubsid)
		resultsForm.setScript('customscript_ilo_tofes_yud_alef_client');
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

		var startIndex = periodStr.indexOf('Jan 2008');
		
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

		theResults.push({

			accounting_book : line.getText(cols[0]),
			transaction_type : line.getText(cols[1]),
			asset : line.getText(cols[2]),
			asset_name : line.getValue(cols[3]),
			asset_type : line.getText(cols[4]),
			asset_lifetime : line.getValue(cols[5]),
			purchase_date : line.getValue(cols[6]),
			subsidiary : line.getText(cols[7]),
			net_amount : line.getValue(cols[8]),
			account : line.getValue(cols[9]),
			parent_transaction : line.getValue(cols[10]),
			tran_acc_period : line.getValue(cols[11]),
			costdprn_formula : line.getValue(cols[12]),
			costdprn_field : line.getValue(cols[13]),
			internalID : line.getValue(cols[18]),
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
							  internalID : line.getValue(cols[13]),
							  

                              });

			//}
               });
	}; 

	return theResults;
}

function getAllAssets() {


	var searchAssets = nlapiLoadSearch(null, 'customsearch_far_assetsbyid');

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

	var res = result + perc;
	if(res == '33.33333333333333%') {
		res = '33.33%';
	}
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


function makeAssetLine(line) {

	var cost_acq = [];
	var cost_disposal = [];
	var cost_writedown = [];

	var dprn_dprn = [];
	var dprn_disposal = [];
	var dprn_writedown = [];

	for(var i = 0; i<line.length; i++) {
	  
	  if(line[i].costdprn_formula == 'COST') {
	    
	    if(line[i].transaction_type == 'Acquisition') {
	  
	      cost_acq.push(line[i].net_amount);
	    }
	        if(line[i].transaction_type == 'Disposal') {
	  
	      cost_disposal.push(line[i].net_amount);
	        
	    }
	            if(line[i].transaction_type == 'Write-down') {
	  
	      cost_writedown.push(line[i].net_amount);
	        
	    }
	    
	    
	  }
	  
	    if(line[i].costdprn_formula == 'DPRN') {
	    
	          if(line[i].transaction_type == 'Depreciation') {
	      
	      dprn_dprn.push(line[i].net_amount);

	    }
	                if(line[i].transaction_type == 'Disposal') {
	      
	      dprn_disposal.push(line[i].net_amount);

	    }
	                      if(line[i].transaction_type == 'Write-down') {
	      
	      dprn_writedown.push(line[i].net_amount);

	    }
	   
	  }
	  
	  var lineObj = [];
	  
	  lineObj.push({
	  
	  asset : line[i].asset,
	  asset_type : line[i].asset_type,
	  asset_description : line[i].asset_name,
	  asset_trantype : line[i].transaction_type,
	  asset_purchasedate : line[i].purchase_date,
	  asset_lifetime :  getAnnualDPRNPerc(line[i].asset_lifetime),
	  asset_internalid : line[i].internalID,
	  asset_subsid : line[i].subsidiary,
	  cost_acq : cost_acq.reduce(add, 0),
	  cost_disposal : cost_disposal.reduce(add, 0),
	  cost_writedown : cost_writedown.reduce(add, 0),
	  dprn_dprn : dprn_dprn.reduce(add, 0),
	  dprn_disposal : dprn_disposal.reduce(add, 0),
	  dprn_writedown : dprn_writedown.reduce(add, 0),
	  openbalance_amt : line[i].net_amount

	    
	});
	  
	}//end of loop over 'line'

	  return lineObj;
	  }

function makeOpenBalanceLine(arr) {
	  
	var line = {
	  
	  asset : arr.ob_COST[0].asset,
	  asset_type : arr.ob_COST[0].asset_type,
	  asset_description : arr.ob_COST[0].asset_description,
	  asset_trantype : arr.ob_COST[0].asset_trantype,
	  asset_purchasedate : arr.ob_COST[0].asset_purchasedate,
	  asset_lifetime : arr.ob_COST[0].asset_lifetime,
	  asset_internalid : arr.ob_COST[0].asset_internalid,
	  asset_subsid : arr.ob_COST[0].asset_subsid,
	  openbalance_cost : arr.ob_COST[0].openbalance_amt,
	  openbalance_dprn : arr.ob_DPRN[0].openbalance_amt,
	};
	  
	  return line;
	}

