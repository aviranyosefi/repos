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
        var currReciver = request.getParameter('currReciver');
        var final = request.getParameter('final');
        //var nextApp = request.getParameter('nextApp');
        //if (isNullOrEmpty(nextApp)) { nextApp = '' }
        nlapiLogExecution('DEBUG', 'internalid: ' + internalid + ' ,record: ' + type, 'update type: ' + update + ' logId: ' + logId + ' newNumber: ' + newNumber + ' currReciver:' + currReciver);
        try {
            form = nlapiCreateForm('');

            var approved_transaction = nlapiLookupField(type, internalid, 'custbody_approved_transaction');
            nlapiLogExecution('DEBUG', 'approved_transaction', approved_transaction);

            var requestNumber = getLastLogNumberSuitelet(internalid);
            nlapiLogExecution('DEBUG', 'requestNumber', requestNumber);

            if (requestNumber != newNumber || !isNullOrEmpty(approved_transaction)) {
                var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
                var html = "<script>showAlertBox('alert_No_relevant', 'This request has expired', '', NLAlertDialog.TYPE_HIGH_PRIORITY)</script>";
                htmlfield.setDefaultValue(html);
            }
            else {
                var field = getCurrReciverField(currReciver);
                nlapiLogExecution('DEBUG', 'field', field);

                var fieldCheck = nlapiLookupField(type, internalid, field);
                nlapiLogExecution('DEBUG', 'fieldCheck', fieldCheck);

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
                        CurrReciverField.setDefaultValue(currReciver);
                        CurrReciverField.setDisplayType('hidden');
                    }
                    else { // approved
                        form = nlapiCreateForm('');
                        var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
                        var html = "<script>showAlertBox('alert_No_relevant', 'Confirmed', '', NLAlertDialog.TYPE_LOWEST_PRIORITY)</script>";
                        htmlfield.setDefaultValue(html);
                        var rec = nlapiLoadRecord(type, internalid);
                        rec.setFieldValue(field, 2);//yes
                        if (final == 'T') {
                            rec.setFieldValue('custbody_approved_transaction', 2);
                            rec.setFieldValue('nextapprover', '');
                            rec.setFieldValue('custbody_transaction_rejection_notes', '');//update the rejection notes in case that the transaction finally have been approved
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
            nlapiLogExecution('ERROR', 'error: ', e);
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
        var currReciver = request.getParameter('custpage_curr_reciver');
        var final = request.getParameter('custpage_final');
        //var nextApp = request.getParameter('custpage_next_app');
        //if (isNullOrEmpty(nextApp)) { nextApp =''}
        var rec = nlapiLoadRecord(type, internalid);
        var field = getCurrReciverField(currReciver);

        nlapiLogExecution('DEBUG', 'type:' + type, 'from:' + from + 'type_screen' + type_screen + 'reciever' + reciever + 'currReciver' + currReciver + 'field' + field);

        if (type_screen == 'rejected') {
            var rejectReason = request.getParameter('custpage_reject_reason');
            rec.setFieldValue('custbody_transaction_rejection_notes', rejectReason);
            rec.setFieldValue('custbody_approved_transaction', 1);//no
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
        //nlapiSubmitField(type, internalid, fields, values);
        var html = "<script>showAlertBox('alert_No_relevant', 'Confirmed', '', NLAlertDialog.TYPE_LOWEST_PRIORITY)</script>";
        htmlfield.setDefaultValue(html);
    }

    response.writePage(form);
}
function getLastLogNumberSuitelet(tranid) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_ilo_approval_rece_nu');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ilo_approval_transaction', null, 'is', tranid)

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
    return parseInt(lastNumber);
}
function setResDate(logId, approved) {
    var fields = [];
    fields[0] = 'custrecord_ilo_approval_rece_res_date';
    fields[1] = 'custrecord_ilo_approval_approved';
    var dataField = [];
    dataField[0] = nlapiDateToString(new Date());
    dataField[1] = approved;
    nlapiSubmitField('customrecord_one_email_logs', logId, fields, dataField);
}
function getCurrReciverField(currReciver) {
    if (currReciver == 1) {
        return 'custbody_approver_1_indication';
    }
    else if (currReciver == 2) {
        return 'custbody_approver_2_indication';
    }
    else if (currReciver == 3) {
        return 'custbody_approver_3_indication';
    }
    else if (currReciver == 4) {
        return 'custbody_approver_4_indication';
    }
}
