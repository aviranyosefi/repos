function getDeprhistoryToRemove() {

var searchItems= nlapiLoadSearch(null, 'customsearch1142');

	var allItems = [];
	var items =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchItems.runSearch();
	var rs;

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
					
					internalid : line.getValue('internalid'),
					
					});
				
					
					
				});

			};
			
			return items;



}


function delete_pos(type) {
	
var checkItems = getDeprhistoryToRemove();
	
		
	for(var i = 0; i<checkItems.length; i++) {
	
	try {
	
	
    nlapiDeleteRecord('purchaseorder', checkItems[i].internalid);
	
	
	
	}

   

catch (e) {

	nlapiLogExecution('DEBUG', 'err', e);
continue;

}
	

}
	


}
