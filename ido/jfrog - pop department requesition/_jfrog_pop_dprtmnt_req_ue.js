/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Jul 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function populate_dprtmnt(type){
	
	try{
		
	var rec = nlapiLoadRecord('purchaserequisition', nlapiGetRecordId());
	var lineCount = rec.getLineItemCount('item');
	
	var lineArr = [];
	
	for(var i = 0; i<lineCount; i++) {
		
		var budgetclass = rec.getLineItemValue('item', 'custcol_cseg3', i+1);
		
		lineArr.push({
			
			budgetclass : budgetclass,
			lineNum : i+1
			
		})
	}
	
	var subsid = nlapiGetFieldValue('subsidiary')
	var getAllBudgets = allBudgets(subsid)

	if(lineArr != []) {

		lineArr.forEach(function(line) {
		
			var dprt = '';
			for(var x = 0; x<getAllBudgets.length; x++){
				
				if(getAllBudgets[x].budget_class == line.budgetclass) {
					
					dprt = getAllBudgets[x].department
				}
			}
			
			if(dprt != '') {
				
				rec.setLineItemValue('item', 'department', line.lineNum, dprt)
			}
			
			});
		
	}

  nlapiSubmitRecord(rec);
  
	}catch(err){
		nlapiLogExecution('error', 'err', err)
		return true;
	}
}




function allBudgets(subsid) {
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_ilo_budget_type', null, 'is', '1');
	filters[1] = new nlobjSearchFilter('custrecord_ilo_budget_subsidiary', null, 'is', subsid);

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