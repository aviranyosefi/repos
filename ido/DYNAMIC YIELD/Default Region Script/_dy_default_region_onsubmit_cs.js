/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Mar 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function dy_default_region(){
	try{
		

	var subsid = nlapiGetFieldValue('subsidiary') // '2' == Dynamic Yield Ltd. // '5' == Dynamic Yield APAC PTE Ltd. // '6' == Dynamic Yield GmbH
	var regionField = nlapiGetFieldValue('cseg_region')
	
	if(subsid == '2' && (regionField == '' || regionField == null)) {
		nlapiSetFieldValue('cseg_region', '7', null, null)	
		return true;
	}
	if((subsid == '5' || '6') && (regionField == '' || regionField == null)) {
		alert('Please select a region for this transaction.')	
		return false;
	}
	
	if(subsid == '2' && (regionField != '' || regionField != null)) {	
		return true;
	}
	if((subsid == '5' || '6') && (regionField != '' || regionField != null)) {
		return true;
	}
	}
	catch(err) {
		console.log('err : ' + err)
		nlapiLogExecution('error', 'err', err)
		return true;
	}
  
}
