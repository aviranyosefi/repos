
function populate_pymt_inv_ue_as(type) {

    try {

        var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
        var paymentMethod = rec.getFieldValue('paymentmethod')
        var lineCount = rec.getLineItemCount('apply');
        var invRec = rec.getLineItemValue('apply', 'internalid', 1);
        var invDocName = rec.getLineItemValue('apply', 'refnum', 1);
        var invExRate = parseFloat(rec.getFieldValue('exchangerate'))

        var doctype = (nlapiGetRecordType() == 'customerpayment') ? 'invoice' : 'creditmemo';
        var doclinkstype = (nlapiGetRecordType() == 'customerpayment') ? 'links' : 'apply';
        var doclinksid = (doclinkstype == 'apply') ? 'doc' : 'id';
        var doclinkstranid = (doclinkstype == 'apply') ? 'refnum' : 'tranid';
        var doclinkstrandate = (doclinkstype == 'apply') ? 'applydate' : 'trandate';
        nlapiLogExecution('debug', 'doctype:' + doctype, 'invRec:' + invRec + 'doclinksid:' + doclinksid)
        var rec_inv = nlapiLoadRecord(doctype, invRec);
        nlapiLogExecution('debug', 'doclinkstype:' + doclinkstype, '')

        
        var invLineCount = rec_inv.getLineItemCount(doclinkstype);

        nlapiLogExecution('debug', 'invLineCount:' + invLineCount, '')

        var payments = [];
        for (var i = 1; i <= invLineCount; i++) {
            nlapiLogExecution('debug', 'inside:' + i, i + ' ' + doclinksid + ' ' + invExRate + ' c:' + rec_inv.getLineItemValue(doclinkstype, doclinkstranid, i))
            if (rec_inv.getLineItemValue(doclinkstype, doclinkstranid, i) == null)
                continue;

            if (rec_inv.getLineItemValue(doclinkstype, 'type', i) != 'Currency Revaluation') {
                if (doctype == 'creditmemo')            
                    invExRate = 1;
               // var totPayment = rec_inv.getLineItemValue(doclinkstype, 'total', i) / invExRate;   
                
                var totPayment = parseFloat(nlapiLookupField('customerpayment', rec_inv.getLineItemValue(doclinkstype, 'id', i), 'fxamount'))
                console.log(doclinksid)
                console.log(totPayment)
                nlapiLogExecution('debug', 'totPayment:' + totPayment, i)
                var paymentdatefield = 'trandate';
                if (getPymtMethod(nlapiLookupField(nlapiGetRecordType(), rec_inv.getLineItemValue(doclinkstype, doclinksid, i), 'paymentmethod')) == 'Check') {
                    payments.push({
                        pymtID: rec_inv.getLineItemValue(doclinkstype, doclinksid, i),
                        pymtDate: nlapiLookupField(nlapiGetRecordType(), rec_inv.getLineItemValue(doclinkstype, doclinksid, i), 'custbody_ilo_cust_check_date'),
                        pymtRef: rec_inv.getLineItemValue(doclinkstype, doclinkstranid, i),
                        pymtAmt: totPayment.toFixed(2),
                        pymtMethod: getPymtMethod(nlapiLookupField(nlapiGetRecordType(), rec_inv.getLineItemValue(doclinkstype, doclinksid, i), 'paymentmethod')),
                        pymtDoc: invDocName,
                        pymtStatus: '',//rec_inv.getLineItemValue(doclinkstype, 'status', i),
                        pymtCurrency: getCurrencySymbol(nlapiLookupField(nlapiGetRecordType(), rec_inv.getLineItemValue(doclinkstype, doclinksid, i), 'currency'))
                    });
                }
                else {
                    payments.push({
                        pymtID: rec_inv.getLineItemValue(doclinkstype, doclinksid, i),
                        pymtDate: rec_inv.getLineItemValue(doclinkstype, doclinkstrandate, i),
                        pymtRef: rec_inv.getLineItemValue(doclinkstype, doclinkstranid, i),
                        pymtAmt: totPayment.toFixed(2),
                        pymtMethod: getPymtMethod(nlapiLookupField(nlapiGetRecordType(), rec_inv.getLineItemValue(doclinkstype, doclinksid, i), 'paymentmethod')),
                        pymtDoc: invDocName,
                        pymtStatus: '',//rec_inv.getLineItemValue(doclinkstype, 'status', i),
                        pymtCurrency: getCurrencySymbol(nlapiLookupField(nlapiGetRecordType(), rec_inv.getLineItemValue(doclinkstype, doclinksid, i), 'currency'))




                    });
                }
            }
            nlapiLogExecution('debug', 'check payments', JSON.stringify(payments, null, 2))
        }

        nlapiLogExecution('debug', 'payments:' + payments.length, '')

console.log(payments)

    }
    catch (err) {

        nlapiLogExecution('error', 'err', err);
        console.log(err)
        return true;
    }


    if (payments != []) {

        var comma = '_';

        var strHeb = '';
        var strEng = '';
        var totalamount = 0;
        var currency = '';
        for (var i = 0; i < payments.length ; i++) {
        	nlapiLogExecution('debug', 'payments[i].pymtAmt', JSON.stringify(payments[i].pymtAmt) + '---' +JSON.stringify(payments[i].pymtRef))
           // var total = (Math.round(parseFloat(payments[i].pymtAmt)/10)*10).toFixed(2);
        	console.log(JSON.stringify(payments[i].pymtAmt))
        	var total = Math.round(parseFloat(payments[i].pymtAmt)).toFixed(2);
        	nlapiLogExecution('debug', 'total', JSON.stringify(total))
            currency = payments[i].pymtCurrency;
            strHeb += '`' + payments[i].pymtCurrency + total + comma + payments[i].pymtDoc + comma + payments[i].pymtRef + comma + payments[i].pymtMethod + comma + payments[i].pymtDate + '`;';
            strEng += '`' + payments[i].pymtDate + comma + payments[i].pymtMethod + comma + payments[i].pymtRef + comma + payments[i].pymtDoc + comma + payments[i].pymtCurrency + total + '`;';
            totalamount = parseFloat(totalamount) + parseFloat(total);
        }
        totalamount = totalamount.toFixed(2);
        var totalLineHeb = '`' + currency + totalamount + comma + 'сд"л щемн' + comma + '-' + comma + '-' + comma + '-' + '`;';
        var totalLineEng = '`' + '-' + comma + '-' + comma + '-' + comma + 'Total Paid' + comma + currency + totalamount + '`;';

        
        console.log(totalLineEng)
//        var fields = new Array();
//        var values = new Array();
//        fields[0] = 'custbody_kab_pymts_eng';
//        values[0] = strEng + totalLineEng;
//        fields[1] = 'custbody_kab_pymts_heb';
//        values[1] = strHeb + totalLineHeb;

        //update and submit invoice
        //var updatefields = nlapiSubmitField(doctype, invRec, fields, values);



    }// if payments != []
}

