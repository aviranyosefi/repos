function printPSDetails(request, response){
	
	 if ( request.getMethod() == 'GET' )  {
		 
		 
		 
	 		var invoiceID = request.getParameter('invid');
	 		var invoiceRec = nlapiLoadRecord('invoice', invoiceID);
	 		var invoiceName = invoiceRec.getFieldValue('tranid');
	 		var customerID = invoiceRec.getFieldValue('entity');
	 		
	 		var invoiceSubsid = invoiceRec.getFieldValue('subsidiary');
	 		
			 var customerName = ''; 
			 var lookUpCompanyName = nlapiLookupField('customer', customerID, 'companyname');
			 if(lookUpCompanyName != '' || lookUpCompanyName != null) {
				 customerName = lookUpCompanyName
			 }
       
       		    //////////DELETE PREVIOUS ATTEMPTS//////////
			 try{ 
				 var prevFiles = getPreviousPrintAttempts(invoiceName);
				 if(prevFiles != [] || prevFiles != undefined || prevFiles != null) {
					 
					 for(var x = 0; x<prevFiles.length; x++) {
						 
						 nlapiDeleteFile(prevFiles[x].fileID);						 
					 }					 
				 }								 
			 }catch(err){ 
				 nlapiLogExecution('debug', 'err', 'no previous print attempts')
				 }
			//////////DELETE PREVIOUS ATTEMPTS//////////
			 

		    var emailForm = nlapiCreateForm('Send PS Invoice to Customer');
		 	emailForm.addSubmitButton('Send Email');
		 	
		    var invoiceDetailsHeader = emailForm.addField('custpage_invdetails_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
		    invoiceDetailsHeader.setDefaultValue("<p style='font-size:20px'>Invoice # : "+invoiceName+"<br>Customer : "+customerName+"</p><br><br>");
		    
		    var htmlHeader = emailForm.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
		    htmlHeader.setDefaultValue("<p style='font-size:20px'>Please fill in the form below in order to send this invoice to the customer. Then click 'Send'.<br>The invoice will be added as an attachment.</p><br><br>");
		 	

		    
			 var emailFieldsGroup = emailForm.addFieldGroup( 'custpage_emailfields_group', 'Email Fields');
			 var recipientGroup = emailForm.addFieldGroup( 'custpage_recipient_group', 'Recipients');
       
       				//Check if invoice has been signed already
				var docHasBeenSigned = invoiceRec.getFieldValue('custbody_cbr_comsign_doc_signed')
	
				var psPage = createPSDetailPage(invoiceRec);
			    var psDetailsPDF = downloadDataPDF(psPage, response, true,invoiceID); //print pdf
			    var currInvoice = getCurrentInvoicePDF(invoiceID);
	
			    var psDetailsURL = nlapiLoadFile(psDetailsPDF).getURL()
			    var currInvoiceURL = nlapiLoadFile(currInvoice).getURL()
			    var arrayWithUrls = [];
       
			    //If document has not been signed add invoice printout // else only create ps details
			    if(docHasBeenSigned === 'F'){
			    arrayWithUrls.push(currInvoiceURL)
			    }
			    arrayWithUrls.push(psDetailsURL)
       
			    var previewAttachement =  mergePDFandServe(arrayWithUrls, invoiceName, true)

		 	    var previewInvoiceHiddenField = emailForm.addField('custpage_preview_invid','text', 'Preview InternalID', null,'custpage_emailfields_group');
			    previewInvoiceHiddenField.setDefaultValue(parseInt(previewAttachement))
			 	previewInvoiceHiddenField.setDisplayType('hidden');
		
			    
			 //////GETTING DEFAULT EMAIL VALUES////////
			 
			 var defaultCustomerEmail = getDefaultCustomerEmail(customerID)
			 var contacts = getCustomersContacts(customerID)
			 var getEmailTemplates = getEmailTemps();
			 nlapiLogExecution('debug', 'getEmailTemplates', JSON.stringify(getEmailTemplates))
			 var getSalesReps = getAllSalesReps();
			 
			 //////GETTING DEFAULT EMAIL VALUES////////
             if (invoiceSubsid == '18' || invoiceSubsid == '23') {
                 var usSubject = ' for ' + lookUpCompanyName;
             }
             else { var usSubject = '';}
			 
			 var emailSubject = emailForm.addField('custpage_email_subject','text', 'Subject', null,'custpage_emailfields_group');
             emailSubject.setDefaultValue('CyberArk Invoice ' + invoiceName + usSubject)
				 
			
			var selectTemplate = emailForm.addField('custpage_select_template','select', 'Template', null,'custpage_emailfields_group');
			selectTemplate.setLayoutType('normal','startcol')
			 selectTemplate.addSelectOption('','');
			 for(var i = 0; i<getEmailTemplates.length; i++) {
				 selectTemplate.addSelectOption(getEmailTemplates[i].templateID,getEmailTemplates[i].templateName);
			 }
								
			
			
			var emailBody = emailForm.addField('custpage_email_body','richtext', 'Message', null,'custpage_emailfields_group');
	
			var emailAttachments = emailForm.addField('custpage_inv_attachments', 'inlinehtml', 'Attachments', null, 'custpage_emailfields_group')
			var getAttachments = getInvoiceAttachments(invoiceID);
			nlapiLogExecution('debug', 'getAttachments', JSON.stringify(getAttachments))
			var str = '<p><u>Attachments :</u></p><br>';
			var nostr = ''
			if(getAttachments[0].fileID != '') {
				for(var i = 0; i<getAttachments.length; i++) {
					str +='<a href="'+getAttachments[i].fileURL+'" target="_blank" style="color:blue">'+getAttachments[i].fileName+'</a><br>';

				}
				emailAttachments.setDefaultValue(str);
			}
			
			if(getAttachments[0].fileID == '') {
				nostr = '<p style="color: red;">NO ATTACHMENTS</p>'
				emailAttachments.setDefaultValue(str +nostr);
				
				}
				
				
				
		
			 
			var sendTo = emailForm.addField('custpage_recipient_email','text', 'Recipient', null,'custpage_recipient_group');
			 sendTo.setMandatory(true);
			// sendTo.setDefaultValue(defaultCustomerEmail);
			var sendCC = emailForm.addField('custpage_cc_email','text', 'CC', null,'custpage_recipient_group');
			var ROWSubsids = ['22', '15', '14', '17']
			if(ROWSubsids.indexOf(invoiceSubsid) != -1){
				sendCC.setDefaultValue('ROWbilling@cyberark.com')
			}
			var CCmyself = emailForm.addField('custpage_cc_myself','checkbox', 'CC Myself', null,'custpage_recipient_group')
			var sendCyberArkEmps = emailForm.addField('custpage_cbr_email','select', 'CyberArk Recipients', null,'custpage_recipient_group');
			sendCyberArkEmps.addSelectOption('','');
			 for(var i = 0; i<getSalesReps.length; i++) {
				 sendCyberArkEmps.addSelectOption(getSalesReps[i].email,getSalesReps[i].name);
			 }

//			
			
					 var subList = emailForm.addSubList('custpage_contacts_sublist', 'inlineeditor', 'Additional Recipients', 'custpage_recipient_group');
		
				
					 subList.addField('custpage_contact_name', 'text', 'Name')
					 subList.addField('custpage_contact_email', 'text', 'Email');
					 subList.addField('custpage_tosend', 'checkbox', 'Add as Recipient');
					 subList.addField('custpage_tocc', 'checkbox', 'Add as CC');
					 subList.addField('custpage_contact_role', 'text', 'Contact Role');
					 
					 if(contacts != []) {
						 for(var x = 0; x<contacts.length; x++) {
							 subList.setLineItemValue('custpage_contact_name', x+1, contacts[x].contactName);
							 subList.setLineItemValue('custpage_contact_email', x+1, contacts[x].contactEmail);
							 subList.setLineItemValue('custpage_tosend', x+1, 'F');
							 subList.setLineItemValue('custpage_tocc', x+1, 'F');
							 subList.setLineItemValue('custpage_contact_role', x+1, contacts[x].contactRole);
						 }
					 }
									

			
			/////////////////////HIDDEN FIELDS//////////////////////////////
			 var tosendEmail = emailForm.addField('custpage_sendmail', 'text', 'Next Page', null, null);
			 tosendEmail.setDisplayType('hidden');
			 tosendEmail.setDefaultValue('send mail');
			 
			 var customerIDField = emailForm.addField('custpage_customerid', 'text', 'Customer ID to next page', null, null)
		 	 customerIDField.setDisplayType('hidden');
			 customerIDField.setDefaultValue(customerID);
			 
			 var invoiceIDField = emailForm.addField('custpage_invoiceid', 'text', 'Invoice ID to next page', null, null)
		 	 invoiceIDField.setDisplayType('hidden');
			 invoiceIDField.setDefaultValue(invoiceID);
			/////////////////////HIDDEN FIELDS//////////////////////////////
			 emailForm.setScript('customscript_dev_ps_email_control_cs')
			 		 
       			 var btnText = 'Preview Invoice';
			if(docHasBeenSigned === 'T'){
				btnText = 'Preview PS Details';
			}
			 
			 emailForm.addButton('custpage_preview_invoice',btnText, 'previewInvoice();');
       
		     response.writePage(emailForm)
		 
	 }
	 
	 else if (request.getParameter('custpage_sendmail') == 'send mail') {  //email Invoice

				 var endForm = nlapiCreateForm('Email Delivered')
				 
				var sendTo = request.getParameter('custpage_recipient_email')
				var sendCC = request.getParameter('custpage_cc_email').split(',');
				 if(sendCC == '') {
					 sendCC = null
				 }
				 nlapiLogExecution('debug', 'sendCC', JSON.stringify(sendCC))
				var CCmyself = request.getParameter('custpage_cc_myself');
//				var sendBCC = request.getParameter('custpage_bcc_email');
//				if(sendBCC == "") {
//					sendBCC = null;
//				}
				//nlapiLogExecution('debug', 'sendBCC', sendBCC)
					
				var subject = request.getParameter('custpage_email_subject')
				var body = request.getParameter('custpage_email_body')

				var customerRecID = request.getParameter('custpage_customerid')
                var invoiceRecID = request.getParameter('custpage_invoiceid')
				var invoiceRecord = nlapiLoadRecord('invoice', invoiceRecID)
				var _invoice_number = invoiceRecord.getFieldValue('tranid');
				
               	//Check if invoice has been signed already
				var docHasBeenSigned = invoiceRecord.getFieldValue('custbody_cbr_comsign_doc_signed')
				
				var context = nlapiGetContext();
				var userMail = context.user;	
				
				
				var psPage = createPSDetailPage(invoiceRecord);
			    var psDetailsPDF = downloadDataPDF(psPage, response, true); //print pdf
			    var currInvoice = getCurrentInvoicePDF(invoiceRecID);
	
			     
			    var psDetailsURL = nlapiLoadFile(psDetailsPDF).getURL()
			    var currInvoiceURL = nlapiLoadFile(currInvoice).getURL()
			    
			    nlapiLogExecution('debug', 'psDetailsURL', psDetailsURL)
			    nlapiLogExecution('debug', 'currInvoiceURL', currInvoiceURL)

			     
			    var arrayWithUrls = [];
				    if(docHasBeenSigned === 'F'){
			    arrayWithUrls.push(currInvoiceURL)
			    }
			    arrayWithUrls.push(psDetailsURL)
               
			    var attachement =  mergePDFandServe(arrayWithUrls, _invoice_number, true, docHasBeenSigned)
			    var attachToSend = nlapiLoadFile(attachement)
			    
			    var emailAttachments = [];
			    emailAttachments.push(attachToSend)
			    
			    var checkForAttachments = getInvoiceAttachments(invoiceRecID);
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

			    
				var attachRec = new Object();
				attachRec['entity'] = customerRecID; //attach email to customer record
				attachRec['transaction'] = invoiceRecID; //attach email to invoice record
				
				
					 try{
				nlapiSendEmail(userMail, sendTo, subject, body, sendCC, null, attachRec, emailAttachments, true, null, userMail)
				 }catch(err) {
					 nlapiLogExecution('debug', 'err', err)
				 }
				
				
				response.writePage(endForm);
			
			 }
}


function createPSDetailPage(invoiceRecord) {
	
	 
	 var psDetails = invoiceRecord.getFieldValue('custbody_ps_details_print');


	 var _supp_comment = '';
	 var invoiceNum = invoiceRecord.getFieldValue('tranid');
	 var invoiceSubsid = invoiceRecord.getFieldValue('subsidiary');
	 if(invoiceSubsid == '18') { //USA Subsidiary
	 
	 _supp_comment = nlapiLookupField('subsidiary', invoiceSubsid, 'custrecord_ps_supplement_comment')
	 }
	 
	 var subsidRec = nlapiLoadRecord('subsidiary', invoiceSubsid);
	 var companyLogo = subsidRec.getFieldValue('pagelogo');
	 var logoUrl = nlapiLoadFile(companyLogo).getURL()
	 
	 
	 var temp = nlapiLoadFile('326897').getValue();
	 var a = temp.toString();
	 
	 var startlist = a.indexOf("--startlist--") +13
	 var head = a.substr(0, startlist -13);
	 var endlist = a.indexOf("--endlist--");
	 var list = a.substr(startlist, endlist-startlist);
	 
	 var restOfTemplate = a.substr(endlist +11, a.length);
	 
	 var dynList = '';
	 
	 var arr = JSON.parse(psDetails);
	 nlapiLogExecution('debug', 'arr', JSON.stringify(arr))
	 
	 for(var x = 0; x<arr.length; x++) {
		 
		 var line = '';
		
		 if( isOdd(x) == 0) {
			  line = '<tr class="lighterblue-bg">';
		 }
		 if(isOdd(x) == 1) {
			  line = '<tr class="white-bg">';
		 }

         line += '<td colspan="3" class="center">' + arr[x].engineer_text + '</td>';
         line += '<td colspan="3" class="center">' +  arr[x].startDate + '</td>';
         line += '<td colspan="3" class="center">' +  arr[x].endDate + '</td>';
         line += '<td colspan="2" class="center">' +  arr[x].duration + '</td>';
         line += '<td colspan="4" class="center">' +  arr[x].psDay + '</td>';
         line += '<td colspan="3" class="center">' +  arr[x].location_type + '</td>';
         line += '<td colspan="5" class="center">' + arr[x].service_type + '</td>';
         line += '<td colspan="5" class="center">' + arr[x].timecard + '</td></tr>';
	 
	 dynList += line;

}
	 
var allTemplate = head+dynList+restOfTemplate.toString();

var pattern = /_invoice_number|_supp_comment|_logo/ig;

                                          
//PS Detail Information Information
var _invoice_number = invoiceNum;

                                    
var mapObj = {
        _invoice_number : _invoice_number,
        _supp_comment : _supp_comment,
        _logo : logoUrl

                                    
};
                                    

        var str = allTemplate.replace(/\{\{(.*?)\}\}/g, function(i, match) {
            return mapObj[match];
        });
                        
                            
        //must clean all amps
    var clean = str.replaceAll("&", "&amp;");

	
	
	return clean;
}



function mergePDFandServe(arrayWithUrls, _invoice_number, asAttachment, docHasBeenSigned) {
	

  	var pdfName = 'Invoice - ';
	if(docHasBeenSigned === 'T') {
		
		pdfName = 'PS Details for Invoice - '
	}
  
  nlapiLogExecution('debug', 'in merge function - arrayWithUrls', JSON.stringify(arrayWithUrls))

	var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n"
	xml += "<pdfset>"

		arrayWithUrls.map(function (x) {
			var cleanPdfURL = nlapiEscapeXML(x);
			nlapiLogExecution('debug', 'cleanPdfURL', cleanPdfURL)

			xml += '<pdf src="https://4678143.app.netsuite.com' + cleanPdfURL + '"></pdf>'
		})
	xml += "</pdfset>"
	

	if(asAttachment == true) {	
		
	var file = nlapiXMLToPDF(xml);
	file.setEncoding('UTF-8');
	file.setName(pdfName+_invoice_number+'.pdf');
	file.setFolder(192811)
	file.setIsOnline(true)
	var FileID = nlapiSubmitFile(file)
	return FileID;
	}
}

function downloadData(data, response) {
	
	//var file = nlapiXMLToPDF(data);
	response.setEncoding('UTF-8');
	response.setContentType('PLAINTEXT', 'test.txt');
	response.write(data);
}

function getCurrentInvoicePDF(invID) {
	
	var InvoicePDF = nlapiPrintRecord('TRANSACTION', invID);
	InvoicePDF.setFolder(192811)
	InvoicePDF.setIsOnline(true)
	var FileID = nlapiSubmitFile(InvoicePDF)
	return FileID;
	
}

function downloadDataPDF(data, response, asAttachment, invoiceID) {
	
	if(asAttachment == false) {
		
		var file = nlapiXMLToPDF(data);
		response.setEncoding('UTF-8');
        response.setContentType('PDF', invoiceID+'test.pdf');
		file.setFolder(192811)
		file.setIsOnline(true)
		var FileID = nlapiSubmitFile(file)
		return FileID;		
	}

	if(asAttachment == true) {
		
		var file = nlapiXMLToPDF(data);
		file.setEncoding('UTF-8');
		file.setName(invoiceID+'test.pdf');
		file.setFolder(192811)
		file.setIsOnline(true)
		var FileID = nlapiSubmitFile(file)
		return FileID;
		
	}

}

function getDefaultCustomerEmail(customerID) {
	
	var defEmail = ''
	
	var customerRec = nlapiLoadRecord('customer', customerID);
	var defaultEmail = customerRec.getFieldValue('email');
	if(defaultEmail != null || defaultEmail != undefined || defaultEmail != '') {
		defEmail = defaultEmail
	}
	return defEmail;
}

function getCustomersContacts(customerID) {

	var results = [];
	var toReturn = [];
	var customerIDArr = [customerID]

	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'company', null, 'anyof', customerIDArr);
	filters[1] = new nlobjSearchFilter( 'custentity_ncs_contact_distrib_list', null, 'is', 'T')

	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'entityid' );
	columns[1] = new nlobjSearchColumn( 'company' );
	columns[2] = new nlobjSearchColumn( 'email' );
	columns[3] = new nlobjSearchColumn( 'contactrole' )


	var search = nlapiCreateSearch( 'contact', filters, columns );
	var resultset = search.runSearch();
	results = resultset.getResults(0, 1000);


	if(results != []) {
	results.forEach(function(line) {
		
		var checkRole = line.getText('contactrole');
		
	//if(checkRole == 'Invoice Contact') {

	toReturn.push({
	contactName : line.getValue('entityid'),
	contactEmail: line.getValue('email'),
	contactRole: line.getText('contactrole')
	})
		//}//if role == 'Invoice Contact'
	
	});
	}

	return toReturn;
	}

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
	
}

