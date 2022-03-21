/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 May 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function vot_validateLine(type){

	var recType = nlapiGetRecordType();
	
	if(recType == 'vendorbill') {
		
	var department = nlapiGetCurrentLineItemValue('expense', 'department');
	console.log('validating line..');
	
   if(department == '' || null || undefined) { // if department field is blank
		alert('Please select a department for this line.');
		return false;
   }
 
	console.log('validated.');
    return true;
    
	}// if vendorbill
	
	if(recType == 'vendorcredit') {
		
			var department = nlapiGetCurrentLineItemValue('expense', 'department');
			console.log('validating line..');
			
		   if(department == '' || null || undefined) { // if department field is blank
				alert('Please select a department for this line.');
				return false;
		   }
		 
			console.log('validated.');
		    return true;
		} //if vendorcredit
	
	return true;

}
