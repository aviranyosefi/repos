/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Sep 2016     idor
 *
 */

///using a saved search of "Cases on Hold"
// filtering by all records that are not assigned to Alex Wolfe ("-5")
// show only colummns - casenumber,company,title(subject),assigned(to whom the case is assigned)
// get results



var filters = new nlobjSearchFilter( 'assigned', null, 'noneof', '-5' );

var columns = new Array();
columns[0] = new nlobjSearchColumn( 'casenumber' );
columns[1] = new nlobjSearchColumn( 'company' );
columns[2] = new nlobjSearchColumn( 'title' );
columns[3] = new nlobjSearchColumn( 'assigned' );

var search = nlapiLoadSearch(null, 'customsearch129');

//here we add the custom searchfilter to the saved search that we just loaded
search.addFilter(filters); 

//here we set the columnfilter to the saved search that we just loaded
search.setColumns(columns);

//we then create a new search that gets all types/filter-expressions and columns from the original saved search loaded
var newSearch = nlapiCreateSearch(search.getSearchType(), search.getFilterExpression(),
search.getColumns());

//run the new search
var a = newSearch.runSearch();

//get results from search - start: 0 / end: 1000 (basically this is the maximum amount of results we can recieve at a time
var results = a.getResults(0,1000);



//////////////////////////////////////////////////////////////////////////////////
		//Now to get the PhoneNumber of each customer from the results//
//////////////////////////////////////////////////////////////////////////////////

var companyID = [];

//loop over results to get entity ID(customer name) and phonenumber

for (var i = 0; i<results.length; i++) {
	
	companyID.push(results[i].rawValues[1].value);
}


companyID.forEach(function(a,b,c) {

	var custSearch = nlapiLoadRecord('customer', a, null, null);

	var phoneNumber = custSearch.fields.phone;
	var companyName = custSearch.fields.entityid;

	console.log('The customers details are: ' + companyName + ' : ' + phoneNumber);
});