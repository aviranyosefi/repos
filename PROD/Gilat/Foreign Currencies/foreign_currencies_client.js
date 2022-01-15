
function sort() {
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_foreign_currencies_suitlet', 'customdeployforeign_currencies_suitlet_d', false);
    createdPdfUrl += '&Recid=' + nlapiGetRecordId();   
    window.open(createdPdfUrl);
}
function storno() {
    if (confirm("האם אתה בטוח ?")) {
        var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_foreign_currencies_suitlet', 'customdeployforeign_currencies_suitlet_d', false);
        createdPdfUrl += '&Recid=' + nlapiGetRecordId();
        createdPdfUrl += '&typefun=storno';
        window.open(createdPdfUrl);
    }
    else { return false}
}

function cencel() {
    window.close();
}

function save() {
    debugger;
    var customer = nlapiGetFieldValue('custpage_customer');
    var currency = nlapiGetFieldValue('custpage_currency');

    if (isNullOrEmpty(customer) && isNullOrEmpty(currency)) {
        alert('Please enter values ​​for one from the fields')
        return false
    }
   
    
    if (!isNullOrEmpty(customer) && isNullOrEmpty(currency)) {
        if (subsidiaryValidation(customer)) {
            var recID = nlapiGetFieldValue('custpage_recid');
            var payment_currency = nlapiLookupField('customerpayment', recID, 'currency');
            var payment_currency_text = nlapiLookupField('customerpayment', recID, 'currency', true);
            return currencyValidation(payment_currency, payment_currency_text, customer);
        }
        else { return false;}

        return true;

    }
    else if (isNullOrEmpty(customer) && !isNullOrEmpty(currency)) {
        var currencyText = nlapiGetFieldText('custpage_currency');
        var entity = nlapiGetFieldValue('custpage_entity');
        return currencyValidation(currency, currencyText, entity );
    }
    else {
        var res1 = subsidiaryValidation(customer);    
        var currencyText = nlapiGetFieldText('custpage_currency');
        var res2 = currencyValidation(currency, currencyText , customer);
        if (!res1 || !res2) { return false }

        return true;
    }


    return true;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}


function subsidiaryValidation(customer) {
    var subsidiary = nlapiGetFieldValue('custpage_subsidiary');  
    var custSubsidiary = nlapiLookupField('customer', customer, 'subsidiary');
    if (subsidiary != custSubsidiary) {
        var subsidiary = nlapiLookupField('subsidiary', subsidiary, 'name');
        subsidiary = subsidiary.split(':')[subsidiary.split(':').length-1]
        var custSubsidiary = nlapiLookupField('subsidiary', custSubsidiary, 'name');
        custSubsidiary = custSubsidiary.split(':')[custSubsidiary.split(':').length -1]
        var msg = 'ללקוח זה הוגדרה חברת ' + custSubsidiary + ' ולא חברת ' + subsidiary + ' אשר בה התבצע התשלום ולכן לא ניתן להמשיך בתהליך. יש לבצע תהליך ידני באמצעות בנק ';
        msg += 'intercompany';
        var engmsg = '\n\nThis customer has defined subsidiary ' + custSubsidiary + 'and not ' + subsidiary + ' where the payment is, therefore you cannot proceed this process. Please do it manually using an intercompany bank.'
        alert(msg + engmsg);
        nlapiSetFieldValue('custpage_customer', '');
        return false;
    }

    return true;

}

function currencyValidation(currency, currencyText , entity) {
    if (!customer_currency(currency , entity)) {
        //var currencyText = nlapiGetFieldText('custpage_currency');
        var msg = 'ללקוח זה לא מוגדר מטבע ' + currencyText + ',' + '  נא הוסף/פי את המטבע בדף הלקוח ולאחר מכן בצע/י את התהליך שוב. ';    
        var engmsg = '\n\nThis customer does not have a ' + currencyText+ ' currency set, please add the currency on the customer page and then repeat the process again.';
        alert(msg + engmsg);
        nlapiSetFieldValue('custpage_currency', '');
        nlapiSetFieldValue('custpage_customer', '');
        return false;
    }
    return true
}

function customer_currency(currency , entity) {
    
    var rec = nlapiLoadRecord('customer', entity);
    var count = rec.getLineItemCount('currency');
    if (count > 0) {
        for (var i = 1; i <= count; i++) {
            var currency_id = rec.getLineItemValue('currency', 'currency', i)
            if (currency == currency_id) { return true}        
        }
    }
    return false;
}