/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       4 oct 2018     mosheb + idor
 *
 */

/**
 * @returns {Void} Any or no return value
 */
var customers_min_due = [];


function workflowAction_sendstatement() {
    try {
        var context = nlapiGetContext();
        var rec = nlapiGetNewRecord();
        var custid = rec.getFieldValue('entity');

        var context = nlapiGetContext();
        var templateId = context.getSetting('SCRIPT', 'custscript_templateid');
        if (templateId == null)
            templateId = -1;
        //nlapiLogExecution('debug', 'workflowAction_sendstatement', custid);

        var context = nlapiGetContext();
        var now = GetTodayDate();

        var daysoverdue = 0;

        var search = nlapiLoadSearch('invoice', 'customsearch_dunning_letters');
        
        var resultSet = search.runSearch();
        var moveon = true;

        resultSet.forEachResult(
                function (searchResult) {
                    var searchColumns = resultSet.getColumns();
                    var sametran = (custid == searchResult.getValue(searchColumns[0]));
                    if (sametran) {
                        if (moveon) {
                            moveon = false;
                            daysoverdue = searchResult.getValue(searchColumns[2]);
                        }
                    }
                    return true;
                });

        nlapiLogExecution('debug', 'custid', custid + ' ' + daysoverdue);
        //nlapiLogExecution('debug', 'rec', rec.id);
        var fromId = '-1'; //Billing employee
        var ccList = null; //Array of Email Addresses to be BCCed. 

        try {
            fromId = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_billing_emp');
            var ccemail = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_cc_emails');
            var tocontact = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_to_contacts');
            var tosalesrep = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_to_salesrep');

            ccList = [];
            ccList.push(ccemail);
        }
        catch (e)
        { }

        try {
            if (tocontact == 2 || tocontact == 3) { // 2- all contacts, 3 - only dunning
                var onlyDunning = (tocontact == 3);
                var allContacts = getAllContacts(onlyDunning);
                var customerContacts = [];
                for (var i = 0; i < allContacts.length; i++) {
                    if (allContacts[i].company == custid && allContacts[i].send == 'T') {
                        customerContacts.push(allContacts[i]);
                    }
                }

                var jsonStr = JSON.stringify(customerContacts);

                var sendTo = [];
                for (var x = 0; x < customerContacts.length; x++) {
                    sendTo.push(customerContacts[x].email);
                }
            }
        }
        catch (e)
        { }

        try {
            //  nlapiLogExecution('debug', 'Entered email script', 'TRUE');
            if (tosalesrep == 'T') {
                var salesrep = rec.getFieldValue('salesrep');
                if (salesrep == '' || salesrep == null) {
                    var custrec = nlapiLoadRecord('customer', custid)
                    salesrep = custrec.getFieldValue('salesrep');
                }
                var salesrepemail = nlapiLookupField('employee', salesrep, 'email');
                if (salesrepemail != null)
                    sendTo.push(salesrepemail);
            }
        }
        catch (e)
        { }

        try {
            var dunning_email = nlapiLookupField('entity', custid, 'custentity_dunning_email');
            if (dunning_email != null)
                sendTo.push(dunning_email);
        }
        catch (e)
        { }



        var recipient = sendTo;
        //nlapiLogExecution('debug', 'Sending to:', recipient);

        var entityname = rec.getFieldText('entity');
        entityname = entityname.substring(entityname.indexOf(' '));
        var dueDate = rec.getFieldValue('duedate');
        try {
            var attachmments = [];
            var fileId = -1;
            var attachment = null;
            try {
                fileId = nlapiLookupField('entity', custid, 'custentity_statement_attachment');
                attachment = nlapiLoadFile(fileId);
                attachmments.push(attachment);

                // nlapiLogExecution('debug', 'fileId', fileId);
            }
            catch (e) {
                nlapiLogExecution('error', 'No Statement for ', entityname);
            }
            var attachRec = new Object();
            attachRec['transaction'] = rec.id; //attach email to the record

            var attachmentrec = nlapiPrintRecord('TRANSACTION', rec.getId(), 'PDF', null);
            attachmments.push(attachmentrec);


            if (templateId == -1)
                return;

            var emailMerger = nlapiCreateEmailMerger(templateId);

            var mergeResult = emailMerger.merge();
            //var msg = mergeResult.getBody();
            //msg = msg.replace("transaction.entity", entityname);
            //msg = msg.replace("transaction.dueDate", dueDate);
            var msg = renderTemplate(templateId, rec);
            nlapiLogExecution('debug', 'msg' + msg);
            var sbj = mergeResult.getSubject();
            //var ccList = ['billing@galooli.com']; //Array of Email Addresses to be BCCed. 

            if (recipient == null || recipient == "") {
                recipient = ccList;
                ccList = null;
            }

            //Recipient is a comma separated list of email addresses
            nlapiSendEmail(fromId, recipient, sbj, msg, ccList, null, attachRec, attachmments, false);
            //nlapiSendEmail(fromId, 'Asaf.Yadigar@one1up.com', sbj, msg, null, null, attachRec, attachmments, false);
            //var now = GetTodayDate();
            //var dnow = nlapiStringToDate(now);
            //nlapiLogExecution('debug', 'last sent', custid + ' ' + now);

            nlapiLogExecution('audit', 'customer' + custid + 'daysoverdue' + daysoverdue + 'done - ' + recipient);

        } catch (err) {
            nlapiLogExecution('error', 'err', err)
        }

    } catch (err) {
        nlapiLogExecution('error', 'err', err)
    }
}


