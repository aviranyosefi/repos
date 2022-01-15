function firstMailBatch_ss(type) {

    runTwice();

}

function runTwice() {


    var context = nlapiGetContext();
    var emailJobID = context.getSetting('SCRIPT', 'custscript_ss_emails_data');

    InvArr = JSON.parse(emailJobID);
    nlapiLogExecution('DEBUG', 'emailJobID', emailJobID);
    nlapiLogExecution('DEBUG', 'InvArr length', InvArr.length);



    lastFormName = 'Documents Sent';
    var subsidiary = InvArr[0].subsidiary;
    var mail;

    var employee = nlapiGetContext();
    var employeeId = employee.user;

    nlapiLogExecution('DEBUG', 'subsidiary', subsidiary);
    //var today = nlapiDateToString(new Date());
    var today = new Date();

    for (var i = 0; i < InvArr.length; i++) {

        if (context.getRemainingUsage() < 150) {
            nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
            if (state.status == 'FAILURE') {
                nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
            }
            else if (state.status == 'RESUME') {
                nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
            }
        }
        var CC_mail = [];
        CC_mailObj = InvArr[i].mail.split("\u0005");
        if (subsidiary != '18' && subsidiary != '23') {


            var email = nlapiLookupField('customer', InvArr[i].customerID, 'email');
            if (email != '' && email != null) {
                var firstEMail = email;

                for (var m = 0; m < CC_mailObj.length; m++) {
                    if (CC_mailObj[m] != '' && CC_mailObj[m] != email)
                        CC_mail.push(CC_mailObj[m])
                }
            }
            else {
                var firstEMail = [];
                for (var m = 0; m < CC_mailObj.length; m++) {
                    if (CC_mailObj[m] != '' && CC_mailObj[m] != email)
                        firstEMail.push(CC_mailObj[m])
                }

            }

        }
        else {

            var firstEMail = CC_mailObj.shift();
            for (var m = 0; m < CC_mailObj.length; m++) {
                if (CC_mailObj[m] != '')
                    CC_mail.push(CC_mailObj[m])
            }

        }


        var typeRec = 'invoice';
        if (InvArr[i].type == 'Credit Memo') { typeRec = 'creditmemo' }
        var rec = nlapiLoadRecord(typeRec, InvArr[i].id);
        var employee_id = rec.getLineItemValue('salesteam', 'employee', 1);
        if (employee_id != '' && employee_id != null && employee_id != undefined && subsidiary != '18') {
            var employee_email = nlapiLookupField('employee', employee_id, 'email')
            if (employee_email != '' && employee_email != null && employee_email != undefined) {

                CC_mail.push(employee_email);
            }
        }


        var countrySegment = nlapiLookupField('customer', InvArr[i].customerID, 'custentity_cseg_cbr_countries')

        nlapiLogExecution('DEBUG', 'InvArr[i].invoiceNo', InvArr[i].invoiceNo + ' InvArr[i].id : ' + InvArr[i].id);
        var CommSignPDF = false;

        if (subsidiary == '18' || subsidiary == '23') {  // USA and CANADA

            var subject = 'CyberArk Invoice: ' + InvArr[i].invoiceNo + ' for ' + InvArr[i].customer.substring(InvArr[i].customer.indexOf(" ") + 1, InvArr[i].customer.length) ;
            var body = 'Dear Customer, <br><br>' +
                'Please find attached your invoice.<br><br>' +
                'If this is not the correct Accounts Payable email address please provide me with that email address.<br><br>' +
                'Please let me know if you have any further questions.<br><br><br>' +
                '<b>The contents of this email message are intended solely for the addressee and may contain confidential and/or privileged information and may be legally protected from disclosure. If you are not the intended recipient of this message, or if this message has been addressed to you in error, please immediately alert the sender by reply email and then delete this message. If you are not the intended recipient, you are hereby notified that any use, dissemination, copying, or storage of this message or its attachments is strictly prohibited.</b><br><br><br>' +
                'Thanks,<br>' +
                'Americas Billing Team';

            CC_mail.push('AccountsReceivable@cyberark.com');
        }

        else if (subsidiary == '22' && countrySegment == '73') { //IL
            var israeli = true;
            //CC_mail.push('ROWbilling@cyberark.com');	
            var CommSign = nlapiLookupField('invoice', InvArr[i].id, 'custbody_cbr_comsign_doc_signed')
            nlapiSubmitField('invoice', InvArr[i].id, 'custbody_batch_hebrew_print', 2);
            if (CommSign == 'T') {
                CommSignPDF = true;
                var subject = 'חשבונית - סייברארק ' + InvArr[i].invoiceNo;
                var body = '<p dir="rtl">לקוח יקר<br><br>' +
                    'מצורפת חשבונית דיגיטלית לתשלום בגין הזמנתך.<br><br>' +
                    'לשאלות נוספות ניתן לפנות בכתובת ROWbilling@cyberark.com.<br><br>' +
                    'בברכה,<br><br>' +
                    'ROW Billing<br><br><br></p>' +
                    '<p><b>The contents of this email message are intended solely for the addressee and may contain confidential and/or privileged information and may be legally protected from disclosure. If you are not the intended recipient of this message, or if this message has been addressed to you in error, please immediately alert the sender by reply email and then delete this message. If you are not the intended recipient, you are hereby notified that any use, dissemination, copying, or storage of this message or its attachments is strictly prohibited.  </b></p>';

            }
            else {
                var subject = 'חשבונית - סייברארק ' + InvArr[i].invoiceNo;
                var body = '<p dir="rtl">לקוח יקר<br><br>' +
                    'מצורף העתק חשבונית בגין הזמנתך. חשבונית המקור תשלח לכתובת המצוינת על החשבונית.<br><br>' +
                    'לתשומת לבך, השקנו מערכת חשבוניות חדשה. החשבונית המצורפת הינה החשבונית הרשמית של חברת סייברארק תוכנה<br><br>' +
                    'לשאלות נוספות ניתן לפנות בכתובת ROWbilling@cyberark.com.<br><br>' +
                    'בברכה,<br><br>' +
                    'ROW Billing<br><br><br></p> ' +
                    '<p><b>The contents of this email message are intended solely for the addressee and may contain confidential and/or privileged information and may be legally protected from disclosure. If you are not the intended recipient of this message, or if this message has been addressed to you in error, please immediately alert the sender by reply email and then delete this message. If you are not the intended recipient, you are hereby notified that any use, dissemination, copying, or storage of this message or its attachments is strictly prohibited.  </b></p>';




            }

        }
        else {

            var CommSign = nlapiLookupField('invoice', InvArr[i].id, 'custbody_cbr_comsign_doc_signed')
            if (CommSign == 'T') {
                CommSignPDF = true;
            }

            //CC_mail.push('ROWbilling@cyberark.com');	
            var subject = 'CyberArk Invoice: ' + InvArr[i].invoiceNo;
            var body = 'Dear Customer, <br><br>' + 	            // invoice email for 3 first months					
                'Attached please find the related invoice.<br><br>' +
                'Best Regards,<br><br><br>' +
                'ROWbilling<br>' +
                'ROWbilling@cyberark.com<br><br>' +
                '<b>The contents of this email message are intended solely for the addressee and may contain confidential and/or privileged information and may be legally protected from disclosure. If you are not the intended recipient of this message, or if this message has been addressed to you in error, please immediately alert the sender by reply email and then delete this message. If you are not the intended recipient, you are hereby notified that any use, dissemination, copying, or storage of this message or its attachments is strictly prohibited.  </b>';


        }



        var emailAttachmentreturnSearchResults = [];

        var typeRec = 'invoice';
        if (InvArr[i].type == 'Credit Memo') { typeRec = 'creditmemo' }

        var custbody_ps_details_print = nlapiLookupField(typeRec, InvArr[i].id, 'custbody_ps_details_print')
        if (typeRec == 'invoice' && custbody_ps_details_print != null && custbody_ps_details_print != '' && !CommSignPDF) {


            var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";

            xml += "<pdfset>";

            var tranid = nlapiLookupField('invoice', InvArr[i].id, 'tranid')
            nlapiLogExecution('DEBUG', 'CommSignPDF', CommSignPDF);

            var attachment = nlapiPrintRecord('TRANSACTION', InvArr[i].id, 'PDF', null, true);
            attachment.setFolder(452425); //PROD
            //attachment.setFolder(448731); // DEV
            //Set Available without login to true
            attachment.setIsOnline(true);
            //store file in cabinet
            var fileID = nlapiSubmitFile(attachment);
            // load the file to get its URL
            var fileURL = nlapiLoadFile(fileID).getURL();
            nlapiLogExecution('DEBUG', 'fileURL', fileURL);
            var pdf_fileURL = nlapiEscapeXML(fileURL);
            nlapiLogExecution('DEBUG', 'pdf_fileURL', pdf_fileURL);
            var psPage = createPSDetailPage(InvArr[i].id);
            var file = nlapiXMLToPDF(psPage);
            file.setName('test.pdf');
            file.setFolder(192811)
            file.setIsOnline(true)
            var fileID2 = nlapiSubmitFile(file);
            var psDetailsURL = nlapiLoadFile(fileID2).getURL();
            var pdf_ps = '';
            pdf_ps = nlapiEscapeXML(psDetailsURL);


            xml += "<pdf src='" + pdf_fileURL + "'/>";
            xml += "<pdf src='" + pdf_ps + "'/>";

            xml += "</pdfset>";

            //convert xml file back to pdf
            var pdf = nlapiXMLToPDF(xml);

            //save pdf in filecabinet
            var multipleINV_pdf = nlapiCreateFile('Print.pdf', 'PDF', pdf.getValue());
            //multipleINV_pdf.setFolder(448731);
            multipleINV_pdf.setFolder(452425); // PROD
            multipleINV_pdf.setName(tranid + '.pdf');
            var printFileID = nlapiSubmitFile(multipleINV_pdf);
            mainPDF = nlapiLoadFile(printFileID); //get url of pdf from filecabinet 
            emailAttachmentreturnSearchResults.push(mainPDF)
        }
        else if (typeRec == 'invoice' && custbody_ps_details_print != null && custbody_ps_details_print != '' && CommSignPDF) {

            var fileID = getCommSignFileId(InvArr[i].invoiceNo);
            nlapiLogExecution('DEBUG', 'fileID', fileID);
            var attachment = nlapiLoadFile(fileID)
            emailAttachmentreturnSearchResults.push(attachment)

            var psPage = createPSDetailPage(InvArr[i].id);
            var file = nlapiXMLToPDF(psPage);
            file.setName('Invoice_' + InvArr[i].invoiceNo + '.pdf');
            file.setFolder(192811)
            file.setIsOnline(true)
            var fileID2 = nlapiSubmitFile(file);
            var psDetails = nlapiLoadFile(fileID2);

            emailAttachmentreturnSearchResults.push(psDetails)

        }

        else {   // if  custbody_ps_details_print == null or empty && CommSignPDF == false

            if (!CommSignPDF) {
                var attachment = nlapiPrintRecord('TRANSACTION', InvArr[i].id, 'PDF', null, true);

            }
            else {
                var fileID = getCommSignFileId(InvArr[i].invoiceNo);
                nlapiLogExecution('DEBUG', 'fileID', fileID);
                var attachment = nlapiLoadFile(fileID)

            }

            emailAttachmentreturnSearchResults.push(attachment)

        }
        var attachRec = new Object();
        attachRec['entity'] = InvArr[i].customerID; //attach email to customer record
        attachRec['transaction'] = InvArr[i].id;

        //nlapiLogExecution('DEBUG', 'InvArr[i].customerID', InvArr[i].customerID);

        var typeRec = 'invoice';
        if (InvArr[i].type == 'Credit Memo') { typeRec = 'creditmemo' }


        /////////////////////////////////////////

        if (israeli) {
            nlapiSubmitField('invoice', InvArr[i].id, 'custbody_batch_hebrew_print', 1);
        }
        try {
            nlapiLogExecution('DEBUG', 'to: ' + firstEMail, 'CC_mail' + JSON.stringify(CC_mail));
            var email_result = nlapiSendEmail(employeeId, firstEMail, subject, body, CC_mail, null, attachRec, emailAttachmentreturnSearchResults);
            nlapiSubmitField(typeRec, InvArr[i].id, 'custbody_batch_result', 'success');

        } catch (e) {
            nlapiSubmitField(typeRec, InvArr[i].id, 'custbody_batch_result', e);
            nlapiLogExecution('DEBUG', 'error send mail ', e)

        }

        nlapiSubmitField(typeRec, InvArr[i].id, 'custbody_batch_date', today);


    }//  for (var i = 0; i < InvArr.length; i++) - end
    var body_emp_mail = 'Batch Invoice finished<br>To see errors please run the report:<br>CBR Failed Batch Invoice';
    nlapiSendEmail(employeeId, employeeId, 'Batch print/email ', body_emp_mail, null, null, null, null);
}


