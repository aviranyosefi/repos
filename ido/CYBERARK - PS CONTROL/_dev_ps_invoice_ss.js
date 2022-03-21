var currentContext = nlapiGetContext();

function createInvoices() {
	
	var invoiceRecs = currentContext.getSetting('SCRIPT', 'custscript_ps_recs_toinvoice');
	var dateToUse = currentContext.getSetting('SCRIPT', 'custscript_ps_date_toinvoice')
	var batchName = currentContext.getSetting('SCRIPT', 'custscript_ps_batchid_toinvoice')
		
	nlapiLogExecution('debug', 'dateToUse', dateToUse);
	nlapiLogExecution('debug', 'invoiceRecs', invoiceRecs)
	var recs = JSON.parse(invoiceRecs);	
	var recIDS = pluck(recs, 'SO_id');
	
	var allRecs = {};
	recIDS.forEach( function(rec) {
	allRecs[rec] = [];	
	})
	var recKeys = Object.keys(allRecs);
	
	
	var psTraining_item = '1770';
	var psItemsArr = getAllPSItems();
	psItemsArr.push(psTraining_item);
	
	var itemsToInvoice = pluck(recs, 'psItem');
	
	
	//this loop is to create an object with arrays combining timesheets if they are from the same sales order
	for(var i = 0; i<recs.length; i++) {
		for(var j = 0; j<recKeys.length; j++) {
		
		if(recs[i].SO_id == recKeys[j]) {
			allRecs[recKeys[j]].push(recs[i]);
		}
		}
	}


	recKeys.forEach(function(so_rec) {
		
		try{
			
		var SO_Obj = getSODetails(so_rec)
		nlapiLogExecution('debug', 'SO_Obj', JSON.stringify(SO_Obj))
			
		var invoiceID;

		var invRec = nlapiTransformRecord('salesorder', so_rec, 'invoice');
		invRec.setFieldValue('trandate', nlapiStringToDate(dateToUse))
		var lineCount = invRec.getLineItemCount('item');
		
		var currObj = allRecs[so_rec];
		nlapiLogExecution('debug', 'currObj', JSON.stringify(currObj))
		var psSheetID = [];
		var itemsFromSheet = [];
		var itemsToInvoice = pluck(currObj, 'psItem');
		var allItems = {}
		var uniqueItemsToInvoice = itemsToInvoice.filter(function(item, pos) {
		    return itemsToInvoice.indexOf(item) == pos;
		})
		
		 var initalLineCount = invRec.getLineItemCount('item');
		
		for(var x = 0; x<currObj.length; x++) {
			
			var currItem = currObj[x].psItem;

			var currLineCount = invRec.getLineItemCount('item');
		
			for (var a = initalLineCount; a >= 1; a--) {
				  
				var currLineItem = invRec.getLineItemValue('item', 'item', a);
				var currLineRemain = invRec.getLineItemValue('item', 'quantity', a);
			//	var currLineBilledUpFront = invRec.getLineItemValue('item', 'custcol_ps_billed_upfront', a);
			  
				if (itemsToInvoice.indexOf(currLineItem) > -1) {
				   nlapiLogExecution('debug', 'item is PS', 'true')
				} else {
				    //Not in the array
					nlapiLogExecution('debug', 'psItem does not exsist in array', currLineItem)
					if(currLineItem != "" || currLineItem != null) {
						try{
							invRec.removeLineItem('item', a);
						}catch(err) {
							nlapiLogExecution('debug', 'err - removing line', err);
							continue;
						}
						
					}
				
				}
							

			}			

			psSheetID.push(currObj[x].internalid);
	
		}

		
//		var newLineCount = invRec.getLineItemCount('item');
//		
//		for(var t = 0; t<newLineCount;t++) {
//		var checkBeforeLineItem= invRec.getLineItemValue('item', 'item', t+1);
//		var checkbBeforeLineQty= invRec.getLineItemValue('item', 'quantity', t+1);
//		
//		//nlapiLogExecution('debug', 'checkbBefore - line values', JSON.stringify('checkBeforeLineItem : '+ checkBeforeLineItem+ ' checkbBeforeLineQty: ' +checkbBeforeLineQty))	
//		
//		}

		for(var x = 0; x<currObj.length; x++) {
			
			var currItem = currObj[x].psItem;
			var currDuration = parseFloat(currObj[x].duration);
			var currLineCount = invRec.getLineItemCount('item');
			
			
			var currItem = currObj[x].psItem;
			itemsFromSheet.push(currItem);
			//var currServiceNum = currObj[x].servicenum
			var currDuration = parseFloat(currObj[x].duration);
			var itemsToWork = []
			if(uniqueItemsToInvoice.indexOf(currObj[x].psItem) != -1) {
				for(var m = 0; m<currObj.length; m++) {
					itemsToWork.push({
						item : currObj[m].psItem,
						qty : parseFloat(currObj[m].duration)
					})
				}
			}

			//nlapiLogExecution('debug', 'itemsToWork', JSON.stringify(itemsToWork, null, 2))
			
			var toUseArr  = itemsToWork.reduce(function (r, a) {
		        r[a.item] = r[a.item] || [];
		        r[a.item].push(a);
		        return r;
		    }, Object.create(null));
			

			var res = [];
			
			var keysToUse = Object.keys(toUseArr)
			for(var y = 0; y<keysToUse.length; y++) {
				
				var sortOut = getAllQty(toUseArr[keysToUse[y]]);
				res.push(sortOut)
			}
			var newLineCount = invRec.getLineItemCount('item');
			
			var fulfilled = 0;
			var remainder;

			for(var i = 0; i<newLineCount; i++) {
				
				for(var j = 0; j<res.length; j++) {
					
					var currLineItem = invRec.getLineItemValue('item', 'item', i+1);
					var currLineRemain = invRec.getLineItemValue('item', 'quantity', i+1);
					
				var qtyToUse = [];
					
					remainder = res[j].qty
			
							if(currLineItem == res[j].item) {
					
								if(currLineRemain > remainder && fulfilled === 0) {
									invRec.setLineItemValue('item', 'quantity', i+1, res[j].qty);
									nlapiLogExecution('debug', '----ALL FITS!!----', fulfilled)
									res[j].qty = 0;
									remainder = 0;
									continue;
								}
								if(parseFloat(currLineRemain) === parseFloat(remainder) && fulfilled === 0) {
									invRec.setLineItemValue('item', 'quantity', i+1, res[j].qty);
									nlapiLogExecution('debug', '----ALL FITS!!----', fulfilled)
									res[j].qty = 0;
									remainder = 0;
									continue;
								}
								
								nlapiLogExecution('debug', 'currLineItem currLineRemain CurrLine', currLineItem+'----'+currLineRemain+'----lineNum'+ i+1)
								nlapiLogExecution('debug', '----remainder----', remainder)
								nlapiLogExecution('debug', '----fulfilled----', fulfilled)	
								
								if(fulfilled !== 0 && parseFloat(remainder) === parseFloat(currLineRemain)) {
									
									nlapiLogExecution('debug', '----fulfilled IS NOT ZERO!!----', fulfilled)	
					          		nlapiLogExecution('debug', 'SETTING THIS VALUE FOR BIGGER THAN FULFILLED NOT ZERO ', remainder - fulfilled)
									invRec.setLineItemValue('item', 'quantity', i+1, remainder - fulfilled);
									fulfilled = fulfilled + parseFloat(currLineRemain)
									nlapiLogExecution('debug', 'fulfilled', fulfilled)
									nlapiLogExecution('debug', 'remainder', remainder)
									nlapiLogExecution('debug', 'qty remaining bigger than', remainder - fulfilled)
									continue;
								}

								
						          	if(remainder > currLineRemain && fulfilled === 0) {
						          		
						          		nlapiLogExecution('debug', 'SETTING THIS VALUE FOR BIGGER THAN ', currLineRemain)
										invRec.setLineItemValue('item', 'quantity', i+1, currLineRemain);
										remainder = remainder - currLineRemain;
										fulfilled = fulfilled + parseFloat(currLineRemain)
										nlapiLogExecution('debug', 'fulfilled', fulfilled)
										nlapiLogExecution('debug', 'remainder', remainder)
										nlapiLogExecution('debug', 'qty remaining bigger than', currLineRemain)
										continue;
										}
								
									if(remainder > currLineRemain && fulfilled !== 0) {
					          		
					          		nlapiLogExecution('debug', 'SETTING THIS VALUE FOR BIGGER THAN FULFILLED NOT ZERO ', remainder - fulfilled)
									invRec.setLineItemValue('item', 'quantity', i+1, remainder - fulfilled);
									fulfilled = fulfilled + parseFloat(currLineRemain)
									nlapiLogExecution('debug', 'fulfilled', fulfilled)
									nlapiLogExecution('debug', 'remainder', remainder)
									nlapiLogExecution('debug', 'qty remaining bigger than', remainder - fulfilled)
									continue;
									}
									
							        if(remainder < currLineRemain) {
						          		
						          		nlapiLogExecution('debug', 'SETTING THIS VALUE FOR LESS THAN ', remainder - fulfilled)
										invRec.setLineItemValue('item', 'quantity', i+1, remainder - fulfilled);
										//qty = qty - currLineRemain;
										nlapiLogExecution('debug', 'fulfilled', fulfilled)
										nlapiLogExecution('debug', 'qty remaining less than', remainder)
										}
						
									
								
							}

								
							}//loop over res

					
			}
						nlapiLogExecution('debug', 'would submit', 'would submit')
						

						//nlapiLogExecution('debug', 'batchName', batchName)
						invRec.setFieldValue('custbody_ps_billing_batch', batchName);
						
						///check for zero qty lines//
						var checkLines = invRec.getLineItemCount('item');
						for (var a = checkLines; a >= 1; a--) {
							  
							var currLineItem = invRec.getLineItemValue('item', 'item', a);
							var currLineRemain = invRec.getLineItemValue('item', 'quantity', a);

							if(currLineRemain === '0.0') {
								
								invRec.removeLineItem('item', a);
								
							}

						}
						
						///check for zero qty lines//
						invoiceID = nlapiSubmitRecord(invRec);
						nlapiLogExecution('debug', 'psSheetID', JSON.stringify(psSheetID))
							
						nlapiLogExecution('debug', 'delay', 'delay start')
						for(var delay = 0; delay<50000; delay++) {
							
							var a = a;
						}
						nlapiLogExecution('debug', 'delay', 'delay finish')
				
						

			//nlapiLogExecution('debug', 'psSheetID -arr', JSON.stringify(psSheetID))
								if(invoiceID != null) {
									

									
									nlapiLogExecution('debug', 'check psSheets', JSON.stringify(psSheetID))
							for(var t = 0; t<psSheetID.length; t++) {
	
								var fields = new Array();
								fields[0] = 'custbody_ps_invoice_number';
								fields[1] = 'custbody_ps_billing_batch';
								var values = new Array();
								values[0] = invoiceID;
								values[1] = batchName;
								
							nlapiSubmitField('customtransaction_ps_timesheet_report', psSheetID[t], fields, values);
							}
	
							nlapiLogExecution('debug', 'invoiceID', ' - ' +invoiceID+ ' would be submitted');
							var context = nlapiGetContext();
							var usageRemaining = context.getRemainingUsage();
							nlapiLogExecution('debug', 'usageRemaining', usageRemaining)
							
							try{
								updatePSInvoice_ISR(invoiceID)
							}catch(err){
								nlapiLogExecution('debug', 'error updating israeli invoice', err)
							}
				
						}
	
		}// end of loop over currObj
		


		}catch(err) {
			nlapiLogExecution('debug', 'error in billing', err);
			nlapiLogExecution('debug', 'salesOrderID', so_rec)
			var psSheetsToUpdate = getSelectedSheets(so_rec)			
			nlapiLogExecution('debug', 'PS_sheets_to_update', JSON.stringify(psSheetsToUpdate))
			for(var x = 0; x<psSheetsToUpdate.length; x++) {
				nlapiSubmitField('customtransaction_ps_timesheet_report', psSheetsToUpdate[x], 'custbody_ps_invoice_error_message', err.toString());
			}
			//if any error occurs during the foreach loop the error is caught and by using 'return' it acts as 'continue' like in a normal for loop
			return;
		}
		
	});
	
}





