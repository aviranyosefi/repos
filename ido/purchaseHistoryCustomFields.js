
function getPurchaseHistory() {
	
	
	
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('entity', null, 'is', '1832');
	filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	

	var columns = new Array();
	columns[0] = new nlobjSearchColumn('amount');
	columns[1] = new nlobjSearchColumn('entity');
	columns[2] = new nlobjSearchColumn('type');


	var search = nlapiSearchRecord('purchaseorder', null, filters, columns);


var x = x;
	var a = a;
	
	
	
	
	
	
	
	
	
}

getPurchaseHistory();