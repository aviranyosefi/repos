
function runUpdate() {

var arr = searchJournals();

for(var i = 0; i<arr.length; i++) {

var rec = nlapiLoadRecord('journalentry', arr[i].internalid);
rec.setLineItemValue('line', 'custcol_local_book_fa_account', arr[i].lineNum, arr[i].value)
nlapiSubmitRecord(rec)

}

}

runUpdate()


function searchJournals() {


	var searchFAM = nlapiLoadSearch(null, 'customsearch444');
	
	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();
	

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

		theResults.push({

			internalid : line.getValue(cols[0]),
			lineNum : line.getValue(cols[cols.length-1]),
			value : line.getValue(cols[5]),


		});

		});

	};
	
	return theResults;
}