function pluck(array, key) {
	return array.map(function(obj) {
		return obj[key];
	});
}


function getSODetails(so_rec) {
	var res = [];
	var rec = nlapiLoadRecord('salesorder', so_rec);
	
	var lineCount = rec.getLineItemCount('item');
	
	for(var i = 0; i<lineCount; i++) {
	
		var lineFulfilled = parseFloat(rec.getLineItemValue('item', 'quantityfulfilled', i+1));
		var lineBilled = parseFloat(rec.getLineItemValue('item', 'quantitybilled', i+1));
		var lineItem = rec.getLineItemValue('item', 'item', i+1);
		
		if(lineFulfilled != null && lineBilled < lineFulfilled) {
			
			res.push({
				itemid : lineItem,
				linefulfill : lineFulfilled
			})
		}
		
		
	}
	return res;
}

function getAllPSItems() {
	
	try {
	
	var res = [];

		var res = [];
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('internalid'); 

		var filters = new Array();
		filters[0] = new nlobjSearchFilter('custitem_cbr_item_category', null, 'anyof', '8'); //Professional Services


		
		// Create the saved search
		var search = nlapiCreateSearch('item', filters, columns);
		var runSearch = search.runSearch();
		var results = runSearch.getResults(0, 1000);

		if (results != null) {

			results.forEach(function(element) {

				res.push(element.getValue('internalid'));
			});
			
		}
		
		return res;
	} catch (err) {
	return res;
	}
	
}


