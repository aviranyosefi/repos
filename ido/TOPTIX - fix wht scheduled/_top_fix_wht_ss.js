/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Mar 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function top_fix_wht() {
try{

var allBills = getBills();

for(var i = 0; i<allBills.length;) {

		var rec = nlapiLoadRecord('vendorbill', allBills[i].tranid);
		
		var lineCount = rec.getLineItemCount('expense');
		
		for(var x = 1; x<=lineCount; x++) {
			
			rec.setLineItemValue('expense', 'custcol_4601_witaxapplies', x, 'T');	
		}
		
			rec.setFieldValue('custbody_4601_appliesto', 'T', true, true);	
		nlapiSubmitRecord(rec)
		
		
		}
}
catch(err){
nlapiLogExecution('debug', 'err', err)

}

}



function getBills() {

	try {

		var searchFAM = nlapiLoadSearch(null, 'customsearch328');

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

					tranid : line.getValue('internalid'),

				});

			});

		}
		;

	} catch (err) {
		nlapiLogExecution('debug', 'err', err)
	}

	return theResults;

}