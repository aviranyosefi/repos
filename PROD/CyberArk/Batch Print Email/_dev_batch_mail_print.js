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
var inp_fromDate;
var inp_toDate;
var inp_printOrMail; 
var printType; 
var context = nlapiGetContext();
var checkIfPrintorMail;


function multiple_print_suitelet(request, response) {
 
    if (request.getMethod() == 'GET') {
        
        nlapiLogExecution('DEBUG', 'stage one', 'stage one');
 
        var form = nlapiCreateForm('Print Multiple Invoices');
        //form.setScript('customscript_ilo_multi_search_result_cs');
        form.addSubmitButton('Next');
        //form.setScript('customscript_ilo_savemulti_searchres_cs');
 
        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');
 
        var selectSubsidiary = form.addField('custpage_ilo_multi_subsidiary', 'select', 'Subsidary', 'SUBSIDIARY', 'custpage_ilo_searchdetails');
        //selectSubsidiary.setDefaultValue('14');
        selectSubsidiary.setMandatory(true);
        var currency = form.addField('custpage_ilo_multi_currency', 'select', 'Currency', 'CURRENCY', 'custpage_ilo_searchdetails');
 
        var customer = form.addField('custpage_ilo_multi_customer', 'select', 'Customer', 'CUSTOMER', 'custpage_ilo_searchdetails');
        //customer.setDefaultValue('228');
 
        var printOrMail = form.addField('custpage_printormail_select', 'select', 'Print or Mail', null, 'custpage_ilo_searchdetails');
        printOrMail.addSelectOption('a', 'Print');
        printOrMail.addSelectOption('b', 'Mail');
        var fromDate = form.addField('custpage_ilo_multi_fromdate', 'date', 'From Date', null, 'custpage_ilo_searchdetails');
        fromDate.setDefaultValue('01/01/19');
        fromDate.setLayoutType('normal', 'startcol');
        fromDate.setMandatory(true);
 
        var toDate = form.addField('custpage_ilo_multi_todate', 'date', 'To Date', null, 'custpage_ilo_searchdetails');
        toDate.setDefaultValue('01/01/20');
        toDate.setMandatory(true);
        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');
 
 
        response.writePage(form);
 
    }
 
 
    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');
 
        var formTitle = 'Choose Documents to Print';
        var customerEmail = ' ';
 
 
        inp_subsidiary = request.getParameter('custpage_ilo_multi_subsidiary');
        inp_currency = request.getParameter('custpage_ilo_multi_currency');
        inp_customer = request.getParameter('custpage_ilo_multi_customer');
        inp_fromDate = request.getParameter('custpage_ilo_multi_fromdate');
        inp_toDate = request.getParameter('custpage_ilo_multi_todate');
        inp_printOrMail = request.getParameter('custpage_printormail_select');
       
      
        invSearch(inp_subsidiary, inp_currency, inp_customer, inp_fromDate, inp_toDate, inp_printOrMail);
 
        if (request.getParameter('custpage_printormail_select') == 'b') { //mail
 
            formTitle = 'Choose Documents to Mail';
        };
 
        
        var printChoiceForm = nlapiCreateForm(formTitle);
       
 
        checkIfPrintorMail = printChoiceForm.addField('custpage_ilo_checkifprintormail', 'text', null);
        checkIfPrintorMail.setDisplayType('hidden');
        checkIfPrintorMail.setDefaultValue('print');
 
        var subsidiary = printChoiceForm.addField('custpage_ilo_subsidiary', 'text', null);
        subsidiary.setDisplayType('hidden');
        subsidiary.setDefaultValue(inp_subsidiary);
        //SubList start
        var resultsSubList = printChoiceForm.addSubList('custpage_results_sublist', 'list', invoiceArr.length +' Results', null);
        
        var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
                  
        var res_TranId = resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Document Number');
       
        var res_TranType = resultsSubList.addField('custpage_resultssublist_trantype', 'text', 'Type');
        
        var res_TranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'date', 'Date');
   
        var res_subsid = resultsSubList.addField('custpage_resultssublist_subsidiary', 'text', 'Subsidiary');
 
        var res_Customer = resultsSubList.addField('custpage_resultssublist_customer', 'text', 'Customer');
      
      	var res_sent_issue_by = resultsSubList.addField('custpage_cbr_invoice_sent_issue_by', 'text', 'Invoice to be uploaded to Portal');
 
        var res_currency = resultsSubList.addField('custpage_resultssublist_currency', 'text', 'Currency');
 
        var res_duedate = resultsSubList.addField('custpage_resultssublist_duedate', 'text', 'Due Date').setDisplayType('hidden');
 
	
		var res_CustomerID = resultsSubList.addField('custpage_resultssublist_customerid', 'text', 'CustomerID');
        res_CustomerID.setDisplayType('hidden');
 
 
        if (request.getParameter('custpage_printormail_select') == 'b') { //mail
            var res_CustomerMail = resultsSubList.addField('custpage_resultssublist_contactmail', 'text', 'Recipient');
            //res_CustomerMail.setDefaultValue(customerEmail);
            checkIfPrintorMail.setDefaultValue('mail');
            
 
        };
 
 
        var res_TotalAmt = resultsSubList.addField('custpage_resultssublist_totalamt', 'currency', 'Total Amount');
 
 
        var docID = resultsSubList.addField('custpage_resultssublist_docid', 'text', 'ID').setDisplayType('hidden');
		
		 resultsSubList.addField('custpage_resultssublist_btach', 'text', 'PS BILLING BATCH');
		 
		 resultsSubList.addField('custpage_resultssublist_opp', 'text', 'OPPORTUNITY NUMBER');
 
 
        for (var j = 0; j < invoiceArr.length; j++) {
     
            if (toPrintArr[invoiceArr[j]].p_trantype == 'CustInvc') {
                toPrintArr[invoiceArr[j]].p_trantype = 'Invoice';
            } else { toPrintArr[invoiceArr[j]].p_trantype = 'Credit Memo';}
        
 
           if (request.getParameter('custpage_printormail_select') == 'b') {
                if (toPrintArr[invoiceArr[j]].p_contactEmail != 'empty') resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', j + 1, 'T');
                else resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', j + 1, 'F')
            }
            else { resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', j + 1, 'T')}
            resultsSubList.setLineItemValue('custpage_resultssublist_tranid', j + 1, toPrintArr[invoiceArr[j]].p_tranid);
            resultsSubList.setLineItemValue('custpage_resultssublist_trantype', j + 1, toPrintArr[invoiceArr[j]].p_trantype);
            resultsSubList.setLineItemValue('custpage_resultssublist_trandate', j + 1, toPrintArr[invoiceArr[j]].p_trandate);
            resultsSubList.setLineItemValue('custpage_resultssublist_customer', j + 1, toPrintArr[invoiceArr[j]].p_customerName);
            resultsSubList.setLineItemValue('custpage_resultssublist_subsidiary', j + 1, subsidName(toPrintArr[invoiceArr[j]].p_subsidiary));
     
            resultsSubList.setLineItemValue('custpage_resultssublist_duedate', j + 1, toPrintArr[invoiceArr[j]].p_duedate);
            if (request.getParameter('custpage_printormail_select') == 'b') {
               
                var mails = resultsSubList.setLineItemValue('custpage_resultssublist_contactmail', j + 1, toPrintArr[invoiceArr[j]].p_contactEmail);
                //if (toPrintArr[invoiceArr[j]].p_contactEmail == 'empty') mails.
                
            };
			resultsSubList.setLineItemValue('custpage_resultssublist_customerid', j + 1, toPrintArr[invoiceArr[j]].p_customerID);
            resultsSubList.setLineItemValue('custpage_resultssublist_totalamt', j + 1, toPrintArr[invoiceArr[j]].p_totalAmt / toPrintArr[invoiceArr[j]].p_exchangeRate);
            //resultsSubList.setLineItemValue('custpage_resultssublist_totaltax', j + 1, toPrintArr[invoiceArr[j]].p_totalTax / toPrintArr[invoiceArr[j]].p_exchangeRate);
            //resultsSubList.setLineItemValue('custpage_resultssublist_printtype', j + 1, toPrintArr[invoiceArr[j]].p_printType);
            resultsSubList.setLineItemValue('custpage_resultssublist_docid', j + 1, invoiceArr[j]);
            resultsSubList.setLineItemValue('custpage_resultssublist_currency', j + 1, toPrintArr[invoiceArr[j]].p_currency);
			resultsSubList.setLineItemValue('custpage_resultssublist_btach', j + 1, toPrintArr[invoiceArr[j]].p_batch);
			resultsSubList.setLineItemValue('custpage_resultssublist_opp', j + 1, toPrintArr[invoiceArr[j]].p_opp);
         	resultsSubList.setLineItemValue('custpage_cbr_invoice_sent_issue_by', j + 1, toPrintArr[invoiceArr[j]].p_sent_issue_by);
			
           
     
        }
        printChoiceForm.setScript('customscriptxx');
        resultsSubList.addMarkAllButtons(); 
        //resultsSubList.addRefreshButton();
        var saveBtn = printChoiceForm.addSubmitButton('Execute');
 
        response.writePage(printChoiceForm); //not writing any values to screen
 
 
    }//end of first else
    else {
      
        nlapiLogExecution('DEBUG', 'stage 3', 'stage 3');
        var lastFormName = 'Ready for Print';
 
        var type = request.getParameter('custpage_ilo_checkifprintormail');
        nlapiLogExecution('DEBUG', 'type', type);
        var InvArr = [];
        var checkBox,id, customer;
        var InvNo = request.getLineItemCount('custpage_results_sublist')
        
        for (var x = 1; x <= InvNo; x++) {          
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', x);   
          
            if (checkBox == 'T') {
                id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_docid', x)
                typeRec = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trantype', x)
				customer =request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_customerid', x)
                
                if (type == 'print') { InvArr.push({ id: id, type : typeRec, customerID : customer}); }
                else InvArr.push({
                    id: id,
                    mail: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_contactmail', x),
                    type: typeRec,
                    invoiceNo: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_tranid', x),
                    amount: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_totalamt', x),
                    currency: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_currency', x),
                    duedate: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_duedate', x),
                    trandate: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trandate', x),
                    customer: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_customer', x),
                    subsidiary: request.getParameter('custpage_ilo_subsidiary'),                    
                    customerID: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_customerid', x),
                    
                    
                });
            }
            //nlapiLogExecution('DEBUG', 'InvArr', InvArr.id + 'type : ' + InvArr.type);
        }
        nlapiLogExecution('DEBUG', 'InvArr', InvArr.length);
 
       
      
        
        if (type == 'mail') {
 
            nlapiScheduleScript('customscript_dev_batch_mail_print_ss', 'customdeploy_dev_batch_mail_print_ss_dep',
                { custscript_ss_emails_data: JSON.stringify(InvArr)});
 
            lastFormName = 'Documents Sent'; 

        }
      
        var lastForm = nlapiCreateForm(lastFormName);
     
 
        if (type == 'print') {
            var subsidiary = request.getParameter('custpage_ilo_subsidiary');
            multiplePrint(InvArr, subsidiary);
            var baseURL = 'https://4678143.app.netsuite.com/'
            var linkprintChoiceForm = lastForm.addField("custpage_ilo_download_invoices", "inlinehtml", "", null, null);
            linkprintChoiceForm.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + mainPDF + '><b>Download Batch for Print</b></a>'); //url of pdf from filecabinet
 
        }
 
   
        response.writePage(lastForm);
    };
};
 
