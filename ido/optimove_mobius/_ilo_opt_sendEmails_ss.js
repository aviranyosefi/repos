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
	
	var context = nlapiGetContext();
	var emailJobID = context.getSetting('SCRIPT', 'custscript_ilo_ss_data_id');
	

	var jobRec = nlapiLoadRecord('customrecord_ilo_ss_jobs', emailJobID);
	var dataArray = jobRec.getFieldValue('custrecord_ilo_email_data_array');
	var data = JSON.parse(dataArray);


	var toSend = [];
	var invoiceArr = [];
	var printType = [];
	var p_type;

	for (var i = 0; i < data.length; i++) {
	  invoiceArr.push(data[i].t_ID);
	}
	
	for (var j = 0; j < data.length; j++) {
		printType.push({
			printType : data[j].p_T,
			invoiceID : data[j].t_ID
			});
		
	}

	function custName(a) {
	  var withNoDigits = a.replace(/[0-9]/g, '');
	  return withNoDigits;
	}

	function invSearch(inp_fromDate, inp_toDate, batchNumber) {

	  //get contact emails
	  var currContactEmail = [];
	  var cols = new Array();
	  cols[0] = new nlobjSearchColumn('email');
	  cols[1] = new nlobjSearchColumn('company');
	  var emailRes = nlapiSearchRecord('contact', null, null, cols);

	  //get invoices
	  var filtersInvoice = new Array();
	  filtersInvoice[0] = new nlobjSearchFilter('status', null, 'anyof', ['CustInvc:A', 'CustInvc:B']);
	  filtersInvoice[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	  filtersInvoice[2] = new nlobjSearchFilter('internalid', null, 'anyof', invoiceArr);

	  var columnsInvoice = new Array();
	  columnsInvoice[0] = new nlobjSearchColumn('internalid').setSort(true);
	  columnsInvoice[1] = new nlobjSearchColumn('entity');
	  columnsInvoice[2] = new nlobjSearchColumn('tranid');

	  var s = nlapiSearchRecord('transaction', null, filtersInvoice, columnsInvoice);

	  if (s != null) {

	    for (var i = 0; i < s.length; i++) {

	      currContactEmail = [];

	      if (emailRes != null) {

	        for (var j = 0; j < emailRes.length; j++) {
	          if (emailRes[j].getText('company') == s[i].getText('entity')) {
	            currContactEmail.push(emailRes[j].getValue('email'));
	          }
	        }
	      }
	      
	      for(var n = 0; n<printType.length; n++) {
	    	  if(printType[n].invoiceID == s[i].id ) {
	    		  p_type = printType[n].printType;
	    	  }
	      }
	      

	      toSend.push({
	        inv_id: s[i].id,
	        customerName: custName(s[i].getText('entity')),
	        customerID: s[i].getValue('entity'),
	        mail: currContactEmail.join(),
	        inv_name : s[i].getValue('tranid'),
	        print_Type : p_type

	      });

	    }
	  } //end of if(s != null)
	  // console.log(toSend)
	}

	invSearch();
	
	nlapiLogExecution("DEBUG", 'scriptParameter - id', data);
	var all = JSON.stringify(toSend);
	nlapiLogExecution("DEBUG", 'toSend', all);
	
	if(toSend != null) {
		
		for(var x = 0; x<toSend.length; x++) {
	
	  if(toSend[x].print_Type == 'a') {
		  nlapiSubmitField('invoice', toSend[x].inv_id,'custbodycustbody_ilo_print_draft', 'T');
		 
	  }
	  if(toSend[x].print_Type == 'c'){
		  nlapiSubmitField('invoice', toSend[x].inv_id,'custbodycustbody_ilo_print_draft', 'F');			  
	  }
			
			var fromId = 2535; //Authors' Internal ID - billing@optimove.com
			var cc = ['AR@optimove.com', 'billing@optimove.com'];
			var attachment = nlapiPrintRecord('TRANSACTION',toSend[x].inv_id,'PDF',null);
			var sbj = 'You have a new Invoice from Optimove - ' + toSend[x].inv_name;
			var msg = '<b><u>Dear '+toSend[x].customerName+',</u></b><br><br> <span style="background-color:yellow;">*Please note that our banking details have been changed, as shown on the attached invoice.</span><br><br>If you would kindly note the invoice number on the wire transfer, it would be much appreciated.<br><br>Please note that, per our agreement, all money transfer fees are to be borne by the customer, ensuring that our bank receives the net invoice amount. <br><br>Please don’t hesitate to contact me if you have any questions. <br><br>Thank you for your business.';
			var attachRec = new Object();
			attachRec['entity']=toSend[x].customerID; //attach email to customer record
			attachRec['transaction']=toSend[x].inv_id; //attach email to invoice record
			//multiple email addresses
			//Recipient is a comma separated list of email addresses
			nlapiSendEmail(fromId,toSend[x].mail, sbj, msg, cc, null, attachRec, attachment);
			nlapiLogExecution('debug', 'email-sent', toSend[x].inv_name +' - '+toSend[x].customerName);
			
			  if(toSend[x].print_Type == 'c'){
				  nlapiSubmitField('invoice', toSend[x].inv_id, 'custbody_ilo_org_printed', 'T');
				  
			  }
			
		}
	  
		
	}
	

}




