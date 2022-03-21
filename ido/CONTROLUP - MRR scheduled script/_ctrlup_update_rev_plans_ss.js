/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Jan 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function ctrlup_update_revPlans(type) {
	try{
		
		var recs = getAllRecs();
		
		
		for(var i = 0; i<recs.length; i++) {
			
			var currRec = nlapiLoadRecord("revenueplan", recs[i].internalid);
			currRec.setFieldValue('custrecord_workflow_indicator', 'T');
			currRec.setFieldValue('custrecord_initial_period', recs[i].postingperiod);
			nlapiSubmitRecord(currRec);
		}
		
	}catch(err){
		nlapiLogExecution('debug', 'err', err)
	}


}



function getAllRecs() {

	var searchItems= nlapiLoadSearch(null, 'customsearchwf_rev_plan_update');

	var allItems = [];
	var items =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchItems.runSearch();
	var rs;
	
		var cols = searchItems.getColumns();

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allItems.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allItems != null) {
				allItems.forEach(function(line) {
					
					items.push({
					
					internalid : line.getText(cols[0]),
					postingperiod : line.getValue(cols[6]),
					
					
					
					});
				
					
					
				});

			};
			
			return items;

	}