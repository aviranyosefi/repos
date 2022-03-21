/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 Jun 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function syg_fix_ils(type) {
	
	try{

	//get population of saved search
	var all = getAllTransactions();
	
	if (all != []) {
		all.forEach(function(element) {
			
			
			var rec = nlapiLoadRecord('vendorpayment', element.internalid);
			
			var lineCount = rec.getLineItemCount('accountingbookdetail');
						
			for(var i = 0; i<lineCount; i++) {
				//set new exchange rate at accountingbook sublist
			var exchangeRate = rec.setLineItemValue('accountingbookdetail', 'exchangerate', i+1, element.newrate);

			}
			//set totalILS and checkbox (body)
			rec.setFieldValue('custbody_total_ils_amount', element.totalILS);
			rec.setFieldValue('custbody_ils_fixed_rate', 'T')
			
			nlapiSubmitRecord(rec);
			
			});
		
	}// end of if (all != [])
	
	
	}catch(err){
		nlapiLogExecution('error', 'syg_fix_ils -err', err)
	}
}




function getAllTransactions() {


	var searchAssets = nlapiLoadSearch(null, 'customsearch_fix_ils_exp_report_rate');

	var allassets = [];
	var resultsAssets =[];
	var resultContacts = [];
	var searchid = 0;
	var resultset = searchAssets.runSearch();
	var rs;
	var cols = searchAssets.getColumns();
	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allassets.push(resultContacts[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allassets != null) {
				allassets.forEach(function(line) {
					
					//	if(line.getText(cols[7]) == subsidName) {
											 

					resultsAssets.push({
			                            	  
			                              internalid : line.getValue(cols[0]),
			                              totalILS : line.getValue(cols[5]),
			                              newrate : line.getValue(cols[6]),
			  
										  

			                              });

						//}
			               });

			};
		
			return resultsAssets;

}

