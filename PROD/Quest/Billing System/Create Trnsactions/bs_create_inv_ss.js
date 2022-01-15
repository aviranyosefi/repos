var context = nlapiGetContext();
var employeeId = context.user;
var errArr = new Array();
var sList = new Array();
var agrType;
var none_data = []
var bi_singal_invoice = []
var grp_data = []
var amt_data = []
var enduser_data = []
var invoice_date = '';
function CreateInvoice() {
    try { 
        var manage_inv_log = context.getSetting('SCRIPT', 'custscript_manage_inv_log');    
        agrType = context.getSetting('SCRIPT', 'custscript_type');
        nlapiLogExecution('DEBUG', 'agrType :' + agrType, 'manage_inv_log: ' + manage_inv_log);
        manage_inv_log = JSON.parse(manage_inv_log);
        var agrType = manage_inv_log[0].type
        var results = getBP(agrType, manage_inv_log[0].fromdate, manage_inv_log[0].todate, manage_inv_log[0].agr, manage_inv_log[0].ib, manage_inv_log[0].employee, manage_inv_log[0].customer)                  

        //summaryEmail(employeeId);
    } catch (e) {
        nlapiLogExecution('error', 'error CreateInvoice ', e);
    }
}
function CreateSingalInvoice(bi_singal_invoice) {
    try {
        line = 0;
        bi_singal_invoice.sort(dynamicSortMultiple("cust"));
        custList = pluck(bi_singal_invoice, 'cust').filter(onlyUnique); // get customers
        for (var m = 0; m < custList.length; m++) {
            var data = [];
            customer = custList[m];
            for (var i = line; i < bi_singal_invoice.length; i++) {
                if (customer == bi_singal_invoice[i].cust) {
                    data.push({
                        cust: customer,
                        bp: bi_singal_invoice[i].bp,
                    })
                } else {
                    CreateInvoiceFromBI(data, null);
                    line = i;
                    break;
                }
            }
        }
        CreateInvoiceFromBI(data, null);
    } catch (e) {
        nlapiLogExecution('ERROR', 'CreateSingalInvoice Error:', e);
    }
}
function CreateNoneInvoice(none_data ) {
    try {
        Context(context);
        nlapiLogExecution('DEBUG', 'CreateNoneInvoice ' + none_data.length, JSON.stringify(none_data));
        line = 0;
        none_data.sort(dynamicSortMultiple("agr_id"));
        agrList = pluck(none_data, 'agr_id').filter(onlyUnique); // get customers
        for (var m = 0; m < agrList.length; m++) {
            //Context(context);
            var data = [];
            agreement = agrList[m];
            for (var k = line; k < none_data.length; k++) {
                if (agreement == none_data[k].agr_id) {
                    data.push({
                        agr: agreement,
                        cust: '',
                        bp: none_data[k].bp,
                    })
                } else {
                    CreateInvoiceFromBI(data , null);
                    line = k;
                    break;
                }
            }
        }
        CreateInvoiceFromBI(data, null);
    } catch (e) {
        nlapiLogExecution('ERROR', 'CreateNoneInvoice Error:', e);
    }
}
function CreateGrpInvoice(grp_data) {
    try { 
        line = 0;
        grp_data.sort(dynamicSortMultiple("cust", "grp"));
        custList = pluck(grp_data, 'cust').filter(onlyUnique); // get customers
        for (var m = 0; m < custList.length; m++) {
            var data = [];
            customer = custList[m];
            for (var i = line; i < grp_data.length; i++) {
                if (customer == grp_data[i].cust) {
                    data.push({
                        cust: customer,
                        bp: grp_data[i].bp,
                        grp: grp_data[i].grp,
                    })
                } else {
                    DesignGrpData(data);
                    //console.log(data)
                    line = i;
                    break;
                }
            }
        }
        DesignGrpData(data);
    } catch (e) {
        nlapiLogExecution('ERROR', 'CreateGrpInvoice Error:', e);
    }   
}
function DesignGrpData(data) {
    try {
        nlapiLogExecution('DEBUG', 'DesignGrpData data', JSON.stringify(data));
        var line = 0;
        var dataToInvoce = [];
        var previousGrp = data[0].grp;
        for (var m =line; m < data.length; m++) {
            grp = data[m].grp
            if (previousGrp == grp) {
                dataToInvoce.push({
                    cust: data[m].cust,
                    bp: data[m].bp,
                    grp: data[m].grp,
                })               
            }
            else {
                CreateInvoiceFromBI(dataToInvoce , null);
                dataToInvoce = [];
                m= m-1;
            }
            previousGrp = grp
        }
        CreateInvoiceFromBI(dataToInvoce , null);
    } catch (e) {
        nlapiLogExecution('ERROR', 'DesignGrpData Error:', e);
    }
}
function CreateEndCusInvoice(enduser_data) {
    try {
        line = 0;
        enduser_data.sort(dynamicSortMultiple("end_c"));
        custList = pluck(enduser_data, 'end_c').filter(onlyUnique); // get customers
        for (var m = 0; m < custList.length; m++) {
            var data = [];
            customer = custList[m];
            for (var i = line; i < enduser_data.length; i++) {
                if (customer == enduser_data[i].end_c) {
                    data.push({
                        bp: enduser_data[i].bp,
                        end_c: enduser_data[i].end_c,
                    })
                } else {
                    DesignEndCusData(data);
                    line = i;
                    break;
                }
            }
        }
        DesignEndCusData(data);
    } catch (e) {
        nlapiLogExecution('ERROR', 'CreateEndCusInvoice Error:', e);
    }
}
function DesignEndCusData(data) {
    try {
        nlapiLogExecution('DEBUG', 'DesignEndCusData data', JSON.stringify(data));
        var line = 0;
        var dataToInvoce = [];
        var previousEndUser = data[0].end_c;
        for (var m = line; m < data.length; m++) {
            EndUser = data[m].end_c
            if (previousEndUser == EndUser) {
                dataToInvoce.push({
                    cust: data[m].end_c,
                    bp: data[m].bp,
                    enduser_data: data[m].end_c,
                })
            }
            else {
                CreateInvoiceFromBI(dataToInvoce , null);
                dataToInvoce = [];
                m = m - 1;
            }
            previousEndUser = EndUser
        }
        CreateInvoiceFromBI(dataToInvoce, null);
    } catch (e) {
        nlapiLogExecution('ERROR', 'DesignEndCusData Error:', e);
    }
}
function CreatePrecentInvoice(amt_data) {
    try {
        line = 0;
        amt_data.sort(dynamicSortMultiple("cust"));
        custList = pluck(amt_data, 'cust').filter(onlyUnique); // get customers
        for (var m = 0; m < custList.length; m++) {
            var data = [];
            customer = custList[m];
            for (var i = line; i < amt_data.length; i++) {
                if (customer == amt_data[i].cust) {
                    data.push({
                        cust: customer,
                        bp: amt_data[i].bp,
                    })
                } else {
                    DesignPrecentData(data);
                    line = i;
                    break;
                }
            }
        }
        DesignPrecentData(data);
    } catch (e) {
        nlapiLogExecution('ERROR', 'CreatePrecentInvoice Error:', e);
    }
}
function DesignPrecentData(data) {
    try {
        nlapiLogExecution('DEBUG', 'DesignPrecentData data', JSON.stringify(data));
        var line = 0;
        var dataToInvoce = [];
        var customer = data[0].cust;
        var SplittingData = getSplittingInvoiceByPercent(customer);
        for (var m = line; m < data.length; m++) {
            for (var i = 0; i < SplittingData.length; i++) {
                dataToInvoce.push({
                    cust: SplittingData[i].cust,
                    bp: data[m].bp,
                    amt: SplittingData[i].amt,
                })
            }                                         
        }
        //console.log(dataToInvoce);  
        DesignPrecentBeforeInv(dataToInvoce);
    } catch (e) {
        nlapiLogExecution('ERROR', 'DesignPrecentData Error:', e);
    }
}
function DesignPrecentBeforeInv(data) {
    try {
        data.sort(dynamicSortMultiple("cust"));
        nlapiLogExecution('DEBUG', 'data', JSON.stringify(data));
        var line = 0;
        var dataToInvoce = [];
        var previousCust = data[0].cust;
        for (var m = line; m < data.length; m++) {
            customer = data[m].cust
            if (previousCust == customer) {
                dataToInvoce.push({
                    cust: data[m].cust,
                    bp: data[m].bp,
                    amt: data[m].amt,
                });
            }
            else {              
                CreateInvoiceFromBI(dataToInvoce,3);
                dataToInvoce = [];
                m = m - 1;
            }
            previousCust = customer
        }
        CreateInvoiceFromBI(dataToInvoce, 3);
        //console.log(dataToInvoce)
    } catch (e) {
        nlapiLogExecution('ERROR', 'DesignPrecentBeforeInv Error:', e);
    }
}
function getSplittingInvoiceByPercent(customer) {
    try { 
        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custbody_customer', null, 'is', customer)
        filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T')

        var search = nlapiCreateSearch('customtransaction_inv_percent', filters, null);

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

        if (s.length>0) {
            id = s[0].id;
            var rec = nlapiLoadRecord('customtransaction_inv_percent', id)
            var Count = rec.getLineItemCount('line');
            for (var line = 1; line <= Count; line++) {
                results.push({
                    cust: rec.getLineItemValue('line', 'custcol_split_customer', line),
                    amt: rec.getLineItemValue('line', 'amount', line)
                });
            }
            return results;
        }
        return results;
    } catch (e) {
        return results;
    }
}

