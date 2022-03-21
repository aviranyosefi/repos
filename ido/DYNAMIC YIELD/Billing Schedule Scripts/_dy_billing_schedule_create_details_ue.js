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



function createBillScheduleDetail(type, form, request) {

	
	try{

		var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId());
		var billLineCount = rec.getLineItemCount('billingschedule');
		var itemLineCount = rec.getLineItemCount('item');
		var startDate = rec.getFieldValue('startdate')
		var endDate = rec.getFieldValue('enddate')
		
		var subsid = rec.getFieldValue('subsidiary')
		var recID = nlapiGetRecordId();
		
		try{
			searchAndDeleteDetails(recID)
		}catch(err) {}
		
		
		var billSchedule = [];
		var itemArr = [];

		for (var i = 0; i < billLineCount; i++) {
			try {
				billSchedule.push({
					startdate : rec.getLineItemValue('billingschedule','billdate', i + 1),
					enddate : nlapiDateToString(Date.parseExact(rec.getLineItemValue('billingschedule','billdate', i + 2), "d/M/yyyy").addDays(-1)),
					amt : rec.getLineItemValue('billingschedule', 'billamount', i+1)
				})
			} catch (err) {
				billSchedule.push({
				startdate : rec.getLineItemValue('billingschedule','billdate', i + 1),
				enddate : rec.getFieldValue('enddate'),
				amt : rec.getLineItemValue('billingschedule', 'billamount', i+1)
			})
				nlapiLogExecution('debug', 'err', err)
				continue;
			}
		}

		nlapiLogExecution('debug', 'dates', JSON.stringify(billSchedule,null, 2))
		
		
		for(var x = 0; x<itemLineCount; x++) {
			
			itemArr.push({
				item : rec.getLineItemValue('item', 'item', x+1),
				billSchedule : getBillingSchedule(rec.getLineItemValue('item', 'billingschedule', x+1)),
				lineAmt : rec.getLineItemValue('item', 'amount', x+1),
				line : x+1,
				subsid : subsid,
				salesOrderID : recID
			})
			
		}
	//	nlapiLogExecution('debug', 'dates', JSON.stringify(itemArr,null, 2))
		
	var billDates = []		
var results = [];
		itemArr.forEach(function(element) {
			
			
			var currItem = element.item
			var currAmt = element.lineAmt
			var currLine = element.line
			var currSubsid = element.subsid
			var soRecID = element.salesOrderID
			
			var scheduleType = element.billSchedule.type
			var splitBy = parseInt(element.billSchedule.splitBy)
			
			var monthsToAdd = 0;
			if(scheduleType == 'QUARTERLY') {
				monthsToAdd = 3
			}
			if(scheduleType == 'MONTHLY') {
				monthsToAdd = 1
			}

			if(startDate == null || startDate == undefined || startDate == '') {
				startDate = rec.getFieldValue('trandate')
			}
			var firstDate = startDate
			var schedDates = [firstDate];
			var schedAmt = parseFloat(currAmt / splitBy)
			for(var i = 0; i<splitBy-1; i++) {
				
				var currdate = nlapiDateToString(Date.parseExact(firstDate, "d/M/yyyy").add({month: monthsToAdd*(i+1)}))		
					schedDates.push(currdate)
			}
			
	//		nlapiLogExecution('debug', 'schedDates', JSON.stringify(check, null, 2))
			
			
			
			if(schedDates.length > 1) {
				
				for(var y = 0; y<schedDates.length; y++) {

					try{
						
		
					var newBillDetail = nlapiCreateRecord('customrecord_dy_billschedule_detail');
					newBillDetail.setFieldValue('custrecord_dy_billschedule_item', currItem)
					newBillDetail.setFieldValue('custrecord_dy_billschedule_so', soRecID)
					newBillDetail.setFieldValue('custrecord_dy_billschedule_so_line', currLine)
					newBillDetail.setFieldValue('custrecord_dy_billschedule_startdate', schedDates[y])
					try{
						if(schedDates[y+1] != undefined) {
							
							var endD = schedDates[y+1];
							nlapiLogExecution('debug', 'endD', endD)
							
							newBillDetail.setFieldValue('custrecord_dy_billschedule_enddate', nlapiDateToString(Date.parseExact(endD, "d/M/yyyy").addDays(-1))	)
						}else{
							newBillDetail.setFieldValue('custrecord_dy_billschedule_enddate', endDate)	
						}

					}catch(err) {
						nlapiLogExecution('debug', 'err in endate', err)
					}
					newBillDetail.setFieldValue('custrecord_dy_billschedule_amt', schedAmt)
					newBillDetail.setFieldValue('custrecord_dy_billschedule_subsid', currSubsid)
					
					nlapiSubmitRecord(newBillDetail)
					
					}catch(err){
						nlapiLogExecution('error', 'error creating bill schedule detail', err)
					}
					
//					results.push({
//						currItem : currItem,
//						currAmt : currAmt,
//						currDates : schedDates[y],
//						schedAmt : schedAmt,
//						currLine : currLine,
//						currSubsid : currSubsid,
//						soRecID : soRecID,
//						enddate : endDate
//					})
					
					
					
				}
				
				
				
			}

				
		});
	
		nlapiLogExecution('debug', 'results', JSON.stringify(results, null, 2))

	
		
	}catch(err){
		nlapiLogExecution('error', 'err submitting invoice', err)
	}
}


function getBillingSchedule(billScheduleID) {
	
	var billSchedRec = nlapiLoadRecord('billingschedule', billScheduleID);
	
	var res = {
			
			type : billSchedRec.getFieldValue('frequency'),
			splitBy : billSchedRec.getFieldValue('numberremaining')
			
	};
	
	return res;
	
}



function searchAndDeleteDetails(soID) {
	
	var columns = new Array();
		columns[0] = new nlobjSearchColumn('internalid');

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_dy_billschedule_so', null, 'anyof', [soID]);

	
	var searchDetails = nlapiCreateSearch('customrecord_dy_billschedule_detail', filters, columns)

	var allResults = [];
	var results =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchDetails.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allResults.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allResults != null) {
				allResults.forEach(function(line) {
					
					results.push(line.getValue('internalid'));

				});

			};
			
			if(results != null) {
			
			for(var x = 0; x<results.length; x++) {
			
			nlapiDeleteRecord('customrecord_dy_billschedule_detail', results[x])
			
			}
			
			}		
}


