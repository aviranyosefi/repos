function getInvoicesWithShippingCost() {

	var filters = [];
	var columns = [];
	
	filters[0] = new nlobjSearchFilter('shippingcost', null,'greaterthan', "0"); 
	filters[1] = new nlobjSearchFilter('mainline', null,'is', 'T'); 


	var columns = new Array();
	columns[0] = new nlobjSearchColumn('internalid');
	columns[1] = new nlobjSearchColumn('tranid');
	columns[2] = new nlobjSearchColumn('shippingcost');

	
	
	var searchInv = nlapiCreateSearch('invoice', filters, columns)

	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchInv.runSearch();
	var rs;

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allSelection
					.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allSelection != null) {
		allSelection.forEach(function(line) {

			allResults.push({

				internalid : line.getValue('internalid'),
				tranid : line.getValue('tranid'),
				shippingcost : line.getValue('shippingcost'),

			});

		});
	}
	;

	return allResults;
};