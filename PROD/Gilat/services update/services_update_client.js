
function go_back() {
    var linkBack = nlapiGetFieldValue('custpage_ilo_to_back_home');  
    window.location.href = linkBack;
    
    
}


//var isMandatory = false;
//var isMandatory_leader = false;
//var isMandatory_item = false;
function save() {
    var action = nlapiGetFieldValue('custpage_ilo_multi_action')
    var site = nlapiGetFieldValue('custpage_ilo_multi_site');
    var site_leader = nlapiGetFieldValue('custpage_ilo_multi_leader_site');
    var item = nlapiGetFieldValue('custpage_ilo_multi_item');
    //if ((action == 17 || action == 10 || action == 18 || action == 11) && site == '') {
    //    alert("Please enter value(s) for: SITE")
    //    //isMandatory = false;
    //    return false;
    //}
    if (action ==9 && site_leader == '') {
        alert("Please enter value(s) for: LEADER SITE ")
        //isMandatory_leader = false;
        return false;
    }
    if (action==30 && item == '') {
        alert("Please enter value(s) for: ITEM ")
        //isMandatory_item = false;
        return false;
    }
    else return true;
}

function customer_field(type, name) {

    if (name == 'custpage_ilo_multi_customer') {

        var customer = nlapiGetFieldValue('custpage_ilo_multi_customer')

        if (customer != null && customer != '') {
            var sites = customer_site(customer);
            var subs = customer_subs(customer);
            var leader_site = customer_leader(customer);
            var currency = customer_currency(customer);

            nlapiRemoveSelectOption('custpage_ilo_multi_site')
            nlapiRemoveSelectOption('custpage_ilo_multi_subscription')
            nlapiRemoveSelectOption('custpage_ilo_multi_leader_site')
            nlapiRemoveSelectOption('custpage_ilo_multi_currency');

            if (sites != null && sites != '' && sites != undefined) {
                nlapiInsertSelectOption('custpage_ilo_multi_site', '', '', false)
                for (var i = 0; i < sites.length; i++) {
                    nlapiInsertSelectOption('custpage_ilo_multi_site', sites[i].id, sites[i].name, false)
                }
            }

            if (subs != null) {
                nlapiInsertSelectOption('custpage_ilo_multi_subscription', '', '', false)
                for (var i = 0; i < subs.length; i++) {
                    nlapiInsertSelectOption('custpage_ilo_multi_subscription', subs[i].id, subs[i].name, false)
                }
            }

            if (leader_site != null) {
                nlapiInsertSelectOption('custpage_ilo_multi_leader_site', '', '', false)
                for (var i = 0; i < leader_site.length; i++) {
                    nlapiInsertSelectOption('custpage_ilo_multi_leader_site', leader_site[i].id, leader_site[i].name, false)
                }
            }

            if (currency != null) {
                nlapiInsertSelectOption('custpage_ilo_multi_currency', '', '', false)
                for (var i = 0; i < currency.length; i++) {
                    nlapiInsertSelectOption('custpage_ilo_multi_currency', currency[i].id, currency[i].name, false)
                }
            }

            // customer action
            var lineOfBusinessValue = nlapiLookupField('customer', customer, 'custentity_customer_line_of_business')
            getAction(lineOfBusinessValue)
        }


    }
    else if (name == 'custpage_ilo_multi_action') {

        var action = nlapiGetFieldValue('custpage_ilo_multi_action')
        var site = nlapiGetFieldValue('custpage_ilo_multi_site');
        //if (action == 17 || action == 10 || action == 18 || action == 11) {
        //    nlapiSetFieldMandatory('custpage_ilo_multi_site', true)
        //    //isMandatory = true;
        //}
        //else {
        //    nlapiSetFieldMandatory('custpage_ilo_multi_site', false)
        //    //isMandatory = false;
        //}

        //if (action != '' && site != '') { checkValidation(action, site); }

        if (action == 9) {
            nlapiSetFieldMandatory('custpage_ilo_multi_leader_site', true)
            //isMandatory_leader = true;
        }
        else {
            nlapiSetFieldMandatory('custpage_ilo_multi_leader_site', false)
            //isMandatory_leader = false;
        }
        if (action == 30 || action == 29) {
            nlapiSetFieldMandatory('custpage_ilo_multi_item', true)
            //isMandatory_item = true;
        }
        else {
            nlapiSetFieldMandatory('custpage_ilo_multi_item', false)
            //isMandatory_item = false;
        }

        //SubscriptionFields(action)



    }
    else if (name == 'custpage_ilo_multi_site') {

        var action = nlapiGetFieldValue('custpage_ilo_multi_action')
        site = nlapiGetFieldValue('custpage_ilo_multi_site');

        if (action != '' && site != '') { checkValidation(action, site); }


    }
    else if (name == 'custpage_resultssublist_checkbox') {     
            $toggleBoxes = document.querySelectorAll('.checkbox_ck');
            nlapiSetFieldValue('custpage_ilo_counter', $toggleBoxes.length, null, null);       
    }
}

