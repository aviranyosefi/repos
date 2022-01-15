var SO = [];
var SO_lines = [];
var s = [];



function sim_allocation_screen(request, response) {

    if (request.getMethod() == 'GET') {

        nlapiLogExecution('DEBUG', 'stage one', 'stage one');


        var form = nlapiCreateForm('Sim Allocation');

        form.addSubmitButton('Submit');


        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');


        var vendor = form.addField('custpage_ilo_multi_vendor', 'select', 'SERVICE SUPPLIER ', 'customlist_satellite_service_providers', 'custpage_ilo_searchdetails');
        vendor.setMandatory(true);
        //vendor.addSelectOption('', '');
        //var vendor_list = vendors_search()
        //if (vendor_list != null) {

        //    for (var i = 0; i < vendor_list.length; i++) {
        //        vendor.addSelectOption(vendor_list[i].id, vendor_list[i].name);
        //    }
        //}
        
        var operator = form.addField('custpage_ilo_multi_operator', 'select', 'OPERATOR', 'customlist186', 'custpage_ilo_searchdetails');
        operator.setMandatory(true);


        var type = form.addField('custpage_ilo_multi_type', 'select', 'TYPE', 'customlist307', 'custpage_ilo_searchdetails');
        //type.setMandatory(true);

        var sim_number = form.addField('custpage_ilo_multi_sim_number', 'text', 'SIM NUMBER', null, 'custpage_ilo_searchdetails');


        var customer = form.addField('custpage_ilo_multi_customer', 'select', 'Allocate to Customer', 'CUSTOMER', 'custpage_ilo_searchdetails');
        customer.setMandatory(true);



        var baseUrl = request.getURL();
        var suitletID = request.getParameter('script');
        var deployID = request.getParameter('deploy');
        var backHome = form.addField('custpage_ilo_back_home', 'text', 'link back home', null, 'custpage_search_group');
        backHome.setDefaultValue(baseUrl + '?script=' + suitletID + '&deploy=' + deployID);
        backHome.setDisplayType('hidden');




        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');



        response.writePage(form);

    }


    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad

        nlapiLogExecution('DEBUG', 'stage two', 'stage two');

        var formTitle = 'Available Sims';
        var SecondForm = nlapiCreateForm(formTitle);

        var vendor = request.getParameter('custpage_ilo_multi_vendor');
        var operator = request.getParameter('custpage_ilo_multi_operator');
        var type = request.getParameter('custpage_ilo_multi_type');
        var sim_number = request.getParameter('custpage_ilo_multi_sim_number');
        var customer = request.getParameter('custpage_ilo_multi_customer');

        var counter = SecondForm.addField('custpage_ilo_counter', 'text', 'COUNTER', null, null);
        counter.setDefaultValue(0);
        counter.setDisplayType('inline');

        var mark = SecondForm.addField('custpage_ilo_auto_mark', 'text', 'QUANTITY', null, null);
        
        
        var results = serachSims(vendor, operator, type, sim_number)




        var resultsSubList = SecondForm.addSubList('custpage_results_sublist', 'list', 'Results', null);

        resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');

        resultsSubList.addField('custpage_resultssublist_sim_id_name', 'text', 'ID').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_sim_id', 'text', 'IB').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_sim_number', 'text', 'SIM NUMBER');

        resultsSubList.addField('custpage_resultssublist_sim_vendor_id', 'text', 'Customer').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_sim_vendor_name', 'text', 'SERVICE SUPPLIER')

        resultsSubList.addField('custpage_resultssublist_sim_operator', 'text', 'OPERATOR')

        resultsSubList.addField('custpage_resultssublist_sim_operator_id', 'text', 'OPERATOR').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_sim_type', 'text', 'TYPE')

        resultsSubList.addField('custpage_resultssublist_sim_type_id', 'text', 'TYPE').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_sim_imsi', 'text', 'IMSI')

        //field for sub

        resultsSubList.addField('custpage_resultssublist_sim_pin1', 'text', 'TYPE').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_sim_puk1', 'text', 'TYPE').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_sim_pin2', 'text', 'TYPE').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_sim_puk2', 'text', 'TYPE').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_sim_service_family', 'text', 'TYPE').setDisplayType('hidden');

        






        
        if (results != null && results != []) {
            for (var i = 0; i < results.length; i++) {

                resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', i + 1, '');
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_id_name', i + 1, results[i].sim_id_name);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_id', i + 1, results[i].sim_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_number', i + 1, results[i].sim_number);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_vendor_id', i + 1, results[i].ib_vendor_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_vendor_name', i + 1, results[i].ib_vendor_name);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_operator', i + 1, results[i].sim_operator_name);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_operator_id', i + 1, results[i].sim_operator_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_type', i + 1, results[i].sim_type_name);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_type_id', i + 1, results[i].sim_type_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_imsi', i + 1, results[i].sim_imsi);

                resultsSubList.setLineItemValue('custpage_resultssublist_sim_pin1', i + 1, results[i].sim_pin1);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_puk1', i + 1, results[i].sim_puk1);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_pin2', i + 1, results[i].sim_pin2);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_puk2', i + 1, results[i].sim_puk2);
                resultsSubList.setLineItemValue('custpage_resultssublist_sim_service_family', i + 1, results[i].sim_service_family);
                
                





            }
        }



        var customer_check = SecondForm.addField('custpage_ilo_customer_check', 'text', 'check', null, null);
        customer_check.setDefaultValue(customer);
        customer_check.setDisplayType('hidden');

        var checkType = SecondForm.addField('custpage_ilo_check_type', 'text', 'check', null, null);
        checkType.setDefaultValue('3');
        checkType.setDisplayType('hidden');

        resultsSubList.addMarkAllButtons(); 

        var urlBack = request.getParameter('custpage_ilo_back_home');
        nlapiLogExecution('DEBUG', 'urlBack', urlBack);

        var to_backHome_recon = SecondForm.addField('custpage_ilo_to_back_home', 'text', 'link back home', null, 'custpage_sum_group');
        to_backHome_recon.setDefaultValue(urlBack);
        to_backHome_recon.setDisplayType('hidden');

        SecondForm.setScript('customscript_sim_allocation_client');
        var backBTN = SecondForm.addButton('custpage_loadpage_back', 'Go Back', 'go_back();');


        SecondForm.addSubmitButton('Execute');
        response.writePage(SecondForm);



    }
    else if (request.getParameter('custpage_ilo_check_type') == '3') {
        nlapiLogExecution('DEBUG', 'stage 3', 'stage 3');

        var threddForm = nlapiCreateForm('Subscriptions Created');

        var customer = request.getParameter('custpage_ilo_customer_check');

        

        var LinesNo = request.getLineItemCount('custpage_results_sublist')

        var data_for_subscription = [];
        for (var i = 1; i <= LinesNo; i++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);
            if (checkBox == 'T') {


                id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_id', i);
                vendor = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_vendor_id', i);
                id_name = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_id_name', i);
                number = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_number', i);
                operator = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_operator_id', i);
                type = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_type_id', i);
                imsi = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_imsi', i);

                pin1 = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_pin1', i);
                puk1 = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_puk1', i);
                pin2 = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_pin2', i);
                puk2 = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_puk2', i);
                service_family = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_sim_service_family', i);

                

                if (imsi != '' && imsi != null && imsi != undefined) {
                    var name = imsi
                }
                else { var name = number };
         

                data_for_subscription.push({

                    sub_sim_id: id,
                    sub_sim_vendor: vendor,
                    sub_sim_name: id_name,
                    sub_sim_number: number,
                    sub_sim_operator: operator,
                    sub_sim_type: type,
                    sub_sim_imsi: imsi,
                    sub_sim_pin1: pin1,
                    sub_sim_puk1: puk1,
                    sub_sim_pin2: pin2,
                    sub_sim_puk2: puk2,
                    sub_sim_customer: customer,
                    name: name,
                    service_family: service_family,
                    

                })

            } // if (checkBox == 'T') - end


        }// loop - end


        nlapiLogExecution('DEBUG', 'data_for_subscription ', JSON.stringify(data_for_subscription));

        if (data_for_subscription.length > 0) {

            var res = subscription_Generate(data_for_subscription);
            for (var i = 0; i < res.length; i++) {
                var ids = 'custpage_ilo_list' + i;
                var baseURL = 'https://4998343-sb2.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=185&id='
                var linkprintChoiceForm = threddForm.addField(ids, "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                linkprintChoiceForm.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =' + baseURL + res[i].sub_id + '><b>' + res[i].sub_tranid + '</b></a>'); //url of pdf from filecabinet

            }
        }

        //var quote = threddForm.addField('custpage_ilo_quote', 'text', 'Quote:', null );
        //quote.setDefaultValue(res);
        //quote.setDisplayType('inline');
        

        //threddForm.addSubmitButton('Execute');

        response.writePage(threddForm);

    }

    
}



