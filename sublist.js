// JavaScript source code
function suitelet_customerEntry(request, response) {
 
    var form, sublist ;

    //GET
    if (request.getMethod() == 'GET') {
        //create form
        nlapiLogExecution('audit', 'request.getMethod():', request.getMethod());
        form = nlapiCreateForm('Test Custom Suitelet Form');

        //create sublist to show results
        sublist = form.addSubList('custpage_sublist_id', 'list', 'Item List');
        

        //form buttons
        form.addSubmitButton('Submit');
        form.addResetButton('Reset');
       // form.addButton('customscript_sublistclient', 'Print', 'sublistTest();');
      

        // run existing saved search
        var searchResults = nlapiSearchRecord(null, 'customsearch586');
        searchResults[0].getAllColumns().forEach(function (col) {
            sublist.addField(getJoinedName(col), 'text', col.getLabel());
            nlapiLogExecution('DEBUG', 'Column Label', col.getLabel());
        });
        var resolvedJoins = searchResults.map(function (sr) {
            var ret = {
                id: sr.getId()
            };
            sr.getAllColumns().forEach(function (col) {
                ret[getJoinedName(col)] = sr.getText(col) || sr.getValue(col);
            });
            return ret;
        });

        form.setScript('customscript_sublistclient');
        sublist.addButton('customscript_sublistclient', 'Print', 'sublistTest()');
        sublist.setLineItemValues(resolvedJoins);

        //additional sublist fields
        //sublist.addMarkAllButtons();
        //sublist.addField('custfield_selected', 'checkbox', 'Selected');


        response.writePage(form);

    }
    else {
        var form = nlapiCreateForm("Suitelet - POST call");
        response.writePage(form);
    }
}

function getJoinedName(col) {
    var join = col.getJoin();
    return join ? col.getName() + '__' + join : col.getName();
}


