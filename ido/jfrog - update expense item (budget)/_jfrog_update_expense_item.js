function getBudgetsExpenseItem() {

var searchItems= nlapiLoadSearch(null, 'customsearch_jfrog_updte_exp_item_search');

	var allItems = [];
	var items =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchItems.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allItems.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allItems != null) {
				allItems.forEach(function(line) {
					
					items.push({
					
					internalid : line.getValue('internalid'),
					
					});
				
					
					
				});

			};
			
			return items;



}


function updateExpenseItem(type) {
	
var budgets = getBudgetsExpenseItem();
	
		
	for(var i = 0; i<budgets.length; i++) {
	
	try {
	
	var rec = nlapiLoadRecord('customrecord_ilo_budget_control_record', budgets[i].internalid);
	
    var expenseAcc = rec.getFieldValue('custrecord_ilo_budget_exp_account');
    var budgetClassId = rec.getFieldValue('custrecord_ilo_budget_class');
    var budgetClassText = rec.getFieldText('custrecord_ilo_budget_class');

    var itemReq = '';

    var fils = new Array();
    fils[0] = new nlobjSearchFilter('subtype', null, 'is', 'Purchase');
    var cols = new Array();
    cols[0] = new nlobjSearchColumn('expenseaccount');
    var itemSearch = nlapiSearchRecord('noninventoryitem', null, fils, cols);
    for (var x = 0; x < itemSearch.length; x++) {
        if (itemSearch[x].getValue('expenseaccount') == expenseAcc) {
            itemReq = itemSearch[x].id;
        }
    }
    var expenseItem = rec.setFieldValue('custrecord_ilo_expense_item_id', itemReq);
   
	nlapiLogExecution('DEBUG', 'rec', rec);
	nlapiSubmitRecord(rec);
	

	}

   

catch (e) {

	nlapiLogExecution('DEBUG', 'err', e);
continue;

}
	

}
	
	
	

}