function multiplePrint(invoiceArr, subsidiary) {
    nlapiLogExecution('debug', 'number invoices to print ', invoiceArr.length);
   nlapiLogExecution('debug', 'subsidiary ', subsidiary);
      nlapiLogExecution('debug', 'InvArr ', JSON.stringify(invoiceArr));
   
  
    //concatenate all parts of xml file          
    var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";

    xml += "<pdfset>";

    
    var typeRec = 'invoice';
    for (var i = 0; i < invoiceArr.length; i++) {
        try {
			 var countrySegment = nlapiLookupField('customer', invoiceArr[i].customerID, 'custentity_cseg_cbr_countries')
            typeRec = 'invoice';
           if (invoiceArr[i].type == 'Credit Memo') { typeRec ='creditmemo'}
           else{
			   if(subsidiary ==  '22' && countrySegment == '73'){
				   var israeli = true;
			   nlapiSubmitField( 'invoice', invoiceArr[i].id, 'custbody_batch_hebrew_print', 2); 
			   }
		   }
           var attachment = nlapiPrintRecord('TRANSACTION', invoiceArr[i].id, 'PDF', null);
           
           //
           attachment.setFolder(452425);
           //Set Available without login to true
           attachment.setIsOnline(true);
           
           //store file in cabinet
           var fileID = nlapiSubmitFile(attachment);
           
           // load the file to get its URL
           var fileURL = nlapiLoadFile(fileID).getURL();
           var pdf_fileURL = nlapiEscapeXML(fileURL);
           //

           // get ps details - start
           nlapiLogExecution('debug', 'invoiceArr[i].id' , invoiceArr[i].id);
           var custbody_ps_details_print = nlapiLookupField ( 'invoice' , invoiceArr[i].id , 'custbody_ps_details_print'  )
           nlapiLogExecution('debug', 'custbody_ps_details_print' , custbody_ps_details_print);
           if(typeRec == 'invoice' &&  custbody_ps_details_print != null &&  custbody_ps_details_print != ''){ 
         
               var psPage = createPSDetailPage(invoiceArr[i].id);    				   
               var psDetailsPDF = downloadDataPDF( invoiceArr[i].id,psPage, response, true); //print pdf		  	
               var psDetailsURL = nlapiLoadFile(psDetailsPDF).getURL() ;		     
               var pdf_ps ='';
               pdf_ps = nlapiEscapeXML(psDetailsURL);
		
   	  
               xml += "<pdf src='"+ pdf_fileURL +"'/>";
               xml += "<pdf src='"+ pdf_ps +"'/>";
            }
            else xml += "<pdf src='"+ pdf_fileURL +"'/>";
			
			if(israeli){
			   nlapiSubmitField( 'invoice', invoiceArr[i].id, 'custbody_batch_hebrew_print', 1); 
			}
 
            var context = nlapiGetContext();
            var usageRemaining = context.getRemainingUsage();
            if (usageRemaining < 50) {
                alert('There are too many results for this search, therefore some invoices have been ommitted. For a more precise result, please narrow your date range');
                break;
            }
        }
        catch (e) {
            nlapiLogExecution('ERROR', 'error pdfbuild - invoice id:' + invoiceArr[i] + ' ', e);
        }
    };
    xml += "</pdfset>";
    
    //convert xml file back to pdf
    var pdf = nlapiXMLToPDF(xml);
 
    //save pdf in filecabinet
    var multipleINV_pdf = nlapiCreateFile('Print.pdf', 'PDF', pdf.getValue());
    multipleINV_pdf.setFolder('-15');
    var printFileID = nlapiSubmitFile(multipleINV_pdf);
    mainPDF = nlapiLoadFile(printFileID).getURL(); //get url of pdf from filecabinet            
};
 
