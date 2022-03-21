/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Apr 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function populate_fields_forprint(){
	
try{
	
	
	
	var whtAmt = nlapiGetFieldValue('custpage_4601_withheld');
	if(whtAmt == '' || whtAmt == undefined || whtAmt == null) {
		whtAmt = 0;
	}
	nlapiSetFieldValue('custbody_gal_wht_custpayment_total', whtAmt)
	
	//var systemNotes = getSystemNotes(nlapiGetRecordId());
	//var createdBy = '';
	//if(systemNotes != [] || systemNotes != undefined || systemNotes != null) {
		
	//	console.log(systemNotes)
	
	//	createdBy = systemNotes[0].name
	//}

	//nlapiSetFieldValue('custbody_gal_createdby_custpayment', createdBy)
	
    return true;
	
}catch(err){
	return true;
}
}





function getSystemNotes(recID) {
	
	var columns = new Array();
		columns[0] = new nlobjSearchColumn('name');
		columns[1] = new nlobjSearchColumn('context');
		columns[2] = new nlobjSearchColumn('date').setSort();
		columns[3] = new nlobjSearchColumn('type');

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('recordid', null, 'equalto', [recID]);

	
	var searchDetails = nlapiCreateSearch('systemnote', filters, columns)

	var allResults = [];
	var results =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchDetails.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allResults.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allResults != null) {
				allResults.forEach(function(line) {
					
					results.push({
					
					name: line.getText('name').replace(/[0-9]/g, '').trim(),
					date: line.getValue('date'),
					type: line.getValue('type'),
					context: line.getValue('context'),
					});

				});

			};
			
	return results
}