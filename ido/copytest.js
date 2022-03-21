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
		var form = nlapiCreateForm('Print Multiple Invoices');
		var subsid = form.addField('custpage_ilo_multi_subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY');
		subsid.setDefaultValue('21');
		subsid.setMandatory(true);
		var docType = form.addField('custpage_ilo_multi_doc', 'select', 'Document');
		docType.addSelectOption('', '');
		docType.addSelectOption('a', 'Invoice');
		docType.addSelectOption('b', 'Credit Memo');
		docType.addSelectOption('c', 'Cash Sale');
		docType.setMandatory(true);
		form.addField('custpage_ilo_multi_customer', 'select', 'Customer', 'CUSTOMER');
		var salesTerr = form.addField('custpage_selectfield', 'select', 'Sales Territory');
		salesTerr.addSelectOption('','');
		var fromDate = form.addField('custpage_ilo_multi_fromdate','date','From Date', null, null);
		fromDate.setDefaultValue('01/01/17');
		fromDate.setLayoutType('normal', 'startcol');
		var toDate = form.addField('custpage_ilo_multi_todate','date','To Date', null, null);
		toDate.setDefaultValue('06/01/17');
		var batchNumber = form.addField('custpage_ilo_multi_batchnumber', 'text', 'Batch #');
		//batchNumber.setLayoutType('normal', 'startcol');
		var printOrMail = form.addField('selectfield','select','Print or Mail');
		printOrMail.addSelectOption('a','Print');
		printOrMail.addSelectOption('b','Mail');

		form.addSubmitButton();
		response.writePage(form);

	} else {
			var toPrintArr = [];

			var p_tranid = '';
			var p_trantype = '';
			var p_trandate = '';
			var p_customerName = '';
			var p_totalAmt = '';
			var p_totalTax = '';
		
		    var invoiceArr = [];
		    var mainPDF = '';
		    
			var inp_subsidiary = request.getParameter('custpage_ilo_multi_subsidiary');
	        var inp_customer = request.getParameter('custpage_ilo_multi_customer'); 
	        var inp_fromDate = request.getParameter('custpage_ilo_multi_fromdate'); 
	        var inp_toDate = request.getParameter('custpage_ilo_multi_todate'); 
	        var inp_salesTerr = request.getParameter('custpage_selectfield'); 
	        var inp_batchNumber = request.getParameter('custpage_ilo_multi_batchnumber'); 
	        var inp_printOrMail = request.getParameter('selectfield'); 
	        var inp_Type = request.getParameter('custpage_ilo_multi_doc');
	        
		nlapiLogExecution('DEBUG', 'values', typeof inp_customer);
		
		//variables for the search
		var selected_Customer = ' ';
		if (inp_customer != '') {
			selected_Customer = inp_customer;
		}
		
		
		
		//types of transactions
//		invoice = ['CustInvc:A','CustInvc:B'];
//		credit_memo = ['CustCred:A', 'CustCred:B'];
//		sales_order = ['SalesOrd:A','SalesOrd:B','SalesOrd:C','SalesOrd:D','SalesOrd:E','SalesOrd:F','SalesOrd:G','SalesOrd:H'];
		
		
		
		if((inp_printOrMail === 'a') && (inp_Type === 'a')) {
			
			function invSearch() {

				var filtersInvoice = new Array();
				filtersInvoice[0] = new nlobjSearchFilter('trandate', null, 'onorafter', inp_fromDate);
				filtersInvoice[1] = new nlobjSearchFilter('trandate', null, 'onorbefore', inp_toDate);
			    filtersInvoice[2] = new nlobjSearchFilter('status', 'null', 'anyof', ['CustInvc:A','CustInvc:B']);
			    filtersInvoice[3] = new nlobjSearchFilter('entity', null, 'anyof', ' ');

				var columnsInvoice = new Array();
				columnsInvoice[0] = new nlobjSearchColumn('internalid').setSort(false);
				columnsInvoice[1] = new nlobjSearchColumn('tranid');
				columnsInvoice[2] = new nlobjSearchColumn('trandate');
				columnsInvoice[3] = new nlobjSearchColumn('entity');
				columnsInvoice[4] = new nlobjSearchColumn('total');
				columnsInvoice[5] = new nlobjSearchColumn('taxtotal');
			

				var s = nlapiSearchRecord('transaction', null, filtersInvoice, columnsInvoice);
				
for(var i = 0; i<s.length; i++) {

			toPrintArr[s[i].id] = {
					p_tranid : s[i].getValue('tranid'),
					p_trantype : s[i].type,
					p_trandate : s[i].getValue('trandate'),
					p_customerName: s[i].getValue('entity'),
					p_totalAmt: s[i].getValue('total'),
					p_totalTax: s[i].getValue('taxtotal')
				};

}

			invoiceArr = Object.keys(toPrintArr);

			}
			invSearch();


					
			
//			function multiplePrint(invoiceArr) {
//				//get full template and convert to string
//					var temp = nlapiLoadFile('8105').getValue();
//					var a = temp.toString();
//				//get head tag 
//					var first_headTag = a.indexOf("head") -1 ; 
//				    var end_headTag = a.indexOf("/head") +6 ; 
//					var head_tag = a.substr(first_headTag, end_headTag - first_headTag);
//				//get table tag (actual template of invoice)
//					var first_tableTag = a.indexOf("cellpadding") -18 ;
//					var end_tableTag = a.indexOf("/body") -6 ;
//					var inv_template = a.substr(first_tableTag, end_tableTag - first_tableTag);
//
//					
//				//concatenate all parts of xml file	
//					var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
//					xml += "<pdf>";
//										
//					xml += head_tag + '<body>';
//							
//					var invoices = invoiceArr;                      
//
//					for(var i = 0; i < invoices.length; i++){
//					var invoice = nlapiLoadRecord('invoice', invoices[i]);
//					var renderer = nlapiCreateTemplateRenderer();
//					renderer.setTemplate(inv_template);
//					renderer.addRecord('record', invoice);
//					xml = xml +  renderer.renderToString();
//					if(i < invoices.length - 1){
//					xml = xml + '<pbr/>';
//					} 
//					} 
//					
//					xml = xml += '</body></pdf>';
//
//				//convert xml file back to pdf
//					var pdf = nlapiXMLToPDF(xml);
//				
//				//save pdf in filecabinet
//					var multipleINV_pdf = nlapiCreateFile('Print.pdf', 'PDF', pdf.getValue());
//					multipleINV_pdf.setFolder('-15');
//			        var printFileID = nlapiSubmitFile(multipleINV_pdf);
//			         mainPDF = nlapiLoadFile(printFileID).getURL(); //get url of pdf from filecabinet	        
//				} 
//				
//				multiplePrint(invoiceArr);
			
			
		} //end of if (inp_printOrMail === 'a')
		
		

	        
	        
	        
	        //endForm creation
			var printChoiceForm = nlapiCreateForm('Choose Documents to Print');
			var lineNum = 1;

			
		    var resultsSubList = printChoiceForm.addSubList('custpage_results_sublist', 'staticlist', 'Results', null);
		    var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
//		    resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', 1 ,'T');	    
		    var res_TranId = resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Document Number');
		    //res_TranId.setDefaultValue('INV03091804');
		    var res_TranType = resultsSubList.addField('custpage_resultssublist_trantype', 'text', 'Type');
//		    res_TranType.setDefaultValue('Invoice');
		    var res_TranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'date', 'Date');
