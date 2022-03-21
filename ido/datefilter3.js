

var search = nlapiLoadSearch(null, 'customsearch521');

var filters = new Array();
filters[0] =  new nlobjSearchFilter( 'startdate', null, 'on', '2/12/2016'); 

var columns =  new Array();
columns[0] = new nlobjSearchColumn( 'startdate', null, null );
columns[1] = new nlobjSearchColumn( 'title', null, null );

search.addFilter(filters); 
search.setColumns(columns);

var newSearch = nlapiCreateSearch(search.getSearchType(), filters, columns);

var a = newSearch.runSearch();

var results = a.getResults(0,1000);

console.log(results);





