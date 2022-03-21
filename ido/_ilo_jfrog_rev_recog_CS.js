/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Nov 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */



function rev_recog_ValidateLine(type)
{
//get values from the body
var licenseStartDate = nlapiGetFieldValue('custbody_ilo_license_start');
var licenseEndDate = nlapiGetFieldValue('custbody_ilo_license_end');

//get values from subrecord lines
var Line_licenseStartDate = nlapiGetCurrentLineItemValue('item', 'custcol_ilo_rev_recog_start_date');
var Line_licenseEndDate = nlapiGetCurrentLineItemValue('item', 'custcol_ilo_rev_recog_end_date');

if((licenseStartDate == '') && (licenseEndDate == '')) {
	alert('No license dates provided');
	return false;
}

//populate line column with values from the body
if((Line_licenseStartDate == '') && (Line_licenseEndDate == '')) {
	nlapiSetCurrentLineItemValue('item', 'custcol_ilo_rev_recog_start_date', licenseStartDate);
	nlapiSetCurrentLineItemValue('item', 'custcol_ilo_rev_recog_end_date', licenseEndDate);
}


return true;
}


