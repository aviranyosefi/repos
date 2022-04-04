// (type == create && populate CT EMPLOYEE TYPE as emp ) || (type != create && oldRecord CT EMPLOYEE TYPE != emp && newRecord CT EMPLOYEE TYPE == emp && )
//custentity_ct_emp_is_manager

var search_forcast_next_months = 6;
var type_field_changed = false;

function ct_empl_validation(type) {
    try {
        if (type != 'create') {
            var oldRec = nlapiGetOldRecord();
            var old_ct_employee_type = oldRec.getFieldValue('custentity_ct_employee_type');
        }
        else {
            var old_ct_employee_type = '';
        }
        if (type != 'delete') {
            var empId = nlapiGetRecordId();
            var rec = nlapiLoadRecord('employee', empId);
            var ct_employee_type = rec.getFieldValue('custentity_ct_employee_type');
            nlapiLogExecution("DEBUG", 'new: ' + ct_employee_type, 'old: ' + old_ct_employee_type);

            var ct_emp_product_group = rec.getFieldValue('custentity_ct_emp_product_group');
            var ct_emp_product = rec.getFieldValue('custentity_ct_emp_product');
            var ct_emp_is_manager = rec.getFieldValue('custentity_ct_emp_is_manager')

            var old_ct_emp_product_group = oldRec.getFieldValue('custentity_ct_emp_product_group');
            var old_ct_emp_product = oldRec.getFieldValue('custentity_ct_emp_product');

            if (ct_employee_type != 3 && ct_employee_type != 4) {//if NOT :  3 - Capacity Tool Analysts || 4 - Capacity Tool Admins

                if ((!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)) && ct_emp_is_manager != 'T') {
                    rec.setFieldValue('custentity_ct_employee_type', 1);//Capacity Tool Employees
                    //type_field_changed = true;
                }
                else if ((!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)) && ct_emp_is_manager == 'T') {
                    rec.setFieldValue('custentity_ct_employee_type', 2);//Capacity Tool Reporters

                }
            }

            var supervisor = rec.getFieldValue('supervisor');
            rec.setFieldValue('custentity_ct_tool_reporter', supervisor);


            var id = nlapiSubmitRecord(rec);
            nlapiLogExecution("DEBUG", 'record saved', id);

            //if(oldgroup==blank && newgroup != blank || olddevis==blank && newdevis !=blank)
            //type_field_changed = true;

            var isinactive = rec.getFieldValue('isinactive');
            var employeestatus = rec.getFieldValue('employeestatus');

            if (type != 'delete' && ((ct_emp_product_group != old_ct_emp_product_group && isEmpty(old_ct_emp_product_group)) || (ct_emp_product != old_ct_emp_product && isEmpty(old_ct_emp_product)))) {//1 -Capacity Tool Employees

                nlapiLogExecution("DEBUG", 'in if', '');
                if (isinactive != 'T' && employeestatus == 1)//1-active
                    //create_forcast(empId, 'create');


            }


        }




        var termination = rec.getFieldValue('custentity_ct_emp_terminated');
        if (!isEmpty(termination)) {
            var termination_date = nlapiStringToDate(termination);
            var firstdayofnextmonth_terminated = get_firstDay_next_month_date(termination_date);
            nlapiLogExecution("DEBUG", 'termination: ' + termination, termination_date);
            nlapiLogExecution("DEBUG", 'firstdayofnextmonth_terminated: ', firstdayofnextmonth_terminated);


            /*
                        var termination_date_month = termination_date.getMonth() + 1;
                        var period = currentPeriod(termination_date)
                        nlapiLogExecution("DEBUG", 'period: ', period);
            
                        nlapiLogExecution("DEBUG", 'termination: ' + termination, 'termination_date: ' + termination_date);
                        var today = new Date();
                        var today_date_month = today.getMonth() + 1;
                        var gap_dates = today_date_month - termination_date_month;
                        nlapiLogExecution("DEBUG", 'today_date_month: ' + today_date_month + ' | ' + 'termination_date_month: ' + termination_date_month, 'gap_dates: ' + gap_dates);
                    */
        }


        nlapiLogExecution("DEBUG", 'termination: ' + termination, 'employeestatus: ' + employeestatus);

        if ((type == 'delete' || isinactive == 'T' || employeestatus == 3) && !isEmpty(termination)) {// 3 - Terminated

            delete_forcast(empId, firstdayofnextmonth_terminated)


        }

        return true;



    } catch (e) {
        nlapiLogExecution("error", 'error', e);
    }
}



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

/*
function ct_empl_validation_after_submit() {

    var recId = nlapiGetRecordId();
    var rec = nlapiLoadRecord('employee', recId);


    var oldRec = nlapiGetOldRecord();

    var ct_employee_type = rec.getFieldValue('custentity_ct_employee_type');
    var old_ct_employee_type = oldRec.getFieldValue('custentity_ct_employee_type');

    nlapiLogExecution("DEBUG", 'new: ' + ct_employee_type, 'old: ' + old_ct_employee_type);


    return true
}
*/



/*
function isSuper(empId) {

    var sresults = [];
    filters = [];
    columns = [];

    filters.push(new nlobjSearchFilter('supervisor', null, 'anyof', empId));
    //columns.push(new nlobjSearchColumn('entityid'));
    columns.push(new nlobjSearchColumn('internalid'));

    results = nlapiSearchRecord('employee', null, filters, columns) || [];
    nlapiLogExecution("DEBUG", 'results', JSON.stringify(results));

    if (results != null) {
        results.forEach(function (line) {
            var s = {};
            s.id = line.getValue('internalid');
            sresults.push(s);
        });
    }
    return sresults;
}

function ct_reporter_update(arr, id) {

    for (var i = 0; i < arr.length; i++) {
        try {
            var recid = nlapiSubmitField('employee', arr[i].id, 'custentity_ct_tool_reporter', id);
            nlapiLogExecution("DEBUG", 'rec updated: ' + i, recid);
        } catch (e) {
            nlapiLogExecution("DEBUG", 'rec was not updated: ' + i, arr[i].id);
            continue;
        }
    }



    return true
}*/

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
    //var d = new Date();
    //d.setHours(d.getHours() + 9)
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