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
        nlapiLogExecution('DEBUG', 'internalid: ' + internalid + ' ,record: ' + type, 'update type: ' + update + ' logId: ' + logId + ' newNumber: ' + newNumber );
        try {
            form = nlapiCreateForm('')
            var field = 'custbody_approved_transaction';
            var requestNumber = getLastLogNumberSuitelet(internalid)
            if (requestNumber != newNumber ) {
                var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
                var html = "<script>showAlertBox('alert_No_relevant', 'This request has expired', '', NLAlertDialog.TYPE_HIGH_PRIORITY)</script>";
                htmlfield.setDefaultValue(html);
            }
            else {
                var fieldCheck = nlapiLookupField(type, internalid, field);
                if (!isNullOrEmpty(fieldCheck)) {
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
                    }
                    else { // approved
                        form = nlapiCreateForm('Please write comments');
                        form.addSubmitButton('Submit');
                        form.addField('custpage_comments', 'textarea', 'comments', null);
                    }
                }
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
        var field = request.getParameter('custpage_ilo_field');
        var type_screen = request.getParameter('custpage_type_screen');
        var logId = request.getParameter('custpage_ilo_logid');
        var reciever = request.getParameter('custpage_ilo_to');
        if (type_screen == 'rejected') {            
            var rejectReason = request.getParameter('custpage_reject_reason');
            nlapiSubmitField(type, internalid, 'custbody_transaction_rejection_notes', rejectReason);
            nlapiSubmitField(type, internalid, field, 1) // No 
            setResDate(logId, '1');
        }
        else {      
            var comments = request.getParameter('custpage_comments');
            nlapiSubmitField(type, internalid, 'custbody_transaction_approval_notes', comments);
            nlapiSubmitField(type, internalid, field, 2) // YES  
            setResDate(logId, '2');
        }      
        suiteletEmail(reciever, from, type_screen, type, internalid)
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

//*************************************************************************//
//*************************************************************************//

// WORKFLOW ACTION
function send_approve() { 
    var SuiteletURL = nlapiResolveURL('SUITELET', 'customscript_ilo_wf_approve_su', 'customdeploy_ilo_wf_approve_su', true);
    nlapiLogExecution('DEBUG', 'Start send_approve');
    var type = nlapiGetRecordType();
    nlapiLogExecution('DEBUG', 'type', type);
    var settings = getSettings(type);
    nlapiLogExecution('DEBUG', 'settings', JSON.stringify(settings));
    if (settings.length > 0) {
        try {            
           
            var aprroval_type = settings[0].aprroval_type
            var sent_from = settings[0].sent_from
            var sent_to = settings[0].sent_to
         
            var from = nlapiGetFieldValue(sent_from);
            nlapiLogExecution('DEBUG', 'Start send_approve');
            var internalid = nlapiGetRecordId();            
            var recData = createIloLog(internalid);
            var logId = recData[0];
            var newNumber = recData[1];
            var approvedurl = SuiteletURL + '&internalid=' + internalid + '&type=' + type + '&update=approved' + '&from=' + from + '&logId=' + logId + '&newNumber=' + newNumber;
            var rejecturl = SuiteletURL + '&internalid=' + internalid + '&type=' + type + '&update=rejected' + '&from=' + from + '&logId=' + logId + '&newNumber=' + newNumber;
            nlapiLogExecution('DEBUG', 'type: ' + type, 'internalid: ' + internalid);

            if (aprroval_type == 1) {// FROM TRANSACTION
                reciever = nlapiGetFieldValue(sent_to)
            } else {
                var filter_by_department = settings[0].filter_by_department
                var filter_by_class = settings[0].filter_by_class
                var custom_record_id = settings[0].custom_record_id
                var reciever = getApprover(custom_record_id, filter_by_department, filter_by_class)
            }
            if (isNullOrEmpty(reciever)) {
                reciever = settings[0].default_approver
            }
            nlapiLogExecution('DEBUG', 'reciever', reciever);
            if (!isNullOrEmpty(reciever)) {
                approvedurl += '&to=' + reciever
                rejecturl += '&to=' + reciever
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
function getApprover(custom_record_id, filter_by_department, filter_by_class) {

    pac_subsidiary = nlapiGetFieldValue('subsidiary');
    var filters = new Array();
    filters.push(new nlobjSearchFilter('custrecord_occ_subsidiary', null, 'anyof', pac_subsidiary))
   
    if (filter_by_department == 2) {
        pac_department = nlapiGetFieldValue('department');
        if (!isNullOrEmpty(pac_department)) {
            filters.push(new nlobjSearchFilter('custrecord_occ_department', null, 'anyof', pac_department))
        }
        
    }
    if (filter_by_class == 2) {
        pac_class = nlapiGetFieldValue('class');
        if (!isNullOrEmpty(pac_class)) {
            filters.push(new nlobjSearchFilter('custrecord_occ_class', null, 'anyof', pac_class))
        }
    } 
    var s = [];
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_occ_approver');
   
    var search = nlapiCreateSearch(custom_record_id, filters, columns);
    var resultset = search.runSearch();
    s = resultset.getResults(0, 1000);

    if (s != [] && s.length > 0) {
        var approver = s[0].getValue('custrecord_occ_approver')
        return approver         
    }
    return '';
}
function getSettings(type) {
    try {
        var s = [];
        var columns = new Array();
        columns.push(new nlobjSearchColumn('custrecord_trx_email_template'))
        columns.push(new nlobjSearchColumn('custrecord_trx_default_approver'))
        columns.push(new nlobjSearchColumn('custrecord_trx_approval_type'))
        columns.push(new nlobjSearchColumn('custrecord_trx_custom_record_id'))
        columns.push(new nlobjSearchColumn('custrecord_trx_attach_files'))
        columns.push(new nlobjSearchColumn('custrecord_trx_filter_by_department'))
        columns.push(new nlobjSearchColumn('custrecord_trx_filter_by_class'))
        columns.push(new nlobjSearchColumn('custrecord_trx_email_sent_from'))
        columns.push(new nlobjSearchColumn('custrecord_trx_email_sent_to'))

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custrecord_trx_transaction', null, 'is', type)

        var search = nlapiCreateSearch('customrecord_one_trx_approval_settings', filters, columns);
        var resultset = search.runSearch();
        s = resultset.getResults(0, 1000);
        var results = [];
        if (s != [] && s.length > 0) {
            results.push({
                email_template: s[0].getValue('custrecord_trx_email_template'),
                default_approver: s[0].getValue('custrecord_trx_default_approver'),
                aprroval_type: s[0].getValue('custrecord_trx_approval_type'),
                custom_record_id: s[0].getValue('custrecord_trx_custom_record_id'),
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

