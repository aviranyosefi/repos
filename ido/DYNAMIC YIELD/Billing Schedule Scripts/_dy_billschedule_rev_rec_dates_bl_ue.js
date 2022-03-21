/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Mar 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm}
 *            form Current form
 * @param {nlobjRequest}
 *            request Request object
 * @returns {Void}
 */



function userEventGetRecRevDates(type, form, request) {
	
	try{

	
	var invRec = nlapiLoadRecord('invoice', nlapiGetRecordId())

	var getSOId = invRec.getFieldValue('createdfrom')

	if (getSOId != null) {

		var rec = nlapiLoadRecord('salesorder', getSOId);
		var billLineCount = rec.getLineItemCount('billingschedule');
		var dates = [];

		for (var i = 0; i < billLineCount; i++) {
			try {
				dates.push({
					startdate : rec.getLineItemValue('billingschedule','billdate', i + 1),
					enddate : nlapiDateToString(Date.parseExact(rec.getLineItemValue('billingschedule','billdate', i + 2), "d/M/yyyy").addDays(-1))
				})
			} catch (err) {
				dates.push({
				startdate : rec.getLineItemValue('billingschedule','billdate', i + 1),
				enddate : rec.getFieldValue('enddate')
			})
				nlapiLogExecution('debug', 'err', err)
				continue;
			}
		}

		var billSchedule = []

		nlapiLogExecution('debug', 'dates', JSON.stringify(dates,null, 2))

		var currTrandate = Date.parseExact(nlapiGetFieldValue('trandate'),"d/M/yyyy");
		var res = [];
		for (var j = 0; j < dates.length; j++) {

			var start = Date.parseExact(dates[j].startdate, "d/M/yyyy");
			var end = Date.parseExact(dates[j].enddate, "d/M/yyyy");

			if (currTrandate.between(start, end)) {
				res.push(dates[j])
			}
		}
		nlapiLogExecution('debug', 'RES', JSON.stringify(res, null, 2))
		
		try{
			
		var lineCount = invRec.getLineItemCount('item');
		
		for( var x = 0; x<lineCount; x++) {
			
			var checkStartDate = invRec.getLineItemValue('item', 'custcol_dy_rev_rec_start_date', x+1);
			var checkEndDate = invRec.getLineItemValue('item', 'custcol_dy_rev_rec_end_date', x+1);
			
			if((checkStartDate != '' || checkStartDate != null) && (checkEndDate != '' || checkEndDate != null)) {
				
				invRec.setLineItemValue('item', 'custcol_dy_rev_rec_start_date', x+1, res[0].startdate)
				invRec.setLineItemValue('item', 'custcol_dy_rev_rec_end_date', x+1, res[0].enddate)
			}
		}
		
		nlapiSubmitRecord(invRec)
		}catch(err){
			nlapiLogExecution('error', 'err submitting invoice', err)
			//return true;
		}
	}// if (getSOId != null) {

	
	}catch(err){
		nlapiLogExecution('error', 'err submitting invoice', err)
	}
}

