function ActionScreen(request, response) {
    if (request.getParameter('custpage_page') == '1') {

        var action = request.getParameter('custpage_action');
        var percent = request.getParameter('custpage_percent');
        if (action == 1 || action == 2 || action == 6) {     
            var fromdate = request.getParameter('custpage_select_fromdate');
            var todate = request.getParameter('custpage_select_todate');
            var agr = request.getParameter('custpage_agr')
            var employee = request.getParameter('custpage_employee');
            var customer = request.getParameter('custpage_customer');
            var type = request.getParameter('custpage_type');
            var line_bus = request.getParameter('custpage_business_line');
            var data = [];
            data.push({
                fromdate: fromdate,
                todate: todate,
                agr: agr,
                employee: employee,
                customer: customer,
                type: type,
                percent: parseFloat(percent),
                line_bus: line_bus
            })
        }
        else {
            var lineCount = request.getLineItemCount('custpage_res_sublist');
            var data = [];
            for (var i = 0; i < lineCount; i++) {
                selected = request.getLineItemValue('custpage_res_sublist', 'custpage_process', i + 1);
                if (selected == 'T') {
                    update = request.getLineItemValue('custpage_res_sublist', 'custpage_update', i + 1)
                    if ((update == 'T' || action == '4' || action == '6') && !isNullOrEmpty(percent)) { var percentToUpdate = parseFloat(percent) }
                    else { var percentToUpdate = '' }
                    data.push({
                        agr: request.getLineItemValue('custpage_res_sublist', 'custpage_agreement_id', i + 1),
                        date: request.getLineItemValue('custpage_res_sublist', 'custpage_renewal_date', i + 1),
                        percent: percentToUpdate,
                        newDate: request.getParameter('custpage_new_fromdate'),
                        newToDate: request.getParameter('custpage_new_todate'),
                        agr_line: request.getLineItemValue('custpage_res_sublist', 'custpage_agr_line_id', i + 1),
                        last_bp: request.getLineItemValue('custpage_res_sublist', 'custpage_last_billing_plan', i + 1),
                    });
                }
            }  
        }             
        var today = new Date();
        var todayStr = nlapiDateToString(today);
        var form = nlapiCreateForm('Number Of lines Checked: ' + data.length);
        nlapiLogExecution('debug', 'data: ' + data.length, JSON.stringify(data))
        nlapiLogExecution('debug', 'action: ', action)

        var params = {
            custscript_action: action,
            custscript_data_agr: JSON.stringify(data),    
        };
        nlapiScheduleScript('customscript_bs_action_screen_ss', null, params);
        var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
        htmlHeader.setDefaultValue("<p style='font-size:20px'>The Invoice transactions are currently being created.</p><br><br>Please click <a href='https://system.eu1.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&datefrom=" + todayStr + "&dateto=" + todayStr + "&scripttype=408&primarykey=408' target='_blank' >here</a> in order to be redirected to the status page.");

        response.writePage(form)
    }
    else {
        var form = nlapiCreateForm('Action Screen');
        form.addSubmitButton('Refresh');
        form.setScript('customscript_bs_action_screen_cs');
        form.addFieldGroup('custpage_batch_group', 'Select Details');

        var selectFromDate = form.addField('custpage_select_fromdate', 'date', 'From Date', null, 'custpage_batch_group').setLayoutType('midrow');
        var from_date_data = request.getParameter('custpage_select_fromdate')
        //selectFromDate.setMandatory(true);
        selectFromDate.setDefaultValue(from_date_data)
        var selectToDate = form.addField('custpage_select_todate', 'date', 'To Date', null, 'custpage_batch_group').setLayoutType('midrow');
        var to_date_data = request.getParameter('custpage_select_todate');
        selectToDate.setDefaultValue(to_date_data)
        //selectToDate.setMandatory(true);

        var agr = form.addField('custpage_agr', 'select', 'Agreement', 'customrecord_agreement', 'custpage_batch_group').setLayoutType('outside');
        var agr_data = request.getParameter('custpage_agr');
        agr.setDefaultValue(agr_data);

        var employee = form.addField('custpage_employee', 'select', 'Employee', 'employee', 'custpage_batch_group').setLayoutType('outside');
        var employee_data = request.getParameter('custpage_employee');
        employee.setDefaultValue(employee_data)

        var customer = form.addField('custpage_customer', 'select', 'customer', 'customer', 'custpage_batch_group').setLayoutType('outside');
        var customer_data = request.getParameter('custpage_customer');
        customer.setDefaultValue(customer_data)

        var type = form.addField('custpage_type', 'select', 'Type', 'customlist_agr_type', 'custpage_batch_group').setLayoutType('outside');
        var type_data = request.getParameter('custpage_type');
        type.setDefaultValue(type_data)
        type.setMandatory(true);

        var precent = form.addField('custpage_percent', 'PERCENT', 'Percent', null, 'custpage_batch_group').setLayoutType('outside');
        var precent_data = request.getParameter('custpage_percent');
        precent.setDefaultValue(precent_data)

        var action = form.addField('custpage_action', 'select', 'Action', 'customlist_billing_screen_action', 'custpage_batch_group').setLayoutType('outside');
        var action_data = request.getParameter('custpage_action');
        action.setDefaultValue(action_data)
        action.setMandatory(true);

        var NewFromDate = form.addField('custpage_new_fromdate', 'date', 'New Date', null, 'custpage_batch_group').setLayoutType('startrow');
        var new_from_date_data = request.getParameter('custpage_new_fromdate')
        NewFromDate.setDefaultValue(new_from_date_data);
        //NewFromDate.setDisplayType('hidden');
        var NewToDate = form.addField('custpage_new_todate', 'date', 'New To Date', null, 'custpage_batch_group').setLayoutType('midrow');
        var new_to_date_data = request.getParameter('custpage_new_todate');
        NewToDate.setDefaultValue(new_to_date_data)
        //NewToDate.setDisplayType('hidden');

        var business_line = form.addField('custpage_business_line', 'select', 'Business Line', 'classification', 'custpage_batch_group').setLayoutType('midrow');
        var business_line_data = request.getParameter('custpage_business_line');
        business_line.setDefaultValue(business_line_data);
        //business_line.setDisplayType('hidden');

        form.addField('custpage_page', 'text', 'Next Page', null, null).setDisplayType('hidden');

        form.addButton('customscript_exclude', 'EXCLUDE FROM ACTION SCREEN', 'EXCLUDE()');

        form.addButton('customscript_continue', 'Continue', 'Continue()');
              
        var results = [];
        if (!isNullOrEmpty(type_data) && action_data ==3) { // איחוד הסכמים
            results = getAgreement(from_date_data, to_date_data, agr_data, type_data, employee_data, action_data, customer_data);
            if (results.length > 0) {
                //form.addButton('customscript_marlk_all', 'Continue', 'Continue()');

                form.addFieldGroup('custpage_timesheet_group', 'List');
                var subList = form.addSubList('custpage_res_sublist', 'list', 'number of results: ' + results.length, 'custpage_timesheet_group');
                subList.addMarkAllButtons()
                subList.addField('custpage_process', 'checkbox', 'Choose')
                subList.addField('custpage_update', 'checkbox', 'Update')
                subList.addField('custpage_agreement', 'text', 'Agreement')
                subList.addField('custpage_agreement_id', 'text', 'Agreement').setDisplayType('hidden');
                subList.addField('custpage_customer', 'text', 'CUSTOMER');
                subList.addField('custpage_customer_id', 'text', 'CUSTOMER').setDisplayType('hidden');
                subList.addField('custpage_amount', 'text', 'amount');
                subList.addField('custpage_renewal_date', 'text', 'RENEWAL DATE');
                for (var i = 0; i < results.length; i++) {
                    subList.setLineItemValue('custpage_agreement', i + 1, results[i].agr);
                    subList.setLineItemValue('custpage_agreement_id', i + 1, results[i].agr_id);
                    subList.setLineItemValue('custpage_customer', i + 1, results[i].customer);
                    subList.setLineItemValue('custpage_customer_id', i + 1, results[i].customer_id);
                    subList.setLineItemValue('custpage_amount', i + 1, results[i].amount);
                    subList.setLineItemValue('custpage_renewal_date', i + 1, results[i].renewal_date);
                }
            }
        }
        else if (!isNullOrEmpty(type_data) && action_data == 4) { // הנחה תקפותית
            results = getAgreementLines(agr_data, type_data, employee_data, action_data, customer_data, '');
            if (results.length > 0) {
                //form.addButton('customscript_marlk_all', 'Continue', 'Continue()');

                form.addFieldGroup('custpage_timesheet_group', 'List');
                var subList = form.addSubList('custpage_res_sublist', 'list', 'number of results: ' + results.length, 'custpage_timesheet_group');
                subList.addMarkAllButtons()
                subList.addField('custpage_process', 'checkbox', 'Choose')
                subList.addField('custpage_agr_line_id', 'text', 'Agreement Line').setDisplayType('hidden');
                subList.addField('custpage_agr_line', 'text', 'Agreement Line');
                subList.addField('custpage_item', 'text', 'item');
                subList.addField('custpage_customer', 'text', 'CUSTOMER');
                subList.addField('custpage_end_customer', 'text', 'END CUSTOMER');
                subList.addField('custpage_agg_line_memo', 'text', 'Memo');
                subList.addField('custpage_cal_mtd', 'text', 'Calc Method');
                subList.addField('custpage_bill_cyc', 'text', 'Billing Cycle');
                subList.addField('custpage_last_billing_plan', 'text', 'Last Billing Plan');
                subList.addField('custpage_amount', 'text', 'amount');
                for (var i = 0; i < results.length; i++) {
                    subList.setLineItemValue('custpage_agr_line_id', i + 1, results[i].agr_line_id);
                    subList.setLineItemValue('custpage_agr_line', i + 1, results[i].agr_line);
                    subList.setLineItemValue('custpage_item', i + 1, results[i].item);
                    subList.setLineItemValue('custpage_customer', i + 1, results[i].customer);
                    subList.setLineItemValue('custpage_end_customer', i + 1, results[i].end_customer);
                    subList.setLineItemValue('custpage_end_customer_id', i + 1, results[i].end_customer_id);
                    subList.setLineItemValue('custpage_amount', i + 1, results[i].amount);
                    subList.setLineItemValue('custpage_agg_line_memo', i + 1, results[i].memo);
                    subList.setLineItemValue('custpage_cal_mtd', i + 1, results[i].calc_method);
                    subList.setLineItemValue('custpage_bill_cyc', i + 1, results[i].billing_cycle);
                    subList.setLineItemValue('custpage_last_billing_plan', i + 1, results[i].LastBillingPlan);
                }
            }
        }
        else if (!isNullOrEmpty(type_data) && action_data == 5) { // הסרת שורות
            results = getAgreementLines(agr_data, type_data, employee_data, action_data, customer_data);
            if (results.length > 0) {              
                //form.addButton('customscript_marlk_all', 'Continue', 'Continue()');

                form.addFieldGroup('custpage_timesheet_group', 'List');
                var subList = form.addSubList('custpage_res_sublist', 'list', 'number of results: ' + results.length, 'custpage_timesheet_group');
                subList.addMarkAllButtons()
                subList.addField('custpage_process', 'checkbox', 'Choose')
                subList.addField('custpage_agr_line_id', 'text', 'Agreement Line').setDisplayType('hidden');
                subList.addField('custpage_agr_line', 'text', 'Agreement Line');
                subList.addField('custpage_item', 'text', 'item');
                subList.addField('custpage_customer', 'text', 'CUSTOMER');
                subList.addField('custpage_end_customer', 'text', 'END CUSTOMER');
                subList.addField('custpage_amount', 'text', 'amount');
                for (var i = 0; i < results.length; i++) {
                    subList.setLineItemValue('custpage_agr_line_id', i + 1, results[i].agr_line_id);
                    subList.setLineItemValue('custpage_agr_line', i + 1, results[i].agr_line);
                    subList.setLineItemValue('custpage_item', i + 1, results[i].item);
                    subList.setLineItemValue('custpage_customer', i + 1, results[i].customer);
                    subList.setLineItemValue('custpage_end_customer', i + 1, results[i].end_customer);
                    subList.setLineItemValue('custpage_end_customer_id', i + 1, results[i].end_customer_id);
                    subList.setLineItemValue('custpage_amount', i + 1, results[i].amount);
                }
            }
        }
        
        response.writePage(form);
    }
}//end of suitlet


