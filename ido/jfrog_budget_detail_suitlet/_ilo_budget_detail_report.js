
function getAllBudgets() {

	var searchBudgets= nlapiLoadSearch(null, 'customsearch379');

	var allBudgets = [];
	var budgets =[];
	var resultBudgets = [];
	var searchid = 0;
	var resultset = searchBudgets.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allBudgets.push(resultBudgets[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allBudgets != null) {
				allBudgets.forEach(function(line) {
					
					budgets.push({
					
					internalid : line.getValue('internalid'),
					owner : line.getText('custrecord_ilo_budget_owner', 'CUSTCOL_ILO_COL_BUDGET'),
					budgetClass : line.getValue('custcol_cseg3'),
					date : line.getValue('trandate'),
					period : line.getText('postingperiod'),
					amount : line.getValue('amount'),
					fxamount : line.getValue('fxamount'),
					status : line.getText('statusref'),
					type: line.getText('type'),
					docNum : line.getValue('tranid'),
					vendorName : line.getValue('entityid', 'vendor'),
					memo : line.getValue('memo'),
					jfrogBudget : line.getValue('custcol_ilo_col_budget'),
					budgetSection : line.getText('custrecord10', 'CUSTCOL_ILO_COL_BUDGET'),
					budgetSheet : line.getText('custrecord9', 'CUSTCOL_ILO_COL_BUDGET'),
					account : line.getText('account'),
					department : line.getText('department')
					
					
					
					});
									
				});

			};
			
			return budgets;

	}
		
	var budgetsObj = getAllBudgets();

function getBudgetReport(request, response){
	
	
	var reportForm = nlapiCreateForm('JFROG Budget Detail Report');

	var resultsSubList = reportForm.addSubList('custpage_results_sublist',
			'list', 'Results', null);
	
	var rep_InternalId = resultsSubList.addField(
			'custpage_sublist_internalid', 'text', 'Internal ID');
	
	var rep_owner = resultsSubList.addField(
			'custpage_sublist_owner', 'text', 'Budget Owner');
	
	var rep_budgetClass = resultsSubList.addField(
			'custpage_sublist_b_class', 'text', 'Budget Classification');
	
	var rep_date = resultsSubList.addField(
			'custpage_sublist_trandate', 'date', 'Date');
	
	var rep_period = resultsSubList.addField(
			'custpage_sublist_period', 'text', 'Posting Period');
	
	var rep_amount = resultsSubList.addField(
			'custpage_sublist_amount', 'currency', 'Amount');
	
	var rep_fxamount = resultsSubList.addField(
			'custpage_sublist_fxamount', 'currency', 'Amount (Foreign Currency');
	
	var rep_status = resultsSubList.addField(
			'custpage_sublist_status', 'text', 'Status');
	
	var rep_type = resultsSubList.addField(
			'custpage_sublist_type', 'text', 'Type');
	
	var rep_docNum = resultsSubList.addField(
			'custpage_sublist_tranid', 'text', 'Document Number');
	
	var rep_vendorName = resultsSubList.addField(
			'custpage_sublist_vend_name', 'text', 'Vendor Name');
	
	var rep_memo = resultsSubList.addField(
			'custpage_sublist_memo', 'text', 'Memo');
	
	var rep_jfrogBudget = resultsSubList.addField(
			'custpage_sublist_budget', 'text', 'Jfrog Budget');
	
	var rep_budgetSection = resultsSubList.addField(
			'custpage_sublist_b_section', 'text', 'Budget Section');
	
	var rep_budgetSheet = resultsSubList.addField(
			'custpage_sublist_b_sheet', 'text', 'Budget Sheet');
	
	var rep_account = resultsSubList.addField(
			'custpage_sublist_account', 'text', 'Account');
	
	var rep_department = resultsSubList.addField(
			'custpage_sublist_department', 'text', 'Department');
	

	
	for(var i = 0; i<budgetsObj.length; i++) {
		
		resultsSubList.setLineItemValue('custpage_sublist_internalid', i + 1, budgetsObj[i].internalid);
		resultsSubList.setLineItemValue('custpage_sublist_owner', i + 1,budgetsObj[i].owner);
		resultsSubList.setLineItemValue('custpage_sublist_b_class', i + 1,budgetsObj[i].budgetClass);
		resultsSubList.setLineItemValue('custpage_sublist_trandate', i + 1,budgetsObj[i].date);
		resultsSubList.setLineItemValue('custpage_sublist_period', i + 1,budgetsObj[i].period);
		resultsSubList.setLineItemValue('custpage_sublist_amount', i + 1,budgetsObj[i].amount);
		resultsSubList.setLineItemValue('custpage_sublist_fxamount', i + 1,budgetsObj[i].fxamount);
		resultsSubList.setLineItemValue('custpage_sublist_status', i + 1,budgetsObj[i].status);
		resultsSubList.setLineItemValue('custpage_sublist_type', i + 1,budgetsObj[i].type);
		resultsSubList.setLineItemValue('custpage_sublist_tranid', i + 1,budgetsObj[i].docNum);
		resultsSubList.setLineItemValue('custpage_sublist_vend_name', i + 1,budgetsObj[i].vendorName);
		resultsSubList.setLineItemValue('custpage_sublist_memo', i + 1,budgetsObj[i].memo);
		resultsSubList.setLineItemValue('custpage_sublist_budget', i + 1,budgetsObj[i].jfrogBudget);
		resultsSubList.setLineItemValue('custpage_sublist_b_section', i + 1,budgetsObj[i].budgetSection);
		resultsSubList.setLineItemValue('custpage_sublist_b_sheet', i + 1,budgetsObj[i].budgetSheet);
		resultsSubList.setLineItemValue('custpage_sublist_account', i + 1,budgetsObj[i].account);
		resultsSubList.setLineItemValue('custpage_sublist_department', i + 1,budgetsObj[i].department);
		
	}
	
	response.writePage(reportForm);

}
