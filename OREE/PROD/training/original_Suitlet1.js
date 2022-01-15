function services_update_screen(request, response) {

    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'stage one', 'stage one');

        var form = nlapiCreateForm('Services Update Screen');
        form.addSubmitButton('Submit');

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');
        form.setScript('customscript_services_update_client');

        var customer = form.addField('custpage_ilo_multi_customer', 'select', 'CUSTOMER', 'CUSTOMER', 'custpage_ilo_searchdetails');
        customer.setMandatory(true);


        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');


        response.writePage(form);
    }


    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');

        var formTitle = 'Install Base List';
        var SecondForm = nlapiCreateForm(formTitle);

        var urlBack = request.getParameter('custpage_ilo_back_home');
        nlapiLogExecution('DEBUG', 'urlBack', urlBack);

        var to_backHome_recon = SecondForm.addField('custpage_ilo_to_back_home', 'text', 'link back home', null, 'custpage_sum_group');
        to_backHome_recon.setDefaultValue(urlBack);
        to_backHome_recon.setDisplayType('hidden');

        var customer = request.getParameter('custpage_ilo_multi_customer');

        var TrueOrFalse = 'F';
        if (action == 17 || action == 10 || action == 18 || action == 11) { // Reconnection or Temporary Disconnection or Temporary Disconnection - Stop Billing or Re-connection - Start Billing
            TrueOrFalse = 'T'
        }

        SecondForm.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        var second_customer = SecondForm.addField('custpage_ilo_multi_customer', 'select', 'CUSTOMER', 'CUSTOMER', 'custpage_ilo_searchdetails');
        second_customer.setDefaultValue(customer);
        second_customer.setDisplayType('inline');

        var second_site = SecondForm.addField('custpage_ilo_multi_site', 'select', 'SITE', 'customrecord_site', 'custpage_ilo_searchdetails');
        second_site.setDefaultValue(site);
        second_site.setDisplayType('inline');

        var second_subscription = SecondForm.addField('custpage_ilo_multi_subscription', 'select', 'SUBSCRIPTION', 'customrecord_subscription', 'custpage_ilo_searchdetails');
        second_subscription.setDefaultValue(subscription);
        second_subscription.setDisplayType('inline');

        var second_item = SecondForm.addField('custpage_ilo_multi_item', 'select', 'ITEM', 'ITEM', 'custpage_ilo_searchdetails');
        second_item.setDefaultValue(item);
        second_item.setDisplayType('inline');

        var second_service_status = SecondForm.addField('custpage_ilo_multi_service_status', 'select', 'SERVICE STATUS', 'customlist_ib_service_status', 'custpage_ilo_searchdetails');
        second_service_status.setDefaultValue(service_status);
        second_service_status.setDisplayType('inline');

        var second_action = SecondForm.addField('custpage_ilo_multi_action', 'select', 'ACTION', 'customlist_topic_list', 'custpage_ilo_searchdetails');
        second_action.setDefaultValue(action);
        second_action.setDisplayType('inline');


        var results = serachIb(customer, subscription, item, service_status, action, site, leader_site)

        var resultsSubList = SecondForm.addSubList('custpage_results_sublist', 'list', 'Results', null);

        resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');

        resultsSubList.addField('custpage_resultssublist_ib_name', 'text', 'IB')

        resultsSubList.addField('custpage_resultssublist_ib_id', 'text', 'IB').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_ib_customer', 'text', 'Customer').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_ib_customer_id', 'text', 'Customer').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_ib_item', 'text', 'Item')

        resultsSubList.addField('custpage_resultssublist_ib_item_id', 'text', 'Item').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_ib_item_description', 'text', 'Item Description')

        resultsSubList.addField('custpage_resultssublist_ib_quantity', 'text', 'qty')

        resultsSubList.addField('custpage_resultssublist_ib_rate', 'text', 'Rate');

        resultsSubList.addField('custpage_resultssublist_ib_currency_text', 'text', 'Currency');

        resultsSubList.addField('custpage_resultssublist_ib_serial_number', 'text', 'Serial Number').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_ib_class', 'text', ' Class');

        resultsSubList.addField('custpage_resultssublist_ib_class_id', 'text', 'Class').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_ib_charging_method', 'text', 'Charging Method').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_ib_service_status', 'text', 'Service Status');

        resultsSubList.addField('custpage_resultssublist_ib_currency', 'text', 'Currency').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_ib_site', 'text', 'site').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_ib_suspension_date', 'text', 'Suspension Date')

        resultsSubList.addField('custpage_resultssublist_ib_activation_date', 'text', 'Activation Date')



        if (results != null && results != []) {
            for (var i = 0; i < results.length; i++) {

                resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', i + 1, TrueOrFalse);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_name', i + 1, results[i].ib_name);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_id', i + 1, results[i].ib_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_customer', i + 1, results[i].ib_customer);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_customer_id', i + 1, results[i].ib_customer_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_item', i + 1, results[i].ib_item);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_item_id', i + 1, results[i].ib_item_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_item_description', i + 1, results[i].ib_item_description);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_quantity', i + 1, results[i].ib_quantity);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_rate', i + 1, results[i].ib_rate);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_serial_number', i + 1, results[i].ib_serial_number);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_class', i + 1, results[i].ib_class);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_charging_method', i + 1, results[i].ib_charging_method);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_service_status', i + 1, results[i].ib_service_status);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_currency', i + 1, results[i].ib_currency);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_currency_text', i + 1, results[i].ib_currency_text);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_site', i + 1, results[i].ib_site);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_class_id', i + 1, results[i].ib_class_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_suspension_date', i + 1, results[i].ib_suspension_date);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_activation_date', i + 1, results[i].ib_deactivation_date);

            }
        }


        var checkType = SecondForm.addField('custpage_ilo_action', 'text', 'check', null, null);
        checkType.setDefaultValue(action);
        checkType.setDisplayType('hidden');

        var action_type = '3';
        if (action == '19' || action == '3' || action == '25') {
            action_type = '2';
        }
        var checkType = SecondForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue(action_type);
        checkType.setDisplayType('hidden');


        SecondForm.setScript('customscript_services_update_client');
        var backBTN = SecondForm.addButton('custpage_loadpage_back', 'Go Back', 'go_back();');

        resultsSubList.addMarkAllButtons();

        SecondForm.addSubmitButton('Execute');
        response.writePage(SecondForm);

    }


    else {

        var lastForm = nlapiCreateForm('Services Update Screen - finish');
        response.writePage(lastForm);

    }

} // services_update_screen function - end



