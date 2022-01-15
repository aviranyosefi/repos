function suitelet_print(request, response) {

    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'stage first', 'stage first');

        var form = nlapiCreateForm('');
        form.addSubmitButton('Submit');

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        form.addField('custpage_item', 'select', 'item', 'item', 'custpage_ilo_searchdetails');

        form.addField('custpage_location', 'select', 'location', 'location', 'custpage_ilo_searchdetails');
    
        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('1');
        checkStage.setDisplayType('hidden');

    }
    else if (request.getParameter('custpage_ilo_check_stage') == '1') {
        nlapiLogExecution('DEBUG', 'stage 1', 'stage 1');

        var form = nlapiCreateForm('');

        var item = request.getParameter('custpage_item');
        var location = request.getParameter('custpage_location');
        var results = getSerials(item, location);

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'Results', null);
        resultsSubList.addMarkAllButtons() 
        resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
        resultsSubList.addField('custpage_resultssublist_item', 'text', 'item')
        resultsSubList.addField('custpage_resultssublist_serial', 'text', 'SERIAL/LOT NUMBER')
        resultsSubList.addField('custpage_resultssublist_batch', 'text', 'Batch')
        resultsSubList.addField('custpage_resultssublist_on_hand', 'text', 'on hand')
      
        if (results != null && results != []) {
            for (var i = 0; i < results.length; i++) {
                resultsSubList.setLineItemValue('custpage_resultssublist_item', i + 1, results[i].item);
                resultsSubList.setLineItemValue('custpage_resultssublist_serial', i + 1, results[i].inventorynumber);
                resultsSubList.setLineItemValue('custpage_resultssublist_batch', i + 1, results[i].manufacturer_lot);
                resultsSubList.setLineItemValue('custpage_resultssublist_on_hand', i + 1, results[i].quantityonhand);             
            }
        }

        var checkType = form.addField('custpage_ilo_check_stage', 'text', 'check', null, null);
        checkType.setDefaultValue('2');
        checkType.setDisplayType('hidden');
    
        form.addSubmitButton('Next');
     
    }
    else if (request.getParameter('custpage_ilo_check_stage') == '2') {
        nlapiLogExecution('DEBUG', 'stage 1', 'stage 1');

        var form = nlapiCreateForm('');
        var LinesNo = request.getLineItemCount('custpage_results_sublist');
        var SumOfOnHand = 0;
        for (var i = 1; i <= LinesNo; i++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i);
            if (checkBox == 'T') {
                SumOfOnHand += Number(request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_on_hand', i))
            }
        }
        var sumField = form.addField("custpage_sum", "inlinehtml", "", null, null);
        sumField.setDefaultValue('<font size="3"><p style="color:blue;font-size:3"><b>Sum Of On Hand: ' + SumOfOnHand + '<br></b></p>');    
              
    }
    response.writePage(form);

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function getSerials(item , location) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('inventorynumber');
    columns[1] = new nlobjSearchColumn('item');
    columns[2] = new nlobjSearchColumn('quantityonhand');
    columns[3] = new nlobjSearchColumn('quantityavailable');
    columns[4] = new nlobjSearchColumn('custitemnumber_manufacturer_lot');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('item', null, 'anyof', item)
    filters[1] = new nlobjSearchFilter('location', null, 'anyof', location)
    filters[2] = new nlobjSearchFilter('isonhand', null, 'is', 'T')

    var search = nlapiCreateSearch('inventorynumber', filters, columns);

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
}

