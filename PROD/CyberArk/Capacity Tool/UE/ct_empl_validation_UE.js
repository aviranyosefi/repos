var search_forcast_next_months = 6;
var type_field_changed = false;
var supervisor;
var date = new Date()
var employeestatus;
function ct_empl_validation(type) {
    try {
        if (type != 'create') {
            var oldRec = nlapiGetOldRecord();
            var old_ct_employee_type = oldRec.getFieldValue('custentity_ct_employee_type');
            var old_ct_emp_product_group = oldRec.getFieldValue('custentity_ct_emp_product_group');
            var old_ct_emp_product = oldRec.getFieldValue('custentity_ct_emp_product');
        }
        else {
            var old_ct_employee_type = '';
            var old_ct_emp_product_group = '';
            var old_ct_emp_product = '';
        }
        if (type != 'delete') {
            var empId = nlapiGetRecordId();
            nlapiLogExecution("debug", 'empId', empId);
            var rec = nlapiLoadRecord('employee', empId);
            var employeetype = rec.getFieldValue('employeetype')
            if (employeetype == '3' || employeetype == '5') { //"Contractor (HC)" OR "Employee (HC)"

                supervisor = rec.getFieldValue('supervisor');
                rec.setFieldValue('custentity_ct_tool_reporter', supervisor);

                var ct_employee_type = rec.getFieldValue('custentity_ct_employee_type');
                nlapiLogExecution("DEBUG", 'new: ' + ct_employee_type, 'old: ' + old_ct_employee_type);

                var ct_emp_product_group = rec.getFieldValue('custentity_ct_emp_product_group');
                var ct_emp_product = rec.getFieldValue('custentity_ct_emp_product');
                var ct_emp_is_manager = rec.getFieldValue('custentity_ct_emp_is_manager')

                if (ct_employee_type != 3 && ct_employee_type != 4) {//if NOT :  3 - Capacity Tool Analysts || 4 - Capacity Tool Admins

                    if ((!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)) && ct_emp_is_manager != 'T') {
                        rec.setFieldValue('custentity_ct_employee_type', 1);//Capacity Tool Employees
                        //type_field_changed = true;
                    }
                    else if ((!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)) && ct_emp_is_manager == 'T') {
                        rec.setFieldValue('custentity_ct_employee_type', 2);//Capacity Tool Reporters
                    }
                }
                var isinactive = rec.getFieldValue('isinactive');
                employeestatus = rec.getFieldValue('employeestatus');

                if (((ct_emp_product_group != old_ct_emp_product_group && isEmpty(old_ct_emp_product_group) && !isEmpty(ct_emp_product_group)) || (ct_emp_product != old_ct_emp_product && isEmpty(old_ct_emp_product) && !isEmpty(ct_emp_product)))) {//1 -Capacity Tool Employees
                    if (isinactive != 'T' && employeestatus == 1)//1-active
                    {
                        nlapiLogExecution("debug", 'create_actuals', 'create_actuals');
                        create_actuals(empId, 'create')
                    }

                }
                var termination = rec.getFieldValue('custentity_ct_emp_terminated');
                nlapiSubmitRecord(rec, null, true);

                if ((isinactive == 'T' || employeestatus == 3) && !isEmpty(termination)) {// 3 - Terminated
                    var termination_date = nlapiStringToDate(termination);
                    termination_date = nlapiAddMonths(termination_date, 1);
                    var terminatedPeriod = getPeriod(termination_date, 'today');
                    nlapiLogExecution("debug", 'delete_actuals', 'delete_actuals');
                    delete_actuals(empId, terminatedPeriod);
                }
            } // if (employeetype == '3' || employeetype == '5') {
        }
    } catch (e) {
        nlapiLogExecution("error", 'error', e);
    }
}
//ACTUAL FUNCTIONS
function create_actuals(empId, action) {   
    var nextPeriod = getPeriod(date, 'current');
    var checkList = getAcualsList(empId, nextPeriod, 'check')
    if (checkList.length == 0) {
        var prevPeriod = getPeriod(date, 'previous');
        getAcualsList(empId, prevPeriod, action)
    }      
    else nlapiLogExecution("debug", 'checkList ' + checkList.length, 'actual record not created');
}
function create_actual_record(actualID, empId, today_period) {
    var recCopy = nlapiCopyRecord('customrecord_ct_reporting_entity', actualID);
    recCopy.setFieldValue('custrecord_ct_rep_ent_employee', empId);
    recCopy.setFieldValue('custrecord_ct_rep_ent_npd', 0);
    recCopy.setFieldValue('custrecord_ct_rep_ent_maint', 0);
    recCopy.setFieldValue('custrecord_ct_rep_ent_appm', 0);
    recCopy.setFieldValue('custrecord_ct_rep_ent_cc', 0);
    recCopy.setFieldValue('custrecord_ct_last_reporter', '');
    recCopy.setFieldValue('custrecord_ct_rep_ent_submit_checkbox', 2);//Not Submitted
    recCopy.setFieldValue('custrecord_ct_rep_ent_period', today_period);
    nlapiSubmitRecord(recCopy, true, true);
}
function delete_actuals(empId, terminatedPeriod) {
    getAcualsList(empId, terminatedPeriod, 'delete');
}
function getAcualsList(empid, period, action) {
    debugger
    var type = 'customrecord_ct_reporting_entity';
    var filters = new Array();
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', 1));//actual
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', period));
    if (action == 'create') {
        filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', supervisor));
    }
    else if (action == 'delete' || action == 'check') {
        filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', empid));
    }
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');

    var s = nlapiSearchRecord(type, null, filters, columns);
    //nlapiLogExecution("DEBUG", 'getAcualsList: s' + s.length, '');

    if (s != null && s.length > 0 && action == 'create') {
        var today_period = getPeriod(date, 'today');
        for (var i = 0; i < s.length; i++) {
            create_actual_record(s[i].id, empid, today_period)
        }
    }
    else if (s != null && s.length > 0 && action == 'delete') {
        for (var i = 0; i < s.length; i++) {
            nlapiDeleteRecord(type, s[i].getValue('internalid'))
        }
        return 'records deleted'
    }
    else if (action == 'check') {
        if (s != null)
            return s
        return []
    }
    return '';
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


//FORACST FUNCTIONS
function delete_forcast(empId, firstdayofnextmonth_terminated) {
    var exist = if_exist(empId, '', 'delete', firstdayofnextmonth_terminated);
    nlapiLogExecution("DEBUG", 'exist - delete', exist);
    return true
}
function create_forcast(empId, action) {
    var date = new Date;
    var today = nlapiDateToString(new Date());
    nlapiLogExecution("DEBUG", 'today', today);
    var period = currentPeriod(date);

    for (var i = 1; i <= search_forcast_next_months; i++) {

        var nextMonth = nlapiAddMonths(date, i);
        var nextperiod = currentPeriod(nextMonth);

        nlapiLogExecution('DEBUG', ' period: ' + period, 'nextperiod: ' + nextperiod);



        var exist = if_exist(empId, nextperiod, action);
        nlapiLogExecution("DEBUG", 'exist', exist);

        if (isEmpty(exist)) {
            nlapiLogExecution("DEBUG", 'not exist', empId + ' + ' + nextperiod);
            create_record(empId, nextperiod);
        }
    }
    return true
}
function create_record(empId, nextperiod) {

    var rec = nlapiCreateRecord('customrecord_ct_reporting_entity');
    rec.setFieldValue('custrecord_ct_rep_ent_employee', empId);
    rec.setFieldValue('custrecord_ct_rep_ent_type', 2);//Forcast
    rec.setFieldValue('custrecord_ct_rep_ent_submit_checkbox', 2);//Not Submitted
    rec.setFieldValue('custrecord_ct_rep_ent_period', nextperiod);
    rec.setFieldValue('custrecord_ct_rep_ent_invest_area', 27);//Product Org. Mgmt. and Other

    var id = nlapiSubmitRecord(rec, true, true);
    nlapiLogExecution("DEBUG", 'not exist - record saved', id);

    return true;
}
function if_exist(empid, nextperiod, action, firstdayofnextmonth_terminated) {

    var results = [];
    var type = 'customrecord_ct_reporting_entity';
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', empid);
    filters[1] = new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', 2);//2 - forcast
    if (action == 'create')
        filters[2] = new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', nextperiod);
    if (action == 'delete')
        filters[2] = new nlobjSearchFilter('custrecord_ct_rep_last_mod_date', null, 'onorafter', firstdayofnextmonth_terminated);


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');

    var s = nlapiSearchRecord(type, null, filters, columns);
    if (s != null && s.length > 0 && action != 'delete') {
        return s[0].getValue('internalid')
    }
    else if (s != null && s.length > 0 && action == 'delete') {
        for (var i = 0; i < s.length; i++) {
            nlapiLogExecution("DEBUG", 'exist - delete - s[i].getValue(internalid)', s[i].getValue('internalid'));
            nlapiDeleteRecord(type, s[i].getValue('internalid'))
            //results.push(s[i].getValue('internalid'))

        }
        return 'records deleted'
    }

    return '';
}
function isEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function currentPeriod(date) {

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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
function get_firstDay_next_month_date(d) {
    d = nlapiAddMonths(d, '1');
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();


    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    var formatdate = ['01', month, year].join('/') //+ ' ' + d.toTimeString().substring(0, 8)
    return formatdate;
}