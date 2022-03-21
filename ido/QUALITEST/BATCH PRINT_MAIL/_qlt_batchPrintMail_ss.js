/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Dec 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
var ctx = nlapiGetContext();

function scheduled(type) {

	var arr = ctx.getSetting('SCRIPT', 'custscript_qlt_jobstorun')
	var printPref = ctx.getSetting('SCRIPT', 'custscript_qlt_printpreference')
	var emailSender = ctx.getSetting('SCRIPT', 'custscript_qlt_emailsender')
	var emailReciever = ctx.getSetting('SCRIPT', 'custscript_qlt_emailreciver')
	var printOrMail = ctx.getSetting('SCRIPT', 'custscript_qlt_printormail')

	if(printOrMail == 'Mail') {
		
		nlapiLogExecution('debug', 'isMail', 'true')
		nlapiLogExecution('debug', 'printPref', printPref)
		nlapiLogExecution('debug', 'arr', arr)
		
		var getSelection = invSearch(JSON.parse(arr));

		nlapiLogExecution('debug', 'getSelection', JSON.stringify(getSelection, null, 2))
		
		for(var x = 0; x<getSelection.length; x++) {
			
			try{
				
				var customerMails = getSelection[x].customerMail
				var strArr = customerMails.split(';')
				var cleanMail = [];
				for(var i = 0; i<strArr.length; i++) {
				cleanMail.push(strArr[i].trim())
				}
				var emailStr = cleanMail.join()
				
				var fromId = emailSender; //Authors' Internal ID
				var sendTo = emailStr;
				var cc = null;
				var attachment = nlapiPrintRecord('TRANSACTION',getSelection[x].inv_id,'PDF',null);
				var sbj = 'You have a new Invoice from Qualitest - ' + getSelection[x].inv_name;
				var msg = "Dear "+getSelection[x].customerName+", \n\rPlease find attached your invoice. \n\rIf you would kindly note the invoice number on the wire transfer, it would be much appreciated. \n\rPlease note that, per our agreement, all money transfer fees are to be borne by the customer, ensuring that our bank receives the net invoice amount. \n\rPlease don’t hesitate to contact me if you have any questions. \n\rThank you for your business.";
				var attachRec = new Object();
				attachRec['entity']=getSelection[x].customerID; //attach email to customer record
				attachRec['transaction']=getSelection[x].inv_id; //attach email to invoice record
				//multiple email addresses
				//Recipient is a comma separated list of email addresses
				nlapiSendEmail(fromId,sendTo,sbj, msg, cc, null, attachRec, attachment);

			}catch(err) {
				nlapiLogExecution('error', 'error sending mail', err);
				continue
			}

		}

		
	}
	
	if(printOrMail == 'Print') {
		
	var invoicesToPrint = JSON.parse(arr);
	
	nlapiLogExecution('debug', 'printPref', printPref)
	nlapiLogExecution('debug', 'arr', arr)

	var filesCreated = [];

	for (var x = 0; x < invoicesToPrint.length; x++) {
		try{
			

		var currentInv = getCurrentInvoicePDF(invoicesToPrint[x], printPref)


		var getUrl = nlapiLoadFile(currentInv).getURL()
		filesCreated.push(getUrl)
		
		var usageRemaingPerInvoice = ctx.getRemainingUsage();
		nlapiLogExecution('debug', 'usageRemaingPerInvoice', usageRemaingPerInvoice)
		}catch(err) {
			nlapiLogExecution('error', 'err in print', err)
			continue;
		}
	}

	var today = new Date();
	var todayStr = nlapiDateToString(today);

	var sender = emailSender;
	var recipient = emailReciever;
	var sendCC = null;
	var subject = 'Batch Print PDF - ' + todayStr
	var body = 'Please see attached your pdf file.'

	var printAttachment = mergePDFandServe(filesCreated)
	
	var pdfToSend = nlapiLoadFile(printAttachment)
	pdfToSend.setName('Batch Print PDF - ' + todayStr)

	nlapiSendEmail(sender, recipient, subject, body, sendCC, null, null,pdfToSend, true, null, null)

			var usageRemaingAfterSENDMAIL = ctx.getRemainingUsage();
		nlapiLogExecution('debug', 'usageRemaingAfterSENDMAIL', usageRemaingAfterSENDMAIL)
		
		//40api point per invoice - Draft/Copy
		//60api point per invoice - Original
		
		//30api for merge to single file
		//30api to send email with attachment
		
		//Printing 110invoices (Original) takes approx 15min* from clicking execute until email with attachment is received.
		//*Anything less than 100 will take less time.

}//end of 'Print'

}

function getCurrentInvoicePDF(invID, printPref) {
	
	if(printPref == 'Original') {
		nlapiSubmitField('invoice', invID, 'custbodycustbody_ilo_print_draft', 'F')
		}

	var InvoicePDF = nlapiPrintRecord('TRANSACTION', invID);
	InvoicePDF.setFolder(1203)
	InvoicePDF.setIsOnline(true)
	var FileID = nlapiSubmitFile(InvoicePDF)
		if(printPref == 'Original') {
		nlapiSubmitField('invoice', invID, 'custbody_ilo_org_printed', 'T')
		}
	
	return FileID;

}

function mergePDFandServe(arrayWithUrls) {

	var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n"
	xml += "<pdfset>"


	arrayWithUrls.map(function(x) {
		var cleanPdfURL = nlapiEscapeXML(x);

		xml += '<pdf src="https://system.netsuite.com' + cleanPdfURL
				+ '"></pdf>'
	})
	xml += "</pdfset>"

	var file = nlapiXMLToPDF(xml);
	file.setEncoding('UTF-8');
	file.setFolder(1203)
	file.setIsOnline(true)
	var FileID = nlapiSubmitFile(file)
	
			var usageRemaingMakePDF = ctx.getRemainingUsage();
		nlapiLogExecution('debug', 'usageRemaingMakePDF', usageRemaingMakePDF)
	
	
	return FileID;
}


function invSearch(arr) {

	var res = [];

	  //get invoices
	  var filtersInvoice = new Array();
	  filtersInvoice[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	  filtersInvoice[1] = new nlobjSearchFilter('internalid', null, 'anyof', arr);

	  var columnsInvoice = new Array();
	  columnsInvoice[0] = new nlobjSearchColumn('internalid').setSort(true);
	  columnsInvoice[1] = new nlobjSearchColumn('custentity_2663_email_address_notif', 'customer');
	  columnsInvoice[2] = new nlobjSearchColumn('tranid');
	  columnsInvoice[3] = new nlobjSearchColumn('internalid', 'customer');
	  columnsInvoice[4] = new nlobjSearchColumn('companyname', 'customer');

	  var s = nlapiSearchRecord('invoice', null, filtersInvoice, columnsInvoice);

	  if (s != null) {

	    for (var i = 0; i < s.length; i++) {


	    	res.push({
	        inv_id: s[i].getValue('internalid'),
	        customerMail: s[i].getValue('custentity_2663_email_address_notif', 'customer'),
	        inv_name : s[i].getValue('tranid'),
	        customerID : s[i].getValue('internalid', 'customer'),
	        customerName : s[i].getValue('companyname', 'customer'),


	      });


	  } //end of if(s != null)
	  
	}
	  return res;
}
