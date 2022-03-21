/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Jul 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function populate_il_vend_bank_beforeSubmit() {

	try {

		var nexus_country = nlapiGetFieldValue('nexus_country');
		if (nexus_country == 'IL') {

			var vendor = nlapiGetFieldValue('entity');

			var bankDetails = getBankDetails(vendor);

			nlapiSetFieldValue('custbody_ilo_vend_bank_detail',
					bankDetails[0].bankDetail, null, null)
			nlapiSetFieldValue('custbody_ilo_vend_bank_from',
					bankDetails[0].bankFrom, null, null)
			nlapiSetFieldValue('custbody_ilo_vend_bank_to',
					bankDetails[0].bankTo, null, null)
			nlapiSetFieldValue('custbody_ilo_vend_bank_number',
					bankDetails[0].bankAccNumber, null, null)
			nlapiSetFieldValue('custbody_ilo_vend_bank_name',
					bankDetails[0].bankAccName, null, null)

		} // 	if(nexus_country == 'IL') {

	} catch (err) {
		nlapiLogExecution('debug', 'err', err)
		return true;
	}

	return true;
}

function getBankDetails(vendor) {

	var results = [];
	var toReturn = [];

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('internalid', null, 'is', [ vendor ]);

	var columns = new Array();
	columns[0] = new nlobjSearchColumn('custrecord_ilo_vendor_bank_bank',
			'CUSTRECORD_ILO_VENDOR_BANK_VENDOR');
	columns[1] = new nlobjSearchColumn('custrecord_ilo_bank_details_account',
			'CUSTRECORD_ILO_VENDOR_BANK_VENDOR');
	columns[2] = new nlobjSearchColumn('custrecord_ilo_bank_account_name',
			'CUSTRECORD_ILO_VENDOR_BANK_VENDOR');
	columns[3] = new nlobjSearchColumn('custrecord_ilo_vendor_bank_from',
			'CUSTRECORD_ILO_VENDOR_BANK_VENDOR');
	columns[4] = new nlobjSearchColumn('custrecord_ilo_vendor_bank_to',
			'CUSTRECORD_ILO_VENDOR_BANK_VENDOR');
	columns[5] = new nlobjSearchColumn('internalid',
			'CUSTRECORD_ILO_VENDOR_BANK_VENDOR').setSort(true);

	var search = nlapiCreateSearch('vendor', filters, columns);
	var resultset = search.runSearch();
	results = resultset.getResults(0, 1000);
	try {
		if (results != []) {

			results.forEach(function(line) {

				toReturn.push({
					bankDetail : line.getValue(
							'custrecord_ilo_vendor_bank_bank',
							'CUSTRECORD_ILO_VENDOR_BANK_VENDOR'),
					bankAccNumber : line.getValue(
							'custrecord_ilo_bank_details_account',
							'CUSTRECORD_ILO_VENDOR_BANK_VENDOR'),
					bankAccName : line.getValue(
							'custrecord_ilo_bank_account_name',
							'CUSTRECORD_ILO_VENDOR_BANK_VENDOR'),
					bankFrom : line.getValue('custrecord_ilo_vendor_bank_from',
							'CUSTRECORD_ILO_VENDOR_BANK_VENDOR'),
					bankTo : line.getValue('custrecord_ilo_vendor_bank_to',
							'CUSTRECORD_ILO_VENDOR_BANK_VENDOR'),
				})
			});
		}
	} catch (err) {
		return toReturn
	}
	return toReturn;
}

