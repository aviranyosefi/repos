function fieldChange(type, name) {   
    if (name == 'custpage_ia') {
        var val = nlapiGetFieldValue('custpage_ia');
        if (val != '') {
            var segment = nlapiLookupField('customrecord_ct_investment_area', val, 'custrecord_ct_inverst_area_segment');
            nlapiSetFieldValue('custpage_segment', segment);
        }
    }
}
function save() {
    try {
        var win = window.opener
        var po = win.window;
        if (!ValidationField('custpage_employee')) { return; }
        if (!ValidationField('custpage_type')) { return; }
        if (!ValidationField('custpage_ia')) { return; }
        var success = createTran();
        if (success != 'fail' && success != '-1') {
            //nlapiSetFieldValue('custpage_ct_id', success); 
            po.document.getElementById("submitter").click();
            return true
        }
    } catch (e) {
        alert('error: ' +e)

    }

}
function createTran() {
    try {
        debugger;
        type = nlapiGetFieldValue('custpage_type');
        emp_id = nlapiGetFieldValue('custpage_employee');        
        var ct_employee_type = nlapiLookupField('employee', emp_id, 'custentity_ct_employee_type');
        if (isNullOrEmpty(ct_employee_type)) {
            alert('This employee is not configured as part of the Capacity Tool population.')
            return 'fail'
        }
        user_type = nlapiGetFieldValue('custpage_user_type');
        if (user_type == '2') {
            ct_tool_reporter = nlapiLookupField('employee', emp_id, 'custentity_ct_tool_reporter');
            var currentUser = nlapiGetUser();
            if (ct_tool_reporter == currentUser || currentUser == emp_id ) {}
            else {
                alert('Assessment cant be created because, you are not configured as the reporter of this employee!')
                return 'fail'
            }          
        }
        ia = nlapiGetFieldValue('custpage_ia');
        segment = nlapiGetFieldValue('custpage_segment');
        npd = nlapiGetFieldValue('custpage_npd');
        maintenance = nlapiGetFieldValue('custpage_maintenance');
        appm = nlapiGetFieldValue('custpage_appm');
        cc = nlapiGetFieldValue('custpage_cc');
        var period = nlapiGetFieldValue('custpage_period');

        if (CheckIfAlreadyExist(emp_id, period, ia, type) == 0) {
            var perecentLines = getLinesPercentperiodVal(period, emp_id, type)        
            if (Number(perecentLines) + Number(npd) + Number(maintenance) + Number(appm) + Number(cc) > 100) {
                alert("Employee’s periodical Assessment can't exceed 100 %.")
                return 'fail'
            }
            var rec = nlapiCreateRecord('customrecord_ct_reporting_entity');
            rec.setFieldValue('custrecord_ct_rep_ent_npd', npd)
            rec.setFieldValue('custrecord_ct_rep_ent_maint', maintenance)
            rec.setFieldValue('custrecord_ct_rep_ent_appm', appm)
            rec.setFieldValue('custrecord_ct_rep_ent_cc', cc)
            rec.setFieldValue('custrecord_ct_rep_ent_segment', segment)
            rec.setFieldValue('custrecord_ct_rep_ent_invest_area', ia)
            rec.setFieldValue('custrecord_ct_rep_ent_period', period)
            rec.setFieldValue('custrecord_ct_rep_ent_type', type)
            rec.setFieldValue('custrecord_ct_rep_ent_employee', emp_id)
            if (type == 1) { rec.setFieldValue('custrecord_ct_rep_ent_submit_checkbox', 1)}
            var id = nlapiSubmitRecord(rec, null, true); 
            return id
        }
        else {
            alert('It is not possible to create two records with the same investment area.')
            return 'fail'
            }  
    } catch (e) {
        alert('createTran error: ' + JSON.stringify(e))
    }
}
function ValidationField(field) {
    var val = nlapiGetFieldValue(field)
    if (isNullOrEmpty(val)) {
        var label = nlapiGetField(field).label.toUpperCase();
        alert("Please enter value(s) for: " + label)
        return false;
    }
    return true;
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function CheckIfAlreadyExist(employee, period, invest_area, type) {

    var filters = new Array();
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', employee))
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', period))
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_invest_area', null, 'anyof', invest_area))
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', type))
    filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'))

    var search = nlapiCreateSearch('customrecord_ct_reporting_entity', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    return s.length
}
function getLinesPercentperiodVal(periodVal, employeeVal, typeVal) {
    var search = nlapiLoadSearch(null, 'customsearch_ct_reporting_entity_2'); 
    search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', periodVal));
    search.addFilter(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
    if (!isNullOrEmpty(employeeVal)) { search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', employeeVal.split("\u0005"))); }
    if (!isNullOrEmpty(typeVal)) { search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', typeVal)); }
   
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
    if (s != null && s.length >0 ) {
        var cols = search.getColumns();        
        return s[0].getValue(cols[1])                   
    }
    return res;
}
function getForcastRecord(employee, period, invest_area) {

    var filters = new Array();
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', employee))
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', period))
    if (invest_area != null) { filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_invest_area', null, 'anyof', invest_area)) }
    else { filters.push(new nlobjSearchFilter('custrecord_ct_acual_id', null, 'anyof', '@NONE@')) }
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', 2))
    filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'))

    var search = nlapiCreateSearch('customrecord_ct_reporting_entity', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s.length > 0) {
        return s[0].id
    }
    return -1
}