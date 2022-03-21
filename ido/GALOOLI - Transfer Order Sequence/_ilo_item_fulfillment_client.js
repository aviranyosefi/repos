function getLastJob() {
		
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('internalid', null, 'max');

		var s = nlapiSearchRecord('customrecord_ilo_transfer_job', null, null, columns);
		if (s){
			var id = s[0].getValue(columns[0]);
			if (id){
				var fields = ['custrecord_ilo_transfer_recid', 'internalid'];
				var columns = nlapiLookupField('customrecord_ilo_transfer_job', id, fields);
				var tranid = columns.custrecord_ilo_transfer_recid;
				var recid = columns.internalid;

				var jobObj = {lastTransfer: tranid,
									recID : recid};
			};
		};
	
		
		return jobObj;
	}



function on_pageload_transfer() {
	
	var lastJob = getLastJob();
	if(lastJob != undefined) {
	
	var checkCreatedFrom = nlapiGetFieldValue('createdfrom');
	
	var checkStatus = nlapiGetFieldValue('shipstatus');
	
	if(lastJob.lastTransfer == checkCreatedFrom) {
		
		grayOut_loading();
		
		setTimeout(function(){ 

			readytoSubmitItemFulfillment();
		
		}, 700);
		
		
	}
	
	}//if(lastJob != undefined)
}


function readytoSubmitItemFulfillment() {
	
	try{
		
		getNLMultiButtonByName('multibutton_submitter').onMainButtonClick(this);
		
		
	}
	catch(err) {
		console.log(err);
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
	

