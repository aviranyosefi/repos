/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Nov 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 * 
 * 
 * 
 * 
 * 
 */


var canSaveInv = '';

//function invSequencing_PageInit(type) {

// this search returns most recent Invoice created, its tranid and its trandate
var columns = new Array();
columns[0] = new nlobjSearchColumn('internalid', null, 'max');

var s = nlapiSearchRecord('invoice', null, null, columns);
if (s){
	var id = s[0].getValue(columns[0]);
	if (id){
		var fields = ['tranid', 'trandate'];
		var columns = nlapiLookupField('invoice', id, fields);
		var tranid = columns.tranid;
		var trandate = columns.trandate;

		var objINV = {lastInv: tranid,
					trandate: trandate};
	};
};
console.log( objINV );
//}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function invSequencing_clientFieldChanged(type, name){
	var nexus_country = nlapiGetFieldValue('nexus_country');
	if (nexus_country == 'IL') {

	
	if (name == 'trandate') {
		var currInvDate = nlapiGetFieldValue('trandate');
		var date_currInvDate = nlapiStringToDate(currInvDate); 
		var date_lastInvDate = nlapiStringToDate(objINV.trandate);
		
		if((date_currInvDate >= date_lastInvDate) == true) {
			
			canSaveInv = 'yes';
		}
		else{
			alert('The selected date is not valid. An invoice with a later date exsists.\nPlease re-enter a valid transaction date for this invoice.');
			var today = new Date();
			var todayStr = nlapiDateToString(today);
			nlapiSetFieldValue ('trandate' , todayStr );
			
		}
		
		nlapiLogExecution('DEBUG', 'canSave', canSaveInv);

	};
}
	
}

function invSequencing_saveRecord() {
	var nexus_country = nlapiGetFieldValue('nexus_country');
	if (nexus_country == 'IL') {
	
	if(canSaveInv == 'no') {
		alert('The selected date is not valid. An invoice with a later date exsists.\nPlease re-enter a valid transaction date for this invoice.');
		return false;
	}
	
	return true;
	}
}



