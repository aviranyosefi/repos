var SO = [];
var SO_lines = [];
var s = [];
var t = [];
var error;



function services_update_screen(request, response) {

    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'stage first', 'stage first');

        var form = nlapiCreateForm('Services Update Screen');
        form.addSubmitButton('Submit');

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        form.setScript('customscript_services_update_client');

        var customer = form.addField('custpage_ilo_multi_customer', 'select', 'CUSTOMER', 'CUSTOMER', 'custpage_ilo_searchdetails');
        customer.setMandatory(true);

        var currency = form.addField('custpage_ilo_multi_currency', 'select', 'CURRENCY', null, 'custpage_ilo_searchdetails');
        currency.setMandatory(true);

        var site = form.addField('custpage_ilo_multi_site', 'select', 'SITE', null, 'custpage_ilo_searchdetails');

        var leader_site = form.addField('custpage_ilo_multi_leader_site', 'select', 'Leader Site', null, 'custpage_ilo_searchdetails');

        var subscription = form.addField('custpage_ilo_multi_subscription', 'select', 'SUBSCRIPTION', null, 'custpage_ilo_searchdetails');

        var item = form.addField('custpage_ilo_multi_item', 'select', 'ITEM', 'ITEM', 'custpage_ilo_searchdetails');

        var service_status = form.addField('custpage_ilo_multi_service_status', 'select', 'SERVICE STATUS', 'customlist_ib_service_status', 'custpage_ilo_searchdetails');

        var action = form.addField('custpage_ilo_multi_action', 'select', 'ACTION', null, 'custpage_ilo_searchdetails');
        action.setMandatory(true);

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');

        var baseUrl = request.getURL();
        var suitletID = request.getParameter('script');
        var deployID = request.getParameter('deploy');
        var backHome = form.addField('custpage_ilo_back_home', 'text', 'link back home', null, 'custpage_search_group');
        backHome.setDefaultValue(baseUrl + '?script=' + suitletID + '&deploy=' + deployID);
        backHome.setDisplayType('hidden');

        //
        form.addFieldGroup('custpage_ilo_subscription', 'Subscription Details');
        form.addField('custpage_ilo_imei_sn', 'text', 'IMEI/S.N', null, 'custpage_ilo_subscription');       
        form.addField('custpage_ilo_sim_number', 'text', 'Sim Number', 'ITEM', 'custpage_ilo_subscription');
        form.addField('custpage_ilo_talkgroup_numbe', 'text', 'Talk Group ID', 'ITEM', 'custpage_ilo_subscription');
        form.addField('custpage_ilo_voice_phone_number', 'text', 'Voice Phone Number', 'ITEM', 'custpage_ilo_subscription');
        
        //

        response.writePage(form);
    }
    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage 1', 'stage 1');

        var formTitle = 'Install Base List';
        var SecondForm = nlapiCreateForm(formTitle);

        var urlBack = request.getParameter('custpage_ilo_back_home');
        nlapiLogExecution('DEBUG', 'urlBack', urlBack);

        var to_backHome_recon = SecondForm.addField('custpage_ilo_to_back_home', 'text', 'link back home', null, 'custpage_sum_group');
        to_backHome_recon.setDefaultValue(urlBack);
        to_backHome_recon.setDisplayType('hidden');

        var customer = request.getParameter('custpage_ilo_multi_customer');
        var subscription = request.getParameter('custpage_ilo_multi_subscription');
        var item = request.getParameter('custpage_ilo_multi_item');
        var service_status = request.getParameter('custpage_ilo_multi_service_status');
        var action = request.getParameter('custpage_ilo_multi_action');
        var site = request.getParameter('custpage_ilo_multi_site');
        var leader_site = request.getParameter('custpage_ilo_multi_leader_site');
        var currency = request.getParameter('custpage_ilo_multi_currency');
        var imei_sn = request.getParameter('custpage_ilo_imei_sn');
        var sim_number = request.getParameter('custpage_ilo_sim_number');
        var talkgroup_numbe = request.getParameter('custpage_ilo_talkgroup_numbe');
        var voice_phone_number = request.getParameter('custpage_ilo_voice_phone_number');
        

        var TrueOrFalse = 'F';
        if (action == 17 || action == 10 || action == 18 || action == 11) { // Reconnection or Temporary Disconnection or Temporary Disconnection - Stop Billing or Re-connection - Start Billing
            TrueOrFalse = 'T'
        }

        SecondForm.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        var second_customer = SecondForm.addField('custpage_ilo_multi_customer', 'select', 'CUSTOMER', 'CUSTOMER', 'custpage_ilo_searchdetails');
        second_customer.setDefaultValue(customer);
        second_customer.setDisplayType('inline');

        var second_customer = SecondForm.addField('custpage_ilo_multi_currency', 'select', 'CURRENCY', 'CURRENCY', 'custpage_ilo_searchdetails');
        second_customer.setDefaultValue(currency);
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

        var counter = SecondForm.addField('custpage_ilo_counter', 'text', 'COUNTER', null, null);
        counter.setDefaultValue('0');
        counter.setDisplayType('inline');
            
        var results = serachIb(customer, subscription, item, service_status, action, site, leader_site, currency, imei_sn, sim_number, talkgroup_numbe, voice_phone_number )

        var resultsSubList = SecondForm.addSubList('custpage_results_sublist', 'list', 'Results', null);

        resultsSubList.addButton('customscript_marlk_all', 'Mark All', 'MarkAll()');

        resultsSubList.addButton('customscript_un_marlk_all', 'Unmark All', 'UnmarkAll()');

        var cb = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
        if (TrueOrFalse == 'T') {
            cb.setDisplayType('disabled')
        }

        resultsSubList.addField('custpage_resultssublist_ib_name', 'text', 'IB')

        resultsSubList.addField('custpage_resultssublist_ib_site_name', 'text', 'Site')

        resultsSubList.addField('custpage_resultssublist_ib_subscription_name', 'text', 'Subscription')

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

        resultsSubList.addField('custpage_resultssublist_ib_site', 'text', 'Site').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_ib_activation_date', 'text', 'Activation Date')

        resultsSubList.addField('custpage_resultssublist_ib_suspension_date', 'text', 'Suspension Date')

        resultsSubList.addField('custpage_resultssublist_ib_subscription', 'text', 'subscription').setDisplayType('hidden');





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
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_site_name', i + 1, results[i].ib_site_name);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_class_id', i + 1, results[i].ib_class_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_suspension_date', i + 1, results[i].ib_suspension_date);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_activation_date', i + 1, results[i].ib_activation_date);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_subscription_name', i + 1, results[i].ib_subscription_name);
                resultsSubList.setLineItemValue('custpage_resultssublist_ib_subscription', i + 1, results[i].ib_subscription);
            }
        }


        var checkType = SecondForm.addField('custpage_ilo_action', 'text', 'check', null, null);
        checkType.setDefaultValue(action);
        checkType.setDisplayType('hidden');

        var action_type = '3';
        if (action == '19' || action == '3' || action == '25') {
            action_type = '2';
        }
        else if (action == '8') { // price change
            action_type = '2.1';
        }
        else if (action == '23') { // bw cange
            action_type = '2.2';
        }
        else if (action == '27' || action == '28' || action == '29') {
            action_type = '2.3';
        }
        else if (action == '30') {
            action_type = '2.4';
        }
        else if (action == '26') {
            action_type = '2.5';
        }
        var checkType = SecondForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue(action_type);
        checkType.setDisplayType('hidden');

        //var billing_date_field = SecondForm.addField('custpage_ilo_billing_date', 'text', 'check', null, null);
        //billing_date_field.setDefaultValue(billing_date);
        //billing_date_field.setDisplayType('hidden');

        //var billing_item_field = SecondForm.addField('custpage_ilo_billing_item', 'text', 'check', null, null);
        //billing_item_field.setDefaultValue(billing_item);
        //billing_item_field.setDisplayType('hidden');


        SecondForm.setScript('customscript_services_update_client');
        var backBTN = SecondForm.addButton('custpage_loadpage_back', 'Go Back', 'go_back();');

        //resultsSubList.addMarkAllButtons();

        SecondForm.addSubmitButton('Execute');
        response.writePage(SecondForm);

    }
    else if (request.getParameter('custpage_ilo_check_type') == '2') {

        nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');
        var threddForm = nlapiCreateForm('');

        var action = request.getParameter('custpage_ilo_action');
        var threddForm_action = threddForm.addField('custpage_ilo_action', 'text', 'check', null, null);
        threddForm_action.setDefaultValue(action);
        threddForm_action.setDisplayType('hidden');

        var LinesNo = request.getLineItemCount('custpage_results_sublist');
        var count = 0;
        var data_for_quote = [];
        var customerId = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_customer_id', 1);
        var lineOfBusnises = getLineOfBusnises(customerId);
        var item_list = itemSearch(lineOfBusnises, action);
        for (var i = 1; i <= LinesNo; i++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);

            if (checkBox == 'T') {

                count = count + 1;
                ib_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_name', i);
                item = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_id', i);
                item_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item', i);
                customer = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_customer_id', i);
                currency = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_currency', i);
                description = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_description', i);
                quantity = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_quantity', i);
                rate = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_rate', i);
                ib_class = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_class_id', i);
                site = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_site', i);
                ib_id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_id', i);
                ib_subscription = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_subscription', i);


                data_for_quote.push({

                    quote_customer: customer,
                    quote_currency: currency,
                    quote_ib_item: item,
                    quote_ib_description: description,
                    quote_ib_quantity: quantity,
                    quote_ib_rate: rate,
                    quote_ib_class: ib_class,
                    quote_ib_site: site,
                    iBId: ib_id,
                    quote_ib_subscription: ib_subscription


                });


                nlapiLogExecution('DEBUG', 'count', count);
                threddForm.addFieldGroup('custpage_ilo_ib' + count, ib_name + ': ' + ' ' + item_name + '&nbsp;&nbsp;&nbsp;&nbsp;' + description + ' &nbsp;&nbsp;&nbsp;&nbsp;( Quantity :' + quantity + ' )')
                var item = threddForm.addField('custpage_ilo_multi_item_' + count, 'select', 'ITEM', null, 'custpage_ilo_ib' + count).setLayoutType('outsidebelow', 'startrow');
                item.setMandatory(true);
                item.addSelectOption('', '');
                if (item_list != null) {
                    for (var j = 0; j < item_list.length; j++) {
                        item.addSelectOption(item_list[j].id, item_list[j].name);
                    }
                }
                var qty = threddForm.addField('custpage_ilo_qty_' + count, 'text', 'Quantity ', null, 'custpage_ilo_ib' + count).setLayoutType('outsidebelow', 'startcol');
                qty.setMandatory(true);
            } // if (checkBox == 'T') - end


        }// loop - end

        var Billing_obj = threddForm.addField('custpage_ilo_data_for_quote', 'longtext', 'check', null, null);
        Billing_obj.setDefaultValue(JSON.stringify(data_for_quote));
        Billing_obj.setDisplayType('hidden');

        var checkType = threddForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue('3');
        checkType.setDisplayType('hidden');

        var PrevcheckType = threddForm.addField('custpage_ilo_prev_check_type', 'text', 'check', null, null);
        PrevcheckType.setDefaultValue('2');
        PrevcheckType.setDisplayType('hidden');

        threddForm.addSubmitButton('Execute');

        response.writePage(threddForm);

    }
    else if (request.getParameter('custpage_ilo_check_type') == '2.1') {

        nlapiLogExecution('DEBUG', 'stage 2.1', 'stage 2.1');
        var threddForm = nlapiCreateForm('');

        var action = request.getParameter('custpage_ilo_action');
        var threddForm_action = threddForm.addField('custpage_ilo_action', 'text', 'check', null, null);
        threddForm_action.setDefaultValue(action);
        threddForm_action.setDisplayType('hidden');

        var LinesNo = request.getLineItemCount('custpage_results_sublist');
        var count = 0;
        var data_for_quote = [];
        for (var i = 1; i <= LinesNo; i++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);
            if (checkBox == 'T') {

                count = count + 1;
                ib_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_name', i);
                item = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_id', i);
                item_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item', i);
                customer = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_customer_id', i);
                currency = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_currency', i);
                description = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_description', i);
                quantity = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_quantity', i);
                rate = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_rate', i);
                ib_class = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_class_id', i);
                site = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_site', i);
                ib_id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_id', i);
                ib_subscription = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_subscription', i);

                data_for_quote.push({

                    quote_customer: customer,
                    quote_currency: currency,
                    quote_ib_item: item,
                    quote_ib_description: description,
                    quote_ib_quantity: quantity,
                    quote_ib_rate: rate,
                    quote_ib_class: ib_class,
                    quote_ib_site: site,
                    iBId: ib_id,
                    quote_ib_subscription: ib_subscription


                });


                nlapiLogExecution('DEBUG', 'count', count);
                threddForm.addFieldGroup('custpage_ilo_ib' + count, ib_name + ': ' + ' ' + item_name + '&nbsp;&nbsp;&nbsp;&nbsp;' + description + ' &nbsp;&nbsp;&nbsp;&nbsp; Quantity :' + quantity + '  ' + ' &nbsp;&nbsp;&nbsp;&nbsp; Rate :' + rate + '  ')
                var rate = threddForm.addField('custpage_ilo_rate_' + count, 'text', 'New Rate ', null, 'custpage_ilo_ib' + count).setLayoutType('outsidebelow', 'startcol');
                rate.setMandatory(true);
            } // if (checkBox == 'T') - end


        }// loop - end

        var Billing_obj = threddForm.addField('custpage_ilo_data_for_quote', 'longtext', 'check', null, null);
        Billing_obj.setDefaultValue(JSON.stringify(data_for_quote));
        Billing_obj.setDisplayType('hidden');

        var checkType = threddForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue('3');
        checkType.setDisplayType('hidden');

        var PrevcheckType = threddForm.addField('custpage_ilo_prev_check_type', 'text', 'check', null, null);
        PrevcheckType.setDefaultValue('2.1');
        PrevcheckType.setDisplayType('hidden');

        threddForm.addSubmitButton('Execute');

        response.writePage(threddForm);

    }
    else if (request.getParameter('custpage_ilo_check_type') == '2.2') {

        nlapiLogExecution('DEBUG', 'stage 2.2', 'stage 2.2');
        var threddForm = nlapiCreateForm('');

        var action = request.getParameter('custpage_ilo_action');
        var threddForm_action = threddForm.addField('custpage_ilo_action', 'text', 'check', null, null);
        threddForm_action.setDefaultValue(action);
        threddForm_action.setDisplayType('hidden');

        var LinesNo = request.getLineItemCount('custpage_results_sublist');
        var count = 0;
        var data_for_quote = [];
        for (var i = 1; i <= LinesNo; i++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);
            if (checkBox == 'T') {

                count = count + 1;
                ib_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_name', i);
                item = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_id', i);
                item_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item', i);
                customer = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_customer_id', i);
                currency = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_currency', i);
                description = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_description', i);
                quantity = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_quantity', i);
                rate = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_rate', i);
                ib_class = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_class_id', i);
                site = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_site', i);
                ib_id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_id', i);
                ib_subscription = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_subscription', i);

                data_for_quote.push({

                    quote_customer: customer,
                    quote_currency: currency,
                    quote_ib_item: item,
                    quote_ib_description: description,
                    quote_ib_quantity: quantity,
                    quote_ib_rate: rate,
                    quote_ib_class: ib_class,
                    quote_ib_site: site,
                    iBId: ib_id,
                    quote_ib_subscription: ib_subscription


                });


                nlapiLogExecution('DEBUG', 'count', count);
                threddForm.addFieldGroup('custpage_ilo_ib' + count, ib_name + ': ' + ' ' + item_name + '&nbsp;&nbsp;&nbsp;&nbsp;' + description + ' &nbsp;&nbsp;&nbsp;&nbsp;( Quantity :' + quantity + ' )')
                var qty = threddForm.addField('custpage_ilo_qty_' + count, 'text', 'Quantity ', null, 'custpage_ilo_ib' + count).setLayoutType('outsidebelow', 'startcol');
                qty.setMandatory(true);
            } // if (checkBox == 'T') - end


        }// loop - end

        var Billing_obj = threddForm.addField('custpage_ilo_data_for_quote', 'longtext', 'check', null, null);
        Billing_obj.setDefaultValue(JSON.stringify(data_for_quote));
        Billing_obj.setDisplayType('hidden');

        var checkType = threddForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue('3');
        checkType.setDisplayType('hidden');

        var PrevcheckType = threddForm.addField('custpage_ilo_prev_check_type', 'text', 'check', null, null);
        PrevcheckType.setDefaultValue('2.2');
        PrevcheckType.setDisplayType('hidden');

        threddForm.addSubmitButton('Execute');

        response.writePage(threddForm);

    }
    else if (request.getParameter('custpage_ilo_check_type') == '2.3') {

        nlapiLogExecution('DEBUG', 'stage 2.3', 'stage 2.3');
        var threddForm = nlapiCreateForm('');

        var action = request.getParameter('custpage_ilo_action');
        //var billing_date = request.getParameter('custpage_ilo_billing_date');
        //var billing_item = request.getParameter('custpage_ilo_billing_item');
        //var itemid = nlapiLookupField('item', billing_item, 'itemid')
        //var itemdisplayname = nlapiLookupField('item', billing_item, 'displayname')

        var threddForm_action = threddForm.addField('custpage_ilo_action', 'text', 'check', null, null);
        threddForm_action.setDefaultValue(action);
        threddForm_action.setDisplayType('hidden');

        threddForm.addFieldGroup('custpage_ilo_subscription', 'Subscription Details');
        var date = threddForm.addField('custpage_ilo_date', 'date', 'Effective Billing Date ', null, 'custpage_ilo_subscription')//.setLayoutType('outsidebelow', 'startcol');
        date.setMandatory(true);

        var customerId = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_customer_id', 1);
        var lineOfBusnises = getLineOfBusnises(customerId);
        var item_list = itemSearch(lineOfBusnises , action);
        var item = threddForm.addField('custpage_ilo_multi_item', 'select', 'ITEM', null, 'custpage_ilo_subscription') //.setLayoutType('outsidebelow', 'startrow');
        item.setMandatory(true);
        item.addSelectOption('', '');
        if (item_list != null) {
            for (var j = 0; j < item_list.length; j++) {
                item.addSelectOption(item_list[j].id, item_list[j].name);
            }
        }
        if (action == 28 || action ==29) {
            var group_item_list = GroupitemSearch(action);
            if (group_item_list != null) {
                for (var j = 0; j < group_item_list.length; j++) {
                    item.addSelectOption(group_item_list[j].id, group_item_list[j].name);
                }
            }
        }
        
        var LinesNo = request.getLineItemCount('custpage_results_sublist');
        var count = 0;
        var data_for_quote = [];

        
        for (var i = 1; i <= LinesNo; i++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);
            if (checkBox == 'T') {

                count = count + 1;
                ib_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_name', i);
                item = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_id', i);
                item_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item', i);
                customer = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_customer_id', i);
                currency = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_currency', i);
                description = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_description', i);
                quantity = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_quantity', i);
                rate = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_rate', i);
                ib_class = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_class_id', i);
                site = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_site', i);
                ib_id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_id', i);
                ib_subscription = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_subscription', i);

                data_for_quote.push({

                    quote_customer: customer,
                    quote_currency: currency,
                    quote_ib_item: item,
                    quote_ib_description: description,
                    quote_ib_quantity: quantity,
                    quote_ib_rate: rate,
                    quote_ib_class: ib_class,
                    quote_ib_site: site,
                    iBId: ib_id,
                    quote_ib_subscription: ib_subscription


                });


                nlapiLogExecution('DEBUG', 'count', count);
                //threddForm.addFieldGroup('custpage_ilo_ib' + count, ib_name + ': ' + ' ' + item_name + '&nbsp;&nbsp;&nbsp;&nbsp;' + description + ' &nbsp;&nbsp;&nbsp;&nbsp;( Quantity :' + quantity + ' )')
                //var item = threddForm.addField('custpage_ilo_multi_item_' + count, 'select', 'ITEM', null, 'custpage_ilo_ib' + count) //.setLayoutType('outsidebelow', 'startrow');
                //item.setMandatory(true);
                //item.addSelectOption('', '');
                //if (item_list != null) {
                //    for (var j = 0; j < item_list.length; j++) {
                //        item.addSelectOption(item_list[j].id, item_list[j].name);
                //    }
                //}
                //var date = threddForm.addField('custpage_ilo_date_' + count, 'date', 'date', null, 'custpage_ilo_ib' + count)
                //date.setMandatory(true);
                //date.setDefaultValue(billing_date);
            } // if (checkBox == 'T') - end
        }// loop - end

        

        var Billing_obj = threddForm.addField('custpage_ilo_data_for_quote', 'longtext', 'check', null, null);
        Billing_obj.setDefaultValue(JSON.stringify(data_for_quote));
        Billing_obj.setDisplayType('hidden');

        var checkType = threddForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue('3');
        checkType.setDisplayType('hidden');

        var PrevcheckType = threddForm.addField('custpage_ilo_prev_check_type', 'text', 'check', null, null);
        PrevcheckType.setDefaultValue('2.3');
        PrevcheckType.setDisplayType('hidden');

        threddForm.addSubmitButton('Execute');

        response.writePage(threddForm);

    }
    else if (request.getParameter('custpage_ilo_check_type') == '2.4') {

        nlapiLogExecution('DEBUG', 'stage 2.4', 'stage 2.4');
        var threddForm = nlapiCreateForm('');

        var action = request.getParameter('custpage_ilo_action');
        //var billing_date = request.getParameter('custpage_ilo_billing_date');

        var threddForm_action = threddForm.addField('custpage_ilo_action', 'text', 'check', null, null);
        threddForm_action.setDefaultValue(action);
        threddForm_action.setDisplayType('hidden');

        var LinesNo = request.getLineItemCount('custpage_results_sublist');
        var count = 0;
        var data_for_quote = [];
        for (var i = 1; i <= LinesNo; i++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);
            if (checkBox == 'T') {

                count = count + 1;
                ib_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_name', i);
                item = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_id', i);
                item_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item', i);
                customer = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_customer_id', i);
                currency = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_currency', i);
                description = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_description', i);
                quantity = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_quantity', i);
                rate = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_rate', i);
                ib_class = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_class_id', i);
                site = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_site', i);
                ib_id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_id', i);
                ib_subscription = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_subscription', i);

                data_for_quote.push({

                    quote_customer: customer,
                    quote_currency: currency,
                    quote_ib_item: item,
                    quote_ib_description: description,
                    quote_ib_quantity: quantity,
                    quote_ib_rate: rate,
                    quote_ib_class: ib_class,
                    quote_ib_site: site,
                    iBId: ib_id,
                    quote_ib_subscription: ib_subscription


                });


            } // if (checkBox == 'T') - end


        }// loop - end


        var rate = threddForm.addField('custpage_ilo_rate_', 'text', 'New Rate ', null, null).setLayoutType('outsidebelow', 'startcol');
        rate.setMandatory(true);
        var date = threddForm.addField('custpage_ilo_date', 'date', 'Effective Billing Date ', null, null).setLayoutType('outsidebelow', 'startcol');
        date.setMandatory(true);
        
        var Billing_obj = threddForm.addField('custpage_ilo_data_for_quote', 'longtext', 'check', null, null);
        Billing_obj.setDefaultValue(JSON.stringify(data_for_quote));
        Billing_obj.setDisplayType('hidden');

        var res = threddForm.addField('custpage_ilo_res', 'text', 'check', null, null);
        res.setDefaultValue(data_for_quote.length);
        res.setDisplayType('hidden');

        nlapiLogExecution('DEBUG', 'JSON.stringify(data_for_quote): ' + data_for_quote.length, JSON.stringify(data_for_quote));

        var checkType = threddForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue('3');
        checkType.setDisplayType('hidden');

        var PrevcheckType = threddForm.addField('custpage_ilo_prev_check_type', 'text', 'check', null, null);
        PrevcheckType.setDefaultValue('2.4');
        PrevcheckType.setDisplayType('hidden');

        threddForm.addSubmitButton('Execute');

        response.writePage(threddForm);

    }
    else if (request.getParameter('custpage_ilo_check_type') == '2.5') {

        nlapiLogExecution('DEBUG', 'stage 2.5', 'stage 2.5');
        var threddForm = nlapiCreateForm('');

        var action = request.getParameter('custpage_ilo_action');
        //var billing_date = request.getParameter('custpage_ilo_billing_date');

        var threddForm_action = threddForm.addField('custpage_ilo_action', 'text', 'check', null, null);
        threddForm_action.setDefaultValue(action);
        threddForm_action.setDisplayType('hidden');

        var LinesNo = request.getLineItemCount('custpage_results_sublist');
        var count = 0;
        var data_for_quote = [];
        for (var i = 1; i <= LinesNo; i++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);
            if (checkBox == 'T') {

                count = count + 1;
                ib_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_name', i);
                item = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_id', i);
                item_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item', i);
                customer = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_customer_id', i);
                currency = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_currency', i);
                description = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_description', i);
                quantity = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_quantity', i);
                rate = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_rate', i);
                ib_class = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_class_id', i);
                site = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_site', i);
                ib_id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_id', i);
                ib_subscription = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_subscription', i);

                data_for_quote.push({

                    quote_customer: customer,
                    quote_currency: currency,
                    quote_ib_item: item,
                    quote_ib_description: description,
                    quote_ib_quantity: quantity,
                    quote_ib_rate: rate,
                    quote_ib_class: ib_class,
                    quote_ib_site: site,
                    iBId: ib_id,
                    quote_ib_subscription: ib_subscription


                });


            } // if (checkBox == 'T') - end


        }// loop - end


        //var rate = threddForm.addField('custpage_ilo_rate_', 'text', 'New Rate ', null, null).setLayoutType('outsidebelow', 'startcol');
        //rate.setMandatory(true);
        var date = threddForm.addField('custpage_ilo_date', 'date', 'Effective Billing Date ', null, null).setLayoutType('outsidebelow', 'startcol');
        date.setMandatory(true);

        var Billing_obj = threddForm.addField('custpage_ilo_data_for_quote', 'longtext', 'check', null, null);
        Billing_obj.setDefaultValue(JSON.stringify(data_for_quote));
        Billing_obj.setDisplayType('hidden');

        var res = threddForm.addField('custpage_ilo_res', 'text', 'check', null, null);
        res.setDefaultValue(data_for_quote.length);
        res.setDisplayType('hidden');

        nlapiLogExecution('DEBUG', 'JSON.stringify(data_for_quote): ' + data_for_quote.length, JSON.stringify(data_for_quote));

        var checkType = threddForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue('3');
        checkType.setDisplayType('hidden');

        var PrevcheckType = threddForm.addField('custpage_ilo_prev_check_type', 'text', 'check', null, null);
        PrevcheckType.setDefaultValue('2.5');
        PrevcheckType.setDisplayType('hidden');

        threddForm.addSubmitButton('Execute');

        response.writePage(threddForm);

    }
    else if (request.getParameter('custpage_ilo_check_type') == '3') {
        nlapiLogExecution('DEBUG', 'stage 3', 'stage 3');


        var action = request.getParameter('custpage_ilo_action');
        var PrevcheckType = request.getParameter('custpage_ilo_prev_check_type');

        var data_for_quote = request.getParameter('custpage_ilo_data_for_quote');
        nlapiLogExecution('DEBUG', 'data_for_quote ', data_for_quote);

        if (PrevcheckType == '2.4' && request.getParameter('custpage_ilo_res') > 50) {  // Subscription Service Price Change                  
            nlapiLogExecution('DEBUG', 'custpage_ilo_rate_', request.getParameter('custpage_ilo_rate_'));
            nlapiLogExecution('DEBUG', 'custpage_ilo_date ', request.getParameter('custpage_ilo_date'));
            nlapiScheduleScript('customscript_services_update_ss',
                'customdeploy_services_update_ss_dep',
                {
                    custscript_data: data_for_quote,
                    custscript_rate: request.getParameter('custpage_ilo_rate_'),
                    custscript_date: request.getParameter('custpage_ilo_date')
                })
            var employee = nlapiGetContext();
            var employeeId = employee.email;
            var lastForm = nlapiCreateForm('You have selected more than 50 IB records <br> Email with a transaction number will be sent to the email address: ' + employeeId);
            response.writePage(lastForm);
            //return;

        }
        else { var data_for_quote_obj = JSON.parse(data_for_quote); }

        var data_for_quote_final = [];
        if (data_for_quote_obj != null) {
            for (var i = 0; i < data_for_quote_obj.length; i++) {
                var line = i + 1;
                if (PrevcheckType == '2.4' || PrevcheckType == '2.3' || PrevcheckType == '2.5' ) {  // Subscription Service Price Change                  
                    var billing_date = request.getParameter('custpage_ilo_date')
                }               
                else { var billing_date = '' }

                if (PrevcheckType == '2.5') {

                    data_for_quote_final.push({    

                        quote_customer: data_for_quote_obj[i].quote_customer,
                        quote_currency: data_for_quote_obj[i].quote_currency,
                        quote_ib_item: data_for_quote_obj[i].quote_ib_item,
                        quote_ib_description: data_for_quote_obj[i].quote_ib_description,
                        quote_ib_quantity: data_for_quote_obj[i].quote_ib_quantity,
                        quote_ib_rate: data_for_quote_obj[i].quote_ib_rate,
                        quote_ib_class: data_for_quote_obj[i].quote_ib_class,
                        quote_ib_site: data_for_quote_obj[i].quote_ib_site,
                        iBId: data_for_quote_obj[i].iBId,
                        quote_ib_replace: '',
                        quote_ib_action_type: '1',  // Deactivate
                        quote_billing_date: billing_date,
                        quote_ib_subscription: data_for_quote_obj[i].quote_ib_subscription,


                    });


                }
                else {

                    data_for_quote_final.push({    //IB LINE

                        quote_customer: data_for_quote_obj[i].quote_customer,
                        quote_currency: data_for_quote_obj[i].quote_currency,
                        quote_ib_item: data_for_quote_obj[i].quote_ib_item,
                        quote_ib_description: data_for_quote_obj[i].quote_ib_description,
                        quote_ib_quantity: data_for_quote_obj[i].quote_ib_quantity,
                        quote_ib_rate: data_for_quote_obj[i].quote_ib_rate,
                        quote_ib_class: data_for_quote_obj[i].quote_ib_class,
                        quote_ib_site: data_for_quote_obj[i].quote_ib_site,
                        iBId: data_for_quote_obj[i].iBId,
                        quote_ib_replace: '',
                        quote_ib_action_type: '1',  // Deactivate
                        quote_billing_date: billing_date,
                        quote_ib_subscription: data_for_quote_obj[i].quote_ib_subscription,


                    });
                    //nlapiLogExecution('DEBUG', 'line', line);

                    if (PrevcheckType == '2') {  // upgrade.... screen
                        var item = request.getParameter('custpage_ilo_multi_item_' + line);
                        var classItem = itemClass(item);
                        var qty = request.getParameter('custpage_ilo_qty_' + line)
                        var rate = data_for_quote_obj[i].quote_ib_rate;
                        var billing_date = '';
                        var ib_subscription = '';

                    }
                    else if (PrevcheckType == '2.1') {  // price change screen
                        var item = data_for_quote_obj[i].quote_ib_item;
                        var classItem = itemClass(item);;
                        var qty = data_for_quote_obj[i].quote_ib_quantity;
                        var rate = request.getParameter('custpage_ilo_rate_' + line);
                        var billing_date = '';
                        var ib_subscription = '';
                    }
                    else if (PrevcheckType == '2.2') {  // bw change screen
                        var item = data_for_quote_obj[i].quote_ib_item;
                        var classItem = itemClass(item);
                        var qty = request.getParameter('custpage_ilo_qty_' + line)
                        var rate = data_for_quote_obj[i].quote_ib_rate;
                        var billing_date = '';
                        var ib_subscription = '';
                    }
                    if (PrevcheckType == '2.3') {  // 	Subscription Service Suspension/ Unsuspension  / 4.3	Subscription Service Change
                        var item = request.getParameter('custpage_ilo_multi_item');
                        var classItem = itemClass(item);;
                        var qty = data_for_quote_obj[i].quote_ib_quantity;
                        var rate = data_for_quote_obj[i].quote_ib_rate;
                        var billing_date = request.getParameter('custpage_ilo_date');
                        var ib_subscription = data_for_quote_obj[i].quote_ib_subscription;
                    }
                    if (PrevcheckType == '2.4') {  // Subscription Service Price Change
                        var item = data_for_quote_obj[i].quote_ib_item;
                        var classItem = itemClass(item);;
                        var qty = data_for_quote_obj[i].quote_ib_quantity;
                        var rate = request.getParameter('custpage_ilo_rate_')
                        var billing_date = request.getParameter('custpage_ilo_date')
                        var ib_subscription = data_for_quote_obj[i].quote_ib_subscription;
                    }

                    data_for_quote_final.push({ // new line

                        quote_customer: data_for_quote_obj[i].quote_customer,
                        quote_currency: data_for_quote_obj[i].quote_currency,
                        quote_ib_item: item,
                        quote_ib_description: data_for_quote_obj[i].quote_ib_description,
                        quote_ib_quantity: qty,
                        quote_ib_rate: rate,
                        quote_ib_class: classItem,
                        quote_ib_site: data_for_quote_obj[i].quote_ib_site,
                        quote_ib_replace: data_for_quote_obj[i].iBId,
                        iBId: '',
                        quote_ib_action_type: '2',  // Activate	 
                        quote_billing_date: billing_date,
                        quote_ib_subscription: ib_subscription

                    });

                }
              

            }
        }
        else {

            var LinesNo = request.getLineItemCount('custpage_results_sublist');

            for (var i = 1; i <= LinesNo; i++) {
                checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);
                //var item_list = itemSearch();
                if (checkBox == 'T') {

                    ib_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_name', i);
                    item = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_id', i);
                    item_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item', i);
                    customer = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_customer_id', i);
                    currency = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_currency', i);
                    description = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_item_description', i);
                    quantity = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_quantity', i);
                    rate = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_rate', i);
                    ib_class = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_class_id', i);
                    site = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_site', i);
                    ib_id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_id', i);
                    ib_subscription = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_ib_subscription', i);

                    var action_type = actionType(action);
                    var billing_date = '';
                    //if (action == '26') { billing_date = request.getParameter('custpage_ilo_billing_date') }

                    data_for_quote_final.push({

                        quote_customer: customer,
                        quote_currency: currency,
                        quote_ib_item: item,
                        quote_ib_description: description,
                        quote_ib_quantity: quantity,
                        quote_ib_rate: rate,
                        quote_ib_class: ib_class,
                        quote_ib_site: site,
                        iBId: ib_id,
                        quote_ib_replace: '',
                        quote_ib_action_type: action_type,
                        quote_billing_date: billing_date,
                        quote_ib_subscription: ib_subscription,

                    });
                }
            }
        } // else


        nlapiLogExecution('DEBUG', 'data_for_quote_final :' + data_for_quote_final.length, JSON.stringify(data_for_quote_final));
        nlapiLogExecution('DEBUG', 'action ', action);
        nlapiLogExecution('DEBUG', 'site ', site);

        if (data_for_quote_final.length > 0) {
            var res = Quote_Generate(data_for_quote_final, action);
            nlapiLogExecution('DEBUG', 'res ', res);
            if (res != '' && res != null && res != undefined) {
                var result = res.split(',')
                nlapiSetRedirectURL('record', result[2], result[1], null, null)
            }
            else {
                var lastForm = nlapiCreateForm(error.toString());
            }
        }

        response.writePage(lastForm);

    }

} // services_update_screen function - end



