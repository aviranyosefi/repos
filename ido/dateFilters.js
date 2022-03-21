/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Sep 2016     idor
 *
 */

//Here we are using the saved search - "Help Desk Case View" -customsearch114-
// 1. I want to get only the cases from the month of July
// 2. I want to get cases that were opened before the month of July (not including)
// 3. I want the most recent case


var search = nlapiLoadSearch(null, 'customsearch114');
console.log(search);

// date filters- useful operators('within'(self-explanatory),
//									'notbefore' (all dates after)
//									('within' and two dates following gives results of within a date range

var filters = new Array();
filters[0] =  new nlobjSearchFilter( 'startdate', null, 'within', '1/1/2016', '3/1/2016'); //example of date range
//filters[1] =  new nlobjSearchFilter( 'startdate', null, 'before', '3/1/2016');


var columns =  new nlobjSearchColumn( 'startdate', null, null );

search.addFilter(filters); 
search.setColumns(columns);


//we then create a new search that gets all types/filter-expressions and columns from the original saved search loaded
var newSearch = nlapiCreateSearch(search.getSearchType(), filters, columns);

//run the new search
var a = newSearch.runSearch();

//get results from search - start: 0 / end: 1000 (basically this is the maximum amount of results we can recieve at a time
var results = a.getResults(0,1000);

for (var i = 0; i<results.length; i++) {
	
	console.log(results[i].rawValues[0].value);
	
};