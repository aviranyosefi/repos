var dateArr = [];
function RevenueByPeriods() {

    if (request.getMethod() == 'GET') {

        nlapiLogExecution('DEBUG', 'stage one', 'stage one');

        var form = nlapiCreateForm('');

        form.addSubmitButton('Search');

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        var startDate = form.addField('custpage_ilo_multi_fromdate', 'date', 'From', null, 'custpage_ilo_searchdetails');
        //startDate.setLayoutType('outside', 'startrow');
        startDate.setMandatory(true);
        startDate.setDefaultValue(nlapiDateToString(new Date()))



        var totDate = form.addField('custpage_ilo_multi_todate', 'date', 'To', null, 'custpage_ilo_searchdetails');
        //totDate.setLayoutType('outside', 'startrow');
        totDate.setMandatory(true);
        totDate.setDefaultValue(nlapiDateToString(new Date()))

        form.addField('custpage_customer', 'select', 'Customer', 'CUSTOMER', 'custpage_ilo_searchdetails');

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('2');
        checkStage.setDisplayType('hidden');


    }

    else if (request.getParameter('custpage_ilo_check_stage') == '2') { // change to something less broad

        nlapiLogExecution('DEBUG', 'stage two', 'stage two');

        try {
            var form = nlapiCreateForm('Details');
            //form.addSubmitButton('Next');     
            form.setScript('customscript_revenue_by_periods_cs');
            form.addButton('customscript_marlk_all', 'Export to Excel', 'fnExcelReport()');
            var customer = request.getParameter('custpage_customer');
            var fromDateData = request.getParameter('custpage_ilo_multi_fromdate');
            var toDateData = request.getParameter('custpage_ilo_multi_todate');


            var checkType = form.addField('custpage_ilo_check_stage', 'text', 'check', null, null);
            checkType.setDefaultValue('3');
            checkType.setDisplayType('hidden');

            var fromDate = form.addField('custpage_ilo_multi_fromdate', 'date', 'from', null, null);
            fromDate.setDefaultValue(fromDateData)
            fromDate.setDisplayType('inline');

            var toDate = form.addField('custpage_ilo_multi_todate', 'date', 'To', null, null);
            toDate.setDefaultValue(toDateData)
            toDate.setDisplayType('inline');

            var customerF = form.addField('custpage_customer', 'select', 'customer', 'customer', null);
            customerF.setDefaultValue(customer)
            customerF.setDisplayType('inline');

            if (isNullOrEmpty(customer)) {
                var result = getSearch(fromDateData, toDateData);
            }
            else {
                var result = getSearchCustomer(fromDateData, toDateData, customer);
            }
            nlapiLogExecution('DEBUG', 'result: ' + result.length, JSON.stringify(result));
            var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'result', null);

            resultsSubList.addField('custpage_result_sub', 'text', 'SUBSIDIARY')//.setDisplayType('disabled'); 
            resultsSubList.addField('custpage_result_client', 'text', 'Client')
            resultsSubList.addField('custpage_result_project', 'text', 'project')
            resultsSubList.addField('custpage_result_region', 'text', 'region');
            resultsSubList.addField('custpage_result_reco_status', 'text', 'RECOGNITION STATUS');
            resultsSubList.addField('custpage_result_service_line', 'text', 'SERVICE LINE');
            resultsSubList.addField('custpage_result_eng_type', 'text', 'ENGAGEMENT TYPE');
     
            for (var h = 0; h < dateArr.length; h++) {
                resultsSubList.addField('custpage_date' + parseInt((h + 1)), 'text', dateArr[h]);
            }

            resultsSubList.addField('custpage_result_total', 'text', 'Total');

            var customer = '';
            var project = '';
            var reco = '';
            var line = 0;
            var amount = 0;
            var totalAmount = 0;
            var amountPerDate = [];
            for (var j = 0; j < result.length; j++) {

                if (result[j].client != customer || result[j].project != project || result[j].RECOGNITIONSTATUS != reco) {

                    if (j != 0) {
                        resultsSubList.setLineItemValue('custpage_result_total', line, amount.toFixed(2));
                        totalAmount += Number(amount);
                        amount = 0;
                    }
                    customer = result[j].client;
                    project = result[j].project;
                    reco = result[j].RECOGNITIONSTATUS;
                    line = line + 1;

                    var clientName = "<a href='https://4999252-sb1.app.netsuite.com/app/site/hosting/scriptlet.nl?script=572&deploy=1" + '&from=' + fromDateData + '&to=' + toDateData + '&customer=' + result[j].client + '&project=' + result[j].project + "'" + 'target="_blank">' + result[j].clientName + "</a>";
                    //https://4999252-sb1.app.netsuite.com/app/site/hosting/scriptlet.nl?script=572&deploy=1&from=com.netledger.app.common.scripting.version1.nlobjFieldImplV1@5a52cf06&to=com.netledger.app.common.scripting.version1.nlobjFieldImplV1@7b98fdc4&customer=1148
                    resultsSubList.setLineItemValue('custpage_result_sub', line, result[j].subsidiaryName)
                    resultsSubList.setLineItemValue('custpage_result_client', line, clientName)
                    resultsSubList.setLineItemValue('custpage_result_project', line, result[j].projectName)
                    resultsSubList.setLineItemValue('custpage_result_region', line, result[j].region)
                    resultsSubList.setLineItemValue('custpage_result_reco_status', line, result[j].RECOGNITIONSTATUS);
                    resultsSubList.setLineItemValue('custpage_result_service_line', line, result[j].service_line);
                    resultsSubList.setLineItemValue('custpage_result_eng_type', line, result[j].eng_type);


                    for (var h = 0; h < dateArr.length; h++) {
                        if (dateArr[h] == result[j].date) {
                            resultsSubList.setLineItemValue('custpage_date' + parseInt((h + 1)), line, result[j].amount);
                            try {
                                var currAmount = amountPerDate[h + 1].sum;
                            } catch (e) { var currAmount = 0; }
                            amountPerDate[h + 1] = {
                                sum: Number(currAmount) + Number(result[j].amount)
                            }
                            amount += Number(result[j].amount);
                        }
                    }
                }
                else {
                    for (var h = 0; h < dateArr.length; h++) {
                        if (dateArr[h] == result[j].date) {
                            resultsSubList.setLineItemValue('custpage_date' + parseInt((h + 1)), line, result[j].amount);
                            try {
                                var currAmount = amountPerDate[h + 1].sum;
                            } catch (e) { var currAmount = 0; }
                            amountPerDate[h + 1] = {
                                sum: Number(currAmount) + Number(result[j].amount)
                            }
                            amount += Number(result[j].amount);
                        }
                    }

                }


            }
            resultsSubList.setLineItemValue('custpage_result_sub', line + 1, 'Total');
            for (var h = 0; h < dateArr.length; h++) {
                resultsSubList.setLineItemValue('custpage_date' + parseInt((h + 1)), line + 1, (amountPerDate[h + 1].sum).toFixed(2));
            }
            resultsSubList.setLineItemValue('custpage_result_total', line + 1, totalAmount.toFixed(2));

        }
        catch (e) {
            nlapiLogExecution('DEBUG', 'stage two error', e);
        }

    }


    response.writePage(form);


}


