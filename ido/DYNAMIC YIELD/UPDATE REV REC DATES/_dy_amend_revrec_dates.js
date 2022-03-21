/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Apr 2019     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */


function dy_amendRevRec() {
	
	var res = getSearchResults();
	
	if(res != []) {
			
		for(var i = 0; i<res.length; i++) {
			
			try{
			
			var rec = nlapiLoadRecord('revenueplan', res[i].internalid);
			rec.setFieldValue('revrecstartdate', res[i].startdate);
			rec.setFieldValue('revrecenddate', res[i].enddate);
			
			nlapiSubmitRecord(rec)
			
			}catch(err) {
				nlapiLogExecution('error', 'err', err)
				continue;
			}
		}
	}
}



function getSearchResults() {
	

	var searchFAM = nlapiLoadSearch(null, 'customsearch359');
	
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
			oldStartDate : line.getValue(cols[2]),
			oldEndDate : line.getValue(cols[3]),
			startdate : line.getValue(cols[4]),
			enddate : line.getValue(cols[5]),

			

		});

		});

	};
	
	return theResults;
}