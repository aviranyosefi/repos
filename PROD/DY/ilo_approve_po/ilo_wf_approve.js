// bundle 362629
// suitelet
// 
function check_po(request, response) {

    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'first screen', 'first screen');
        var internalid = request.getParameter('internalid');
        var type = request.getParameter('type');
        var update = request.getParameter('update');
        var user = request.getParameter('em');
        var logId = request.getParameter('logId');
        var newNumber = request.getParameter('newNumber');
        nlapiLogExecution('DEBUG', 'internalid: ' + internalid + ' ,record: ' + type, 'update type: ' + update + ' logId: ' + logId + ' newNumber: ' + newNumber );
        try {
            form = nlapiCreateForm('')
            var field = 'custbody_approved_transaction';
            nlapiLogExecution('DEBUG', 'field', field);
            var requestNumber = getLastLogNumberSuitelet(internalid) // checkIfReqExpired(LogType, logId);
            nlapiLogExecution('DEBUG', 'requestNumber', requestNumber);
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
                var recieverField = form.addField('custpage_ilo_reciever', 'text', 'link back home', null, null);
                recieverField.setDefaultValue(user);
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
        var user = request.getParameter('custpage_ilo_reciever');
        var field = request.getParameter('custpage_ilo_field');
        var type_screen = request.getParameter('custpage_type_screen');
        var logId = request.getParameter('custpage_ilo_logid');
        var reciever = nlapiLookupField(type, internalid, 'custbody_approved_by'); 
        if (type_screen == 'rejected') {            
            var rejectReason = request.getParameter('custpage_reject_reason');
            nlapiSubmitField(type, internalid, 'custbody_rejected_reason', rejectReason);
            nlapiSubmitField(type, internalid, field, 2) // No 
            setResDate(logId, '2');
        }
        else {      
            var comments = request.getParameter('custpage_comments');
            nlapiSubmitField(type, internalid, 'custbody_approval_notes', comments);
            nlapiSubmitField(type, internalid, field, 1) // YES  
            setResDate(logId, '1');
        }      
        suiteletEmail(reciever, user, type_screen, type, internalid)
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
    
    var search = nlapiCreateSearch('customrecord_ilo_approval_process', filters, columns);

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
    fields[1] = 'custrecord_ilo_approved'
    var dataField = [];
    dataField[0] = nlapiDateToString(new Date())
    dataField[1] = approved
    nlapiSubmitField('customrecord_ilo_approval_process', logId, fields, dataField)
}

//*************************************************************************//
//*************************************************************************//

// WORKFLOW ACTION
function send_approve() {
    //var context = nlapiGetContext();
    //var company = context.company;
    //company = company.replace('_', '-');
    //var SuiteletURL = 'https://' + company +'.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=566&deploy=1&compid=5246650_SB2&h=e0f935cfae0c15769310'
    var SuiteletURL = nlapiResolveURL('SUITELET', 'customscript_ilo_wf_approve_su', 'customdeploy_ilo_wf_approve_su', true);
    nlapiLogExecution('DEBUG', 'Start send_approve');
    try {
        var fromId = nlapiGetFieldValue('custbody_transaction_creator');   
        var internalid = nlapiGetRecordId();
        var type = nlapiGetRecordType();
        var recData = createIloLog(internalid);
        var logId = recData[0];
        var newNumber = recData[1];
        var approvedurl = SuiteletURL + '&internalid=' + internalid + '&type=' + type + '&update=approved' + '&em=' + fromId + '&logId=' + logId + '&newNumber=' + newNumber;
        var rejecturl = SuiteletURL + '&internalid=' + internalid + '&type=' + type + '&update=rejected' + '&em=' + fromId + '&logId=' + logId + '&newNumber=' + newNumber;
        nlapiLogExecution('DEBUG', 'type: ' + type, 'internalid: ' + internalid);        
        var reciever = nlapiGetFieldValue('custbody_approved_by');
        nlapiLogExecution('DEBUG', 'reciever',reciever);  
        if (!isNullOrEmpty(reciever)) {
            var email = reciever
            var emailMerger = nlapiCreateEmailMerger('109');   
            try {
                emailMerger.setTransaction(internalid);
                var mergeResult = emailMerger.merge();
                var msg = mergeResult.getBody();
                msg = msg.replace('approvedurl', approvedurl);
                msg = msg.replace('rejecturl', rejecturl);
                nlapiLogExecution('DEBUG', 'msg', msg);  
                var entity = nlapiGetFieldValue('entity');
                var entityName = nlapiLookupField('vendor', entity, 'companyname')
                nlapiLogExecution('DEBUG', 'entityName', entityName);
                var sbj = entityName + ' Invoice for your approval';
                var attachRec = new Object();
                attachRec['transaction'] = internalid;
                var AttachmentreturnResults = getInvoiceAttachments(internalid);
                nlapiLogExecution('DEBUG', 'AttachmentreturnResults', AttachmentreturnResults);  
                if (AttachmentreturnResults != null || AttachmentreturnResults != undefined || AttachmentreturnResults != []) {
                    var emailAttachmentList = [];
                    for (var s = 0; s < AttachmentreturnResults.length; s++) {
                        try {
                            var attachRecID = AttachmentreturnResults[s].fileID
                            var attachFileObj = nlapiLoadFile(attachRecID)
                            emailAttachmentList.push(attachFileObj)
                        } catch (err) {
                            continue;
                        }
                    }
                }
                nlapiLogExecution('debug', 'send email', 'send email');
                nlapiSendEmail(fromId, email, sbj, msg, null, null, attachRec, emailAttachmentList, false);
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

function formatNumber(num) {
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return num

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

            toReturn.push({
                fileName: line.getValue('name', 'file'),
                fileID: line.getValue('internalid', 'file'),
                fileURL: line.getValue('url', 'file')
            })


        });
    }

    return toReturn;
}

function createIloLog(tranid) {

    try {
        var rec = nlapiCreateRecord('customrecord_ilo_approval_process');
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
    
    var search = nlapiCreateSearch('customrecord_ilo_approval_process', filters, columns);

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
