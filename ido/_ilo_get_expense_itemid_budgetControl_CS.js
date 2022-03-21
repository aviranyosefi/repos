/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Dec 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function get_expense_item_id_SaveRecord(){
	
	var expenseAcc = nlapiGetFieldValue('custrecord_ilo_budget_exp_account');
	var budgetClassId = nlapiGetFieldValue('custrecord_ilo_budget_class');
	var budgetClassText = nlapiGetFieldText('custrecord_ilo_budget_class');

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
	var expenseItem = nlapiSetFieldValue('custrecord_ilo_expense_item_id', itemReq);

    return true;
}
