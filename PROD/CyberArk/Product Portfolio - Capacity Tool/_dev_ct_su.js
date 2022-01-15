function CapacityTool(request, response) {

    var form = nlapiCreateForm('Capacity Tool - Assessments - Reporting Tool');
    form.setScript('customscript_dev_ct_cs');
    form.addSubmitButton('Refresh');
    form.addButton('customscript_clean', 'Clean Fillters', 'Clean()')
    form.addButton('customscript_continue', 'Submit', 'Submit()')
    form.addButton('customscript_create', 'Create', 'Create()')
    form.addFieldGroup('custpage_search_group', 'Filters');

    var selectPeriodFrom = form.addField('custpage_select_periodfrom', 'select', 'Period', null, 'custpage_search_group').setLayoutType('midrow');
    selectPeriodFrom.setMandatory(true);
    selectPeriodFrom.addSelectOption('', '');
    var periodVal = request.getParameter('custpage_select_periodfrom')
    for (var i = 0; i < accPeriods.length; i++) {
        selectPeriodFrom.addSelectOption(accPeriods[i].periodID, accPeriods[i].periodname);
    }
    if (isNullOrEmpty(periodVal)) {
        var date = new Date()
        var periodVal = getPeriod(date, 'previous');
    }
    selectPeriodFrom.setDefaultValue(periodVal);

    var type = form.addField('custpage_type', 'select', 'Assessment Type', null, 'custpage_search_group').setLayoutType('midrow');
    var typeVal = request.getParameter('custpage_type');
    type.addSelectOption('', '');
    type.addSelectOption(1, 'Actual');
    type.addSelectOption(2, 'Forecast');
    type.setDefaultValue(typeVal);

    var submitted_type = form.addField('custpage_submitted_type', 'select', 'SUBMISSION STATUS', null, 'custpage_search_group').setLayoutType('midrow');
    var submitted_typeVal = request.getParameter('custpage_submitted_type');
    submitted_type.addSelectOption('', '');
    submitted_type.addSelectOption(1, 'Submitted');
    submitted_type.addSelectOption(2, 'Not Submitted');
    submitted_type.setDefaultValue(submitted_typeVal);

    var employee = form.addField('custpage_employee', 'multiselect', 'employee', 'employee', 'custpage_search_group').setLayoutType('midrow');
    var employeeVal = request.getParameter('custpage_employee');
    employee.setDefaultValue(employeeVal)

    var user = nlapiGetUser();
    var empType = getEmpType(user);
    var empTypeField = form.addField('custpage_user_type', 'text', 'employee', null, 'custpage_search_group').setDisplayType('hidden');
    empTypeField.setDefaultValue(empType);

    var reportersVal = '';
    if (empType == '4') { // admin
        var reportersList = repoterList();
        var reporters = form.addField('custpage_select_reporters', 'multiselect', 'Reporter', null, 'custpage_search_group').setLayoutType('midrow');
        reporters.addSelectOption('', '');
        reportersVal = request.getParameter('custpage_select_reporters')
        for (var i = 0; i < reportersList.length; i++) {
            reporters.addSelectOption(reportersList[i].id, reportersList[i].name);
        }
        reporters.setDefaultValue(reportersVal);
    }

    var product_div = form.addField('custpage_product_div', 'multiselect', 'Product Division', null, 'custpage_search_group').setLayoutType('midrow');
    var getPRODUCTDIVISIONs = getPRODUCTDIVISION()
    for (var i = 0; i < getPRODUCTDIVISIONs.length; i++) {
        product_div.addSelectOption(getPRODUCTDIVISIONs[i].internalid, getPRODUCTDIVISIONs[i].name);
    }
    var product_divVal = request.getParameter('custpage_product_div');
    product_div.setDefaultValue(product_divVal)

    var product_grp = form.addField('custpage_product_grp', 'multiselect', 'Product Group', null, 'custpage_search_group').setLayoutType('midrow');
    var PRODUCTGROUPs = getPRODUCTGROUP()
    var product_grpVal = request.getParameter('custpage_product_grp');
    for (var i = 0; i < PRODUCTGROUPs.length; i++) {
        product_grp.addSelectOption(PRODUCTGROUPs[i].internalid, PRODUCTGROUPs[i].name);
    }
    product_grp.setDefaultValue(product_grpVal)

    var settings = getSettings()
    addSettingFields(form, settings, periodVal, empType)
    if (empType == '2') {
        var empResults = getReporterEmp(user)
    }
    else if (empType == '4') {
        var empResults = null;
    }
    nlapiLogExecution('debug', 'empResults func', JSON.stringify(empResults))
    var Lines = getLines(empResults, periodVal, employeeVal, typeVal, reportersVal, product_grpVal, product_divVal, submitted_typeVal)
    nlapiLogExecution('debug', 'Lines func', JSON.stringify(Lines))
    if (Lines.length > 0) {
        form.addButton('customscript_export', 'Export to Excel', 'fnExcelReport()');
        var subList = form.addSubList('custpage_sublist', 'INLINEEDITOR', 'Results', 'custpage_recipient_group');
        subList.addButton('customscript_marlk_all', 'Mark All', 'MarkAll()');
        subList.addButton('customscript_un_marlk_all', 'Unmark All', 'UnmarkAll()');
        subList.addButton('customscript_submit_all', 'Submit All Valid Forecasts', 'SubmitAll()')
        subList.addButton('customscript_create_actual_all', 'Create Actuals Based on Submitted Forecasts', 'CreateActualAll()')
        subList.addButton('customscript_submit_all', 'Submit All Valid Actuals', 'SubmitAllActuals()')
        subList.addField('custpage_result_cb', 'checkbox', 'CB')
        subList.addField('custpage_ct_id', 'text', 'CT ID').setDisplayType('disabled');
        subList.addField('custpage_emp_id', 'text', 'Employee ID').setDisplayType('disabled');
        subList.addField('custpage_f_name', 'text', 'First Name').setDisplayType('disabled');
        subList.addField('custpage_l_name', 'text', 'Last Name').setDisplayType('disabled');
        subList.addField('custpage_job_titel', 'text', 'Job Title (Official)').setDisplayType('disabled');
        subList.addField('custpage_pd', 'text', 'Product division').setDisplayType('disabled');
        subList.addField('custpage_pg', 'text', 'Product group').setDisplayType('disabled');
        subList.addField('custpage_ol_name', 'text', 'Office location Name').setDisplayType('disabled');
        subList.addField('custpage_segment', 'select', 'Segment', 'customlist_ct_segment').setDisplayType('disabled');
        subList.addField('custpage_ia', 'select', 'Investment area', 'customrecord_ct_investment_area')
        subList.addField('custpage_npd', 'integer', 'New Func')
        subList.addField('custpage_appm', 'integer', 'Existing Func')
        subList.addField('custpage_maintenance', 'integer', 'KTLO')
        //subList.addField('custpage_cc', 'integer', 'CC').
        subList.addField('custpage_total', 'text', 'Total').setDisplayType('disabled');
        var at_field = subList.addField('custpage_at', 'select', 'Assessment Type', null).setDisplayType('disabled');
        at_field.addSelectOption(1, 'Actual');
        at_field.addSelectOption(2, 'Forecast');
        subList.addField('custpage_submit_type', 'select', 'Submission Status', 'customlist_submitted_type').setDisplayType('disabled');
        if (empType == '4') {
            subList.addField('custpage_last_mod', 'text', 'Last modified').setDisplayType('disabled');
            subList.addField('custpage_last_mod_by', 'text', 'Last modified by').setDisplayType('disabled');
        }

        subList.addField('custpage_total_aggregated', 'select', 'Validation Status', 'customlist_validation_type').setDisplayType('disabled');
        subList.addField('custpage_submit', 'text', 'submit').setDisplayType('disabled');
        subList.addField('custpage_create_actual', 'text', 'CREATE ACTUAL').setDisplayType('disabled');
        subList.addField('custpage_acual_id', 'text', 'CT ACUAL ID').setDisplayType('hidden');
        subList.addField('custpage_cc', 'integer', 'CC').setDisplayType('hidden');
        for (var x = 0; x < Lines.length; x++) {
            subList.setLineItemValue('custpage_result_cb', x + 1, 'T');
            subList.setLineItemValue('custpage_emp_id', x + 1, Lines[x].emp_id);
            subList.setLineItemValue('custpage_f_name', x + 1, Lines[x].emp_f_name);
            subList.setLineItemValue('custpage_l_name', x + 1, Lines[x].emp_l_name);
            subList.setLineItemValue('custpage_job_titel', x + 1, Lines[x].emp_job_title);
            subList.setLineItemValue('custpage_pd', x + 1, Lines[x].emp_product_div);
            subList.setLineItemValue('custpage_pg', x + 1, Lines[x].emp_product_group);
            subList.setLineItemValue('custpage_ol_name', x + 1, Lines[x].emp_office_loc_name);
            subList.setLineItemValue('custpage_segment', x + 1, Lines[x].segment);
            subList.setLineItemValue('custpage_ia', x + 1, Lines[x].investment);
            subList.setLineItemValue('custpage_npd', x + 1, Lines[x].npd);
            subList.setLineItemValue('custpage_maintenance', x + 1, Lines[x].maint);
            subList.setLineItemValue('custpage_appm', x + 1, Lines[x].appm);
            subList.setLineItemValue('custpage_cc', x + 1, Lines[x].cc);
            subList.setLineItemValue('custpage_total', x + 1, (Lines[x].total).toString());
            subList.setLineItemValue('custpage_at', x + 1, Lines[x].type);
            subList.setLineItemValue('custpage_submit_type', x + 1, Lines[x].submit);
            if (empType == '4') {
                subList.setLineItemValue('custpage_last_mod', x + 1, Lines[x].lastmodified);
                subList.setLineItemValue('custpage_last_mod_by', x + 1, Lines[x].lastmodifiedby);
            }
            subList.setLineItemValue('custpage_total_aggregated', x + 1, Lines[x].total_aggregated);
            subList.setLineItemValue('custpage_ct_id', x + 1, Lines[x].id);
            subList.setLineItemValue('custpage_acual_id', x + 1, Lines[x].acual_id);
        }
    }
    var line_press = form.addField('custpage_line_press', 'integer', 'line_press', null, null)
    line_press.setDisplayType('hidden');

    var date = form.addField("custpage_last_date", "inlinehtml", "", null, null);
    date.setDefaultValue('<script>(function($){$(function($, undefined){$(".uir-machine-table-container").css("max-height", "70vh").bind("scroll", (event) => {$(event.target).find(".uir-machine-headerrow > td,.uir-list-headerrow > td").css({"transform": `translate(0, ${event.target.scrollTop}px)`,"z-index": "9999","position": "relative"});}).bind("scroll", (event) => {$(".machineButtonRow > table").css("transform", `translate(${event.target.scrollLeft}px)`);});});})(jQuery);</script>');

    sortFields(form)
    markFields(form)
    form.addButton('customscript_create_forcast', 'Add Assessment Row', 'CreateForcast()')
    response.writePage(form)
}
var accPeriods = getAccountingPeriods();
function getAccountingPeriods() {

    var allResults = [];

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('startdate', null, 'notbefore', '01/01/2021');
    filters[1] = new nlobjSearchFilter('isyear', null, 'is', 'F');
    filters[2] = new nlobjSearchFilter('isquarter', null, 'is', 'F');

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('periodname');
    columns[1] = new nlobjSearchColumn('internalid');
    columns[2] = new nlobjSearchColumn('startdate').setSort();

    var searchresults = nlapiSearchRecord('accountingperiod', null, filters, columns);

    if (searchresults != null) {
        searchresults.forEach(function (line) {

            allResults.push({
                periodname: line.getValue('periodname'),
                periodID: line.getValue('internalid')
            });

        });
    }

    return allResults;
}
function getReporterEmp(user) {
    //nlapiLogExecution('debug', 'user', user)
    var search = nlapiLoadSearch(null, 'customsearch_ct_employee_population');
    search.addFilter(new nlobjSearchFilter('custentity_ct_tool_reporter', null, 'anyof', user));
    var s = [];
    var searchid = 0;
    var resultset = search.runSearch();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    var res = [];
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            res.push(s[i].id)
        }
    }
    res.push(user)

    return res;
}
//CT_Reporting_Entity Search
function getLines(empResults, periodVal, employeeVal, typeVal, reportersVal, product_grpVal, product_divVal, submitted_typeVal) {

    var search = nlapiLoadSearch(null, 'customsearch_ct_reporting_entity');
    if (!isNullOrEmpty(empResults)) { search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', empResults)); }
    search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', periodVal));
    if (!isNullOrEmpty(employeeVal)) { search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', employeeVal.split("\u0005"))); }
    if (!isNullOrEmpty(typeVal)) { search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', typeVal)); }
    if (!isNullOrEmpty(reportersVal)) { search.addFilter(new nlobjSearchFilter('custentity_ct_tool_reporter', 'custrecord_ct_rep_ent_employee', 'anyof', reportersVal.split("\u0005"))); }
    if (!isNullOrEmpty(product_grpVal)) { search.addFilter(new nlobjSearchFilter('custentity_ct_emp_product_group', 'custrecord_ct_rep_ent_employee', 'anyof', product_grpVal.split("\u0005"))); }
    if (!isNullOrEmpty(product_divVal)) { search.addFilter(new nlobjSearchFilter('custentity_ct_emp_product', 'custrecord_ct_rep_ent_employee', 'anyof', product_divVal.split("\u0005"))); }
    if (!isNullOrEmpty(submitted_typeVal)) { search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_submit_checkbox', null, 'anyof', submitted_typeVal)); }

    var newColumns = new Array();
    newColumns.push(new nlobjSearchColumn('custrecord_ct_rep_ent_submit_checkbox'));
    newColumns.push(new nlobjSearchColumn('custrecord_ct_acual_id'));

    search.addColumns(newColumns);
    var s = [];
    var searchid = 0;
    var resultset = search.runSearch();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    var res = [];
    if (s != null) {
        var LinesPercentForcast = getLinesPercent(empResults, periodVal, employeeVal, 2, reportersVal, product_grpVal, product_divVal)
        var LinesPercentActual = getLinesPercent(empResults, periodVal, employeeVal, 1, reportersVal, product_grpVal, product_divVal)
        for (var i = 0; i < s.length; i++) {
            nlapiLogExecution('debug', 'i', i)
            var total_aggregated = 0
            var npd = s[i].getValue("custrecord_ct_rep_ent_npd");
            var maint = s[i].getValue("custrecord_ct_rep_ent_maint");
            var appm = s[i].getValue("custrecord_ct_rep_ent_appm");
            var cc = s[i].getValue("custrecord_ct_rep_ent_cc");
            var emp_id = s[i].getValue('custrecord_ct_rep_ent_employee')
            var type = s[i].getValue("custrecord_ct_rep_ent_type");
            if (type == 1) {
                if (LinesPercentActual[emp_id] != undefined) {
                    var total_aggregated = getPercentType(LinesPercentActual[emp_id].percent)
                }
            }
            else {
                if (LinesPercentForcast[emp_id] != undefined) {
                    var total_aggregated = getPercentType(LinesPercentForcast[emp_id].percent)
                }
            }
            res.push({
                id: s[i].id,
                emp_id: emp_id,
                emp_f_name: s[i].getValue("firstname", "CUSTRECORD_CT_REP_ENT_EMPLOYEE", null),
                emp_l_name: s[i].getValue("lastname", "CUSTRECORD_CT_REP_ENT_EMPLOYEE", null),
                emp_job_title: s[i].getValue("title", "CUSTRECORD_CT_REP_ENT_EMPLOYEE", null),
                emp_product_div: s[i].getText("custentity_ct_emp_product", "CUSTRECORD_CT_REP_ENT_EMPLOYEE", null),
                emp_product_group: s[i].getText("custentity_ct_emp_product_group", "CUSTRECORD_CT_REP_ENT_EMPLOYEE", null),
                emp_office_loc_name: s[i].getText("custentity_ct_employee_office", "CUSTRECORD_CT_REP_ENT_EMPLOYEE", null),
                segment: s[i].getValue("custrecord_ct_rep_ent_segment"),
                investment: s[i].getValue("custrecord_ct_rep_ent_invest_area"),
                npd: npd,
                maint: maint,
                appm: appm,
                cc: cc,
                total: Number(npd) + Number(maint) + Number(appm) + Number(cc),
                type: type,
                lastmodified: s[i].getValue("lastmodified"),
                lastmodifiedby: s[i].getText("custrecord_ct_last_reporter"),
                total_aggregated: total_aggregated,
                submit: getSubmit(s[i].getValue("custrecord_ct_rep_ent_submit_checkbox"), total_aggregated, s[i].id),
                acual_id: s[i].getValue("custrecord_ct_acual_id"),
            });
        }
    }
    return res;
}
function getLinesPercent(empResults, periodVal, employeeVal, typeVal, reportersVal, product_grpVal, product_divVal, submitted_typeVal) {
    var search = nlapiLoadSearch(null, 'customsearch_ct_reporting_entity_2');
    if (!isNullOrEmpty(empResults)) { search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', empResults)); }
    search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', periodVal));
    if (!isNullOrEmpty(employeeVal)) { search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', employeeVal.split("\u0005"))); }
    if (!isNullOrEmpty(typeVal)) { search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', typeVal)); }
    if (!isNullOrEmpty(reportersVal)) { search.addFilter(new nlobjSearchFilter('custentity_ct_tool_reporter', 'custrecord_ct_rep_ent_employee', 'anyof', reportersVal.split("\u0005"))); }
    if (!isNullOrEmpty(product_grpVal)) { search.addFilter(new nlobjSearchFilter('custentity_ct_emp_product_group', 'custrecord_ct_rep_ent_employee', 'anyof', product_grpVal.split("\u0005"))); }
    if (!isNullOrEmpty(product_divVal)) { search.addFilter(new nlobjSearchFilter('custentity_ct_emp_product', 'custrecord_ct_rep_ent_employee', 'anyof', product_divVal.split("\u0005"))); }
    if (!isNullOrEmpty(submitted_typeVal)) { search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_submit_checkbox', null, 'anyof', submitted_typeVal)); }

    var s = [];
    var searchid = 0;
    var resultset = search.runSearch();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    var res = [];
    if (s != null) {
        var cols = search.getColumns();
        for (var i = 0; i < s.length; i++) {
            res[s[i].getValue('custrecord_ct_rep_ent_employee', null, "GROUP")] = {
                percent: s[i].getValue(cols[1])
            }
        }
    }
    return res;
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function format(num) {

    return Number(num.toString().substring(0, num.toString().indexOf(".")))

}
function getPercentType(percent) {
    if (percent == 100) { return 1 }
    else { return 2 }
}
function getSettings() {
    var fields = [];
    fields.push('custrecord_ct_grace_days_actual_reportin')
    fields.push('custrecord_ct_grace_days_frcast_rep')

    var settings = nlapiLookupField('customrecord_ct_notif_time_control', 1, fields);
    return settings;
}
function addSettingFields(form, settings, periodVal, empType) {
    var forcatValidation = true;
    var actualValidation = true;
    if (empType == '2') {
        var date = new Date()
        var todayDay = date.getDate();
        var previous_period = getPeriod(date, 'previous');
        var lock_actual = settings.custrecord_ct_grace_days_actual_reportin
        if (todayDay < lock_actual && periodVal == previous_period) {
            var actualValidation = false;
        }
        var today_period = getPeriod(date, 'today');
        var lock_forcat = settings.custrecord_ct_grace_days_frcast_rep
        if (today_period < periodVal || (today_period == periodVal && todayDay < lock_forcat)) {
            var forcatValidation = false;
        }
    }
    else if (empType == '4') {
        var actualValidation = false;
        var forcatValidation = false;
    }

    var periodValName = nlapiLookupField('accountingperiod', periodVal, 'periodname')
    var period_name = form.addField('custpage_period_name', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
    period_name.setDefaultValue("<html><body align='center'><p align='center'  style='font-size:20px'><b><u>Period: " + periodValName + '</u></b></body></html>');

    var lock_actual_field = form.addField('custpage_auto_lock_actual', 'text', 'Actual Auto lock', null, null).setDisplayType('hidden');
    lock_actual_field.setDefaultValue(actualValidation);

    var lock_forcastform = form.addField('custpage_auto_lock_forcast', 'text', 'Forecast Auto lock', null, null).setDisplayType('hidden');
    lock_forcastform.setDefaultValue(forcatValidation);


    var string = 'Period Status: '
    var period_status_actual = form.addField('custpage_period_status_actual', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
    var acutalDueDate = '';
    if (!actualValidation && empType == '2') {
        var month = date.getMonth() + 1
        acutalDueDate = ' Due Date: '
        acutalDueDate += lock_actual + '/' + month + '/' + date.getFullYear();

    }
    period_status_actual.setDefaultValue("<p style='font-size:20px'><b><u>Actual " + string + '</u></b>' + chekTrueOrFalse(actualValidation) + acutalDueDate);

    var forcatDueDate = '';
    if (!forcatValidation && empType == '2' && today_period == periodVal) {
        var month = date.getMonth() + 1
        forcatDueDate = ' Due Date: '
        forcatDueDate += lock_forcat + '/' + month + '/' + date.getFullYear();

    }
    var period_status_forcast = form.addField('custpage_period_status_forcast', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
    period_status_forcast.setDefaultValue("<p style='font-size:20px'><b><u>Forecast " + string + '</u></b>' + chekTrueOrFalse(forcatValidation) + forcatDueDate);


}
function sortFields(form) {
    var sort_fname = form.addField('custpage_sort_fname', 'text', 'custpage_ac_id', null, null).setDisplayType('hidden');
    sort_fname.setDefaultValue('asc');
    var sort_lname = form.addField('custpage_sort_lname', 'text', 'custpage_ac_id', null, null).setDisplayType('hidden');
    sort_lname.setDefaultValue('asc');
    var sort_job = form.addField('custpage_sort_job', 'text', 'custpage_ac_id', null, null).setDisplayType('hidden');
    sort_job.setDefaultValue('asc');
    var sort_pdiv = form.addField('custpage_sort_pdiv', 'text', 'custpage_ac_id', null, null).setDisplayType('hidden');
    sort_pdiv.setDefaultValue('asc');
    var sort_pgrp = form.addField('custpage_sort_pgrp', 'text', 'custpage_ac_id', null, null).setDisplayType('hidden');
    sort_pgrp.setDefaultValue('asc');
    var sort_office = form.addField('custpage_sort_office', 'text', 'custpage_ac_id', null, null).setDisplayType('hidden');
    sort_office.setDefaultValue('asc');
    var sort_seg = form.addField('custpage_sort_seg', 'text', 'custpage_ac_id', null, null).setDisplayType('hidden');
    sort_seg.setDefaultValue('asc');
    var sort_inv = form.addField('custpage_sort_inv', 'text', 'custpage_ac_id', null, null).setDisplayType('hidden');
    sort_inv.setDefaultValue('asc');
}
function markFields(form) {
    form.addField('custpage_mark', 'text', 'mark', null, null).setDisplayType('hidden');
}
function getPeriod(date, type) {

    if (type == 'previous') {
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() - 1 + 1, 0);
    }
    else {

        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('startdate', null, 'onorafter', nlapiDateToString(firstDay));
    filters[1] = new nlobjSearchFilter('isyear', null, 'is', 'F');
    filters[2] = new nlobjSearchFilter('isquarter', null, 'is', 'F');
    filters[3] = new nlobjSearchFilter('enddate', null, 'onorbefore', nlapiDateToString(lastDay));


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');

    var s = nlapiSearchRecord('accountingperiod', null, filters, columns);

    if (s != null && s.length > 0) {
        return s[0].getValue('internalid')
    }
    return '';
}
function chekTrueOrFalse(flag) {
    if (flag == true) { return "<span style='color:red'>Closed</span>" }
    else { return "<span style='color:green'>Open</span>" }
}
function getEmpType(user) {
    if (!isNullOrEmpty(user) && user != '-4') {
        var type = nlapiLookupField('employee', user, 'custentity_ct_employee_type')
        return type
    }
    return '';
}
function getEmpName(user) {
    //if (!isNullOrEmpty(user) && user != '-4') {
    //    var name = nlapiLookupField('employee', user, ['firstname', 'lastname'])
    //    return name.firstname + ' ' + name.lastname
    //}
    return '';
}
function repoterList() {

    var columns = new Array();
    columns.push(new nlobjSearchColumn('firstname').setSort())
    columns.push(new nlobjSearchColumn('lastname'));
    //columns.push(new nlobjSearchColumn('entityid'));

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custentity_ct_employee_type', null, 'anyof', [2,4])

    var search = nlapiCreateSearch('employee', filters, columns);

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
                name: s[i].getValue('firstname') + ' ' + s[i].getValue('lastname')
            });
        }
    }
    return results;
}
function getPRODUCTGROUP() {

    var allResults = [];

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid');

    var searchresults = nlapiSearchRecord('customrecord_ct_product_group', null, filters, columns);

    if (searchresults != null) {
        allResults.push({ name: '', internalid: '' })
        searchresults.forEach(function (line) {

            allResults.push({
                name: line.getValue('name'),
                internalid: line.getValue('internalid')
            });

        });
    }
    return allResults;
}
function getPRODUCTDIVISION() {

    var allResults = [];

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid');

    var searchresults = nlapiSearchRecord('customrecord_ct_product_division', null, filters, columns);

    if (searchresults != null) {
        allResults.push({ name: '', internalid: '' })
        searchresults.forEach(function (line) {

            allResults.push({
                name: line.getValue('name'),
                internalid: line.getValue('internalid')
            });

        });
    }
    return allResults;
}
function getSubmit(submit_type, total_aggregated, id) {

    if (total_aggregated != 1 && submit_type == 1) {
        nlapiSubmitField('customrecord_ct_reporting_entity', id, 'custrecord_ct_rep_ent_submit_checkbox', 2)
        return 2
    }
    return submit_type
}
