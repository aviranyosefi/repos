var context = nlapiGetContext();
var user = context.user;
var createData = [];
var rejectData = [];
var updateData = [];
var numOfLines = 0;
function getSearchData() {

    var first_data = context.getSetting('SCRIPT', 'custscript_first_data');
    var second_data = context.getSetting('SCRIPT', 'custscript_second_data');
    var salesrole = context.getSetting('SCRIPT', 'custscript_salesrole');
    var logid = context.getSetting('SCRIPT', 'custscript_logid');
    nlapiLogExecution('DEBUG', 'salesrole : ' + salesrole, 'logid : ' + logid );
    
    first_data = JSON.parse(first_data);
    second_data = JSON.parse(second_data);
    if (salesrole == '1') {
        if (first_data.length > 0) {
            createData = Billing_Instruction_Generate(first_data);
        }
        if (second_data.length > 0) {
            updateData = Billing_Instruction_Update_Matal(second_data);
        }
    }
    else if (salesrole == '2') {
        if (first_data.length > 0) {
            updateData = Billing_Instruction_Update(first_data);
        }
        if (second_data.length > 0) {
            createData = Billing_Instruction_Generate_Menael(second_data);
        }
    }
    else if (salesrole == '4') {
        if (first_data.length > 0) {
            updateData = Billing_Instruction_Update_Final(first_data);
        }
        if (second_data.length > 0) {
            rejectData = Billing_Instruction_Update_Resaon(second_data);
        }
    }
    numOfLines = first_data.length + second_data.length
    setResDate(logid)
    summaryEmail();
}

