function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        var recType = nlapiGetRecordType();
        form.setScript('customscript_transaction_print_cs');
        if (recType == 'itemfulfillment') {
            form.addButton('custpage_button_print_pl', 'Print PL', 'printButtonPL()');
            form.addButton('custpage_button_print_ci', 'Print CI', 'printButtonCI()');
        }
        else if (recType == 'purchaseorder') {
            var rec = nlapiLoadRecord(recType, nlapiGetRecordId());
            var approvalStatus = rec.getFieldValue('approvalstatus');
            nlapiLogExecution('DEBUG', 'approvalStatus:', approvalStatus);

            form.addButton('custpage_button_print_po', 'Print PO', 'printButtonPO()');
            if (approvalStatus == '2') {//approved
                if (nlapiGetUser() == 20 || nlapiGetUser() == 3678) {
                    form.addButton('custpage_button_email_po', 'Email PO', 'emailButtonPO()');
                }
            }
        }
    }
}

function beforeSubmit(type) {
    nlapiLogExecution('debug', 'beforeSubmit:', 'run');

    if (type == "edit" || type == 'create') {
        var recType = nlapiGetRecordType();
        if (recType == 'itemfulfillment') {
                var createdfrom = nlapiGetFieldValue('createdfrom');
                if (!isNullOrEmpty(createdfrom)) {
                    var ffItems = nlapiGetLineItemCount('item');
                    try {
                        var currentRecord = nlapiGetNewRecord();
                        var transactionRec;
                        if (currentRecord.getFieldValue('ordertype') == 'SalesOrd') {
                             transactionRec = nlapiLoadRecord('salesorder', createdfrom);
                        }
                        else if (currentRecord.getFieldValue('ordertype') == 'TrnfrOrd') {
                             transactionRec = nlapiLoadRecord('transferorder', createdfrom);
                        }

                        var transactionItems = transactionRec.getLineItemCount('item');
                        for (var i = 1; i <= ffItems; i++) {
                            var item = nlapiGetLineItemValue('item', 'item', i);
                            var line = nlapiGetLineItemValue('item', 'orderline', i);
                            for (var j = 1; j <= transactionItems; j++) {
                                var transaction_line = transactionRec.getLineItemValue('item', 'line', j);
                                var transaction_item = transactionRec.getLineItemValue('item', 'item', j);
                                if (item == transaction_item && transaction_line == line) {
                                    var transactionRate = transactionRec.getLineItemValue('item', 'rate', j);
                                    if (isNullOrEmpty(currentRecord.getLineItemValue('item', 'custcol_custom_price', i))) { // needs to populate the price only if it is empty
                                        nlapiSetLineItemValue('item', 'custcol_custom_price', i, transactionRate);
                                        break;
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        for (var i = 1; i <= ffItems; i++) {
                            nlapiSetLineItemValue('item', 'custcol_custom_price', i, 0);
                        }
                    }
                }
                              
        }       
    }
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