//functions

function serachIb(customer, subscription, item, service_status, action, site, leader_site, currency, imei_sn, sim_number, talkgroup_numbe, voice_phone_number) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ib_customer', null, 'anyof', customer);
    filters[1] = new nlobjSearchFilter('custrecord_ib_is_service', null, 'is', 'T');
    filters[2] = new nlobjSearchFilter('custrecord_ib_charging_method', null, 'anyof', 2);
    filters[3] = new nlobjSearchFilter('custrecord_ib_orig_trx_currency', null, 'anyof', currency);
    if (action == 27) { // Subscription Service Suspension
        filters[4] = new nlobjSearchFilter('custrecord_ib_service_status', null, 'anyof', '1')
        filters[5] = new nlobjSearchFilter( 'custitem_suspension_fee_item','custrecord_ib_item', 'is', 'F')
    }
    else if (action == 28) { // Subscription Service Unsuspension
        filters[4] = new nlobjSearchFilter('custrecord_ib_service_status', null, 'noneof', '2')
        filters[5] = new nlobjSearchFilter( 'custitem_suspension_fee_item', 'custrecord_ib_item','is', 'T')
    }
    else { filters[4] = new nlobjSearchFilter('custrecord_ib_service_status', null, 'noneof', '2'); }

    if (subscription != '') { filters.push(new nlobjSearchFilter('custrecord_ib_subscription', null, 'anyof', subscription)) };
    if (item != '') { filters.push(new nlobjSearchFilter('custrecord_ib_item', null, 'is', item)) };
    if (service_status != '') { filters.push(new nlobjSearchFilter('custrecord_ib_service_status', null, 'anyof', service_status)) };
    if (site != '') { filters.push(new nlobjSearchFilter('custrecord_ib_site', null, 'anyof', site)) };
    if (leader_site != '') { filters.push(new nlobjSearchFilter('custrecord_site_leader_site', 'custrecord_ib_site', 'anyof', leader_site)) };

    if (imei_sn != '') { filters.push(new nlobjSearchFilter('custrecord_subs_imei', 'custrecord_ib_subscription', 'is', imei_sn)) };
    if (sim_number != '') { filters.push(new nlobjSearchFilter('custrecord_subs_sim_number', 'custrecord_ib_subscription', 'is', sim_number)) };
    if (talkgroup_numbe != '') { filters.push(new nlobjSearchFilter('custrecord_subs_ptt_talkgroup_number', 'custrecord_ib_subscription', 'is', talkgroup_numbe)) };
    if (voice_phone_number != '') { filters.push(new nlobjSearchFilter('custrecord_subs_voice_phone_number', 'custrecord_ib_subscription', 'is', voice_phone_number)) };

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
    columns[14] = new nlobjSearchColumn('custrecord_ib_activation_date');
    columns[15] = new nlobjSearchColumn("altname", "CUSTRECORD_IB_SUBSCRIPTION", null)



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
    var result = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
            result.push({
                ib_id: s[i].id,
                ib_name: s[i].getValue('name'),
                ib_customer: s[i].getText('custrecord_ib_customer'),
                ib_customer_id: s[i].getValue('custrecord_ib_customer'),
                ib_subscription_name: s[i].getText('custrecord_ib_subscription') + ' ' + s[i].getValue("altname", "CUSTRECORD_IB_SUBSCRIPTION", null),
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
                ib_site_name: s[i].getText('custrecord_ib_site'),
                ib_suspension_date: s[i].getValue('custrecord_ib_suspension_date'),
                ib_activation_date: s[i].getValue('custrecord_ib_activation_date'),



            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach result ' + result.length, JSON.stringify(result));
    return result;



}

function Quote_Generate(data_for_quote_final, action) {

    try {
        //var Service_Action = ServiceAction(action)

        //  Upgrade - Quote - 19
        //	Downgrade - Quote - 3
        //	Service Provider Change - Quote - 25
        //	Price Change Quote  - 8
        //	Permanent Disconnection - Sales Order - 7
        //	Temporary Disconnection - Sales Order - 17
        //	Temporary Disconnection – Stop Billing - Sales Order - 18
        //	Reconnect Sales Order - 10
        //	Reconnect – Start Billing Sales Order -11  
        //	BW Change Sales Order - 23
        //	Pipe Quality of Service Change Sales Order - 9

        //Subscription Service Deactivation - Quote - 26
        //	Subscription Service Suspension -27
        //	Subscription Service Unsuspension - 28
        //	Subscription Service Change - 29
        //	Subscription Service Price Change -30


        var rec_type;
        var form = getForm(action);
        // create Quote - start
        if (action == '19' || action == '3' || action == '8' || action == '25'
            || action == '27' || action == '28' || action == '29' || action == '30') {
            rec_type = 'estimate';

        }
        else if (action == '7' || action == '17' || action == '18' || action == '10' || action == '11' || action == '23'
            || action == '9' || action == '26') {
            rec_type = 'salesorder';

        }

        var rec = nlapiCreateRecord(rec_type);
        //Header Fields 
        rec.setFieldValue('entity', data_for_quote_final[0].quote_customer);
        rec.setFieldValue('customform', form);
        rec.setFieldValue('currency', data_for_quote_final[0].quote_currency);
        rec.setFieldValue('custbody_topic', action);
        rec.setFieldValue('custbody_connection_period_in_months', 12);
         

        if (rec_type == 'salesorder') {
            rec.setFieldValue('orderstatus', 'B');
            rec.setFieldValue('custbody_transaction_approval_status', '2');
        }

        for (var i = 0; i < data_for_quote_final.length; i++) {
            try {
                // lines Fields

                rec.selectNewLineItem('item');
                rec.setCurrentLineItemValue('item', 'item', data_for_quote_final[i].quote_ib_item); // IB: Item
                if (data_for_quote_final[i].quote_ib_action_type == '1') {
                    rec.setCurrentLineItemValue('item', 'description', data_for_quote_final[i].quote_ib_description); //IB: Item Description
                }


                rec.setCurrentLineItemValue('item', 'custcol_billing_date', data_for_quote_final[i].quote_billing_date)


                rec.setCurrentLineItemValue('item', 'quantity', data_for_quote_final[i].quote_ib_quantity)
                rec.setCurrentLineItemValue('item', 'rate', data_for_quote_final[i].quote_ib_rate)
                rec.setCurrentLineItemValue('item', 'class', data_for_quote_final[i].quote_ib_class);
                rec.setCurrentLineItemValue('item', 'custcol_site', data_for_quote_final[i].quote_ib_site);
                rec.setCurrentLineItemValue('item', 'custcol_install_base', data_for_quote_final[i].iBId);
                rec.setCurrentLineItemValue('item', 'custcol_replacing_service_id', data_for_quote_final[i].quote_ib_replace);
                rec.setCurrentLineItemValue('item', 'custcol_action_type', data_for_quote_final[i].quote_ib_action_type);
                rec.setCurrentLineItemValue('item', 'custcol_subscription', data_for_quote_final[i].quote_ib_subscription);

                if (data_for_quote_final[i].iBId != '') {

                    var dedicated_uplink_kb = nlapiLookupField('customrecord_ib_service_type', data_for_quote_final[i].iBId, 'custrecord_ib_dedicated_uplink_kb')
                    rec.setCurrentLineItemValue('item', 'custcol_transmit_dedicated', dedicated_uplink_kb);
                    var burst_uplink_kb = nlapiLookupField('customrecord_ib_service_type', data_for_quote_final[i].iBId, 'custrecord_ib_burst_uplink_kb')
                    rec.setCurrentLineItemValue('item', 'custcol_transmit_burst', burst_uplink_kb);
                    var dedicated_downlink_kb = nlapiLookupField('customrecord_ib_service_type', data_for_quote_final[i].iBId, 'custrecord_ib_dedicated_downlink_kb')
                    rec.setCurrentLineItemValue('item', 'custcol_receive_dedicated', dedicated_downlink_kb);
                    var downlink_kb = nlapiLookupField('customrecord_ib_service_type', data_for_quote_final[i].iBId, 'custrecord_ib_burst_downlink_kb')
                    rec.setCurrentLineItemValue('item', 'custcol_receive_burst', downlink_kb);

                }
                rec.commitLineItem('item');
            } catch (err) {
                nlapiLogExecution('DEBUG', 'error Quote_Generate - lines', err);
                error = err;
            }
        }
        // create Quote - end

        var id = nlapiSubmitRecord(rec);
        nlapiLogExecution('debug', 'quote / so', id);
        if (rec_type == 'estimate') {
            var tranid = nlapiLookupField('estimate', id, 'tranid');
            tranid += ',' + id + ',estimate';
        }
        else {
            var tranid = nlapiLookupField('salesorder', id, 'tranid');
            tranid += ',' + id + ',salesorder';;
        }
        return tranid;
    } catch (e) {

        nlapiLogExecution('DEBUG', 'error Quote_Generate ', e);
        error = e;
    }
}

function ServiceAction(action) {
    var res;
    if (action == '19' || action == '3' || action == '25') { res = 1; }
    else if (action == '7') { res = 2; }
    else if (action == '17') { res = 6; }
    else if (action == '17' || action == '18') { res = 6; }
    else if (action == '10' || action == '11') { res = 7; }
    else if (action == '8') { res = 3; }
    else if (action == '23') { res = 4; }
    else if (action == '9') { res = ''; }

    return res;

}

function itemSearch(lineOfBusnises , action) {
    nlapiLogExecution('DEBUG', 'action', action);
    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('itemid');
    columns[1] = new nlobjSearchColumn('custitem_gilat_item_name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custitem_is_service', null, 'is', 'T')
    filters[1] = new nlobjSearchFilter('custitem_charging_method', null, 'anyof', 2) // recarent
    filters[2] = new nlobjSearchFilter('custitem_line_of_business', null, 'anyof', lineOfBusnises) //fss or mss
    if (action == 27) {
        filters[3] = new nlobjSearchFilter('custitem_suspension_fee_item', null, 'is', 'T') //Suspension Fee Item
    }
    else if (action == '19' || action == '3' || action == '25' || action =='29') {
        filters[3] = new nlobjSearchFilter('custitem_internal_only', null, 'is', 'F') //NOT FOR SALE
    }


    var search = nlapiCreateSearch('item', filters, columns);
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        for (var i = 0; i < returnSearchResults.length; i++) {
            results.push({
                id: returnSearchResults[i].id,
                name: returnSearchResults[i].getValue('itemid') + ' ' + returnSearchResults[i].getValue('custitem_gilat_item_name')
            });
        }
        return results;
    }
}

