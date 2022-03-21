/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Jan 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function validateEndDate(){
	
	var Line_StartDate = nlapiGetCurrentLineItemValue('item','custcol_votiro_start_date');
	var Line_EndDate = nlapiGetCurrentLineItemValue('item','custcol_votiro_end_date');
	
	if(Line_StartDate != '' && Line_EndDate != '') {
		
		var start = nlapiStringToDate(Line_StartDate)
		var end = nlapiStringToDate(Line_EndDate)
		
		if(end > start) {
			return true;
		}else{
			alert('Please note! - This line\'s end date is before the line\'s start date')
		}
	}
	
 
    return true;
}


