function invSearch() {

	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('customersubof', null, 'anyof', '1668');
	filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');


	var columns = new Array();
	columns[0] = new nlobjSearchColumn('amount');
	columns[1] = new nlobjSearchColumn('tranid');
	columns[2] = new nlobjSearchColumn('entity');


	var search = nlapiSearchRecord('invoice', null, filters, columns);
console.log(search);
	var a = a;
	
	
	
	
	
}

invSearch();