function itemClass(item) {

    var results;

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('class');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', item)

    var search = nlapiCreateSearch('item', filters, columns);
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        for (var i = 0; i < returnSearchResults.length; i++) {
            results = returnSearchResults[i].getValue('class')
        }
        return results;
    }
}

function actionType(action) {

    //  Upgrade  - 19
    //	Downgrade  - 3
    //	Service Provider Change  - 25
    //	Price Change  - 8
    //	Permanent Disconnection  - 7
    //	Temporary Disconnection  - 17
    //	Temporary Disconnection – Stop Billing -  18
    //	Reconnect Sales Order - 10
    //	Reconnect – Start Billing  -11  
    //	BW Change Sales  - 23
    //	Pipe Quality of Service Change - 9

    // Subscription Service Deactivation -26

    var res = '';

    if (action == 3 || action == 19 || action == 25 || action == 7 || action == 26) {
        res = '1'; // 'Deactivate'
    }
    if (action == 17 || action == 18) {
        res = '6';
    }
    else if (action == 10 || action == 11) {
        res = '7';
    }
    else if (action == 8) {
        res = '1';
    }
    else if (action == 23) {
        res = '1';
    }
    else if (action == 9) {
        res = '8';
    }
    else if (action == 30) {
        res = '2'; // 'Activate' 
    }
    return res;
}

