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
		    
			var inp_subsidiary;
	        var inp_customer; 
	        var inp_customer_id;
	        var inp_fromDate;
	        var inp_toDate;
	        var inp_salesTerr;
	        var inp_batchName;
	        var inp_batchNameText;
	        var inp_printOrMail;
	        var inp_Type;

	        var req_invoices;
	        
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
		nlapiLogExecution('DEBUG', 'stage one', 'stage one');
	
		var form = nlapiCreateForm('Print Multiple Invoices');
		form.addSubmitButton('Load');
		//form.setScript('customscript_ilo_savemulti_searchres_cs');
		form.addFieldGroup("custpage_ilo_batchloadgroup", "Load Saved Batch");
		var batchName = form.addField('custpage_ilo_multi_batchname', 'select', 'Batch Name', 'customrecord_ilo_multi_search_result', 'custpage_ilo_batchloadgroup');

		form.addFieldGroup('custpage_ilo_searchdetails', 'Details');
		var subsid = form.addField('custpage_ilo_multi_subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY', 'custpage_ilo_searchdetails');
		subsid.setDefaultValue('1');
		subsid.setMandatory(true);
		var docType = form.addField('custpage_ilo_multi_doc', 'select', 'Document', null, 'custpage_ilo_searchdetails');
		docType.addSelectOption('a', 'Invoice');
		docType.addSelectOption('b', 'Credit Memo');
		docType.addSelectOption('c', 'Cash Sale');
		docType.setMandatory(true);
		var customer = form.addField('custpage_ilo_multi_customer', 'select', 'Customer', 'CUSTOMER', 'custpage_ilo_searchdetails');
		var salesTerr = form.addField('custpage_selectfield', 'select', 'Sales Territory', null, 'custpage_ilo_searchdetails');
		salesTerr.addSelectOption('','');
		var fromDate = form.addField('custpage_ilo_multi_fromdate','date','From Date', null, 'custpage_ilo_searchdetails');
		fromDate.setDefaultValue('01/01/17');
		fromDate.setLayoutType('normal', 'startcol');
		var toDate = form.addField('custpage_ilo_multi_todate','date','To Date', null, 'custpage_ilo_searchdetails');
		toDate.setDefaultValue('31/01/17');

		var printOrMail = form.addField('custpage_printormail_select','select','Print or Mail', null, 'custpage_ilo_searchdetails');
		printOrMail.addSelectOption('a','Print');
		printOrMail.addSelectOption('b','Mail');


		response.writePage(form);

	} 

	
	else if(request.getParameter('custpage_ilo_multi_subsidiary') == currSubsidiary) { // change to something less broad
		nlapiLogExecution('DEBUG', 'stage two', 'stage two');
		
	var formTitle = 'Choose Documents to Print';
	var customerEmail = ' ';
				    
			 inp_subsidiary = request.getParameter('custpage_ilo_multi_subsidiary');
	         inp_customer = request.getParameter('custpage_ilo_multi_customer'); 
	         inp_fromDate = request.getParameter('custpage_ilo_multi_fromdate'); 
	         inp_toDate = request.getParameter('custpage_ilo_multi_todate'); 
	         inp_salesTerr = request.getParameter('custpage_selectfield'); 
	         inp_batchName = request.getParameter('custpage_ilo_multi_batchname'); 
	         inp_batchNameText = request.getParameter('inpt_custpage_ilo_multi_batchname'); 
	         inp_printOrMail = request.getParameter('selectfield'); 
	         inp_Type = request.getParameter('custpage_ilo_multi_doc');
	        
	

			//saved search is being loaded
			if(inp_batchNameText != " " || null || "") {
				//nlapiLogExecution("DEBUG", 'inthefucntion', inp_batchNameText);
				var batchArr = [];
				var resultsRec = nlapiLoadRecord('customrecord_ilo_multi_search_result', inp_batchName);
				resArr = resultsRec.getFieldValue('custrecord_ilo_multi_search_resarr');
				resName = resultsRec.getFieldValue('name');
				resID = resultsRec.id;
				resFromDate = resultsRec.getFieldValue('custrecord_ilo_multi_search_fromdate');
				resToDate = resultsRec.getFieldValue('custrecord_ilo_multi_search_todate');
				searchLoad = JSON.parse(resArr);
				//nlapiLogExecution("DEBUG", 'resArr-display', resArr);
				//nlapiLogExecution('DEBUG', 'resName', resName);
					};
	        
		//variables for the search
		if (inp_customer != '') {
			selected_Customer = inp_customer;
		};
	
		
		invSearch(inp_fromDate,inp_toDate);

		
		
		
		//types of transactions
//		invoice = ['CustInvc:A','CustInvc:B'];
//		credit_memo = ['CustCred:A', 'CustCred:B'];
//		sales_order = ['SalesOrd:A','SalesOrd:B','SalesOrd:C','SalesOrd:D','SalesOrd:E','SalesOrd:F','SalesOrd:G','SalesOrd:H'];
		
		
if(request.getParameter('custpage_printormail_select') == 'b') { //mail
	
	formTitle = 'Choose Documents to Mail';
};

	        //endForm creation
			var printChoiceForm = nlapiCreateForm(formTitle);
			printChoiceForm.setScript('customscript_ilo_savemulti_searchres_cs');
			var checkIfBatchLoaded = printChoiceForm.addField('custpage_ilo_checkifbatchloaded', 'text', null);
			checkIfBatchLoaded.setDefaultValue(resName);
			checkIfBatchLoaded.setDisplayType('hidden');
			var checkIfBatchLoadedID = printChoiceForm.addField('custpage_ilo_checkifbatchloadedid', 'text', null);
			checkIfBatchLoadedID.setDefaultValue(resID);
			checkIfBatchLoadedID.setDisplayType('hidden');
			
			checkIfPrintorMail = printChoiceForm.addField('custpage_ilo_checkifprintormail', 'text', null);
			checkIfPrintorMail.setDisplayType('hidden');
			checkIfPrintorMail.setDefaultValue('print');
		
			var res_Title = printChoiceForm.addField('custpage_ilo_res_title',
					'inlinehtml', 'shaam update info', null, null);
			
			var doctype = '';
			if(inp_Type == 'a') {
				doctype = 'Invoice';	
			};
			
			function getTodaysDate(){
			var todaysDate = new Date();
			var dd = todaysDate.getDate();
			var mm = todaysDate.getMonth()+1; //January is 0!
			var yyyy = todaysDate.getFullYear();

			if(dd<10) {
			    dd='0'+dd;
			}; 

			if(mm<10) {
			    mm='0'+mm;
			};

			todaysDate = dd+'/'+mm+'/'+yyyy;
			return todaysDate;
			}
			
			var forcedSaveName ='-New Search-' + getTodaysDate();'-'+doctype;
			res_Title.setDefaultValue(forcedSaveName);
			res_Title.setLayoutType('outsideabove', 'startrow');
			
			

			
			var toPrintHiddenResults = printChoiceForm.addField('custpage_toprintresults', 'text', null);
			toPrintHiddenResults.setDefaultValue(JSON.stringify(invoiceArr));
			toPrintHiddenResults.setDisplayType('hidden');
			
			var toMailHiddenResults = printChoiceForm.addField('custpage_tomailresults', 'text', null);
			toMailHiddenResults.setDisplayType('hidden');
 
		    var resultsSubList = printChoiceForm.addSubList('custpage_results_sublist', 'inlineeditor', 'Results', null);
		    
		    var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
		   // res_CheckBox.setDefaultValue('custpage_resultssublist_checkbox', 1 ,'T');	    
		    var res_TranId = resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Document Number');
		    //res_TranId.setDefaultValue('INV03091804');
		    var res_TranType = resultsSubList.addField('custpage_resultssublist_trantype', 'text', 'Type');
		    //res_TranType.setDefaultValue('Invoice');
		    var res_TranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'date', 'Date');
		   // res_TranDate.setDefaultValue('1/11/2017');
		    var res_Customer = resultsSubList.addField('custpage_resultssublist_customer', 'text', 'Customer');
		   // res_Customer.setDefaultValue('697');
		    
		    
		    if(request.getParameter('custpage_printormail_select') == 'b') { //mail
			    var res_CustomerMail = resultsSubList.addField('custpage_resultssublist_contactmail', 'text', 'Recipient');
			    res_CustomerMail.setDefaultValue(customerEmail);
			    checkIfPrintorMail.setDefaultValue('mail');
			    var res_CustomerID = resultsSubList.addField('custpage_resultssublist_customerid', 'text', 'CustomerID');
			    res_CustomerID.setDisplayType('hidden');
			
			    
		    };

		    
		    var res_TotalAmt = resultsSubList.addField('custpage_resultssublist_totalamt', 'currency', 'Total Amount');
		   // res_TotalAmt.setDefaultValue('1000');
		    var res_TotalTax = resultsSubList.addField('custpage_resultssublist_totaltax', 'currency', 'Total Tax');
		   // res_TotalTax.setDefaultValue('1000');
		    var printType = resultsSubList.addField('custpage_resultssublist_printtype', 'select', 'Print');
		    printType.addSelectOption('a', 'Draft');
		    printType.addSelectOption('b', 'Copy');
		    printType.addSelectOption('c', 'Original');
		    
		    var docID = resultsSubList.addField('custpage_resultssublist_docid', 'text', 'ID').setDisplayType('hidden');
		    
	    
	for (var j = 0; j < invoiceArr.length; j++) {
		//nlapiLogExecution('DEBUG', 'j', j);
	
		if(toPrintArr[invoiceArr[j]].p_trantype == 'CustInvc') {
			toPrintArr[invoiceArr[j]].p_trantype = 'Invoice';
		};
		if(toPrintArr[invoiceArr[j]].p_contactEmail == []) {
			toPrintArr[invoiceArr[j]].p_contactEmail = ' ';
		};


		resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', j +1, 'T');
		resultsSubList.setLineItemValue('custpage_resultssublist_tranid', j +1, toPrintArr[invoiceArr[j]].p_tranid);
		resultsSubList.setLineItemValue('custpage_resultssublist_trantype', j +1, toPrintArr[invoiceArr[j]].p_trantype);	
		resultsSubList.setLineItemValue('custpage_resultssublist_trandate', j +1, toPrintArr[invoiceArr[j]].p_trandate);	
		resultsSubList.setLineItemValue('custpage_resultssublist_customer', j +1, toPrintArr[invoiceArr[j]].p_customerName);	
		 if(request.getParameter('custpage_printormail_select') == 'b') {
			// nlapiLogExecution('DEBUG', 'emailArr', toPrintArr[invoiceArr[j]].p_contactEmail);
			 resultsSubList.setLineItemValue('custpage_resultssublist_contactmail', j +1, toPrintArr[invoiceArr[j]].p_contactEmail);
			 resultsSubList.setLineItemValue('custpage_resultssublist_customerid', j +1, toPrintArr[invoiceArr[j]].p_customerID);
		 };
		resultsSubList.setLineItemValue('custpage_resultssublist_totalamt', j +1, toPrintArr[invoiceArr[j]].p_totalAmt / toPrintArr[invoiceArr[j]].p_exchangeRate);
		resultsSubList.setLineItemValue('custpage_resultssublist_totaltax', j +1, toPrintArr[invoiceArr[j]].p_totalTax / toPrintArr[invoiceArr[j]].p_exchangeRate);
		resultsSubList.setLineItemValue('custpage_resultssublist_printtype', j +1, 'a');
		resultsSubList.setLineItemValue('custpage_resultssublist_docid', j +1, invoiceArr[j]);
			//nlapiLogExecution('DEBUG', 'customer name', toPrintArr[invoiceArr[j]].p_customerName);	
			}
	       var saveBtn = printChoiceForm.addSubmitButton('Save & Continue');
	       var saveName = printChoiceForm.addField('custpage_results_namesave', 'text', 'Name for Search');

			response.writePage(printChoiceForm); //not writing any values to screen
			

	}//end of first else
	else 	
	{

		var lastFormName = 'Ready for Print';

		if(request.getParameter('custpage_ilo_checkifprintormail') == 'mail') {
 

			var sendFrom;
			var sendTo;
			var sbj;
			var msg;
			var attachRec;
			var attachment;
			
			lastFormName = 'Documents Sent';
			var toSend = [];
			var some = request.getParameter('custpage_tomailresults');

			var emailArr = JSON.parse(some);
			for (var k = 0; k<emailArr.length; k++) {
				  
				  toSend.push ({
					  		documentID : emailArr[k].docID,
				            mail: emailArr[k].contMail,
				            customerID : emailArr[k].customerID
				  });
 
				}
			
			var jsonified = JSON.stringify(toSend);
			nlapiLogExecution('DEBUG', 'toSend', jsonified);
			
			for (var i = 0; i < toSend.length; i++) {

				  var somemails = getMails(toSend[i].mail);
				  var somedocIDs = toSend[i].documentID;
				  var somecust = toSend[i].customerID;

				  		var fromId = 4; //Authors' Internal ID
						var attachment = nlapiPrintRecord('TRANSACTION',somedocIDs,'PDF',null);
						var sbj = 'Your invoice from JFrog';
						var msg = 'Attached is your current invoice. Please review.';
						var attachRec = new Object();
						attachRec['entity'] = somecust; //attach email to customer record
						attachRec['transaction']=somedocIDs; //attach email to invoice record
						//multiple email addresses
						//Recipient is a comma separated list of email addresses
						nlapiSendEmail(fromId, somemails, sbj, msg, null, null, attachRec, attachment);


				}

		
		}

		var lastForm = nlapiCreateForm(lastFormName);
		//lastForm.addSubmitButton('Save & Print');
		
	 req_invoices = request.getParameter('custpage_toprintresults');

		
		function multiplePrint(invoiceArr) {
			//get full template and convert to string
				var temp = nlapiLoadFile('2048').getValue();
				var a = temp.toString();
			//get head tag 
				var first_headTag = a.indexOf("head") -1 ; 
			    var end_headTag = a.indexOf("/head") +6 ; 
				var head_tag = a.substr(first_headTag, end_headTag - first_headTag);
			//get table tag (actual template of invoice)
				var first_tableTag = a.indexOf("cellpadding") -18 ;
				var end_tableTag = a.indexOf("/body") -6 ;
				var inv_template = a.substr(first_tableTag, end_tableTag - first_tableTag);

				
			//concatenate all parts of xml file	
				var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
				xml += "<pdf>";
									
				xml += head_tag + '<body padding="0.2in 0.5in 0.1in 0.5in" size="A4">';
						
				var invoices = invoiceArr;                      

				for(var i = 0; i < invoices.length; i++){
					try
					{
				var invoice = nlapiLoadRecord('invoice', invoices[i]);
				var renderer = nlapiCreateTemplateRenderer();
				renderer.setTemplate(inv_template);
				renderer.addRecord('record', invoice);
				xml = xml +  renderer.renderToString();
				if(i < invoices.length - 1){
				xml = xml + '<pbr/>';
				} 
				
				var context = nlapiGetContext();
				var usageRemaining = context.getRemainingUsage();
				if(usageRemaining < 50) {
					alert('There are too many results for this search, therefore some invoices have been ommitted. For a more precise result, please narrow your date range');
					break;
				}
					}
					catch(e) {
						nlapiLogExecution('ERROR', 'error pdfbuild - invoice id:'+invoices[i]+ ' ', e);
					}
				};
				
				xml = xml += '</body></pdf>';

			//convert xml file back to pdf
				var pdf = nlapiXMLToPDF(xml);
			
			//save pdf in filecabinet
				var multipleINV_pdf = nlapiCreateFile('Print.pdf', 'PDF', pdf.getValue());
				multipleINV_pdf.setFolder('-15');
		        var printFileID = nlapiSubmitFile(multipleINV_pdf);
		         mainPDF = nlapiLoadFile(printFileID).getURL(); //get url of pdf from filecabinet	        
			};
			
			if(request.getParameter('custpage_ilo_checkifprintormail') == 'print') {
				
				multiplePrint(JSON.parse(req_invoices));
				
				var baseURL = 'https://system.na1.netsuite.com/';
				
				var linkprintChoiceForm = lastForm.addField("custpage_ilo_download_invoices", "inlinehtml", "", null, null);
				
				linkprintChoiceForm.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href ='+baseURL+mainPDF+'><b>Download Batch for Print</b></a>'); //url of pdf from filecabinet

			}
			
			
			

		
		response.writePage(lastForm);		
	};

	
	 

};

