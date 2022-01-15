var mailTo = [];
var ccMail = [];
var errArr = new Array();
var sList = new Array();

function sendBachMail() {
    var context = nlapiGetContext();
    var arr = context.getSetting('SCRIPT', 'custscript_ss_emails');

    customerArr = JSON.parse(arr);
    nlapiLogExecution('DEBUG', 'arr', arr);
    nlapiLogExecution('DEBUG', 'customerArr length', customerArr.length);

    var employee = nlapiGetContext();
    var employeeId = employee.user;
    
    var today = new Date();
    for (var i = 0; i < customerArr.length; i++) {
        mailTo = [];
        ccMail = [];
        if (context.getRemainingUsage() < 150) {
            nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
            if (state.status == 'FAILURE') {
                nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
            }
            else if (state.status == 'RESUME') {
                nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
            }
        }

        var emailAttachmentreturnSearchResults = [];
        try {
            var arrData = searchtrans(customerArr[i].customerID);
            if (arrData != null) {
                var rec = nlapiLoadRecord('customer', customerArr[i].customerID);
                getAddressList(rec);
                var email = rec.getFieldValue('email');
                var pdfPage = createPDF(rec, arrData);
                var name = rec.getFieldValue('companyname');
                var pdfFileId = downloadDataPDF(pdfPage, name); //print pdf	
                nlapiAttachRecord("file", pdfFileId, 'customer', customerArr[i].customerID);
                var psDetailsURL = nlapiLoadFile(pdfFileId);
                emailAttachmentreturnSearchResults.push(psDetailsURL);
            }
            var context = nlapiGetContext();
            var usageRemaining = context.getRemainingUsage();
            if (usageRemaining < 50) {
                alert('There are too many results for this search, therefore some invoices have been ommitted. For a more precise result, please narrow your date range');
                break;
            }
        }
        catch (e) {
            errArr.push({
                id: customerArr[i].customerID,
                name: customerArr[i].customer_Name,
                error: e,
            })
            nlapiLogExecution('ERROR', 'error pdfbuild - invoice id:' + customerArr[i] + ' ', e);
            continue;
        }

        var attachRec = new Object();
        attachRec['entity'] = customerArr[i].customerID; //attach email to customer record

        nlapiLogExecution('DEBUG', 'customerArr[i].customerID', customerArr[i].customerID);
        
        try {
            nlapiLogExecution('debug', 'inside try', "sendBachMail");
            //if (email != '' && email != null) {
                var aging_days = customerArr[i].aging_days;
            nlapiLogExecution('DEBUG', 'aging_days', aging_days);
            if (customerArr[i].customerID == '3031') { aging_days = 7; }
            if (customerArr[i].customerID == '6420') { aging_days = 14; }
            if (customerArr[i].customerID == '6600') { aging_days = 28; }
            if (customerArr[i].customerID == '1142') { aging_days = 45; }

                switch (aging_days) {
                    case -2:
                        var template = nlapiLoadRecord('emailtemplate', 107);
                        var body = template.getFieldValue('content');
                        body = body.replace('transaction.entity', customerArr[i].customer_Name);
                        var subject = template.getFieldValue('subject');
                        sendMail(employeeId, subject, body, attachRec, emailAttachmentreturnSearchResults, customerArr[i].customerID, customerArr[i].customer_Name,aging_days);
                        //body = body.replace(template_logo, sb_logo);
                        //nlapiSendEmail(employeeId, email, subject, body, null, null, attachRec, emailAttachmentreturnSearchResults);
                        break;
                    case 7:
                        var template = nlapiLoadRecord('emailtemplate', 108);
                        var body = template.getFieldValue('content');
                        body = body.replace('transaction.entity', customerArr[i].customer_Name);
                        var subject = template.getFieldValue('subject');
                        sendMail(employeeId, subject, body, attachRec, emailAttachmentreturnSearchResults, customerArr[i].customerID, customerArr[i].customer_Name, aging_days);
                        //body = body.replace(template_logo, sb_logo);
                        //nlapiSendEmail(employeeId, email, subject, body, null, null, attachRec, emailAttachmentreturnSearchResults);
                        break;
                    case 14:
                        var template = nlapiLoadRecord('emailtemplate', 109);
                        var body = template.getFieldValue('content');
                        var subject = template.getFieldValue('subject');
                        sendMail(employeeId, subject, body, attachRec, emailAttachmentreturnSearchResults, customerArr[i].customerID, customerArr[i].customer_Name, aging_days);
                        //body = body.replace(template_logo, sb_logo);
                        //nlapiSendEmail(employeeId, email, subject, body, null, null, attachRec, emailAttachmentreturnSearchResults);
                        break;
                    case 28:
                        var template = nlapiLoadRecord('emailtemplate', 110);
                        var body = template.getFieldValue('content');
                        var subject = template.getFieldValue('subject');
                        sendMail(employeeId, subject, body, attachRec, emailAttachmentreturnSearchResults, customerArr[i].customerID, customerArr[i].customer_Name, aging_days);
                        //body = body.replace(template_logo, sb_logo);
                        //nlapiSendEmail(employeeId, email, subject, body, null, null, attachRec, emailAttachmentreturnSearchResults);
                        break;
                    case 45:
                        var template = nlapiLoadRecord('emailtemplate', 111);
                        var body = template.getFieldValue('content');
                        var subject = template.getFieldValue('subject');
                        sendMail(employeeId, subject, body, attachRec, emailAttachmentreturnSearchResults, customerArr[i].customerID, customerArr[i].customer_Name, aging_days);
                        //body = body.replace(template_logo, sb_logo);
                        //nlapiSendEmail(employeeId, email, subject, body, null, null, attachRec, emailAttachmentreturnSearchResults);
                        break;
                    default:
                        var body = 'There is no email template for the aging days:' + aging_days;
                        var subject = 'Aging Mail Test';
                        errArr.push({
                            id: customerArr[i].customerID,
                            name: customerArr[i].customer_Name,
                            error: 'There is no email template for the aging days:' + aging_days,
                        });
                        //sendMail(employeeId, subject, body, attachRec, emailAttachmentreturnSearchResults, customerArr[i].customerID);
                        //body = body.replace(template_logo, sb_logo);
                        //nlapiSendEmail(employeeId, email, subject, body, null, null, attachRec, emailAttachmentreturnSearchResults);
                        break;
                }

                //var template = nlapiLoadRecord('emailtemplate', 109);
                //var body = template.getFieldValue('content');
                //var subject = template.getFieldValue('subject');
                //var sb_logo = 'https://4855789-sb1.app.netsuite.com/core/media/media.nl?id=1049&amp;c=4855789_SB1&amp;h=9529ae7ad0a2de72f960';
                //var template_logo = 'https://system.eu2.netsuite.com/core/media/media.nl?id=163379&c=4855789&h=20eef09fb648402322eb';
                //body = body.replace(template_logo, sb_logo);

                //nlapiSendEmail(employeeId, email, subject, body, null, null, attachRec, emailAttachmentreturnSearchResults);
                //nlapiSubmitField(typeRec, custArr[i].id, 'custbody_batch_result', 'success');
            //}
        } catch (e) {
            errArr.push({
                id: customerArr[i].customerID,
                name: customerArr[i].customer_Name,
                error: e,
            })
            continue;
        }
    }
    summaryEmail(employeeId);
    //var body_emp_mail = 'Batch Invoice finished<br>To see errors please run the report:<br>CBR Failed Batch Invoice';
    //nlapiSendEmail(employeeId, employeeId, 'Batch print/email summary', body_emp_mail, null, null, null, null);
}

