

function updateRevenueElements(type) {
	
	var arr = getSearch();

	var groupedRes = groupBy(arr, function(item) {
		return [ item.arrangeID ]
	});

		
	groupedRes.forEach(function(element) {
		
		try{
					
		var group = element;
		var arrangeRecID = group[0].arrangeID
		var arrangeRec = nlapiLoadRecord('revenuearrangement', arrangeRecID);
		var arrangeLines = arrangeRec.getLineItemCount('revenueelement')
		
	
		
		 for(var i = 1; i<=arrangeLines; i++) {

				for(var j = 0; j<group.length; j++) {
					
			var currentLine = arrangeRec.getLineItemValue('revenueelement', 'revenueelement', i);
			
			console.log(currentLine)
			if(currentLine == group[j].elementID) {
				arrangeRec.setLineItemValue('revenueelement', 'revrecstartdate', i, group[j].startDate)
				arrangeRec.setLineItemValue('revenueelement', 'revrecenddate', i, group[j].endDate)
				arrangeRec.setLineItemValue('revenueelement', 'forecaststartdate', i, group[j].startDate)
				arrangeRec.setLineItemValue('revenueelement', 'forecastenddate', i, group[j].endDate)
				}

			 }
		 }
		nlapiSubmitRecord(arrangeRec, true, true)
		
		}catch(err){
			//if any error occurs during the foreach loop the error is caught and by using 'return' it acts as 'continue' like in a normal for loop
			console.log(err)
			nlapiLogExecution('debug', 'err', err)
			return;
		}
		});

}



function groupBy(array, f) {
	var groups = {};
	array.forEach(function(o) {
		var group = JSON.stringify(f(o));
		groups[group] = groups[group] || [];
		groups[group].push(o);
	});
	return Object.keys(groups).map(function(group) {
		return groups[group];
	})
}


function getSearch() {

	var searchLocations = nlapiLoadSearch(null, 'customsearch69');

	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchLocations.runSearch();
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

		var checkStartDate = line.getValue('custcol_bidata_start_date', 'sourceTransaction');
		
		if(checkStartDate != '') {
		
					allResults.push({
			
			elementID : line.getValue('internalid'),
			startDate : line.getValue('custcol_bidata_start_date', 'sourceTransaction'),
			endDate : line.getValue('custcolbiodata_end_date', 'sourceTransaction'),
			arrangeID : line.getValue('internalid', 'revenueArrangement'),
		
			});
		}
		});

	};

return allResults;

}