function customer_site(customer){


    var results = [];



    var columns = new Array();
    columns[0] = new nlobjSearchColumn('altname');
    columns[1] = new nlobjSearchColumn('name');



    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_site_customer', null, 'is', customer)



    var search = nlapiCreateSearch('customrecord_site', filters, columns);

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
                name: returnSearchResults[i].getValue('name') +' ' + returnSearchResults[i].getValue('altname')
            });

        }
        return results;
    }

}

function customer_subs(customer) {

    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('altname');
    // columns[1] = new nlobjSearchColumn('companyname');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_subs_customer', null, 'anyof', customer)



    var search = nlapiCreateSearch('customrecord_subscription', filters, columns);

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

function customer_leader(customer) {


    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('altname');
    columns[1] = new nlobjSearchColumn('name');



    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_site_customer', null, 'is', customer)
    filters[1] = new nlobjSearchFilter('custrecord_site_pipe', null, 'is', 'T')


    var search = nlapiCreateSearch('customrecord_site', filters, columns);

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

function checkValidation(action ,site) {

   
    var site_status = nlapiLookupField('customrecord_site', site, 'custrecord_site_status')

    if (action == 10 && site_status != 2) { // Re-connection and Temporary Disconnection
        alert("Site’s status is not valid for the chosen action")
        nlapiSetFieldValue('custpage_ilo_multi_site', '')
    }
    else if (action == 11 && site_status != 4) {// Re-connection - Start Billing' and Temporary Disconnection - Stop Billing
        alert("Site’s status is not valid for the chosen action")
        nlapiSetFieldValue('custpage_ilo_multi_site', '')
    }

}

function customer_currency(customer) {
    var results = [];
    var rec = nlapiLoadRecord('customer', customer);
    var count = rec.getLineItemCount('currency');
    if (count > 0) {
        for (var i = 1; i <= count; i++) {
            var currency_id = rec.getLineItemValue('currency', 'currency', i)
            //var currency_name = GetCurrency(currency_id);
            //if (currency_name == '' || currency_name == null || currency_name == undefined) currency_name = rec.getLineItemValue('currency', 'displaysymbol', i)
            var currency_name = getCurrencyName(currency_id);
            results.push({
                id: currency_id,
                name: currency_name ,
            });

        }
    }
    return results;       
}

function GetCurrency(currency) {

    if (currency == '10') {
        return 'ILS'
    }
    else if (currency == '1') {
        return 'USD'
    }
    else if (currency == '5') {
        return 'GBP'
    }
    else if (currency == '6') {
        return 'GHS'
    }
    else if (currency == '4') {
        return 'EUR'
    }

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

function getAction(lineOfBusinessValue) {

    nlapiRemoveSelectOption('custpage_ilo_multi_action');
    nlapiInsertSelectOption('custpage_ilo_multi_action', '', '', false)
    if (lineOfBusinessValue == '1') { // FSS    
        nlapiInsertSelectOption('custpage_ilo_multi_action', '3', 'Site Downgrade', false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '19', 'Site Upgrade' , false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '25', 'Site Service Provider Change', false)
        nlapiInsertSelectOption('custpage_ilo_multi_action' ,'8', 'Site Price Change' , false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '7', 'Site Permanent Disconnection', false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '17', 'Site Temporary Disconnection' , false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '18' ,'Site Temporary Disconnection – Stop Billing', false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '10', 'Site Re-connection' , false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '11', 'Site Re-connection - Start Billing', false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '23', 'Site BW Change', false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '9', 'Site Pipe Quality of Service Change', false)



    }
    else if (lineOfBusinessValue == '2') {
        
        nlapiInsertSelectOption('custpage_ilo_multi_action', '26', 'Subscription Service Deactivation', false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '27', 'Subscription Service Suspension', false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '28', 'Subscription Service Unsuspension', false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '29', 'Subscription Service Change', false)
        nlapiInsertSelectOption('custpage_ilo_multi_action', '30', 'Subscription Service Price Change', false)
        
    }
}



function MarkAll() {
    var LineCount = nlapiGetLineItemCount('custpage_results_sublist');
    if (LineCount != 0) {

        for (var i = 0; i < LineCount; i++) {
            nlapiSetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i + 1, 'T');
        }
        $toggleBoxes = document.querySelectorAll('.checkbox_ck');
        nlapiSetFieldValue('custpage_ilo_counter', $toggleBoxes.length, null, null);
    }
}


function UnmarkAll() {
    var LineCount = nlapiGetLineItemCount('custpage_results_sublist');
    if (LineCount != 0) {

        for (var i = 0; i < LineCount; i++) {
            nlapiSetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i + 1, 'F');
        }
        nlapiSetFieldValue('custpage_ilo_counter', 0, null, null);
    }
}
