/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Dec 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function req_attach_PageInit(type) {

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function req_attach_SaveRecord() {

	var isNewRequisition = nlapiGetRecordId() == '';
	var estimatedTotal = nlapiGetFieldValue('estimatedtotal');
	var firstFile = document.getElementById('mediaitem_row_1');
	var firstNote = document.getElementById('usernotes_row_1');
	var secondFile = document.getElementById('mediaitem_row_2');
	var secondNote = document.getElementById('usernotes_row_2');

	if(isNewRequisition == false) {
		return true;
	}
	
	
	var counter = 0;

	if (firstFile != null) {
		counter++;
	}

	if (secondFile != null) {
		counter++;
	}

	if (firstNote != null) {
		counter++;
	}

	if (secondNote != null) {
		counter++;
	}
	console.log(counter);

	//if the estimated total is below 10000 - only one attachment is needed to save
	
	if (estimatedTotal <= 10000) {
		
		if(counter == 0) {
			alert('The PR does not have any attachments');
			return false;
		}
		if (counter >= 1) {
			return true;
		}
	} 
	
	if(estimatedTotal >= 10000) {
		
		if(counter == 0) {
			alert('The PR does not have any attachments');
			return false;
		}
		if (counter >= 1) {
			return true;
		}
	}
	
}
