/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Mar 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function eom_csv_import(type){
	
	if(type == 'create') {
		try{
			
		  var newInvoice = nlapiLoadRecord('invoice', nlapiGetNewRecord().getId())
		
		  var eomTerms = newInvoice.getFieldText('terms');
		  nlapiLogExecution('debug', 'eomTerms', eomTerms)

			if (eomTerms.indexOf('EOM') != 0) {
				return true;
			} else {
				
				var trandate = newInvoice.getFieldValue('trandate');
				var terms = newInvoice.getFieldText('terms');

				var configRec = nlapiLoadRecord('customrecord_ilo_setup', 1);
				var dateFORMAT = configRec.getFieldValue("custrecord_ilo_default_date");
				
				var eomDate = calcEOM(trandate, terms, dateFORMAT);
				nlapiLogExecution('debug', 'eomDate', eomDate)
				
				nlapiSetFieldValue('duedate', eomDate);
				nlapiSubmitField('invoice', nlapiGetRecordId(), 'duedate', eomDate);
				
			}
		}catch(err){
		nlapiLogExecution('debug', 'err', err)	
		}
		return true;
	}
	
}

function calcEOM(trandate, terms, dateFORMAT) {
	var currDate;
	try{
		
var configRec = nlapiLoadRecord('customrecord_ilo_setup', 1)
var dateFORMAT = configRec.getFieldValue("custrecord_ilo_default_date");
	
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
			
		result = eomDate.toString("d/M/yyyy");
	
//	console.log(result)
	//return in correct format
	return result;
}	
if(dateFORMAT == '2') {
//	debugger;
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
	nlapiLogExecution('debug', 'err', err)
		return true;
	}
	
}