//		    res_TranDate.setDefaultValue('1/11/2017');
		    var res_Customer = resultsSubList.addField('custpage_resultssublist_customer', 'text', 'Customer');
//		    res_Customer.setDefaultValue('697');
		    var res_TotalAmt = resultsSubList.addField('custpage_resultssublist_totalamt', 'currency', 'Total Amount');
//		    res_TotalAmt.setDefaultValue('1000');
		    var res_TotalTax = resultsSubList.addField('custpage_resultssublist_totaltax', 'currency', 'Total Tax');
//		    res_TotalTax.setDefaultValue('1000');
		    var printType = resultsSubList.addField('custpage_resultssublist_printtype', 'select', 'Print');
		    printType.addSelectOption('a', 'Draft');
		    printType.addSelectOption('b', 'Copy');
		    printType.addSelectOption('c', 'Original');
		    
			toPrintArr.forEach(function(inv) {

				nlapiSelectNewLineItem('custpage_results_sublist');
				nlapiSetCurrentLineItemValue('custpage_resultssublist_checkbox', 'T', false, null);
				nlapiSetCurrentLineItemValue('custpage_resultssublist_tranid', inv.p_tranid, false, null);
				nlapiCommitLineItem('custpage_results_sublist');

			});
			
//			var linkprintChoiceForm = endForm.addField("custpage_ilo_download_invoices", "url", "", null, "downloads")
//			.setDisplayType("inline")
//			.setLinkText("Click Here to Download Files")
//			.setDefaultValue(mainPDF); //url of pdf from filecabinet
			
			
	};
	//response.setContentType('PDF', mainPDF, 'inline');
	//var all = JSON.stringify(uniqueArray);
	response.writePage(printChoiceForm); //not writing any values to screen
	
	 

};
