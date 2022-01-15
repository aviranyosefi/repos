function suiteletEmail(reciever, user, update, type, internalid, rec) { 
    if (update == 'rejected') {
        template = 4
    }
    else { template = 5}
    var emailMerger = nlapiCreateEmailMerger(template);
    emailMerger.setTransaction(internalid);
    var mergeResult = emailMerger.merge();
    var sbj = mergeResult.getSubject();
    var msg = mergeResult.getBody();

    var attachRec = new Object();
    attachRec['transaction'] = internalid;
    try { 
        nlapiSendEmail(reciever, user, sbj, msg, null, null, attachRec, null, false);
    }
    catch (e) {
        nlapiLogExecution('DEBUG', 'error', e);
    }
}
function getUrl(type, internalid) {
    var company = nlapiGetContext().company;
    company = company.replace('_', '-');
    var res = 'https://' + company + '.app.netsuite.com/app/accounting/transactions/' + getTypeUrl(type) + '.nl?id=' + internalid;
    return res;
}
function formatNumber(num) {
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return num

}
function getType(type) {
    var res = '';
    if (type == 'vendorbill') {
        res = 'Vendor Bill'
    }
    else if (type == 'vendorcredit') {
        res = 'Vendor Credit';
    }
    else if (type == 'purchaseorder') {
        res = 'Purchase Order';
    }
    return res;

}
function getTypeUrl(type) {
    var res = '';
    if (type == 'vendorbill') {
        res = 'vendbill'
    }
    else if (type == 'vendorcredit') {
        res = 'vendcred';
    }
    else if (type == 'purchaseorder') {
        res = 'purchord';
    }
    return res;
}
function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function formatNumber(num) {
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return num

}
