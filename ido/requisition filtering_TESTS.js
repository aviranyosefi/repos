var budgetClassOptions = [];
var ownerBudgetClass = [];
var ownerBudge = [];
var sysBudge = [];
var budgetsOfOwner;
var today = new Date();



	var v = getDropdown(window.document.getElementsByName('inpt_custcol_cseg3')[0]);
	console.log(v);
	var info = v.div;
	var divs = info.querySelectorAll('.dropdownNotSelected');



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


var budgetClassbyOwner = nlapiSearchRecord(
		'customrecord_ilo_budget_control_record', null, filters, cols);

for (var a = 0; a<budgetClassbyOwner.length; a++) { 
  budgetsOfOwner  = budgetClassbyOwner[a].getText('custrecord_ilo_budget_class');
 ownerBudge.push(budgetsOfOwner);
  
}

  for(var j = 0; j<divs.length; j++) {
  sysBudge.push(divs[j].innerHTML);
    var arraycontains = (ownerBudge.indexOf(divs[j].innerHTML) > -1);
    
    if(arraycontains == false) {
			 var selectOptionToRemove = divs[j];
			 selectOptionToRemove.remove();
    }
}



