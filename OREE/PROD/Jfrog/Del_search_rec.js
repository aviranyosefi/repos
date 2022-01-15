function DelSearchRec(request, response) {


    if (request.getMethod() == 'GET') {

        var form = nlapiCreateForm('Enter search Id');
        form.addSubmitButton('RUN');

        var script_id = form.addField('custpage_ilo_script_id', 'text', 'Script Id', null, null);
        script_id.setMandatory(true);

        response.writePage(form);

    }

    else {

        var context = nlapiGetContext();
        var empId = context.user;
        nlapiLogExecution('debug', 'email: ', empId);
        if (empId != '244490') {
            nlapiLogExecution('debug', 'user: ', empId);
            var Msg = 'Only the employee Rottem Wolf  has the permissions to run the requested process';
            throw nlapiCreateError('Permittion_Violation', Msg, true);
        }

        var Secondform = nlapiCreateForm('');


        var script_id = request.getParameter('custpage_ilo_script_id');

        try { nlapiScheduleScript('customscript_del_from_search_test', 'customdeploy_delete_from_search_test_dep', { custscriptcustscript1: script_id }) }
        catch (e) { }


        response.writePage(Secondform);
    }

/*
in Schedule Script

var context = nlapiGetContext();
var script_id = context.getSetting('SCRIPT', 'custscriptcustscript1');

 */
