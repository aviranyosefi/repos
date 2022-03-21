/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Dec 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function checkToDeploy(type){
	
	try{
		

	
	var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
	
	var checkDeploy = rec.getFieldValue('custrecord_sync_il_cur');

	var exRateDetails = getexRateScriptID();

	var scriptRec = nlapiLoadRecord('scriptdeployment', exRateDetails[0])
	
	if(checkDeploy == 'T') {		
		nlapiSubmitField('scriptdeployment', exRateDetails[0], 'isdeployed', 'T')
	}else{
		nlapiSubmitField('scriptdeployment', exRateDetails[0], 'isdeployed', 'F')
	}
	
	}catch(err) {
		nlapiLogExecution('error', 'error deploying exrate script', err)
	}
}

function getexRateScriptID() {	
	
	var exRateScript = 'customdeploy_ilo_update_exrates_deploy';

		var results = [];
	    var columns = new Array();
		    columns[0] = new nlobjSearchColumn('internalid', null, null);
		var filters = new Array();
			filters[0] = new nlobjSearchFilter('scriptid', null, 'is', exRateScript.toUpperCase())
		
		    var search = nlapiSearchRecord('scriptdeployment', null, filters, columns);
		    for(var i=0; i<search.length; i++) {
		    	results.push(search[i].getValue(columns[0]));
		    }
			return results;
			}
