function fulfl_status_change_screen(request, response) {

    if (request.getMethod() == 'GET') {
        var form = nlapiCreateForm('Fulfillment Status Change');
        form.addSubmitButton('Submit');
        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');
        //var fromDate = form.addField('custpage_from_date', 'Date', 'From Date', null, 'custpage_ilo_searchdetails')
        //var toDate = form.addField('custpage_to_date', 'Date', 'To Date', null, 'custpage_ilo_searchdetails');
        //toDate.setMandatory(true);
        var region = form.addField('custpage_ilo_region', 'multiselect', 'Region', 'customrecord_cseg_region_test', 'custpage_ilo_searchdetails');
        var city = form.addField('custpage_ilo_city', 'select', 'City', 'customlist_city', 'custpage_ilo_searchdetails');
        var status = form.addField('custpage_ilo_status', 'select', 'Status', null, 'custpage_ilo_searchdetails');
        status.setMandatory(true);
        status.addSelectOption('A', 'Picked');
        status.addSelectOption('B', 'Packed');

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');

        response.writePage(form);
    }
    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne' || request.getParameter('custpage_reresh_search') == 'T') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');

        var regionVal = request.getParameter('custpage_ilo_region');
        var statusVal = request.getParameter('custpage_ilo_status');
        var cityVal = request.getParameter('custpage_ilo_city');

        var form = nlapiCreateForm('Item Fulfillments List');
        form.setScript('customscript_fulfl_status_change_cs')
        form.addButton('customscript_marlk_all', 'Export to Excel', 'fnExcelReport()');
        form.addButton('customscript_print_slips', 'Print Packing Slips', 'printPackingSlips()');
        form.addButton('customscript_print_stiker', 'Print Packing stickers', 'printPackingStickers()');

        var reresh_search = form.addField('custpage_reresh_search', 'checkbox', 'Refresh', null, null);
        reresh_search.setDefaultValue('F');
        reresh_search.setDisplayType('hidden');

        var script = "nlapiSetFieldValue('custpage_reresh_search', 'T'); submitter.click();"

        form.addButton('custpage_edit_button', 'Update Filters', script);

        var region = form.addField('custpage_ilo_region', 'multiselect', 'Region', 'customrecord_cseg_region_test', null);
        region.setDefaultValue(regionVal);
        //region.setDisplayType('inline');
        var city = form.addField('custpage_ilo_city', 'select', 'City', 'customlist_city', null);
        city.setDefaultValue(cityVal);
        //city.setDisplayType('inline');
        var status = form.addField('custpage_ilo_status', 'select', 'Status', null, null);
        status.addSelectOption('A', 'Picked');
        status.addSelectOption('B', 'Packed');
        status.setDefaultValue(statusVal);
        //status.setDisplayType('inline');



        nlapiLogExecution('DEBUG', 'region: ' + regionVal, 'status: ' + statusVal + ' city: ' + cityVal);

        var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'Results', null);
        resultsSubList.addMarkAllButtons();
        resultsSubList.addField('custpage_resultssublist_index', 'text', 'Index');
        resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'check');
        resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'DOCUMENT NUMBER');
        resultsSubList.addField('custpage_resultssublist_trandate', 'text', 'Date');
        resultsSubList.addField('custpage_resultssublist_name', 'text', 'NAME');
        resultsSubList.addField('custpage_resultssublist_so', 'text', 'CREATED FROM');
        resultsSubList.addField('custpage_resultssublist_region', 'text', 'REGION');
        resultsSubList.addField('custpage_resultssublist_city', 'text', 'CITY');
        resultsSubList.addField('custpage_resultssublist_status', 'text', 'Status');
        resultsSubList.addField('custpage_resultssublist_itf_id', 'text', 'itf').setDisplayType('hidden');

        var results = getSearchRows(statusVal, regionVal, cityVal)
        nlapiLogExecution('DEBUG', 'results: ' + results.length, JSON.stringify(results));
        if (results != null && results != []) {
            for (var i = 0; i < results.length; i++) {
                resultsSubList.setLineItemValue('custpage_resultssublist_index', i + 1, i + 1);
                resultsSubList.setLineItemValue('custpage_resultssublist_itf_id', i + 1, results[i].id);
                resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i + 1, results[i].trandate);
                resultsSubList.setLineItemValue('custpage_resultssublist_tranid', i + 1, results[i].tranid);
                resultsSubList.setLineItemValue('custpage_resultssublist_name', i + 1, results[i].entity);
                resultsSubList.setLineItemValue('custpage_resultssublist_so', i + 1, results[i].createdfrom);
                resultsSubList.setLineItemValue('custpage_resultssublist_region', i + 1, results[i].region);
                resultsSubList.setLineItemValue('custpage_resultssublist_city', i + 1, results[i].city);
                resultsSubList.setLineItemValue('custpage_resultssublist_status', i + 1, results[i].status);
            }
        }

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stagetwo');
        checkStage.setDisplayType('hidden');
        form.addSubmitButton('Execute');
        response.writePage(form);
    }
    else if (request.getParameter('custpage_ilo_check_stage') == 'stagetwo') {

        nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');

        var form = nlapiCreateForm('Summery Report');

        var data = [];
        var lineCount = request.getLineItemCount('custpage_results_sublist');

        for (var x = 1; x <= lineCount; x++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', x);
            if (checkBox == 'T') {
                data.push({
                    itf_id: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_itf_id', x),
                    itf_tranid: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_tranid', x),
                    status: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_status', x),
                    sales_order: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_so', x),
                    region: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_region', x),
                    city: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_city', x),
                });
            }
        }
        nlapiLogExecution('DEBUG', 'fulfilment', JSON.stringify(data));
        if (data.length > 0) {
            var getUserMail = nlapiGetContext().getEmail();
            var htmlField1 = form.addField('custpage_header1', 'inlinehtml');
            htmlField1.setDefaultValue("<span style='font-size:18px'>The process has been submited and is currently in progress... <br/> An email with the summary of the results will be sent to : <b> " + getUserMail + "</b> once completed.<br></span>");
            try { nlapiScheduleScript('customscript_fulfl_status_change_ss', 'customdeploy_fulfl_status_change_ss', { custscript_data: JSON.stringify(data) }) } catch (e) { }
        }
        response.writePage(form);
    }
}

//functions

function getSearchRows(status, region, city) {

    var search = nlapiLoadSearch(null, 'customsearch_pending_fulfillments');
    search.addFilter(new nlobjSearchFilter('status', null, 'anyof', "ItemShip:" + status));
    if (!isNullOrEmpty(region)) {
        search.addFilter(new nlobjSearchFilter('custbody_so_region', null, 'anyof', region.split("\u0005")));
    }
    if (!isNullOrEmpty(city)) {
        search.addFilter(new nlobjSearchFilter('custentity_customer_city', 'customer', 'anyof', city));
    }

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
    if (s != null) {
        s.forEach(function (element) {
            results.push({
                id: element.id,
                trandate: element.getValue("trandate"),
                tranid: element.getValue("tranid"),
                entity: element.getText('entity'),
                createdfrom: element.getText('createdfrom'),
                region: element.getText('custbody_so_region'),
                status: element.getValue('statusref'),
                city: element.getText("custentity_customer_city", "customer", null)
            })
        });
    }
    return results;
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
