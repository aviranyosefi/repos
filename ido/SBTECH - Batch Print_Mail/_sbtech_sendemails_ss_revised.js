/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Jan 2017     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function opt_sendEmails(type) {
	
	try{
		

	var context = nlapiGetContext();
	var emailJobID = context.getSetting('SCRIPT', 'custscript_ilo_ss_data_id');
	

	var jobRec = nlapiLoadRecord('customrecord_ilo_ss_jobs', emailJobID);
	var dataArray = jobRec.getFieldValue('custrecord_ilo_email_data_array');
	var data = JSON.parse(dataArray);


	var toSend = [];
	var invoiceArr = [];
	var printType = [];
	var p_type = data[0].p_T;

	for (var i = 0; i < data.length; i++) {
	  invoiceArr.push(data[i].t_ID);
	}
	nlapiLogExecution('debug', 'invoiceArr', JSON.stringify(invoiceArr))
	

	function custName(a) {
	  var withNoDigits = a.replace(/[0-9]/g, '');
	  return withNoDigits;
	}

	function invSearch(invoiceArr) {


	  //get invoices
	  var filtersInvoice = new Array();
	  filtersInvoice[0] = new nlobjSearchFilter('status', null, 'anyof', ['CustInvc:A', 'CustInvc:B']);
	  filtersInvoice[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	  filtersInvoice[2] = new nlobjSearchFilter('internalid', null, 'anyof', invoiceArr);

	  var columnsInvoice = new Array();
		columnsInvoice[0] = new nlobjSearchColumn('internalid').setSort(true);
		columnsInvoice[1] = new nlobjSearchColumn('tranid');
		columnsInvoice[2] = new nlobjSearchColumn('type');
		columnsInvoice[3] = new nlobjSearchColumn('trandate');
		columnsInvoice[4] = new nlobjSearchColumn('entity');
		columnsInvoice[5] = new nlobjSearchColumn('total');
		columnsInvoice[6] = new nlobjSearchColumn('taxtotal');
		columnsInvoice[7] = new nlobjSearchColumn('exchangerate');
		columnsInvoice[8] = new nlobjSearchColumn('entity')
		columnsInvoice[9] = new nlobjSearchColumn('custentity_2663_email_address_notif', 'customer');
		columnsInvoice[10] = new nlobjSearchColumn('custentity_sbtech_salesrep_email', 'customer');
		columnsInvoice[11] = new nlobjSearchColumn('subsidiary');
		columnsInvoice[12] = new nlobjSearchColumn('companyname', 'customer');

	  var s = nlapiSearchRecord('transaction', null, filtersInvoice, columnsInvoice);

	  if (s != null) {

	    for (var i = 0; i < s.length; i++) {
	    	
	    	var customerMails = s[i].getValue('custentity_2663_email_address_notif', 'customer').replace(/;/g , ",")

	      toSend.push({
	        inv_id: s[i].id,
	        customerName: s[i].getValue('companyname', 'customer'),
	        customerID: s[i].getValue('entity'),
	        mail: customerMails.split(","),
	        salesrep_mail : s[i].getValue('custentity_sbtech_salesrep_email', 'customer'),
	        inv_name : s[i].getValue('tranid'),
	        print_Type : p_type,
	        subsid : s[i].getValue('subsidiary'),

	      });

	    }
	  } //end of if(s != null)
	  // console.log(toSend)
	}

	invSearch(invoiceArr);
	
//	nlapiLogExecution("DEBUG", 'scriptParameter - id', data);
	var all = JSON.stringify(toSend);
	nlapiLogExecution("DEBUG", 'toSend', all);
	
	if(toSend != null) {
		
		for(var x = 0; x<toSend.length; x++) {
	
	
	if(toSend[x].print_Type != 'd') { //external only - send to customer
	
		var fromId = '';
		var company = '';
		if(toSend[x].subsid == '19' || '25') {
			fromId = '4030'; // 10031 SBTech Billing
			company = 'SBTech';
			
	}
		if(toSend[x].subsid == '31') {
			fromId = '4031'; // 10032 TG Marketing Billing
			company = 'TG Marketing';
	}
		
		var from = fromId  //Authors' Internal ID 
		var attachment = nlapiPrintRecord('TRANSACTION',toSend[x].inv_id,'PDF',null);
		var sbj = toSend[x].customerName + " new invoice " + toSend[x].inv_name + " from " +company;
		var msg = "Dear Ladies and Gentlemen,\n\r Thank you very much for using the services of "+company+". \n\r You will find attached monthly invoice.\n Could you be so kind and make your payment before the due date stated in the invoice to avoid service interruptions. \n\r With best regards,\n "+company+ " Billing Team"; 
		var attachRec = new Object();
		attachRec['entity']=toSend[x].customerID; //attach email to customer record
		attachRec['transaction']=toSend[x].inv_id; //attach email to invoice record
		//multiple email addresses
		//Recipient is a comma separated list of email addresses
		nlapiSendEmail(fromId,'ido.rozen@one1up.com', sbj, msg, null, null, attachRec, attachment);
		
		
	}
	
	
	if(toSend[x].print_Type == 'd') { //internal only
		
		var fromId = '';
		var company = '';
		if(toSend[x].subsid == '19' || '25') {
			fromId = '4030'; // 10031 SBTech Billing
			company = 'SBTech';
			
	}
		if(toSend[x].subsid == '31') {
			fromId = '4031'; // 10032 TG Marketing Billing
			company = 'TG Marketing';
	}
		
		var from = fromId  //Authors' Internal ID 
		var attachment = nlapiPrintRecord('TRANSACTION',toSend[x].inv_id,'PDF',null);
		var sbj = company +" – invoices approval";
		var msg = "Dear Business account manager,\n\r Please find attached monthly invoice for your approval. \n\r Looking forward to receiving your prompt feedback on this invoice. \n\r With best regards,\n "+company+ " Billing Team"; 
		var attachRec = new Object();
		attachRec['entity']=toSend[x].customerID; //attach email to customer record
		attachRec['transaction']=toSend[x].inv_id; //attach email to invoice record
		//multiple email addresses
		//Recipient is a comma separated list of email addresses
		nlapiSendEmail(fromId,'ido.rozen@one1up.com', sbj, msg, null, null, attachRec, attachment);
	
		
		
		
	}

		}//end of loop over toSend
		}// end of if toSend != null
	}
	catch(err){
		nlapiLogExecution('error', 'FATAL ERROR', err);
	}

}// end of script




