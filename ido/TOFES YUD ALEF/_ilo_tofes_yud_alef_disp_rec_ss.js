function getDisposalRecNumbers() {
	
	var searchFAM = nlapiLoadSearch(null,'customsearch_ilo_ty_activities_5');
	
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
                            	  
                              name : line.getValue(cols[0]),
                              lineuniquekey : line.getValue(cols[1]),
                              internalid : line.getValue(cols[2]),
                              accbook : line.getValue(cols[3]),
							  disposal_numlines : line.getValue(cols[4]),

							  

                              });

	
               });
	}; 

	return theResults;
}

function update_disposal_rec_numbers(type) {
	
	var linesToCheck = getDisposalRecNumbers();
	
	for(var i = 0; i<linesToCheck.length; i++) {
		
		if(linesToCheck[i].disposal_numlines == '') {
		try{
		nlapiSubmitField('customrecord_ncfar_deprhistory', linesToCheck[i].internalid, 'custrecord_ty_disp_rec_num', linesToCheck[i].lineuniquekey)
		}catch(err) {
		
		nlapiLogExecution('debug', 'err', err);
		continue;
		}
		
		}
		
		
		
		}
	
	

}