function invSearch(inp_subsidiary, inp_currency, inp_customer, inp_fromDate, inp_toDate, inp_printOrMail) {
 
        //get contact emails
        var currContactEmail = [];
        
        var filter = new Array();
        filter[0] = new nlobjSearchFilter( 'custentity_ncs_contact_distrib_list', null, 'is', 'T')


        var cols = new Array();
        cols[0] = new nlobjSearchColumn('email');
        cols[1] = new nlobjSearchColumn('company');
        var contactSearch = nlapiCreateSearch('contact', filter, cols);
		//		
        var  contacrunSearch = contactSearch.runSearch();
        var emailRes = [];
        var searchid = 0;
        do {
            var resultslice = contacrunSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                emailRes.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice.length >= 1000);
		
		//
   
        var filtersInvoice = new Array();
        filtersInvoice[0] = new nlobjSearchFilter('trandate', null, 'onorafter', inp_fromDate);
        filtersInvoice[1] = new nlobjSearchFilter('trandate', null, 'onorbefore', inp_toDate);
        filtersInvoice[2] = new nlobjSearchFilter('mainline', null, 'is', 'T');
        filtersInvoice[3] = new nlobjSearchFilter('type', null, 'anyof', ['CustInvc','CustCred']);
        filtersInvoice[4] = new nlobjSearchFilter('custbody_batch_result', null, 'isnot', 'success');
		//filtersInvoice[5] = new nlobjSearchFilter('custbody_batch_date', null, 'isempty', null);
 
    if (inp_subsidiary != "") filtersInvoice.push(new nlobjSearchFilter('subsidiary', null, 'is', inp_subsidiary));
    
    if (inp_currency != "") filtersInvoice.push(new nlobjSearchFilter('currency', null, 'anyof', inp_currency));
        if (inp_customer != "") filtersInvoice.push(new nlobjSearchFilter('entity', null, 'anyof', inp_customer));
 
 
        var columnsInvoice = new Array();
        columnsInvoice[0] = new nlobjSearchColumn('internalid').setSort(true);
        columnsInvoice[1] = new nlobjSearchColumn('tranid');
        columnsInvoice[2] = new nlobjSearchColumn('type');
        columnsInvoice[3] = new nlobjSearchColumn('trandate');
        columnsInvoice[4] = new nlobjSearchColumn('entity');
        columnsInvoice[5] = new nlobjSearchColumn('total');
        columnsInvoice[6] = new nlobjSearchColumn('taxtotal');
        columnsInvoice[7] = new nlobjSearchColumn('exchangerate');
        columnsInvoice[8] = new nlobjSearchColumn('subsidiary');
        columnsInvoice[9] = new nlobjSearchColumn('currency');
        columnsInvoice[10] = new nlobjSearchColumn('email', 'customer');
        columnsInvoice[11] = new nlobjSearchColumn('duedate');
		columnsInvoice[12] = new nlobjSearchColumn('custbody_ps_billing_batch');
		columnsInvoice[13] = new nlobjSearchColumn('custbody_cbr_so_opp_num');
  		columnsInvoice[14] = new nlobjSearchColumn('custbody_cbr_invoice_sent_issue_by');
 
 
        var search = nlapiCreateSearch('transaction', filtersInvoice, columnsInvoice);
        var runSearch = search.runSearch();
        var s = [];
        var searchid = 0;
        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice.length >= 1000);
 
    
 
    if (s != null) {
 
        for (var i = 0; i < s.length; i++) {
 
            currContactEmail = [];
 
            if (emailRes != null) {
 
                for (var j = 0; j < emailRes.length; j++) {
                    if (emailRes[j].getText('company') == s[i].getText('entity')) {
                        currContactEmail.push(emailRes[j].getValue('email'));
                        
                    }
                }
                currContactEmail.push(s[i].getValue('email', 'customer'))
            }
            if (currContactEmail == "" || currContactEmail.length ==0 ) currContactEmail = 'empty';
            
 
            toPrintArr[s[i].id] = {
                p_tranid: s[i].getValue('tranid'),
                p_trantype: s[i].getValue('type'),
                p_trandate: s[i].getValue('trandate'),
                p_customerName: s[i].getText('entity'),
                p_totalAmt: s[i].getValue('total'),
                p_totalTax: s[i].getValue('taxtotal'),
                p_exchangeRate: s[i].getValue('exchangerate'),
                p_customerID: s[i].getValue('entity'),
                p_subsidiary: s[i].getText('subsidiary'),
                p_currency: s[i].getText('currency'),
                p_contactEmail: currContactEmail,
                p_duedate: s[i].getValue('duedate'),
				p_batch : s[i].getValue('custbody_ps_billing_batch'),
				p_opp : s[i].getValue('custbody_cbr_so_opp_num'),
                p_sent_issue_by : s[i].getText('custbody_cbr_invoice_sent_issue_by'),
				
 
 
            };
 
        }
       
    }
 
 
    invoiceArr = Object.keys(toPrintArr);
}
 