function CreateInvoiceFromBI(dataToInvoce, split_method) {
    try {
        Context(context);
        var bp_ids = '';
        nlapiLogExecution('DEBUG', 'CreateInvoiceFromBI dataToInvoce:' + dataToInvoce.length, JSON.stringify(dataToInvoce));
        for (var r = 0; r < dataToInvoce.length; r++) {
            bp_ids += dataToInvoce[r].bp + ' ';
            //Context(context);
            var rec = nlapiLoadRecord('customrecord_billing_plan', dataToInvoce[r].bp);
            if (r == 0) {
                var INVOICErec = nlapiCreateRecord('invoice');
                if (!isNullOrEmpty(dataToInvoce[r].cust)) {
                    INVOICErec.setFieldValue('entity', dataToInvoce[r].cust);
                }
                else { INVOICErec.setFieldValue('entity', rec.getFieldValue('custrecord_bill_plan_cust'))}
                INVOICErec.setFieldValue('custbody_ser_agr', rec.getFieldValue('custrecord_bill_plan_agr'));  
                INVOICErec.setFieldValue('location', 101)
                INVOICErec.setFieldValue('trandate', invoice_date)
            }
            try {
                if (split_method == 3) {
                    var amt = dataToInvoce[r].amt
                }
                else { var amt = 1; }
                if (agrType == '2') {
                    calc_method = 4;
                }
                else {
                    var calc_method = rec.getFieldValue('custrecord_bill_plan_calc_method');
                    if (isNullOrEmpty(calc_method)) {
                        calc_method = nlapiLookupField('customrecord_agr_line', rec.getFieldValue('custrecord_bill_plan_agr_line'), 'custrecord_agr_line_cal_mtd')
                    }
                }               
                CreateItem(calc_method, INVOICErec, rec, split_method, amt)    
            } catch (err) {
                nlapiLogExecution('DEBUG', 'error CreateInvoiceFromBI - lines', err);
            }
        }
        try {
            
            nlapiLogExecution('debug', "INVOICErec.getLineItemCount('item'): ", INVOICErec.getLineItemCount('item'));
            var INVOICEid =  nlapiSubmitRecord(INVOICErec, null, true);
            nlapiLogExecution('debug', 'INVOICE id: ', INVOICEid);
            if (INVOICEid != -1) {                   
                sList.push({
                    agr: nlapiLookupField('customrecord_agreement', rec.getFieldValue('custrecord_bill_plan_agr'), 'name'),
                    invoice: nlapiLookupField('invoice', INVOICEid, 'tranid'),          
                });
            }
        } catch (e) {
            nlapiLogExecution('DEBUG', 'error nlapiSubmitRecord ', e);
            errArr.push({
                error: e,
                agr: nlapiLookupField('customrecord_agreement', rec.getFieldValue('custrecord_bill_plan_agr'), 'name'),
            });          
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error CreateBIFromBP ', e);
        nlapiSendEmail(employeeId, employeeId, 'Invoice create summary', 'An error occurred while trying to create Invoices \n Error description: ' + e);
    }
}
function CreateItem(calc_method, INVOICErec, rec, split_method, amt) {
    try {
        Context(context);
        var agr_line = rec.getFieldValue('custrecord_bill_plan_agr_line');        
        var item =nlapiLookupField('customrecord_agr_line', agr_line, 'custrecord_agr_line_charging_item')      
        if (isNullOrEmpty(item)) {item = 7538}
        nlapiLogExecution('debug', 'calc_method', calc_method);
        if (calc_method == 1) { // חיוב לפי כמות
            INVOICErec.selectNewLineItem('item');
            INVOICErec.setCurrentLineItemValue('item', 'item', item);
            INVOICErec.setCurrentLineItemValue('item', 'quantity', rec.getFieldValue('custrecord_bill_plan_reported_quantity'))
            INVOICErec.setCurrentLineItemValue('item', 'rate', rec.getFieldValue('custrecord_bill_plan_exc_rate'))
            addFieldToLine(INVOICErec,rec.getId(), rec.getFieldValue('custrecord_bill_plan_agr_line'), rec.getFieldValue('custrecord_bill_plan_agr'), rec.getFieldValue('custrecord_bill_plan_per_str_date'), rec.getFieldValue('custrecord_bill_plan_per_end_date'),null)
            INVOICErec.commitLineItem('item');            
        }
        else if (calc_method == 4) { // חיוב קבוע
            INVOICErec.selectNewLineItem('item');
            INVOICErec.setCurrentLineItemValue('item', 'item', item);
            INVOICErec.setCurrentLineItemValue('item', 'quantity', 1)
            if (split_method == 3) {
                var calcRate = (Number(rec.getFieldValue('custrecord_bill_plan_net_amount')) * amt) / 100                           
                INVOICErec.setCurrentLineItemValue('item', 'rate', calcRate)     
            }
            else {
                  INVOICErec.setCurrentLineItemValue('item', 'rate', rec.getFieldValue('custrecord_bill_plan_net_amount'))                         
            }            
            addFieldToLine(INVOICErec, rec.getId(), rec.getFieldValue('custrecord_bill_plan_agr_line'), rec.getFieldValue('custrecord_bill_plan_agr'), rec.getFieldValue('custrecord_bill_plan_per_str_date'), rec.getFieldValue('custrecord_bill_plan_per_end_date'), null)
            INVOICErec.commitLineItem('item'); 
        }
        else if (calc_method == 2) { // חיוב לפי מדרגה
            var reported_quantity = Number(rec.getFieldValue('custrecord_bill_plan_reported_quantity'));
            if (!isNullOrEmpty(reported_quantity)) {
                if (reported_quantity > 49) {
                    INVOICErec.selectNewLineItem('item');
                    INVOICErec.setCurrentLineItemValue('item', 'item', item);
                    INVOICErec.setCurrentLineItemValue('item', 'quantity', 1)
                    INVOICErec.setCurrentLineItemValue('item', 'rate', 440)
                    addFieldToLine(INVOICErec,rec.getId(), rec.getFieldValue('custrecord_bill_plan_agr_line'), rec.getFieldValue('custrecord_bill_plan_agr'), rec.getFieldValue('custrecord_bill_plan_per_str_date'), rec.getFieldValue('custrecord_bill_plan_per_end_date'),1)
                    INVOICErec.commitLineItem('item');
                    INVOICErec.selectNewLineItem('item');
                    INVOICErec.setCurrentLineItemValue('item', 'item', item);
                    INVOICErec.setCurrentLineItemValue('item', 'quantity', reported_quantity - 49)
                    INVOICErec.setCurrentLineItemValue('item', 'rate', rec.getFieldValue('custrecord_bill_plan_exc_rate'))
                    addFieldToLine(INVOICErec,rec.getId(), rec.getFieldValue('custrecord_bill_plan_agr_line'), rec.getFieldValue('custrecord_bill_plan_agr'), rec.getFieldValue('custrecord_bill_plan_per_str_date'), rec.getFieldValue('custrecord_bill_plan_per_end_date'),2)
                    INVOICErec.commitLineItem('item');           
                }
                else {
                    INVOICErec.selectNewLineItem('item');
                    INVOICErec.setCurrentLineItemValue('item', 'item', item);
                    INVOICErec.setCurrentLineItemValue('item', 'quantity', 1)
                    INVOICErec.setCurrentLineItemValue('item', 'rate', rec.getFieldValue('custrecord_bill_plan_net_amount'))
                    addFieldToLine(INVOICErec,rec.getId(), rec.getFieldValue('custrecord_bill_plan_agr_line'), rec.getFieldValue('custrecord_bill_plan_agr'), rec.getFieldValue('custrecord_bill_plan_per_str_date'), rec.getFieldValue('custrecord_bill_plan_per_end_date'),1)
                    INVOICErec.commitLineItem('item');              
                }
            }          
        }
        else if (calc_method == 3) { // מחיר קבוע וחריגה
            var reported_quantity = Number(rec.getFieldValue('custrecord_bill_plan_reported_quantity'));
            var bsc_qty = Number(rec.getFieldValue('custrecord_bill_plan_bsc_qty'));
            if (!isNullOrEmpty(reported_quantity)) {
                if (reported_quantity > bsc_qty) {
                    INVOICErec.selectNewLineItem('item');
                    INVOICErec.setCurrentLineItemValue('item', 'item', item);
                    INVOICErec.setCurrentLineItemValue('item', 'quantity', 1)
                    INVOICErec.setCurrentLineItemValue('item', 'rate', rec.getFieldValue('custrecord_bill_plan_bsc_rate'))
                    addFieldToLine(INVOICErec,rec.getId(), rec.getFieldValue('custrecord_bill_plan_agr_line'), rec.getFieldValue('custrecord_bill_plan_agr'), rec.getFieldValue('custrecord_bill_plan_per_str_date'), rec.getFieldValue('custrecord_bill_plan_per_end_date'),1)
                    INVOICErec.commitLineItem('item');
                    INVOICErec.selectNewLineItem('item');
                    INVOICErec.setCurrentLineItemValue('item', 'item', item);
                    INVOICErec.setCurrentLineItemValue('item', 'quantity', reported_quantity - bsc_qty)
                    INVOICErec.setCurrentLineItemValue('item', 'rate', rec.getFieldValue('custrecord_bill_plan_exc_rate'))
                    addFieldToLine(INVOICErec,rec.getId(), rec.getFieldValue('custrecord_bill_plan_agr_line'), rec.getFieldValue('custrecord_bill_plan_agr'), rec.getFieldValue('custrecord_bill_plan_per_str_date'), rec.getFieldValue('custrecord_bill_plan_per_end_date'),2)
                    INVOICErec.commitLineItem('item');         
                }
                else {
                    INVOICErec.selectNewLineItem('item');
                    INVOICErec.setCurrentLineItemValue('item', 'item', item);
                    INVOICErec.setCurrentLineItemValue('item', 'quantity', 1)
                    INVOICErec.setCurrentLineItemValue('item', 'rate', rec.getFieldValue('custrecord_bill_plan_bsc_rate'))
                    addFieldToLine(INVOICErec,rec.getId(), rec.getFieldValue('custrecord_bill_plan_agr_line'), rec.getFieldValue('custrecord_bill_plan_agr'), rec.getFieldValue('custrecord_bill_plan_per_str_date'), rec.getFieldValue('custrecord_bill_plan_per_end_date'),1)
                    INVOICErec.commitLineItem('item');            
                }
            }
        }   
        if (!isNullOrEmpty(rec.getFieldValue('custrecord_bill_sche_disc')) && rec.getFieldValue('custrecord_bill_sche_disc') != "0.0%" && agrType ==1 ) {
            INVOICErec.selectNewLineItem('item');
            INVOICErec.setCurrentLineItemValue('item', 'item', item);
            INVOICErec.setCurrentLineItemValue('item', 'quantity', 1)
            if (split_method == 3) {
                var calcRate = ((Number(rec.getFieldValue('custrecord_bill_plan_gross_amount')) - Number(rec.getFieldValue('custrecord_bill_plan_net_amount'))) * -1 * amt) / 100
                INVOICErec.setCurrentLineItemValue('item', 'rate', calcRate)              
            }
            else {
                INVOICErec.setCurrentLineItemValue('item', 'rate', (Number(rec.getFieldValue('custrecord_bill_plan_gross_amount')) - Number(rec.getFieldValue('custrecord_bill_plan_net_amount'))) * -1)
            }       
            addFieldToLine(INVOICErec,rec.getId(), rec.getFieldValue('custrecord_bill_plan_agr_line'), rec.getFieldValue('custrecord_bill_plan_agr'), rec.getFieldValue('custrecord_bill_plan_per_str_date'), rec.getFieldValue('custrecord_bill_plan_per_end_date'),3)
            INVOICErec.commitLineItem('item');
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'CreateItem Error:', e);
    }
}



function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function Context(context) {
    if (context.getRemainingUsage() < 5000) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }
}
function dynamicSort(property) {

    if (property == 'date') {
        return function (obj1, obj2) {
            return new Date(obj1.date) - new Date(obj2.date);
        }
    }
    else {
        return function (obj1, obj2) {
            return obj1[property] > obj2[property] ? 1
                : obj1[property] < obj2[property] ? -1 : 0;
        }
    }
}
function dynamicSortMultiple() {

    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}
