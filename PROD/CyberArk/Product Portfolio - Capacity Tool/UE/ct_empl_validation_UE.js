// (type == create && populate CT EMPLOYEE TYPE as emp ) || (type != create && oldRecord CT EMPLOYEE TYPE != emp && newRecord CT EMPLOYEE TYPE == emp && )
function ct_empl_validation(type) {
    if (type != 'delete') {
        var recId = nlapiGetRecordId();
        var rec = nlapiLoadRecord('employee', recId);
        var ct_emp_product_group = rec.getFieldValue('custentity_ct_emp_product_group');
        var ct_emp_product = rec.getFieldValue('custentity_ct_emp_product');

        var supervisor = rec.getFieldValue('supervisor');
        rec.setFieldValue('custentity_ct_tool_reporter', supervisor);
        
        nlapiLogExecution('debug', 'custentity_ct_emp_product_group', ct_emp_product_group);
        nlapiLogExecution('debug', 'custentity_ct_emp_product', ct_emp_product);
        nlapiLogExecution('debug', 'supervisor', supervisor);

        //????????????????????????????????
        var isSupervisor = false;
        var supervisors = isSuper(recId);

        if (supervisors.length > 0) {
            isSupervisor = true;

        }
        else
            isSupervisor = false

        nlapiLogExecution('debug', 'supervisors', JSON.stringify(supervisors));
        nlapiLogExecution('debug', 'isSupervisor', isSupervisor);




        /*
                nlapiLogExecution('debug', '!isEmpty(ct_emp_product_group)', !isEmpty(ct_emp_product_group));
                nlapiLogExecution('debug', '!isEmpty(ct_emp_product)', !isEmpty(ct_emp_product));
                nlapiLogExecution('debug', '(!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)', (!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)));
                nlapiLogExecution('debug', '((!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)) && isSupervisor == true)', ((!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)) && isSupervisor == true));
                nlapiLogExecution('debug', '((!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)) && isSupervisor == false)', ((!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)) && isSupervisor == false));
        */

        if ((!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)) && isSupervisor == false) {
            rec.setFieldValue('custentity_ct_employee_type', 1);//Capacity Tool Employees
        }
        else if ((!isEmpty(ct_emp_product_group) || !isEmpty(ct_emp_product)) && isSupervisor == true) {
            rec.setFieldValue('custentity_ct_employee_type', 2);//Capacity Tool Reporters
            ct_reporter_update(supervisors, recId);
        }

        var id = nlapiSubmitRecord(rec);
        nlapiLogExecution("DEBUG", 'record saved', id);

    }
    return true
}

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
function isEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
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
}