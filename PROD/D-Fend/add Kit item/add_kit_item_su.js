function suitelet_print(request, response) {
    if (request.getMethod() == 'GET') {
        var items = itemKitItems();
        var form = nlapiCreateForm('Choose Kit Items');
        form.addSubmitButton('Submit');
        form.addFieldGroup('custpage_batch_group', 'Select Items');
        var subList = form.addSubList('custpage_res_sublist', 'list', 'number of results: ' + items.length, 'custpage_timesheet_group');
        subList.addMarkAllButtons();
        subList.addField('custpage_process', 'checkbox', 'Choose')
        subList.addField('custpage_item_id', 'text', 'Item ID');
        subList.addField('custpage_item', 'text', 'item');
        for (var i = 0; i < items.length; i++) {
            subList.setLineItemValue('custpage_item_id', i + 1, items[i].id);
            subList.setLineItemValue('custpage_item', i + 1, items[i].name);
        }
        form.setScript('customscript_add_kit_item_cs')
        response.writePage(form);
    }
    else {
        var form = nlapiCreateForm('Choose Kit Items');
       
        response.write(form);
    }
    
}



function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function itemKitItems() {

    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn("itemid").setSort(false);

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('type', null, 'anyof', "Kit")

    var search = nlapiCreateSearch('item', filters, columns);
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            results.push({
                name: s[i].getValue('itemid'),
                id: s[i].id
            })
        }
        return results;
    }
}