function getAgreementLines(agr_data, type_data, employee_data, action_data, customer_data, business_line_data) {
    try {
        nlapiLogExecution('debug', ' agr_data', agr_data);
        var filters = new Array();
       
        if (!isNullOrEmpty(agr_data)) { filters.push(new nlobjSearchFilter('internalid', 'custrecord_agr_line_agreement', 'anyof', agr_data)) }
        if (!isNullOrEmpty(type_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_type', 'custrecord_agr_line_agreement', 'anyof', type_data)) }
        if (!isNullOrEmpty(employee_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_handled_by', 'custrecord_agr_line_agreement', 'anyof', employee_data)) }
        filters.push(new nlobjSearchFilter('custrecord_agr_status', 'custrecord_agr_line_agreement', 'noneof', '2'))
        if (!isNullOrEmpty(customer_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_bill_cust', 'custrecord_agr_line_agreement', 'anyof', customer_data)) }
        if (!isNullOrEmpty(business_line_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_line_bus_line', null, 'anyof', business_line_data)) }

        var cols = new Array();
        cols.push(new nlobjSearchColumn('name'));
        cols.push(new nlobjSearchColumn('custrecord_agr_line_end_cust'));
        cols.push(new nlobjSearchColumn('custrecord_billing_customer'));
        cols.push(new nlobjSearchColumn('custrecord_agr_line_amount'));
        cols.push(new nlobjSearchColumn('displayname', 'custrecord_agr_line_item'));
        cols.push(new nlobjSearchColumn('custrecord_agg_line_memo'));
        cols.push(new nlobjSearchColumn('custrecord_agr_line_cal_mtd'));
        cols.push(new nlobjSearchColumn('custrecord_agr_line_bill_cyc'));
        cols.push(new nlobjSearchColumn('custrecord_agr_line_last_billing_plan'));

        var search = nlapiCreateSearch('customrecord_agr_line', filters, cols);
        var runSearch = search.runSearch();

        var s = [];
        var searchid = 0;
        var results = [];
        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        if (s != null) {
            for (var i = 0; i < s.length; i++) {
                var id = s[i].id
                rec = nlapiLoadRecord('customrecord_agr_line', id)
                results.push({
                    agr_line_id: id,
                    agr_line: GetLink(s[i].getValue('name'), id, 'customrecord_agr_line'),
                    customer: GetLink(s[i].getText('custrecord_billing_customer'), s[i].getValue('custrecord_billing_customer'), 'customer'),
                    customer_id: s[i].getValue('custrecord_billing_customer'),
                    end_customer: GetLink(s[i].getText('custrecord_agr_line_end_cust'), s[i].getValue('custrecord_agr_line_end_cust'), 'customer'),
                    end_customer_id: s[i].getValue('custrecord_agr_line_end_cust'),
                    amount: s[i].getValue('custrecord_agr_line_amount'),
                    item: s[i].getValue('displayname', 'custrecord_agr_line_item'),
                    memo: s[i].getValue('custrecord_agg_line_memo'),
                    calc_method: s[i].getText('custrecord_agr_line_cal_mtd'),
                    billing_cycle: s[i].getText('custrecord_agr_line_bill_cyc'),
                    LastBillingPlan: s[i].getValue('custrecord_agr_line_last_billing_plan'),
                });
            }
        }
        return results;
    } catch (e) {
        nlapiLogExecution('ERROR', 'error serachAgreement', e);
        return results;
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function GetLink(name, id, type) {
    var link = "<a href='https://system.netsuite.com" + nlapiResolveURL('RECORD', type, id) + "'" + ' target="_blank">' + name + "</a>";
    return link;   
}
function getAgreement(from_date_data, to_date_data, agr_data, type_data, employee_data, action_data, customer_data) {
    try {
        var filters = new Array();
        if (!isNullOrEmpty(from_date_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_renew_date', null, 'onorafter', from_date_data)) }
        if (!isNullOrEmpty(to_date_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_renew_date', null, 'onorbefore', to_date_data)) }
        if (!isNullOrEmpty(agr_data)) { filters.push(new nlobjSearchFilter('internalid', null, 'anyof', agr_data)) }
        if (!isNullOrEmpty(type_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_type', null, 'anyof', type_data)) }
        if (!isNullOrEmpty(employee_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_handled_by', null, 'anyof', employee_data)) }
        filters.push(new nlobjSearchFilter('custrecord_agr_status', null, 'noneof', '2'))
        if (action_data == '1' || action_data == '2') {
            filters.push(new nlobjSearchFilter('custrecord_agr_renew_type', null, 'anyof', action_data))
        }
        if (!isNullOrEmpty(customer_data)) { filters.push(new nlobjSearchFilter('custrecord_agr_bill_cust', null, 'anyof', customer_data)) }
       
        var cols = new Array();
        cols.push(new nlobjSearchColumn('name'));
        cols.push(new nlobjSearchColumn('custrecord_agr_bill_cust'));
        cols.push(new nlobjSearchColumn('custrecord_agr_sum'));
        cols.push(new nlobjSearchColumn('custrecord_agr_renew_date'));

        var search = nlapiCreateSearch('customrecord_agreement', filters, cols);
        var runSearch = search.runSearch();

        var s = [];
        var searchid = 0;
        var results = [];
        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        if (s != null) {
            for (var i = 0; i < s.length; i++) {
                var id = s[i].id
                rec = nlapiLoadRecord('customrecord_agreement', id)
                results.push({
                    agr_id: id,
                    agr: GetLink(s[i].getValue('name'), id, 'customrecord_agreement'),
                    customer: GetLink(s[i].getText('custrecord_agr_bill_cust'), s[i].getValue('custrecord_agr_bill_cust'), 'customer'),
                    customer_id: s[i].getValue('custrecord_agr_bill_cust'),
                    amount: rec.getFieldValue('custrecord_agr_sum'),
                    renewal_date: s[i].getValue('custrecord_agr_renew_date'),
                });
            }
        }
        return results;
    } catch (e) {
        nlapiLogExecution('ERROR', 'error serachAgreement', e);
        return results;
    }

}


