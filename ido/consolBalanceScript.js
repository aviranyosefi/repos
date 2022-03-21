//init for all variables
var allCustomers = [];
var targetCustomers = [];
var averageArr = [];
var average = '';

// get saved search results
var searchresults = nlapiSearchRecord('customer', 'customsearch570', null, null);

// loop over results and disregard any results that has a value of ".00"
for (var i = 0; i < searchresults.length; i++) {

	// check if result has a value, if not continue
	if (searchresults[i].rawValues[5].value == '.00') {
		continue;
	} else {

		var custID = searchresults[i].id;
		var custEmail = searchresults[i].rawValues[1].value;
		if (custEmail == '') {
			custEmail = "No email provided";
		};
		
		// convert values from string to number
		var results = parseFloat(searchresults[i].rawValues[5].value);

		// push results in a clean object to allCustomers array
		allCustomers.push({
			id : custID,
			consolbalance : results,
			email : custEmail
		});
		// push all Consolidated Balances to seperate array in order to get
		// average value
		averageArr.push(results);
	}
}

// calculate average
var sum = averageArr.reduce(add, 0);

function add(a, b) {
	return a + b;
}

average = Math.round(sum);
console.log(average);

// check if consolidated values are in range of average value
var a = average + 500;
var b = average - 500;

for (var j = 0; j < allCustomers.length; j++) {

	var custConsolBalance = allCustomers[j].consolbalance;
	// if yes, push to seperate array (targetCustomers)
	if (a > custConsolBalance && b < custConsolBalance == true) {
		targetCustomers.push(allCustomers[j]);

	} else if (a > custConsolBalance && b < custConsolBalance == false) {
		console.log('No customers in average range');
	}
}

console.log(targetCustomers);

// finally extract email address of customers with consolidated balance in range
// of average
for (var x = 0; x < targetCustomers.length; x++) {

	console.log(targetCustomers[x].email);
}