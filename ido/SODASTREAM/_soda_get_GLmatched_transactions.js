
function getGLMatchedTrans(tranid, line) {

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_glmatched_tranid', null, 'anyof', tranid)
	filters[1] = new nlobjSearchFilter('custrecord_glmatchcode_line', null, 'is', line)

    var columns = new Array();
    columns[0] = new nlobjSearchColumn( 'internalid' );
    columns[1] = new nlobjSearchColumn( 'custrecord_glmatched_tranid' )
    columns[2] = new nlobjSearchColumn( 'custrecord_glmatchcode_code' );
    columns[3] = new nlobjSearchColumn( 'custrecord_glmatchcode_line' );
    
    
    var savedSearch = nlapiCreateSearch('customrecord_glmatched', filters, columns)
        
    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
	var results = [];
	var cols = savedSearch.getColumns();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for ( var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

	if(returnSearchResults != null) {
	returnSearchResults.forEach(function(element) {

			results.push({ 
			
				internalid : element.getValue('internalid'),
				transaction : element.getValue('custrecord_glmatched_tranid'),
				gl_matchedcode : element.getValue('custrecord_glmatchcode_code'),
				transaction_line : element.getValue('custrecord_glmatchcode_line'),

			});	
		});

	}
	
return results;
	
}