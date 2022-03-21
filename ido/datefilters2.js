

var initSearch = nlapiLoadSearch(null, 'customsearch172');

var filters = new Array();
filters[0] =  new nlobjSearchFilter( 'startdate', null, 'within', '4/2/2016'); 

var columns =  new Array();
columns[0] = new nlobjSearchColumn( 'startdate', null, null );
columns[1] = new nlobjSearchColumn( 'recipient', null, null );

initSearch.addFilter(filters); 
initSearch.setColumns(columns);

var newSearch = nlapiCreateSearch(initSearch.getSearchType(), filters, columns);

var a = newSearch.runSearch();

var results = a.getResults(0,1000);


console.log(results.length);