function Billing_Instruction_Generate(data) {
    nlapiLogExecution('DEBUG', 'Billing_Instruction_Generate data: ' + data.length, JSON.stringify(data));
    try {
        var billing_instruction = [];
        for (var i = 0; i < data.length; i++) {
            try {
                Context(context)
                var entity = data[i].entity                              
                var rec = nlapiCreateRecord('customsale_billing_instruction');
                //Header Fields 
                rec.setFieldValue('entity', entity);
                rec.setFieldValue('enddate', data[i].enddate);
                rec.setFieldValue('memo', data[i].memo);
                rec.setFieldValue('custbody_agreement', data[i].agreement);
                rec.setFieldValue('custbody_amount_sales_rep', NumberToRate(data[i].sugg_monthly_charge));
                rec.setFieldValue('custbody_sales_rep_creator', data[i].sales_rep_creator);
                rec.setFieldValue('custbody_calculated_amount_system', NumberToRate(data[i].calculated_amount_system));
                rec.setFieldValue('trandate', data[i].toDateData);
                rec.setFieldValue('custbody_billing_type', billing_type(data[i].billing_type, NumberToRate(data[i].calculated_amount_system), NumberToRate(data[i].rate)));
                rec.setFieldValue('custbody_price_change', data[i].change);
                try {
                    // lines Fields
                    rec.selectNewLineItem('item');
                    rec.setCurrentLineItemValue('item', 'item', '7643');// הוראת חיוב
                    rec.setCurrentLineItemValue('item', 'quantity', '1')
                    rec.setCurrentLineItemValue('item', 'rate', NumberToRate(data[i].rate))
                    rec.setCurrentLineItemValue('item', 'custcol_beans_kg', data[i].beans_kg)
                    rec.setCurrentLineItemValue('item', 'custcol_bill_instruct_sys_calculation', NumberToRate(data[i].sugg_monthly_charge))
                    rec.commitLineItem('item');
                } catch (err) {
                    nlapiLogExecution('DEBUG', 'error Billing_Instruction_Generate - lines', err);
                }
                var alreadyCreated = DoCreate(entity, data[i].fromdate, data[i].enddate )  
                if (alreadyCreated) {
                    var id = nlapiSubmitRecord(rec);
                    //nlapiLogExecution('debug', 'billing_instruction id: ', id);
                    if (id != -1) {
                        billing_instruction.push({
                            id: id,
                            tranid: nlapiLookupField('customsale_billing_instruction', id, 'tranid')
                        });
                        getAgreementsTrans(id, data[i].agreement);
                    }
                }              
            } catch (e) {
                nlapiLogExecution('DEBUG', 'error nlapiSubmitRecord ', e);
            }
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error Billing_Instruction_Generate ', e);
    }

    return billing_instruction;
}
function Billing_Instruction_Update_Matal(data) {
    try {
        var billing_instruction = [];
        nlapiLogExecution('DEBUG', 'Billing_Instruction_Update_Matal: ' + data.length, JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {
            try {
                Context(context)
                var rec = nlapiLoadRecord('customsale_billing_instruction', data[i].id);
                rec.setLineItemValue('item', 'rate', 1, NumberToRate(data[i].curr_monthly_charge))
                rec.setFieldValue('custbody_amount_sales_rep', NumberToRate(data[i].curr_monthly_charge));
                rec.setFieldValue('memo', data[i].memo);            
                nlapiSubmitRecord(rec);
                billing_instruction.push({
                    id: data[i].id,
                    tranid: nlapiLookupField('customsale_billing_instruction', data[i].id, 'tranid')
                });
            } catch (e) { }
        }
        resUpdate = 'success';
        return billing_instruction;
    } catch (e) {
        nlapiLogExecution('DEBUG', 'Billing_Instruction_Update_Matal error: ', e);
        resUpdate = e;
        return billing_instruction;
    }
}
//DS FF screen search MM 
function Billing_Instruction_Update(data) {
    try {
        var billing_instruction = [];
        nlapiLogExecution('DEBUG', 'Billing_Instruction_Update : ' + data.length, JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {
            Context(context)
            try {
                var bi_id = data[i].billing_instruction
                if (!isNullOrEmpty(bi_id)) {
                    var rec = nlapiLoadRecord('customsale_billing_instruction', bi_id);
                    rec.setFieldValue('custbody_amount_sales_manager', NumberToRate(data[i].amount_sales_manager));
                    rec.setFieldValue('custbody_sales_manager_approver', data[i].sales_manager_approver);
                    rec.setLineItemValue('item', 'rate', 1, NumberToRate(data[i].amount_sales_manager))
                    rec.setFieldValue('memo', data[i].memo);
                    rec.setFieldValue('custbody_price_change', data[i].change);
                    var id = nlapiSubmitRecord(rec);
                    //nlapiLogExecution('DEBUG', 'id after update: ', id);
                    billing_instruction.push({
                        id: data[i].billing_instruction,
                        tranid: nlapiLookupField('customsale_billing_instruction', bi_id, 'tranid')
                    });
                }               
            } catch (e) { }
        }
        resUpdate = 'success';
        return billing_instruction;
    } catch (e) {
        nlapiLogExecution('DEBUG', 'Billing_Instruction_Update error: ', e);
        resUpdate = e;
        return billing_instruction;
    }
}
function Billing_Instruction_Generate_Menael(data) {
    nlapiLogExecution('DEBUG', 'Billing_Instruction_Generate_Menael data: ' + data.length, JSON.stringify(data));
    try {
        var billing_instruction = [];
        for (var i = 0; i < data.length; i++) {
            try {
                Context(context)
                var entity = data[i].entity
                var rec = nlapiCreateRecord('customsale_billing_instruction');
                //Header Fields 
                rec.setFieldValue('entity', entity);
                rec.setFieldValue('enddate', data[i].enddate);
                rec.setFieldValue('memo', data[i].memo);
                rec.setFieldValue('custbody_agreement', data[i].agreement);
                rec.setFieldValue('custbody_amount_sales_manager', NumberToRate(data[i].sugg_monthly_charge));
                rec.setFieldValue('custbody_sales_manager_approver', data[i].sales_manager_approver);
                rec.setFieldValue('custbody_calculated_amount_system', NumberToRate(data[i].calculated_amount_system));
                rec.setFieldValue('trandate', data[i].toDateData);
                rec.setFieldValue('custbody_billing_type', billing_type(data[i].billing_type, NumberToRate(data[i].calculated_amount_system), NumberToRate(data[i].rate)));
                rec.setFieldValue('custbody_price_change', data[i].change);
                try {
                    // lines Fields
                    rec.selectNewLineItem('item');
                    rec.setCurrentLineItemValue('item', 'item', '7643');// הוראת חיוב
                    rec.setCurrentLineItemValue('item', 'quantity', '1')
                    rec.setCurrentLineItemValue('item', 'rate', NumberToRate(data[i].rate))
                    rec.setCurrentLineItemValue('item', 'custcol_beans_kg', data[i].beans_kg)
                    rec.setCurrentLineItemValue('item', 'custcol_bill_instruct_sys_calculation', NumberToRate(data[i].sugg_monthly_charge))
                    rec.commitLineItem('item');
                } catch (err) {
                    nlapiLogExecution('DEBUG', 'error Billing_Instruction_Generate - lines', err);
                }
                var alreadyCreated = DoCreate(entity, data[i].fromdate, data[i].enddate)
                if (alreadyCreated) {
                    var id = nlapiSubmitRecord(rec);
                    //nlapiLogExecution('debug', 'billing_instruction id: ', id);
                    if (id != -1) {
                        billing_instruction.push({
                            id: id,
                            tranid: nlapiLookupField('customsale_billing_instruction', id, 'tranid')
                        });
                        getAgreementsTrans(id, data[i].agreement);
                    }
                }
            } catch (e) {
                nlapiLogExecution('DEBUG', 'error nlapiSubmitRecord ', e);
            }
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error Billing_Instruction_Generate_Menael ', e);
    }

    return billing_instruction;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function NumberToRate(number) {

    return number.replace(new RegExp(",", "g"), "")
}
function getAgreementsTrans(BillingIns_id, agreement) {
    nlapiLogExecution('DEBUG', ' BillingIns_id: ' + BillingIns_id, 'agreement: ' + agreement);
    try {
        var loadedSearch = nlapiLoadSearch(null, 'customsearch_df_ff_dril_down');
        loadedSearch.addFilter(new nlobjSearchFilter('custbody_agreement', null, 'anyof', agreement));

        var runSearch = loadedSearch.runSearch()
        var searchid = 0;
        var s = [];
        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice.length >= 1000);

        if (s.length > 0) {
            for (var i = 0; i < s.length; i++) {
                if (!isNullOrEmpty(s[i].getValue("internalid", null, "GROUP"))) {
                    nlapiSubmitField('itemfulfillment', s[i].getValue("internalid", null, "GROUP"), 'custbody_related_billing_instruction', BillingIns_id);
                }
            }
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error getAgreementsTrans ', e);
    }
}
function billing_type(billing_type, sugg_monthly_charge, rate) {
    if (!isNullOrEmpty(billing_type)) { return billing_type }
    else if (sugg_monthly_charge == rate) { return '1' }
    else return '3';
}
//DS FF Screen Search FR

function Billing_Instruction_Update_Final(data) {
    try {
        var billing_instruction = [];
        nlapiLogExecution('DEBUG', 'Billing_Instruction_Update_Final: ' + data.length, JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {
            try {
                Context(context)
                var rec = nlapiLoadRecord('customsale_billing_instruction', data[i].id);
                rec.setFieldValue('custbody_finance_approver', user);           
                nlapiSubmitRecord(rec);
                billing_instruction.push({
                    id: data[i].id,
                    tranid: nlapiLookupField('customsale_billing_instruction', data[i].id, 'tranid')
                });
            } catch (e) { }
        }
        resUpdate = 'success';
        return billing_instruction;
    } catch (e) {
        nlapiLogExecution('DEBUG', 'Billing_Instruction_Update error: ', e);
        resUpdate = e;
        return billing_instruction;
    }
}
function Billing_Instruction_Update_Resaon(data) {
    try {
        var billing_instruction = [];
        nlapiLogExecution('DEBUG', 'Billing_Instruction_Update_Resaon: ' + data.length, JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {
            try {
                Context(context)
                var rec = nlapiLoadRecord('customsale_billing_instruction', data[i].id);
                rec.setFieldValue('custbody_reject_reason_fr', data[i].reason);
                rec.setFieldValue('custbody_finance_approver', '');            
                nlapiSubmitRecord(rec);
                billing_instruction.push({
                    id: data[i].id,
                    tranid: nlapiLookupField('customsale_billing_instruction', data[i].id, 'tranid')
                });
            } catch (e) { }
        }
        resUpdate = 'success';
        return billing_instruction;
    } catch (e) {
        nlapiLogExecution('DEBUG', 'Billing_Instruction_Update_Resaon error: ', e);
        resUpdate = e;
        return billing_instruction;
    }
}

function summaryEmail() {
    nlapiLogExecution('DEBUG', 'inside send mail', '');
    try {
        var date = new Date();
        var subject = "מסך חיוב לקוחות מסלול";
        var body = '<html dir="rtl" style="direction:rtl;">' +
            '<head>' +
            '<style>' +
            'table, th, td {' +
            'border: 2px solid black;' +
            'border-collapse: collapse;' +
            '}' +
            'td {' +
            'padding: 5px;' +
            'text-align: right;' +
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
            "<p style='color:black; font-size:100%;'> מסך חיוב לקוחות מסלול הסתיים בהצלחה </p><br> ";
        body += "<p style='color:black; font-size:140%;'>" + numOfLines + ': סה"כ שורות שנשלחו </p> ';



        if (createData != null && createData != '') {
            var createTBL = '<p style= \'font-weight: bold ;color: black; font-size:140%; \'>' + createData.length + ': סה"כ הוראות החיוב שנוצרו</p><br>';
            createTBL += "<table style = \"width: 100 %;\" >";
            // for th
            createTBL += "<tr><th>הוראת חיוב </th></tr>";
            for (var v in createData) {
                createTBL += "<tr><td>" + createData[v].tranid + "</td>";
                createTBL += "</tr>";
            }
            createTBL += "</table>"
        }
        else { var createTBL = ''; }


        if (updateData != null && updateData != '') {
            var updateTBL = '<p style= \'font-weight: bold ;color: black; font-size:140%; \'>' + updateData.length + ': סה"כ הוראות חיוב שעודכנו</p><br>';
            updateTBL += "<table style = \"width: 100 %;\" >";
            // for th
            updateTBL += "<tr><th>הוראת חיוב </th></tr>";
            for (var s in updateData) {
                updateTBL += "<tr><td>" + updateData[s].tranid + "</td>";
            }
            updateTBL += "</table>"
        }
        else { var updateTBL = ''; }


        if (rejectData != null && rejectData != '') {
            var rejectTBL = '<p style= \'font-weight: bold ;color: black; font-size:140%; \'>:' + rejectData.length + '  סה"כ הוראות החיוב שנדחו</p><br>';
            rejectTBL += "<table style = \"width: 100 %;\" >";
            // for th
            updateTBL += "<tr><th>הוראת חיוב </th></tr>";
            for (var s in rejectData) {
                rejectTBL += "<tr><td>" + rejectData[s].tranid + "</td>";
            }
            rejectTBL += "</table>"
        }
        else { var rejectTBL = ''; }

        var list = createTBL + '<br>' + updateTBL + '<br>' + rejectTBL;
        body += list;
        body += '<br></html>';
        var attachRec = new Object();
        attachRec['employee'] = user;
        nlapiSendEmail(user, user, subject, body, null, null, attachRec, null, false);
        nlapiLogExecution('debug', 'after email', 'email has been sent');
    } catch (e) {
        nlapiLogExecution('error', 'email()', e);
    }
}
function Context(context) {

    //nlapiLogExecution('DEBUG', 'context.getRemainingUsage()', context.getRemainingUsage());
    if (context.getRemainingUsage() < 1250) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        //nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }

}

function DoCreate(entity, fromdate, enddate) {
 
    var transactionSearch = nlapiSearchRecord("transaction", null,
        [
            ["type", "anyof", "CuTrSale100"],
            "AND",
            ["trandate", "onorafter", fromdate],
            "AND",
            ["trandate", "onorbefore", enddate],
            "AND",
            ["mainline", "is", "T"],
             "AND",
            ["entity", "is", entity]
        ],
        [     
        ]
    );
    if (transactionSearch != null && transactionSearch.length > 0) {  return false }
    return true;


}
function setResDate(logid) {
    var fields = [];
    fields[0] = 'custrecord_log_finish_date'
    fields[1] = 'custrecord_log_processed_finished'
    var dataField = [];
    dataField[0] = nlapiDateToString(new Date())
    dataField[1] = 'T'
    nlapiSubmitField('customrecord_customer_agreement_log', logid, fields, dataField)
}

