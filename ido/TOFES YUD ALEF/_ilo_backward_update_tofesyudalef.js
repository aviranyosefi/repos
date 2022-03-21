function getTaxPeriods() {

var searchItems= nlapiLoadSearch(null, 'customsearch_ilo_acc_period_search');

	var allItems = [];
	var items =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchItems.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allItems.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allItems != null) {
				allItems.forEach(function(line) {
					
					items.push({
					
					internalid : line.getValue('internalid'),
					name : line.getValue('periodname')
					
					});
				
					
					
				});

			};
			
			return items;



}



function getAllItems() {

	var searchItems= nlapiLoadSearch(null, 'customsearch_ilo_ty_activities_3');

	var allItems = [];
	var items =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchItems.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allItems.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allItems != null) {
				allItems.forEach(function(line) {
					
					items.push({
					
					internalid : line.getValue('internalid')
					
					});
				
					
					
				});

			};
			
			return items;

	}
	
function backward_update(type) {
	
	var checkItems = getAllItems();
	
	var taxPeriods = getTaxPeriods();
	
		
	for(var i = 0; i<checkItems.length; i++) {
	
	try {
	
	var period;
	var periodName;
	
//	var indicator;
//	var indicator_text = '';
//	
	var rec = nlapiLoadRecord('customrecord_ncfar_deprhistory', checkItems[i].internalid);
//	
//	var getIndicator = rec.getFieldValue('custrecord_deprhisttype');
//	
//	if(getIndicator == '1') {
//	
//	indicator_text = 'COST';
//	
//	}
//	
//		if(getIndicator == '2') {
//	
//	indicator_text = 'DPRN';
//	
//	}
//	

	
	
	var getJournalID_dprn = rec.getFieldValue('custrecord_deprhistory_summjournal');
	var getJournalID_ref = rec.getFieldValue('custrecord_deprhistjournal');
	
	var j_id = getJournalID_dprn;
	
	if(getJournalID_dprn == '') {
	j_id = getJournalID_ref;
	}
	
	//var j_id_temp = getJournalID_ref

	
	var j_rec = nlapiLoadRecord('journalentry', j_id);
	
	period = j_rec.getFieldValue('postingperiod')
	
//	console.log(period);
	
	for(var x = 0; x<taxPeriods.length; x++) {
	
	if(taxPeriods[x].internalid == period) {
	
	periodName = taxPeriods[x].name
	}
	
	}

				var fields = new Array();
				var values = new Array();
				fields[0] = 'custrecord_ty_tran_acc_period';
				values[0] = periodName;
//				fields[1] = 'custrecord_ty_cost_dprn_type';
//				values[1] = indicator_text;

				var updatefields = nlapiSubmitField('customrecord_ncfar_deprhistory', checkItems[i].internalid ,fields, values);


	
	}

   

catch (e) {

	nlapiLogExecution('DEBUG', 'err', e);
continue;

}
	

}
	
	
	

}
