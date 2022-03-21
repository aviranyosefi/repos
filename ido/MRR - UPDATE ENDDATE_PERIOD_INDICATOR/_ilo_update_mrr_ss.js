
function _update_revPlans(type) {
	try{
		
		var recs = getAllRecs();
		
		nlapiLogExecution('debug', 'recs', JSON.stringify(recs))
		
		if(recs != []) {
		
		for(var i = 0; i<recs.length; i++) {
			
			var currRec = nlapiLoadRecord("revenueplan", recs[i].internalid);
			currRec.setFieldValue('custrecord_workflow_indicator', 'T');
			currRec.setFieldValue('custrecord_initial_period', recs[i].postingperiod);
			currRec.setFieldValue('revrecenddate', recs[i].enddate)
			nlapiSubmitRecord(currRec);
			
			
			 var ctx = nlapiGetContext();
				var remainingUsage = ctx.getRemainingUsage();
				if (remainingUsage < 200) {
	              var state = nlapiYieldScript();
	              if (state.status == 'FAILURE') {
	                  nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script updating rev recs scheduled');
	              }
	              else if (state.status == 'RESUME') {
	                  nlapiLogExecution("AUDIT", 'updating rev recs', "Resuming script due to: " + state.reason + ",  " + state.size);
	              }
          }
		}
		}// if recs != []s
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
					postingperiod : line.getValue(cols[7]),
					enddate : line.getValue(cols[6])

					});
				
					
					
				});

			};
			
			return items;

	}