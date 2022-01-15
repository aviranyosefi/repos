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
function multiple_print_suitelet(request, response) {

    if (request.getMethod() == 'GET') {
        
        nlapiLogExecution('DEBUG', 'stage one', 'stage one');

        var form = nlapiCreateForm('Print Multiple Invoices');
        //form.setScript('customscript_ilo_multi_search_result_cs');
        form.addSubmitButton('Load');
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

        var toDate = form.addField('custpage_ilo_multi_todate', 'date', 'To Date', null, 'custpage_ilo_searchdetails');
        toDate.setDefaultValue('01/01/20');

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
        var resultsSubList = printChoiceForm.addSubList('custpage_results_sublist', 'list', 'Results', null);
        
        var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
 	    
        var res_TranId = resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Document Number');
       
        var res_TranType = resultsSubList.addField('custpage_resultssublist_trantype', 'text', 'Type');
        
        var res_TranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'date', 'Date');
   
        var res_subsid = resultsSubList.addField('custpage_resultssublist_subsidiary', 'text', 'Subsidiary');

        var res_Customer = resultsSubList.addField('custpage_resultssublist_customer', 'text', 'Customer');

        var res_currency = resultsSubList.addField('custpage_resultssublist_currency', 'text', 'Currency');

        var res_duedate = resultsSubList.addField('custpage_resultssublist_duedate', 'text', 'Due Date').setDisplayType('hidden');

  

        if (request.getParameter('custpage_printormail_select') == 'b') { //mail
            var res_CustomerMail = resultsSubList.addField('custpage_resultssublist_contactmail', 'text', 'Recipient');
            res_CustomerMail.setDefaultValue(customerEmail);
            checkIfPrintorMail.setDefaultValue('mail');
            var res_CustomerID = resultsSubList.addField('custpage_resultssublist_customerid', 'text', 'CustomerID');
            res_CustomerID.setDisplayType('hidden');


        };


        var res_TotalAmt = resultsSubList.addField('custpage_resultssublist_totalamt', 'currency', 'Total Amount');


        var docID = resultsSubList.addField('custpage_resultssublist_docid', 'text', 'ID').setDisplayType('hidden');


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
                resultsSubList.setLineItemValue('custpage_resultssublist_customerid', j + 1, toPrintArr[invoiceArr[j]].p_customerID);
            };
            resultsSubList.setLineItemValue('custpage_resultssublist_totalamt', j + 1, toPrintArr[invoiceArr[j]].p_totalAmt / toPrintArr[invoiceArr[j]].p_exchangeRate);
            //resultsSubList.setLineItemValue('custpage_resultssublist_totaltax', j + 1, toPrintArr[invoiceArr[j]].p_totalTax / toPrintArr[invoiceArr[j]].p_exchangeRate);
            //resultsSubList.setLineItemValue('custpage_resultssublist_printtype', j + 1, toPrintArr[invoiceArr[j]].p_printType);
            resultsSubList.setLineItemValue('custpage_resultssublist_docid', j + 1, invoiceArr[j]);
            resultsSubList.setLineItemValue('custpage_resultssublist_currency', j + 1, toPrintArr[invoiceArr[j]].p_currency);
           
     
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
        var checkBox,id;
        var InvNo = request.getLineItemCount('custpage_results_sublist')
        
        for (var x = 1; x <= InvNo; x++) {          
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', x);   
          
            if (checkBox == 'T') {
                id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_docid', x)
                typeRec = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trantype', x)
                
                if (type == 'print') { InvArr.push({ id: id, type: typeRec }); }
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
                    
                    
                });
            }
            //nlapiLogExecution('DEBUG', 'InvArr', InvArr.id + 'type : ' + InvArr.type);
        }
        nlapiLogExecution('DEBUG', 'InvArr', InvArr.length);

       
      
        
        if (type == 'mail') {

            nlapiScheduleScript('customscript_batchprint_suitelet_ss', 'customdeploy_batchprint_suitelet_ss_dep',
                { custscript_splitit_ss_emails_data: JSON.stringify(InvArr)});

            lastFormName = 'Documents Sent'; 

            //var subsidiary = request.getParameter('custpage_ilo_subsidiary');
            //lastFormName = 'Documents Sent'; 
            //var mail;
            //var subRec = nlapiLoadRecord('subsidiary', subsidiary)
            //var subject = subRec.getFieldValue('custrecord_batch_subject_mail');
            //var body = subRec.getFieldValue('custrecord_batch_body_mail');
            //var body_mail;
            //var customer;

            //var employee = nlapiGetContext();
            //var employeeId = employee.user;

            //for (var i = 0; i < InvArr.length; i++) {  
            //    mail = InvArr[i].mail.split(",")                          
            //    var firstMail = mail.shift();
            //    body_mail = body;
            //    customer = InvArr[i].customer;
            //    body_mail = body_mail.replace("(Merchant Name)", customer.replace(/[0-9]/g, ""));
            //    body_mail = body_mail.replace("(INV #)", "#" + InvArr[i].invoiceNo);
            //    body_mail = body_mail.replace("(Currency + Amount)", InvArr[i].currency + " " + parseFloat(InvArr[i].amount).toFixed(2) + " ");
            //    body_mail = body_mail.replace("(Currency + Amount)", InvArr[i].currency + " " + parseFloat(InvArr[i].amount).toFixed(2) + " ");
            //    if (InvArr[i].type == 'Invoice') { body_mail = body_mail.replace("(Due Date)", InvArr[i].duedate); }
            //    else { body_mail = body_mail.replace("(Due Date)", InvArr[i].trandate)} 
               

            //    //
            //    nlapiLogExecution('DEBUG', 'InvArr[i].id', InvArr[i].id);
            //    var emailAttachmentreturnSearchResults = [];
            //    var checkForAttachmentreturnSearchResults = getInvoiceAttachments(InvArr[i].id);
            //    if (checkForAttachmentreturnSearchResults != null || checkForAttachmentreturnSearchResults != undefined || checkForAttachmentreturnSearchResults != []) {

            //        for (var s = 0; s < checkForAttachmentreturnSearchResults.length; s++) {
            //            try {
                           
            //                var attachRecID = checkForAttachmentreturnSearchResults[s].fileID                  
            //                var attachFileObj = nlapiLoadFile(attachRecID)

            //                emailAttachmentreturnSearchResults.push(attachFileObj)

            //            } catch (err) {
            //                continue;
            //            }
            //        }

            //    }

            //    //

            //    var attachment = nlapiPrintRecord('TRANSACTION', InvArr[i].id, 'PDF', null);
            //    emailAttachmentreturnSearchResults.push(attachment)
            //    nlapiSendEmail(employeeId, firstMail, subject, body_mail, mail, null, null, emailAttachmentreturnSearchResults);
            //    var today = nlapiDateToString(new Date());
            //    var typeRec = 'invoice';
            //    if (InvArr[i].type == 'Credit Memo') { typeRec = 'creditmemo' }
            //    nlapiSubmitField(typeRec, InvArr[i].id, 'custbody_batch_date', today);

            //}

        }
      
        var lastForm = nlapiCreateForm(lastFormName);
     

        if (type == 'print') {
            var subsidiary = request.getParameter('custpage_ilo_subsidiary');
            multiplePrint(InvArr, subsidiary);
            var baseURL = 'https://4821946.app.netsuite.com/'
            var linkprintChoiceForm = lastForm.addField("custpage_ilo_download_invoices", "inlinehtml", "", null, null);
            linkprintChoiceForm.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + mainPDF + '><b>Download Batch for Print</b></a>'); //url of pdf from filecabinet

        }

   
        response.writePage(lastForm);
    };
};

