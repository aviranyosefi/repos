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
	
		var form = nlapiCreateForm('Print Multiple Invoices');
		//form.setScript('customscript_ilo_multi_search_result_cs');
		form.addSubmitButton('Load');
		//form.setScript('customscript_ilo_savemulti_searchres_cs');
		form.addFieldGroup("custpage_ilo_batchloadgroup", "Load Saved Batch");
		//var batchName = form.addField('custpage_ilo_multi_batchname', 'select', 'Batch Name', 'customrecord_ilo_multi_search_result', 'custpage_ilo_batchloadgroup');
		var batchNumber = form.addField('custpage_ilo_multi_batchnumber', 'text', 'Batch Number', null, 'custpage_ilo_batchloadgroup');
		batchNumber.setDefaultValue('');
		form.addFieldGroup('custpage_ilo_searchdetails', 'Details');
		var docType = form.addField('custpage_ilo_multi_doc', 'select', 'Document', null, 'custpage_ilo_searchdetails');
		docType.addSelectOption('a', 'Invoice');
		docType.setMandatory(true);
		var printOrMail = form.addField('custpage_printormail_select','select','Print or Mail', null, 'custpage_ilo_searchdetails');
		printOrMail.addSelectOption('a','Print');
		printOrMail.addSelectOption('b','Mail');
		
	    var printType = form.addField('custpage_printtype_select', 'select', 'Select Print Type', null, 'custpage_ilo_searchdetails');
	    printType.addSelectOption('', '');
	    printType.addSelectOption('a', 'Draft');
	    printType.addSelectOption('b', 'Copy');
	    printType.addSelectOption('c', 'Original');
	    printType.addSelectOption('d', 'Internal Only')
	    printType.setMandatory(true);
	    
	    var selectSubsid = form.addField('custpage_ilo_multi_subsid','select', 'Subsidary', 'SUBSIDIARY', 'custpage_ilo_searchdetails');
	    selectSubsid.setMandatory( true );
	    selectSubsid.setLayoutType('normal', 'startcol');
		var fromDate = form.addField('custpage_ilo_multi_fromdate','date','From Date', null, 'custpage_ilo_searchdetails');
		fromDate.setDefaultValue('01/01/17');
		
		var toDate = form.addField('custpage_ilo_multi_todate','date','To Date', null, 'custpage_ilo_searchdetails');
		toDate.setDefaultValue('31/12/18');
		var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
		checkStage.setDefaultValue('stageOne');
		checkStage.setDisplayType('hidden');


		response.writePage(form);

	} 

	
	else if(request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad
		//nlapiLogExecution('DEBUG', 'stage two', 'stage two');
		
	var formTitle = 'Choose Documents to Print';
	var customerEmail = ' ';
				    

	         inp_fromDate = request.getParameter('custpage_ilo_multi_fromdate'); 
	         inp_toDate = request.getParameter('custpage_ilo_multi_todate'); 
	         inp_batchName = request.getParameter('custpage_ilo_multi_batchname'); 
	         inp_batchNameText = request.getParameter('inpt_custpage_ilo_multi_batchname'); 
	         inp_printOrMail = request.getParameter('custpage_printormail_select'); 
	         nlapiLogExecution('debug', 'custpage_printormail_select', inp_printOrMail)
//	         inp_Type = request.getParameter('custpage_ilo_multi_doc');
	         inp_printType = request.getParameter('custpage_printtype_select');
//	         nlapiLogExecution('debug', 'inp_printType', inp_printType)
	         inp_batchNumber = request.getParameter('custpage_ilo_multi_batchnumber');
	         subsid = request.getParameter('custpage_ilo_multi_subsid');
	       
	         //nlapiLogExecution("DEBUG", 'inp_printType',inp_printType);

//			//saved search is being loaded
//			if(inp_batchNameText != " " || null || "") {
//				//nlapiLogExecution("DEBUG", 'inthefucntion', inp_batchNameText);
//				var batchArr = [];
//				var resultsRec = nlapiLoadRecord('customrecord_ilo_multi_search_result', inp_batchName);
//				resArr = resultsRec.getFieldValue('custrecord_ilo_multi_search_resarr');
//				resName = resultsRec.getFieldValue('name');
//				resID = resultsRec.id;
//				resFromDate = resultsRec.getFieldValue('custrecord_ilo_multi_search_fromdate');
//				resToDate = resultsRec.getFieldValue('custrecord_ilo_multi_search_todate');
//				searchLoad = JSON.parse(resArr);
//				//nlapiLogExecution("DEBUG", 'resArr-display', resArr);
//				//nlapiLogExecution('DEBUG', 'resName', resName);
//					};
	        
		//variables for the search

		if(inp_batchNumber != '') {
			isBatch = true;
			
		}
	
		
		invSearch(inp_fromDate,inp_toDate,inp_batchNumber,subsid);


		
		
		
		//types of transactions
//		invoice = ['CustInvc:A','CustInvc:B'];
//		credit_memo = ['CustCred:A', 'CustCred:B'];
//		sales_order = ['SalesOrd:A','SalesOrd:B','SalesOrd:C','SalesOrd:D','SalesOrd:E','SalesOrd:F','SalesOrd:G','SalesOrd:H'];
		
		
if(request.getParameter('custpage_printormail_select') == 'b') { //mail
	
	 if (request.getParameter('custpage_printtype_select') == 'd') {
		 
		 formTitle = 'Choose Documents to Mail (Internal Only)';
	 }
	 
	 if (request.getParameter('custpage_printtype_select') != 'd') {
		 
		 formTitle = 'Choose Documents to Mail';
	 }
	
};

	        //endForm creation
			var printChoiceForm = nlapiCreateForm(formTitle);
			printChoiceForm.setScript('customscript_ilo_multiplesearchresultscs');
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
			
			
			
			var forcedSaveName ='-New Search-' + getTodaysDate();'-'+doctype;
			res_Title.setDefaultValue(forcedSaveName);
			res_Title.setLayoutType('outsideabove', 'startrow');
			
			inp_subsid = request.getParameter('custpage_ilo_multi_subsid');
			var subsid = printChoiceForm.addField('custpage_ilo_subsidselected', 'text', null);
			subsid.setDefaultValue(inp_subsid);
			subsid.setDisplayType('hidden');

			
			var toPrintHiddenResults = printChoiceForm.addField('custpage_toprintresults', 'longtext', null);
			toPrintHiddenResults.setDefaultValue(JSON.stringify(invoiceArr));
			toPrintHiddenResults.setDisplayType('hidden');
			
			nlapiLogExecution('debug', 'invoiceArr', JSON.stringify(invoiceArr))
			
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
		    
		    
		    if(request.getParameter('custpage_printormail_select') == 'b' && request.getParameter('custpage_printtype_select') != 'd') { //mail
			    var res_CustomerMail = resultsSubList.addField('custpage_resultssublist_contactmail', 'text', 'Recipient');
			    res_CustomerMail.setDefaultValue(customerEmail);
			    checkIfPrintorMail.setDefaultValue('mail');
		
			
			    
		    };
		    
		    if(request.getParameter('custpage_printtype_select') == 'd' && request.getParameter('custpage_printormail_select') == 'b') {
			    var res_RepMail = resultsSubList.addField('custpage_resultssublist_repmail', 'text', 'Sales Rep');
			    res_RepMail.setDefaultValue(customerEmail);
			    checkIfPrintorMail.setDefaultValue('mail');
	
			
			    
		    };

		    
		    var res_TotalAmt = resultsSubList.addField('custpage_resultssublist_totalamt', 'currency', 'Total Amount');
		   // res_TotalAmt.setDefaultValue('1000');
		    var res_TotalTax = resultsSubList.addField('custpage_resultssublist_totaltax', 'currency', 'Total Tax');
		   // res_TotalTax.setDefaultValue('1000');
		    var printType = resultsSubList.addField('custpage_resultssublist_printtype', 'select', 'Print');
		    printType.addSelectOption('', '');
		    printType.addSelectOption('a', 'Draft');
		    printType.addSelectOption('b', 'Copy');
		    printType.addSelectOption('c', 'Original');
		    printType.addSelectOption('d', 'Internal Only')
		    var docID = resultsSubList.addField('custpage_resultssublist_docid', 'text', 'ID').setDisplayType('hidden');
		    
	  
		    var customerids = getCustomerRecIDS(invoiceArr)
		    //var contactEmails = getAllInvContacts(customerids);
		    
	for (var j = 0; j < invoiceArr.length; j++) {
		//nlapiLogExecution('DEBUG', 'j', j);
	
		if(toPrintArr[invoiceArr[j]].p_trantype == 'CustInvc') {
			toPrintArr[invoiceArr[j]].p_trantype = 'Invoice';
		};
//		if(toPrintArr[invoiceArr[j]].p_contactEmail == []) {
//			toPrintArr[invoiceArr[j]].p_contactEmail = ' ';
//		};


		resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', j +1, 'T');
		resultsSubList.setLineItemValue('custpage_resultssublist_tranid', j +1, toPrintArr[invoiceArr[j]].p_tranid);
		resultsSubList.setLineItemValue('custpage_resultssublist_trantype', j +1, toPrintArr[invoiceArr[j]].p_trantype);	
		resultsSubList.setLineItemValue('custpage_resultssublist_trandate', j +1, toPrintArr[invoiceArr[j]].p_trandate);	
		resultsSubList.setLineItemValue('custpage_resultssublist_customer', j +1, toPrintArr[invoiceArr[j]].p_customerName);	
		
		 if(request.getParameter('custpage_printormail_select') == 'b' && request.getParameter('custpage_printtype_select') != 'd') {
			 //nlapiLogExecution('DEBUG', 'emailArr', toPrintArr[invoiceArr[j]].p_contactEmail[0]);
			 resultsSubList.setLineItemValue('custpage_resultssublist_contactmail', j +1,toPrintArr[invoiceArr[j]].p_contactEmail);
		 };
		 if(request.getParameter('custpage_printtype_select') == 'd' && request.getParameter('custpage_printormail_select') == 'b') {
			 //nlapiLogExecution('DEBUG', 'emailArr', toPrintArr[invoiceArr[j]].p_contactEmail[0]);
			 resultsSubList.setLineItemValue('custpage_resultssublist_repmail', j +1,toPrintArr[invoiceArr[j]].p_salesRepEmail);
		 };
		resultsSubList.setLineItemValue('custpage_resultssublist_totalamt', j +1, toPrintArr[invoiceArr[j]].p_totalAmt / toPrintArr[invoiceArr[j]].p_exchangeRate);
		resultsSubList.setLineItemValue('custpage_resultssublist_totaltax', j +1, toPrintArr[invoiceArr[j]].p_totalTax / toPrintArr[invoiceArr[j]].p_exchangeRate);
		resultsSubList.setLineItemValue('custpage_resultssublist_printtype', j +1, toPrintArr[invoiceArr[j]].p_printType);
		resultsSubList.setLineItemValue('custpage_resultssublist_docid', j +1, invoiceArr[j]);
			//nlapiLogExecution('DEBUG', 'customer name', toPrintArr[invoiceArr[j]].p_customerName);	
			}
	       var saveBtn = printChoiceForm.addSubmitButton('Execute');
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
			var dataForEmails=[];
			for(var i = 0; i<emailArr.length; i++) {
				
				dataForEmails.push({
					t_ID: emailArr[i].docID, //transaction ID
					p_T: emailArr[i].printType //print-type(draft/original)
				});
			}

			var dataForEmailsToSave = JSON.stringify(dataForEmails);
			
			var newEmailJob = nlapiCreateRecord('customrecord_ilo_ss_jobs');
			newEmailJob.setFieldValue('name', getTodaysDate() + ' - Emails To Send');
			newEmailJob.setFieldValue('custrecord_ilo_email_data_array', dataForEmailsToSave);
			var jobID = nlapiSubmitRecord(newEmailJob);
		
			nlapiLogExecution("DEBUG", 'jobID', jobID);
			
	nlapiScheduleScript('customscript_ilo_sbtech_sendemails_ss', 'customdeploy_ilo_sbtech_sendemails_dep', {custscript_ilo_ss_data_id: jobID});
		
		}
		
		var lastForm = nlapiCreateForm(lastFormName);
		//lastForm.addSubmitButton('Save & Print');
		

	 req_invoices = request.getParameter('custpage_toprintresults');
	 var toSendcheck=[];
	 var checkOriginal = request.getParameter('custpage_tomailresults');
		var checkOGprint = JSON.parse(checkOriginal);
		for (var k = 0; k<checkOGprint.length; k++) {
			  
			  toSendcheck.push ({
				  		documentID : checkOGprint[k].docID,
			            mail: checkOGprint[k].contMail,
			            customerID : checkOGprint[k].customerID,
			            printType : checkOGprint[k].printType
			  });

			}
	 
		for (var i = 0; i < toSendcheck.length; i++) {

			
			  var p_somedocIDs = toSendcheck[i].documentID;
			  var p_someprintType = toSendcheck[i].printType;
			  
			  if(p_someprintType == 'a') {
				  nlapiSubmitField('invoice', p_somedocIDs,'custbodycustbody_ilo_print_draft', 'T');
				 
			  }
			  if(p_someprintType == 'c'){
				  nlapiSubmitField('invoice', p_somedocIDs,'custbodycustbody_ilo_print_draft', 'F');
//				  nlapiSubmitField('invoice', p_somedocIDs, 'custbody_ilo_org_printed', 'T');				  
			  }
		}
		var getSubsid = request.getParameter('custpage_ilo_subsidselected');
		nlapiLogExecution('debug', 'checksubid', getSubsid);
		
		var templateID = '';
		if(getSubsid == '31') { //TG Marketing
			templateID = '1963' //TG Marketing invoice template;
		}
		if(getSubsid == '25') { //SBTech Malta
			templateID = '1962' //SBTech Malta invoice template;
		}
		if(getSubsid == '19') { //SBTech GLOBAL(Isle of Man)
			templateID = '1961' //SBTech GLOBAL(Isle of Man) invoice template
		}
		function multiplePrint(invoiceArr, templateID) {
			
			
			//get full template and convert to string
				var temp = nlapiLoadFile(templateID).getValue();
				var a = temp.toString();

				
				
				
				
				
				
			//get head tag 
				var first_styleTag = a.indexOf("style") -1 ; 
			    var end_styleTag = a.indexOf("/style") +7 ; 
				var style_tag = a.substr(first_styleTag, end_styleTag - first_styleTag);
				
				var first_macroListTag = a.indexOf("macrolist") -1
				var end_macroListTag = a.indexOf("/macrolist") +11 ; 
				var macroList_tag = a.substr(first_macroListTag, end_macroListTag - first_macroListTag);
				
			//get table tag (actual template of invoice)
				var first_tableTag = a.indexOf("body padding") +125 ;
				var end_tableTag = a.indexOf("/body") -1 ;
				var inv_template = a.substr(first_tableTag, end_tableTag - first_tableTag);
				
				
				nlapiLogExecution('debug', 'end_tableTag', end_tableTag)

				
//			concatenate all parts of xml file	
				var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
				xml += "<pdf>";
									
				xml += '<head>'+ style_tag+macroList_tag+'</head>';
				xml += '<body padding="25px" margin="20px" size="A4" footer="nlfooter" footer-height="120px"  header="nlheader" header-height="130px">';
				var invoices = invoiceArr;                      

				
				
				var _bank_address = '';
				var _bank_account = '';
				var _bank_iban = '';
				var _bank_swift = '';
				
				for(var i = 0; i < invoices.length; i++){
					try
					{
				var invoice = nlapiLoadRecord('invoice', invoices[i]);	
				
				 _bank_address = invoice.getFieldValue('custbody_sbtech_invoice_bank_address');
				 _bank_account = invoice.getFieldValue('custbody_sbtech_invoice_bank_num');
				 _bank_iban = invoice.getFieldValue('custbody_sbtech_invoice_bank_iban');
				 _bank_swift = invoice.getFieldValue('custbody_sbtech_invoice_bank_swift');
				
				
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
				
				
				
				var pattern = /_bank_address|_bank_account|_bank_iban|_bank_swift/ig;
				

				var mapObj = {
						_bank_address : _bank_address,
						_bank_account : _bank_account,
						_bank_iban : _bank_iban,
						_bank_swift : _bank_swift,

			};
				

					var str = xml.replace(/\{\{(.*?)\}\}/g, function(i, match) {
					    return mapObj[match];
					});

//			//convert xml file back to pdf
				var pdf = nlapiXMLToPDF(str);
		//	
//			//save pdf in filecabinet
				var multipleINV_pdf = nlapiCreateFile('Print.pdf', 'PDF', pdf.getValue());
				multipleINV_pdf.setFolder('-15');
		        var printFileID = nlapiSubmitFile(multipleINV_pdf);
		         mainPDF = nlapiLoadFile(printFileID).getURL(); //get url of pdf from filecabinet	

		}
			
			if(request.getParameter('custpage_ilo_checkifprintormail') == 'print') {
				
				
				//This function creates the pdf of Invoice for Print//
				
				
				multiplePrint(JSON.parse(req_invoices), templateID);
				
				
				
				var baseURL = 'https://system.na1.netsuite.com/';
				
				var linkprintChoiceForm = lastForm.addField("custpage_ilo_download_invoices", "inlinehtml", "", null, null);
				
				linkprintChoiceForm.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href ='+baseURL+mainPDF+'><b>Download Batch for Print</b></a>'); //url of pdf from filecabinet

				//linkprintChoiceForm.setDefaultValue('<font size="3">No Invoice Template.')
				


				
			}
			 var toSendchecktwo=[];
			 var checkOriginaltwo = request.getParameter('custpage_tomailresults');
				var checkOGprinttwo = JSON.parse(checkOriginaltwo);
				for (var k = 0; k<checkOGprinttwo.length; k++) {
					  
					  toSendchecktwo.push ({
						  		documentID : checkOGprinttwo[k].docID,
					            mail: checkOGprinttwo[k].contMail,
					            customerID : checkOGprinttwo[k].customerID,
					            printType : checkOGprinttwo[k].printType
					  });

					}
			
			for (var i = 0; i < toSendchecktwo.length; i++) {

				  var p_somedocIDstwo = toSendchecktwo[i].documentID;
				  var p_someprintTypetwo = toSendchecktwo[i].printType;


				  if(request.getParameter('custpage_ilo_checkifprintormail') != 'mail') {
				  if(p_someprintTypetwo == 'c'){
					  nlapiSubmitField('invoice', p_somedocIDstwo, 'custbody_ilo_org_printed', 'T');
				  } 
				  }
			
			}
			

		
		response.writePage(lastForm);		
		
	};

	
	 

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


function invSearch(inp_fromDate,inp_toDate,batchNumber,subsid) {
	
   
	//get contact emails
	var currContactEmail = [];

	//get invoices
	var loadSearchFilters = new Array();
	loadSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'anyof', searchLoad);
	loadSearchFilters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	loadSearchFilters[2] = new nlobjSearchFilter( 'subsidiary', null, 'is', subsid)
	loadSearchFilters[3] = new nlobjSearchFilter('status', null, 'anyof', ['CustInvc:A','CustInvc:B']);
	
	var batchLoadFilters = new Array();
	batchLoadFilters[0] = new nlobjSearchFilter('trandate', null, 'onorafter', inp_fromDate);
	batchLoadFilters[1] = new nlobjSearchFilter('trandate', null, 'onorbefore', inp_toDate);
	batchLoadFilters[2] = new nlobjSearchFilter('custbody_upload_batch', null, 'contains', batchNumber);
	batchLoadFilters[3] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	batchLoadFilters[4] = new nlobjSearchFilter( 'subsidiary', null, 'is', subsid)
	batchLoadFilters[5] = new nlobjSearchFilter('status', null, 'anyof', ['CustInvc:A','CustInvc:B']);
	
	var filtersInvoice = new Array();
	filtersInvoice[0] = new nlobjSearchFilter('trandate', null, 'onorafter', inp_fromDate);
	filtersInvoice[1] = new nlobjSearchFilter('trandate', null, 'onorbefore', inp_toDate);
    filtersInvoice[2] = new nlobjSearchFilter('status', null, 'anyof', ['CustInvc:A','CustInvc:B']);
    filtersInvoice[3] = new nlobjSearchFilter('mainline', null, 'is', 'T');
    filtersInvoice[4] = new nlobjSearchFilter( 'subsidiary', null, 'is', subsid)

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

	if(isBatch != false) {
		filtersInvoice = batchLoadFilters;
	}
	
	if(resArr != null) {
		filtersInvoice = loadSearchFilters;
	}
	


	var s = nlapiSearchRecord('transaction', null, filtersInvoice, columnsInvoice);
	
	if(s != null) {
for(var i = 0; i<s.length; i++) {
	
	printType = request.getParameter('custpage_printtype_select');
	
	var custEmails =  s[i].getValue('custentity_2663_email_address_notif', 'customer');
	var salesRepEmails = s[i].getValue('custentity_sbtech_salesrep_email', 'customer');

toPrintArr[s[i].id] = {
		p_tranid : s[i].getValue('tranid'),
		p_trantype : s[i].getValue('type'),
		p_trandate : s[i].getValue('trandate'),
		p_customerName: s[i].getText('entity'),
		p_totalAmt: s[i].getValue('total'),
		p_totalTax: s[i].getValue('taxtotal'),
		p_exchangeRate : s[i].getValue('exchangerate'),
		p_contactEmail :custEmails.replace(/;/g , ","),
		p_salesRepEmail : salesRepEmails.replace(/;/g , ","),
		p_customerID : s[i].getValue('entity'),
		p_printType : printType
	};

}
nlapiLogExecution("DEBUG", 'toPrintArr', JSON.stringify(toPrintArr['9192']));
	}//end of if(s != null)


invoiceArr = Object.keys(toPrintArr);

}





