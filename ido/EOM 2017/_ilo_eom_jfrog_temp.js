/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Apr 2018     idor
 *
 */
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
	
   
};

function clientFieldChanged_vendorBill(type, name) {

	if (name == 'terms') {
			trandateFieldChange();
		
	};
	

	if (name == 'trandate') {
			trandateFieldChange();
		
	};
	
	 
}

function trandateFieldChange() {



	var currTerm = nlapiGetFieldText('terms');
	if (currTerm.startsWith("EOM") == false) {
		return;
	} else {
		
		var trandate = nlapiGetFieldValue('trandate')
		var terms = nlapiGetFieldText('terms');

		//var configRec = nlapiLoadRecord('customrecord_ilo_setup', 1)
		var dateFORMAT = '1';
		
		var eomDate = calcEOM(trandate, terms, dateFORMAT);
		
		nlapiSetFieldValue('duedate', eomDate);
	    	
	    }


	
	    }






function calcEOM(trandate, terms, dateFORMAT) {
	var currDate;
	try{
		
//var configRec = nlapiLoadRecord('customrecord_ilo_setup', 1)
var dateFORMAT = '1';
	
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
	
	//add days and months according to EOM term
	var eomDate = currEOMdate.addMonths(eomMonthstoAdd).addDays(eomDaystoAdd);

	var result = '';
	
	if(eomMonthstoAdd != '0' || 0) {
	var thisMonth = eomDate.getMonth() +1;
	console.log(thisMonth)
if(thisMonth == 5) {
eomDate.addDays(1)
}	
if(thisMonth == 3) {
eomDate.addDays(3)
}
if(thisMonth == 7) {
eomDate.addDays(1)
}
if(thisMonth == 10) {
eomDate.addDays(1)
}
if(thisMonth == 12) {
eomDate.addDays(1)
}
	}		
		result = eomDate.toString("d/M/yyyy");
	
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