function subsidName(str) {
 
    var res = str.split(":");
    var fullname = res[1];
    fullname = fullname.substr(1);
 
    return fullname;
 
}



function createPSDetailPage(invoiceID) {
	
	 
    var invoiceRecord = nlapiLoadRecord('invoice', invoiceID)
    var psDetails = invoiceRecord.getFieldValue('custbody_ps_details_print');


    var _supp_comment = '';
    var invoiceNum = invoiceRecord.getFieldValue('tranid');
    var invoiceSubsid = invoiceRecord.getFieldValue('subsidiary');
    if(invoiceSubsid == '18') { //USA Subsidiary
    
    _supp_comment = nlapiLookupField('subsidiary', invoiceSubsid, 'custrecord_ps_supplement_comment')
    }

    var temp = nlapiLoadFile('985331').getValue();
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
        line += '<td colspan="3" class="center">' + arr[x].startDate + '</td>';
        line += '<td colspan="3" class="center">' + arr[x].endDate + '</td>';
        line += '<td colspan="2" class="center">' + arr[x].duration + '</td>';
        line += '<td colspan="4" class="center">' + arr[x].psDay + '</td>';
        line += '<td colspan="3" class="center">' + arr[x].location_type + '</td>';
        line += '<td colspan="5" class="center">' + arr[x].service_type + '</td>';
        line += '<td colspan="5" class="center">' + arr[x].timecard + '</td></tr>';
    
    dynList += line;

}
    
