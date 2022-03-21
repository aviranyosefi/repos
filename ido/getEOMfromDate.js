/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Oct 2016     idor
 *
 */


function getEOM() {
	 var currDate = nlapiGetFieldValue('trandate');
	 var dateSplice = currDate.match( numberPattern );  // here we turn the date into an array using regex
	 var arrayOfDate = dateSplice.map(Number);			// here we splice the date into an array of integers
	 console.log(arrayOfDate);
	 var days = arrayOfDate[1];							// get current dates day number
	 var dueDateObj = new Date(currDate);				// create new date object
	 var addMonths = nlapiAddMonths(dueDateObj, 1);		// add one month to current date


	 var newDateMonths = nlapiDateToString(addMonths);	//parse date back into string
	 var newDateMonths_Days = new Date(newDateMonths);	//create another date object in order to subtract current date's day number
	 var addExtraDays = nlapiAddDays(newDateMonths_Days, -days); // by subtracting the current days from..
	 															 // ...the new date we return back to the last day of the month

	 console.log(addExtraDays);
	 
	 var EOM = nlapiDateToString(addExtraDays); 		//parse new date(EOM) back to string.
	 console.log(EOM);
		 
}