function multiplePrint(invoiceArr, subsidiary) {
    nlapiLogExecution('debug', 'invoices', invoiceArr.length);
    //get full template and convert to string
    //var temp = nlapiLoadFile('1353').getValue();
    var temp = nlapiLoadFile('950').getValue();
    
    var a = temp.toString();
    //get head tag 
    var first_headTag = a.indexOf("head") - 1;
    var end_headTag = a.indexOf("/head") + 6;
    var head_tag = a.substr(first_headTag, end_headTag - first_headTag);
    //get table tag (actual template of invoice)
    var first_tableTag = a.indexOf("cellpadding") - 18;
    var end_tableTag = a.indexOf("/body") - 6;
    var inv_template = a.substr(first_tableTag, end_tableTag - first_tableTag);

    //load subsidiary address and bank account
    var sub = nlapiLoadRecord('subsidiary', subsidiary);
    var address = sub.getFieldValue('mainaddress_text');
    if (address != null) { address = address.replace(/\n/ig, '<br />'); }

    var bank = sub.getFieldValue('custrecord_invoice_footer');
    if (bank != null) { bank = bank.replace(/\n/ig, '<br />'); }
    



    //concatenate all parts of xml file	
    //var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
    //xml += "<pdf>";

    //xml += head_tag + '<body padding="0.2in 0.5in 0.1in 0.5in" size="A4">';

    var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";

    xml += "<pdfset>";
    
    var typeRec = 'invoice';
    for (var i = 0; i < invoiceArr.length; i++) {
        try {
            typeRec = 'invoice';
            if (invoiceArr[i].type == 'Credit Memo') { typeRec ='creditmemo'}
            //var invoice = nlapiLoadRecord(typeRec, invoiceArr[i].id);
            //var renderer = nlapiCreateTemplateRenderer();
            //renderer.setTemplate(inv_template);
            //renderer.addRecord('record', invoice);
          
            //var rend = renderer.renderToString();
            //rend = rend.replace("addressss", address);
            //rend = rend.replace("bankkk", bank);
            //xml = xml + rend;
            var attachment = nlapiPrintRecord('TRANSACTION', invoiceArr[i].id, 'PDF', null);
            attachment.setFolder('-15');
            //Set Available without login to true
            attachment.setIsOnline(true);

            //store file in cabinet
            var fileID = nlapiSubmitFile(attachment);

            // load the file to get its URL
            var fileURL = nlapiLoadFile(fileID).getURL();
            var pdf_fileURL = nlapiEscapeXML(fileURL);
            xml += "<pdf src='" + pdf_fileURL + "'/>";

       
            //if (i < invoiceArr.length - 1) {
            //    xml = xml + '<pbr/>';
            //}

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
    //xml = xml += '</body></pdf>';

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
        var cols = new Array();
        cols[0] = new nlobjSearchColumn('email');
        cols[1] = new nlobjSearchColumn('company');
        var emailRes = nlapiSearchRecord('contact', null, null, cols);
   
        var filtersInvoice = new Array();
        filtersInvoice[0] = new nlobjSearchFilter('trandate', null, 'onorafter', inp_fromDate);
        filtersInvoice[1] = new nlobjSearchFilter('trandate', null, 'onorbefore', inp_toDate);
        filtersInvoice[2] = new nlobjSearchFilter('mainline', null, 'is', 'T');
        filtersInvoice[3] = new nlobjSearchFilter('type', null, 'anyof', ['CustInvc','CustCred']);
        filtersInvoice[4] = new nlobjSearchFilter('custbody_batch_date', null, 'isempty', null);

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
                        currContactEmail.push(emailRes[j].getValue('email')+',');
                        
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

