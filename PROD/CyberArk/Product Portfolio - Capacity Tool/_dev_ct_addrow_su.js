function addRow(request, response) {

    if (request.getMethod() == 'GET') {
        var period = request.getParameter('period');
        var lock_actual= request.getParameter('a');
        var lock_forcast = request.getParameter('f');
        var employee = request.getParameter('employee');
        var user_type = request.getParameter('user_type');        
        var form = nlapiCreateForm('Add Assessment Row');
        form.setScript('customscript_dev_ct_addrow_cs');
        form.addSubmitButton('Add Assessment Row');
        form.addFieldGroup('custpage_search_group', 'Fill Data');

        var periodField = form.addField('custpage_period', 'select', 'period', 'accountingperiod', 'custpage_search_group').setDisplayType('disabled');
        periodField.setDefaultValue(period);
        periodField.setLayoutType('midrow');
        var type = form.addField('custpage_type', 'select', 'type', null, 'custpage_search_group')//.setDisplayType('disabled');
        type.setLayoutType('midrow');
        buildTypeField(type, lock_actual, lock_forcast)
        type.setMandatory(true)
        var employee_field = form.addField('custpage_employee', 'select', 'employee', 'employee', 'custpage_search_group')
        employee_field.setMandatory(true)
        employee_field.setDefaultValue(employee);
        employee_field.setLayoutType('midrow');
        var ia_field = form.addField('custpage_ia', 'select', 'Investment area', 'customrecord_ct_investment_area', 'custpage_search_group').setMandatory(true)
        ia_field.setLayoutType('midrow');
        var segment_field = form.addField('custpage_segment', 'select', 'Segment', 'customlist_ct_segment', 'custpage_search_group').setDisplayType('disabled');
        segment_field.setLayoutType('midrow');
        form.addField('custpage_npd', 'integer', 'NEW FUNC', 'custpage_search_group').setLayoutType('midrow');    
        form.addField('custpage_appm', 'integer', 'EXISTING FUNC', 'custpage_search_group').setLayoutType('midrow');
        form.addField('custpage_maintenance', 'integer', 'KTLO', 'custpage_search_group').setLayoutType('midrow');
        var cc_field = form.addField('custpage_cc', 'integer', 'CC', 'custpage_search_group').setLayoutType('midrow');
        cc_field.setDisplayType('hidden');      
    }
    else {
        var form = nlapiCreateForm('Add Row');
        var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
        htmlHeader.setDefaultValue("<script>window.close()</script>");
    }
    response.writePage(form)
}
function buildTypeField(type, lock_actual, lock_forcast) {
    if (lock_actual == 'false' && lock_forcast == 'false') {
        type.addSelectOption('', '');
        type.addSelectOption(1, 'Actual');
        type.addSelectOption(2, 'Forecast');
    }
    else if (lock_actual == 'false') {
        type.addSelectOption(1, 'Actual');
        type.setDisplayType('disabled');
    }
    else if (lock_forcast == 'false') {
        type.addSelectOption(2, 'Forecast');
        type.setDisplayType('disabled');
    }  
}

