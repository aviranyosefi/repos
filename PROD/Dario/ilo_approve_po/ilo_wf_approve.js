// SUITELET ACTION
function ilo_wf_approve_su(request, response) {
    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'first screen', 'first screen');
        var internalid = request.getParameter('internalid');
        var type = request.getParameter('type');
        var update = request.getParameter('update');
        var from = request.getParameter('from');
        var to = request.getParameter('to');
        var logId = request.getParameter('logId');
        var newNumber = request.getParameter('newNumber');
        var CurrReciver = request.getParameter('CurrReciver');
        var final = request.getParameter('final');
        //var nextApp = request.getParameter('nextApp');
        //if (isNullOrEmpty(nextApp)) { nextApp = '' }
        nlapiLogExecution('DEBUG', 'internalid: ' + internalid + ' ,record: ' + type, 'update type: ' + update + ' logId: ' + logId + ' newNumber: ' + newNumber );
        try {
            form = nlapiCreateForm('')
            
            var approved_transaction = nlapiLookupField(type, internalid, 'custbody_approved_transaction');
            var requestNumber = getLastLogNumberSuitelet(internalid)
            if (requestNumber != newNumber || !isNullOrEmpty(approved_transaction)) {
                var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
                var html = "<script>showAlertBox('alert_No_relevant', 'This request has expired', '', NLAlertDialog.TYPE_HIGH_PRIORITY)</script>";
                htmlfield.setDefaultValue(html);
            }
            else {
                var field = getCurrReciverField(CurrReciver);
                var fieldCheck = nlapiLookupField(type, internalid, field);
                
                if (!isNullOrEmpty(fieldCheck) ) {
                    var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
                    var html = "<script>showAlertBox('alert_No_relevant', 'You have already responded to this Approval request.', '', NLAlertDialog.TYPE_HIGH_PRIORITY)</script>";
                    htmlfield.setDefaultValue(html);
                }
                else {
                    if (update == 'rejected') {
                        var form = nlapiCreateForm('Please write reject reason ');
                        var rejectReason = form.addField('custpage_reject_reason', 'textarea', 'reject reason', null);
                        rejectReason.setMandatory(true);
                        form.addSubmitButton('Submit');

                        //fields
                        var recId = form.addField('custpage_ilo_rec_id', 'text', 'link back home', null, null);
                        recId.setDefaultValue(internalid);
                        recId.setDisplayType('hidden');
                        var recType = form.addField('custpage_ilo_rec_type', 'text', 'link back home', null, null);
                        recType.setDefaultValue(type);
                        recType.setDisplayType('hidden');
                        var fromField = form.addField('custpage_ilo_from', 'text', 'link back home', null, null);
                        fromField.setDefaultValue(from);
                        fromField.setDisplayType('hidden');
                        var recieverField = form.addField('custpage_ilo_to', 'text', 'link back home', null, null);
                        recieverField.setDefaultValue(to);
                        recieverField.setDisplayType('hidden');
                        var typeField = form.addField('custpage_ilo_field', 'text', 'link back home', null, null);
                        typeField.setDefaultValue(field);
                        typeField.setDisplayType('hidden');
                        var type_screen = form.addField('custpage_type_screen', 'text', 'link back home', null, null);
                        type_screen.setDefaultValue(update);
                        type_screen.setDisplayType('hidden');
                        var logIdField = form.addField('custpage_ilo_logid', 'text', 'link back home', null, null);
                        logIdField.setDefaultValue(logId);
                        logIdField.setDisplayType('hidden');
                        var CurrReciverField = form.addField('custpage_curr_reciver', 'text', 'link back home', null, null);
                        CurrReciverField.setDefaultValue(CurrReciver);
                        CurrReciverField.setDisplayType('hidden');
                    }
                    else { // approved
                        form = nlapiCreateForm('');
                        var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
                        var html = "<script>showAlertBox('alert_No_relevant', 'Confirmed', '', NLAlertDialog.TYPE_LOWEST_PRIORITY)</script>";
                        htmlfield.setDefaultValue(html); 
                        var rec = nlapiLoadRecord(type, internalid); 
                        rec.setFieldValue(field, 2)
                        if (final == 'T') {
                            rec.setFieldValue('custbody_approved_transaction', 2)
                            rec.setFieldValue('nextapprover', '')
                            //suiteletEmail(to, from, type_screen, type, internalid)
                        }
                        setResDate(logId, '2');
                        nlapiSubmitRecord(rec, null, true);
                    }
                }     
                //var finalField = form.addField('custpage_final', 'text', 'link back home', null, null);
                //finalField.setDefaultValue(final);
                //finalField.setDisplayType('hidden');
                //var nextAppField = form.addField('custpage_next_app', 'text', 'link back home', null, null);
                //nextAppField.setDefaultValue(nextApp);
                //nextAppField.setDisplayType('hidden');
                
            }                  

        }
        catch (e) {
            nlapiLogExecution('ERROR', 'error: ' , e);
        }
    }
    else { // POST
        nlapiLogExecution('DEBUG', 'second screen', 'second screen');
        form = nlapiCreateForm('')
        var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);       
        var internalid = request.getParameter('custpage_ilo_rec_id');
        var type = request.getParameter('custpage_ilo_rec_type');
        var from = request.getParameter('custpage_ilo_from');
        var type_screen = request.getParameter('custpage_type_screen');
        var logId = request.getParameter('custpage_ilo_logid');
        var reciever = request.getParameter('custpage_ilo_to');
        var CurrReciver = request.getParameter('custpage_curr_reciver');
        var final = request.getParameter('custpage_final');
        //var nextApp = request.getParameter('custpage_next_app');
        //if (isNullOrEmpty(nextApp)) { nextApp =''}
        var rec = nlapiLoadRecord(type, internalid);        
        var field = getCurrReciverField(CurrReciver)
        if (type_screen == 'rejected') {            
            var rejectReason = request.getParameter('custpage_reject_reason');
            rec.setFieldValue('custbody_transaction_rejection_notes', rejectReason)
            rec.setFieldValue('custbody_approved_transaction', 1)
            rec.setFieldValue(field, 1)
            //suiteletEmail(reciever, from, type_screen, type, internalid)
            setResDate(logId, '1');
        }
        //else {      
        //    //var comments = request.getParameter('custpage_comments');
        //    rec.setFieldValue('custbody_transaction_approval_notes', comments)
        //    rec.setFieldValue(field, 2)
        //    //rec.setFieldValue('nextapprover', nextApp)
        //    if (final == 'T') {               
        //        //fields[3] = 'custbody_approved_transaction'
        //        //values[3] = 2
        //        rec.setFieldValue('custbody_approved_transaction', 2)
        //        rec.setFieldValue('nextapprover', '')
        //        suiteletEmail(reciever, from, type_screen, type, internalid)
        //    }
        //    setResDate(logId, '2');
        //}  
        nlapiSubmitRecord(rec, null, true);
        //nlapiSubmitField(type, internalid, fields, values)
        var html = "<script>showAlertBox('alert_No_relevant', 'Confirmed', '', NLAlertDialog.TYPE_LOWEST_PRIORITY)</script>";
        htmlfield.setDefaultValue(html);             
    }

    response.writePage(form);
}
function getLastLogNumberSuitelet( tranid) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_ilo_approval_rece_nu');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ilo_approval_transaction', null, 'is', tranid)
    
    var search = nlapiCreateSearch('customrecord_one_trx_email_logs', filters, columns);

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
        lastNumber = s[s.length - 1].getValue('custrecord_ilo_approval_rece_nu')     
    }
    return parseInt(lastNumber);
}
function setResDate( logId, approved) {
    var fields = [];
    fields[0] = 'custrecord_ilo_approval_rece_res_date'
    fields[1] = 'custrecord_ilo_approval_approved'
    var dataField = [];
    dataField[0] = nlapiDateToString(new Date())
    dataField[1] = approved
    nlapiSubmitField('customrecord_one_trx_email_logs', logId, fields, dataField)
}
function getCurrReciverField(CurrReciver) {
    if (CurrReciver == 1) {
        return 'custbody_approver_1_indication'
    }
    else if (CurrReciver == 2) {
        return 'custbody_approver_2_indication'
    }
    else if (CurrReciver == 3) {
        return 'custbody_approver_3_indication'
    }
}
//*************************************************************************//