var allTemplate = head+dynList+restOfTemplate.toString();

    
var pattern = /_invoice_number|_supp_comment/ig;

                                         
                                   //PS Detail Information Information
                                   var _invoice_number = invoiceNum;

                                   
                                   var mapObj = {
                                           _invoice_number : _invoice_number,
                                           _supp_comment : _supp_comment

                                   
                             };
                                   

                                         var str = allTemplate.replace(/\{\{(.*?)\}\}/g, function(i, match) {
                                             return mapObj[match];
                                         });
                       
                           
                                         //must clean all amps
                                       //var clean = str.replaceAll("&", "&amp;");

     
    
   
   return str;
}


function isOdd(num) { 
	return num % 2;
	}
 


function downloadDataPDF(invID,data, response, asAttachment) {
    try{
        if(asAttachment == false) {

        var file = nlapiXMLToPDF(data);
        response.setEncoding('UTF-8');
        response.setContentType('PDF', 'test.pdf');
        file.setFolder(192811)
        file.setIsOnline(true)
        var FileID = nlapiSubmitFile(file)
        return FileID;		
        }

        if(asAttachment == true) {
      
        var file = nlapiXMLToPDF(data);
        file.setEncoding('UTF-8');
        file.setName(invID+'.pdf');
        file.setFolder(192811)
        file.setIsOnline(true)

        ///



        ///
      
        var FileID = nlapiSubmitFile(file)
        return FileID;

        }
    }catch(e){
        nlapiLogExecution('debug', 'error', e) 
    }
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
	
	String.prototype.replaceAll = function(search, replacement) {
                var target = this;
                return target.replace(new RegExp(search, 'g'), replacement)
}

}
