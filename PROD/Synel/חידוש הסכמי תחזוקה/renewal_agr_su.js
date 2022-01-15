function ActionScreen(request, response) {
    if (request.getParameter('custpage_page') == '1') {
        var action = request.getParameter('custpage_action');
        var lineCount = request.getLineItemCount('custpage_res_sublist');
        var data = [];
        var CleanData = [];
        if (action == 1 || action == 3) {
            var custpage_new_fromdate = request.getParameter('custpage_new_fromdate');
            var custpage_months = request.getParameter('custpage_months');
            var custpage_agr_type = request.getParameter('custpage_agr_type');
            var custpage_system_service_level = request.getParameter('custpage_system_service_level');
            var custpage_billing_cycle = request.getParameter('custpage_billing_cycle');
            var custpage_renewal_type = request.getParameter('custpage_renewal_type');
            var custpage_billing_on = request.getParameter('custpage_billing_on');
            var custpage_description = request.getParameter('custpage_description');
            var agr_target = request.getParameter('custpage_agr_target')
            var RedirecAgr = agr_target;
            for (var i = 0; i < lineCount; i++) {
                selected = request.getLineItemValue('custpage_res_sublist', 'custpage_process', i + 1);
                if (selected == 'T') {
                    update = request.getLineItemValue('custpage_res_sublist', 'custpage_update', i + 1)
                    if (update == 'T') { newRate = request.getLineItemValue('custpage_res_sublist', 'custpage_new_amount', i + 1) }
                    else { var newRate = request.getLineItemValue('custpage_res_sublist', 'custpage_rate', i + 1) }
                    data.push({
                        agr: request.getLineItemValue('custpage_res_sublist', 'custpage_agreement_id', i + 1),
                        agr_line: request.getLineItemValue('custpage_res_sublist', 'custpage_agr_line_id', i + 1),
                        custrecord_agr_srt_date: custpage_new_fromdate,
                        custrecord_agr_num_mon: custpage_months,
                        custrecord_maintenance_agreement_type: custpage_agr_type,
                        custrecord_agr_sys_type: custpage_system_service_level,
                        custrecord_agr_bill_cyc: custpage_billing_cycle,
                        custrecord_agr_renew_type: custpage_renewal_type,
                        custrecord_agr_billing_on: custpage_billing_on,
                        custrecord_agr_billing_description: custpage_description,
                        newRate: newRate,
                        targetAgr: agr_target,
                    });
                }
            }
        }
        else {
            var agr_data_2 = request.getParameter('custpage_agr_second');
            var RedirecAgr = agr_data_2;
            for (var i = 0; i < lineCount; i++) {
                selected = request.getLineItemValue('custpage_res_sublist', 'custpage_process', i + 1);
                if (selected == 'T') {
                    data.push({
                        agr_line: request.getLineItemValue('custpage_res_sublist', 'custpage_agr_line_id', i + 1),
                        newRate: request.getLineItemValue('custpage_res_sublist', 'custpage_new_amount', i + 1),
                    });
                }
                else {
                    CleanData.push({
                        agr_line: request.getLineItemValue('custpage_res_sublist', 'custpage_agr_line_id', i + 1),
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
            custscript_renewal_action: action,
            custscript_renewal_data: JSON.stringify(data),
            custscript_renewal_clean_data: JSON.stringify(CleanData),
        };
        nlapiScheduleScript('customscript_renewal_agr_ss', null, params);
        if (action == 3 || action == 2) {
            nlapiSetRedirectURL('record', 'customrecord_agreement', RedirecAgr, 'view', null);
        }
        else {
            var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
            htmlHeader.setDefaultValue("<p style='font-size:20px'>The Invoice transactions are currently being created.</p><br><br>Please click <a href='https://system.eu1.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&datefrom=" + todayStr + "&dateto=" + todayStr + "&scripttype=539&primarykey=539' target='_blank' >here</a> in order to be redirected to the status page.");

        }
        
        response.writePage(form)
    }
    else {
        var idd = request.getParameter('Recid');
        var actionType = request.getParameter('action');
        nlapiLogExecution('debug', ' idd: idd', 'actionType' + actionType )
        if (!isNullOrEmpty(idd)) {
            var customerAgr = nlapiLookupField('customrecord_agreement', idd, 'custrecord_agr_bill_cust')
            var agreementVal = request.getParameter('from');
        }
        var form = nlapiCreateForm('Action Screen');
        form.addSubmitButton('Refresh');
        form.setScript('customscript_renewal_agr_cs');
        form.addFieldGroup('custpage_batch_group', 'Select Details');

        var customer = form.addField('custpage_customer', 'select', 'customer', 'customer', 'custpage_batch_group').setLayoutType('midrow');
        var customer_data = request.getParameter('custpage_customer');
        if (!isNullOrEmpty(idd)) {
            customer_data = customerAgr;
        }
        customer.setDefaultValue(customer_data)
        customer.setMandatory(true);

        var action = form.addField('custpage_action', 'select', 'Action', 'customlist_renewal_agr', 'custpage_batch_group').setLayoutType('midrow');
        var action_data = request.getParameter('custpage_action');
        if (!isNullOrEmpty(actionType)) { action_data = actionType}
        action.setDefaultValue(action_data)
        action.setMandatory(true);

        var item = form.addField('custpage_item', 'select', 'ITEM', 'item', 'custpage_batch_group').setLayoutType('midrow');
        var item_data = request.getParameter('custpage_item');
        item.setDefaultValue(item_data)
 

        var site = form.addField('custpage_site', 'select', 'SITE', 'customrecord_site', 'custpage_batch_group').setLayoutType('midrow');
        var site_data = request.getParameter('custpage_site');
        site.setDefaultValue(site_data)

        var agr = form.addField('custpage_agr', 'multiselect', 'Agreement 1', null, 'custpage_batch_group').setLayoutType('outside');
        var agr_data = request.getParameter('custpage_agr');
        if (!isNullOrEmpty(agreementVal)) { agr_data = agreementVal}
        if (!isNullOrEmpty(customer_data))
            setAgr( customer_data, action_data, agr);
        agr.setDefaultValue(agr_data);

        var agr_2 = form.addField('custpage_agr_second', 'select', 'Agreement 2', null, 'custpage_batch_group').setLayoutType('outside');
        var agr_data_2 = request.getParameter('custpage_agr_second');
        if (actionType == 2) {
            agr_data_2 = idd
        }
        if (!isNullOrEmpty(customer_data))
            setAgr(customer_data, action_data, agr_2);
        agr_2.setDefaultValue(agr_data_2);
  
        var agr_3 = form.addField('custpage_agr_target', 'select', 'Target Agreement', null, 'custpage_batch_group').setLayoutType('outside');
        var agr_data_3 = request.getParameter('custpage_agr_target');
        if (!isNullOrEmpty(idd)) {
            agr_data_3 = idd;
        }
        if (!isNullOrEmpty(customer_data))
            setAgr(customer_data, 2, agr_3); 
        agr_3.setDefaultValue(agr_data_3);

        if (action_data == 2) { agr_data = agr_data_2 }

        var employee = form.addField('custpage_employee', 'select', 'Employee', 'employee', 'custpage_batch_group').setLayoutType('outside');
        var employee_data = request.getParameter('custpage_employee');
        employee.setDefaultValue(employee_data)

        var precent = form.addField('custpage_percent', 'FLOAT', 'Percent', null, 'custpage_batch_group').setLayoutType('outside');
        var precent_data = request.getParameter('custpage_percent');
        precent.setDefaultValue(precent_data)
    
        form.addField('custpage_page', 'text', 'Next Page', null, null).setDisplayType('hidden');
          
        var results = [];      
        if (action_data == 1) {
            results = getAgreementLines(action_data, agr_data, employee_data, customer_data, item_data,site_data  , parseFloat(precent_data));
            if (results.length > 0) {
                AddParms(form, request, action_data);
                form.addButton('customscript_continue', 'Continue', 'Continue()'); 
                form.addButton('customscript_export', 'Export', 'fnExcelReport()');                
                form.addFieldGroup('custpage_timesheet_group', 'List');
                var subList = form.addSubList('custpage_res_sublist', 'list', 'number of results: ' + results.length, 'custpage_timesheet_group');
                subList.addMarkAllButtons()
                subList.addField('custpage_process', 'checkbox', 'Choose')
                subList.addField('custpage_update', 'checkbox', 'Update AMOUNT').setDisplayType('hidden');            
                subList.addField('custpage_agreement', 'text', 'Agreement')      
                subList.addField('custpage_agr_line', 'text', 'AGREEMENT LINE');     
                subList.addField('custpage_rate', 'CURRENCY', 'RATE');
                subList.addField('custpage_new_amount', 'CURRENCY', 'renewal amount').setDisplayType('entry');
                subList.addField('custpage_item', 'text', 'item');
                subList.addField('custpage_item_desc', 'text', 'ITEM DESCRIPTION');
                subList.addField('custpage_site', 'text', 'SITE');
                subList.addField('custpage_location', 'text', 'LOCATION');
                subList.addField('custpage_serial', 'text', 'SERIAL'); 
                subList.addField('custpage_war_end_date', 'text', 'WARRANTY END DATE');
                subList.addField('custpage_agr_start_date', 'text', 'AGREEMENT START DATE');
                subList.addField('custpage_agr_end_date', 'text', 'AGREEMENT END DATE');
                subList.addField('custpage_datecreated', 'text', 'date created');
                subList.addField('custpage_agreement_id', 'text', 'Agreement').setDisplayType('hidden');
                subList.addField('custpage_agr_line_id', 'text', 'AGREEMENT LINE').setDisplayType('hidden');
                
                for (var i = 0; i < results.length; i++) {
                    subList.setLineItemValue('custpage_process', i + 1, 'T');
                    subList.setLineItemValue('custpage_update', i + 1, 'T');
                    subList.setLineItemValue('custpage_agreement', i + 1, results[i].agr);
                    subList.setLineItemValue('custpage_agreement_id', i + 1, results[i].agr_id);
                    subList.setLineItemValue('custpage_agr_line', i + 1, results[i].agr_line);
                    subList.setLineItemValue('custpage_agr_line_id', i + 1, results[i].agr_line_id);
                    subList.setLineItemValue('custpage_rate', i + 1, results[i].rate);
                    subList.setLineItemValue('custpage_new_amount', i + 1, results[i].renewal_amount);
                    subList.setLineItemValue('custpage_site', i + 1, results[i].site);
                   // subList.setLineItemValue('custpage_location', i + 1, results[i].location);
                    subList.setLineItemValue('custpage_serial', i + 1, results[i].serial);
                    subList.setLineItemValue('custpage_datecreated', i + 1, results[i].datecreated);
                    subList.setLineItemValue('custpage_item', i + 1, results[i].item);
                    subList.setLineItemValue('custpage_item_desc', i + 1, results[i].line_desc);
                    subList.setLineItemValue('custpage_war_end_date', i + 1, results[i].war_end_date);
                    subList.setLineItemValue('custpage_agr_start_date', i + 1, results[i].agr_start_date);
                    subList.setLineItemValue('custpage_agr_end_date', i + 1, results[i].agr_end_date);
                }
            }
        }
        else if (action_data == 2 ) {
            results = getAgreementLines(action_data, agr_data, employee_data, customer_data, item_data, site_data, parseFloat(precent_data) );
            if (results.length > 0) {     
                AddParms(form, request, action_data);
                form.addButton('customscript_continue', 'Continue', 'Continue()');
                //form.addButton('customscript_export', 'Export', 'fnExcelReport()');
                form.addFieldGroup('custpage_timesheet_group', 'List');
                var subList = form.addSubList('custpage_res_sublist', 'list', 'number of results: ' + results.length, 'custpage_timesheet_group');
                subList.addMarkAllButtons()
                subList.addField('custpage_process', 'checkbox', 'Choose')
                //subList.addField('custpage_update', 'checkbox', 'Update')
                //subList.addField('custpage_agreement', 'text', 'Agreement')  
                //subList.addField('custpage_agr_line', 'text', 'AGREEMENT LINE');
                //subList.addField('custpage_rate', 'CURRENCY', 'RATE');
                //subList.addField('custpage_new_amount', 'CURRENCY', 'renewal amount').setDisplayType('entry');
                //subList.addField('custpage_site', 'text', 'SITE');
                //subList.addField('custpage_item', 'text', 'item');
                //subList.addField('custpage_item_desc', 'text', 'ITEM DESCRIPTION');
                //subList.addField('custpage_location', 'text', 'LOCATION');
                //subList.addField('custpage_serial', 'text', 'SERIAL');  
                //subList.addField('custpage_war_end_date', 'text', 'WARRANTY END DATE');
                //subList.addField('custpage_agr_start_date', 'text', 'AGREEMENT START DATE');
                //subList.addField('custpage_agr_end_date', 'text', 'AGREEMENT END DATE');
                //subList.addField('custpage_datecreated', 'text', 'date created');
                //subList.addField('custpage_agreement_id', 'text', 'Agreement').setDisplayType('hidden');
                //subList.addField('custpage_agr_line_id', 'text', 'AGREEMENT LINE').setDisplayType('hidden');
                subList.addField('custpage_agreement', 'text', 'Agreement')//.setDisplayType('hidden');           
                subList.addField('custpage_agr_line', 'text', 'AGREEMENT LINE').setDisplayType('hidden');
                subList.addField('custpage_item', 'text', 'item');
                subList.addField('custpage_masav', 'text', 'SERIAL NUMBER');
                subList.addField('custpage_item_desc', 'text', 'ITEM DESCRIPTION');
                subList.addField('custpage_print_comment', 'text', 'PRINT COMMENT');
                subList.addField('custpage_rate', 'CURRENCY', 'RATE');
                subList.addField('custpage_new_amount', 'CURRENCY', 'renewal amount').setDisplayType('entry');
                subList.addField('custpage_site', 'text', 'SITE');
                subList.addField('custpage_installment_date', 'text', 'INSTALLMENT DATE');
                subList.addField('custpage_war_end_date', 'text', 'WARRANTY END DATE');
                subList.addField('custpage_agreement_id', 'text', 'Agreement').setDisplayType('hidden');
                subList.addField('custpage_agr_line_id', 'text', 'AGREEMENT LINE').setDisplayType('hidden');
                for (var i = 0; i < results.length; i++) {
                    subList.setLineItemValue('custpage_process', i + 1, 'T');
                    subList.setLineItemValue('custpage_agreement', i + 1, results[i].agr);
                    subList.setLineItemValue('custpage_agreement_id', i + 1, results[i].agr_id);
                    subList.setLineItemValue('custpage_agr_line', i + 1, results[i].agr_line);
                    subList.setLineItemValue('custpage_agr_line_id', i + 1, results[i].agr_line_id);
                    subList.setLineItemValue('custpage_rate', i + 1, results[i].rate);
                    subList.setLineItemValue('custpage_new_amount', i + 1, results[i].renewal_amount);
                    subList.setLineItemValue('custpage_site', i + 1, results[i].site);
                    subList.setLineItemValue('custpage_item', i + 1, results[i].item);
                    subList.setLineItemValue('custpage_item_desc', i + 1, results[i].line_desc);
                    subList.setLineItemValue('custpage_war_end_date', i + 1, results[i].war_end_date);
                    subList.setLineItemValue('custpage_masav', i + 1, results[i].masav);
                    subList.setLineItemValue('custpage_print_comment', i + 1, results[i].print_comment);
                    subList.setLineItemValue('custpage_installment_date', i + 1, results[i].installment_date);
                }
            }
        }
        else if (action_data == 3) {
            //TODO
            // custrecord_agr_discount
            // CALC RENEWAL AFTER DIS
            // RE
            nlapiLogExecution('debug', ' 3 agr_data: ', agr_data)
            results = getAgreementLines(action_data, agr_data, employee_data, customer_data, item_data, site_data, parseFloat(precent_data));
            if (results.length > 0) {
                AddParms(form, request, action_data);
                form.addButton('customscript_continue', 'Continue', 'Continue()');
                form.addButton('customscript_export', 'Export', 'fnExcelReport()');
                form.addFieldGroup('custpage_timesheet_group', 'List');
                var subList = form.addSubList('custpage_res_sublist', 'list', 'number of results: ' + results.length, 'custpage_timesheet_group');
                subList.addMarkAllButtons()
                subList.addField('custpage_process', 'checkbox', 'Choose')
                subList.addField('custpage_update', 'checkbox', 'Update AMOUNT').setDisplayType('hidden');
                subList.addField('custpage_agreement', 'text', 'Agreement')//.setDisplayType('hidden');           
                subList.addField('custpage_agr_line', 'text', 'AGREEMENT LINE').setDisplayType('hidden');
                subList.addField('custpage_item', 'text', 'item');
                subList.addField('custpage_masav', 'text', 'SERIAL NUMBER');
                subList.addField('custpage_item_desc', 'text', 'ITEM DESCRIPTION'); 
                subList.addField('custpage_print_comment', 'text', 'PRINT COMMENT'); 
                subList.addField('custpage_rate', 'CURRENCY', 'RATE');
                subList.addField('custpage_new_amount', 'CURRENCY', 'renewal amount').setDisplayType('entry');   
                subList.addField('custpage_site', 'text', 'SITE');           
                subList.addField('custpage_installment_date', 'text', 'INSTALLMENT DATE');  
                subList.addField('custpage_war_end_date', 'text', 'WARRANTY END DATE');  
                subList.addField('custpage_agreement_id', 'text', 'Agreement').setDisplayType('hidden');
                subList.addField('custpage_agr_line_id', 'text', 'AGREEMENT LINE').setDisplayType('hidden');

                for (var i = 0; i < results.length; i++) {
                    subList.setLineItemValue('custpage_process', i + 1, 'T');
                    subList.setLineItemValue('custpage_update', i + 1, 'T');
                    subList.setLineItemValue('custpage_agreement', i + 1, results[i].agr);
                    subList.setLineItemValue('custpage_agreement_id', i + 1, results[i].agr_id);
                    subList.setLineItemValue('custpage_agr_line', i + 1, results[i].agr_line);
                    subList.setLineItemValue('custpage_agr_line_id', i + 1, results[i].agr_line_id);
                    subList.setLineItemValue('custpage_rate', i + 1, results[i].rate);
                    subList.setLineItemValue('custpage_new_amount', i + 1, results[i].renewal_amount);
                    subList.setLineItemValue('custpage_site', i + 1, results[i].site);
                    subList.setLineItemValue('custpage_item', i + 1, results[i].item);
                    subList.setLineItemValue('custpage_item_desc', i + 1, results[i].line_desc);
                    subList.setLineItemValue('custpage_war_end_date', i + 1, results[i].war_end_date);      
                    subList.setLineItemValue('custpage_masav', i + 1, results[i].masav);
                    subList.setLineItemValue('custpage_print_comment', i + 1, results[i].print_comment);
                    subList.setLineItemValue('custpage_installment_date', i + 1, results[i].installment_date);
                    
                }
            }
        }
        response.writePage(form);
    }
}//end of suitlet

//Renewal Agreement
function getAgreementLines(action_data, agr_data, employee_line_data, customer_data, item_data, site_data, percent) {

    var search = nlapiLoadSearch(null, 'customsearch_renewal_agreement');

    //if (!isNullOrEmpty(from_date_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bill_plan_billing_on_date', null, 'onorafter', from_date_data)) }
    //if (!isNullOrEmpty(to_date_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bill_plan_billing_on_date', null, 'onorbefore', to_date_data)) }  
    if (!isNullOrEmpty(employee_line_data)) { search.addFilter(new nlobjSearchFilter('custrecord_agr_handled_by', 'custrecord_agr_line_agreement', 'anyof', employee_line_data)) }
    if (!isNullOrEmpty(customer_data)) { search.addFilter(new nlobjSearchFilter('custrecord_agr_bill_cust', 'custrecord_agr_line_agreement', 'anyof', customer_data)) }
    if (!isNullOrEmpty(item_data)) { search.addFilter(new nlobjSearchFilter('custrecord_agr_line_item', null, 'anyof', item_data)) }
    if (!isNullOrEmpty(site_data)) { search.addFilter(new nlobjSearchFilter('custrecord_agr_site', null, 'anyof', site_data)) }
    if (action_data == 2) { search.addFilter(new nlobjSearchFilter('custrecord_agr_line_new_agr', null, 'anyof', agr_data)) }
    else {
        if (!isNullOrEmpty(agr_data)) { search.addFilter(new nlobjSearchFilter('custrecord_agr_line_agreement', null, 'anyof', [agr_data])) }
    }

    var columns = new Array();
    columns.push(new nlobjSearchColumn('custrecord_item_location'))
    search.addColumns(columns);

    var agrLineList = [];
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
            if (action_data == 1 || action_data == 3 ) { renewal_amount = NewSum(s[i].getValue('custrecord_agr_line_bsc_rate'), percent) }
            else { renewal_amount = s[i].getValue('custrecord_agr_line_renewal_amount') }
            agrLineList.push({
                agr: s[i].getValue('formulatext'), //GetLink(s[i].getText('custrecord_agr_line_agreement'), s[i].getValue('custrecord_agr_line_agreement'), 'customrecord_agreement'),
                agr_id: s[i].getValue('custrecord_agr_line_agreement'),
                agr_line: GetLink(s[i].getValue('name'), s[i].id, 'customrecord_agr_line'),
                agr_line_id: s[i].id,
                rate: s[i].getValue('custrecord_agr_line_bsc_rate'),               
                site: s[i].getText('custrecord_agr_site'),
                serial: s[i].getText('custrecord_agr_line_serial'),
                renewal_amount: renewal_amount,
                datecreated: s[i].getValue('formuladate'),
                item: s[i].getText('custrecord_agr_line_item'),
                line_desc: s[i].getValue("salesdescription", "CUSTRECORD_AGR_LINE_ITEM", null),
                war_end_date: s[i].getValue('custrecord_agr_line_war_end_date'),
                agr_start_date: s[i].getValue("custrecord_agr_srt_date", "CUSTRECORD_AGR_LINE_AGREEMENT", null), 
                agr_end_date: s[i].getValue("custrecord_agr_end_date", "CUSTRECORD_AGR_LINE_AGREEMENT", null),
                location: s[i].getValue('custrecord_item_location'),
                masav: s[i].getValue('custrecord_agr_line_sn_searchable'),
                print_comment: s[i].getValue("custrecord_agr_line_print_comments"),
                installment_date: s[i].getValue("custrecord_agr_line_installment_date"),
            });
        }                  
    }
    return agrLineList;
}
function NewSum(cuuRate, percent) {
    //nlapiLogExecution('DEBUG', 'percent:' + percent, 'cuuRate' + cuuRate );

    if (!isNullOrEmpty(percent) && !isNullOrEmpty(cuuRate)) {
        cuuRate = Number(cuuRate) + (Number(cuuRate) * Number(percent)) / 100
    }
    else if (isNullOrEmpty(cuuRate)) {
        return 0
    }
    return cuuRate;

}
function GetLink(name, id, type) {
    var link = "<a href='https://system.netsuite.com" + nlapiResolveURL('RECORD', type, id) + "'" + ' target="_blank">' + name + "</a>";
    return link;   
}
function AddParms(form, request  , action) {

    form.addFieldGroup('custpage_new_parameters', 'Select New Parameters');

    if (action == 1) {
        var NewFromDate = form.addField('custpage_new_fromdate', 'date', 'Renewal Date', null, 'custpage_new_parameters').setLayoutType('startrow');
        var new_from_date_data = request.getParameter('custpage_new_fromdate')
        NewFromDate.setDefaultValue(new_from_date_data);
        //NewFromDate.setMandatory(true);
        var months = form.addField('custpage_months', 'INTEGER', 'Number Of Months', null, 'custpage_new_parameters').setLayoutType('midrow');
        var months_data = request.getParameter('custpage_months');
        months.setDefaultValue(months_data)
        //months.setMandatory(true);

        var agr_type = form.addField('custpage_agr_type', 'select', 'Agreement Type', 'customlist_maintenance_agreement_type', 'custpage_new_parameters').setLayoutType('midrow');
        var agr_type_data = request.getParameter('custpage_agr_type');
        agr_type.setDefaultValue(agr_type_data);

        var system_service_level = form.addField('custpage_system_service_level', 'select', 'System Service Level', 'customlist_system_service_level', 'custpage_new_parameters').setLayoutType('midrow');
        var system_service_level_data = request.getParameter('custpage_system_service_level');
        system_service_level.setDefaultValue(system_service_level_data);

        var billing_cycle = form.addField('custpage_billing_cycle', 'select', 'Billing Cycle', 'customrecord_billing_cycle', 'custpage_new_parameters').setLayoutType('midrow');
        var billing_cycle_data = request.getParameter('custpage_billing_cycle');
        billing_cycle.setDefaultValue(billing_cycle_data);
        //billing_cycle.setMandatory(true);

        var renewal_type = form.addField('custpage_renewal_type', 'select', 'Renewal Type', 'customlist_agreement_renewal_type', 'custpage_new_parameters').setLayoutType('midrow');
        renewal_type_data = request.getParameter('custpage_renewal_type');
        renewal_type.setDefaultValue(renewal_type_data);
        //renewal_type.setMandatory(true);

        var billing_on = form.addField('custpage_billing_on', 'select', 'Billing on', 'customlist_billing_on', 'custpage_new_parameters').setLayoutType('midrow');
        billing_on_data = request.getParameter('custpage_billing_on');
        billing_on.setDefaultValue(billing_on_data);
        //billing_on.setMandatory(true);

        var description = form.addField('custpage_description', 'text', 'Charging Description', null, 'custpage_new_parameters').setLayoutType('midrow');
        description_data = request.getParameter('custpage_description');
        description.setDefaultValue(description_data);
        //description.setMandatory(true);

        var renewal_amount = form.addField('custpage_renewal_amount', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
        renewal_amount.setDefaultValue("<p style='font-size:20px'>Renewal Amount:0");

    }
    else {
        var new_amount = form.addField('custpage_new_amount', 'currency', 'New Item Rate', null, 'custpage_new_parameters').setLayoutType('startrow');
        var new_amount_data = request.getParameter('custpage_new_amount')
        new_amount.setDefaultValue(new_amount_data);

        var renewal_amount = form.addField('custpage_renewal_amount', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
        renewal_amount.setDefaultValue("<p style='font-size:20px'>Renewal Amount: 0");

        var renewal_amount = form.addField('custpage_dis', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
        renewal_amount.setDefaultValue("<p style='font-size:20px'>Discount: No target agreement has been selected yet");

    }
 
}
function setAgr(customer_data, action_data, field ) {
    var agrList = customer_agr(customer_data, action_data);
    field.addSelectOption('','', false)
    if (agrList.length > 0) {
        for (var i = 0; i < agrList.length; i++) {
            field.addSelectOption(agrList[i].id, agrList[i].name, false)
        }
    }   
}




