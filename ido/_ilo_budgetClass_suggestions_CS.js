/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Dec 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */

	
	
	
function budgetClass_suggestions_PageInit(type){
	var output = '';
	
	var para = document.createElement("p");
	para.style.cssText = 'color:blue;cursor:pointer';
	var node = document.createTextNode("Which one?");
	para.appendChild(node);

	var suggest = document.getElementsByClassName("listheader")[0];
	suggest.appendChild(para);

	suggest.addEventListener("click",filterOptions);

		output = '';
   
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
function budgetClass_suggestions_FieldChanged(type, name, linenum){
	
	if (name == 'entity') {
		var fc_para = document.createElement("p");
		fc_para.style.cssText = 'color:blue;cursor:pointer';
		var fc_node = document.createTextNode("Which one?");
		fc_para.appendChild(fc_node);

		var fc_suggest = document.getElementsByClassName("listheader")[0];
		fc_suggest.appendChild(fc_para);
		fc_suggest.addEventListener("click",filterOptions);

			output = ''; 
	}
	
	if (name == 'custcol_cseg3') {
		setItem();
		
	     
	}
	
 
}

function budgetClass_suggestions_ValidateInsert() {
	
	function addSuggest(){
	var vi_para = document.createElement("p");
	vi_para.style.cssText = 'color:blue;cursor:pointer';
	var vi_node = document.createTextNode("Which one?");
	vi_para.appendChild(vi_node);

	var vi_suggest = document.getElementsByClassName("listheader")[0];
	vi_suggest.appendChild(vi_para);
	vi_suggest.addEventListener("click",filterOptions);

		output = '';
	}
	setTimeout(function(){ addSuggest(); }, 600);
	
	return true;
	
}


function filterOptions(e) {
	e.preventDefault();

	var budgetClassOptions = [];
	var ownerBudgetClass = [];
	var ownerBudge = [];
	var sysBudge = [];
	var budgetsOfOwner;
	var today = new Date();

	var requestor = nlapiGetFieldValue('entity');
	console.log(requestor);
	var todayStr = nlapiDateToString(today);
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_ilo_budget_owner', null,
			'anyof', requestor); // 'requestor' is the internal id of the requestor

	filters[1] = new nlobjSearchFilter('custrecord_ilo_budget_type', null, 'is', '1');
	filters[2] = new nlobjSearchFilter('custrecord_ilo_budget_fromdate', null, 'notafter', todayStr);
	filters[3] = new nlobjSearchFilter('custrecord_ilo_budget_todate', null, 'notbefore', todayStr);

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('internalid').setSort(false);
	cols[1] = new nlobjSearchColumn('custrecord_ilo_budget_class');
	cols[2] = new nlobjSearchColumn('custrecord_ilo_budget_exp_account');


	var budgetClassbyOwner = nlapiSearchRecord(
			'customrecord_ilo_budget_control_record', null, filters, cols);

			if(budgetClassbyOwner == null) {
			
			alert("There are no current Budget Classification suggestions for the current requestor");
			}
			else{

	for (var a = 0; a<budgetClassbyOwner.length; a++) { 
	  budgetsOfOwner  = budgetClassbyOwner[a].getText('custrecord_ilo_budget_class');
	 ownerBudge.push(budgetsOfOwner);
	  
	}
	console.log(ownerBudge);
	var arrToString = ownerBudge.toString();
	var formattedString = arrToString.split(",").join("\n");
	alert("The current Budget Classifications for this requestor are : \r\n" + formattedString + "\r\n");
	}
	}

function setItem() {

	var selected = nlapiGetCurrentLineItemValue('item', 'custcol_cseg3');
	console.log(selected);

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_ilo_budget_class', null,
			'anyof', selected);
	var cols = new Array();
	cols[0] = new nlobjSearchColumn('custrecord_ilo_budget_department');
  cols[1] = new nlobjSearchColumn('custrecord_ilo_expense_item_id');
	var selectedBudget = nlapiSearchRecord(
			'customrecord_ilo_budget_control_record', null, filters, cols);

	var selectedDepartment = selectedBudget[0].getValue('custrecord_ilo_budget_department');
    var selectedExpenseItem = selectedBudget[0].getValue('custrecord_ilo_expense_item_id');
	console.log(selectedExpenseItem);
	console.log(selectedDepartment);
	
	setTimeout(function(){ 
		
		nlapiSetCurrentLineItemValue('item', 'department', selectedDepartment);
	}, 600);
	
	nlapiSetCurrentLineItemValue('item', 'item', selectedExpenseItem);

}
