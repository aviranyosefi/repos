/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Apr 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function reqLink_validation(type){
	try{		
		var reqLink = nlapiGetCurrentLineItemValue('item', 'linkedorder');
		var reqName = nlapiGetCurrentLineItemText('item', 'linkedorder');
		if(reqLink != '') {
			nlapiSetCurrentLineItemValue('item', 'custcol_jfrog_req_link', reqLink);
			nlapiSetCurrentLineItemValue('item', 'custcol_jfrog_req_link_name', reqName);
		}
	
    return true;
    
	}
	catch(err) {
		console.log(err);
		return true;
	}
}