function getSearch(startDate, endDate) {

    var s = nlapiSearchRecord("revenueelement", null,
        [
            ["revenueplan.revenueplantype", "anyof", "ACTUAL"],
            "AND",
            ["accountingbook", "anyof", "1"],
            "AND",
            ["formuladate: to_date('01/'||decode(substr({revenueplan.plannedperiod},1,3),'Jan','01','Feb','02','Mar','03','Apr','04','May','05','Jun','06','Jul','07','Aug','08','Sep','09','Oct','10','Nov','11','Dec','12')||'/'||substr({revenueplan.plannedperiod},5,9),'dd/mm/yyyy')", "within", startDate, endDate]
        ],
        [
            new nlobjSearchColumn("subsidiary", null, "GROUP"),
            new nlobjSearchColumn("parent", "customer", "GROUP"),
            new nlobjSearchColumn("custentity_service_line", "customer", "GROUP"),
            new nlobjSearchColumn("custcol_cseg1", "sourceTransaction", "MAX"),
            new nlobjSearchColumn("entity", null, "GROUP"),
            new nlobjSearchColumn("formuladate", null, "GROUP").setFormula("to_date('01/'||decode(substr({revenueplan.plannedperiod},1,3),'Jan','01','Feb','02','Mar','03','Apr','04','May','05','Jun','06','Jul','07','Aug','08','Sep','09','Oct','10','Nov','11','Dec','12')||'/'||substr({revenueplan.plannedperiod},5,9),'dd/mm/yyyy')").setSort(false),
            new nlobjSearchColumn("postingperiod", "revenuePlan", "GROUP"),
            new nlobjSearchColumn("formulatext", null, "GROUP").setFormula("decode({revenueplan.journal},null,'Unrecognized','Recognized')"),
            new nlobjSearchColumn("lineamount", "revenuePlan", "SUM"),
            new nlobjSearchColumn("formulatext", null, "GROUP").setFormula("{customer.custentity_project_engagement_type}")
        ]
    );
    var cols = s[0].getAllColumns()
    var results = [];
    var date = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {

            results.push({
                subsidiary: s[i].getValue(cols[0]),
                subsidiaryName: s[i].getText(cols[0]),
                clientName: s[i].getText(cols[1]),
                client: s[i].getValue(cols[1]),
                region: s[i].getValue(cols[3]),
                projectName: s[i].getText(cols[4]),
                project: s[i].getValue(cols[4]),
                date: s[i].getValue(cols[5]),
                RECOGNITIONSTATUS: s[i].getValue(cols[7]),
                amount: s[i].getValue(cols[8]),
                service_line: s[i].getText(cols[2]),
                eng_type: s[i].getValue(cols[9]),

            });
            date[s[i].getValue(cols[5])] = {
                date: s[i].getValue(cols[5]),
            }
        }
    }
    dateArr = Object.keys(date);

    results.sort(dynamicSortMultiple("subsidiary", "client", "project", "RECOGNITIONSTATUS", "date"));

    nlapiLogExecution('DEBUG', 'results: ' + results.length, JSON.stringify(results));
    return results;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getSearchCustomer(startDate, endDate, customer) {
    var s = nlapiSearchRecord("revenueelement", null,
        [
            ["revenueplan.revenueplantype", "anyof", "ACTUAL"],
            "AND",
            ["accountingbook", "anyof", "1"],
            "AND",
            ["formuladate: to_date('01/'||decode(substr({revenueplan.plannedperiod},1,3),'Jan','01','Feb','02','Mar','03','Apr','04','May','05','Jun','06','Jul','07','Aug','08','Sep','09','Oct','10','Nov','11','Dec','12')||'/'||substr({revenueplan.plannedperiod},5,9),'dd/mm/yyyy')", "within", startDate, endDate],
            "AND",
            ["sourcetransaction.name", "anyof", customer]
        ],
        [
            new nlobjSearchColumn("subsidiary", null, "GROUP"),
            new nlobjSearchColumn("parent", "customer", "GROUP"),
            new nlobjSearchColumn("custentity_service_line", "customer", "GROUP"),
            new nlobjSearchColumn("custcol_cseg1", "sourceTransaction", "MAX"),
            new nlobjSearchColumn("entity", null, "GROUP"),
            new nlobjSearchColumn("formuladate", null, "GROUP").setFormula("to_date('01/'||decode(substr({revenueplan.plannedperiod},1,3),'Jan','01','Feb','02','Mar','03','Apr','04','May','05','Jun','06','Jul','07','Aug','08','Sep','09','Oct','10','Nov','11','Dec','12')||'/'||substr({revenueplan.plannedperiod},5,9),'dd/mm/yyyy')"),
            new nlobjSearchColumn("postingperiod", "revenuePlan", "GROUP"),
            new nlobjSearchColumn("formulatext", null, "GROUP").setFormula("decode({revenueplan.journal},null,'Unrecognized','Recognized')"),
            new nlobjSearchColumn("lineamount", "revenuePlan", "SUM"),
            new nlobjSearchColumn("formulatext", null, "GROUP").setFormula("{customer.custentity_project_engagement_type}")
        ]
    );

    var cols = s[0].getAllColumns()
    var results = [];
    var date = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {

            results.push({
                subsidiary: s[i].getValue(cols[0]),
                subsidiaryName: s[i].getText(cols[0]),
                clientName: s[i].getText(cols[1]),
                client: s[i].getValue(cols[1]),
                region: s[i].getValue(cols[3]),
                projectName: s[i].getText(cols[4]),
                project: s[i].getValue(cols[4]),
                date: s[i].getValue(cols[5]),
                RECOGNITIONSTATUS: s[i].getValue(cols[7]),
                amount: s[i].getValue(cols[8]),
                service_line: s[i].getText(cols[2]),
                eng_type: s[i].getValue(cols[9]),
            });
            date[s[i].getValue(cols[5])] = {
                date: s[i].getValue(cols[5]),
            }
        }
    }
    dateArr = Object.keys(date);

    results.sort(dynamicSortMultiple("subsidiary", "client", "project", "RECOGNITIONSTATUS", "date"));

    nlapiLogExecution('DEBUG', 'results: ' + results.length, JSON.stringify(results));
    return results;
}

function dynamicSort(property) {

    if (property == 'date') {
        return function (obj1, obj2) {
            return new Date(obj1.date) - new Date(obj2.date);
        }
    }
    else {
        return function (obj1, obj2) {
            return obj1[property] > obj2[property] ? 1
                : obj1[property] < obj2[property] ? -1 : 0;
        }
    }
}

function dynamicSortMultiple() {

    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

function getAmount(dateArr, date, amount) {
    if (dateArr == date) {
        return amount
    }
    return '';
}