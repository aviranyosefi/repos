/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Mar 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function vendor_taxcode_CS(){
	
	var getSubsid = nlapiGetFieldValue('subsidiary');
	var checkCountry = nlapiLookupField('subsidiary', getSubsid, 'country');
	
	if (checkCountry == 'IL') {
	
		var includeInShaam = nlapiGetFieldValue('custentity_ilo_include_in_shaam_report');
		var checkWTDefaultCode = nlapiGetFieldValue('custentity_4601_defaultwitaxcode');


	if(includeInShaam == '1' && checkWTDefaultCode == '') {
		
		alert('Please add a Default Tax Code for this Vendor.\n\rTax Information -> WT Tax Code');
		return false;
	}		
		
		
	}
	

    return true;
}