function renderTemplate(templateFileId, rec) {
    try {
        var templateFile = nlapiLoadFile(templateFileId);
        var templateContent = templateFile.getFieldValue('content');
        templateContent = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd"><pdf><head></head><body>' + templateContent;
        templateContent += '</body></pdf>';

        var renderer = nlapiCreateTemplateRenderer();
        renderer.setTemplate(templateContent);
        renderer.addRecord('record', rec);
        var xml = renderer.renderToString();
        var html = renderer.renderToResponse(response);
        return html;
    } catch (err) {
        nlapiLogExecution('error', 'renderTemplate', err)
    }
    return "";
}

function getAllContacts(onlyDunning) {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('entityid');
    columns[1] = new nlobjSearchColumn('company');
    columns[2] = new nlobjSearchColumn('email');
    // columns[3] = new nlobjSearchColumn('custentity_statement_notification');

    var search = nlapiCreateSearch('contact', null, columns)
    if (onlyDunning)
        search.addFilter(new nlobjSearchFilter('custentity_dunning_notification', null, 'is', 'T'));

    var allSelection = [];
    var theResults = [];
    var allResults = [];
    var resultSelection = [];
    var searchid = 0;
    var resultset = search.runSearch();
    var rs;
    var cols = search.getColumns();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (rs in resultslice) {

            allSelection
                    .push(resultSelection[resultslice[rs].id] = resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (allSelection != null) {
        allSelection.forEach(function (line) {
            theResults.push({
                name: line.getValue(cols[0]),
                company: line.getValue(cols[1]),
                email: line.getValue(cols[2]),
                send: 'T', //line.getValue(cols[3]),
            });
        });
    };
    return theResults;
}

function getCurrency(currency) {
    var resultsArr = [];
    var cols = new Array();
    cols[0] = new nlobjSearchColumn('name');
    cols[1] = new nlobjSearchColumn('internalid');
    cols[2] = new nlobjSearchColumn('symbol');
    var s = nlapiSearchRecord('currency', null, null, cols);
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            resultsArr.push({
                type_name: s[i].getValue('name'),
                internalid: s[i].getValue('internalid'),
                symbol: s[i].getValue('symbol')

            });
        }
    }
    var symbol = '';
    for (var x = 0; x < resultsArr.length; x++) {
        if (resultsArr[x].internalid == currency)
            symbol = resultsArr[x].symbol
    }
    return symbol;
}

function formatCurrency(str) {
    if (str.indexOf(',') == -1) { //checking if value is already formatted.
        var value = parseFloat(str).toFixed(2);
        var num = value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        return num;
    }
    return str;
}

function convertDate(odate) { // Convert to vat date format - from 28/4/2016 to YYYYMMDD
    if (odate == undefined)
        return '';
    var dateformat = 'dd/MM/yyyy';
    var ISMMDD;
    var dateMMDD = '3/31/17';
    var check = nlapiStringToDate(dateMMDD);
    whatFormat = isNaN(check);
    if (ISMMDD)
        dateformat = 'MM/dd/yyyy';

    var newDate = '';
    var arr = odate.split("/");
    var day = arr[0];
    var month = arr[1];

    if (dateformat.toLowerCase() == "mm/dd/yyyy") {
        day = arr[1];
        month = arr[0];
    }
    newDate = new Date(arr[2], month - 1, day);
    //nlapiLogExecution('debug', 'convertDate' + odate, 'dateformat:' + dateformat + ' ' + newDate);
    return newDate;
}

function GetTodayDate() {
    var now = new Date();
    //now.setTime(now.getTime() + (10 * 60 * 60 * 1000));
    //var nowDate = new Date(now.getFullYear().toString(), PadLeftWithZero((now.getMonth()), 2), PadLeftWithZero((now.getDate()), 2));
    var dateformat = 'dd/MM/yyyy';
    var ISMMDD;
    var dateMMDD = '3/31/17';
    var check = nlapiStringToDate(dateMMDD);
    whatFormat = isNaN(check);
    if (ISMMDD)
        dateformat = 'MM/dd/yyyy';


    return now.toString(dateformat);
}


function isSameDate(d1, d2) {
    if (d1 == null || d2 == null)
        return false;
    if (d1.getYear() == d2.getYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate())
        return true;
}

function PadLeftWithZero(data, maxlength) {
    if (data == undefined)
        data = '0';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res = '0' + res;
    }
    if (maxlength < res.length)
        return res.substring(0, maxlength);
    return res;
}


