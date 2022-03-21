/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Mar 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function change_tran_form(type) {
	
	var all = getPayments();
	
	for(var i =0; i<all.length; i++) {
		try{
			
			nlapiSubmitField('customerpayment',  all[i], 'customform', '139')
			
		}catch(err){
			
			nlapiLogExecution('error', 'err', err)
		}
		
		
	}

}


function getPayments() {

	var searchFAM = nlapiLoadSearch(null,'customsearchcustomer_payment_search');
	
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
			
		//	if(line.getText(cols[7]) == subsidName) {
								 

               theResults.push(line.getValue('internalid'))

			//}
               });
	}; 

	return theResults;
}