function getAllInvContacts(customerRecs) {
	
	var customerEmailArr = {};

	var searchContacts = nlapiLoadSearch(null,'customsearch_ilo_contact_search_all');
	searchContacts.addFilter(new nlobjSearchFilter( 'company', null, 'anyof', customerRecs));

	var allcontacts = [];
	var invContacts = [];
	var resultContacts = [];
	var searchid = 0;
	var resultset = searchContacts.runSearch();
	var rs;

	var tranName;
	var tranNameArr;
	var invTranID;

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allcontacts
					.push(resultContacts[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allcontacts != null) {
		allcontacts.forEach(function(line) {

			if(line.getValue('contactrole') == '1' || '-10') {

			invContacts.push({

					contact_id : line.getValue('internalid'),
					contact_name : line.getValue('entityid'),
					contact_company_id : line.getValue('company'),
					contact_company_name : line.getText('company'),
					contact_email : line.getValue('email'),
					contact_phone : line.getValue('phone'),
					contact_role : line.getValue('contactrole')

			});
		}//if(line.getValue('contactrole') == '1' || '-10') - making sure the contact role is Invoice CC
		});

	};
	
		customerRecs.forEach(function(customerid) {

		customerEmailArr[customerid] = [];

		});
		
		var keys = Object.keys(customerEmailArr)
		
		if(customerEmailArr != null) {
		
	for (var i = 0; i < invContacts.length; i++) {
	

			for (var x = 0; x < keys.length; x++) {
				
				if (invContacts[i].contact_company_id == keys[x]) {

					customerEmailArr[keys[x]][customerEmailArr[keys[x]].length ] = invContacts[i].contact_email;

					}
					customerEmailArr[keys[x]][customerEmailArr[keys[x]].length]
				}
		
		}
		
		}
	

	

	return customerEmailArr;

}

function flattenArr(arr) {

var str = '';

for(var i = 0; i<arr.length; i++) {

str += arr[i]+',';

}

var result = str.slice(0, -1);
return result;
}

function getCustomerRecIDS(invoiceArr) {

	var arr = [];

		var cols = new Array();
		cols[0] = new nlobjSearchColumn('entity');

		
		var fils = new Array();
		fils[0] = new nlobjSearchFilter('internalid', null, 'anyof', invoiceArr);
		fils[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
		
		
		var s = nlapiSearchRecord('transaction', null, fils, cols);
		
		if(s != null) {
		
		for(var i = 0; i<s.length; i++) {
		
		
			arr.push(s[i].getValue('entity'))
		}
		

		
		}


	return arr;

	}

function downloadData(data, response, form) {
    // set content type, file name, and content-disposition (inline means display in browser)
	response.setEncoding('UTF-8');
    response.setContentType('PLAINTEXT', 'test.txt');
    // write response to the client
    response.write(data);
}