function getInvoiceAttachments(invID) {

    var results = [];
    var toReturn = [];


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('tranid');
    columns[1] = new nlobjSearchColumn('name', 'file');
    columns[2] = new nlobjSearchColumn('internalid', 'file');
    columns[3] = new nlobjSearchColumn('url', 'file');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', invID)
    filters[1] = new nlobjSearchFilter('type', null, 'anyof', ['CustInvc', 'CustCred'])
    filters[2] = new nlobjSearchFilter('mainline', null, 'is', 'T')


    var search = nlapiCreateSearch('transaction', filters, columns);
    var resultset = search.runSearch();
    results = resultset.getResults(0, 1000);


    if (results != []) {
        results.forEach(function (line) {

            toReturn.push({
                fileName: line.getValue('name', 'file'),
                fileID: line.getValue('internalid', 'file'),
                fileURL: line.getValue('url', 'file')
            })


        });
    }

    return toReturn;
}




function createPSDetailPage(invoiceID) {


    var invoiceRecord = nlapiLoadRecord('invoice', invoiceID)
    var psDetails = invoiceRecord.getFieldValue('custbody_ps_details_print');


    var _supp_comment = '';
    var invoiceNum = invoiceRecord.getFieldValue('tranid');
    var invoiceSubsid = invoiceRecord.getFieldValue('subsidiary');
    if (invoiceSubsid == '18') { //USA Subsidiary

        _supp_comment = nlapiLookupField('subsidiary', invoiceSubsid, 'custrecord_ps_supplement_comment')
    }

    var temp = nlapiLoadFile('985331').getValue();
    var a = temp.toString();

    var startlist = a.indexOf("--startlist--") + 13
    var head = a.substr(0, startlist - 13);
    var endlist = a.indexOf("--endlist--");
    var list = a.substr(startlist, endlist - startlist);

    var restOfTemplate = a.substr(endlist + 11, a.length);

    var dynList = '';

    var arr = JSON.parse(psDetails);
    nlapiLogExecution('debug', 'arr', JSON.stringify(arr))

    for (var x = 0; x < arr.length; x++) {

        var line = '';

        if (isOdd(x) == 0) {
            line = '<tr class="lighterblue-bg">';
        }
        if (isOdd(x) == 1) {
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

    var allTemplate = head + dynList + restOfTemplate.toString();


    var pattern = /_invoice_number|_supp_comment/ig;


    //PS Detail Information Information
    var _invoice_number = invoiceNum;


    var mapObj = {
        _invoice_number: _invoice_number,
        _supp_comment: _supp_comment


    };


    var str = allTemplate.replace(/\{\{(.*?)\}\}/g, function (i, match) {
        return mapObj[match];
    });


    //must clean all amps
    //var clean = str.replaceAll("&", "&amp;");




    return str;
}


function isOdd(num) {
    return num % 2;
}



function downloadDataPDF(invID, data, response, asAttachment) {
    try {
        if (asAttachment == false) {

            var file = nlapiXMLToPDF(data);
            response.setEncoding('UTF-8');
            response.setContentType('PDF', 'test.pdf');
            file.setFolder(192811)
            file.setIsOnline(true)
            var FileID = nlapiSubmitFile(file)
            return FileID;
        }

        if (asAttachment == true) {

            var file = nlapiXMLToPDF(data);
            file.setEncoding('UTF-8');
            file.setName('bb.pdf');
            file.setFolder(192811)
            file.setIsOnline(true)

            ///



            ///

            var FileID = nlapiSubmitFile(file)
            return FileID;

        }
    } catch (e) {
        nlapiLogExecution('debug', 'error', e)
    }
}



function getCommSignFileId(tranid) {
    var resultsArr = [];

    var cols = new Array();
    cols[0] = new nlobjSearchColumn('name');
    cols[1] = new nlobjSearchColumn('internalid');

    var fils = new Array();
    fils[0] = new nlobjSearchFilter('folder', null, 'is', '299617')
    fils[1] = new nlobjSearchFilter('name', null, 'is', tranid + ' - Signed.pdf')


    var s = nlapiSearchRecord('file', null, fils, cols);

    if (s != null) {

        return s[0].id
    }
}