var CurrReciver;
var final = 'F';
var nextApp = '';
// WORKFLOW ACTION
function send_approve() { 
    nlapiLogExecution('DEBUG', 'Start send_approve');
    var SuiteletURL = nlapiResolveURL('SUITELET', 'customscript_ilo_wf_approve_su', 'customdeploy_ilo_wf_approve_su', true);    
    var context = nlapiGetContext();
    var custscript_approve = context.getSetting('SCRIPT', 'custscript_approve');  
    nlapiLogExecution('DEBUG', 'custscript_approve', custscript_approve);
    var type = nlapiGetRecordType();
    var internalid = nlapiGetRecordId();   
    var rec = nlapiLoadRecord(type, internalid)
    var settings = getSettings(type);
    nlapiLogExecution('DEBUG', 'settings', JSON.stringify(settings));
    if (settings.length > 0) {
        try {                      
            var aprroval_type = settings[0].aprroval_type
            var sent_from = settings[0].sent_from                   
            var from = rec.getFieldValue(sent_from);                   
            if (aprroval_type == 1) {// FROM TRANSACTION
                var sent_to = settings[0].sent_to 
                reciever = rec.getFieldValue(sent_to)
            } else {     
                getNextReciever(rec);
                getCurrReciver(custscript_approve)
                var reciever = rec.getFieldValue(custscript_approve)
            }           
            nlapiLogExecution('DEBUG', 'reciever', reciever);
            if (!isNullOrEmpty(reciever)) {
                var recData = createIloLog(internalid);
                var logId = recData[0];
                var newNumber = recData[1];
                var approvedurl = SuiteletURL + '&internalid=' + internalid + '&type=' + type + '&update=approved' + '&from=' + from + '&logId=' + logId + '&newNumber=' + newNumber;
                var rejecturl = SuiteletURL + '&internalid=' + internalid + '&type=' + type + '&update=rejected' + '&from=' + from + '&logId=' + logId + '&newNumber=' + newNumber;
                nlapiLogExecution('DEBUG', 'type: ' + type, 'internalid: ' + internalid);
                approvedurl += '&to=' + reciever + '&CurrReciver=' + CurrReciver + '&final=' + final //+'&nextApp=' + nextApp
                rejecturl += '&to=' + reciever + '&CurrReciver=' + CurrReciver + '&final=' + final //+ '&nextApp=' + nextApp
                var email_template = settings[0].email_template
                var emailMerger = nlapiCreateEmailMerger(email_template);
                try {
                    emailMerger.setTransaction(internalid);
                    var mergeResult = emailMerger.merge();
                    var sbj = mergeResult.getSubject();
                    var msg = mergeResult.getBody();
                    msg = msg.replace('approvedurl', approvedurl);
                    msg = msg.replace('rejecturl', rejecturl);

                    var entityid = nlapiLookupField('employee', reciever, 'entityid');
                    msg = msg.replace('/entityid/', entityid);

                    var attachRec = new Object();
                    attachRec['transaction'] = internalid;

                    var emailAttachmentList = null;
                    var attach_files = settings[0].attach_files
                    if (attach_files == 'T') {
                        emailAttachmentList = getInvoiceAttachments(internalid);
                    }
                    nlapiLogExecution('debug', 'send email', 'send email');
                    nlapiSendEmail(from, reciever, sbj, msg, null, null, attachRec, emailAttachmentList, false);
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
    filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T')


    var search = nlapiCreateSearch('transaction', filters, columns);
    var resultset = search.runSearch();
    results = resultset.getResults(0, 1000);

    if (results != []) {
        results.forEach(function (line) {
            var attachRecID = line.getValue('internalid', 'file')
            var attachFileObj = nlapiLoadFile(attachRecID)
            toReturn.push(attachFileObj)
        });
    }
    return toReturn;
}
function createIloLog(tranid) {
    try {
        var rec = nlapiCreateRecord('customrecord_one_trx_email_logs');
        rec.setFieldValue('custrecord_ilo_approval_transaction', tranid);
        var newNumber = getLastLogNumber(tranid)
        rec.setFieldValue('custrecord_ilo_approval_rece_nu', newNumber);
        var id = nlapiSubmitRecord(rec);
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
function getLastLogNumber( tranid) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_ilo_approval_rece_nu');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ilo_approval_transaction', null, 'is', tranid)
    
    var search = nlapiCreateSearch('customrecord_one_trx_email_logs', filters, columns);

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
        lastNumber = s[s.length - 1].getValue('custrecord_ilo_approval_rece_nu')
    }
    return parseInt(lastNumber) + 1;
}
function getApprover(custom_record_id, filter_by_department, filter_by_class,rec) {
    pac_subsidiary =rec.getFieldValue('subsidiary');
    var filters = new Array();
    filters.push(new nlobjSearchFilter('custrecord_occ_subsidiary', null, 'anyof', pac_subsidiary))
   
    if (filter_by_department == 2) {
        pac_department = rec.getFieldValue('department');
        if (!isNullOrEmpty(pac_department)) {
            filters.push(new nlobjSearchFilter('custrecord_occ_department', null, 'anyof', pac_department))
        }
        
    }
    if (filter_by_class == 2) {
        pac_class =rec.getFieldValue('class');
        if (!isNullOrEmpty(pac_class)) {
            filters.push(new nlobjSearchFilter('custrecord_occ_class', null, 'anyof', pac_class))
        }
    } 
    var s = [];
    var res = [];
    var columns = new Array();
    columns.push(new nlobjSearchColumn('custrecord_occ_approver_1'));
    columns.push(new nlobjSearchColumn('custrecord_occ_approver_2'));
    columns.push(new nlobjSearchColumn('custrecord_occ_approver_3'));
    columns.push(new nlobjSearchColumn('custrecord_trx_amount_settings'));
    columns.push(new nlobjSearchColumn('custrecord_up_to_amount_1', 'CUSTRECORD_TRX_AMOUNT_SETTINGS'))
    columns.push(new nlobjSearchColumn('custrecord_trx_app_approval_1', 'CUSTRECORD_TRX_AMOUNT_SETTINGS'))
    columns.push(new nlobjSearchColumn('custrecord_up_to_amount_2', 'CUSTRECORD_TRX_AMOUNT_SETTINGS'))
    columns.push(new nlobjSearchColumn('custrecord_trx_app_approval_2', 'CUSTRECORD_TRX_AMOUNT_SETTINGS'))
    columns.push(new nlobjSearchColumn('custrecord_up_to_amount_3', 'CUSTRECORD_TRX_AMOUNT_SETTINGS'))
    columns.push(new nlobjSearchColumn('custrecord_trx_app_approval_3', 'CUSTRECORD_TRX_AMOUNT_SETTINGS'))
    columns.push(new nlobjSearchColumn('custrecord_trx_app_currency', 'CUSTRECORD_TRX_AMOUNT_SETTINGS'))

    var search = nlapiCreateSearch(custom_record_id, filters, columns);
    var resultset = search.runSearch();
    s = resultset.getResults(0, 1000);
    if (s != [] && s.length > 0) {
        res.push({
            approver1: s[0].getValue('custrecord_occ_approver_1'),
            approver2: s[0].getValue('custrecord_occ_approver_2'),
            approver3: s[0].getValue('custrecord_occ_approver_3'),
            amount_settings: s[0].getValue('custrecord_trx_amount_settings'),
            custrecord_up_to_amount_1: s[0].getValue('custrecord_up_to_amount_1','CUSTRECORD_TRX_AMOUNT_SETTINGS' ),
            custrecord_trx_app_approval_1: s[0].getValue( 'custrecord_trx_app_approval_1','CUSTRECORD_TRX_AMOUNT_SETTINGS'),
            custrecord_up_to_amount_2: s[0].getValue('custrecord_up_to_amount_2','CUSTRECORD_TRX_AMOUNT_SETTINGS'),
            custrecord_trx_app_approval_2: s[0].getValue('custrecord_trx_app_approval_2','CUSTRECORD_TRX_AMOUNT_SETTINGS'),
            custrecord_up_to_amount_3: s[0].getValue('custrecord_up_to_amount_3','CUSTRECORD_TRX_AMOUNT_SETTINGS'),
            custrecord_trx_app_approval_3: s[0].getValue('custrecord_trx_app_approval_3','CUSTRECORD_TRX_AMOUNT_SETTINGS'),
            custrecord_trx_app_currency: s[0].getValue('custrecord_trx_app_currency','CUSTRECORD_TRX_AMOUNT_SETTINGS'),
        })      
    }
    return res;
}
function getSettings(trnType) {
    try {
        var s = [];
        var columns = new Array();
        columns.push(new nlobjSearchColumn('custrecord_trx_email_template'))
        //columns.push(new nlobjSearchColumn('custrecord_trx_default_approver'))
        columns.push(new nlobjSearchColumn('custrecord_trx_approval_type'))
        columns.push(new nlobjSearchColumn('custrecord_trx_attach_files'))
        columns.push(new nlobjSearchColumn('custrecord_trx_filter_by_department'))
        columns.push(new nlobjSearchColumn('custrecord_trx_filter_by_class'))
        columns.push(new nlobjSearchColumn('custrecord_trx_email_sent_from'))
        columns.push(new nlobjSearchColumn('custrecord_trx_email_sent_to'))

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custrecord_trx_transaction', null, 'is', trnType)

        var search = nlapiCreateSearch('customrecord_one_trx_approval_settings', filters, columns);
        var resultset = search.runSearch();
        s = resultset.getResults(0, 1000);
        var results = [];
        if (s != [] && s.length > 0) {
            results.push({
                email_template: s[0].getValue('custrecord_trx_email_template'),
                //default_approver: s[0].getValue('custrecord_trx_default_approver'),
                aprroval_type: s[0].getValue('custrecord_trx_approval_type'),
                custom_record_id: 'customrecord_classification_combination',
                attach_files: s[0].getValue('custrecord_trx_attach_files'),
                filter_by_department: s[0].getValue('custrecord_trx_filter_by_department'),
                filter_by_class: s[0].getValue('custrecord_trx_filter_by_class'),
                sent_from: s[0].getValue('custrecord_trx_email_sent_from'),
                sent_to: s[0].getValue('custrecord_trx_email_sent_to'),
            })
            return results
        }
        return '';
    } catch (e) { return '';}
}
function calcAmount(trnType, custrecord_trx_app_currency , rec) {
    if (trnType == 'purchaseorder') {
        var total = rec.getFieldValue('total');
    }
    else {
        var total = rec.getFieldValue('usertotal');
       
    }
    var currency = rec.getFieldValue('currency');
    if (currency != custrecord_trx_app_currency && !isNullOrEmpty(custrecord_trx_app_currency)) {
        var exchangerate = rec.getFieldValue('exchangerate');
        total = total * exchangerate;
    }
    return total
}
function getRecieverCount(getApproverList, amount) {
    debugger;
    var custrecord_up_to_amount_1 = getApproverList[0].custrecord_up_to_amount_1
    var custrecord_trx_app_approval_1 = getApproverList[0].custrecord_trx_app_approval_1
    var custrecord_up_to_amount_2 = getApproverList[0].custrecord_up_to_amount_2
    var custrecord_trx_app_approval_2 = getApproverList[0].custrecord_trx_app_approval_2
    var custrecord_up_to_amount_3 = getApproverList[0].custrecord_up_to_amount_3
    var custrecord_trx_app_approval_3 = getApproverList[0].custrecord_trx_app_approval_3

    var res = '';
    if (Number(amount) > Number(custrecord_up_to_amount_1) && !isNullOrEmpty(custrecord_trx_app_approval_1)) { res = custrecord_trx_app_approval_1 }
    if (Number(amount) > Number(custrecord_up_to_amount_2) && !isNullOrEmpty(custrecord_trx_app_approval_2)) { res = custrecord_trx_app_approval_2 }
    if (Number(amount) > Number(custrecord_up_to_amount_3) && !isNullOrEmpty(custrecord_trx_app_approval_3)) { res = custrecord_trx_app_approval_3 }

    return res;
}
function getReciver(getApproverList, CountOfRecievers , rec) {
    var approver1 = getApproverList[0].approver1
    var approver2 = getApproverList[0].approver2
    var approver3 = getApproverList[0].approver3
    if (CountOfRecievers == 1) {  
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_1_indication'))) { CurrReciver = 1; final='T' ; return approver1 }
    }
    else if (CountOfRecievers == 2) {
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_1_indication'))) { CurrReciver = 1; nextApp = approver2; return approver1 }
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_2_indication'))) { CurrReciver = 2; final = 'T' ; return approver2 }
    }
    else if (CountOfRecievers == 3) {
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_1_indication'))) { CurrReciver = 1; nextApp = approver2; return approver1 }
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_2_indication'))) { CurrReciver = 2; nextApp = approver3; return approver2 }
        if (isNullOrEmpty(rec.getFieldValue('custbody_approver_3_indication'))) { CurrReciver = 3; final = 'T' ; return approver3 }
    }  
}
function getNextReciever(rec) {
    var approver1 = rec.getFieldValue('custbody_approver_1')
    var approver2 = rec.getFieldValue('custbody_approver_2')
    var approver3 = rec.getFieldValue('custbody_approver_3')
    if (!isNullOrEmpty(approver1) && isNullOrEmpty(rec.getFieldValue('custbody_approver_1_indication'))) {
        if (isNullOrEmpty(approver2)) { final = 'T'}
        //CurrReciver = 1
        return approver1 
    }
    else if (!isNullOrEmpty(approver2) && isNullOrEmpty(rec.getFieldValue('custbody_approver_2_indication'))) {
        if (isNullOrEmpty(approver3)) { final = 'T' }
        //CurrReciver = 2
        return approver2
    }
    else if (!isNullOrEmpty(approver3) && isNullOrEmpty(rec.getFieldValue('custbody_approver_3_indication'))) {
        final = 'T'
        //CurrReciver = 3
        return approver3
    }
    return '';
}
function getCurrReciver(custscript_approve) {
    if (custscript_approve == 'custbody_approver_1') { CurrReciver = 1}
    else if (custscript_approve =='custbody_approver_2') { CurrReciver = 2 }
    else if (custscript_approve =='custbody_approver_3') { CurrReciver = 3}
}
