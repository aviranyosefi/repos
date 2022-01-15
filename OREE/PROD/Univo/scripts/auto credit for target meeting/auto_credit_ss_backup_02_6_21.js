var context = nlapiGetContext();
var employeeId = context.user;
var compArr = context.getSetting('SCRIPT', 'custscript_fileid');
var errArr = new Array();
var sList = new Array();

function creditCustomers() {
    try {
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
                        lineArr = getlinesForUpdate(cust_for_credit[y].customer);
                        var targetMarge = -1;
                        for (i = 0; i < lineArr.length; i++) {
                            if (i == 0) {
                                targetMarge = getTargetMargin(lineArr[i].groupPrice);
                            }
                            invoice = nlapiLoadRecord('invoice', lineArr[i].invoiceId);
                            count = invoice.getLineItemCount('item');
                            for (j = 0; j < count; j++) {
                                if (lineArr[i].invoiceLine == invoice.getLineItemValue('item', 'line', j+1)) {
                                    invoice.setLineItemValue('item', 'custcol_customer_target_credit_doc', j+1, submition);
                                    if (targetMarge != -1) {
                                        invoice.setLineItemValue('item', 'custcol_current_target_discount', j+1, targetMarge);
                                    }
                                    nlapiSubmitRecord(invoice, null, true);
                                    break;
                                } 
                            }
                            so = nlapiLoadRecord('salesorder', lineArr[i].soId);
                            count = so.getLineItemCount('item');
                            for (j = 0; j < count; j++) {
                                if (lineArr[i].soLine == so.getLineItemValue('item', 'line', j+1)) {
                                    so.setLineItemValue('item', 'custcol_customer_target_credit_doc', j+1, submition);
                                    if (targetMarge != -1) {
                                        so.setLineItemValue('item', 'custcol_current_target_discount', j+1, targetMarge);
                                    }
                                    nlapiSubmitRecord(so, null, true);
                                    break;
                                }
                            }

                        }
                    }

                    
                    if (submition != -1) {
                        sList.push({
                            creditMemo: submition,
                            lineArr: lineArr,
                            status: 'succeed'
                        })
                    }
                }
                catch (e) {
                    errArr.push({
                        so_id: so_list[y].sales_order,
                        line: so_list[y].lines,
                        so_tranid: so_list[y].tranid,
                        status: 'Failed',
                        error: e,
                    })
                    nlapiLogExecution('ERROR', 'error  - sales order id:' + so_list[y].salesOrderId + ' ', e);
                    continue;
                }
            }
            nlapiLogExecution('DEBUG', 'before send mail', '');
            summaryEmail(employeeId);
        }
        else {
            nlapiLogExecution('DEBUG', 'no eligable customers for credit', '');
        }
    }catch (e) {
        nlapiSendEmail(employeeId, employeeId, 'Transform Sales Orders to Fuilfillments summary', 'An error occurred while trying to fulfill sales orders \n Error description: ' + e);
    }
}
    
    
    
    

function summaryEmail(employeeId) {
    nlapiLogExecution('DEBUG', 'inside send mail', '');
    try {
        var date = new Date();
        var subject = "Transform Sales Orders to Fuilfillments summary ";
        var body = '<html>' +
            '<head>' +
            '<style>' +
            'table, th, td {' +
            'border: 2px solid black;' +
            'border-collapse: collapse;' +
            '}' +
            'td {' +
            'padding: 5px;' +
            'text-align: left;' +
            '}' +
            'th {' +
            'padding: 5px;' +
            'text-align: center;' +
            'background-color: #edeaea;' +
            'font-weight: bold ;' +
            '}' +
            '</style>' +
            '</head>' +
            "<div><p style= \'font-weight: bold ;font-size:110%; \'> Time stamp : " + date + "</p><br><br>" +
            "<p style='color:black; font-size:100%;'>The process of fulfilling the selected Sales orders, has been completed. </p> " +
            "<p style='color: black; font-size:10%;'>Here is a summary of the results:</p></div>";

        var successTbl = '<p style= \'font-weight: bold ;color: green; font-size:140%; \'>Total: ' + sList.length + ' succeeded</p><br>';
        if (sList != null && sList != '') {
            successTbl += "<table style = \"width: 100 %;\" >";
            // for th
            successTbl += "<tr><th>SO Id + name </th><th>FF Id </th><th>FF TranId </th><tr>"; //<th>Lines</th>
            var i = 0;
            for (v in sList) {
                successTbl += "<tr><td>" + sList[v].so_id + ' - ' + sList[v].so_tranid + "</td>";
                /*successTbl += "<td>";
                var lines = sList[v].lines.split(',')
                for (z = 0; z < lines.length; z++) {
                    successTbl += lines[z] + ', ';
                }
                successTbl += "</td>";*/
                successTbl += "<td>" + sList[v].ff_id + "</td>"
                successTbl += "<td>" + sList[v].ff_tranid + "</td>"
                successTbl += "</tr>";
            }
            successTbl += "</table>"
        }

        var failTbl = '<p style= \'font-weight: bold ;color: red; font-size:140%; \'> Total: ' + errArr.length + ' failed</p><br>';
        if (errArr != null && errArr != '') {
            failTbl += "<table style = \"width: 100 %;\" >";
            // for th
            failTbl += "<tr><th>Id </th><th>Description</th><tr>";
            for (s in errArr) {
                failTbl += "<tr><td>" + errArr[s].so_id + ' - ' + errArr[s].so_tranid + "</td> <td>" + errArr[s].error + "</td></tr> "
            }
            failTbl += "</table>"
        }
        var list = successTbl + '<br>' + failTbl;
        body += list;
        body += '<br></html>';
        nlapiSendEmail(employeeId, employeeId, subject, body);
        nlapiLogExecution('debug', 'after email', 'email has been sent');
    } catch (e) {
        nlapiLogExecution('error', 'email()', e);
    }
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

function getAmountForCredit(customer){

    var search = nlapiLoadSearch(null, 'customsearch_target_credit_amount_calc');
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
                customer: element.getValue('entity', null, "GROUP"),
                amount: element.getValue('amount', null, "SUM")
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
                soLine: element.getValue('line','appliedToTransaction')
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