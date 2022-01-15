var context = nlapiGetContext();
var employeeId = context.user;
var compArr = context.getSetting('SCRIPT', 'custscript_fileid');
var errArr = new Array();
var sList = new Array();
debugger;
        var lineArr = [];
        var customer_list = getCustomerForCredit();
        if (customer_list.length > 0) {
            var cust_for_credit = getAmountForCredit(customer_list);
            for (y = 0; y < cust_for_credit.length; y++) {
                if (context.getRemainingUsage() < 150) {
                    nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                    if (state.status == 'FAILURE') {
                        nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                    }
                    else if (state.status == 'RESUME') {
                        nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                    }
                }
                try {
                    var creditMemo = nlapiCreateRecord('creditmemo', { entity: cust_for_credit[y].customer });
                    creditMemo.setLineItemValue('item', 'item', 1, '1198'); //add credit item
                    creditMemo.setLineItemValue('item', 'amount', 1, cust_for_credit[y].amount);// set the amount for credit
                    creditMemo.setFieldValue('location', '7');// set default location - Mandatory field

                    submition = nlapiSubmitRecord(creditMemo);
                    if (!isNullOrEmpty(submition)) {
                        sList.push({
                            creditMemo: submition,
                            inv: 'temp',
                            invLines: '',
                            so: 'temp',
                            soLines: '',
                            status: 'succeed'
                        })
                        lineArr = getlinesForUpdate(cust_for_credit[y].customer);
                        var targetMarge = cust_for_credit[y].target_pricing;
                        for (i = 0; i < lineArr.length; i++) {
                            invoice = nlapiLoadRecord('invoice', lineArr[i].invoiceId);
                            count = invoice.getLineItemCount('item');
                            for (j = 0; j < count; j++) {
                                if (lineArr[i].invoiceLine == invoice.getLineItemValue('item', 'line', j + 1)) {
                                    invoice.setLineItemValue('item', 'custcol_customer_target_credit_doc', j + 1, submition);
                                    if (targetMarge != -1) {
                                        invoice.setLineItemValue('item', 'custcol_current_target_discount', j + 1, targetMarge);
                                    }
                                    nlapiSubmitRecord(invoice, null, true);
                                    sList[sList.length - 1].inv = invoice.getFieldValue('tranid');
                                    sList[sList.length - 1].invLines = lineArr[i].invoiceLine;
                                    break;
                                }
                            }
                            so = nlapiLoadRecord('salesorder', lineArr[i].soId);
                            count = so.getLineItemCount('item');
                            for (j = 0; j < count; j++) {
                                if (lineArr[i].soLine == so.getLineItemValue('item', 'line', j + 1)) {
                                    so.setLineItemValue('item', 'custcol_customer_target_credit_doc', j + 1, submition);
                                    if (targetMarge != -1) {
                                        so.setLineItemValue('item', 'custcol_current_target_discount', j + 1, targetMarge);
                                    }
                                    nlapiSubmitRecord(so, null, true);
                                    sList[sList.length - 1].so = so.getFieldValue('tranid');
                                    sList[sList.length - 1].soLines = lineArr[i].soLine;
                                    break;
                                }
                            }

                        }
                    }



                }
                catch (e) {
                    errArr.push({
                        customer: cust_for_credit[y].customer,
                        status: 'Failed',
                        error: e,
                    })
                    nlapiLogExecution('ERROR', 'error  -customer:' + cust_for_credit[y].customer + ' ', e);
                    continue;
                }
            }
            nlapiLogExecution('DEBUG', 'before send mail', '');
        }
        else {
            nlapiLogExecution('DEBUG', 'no eligable customers for credit', '');
        }
    


function getCustomerForCredit() {

    var search = nlapiLoadSearch(null, 'customsearch_target_credit_amount_calc_3');

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        s.forEach(function (element) {
            results.push(element.getValue('entity', null, 'GROUP'))
        });
    }
    return results;
}

function getAmountForCredit(customer) {

    var search = nlapiLoadSearch(null, 'customsearch_target_credit_amount_calc');
    search.addFilter(new nlobjSearchFilter('entity', null, 'anyof', customer));

    var resultset = search.runSearch();
    var cols = search.getColumns();
    var s = [];
    var searchid = 0;
    var results = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        s.forEach(function (element) {
            results.push({
                customer: element.getValue('entity', null, "GROUP"),
                target_pricing: element.getValue('custentity_target_price_level', 'customer', "GROUP"),
                amount: element.getValue(cols[6])
            })
        });
    }
    return results;
}

function getlinesForUpdate(customer) {

    var search = nlapiLoadSearch(null, 'customsearch_target_credit_amount_calc_2');
    search.addFilter(new nlobjSearchFilter('entity', null, 'anyof', customer));

    var resultset = search.runSearch();
    //var cols = search.getColumns();
    var s = [];
    var searchid = 0;
    var results = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        s.forEach(function (element) {
            results.push({
                groupPrice: element.getValue('pricelevel'),
                invoiceId: element.getValue('internalid'),
                invoiceLine: element.getValue('line'),
                soId: element.getValue('appliedtotransaction'),
                soLine: element.getValue('line', 'appliedToTransaction')
            })
        });
    }
    return results;
}

function getTargetMargin(orig) {
    nlapiCreateSearch('customrecord_margins_scale')
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_target_margin');
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_original_margin', null, 'anyof', orig);
    var search = nlapiCreateSearch('customrecord_margins_scale', filters, columns);
    var s = [];
    var Results = [];

    var searchid = 0;
    var resultset = search.runSearch();
    //var cols = search.getColumns();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }

    } while (resultslice != null && resultslice.length >= 1000);
    if (s.length > 0) {
        return s[0].getValue('custrecord_target_margin');
    }
    else {
        return '-1';
    }
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}