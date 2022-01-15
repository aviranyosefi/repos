function getTaxCodes() {
    var taxcodes;
    var res = [];
    var cols = [new nlobjSearchColumn("internalid"),
                    new nlobjSearchColumn("itemid"),
                    new nlobjSearchColumn("description"),
    ];
    if (taxcodes == null) {
        taxcodes = nlapiSearchRecord("salestaxitem", null, null, cols);
    }
    for (var i = 0; i < taxcodes.length; i++) {
        res.push({
            taxCodeName: taxcodes[i].getValue('itemid'),
            taxCodeID: taxcodes[i].getValue('internalid'),
            taxDesc: taxcodes[i].getValue('description'),
        });
    }
    return res;
}

function dontupdateifnoavatax() {
    var dontupdate = true;
    var lineCount = nlapiGetLineItemCount('item');
    for (var i = lineCount; i >= 1; i--) {
        nlapiLogExecution('debug', 'line', i);
        var check = nlapiGetLineItemText('item', 'item', i);
        nlapiLogExecution('debug', 'type:', check);
        if (check.toLowerCase().indexOf('avatax') > 0 || check.toLowerCase().indexOf('israeli vat') >= 0) {
            dontupdate = false;
        }
    }
    return dontupdate;

}


function zuora_set_tax(type) {
    var context = nlapiGetContext();
    var tranid = nlapiGetFieldValue("tranid"); 
    var erase_tax_lines = nlapiGetFieldValue("custbody_erase_tax_lines");
    nlapiLogExecution('debug', 'zuora_set_tax', 'start:' + tranid + ' erase_tax_lines:' + erase_tax_lines);
    nlapiLogExecution('debug', 'zoura num:', nlapiGetFieldValue("custbodyzuorareferencenumber"));
    try {
        var ltd = (nlapiGetFieldValue('subsidiary') == 1);
        var inc = (nlapiGetFieldValue('subsidiary') == 2);

        if (isNullOrEmpty(nlapiGetFieldValue("custbodyzuorareferencenumber")) || dontupdateifnoavatax() || (ltd == 'F' && inc == 'F'))
            return true;
        var taxcodes = getTaxCodes();
        var avataxLines = []
        var otherLines = [];
        var lineCount = nlapiGetLineItemCount('item');
        nlapiLogExecution('debug', 'lineCount', lineCount);
        var tax_il_code = getNewTaxCode(taxcodes);
        var tax_il_code_patur = 47;
        var tax_fr = 7;
        var customer = nlapiLoadRecord('customer', nlapiGetFieldValue('entity'));
        var shipzip = nlapiGetFieldValue("shipzip");
        var zuoratax = nlapiGetFieldValue("custbodyzuorataxamount");
        var shiptoisrael = customer.getFieldValue("shipcountry") == "IL";
        var shiptoFrance = customer.getFieldValue("shipcountry") == "FR";
        var checkremove = false;

        for (var i = lineCount; i >= 1; i--) {
            var check = nlapiGetLineItemText('item', 'item', i);
            nlapiLogExecution('debug', tranid, 'line ' + i + ' type:' + check);
            if (check.toLowerCase().indexOf('avatax') < 0 && check.toLowerCase().indexOf('israeli vat') < 0) {
                nlapiLogExecution('debug', tranid, 'set line ' + i);
                if (ltd) {
                    if (shiptoisrael)
                        nlapiSetLineItemValue('item', 'taxcode', i, tax_il_code);
                    else if (shiptoFrance)
                        nlapiSetLineItemValue('item', 'taxcode', i, tax_fr);
                    else
                        nlapiSetLineItemValue('item', 'taxcode', i, tax_il_code_patur);

                }
                else { //inc
                    if (!isNullOrEmpty(shipzip) && !isNullOrEmpty(zuoratax) && zuoratax != 0) {
                        nlapiSetFieldValue('istaxable', 'T');
                        nlapiSetFieldValue('taxitem', '36');
                    }

                }
            } else {
                if (erase_tax_lines == 'T') {
                    nlapiLogExecution('debug', tranid, 'remove line ' + i + ' amount:' + nlapiGetLineItemValue('item', 'amount', i));
                    nlapiRemoveLineItem('item', i);
                    checkremove = true;
                }
            }
        }
        if (checkremove == false) {
            var params = new Array();
            params['custscript_invid'] = tranid;
            var status = nlapiScheduleScript('customscript_ilo_ss_close_payment', null, params);

        }
        else
            nlapiSetFieldValue('custbody_erase_tax_lines', 'F');

    }
    catch (e) {
        var newEmail = nlapiSendEmail(3, 'marinaz@jfrog.com', 'Error From Zuora VAT Process, invoice id = ' + nlapiGetFieldValue("tranid"),
        'Error From Zuora VAT Process, invoice id = ' + nlapiGetFieldValue("tranid"), null, null, null, null);
    }
    return true;

}

