/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Oct 2017     idor
 *
 */

function startTransfer() {
	
	grayOut_loading();
	
	var recID = nlapiGetRecordId();
	
	var rec = nlapiLoadRecord('transferorder', recID);
	var status = rec.getFieldValue('statusRef');
	
	
	
	if(status == 'pendingFulfillment') {
		
	var job = nlapiCreateRecord('customrecord_ilo_transfer_job');
	job.setFieldValue('custrecord_ilo_transfer_recid', recID);
	job.setFieldValue('custrecord_ilo_transfer_created', 'T');
	nlapiSubmitRecord(job);
	
	}
	
	try{
		
		process_ord(recID,'itemship','', 'F', null); 
		
	}
	catch(err) {
		alert(err);

	}

}


function grayOut_loading() {

	try{
	var bodyDiv = document.getElementById('div__body')
	bodyDiv.style.opacity = '0.4';


	}
	catch(err) {
	console.log(err);
	}
	}