function updateSite(site, action) {

    nlapiLogExecution('debug', 'updateSite / site', site);
    nlapiLogExecution('debug', 'updateSite / action', action);

    if (action == '17') { // Temporary Disconnection
        nlapiSubmitField('customrecord_site', site, 'custrecord_site_status', 2)  // Temporary Disconnection
    }
    if (action == '18') { // Temporary Disconnection - Stop Billing
        nlapiSubmitField('customrecord_site', site, 'custrecord_site_status', 4) // Temporary Disconnection - Stop Billing
    }
    else if (action == '10' || action == '11') {
        nlapiSubmitField('customrecord_site', site, 'custrecord_site_status', 1)
    }

}

function getLineOfBusnises(customerId) {
    var lineOfBusnises = '';
    if (!isNullOrEmpty(customerId)) {
        lineOfBusnises = nlapiLookupField('customer', customerId, 'custentity_customer_line_of_business');
    }
    return lineOfBusnises;

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getForm(action) {

    var res = '';

    if (action == 3 || action == 19 || action == 25 || action == 8) {
        res = '110';   // 110	Internet Connectivity Quote
    }
    else if (action == 7 || action == 17 || action == 18 || action == 10 || action == 9 || action == 23 || action == 11) {
        res = '133';  // 133	Internet Connectivity Sales Order
    }
    else if (action == 26) {
        res = '127'; // 127	D&HLS Sales Order
    }
    else if (action == 27 || action == 28 || action == 29 || action == 30) {
        res = '128'; // 128	D&HLS Quote
    }
    return res;


}

function GroupitemSearch(action) {

    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('itemid');
    columns[1] = new nlobjSearchColumn('custitem_gilat_item_name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('type', null, 'anyof', 'Group')
    filters[1] = new nlobjSearchFilter('custitem_line_of_business', null, 'anyof', 2)//D&HLS

    if (action == '29') {
        filters[2] = new nlobjSearchFilter('custitem_internal_only', null, 'is', 'F') //NOT FOR SALE
    }


    var search = nlapiCreateSearch('item', filters, columns);
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        for (var i = 0; i < returnSearchResults.length; i++) {
            results.push({
                id: returnSearchResults[i].id,
                name: returnSearchResults[i].getValue('itemid') + ' ' + returnSearchResults[i].getValue('custitem_gilat_item_name')
            });
        }
        return results;
    }
}