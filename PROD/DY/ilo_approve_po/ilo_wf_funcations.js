
function suiteletEmail(reciever,user, update, type, internalid) {
    nlapiLogExecution('DEBUG', 'update', update);
    debugger;
    var rec = nlapiLoadRecord(type, internalid);
    var tranid = rec.getFieldValue('tranid') //nlapiLookupField(type, internalid, 'tranid');
    var date = rec.getFieldValue('trandate')//nlapiLookupField(type, internalid, 'trandate');
    var VendorNmae = nlapiLookupField(type, internalid, 'entity', true);
    var Amount = rec.getFieldValue('usertotal')// nlapiLookupField(type, internalid, 'total');
    var Currency = nlapiLookupField(type, internalid, 'currency', true);
    var subsidiary = rec.getFieldValue('subsidiary')
    var subRec = nlapiLoadRecord('subsidiary', subsidiary);
    var ccEMAIL = subRec.getFieldValue('custrecord_bookkeeping_email')

    if (update == 'rejected') {
        var Notes = rec.getFieldValue('custbody_rejected_reason')
    }
    else {
        var Notes = rec.getFieldValue('custbody_approval_notes')
    }
    if (isNullOrEmpty(Notes)) { Notes = '';}
    var altname = nlapiLookupField('employee', reciever, 'altname');
    var typeString = getType(type);
    var sbj = typeString + ' #' + tranid + ' has been ' + update;
    var html = '';
    html += '<span>Dear ' + altname + ',</span><br/><br/>';
    html += '<span>' + sbj + '</span><br/><br/>';
    html += '<span> Date: ' + date + '</span><br/><br/>';
    html += '<span>Vendor Name: ' + VendorNmae + '</span><br/><br/>';
    html += '<span>Amount: ' + Amount + '</span><br/><br/>';
    html += '<span>Currency: ' + Currency + '</span><br/><br/>';
    html += '<span>Notes: ' + Notes + '</span><br/><br/>';
    html += '<span><a href="' + getUrl(type, internalid) + '" rel="link"> View Record  </a></span><br/><br/><br/>';

    //var toSend = [];
    //toSend[0] = user;
    //toSend[1] = reciever;
    var attachRec = new Object();
    attachRec['transaction'] = internalid;
    try { nlapiSendEmail(reciever, reciever, sbj, html, ccEMAIL, null, attachRec, null, false); }
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
    return res;

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

