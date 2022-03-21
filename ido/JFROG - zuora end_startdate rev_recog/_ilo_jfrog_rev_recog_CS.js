/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Nov 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Sublist internal id
 * @param {String}
 *            name Field internal id
 * @param {Number}
 *            linenum Optional line item number, starts from 1
 * @returns {Void}
 */

function rev_recog_ValidateLine(type) {
	// get values from the body
	var licenseStartDate = nlapiGetFieldValue('custbody_ilo_license_start');
	var licenseEndDate = nlapiGetFieldValue('custbody_ilo_license_end');

	// get values from subrecord lines
	var Line_licenseStartDate = nlapiGetCurrentLineItemValue('item',
			'custcolzuoraservicestartdate2');
	var Line_licenseEndDate = nlapiGetCurrentLineItemValue('item',
			'custcolzuoraserviceenddate2');

	if ((licenseStartDate == '') && (licenseEndDate == '')) {
		alert('No license dates provided');
		return false;
	}

	// populate line column with values from the body
	if ((Line_licenseStartDate == '') && (Line_licenseEndDate == '')) {

		nlapiSetCurrentLineItemValue('item', 'custcolzuoraservicestartdate2',
				licenseStartDate);
		nlapiSetCurrentLineItemValue('item', 'custcolzuoraserviceenddate2',
				licenseEndDate);
	}

	return true;
}

function rev_recog_ValidateSave() {

	var licenseStartDateonSave = nlapiGetFieldValue('custbody_ilo_license_start');
	var licenseEndDateonSave = nlapiGetFieldValue('custbody_ilo_license_end');
	var checkLicenseDate;
	var checkLicenseDateEnd;
	var lineCount = nlapiGetLineItemCount('item');

	for (var i = 0; i < lineCount; i++) {
		checkLicenseDateStart = nlapiGetLineItemValue('item',
				'custcolzuoraservicestartdate2', i + 1);
		checkLicenseDateEnd = nlapiGetLineItemValue('item',
				'custcolzuoraserviceenddate2', i + 1);

		if ((checkLicenseDateStart == '') || (checkLicenseDateEnd == '')) {
			checkLicenseDateStart = nlapiSetLineItemValue('item',
					'custcolzuoraservicestartdate2', i + 1,
					licenseStartDateonSave);
			checkLicenseDateEnd = nlapiSetLineItemValue('item',
					'custcolzuoraserviceenddate2', i + 1, licenseEndDateonSave);

		}
	}
	return true;
}