function getMails(mails) {
	  var emailReady;
	  var a = mails;
	  var b = a.split(',\u0005');
	  if (b.length == 1) {
	    emailReady = b[0].substring(0, b[0].length - 1);
	  } else {
	    var c = b.join();
	    emailReady = c.substring(0, c.length - 1);
	  }
	  return emailReady;

	}


function invSearch(inp_fromDate,inp_toDate) {
	//get contact emails
	var currContactEmail = [];
	var cols = new Array();
	cols[0] = new nlobjSearchColumn('email');
	cols[1] = new nlobjSearchColumn('company');
	var emailRes = nlapiSearchRecord('contact', null, null, cols);
	
	
	
	//get invoices
	var loadSearchFilters = new Array();
	loadSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'anyof', searchLoad);
	loadSearchFilters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	
	var filtersInvoice = new Array();
	filtersInvoice[0] = new nlobjSearchFilter('trandate', null, 'onorafter', inp_fromDate);
	filtersInvoice[1] = new nlobjSearchFilter('trandate', null, 'onorbefore', inp_toDate);
    filtersInvoice[2] = new nlobjSearchFilter('status', null, 'anyof', ['CustInvc:A','CustInvc:B']);
    filtersInvoice[3] = new nlobjSearchFilter('entity', null, 'anyof', selected_Customer);
    filtersInvoice[4] = new nlobjSearchFilter('mainline', null, 'is', 'T');

	var columnsInvoice = new Array();
	columnsInvoice[0] = new nlobjSearchColumn('internalid').setSort(true);
	columnsInvoice[1] = new nlobjSearchColumn('tranid');
	columnsInvoice[2] = new nlobjSearchColumn('type');
	columnsInvoice[3] = new nlobjSearchColumn('trandate');
	columnsInvoice[4] = new nlobjSearchColumn('entity');
	columnsInvoice[5] = new nlobjSearchColumn('total');
	columnsInvoice[6] = new nlobjSearchColumn('taxtotal');
	columnsInvoice[7] = new nlobjSearchColumn('exchangerate');


	if(resArr != null) {
		filtersInvoice = loadSearchFilters;
	}

	var s = nlapiSearchRecord('transaction', null, filtersInvoice, columnsInvoice);
	
	if(s != null) {
	
		
for(var i = 0; i<s.length; i++) {
	
	currContactEmail = [];
	
	if (emailRes != null) {
		for( var j = 0; j< emailRes.length; j++){
		if(emailRes[j].getText('company') == s[i].getText('entity')) {
			currContactEmail.push(emailRes[j].getValue('email')+',');
		}
		}
	}

toPrintArr[s[i].id] = {
		p_tranid : s[i].getValue('tranid'),
		p_trantype : s[i].getValue('type'),
		p_trandate : s[i].getValue('trandate'),
		p_customerName: s[i].getText('entity'),
		p_totalAmt: s[i].getValue('total'),
		p_totalTax: s[i].getValue('taxtotal'),
		p_exchangeRate : s[i].getValue('exchangerate'),
		p_contactEmail : currContactEmail,
		p_customerID : s[i].getValue('entity')
	};

}
	}//end of if(s != null)


invoiceArr = Object.keys(toPrintArr);
}


