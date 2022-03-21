var x = nlapiGetFieldValue('entity');
console.log(x);

var ownerBudgetClass = [];
var filters = new Array();
filters[0] = new nlobjSearchFilter('custrecord_ilo_budget_owner', null, 'anyof', x); //'x' is the internal id of the requestor

var cols = new Array();
cols[0] = new nlobjSearchColumn('custrecord_ilo_budget_class');

var budgetClassbyOwner = nlapiSearchRecord('customrecord_ilo_budget_control_record', null, filters, cols);
console.log(budgetClassbyOwner);
for (var k = 0; k<budgetClassbyOwner.length; k++) {
	
	var budgetClass = parseInt(budgetClassbyOwner[k].getValue('custrecord_ilo_budget_class'))+2;
	var strBudgetClass = 'nl'+budgetClass.toString();
	ownerBudgetClass.push(strBudgetClass);
}
console.log(ownerBudgetClass); //array of internal ids of budget classes that are owned by requestor
	

var budgetClassOptions = [];
var v = getDropdown(window.document.getElementsByName('inpt_custcol_cseg3')[0]);  
console.log(v);
var info = v.div;
var divs = info.querySelectorAll('.dropdownNotSelected');
console.log(divs);

for(var i = 0; i < divs.length; i++)
{
	budgetClassOptions.push(divs[i].id);
}

console.log(budgetClassOptions);
console.log(divs);

//get and remove options in budget class list
//var c = document.getElementById("#nl3");
//c.remove();
for (var d = 1; d < budgetClassOptions.length; d++) {
	  if(ownerBudgetClass.indexOf(budgetClassOptions[d]) == -1) {
	    
		var selectOptionToRemove = document.getElementById(budgetClassOptions[d]);
		selectOptionToRemove.remove();
		  
	  }
	}


//to get id of budget classifaction
var a = nlapiGetCurrentLineItemValue('item', 'custcol_cseg3');
console.log(a);
var filters = new Array();
filters[0] = new nlobjSearchFilter('custrecord_ilo_budget_class', null, 'anyof', a);

var cols = new Array();
cols[0] = new nlobjSearchColumn('custrecord_ilo_budget_class');
cols[1] = new nlobjSearchColumn('custrecord_ilo_budget_owner');
cols[2] = new nlobjSearchColumn('custrecord_ilo_budget_fromdate');
cols[3] = new nlobjSearchColumn('custrecord_ilo_budget_todate');
cols[4] = new nlobjSearchColumn('custrecord_ilo_budget_type');


var search = nlapiSearchRecord('customrecord_ilo_budget_control_record', null, filters, cols);

console.log(search);

var fil = new Array();
fil[0] = new nlobjSearchFilter('account', null, 'is', item);
var itemSearch = nlapiSearchRecord('noninventoryitem', null, fil, null);
console.log(itemSearch);



var accountOwner = search[0].getValue("custrecord_ilo_budget_owner", null, null);
console.log(item);
console.log(accountOwner);
//only when budget classification has an expense item
nlapiSetCurrentLineItemValue('item', 'item', item);






	

//only when field is selected
var budgetClassOptions = [];
var v = getDropdown(window.document.getElementsByName('inpt_custcol_cseg3')[0]);  
console.log(v);
var info = v.div;
var divs = info.querySelectorAll('.dropdownNotSelected');
console.log(divs);

for(var i = 2; i < divs.length; i++)
{
	budgetClassOptions.push(divs[i].id);
}

console.log(budgetClassOptions);
console.log(divs);

//get and remove options in budget class list
var c = document.getElementById("nl3");
c.remove();



var x = document.getElementsByName("inpt_custcol_cseg3")[0].getAttribute("data-options");

var elem = document.querySelectorAll('[data-name="custcol_cseg3"]');
console.log(elem);

document.getElementById("inpt_custcol_cseg319_arrow").addEventListener("click", displayDate);
document.getElementById("inpt_custcol_cseg319").addEventListener("click", displayDate);
function displayDate() {
	console.log('hurray');
	
	var x = nlapiGetFieldValue('entity');
	console.log(x);

	var ownerBudgetClass = [];
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_ilo_budget_owner', null, 'anyof', x); //'x' is the internal id of the requestor

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('custrecord_ilo_budget_class');

	var budgetClassbyOwner = nlapiSearchRecord('customrecord_ilo_budget_control_record', null, filters, cols);
	console.log(budgetClassbyOwner);
	for (var k = 0; k<budgetClassbyOwner.length; k++) {
		
		var budgetClass = parseInt(budgetClassbyOwner[k].getValue('custrecord_ilo_budget_class'))+2;
		var strBudgetClass = 'nl'+budgetClass.toString();
		ownerBudgetClass.push(strBudgetClass);
	}
	console.log(ownerBudgetClass); //array of internal ids of budget classes that are owned by requestor
		

	var budgetClassOptions = [];
	var v = getDropdown(window.document.getElementsByName('inpt_custcol_cseg3')[0]);  
	console.log(v);
	var info = v.div;
	var divs = info.querySelectorAll('.dropdownNotSelected');
	console.log(divs);

	for(var i = 0; i < divs.length; i++)
	{
		budgetClassOptions.push(divs[i].id);
	}

	console.log(budgetClassOptions);
	console.log(divs);

	//get and remove options in budget class list
	//var c = document.getElementById("#nl3");
	//c.remove();
	for (var d = 1; d < budgetClassOptions.length; d++) {
		  if(ownerBudgetClass.indexOf(budgetClassOptions[d]) == -1) {
		    
			var selectOptionToRemove = document.getElementById(budgetClassOptions[d]);
			selectOptionToRemove.remove();
			  
		  }
		}
}


//search noninventory items filtered by subtype('for purchase')
var fils = new Array();
fils[0] = new nlobjSearchFilter('subtype', null, 'is', 'Purchase');

var cols = new Array();
cols[0] = new nlobjSearchColumn('expenseaccount');

var itemSearch = nlapiSearchRecord('noninventoryitem', null, fils, cols);
console.log(itemSearch);



//get expense account id from budget control
var requestor = nlapiGetFieldValue('entity');
console.log(requestor);

var ownerBudgetClass = [];
var filters = new Array();
filters[0] = new nlobjSearchFilter('custrecord_ilo_budget_owner', null, 'anyof', requestor); //'requestor' is the internal id of the requestor

var cols = new Array();
cols[0] = new nlobjSearchColumn('custrecord_ilo_budget_class');
cols[1] = new nlobjSearchColumn('custrecord_ilo_budget_exp_account');

var budgetClassbyOwner = nlapiSearchRecord('customrecord_ilo_budget_control_record', null, filters, cols);
var expenseAcc = [];
for(var i = 0; i < budgetClassbyOwner.length; i++)
{
	expenseAcc.push(budgetClassbyOwner[i].getValue('custrecord_ilo_budget_exp_account'));
}
console.log(expenseAcc);