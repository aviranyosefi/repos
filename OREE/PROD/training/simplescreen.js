
function services_update_screen(request, response) {
    var form = nlapiCreateForm('record type test List');
    if (request.getMethod() == 'GET') {
        var editMode = false;
        nlapiLogExecution('DEBUG', 'stage one', 'stage one');
        form.addSubmitButton('Submit');
        form.addFieldGroup('custpage_ilo_searchdetails', 'Date Range'); 
        var fromDate = form.addField('custpage_from_date', 'Date', 'From', null, 'custpage_ilo_searchdetails'); 
        fromDate.setMandatory(true);
        var toDate = form.addField('custpage_to_date', 'Date', 'To', null, 'custpage_ilo_searchdetails');
        toDate.setMandatory(true);
        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');
        response.writePage(form);
    }
    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');
        var formTitle = 'Install Base List';
        
        var SecondForm = nlapiCreateForm(formTitle);
        
        var FromD = request.getParameter('custpage_from_date');
        var ToD = request.getParameter('custpage_to_date');
        var fromDate = SecondForm.addField('custpage_from_date', 'Date', 'From', null, null);
        fromDate.setDefaultValue(FromD);
        var toDate = SecondForm.addField('custpage_to_date', 'Date', 'To', null, null); 
        toDate.setDefaultValue(ToD);
        if (FromD != '' && ToD != '') {
            var results = Search(FromD, ToD);
            SecondForm.addButton('Edit', 'Edit Fields', 'field_edit'); 
        }
        if (editMode == true) {
            var resultsSubList = SecondForm.addSubList('custpage_results_sublist', 'editor', 'Results', null);
        }
        else {
            var resultsSubList = SecondForm.addSubList('custpage_results_sublist', 'list', 'Results', null);
        }
        resultsSubList.addField('custpage_custrecord11', 'checkbox', 'Check Box');
        resultsSubList.addField('custpage_name', 'text', 'Name');
        resultsSubList.addField('custpage_custrecord9', 'text', 'Phone Number');
        resultsSubList.addField('custpage_custrecord10', 'text', 'Date Field');
        resultsSubList.addField('custpage_custrecord12', 'text', 'Date\Time Field');
        resultsSubList.addField('custpage_custrecord13', 'text', 'Currency');

        if (results != null && results != []) {
            for (var i = 0; i < results.length; i++) {
                nlapiLogExecution('DEBUG', 'resultsSubList_Load_Start', results[i].custrecord11);
                resultsSubList.setLineItemValue('custpage_custrecord11', i + 1, results[i].custrecord11);
                resultsSubList.setLineItemValue('custpage_name', i + 1, results[i].name);
                resultsSubList.setLineItemValue('custpage_custrecord9', i + 1, results[i].custrecord9);
                resultsSubList.setLineItemValue('custpage_custrecord10', i + 1, results[i].custrecord10);
                resultsSubList.setLineItemValue('custpage_custrecord12', i + 1, results[i].custrecord12);
                resultsSubList.setLineItemValue('custpage_custrecord13', i + 1, results[i].custrecord13);
                nlapiLogExecution('DEBUG', 'resultsSubList_Load_End', results[i].custrecord13);
            }
        }
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');
        SecondForm.addSubmitButton('Execute');
        response.writePage(SecondForm);
    }
    //else if (request.getParameter('custpage_ilo_check_stage') == 'stagetwo') {
    //    var thirdForm = nlapiCreateForm('Services Update Screen - finish');
    //    //var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
    //    //form.addFieldGroup('custpage_ilo_searchdetails2', 'Search Again');
    //    //var secFromDate = form.addField('custpage_from_date', 'Date', 'From', null, 'custpage_ilo_searchdetails2');
    //    //secFromDate.setDefaultValue(request.getParameter('FromD'));
    //    //var secToDate = form.addField('custpage_to_date', 'Date', 'To', null, 'custpage_ilo_searchdetails2');
    //    //secToDate.setDefaultValue(request.getParameter('ToD'));
    //   // checkStage.setDefaultValue('stageOne');
    //    //checkStage.setDisplayType('hidden');
    //    response.writePage(thirdForm);
    //}
    //else {
    //    var lastForm = nlapiCreateForm('Services Update Screen - finish');
    //    response.writePage(lastForm);
    //}
} // services_update_screen function - end

//functions
function Search(FromD, ToD) {
    nlapiLogExecution('DEBUG', 'stage one', 'FromD:' + FromD + 'ToD:' + ToD);
    var filters = new Array();
    var s = [];
    var searchid = 0;
    var columns = new Array();
    filters[0] = new nlobjSearchFilter('custrecord10', null, 'onorafter', FromD);
    filters[1] = new nlobjSearchFilter('custrecord10', null, 'onorbefore', ToD);
    //filters[2] = new nlobjSearchFilter('custrecord10', null, 'within', FromD, ToD );

    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('custrecord9');
    columns[2] = new nlobjSearchColumn('custrecord10');
    columns[3] = new nlobjSearchColumn('custrecord11');
    columns[4] = new nlobjSearchColumn('custrecord12');
    columns[5] = new nlobjSearchColumn('custrecord13');

    var search = nlapiCreateSearch('customrecord192', filters, columns);
    var runSearch = search.runSearch();

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
                name: s[i].getValue('name'),
                custrecord9: s[i].getValue('custrecord9'),
                custrecord10: s[i].getValue('custrecord10'),
                custrecord11: s[i].getValue('custrecord11'),
                custrecord12: s[i].getValue('custrecord12'),
                custrecord13: s[i].getText('custrecord13'),
            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach result ', JSON.stringify(result));
    return result;
}

function field_edit() {
    var flowcontrol = document.getElementById('custpage_ilo_check_stage');
    flowcontrol.value = 'EditMode';


}