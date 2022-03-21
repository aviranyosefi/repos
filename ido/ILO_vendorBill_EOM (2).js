/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Oct 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord vendorbill
 * 
 * @param {String}
 *            type Sublist internal id
 * @param {String}
 *            name Field internal id
 * @param {Number}
 *            linenum Optional line item number, starts from 1
 * @returns {Void}
 */

function pageInit_vendorBill() {

	var entityName = nlapiGetFieldValue('entity');
	if (entityName == '') {
		return;
	}
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; // January is 0!
	var yyyy = today.getFullYear();

	if (dd < 10) {
		dd = '0' + dd
	}

	if (mm < 10) {
		mm = '0' + mm
	}

	today = dd + '/' + mm + '/' + yyyy;

	var getRecID = nlapiGetRecordId();

	if (getRecID == "") {

		setTimeout(function() {
			nlapiSetFieldValue('trandate', today);
		}, 400);

	}

};

function clientFieldChanged_vendorBill(type, name) {

	if (name == 'terms') {
		var termType = nlapiGetFieldText('terms');
		if (termType.startsWith("EOM") == false) {
			return;
		} else {
			trandateFieldChange();
		}
	}
	;

	if (name == 'trandate') {
		var termType = nlapiGetFieldText('terms');
		if (termType.startsWith("EOM") == false) {
			return;
		} else {
			trandateFieldChange();
		}
	}
	;

}

function trandateFieldChange() {


	var currTerm = nlapiGetFieldText('terms');
	if (currTerm.startsWith("EOM") == false) {
		return;
	} else {
		var numberPattern = /\d+/g; // regex expression
		var month_days = currTerm.match(numberPattern);
		var arrayOfTerms = month_days.map(Number); 

		// get trandate from date field
		var trandate = nlapiGetFieldValue('trandate');

		// turn trandate into an array
		var dateSplice = trandate.match(numberPattern); 
		var arrayOfDate = dateSplice.map(Number);
		var days = arrayOfDate[0] - 1; 

		// create new date object
		trandate = convertDate(trandate);

		// Add one month and subtract days from trandate to get BONM (Beginning
		// of next Month)
		trandate = nlapiAddMonths(trandate, 1); 
		trandate = nlapiAddDays(trandate, -days); 

		var monthsAhead = arrayOfTerms[0];
		var daysAhead = arrayOfTerms[1] - 1; 
		trandate = nlapiAddMonths(trandate, monthsAhead);
		trandate = nlapiAddDays(trandate, daysAhead);

		// Parse date object back into string
		var dueDate_EOM_Terms = nlapiDateToString(trandate);

		// set new calculated date in the duedate field
		var setDueDate = nlapiSetFieldValue('duedate', dueDate_EOM_Terms);
	}
}

function convertDate(odate) { // Convert to date format - from 28/04/2016 to
								// date
	console.log("argument entered in convertDate: " + odate);
	if (odate == undefined)
		return '';
	var newDate = '';
	var arr = odate.split("/");
	newDate = new Date(arr[2], arr[1] - 1, arr[0]);
	return newDate;
}