function zuora_aftersubmit(type) {
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    if (isNullOrEmpty(rec.getFieldValue("custbodyzuorareferencenumber")))
        return true;
    nlapiSubmitRecord(rec, { disabletriggers: false, enablesourcing: false });
    return true;
}

function getNewTaxCode(taxcodes) {
    var code = "IL VAT Output -S";
    var taxCode;

    for (var i = 0; i < taxcodes.length; i++) {
        if (taxcodes[i].taxDesc.indexOf(code) >= 0)
            return taxcodes[i].taxCodeID;
    }
}


function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function dailyupdate() {
    update_zuora_tran('invoice');
   // update_zuora_tran('creditmemo');
}

function update_zuora_tran(type) {
    var context = nlapiGetContext();
    var results = new Array();
    var lastId = 10000000000000;
    var searchRecords = '';
    var searchRecordsLength = 0;
    do {
        var cols = [new nlobjSearchColumn('postingperiod'), new nlobjSearchColumn('name')];
        cols[cols.length] = new nlobjSearchColumn('internalid').setSort(true);
        var filters = [new nlobjSearchFilter('custbodyzuorareferencenumber', null, 'isnotempty', null), new nlobjSearchFilter('datecreated', null, 'within', 'daysago08'), new nlobjSearchFilter('mainline', null, 'is', 'T')];
        filters[filters.length] = new nlobjSearchFilter('internalidnumber', null, 'lessthan', lastId);
        try {
            searchRecords = nlapiSearchRecord(type, null, filters, cols);
        } catch (e) { }
        if (searchRecords) {
            searchRecordsLength = searchRecords.length;
            lastId = searchRecords[searchRecords.length - 1].getValue('internalid');
            results = results.concat(searchRecords);
        } else {
            searchRecordsLength = 0;
        }
    } while (searchRecordsLength == 1000);

    if (results == null)
        return;

    for (var i = 0; i < results.length; i++) {
        var rec = results[i];
        var invrec = nlapiLoadRecord(type, rec.id);
        invrec.setFieldValue('custbody_erase_tax_lines', 'T');
        nlapiSubmitRecord(invrec, { disabletriggers: false, enablesourcing: false });
        if (context.getRemainingUsage() < 200) {
            var state = nlapiYieldScript();
            if (state.status == 'FAILURE') {
                nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script ZOURA TAX');
            }
            else if (state.status == 'RESUME') {
                nlapiLogExecution("AUDIT", 'dailyupdate', "Resuming script due to: " + state.reason + ",  " + state.size);
            }
        }
    }
}


function close_payment() {
    var context = nlapiGetContext();
    try {
        var invid = context.getSetting('SCRIPT', 'custscript_invid');
        var invRec = nlapiLoadRecord('invocie', invid);
        var paymentrecid = invRec.getLineItemValue('links', 'id', 1);
        nlapiLogExecution('DEBUG', 'close_open_invoice', paymentrecid);
        var paymentRec = nlapiLoadRecord('customerpayment', paymentrecid);
        var lineCount = paymentRec.getLineItemCount('apply');
        //nlapiLogExecution('DEBUG', 'lines', lineCount + ' acc:' + invoiceRec.getFieldValue('account') + ' aracct:' + paymentRec.getFieldValue('aracct') + ' currency:' + paymentRec.getFieldValue('currency'));
        for (var i = 1; i <= lineCount; i++) {
            paymentRec.selectLineItem('apply', i);
            var applyID = paymentRec.getCurrentLineItemValue('apply', 'apply');
            // nlapiLogExecution('DEBUG', 'applyID', applyID);

            var due = paymentRec.getCurrentLineItemValue('apply', 'due');
            if (applyID == 'T') {
                nlapiLogExecution('DEBUG', 'in apply', applyID);
                paymentRec.setCurrentLineItemValue('apply', 'amount', due);
                paymentRec.commitLineItem('apply');
            }
        }
        nlapiSubmitRecord(rec, { paymentRec: true, enablesourcing: false });
    }
    catch (e) {
        nlapiLogExecution('audit', 'Error - invoice:' + context.getSetting('SCRIPT', 'custscript_invid'), e);

    };
}