/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Jan 2019     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
var ctx = nlapiGetContext();

function scheduled_createPayments(type) {
	
	var params = ctx.getSetting('SCRIPT', 'custscript_invoices_to_transform')
	
	var arr = JSON.parse(params)
	
	nlapiLogExecution('debug', 'in scheduled script', 'true')
	nlapiLogExecution('debug', 'arr', arr)
	
	if(arr != []) {
		
		for(var i = 0; i<arr.length; i++) {
			
			nlapiLogExecution('debug', 'arr[i].invID', JSON.stringify(arr[i].invID))
				nlapiLogExecution('debug', 'arr[i].dateToUse', JSON.stringify(arr[i].dateToUse))
			try{
					
			var pymtRec = nlapiTransformRecord('invoice', parseInt(arr[i].invID), 'customerpayment', null)
			pymtRec.setFieldValue('trandate', arr[i].dateToUse);
			nlapiSubmitRecord(pymtRec)

			}catch(err){
				nlapiLogExecution('debug', 'error transforming record', err);
				continue;
				
			}

		}

	}

}
