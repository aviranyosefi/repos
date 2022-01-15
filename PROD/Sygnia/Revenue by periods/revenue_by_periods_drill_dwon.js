
function RevenueByPeriodsDrillDown() {

    if (request.getMethod() == 'GET') {

        nlapiLogExecution('DEBUG', 'stage one', 'stage one');

        var form = nlapiCreateForm('');
        form.setScript('customscript_revenue_by_periods_cs');
        form.addButton('customscript_marlk_all', 'Export to Excel', 'fnExcelReport()');
        var fromDate = request.getParameter('from')
        var toDate = request.getParameter('to')
        var customer = request.getParameter('customer');
        var project = request.getParameter('project');

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        var startDate = form.addField('custpage_ilo_multi_fromdate', 'date', 'From', null, 'custpage_ilo_searchdetails');
        startDate.setMandatory(true);
        startDate.setDefaultValue(fromDate);
        startDate.setDisplayType('inline');
        
        var totDate = form.addField('custpage_ilo_multi_todate', 'date', 'To', null, 'custpage_ilo_searchdetails');
        totDate.setMandatory(true);
        totDate.setDefaultValue(toDate)
        totDate.setDisplayType('inline');

        var cust = form.addField('custpage_customer', 'select', 'Customer', 'CUSTOMER', 'custpage_ilo_searchdetails');
        cust.setDefaultValue(customer)
        cust.setDisplayType('inline');

        //var projectField = form.addField('custpage_project', 'text', 'Project', null, 'custpage_ilo_searchdetails');
        //projectField.setDefaultValue(project)
        //projectField.setDisplayType('inline');

       
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');

 
        var result = getSearchCustomer(fromDate, toDate, customer, project);
             
        var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'result', null);
            resultsSubList.addField('custpage_result_client', 'text', 'CLIENT')//.setDisplayType('disabled'); 
            resultsSubList.addField('custpage_result_type', 'text', 'TYPE')//.setDisplayType('disabled'); 
            resultsSubList.addField('custpage_result_tranid', 'text', 'DOCUMENT NUMBER')
            resultsSubList.addField('custpage_result_date', 'text', 'DATE')
            resultsSubList.addField('custpage_result_item', 'text', 'ITEM');
            resultsSubList.addField('custpage_result_project', 'text', 'PROJECT');
            resultsSubList.addField('custpage_result_currency', 'text', 'CURRENCY');
            resultsSubList.addField('custpage_result_amount', 'text', 'AMOUNT');
            resultsSubList.addField('custpage_result_period', 'text', 'PERIOD');
            resultsSubList.addField('custpage_result_amount_line', 'text', 'AMOUNT (LINE LEVEL)');
            resultsSubList.addField('custpage_result_rev_arr', 'text', 'REVENUE ARRANGEMENT');
        
 
            for (var j = 0; j < result.length; j++) {
                resultsSubList.setLineItemValue('custpage_result_client', j + 1, result[j].customer)
                resultsSubList.setLineItemValue('custpage_result_type', j + 1, result[j].type)
                resultsSubList.setLineItemValue('custpage_result_tranid', j + 1, result[j].tranid)
                resultsSubList.setLineItemValue('custpage_result_date', j + 1, result[j].trandate)
                resultsSubList.setLineItemValue('custpage_result_item', j + 1, result[j].item)
                resultsSubList.setLineItemValue('custpage_result_project', j + 1, result[j].projectName)
                resultsSubList.setLineItemValue('custpage_result_currency', j + 1, result[j].currency)
                resultsSubList.setLineItemValue('custpage_result_amount', j + 1, result[j].amount)
                resultsSubList.setLineItemValue('custpage_result_period', j + 1, result[j].period)
                resultsSubList.setLineItemValue('custpage_result_amount_line', j + 1, result[j].amount_line)
                resultsSubList.setLineItemValue('custpage_result_rev_arr', j + 1, result[j].rev_arr)
                

       
                }    
    }

   
    response.writePage(form);


}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getSearchCustomer(startDate, endDate, customer, project) {
    var s = nlapiSearchRecord("revenueelement", null,
        [
            ["revenueplan.revenueplantype", "anyof", "ACTUAL"],
            "AND",
            ["accountingbook", "anyof", "1"],
            "AND",
            ["formuladate: to_date('01/'||decode(substr({revenueplan.plannedperiod},1,3),'Jan','01','Feb','02','Mar','03','Apr','04','May','05','Jun','06','Jul','07','Aug','08','Sep','09','Oct','10','Nov','11','Dec','12')||'/'||substr({revenueplan.plannedperiod},5,9),'dd/mm/yyyy')", "within", startDate, endDate],
            "AND",
            ["sourcetransaction.name", "anyof", customer],
            "AND",
            ["entity", "anyof", project]
        ],
        [
            new nlobjSearchColumn("type", "sourceTransaction", null),
            new nlobjSearchColumn("tranid", "sourceTransaction", null),
            new nlobjSearchColumn("trandate", "sourceTransaction", null),
            new nlobjSearchColumn("item"),
            new nlobjSearchColumn("entity"),
            new nlobjSearchColumn("currency"),
            new nlobjSearchColumn("amount", "revenuePlan", null),
            new nlobjSearchColumn("plannedperiod", "revenuePlan", null),
            new nlobjSearchColumn("lineamount", "revenuePlan", null),
            new nlobjSearchColumn("formuladate").setFormula("to_date('01/'||decode(substr({revenueplan.plannedperiod},1,3),'Jan','01','Feb','02','Mar','03','Apr','04','May','05','Jun','06','Jul','07','Aug','08','Sep','09','Oct','10','Nov','11','Dec','12')||'/'||substr({revenueplan.plannedperiod},5,9),'dd/mm/yyyy')"),
            new nlobjSearchColumn("formulatext").setFormula("decode({revenueplan.journal},null,'Unrecognized','Recognized')"),
            new nlobjSearchColumn("journal", "revenuePlan", null),
            new nlobjSearchColumn("revenuearrangement"),
            new nlobjSearchColumn("parent", "customer", null),
            new nlobjSearchColumn("subsidiary"),
            new nlobjSearchColumn("custentity_cseg1", "customer", null),
            new nlobjSearchColumn("custentity_client_since", "customer", null),
            new nlobjSearchColumn("custbody_4601_total_amt", "sourceTransaction", null),
            new nlobjSearchColumn("totalrevenueamount", "sourceTransaction", null),
            new nlobjSearchColumn("custbody_fam_lp_totalprincipal", "sourceTransaction", null),
            new nlobjSearchColumn("custrecord_n336_cseg1"),
            new nlobjSearchColumn("custbody_cseg1", "sourceTransaction", null),
            new nlobjSearchColumn("custcol_cseg1", "sourceTransaction", null)
        ]
    );

    var cols = s[0].getAllColumns();
    var results = [];
    var date = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {

            results.push({
                type: s[i].getText(cols[0]),
                tranid: s[i].getValue(cols[1]),
                trandate: s[i].getValue(cols[2]),
                item: s[i].getText(cols[3]),
                projectName: s[i].getText(cols[4]),
                currency: s[i].getText(cols[5]),
                amount: s[i].getValue(cols[6]),
                period: s[i].getText(cols[7]),
                amount_line: s[i].getValue(cols[8]),
                rev_arr: s[i].getValue(cols[12]),
                customer: s[i].getText(cols[13]),
               
            });
            
        }
    }
    
    nlapiLogExecution('DEBUG', 'results: ' + results.length, JSON.stringify(results));
    return results;
}

