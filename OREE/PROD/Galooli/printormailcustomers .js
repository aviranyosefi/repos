
var toPrintArr = [];

var p_tranid = '';
var p_trantype = '';
var p_trandate = '';
var p_customerName = '';
var p_customerID = '';
var p_totalAmt = '';
var p_totalTax = '';

var customerArr = [];
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
        form.addSubmitButton('Next');

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        var printOrMail = form.addField('custpage_printormail_select', 'select', 'Print or Mail', null, 'custpage_ilo_searchdetails');
        printOrMail.addSelectOption('a', 'Print');
        printOrMail.addSelectOption('b', 'Mail');

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');


        var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'Results', null);

        var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');

        var res_CustomerInterId = resultsSubList.addField('custpage_resultssublist_customerinterid', 'text', 'Customer Internal Id');

        var res_Name = resultsSubList.addField('custpage_resultssublist_name', 'text', 'Name');

        //var res_Pcurrency = resultsSubList.addField('custpage_resultssublist_pcurrency', 'text', 'Primary Currency');

        var res_OldTranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'date', 'Oldest open transaction date');

        var res_DueDate = resultsSubList.addField('custpage_resultssublist_duedate', 'date', 'Oldest Due date');

        var res_AgingDays = resultsSubList.addField('custpage_resultssublist_agingdays', 'float', 'Aging days');

        var res_CreditLimitUSD = resultsSubList.addField('custpage_resultssublist_creditlimitusd', 'float', 'Credit limit USD');

        var res_totPastDueUDS = resultsSubList.addField('custpage_resultssublist_totpastdueusd', 'float', 'Total Past due USD');

        var res_totPastDue = resultsSubList.addField('custpage_resultssublist_totpastdue', 'float', 'Total Past due');

        var res_TotDebtOrigCurrency = resultsSubList.addField('custpage_resultssublist_totdebtorigcurrency', 'float', 'Total Debt');

        var res_MinimumOf = resultsSubList.addField('custpage_resultssublist_minimumof', 'float', 'MINIMUM OF (PAST DUE - CREDIT LIMIT) USD');

        invSearch()

        for (var j = 0; j < customerArr.length; j++) {
            resultsSubList.setLineItemValue('custpage_resultssublist_name', j + 1, customerArr[j].name);
            //resultsSubList.setLineItemValue('custpage_resultssublist_pcurrency', j + 1, toPrintArr[customerArr[j]].PrimaryCurrency);
            resultsSubList.setLineItemValue('custpage_resultssublist_trandate', j + 1, customerArr[j].oldestTransDate);
            resultsSubList.setLineItemValue('custpage_resultssublist_duedate', j + 1, customerArr[j].dueDate);
            resultsSubList.setLineItemValue('custpage_resultssublist_agingdays', j + 1, customerArr[j].Aging_days);
            resultsSubList.setLineItemValue('custpage_resultssublist_creditlimitusd', j + 1, customerArr[j].CreditLimitUSD);
            resultsSubList.setLineItemValue('custpage_resultssublist_totpastdueusd', j + 1, customerArr[j].TotalPastDueUSD);
            resultsSubList.setLineItemValue('custpage_resultssublist_totpastdue', j + 1, customerArr[j].TotalPastdue);
            resultsSubList.setLineItemValue('custpage_resultssublist_totdebtorigcurrency', j + 1, customerArr[j].TotalDebtOriginalCurrency);
            resultsSubList.setLineItemValue('custpage_resultssublist_customerinterid', j + 1, customerArr[j].Id);
            resultsSubList.setLineItemValue('custpage_resultssublist_minimumof', j + 1, customerArr[j].MINIMUM_OF);
        }


        /*
        name: s[i].getText('entity', null, "GROUP"),
        PrimaryCurrency: s[i].getText('currency', 'customer', 'GROUP'),
        oldestTransDate: s[i].getValue('trandate', null,'MIN'),
        dueDate: s[i].getValue('formuladate', null, 'MIN'),
        Aging_days: s[i].getValue(cols[4]),
        CreditLimitUSD: s[i].getValue('custentity_credit_limit', "customer", 'MAX'),
        TotalPastDueUSD: s[i].getValue(cols[6]),
        TotalPastdue: s[i].getValue(cols[7]),
        TotalDebtOriginalCurrency: s[i].getValue(cols[8]),
        Id: s[i].getValue("internalid", 'customer', "GROUP"),
        MINIMUM_OF: s[i].getValue(cols[10]),
        */

        response.writePage(form);
        //customsearch805
    }     
    else if(request.getParameter('custpage_ilo_check_stage') == 'stageOne') {

        nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');
        var lastFormName = 'Ready for Print';
        

        var type = request.getParameter('custpage_printormail_select');
        nlapiLogExecution('DEBUG', 'type', type);
        var custArr = [];
        var checkBox, id, customer;
        var InvNo = request.getLineItemCount('custpage_results_sublist')

        for (var x = 1; x <= InvNo; x++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', x);

            if (checkBox == 'T') {
                //id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_docid', x)
                //typeRec = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_trantype', x)
                customer = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_customerinterid', x)

                if (type == 'a') {
                    custArr.push({ customerID: customer });
                }
                else custArr.push({ // mail             
                    customerID: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_customerinterid', x),
                    aging_days: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_agingdays', x),
                    customer_Name: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_name', x),
                });
            }
            //nlapiLogExecution('DEBUG', 'InvArr', InvArr.id + 'type : ' + InvArr.type);
        }
        nlapiLogExecution('DEBUG', 'customerArr', custArr.length);




        if (type == 'b') {

            nlapiScheduleScript('customscript_batch_mailing_system', 'customdeploydev_batch_dep',
                { custscript_ss_emails: JSON.stringify(custArr) });

            lastFormName = 'Documents Sent';

        }
        var lastForm = nlapiCreateForm(lastFormName);
 
       if (type == 'a') {
            //var subsidiary = request.getParameter('custpage_ilo_subsidiary');
            multiplePrint(custArr);
            var baseURL = 'https://4855789-sb1.app.netsuite.com/'
            var linkprintChoiceForm = lastForm.addField("custpage_ilo_download_invoices", "inlinehtml", "", null, null);
            linkprintChoiceForm.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + mainPDF + '><b>Download Batch for Print</b></a>'); //url of pdf from filecabinet
        }
        response.writePage(lastForm);
    };
};

