/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Feb 2019     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function japanAmortization() {
	
	try{
		
		var journals = getAmortJEs();
		
		if(journals != []) {
			
			for(var i = 0; i<journals.length; i++) {
				
				var jeRec = nlapiLoadRecord('journalentry', journals[i].jeid);
				nlapiSubmitRecord(jeRec);
				
			}
		}

	}catch(err){
		nlapiLogExecution('error', 'err', err)
	}

}

	function getAmortJEs() {
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('lastmodifieddate', 'journal', 'after', ['hoursfromnow1', 'hoursago1'])
	filters[1] = new nlobjSearchFilter('subsidiary', 'journal', 'anyof', ['19']) //Japan Subsidiary
	var cols = new Array();
	cols[0] = new nlobjSearchColumn('internalid', 'journal')
	cols[1] = new nlobjSearchColumn('tranid', 'journal');

	var search = nlapiSearchRecord('amortizationschedule', null, filters, cols);
	var results = [];
		
	if (search != null) {
		search.forEach(function(line) {
			
			results.push({
			
			jeid : line.getValue('internalid', 'journal'),
			jedoc : line.getValue('tranid', 'journal'),
			});
		});

	};
	
	return results;
}