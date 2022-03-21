(function() {

	var search = nlapiLoadSearch(null, 'customsearch117');
	// console.log(search);

	var filters = new Array();
		filters[0] = new nlobjSearchFilter('assigned', null, 'noneof', '-5');
		filters[1] = new nlobjSearchFilter('status', null, 'anyof', '3');

	var columns = new Array();
		columns[0] = new nlobjSearchColumn('casenumber');
		columns[1] = new nlobjSearchColumn('company');
		columns[2] = new nlobjSearchColumn('status');
		columns[3] = new nlobjSearchColumn('assigned');

	search.addFilter(filters);
	search.setColumns(columns);

	var newSearch = nlapiCreateSearch(search.getSearchType(), filters, columns);
	var a = newSearch.runSearch();

	var b = a.getResults(0, 1000);

	// console.log(x);

	console.log("These are the cases that their statuses are 'escalated' and not assigned to Alex Wolfe :");
	for (var i = 0; i < b.length; i++) {
		console.log("name: " + b[i].valuesByKey.assigned.text + " | "
				  + "case: " + b[i].valuesByKey.casenumber.value);
	}

})();