function multiplePrint(customerArr) {
    nlapiLogExecution('debug', 'customerArrt ', customerArr.length);
    nlapiLogExecution('debug', 'InvArr ', JSON.stringify(customerArr));


    //concatenate all parts of xml file          
    var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";

    xml += "<pdfset>";


    for (var i = 0; i < customerArr.length; i++) {
        try {
            var arrData = searchtrans(customerArr[i].customerID)
            if (arrData != null ) {
                var rec = nlapiLoadRecord('customer', customerArr[i].customerID );
                var pdfPage = createPDF(rec, arrData);
                var name = rec.getFieldValue('companyname');
                var psDetailsPDF = downloadDataPDF(pdfPage, name); //print pdf	
                nlapiAttachRecord("file", psDetailsPDF, 'customer', customerArr[i].customerID);
                var psDetailsURL = nlapiLoadFile(psDetailsPDF).getURL();
                var pdf_ps = '';
                pdf_ps = nlapiEscapeXML(psDetailsURL);

                xml += "<pdf src='" + pdf_ps + "'/>";
            }             
            var context = nlapiGetContext();
            var usageRemaining = context.getRemainingUsage();
            if (usageRemaining < 50) {
                alert('There are too many results for this search, therefore some invoices have been ommitted. For a more precise result, please narrow your date range');
                break;
            }
        }
        catch (e) {
            nlapiLogExecution('ERROR', 'error pdfbuild - invoice id:' + customerArr[i] + ' ', e);
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

function invSearch() {

    //get contact emails
    var currContactEmail = [];

    var search = nlapiLoadSearch(null, 'customsearch_nr_billing_population');
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
            customerArr[i] = {
                name: s[i].getText('entity', null, "GROUP"),
                PrimaryCurrency: s[i].getText('currency', 'customer', 'GROUP'),
                oldestTransDate: s[i].getValue('trandate', null,'MIN'),
                dueDate: s[i].getValue('formuladate', null, 'MIN'),
                Aging_days: s[i].getValue(cols[4]),
                CreditLimitUSD: s[i].getValue('custentity_credit_limit', "customer", 'MAX'),
                TotalPastDueUSD: s[i].getValue(cols[6]),
                TotalPastdue: s[i].getValue(cols[7]),
                TotalDebtOriginalCurrency: s[i].getValue(cols[8]),
                Id: s[i].getValue("internalid", 'customer', "GROUP"),
                MINIMUM_OF: s[i].getValue(cols[10]),
            }
        }
    }
    //customerArr = Results;
    //customerArr = Object.keys(toPrintArr);
}

/// oree additions

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

    //Results.sort(custom_sort);
    Results.sort(sortByProp("dueDate"));

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

function downloadDataPDF(data , customerName) {
    try {
        nlapiLogExecution('debug', 'downloadDataPDF', data);
        // var tt = nlapiEscapeXML(data)
        var file = nlapiXMLToPDF(data);
        nlapiLogExecution('debug', 'after nlapiXMLToPDF: ', '')
        // set content type, file name, and content-disposition
        var multipleINV_pdf = nlapiCreateFile(customerName+'.pdf', 'PDF', file.getValue());
        nlapiLogExecution('debug', 'after nlapiCreateFile: ', '')
        multipleINV_pdf.setFolder(368160);
        multipleINV_pdf.setIsOnline(true);
        nlapiLogExecution('debug', 'before submit: ', '')
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