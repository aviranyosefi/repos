/*
 * Version    Date            Author           Remarks
 * 1.00       9 may 2022  Maya Katz Libhaber
  * */

var g_currReciver = 0;//values can be 1,2,3,4
var g_final = 'F'; 
var g_nextApp = '';

// WORKFLOW ACTION
function send_approve() {
    nlapiLogExecution('DEBUG', 'Start send_approve');
    var SuiteletURL = nlapiResolveURL('SUITELET', 'customscript_ilo_wf_approve_su', 'customdeploy_ilo_wf_approve_su', true);
    var context = nlapiGetContext();
    var custscript_approve = context.getSetting('SCRIPT', 'custscript_approve');
    nlapiLogExecution('DEBUG', 'custscript_approve', custscript_approve);
    var type = nlapiGetRecordType();
    var internalid = nlapiGetRecordId();
    var rec = nlapiLoadRecord(type, internalid);
    var settings = getSettings(type);
    nlapiLogExecution('DEBUG', 'settings', JSON.stringify(settings));
    if (settings.length > 0) {
        try {
            var aprroval_type = settings[0].aprroval_type;
            var sent_from = settings[0].sent_from;//"custbody_requestor"
            var from = rec.getFieldValue('custbody5');// custbody5 is requester field id
            //var from = rec.getFieldValue(sent_from);
            nlapiLogExecution('DEBUG', 'from', from);

            if (aprroval_type == 1) {// FROM TRANSACTION
                var sent_to = settings[0].sent_to;
                nlapiLogExecution('DEBUG', 'sent_to', sent_to);

                //var reciever = rec.getFieldValue(sent_to);//why it should be diffrent than the custom record course?
                var reciever = getNextReciever(rec);
                getCurrReciver(custscript_approve);
            } else {// FROM CUSTOM RECORD
                var reciever = getNextReciever(rec);// function to update the global var - g_final and to return current approver id
                getCurrReciver(custscript_approve);// function to update the global var - g_currReciver
            }
            nlapiLogExecution('DEBUG', 'reciever', reciever);
            if (!isNullOrEmpty(reciever)) {
                var recData = createIloLog(internalid);
                var logId = recData[0];
                var newNumber = recData[1];
                var approvedurl = SuiteletURL + '&internalid=' + internalid + '&type=' + type + '&update=approved' + '&from=' + from + '&logId=' + logId + '&newNumber=' + newNumber;
                var rejecturl = SuiteletURL + '&internalid=' + internalid + '&type=' + type + '&update=rejected' + '&from=' + from + '&logId=' + logId + '&newNumber=' + newNumber;
                approvedurl += '&to=' + reciever + '&currReciver=' + g_currReciver + '&final=' + g_final //+'&nextApp=' + nextApp
                rejecturl += '&to=' + reciever + '&currReciver=' + g_currReciver + '&final=' + g_final //+ '&nextApp=' + nextApp
                //nlapiLogExecution('DEBUG', 'approvedurl', approvedurl);
                //nlapiLogExecution('DEBUG', 'rejecturl', rejecturl);

                var email_template = settings[0].email_template;
                nlapiLogExecution('DEBUG', 'email_template', email_template);
                var emailMerger = nlapiCreateEmailMerger(email_template);

                try {
                    emailMerger.setTransaction(internalid);
                    var mergeResult = emailMerger.merge();
                    var sbj = mergeResult.getSubject();
                    var msg = mergeResult.getBody();
                    msg = msg.replace('approvedurl', approvedurl);
                    msg = msg.replace('rejecturl', rejecturl);

                    var entityid = nlapiLookupField('employee', reciever, 'entityid');
                    nlapiLogExecution('DEBUG', 'entityid', entityid);

                    msg = msg.replace('/entityid/', entityid);
                    //nlapiLogExecution('DEBUG', 'msg', msg);

                    var attachRec = new Object();
                    attachRec['transaction'] = internalid;

                    var emailAttachmentList = null;
                    var attach_files = settings[0].attach_files;
                    if (attach_files == 'T') {
                        emailAttachmentList = getInvoiceAttachments(internalid);
                    }               
                    nlapiSendEmail(from, reciever, sbj, msg, null, null, attachRec, emailAttachmentList, false);
                    nlapiLogExecution('debug', 'send email', 'send email');
                }
                catch (e) {
                    nlapiLogExecution('debug', 'error to send email ', e);
                }
            }
        }
        catch (ex) {
            nlapiLogExecution('error', 'send_approve', ex);
        }
    }
}
function getNextReciever(rec) {
    var approver1 = rec.getFieldValue('custbody_approver_1');//approver id
    var approver2 = rec.getFieldValue('custbody_approver_2');
    var approver3 = rec.getFieldValue('custbody_approver_3');
    var approver4 = rec.getFieldValue('custbody_approver_4');
    nlapiLogExecution('DEBUG', 'approver1: ' + approver1, 'approver2:' + approver2, 'approver3' + approver3, 'approver4' + approver4);

    if (!isNullOrEmpty(approver1) && isNullOrEmpty(rec.getFieldValue('custbody_approver_1_indication'))) {
        nlapiLogExecution('DEBUG', 'in first if ');

        if (isNullOrEmpty(approver2)) {
            g_final = 'T';
        }
        //CurrReciver = 1
        return approver1;
    }
    else if (!isNullOrEmpty(approver2) && isNullOrEmpty(rec.getFieldValue('custbody_approver_2_indication'))) {
        nlapiLogExecution('DEBUG', 'in second if ');

        if (isNullOrEmpty(approver3)) {
            g_final = 'T';
        }
        //CurrReciver = 2
        return approver2;
    }
    else if (!isNullOrEmpty(approver3) && isNullOrEmpty(rec.getFieldValue('custbody_approver_3_indication'))) {
        g_final = 'T';
        //CurrReciver = 3
        return approver3;
    }
    else if (!isNullOrEmpty(approver4) && isNullOrEmpty(rec.getFieldValue('custbody_approver_4_indication'))) {
        g_final = 'T';
        //CurrReciver = 4
        return approver4;
    }
    return '';
}
function getInvoiceAttachments(invID) {

    var results = [], toReturn = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('tranid');
    columns[1] = new nlobjSearchColumn('name', 'file');
    columns[2] = new nlobjSearchColumn('internalid', 'file');
    columns[3] = new nlobjSearchColumn('url', 'file');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', invID);
    filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');

    var search = nlapiCreateSearch('transaction', filters, columns);
    var resultset = search.runSearch();
    results = resultset.getResults(0, 1000);

    if (results != []) {
        results.forEach(function (line) {
            var attachRecID = line.getValue('internalid', 'file');
            var attachFileObj = nlapiLoadFile(attachRecID);
            toReturn.push(attachFileObj);
        });
    }
    return toReturn;
}
function createIloLog(tranid) {
    try {
        var rec = nlapiCreateRecord('customrecord_one_email_logs');
        rec.setFieldValue('custrecord_ilo_approval_transaction', tranid);
        var newNumber = getLastLogNumber(tranid);
        nlapiLogExecution('debug', 'newNumber from createIloLog(): ', newNumber);
        rec.setFieldValue('custrecord_ilo_approval_rece_nu', newNumber);
        var id = nlapiSubmitRecord(rec, null, true);
        nlapiLogExecution('debug', 'ilo_approval_process id: ', id);
        var recData = [];
        if (id != '-1') {
            var recData = [id, newNumber];
        }
    } catch (e) {
        nlapiLogExecution('debug', 'ERROR', e);
    }
    return recData;
}
function getLastLogNumber(tranid) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_ilo_approval_rece_nu');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ilo_approval_transaction', null, 'is', tranid);

    var search = nlapiCreateSearch('customrecord_one_email_logs', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    var lastNumber = 0;
    if (s != null && s.length > 0) {
        lastNumber = s[s.length - 1].getValue('custrecord_ilo_approval_rece_nu');
    }
    return parseInt(lastNumber) + 1;
}
function getApprover(custom_record_id, filter_by_department, filter_by_class, rec) {
    var subsidiaryRec = rec.getFieldValue('subsidiary');
    var filters = new Array();
    filters.push(new nlobjSearchFilter('custrecord_po_approval_subsidiary', null, 'anyof', subsidiaryRec))

    if (filter_by_department == 2) {
        var departmentRec = rec.getFieldValue('department');
        if (!isNullOrEmpty(departmentRec)) {
            filters.push(new nlobjSearchFilter('custrecord_po_approval_department', null, 'anyof', departmentRec))
        }

    }
    //if (filter_by_class == 2) {
    //    pac_class = rec.getFieldValue('class');
    //    if (!isNullOrEmpty(pac_class)) {
    //        filters.push(new nlobjSearchFilter('custrecord_occ_class', null, 'anyof', pac_class))
    //    }
    //}
    var s = [], res = [];
    var columns = new Array();
    columns.push(new nlobjSearchColumn('custrecord_po_approval_1'));
    columns.push(new nlobjSearchColumn('custrecord_po_approval_2'));
    columns.push(new nlobjSearchColumn('custrecord_po_approval_3'));
    columns.push(new nlobjSearchColumn('custrecord_po_approval_4'));

    var search = nlapiCreateSearch(custom_record_id, filters, columns);
    var resultset = search.runSearch();
    s = resultset.getResults(0, 1000);
    if (s != [] && s.length > 0) {
        res.push({
            approver1: s[0].getValue('custrecord_po_approval_1'),
            approver2: s[0].getValue('custrecord_po_approval_2'),
            approver3: s[0].getValue('custrecord_po_approval_3'),
            approver4: s[0].getValue('custrecord_po_approval_4'),

        })
    }
    return res;
}
function getSettings(trnType) {
    try {
        var columns = new Array();
        columns.push(new nlobjSearchColumn('custrecord_one_email_template'));
        //columns.push(new nlobjSearchColumn('custrecord_trx_default_approver'))
        columns.push(new nlobjSearchColumn('custrecord_one_approval_type'));
        columns.push(new nlobjSearchColumn('custrecord_one_attachments_files'));
        columns.push(new nlobjSearchColumn('custrecord_one_filter_by_department'));
        columns.push(new nlobjSearchColumn('custrecord_one_filter_by_class'));
        columns.push(new nlobjSearchColumn('custrecord_one_email_sent_from'));
        columns.push(new nlobjSearchColumn('custrecord_one_email_sent_to'));

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custrecord_one_transaction', null, 'is', trnType);

        var search = nlapiCreateSearch('customrecord_one_approval_settings', filters, columns);
        var resultset = search.runSearch();
        var results = [], s = [];
        s = resultset.getResults(0, 1000);
        if (s != [] && s.length > 0) {
            results.push({
                email_template: s[0].getValue('custrecord_one_email_template'),
                //default_approver: s[0].getValue('custrecord_trx_default_approver'),
                aprroval_type: s[0].getValue('custrecord_one_approval_type'),
                custom_record_id: 'customrecord_po_approval_flow',
                attach_files: s[0].getValue('custrecord_one_attachments_files'),
                filter_by_department: s[0].getValue('custrecord_one_filter_by_department'),
                filter_by_class: s[0].getValue('custrecord_one_filter_by_class'),
                sent_from: s[0].getValue('custrecord_one_email_sent_from'),
                sent_to: s[0].getValue('custrecord_one_email_sent_to'),
            })
            return results;
        }
        return '';
    } catch (e) { return ''; }
}
function getReciver(getApproverList, CountOfRecievers, rec) {
    var approver1 = getApproverList[0].approver1;
    var approver2 = getApproverList[0].approver2;
    var approver3 = getApproverList[0].approver3;
    var approver4 = getApproverList[0].approver4;

    if (CountOfRecievers == 1) {
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_1_indication'))) { g_currReciver = 1; g_final = 'T'; return approver1; }
    }
    else if (CountOfRecievers == 2) {
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_1_indication'))) { g_currReciver = 1; g_nextApp = approver2; return approver1 }
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_2_indication'))) { g_currReciver = 2; g_final = 'T'; return approver2; }
    }
    else if (CountOfRecievers == 3) {
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_1_indication'))) { g_currReciver = 1; g_nextApp = approver2; return approver1 }
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_2_indication'))) { g_currReciver = 2; g_nextApp = approver3; return approver2 }
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_3_indication'))) { g_currReciver = 3; g_final = 'T'; return approver3; }
    }
    else if (CountOfRecievers == 4) {
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_1_indication'))) { g_currReciver = 1; g_nextApp = approver2; return approver1 }
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_2_indication'))) { g_currReciver = 2; g_nextApp = approver3; return approver2 }
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_3_indication'))) { g_currReciver = 3; g_nextApp = approver4; return approver3 }
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_3_indication'))) { g_currReciver = 4; g_final = 'T'; return approver4; }
    }
}
function getCurrReciver(custscript_approve) {
    //if (custscript_approve == 'custbody_approver_1') { g_currReciver = 1; }
    //else if (custscript_approve == 'custbody_approver_2') { g_currReciver = 2; }
    //else if (custscript_approve == 'custbody_approver_3') { g_currReciver = 3;}
    //else if (custscript_approve == 'custbody_approver_4') { g_currReciver = 4; }

    if (custscript_approve == 1) { g_currReciver = 1; }
    else if (custscript_approve == 2) { g_currReciver = 2; }
    else if (custscript_approve == 3) { g_currReciver = 3; }
    else if (custscript_approve == 4) { g_currReciver = 4; }

}
//function calcAmount(trnType, custrecord_trx_app_currency, rec) {
//    if (trnType == 'purchaseorder') {
//        var total = rec.getFieldValue('total');
//    }
//    else {
//        var total = rec.getFieldValue('usertotal');

//    }
//    var currency = rec.getFieldValue('currency');
//    if (currency != custrecord_trx_app_currency && !isNullOrEmpty(custrecord_trx_app_currency)) {
//        var exchangerate = rec.getFieldValue('exchangerate');
//        total = total * exchangerate;
//    }
//    return total;
//}
//function getRecieverCount(getApproverList, amount) {
//    debugger;
//    var custrecord_app_approval_1 = getApproverList[0].custrecord_po_approval_1;
//    var custrecord_app_approval_2 = getApproverList[0].custrecord_po_approval_2;
//    var custrecord_app_approval_3 = getApproverList[0].custrecord_po_approval_3;

//    var res = '';
//    if (Number(amount) > Number(custrecord_up_to_amount_1) && !isNullOrEmpty(custrecord_app_approval_1)) { res = custrecord_app_approval_1 }
//    if (Number(amount) > Number(custrecord_up_to_amount_2) && !isNullOrEmpty(custrecord_app_approval_2)) { res = custrecord_app_approval_2 }
//    if (Number(amount) > Number(custrecord_up_to_amount_3) && !isNullOrEmpty(custrecord_app_approval_3)) { res = custrecord_app_approval_3 }

//    return res;
//}
