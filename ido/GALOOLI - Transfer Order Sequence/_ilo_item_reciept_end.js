	var checkCreatedFrom = '';
function item_reciept_onload(type, form, request){
	
	 checkCreatedFrom = nlapiGetFieldValue('createdfrom');
	
//	if(checkCreatedFrom != ""){
	
	if (type == 'create' && checkCreatedFrom != "") {
		
		nlapiLogExecution('debug', 'just clicked recive', 'just clicked recive')
		nlapiLogExecution('debug', 'type', type);
		nlapiLogExecution('debug', 'checkCreatedFrom', checkCreatedFrom)
			
		var lastTransfer = getLastTransfer();
		
		var job = getLastJob();
		
//		nlapiLogExecution('debug', 'lets check this', JSON.stringify(lastTransfer.recID) + ' ' + checkCreatedFrom + ' ' + JSON.stringify(job.recID))
		
		if(lastTransfer != undefined) {
		
		if((lastTransfer.recID == checkCreatedFrom) && (job.lastTransfer == checkCreatedFrom)) {
			
		
		    nlapiSubmitField('customrecord_ilo_transfer_job', job.recID, 'custrecord_ilo_transfer_recieved', 'T');
		    
			
			//nlapiSubmitRecord();
			var html = '<SCRIPT language="JavaScript" type="text/javascript">';
			html += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} "; html += 'bindEvent(window, "load", function(){'; html += 'function grayOut_loading_hijack_save(){try{document.getElementById("div__body").style.opacity="0.4",document.getElementById("submitter").click()}catch(t){console.log(t)}}grayOut_loading_hijack_save();'; html += '});'; html += '</SCRIPT>';
			// push a dynamic field into the environment
			var field0 = form.addField('custpage_alertmode', 'inlinehtml', '',null,null); field0.setDefaultValue(html);
			
		}
		}//if(lastTransfer != undefined)
	}
	
	//}
}


function item_reciept_afterSubmit(type){
	


			if (type == 'create') {

		var checkCreatedFrom = nlapiGetFieldValue('createdfrom');
		var job = getLastJob();
		
		if(job != undefined) {
			
		
		var jobRec = nlapiLoadRecord('customrecord_ilo_transfer_job', job.recID);
		var transferID = jobRec.getFieldValue('custrecord_ilo_transfer_recid')

		if (checkCreatedFrom == transferID) {

			jobRec.setFieldValue('custrecord_ilo_transfer_complete', 'T');
		    nlapiSubmitField('customrecord_ilo_transfer_job', job.recID, 'custrecord_ilo_transfer_complete', 'T');

			nlapiSetRedirectURL('RECORD', 'transferorder', transferID, false);

		}
		}
	}
}







function getLastTransfer() {
		
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('internalid', null, 'max');

		var s = nlapiSearchRecord('transferorder', null, null, columns);
		if (s){
			var id = s[0].getValue(columns[0]);
			if (id){
				var fields = ['tranid', 'trandate', 'internalid'];
				var columns = nlapiLookupField('transferorder', id, fields);
				var tranid = columns.tranid;
				var trandate = columns.trandate;
				var recid = columns.internalid;

				var transferObj = {lastTransfer: tranid,
									trandate: trandate,
									recID : recid};
			};
		};
	
		
		return transferObj;
	}


function getLastJob() {
		
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('internalid', null, 'max');

		var s = nlapiSearchRecord('customrecord_ilo_transfer_job', null, null, columns);
		if (s){
			var id = s[0].getValue(columns[0]);
			if (id){
				var fields = ['custrecord_ilo_transfer_recid', 'internalid', 'custrecord_ilo_transfer_created', 'custrecord_ilo_transfer_shipped'];
				var columns = nlapiLookupField('customrecord_ilo_transfer_job', id, fields);
				var tranid = columns.custrecord_ilo_transfer_recid;
				var recid = columns.internalid;
				var created = columns.custrecord_ilo_transfer_created;
				var shipped = columns.custrecord_ilo_transfer_shipped;

				var jobObj = {lastTransfer: tranid,
									recID : recid,
									created : created,
									shipped : shipped};
			};
		};
	
		
		return jobObj;
	}

var job = getLastJob();