function add(a, b) {
    return a + b;
}


function getSelectedSheets(selected) {
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custbody_ps_order', null, 'anyof', selected)
	
    var columns = new Array();
    columns[0] = new nlobjSearchColumn( 'internalid' );
  
    var savedSearch = nlapiCreateSearch('customtransaction_ps_timesheet_report', filters, columns)
    
    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
	var results = [];
	var cols = savedSearch.getColumns();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for ( var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

	if(returnSearchResults != null) {
	returnSearchResults.forEach(function(element) {

			results.push(element.getValue('internalid'));	
		});

	}
	

var uniqueArray = results.filter(function(item, pos) {
    return results.indexOf(item) == pos;
})
	
return uniqueArray;
	
}

function getAllQty(arr) {

	var qtys = [];

	for(var i = 0; i<arr.length; i++) {
	qtys.push(arr[i].qty)
	}


	var qtyToUse = qtys.reduce(add, 0);
	var obj = {

	item : arr[0].item,
	qty : qtyToUse

	}

	return obj;

	}


function updatePSInvoice_ISR(invoiceID) {
	
	try{
	
      nlapiLogExecution('debug', 'in the script!', 'true')
		
	var rec = nlapiLoadRecord('invoice', invoiceID);
	var subsid = rec.getFieldValue('subsidiary');
	var so_rec = rec.getFieldValue('createdfrom');
      
      nlapiLogExecution('debug', 'in the ISR function!', 'subsid : '+subsid)
      nlapiLogExecution('debug', 'in the ISR function!', 'so_rec : '+so_rec)
      
	if(subsid == '22') {

      		rec.setFieldValue('customform', '180')	
		
		var ogSORec = nlapiLoadRecord('salesorder', so_rec);
		var soBillCountry = ogSORec.getFieldValue('billcountry');
		var soCurrency = ogSORec.getFieldText('currency');
		var soCustomer = ogSORec.getFieldValue('entity');
		
		var checkIfAdjust = nlapiLookupField('customer', soCustomer, 'custentity_ps_adjust_rate');
		
		if(checkIfAdjust == 'T') {
			nlapiLogExecution('debug', 'checkIfAdjust', true)
			
			var newExRate = nlapiExchangeRate(soCurrency,'USD' , dateToUse);
			rec.setFieldValue('exchangerate', newExRate)
			
			rec.setFieldValue('custbody_cbr_indexation_ind', 'T')
			
			nlapiLogExecution('debug', 'checkIfAdjust', 'exrate adjusted!');
			
			var InvoiceLine;
			var psConversionLineID = ''
			var SOLineValues = {
					salesPrice : '',
					discountPercent : '',
					discountAmount : ''
			}
			
			
			var newInvoiceLineCount = rec.getLineItemCount('item');
			for(var i = 0; i<newInvoiceLineCount; i++) {
				var isPOCfixLine = rec.getLineItemValue('item', 'custcol_ps_conv_line_type', i+1)
				if(isPOCfixLine == '3') { //Fulfillment line on new Invoice
					InvoiceLine = i+1
					psConversionLineID = rec.getLineItemValue('item', 'custcol_ps_conv_line_id', i+1)
				}
			}
			if(InvoiceLine != null || InvoiceLine != undefined) {
				var SOLineCount = ogSORec.getLineItemCount('item');
				for(var x = 0; x<SOLineCount; x++) {
					var isOriginalLine = ogSORec.getLineItemValue('item', 'custcol_ps_conv_line_type', x+1)	
					var checkPSLineID = ogSORec.getLineItemValue('item', 'custcol_ps_conv_line_id', x+1)	
					if(isOriginalLine == '1' && (psConversionLineID == checkPSLineID)) { //Original Line from SO
						
						SOLineValues.salesPrice = ogSORec.getLineItemValue('item', 'custcol_cbr_so_list_price', x+1)
						SOLineValues.discountPercent = ogSORec.getLineItemValue('item', 'custcol_cbr_so_discount_percent', x+1)
						SOLineValues.discountAmount = ogSORec.getLineItemValue('item', 'custcol_cbr_so_discount_amount', x+1)
						
					}
					
				}
				
			}
			
			nlapiLogExecution('debug', 'InvoiceLine', InvoiceLine);
			nlapiLogExecution('debug', 'SOLineValues', JSON.stringify(SOLineValues, null, 2));
			
			rec.setLineItemValue('item', 'custcol_cbr_so_list_price', InvoiceLine, SOLineValues.salesPrice)
			rec.setLineItemValue('item', 'custcol_cbr_so_discount_percent', InvoiceLine, SOLineValues.discountPercent)
			rec.setLineItemValue('item', 'custcol_cbr_so_discount_amount', InvoiceLine, SOLineValues.discountAmount)
			
			var calcExRate = parseFloat(1 / newExRate)
			
			rec.setLineItemValue('item', 'rate', InvoiceLine, parseFloat(calcExRate * SOLineValues.salesPrice).toFixed(2))
			
		
		}// if(checkIfAdjust == 'T') 	
		nlapiSubmitRecord(rec)
	}

	}catch(err) {
		nlapiLogExecution('debug', 'err', err)
	}	

}