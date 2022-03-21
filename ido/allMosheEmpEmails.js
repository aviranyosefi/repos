
function getMosheMail() {
	
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('email', null, 'contains', '@one1up.com');

	var columns = new Array();
	columns[0] = new nlobjSearchColumn('altname');
	columns[1] = new nlobjSearchColumn('email');

	var search = nlapiSearchRecord('employee', null, filters, columns);
console.log(search);
	var a = a;
	
	
	
	
}

getMosheMail();