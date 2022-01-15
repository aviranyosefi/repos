var keys = [];
var res1 = [];
var res2 = [];
var res3 = [];


function revenue_reports_suitelet(request, response) {

    if (request.getMethod() == 'GET') {


        nlapiLogExecution('DEBUG', 'stage one', 'stage one');

        var form = nlapiCreateForm('Revenue Reports ');

        form.addSubmitButton('Next');

        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

         var fromDate = form.addField('custpage_ilo_multi_fromdate', 'date', 'From Date', null, 'custpage_ilo_searchdetails');
         fromDate.setDefaultValue(new Date());
         fromDate.setLayoutType('outsideabove', 'startrow');
         fromDate.setMandatory(true);

        var toDate = form.addField('custpage_ilo_multi_todate', 'date', 'To Date', null, 'custpage_ilo_searchdetails');
        toDate.setDefaultValue(new Date());
        toDate.setLayoutType('outsideabove', 'startrow');
        toDate.setMandatory(true);

        var exe_date = form.addField('custpage_ilo_multi_exe_date', 'date', 'EXECUTION DATE', null, 'custpage_ilo_searchdetails');
        exe_date.setDefaultValue(new Date());
        exe_date.setLayoutType('outsideabove', 'startrow');
        exe_date.setMandatory(true);

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');


        response.writePage(form);

    }


    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad
        //nlapiLogExecution('DEBUG', 'stage two', 'stage two');

        var resultsForm = nlapiCreateForm('Revenue Reports ');

        var fromDate = request.getParameter('custpage_ilo_multi_fromdate');
        var toDate = request.getParameter('custpage_ilo_multi_todate');
        var exeDate = request.getParameter('custpage_ilo_multi_exe_date');           
        var user = nlapiGetContext().user;
        nlapiSubmitField('employee', user, 'custentity_financial_report_from_date', fromDate)
        nlapiSubmitField('employee', user, 'custentity_fin_report_to_date', toDate)
        nlapiSubmitField('employee', user, 'custentity_financial_report_exec_date', exeDate)

        nlapiLogExecution('DEBUG', 'user: ' + user, 'fromDate: ' + fromDate + ' toDate: ' + toDate + ' exeDate: ' + exeDate);


        nlapiScheduleScript('customscript_revenue_report_entity_ss', 'customdeploy_revenue_report_entity_ss_de',
            {
                custscript_ss_from_date: fromDate,
                custscript_ss_to_date: toDate,                
            });
                   
        response.writePage(resultsForm);


    }//end of first else

    
}




