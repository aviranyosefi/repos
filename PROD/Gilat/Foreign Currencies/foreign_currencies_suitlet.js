var record;
var tranid;
var recId;
function foreignCurrency(request, response) {

    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'stage first', 'stage first');

        recId = request.getParameter('Recid');
        var typefun = request.getParameter('typefun');
        var form = nlapiCreateForm('');
     
        record = nlapiLoadRecord('customerpayment', recId);
        if (typefun == 'storno') {
            Unapply(recId); 
            record = nlapiLoadRecord('customerpayment', recId);
            tranid = record.getFieldValue('tranid')
            var refundId = refund_Generate('storno', null, record, recId);
            if (refundId != -1) {
                nlapiSubmitField('customerpayment', recId, 'custbody_scenario_type', '1');
                nlapiSubmitField('customerpayment', recId, 'custbody_gilat_payment_storno', 'T');
                var refundTranid = nlapiLookupField('customerrefund', refundId, 'transactionnumber')
                var baseURL = getUrl('custrfnd'); 
                var link = form.addField('custpage_refund', "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                link.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + refundId + '><b>' + refundTranid + '</b></a>'); 
                apply(refundId, recId);                   
            }
        }
        else {
            form.addSubmitButton('Continue');
            form.addButton('custpage_cencel', 'Cencel', 'cencel();');
            form.setScript('customscript_foreign_currencies_client');

            var customer = form.addField('custpage_customer', 'select', 'CUSTOMER', 'CUSTOMER', null);
            //customer.setMandatory(true);
            var currency = form.addField('custpage_currency', 'select', 'CURRENCY', 'CURRENCY', null).setLayoutType('outsidebelow', 'startcol');
            //currency.setMandatory(true);
           

            var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, null);
            checkStage.setDefaultValue('stagetwo');
            checkStage.setDisplayType('hidden');

            var id = form.addField('custpage_recid', 'text', 'check', null, null);
            id.setDefaultValue(recId);
            id.setDisplayType('hidden');

            var subsidiary = record.getFieldValue('subsidiary');
            var subsidiaryField = form.addField('custpage_subsidiary', 'text', 'check', null, null);
            subsidiaryField.setDefaultValue(subsidiary);
            subsidiaryField.setDisplayType('hidden');

            var entity = record.getFieldValue('customer');
            var entityField = form.addField('custpage_entity', 'text', 'check', null, null);
            entityField.setDefaultValue(entity);
            entityField.setDisplayType('hidden');
          
        }
      
        response.writePage(form);
    }
    else if (request.getParameter('custpage_ilo_check_stage') == 'stagetwo') { 
        nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');

        var formTitle = 'Transaction List';
        var SecondForm = nlapiCreateForm(formTitle);

        recId = request.getParameter('custpage_recid');
       
        var customer = request.getParameter('custpage_customer');
        var currency = request.getParameter('custpage_currency');

        Unapply(recId); 
        record = nlapiLoadRecord('customerpayment', recId);
        tranid = record.getFieldValue('tranid')
       
        if (!isNullOrEmpty(customer) && isNullOrEmpty(currency)) { // only customer populated
            nlapiLogExecution('DEBUG', 'only customer populated', 'only customer populated');
            var refundId = refund_Generate('sort', 'customer', record, recId);
            if (refundId != -1) {
                nlapiSubmitField('customerpayment', recId, 'custbody_scenario_type', '3');
                var refundTranid = nlapiLookupField('customerrefund', refundId, 'transactionnumber')
                var baseURL = getUrl('custrfnd')
                var linkprintChoiceForm = SecondForm.addField('custpage_je', "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                linkprintChoiceForm.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + refundId + '><b>' + refundTranid + '</b></a>'); //url of pdf from filecabinet
                apply(refundId, recId ); 
            }
            record = nlapiLoadRecord('customerpayment', recId);
            var paymentId = payment_Generate(recId, customer, record, '3', null, refundId);
            if (paymentId != -1) {
                var paymenttranid = nlapiLookupField('customerpayment', paymentId, 'tranid')
                var baseURL = getUrl('custpymt')
                var paymentField = SecondForm.addField('custpage_payment', "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                paymentField.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + paymentId + '><b>' + paymenttranid + '</b></a>'); //url of pdf from filecabinet

            }
        }
        else if (isNullOrEmpty(customer) && !isNullOrEmpty(currency)) { // only currency populated
            var refundId = refund_Generate('sort', 'currency', record, recId);
            if (refundId != -1) {
                nlapiSubmitField('customerpayment', recId, 'custbody_scenario_type', '2');
                var refundTranid = nlapiLookupField('customerrefund', refundId, 'transactionnumber')
                var baseURL = getUrl('custrfnd')
                var linkprintChoiceForm = SecondForm.addField('custpage_je', "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                linkprintChoiceForm.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + refundId + '><b>' + refundTranid + '</b></a>'); //url of pdf from filecabinet
                apply(refundId, recId); 
            }
            record = nlapiLoadRecord('customerpayment', recId);
            var paymentId = payment_Generate(recId, null, record, '2', currency, refundId);
            if (paymentId != -1) {
                var paymenttranid = nlapiLookupField('customerpayment', paymentId, 'tranid')
                var baseURL = getUrl('custpymt')
                var paymentField = SecondForm.addField('custpage_payment', "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                paymentField.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + paymentId + '><b>' + paymenttranid + '</b></a>'); //url of pdf from filecabinet

            }
        }
        else {
            var refundId = refund_Generate('sort', 'customer', record, recId);
            if (refundId != -1) {
                nlapiSubmitField('customerpayment', recId, 'custbody_scenario_type', '2');              
                var refundTranid = nlapiLookupField('customerrefund', refundId, 'transactionnumber')
                var baseURL = getUrl('custrfnd')
                var linkprintChoiceForm = SecondForm.addField('custpage_je', "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                linkprintChoiceForm.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + refundId + '><b>' + refundTranid + '</b></a>'); //url of pdf from filecabinet
                apply(refundId, recId);
            }
            record = nlapiLoadRecord('customerpayment', recId);
            var paymentId = payment_Generate(recId, customer, record, '3', null, refundId);
            if (paymentId != -1) {
                var paymenttranid = nlapiLookupField('customerpayment', paymentId, 'tranid')
                var baseURL = getUrl('custpymt')
                var paymentField = SecondForm.addField('custpage_payment', "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                paymentField.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + paymentId + '><b>' + paymenttranid + '</b></a>'); //url of pdf from filecabinet
                record = nlapiLoadRecord('customerpayment', paymentId);
            }
            recId = paymentId;
            var refundId = refund_Generate('sort', 'currency', record, recId);
            if (refundId != -1) {
                nlapiSubmitField('customerpayment', recId, 'custbody_scenario_type', '2');
                var refundTranid = nlapiLookupField('customerrefund', refundId, 'transactionnumber')
                var baseURL = getUrl('custrfnd')
                var linkprintChoiceForm = SecondForm.addField('custpage_je1', "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                linkprintChoiceForm.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + refundId + '><b>' + refundTranid + '</b></a>'); //url of pdf from filecabinet
                apply(refundId, recId);
            }
            record = nlapiLoadRecord('customerpayment', recId);
            var paymentId = payment_Generate(recId, null, record, '2', currency, refundId);
            if (paymentId != -1) {
                var paymenttranid = nlapiLookupField('customerpayment', paymentId, 'tranid')
                var baseURL = getUrl('custpymt')
                var paymentField = SecondForm.addField('custpage_payment1', "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                paymentField.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + paymentId + '><b>' + paymenttranid + '</b></a>'); //url of pdf from filecabinet

            } 
        }
                
        response.writePage(SecondForm);

    }

} // services_update_screen function - end

//functions

function refund_Generate(type, typefield, paymentRec, recId) {

    try {

  
        //var rec = nlapiCreateRecord('customerrefund', { recordmode: 'dynamic' });
        var rec = nlapiCreateRecord('customerrefund', { recordmode: 'dynamic' });
        //var rec = nlapiCreateRecord('customerrefund');
        //Header Fields 
        rec.setFieldValue('customer', paymentRec.getFieldValue('customer'));
        rec.setFieldValue('subsidiary', paymentRec.getFieldValue('subsidiary'));
        rec.setFieldValue('currency', paymentRec.getFieldValue('currency'));
        rec.setFieldValue('exchangerate', paymentRec.getFieldValue('exchangerate'));
        rec.setFieldValue('trandate', paymentRec.getFieldValue('trandate'));
        var paymentmethod = paymentRec.getFieldValue('paymentmethod');
        if (isNullOrEmpty(paymentmethod)){ paymentmethod = '1' };
        rec.setFieldValue('paymentmethod', paymentmethod);
        var account = paymentRec.getFieldValue('account');
        if (isNullOrEmpty(account)) {
            account = nlapiLookupField('customerpayment', recId, 'account')
        }           
        rec.setFieldValue('account', account );
     
     
        rec.setFieldValue('custbody_original_payment', recId); 
        rec.setFieldValue('custbody_unknown_customer_trans', recId); // STORNO AND CUSTOMER 

        if (typefield == 'currency') {
            rec.setFieldValue('custbody_original_payment', recId);
            rec.setFieldValue('custbody_unknown_customer_trans', recId); // STORNO AND CUSTOMER 
            rec.setFieldValue('memo', 'This transaction is part of the different currency in invoice process for Payment ”& #payment ' + tranid);
            rec.setFieldValue('custbody_scenario_type', '2');//Different currency
            rec.setFieldValue('account', getAccount(paymentRec.getFieldValue('subsidiary')));
        }
        else if (typefield == 'customer') {
            rec.setFieldValue('custbody_original_payment', recId);
            rec.setFieldValue('custbody_unknown_customer_trans', recId); // STORNO AND CUSTOMER 
            rec.setFieldValue('memo', 'Customer sorting process of payment number #payment ' + tranid);
            rec.setFieldValue('custbody_scenario_type', '3'); // Different customer
            rec.setFieldValue('account', getAccount(paymentRec.getFieldValue('subsidiary')));

        }
        else {
            rec.setFieldValue('custbody_original_payment', recId);
            rec.setFieldValue('custbody_unknown_customer_trans', recId); // STORNO AND CUSTOMER 
            rec.setFieldValue('memo', 'Storno of payment number #payment ' + tranid);
            rec.setFieldValue('custbody_scenario_type', '1');
            
        } //storno

        var lineCount = rec.getLineItemCount('apply');
        nlapiLogExecution('DEBUG', 'lines', lineCount);
        for (var i = 1; i <= lineCount; i++) {
            rec.selectLineItem('apply', i);
            var applyID = rec.getCurrentLineItemValue('apply', 'doc');           
            if (applyID == recId) {
                rec.setCurrentLineItemValue('apply', 'apply', 'T');          
                rec.commitLineItem('apply');
            }
        }
        //rec.setLineItemValue('apply', 'apply', 1, 'T')

        var id = nlapiSubmitRecord(rec);
        if (id != -1) {
            var rec = nlapiLoadRecord('customerrefund', id);
            rec.setFieldValue('exchangerate', paymentRec.getFieldValue('exchangerate'));
            rec.setLineItemValue('accountingbookdetail', 'exchangerate', 1, paymentRec.getLineItemValue('accountingbookdetail', 'exchangerate', 1))
            var id = nlapiSubmitRecord(rec);
        }
        nlapiLogExecution('debug', 'refound id', id);
        return id;
    } catch (e) {

        nlapiLogExecution('DEBUG', 'error refund_Generate ', e);
        return -1

    }
}

function payment_Generate(paymentId, customer, paymentRec, scenario_type, currency, refundId) {

    try {

        var rec = nlapiCopyRecord('customerpayment', paymentId, null);
        rec.setFieldValue('trandate', paymentRec.getFieldValue('trandate'));
        //Header Fields 
        if (!isNullOrEmpty(customer)) {
            rec.setFieldValue('customer', customer);
            rec.setFieldValue('memo', 'Customer sorting process of payment number ”& #payment ' + paymentRec.getFieldValue('tranid'));      
            rec.setFieldValue('custbody_customer_sorting_process', 'T');
            rec.setFieldValue('exchangerate', paymentRec.getFieldValue('exchangerate'));   
            rec.setFieldValue('currency', paymentRec.getFieldValue('currency'));   
        }
        else { // currency
            rec.setFieldValue('customer', paymentRec.getFieldValue('customer'));
            rec.setFieldValue('currency', currency);
            rec.setFieldValue('exchangerate', nlapiExchangeRate(currency, 'USD', paymentRec.getFieldValue('trandate')));          
           
            rec.setFieldValue('memo', 'this transaction is part of the different currency in invoice process for ”& #payment ' + paymentRec.getFieldValue('tranid'));

        }     
        rec.setFieldValue('custbody_unknown_customer_trans', refundId);
        rec.setFieldValue('custbody_original_payment', paymentId); 
        rec.setFieldValue('account', getAccount(paymentRec.getFieldValue('subsidiary')));
        var payment = paymentRec.getFieldValue('payment');
        if (payment == '0.00') { payment = 1; }
        rec.setFieldValue('payment', payment);
        
        
        var id = nlapiSubmitRecord(rec);
        if (id != -1 && !isNullOrEmpty(currency)) {
            var payRec = nlapiLoadRecord('customerpayment', id);
            var a = paymentRec.getFieldValue('exchangerate')
            var b = paymentRec.getLineItemValue('accountingbookdetail', 'exchangerate', 1);
            var c = nlapiExchangeRate(currency, 'USD', paymentRec.getFieldValue('trandate')) 
            var d = paymentRec.getFieldValue('payment');
            var e = payRec.getFieldValue('exchangerate');
            payRec.setFieldValue('trandate', paymentRec.getFieldValue('trandate'));
            nlapiLogExecution('debug', d, a +' :' +e);
            var calc = (d * a) / e;
            nlapiLogExecution('debug', 'calc', calc);
            payRec.setFieldValue('payment', calc.toFixed(2)); // TODO
            payRec.setLineItemValue('accountingbookdetail', 'exchangerate', 1, b / a * c)
            var id = nlapiSubmitRecord(payRec);
        }
        nlapiLogExecution('debug', 'payment id', id);
        return id;
    } catch (e) {

        nlapiLogExecution('DEBUG', 'error payment_Generate ', e);

    }
}

function getAccount(subsidiary) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_netting_bank_account');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_netting_subsidiary', null, 'is', subsidiary)



    var search = nlapiCreateSearch('customrecord_netting_mapping', filters, columns);
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = '';

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        results = returnSearchResults[0].getValue('custrecord_netting_bank_account');
    }

    return results;
}

function apply(refundId, recId) {
    try {
        //nlapiLogExecution('DEBUG', 'jeId', jeId);
       var  record = nlapiLoadRecord('customerpayment', recId);
        var Count = record.getLineItemCount('apply')
        //nlapiLogExecution('DEBUG', 'Count', Count);
        for (var j = 1; j <= Count; j++) {
            if (record.getLineItemValue('apply', 'internalid', j) == refundId) {
                //nlapiLogExecution('DEBUG', 'equal', jeId);
                record.setLineItemValue('apply', 'apply', j, 'T');
                nlapiSubmitRecord(record)
                return;
            }
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error apply', e);
    }
}

function Unapply(recId) {
    try {
        var record = nlapiLoadRecord('customerpayment', recId);
        var Count = record.getLineItemCount('apply')
        //nlapiLogExecution('DEBUG', 'Count', Count);
        for (var j = 1; j <= Count; j++) {
                record.setLineItemValue('apply', 'apply', j, 'F');                           
        }
        nlapiSubmitRecord(record);
        
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error Unapply', e);
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getAccountStorno(id) {

    var customerpaymentSearch = nlapiSearchRecord("customerpayment", null,
        [
            ["type", "anyof", "CustPymt"],
            "AND",
            ["internalid", "anyof", id]
        ],
        [
            new nlobjSearchColumn("accountmain")
        ]
    );

    return customerpaymentSearch[0].getValue('accountmain')
}

function getUrl(type) {
    var company = nlapiGetContext().company;
    company = company.replace('_', '-');
    var res = 'https://' + company + '.app.netsuite.com/app/accounting/transactions/' + type + '.nl?id=' ;
    return res;
}

function journal_Generate(type, typefield, paymentRec) {

    try {

        var rec = nlapiCreateRecord('journalentry');
        //Header Fields 
        rec.setFieldValue('subsidiary', paymentRec.getFieldValue('subsidiary'));
        rec.setFieldValue('currency', paymentRec.getFieldValue('currency'));
        rec.setFieldValue('exchangerate', paymentRec.getFieldValue('exchangerate'));
        rec.setFieldValue('trandate', paymentRec.getFieldValue('trandate'));
        rec.setFieldValue('custbody_original_payment', recId);
        rec.setFieldValue('custbody_unknown_customer_trans', recId);

        if (typefield == 'currency') { rec.setFieldValue('memo', 'This transaction is part of the different currency in invoice process for Payment ”& #payment ' + tranid); }
        else if (typefield == 'customer') { rec.setFieldValue('memo', 'Customer sorting process of payment number #payment ' + tranid); }
        else { rec.setFieldValue('memo', 'Storno of payment number #payment ' + tranid); }

        if (type == 'storno') {
            rec.setFieldValue('custbody_gilat_payment_storno', 'T');
        }
        else if (typefield == 'customer') { // sort        
            rec.setFieldValue('custbody_customer_sorting_process', 'T')
        }

        try {
            // lines Fields
            rec.selectNewLineItem('line');
            rec.setCurrentLineItemValue('line', 'account', paymentRec.getFieldValue('aracct'));
            rec.setCurrentLineItemValue('line', 'debit', paymentRec.getFieldValue('payment'))
            rec.setCurrentLineItemValue('line', 'entity', paymentRec.getFieldValue('customer'))
            rec.commitLineItem('line');
        } catch (err) {
            nlapiLogExecution('DEBUG', 'error journal_Generate -  first lines', err);
        }
        try {
            // second line
            if (type == 'storno') {
                rec.selectNewLineItem('line');
                rec.setCurrentLineItemValue('line', 'account', getAccountStorno(recId));
                rec.setCurrentLineItemValue('line', 'credit', paymentRec.getFieldValue('payment'))
                rec.setCurrentLineItemValue('line', 'entity', paymentRec.getFieldValue('customer'))
                rec.commitLineItem('line');
            }
            else {
                rec.selectNewLineItem('line');
                rec.setCurrentLineItemValue('line', 'account', getAccount(paymentRec.getFieldValue('subsidiary')));
                rec.setCurrentLineItemValue('line', 'credit', paymentRec.getFieldValue('payment'))
                rec.setCurrentLineItemValue('line', 'entity', paymentRec.getFieldValue('customer'))
                rec.commitLineItem('line');

            }
        } catch (err) {
            nlapiLogExecution('DEBUG', 'error journal_Generate -  second lines', err);
        }


        var id = nlapiSubmitRecord(rec);
        if (id != -1) {
            var jeRec = nlapiLoadRecord('journalentry', id);
            jeRec.setLineItemValue('accountingbookdetail', 'exchangerate', 1, paymentRec.getLineItemValue('accountingbookdetail', 'exchangerate', 1))
            var id = nlapiSubmitRecord(jeRec);
        }
        nlapiLogExecution('debug', 'je id', id);
        return id;
    } catch (e) {

        nlapiLogExecution('DEBUG', 'error journal_Generate ', e);

    }
}

function journal_Generate_second(currency, paymentRec) {

    try {

        var rec = nlapiCreateRecord('journalentry');
        //Header Fields 
        rec.setFieldValue('subsidiary', paymentRec.getFieldValue('subsidiary'));
        rec.setFieldValue('currency', currency);
        var exchangerate = nlapiExchangeRate(currency, 'USD', '15/7/2020') // TODO
        rec.setFieldValue('exchangerate', exchangerate);
        rec.setFieldValue('trandate', paymentRec.getFieldValue('trandate'));
        rec.setFieldValue('custbody_original_payment', recId);
        rec.setFieldValue('memo', 'This transaction is part of the different currency in invoice process for Payment #payment ' + tranid);


        try {
            // lines Fields
            rec.selectNewLineItem('line');
            rec.setCurrentLineItemValue('line', 'account', paymentRec.getFieldValue('aracct'));
            rec.setCurrentLineItemValue('line', 'credit', ((paymentRec.getFieldValue('payment') * paymentRec.getFieldValue('exchangerate')) / exchangerate).toFixed(2))
            rec.setCurrentLineItemValue('line', 'entity', paymentRec.getFieldValue('customer'))
            rec.commitLineItem('line');
            // second line
            rec.selectNewLineItem('line');
            rec.setCurrentLineItemValue('line', 'account', getAccount(paymentRec.getFieldValue('subsidiary')));
            rec.setCurrentLineItemValue('line', 'debit', ((paymentRec.getFieldValue('payment') * paymentRec.getFieldValue('exchangerate')) / exchangerate).toFixed(2))
            rec.setCurrentLineItemValue('line', 'entity', paymentRec.getFieldValue('customer'))
            rec.commitLineItem('line');
        } catch (err) {
            nlapiLogExecution('DEBUG', 'error journal_Generate - lines', err);

        }



        var id = nlapiSubmitRecord(rec);
        if (id != -1) {
            //nlapiLogExecution('debug', 'secondery', paymentRec.getLineItemValue('accountingbookdetail', 'exchangerate', 1));
            //nlapiLogExecution('debug', 'paymentRec.getFieldValue(exchangerate)', paymentRec.getFieldValue('exchangerate'));
            //nlapiLogExecution('debug', 'je exchangerate', exchangerate);
            var a = paymentRec.getFieldValue('exchangerate')
            var b = paymentRec.getLineItemValue('accountingbookdetail', 'exchangerate', 1);
            var c = exchangerate
            var jeRec = nlapiLoadRecord('journalentry', id);
            jeRec.setLineItemValue('accountingbookdetail', 'exchangerate', 1, b / a * c)
            var id = nlapiSubmitRecord(jeRec);
        }
        nlapiLogExecution('debug', 'je id', id);
        return id;
    } catch (e) {

        nlapiLogExecution('DEBUG', 'error journal_Generate_second ', e);

    }
}


