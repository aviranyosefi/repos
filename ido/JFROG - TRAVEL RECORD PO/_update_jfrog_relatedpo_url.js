/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       14 Mar 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function updateURL(type){
   
	var checkItems = getPOs();
	
	
	for(var i = 0; i<checkItems.length; i++) {
	
	try {
	
		var rec = nlapiLoadRecord('purchaseorder', checkItems[i].internalid)
	
		var lineCount = rec.getLineItemCount('item');
		
		for(var x = 0; x<lineCount; x++) {
			
			var checkURL = rec.getLineItemValue('item', 'custcol_jfrog_travel_po_link_col', x+1)
			var fixed = checkURL.substring(1);
			rec.setLineItemValue('item', 'custcol_jfrog_travel_po_link_col', x+1, fixed)
		}

		nlapiSubmitRecord(rec)
	}

catch (e) {

	console.log(e)
continue;

}
	

}
}





function getPOs() {

	var searchItems= nlapiLoadSearch(null, 'customsearch1226');

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