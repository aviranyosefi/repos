/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Nov 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Access mode: create, copy, edit
 * @returns {Void}
 */
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
cols[0] = new nlobjSearchColumn('custrecord_ilo_budget_class');
cols[1] = new nlobjSearchColumn('custrecord_ilo_budget_exp_account');


var budgetClassbyOwner = nlapiSearchRecord('customrecord_ilo_budget_control_record', null, filters, cols);

for (var a = 0; a<budgetClassbyOwner.length; a++) { 
  budgetsOfOwner  = budgetClassbyOwner[a].getText('custrecord_ilo_budget_class');
 ownerBudge.push(budgetsOfOwner);
  
}
console.log(budgetsOfOwner);

function budgetClass_req_PageInit(type) {

	setTimeout(function(){ 
		console.log('hello');
	document.getElementsByName("inpt_custcol_cseg3")[0].addEventListener("click",
			filterOptions);
	//document.getElementById('inpt_custcol_cseg316_arrow').addEventListener("click",
	//		filterOptions);
	var theArrow = document.querySelector("input[name='inpt_custcol_cseg3']").nextSibling;
	theArrow.addEventListener("click",
			filterOptions);

	}, 3000);
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Sublist internal id
 * @param {String}
 *            name Field internal id
 * @param {Number}
 *            linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function budgetClass_req_FieldChanged(type, name) {

	if (name == 'custcol_cseg3') {
		setItem();
		
	     
	}

}


function filterOptions() {
	var v = getDropdown(window.document.getElementsByName('inpt_custcol_cseg3')[0]);
	console.log(v);
	var info = v.div;
	var divs = info.querySelectorAll('.dropdownNotSelected');

	
	  for(var j = 0; j<divs.length; j++) {
		  sysBudge.push(divs[j].innerHTML);
		    var arraycontains = (ownerBudge.indexOf(divs[j].innerHTML) > -1);
		    
		    if(arraycontains == false) {
					 var selectOptionToRemove = divs[j];
					 selectOptionToRemove.remove();
		    }
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