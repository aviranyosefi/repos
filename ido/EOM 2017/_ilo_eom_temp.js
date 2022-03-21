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
	var eomDaystoAdd = arrayOfTerms[1];
	var eomMonthstoAdd = arrayOfTerms[0];
	
	//get last day of month
	var currEOMdate = currDate.moveToLastDayOfMonth()
	console.log('last day of month - ' + nlapiDateToString(currEOMdate))
	var eomDate = currEOMdate.addMonths(eomMonthstoAdd).addDays(eomDaystoAdd);
	console.log('eomDate - ' + nlapiDateToString(eomDate))
	var result = '';
	var currentYear = new Date().getFullYear()		
	
		result = eomDate.toString("d/M/yyyy");
		if(result.indexOf('2/3') == 0) { //if the result is 2/3 as in second of march make the EOM correct for Febuary
			result = '28/2/'+currentYear
		}
	
	console.log(result)
	//return in correct format
	return result;
}	
if(dateFORMAT == '2') {
	debugger;
	currDate = Date.parse(trandate)

	//current date to Date object
	
	//splitting EOM term to array
	var numberPattern = /\d+/g; // regex expression
	var month_days = terms.match(numberPattern);
	var arrayOfTerms = month_days.map(Number); 
	var eomDaystoAdd = arrayOfTerms[1];
	var eomMonthstoAdd = arrayOfTerms[0];
	
	//get last day of month
	var currEOMdate = currDate.moveToLastDayOfMonth();
	
	//add days and months according to EOM term
	var eomDate = currEOMdate.addMonths(eomMonthstoAdd).addDays(eomDaystoAdd);

	var result = '';
			
		result = eomDate.toString("MM/dd/yyyy");
	
	
	//return in correct format
	return result;
}
	
	}catch(err) {
		console.log(err);
		return true;
	}
	
}
