function populatePrintFieldAfterSubmit() {
	try{
		
	var timeSheetRec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId())
	
	var timeSheetInvoiceNumber = timeSheetRec.getFieldValue('custbody_ps_invoice_number');
	
	var getRelatedTimeSheets = getTimeSheets(timeSheetInvoiceNumber);

	if(getRelatedTimeSheets != [] || getRelatedTimeSheets != null) {
		
		var invRec = nlapiLoadRecord('invoice', timeSheetInvoiceNumber )
		invRec.setFieldValue('custbody_ps_details_print', JSON.stringify(getRelatedTimeSheets));
		nlapiSubmitRecord(invRec);
	}
	
	}catch(err){
		nlapiLogExecution('debug', 'err', err)
		return true;
	}

}


function getTimeSheets(invoiceID) {

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custbody_ps_invoice_number', null, 'anyof', invoiceID)
	
    var columns = new Array();
    columns[0] = new nlobjSearchColumn( 'internalid' );
    columns[1] = new nlobjSearchColumn( 'custbody_ps_day' );
    columns[2] = new nlobjSearchColumn( 'custbody_ps_start_date' );
    columns[3] = new nlobjSearchColumn( 'custbody_ps_end_date' );
    columns[4] = new nlobjSearchColumn( 'custbody_ps_engineer' );
	columns[5] = new nlobjSearchColumn( 'custbody_ps_days_delivered' );
	columns[6] = new nlobjSearchColumn( 'custbody_location_type' );
	columns[7] = new nlobjSearchColumn( 'custbody_service_type' );

  
    var savedSearch = nlapiCreateSearch('customtransaction_ps_timesheet_report', filters, columns);


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
				
			results.push({

				internalid : element.getValue('internalid'),
				psDay : element.getValue('custbody_ps_day'),
				startDate : element.getValue('custbody_ps_start_date'),
				endDate : element.getValue('custbody_ps_end_date'),
				duration : element.getValue('custbody_ps_days_delivered'),
				engineer_text : element.getValue('custbody_ps_engineer'),
				location_type : element.getText('custbody_location_type'),
				service_type : element.getValue('custbody_service_type')
		});	

		});

	}
	
    var uniqueArray = removeDuplicates(results, "internalid");

	
	return uniqueArray;
	
}

                       function removeDuplicates(originalArray, prop) {
                            var newArray = [];
                            var lookupObject  = {};

                            for(var i in originalArray) {
                               lookupObject[originalArray[i][prop]] = originalArray[i];
                            }

                            for(i in lookupObject) {
                                newArray.push(lookupObject[i]);
                            }
                             return newArray;
                        }

