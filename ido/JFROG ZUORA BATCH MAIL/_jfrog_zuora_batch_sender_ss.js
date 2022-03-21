	
	
function firstMailBatch_ss(type) {
	
	runTwice();
//	runTwice();
//	runTwice();
	

}

	function runTwice() {
			
	var context = nlapiGetContext();
	var emailJobID = context.getSetting('SCRIPT', 'custscript_jfrog_ss_data_id');
	

	var jobRec = nlapiLoadRecord('customrecord_jfrog_zuora_batch_job', emailJobID);
	
	var emailArray = jobRec.getFieldValue('custrecord_jfrog_zuo_email_data_array');
	var toremoveArray = jobRec.getFieldValue('custrecord_jfrog_zuo_remove_data_array');
	
	if(toremoveArray != '[]') {
		
		var obj = JSON.parse(toremoveArray);
		
		for(var i = 0; i<obj.length; i++) {
			
			nlapiSubmitField('invoice', obj[i].rec_id, 'custbody_ilo_marked_as_sent', 'T');
		}
	}
	
	if(emailArray != '[]') {
		
		var emailObj = JSON.parse(emailArray);
		
		//looping over invoices and sending
		
		nlapiLogExecution('DEBUG', 'emailObj.length', emailObj.length)
		
		for(var i = 0; i<emailObj.length; i++) {
			
			try{
						
			if(emailObj[i].subsid == 'JFrog LTD') {
				
				var checkItemsLicense = [];
				
				var attachment;
				var contactFirstName;
				var emailArr = [];
				
				var ltdRec = nlapiLoadRecord('invoice', emailObj[i].rec_id);
				var customerID = ltdRec.getFieldValue('entity');
				var thisInvoice = emailObj[i].rec_id;
				var thisInvoiceName = ltdRec.getFieldValue('tranid');
				var sendToName = ltdRec.getFieldValue('email')
				var emailToSend = ltdRec.getFieldValue('email')
				sendToName = sendToName.substr(0, sendToName.indexOf('@'))
				var checkIfSent = ltdRec.getFieldValue('custbody_ilo_invmail_yes_no_mailed');		
								
				var status = ltdRec.getFieldValue('status')
				
			    var emailAttachments = [];
			    var checkForAttachments = getInvoiceAttachments(thisInvoice);
			    if(checkForAttachments != null || checkForAttachments != undefined || checkForAttachments != []) {
			    	
			    	for(var i = 0; i<checkForAttachments.length; i++) {
			    		try{
                        var attachRecID = checkForAttachments[i].fileID
				    	var attachFileObj = nlapiLoadFile(attachRecID)
				    	
				    	emailAttachments.push(attachFileObj)
                          
                        }catch(err){
                          continue;
                        }
			    	}

			    }
								
				if(checkIfSent != '1') { //check to see if sent already
				
				var fromId = 18767; //AR JFrog LTD Internal ID
				attachment = nlapiPrintRecord('TRANSACTION',thisInvoice,'PDF',null);
				emailAttachments.push(attachment)


				try{
					
					if( status == 'Paid In Full') {
						
						var sbj = 'JFrog Tax Invoice #'+thisInvoiceName;
						var msg = 'Dear '+sendToName+',<br><br> \n\rPlease see the attached tax invoice #'+thisInvoiceName+'for your record; your credit card was charged successfully.<br>Let us know if any further assistance is needed.<br><br>Best Regards,<br>JFrog AR Team';
						var attachRec = new Object(); 
						attachRec['entity']=customerID; //attach email to customer record
						attachRec['transaction']=thisInvoice; //attach email to invoice record
						//multiple email addresses
						//Recipient is a comma separated list of email addresses
												
						nlapiLogExecution('DEBUG', 'LTD - TRAN ID - SENT', thisInvoiceName);
							
						nlapiSendEmail(fromId,emailToSend, sbj, msg, ['ar.il@jfrog.com'], null, attachRec, emailAttachments);
										
						nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_yes_no_mailed', '1');
						
					}
					if( status == 'Open') {
						var sbj = 'JFrog Tax Open Invoice #'+thisInvoiceName;
						var msg = 'Dear '+sendToName+',<br><br> \n\rPlease see the attached tax invoice #'+thisInvoiceName+' for your record; which wasn’t charged successfully.<br>An email with instructions on how to update the billing details will be sent to you soon. Kindly follow them in order to update the credit card in the system.<br>Let us know if you have any further questions.<br><br>Best Regards,<br>JFrog AR Team';
						var attachRec = new Object(); 
						attachRec['entity']=customerID; //attach email to customer record
						attachRec['transaction']=thisInvoice; //attach email to invoice record
						//multiple email addresses
						//Recipient is a comma separated list of email addresses
						
						
						nlapiLogExecution('DEBUG', 'LTD - TRAN ID - SENT', thisInvoiceName);
							
						nlapiSendEmail(fromId,emailToSend, sbj, msg, ['ar.il@jfrog.com'], null, attachRec, emailAttachments);
										
						nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_yes_no_mailed', '1');
						
	
					}
					
								
				}catch(err){
					
					nlapiLogExecution('debug', 'err', err)
				}
				
				}//end of check if sent
			}//end of Jfrog LTD block
			
			}
			catch(err){
				
				nlapiLogExecution('DEBUG', 'try-catch-error', err)
			}
			
			
		}// end of loop over all emails to be sent
		
		
	}
	
	}// endof runTwice
	
	
	
	function getInvoiceAttachments(invID) {

		var results = [];
		var toReturn = [];


		var columns = new Array();
		columns[0] = new nlobjSearchColumn( 'tranid' );
		columns[1] = new nlobjSearchColumn( 'name', 'file' );
		columns[2] = new nlobjSearchColumn( 'internalid', 'file' );
		columns[3] = new nlobjSearchColumn( 'url', 'file' );
		
		var filters = new Array();
		filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyof', invID)
		filters[1] = new nlobjSearchFilter( 'type', null, 'anyof',  ['CustInvc','CustCred'])
		filters[2] = new nlobjSearchFilter( 'mainline', null, 'is', 'T')
		
		
		var search = nlapiCreateSearch( 'transaction', filters, columns );
		var resultset = search.runSearch();
		results = resultset.getResults(0, 1000);


		if(results != []) {
		results.forEach(function(line) {
			
		toReturn.push({
		fileName: line.getValue('name', 'file'),
		fileID: line.getValue('internalid', 'file'),
		fileURL : line.getValue('url', 'file')
		})

		
		});
		}

		return toReturn;
		}