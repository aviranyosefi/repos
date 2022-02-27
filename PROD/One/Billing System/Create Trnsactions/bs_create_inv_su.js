function CreateTran(request, response) {  
    if (request.getParameter('custpage_page') == '1' ) {
        var type = request.getParameter('custpage_type');  
        var fromdate = request.getParameter('custpage_select_fromdate');  
        var todate = request.getParameter('custpage_select_todate');  
        var agr = request.getParameter('custpage_agr');  
        var ib = request.getParameter('custpage_ib');  
        var employee = request.getParameter('custpage_employee');
        var customer = request.getParameter('custpage_customer');
        var invoice_date = request.getParameter('custpage_invoice_date');

        var today = new Date();
        var todayStr = nlapiDateToString(today);
        var form = nlapiCreateForm('');

        var data = [];
        data.push({
            fromdate: fromdate,
            todate: todate,
            agr: agr,
            ib: ib,
            employee: employee,
            customer: customer,
            type: type,
            invoice_date: invoice_date
        })
        data = JSON.stringify(data);
        nlapiLogExecution('debug', 'data: ', data)
        try {          
            var params = {
                custscript_manage_inv_log: data,
            };
            nlapiScheduleScript('customscript_bs_create_inv_ss', null, params);
            var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
            htmlHeader.setDefaultValue("<p style='font-size:20px'>The Invoice transactions are currently being created.</p><br><br>Please click <a href='https://system.eu1.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&datefrom=" + todayStr + "&dateto=" + todayStr + "&scripttype=" + getScriptID('customscript_bs_create_inv_ss') + "&primarykey=539' target='_blank' >here</a> in order to be redirected to the status page.");
        }
        catch (e) {
            nlapiLogExecution('ERROR', 'ERROR: ', e)
        }     
        response.writePage(form)
    }
    else {
        var form = nlapiCreateForm('Manage Invoice');
        form.addSubmitButton('Refresh');
      
        form.addFieldGroup('custpage_batch_group', 'Select Details');

        var type = form.addField('custpage_type', 'select', 'Type', 'customlist_agreement_type', 'custpage_batch_group').setLayoutType('midrow');
        var type_data = request.getParameter('custpage_type');
        type.setDefaultValue(type_data)
        type.setMandatory(true);
        
        var selectFromDate = form.addField('custpage_select_fromdate', 'date', 'From Date', null, 'custpage_batch_group').setLayoutType('midrow');
        var from_date_data = request.getParameter('custpage_select_fromdate')
        selectFromDate.setDefaultValue(from_date_data)
        var selectToDate = form.addField('custpage_select_todate', 'date', 'To Date', null, 'custpage_batch_group').setLayoutType('midrow');
        var to_date_data = request.getParameter('custpage_select_todate');
        selectToDate.setDefaultValue(to_date_data)
        selectToDate.setMandatory(true);

        var selectInvoiceDate = form.addField('custpage_invoice_date', 'date', 'Invoice Date', null, 'custpage_batch_group').setLayoutType('midrow');
        var invoice_date_data = request.getParameter('custpage_invoice_date');
        if (isNullOrEmpty(invoice_date_data)) invoice_date_data=new Date()
        selectInvoiceDate.setDefaultValue(invoice_date_data)
        selectInvoiceDate.setMandatory(true);

        var agr = form.addField('custpage_agr', 'select', 'Agreement', 'customrecord_agr', 'custpage_batch_group').setLayoutType('outside');
        var agr_data = request.getParameter('custpage_agr');
        agr.setDefaultValue(agr_data);        

        var ib = form.addField('custpage_ib', 'select', 'Install Base', 'customrecord_ib', 'custpage_batch_group').setLayoutType('outside');
        var ib_data = request.getParameter('custpage_ib');
        ib.setDefaultValue(ib_data)
   
        var employee = form.addField('custpage_employee', 'select', 'employee', 'employee', 'custpage_batch_group').setLayoutType('outside');
        var employee_line_data = request.getParameter('custpage_employee');
        employee.setDefaultValue(employee_line_data)

        var customer = form.addField('custpage_customer', 'select', 'customer', 'customer', 'custpage_batch_group').setLayoutType('outside');
        var customer_data = request.getParameter('custpage_customer');
        customer.setDefaultValue(customer_data)

        form.addField('custpage_page', 'text', 'Next Page', null, null).setDisplayType('hidden');
        form.setScript('customscript_bs_create_inv_cs');

        if (!isNullOrEmpty(type_data)) {
            var results = getBP(type_data, from_date_data, to_date_data, agr_data, ib_data, employee_line_data, customer_data)
            if (results.length > 0) {
                form.addButton('customscript_continue', 'Continue', 'Continue()');
                form.addButton('customscript_export', 'Export', 'fnExcelReport()');
                form.addFieldGroup('custpage_timesheet_group', 'List');
                var subList = form.addSubList('custpage_res_sublist', 'list', 'number of results: ' + results.length, 'custpage_timesheet_group');
                //subList.addMarkAllButtons()
                subList.addField('custpage_agr', 'text', 'Agreement');
                subList.addField('custpage_amount', 'text', 'Amount');
                for (var i = 0; i < results.length; i++) {
                    subList.setLineItemValue('custpage_agr', i + 1, results[i].agr);
                    subList.setLineItemValue('custpage_amount', i + 1, results[i].amount);
                }
            }  
        }
                        
        response.writePage(form);
    }
}//end of suitlet

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
                customer: s[i].getText("custrecord_bp_customer", null, "GROUP"),
            });
        }
    }
    return agrList;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function GetLink(name, id, type) {
    var link = "<a href='https://system.netsuite.com"+ nlapiResolveURL('RECORD', type,id) + "'" + ' target="_blank">' + name + "</a>";
    return link;
    //"https://system.netsuite.com" + nlapiResolveURL('RECORD', 'customrecord_billing_plan', s[i].id)
}
function getScriptID(scriptID) {
    var scriptSearch = nlapiSearchRecord("script", null,
        [
            ["scriptid", "is", scriptID]
        ],
        [
            new nlobjSearchColumn("scriptid")
        ]
    );
    return scriptSearch[0].id
}