//functions


function serachSims(vendor, operator, type, sim_number ) {

    var filters = new Array();
    
    filters.push(new nlobjSearchFilter('custrecord_related_subscription', null, 'anyof', '@NONE@'))
    if (vendor != '' && vendor != null) { filters.push(new nlobjSearchFilter('custrecord_sim_service_supplier', null, 'anyof', vendor)) };
    if (operator != '' && operator != null) { filters.push(new nlobjSearchFilter('custrecord_sim_operator', null, 'anyof', operator)) };  
    if (type != '' && type != null) { filters.push(new nlobjSearchFilter('custrecord_sim_type', null, 'anyof', type)) };
    if (sim_number != '' && sim_number != null) { filters.push(new nlobjSearchFilter('idtext', null, 'is', sim_number)) };

   

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    //columns[1] = new nlobjSearchColumn('altname');
    columns[1] = new nlobjSearchColumn('custrecord_sim_service_supplier');
    columns[2] = new nlobjSearchColumn('custrecord_sim_imsi');
    columns[3] = new nlobjSearchColumn('custrecord_sim_operator');
    columns[4] = new nlobjSearchColumn('custrecord_sim_type');
    columns[5] = new nlobjSearchColumn('custrecord_sim_pin1');
    columns[6] = new nlobjSearchColumn('custrecord_sim_puk1');
    columns[7] = new nlobjSearchColumn('custrecord_sim_pin2');
    columns[8] = new nlobjSearchColumn('custrecord_sim_puk2');
    columns[9] = new nlobjSearchColumn('custrecord_sim_service_family');

   
    
    
   

    var search = nlapiCreateSearch('customrecord_sim', filters, columns);
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
                sim_id: s[i].id,
                sim_id_name: s[i].getValue('name'),
                sim_number: s[i].getValue('name'),
                ib_vendor_id: s[i].getValue('custrecord_sim_service_supplier'),
                ib_vendor_name: s[i].getText('custrecord_sim_service_supplier'),
                sim_imsi: s[i].getValue('custrecord_sim_imsi'),
                sim_operator_id: s[i].getValue('custrecord_sim_operator'),
                sim_operator_name: s[i].getText('custrecord_sim_operator'),
                sim_type_id: s[i].getValue('custrecord_sim_type'),
                sim_type_name: s[i].getText('custrecord_sim_type'),
                sim_pin1: s[i].getValue('custrecord_sim_pin1'),
                sim_puk1: s[i].getValue('custrecord_sim_puk1'),
                sim_pin2: s[i].getValue('custrecord_sim_pin2'),
                sim_puk2: s[i].getValue('custrecord_sim_puk2'),
                sim_service_family: s[i].getValue('custrecord_sim_service_family'),
                
               
               


            })
        }
    }

    nlapiLogExecution('debug', 'result search', JSON.stringify(result));
    return result;



}

