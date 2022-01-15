
function suiteletEmail(reciever,user, update, type, internalid) {
   // nlapiLogExecution('DEBUG', 'internalid: ' + internalid + ' ,record: ' + type, 'update type: ' + update + ' ,reciever: ' + reciever + ' user: ' + user);
    debugger;
    var rec = nlapiLoadRecord(type, internalid);
    var tranid = rec.getFieldValue('tranid') //nlapiLookupField(type, internalid, 'tranid');

    //nlapiLogExecution('DEBUG', 'tranid:', tranid)
    var date = rec.getFieldValue('trandate')//nlapiLookupField(type, internalid, 'trandate');
    //nlapiLogExecution('DEBUG', 'date:', date)
    var VendorNmae = rec.getFieldText('entity') //nlapiLookupField(type, internalid, 'entity', true);
    //nlapiLogExecution('DEBUG', 'VendorNmae:', VendorNmae)
    if (type == 'purchaseorder') { var field = 'total' }
    else {var field = 'usertotal'}
    var Amount = rec.getFieldValue(field)// nlapiLookupField(type, internalid, 'total');
    var Currency = rec.getFieldText('currency') //nlapiLookupField(type, internalid, 'currency', true);
       
    var entityid = nlapiLookupField('employee', user, 'entityid');
    var typeString = getType(type);
    var sbj = typeString + ' #' + tranid + ' has been ' + update;
    var html = '';
    html += '<span>Dear ' + entityid + ',</span><br/><br/>';
    html += '<span>' + sbj + '</span><br/><br/>';
    html += '<span> Date: ' + date + '</span><br/><br/>';
    html += '<span>Vendor Name: ' + VendorNmae + '</span><br/><br/>';
    html += '<span>Amount:' + formatNumber(Amount) + '</span><br/><br/>';
    html += '<span>Currency:' + Currency + '</span><br/><br/>';
    html += '<span><a href="' + getUrl(type, internalid) + '" rel="link"> View Record  </a></span><br/><br/><br/>';

    //var toSend = [];
    //toSend[0] = user;
    //toSend[1] = reciever;
    var attachRec = new Object();
    attachRec['transaction'] = internalid;
    try { nlapiSendEmail(reciever, user, sbj, html, null, null, attachRec, null, false); }
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