//functions

function serachIb(customer, subscription, item, service_status, action, site, leader_site) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ib_customer', null, 'anyof', customer);
    filters[1] = new nlobjSearchFilter('custrecord_ib_is_service', null, 'is', 'T');
    filters[2] = new nlobjSearchFilter('custrecord_ib_charging_method', null, 'anyof', 2);

    if (subscription != '') { filters.push(new nlobjSearchFilter('custrecord_ib_subscription', null, 'anyof', subscription)) };
    if (item != '') { filters.push(new nlobjSearchFilter('custrecord_ib_item', null, 'is', item)) };
    if (service_status != '') { filters.push(new nlobjSearchFilter('custrecord_ib_service_status', null, 'anyof', service_status)) };
    if (site != '') { filters.push(new nlobjSearchFilter('custrecord_ib_site', null, 'anyof', site)) };
    if (leader_site != '') { filters.push(new nlobjSearchFilter('custrecord_site_leader_site', 'custrecord_ib_site', 'anyof', leader_site)) };

    //filtersInvoice[4] = new nlobjSearchFilter('custrecord_ib_site', null, 'anyof', action);

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('custrecord_ib_customer');
    columns[2] = new nlobjSearchColumn('custrecord_ib_subscription');
    columns[3] = new nlobjSearchColumn('custrecord_ib_item');
    columns[4] = new nlobjSearchColumn('custrecord_ib_item_description');
    columns[5] = new nlobjSearchColumn('custrecord_ib_quantity');
    columns[6] = new nlobjSearchColumn('custrecord_ib_rate');
    columns[7] = new nlobjSearchColumn('custrecord_ib_serial_number');
    columns[8] = new nlobjSearchColumn('custrecord_ib_class');
    columns[9] = new nlobjSearchColumn('custrecord_ib_charging_method');
    columns[10] = new nlobjSearchColumn('custrecord_ib_service_status');
    columns[11] = new nlobjSearchColumn('custrecord_ib_orig_trx_currency');
    columns[12] = new nlobjSearchColumn('custrecord_ib_site');
    columns[13] = new nlobjSearchColumn('custrecord_ib_suspension_date');
    columns[14] = new nlobjSearchColumn('custrecord_ib_deactivation_date');


    var search = nlapiCreateSearch('customrecord_ib_service_type', filters, columns);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    do {

        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s.length > 0) {
        var result = [];
        for (var i = 0; i < s.length; i++) {
            result.push({
                ib_id: s[i].id,
                ib_name: s[i].getValue('name'),
                ib_customer: s[i].getText('custrecord_ib_customer'),
                ib_customer_id: s[i].getValue('custrecord_ib_customer'),
                ib_subscription: s[i].getValue('custrecord_ib_subscription'),
                ib_item: s[i].getText('custrecord_ib_item'),
                ib_item_id: s[i].getValue('custrecord_ib_item'),
                ib_item_description: s[i].getValue('custrecord_ib_item_description'),
                ib_quantity: s[i].getValue('custrecord_ib_quantity'),
                ib_rate: s[i].getValue('custrecord_ib_rate'),
                ib_serial_number: s[i].getValue('custrecord_ib_serial_number'),
                ib_class: s[i].getText('custrecord_ib_class'),
                ib_class_id: s[i].getValue('custrecord_ib_class'),
                ib_charging_method: s[i].getText('custrecord_ib_charging_method'),
                ib_service_status: s[i].getText('custrecord_ib_service_status'),
                ib_currency: s[i].getValue('custrecord_ib_orig_trx_currency'),
                ib_currency_text: s[i].getText('custrecord_ib_orig_trx_currency'),
                ib_site: s[i].getValue('custrecord_ib_site'),
                ib_suspension_date: s[i].getValue('custrecord_ib_suspension_date'),
                ib_deactivation_date: s[i].getValue('custrecord_ib_deactivation_date'),



            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach result ', JSON.stringify(result));
    return result;



}// JavaScript source code
