/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 May 2019     idor
 *
 */

/**
 * @param {String}
 *            type Context Types: scheduled, ondemand, userinterface, aborted,
 *            skipped
 * @returns {Void}
 */
function checkVendorBills_night(type) {

	var getBills = getVendorBills();

	if (getBills != null || getBills != []) {

		for (var i = 0; i < getBills.length; i++) {

			try {
				var vendBillRec = nlapiLoadRecord('vendorbill',getBills[0].internalid)
				nlapiSubmitRecord(vendBillRec)
			} catch (err) {
				nlapiLogExecution('debug', 'err', err);
				continue;
			}
		}
	}
}

function getVendorBills() {

	var results = [];
	var toReturn = [];

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custbody_ilo_header_vat_period', null,
			'isempty')
	filters[1] = new nlobjSearchFilter('subsidiary', null, 'anyof', [ '22' ]) // ISR
																				// subsidiary
	filters[2] = new nlobjSearchFilter('mainline', null, 'is', 'T')
	filters[3] = new nlobjSearchFilter('approvalstatus', null, 'anyof', ['2']) //Approved

	var columns = new Array();
	columns[0] = new nlobjSearchColumn('internalid').setSort(true);
	columns[1] = new nlobjSearchColumn('trandate');
	columns[2] = new nlobjSearchColumn('tranid');

	var search = nlapiCreateSearch('vendorbill', filters, columns);
	var resultset = search.runSearch();
	results = resultset.getResults(0, 100); // Get only last 100 results

	if (results != []) {
		results.forEach(function(line) {

			toReturn.push({
				internalid : line.getValue('internalid'),
				trandate : line.getValue('trandate'),
				docNum : line.getValue('tranid'),

			})

		});
	}

	return toReturn;

}