		    var resArr;
		    var resName;
		    var resID;
		    var searchLoad;
		    var resFromDate;
		    var resToDate;
		    var selected_Customer = ' ';
		    var selected_Customer_id;
			var toPrintArr = [];

			var p_tranid = '';
			var p_trantype = '';
			var p_trandate = '';
			var p_customerName = '';
			var p_customerID = '';
			var p_totalAmt = '';
			var p_totalTax = '';
		
		    var invoiceArr = [];
		    var mainPDF = '';
		    
		
	        var inp_customer; 
	        var inp_customer_id;
	        var inp_fromDate;
	        var inp_toDate;
	        var inp_salesTerr;
	        var inp_batchName;
	        var inp_batchNameText;
	        var inp_printOrMail;
	        var inp_Type;
	        var inp_batchNumber;
	        var inp_printType;
	        var inp_subsid;
	        var isBatch = false;
	        var req_invoices;
	        
	        var printType;
	        
	        var context = nlapiGetContext();
	        var currSubsidiary = context.subsidiary;
	        
	        var checkIfPrintorMail;
/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Dec 2016     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function multiple_print_suitelet(request, response){
	
	
	if (request.getMethod() == 'GET') {
		//nlapiLogExecution('DEBUG', 'stage one', 'stage one');
	
		var form = nlapiCreateForm('Print/Mail Multiple Invoices');
		//form.setScript('customscript_ilo_multi_search_result_cs');
		form.addSubmitButton('Load');
		//form.setScript('customscript_ilo_savemulti_searchres_cs');
		form.addFieldGroup("custpage_ilo_batchloadgroup", "Select Invoices");
		//var batchName = form.addField('custpage_ilo_multi_batchname', 'select', 'Batch Name', 'customrecord_ilo_multi_search_result', 'custpage_ilo_batchloadgroup');
		
		var fromInvoice = form.addField('custpage_frominvoice', 'text', 'From Invoice', null, 'custpage_ilo_batchloadgroup');
		
		
		var toInvoice = form.addField('custpage_toinvoice', 'text', 'To Invoice', null, 'custpage_ilo_batchloadgroup');
		
		form.addFieldGroup("custpage_ilo_searchdetails", "Details");
		
		var docType = form.addField('custpage_ilo_multi_doc', 'text', 'Document', null, 'custpage_ilo_searchdetails');
		docType.setDefaultValue('Invoice') //invoice only
		docType.setDisplayType('inline')
	
		
		
		var printOrMail = form.addField('custpage_printormail_select','select','Print or Mail', null, 'custpage_ilo_searchdetails');
		printOrMail.addSelectOption('a','Print');
		printOrMail.addSelectOption('b','Mail');
		printOrMail.setMandatory(true);
		
	    var printType = form.addField('custpage_printtype_select', 'select', 'Select Print Type', null, 'custpage_ilo_searchdetails');
	    printType.addSelectOption('', '');
	    printType.addSelectOption('a', 'Draft/Copy');
	    printType.addSelectOption('b', 'Original');
	    printType.setMandatory(true);
	  
	    var selectSubsid = form.addField('custpage_ilo_multi_subsid','select', 'Subsidary', 'SUBSIDIARY', 'custpage_ilo_searchdetails');
	   // selectSubsid.setDefaultValue('QualiTest Ltd (Israel)') //Israeli subsidiary
	   // selectSubsid.setDisplayType('inline')
	    selectSubsid.setLayoutType('normal', 'startcol');
	    selectSubsid.setMandatory(true);

		var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
		checkStage.setDefaultValue('stageOne');
		checkStage.setDisplayType('hidden');


		response.writePage(form);

	} 
	

	else if(request.getParameter('custpage_printormail_select') == 'a') { //PRINT
		
		var startInv = request.getParameter('custpage_frominvoice');
		var endInv = request.getParameter('custpage_toinvoice');
		var subsid = request.getParameter('custpage_ilo_multi_subsid');
		
		var getPrintPref = request.getParameter('custpage_printtype_select')
		var printRef = '';
		if(getPrintPref == 'a') {
			printRef = 'Draft/Copy'
		}
		if(getPrintPref == 'b') {
			printRef = 'Original'
		}
		
		var allInvoices = invSearch(startInv,endInv, subsid)
		
		var formTitle = 'Choose Documents to Print';
		var customerEmail = ' ';

	    var invToPrint = [];  
		
	var printChoiceForm = nlapiCreateForm(formTitle);
	var executeBtn = printChoiceForm.addSubmitButton('Execute');
		
	var resultsSubList = printChoiceForm.addSubList('custpage_results_sublist', 'list', 'Results', null);
    resultsSubList.addMarkAllButtons();
    
    var res_InternalID = resultsSubList.addField('custpage_resultssublist_internalid', 'text', 'internalid');
    res_InternalID.setDisplayType('hidden');
    
    var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
	    
    var res_TranId = resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Document Number');

    var res_TranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'date', 'Date');

    var res_Customer = resultsSubList.addField('custpage_resultssublist_customer', 'text', 'Customer');
  
    var res_TotalAmt = resultsSubList.addField('custpage_resultssublist_totalamt', 'currency', 'Total');
    

    var res_PrintRef = resultsSubList.addField('custpage_resultssublist_printref', 'text', 'Print Type');
	
    if(allInvoices != null) {
    	
    	for(var i = 0 ; i<allInvoices.length; i++) {
    		
    		//invToPrint.push(allInvoices[i].internalid)
    		
    		resultsSubList.setLineItemValue('custpage_resultssublist_internalid', i +1, allInvoices[i].internalid);
    		resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', i +1, 'T');
    		resultsSubList.setLineItemValue('custpage_resultssublist_tranid', 	i +1, allInvoices[i].docNum);	
    		resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i +1, allInvoices[i].trandate);	
    		resultsSubList.setLineItemValue('custpage_resultssublist_customer', i +1, allInvoices[i].customerName);
    		resultsSubList.setLineItemValue('custpage_resultssublist_totalamt', i +1, allInvoices[i].total);
    		
    		resultsSubList.setLineItemValue('custpage_resultssublist_printref', i +1, printRef);

    	}
    }
		    