populate_pymt_inv_ue_as()


function getPymtMethod(pymtMethod_id) {

    var pymtName = '';
    var allMethods = allPaymentMethods();
    for (var i = 0; i < allMethods.length; i++) {

        if (pymtMethod_id == allMethods[i].internalid) {
            pymtName = allMethods[i].name

        }
    }

    return pymtName;
}

function getCurrencySymbol(currency_id) {

    var currencyName = '';
    var allCurrencies = getAllCurrencies();
    for (var i = 0; i < allCurrencies.length; i++) {

        if (currency_id == allCurrencies[i].internalid) {
            currencyName = allCurrencies[i].name
        }
    }
    if (currencyName == 'USD') {
        currencyName = '$'
    }
    if (currencyName == 'EUR') {
        currencyName = 'А'
    }
    if (currencyName == 'GBP') {
        currencyName = '£'
    }
    if (currencyName == 'CAD') {
        currencyName = 'CAD '
    }
    if (currencyName == 'CHF') {
        currencyName = 'CHF '
    }
    if (currencyName == 'ILS') {
        currencyName = '§'
    }

    return currencyName;
}




function allPaymentMethods() {

    var sysExRates = [];
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name', null, null);
    columns[1] = new nlobjSearchColumn('internalid', null, null);
    var search = nlapiSearchRecord('paymentmethod', null, null, columns);
    for (var i = 0; i < search.length; i++) {
        sysExRates.push({
            name: search[i].getValue(columns[0]),
            internalid: search[i].getValue(columns[1]),

        });
    }
    return sysExRates;
}

function getAllCurrencies() {

    var sysExRates = [];
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('symbol', null, null);
    columns[1] = new nlobjSearchColumn('internalid', null, null);
    var search = nlapiSearchRecord('currency', null, null, columns);
    for (var i = 0; i < search.length; i++) {
        sysExRates.push({
            name: search[i].getValue(columns[0]),
            internalid: search[i].getValue(columns[1]),

        });
    }
    return sysExRates;
}


function getOtherPayments(sf_ref) {

    var sysExRates = [];
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custbody_sf_ref', null, 'is', sf_ref)
    filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T')
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name', null, null);
    columns[1] = new nlobjSearchColumn('internalid', null, null);
    columns[2] = new nlobjSearchColumn('trandate', null, null);
    columns[3] = new nlobjSearchColumn('paymentmethod', null, null);
    columns[4] = new nlobjSearchColumn('currency', null, null);
    columns[5] = new nlobjSearchColumn('total', null, null);
    var search = nlapiSearchRecord(nlapiGetRecordType(), null, filters, columns);
    for (var i = 0; i < search.length; i++) {
        sysExRates.push({
            internalid: search[i].getValue('internalid'),
            trandate: search[i].getValue('trandate'),
            paymentMethod: getPymtMethod(search[i].getValue('paymentmethod')),
            currency: getCurrencySymbol(search[i].getValue('currency')),
            totalPymt: search[i].getValue('total'),

        });
    }
    return sysExRates;
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}