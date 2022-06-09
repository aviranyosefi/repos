function suitelet_print(request, response) {
    var form = nlapiCreateForm('');
    form.setScript('customscript_med_inv_setmulti_cs');

    if (request.getMethod() == 'GET' && request.getParameter('custpage_ilo_check_stage') == null) {
        nlapiLogExecution('DEBUG', 'stage first', 'stage first');

        form.addSubmitButton('Submit');

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        form.addField('custpage_item', 'select', 'item', 'item', 'custpage_ilo_searchdetails');

        //form.addField('custpage_location', 'select', 'location', 'location', 'custpage_ilo_searchdetails');

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('1');
        checkStage.setDisplayType('hidden');

    }
    else if (request.getParameter('custpage_ilo_check_stage') == '1' || request.getLineItemCount('custpage_results_sublist') == 0) {
        nlapiLogExecution('DEBUG', 'stage 1', 'stage 1');

        var batchfld = form.addField('custpage__manufacturer_lot', 'select', 'Batch Number', 'customrecord_medicane_lot');
        var statusfld = form.addField('custpage_status', 'select', 'Status', 'inventorystatus');

        var item = request.getParameter('custpage_item');
        var location = request.getParameter('custpage_location');
        var status = request.getParameter('custpage_status');
        var batch = request.getParameter('custpage__manufacturer_lot');

        if (batch != null && batch != 'null' && batch != '') {
            batchfld.setDefaultValue(batch);
            batchfld.setDisplayType('disabled');
        }

        if (status != null && status != 'null' && status != '') {
            statusfld.setDefaultValue(status);
            statusfld.setDisplayType('disabled');
        }
        //var location = request.getParameter('custpage_location');
        var results = getSerials(item, location, status, batch);//, location

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');
        var itemtext = "";
        try { itemtext = (results != null && results != []) ? results[0].id : ""; } catch (e) { };
        var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'Please select inventory for item: ' + itemtext, null);
        resultsSubList.addMarkAllButtons();
        resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
        //resultsSubList.addField('custpage_resultssublist_item', 'text', 'item')
        //resultsSubList.addField('custpage_resultssublist_displayitem', 'text', 'Display Name')
        resultsSubList.addField('custpage_resultssublist_serial', 'text', 'SERIAL/LOT NUMBER')
        resultsSubList.addField('custpage_resultssublist_on_hand', 'text', 'On Hand')
        resultsSubList.addField('custpage_resultssublist_status', 'text', 'Status')
        resultsSubList.addField('custpage_resultssublist_available', 'text', 'available')
        resultsSubList.addField('custpage_resultssublist_expdate', 'text', 'Exp Date')
        resultsSubList.addField('custpage_resultssublist_location', 'text', 'Location')
        resultsSubList.addField('custpage_resultssublist_batch', 'text', 'Batch')


        if (results != null && results != []) {
            for (var i = 0; i < results.length; i++) {
                //resultsSubList.setLineItemValue('custpage_resultssublist_item', i + 1, results[i].id);
                //resultsSubList.setLineItemValue('custpage_resultssublist_displayitem', i + 1, results[i].item);
                resultsSubList.setLineItemValue('custpage_resultssublist_serial', i + 1, results[i].inventorynumber);
                resultsSubList.setLineItemValue('custpage_resultssublist_on_hand', i + 1, results[i].quantityonhand);
                resultsSubList.setLineItemValue('custpage_resultssublist_status', i + 1, results[i].status);
                resultsSubList.setLineItemValue('custpage_resultssublist_available', i + 1, results[i].quantityavailable);
                resultsSubList.setLineItemValue('custpage_resultssublist_location', i + 1, results[i].location);
                resultsSubList.setLineItemValue('custpage_resultssublist_expdate', i + 1, results[i].exp);
                resultsSubList.setLineItemValue('custpage_resultssublist_batch', i + 1, results[i].batch);

            }
        }

        var checkType = form.addField('custpage_ilo_check_stage', 'text', 'check', null, null);
        checkType.setDefaultValue('2');
        checkType.setDisplayType('hidden');
        var itemfld = form.addField('custpage_item', 'text', 'check', null, null);
        itemfld.setDefaultValue(item);
        itemfld.setDisplayType('hidden');
        var locationfld = form.addField('custpage_location', 'text', 'check', null, null);
        locationfld.setDefaultValue(location);
        locationfld.setDisplayType('hidden');

        var script = "window.onbeforeunload=function() { null;};document.getElementById('custpage_ilo_check_stage').value = '1'; document.getElementById('main_form').isvalid='true';document.getElementById('main_form').submit(); ";

        form.addButton('custombutton', 'Filter', script);
        form.addSubmitButton('Next');


    }
    else if (request.getParameter('custpage_ilo_check_stage') == '2' )
        {
        nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');

        var LinesNo = request.getLineItemCount('custpage_results_sublist');
        var SumOfOnHand = 0;
        var batchArr = '';
        var serialsArr = [];
        for (var i = 1; i <= LinesNo; i++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);
            if (checkBox == 'T') {
                SumOfOnHand += Number(request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_on_hand', i));
                batchArr += request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_serial', i) + ', ';
                var serialsJSON = {};
                serialsJSON.serial = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_serial', i);
                serialsJSON.quantity = Number(request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_on_hand', i));
                serialsJSON.status = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_status', i);

                serialsArr.push(JSON.stringify(serialsJSON));
            }
        }
        var sumField = form.addField("custpage_sum", "inlinehtml", "", null, null).setDisplayType('hidden');;
        sumField.setDefaultValue('<font size="3"><p style="color:blue;font-size:3"><b>Sum Of On Hand: ' + SumOfOnHand + '<br></b></p>');

        var serialsField = form.addField("custpage_serials", "inlinehtml", "", null, null);
       // serialsField.setDefaultValue('<font size="3"><p style="color:blue;font-size:3"><b>serials: ' +  JSON.stringify(serialsArr) + '<br></b></p>');
        serialsField.setDefaultValue('<font size="3"><p style="color:blue;font-size:3"><b>Proccessing.. Please wait <br></b></p>');

        var scriptField = form.addField("custpage_script", "inlinehtml", "", null, null);

        var qty = SumOfOnHand;
        var num = serialsArr.join(';');

        form.addField("custpage_qty", "text", "", null, null).setDisplayType('hidden').setDefaultValue(qty);
        form.addField("custpage_num", "longtext", "", null, null).setDisplayType('hidden').setDefaultValue(num);

        form.setScript('customscript_med_inv_setmulti_cs');



    }
    response.writePage(form);

}






