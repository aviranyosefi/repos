
function suiteletEmail(reciever,user, update, type, internalid) {
    nlapiLogExecution('DEBUG', 'update', update);
    debugger;
    var rec = nlapiLoadRecord(type, internalid);
    var tranid = rec.getFieldValue('tranid') //nlapiLookupField(type, internalid, 'tranid');
    var date = rec.getFieldValue('trandate')//nlapiLookupField(type, internalid, 'trandate');
    var VendorNmae = nlapiLookupField(type, internalid, 'entity', true);
    var Amount = rec.getFieldValue('usertotal')// nlapiLookupField(type, internalid, 'total');
    var Currency =  nlapiLookupField(type, internalid, 'currency', true);
    var QuotationCurrency = rec.getFieldValue('custbody_nc_qrt_quotation_currency')// nlapiLookupField(type, internalid, 'custbody_nc_qrt_quotation_currency', true);


    var altname = nlapiLookupField('employee', user, 'altname');
    var typeString = getType(type);
    var sbj = typeString + ' #' + tranid + ' has been ' + update;
    var html = '';
    html += '<span>Dear ' + altname + ',</span><br/><br/>';
    html += '<span>' + sbj + '</span><br/><br/>';
    html += '<span> Date: ' + date + '</span><br/><br/>';
    html += '<span>Vendor Name: ' + VendorNmae + '</span><br/><br/>';
    html += '<span>Amount:' + Amount + '</span><br/><br/>';
    html += '<span>Currency:' + Currency + '</span><br/><br/>';
    html += '<span>Quotation Currency:' + QuotationCurrency + '</span><br/><br/>';
    html += '<span><a href="' + getUrl(type, internalid) + '" rel="link"> View Record  </a></span><br/><br/><br/>';

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

