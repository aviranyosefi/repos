
function services_update_screen(request, response) {
    var form = nlapiCreateForm('Monthly Billing Report');
    if (request.getMethod() == 'GET') {
        var editMode = false;
        nlapiLogExecution('DEBUG', 'stage one', 'stage one');
        form.addSubmitButton('Submit');
        form.addFieldGroup('custpage_ilo_searchdetails', 'Date Range');
        var fromDate = form.addField('custpage_from_date', 'Date', 'From Date', null, 'custpage_ilo_searchdetails')
        var toDate = form.addField('custpage_to_date', 'Date', 'To Date', null, 'custpage_ilo_searchdetails');
        toDate.setMandatory(true);
        var execDate = form.addField('custpage_exe_date', 'Date', 'Execution Date', null, 'custpage_ilo_searchdetails');
        execDate.setMandatory(true);
        
        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');

        form.setScript('customscript_valid_monthly_bill_date');
        response.writePage(form);
    }
    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');

        var FromD = request.getParameter('custpage_from_date');
        var ToD = request.getParameter('custpage_to_date');
        var ExeD = request.getParameter('custpage_exe_date');
        //var strFrom = nlapiDateToString(FromD);
        //var strTo = nlapiDateToString(ToD);

        var formTitle = 'Monthly Billing Report  ' + ToD + ' - ' + ExeD;

        var SecondForm = nlapiCreateForm(formTitle);

        var employee = nlapiGetContext();
        var employeeId = employee.user;

        nlapiLogExecution('DEBUG', 'dates set emp:' + employeeId, 'dates: ' + FromD + ' - ' + ToD);

        nlapiSubmitField('employee', employeeId, 'custentity_financial_report_from_date', FromD);
        nlapiSubmitField('employee', employeeId, 'custentity_fin_report_to_date', ToD);
        nlapiSubmitField('employee', employeeId, 'custentity_financial_report_exec_date', ExeD);
        
        nlapiLogExecution('DEBUG', 'dates has been setted!', 'dates: ' + FromD + ' - ' + ToD);

        //nlapiSetRedirectURL('tasklink', 'LIST_SEARCHRESULTS', null, null, 'customsearch_nr_monthly_billing'); 
        //nlapiSetRedirectURL('tasklink', 'LIST_SEARCHRESULTS', '367', null, 'customsearch_nr_monthly_billing'); 


        var paramsurl = new Array();
        paramsurl['searchid'] = "customsearch_nr_monthly_billing";
        //paramsurl['date'] = 'TODAY';
        nlapiSetRedirectURL('TASKLINK', "LIST_SEARCHRESULTS", null, null, paramsurl);


        
        /*
        var fromDate = SecondForm.addField('custpage_from_date', 'Date', 'From', null, null);
        fromDate.setDefaultValue(FromD);
        var toDate = SecondForm.addField('custpage_to_date', 'Date', 'To', null, null);
        toDate.setDefaultValue(ToD);

        if (FromD != '' && ToD != '') {
            var results = Search();
            SecondForm.addButton('Edit', 'Edit Fields', 'field_edit');
        }
        if (editMode == true) {
            var resultsSubList = SecondForm.addSubList('custpage_results_sublist', 'editor', 'Results', null);
        }
        else {
            var resultsSubList = SecondForm.addSubList('custpage_results_sublist', 'list', 'Results', null);
        }

        var res_Name = resultsSubList.addField('custpage_resultssublist_name', 'text', 'Name');
        var res_LegacySysNum = resultsSubList.addField('custpage_resultssublist_legacysysnum', 'text', 'Legacy System Number');   
        var res_SalesRep = resultsSubList.addField('custpage_resultssublist_salerep', 'text', 'Sales Rep');
        var res_BalanceUSD = resultsSubList.addField('custpage_resultssublist_balanceusd', 'float', 'Balance USD');
        var res_BalanceOrigCurr = resultsSubList.addField('custpage_resultssublist_balanceorigcurr', 'float', 'Balance Orig Curr');
        var res_MaxOfCurr = resultsSubList.addField('custpage_resultssublist_maxofcurr', 'text', 'Maximum Of Currency');
        var res_CountOfCurr = resultsSubList.addField('custpage_resultssublist_countofcurr', 'float', 'Count Of Currency');
        var res_CurrUSDBalance = resultsSubList.addField('custpage_resultssublist_currusdbalance', 'float', 'Current USD Balance');
        var res_FutureUSDBalance = resultsSubList.addField('custpage_resultssublist_futureusdbalance', 'float', 'Future USD Balance');
        var res_TotalAddPayment = resultsSubList.addField('custpage_resultssublist_totaddpayment', 'float', 'Total Additional Payment');

        if (results != null && results != []) {
            for (var i = 0; i < results.length; i++) {
                nlapiLogExecution('DEBUG', 'resultsSubList_Load_Start', results[i].name);
                resultsSubList.setLineItemValue('custpage_resultssublist_name', i + 1, results[i].name);
                resultsSubList.setLineItemValue('custpage_resultssublist_legacysysnum', i + 1, results[i].legNumber);
                resultsSubList.setLineItemValue('custpage_resultssublist_salerep', i + 1, results[i].salesRep);
                resultsSubList.setLineItemValue('custpage_resultssublist_balanceusd', i + 1, results[i].balanceUsd);
                resultsSubList.setLineItemValue('custpage_resultssublist_balanceorigcurr', i + 1, results[i].balanceOrigCurr);
                resultsSubList.setLineItemValue('custpage_resultssublist_maxofcurr', i + 1, results[i].maxCurr);
                resultsSubList.setLineItemValue('custpage_resultssublist_countofcurr', i + 1, results[i].countCurr);
                resultsSubList.setLineItemValue('custpage_resultssublist_currusdbalance', i + 1, results[i].CurrUSDBalance);
                resultsSubList.setLineItemValue('custpage_resultssublist_futureusdbalance', i + 1, results[i].FuturUSDBalance);
                resultsSubList.setLineItemValue('custpage_resultssublist_totaddpayment', i + 1, results[i].totAddPament);
                nlapiLogExecution('DEBUG', 'resultsSubList_Load_End', results[i].totAddPament);
            }
        }
        //checkStage.setDefaultValue('stageOne');
        //checkStage.setDisplayType('hidden');
        SecondForm.addSubmitButton('Execute');
        response.writePage(SecondForm);
        */
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
function Search() {
    var filters = new Array();
    var s = [];
    var searchid = 0;
    var columns = new Array();

    var search = nlapiLoadSearch(null, 'customsearch_nr_monthly_billing');
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
        var result = [];
        for (var i = 0; i < s.length; i++) {
            result.push({
                name: s[i].getText('entity', null, "GROUP"),
                legNumber: s[i].getValue('custentity_legacy_system_number','customer','GROUP'),
                salesRep: s[i].getText('salesrep',null,'GROUP'),
                balanceUsd: s[i].getValue(cols[3]),
                balanceOrigCurr: s[i].getValue(cols[4]),
                maxCurr: s[i].getValue('currency', null, 'MAX'),
                countCurr: s[i].getValue('currency', null, 'COUNT'),
                CurrUSDBalance: s[i].getText(cols[7]),
                FuturUSDBalance: s[i].getText(cols[8]),
                totAddPament: s[i].getText(cols[9]),
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