function isOdd(num) { 
	return num % 2;
	}


function getEmailTemps() {

	var results = [];
	var toReturn = [];

	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'name' );
	columns[1] = new nlobjSearchColumn( 'custrecord_template_internal_id' );

	var search = nlapiCreateSearch( 'customrecord_cbr_email_template', null, columns );
	var resultset = search.runSearch();
	results = resultset.getResults(0, 1000);


	if(results != []) {
	results.forEach(function(line) {
		

	toReturn.push({
	templateName : line.getValue('name'),
	templateID: line.getValue('custrecord_template_internal_id'),

	})

	
	});
	}

	return toReturn;
	}

function getAllSalesReps() {

	var results = [];
	var toReturn = [];


	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'altname' ).setSort();
	columns[1] = new nlobjSearchColumn( 'email' );

	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'salesrole', null, 'anyof', ["-2"])

	
	var search = nlapiCreateSearch( 'employee', filters, columns );
	var resultset = search.runSearch();
	results = resultset.getResults(0, 1000);


	if(results != []) {
	results.forEach(function(line) {
		

	toReturn.push({
	name : line.getValue('altname'),
	email: line.getValue('email'),
	})

	
	});
	}

	return toReturn;
	}
	

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
	filters[1] = new nlobjSearchFilter( 'type', null, 'anyof', ["CustInvc"])
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

function getPreviousPrintAttempts(docName) {
	
	var results = [];
	var toReturn = [];

	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'name', 'file' );
	columns[1] = new nlobjSearchColumn( 'internalid', 'file' );

	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyof', ['192811']) //PS Invoices Folder
	filters[1] = new nlobjSearchFilter( 'name', 'file', 'contains', [docName])

	
	
	var search = nlapiCreateSearch( 'folder', filters, columns );
	var resultset = search.runSearch();
	results = resultset.getResults(0, 1000);


	if(results != []) {
	results.forEach(function(line) {
		
	toReturn.push({
	fileName: line.getValue('name', 'file'),
	fileID: line.getValue('internalid', 'file'),

	})

	
	});
	}

	return toReturn;
	
}