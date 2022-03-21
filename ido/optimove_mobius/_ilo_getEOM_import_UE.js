/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Jan 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Operation types: create, edit, delete, xedit approve, reject,
 *            cancel (SO, ER, Time Bill, PO & RMA only) pack, ship (IF)
 *            markcomplete (Call, Task) reassign (Case) editforecast (Opp,
 *            Estimate)
 * @returns {Void}
 */
function updateEOM_BeforeSubmit(type) {
	var thisTerm;
	if (type == 'create') {

		var entity = nlapiGetFieldValue('entity');
		var date = nlapiGetFieldValue('trandate');

		

		var customerRec = nlapiLoadRecord('customer',entity);
		thisTerm = customerRec.getFieldText('terms');
		
		trandateFieldChange();

	}



function trandateFieldChange(){
       //get months and days from the term text value (e.g EOM + 2M + 10D = [ 2, 10] )
       var currTerm = thisTerm;
       var numberPattern = /\d+/g; // regex expression  
               var month_days = currTerm.match( numberPattern );
       var arrayOfTerms = month_days.map(Number); //returns an array of only digits from string
       //console.log(arrayOfTerms);
       
        //get trandate from date field
       trandate = date;
       //console.log('first trandate: ' + trandate);
       
        //turn trandate into an array 
        var dateSplice = trandate.match( numberPattern );  // here we turn the date into an array using the regex expression
       var arrayOfDate = dateSplice.map(Number);                    // here we splice the date into an array of integers
       //console.log(arrayOfDate);
       var days = arrayOfDate[0] -1;                                       // get current dates day number (-1 day in order to get to the beginning of next month)
       //console.log('days from terms: ' + days);
       
        
       // create new date object
       trandate = convertDate(trandate);
                               // console.log("checking " +trandate);
       
       //Add one month and subtract days from trandate to get BONM (Beginning of next Month)
       trandate = nlapiAddMonths(trandate, 1);        // add one month to current date
       trandate = nlapiAddDays(trandate, -days); // by subtracting the current days(-1) from the date we return back to the first day of the next month
       //console.log('BONM: ' + trandate);
       

       //Add months and days according to digits from the arrayOfTerms e.g. [2(months), 10(days)]
       var monthsAhead = arrayOfTerms[0];
       var daysAhead = arrayOfTerms[1] -1; // -1 day in order to bring it back to original daysAhead from terms array
       trandate = nlapiAddMonths(trandate, monthsAhead);
       trandate = nlapiAddDays(trandate, daysAhead);

       //Parse date object back into string
       var dueDate_EOM_Terms = nlapiDateToString(trandate);
       
       // console.log('EOM: ' + dueDate_EOM_Terms);
       //set new calculated date in the duedate field
       var setDueDate = dueDate_EOM_Terms;
	   
	   nlapiSetFieldValue('duedate', setDueDate);
       
}

function convertDate(odate) { // Convert to  date format - from 28/04/2016 to date
  //console.log("argument entered in convertDate: " + odate);
    if (odate == undefined)
        return '';
    var newDate = '';
    var arr = odate.split("/");
    newDate = new Date(arr[2], arr[1] - 1, arr[0]);
    return newDate;
}


}
