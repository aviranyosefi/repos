function getMessages() {

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('author', null, 'is', '4');

	var columns = new Array();
	columns[0] = new nlobjSearchColumn('subject');
	columns[1] = new nlobjSearchColumn('authoremail');
	columns[2] = new nlobjSearchColumn('recipientemail');
	columns[3] = new nlobjSearchColumn('messagedate');

	var search = nlapiSearchRecord('message', null, filters, columns);
console.log(search);
	var a = a;

}

getMessages();

///More exact way of doing this message search - is by using the actual email address as a parameter for the filter///

function getMessages() {

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('authoremail', null, 'contains', 'sharon.shaked@one1up.com');

	var columns = new Array();
	columns[0] = new nlobjSearchColumn('subject');
	columns[1] = new nlobjSearchColumn('authoremail');
	columns[2] = new nlobjSearchColumn('recipientemail');
	columns[3] = new nlobjSearchColumn('messagedate');

	var search = nlapiSearchRecord('message', null, filters, columns);
console.log(search);
	var a = a;

}

getMessages();