function summaryEmail(employeeId) {
    nlapiLogExecution('DEBUG', 'inside send mail', 'inside send mail');
    try {
        var date = new Date();
        var subject = "Invoices create summary ";
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
            "<p style='color:black; font-size:100%;'>The process of Invoices create has been completed. </p> " +
            "<p style='color: black; font-size:70%;'>Here is a summary of the results:</p></div>";

        var successTbl = '<p style= \'font-weight: bold ;color: green; font-size:140%; \'>Total: ' + sList.length + ' succeeded</p><br>';
        if (sList != null && sList != '') {
            successTbl += "<table style = \"width: 100 %;\" >";
            // for th
            successTbl += "<tr><th>Agreement</th><th><Invoice></th></tr>";
            for (var v in sList) {
                successTbl += "<tr><td>" + sList[v].agr + "</td>";       
                successTbl += "<td>" + sList[v].invoice + "</td>"
                successTbl += "</tr>";
            }
            successTbl += "</table>"
        }

        var failTbl = '<p style= \'font-weight: bold ;color: red; font-size:140%; \'> Total: ' + errArr.length + ' failed</p><br>';
        if (errArr != null && errArr != '') {
            failTbl += "<table style = \"width: 100 %;\" >";
            // for th
            failTbl += "<tr><th>Agreement</th><th>Error</th></tr>";
            for (var s in errArr) {
                failTbl += "<tr><td>" + errArr[s].agr + "</td><td>" + errArr[s].error + "</td></tr > ";
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
function pluck(array, key) {
    return array.map(function (obj) {
        return obj[key];
    });
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function addFieldToLine(INVOICErec, id, agr_line, agr, start_date, end_date, memoType) {
    try {
        INVOICErec.setCurrentLineItemValue('item', 'custcol_bill_plan', id)
        INVOICErec.setCurrentLineItemValue('item', 'custcol_ser_agr_line', agr_line)
        INVOICErec.setCurrentLineItemValue('item', 'custcol_ser_agr', agr)
        INVOICErec.setCurrentLineItemValue('item', 'custcol_rev_rec_start', start_date)
        INVOICErec.setCurrentLineItemValue('item', 'custcol_rev_rec_end', end_date)
        if (!isNullOrEmpty(agr_line)) {
            var memo = nlapiLookupField('customrecord_agr_line', agr_line, 'custrecord_agg_line_desc')
            if (!isNullOrEmpty(memo)) {
                INVOICErec.setCurrentLineItemValue('item', 'description', memo)
            }
        }
        if (!isNullOrEmpty(memoType)) {
            INVOICErec.setCurrentLineItemValue('item', 'custcol_invoice_memo_type', memoType)
        }
      
        
    } catch (e) {
        nlapiLogExecution('ERROR', 'addFieldToLine Error:', e);
    }
    
}

function getBP(type_data, from_date_data, to_date_data, agr_data, ib_data, employee_line_data, customer_data) {

    //nlapiLogExecution('debug', ' status_data: ' + status_data, 'agr_data: ' + agr_data)
    var search = nlapiLoadSearch(null, 'customsearch_bs_invoices');
    var cols = search.getColumns();
    search.addFilter(new nlobjSearchFilter('custrecord_agr_type', 'custrecord_bp_agr', 'anyof', type_data))
    if (!isNullOrEmpty(from_date_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bp_date_for_inv', null, 'onorafter', from_date_data)) }
    //search.addFilter(new nlobjSearchFilter('custrecord_bp_date_for_inv', null, 'onorbefore', to_date_data)) 
    if (!isNullOrEmpty(agr_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bp_agr', null, 'anyof', agr_data)) }
    if (!isNullOrEmpty(ib_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bp_ib', null, 'anyof', ib_data)) }
    //if (!isNullOrEmpty(employee_line_data)) { search.addFilter(new nlobjSearchFilter('custrecord_ib_item', null, 'anyof', employee_line_data)) }
    if (!isNullOrEmpty(customer_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bp_customer', null, 'anyof', customer_data)) }
    var agrList = [];
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            agrList.push({
                agr: s[i].getText("custrecord_bp_agr", null, "GROUP"),
                amount: s[i].getValue("custrecord_bp_amount", null, "SUM"),
            });
        }
    }
    return agrList;
}
function checkRate(inv) {
    var line = inv.getLineItemCount('item');
    for (var i = 1; i <= line; i++) {
        var rate = inv.getLineItemValue('item', 'rate', i);
        nlapiLogExecution('debug', 'line: ' + i, rate + ' , BP:' + inv.getLineItemValue('item', 'custcol_bill_plan', i));
        //if(isNullOrEmpty)
    }
}