function searchtrans(customer) {
    var search = nlapiLoadSearch(null, 'customsearch_nr_billing_transaction');
    search.addFilter(new nlobjSearchFilter('internalid', 'customer', 'is', customer));
    var s = [];
    var Results = [];

    var searchid = 0;
    var resultset = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            Results[i] = {
                id: s[i].id,
                docNumber: s[i].getValue('tranid'),
                currency: s[i].getText('currency'),
                date: s[i].getValue('trandate'),
                dueDate: s[i].getValue('formuladate'),
                accType: s[i].getValue('accounttype'),
                Aging_days: s[i].getValue('formulatext'),
                originalAmount: s[i].getValue(cols[5]),
                PastDue: s[i].getValue(cols[6]),
                TotalDebt: s[i].getValue(cols[7]),
                OrigAmtTrxCurr: s[i].getValue(cols[11]),
                customerId: s[i].getValue('internalid', 'customer'),
            }
        }
    }

    Results.sort(sortByProp("dueDate"));
    //Results.sort(custom_sort);
    return Results;
}

function createPDF(rec, arr) {
    nlapiLogExecution('debug', 'createPSDetailPage', "");

    var name = rec.getFieldValue('companyname');
    var sub = nlapiLoadRecord('subsidiary', rec.getFieldValue('subsidiary'));
    var recAdrress = sub.getFieldValue('mainaddress_text');
    var recEmail = sub.getFieldValue('custrecord_email');
    var recRank = rec.getFieldText('custentitycustomers_rank');
    nlapiLogExecution('debug', 'customer name: ', name);

    //var _supp_comment = '';
    //var invoiceNum = invoiceRecord.getFieldValue('tranid');
    //var invoiceSubsid = invoiceRecord.getFieldValue('subsidiary');
    //if (invoiceSubsid == '18') { //USA Subsidiary
    //    _supp_comment = nlapiLookupField('subsidiary', invoiceSubsid, 'custrecord_ps_supplement_comment')
    //}

    var temp = nlapiLoadFile('480955').getValue();
    var a = temp.toString();

    var startlist = a.indexOf("--startlist--") + 13
    var head = a.substr(0, startlist - 13);
    var endlist = a.indexOf("--endlist--");
    var list = a.substr(startlist, endlist - startlist);

    var totalDebt = parseFloat(0);
    var totalpass = parseFloat(0);

    var restOfTemplate = a.substr(endlist + 11, a.length);

    var dynList = '';
    var temp;
    var temp2;
    for (var x = 0; x < arr.length; x++) {
        var line = '';
        line += '<tr>';
        line += '<td colspan="3" class="left">' + arr[x].docNumber + '</td>';
        line += '<td colspan="3" class="left">' + arr[x].date + '</td>';
        line += '<td colspan="3" class="center">' + arr[x].dueDate + '</td>';
        line += '<td colspan="3" class="center">' + numberWithCommas(arr[x].OrigAmtTrxCurr) + '</td>';
        line += '<td colspan="3" class="left">' + numberWithCommas(arr[x].originalAmount) + '</td>';
        line += '<td colspan="3" class="left">' + numberWithCommas(arr[x].PastDue) + '</td>';
        line += '<td colspan="3" class="left">' + numberWithCommas(arr[x].TotalDebt) + '</td></tr>';

        dynList += line;
        temp = parseFloat(arr[x].TotalDebt);
        temp2 = parseFloat(totalDebt);
        totalDebt = (temp2 + temp);
        totalDebt = totalDebt.toFixed(2);

        temp = parseFloat(arr[x].PastDue);
        temp2 = parseFloat(totalpass);
        totalpass = (temp2 + temp);
        totalpass = totalpass.toFixed(2);
        //temp = parseFloat(arr[x].PastDue);
        //totalpass = (totalpass + temp);
        //totalpass = totalpass.toFixed(2);
    }

    totalDebt = numberWithCommas(totalDebt);
    totalpass = numberWithCommas(totalpass);

    var line = '';
    line += '<tr >';
    line += '<td colspan="12" style= " background-color: white"  class="left"></td>';
    line += '<td colspan="3" class="left">' + '<b>Total</b>' + '</td>';
    line += '<td style="border-top-style:solid;" colspan="3" class="left"><b>' + totalpass + '</b></td>';
    line += '<td colspan="3" class="left"><b>' + totalDebt + '</b></td></tr>';
    dynList += line;

    var allTemplate = head + dynList + restOfTemplate.toString();

    var pattern = /_invoice_number|_supp_comment/ig;

    //PS Detail Information Information
    var _invoice_number = name + "test";//"customer name";//name;
    var address = recAdrress;//'test test'
    var email = recEmail;//'wwwwwwwww'
    var Rank = recRank;

    var mapObj = {
        _invoice_number: name,
        address: address,
        email: email,
        Rank: Rank,
        // _supp_comment: _supp_comment
    };

    var str = allTemplate.replace(/\{\{(.*?)\}\}/g, function (i, match) {
        return mapObj[match];
    });
    //must clean all amps
    //var clean = str.replaceAll("&", "&amp;");
    return str;
}

