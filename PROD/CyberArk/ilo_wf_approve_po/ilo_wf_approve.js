// bundle 362629
// suitelet
// 
var expired;
function check_po(request, response) {

    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'first screen', 'first screen');
        var internalid = request.getParameter('internalid');
        var type = request.getParameter('type');
        var update = request.getParameter('update');
        var user = request.getParameter('em');
        var tolerance = request.getParameter('tolerance');
        var logId = request.getParameter('logId');
        var newNumber = request.getParameter('newNumber');
        nlapiLogExecution('DEBUG', 'internalid: ' + internalid + ' ,record: ' + type, 'update type: ' + update + ' ,tolerance: ' + tolerance + ' ,logId:' + logId + ' ,newNumber: ' + newNumber);

        try {
            form = nlapiCreateForm('')
            var LogType = 'approval'
            var field = 'custbody_receiver_approval';
            if (!isNullOrEmpty(tolerance)) { field = 'custbody_tolerance_approver'; LogType = 'tolerance' };
            nlapiLogExecution('DEBUG', 'field', field);
            var requestNumber = getLastLogNumberSuitelet(LogType, internalid) // checkIfReqExpired(LogType, logId);
            nlapiLogExecution('DEBUG', 'requestNumber', requestNumber);
            if (requestNumber != newNumber || expired == 'T') {
                var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
                var html = "<script>showAlertBox('alert_No_relevant', 'This request has expired', '', NLAlertDialog.TYPE_HIGH_PRIORITY)</script>";
                htmlfield.setDefaultValue(html);
            }
            else {
                var fieldCheck = nlapiLookupField(type, internalid, field);
                if (!isNullOrEmpty(fieldCheck)) {
                    if (fieldCheck == 1) { // YES
                        var html = "<script>showAlertBox('alert_No_relevant', 'Transaction already approved', '', NLAlertDialog.TYPE_LOWEST_PRIORITY)</script>";
                    }
                    else {                       
                        var html = "<script>showAlertBox('alert_No_relevant', 'You have already responded to this Approval request.', '', NLAlertDialog.TYPE_HIGH_PRIORITY)</script>";                     
                    }
                    var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
                    htmlfield.setDefaultValue(html);
       
                }
                else {
                    if (update == 'rejected') {
                        var form = nlapiCreateForm('Please write reject reason ');
                        var rejectReason = form.addField('custpage_reject_reason', 'textarea', '', null);
                        rejectReason.setMandatory(true);
                        form.addSubmitButton('Update');
                    }
                    else { // approved
                        form = nlapiCreateForm('');
                        var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
                        var html = "<script>showAlertBox('alert_No_relevant', 'Transaction approved', '', NLAlertDialog.TYPE_LOWEST_PRIORITY)</script>";
                        htmlfield.setDefaultValue(html);
                        nlapiSubmitField(type, internalid, field, 1) // Yes
                        nlapiSubmitField(type, internalid, 'custbody_nc_po_reject_reason', '');
                        var financial_approval = nlapiLookupField(type, internalid, 'custbody_financial_approval')
                        nlapiLogExecution('DEBUG', 'custbody_financial_approval', financial_approval);
                        if (!isNullOrEmpty(tolerance)) {
                            setResDate('tolerance', logId, '1');
                            var receiver_approval = nlapiLookupField(type, internalid, 'custbody_receiver_approval')
                            //var reciever = nlapiLookupField(type, internalid, 'custbody_nc_pba_tolerance_approver')
                            var subsidiary = nlapiLookupField(type, internalid, 'subsidiary')
                            var reciever = getToleranceApprover(subsidiary)
                            if (financial_approval == '1' && receiver_approval == '1' && type != 'vendorcredit') {
                                nlapiSubmitField(type, internalid, 'paymenthold', 'F');
                            }
                        }
                        else {
                            setResDate('approval', logId, '1');
                            var nc_vbtol_reject_reason = nlapiLookupField(type, internalid, 'custbody_nc_vbtol_reject_reason')
                            var tolerance_approver = nlapiLookupField(type, internalid, 'custbody_tolerance_approver')
                            var reciever = nlapiLookupField(type, internalid, 'custbody_bill_po_reciever')
                            if (type != 'vendorcredit' && (financial_approval == '1' && !isNullOrEmpty(nc_vbtol_reject_reason) && tolerance_approver == '1') ||
                                (financial_approval == '1' && isNullOrEmpty(nc_vbtol_reject_reason))) {
                                nlapiSubmitField(type, internalid, 'paymenthold', 'F');
                            }
                        }
                        if (!isNullOrEmpty(tolerance) || type == 'vendorcredit' || (type != 'vendorcredit' && ((tolerance_approver == '1' && !isNullOrEmpty(nc_vbtol_reject_reason) || isNullOrEmpty(nc_vbtol_reject_reason))))) {
                            suiteletEmail(reciever,user, update, type, internalid)
                        }
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
                var logIdField = form.addField('custpage_ilo_logid', 'text', 'link back home', null, null);
                logIdField.setDefaultValue(logId);
                logIdField.setDisplayType('hidden');

            }
        }
        catch (e) {

        }


    }
    else { // POST
        nlapiLogExecution('DEBUG', 'second screen', 'second screen');
        form = nlapiCreateForm('')
        var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
        var rejectReason = request.getParameter('custpage_reject_reason');
        var internalid = request.getParameter('custpage_ilo_rec_id');
        var type = request.getParameter('custpage_ilo_rec_type');
        var user = request.getParameter('custpage_ilo_reciever');
        var field = request.getParameter('custpage_ilo_field');
        var logId = request.getParameter('custpage_ilo_logid');
        nlapiSubmitField(type, internalid, 'custbody_nc_po_reject_reason', rejectReason);
        nlapiSubmitField(type, internalid, field, 2) // No
       
        var html = "<script>showAlertBox('alert_No_relevant', 'Confirmed', '', NLAlertDialog.TYPE_LOWEST_PRIORITY)</script>";
        htmlfield.setDefaultValue(html);
        if (field == 'custbody_tolerance_approver') {
            setResDate('tolerance', logId, '2');
            var subsidiary = nlapiLookupField(type, internalid, 'subsidiary')
            var reciever = getToleranceApprover(subsidiary) //nlapiLookupField(type, internalid, 'custbody_nc_pba_tolerance_approver')
        }
        else {
            setResDate('approval', logId, '2');
            var reciever = nlapiLookupField(type, internalid, 'custbody_bill_po_reciever')
        }
        suiteletEmail(reciever,user, 'rejected', type, internalid)
    }

    response.writePage(form);
}