function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || val == "null" || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getSerials(item, location, status, batch) {

    var filters = new Array();
    var s = [];
    var result = [];
    var searchid = 0;
    var columns = new Array();

    var search = nlapiLoadSearch('inventorybalance', 'customsearch_inv_balance');
    search.columns[6].setSort();
    if (!isNullOrEmpty(item)) {
        search.addFilter(new nlobjSearchFilter('item', null, 'anyof', item));
    }
    if (!isNullOrEmpty(location)) {
        search.addFilter(new nlobjSearchFilter('location', null, 'anyof', location));
    }

    if (!isNullOrEmpty(status)) {
        search.addFilter(new nlobjSearchFilter('status', null, 'anyof', status));
    }

    if (!isNullOrEmpty(batch)) {
        search.addFilter(new nlobjSearchFilter('custitemnumber_md_batch_number', 'inventorynumber', 'anyof', batch));
    }


    var runSearch = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s.length > 0) {
        for (var i = 0; i < s.length; i++) {
            result.push({
                id: s[i].getText('item', null, null),
                inventorynumber: s[i].getValue('inventorynumber', 'inventorynumber', null),
                item: s[i].getValue('displayname', null, null),
                quantityonhand: s[i].getValue("onhand", null, null),
                quantityavailable: s[i].getValue("available", null, null),
                location: s[i].getText("location", null, null),
                status: s[i].getText("status", null, null),
                exp: s[i].getValue("expirationdate", 'inventorynumber', null),
                batch: s[i].getText("custitemnumber_md_batch_number", 'inventorynumber', null),
            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach bill result ', JSON.stringify(result));
    return result;



}




/*
 *     var columns = new Array();
    columns[0] = new nlobjSearchColumn('inventorynumber');
    columns[1] = new nlobjSearchColumn('item');
    columns[2] = new nlobjSearchColumn('quantityonhand');
    columns[3] = new nlobjSearchColumn('quantityavailable');
    columns[4] = new nlobjSearchColumn('custitemnumber_manufacturer_lot');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('item', null, 'anyof', item);
    filters[1] = new nlobjSearchFilter('location', null, 'anyof', location);
    filters[2] = new nlobjSearchFilter('isonhand', null, 'is', 'T');

    var search = nlapiCreateSearch('item', filters, columns);

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

        for (var i = 0; i < s.length; i++) {

            results.push({

                id: s[i].id,
                inventorynumber: s[i].getValue('inventorynumber'),
                item: s[i].getText('item'),
                quantityonhand: s[i].getValue('quantityonhand'),
                quantityavailable: s[i].getValue('quantityavailable'),
                manufacturer_lot: s[i].getValue('custitemnumber_manufacturer_lot'),
            });

        }
        return results;
    }
    */