function downloadDataPDF(data, customerName) {
    try {
        nlapiLogExecution('debug', 'downloadDataPDF ', '')
        //nlapiLogExecution('debug', 'downloadDataPDF', data);
        // var tt = nlapiEscapeXML(data)
        var file = nlapiXMLToPDF(data);
       // nlapiLogExecution('debug', 'after nlapiXMLToPDF: ', '')
        // set content type, file name, and content-disposition
        var multipleINV_pdf = nlapiCreateFile(customerName + '.pdf', 'PDF', file.getValue());
        //nlapiLogExecution('debug', 'after nlapiCreateFile: ', '')
        multipleINV_pdf.setFolder(368160);
        multipleINV_pdf.setIsOnline(true);
        //nlapiLogExecution('debug', 'before submit: ', '')
        var printFileID = nlapiSubmitFile(multipleINV_pdf);
        return printFileID;
    } catch (e) {
        nlapiLogExecution('debug', 'error', e)
    }
}

function numberWithCommas(x) {
    return parseFloat(x).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sortByProp(prop) {
    return function (a, b) {
        if (nlapiStringToDate(a[prop]) > nlapiStringToDate(b[prop])) {
            return 1;
        } else if (nlapiStringToDate(a[prop]) < nlapiStringToDate(b[prop])) {
            return -1;
        }
        return 0;
    }
}

function custom_sort(a, b) {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
}

function getAddressList(rec) {
    nlapiLogExecution('debug', 'getAddressList', '');
    try {
        var bilingMail = nlapiLookupField('subsidiary', rec.getFieldValue('subsidiary'), 'custrecord_email');
        nlapiLogExecution('debug', 'after bilingMail', 'getAddressList()');
        if (bilingMail != '' && bilingMail != null) {
            mailTo.push(bilingMail);
        }
        //nlapiLogExecution('debug', 'before getFieldValue(email) ', 'getAddressList()');
        var salesRep = rec.getFieldValue('salesrep');
        if (salesRep != '' && salesRep != null) {
            var repMail = nlapiLookupField('employee', salesRep, 'email');
            if (repMail != '' && repMail != null) {
                mailTo.push(repMail);
            }
        }
        if (rec.getFieldValue('custentity_exclude_from_email') == "F") {
            var contactCount = rec.getLineItemCount('contactroles');
            for (i = 1; i <= contactCount; i++) {
                //nlapiLogExecution('debug', 'inside contact loop ', 'getAddressList()');

                //nlapiLogExecution('debug', 'before sendEmail:', 'getAddressList()');
                sendEmail = nlapiLookupField('contact', rec.getLineItemValue('contactroles', 'contact', i), 'custentity_statement_notification');
                if (sendEmail == 'T') {
                    nlapiLogExecution('debug', 'before mailTo.push:', 'getAddressList()');
                    ccMail.push(rec.getLineItemValue('contactroles', 'email', i));
                }
            }
        }
        // nlapiLogExecution('debug', 'before getFieldValue(email) ', 'getAddressList()');
        //var custMail = rec.getFieldValue('email');
        //nlapiLogExecution('debug', 'custMail: ', custMail);
        //if (custMail != '' && custMail != null) {
        //    mailTo.push(custMail);
        //}
    } catch(e){
        nlapiLogExecution('debug', 'getAddressList() error', e);
    }
}

function sendMail(employeeId, subject, body, attachRec, emailAttachmentreturnSearchResults, custId, custName, AgingDays) {
    try {
        nlapiLogExecution('debug', 'custId, mailTo: ', custId + ', ' + mailTo);
        nlapiLogExecution('debug', 'send mail, aging days: ', AgingDays);
        if (mailTo.length > 0) {
            if (ccMail.length > 0) {
                nlapiSendEmail(employeeId, mailTo, subject, body, ccMail, null, attachRec, emailAttachmentreturnSearchResults);
                sList.push({
                    id: custId,
                    name: custName,
                    mailto: mailTo,
                    mailcc: ccMail,
                    aging: AgingDays,
                });
            }
            else {
                nlapiSendEmail(employeeId, mailTo, subject, body, null, null, attachRec, emailAttachmentreturnSearchResults);
                sList.push({
                    id: custId,
                    name: custName,
                    mailto: mailTo,
                    aging: AgingDays,
                });
            }
        }
        else {
            errArr.push({
                id: custId,
                name: custName,
                error: 'no email adddress detected for this customer',
            })
        }
    } catch(e){
        errArr.push({
            id: custId,
            name: custName,
            error: e,
        })
    }
    
}

function summaryEmail(employeeId) {
    try {
        var date = new Date();
        var subject = "Batch print/email summary ";
        var body = '<html>' +
            '<head>' +
            '<style>' +
            'table, th, td {' +
            'border: 2px solid black;' +
            'border-collapse: collapse;' +
            '}' +
            'td {' +
            'padding: 5px;' +
            'text-align: left;' +
            '}' +
            'th {' +
            'padding: 5px;' +
            'text-align: center;' +
            'background-color: #edeaea;' +
            'font-weight: bold ;' +
            '}' +
            '</style>' +
            '</head>' +
            "<div><p style= \'font-weight: bold ;font-size:110%; \'> Time stamp : " + date + "</p><br><br>" +
            "<p style='color:black; font-size:100%;'>The process of emailing customers accordind to Aging logic, has been completed. </p> " +
            "<p style='color: black; font-size:10%;'>Here is a summary of the results:</p></div>";

        var successTbl = '<p style= \'font-weight: bold ;color: green; font-size:140%; \'>Total: ' + sList.length + ' succeeded</p><br>';
        if (sList != null && sList != '') {
            successTbl += "<table style = \"width: 100 %;\" >";
            // for th
            successTbl += "<tr><th>Id + name </th><th>Aging Days</th><th>To </th><th>CC </th><tr>";
            var i = 0;
            for (v in sList) {
                successTbl += "<tr><td>" + sList[v].id + ' - ' + sList[v].name + "</td>";
                successTbl += "<td>" + sList[v].aging + "</td><td>";
                for (z = 0; z < sList[v].mailto.length; z++) {
                    successTbl += sList[v].mailto[z] + ', ';
                }
                successTbl += "</td><td>";
                if (sList[v].mailcc != undefined && sList[v].mailcc != null) {
                    for (q = 0; q < sList[v].mailcc.length; q++) {
                        successTbl += sList[v].mailcc[q] + ', ';
                    }
                }
                successTbl +=  "</td></tr>";
            }
            successTbl += "</table>"
        }

        var failTbl = '<p style= \'font-weight: bold ;color: red; font-size:140%; \'> Total: ' + errArr.length + ' failed</p><br>';
        if (errArr != null && errArr != '') {
            failTbl += "<table style = \"width: 100 %;\" >";
            // for th
            failTbl += "<tr><th>Id </th><th>Description</th><tr>";
            for (s in errArr) {
                failTbl += "<tr><td>" + errArr[s].id + ' - ' + errArr[s].name + "</td> <td>" + errArr[s].error + "</td></tr> "
            }
            failTbl += "</table>"
        }
        var list = successTbl + '<br>' + failTbl;
        body += list;
        body += '<br></html>';
        nlapiSendEmail(employeeId, employeeId, subject, body);
        nlapiLogExecution('debug', 'after email', 'email has been sent');
    } catch (e) {
        nlapiLogExecution('error', 'email()', e);
    }
} 