function getLastLogNumberSuitelet(type, tranid) {



    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_ilo_approval_rece_nu');
    columns[1] = new nlobjSearchColumn('custrecord_ilo_tolerance_nu');
    columns[2] = new nlobjSearchColumn('custrecord_ilo_expired');
    columns[3] = new nlobjSearchColumn('internalid').setSort(false);
    

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ilo_approval_transaction', null, 'is', tranid)
    if (type == 'tolerance') {
        filters[1] = new nlobjSearchFilter('custrecord_ilo_tolerance_cb', null, 'is', 'T')

    }
    else {
        filters[1] = new nlobjSearchFilter('custrecord_ilo_approval_rece_cb', null, 'is', 'T')
    }


    var search = nlapiCreateSearch('customrecord_ilo_approval_process', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    var lastNumber = 0;
    if (returnSearchResults != null && returnSearchResults.length > 0) {
        expired = returnSearchResults[returnSearchResults.length - 1].getValue('custrecord_ilo_expired')
        if (type == 'tolerance') {
            lastNumber = returnSearchResults[returnSearchResults.length - 1].getValue('custrecord_ilo_tolerance_nu')
        }
        else {
            lastNumber = returnSearchResults[returnSearchResults.length - 1].getValue('custrecord_ilo_approval_rece_nu')
        }

    }
    return parseInt(lastNumber);

}

function setResDate(type, logId, approved) {
    if (type == 'tolerance') {
        nlapiSubmitField('customrecord_ilo_approval_process', logId, 'custrecord_ilo_tolerance_res_date', nlapiDateToString(new Date()))
    }
    else {
        nlapiSubmitField('customrecord_ilo_approval_process', logId, 'custrecord_ilo_approval_rece_res_date', nlapiDateToString(new Date()))
    }
    nlapiSubmitField('customrecord_ilo_approval_process', logId, 'custrecord_ilo_approved', approved)
}

//*************************************************************************//
//*************************************************************************//

// WORKFLOW ACTION
function send_approve() {
    var context = nlapiGetContext();
    var company = context.company;
    company = company.replace('_', '-');
    //var SuiteletURL = 'https://' + company +'.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1576&deploy=1&compid=4678143_SB2&h=d50aaf2cfeba9d568d5f'
    var SuiteletURL = nlapiResolveURL('SUITELET', 'customscriptilo_wf_approve_po_su', 'customdeploy_ilo_wf_approve_po_su', true);   
    nlapiLogExecution('DEBUG', 'Start send_approve');
    try {
        var fromId = nlapiGetFieldValue('custbody_il_bill_creator');   
        var internalid = nlapiGetRecordId();
        var type = nlapiGetRecordType();
        var approvedurl = SuiteletURL + '&internalid=' + internalid + '&type=' + type + '&update=approved' + '&em=' + fromId;
        var rejecturl = SuiteletURL + '&internalid=' + internalid + '&type=' + type + '&update=rejected' + '&em=' + fromId;
        nlapiLogExecution('DEBUG', 'type: ' + type, 'internalid: ' + internalid);
        var tolerance_approver_wf = context.getSetting('SCRIPT', 'custscript_tolerance_approver_wf');
        nlapiLogExecution('DEBUG', 'tolerance_approver_wf', tolerance_approver_wf);
        if (tolerance_approver_wf == 'T') {
            var recDate = createIloLog('tolerance', internalid);
            var logId = recDate[0];
            var newNumber = recDate[1];
            approvedurl += '&tolerance=tolerance' + '&logId=' + logId + '&newNumber=' + newNumber;
            rejecturl += '&tolerance=tolerance' + '&logId=' + logId + '&newNumber=' + newNumber;
            var subsidiary =nlapiGetFieldValue('subsidiary');      
            var tolerance_approver = getToleranceApprover(subsidiary)//nlapiGetFieldValue('custbody_nc_pba_tolerance_approver');      
            if (!isNullOrEmpty(tolerance_approver)) {
                var email = tolerance_approver
                var emailMerger = nlapiCreateEmailMerger('5');
            }
        }
        else { // recever
            var recDate = createIloLog('approval', internalid);
            var logId = recDate[0];
            var newNumber = recDate[1];
            approvedurl += '&logId=' + logId + '&newNumber=' + newNumber;
            rejecturl += '&logId=' + logId + '&newNumber=' + newNumber;
            var reciever = nlapiGetFieldValue('custbody_bill_po_reciever');
            if (!isNullOrEmpty(reciever)) {
                var email = reciever
                if (type == 'vendorbill') {
                    var emailMerger = nlapiCreateEmailMerger('4');
                }
                else if (type == 'vendorcredit') {
                    var emailMerger = nlapiCreateEmailMerger('40');
                }
            }
        }

        try {
            emailMerger.setTransaction(internalid);
            var mergeResult = emailMerger.merge();
            var msg = mergeResult.getBody();            
            msg = msg.replace('approvedurl', approvedurl);
            msg = msg.replace('rejecturl', rejecturl);
            var sbj = mergeResult.getSubject();
            var attachRec = new Object();
            attachRec['transaction'] = internalid;

            var AttachmentreturnResults = getInvoiceAttachments(internalid);
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
function createIloLog(type, tranid) {

    try {
        var rec = nlapiCreateRecord('customrecord_ilo_approval_process');
        rec.setFieldValue('custrecord_ilo_approval_transaction', tranid);
        var newNumber = getLastLogNumber(type, tranid)
        if (type == 'tolerance') {
            rec.setFieldValue('custrecord_ilo_tolerance_cb', 'T');
            rec.setFieldValue('custrecord_ilo_tolerance_nu', newNumber);

        }
        else {
            rec.setFieldValue('custrecord_ilo_approval_rece_cb', 'T');
            rec.setFieldValue('custrecord_ilo_approval_rece_nu', newNumber);
        }

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
function getLastLogNumber(type, tranid) {



    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_ilo_approval_rece_nu');
    columns[1] = new nlobjSearchColumn('custrecord_ilo_tolerance_nu');
    columns[2] = new nlobjSearchColumn('internalid').setSort(false);

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ilo_approval_transaction', null, 'is', tranid)
    if (type == 'tolerance') {
        filters[1] = new nlobjSearchFilter('custrecord_ilo_tolerance_cb', null, 'is', 'T')

    }
    else {
        filters[1] = new nlobjSearchFilter('custrecord_ilo_approval_rece_cb', null, 'is', 'T')
    }


    var search = nlapiCreateSearch('customrecord_ilo_approval_process', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    var lastNumber = 0;
    if (returnSearchResults != null && returnSearchResults.length > 0) {

        if (type == 'tolerance') {
            lastNumber = returnSearchResults[returnSearchResults.length - 1].getValue('custrecord_ilo_tolerance_nu')
        }
        else {
            lastNumber = returnSearchResults[returnSearchResults.length - 1].getValue('custrecord_ilo_approval_rece_nu')
        }

    }
    return parseInt(lastNumber) + 1;

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
function getToleranceApprover(subsidiary) {
    var tolerance_approver = '';
    if (!isNullOrEmpty(subsidiary)) {
         tolerance_approver= nlapiLookupField('subsidiary', subsidiary, 'custrecord_nc_vbtol_tolerance_approver')  
    }
    return tolerance_approver
}
