/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Jun 2019     idor
 *
 */

function updateExRates() {
	
	var arr = getTransactions();
	
	if(arr != null || arr != undefined || arr != []) {

		for(var i = 0; i<arr.length; i++) {
			
			try{
				var rec = nlapiLoadRecord('journalentry', arr[i].internalid);
				var exRate = nlapiExchangeRate(arr[i].currency, '1', arr[i].trandate);
				rec.setFieldValue('exchangerate', exRate)
				nlapiSubmitRecord(rec)
				console.log('current-index : ' + i);

			}catch(err) {
				console.log(err);
			}
		}
	}

}

function getTransactions() {

	var searchFAM = nlapiLoadSearch(null,'customsearch_nr_trx_fix_2');
	
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
                              currency : line.getValue(cols[1]),
                              trandate : line.getValue(cols[2])
                              });
               });
	}; 

	return theResults;
}