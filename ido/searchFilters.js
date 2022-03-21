//Hi,
//So regarding our last talk , here are the next tasks:
//
//•	Use LoadSearch function on the last task
//•	Add filter to exclude a scpesific account.
//•	Get the Customer contact's email
//•	Compute the average using the search instead of the function (search for group function .. and you'll find out)
//
//Goodluck
//
//




var allCustomers = [];
var targetCustomers = [];
var contactEmail = '';


//custom searchfilter -- filters search results and checks that the 'internalidnumber' is 'notequalto' = '982'
var filter1 = new nlobjSearchFilter( 'internalidnumber', null, 'notequalto', '982' );

//custom columnfilter -- gives only results for this column(name:consolbalance)and calculate average(sum:'avg')
var column1 =  new nlobjSearchColumn( 'consolbalance', null, 'avg' );



//load custom search
var search = nlapiLoadSearch('customer','customsearch570');

//here we add the custom searchfilter to the saved search that we just loaded
search.addFilter(filter1); 

//here we set the columnfilter to the saved search that we just loaded
search.setColumns(column1);

//we then create a new search that gets all types/filter-expressions and columns from the original saved search loaded
var newSearch = nlapiCreateSearch(search.getSearchType(), search.getFilterExpression(),
search.getColumns());

//run the new search
var a = newSearch.runSearch();

//get results from search - start: 0 / end: 1000 (basically this is the maximum amount of results we can recieve at a time
var results = a.getResults(0,1000);


//get average value and parsefloat it from String to number
var avgCB = parseFloat(results[0].rawValues[0].value);

/////////////////////////////////////////////////////////////////////////////////////////
//after calculating the average of the consolidated balance for this saved search  //////
//we run another search in order to check who falls within the average range and get //// 
//their contacts email from sublist("contacts")									   //////
/////////////////////////////////////////////////////////////////////////////////////////

var secondSearch = nlapiSearchRecord('customer', 'customsearch570', null, null);

//loop over results and disregard any results that has a value of ".00"
for (var i = 0; i < secondSearch.length; i++) {

	// check if result has a value, if not continue
	if (secondSearch[i].rawValues[5].value == '.00') {
		continue;
	} else {

		var custID = secondSearch[i].id;
		var custEmail = secondSearch[i].rawValues[1].value;
		if (custEmail == '') {
			custEmail = "No email provided";
		};
		
		// convert values from string to number
		var results = parseFloat(secondSearch[i].rawValues[5].value);

		// push results in a clean object to allCustomers array
		allCustomers.push({
			id : custID,
			consolbalance : results,
			email : custEmail
		});
	
	}
}


var maxAvg = avgCB + 500;
var minAvg = avgCB - 500;

allCustomers.forEach(function(a,b,c) {

	var currentCust = a;
	var currentCustCB = a.consolbalance;
	
	// if yes, push to seperate array (targetCustomers)
	if (maxAvg > currentCustCB && minAvg < currentCustCB == true) {
		targetCustomers.push(a);

	} else if (maxAvg > currentCustCB && minAvg < currentCustCB == false) {
		console.log('<--- Customers not in range');
	}

	
});
console.log(targetCustomers);

///after finding which customers are in the average range - load each customers' record and get contact's email

function getContactEmail(z) {
	
	var contactRec = nlapiLoadRecord('customer', z[0].id, null);
	var contactArr = contactRec.lineitems.contactroles;
	contactArr.forEach(function(a,b,c) {
		
		contactEmail = a.email;
	});
	
	console.log("Contact email : " + contactEmail);
}

getContactEmail(targetCustomers);