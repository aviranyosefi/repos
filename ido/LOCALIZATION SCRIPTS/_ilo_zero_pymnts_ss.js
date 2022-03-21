/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Nov 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function updateLocalizationFields() {

	var zeroPayments = getZeroPayments();
	
	if(zeroPayments != [] || zeroPayments != null) {
		
		for(var i = 0; i<zeroPayments.length; i++) {
			
			try{
			
				var fields = new Array();
				var values = new Array();
				fields[0] = 'custbody_ilo_gross_amount';
				values[0] = '0.00';
				fields[1] = 'custbody_ilo_wht_amount';
				values[1] = '0.00';
				fields[2] = 'custbody_ilo_net_amount';
				values[2] = '0.00';
				fields[3] = 'custbody_ilo_wh_tax_percent';
				values[3] = '0.0%';
				fields[4] = 'custbody_ilo_wh_tax_percent_vendor';
				values[4] = '0.0%';
				 //update and submit payment-level form
				var updatefields = nlapiSubmitField('vendorpayment', zeroPayments[i],fields, values);
				
				
			}catch(err){
				nlapiLogExecution('error', 'err', err)
				continue;
			}

		}

	}

}

function getZeroPayments() {
	
	
	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('internalid');
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('totalamount', null, 'between', '0.00', '1.00')
	filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T')

	var s = nlapiSearchRecord('vendorpayment', null, filters, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {
		

			resultsArr.push(s[i].getValue('internalid'));
			
		}

	}

	return resultsArr;
	
	
	
	
}