//	       var json = JSON.stringify(InvoicesToSearch, null, 2)
//			response.write(json); //not writing any values to screen
    

    
	var hiddenFieldForInvToPrint = printChoiceForm.addField('custpage_ilo_invtoprint', 'longtext', 'check', null, null);
	hiddenFieldForInvToPrint.setDefaultValue(JSON.stringify(invToPrint));
	hiddenFieldForInvToPrint.setDisplayType('hidden');
	
	var hiddenFieldForPrintPreference = printChoiceForm.addField('custpage_ilo_inv_printref', 'text', 'check', null, null);
	hiddenFieldForPrintPreference.setDefaultValue(printRef);
	hiddenFieldForPrintPreference.setDisplayType('hidden');
	
	var hiddenFieldForPrint = printChoiceForm.addField('custpage_isprint', 'text', 'check', null, null);
	hiddenFieldForPrint.setDefaultValue('print');
	hiddenFieldForPrint.setDisplayType('hidden');
    
	printChoiceForm.setScript('customscript_dy_batchprint_client')
    response.writePage(printChoiceForm)
			

	}//end of first else
	
	else if(request.getParameter('custpage_isprint') == 'print') { 
		
		var getUserMail = nlapiGetContext().getEmail();
		var getUserID =  nlapiGetContext().getUser();
		
		var endForm = nlapiCreateForm('Documents are being created..');
		 var htmlField1 = endForm.addField('custpage_header1', 'inlinehtml');
		 htmlField1.setDefaultValue("<span style='font-size:18px'>An email with the documents will be sent to : <b> " +getUserMail+ "</b> once completed.<br></span>"); 

		//var invoicesToPrint = JSON.parse(request.getParameter('custpage_ilo_invtoprint'));
		var printPreference = request.getParameter('custpage_ilo_inv_printref')

		var params = {
				'custscript_dy_jobstorun' : request.getParameter('custpage_ilo_invtoprint'),
				'custscript_dy_printpreference' : printPreference,
				'custscript_dy_emailsender' : getUserID,
				'custscript_dy_emailreciver' : getUserMail,
				'custscript_dy_printormail' : 'Print'
		}
		
			var jobs = request.getParameter('custpage_ilo_invtoprint')
			nlapiLogExecution('debug', 'PRINT - printPreference', printPreference)
			nlapiLogExecution('debug', 'PRINT - jobs', jobs)
		
		nlapiScheduleScript('customscript_dy_batchprint_ss', 'customdeploy_dy_batchprint_ss_dep', params)
		response.writePage(endForm)
	}
	
	else if(request.getParameter('custpage_printormail_select') == 'b') {
		
		var startInv = request.getParameter('custpage_frominvoice');
		var endInv = request.getParameter('custpage_toinvoice');
		var subsid = request.getParameter('custpage_ilo_multi_subsid'); 
		
		var getPrintPref = request.getParameter('custpage_printtype_select')
		var printRef = '';
		if(getPrintPref == 'a') {
			printRef = 'Draft/Copy'
		}
		if(getPrintPref == 'b') {
			printRef = 'Original'
		}
		
		var allInvoices = invSearch(startInv,endInv, subsid)
		
		var formTitle = 'Choose Documents to Email';
		var customerEmail = ' ';

	    var invToEmail = [];  
		
	var emailChoiceForm = nlapiCreateForm(formTitle);
	var executeBtn = emailChoiceForm.addSubmitButton('Execute');
		
	var resultsSubList = emailChoiceForm.addSubList('custpage_results_sublist', 'list', 'Results', null);
    resultsSubList.addMarkAllButtons();
    
    var res_InternalID = resultsSubList.addField('custpage_resultssublist_internalid', 'text', 'internalid');
    res_InternalID.setDisplayType('hidden');
    
    var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
	    
    var res_TranId = resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Document Number');

    var res_TranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'date', 'Date');

    var res_Customer = resultsSubList.addField('custpage_resultssublist_customer', 'text', 'Customer');
    
    var res_CustomerEmail = resultsSubList.addField('custpage_resultssublist_mail', 'text', 'Send to Email');
  
    var res_TotalAmt = resultsSubList.addField('custpage_resultssublist_totalamt', 'currency', 'Total');
    
    var res_PrintRef = resultsSubList.addField('custpage_resultssublist_printref', 'text', 'Print Type');
	
    if(allInvoices != null) {
    	
    	for(var i = 0 ; i<allInvoices.length; i++) {
    		
    		//invToEmail.push(allInvoices[i].internalid)
    		
    		resultsSubList.setLineItemValue('custpage_resultssublist_internalid', i +1, allInvoices[i].internalid);
    		resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', i +1, 'T');
    		resultsSubList.setLineItemValue('custpage_resultssublist_tranid', 	i +1, allInvoices[i].docNum);	
    		resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i +1, allInvoices[i].trandate);	
    		resultsSubList.setLineItemValue('custpage_resultssublist_customer', i +1, allInvoices[i].customerName);
    		resultsSubList.setLineItemValue('custpage_resultssublist_mail', i +1, allInvoices[i].email);
    		resultsSubList.setLineItemValue('custpage_resultssublist_totalamt', i +1, allInvoices[i].total);
    		
    		resultsSubList.setLineItemValue('custpage_resultssublist_printref', i +1, printRef);

    	}
    }
	var hiddenFieldForEmail = emailChoiceForm.addField('custpage_ismail', 'text', 'check', null, null);
	hiddenFieldForEmail.setDefaultValue('mail');
	hiddenFieldForEmail.setDisplayType('hidden');
	
	var hiddenFieldForEmailPrintPreference = emailChoiceForm.addField('custpage_ismail_printpref', 'text', 'check', null, null);
	hiddenFieldForEmailPrintPreference.setDefaultValue(printRef);
	hiddenFieldForEmailPrintPreference.setDisplayType('hidden');
	
	var hiddenFieldForEmailJobs = emailChoiceForm.addField('custpage_ismail_jobs', 'text', 'check', null, null);
	hiddenFieldForEmailJobs.setDefaultValue(invToEmail);
	hiddenFieldForEmailJobs.setDisplayType('hidden');
	
	
    
    emailChoiceForm.setScript('customscript_dy_batchprint_client')
    response.writePage(emailChoiceForm)
	}
	
	else if(request.getParameter('custpage_ismail') == 'mail') { 
		
		var getUserMail = nlapiGetContext().getEmail();
		var getUserID =  nlapiGetContext().getUser();
		
		var endForm = nlapiCreateForm('Documents are being sent..');
		 var htmlField1 = endForm.addField('custpage_header1', 'inlinehtml');
		 htmlField1.setDefaultValue("<span style='font-size:18px'>Emails with invoice attachments are currently being sent to the selection. All emails are sent from : <b> " +getUserMail+ ".</b><br></span>"); 

		var printPreference = request.getParameter('custpage_ismail_printpref')
		var jobsToRun = request.getParameter('custpage_ismail_jobs');
		
		nlapiLogExecution('debug', 'printPreference', printPreference)
		nlapiLogExecution('debug', 'jobsToRun', jobsToRun)
		

		var params = {
				'custscript_dy_jobstorun' : jobsToRun,
				'custscript_dy_printpreference' : printPreference,
				'custscript_dy_emailsender' : getUserID,
				'custscript_dy_emailreciver' : getUserMail,
				'custscript_dy_printormail' : 'Mail'
		}
		
		nlapiScheduleScript('customscript_dy_batchprint_ss', 'customdeploy_dy_batchprint_ss_dep', params)
		response.writePage(endForm)
	}
	
	
	
}


function invSearch(startInv,endInv, subsid) {
	
	var start = getDigit(startInv)
	var end = getDigit(endInv)
	
	var invRange = [start, end]

	var searchFAM = nlapiLoadSearch(null, 'customsearch_dy_invoice_search');
	
	searchFAM.addFilter(new nlobjSearchFilter('number', null, 'between', invRange));
	searchFAM.addFilter(new nlobjSearchFilter('subsidiary', null, 'is', subsid));
	
	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();
	

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allSelection
					.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allSelection != null) {
		allSelection.forEach(function(line) {

		theResults.push({

			internalid : line.getValue('internalid'),
			docNum : line.getValue('tranid'),
			trandate : line.getValue('trandate'),
			customerName : line.getValue('altname', 'customer'),
			total : line.getValue('fxamountremaining'),
			taxtotal : line.getValue('taxtotal'),
			email : line.getValue(cols[cols.length -1]),
			

		});

		});

	};
	
	return theResults;
}


function getDigit(invoice) {

	var res = invoice.match(/[0-9]+/g);
	var digit = parseInt(res[0])
	return digit
}
