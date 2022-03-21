/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Apr 2019     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function billingScheduleReport(request, response){
	
	
	if (request.getMethod() == 'GET') {
		//nlapiLogExecution('DEBUG', 'stage one', 'stage one');
	
		var form = nlapiCreateForm('Billing Schedule Report');
		//form.setScript('customscript_ilo_multi_search_result_cs');
		form.addSubmitButton('Load');

		var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
		checkStage.setDefaultValue('stageOne');
		checkStage.setDisplayType('hidden');

		response.writePage(form);

	} 

}





function getAllSOLines() {

var filters = new Array();
filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', ['3554'])

var columns = new Array();
columns[0] = new nlobjSearchColumn('item');
columns[1] = new nlobjSearchColumn('billingschedule');
columns[2] = new nlobjSearchColumn('tranid');
columns[3] = new nlobjSearchColumn('subsidiarynohierarchy');
columns[4] = new nlobjSearchColumn('custcol_dy_rev_rec_start_date');
columns[5] = new nlobjSearchColumn('custcol_dy_rev_rec_end_date');


var savedSearch = nlapiCreateSearch('salesorder', filters, columns)


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
	
	var checkStartDate = element.getValue(cols[4]);
	
	if(checkStartDate != '') {

results.push({
	
item : element.getText(cols[0]),
schedule : element.getText(cols[1]),
docID : element.getValue(cols[2]),
subsid : element.getText(cols[3]),
startdate: element.getValue(cols[4]),
enddate: element.getValue(cols[5]),

});

	}
});

}


return results;

}