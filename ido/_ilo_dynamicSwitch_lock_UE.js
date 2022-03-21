/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Dec 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function dynamicSwitch_lock_BeforeSubmit(type){
	
	  var currentSubsid = nlapiGetFieldValue('subsidiary');
		
		if (currentSubsid === "21") //Jfrog Subsidiary in the demo env
		{
//			var dynamic = "IL WHT Local Vendors:WHT דינאמי";
//			var field = nlapiSetFieldValue('custpage_4601_witaxcode', '5');
			
			nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custpage_4601_witaxcode', '5');
			
		}
 
}
