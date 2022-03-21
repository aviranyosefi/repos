

	var allBudgets = allBudgets();

function getExpenseItem(budgetclass, budgetdep, budgetsubsid) {
	
	var empty = -1;
	var res = '';
	
	try{
		for(var i = 0; i<allBudgets.length; i++) {
		
			if(allBudgets[i].budget_class == budgetclass && allBudgets[i].department == budgetdep && allBudgets[i].subsidiary == budgetsubsid) {
				
				res = allBudgets[i].internalid
			}
			
		}
		return res;
		
		
		
	}catch(err) {
		console.log('err' + err)
		return empty;
	}
	
}

var example = getExpenseItem('3618', '31', '2')
console.log(example) //1138



function allBudgets() {
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_ilo_budget_type', null, 'is', '1');

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('internalid').setSort(false);
	cols[1] = new nlobjSearchColumn('custrecord_ilo_budget_class');
	cols[2] = new nlobjSearchColumn('custrecord_ilo_budget_subsidiary');
	cols[3] = new nlobjSearchColumn('custrecord_ilo_budget_department');
	cols[4] = new nlobjSearchColumn('custrecord_ilo_expense_item_id');


	var search = nlapiSearchRecord('customrecord_ilo_budget_control_record', null, filters, cols);
	var results = [];
	
	
	if (search != null) {
		search.forEach(function(line) {
			
			results.push({
			
			internalid : line.getValue('internalid'),
			budget_class : line.getValue('custrecord_ilo_budget_class'),
			subsidiary : line.getValue('custrecord_ilo_budget_subsidiary'),
			department : line.getValue('custrecord_ilo_budget_department'),
			expense_item : line.getValue('custrecord_ilo_expense_item_id'),


			
			});
		
			
			
		});

	};
	
	return results;
}