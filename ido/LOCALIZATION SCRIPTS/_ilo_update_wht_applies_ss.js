/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Mar 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function update_wht_applies(type) {
	
	

}



function getVendorBills() {

	try {
		var searchFAM = nlapiLoadSearch(null, 'customsearch196');
		var allSelection = [];
		var theResults = [];
		var allResults = [];
		var resultSelection = [];
		var searchid = 0;
		var resultset = searchFAM.runSearch();
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

				theResults.push({

					internalid : line.getValue('internalid'),

				});

			});

		}
		;

	} catch (err) {
		nlapiLogExecution('debug', 'err', err)
	}

	return theResults;

}