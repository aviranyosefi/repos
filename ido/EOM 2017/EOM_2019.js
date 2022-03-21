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
    var nexus_country = nlapiGetFieldValue('nexus_country');
    if (nexus_country == 'IL') {


	var entityName = nlapiGetFieldValue('entity');
	if (entityName == '') {
		return;
	}


	var getRecID = nlapiGetRecordId();

	if (getRecID == "") {

		setTimeout(function() {
			  
			nlapiSetFieldValue('trandate', nlapiGetFieldValue('trandate'));
		}, 400);

	}
	
    }//check nexus
};

function clientFieldChanged_vendorBill(type, name) {
	  var nexus_country = nlapiGetFieldValue('nexus_country');
	    if (nexus_country == 'IL') {

	if (name == 'terms') {
			trandateFieldChange();
		
	};
	

	if (name == 'trandate') {
			trandateFieldChange();
		
	};
	
	    }//check nexus
}

function trandateFieldChange() {

	  var nexus_country = nlapiGetFieldValue('nexus_country');
	    if (nexus_country == 'IL') {


	var currTerm = nlapiGetFieldText('terms');
	if (currTerm.startsWith("EOM") == false) {
		return;
	} else {
		
		var trandate = nlapiGetFieldValue('trandate')
		var terms = nlapiGetFieldText('terms');

		var dateFORMAT;
		var checkFormat = nlapiStringToDate('01/13/2018')
		if(isNaN(checkFormat) ) {
			dateFORMAT = '1';
		}else{
			dateFORMAT = '2'
		}
		
		
		var eomDate = calcEOM(trandate, terms, dateFORMAT);
		
		nlapiSetFieldValue('duedate', eomDate);
	    	
	    }


	}
	    }//check nexus






function calcEOM(trandate, terms, dateFORMAT) {
	var currDate;
	try{
		
	
if(dateFORMAT == '1') {
	currDate = Date.parseExact(trandate, "d/M/yyyy")

	//current date to Date object
	
	//splitting EOM term to array
	var numberPattern = /\d+/g; // regex expression
	var month_days = terms.match(numberPattern);
	var arrayOfTerms = month_days.map(Number); 
	var eomDaystoAdd = arrayOfTerms[0];
	//var eomMonthstoAdd = arrayOfTerms[0];
	console.log(eomDaystoAdd)


	var monthsAccordingToDays;
	var currTranDate;
	var addedMonths;
	var EOMDATE;
	var extraDays;

	currTranDate = nlapiStringToDate(trandate);

	if(dividesEqually(eomDaystoAdd, 30) == true) {
		console.log('FITS!')
		 monthsAccordingToDays = eomDaystoAdd / 30;
		console.log('monthsAccordingToDays : ' +monthsAccordingToDays)
		console.log('currTranDate : ' + currTranDate);
		
		
		if(monthsAccordingToDays >= 1) {
			 addedMonths = currTranDate.add(parseInt(monthsAccordingToDays)).months();	
			 EOMDATE = addedMonths.moveToLastDayOfMonth();
		}
		if(monthsAccordingToDays < 1) { 
			console.log('smaller than 1');
			 extraDays = eomDaystoAdd % 30
			 console.log('last day of the month +++ days to add! : ' + extraDays)
			 addedMonths = currTranDate.moveToLastDayOfMonth().addDays(extraDays);
			 EOMDATE = addedMonths
		}
		
		 
		console.log('EOMDATE - ' + EOMDATE)
		
	}
	
	if(dividesEqually(eomDaystoAdd, 30) == false) {
		
		console.log('does not fit!')
		
		
		monthsAccordingToDays = Math.floor(eomDaystoAdd / 30);
		console.log('monthsAccordingToDays : ' +monthsAccordingToDays)
		extraDays = eomDaystoAdd % 30
		currTranDate = nlapiStringToDate(trandate);
		console.log('currTranDate : ' + currTranDate);
		addedMonths = currTranDate.add(parseInt(monthsAccordingToDays)).months();
		
		console.log('addedMonths : ' + addedMonths)
		
		 EOMDATE = addedMonths.moveToLastDayOfMonth().addDays(extraDays);

		console.log('EOMDATE - ' + EOMDATE)
		
	}

	
	var EOMDATE_string = nlapiDateToString(EOMDATE)
	return EOMDATE_string;
}	
if(dateFORMAT == '2') {
	debugger;
	currDate = Date.parse(trandate)

	//current date to Date object
	
	//splitting EOM term to array
	var numberPattern = /\d+/g; // regex expression
	var month_days = terms.match(numberPattern);
	var arrayOfTerms = month_days.map(Number); 
	var eomDaystoAdd = arrayOfTerms[0];

	var monthsAccordingToDays;
	var currTranDate;
	var addedMonths;
	var EOMDATE;
	var extraDays;

	currTranDate = nlapiStringToDate(trandate);

	if(dividesEqually(eomDaystoAdd, 30) == true) {
		console.log('FITS!')
		 monthsAccordingToDays = eomDaystoAdd / 30;
		console.log('monthsAccordingToDays : ' +monthsAccordingToDays)
		console.log('currTranDate : ' + currTranDate);
		
		
		if(monthsAccordingToDays >= 1) {
			 addedMonths = currTranDate.add(parseInt(monthsAccordingToDays)).months();	
			 EOMDATE = addedMonths.moveToLastDayOfMonth();
		}
		if(monthsAccordingToDays < 1) { 
			console.log('smaller than 1');
			 extraDays = eomDaystoAdd % 30
			 console.log('last day of the month +++ days to add! : ' + extraDays)
			 addedMonths = currTranDate.moveToLastDayOfMonth().addDays(extraDays);
			 EOMDATE = addedMonths
		}
		
		 
		console.log('EOMDATE - ' + EOMDATE)
		
	}
	
	if(dividesEqually(eomDaystoAdd, 30) == false) {
		
		console.log('does not fit!')
		
		
		monthsAccordingToDays = Math.floor(eomDaystoAdd / 30);
		console.log('monthsAccordingToDays : ' +monthsAccordingToDays)
		extraDays = eomDaystoAdd % 30
		currTranDate = nlapiStringToDate(trandate);
		console.log('currTranDate : ' + currTranDate);
		addedMonths = currTranDate.add(parseInt(monthsAccordingToDays)).months();
		
		console.log('addedMonths : ' + addedMonths)
		
		 EOMDATE = addedMonths.moveToLastDayOfMonth().addDays(extraDays);

		console.log('EOMDATE - ' + EOMDATE)
		
	}
	
	
	
	var result = '';
			
		result = EOMDATE.toString("MM/dd/yyyy");
	
	
	//return in correct format
	return result;
}
	
	}catch(err) {
		console.log(err);
		return true;
	}
	
}


function dividesEqually(x, y) {
	  if (Number.isInteger(y / x)) {
	    return true;
	  }
	  return false;
	}
