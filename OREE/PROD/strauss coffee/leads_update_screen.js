// JavaScript source code
var refresh = null;
function services_update_screen(request, response) {
    var form = nlapiCreateForm('לידים טלפוניים');
    /*var ext = request.getParameter('extforms');

    var extField = form.addField('custpage_external', 'checkbox', 'External', null, null);
    if (ext) {
        extField.setDefaultValue('T');
    }
    else {
        extField.setDefaultValue('F');
    }
    extField.setDisplayType('hidden');*/

    form.setScript('customscript_lead_update_screen_sc');
    if (request.getMethod() == 'GET') {
        var editMode = false;
        nlapiLogExecution('DEBUG', 'stage one', 'stage one');
        form.addSubmitButton('בצע');
        //form.addResetButton('Reset');

        //nlapiSetRedirectURL('tasklink', 'LIST_SEARCHRESULTS', null, null, 'customsearch_nr_monthly_billing'); 

        var reresh_search = form.addField('custpage_reresh_search', 'checkbox', 'Refresh', null, null);
        reresh_search.setDefaultValue('F');
        reresh_search.setDisplayType('hidden');

        var results = Search();
        //form.addButton('custpage_edit_button', 'Update Filters', script);


        var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'תוצאות', null);

        //resultsSubList.addMarkAllButtons();
        var res_CheckBox2 = resultsSubList.addField('custpage_resultssublist_checkbox2', 'checkbox', 'check').setDisplayType('hidden');
        var res_leadid = resultsSubList.addField('custpage_resultssublist_leadid', 'text', 'מזהה ליד').setDisplayType('hidden');
        var res_leaderId = resultsSubList.addField('custpage_resultssublist_leaderid', 'text', 'מזהה לידר');
        var res_dateCreated = resultsSubList.addField('custpage_resultssublist_datecreated', 'text', 'תאריך יצירה');
        var res_phone = resultsSubList.addField('custpage_resultssublist_phone', 'text', 'טלפון');
        var res_update_butt = resultsSubList.addField('custpage_resultssublist_update_butt', 'text', 'עדכן');
        //var res_tranId = resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Sale Order').setDisplayType('inline');



        if (results != null && results != []) {
            for (var i = 0; i < results.length; i++) {
                var script = "nlapiSetLineItemValue('custpage_results_sublist','custpage_resultssublist_checkbox2'," + (i + 1) + ", 'T'); submitter.click();"
                var button = '<button onclick="' + script + '">עדכן</button>';
                resultsSubList.setLineItemValue('custpage_resultssublist_leadid', i + 1, results[i].leadId);
                resultsSubList.setLineItemValue('custpage_resultssublist_leaderid', i + 1, results[i].leaderId);
                resultsSubList.setLineItemValue('custpage_resultssublist_datecreated', i + 1, results[i].dateCreated);
                resultsSubList.setLineItemValue('custpage_resultssublist_phone', i + 1, results[i].phone);
                resultsSubList.setLineItemValue('custpage_resultssublist_update_butt', i + 1, button);
                //resultsSubList.setLineItemValue('custpage_resultssublist_tranid', i + 1, SoLink);
            }
            nlapiLogExecution('DEBUG', 'resultsSubList_Load_End', '');
            nlapiLogExecution('DEBUG', 'refresh = ' + nlapiGetFieldValue('custpage_reresh_search'), '');
        }


        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');

        response.writePage(form);
    }
    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne' || request.getParameter('custpage_reresh_search') == 'T') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');
        
        var leadId;
        var leaderId;
        var dateCreated;
        var phone;
        var checkBox;
        var lineCount = request.getLineItemCount('custpage_results_sublist');
        nlapiLogExecution('DEBUG', 'lineCount:' + lineCount, '');
        for (var x = 1; x <= lineCount; x++) {

            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox2', x);
            nlapiLogExecution('DEBUG', 'checkBox line:' + x, checkBox);
            if (checkBox == 'T') {// list == 'b'
                leadId = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_leadid', x);
                leaderId = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_leaderid', x);
                dateCreated = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_datecreated', x);
                phone = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_phone', x);
                break;
            }
            //nlapiLogExecution('DEBUG', 'InvArr', InvArr.id + 'type : ' + InvArr.type);
        }


        var formTitle = leadId + ' :עדכון ליד ';
        var SecondForm = nlapiCreateForm(formTitle);
        SecondForm.setScript('customscript_lead_update_screen_sc');
        var leadid_field = SecondForm.addField('custpage_lead_id', 'text', 'מזהה ליד', null, null);
        leadid_field.setDefaultValue(leadId);
        leadid_field.setDisplayType('hidden');

        var leaderid_field = SecondForm.addField('custpage_leader_id', 'text', 'מזהה לידר', null, null);
        leaderid_field.setDefaultValue(leaderId);
        leaderid_field.setDisplayType('hidden');

        var dateCreated_field = SecondForm.addField('custpage_date_created', 'Date', 'תאריך יצירה', null, null);
        var datef = nlapiStringToDate(dateCreated)
        dateCreated_field.setDefaultValue(datef);
        dateCreated_field.setDisplayType('disabled');

        var phone_field = SecondForm.addField('custpage_phone', 'text', 'טלפון', null, null);
        phone_field.setDefaultValue(phone);
        phone_field.setDisplayType('disabled');

        var fname_field = SecondForm.addField('custpage_fname', 'text', 'שם פרטי', null, null).setMandatory(true);
        var lname_field = SecondForm.addField('custpage_lname', 'text', 'שם משפחה', null, null).setMandatory(true);
        var companyName_field = SecondForm.addField('custpage_company_name', 'text', 'שם חברה', null, null);
        var numOfEmployees = SecondForm.addField('custpage_number_of_employees', 'text', 'מספר עובדים', null, null);

        //var padding_field = SecondForm.addField('custpage_padding', 'text', 'מרווח', null, null);
        //padding_field.setDisplayType('hidden');

        var irrelevant_field = SecondForm.addField('custpage_irrelevant', 'checkbox', 'לא רלוונטי', null, null);

        var irrelevant_reason_field = SecondForm.addField('custpage_irrelevant_reason_select', 'select', 'סיבת אי רלוונטיות', null);
        irrelevant_reason_field.addSelectOption('a', 'לקוח פרטי');
        irrelevant_reason_field.addSelectOption('b', 'מתחת ל 3 ק"ג');
        irrelevant_reason_field.addSelectOption('c', 'אחר');
        irrelevant_reason_field.setMandatory(true);

        SecondForm.insertField(irrelevant_reason_field, 'custpage_reason');
        //var irrelevant_field = SecondForm.addField('custpage_irrelevant', 'select', 'לא רלוונטי', 'customlist_leader_statuses', null);
        var reason_field = SecondForm.addField('custpage_reason', 'text', 'הערות', null, null);
        reason_field.setMandatory(true);

        
        var checkStage = SecondForm.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stagetwo');
        checkStage.setDisplayType('hidden');

        var submit = SecondForm.addSubmitButton('שמירה');
        response.writePage(SecondForm);

    }

    else if (request.getParameter('custpage_ilo_check_stage') == 'stagetwo') {
        //////////////
        nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');

        var fname_field = request.getParameter('custpage_fname');
        nlapiLogExecution('DEBUG', 'fname_field', fname_field);

        var lname_field = request.getParameter('custpage_lname');
        nlapiLogExecution('DEBUG', 'fname_field', lname_field);

        var companyName_field = request.getParameter('custpage_company_name');
        nlapiLogExecution('DEBUG', 'fname_field', companyName_field);

        var irrelevant_field = request.getParameter('custpage_irrelevant');
        nlapiLogExecution('DEBUG', 'irrelevant_field', irrelevant_field);

        var reason_field = request.getParameter('custpage_reason');
        nlapiLogExecution('DEBUG', 'irrelevant_field', reason_field);

        var phone_field = request.getParameter('custpage_phone');
        nlapiLogExecution('DEBUG', 'phone_field', phone_field);

        var numOfEmployees = request.getParameter('custpage_number_of_employees');
        nlapiLogExecution('DEBUG', 'phone_field', numOfEmployees);

        var leadid_field = request.getParameter('custpage_lead_id');
        nlapiLogExecution('DEBUG', 'leadid_field', leadid_field);

        var select_reason_field = request.getParameter('custpage_irrelevant_reason_select');
        nlapiLogExecution('DEBUG', 'select_reason_field', select_reason_field);
        
        if (!isNullOrEmpty(fname_field) || !isNullOrEmpty(lname_field)) {
            var contactRec = nlapiCreateRecord('contact');
            contactRec.setFieldValue('firstname', fname_field);
            contactRec.setFieldValue('lastname', lname_field);
            contactRec.setFieldValue('phone', phone_field);
            contactRec.setFieldValue('subsidiary', '2');
            contactRec.setFieldValue('company', leadid_field);
            var submittion = nlapiSubmitRecord(contactRec);
            nlapiAttachRecord('contact', submittion, 'lead', leadid_field, { role: -10 });
        }


       
        var lead = nlapiLoadRecord('lead', leadid_field);
        if (!isNullOrEmpty(companyName_field)) {
            lead.setFieldValue('companyname', companyName_field);
        }

        if (!isNullOrEmpty(numOfEmployees)) {
            lead.setFieldValue('custentity_number_of_employess', numOfEmployees);
        }

        if (irrelevant_field == 'T') {
            if (select_reason_field == 'a') {
                lead.setFieldValue('custentity_status_reason', '1');
            }
            else if (select_reason_field == 'b') {
                lead.setFieldValue('custentity_status_reason', '2');
            }
            lead.setFieldValue('entitystatus', '6');
           
        }
        lead.setFieldValue('comments', reason_field);
        var lead_submittion = null;
        lead_submittion = nlapiSubmitRecord(lead);

        if (!isNullOrEmpty(lead_submittion)) {
            nlapiSubmitField('lead', lead_submittion, 'custentity_phone_lead_initial_update', 'T');
            nlapiLogExecution('DEBUG', 'lead has been marked as updated', lead_submittion);
        }
        nlapiLogExecution('DEBUG', 'ext: ', ext);
      



        //if (ext) {
            nlapiSetRedirectURL('suitelet', 'customscript_leads_update_screen', 'customdeploy_leads_update_screen_dep', 'external');
        //}
        //else {
        //    nlapiSetRedirectURL('suitelet', 'customscript_leads_update_screen', 'customdeploy_leads_update_screen_dep', 'internal');
        //}
        


    }
}// services_update_screen function - end

//functions
function Search() {
    var filters = new Array();
    var s = [];
    var searchid = 0;
    var columns = new Array();

    var search = nlapiLoadSearch(null, 'customsearch1136');
 
    var runSearch = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s.length > 0) {
        var result = [];
        for (var i = 0; i < s.length; i++) {
            result.push({
                leadId: s[i].getValue('internalid'),
                leaderId: s[i].getValue('custentity_leader_id'),
                dateCreated: s[i].getValue('datecreated'),
                phone: s[i].getValue('phone'),

            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach result ', JSON.stringify(result));
    return result;
}

function field_edit() {

    var flowcontrol = document.getElementById('custpage_ilo_check_stage');
    flowcontrol.value = 'EditMode';
    nlapiLogExecution('DEBUG', 'flowcontrol ', flowcontrol.value);


}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}





// innerhtml filed
//document.getElementById('custpage_number_of_employees').onchange = function(){alert('test:' + document.getElementById('custpage_number_of_employees').value);}