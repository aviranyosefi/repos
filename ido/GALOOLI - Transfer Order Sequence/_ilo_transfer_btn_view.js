
	    var stop;

function beforeload_btn_view(type,form) {
	
    if(type=='view') {
    	
    	nlapiLogExecution('debug', 'here at view before recieve', 'here at view before recieve')
     	if (nlapiGetContext().getExecutionContext() == 'userinterface') {
		var recID = nlapiGetRecordId();

		var rec = nlapiLoadRecord('transferorder', recID, {recordmode: 'dynamic'});
		var status = rec.getFieldValue('statusRef');
		var linecount = rec.getLineItemCount('item');
		
	
		
	    var stop = 'show btn';

		for(var i = 1; i<=linecount; i++) {
		rec.selectLineItem('item', i);
		var itemID = rec.getLineItemValue('item', 'item', i);
		var checkItem = nlapiLookupField('item', itemID, 'isserialitem');
		
		if(checkItem == 'T') {
			
			var invDetailSubrecord = rec.viewCurrentLineItemSubrecord('item', 'inventorydetail');
			
			if(invDetailSubrecord == null) {
				stop = 'dont show btn';
			}			
		}
		

		   
		}
		nlapiLogExecution('debug', 'stop_and_alert', stop)
		
		
		
		if(stop == 'show btn') {
		
			if (status == 'pendingFulfillment') {

				var btn = form.addButton('custpage_button', 'Transfer',
						'startTransfer()');
				form.setScript('customscript_ilo_transfer_btn_client');
		}
		}

		    	
		    	if (status == 'pendingReceipt') {
		    		
		    		nlapiLogExecution('debug', 'pendingReceipt', 'got to this if')
		    		
		    		var job =  getLastJob();
		    		if(job != undefined) {
		    		var jobRec = nlapiLoadRecord('customrecord_ilo_transfer_job', job.recID);
					
					var checkStage = jobRec.getFieldValue('custrecord_ilo_transfer_shipped');
					var checkNextStage = jobRec.getFieldValue('custrecord_ilo_transfer_recieved');
					
					var transferID = jobRec.getFieldValue('custrecord_ilo_transfer_recid');
					
					nlapiLogExecution('debug', 'transferID + recID', transferID+'-'+recID)
					
					if(recID == transferID) {
						var html = '<SCRIPT language="JavaScript" type="text/javascript">';
						html += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} "; html += 'bindEvent(window, "load", function(){'; html += 'function receivetransfer(){var e=nlapiGetRecordId();console.log(e);try{receive_order(e,"F")}catch(e){alert(e)}}receivetransfer();'; html += '});'; html += '</SCRIPT>';
						// push a dynamic field into the environment
						var field0 = form.addField('custpage_alertmode', 'inlinehtml', '',null,null); field0.setDefaultValue(html);
						
					}
		    		} // if(job != undefined) 
		    		
		    	}
		    	
		    	
     	}//end of userinterface if
}
    
}

function beforeSubmitCheck(type) {
	
	nlapiLogExecution('debug', 'type', type);
	
	return true;
	
}






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