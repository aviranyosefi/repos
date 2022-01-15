var error;

function Subscriptions_Activation_Screen(request, response) {

    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'stage first', 'stage first');

        var form = nlapiCreateForm('Mass Subscriptions Activation ');
        form.addSubmitButton('Submit');

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        var customer = form.addField('custpage_ilo_multi_customer', 'select', 'CUSTOMER', 'CUSTOMER', 'custpage_ilo_searchdetails');
        customer.setMandatory(true);

        var type = form.addField('custpage_ilo_multi_type', 'select', 'TYPE', 'customlist187', 'custpage_ilo_searchdetails');
        type.setMandatory(true);

        var ServiceType = form.addField('custpage_ilo_multi_service_type', 'select', 'Service Type', 'customlist307', 'custpage_ilo_searchdetails');
        
        var DateCreation = form.addField('custpage_ilo_date_creation', 'date', 'Date Creation', null, 'custpage_ilo_searchdetails');

        var OPERATOR = form.addField('custpage_ilo_operator', 'select', 'OPERATOR', 'customlist186', 'custpage_ilo_searchdetails');

        var SERVICEFAMILY = form.addField('custpage_ilo_service_family', 'select', 'SERVICE FAMILY', 'customlist_mss_service_families', 'custpage_ilo_searchdetails');

        var STATUS = form.addField('custpage_ilo_status', 'select', 'STATUS', 'customlist351', 'custpage_ilo_searchdetails').setMandatory(true);
        STATUS.setDefaultValue(1);
        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');

        var baseUrl = request.getURL();
        var suitletID = request.getParameter('script');
        var deployID = request.getParameter('deploy');
        var backHome = form.addField('custpage_ilo_back_home', 'text', 'link back home', null, 'custpage_search_group');
        backHome.setDefaultValue(baseUrl + '?script=' + suitletID + '&deploy=' + deployID);
        backHome.setDisplayType('hidden');
    
        response.writePage(form);
    }
    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage 1', 'stage 1');

        var formTitle = 'Subscriptions Activation';
        var SecondForm = nlapiCreateForm(formTitle);

        var urlBack = request.getParameter('custpage_ilo_back_home');
        nlapiLogExecution('DEBUG', 'urlBack', urlBack);

        var to_backHome_recon = SecondForm.addField('custpage_ilo_to_back_home', 'text', 'link back home', null, 'custpage_sum_group');
        to_backHome_recon.setDefaultValue(urlBack);
        to_backHome_recon.setDisplayType('hidden');

        var customer = request.getParameter('custpage_ilo_multi_customer');
        var type = request.getParameter('custpage_ilo_multi_type');
        var ServiceType = request.getParameter('custpage_ilo_multi_service_type');
        var DateCreation = request.getParameter('custpage_ilo_date_creation');
        var Operator = request.getParameter('custpage_ilo_operator');
        var ServiceFamily = request.getParameter('custpage_ilo_service_family');
        var status = request.getParameter('custpage_ilo_status');
        
        var results = serachSubs(customer, type, ServiceType, DateCreation, Operator, ServiceFamily, status)
                  
        SecondForm.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        var second_customer = SecondForm.addField('custpage_ilo_multi_customer', 'select', 'CUSTOMER', 'CUSTOMER', 'custpage_ilo_searchdetails');
        second_customer.setDefaultValue(customer);
        second_customer.setDisplayType('inline');
        var typeField = SecondForm.addField('custpage_ilo_multi_type', 'select', 'TYPE', 'customlist187', 'custpage_ilo_searchdetails');
        typeField.setDefaultValue(type);
        typeField.setDisplayType('inline');
        var ServiceTypeField = SecondForm.addField('custpage_ilo_multi_service_type', 'select', 'Service Type', 'customlist307', 'custpage_ilo_searchdetails');
        ServiceTypeField.setDefaultValue(ServiceType);
        ServiceTypeField.setDisplayType('inline');
        var DateCreationField = SecondForm.addField('custpage_ilo_date_creation', 'date', 'Date Creation', null, 'custpage_ilo_searchdetails');
        DateCreationField.setDefaultValue(DateCreation);
        DateCreationField.setDisplayType('inline');

        SecondForm.setScript('customscript_subscriptions_activation_cs');
        var counter = SecondForm.addField('custpage_ilo_counter', 'text', 'COUNTER', null, null);       
        counter.setDefaultValue('0');
        counter.setDisplayType('inline');
    
        var resultsSubList = SecondForm.addSubList('custpage_results_sublist', 'list', 'Results', null);

        resultsSubList.addButton('customscript_marlk_all', 'Mark All', 'MarkAll()');

        resultsSubList.addButton('customscript_un_marlk_all', 'Unmark All', 'UnmarkAll()');

        resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
      
        resultsSubList.addField('custpage_resultssublist_subs_name', 'text', 'SUBS')

        resultsSubList.addField('custpage_resultssublist_subs_id', 'text', 'SUBS').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_subs_cus_name', 'text', 'Customer')

        resultsSubList.addField('custpage_resultssublist_subs_type_name', 'text', 'TYPE')

        resultsSubList.addField('custpage_resultssublist_subs_type_id', 'text', 'TYPE').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_subs_operator_name', 'text', 'Operator')

        resultsSubList.addField('custpage_resultssublist_subs_operator_id', 'text', 'Operator').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_subs_sim_number', 'text', 'SIM NUMBER')

        resultsSubList.addField('custpage_resultssublist_subs_imsi', 'text', 'IMSI')

        resultsSubList.addField('custpage_resultssublist_subs_imei', 'text', 'IMEI')

        resultsSubList.addField('custpage_resultssublist_ptt_talkgroup_number', 'text', 'PTT TALK GROUP NUMBER')

        resultsSubList.addField('custpage_resultssublist_subs_voice_phone_number', 'text', 'VOICE PHONE NUMBER')
    
        if (results != null && results != []) {
            for (var i = 0; i < results.length; i++) {

                resultsSubList.setLineItemValue('custpage_resultssublist_subs_name', i + 1, results[i].subs_name);
                resultsSubList.setLineItemValue('custpage_resultssublist_subs_id', i + 1, results[i].subs_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_subs_cus_name', i + 1, results[i].subs_customer);
                resultsSubList.setLineItemValue('custpage_resultssublist_subs_type_name', i + 1, results[i].subs_type_name);
                resultsSubList.setLineItemValue('custpage_resultssublist_subs_type_id', i + 1, results[i].subs_type_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_subs_operator_name', i + 1, results[i].subs_operator_name);
                resultsSubList.setLineItemValue('custpage_resultssublist_subs_operator_id', i + 1, results[i].subs_operator_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_subs_sim_number', i + 1, results[i].subs_sim_number);
                resultsSubList.setLineItemValue('custpage_resultssublist_subs_imei', i + 1, results[i].subs_imei);  
                resultsSubList.setLineItemValue('custpage_resultssublist_subs_imsi', i + 1, results[i].subs_imsi);  
                resultsSubList.setLineItemValue('custpage_resultssublist_ptt_talkgroup_number', i + 1, results[i].subs_ptt_talkgroup_number);
                resultsSubList.setLineItemValue('custpage_resultssublist_subs_voice_phone_number', i + 1, results[i].subs_voice_phone_number);  
                
            }
        }

        var checkType = SecondForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue('2');
        checkType.setDisplayType('hidden');

        SecondForm.addButton('custpage_loadpage_back', 'Go Back', 'go_back();');

        SecondForm.addSubmitButton('Next');
        response.writePage(SecondForm);

    }
    else if (request.getParameter('custpage_ilo_check_type') == '2') {

        nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');
        var threddForm = nlapiCreateForm('Quote Creation');

        var customer = request.getParameter('custpage_ilo_multi_customer')

        var currencyList = customer_currency(customer);
        var currency = threddForm.addField('custpage_ilo_multi_currency', 'select', 'CURRENCY', null, null);
        currency.setMandatory(true);
        currency.addSelectOption('', '');
        if (currencyList != null) {
            for (var j = 0; j < currencyList.length; j++) {
                currency.addSelectOption(currencyList[j].id, currencyList[j].name);
            }
        }
        var ConnectionPeriod = threddForm.addField('custpage_ilo_connection_period', 'integer', 'Connection Period', null, null);
        ConnectionPeriod.setDefaultValue(12);
        ConnectionPeriod.setMandatory(true);

        var BillingDate = threddForm.addField('custpage_ilo_billing_date', 'date', 'Billing Date', null, null);
        BillingDate.setMandatory(true)

        var CustomerPOList = get_customer_po(customer);
        var customerPoField = threddForm.addField('custpage_ilo_multi_customer_po', 'select', 'CUSTOMER PO', null, null);       
        customerPoField.addSelectOption('', '');
        if (CustomerPOList != null) {
            for (var j = 0; j < CustomerPOList.length; j++) {
                customerPoField.addSelectOption(CustomerPOList[j].id, CustomerPOList[j].name);
            }
        }

        var item_list = itemSearch();
        var item = threddForm.addField('custpage_ilo_multi_item', 'select', 'ITEM', null, null) //.setLayoutType('outsidebelow', 'startrow');
        item.setMandatory(true);
        item.addSelectOption('', '');
        if (item_list != null) {
            for (var j = 0; j < item_list.length; j++) {
                item.addSelectOption(item_list[j].id, item_list[j].name);
            }
        }
        var group_item_list = GroupitemSearch();
        if (group_item_list != null) {
            for (var j = 0; j < group_item_list.length; j++) {
                item.addSelectOption(group_item_list[j].id, group_item_list[j].name);
            }
        }
           
        var LinesNo = request.getLineItemCount('custpage_results_sublist');
        var data_for_quote = [];
        
        for (var i = 1; i <= LinesNo; i++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);

            if (checkBox == 'T') {         
                subscription = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_subs_id', i);
                data_for_quote.push({

                    quote_customer: customer,                                                 
                    quote_subscription: subscription

                });          
            } // if (checkBox == 'T') - end
        }// loop - end

        var Billing_obj = threddForm.addField('custpage_ilo_data_for_quote', 'longtext', 'check', null, null);
        Billing_obj.setDefaultValue(JSON.stringify(data_for_quote));
        Billing_obj.setDisplayType('hidden');

        

        var checkType = threddForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue('3');
        checkType.setDisplayType('hidden');

        threddForm.addSubmitButton('Execute');

        response.writePage(threddForm);

    }
    else if (request.getParameter('custpage_ilo_check_type') == '3') {
        nlapiLogExecution('DEBUG', 'stage 3', 'stage 3');

        var currency = request.getParameter('custpage_ilo_multi_currency')
        var connection_period = request.getParameter('custpage_ilo_connection_period')
        var billing_date = request.getParameter('custpage_ilo_billing_date')
        var customer_po = request.getParameter('custpage_ilo_multi_customer_po')
        var item = request.getParameter('custpage_ilo_multi_item')
        
        var data_for_quote = request.getParameter('custpage_ilo_data_for_quote');
        nlapiLogExecution('DEBUG', 'data_for_quote ', data_for_quote);    
        var data_for_quote_obj = JSON.parse(data_for_quote);
        var data_for_quote_final = [];
        if (data_for_quote_obj != null) {
            for (var i = 0; i < data_for_quote_obj.length; i++) {       
                data_for_quote_final.push({    
                    quote_customer: data_for_quote_obj[i].quote_customer,
                    quote_currency: currency,
                    quote_connection_period: connection_period,
                    quote_billing_date: billing_date,
                    quote_customer_po: customer_po,
                    quote_item: item,
                    quote_subscription: data_for_quote_obj[i].quote_subscription,      
                });
            }
        } 
        nlapiLogExecution('DEBUG', 'data_for_quote_final :' + data_for_quote_final.length, JSON.stringify(data_for_quote_final));
        if (data_for_quote_final.length > 0) {
            var res = Quote_Generate(data_for_quote_final);
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

} 



//functions

function serachSubs(customer, type, ServiceType, DateCreation, Operator, ServiceFamily , status) {
    nlapiLogExecution('DEBUG', 'ServiceFamily', ServiceFamily);
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_subs_customer', null, 'anyof', customer);
    filters[1] = new nlobjSearchFilter('custrecord_subs_activation_status', null, 'anyof', status);

    if (type != '') { filters.push(new nlobjSearchFilter('custrecord_subs_type', null, 'anyof', type)) };
    if (ServiceType != '') { filters.push(new nlobjSearchFilter('custrecord_subs_sim_type', null, 'anyof', ServiceType)) };
    if (DateCreation != '') { filters.push(new nlobjSearchFilter('created', null, 'on', DateCreation)) };
    if (Operator != '') { filters.push(new nlobjSearchFilter('custrecord_subs_operator', null, 'anyof', Operator)) };
    if (ServiceFamily != '') { filters.push(new nlobjSearchFilter('custrecord_service_family', null, 'anyof', ServiceFamily)) };
      
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('custrecord_subs_type');
    columns[2] = new nlobjSearchColumn('custrecord_subs_operator');
    columns[3] = new nlobjSearchColumn('custrecord_subs_sim_number');
    columns[4] = new nlobjSearchColumn('custrecord_subs_imsi');
    columns[5] = new nlobjSearchColumn('custrecord_subs_imei');
    columns[6] = new nlobjSearchColumn('custrecord_subs_customer');
    columns[7] = new nlobjSearchColumn('custrecord_subs_ptt_talkgroup_number');
    columns[8] = new nlobjSearchColumn('custrecord_subs_voice_phone_number');

    var search = nlapiCreateSearch('customrecord_subscription', filters, columns);
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
                subs_id: s[i].id,
                subs_name: s[i].getValue('name'),
                subs_customer: s[i].getText('custrecord_subs_customer'),
                subs_customer_id: s[i].getValue('custrecord_subs_customer'),
                subs_type_name: s[i].getText('custrecord_subs_type'),
                subs_type_id: s[i].getValue('custrecord_subs_type'),
                subs_operator_name: s[i].getText('custrecord_subs_operator'),
                subs_operator_id: s[i].getValue('custrecord_subs_operator'),
                subs_sim_number: s[i].getValue('custrecord_subs_sim_number'),
                subs_imei: s[i].getValue('custrecord_subs_imei'),
                subs_imsi: s[i].getValue('custrecord_subs_imsi'),
                subs_ptt_talkgroup_number: s[i].getValue('custrecord_subs_ptt_talkgroup_number'),
                subs_voice_phone_number: s[i].getValue('custrecord_subs_voice_phone_number'),      
            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach result ' + result.length, JSON.stringify(result));
    return result;
}

function Quote_Generate(data_for_quote_final) {

    try {
             
        // create Quote - start
        var rec = nlapiCreateRecord('estimate');
        //Header Fields 
        rec.setFieldValue('customform', '128'); // D&HLS Quote
        rec.setFieldValue('entity', data_for_quote_final[0].quote_customer);
        rec.setFieldValue('custbody_topic', '24'); // Subscription Activation
        rec.setFieldValue('currency', data_for_quote_final[0].quote_currency);
        //rec.setFieldValue('trandate', new Date());
        
        rec.setFieldValue('custbody_transaction_approval_status', '1'); // Pending Approval
        rec.setFieldValue('custbody_connection_period_in_months', data_for_quote_final[0].quote_connection_period);

        var item = data_for_quote_final[0].quote_item;
        var itemType = getItemType(item);
        nlapiLogExecution('DEBUG', 'item: ' + item, itemType);
        if (itemType == 'Group') {
            var itemRec = nlapiLoadRecord('itemgroup', item)
            var itemsCount = itemRec.getLineItemCount('member');
            nlapiLogExecution('DEBUG', 'itemsCount: ', itemsCount);
            for (var i = 0; i < data_for_quote_final.length; i++) {
                for (var j = 1; j <= itemsCount; j++) {
                    item = itemRec.getLineItemValue('member', 'item', j);
                    try {
                        // lines Fields
                        rec.selectNewLineItem('item');
                        rec.setCurrentLineItemValue('item', 'item', item);
                        rec.setCurrentLineItemValue('item', 'custcol_billing_date', data_for_quote_final[i].quote_billing_date)
                        rec.setCurrentLineItemValue('item', 'quantity', '1')
                        rec.setCurrentLineItemValue('item', 'rate', '1') // TODO FIX UNIT PRICE SCRIPT  
                        rec.setCurrentLineItemValue('item', 'custcol_customer_po', data_for_quote_final[i].quote_customer_po);
                        rec.setCurrentLineItemValue('item', 'custcol_subscription', data_for_quote_final[i].quote_subscription);
                        rec.commitLineItem('item');
                    } catch (err) {
                        nlapiLogExecution('DEBUG', 'error Quote_Generate - lines', err);
                        error = err;
                    }
                }              
            }
        } // if (itemType == 'Group')
        else {
            for (var i = 0; i < data_for_quote_final.length; i++) {
                try {
                    // lines Fields
                    rec.selectNewLineItem('item');
                    rec.setCurrentLineItemValue('item', 'item', item);
                    rec.setCurrentLineItemValue('item', 'custcol_billing_date', data_for_quote_final[i].quote_billing_date)
                    rec.setCurrentLineItemValue('item', 'quantity', '1')
                    rec.setCurrentLineItemValue('item', 'rate', '1') // TODO FIX UNIT PRICE SCRIPT  
                    rec.setCurrentLineItemValue('item', 'custcol_customer_po', data_for_quote_final[i].quote_customer_po);
                    rec.setCurrentLineItemValue('item', 'custcol_subscription', data_for_quote_final[i].quote_subscription);
                    rec.commitLineItem('item');
                } catch (err) {
                    nlapiLogExecution('DEBUG', 'error Quote_Generate - lines', err);
                    error = err;
                }
            }
        }
        // create Quote - end

        var id = nlapiSubmitRecord(rec);
        nlapiLogExecution('debug', 'quote / so', id);  
        var tranid = nlapiLookupField('estimate', id, 'tranid');
        tranid += ',' + id + ',estimate';                
        return tranid;
    } catch (e) {

        nlapiLogExecution('DEBUG', 'error Quote_Generate ', e);
        error = e;
    }
}

function itemSearch() {

    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('itemid');
    columns[1] = new nlobjSearchColumn('custitem_gilat_item_name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('type', null, 'anyof', 'NonInvtPart')
    filters[1] = new nlobjSearchFilter('custitem_charging_method', null, 'anyof', 2) // recarent
    filters[2] = new nlobjSearchFilter('custitem_line_of_business', null, 'anyof', 2) //D&HLS
    filters[3] = new nlobjSearchFilter('isinactive', null, 'is', 'F')
    filters[4] = new nlobjSearchFilter('custitem_internal_only', null, 'is', 'F') //NOT FOR SALE


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

function GroupitemSearch() {

    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('itemid');
    columns[1] = new nlobjSearchColumn('custitem_gilat_item_name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('type', null, 'anyof', 'Group')    
    filters[1] = new nlobjSearchFilter('custitem_line_of_business', null, 'anyof', 2)//D&HLS
    filters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F')
    filters[3] = new nlobjSearchFilter('custitem_internal_only', null, 'is', 'F') //NOT FOR SALE


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

function customer_currency(customer) {
    var results = [];
    var rec = nlapiLoadRecord('customer', customer);
    var count = rec.getLineItemCount('currency');
    if (count > 0) {
        for (var i = 1; i <= count; i++) {
            var currency_id = rec.getLineItemValue('currency', 'currency', i)
            var currency_name = getCurrencyName(currency_id);
            results.push({
                id: currency_id,
                name: currency_name,
            });

        }
    }
    return results;
}

function getCurrencyName(id) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', id)

    var search = nlapiCreateSearch('currency', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var res = '';

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {
        res = returnSearchResults[0].getValue('name');
    }

    return res;
}

function get_customer_po(customer) {

    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('altname');
    columns[1] = new nlobjSearchColumn('name');



    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_cpo_customer', null, 'is', customer)
    
    var search = nlapiCreateSearch('customrecord_custom_po', filters, columns);

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
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {

        for (var i = 0; i < returnSearchResults.length; i++) {

            results.push({

                id: returnSearchResults[i].id,
                name: returnSearchResults[i].getValue('name') + ' ' + returnSearchResults[i].getValue('altname')
            });

        }
        return results;
    }
}

function getItemType(item) {

    var results;

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('type');

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
            results = returnSearchResults[0].getValue('type')
        }
        return results;
    }
}
