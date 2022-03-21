/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Oct 2016     idor
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


	var daysAhead;
	
	

function beforeLoad(type) {
	
	daysAhead = form.addField('custpage_custentity1', 'integer', 'days ahead');
	daysAhead.setDefaultValue(0);
	
	
	nlapiLogExecution('DEBUG', 'Ido', 'me');
	
}


function userEventBeforeSubmit(type){
	
	var record = nlapiLoadRecord('term', 5);
	var daysNum = nlapiGetFieldValue('custpage_custentity1');
	//var daysSet = nlapiSetFieldValue(daysNum);
	
	nlapiLogExecution('DEBUG', 'daysSet', daysNum);

	
	nlapiSubmitField('term', 5, 'custpage_custentity1', daysNum);
	
	nlapiSubmitRecord(record, true);
}


function afterSubmit(type) {
	
//	var record = nlapiLoadRecord('term', 5);
//	
//	 var daysNum = nlapiGetFieldValue('custpage_selectfield_day');
//	 
//	    nlapiSetFieldValue('custpage_selectfield_day', true);
//	//daysAhead.setDefaultValue('changed');
//	nlapiSubmitRecord(record);
	
}