function subscription_Generate(data_for_subscription) {

    var list = [];
    for (var i = 0; i < data_for_subscription.length; i++) {
    var rec = nlapiCreateRecord('customrecord_subscription');

         // Header Fields 
        rec.setFieldValue('custrecord_subs_sim_number', data_for_subscription[i].sub_sim_number); 
        //rec.setFieldValue('custrecord_subs_service_supplier', data_for_subscription[i].sub_sim_vendor); 
        rec.setFieldValue('custrecord_subs_imsi', data_for_subscription[i].sub_sim_imsi); 
        rec.setFieldValue('custrecord_subs_pin1', data_for_subscription[i].sub_sim_pin1); 
        rec.setFieldValue('custrecord_subs_puk1', data_for_subscription[i].sub_sim_puk1); 
        rec.setFieldValue('custrecord_subs_pin2', data_for_subscription[i].sub_sim_pin2); 
        rec.setFieldValue('custrecord_subs_puk2', data_for_subscription[i].sub_sim_puk2); 
        rec.setFieldValue('custrecord_subs_customer', data_for_subscription[i].sub_sim_customer); 
        rec.setFieldValue('custrecord_subs_operator', data_for_subscription[i].sub_sim_operator); 
        //rec.setFieldValue('custrecord_subs_subscription_type', data_for_subscription[i].sub_sim_type); 
        rec.setFieldValue('altname', data_for_subscription[i].name);
        rec.setFieldValue('custrecord_subs_service_provider', data_for_subscription[i].sub_sim_vendor); 
        rec.setFieldValue('custrecord_subs_sim_type', data_for_subscription[i].sub_sim_type);
        rec.setFieldValue('custrecord_service_family', data_for_subscription[i].service_family);
        
        rec.setFieldValue('customform', 29); 
        rec.setFieldValue('custrecord_subs_activation_status', 1); 
        rec.setFieldValue('custrecord_subs_type', 4); 
        

        var id = nlapiSubmitRecord(rec);
        nlapiLogExecution('debug', 'subscription id', id);
        nlapiSubmitField('customrecord_sim', data_for_subscription[i].sub_sim_id, 'custrecord_related_subscription', id)
        nlapiSubmitField('customrecord_sim', data_for_subscription[i].sub_sim_id, 'custrecord_sim_customer', data_for_subscription[i].sub_sim_customer)
        
        var tranid = nlapiLookupField('customrecord_subscription', id, 'name');
        list.push({
            sub_id: id,
            sub_tranid: tranid
        });

       
       
        
                        

    }
    return list;
    
}

function vendors_search() {

    var results = [];
    


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('entityid');
    columns[1] = new nlobjSearchColumn('companyname');
    


    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custentity_is_satellite_service_supplier', null, 'is', 'T')
    


    var search = nlapiCreateSearch('vendor', filters, columns);

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
                name: returnSearchResults[i].getValue('entityid') + ' ' + returnSearchResults[i].getValue('companyname') 
            });

        }
        return results;
    }

    
    
}