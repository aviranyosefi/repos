/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Jun 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function saveRec_client(){
	
//	var date = new Date();
	var timestamp_cs = Date.now().toString();
	
	nlapiLogExecution("DEBUG", 'usereventCS - time', 'CS-BS ' + timestamp_cs);

    return true;
}
