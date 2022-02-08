var Context = nlapiGetContext();
var company = Context.company;
company = company.replace('_', '-');
var user = Context.user;
var resUpdate = '';
//.setDisplayType('entry');

function getSearchData(request, response) {

    if (request.getMethod() == 'GET') {

        nlapiLogExecution('DEBUG', 'stage one', 'stage one');

        var form = nlapiCreateForm('');
        form.addSubmitButton('חפש');
        form.setScript('customscript_customer_agreement_cs');

        form.addFieldGroup('custpage_ilo_searchdetails', 'נתונים להזנה');

        var startDate = form.addField('custpage_ilo_multi_fromdate', 'date', 'מתאריך', null, 'custpage_ilo_searchdetails');
        startDate.setMandatory(true);
        startDate.setDefaultValue(nlapiDateToString(new Date()))

        var totDate = form.addField('custpage_ilo_multi_todate', 'date', 'עד תאריך', null, 'custpage_ilo_searchdetails');
        totDate.setMandatory(true);
        totDate.setDefaultValue(nlapiDateToString(new Date()))
        var screenType = '';
        var salesrole = nlapiLookupField('employee', user, 'custentity_sales_rep_role');
        if (salesrole == '1') { // מתל
            var salesrep = form.addField('custpage_sales_rep', 'select', 'איש מכירות', 'employee', 'custpage_ilo_searchdetails');
            salesrep.setDefaultValue(user);
            salesrep.setDisplayType('inline');
            screenType = '2'

        }
        else if (salesrole == '2') { // מנהל מכירות
            var salesrep = form.addField('custpage_sales_rep', 'select', 'איש מכירות', null, 'custpage_ilo_searchdetails');
            var getSalesReps = getAllSalesReps();
            screenType = '2';
            salesrep.addSelectOption('', '');
            for (var i = 0; i < getSalesReps.length; i++) {
                salesrep.addSelectOption(getSalesReps[i].id, getSalesReps[i].name);
            }
            form.addField('custpage_cb_as_matal', 'checkbox', 'ריצה כמתל', null, 'custpage_ilo_searchdetails');
        }
        else if (salesrole == '4') { // נציג כספים
            var salesrep = form.addField('custpage_sales_rep', 'select', 'איש מכירות', null, 'custpage_ilo_searchdetails');
            var getSalesReps = getAllSalesReps();
            screenType = '2.1';
            salesrep.addSelectOption('', '');
            for (var i = 0; i < getSalesReps.length; i++) {
                salesrep.addSelectOption(getSalesReps[i].id, getSalesReps[i].name);
            }
            var priceChange = form.addField('custpage_price_change', 'select', 'אינדקצית שינוי סכום', null, 'custpage_ilo_searchdetails');
            priceChange.addSelectOption('', 'הכל');
            priceChange.addSelectOption('F', 'ללא שינוי');
            priceChange.addSelectOption('T', 'עם שינוי');
        }

        form.addField('custpage_billing_type', 'select', 'סוג חיוב', 'customlist_billing_type_list', 'custpage_ilo_searchdetails');

        form.addField('custpage_billing_status', 'select', 'סטטוס', 'customlist_billing_instruction_list', 'custpage_ilo_searchdetails');

        form.addField('custpage_customer', 'select', 'לקוח', 'CUSTOMER', 'custpage_ilo_searchdetails');

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue(screenType);
        checkStage.setDisplayType('hidden');


    }

    else if (request.getParameter('custpage_ilo_check_stage') == '2') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');
        try {
            var sales_rep = request.getParameter('custpage_sales_rep');
            var agreement_type = request.getParameter('custpage_agreement_type');
            var customer = request.getParameter('custpage_customer');
            var fromDateData = request.getParameter('custpage_ilo_multi_fromdate');
            var toDateData = request.getParameter('custpage_ilo_multi_todate');
            var status = request.getParameter('custpage_billing_status');
            var billing_type = request.getParameter('custpage_billing_type');
            var as_matal = request.getParameter('custpage_cb_as_matal');
            nlapiLogExecution('DEBUG', 'as_matal', as_matal);
            var salesrole = nlapiLookupField('employee', user, 'custentity_sales_rep_role');
            nlapiLogExecution('DEBUG', 'salesrole', salesrole);
            setDatesOnUser(fromDateData, toDateData);

            if (salesrole == '1' || as_matal == 'T') { // מתל
                var agreementList = AgreementDate(agreement_type, sales_rep, customer, status, billing_type);
                var screentype = 'מסך איש מכירות';
                salesrole = '1';
            }
            else if (salesrole == '2') { // מנהל מכירות
                var agreementList = AgreementDate2(agreement_type, sales_rep, customer, status, billing_type);
                var screentype = 'מסך מנהל מכירות';

            }
            var form = nlapiCreateForm(screentype);

            form.addFieldGroup('custpage_ilo_searchdetails', 'נתונים להזנה');
            form.addFieldGroup('custpage_ilo_details', 'מידע כללי');

            var startDate = form.addField('custpage_ilo_multi_fromdate', 'date', 'מתאריך', null, 'custpage_ilo_searchdetails');
            startDate.setDefaultValue(fromDateData);
            startDate.setDisplayType('inline');

            var totDate = form.addField('custpage_ilo_multi_todate', 'date', 'עד תאריך', null, 'custpage_ilo_searchdetails');
            totDate.setDefaultValue(toDateData);
            totDate.setDisplayType('inline');

            var salesrep = form.addField('custpage_sales_rep', 'select', 'איש מכירות', 'employee', 'custpage_ilo_searchdetails');
            salesrep.setDefaultValue(sales_rep);
            salesrep.setDisplayType('inline');

            var billing_type_field = form.addField('custpage_billing_type', 'select', 'סוג חיוב', 'customlist_billing_type_list', 'custpage_ilo_searchdetails');
            billing_type_field.setDefaultValue(billing_type);
            billing_type_field.setDisplayType('inline');

            var status_field = form.addField('custpage_billing_status', 'select', 'סטטוס', 'customlist_billing_instruction_list', 'custpage_ilo_searchdetails');
            status_field.setDefaultValue(status);
            status_field.setDisplayType('inline');

            var customer_field = form.addField('custpage_customer', 'select', 'לקוח', 'CUSTOMER', 'custpage_ilo_searchdetails');
            customer_field.setDefaultValue(customer);
            customer_field.setDisplayType('inline');

            var screen_type = form.addField('custpage_screen_type', 'text', 'salesrole', null, 'custpage_ilo_searchdetails');
            screen_type.setDefaultValue('2')
            screen_type.setDisplayType('hidden');


            form.addSubmitButton('בצע');
            var checkType = form.addField('custpage_ilo_check_stage', 'text', 'check', null, null);
            checkType.setDefaultValue('3');
            checkType.setDisplayType('hidden');

            var salesroleField = form.addField('custpage_ilo_salesrole', 'text', 'salesrole', null, 'custpage_ilo_searchdetails');
            salesroleField.setDefaultValue(salesrole)
            salesroleField.setDisplayType('hidden');

            form.setScript('customscript_customer_agreement_cs');

            var resultsSubList = form.addSubList('custpage_results_sublist', 'list', agreementList.length + ':תוצאות - מספר השורות', null);

            resultsSubList.addButton('customscript_marlk_all', 'Mark All', 'MarkAll()');
            resultsSubList.addButton('customscript_un_marlk_all', 'Unmark All', 'UnmarkAll()');
            resultsSubList.addButton('customscript_export', 'Export To Excel', 'ff()');

            resultsSubList.addField('custpage_result_cb', 'checkbox', 'בחירה');
            resultsSubList.addField('custpage_result_view', 'checkbox', 'תצוגה')     
            resultsSubList.addField('custpage_result_sap_num', 'text', 'מספר לקוח בSAP').setDisplayType('disabled');
         
            resultsSubList.addField('custpage_result_customer_name', 'text', 'לקוח').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_agreement_name', 'text', 'שם ההסכם').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_biid_tranid', 'text', 'הוראת חיוב').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_status', 'text', 'סטטוס הוראת חיוב').setDisplayType('disabled');       
            resultsSubList.addField('custpage_result_monthly_charge', 'text', 'חיוב חודשי קבוע').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_sugg_monthly_charge', 'text', 'הצעת חיוב החודש').setDisplayType('disabled');
            var billing_type_field = resultsSubList.addField('custpage_result_billing_type', 'select', 'סוג חיוב', null)
            billing_type_field.addSelectOption('', '');
            billing_type_field.addSelectOption('1', 'חיוב מסלול');
            billing_type_field.addSelectOption('2', 'שכירות מכונה');
            billing_type_field.addSelectOption('3', 'חיוב מיוחד');
            billing_type_field.addSelectOption('4', 'ללא חיוב');
  
            if (salesrole == '2') {
                resultsSubList.addField('custpage_result_matal_sum', 'text', 'סכום חיוב מתל').setDisplayType('disabled');
                billing_type_field.setDisplayType('inline')
                resultsSubList.addField('custpage_sales_rep', 'text', 'איש מכירות').setDisplayType('disabled');
            }
            resultsSubList.addField('custpage_result_curr_monthly_charge', 'currency', 'חיוב החודש').setDisplayType('entry');
            resultsSubList.addField('custpage_result_comment', 'text', 'הערה').setDisplayType('entry');

       
            resultsSubList.addField('custpage_result_beans_of_coffee', 'text', 'צריכה בפועל פולי קפה').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_capsules', 'text', 'צריכה בפועל קפסולות').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_shko_use', 'text', 'צריכה בפועל אבקות שוקו').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_milk_use', 'text', 'צריכה בפועל אבקות חלב').setDisplayType('disabled');

            resultsSubList.addField('custpage_result_last_month_charge', 'text', 'חיוב חודש קודם').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_last2_month_charge', 'text', 'חיוב חודשיים אחורה').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_last3_month_charge', 'text', 'חיוב שלושה חודשים אחורה').setDisplayType('disabled');


            resultsSubList.addField('custpage_result_over_pul', 'text', 'צריכת פולי קפה מעבר להסכם בקג').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_over_kaps', 'text', 'צריכה קפסולות מעבר להסכם').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_over_avk', 'text', 'צריכת אבקות מעבר להסכם בקג').setDisplayType('disabled');

            resultsSubList.addField('custpage_result_pul', 'text', 'צריכה פולי קפה הסכם').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_kaps', 'text', 'צריכה קפסולות הסכם').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_avk', 'text', 'צריכה אבקות הסכם').setDisplayType('disabled');

            resultsSubList.addField('custpage_result_over_pul_price', 'text', 'מחיר חריגה פולים').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_over_kaps_price', 'text', 'מחיר חריגה קפסולות').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_over_milk_price', 'text', 'מחיר חריגה אבקות חלב').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_over_shoko_price', 'text', 'מחיר חריגה שוקו').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_ils_beans_of_coffee', 'text', 'צריכה מעבר להסכם פולי קפה ב שח').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_ils_capsules', 'text', 'צריכה מעבר להסכם קפסולות ב שח').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_ils_pollen', 'text', 'צריכה מעבר להסכם אבקות ב שח').setDisplayType('disabled');
            resultsSubList.addField('custpage_sales_manager_approver', 'text', 'sales_manager_approver').setDisplayType('hidden');
            resultsSubList.addField('custpage_result_customer_id', 'text', 'id').setDisplayType('hidden');
            resultsSubList.addField('custpage_result_biid', 'text', 'BI ID').setDisplayType('hidden');
            resultsSubList.addField('custpage_result_agreement_id', 'text', 'הסכם ID').setDisplayType('hidden');
            resultsSubList.addField('custpage_result_beans_kg', 'text', 'סוג').setDisplayType('hidden');
            resultsSubList.addField('custpage_result_link', 'text', 'סוג').setDisplayType('hidden');
            for (var j = 0; j < agreementList.length; j++) {
                if (salesrole == '1') {
                    if (!isNullOrEmpty(agreementList[j].sales_manager_approver)) {
                        var cbVal = 'F'
                    }
                    else { var cbVal = 'T' }
                }
                else {
                    if (!isNullOrEmpty(agreementList[j].manager_approver)) {
                        var cbVal = 'F'
                    }
                    else { var cbVal = 'T' }
                }
                resultsSubList.setLineItemValue('custpage_result_cb', j + 1, cbVal)
                resultsSubList.setLineItemValue('custpage_result_view', j + 1, 'F')
                resultsSubList.setLineItemValue('custpage_result_sap_num', j + 1, agreementList[j].sap_num)
                resultsSubList.setLineItemValue('custpage_result_customer_id', j + 1, agreementList[j].customer_id)
                resultsSubList.setLineItemValue('custpage_result_customer_name', j + 1, agreementList[j].customer_name)
                resultsSubList.setLineItemValue('custpage_result_agreement_name', j + 1, agreementList[j].agreement_name)
                //resultsSubList.setLineItemValue('custpage_result_num_machine', j + 1, agreementList[j].num_machine)
                resultsSubList.setLineItemValue('custpage_result_monthly_charge', j + 1, agreementList[j].monthly_charge)
                resultsSubList.setLineItemValue('custpage_result_sugg_monthly_charge', j + 1, agreementList[j].curr_monthly_charge)
                resultsSubList.setLineItemValue('custpage_result_last_month_charge', j + 1, agreementList[j].last_month_charge)
                resultsSubList.setLineItemValue('custpage_result_last2_month_charge', j + 1, agreementList[j].last2_month_charge)
                resultsSubList.setLineItemValue('custpage_result_last3_month_charge', j + 1, agreementList[j].last3_month_charge)
                resultsSubList.setLineItemValue('custpage_result_beans_of_coffee', j + 1, agreementList[j].beans_of_coffee)
                resultsSubList.setLineItemValue('custpage_result_capsules', j + 1, agreementList[j].capsules)
                resultsSubList.setLineItemValue('custpage_result_shko_use', j + 1, agreementList[j].shko_use);
                resultsSubList.setLineItemValue('custpage_result_milk_use', j + 1, agreementList[j].milk_use);
                resultsSubList.setLineItemValue('custpage_result_ils_beans_of_coffee', j + 1, agreementList[j].ils_beans_of_coffee)
                resultsSubList.setLineItemValue('custpage_result_ils_capsules', j + 1, agreementList[j].ils_capsules)
                resultsSubList.setLineItemValue('custpage_result_ils_pollen', j + 1, agreementList[j].ils_pollen)
                resultsSubList.setLineItemValue('custpage_result_agreement_id', j + 1, agreementList[j].agreement_id)
                resultsSubList.setLineItemValue('custpage_result_beans_kg', j + 1, agreementList[j].beans_kg)
                resultsSubList.setLineItemValue('custpage_result_link', j + 1, getUrl(agreementList[j].customer_id, 'name'));
                if (salesrole == '2') {
                    resultsSubList.setLineItemValue('custpage_result_matal_sum', j + 1, agreementList[j].matal_sum);
                    resultsSubList.setLineItemValue('custpage_sales_manager_approver', j + 1, agreementList[j].manager_approver);
                    resultsSubList.setLineItemValue('custpage_sales_rep', j + 1, agreementList[j].salesrep);
                    resultsSubList.setLineItemValue('custpage_result_curr_monthly_charge', j + 1, agreementList[j].menael_sum_approval)
                }
                resultsSubList.setLineItemValue('custpage_result_biid', j + 1, agreementList[j].biid);
                if (isNullOrEmpty(agreementList[j].biid_tranid)) { biid = '<span style="background-color:yellow">לא נוצרה הוראת חיוב<span>' }
                else { biid = agreementList[j].biid_tranid }
                resultsSubList.setLineItemValue('custpage_result_biid_tranid', j + 1, biid );
                if (salesrole == '1' && !isNullOrEmpty(agreementList[j].biid_tranid)) {
                    resultsSubList.setLineItemValue('custpage_result_curr_monthly_charge', j + 1, agreementList[j].biid_amount)
                    resultsSubList.setLineItemValue('custpage_sales_manager_approver', j + 1, agreementList[j].sales_manager_approver);
                }
                resultsSubList.setLineItemValue('custpage_result_comment', j + 1, agreementList[j].memo);
                resultsSubList.setLineItemValue('custpage_result_billing_type', j + 1, agreementList[j].billing_type);
                resultsSubList.setLineItemValue('custpage_result_status', j + 1, agreementList[j].status);
                resultsSubList.setLineItemValue('custpage_result_pul', j + 1, agreementList[j].pul);
                resultsSubList.setLineItemValue('custpage_result_kaps', j + 1, agreementList[j].kaps);
                resultsSubList.setLineItemValue('custpage_result_avk', j + 1, agreementList[j].avk);
                resultsSubList.setLineItemValue('custpage_result_over_pul', j + 1, agreementList[j].over_pul);
                resultsSubList.setLineItemValue('custpage_result_over_avk', j + 1, agreementList[j].over_avk);
                resultsSubList.setLineItemValue('custpage_result_over_kaps', j + 1, agreementList[j].over_kaps);
                resultsSubList.setLineItemValue('custpage_result_over_pul_price', j + 1, agreementList[j].over_pul_price);
                resultsSubList.setLineItemValue('custpage_result_over_kaps_price', j + 1, agreementList[j].over_kaps_price);
                resultsSubList.setLineItemValue('custpage_result_over_milk_price', j + 1, agreementList[j].over_milk_price);
                resultsSubList.setLineItemValue('custpage_result_over_shoko_price', j + 1, agreementList[j].over_shoko_price);
            }
            var secondSubList = form.addSubList('custpage_results_second', 'list', 'הצגה', null);

            secondSubList.addButton('customscript_marlk_all', 'Export To Excel', 'fnExcelReport()');

            secondSubList.addField('custpage_result_customer', 'text', 'לקוח')
            secondSubList.addField('custpage_result_sap_number', 'text', 'מספר לקוח בסאפ')
            secondSubList.addField('custpage_result_sales_rep', 'text', 'איש מכירות')
            secondSubList.addField('custpage_result_agreement', 'text', 'הסכם')
            secondSubList.addField('custpage_result_start_date', 'text', 'תאריך תחילת הסכם')
            secondSubList.addField('custpage_result_bi', 'text', 'מספר הוראת חיוב')
            secondSubList.addField('custpage_result_status', 'text', 'סטטוס')
            secondSubList.addField('custpage_result_sys_calc', 'text', 'סכום חישוב מערכת')
            secondSubList.addField('custpage_result_matal_sum', 'text', 'סכום מתל')
            secondSubList.addField('custpage_result_menael_sum', 'text', 'סכום מנהל מכירות')
            secondSubList.addField('custpage_result_memo', 'text', 'הערה')
            secondSubList.addField('custpage_result_type', 'text', 'סוג חיוב')
            secondSubList.addField('custpage_result_sum_charge', 'text', 'חיוב חודשי קבוע')
            if (salesrole == '1') {
                var secondList = matalSummaryTab(sales_rep);
            }
            else if (salesrole == '2') {
                var secondList = menaelSummaryTab(sales_rep);
            }
            var sumOfTotal = 0;
            var sumOfAprrove = 0;
            var numOfBi = [];
            var numOfApprovedBi = [];
            for (var j = 0; j < secondList.length; j++) {
                secondSubList.setLineItemValue('custpage_result_customer', j + 1, secondList[j].customer_name)
                secondSubList.setLineItemValue('custpage_result_sap_number', j + 1, secondList[j].sap_num)
                secondSubList.setLineItemValue('custpage_result_sales_rep', j + 1, secondList[j].sales_rep)
                secondSubList.setLineItemValue('custpage_result_agreement', j + 1, GetAGRLink(secondList[j].agreement, secondList[j].agreement_id))
                secondSubList.setLineItemValue('custpage_result_start_date', j + 1, secondList[j].start_date)
                secondSubList.setLineItemValue('custpage_result_bi', j + 1, GetBILink(secondList[j].bi, secondList[j].bi_id))
                secondSubList.setLineItemValue('custpage_result_status', j + 1, secondList[j].status)
                secondSubList.setLineItemValue('custpage_result_sys_calc', j + 1, secondList[j].sys_calc)
                secondSubList.setLineItemValue('custpage_result_matal_sum', j + 1, secondList[j].matal_sum)
                secondSubList.setLineItemValue('custpage_result_menael_sum', j + 1, secondList[j].menael_sum)
                secondSubList.setLineItemValue('custpage_result_memo', j + 1, secondList[j].memo)
                secondSubList.setLineItemValue('custpage_result_type', j + 1, secondList[j].type)
                secondSubList.setLineItemValue('custpage_result_sum_charge', j + 1, secondList[j].sum_charge)
                sumOfTotal += Number(secondList[j].sum_charge);
                if (!isNullOrEmpty(secondList[j].menael_sum)) {
                    sumOfAprrove += Number(secondList[j].menael_sum);
                }
                if (!isNullOrEmpty(secondList[j].bi)) {
                    numOfBi.push(1);
                }
                if (secondList[j].approved_bi == 'T') {
                    numOfApprovedBi.push(1);
                }
            }
            var total = form.addField('custpage_total', 'text', 'סהכ חיוב חודשי קבוע', null, 'custpage_ilo_details');
            total.setDefaultValue(formatNumber(sumOfTotal));
            total.setDisplayType('inline');
            var num_of_customer = form.addField('custpage_num_of_customer', 'integer', 'סהכ לקוחות', null, 'custpage_ilo_details');
            num_of_customer.setDefaultValue(secondList.length);
            num_of_customer.setDisplayType('inline');
            var num_of_bi = form.addField('custpage_num_of_bi', 'integer', 'סהכ הוראות חיוב', null, 'custpage_ilo_details');
            num_of_bi.setDefaultValue(numOfBi.length);
            num_of_bi.setDisplayType('inline');
            var num_of_approved_bi = form.addField('custpage_num_of_approved_bi', 'integer', 'הוראות חיוב שאושרו', null, 'custpage_ilo_details');
            num_of_approved_bi.setDefaultValue(numOfApprovedBi.length);
            num_of_approved_bi.setDisplayType('inline');
            if (salesrole == '2') {
                var sum_of_approve = form.addField('custpage_sum_of_approve', 'text', 'סהכ שאושר', null, 'custpage_ilo_details');
                sum_of_approve.setDisplayType('inline');
                sum_of_approve.setDefaultValue(formatNumber(sumOfAprrove));
            }
        }
        catch (e) {
            nlapiLogExecution('DEBUG', 'stage two error', e);
        }
    }

    else if (request.getParameter('custpage_ilo_check_stage') == '2.1') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage 2.1', 'stage 2.1');
        try {

            var sales_rep = request.getParameter('custpage_sales_rep');
            var agreement_type = request.getParameter('custpage_agreement_type');
            var customer = request.getParameter('custpage_customer');
            var fromDateData = request.getParameter('custpage_ilo_multi_fromdate');
            var toDateData = request.getParameter('custpage_ilo_multi_todate');
            var price_change = request.getParameter('custpage_price_change');
            var status = request.getParameter('custpage_billing_status');
            var billing_type = request.getParameter('custpage_billing_type');
            var bi_status = ''; // nlapiLookupField('employee', user, 'custpage_bi_status');

            var form = nlapiCreateForm('נציג כספים');

            form.addFieldGroup('custpage_ilo_searchdetails', 'נתונים להזנה');
            form.addFieldGroup('custpage_ilo_details', 'מידע כללי');

            var startDate = form.addField('custpage_ilo_multi_fromdate', 'date', 'מתאריך', null, 'custpage_ilo_searchdetails');
            startDate.setDefaultValue(fromDateData);
            startDate.setDisplayType('inline');

            var totDate = form.addField('custpage_ilo_multi_todate', 'date', 'עד תאריך', null, 'custpage_ilo_searchdetails');
            totDate.setDefaultValue(toDateData);
            totDate.setDisplayType('inline');

            var salesrep = form.addField('custpage_sales_rep', 'select', 'איש מכירות', 'employee', 'custpage_ilo_searchdetails');
            salesrep.setDefaultValue(sales_rep);
            salesrep.setDisplayType('inline');

            var billing_type_field = form.addField('custpage_billing_type', 'select', 'סוג חיוב', 'customlist_billing_type_list', 'custpage_ilo_searchdetails');
            billing_type_field.setDefaultValue(billing_type);
            billing_type_field.setDisplayType('inline');

            var status_field = form.addField('custpage_billing_status', 'select', 'סטטוס', 'customlist_billing_instruction_list', 'custpage_ilo_searchdetails');
            status_field.setDefaultValue(status);
            status_field.setDisplayType('inline');

            var customer_field = form.addField('custpage_customer', 'select', 'לקוח', 'CUSTOMER', 'custpage_ilo_searchdetails');
            customer_field.setDefaultValue(customer);
            customer_field.setDisplayType('inline');

            form.addSubmitButton('בצע');
            var checkType = form.addField('custpage_ilo_check_stage', 'text', 'check', null, null);
            checkType.setDefaultValue('3');
            checkType.setDisplayType('hidden');

            var salesroleField = form.addField('custpage_ilo_salesrole', 'text', 'salesrole', null, 'custpage_ilo_searchdetails');
            salesroleField.setDefaultValue(salesrole)
            salesroleField.setDisplayType('hidden');

            var screen_type = form.addField('custpage_screen_type', 'text', 'salesrole', null, 'custpage_ilo_searchdetails');
            screen_type.setDefaultValue('2.1')
            screen_type.setDisplayType('hidden');

            form.setScript('customscript_customer_agreement_cs');
            setDatesOnUser(fromDateData, toDateData);
            var agreementList = BillingInstructionApproval(agreement_type, sales_rep, customer, price_change, status, billing_type, bi_status);

            var resultsSubList = form.addSubList('custpage_results_sublist', 'list', agreementList.length + ' :תוצאות - מספר השורות', null);
            resultsSubList.addButton('customscript_marlk_all', 'Mark All', 'MarkAll()');
            resultsSubList.addButton('customscript_un_marlk_all', 'Unmark All', 'UnmarkAll()');
            resultsSubList.addField('custpage_result_cb', 'checkbox', 'בחירה');
            resultsSubList.addField('custpage_result_id', 'text', 'ID').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_trandate', 'text', 'תאריך').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_customer_name', 'text', 'לקוח').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_doc_num', 'text', 'מסמך').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_agreement_name', 'text', 'שם ההסכם').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_monthly_charge', 'text', 'חיוב חודשי קבוע').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_sugg_monthly_charge', 'text', 'הצעת חיוב החודש').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_amount_sales_rep', 'text', 'סכום מתל').setDisplayType('disabled');
            resultsSubList.addField('custpage_sales_rep', 'text', 'איש מכירות').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_amount_manager', 'text', 'סכום מנהל מכירות').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_memo', 'text', 'הערה').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_reason', 'text', 'סיבת דחייה').setDisplayType('entry');
            resultsSubList.addField('custpage_result_status', 'text', 'סטטוס').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_billing_type', 'text', 'סוג חיוב').setDisplayType('disabled');          
            resultsSubList.addField('custpage_result_pul_use', 'text', 'צריכה בפועל פולי קפה').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_kasp_use', 'text', 'צריכה בפועל קפסולות').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_shko_use', 'text', 'צריכה בפועל אבקות שוקו').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_milk_use', 'text', 'צריכה בפועל אבקות חלב').setDisplayType('disabled');

            resultsSubList.addField('custpage_result_last_month_charge', 'text', 'חיוב חודש קודם').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_last2_month_charge', 'text', 'חיוב חודשיים אחורה').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_last3_month_charge', 'text', 'חיוב שלושה חודשים אחורה').setDisplayType('disabled');

            resultsSubList.addField('custpage_result_over_pul', 'text', 'צריכת פולי קפה מעבר להסכם בקג').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_over_avk', 'text', 'צריכת אבקות מעבר להסכם בקג').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_over_kaps', 'text', 'צריכה קפסולות מעבר להסכם').setDisplayType('disabled');

            resultsSubList.addField('custpage_result_pul', 'text', 'צריכה פולי קפה הסכם').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_kaps', 'text', 'צריכה קפסולות הסכם').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_avk', 'text', 'צריכה אבקות הסכם').setDisplayType('disabled');

            resultsSubList.addField('custpage_result_over_pul_price', 'text', 'מחיר חריגה פולים').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_over_kaps_price', 'text', 'מחיר חריגה קפסולות').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_over_milk_price', 'text', 'מחיר חריגה אבקות חלב').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_over_shoko_price', 'text', 'מחיר חריגה שוקו').setDisplayType('disabled');
            resultsSubList.addField('custpage_result_color', 'text', 'color').setDisplayType('hidden');

            for (var j = 0; j < agreementList.length; j++) {

                resultsSubList.setLineItemValue('custpage_result_cb', j + 1, 'T');
                resultsSubList.setLineItemValue('custpage_result_id', j + 1, agreementList[j].agreement_id)
                resultsSubList.setLineItemValue('custpage_result_trandate', j + 1, agreementList[j].trandate)
                resultsSubList.setLineItemValue('custpage_result_customer_name', j + 1, agreementList[j].customer_name)
                resultsSubList.setLineItemValue('custpage_result_doc_num', j + 1, agreementList[j].doc_num)
                resultsSubList.setLineItemValue('custpage_result_agreement_name', j + 1, agreementList[j].agreement_name)
                resultsSubList.setLineItemValue('custpage_result_sugg_monthly_charge', j + 1, agreementList[j].sugg_monthly_charge)
                resultsSubList.setLineItemValue('custpage_result_amount_sales_rep', j + 1, agreementList[j].amount_sales_rep)
                resultsSubList.setLineItemValue('custpage_result_amount_manager', j + 1, agreementList[j].amount_manager)
                resultsSubList.setLineItemValue('custpage_result_memo', j + 1, agreementList[j].memo);
                resultsSubList.setLineItemValue('custpage_result_pul', j + 1, agreementList[j].pul);
                resultsSubList.setLineItemValue('custpage_result_kaps', j + 1, agreementList[j].kaps);
                resultsSubList.setLineItemValue('custpage_result_avk', j + 1, agreementList[j].avk);
                resultsSubList.setLineItemValue('custpage_result_pul_use', j + 1, agreementList[j].pul_use);
                resultsSubList.setLineItemValue('custpage_result_kasp_use', j + 1, agreementList[j].kasp_use);
                resultsSubList.setLineItemValue('custpage_result_shko_use', j + 1, agreementList[j].shko_use);
                resultsSubList.setLineItemValue('custpage_result_milk_use', j + 1, agreementList[j].milk_use);
                resultsSubList.setLineItemValue('custpage_result_status', j + 1, agreementList[j].status);
                resultsSubList.setLineItemValue('custpage_result_over_pul', j + 1, agreementList[j].over_pul);
                resultsSubList.setLineItemValue('custpage_result_over_avk', j + 1, agreementList[j].over_avk);
                resultsSubList.setLineItemValue('custpage_result_over_kaps', j + 1, agreementList[j].over_kaps);
                resultsSubList.setLineItemValue('custpage_result_over_pul_price', j + 1, agreementList[j].over_pul_price);
                resultsSubList.setLineItemValue('custpage_result_over_kaps_price', j + 1, agreementList[j].over_kaps_price);
                resultsSubList.setLineItemValue('custpage_result_over_milk_price', j + 1, agreementList[j].over_milk_price);
                resultsSubList.setLineItemValue('custpage_result_over_shoko_price', j + 1, agreementList[j].over_shoko_price);
                resultsSubList.setLineItemValue('custpage_result_billing_type', j + 1, agreementList[j].billing_type);
                resultsSubList.setLineItemValue('custpage_result_color', j + 1, agreementList[j].color);
                resultsSubList.setLineItemValue('custpage_sales_rep', j + 1, agreementList[j].salesrep);
                resultsSubList.setLineItemValue('custpage_result_last_month_charge', j + 1, agreementList[j].last_month_charge)
                resultsSubList.setLineItemValue('custpage_result_last2_month_charge', j + 1, agreementList[j].last2_month_charge)
                resultsSubList.setLineItemValue('custpage_result_last3_month_charge', j + 1, agreementList[j].last3_month_charge)
                resultsSubList.setLineItemValue('custpage_result_monthly_charge', j + 1, agreementList[j].monthly_charge)


            }
            var secondSubList = form.addSubList('custpage_results_second', 'list', 'הצגה', null);
            secondSubList.addButton('customscript_marlk_all', 'Export To Excel', 'fnExcelReport()');
            secondSubList.addField('custpage_result_customer', 'text', 'לקוח')
            secondSubList.addField('custpage_result_sap_number', 'text', 'מספר לקוח בסאפ')
            secondSubList.addField('custpage_result_sales_rep', 'text', 'איש מכירות')
            secondSubList.addField('custpage_result_agreement', 'text', 'הסכם')
            secondSubList.addField('custpage_result_start_date', 'text', 'תאריך התחלת הסכם')
            secondSubList.addField('custpage_result_bi', 'text', 'מספר הוראת חיוב')
            secondSubList.addField('custpage_result_status', 'text', 'סטטוס')
            secondSubList.addField('custpage_result_sys_calc', 'text', 'סכום חישוב מערכת')
            secondSubList.addField('custpage_result_matal_sum', 'text', 'סכום מתל')
            secondSubList.addField('custpage_result_menael_sum', 'text', 'סכום מנהל מכירות')
            secondSubList.addField('custpage_result_memo', 'text', 'הערה')
            secondSubList.addField('custpage_result_type', 'text', 'סוג חיוב')
            secondSubList.addField('custpage_result_sum_charge', 'text', 'חיוב חודשי קבוע')
            var secondList = representativeSummaryTab(price_change, sales_rep);
            var sumOfTotal = 0
            var numOfBi = [];
            var sumOfAprrove = 0;
            var numOfApprovedBi = [];
            for (var j = 0; j < secondList.length; j++) {
                secondSubList.setLineItemValue('custpage_result_customer', j + 1, secondList[j].customer_name)
                secondSubList.setLineItemValue('custpage_result_sap_number', j + 1, secondList[j].sap_num)
                secondSubList.setLineItemValue('custpage_result_sales_rep', j + 1, secondList[j].sales_rep)
                secondSubList.setLineItemValue('custpage_result_agreement', j + 1, GetAGRLink(secondList[j].agreement, secondList[j].agreement_id))
                secondSubList.setLineItemValue('custpage_result_start_date', j + 1, secondList[j].start_date)
                secondSubList.setLineItemValue('custpage_result_bi', j + 1, GetBILink(secondList[j].bi, secondList[j].bi_id))
                secondSubList.setLineItemValue('custpage_result_status', j + 1, secondList[j].status)
                secondSubList.setLineItemValue('custpage_result_sys_calc', j + 1, secondList[j].sys_calc)
                secondSubList.setLineItemValue('custpage_result_matal_sum', j + 1, secondList[j].matal_sum)
                secondSubList.setLineItemValue('custpage_result_menael_sum', j + 1, secondList[j].menael_sum)
                secondSubList.setLineItemValue('custpage_result_memo', j + 1, secondList[j].memo)
                secondSubList.setLineItemValue('custpage_result_type', j + 1, secondList[j].type)
                secondSubList.setLineItemValue('custpage_result_sum_charge', j + 1, secondList[j].sum_charge)
                sumOfTotal += Number(secondList[j].sum_charge)
                if (!isNullOrEmpty(secondList[j].bi)) {
                    numOfBi.push(1);
                }
                if (secondList[j].approved_bi == 'T') {
                    numOfApprovedBi.push(1);
                }
                if (!isNullOrEmpty(secondList[j].menael_sum)) {
                    sumOfAprrove += Number(secondList[j].menael_sum);
                }
            }
            var total = form.addField('custpage_total', 'text', 'סהכ חיוב חודשי קבוע', null, 'custpage_ilo_details');
            total.setDefaultValue(formatNumber(sumOfTotal));
            total.setDisplayType('inline');
            var num_of_customer = form.addField('custpage_num_of_customer', 'integer', 'סהכ לקוחות', null, 'custpage_ilo_details');
            num_of_customer.setDefaultValue(secondList.length);
            num_of_customer.setDisplayType('inline');
            var num_of_bi = form.addField('custpage_num_of_bi', 'integer', 'סהכ הוראות חיוב', null, 'custpage_ilo_details');
            num_of_bi.setDefaultValue(numOfBi.length);
            num_of_bi.setDisplayType('inline');
            var num_of_approved_bi = form.addField('custpage_num_of_approved_bi', 'integer', 'הוראות חיוב שאושרו', null, 'custpage_ilo_details');
            num_of_approved_bi.setDefaultValue(numOfApprovedBi.length);
            num_of_approved_bi.setDisplayType('inline');
            var sum_of_approve = form.addField('custpage_sum_of_approve', 'text', 'סהכ שאושר', null, 'custpage_ilo_details');
            sum_of_approve.setDisplayType('inline');
            sum_of_approve.setDefaultValue(formatNumber(sumOfAprrove));
        }
        catch (e) {
            nlapiLogExecution('DEBUG', 'stage 2.1 error', e);
        }

    }

    else if (request.getParameter('custpage_ilo_check_stage') == '3') {

        nlapiLogExecution('DEBUG', 'stage 3', 'stage 3');

        try {
            var form = nlapiCreateForm('');
            var screen_type = request.getParameter('custpage_screen_type');
            var LinesNo = request.getLineItemCount('custpage_results_sublist');
            if (screen_type == '2') {
                var toDateData = request.getParameter('custpage_ilo_multi_todate');
                var salesrole = request.getParameter('custpage_ilo_salesrole');
                var data = [];
                var data_for_update = [];
                for (var m = 1; m <= LinesNo; m++) {
                    checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_result_cb', m);
                    if (checkBox == 'T') {
                        billing_type = request.getLineItemValue('custpage_results_sublist', 'custpage_result_billing_type', m);
                        if (salesrole == '1') {
                            sugg_monthly_charge = request.getLineItemValue('custpage_results_sublist', 'custpage_result_sugg_monthly_charge', m);
                            curr_monthly_charge = request.getLineItemValue('custpage_results_sublist', 'custpage_result_curr_monthly_charge', m);
                            if (isNullOrEmpty(curr_monthly_charge)) { rate = sugg_monthly_charge }
                            else { rate = curr_monthly_charge };
                            entity = request.getLineItemValue('custpage_results_sublist', 'custpage_result_customer_id', m);
                            memo = request.getLineItemValue('custpage_results_sublist', 'custpage_result_comment', m);
                            agreement = request.getLineItemValue('custpage_results_sublist', 'custpage_result_agreement_id', m);
                            beans_kg = request.getLineItemValue('custpage_results_sublist', 'custpage_result_beans_kg', m);
                            biid = request.getLineItemValue('custpage_results_sublist', 'custpage_result_biid', m);
                            result_monthly_charge = request.getLineItemValue('custpage_results_sublist', 'custpage_result_monthly_charge', m);
                            if (NumberToRate(result_monthly_charge) != NumberToRate(rate)) { var change = 'T'; }
                            else { var change = 'F'; }
                            if (isNullOrEmpty(biid)) {
                                data.push({
                                    entity: entity,
                                    enddate: toDateData,
                                    rate: rate,
                                    memo: memo,
                                    agreement: agreement,
                                    beans_kg: beans_kg,
                                    sugg_monthly_charge: rate,
                                    sales_rep_creator: user,
                                    calculated_amount_system: sugg_monthly_charge,
                                    toDateData: toDateData,
                                    billing_type: billing_type,
                                    change: change,
                                });
                            }
                            else {
                                data_for_update.push({
                                    id: biid,
                                    curr_monthly_charge: curr_monthly_charge,
                                    memo: memo,
                                });
                            }
                        }
                        else if (salesrole == '2') {
                            matal_monthly_charge = request.getLineItemValue('custpage_results_sublist', 'custpage_result_matal_sum', m);
                            curr_monthly_charge = request.getLineItemValue('custpage_results_sublist', 'custpage_result_curr_monthly_charge', m);
                            if (isNullOrEmpty(curr_monthly_charge)) {
                                rate = matal_monthly_charge;
                                curr_monthly_charge = matal_monthly_charge;
                            }
                            else { rate = curr_monthly_charge };
                            beans_kg = request.getLineItemValue('custpage_results_sublist', 'custpage_result_beans_kg', m);
                            biId = request.getLineItemValue('custpage_results_sublist', 'custpage_result_biid', m); //todo
                            memo = request.getLineItemValue('custpage_results_sublist', 'custpage_result_comment', m);
                            sugg_monthly_charge = request.getLineItemValue('custpage_results_sublist', 'custpage_result_sugg_monthly_charge', m);
                            result_monthly_charge = request.getLineItemValue('custpage_results_sublist', 'custpage_result_monthly_charge', m);
                            //nlapiLogExecution('DEBUG', 'sugg_monthly_charge 3', NumberToRate(sugg_monthly_charge));
                            //nlapiLogExecution('DEBUG', 'curr_monthly_charge 3', curr_monthly_charge);
                            if (NumberToRate(result_monthly_charge) != NumberToRate(curr_monthly_charge)) { var change = 'T'; }
                            else { var change = 'F'; }
                            data.push({
                                billing_instruction: biId,
                                sales_manager_approver: user,
                                amount_sales_manager: rate,
                                memo: memo,
                                change: change,
                                billing_type: billing_type
                            });
                        }
                    }
                }
                nlapiLogExecution('DEBUG', 'salesrole', salesrole);
                try { nlapiScheduleScript('customscript_customer_agreement_ss', null, { custscript_first_data: JSON.stringify(data), custscript_second_data: JSON.stringify(data_for_update), custscript_salesrole: salesrole }) } catch (e) { }
            }
            else { //(screen_type == '2.1')
                var data = [];
                var data_for_reason = [];
                for (var m = 1; m <= LinesNo; m++) {
                    checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_result_cb', m);
                    reason = request.getLineItemValue('custpage_results_sublist', 'custpage_result_reason', m);
                    if (checkBox == 'T' && isNullOrEmpty(reason)) {
                        var result_id = request.getLineItemValue('custpage_results_sublist', 'custpage_result_id', m);
                        data.push({
                            id: result_id,
                        });
                    }
                    else if (checkBox == 'T' && !isNullOrEmpty(reason)) {
                        var result_id = request.getLineItemValue('custpage_results_sublist', 'custpage_result_id', m);
                        data_for_reason.push({
                            id: result_id,
                            reason: reason
                        });
                    }
                }
                try { nlapiScheduleScript('customscript_customer_agreement_ss', null, { custscript_first_data: JSON.stringify(data), custscript_second_data: JSON.stringify(data_for_reason), custscript_salesrole: '3' }) } catch (e) { }
            }
            var getUserMail = nlapiGetContext().getEmail();
            var htmlField1 = form.addField('custpage_header1', 'inlinehtml');
            htmlField1.setDefaultValue("<span style='font-size:18px'>An email with the summary of results will be sent to : <b> " + getUserMail + "</b> once completed.<br></span>");


        }
        catch (e) {
            nlapiLogExecution('DEBUG', 'stage 3 error', e);
        }
    }
    response.writePage(form);
}
//DS FF screen search
function AgreementDate(agreement_type, salesrep, customer, status, billing_type) {
    //nlapiLogExecution('DEBUG', 'agreement_type', agreement_type);
    var loadedSearch = nlapiLoadSearch(null, 'customsearch483');
    if (!isNullOrEmpty(agreement_type)) { loadedSearch.addFilter(new nlobjSearchFilter('custrecord_agreement_type', 'custbody_agreement', 'anyof', agreement_type)); }
    if (!isNullOrEmpty(salesrep)) { loadedSearch.addFilter(new nlobjSearchFilter('salesrep', 'customer', 'anyof', salesrep)); }
    if (!isNullOrEmpty(customer)) { loadedSearch.addFilter(new nlobjSearchFilter('entity', null, 'anyof', customer)); }
    if (!isNullOrEmpty(status)) { loadedSearch.addFilter(new nlobjSearchFilter('custbody_billing_instraction_status', null, 'anyof', status)); }
    if (!isNullOrEmpty(billing_type)) { loadedSearch.addFilter(new nlobjSearchFilter('custbody_billing_type', null, 'anyof', billing_type)); }
    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
            ils_pollen = pollenCalc(s[i].getValue(cols[24]), s[i].getValue(cols[25]), s[i].getValue(cols[26]), s[i].getValue(cols[27]), s[i].getValue(cols[28]), s[i].getValue(cols[29]));
            ils_pollen = Number(ils_pollen).toFixed(2);
            monthly_charge = s[i].getValue(cols[3]);
            results.push({
                customer_id: s[i].getValue(cols[0]),
                customer_name: s[i].getText(cols[0]),
                sap_num: s[i].getValue(cols[1]), // SAP NUMBER
                agreement_name: s[i].getValue(cols[2]),
                num_machine: '', // TODO
                monthly_charge: formatNumber(monthly_charge), //חיוב חודשי קבוע בהסכם
                curr_monthly_charge: formatNumber(Number(monthly_charge) + Number(s[i].getValue(cols[19])) + Number(s[i].getValue(cols[22])) + Number(ils_pollen) + Number(s[i].getValue(cols[30]))),
                last_month_charge: formatNumber(s[i].getValue(cols[14])), // חיוב חודש קודם
                last2_month_charge: formatNumber(s[i].getValue(cols[15])),
                last3_month_charge: formatNumber(s[i].getValue(cols[16])),
                cups_of_coffee: '',
                beans_of_coffee: s[i].getValue(cols[10]), // צריכת פולי קפה
                capsules: s[i].getValue(cols[11]),
                shko_use: s[i].getValue(cols[26]),
                milk_use: s[i].getValue(cols[29]),
                ils_beans_of_coffee: s[i].getValue(cols[19]), //צריכה מעבר להסכם פולי קפה ב ש"ח
                ils_capsules: s[i].getValue(cols[30]), //צריכה מעבר להסכם קפסולות ב- ש"ח TODO
                ils_pollen: ils_pollen, //צריכה מעבר להסכם אבקות ב- ש"ח                   
                agreement_type: s[i].getText(cols[32]),
                agreement_id: s[i].getValue(cols[33]),
                beans_kg: s[i].getValue(cols[16]),
                billing_type: billing_type_val(s[i].getValue(cols[40])),
                status: s[i].getValue(cols[8]),
                biid: s[i].getValue(cols[34]),
                biid_tranid: s[i].getValue(cols[36]),
                biid_amount: s[i].getValue(cols[37]),
                pul: s[i].getValue(cols[4]),
                kaps: s[i].getValue(cols[5]),
                avk: s[i].getValue(cols[7]),
                over_pul: s[i].getValue(cols[17]),
                over_avk: s[i].getValue(cols[25]),
                over_kaps: s[i].getValue(cols[31]),
                over_pul_price: s[i].getValue(cols[18]),
                over_kaps_price: s[i].getValue(cols[20]),
                over_milk_price: s[i].getValue(cols[27]),
                over_shoko_price: s[i].getValue(cols[28]),
                sales_manager_approver: s[i].getValue(cols[39]),
                memo: s[i].getValue(cols[41]),

            });
        }
    }
    nlapiLogExecution('DEBUG', 'results: ' + results.length, JSON.stringify(results));
    return results;
}
//DS FF screen search MM 
function AgreementDate2(agreement_type, salesrep, customer, status, billing_type) {
    nlapiLogExecution('DEBUG', 'AgreementDate2', status);
    var loadedSearch = nlapiLoadSearch(null, 'customsearch_ds_ff_screen_2');
    if (!isNullOrEmpty(agreement_type)) { loadedSearch.addFilter(new nlobjSearchFilter('custrecord_agreement_type', 'custbody_agreement', 'anyof', agreement_type)); }
    if (!isNullOrEmpty(salesrep)) { loadedSearch.addFilter(new nlobjSearchFilter('salesrep', 'customer', 'anyof', salesrep)); }
    if (!isNullOrEmpty(customer)) { loadedSearch.addFilter(new nlobjSearchFilter('entity', null, 'anyof', customer)); }
    if (!isNullOrEmpty(status)) { loadedSearch.addFilter(new nlobjSearchFilter('custbody_billing_instraction_status', null, 'anyof', status)); }
    if (!isNullOrEmpty(billing_type)) { loadedSearch.addFilter(new nlobjSearchFilter('custbody_billing_type', null, 'anyof', billing_type)); }

    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
            ils_pollen = pollenCalc(s[i].getValue(cols[24]), s[i].getValue(cols[25]), s[i].getValue(cols[26]), s[i].getValue(cols[27]), s[i].getValue(cols[28]), s[i].getValue(cols[29]));
            ils_pollen = Number(ils_pollen).toFixed(2);
            monthly_charge = s[i].getValue(cols[3]);
            menael_sum_approval = s[i].getValue(cols[46]);
            if (isNullOrEmpty(menael_sum_approval)) {
                menael_sum_approval = s[i].getValue(cols[45]);
            }
            results.push({
                customer_id: s[i].getValue(cols[0]),
                customer_name: s[i].getText(cols[0]),
                sap_num: s[i].getValue(cols[1]), // SAP NUMBER
                agreement_name: s[i].getValue(cols[2]),
                num_machine: '', // TODO
                monthly_charge: formatNumber(monthly_charge), //חיוב חודשי קבוע בהסכם
                curr_monthly_charge: formatNumber(s[i].getValue(cols[43])),
                last_month_charge: formatNumber(s[i].getValue(cols[14])), // חיוב חודש קודם
                last2_month_charge: formatNumber(s[i].getValue(cols[15])),
                last3_month_charge: formatNumber(s[i].getValue(cols[16])),
                cups_of_coffee: '',
                beans_of_coffee: s[i].getValue(cols[10]), // צריכה בפועל פולי קפה
                capsules: s[i].getValue(cols[11]),
                shko_use: s[i].getValue(cols[26]),
                milk_use: s[i].getValue(cols[29]),
                ils_beans_of_coffee: s[i].getValue(cols[19]), //צריכה מעבר להסכם פולי קפה ב ש"ח
                ils_capsules: s[i].getValue(cols[30]), //צריכה מעבר להסכם קפסולות ב- ש"ח TODO
                ils_pollen: ils_pollen, //צריכה מעבר להסכם אבקות ב- ש"ח                   
                agreement_type: s[i].getText(cols[32]),
                agreement_id: s[i].getValue("internalid", "CUSTBODY_AGREEMENT", "GROUP"),
                beans_kg: s[i].getValue(cols[16]),
                matal_sum: formatNumber(s[i].getValue(cols[34])),
                biid: s[i].getValue(cols[35]),
                memo: s[i].getValue(cols[36]),
                billing_type: billing_type_val(s[i].getValue(cols[39])),
                status: s[i].getValue(cols[8]),
                biid_tranid: s[i].getValue(cols[40]),
                pul: s[i].getValue(cols[4]),
                kaps: s[i].getValue(cols[5]),
                avk: s[i].getValue(cols[7]),
                over_pul: s[i].getValue(cols[17]),
                over_avk: s[i].getValue(cols[25]),
                over_kaps: s[i].getValue(cols[31]),
                over_pul_price: s[i].getValue(cols[18]),
                over_kaps_price: s[i].getValue(cols[20]),
                over_milk_price: s[i].getValue(cols[27]),
                over_shoko_price: s[i].getValue(cols[28]),
                manager_approver: s[i].getValue(cols[41]),
                salesrep: s[i].getValue(cols[44]),
                menael_sum_approval: menael_sum_approval,


            });
        }
    }
    nlapiLogExecution('DEBUG', 'results: ' + results.length, JSON.stringify(results));
    return results;
}
function getAllSalesReps() {

    var results = [];
    var toReturn = [];


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('entityid').setSort();
    //columns[1] = new nlobjSearchColumn('internlid');


    var filters = new Array();
    filters[0] = new nlobjSearchFilter('salesrep', null, 'is', 'T')


    var search = nlapiCreateSearch('employee', filters, columns);
    var resultset = search.runSearch();
    results = resultset.getResults(0, 1000);


    if (results != []) {
        results.forEach(function (line) {


            toReturn.push({
                name: line.getValue('entityid'),
                id: line.id,
            })


        });
    }

    return toReturn;
}
function formatNumber(num) {
    var num = parseFloat(num).toFixed(2)
    if (num != '' && num != undefined && num != null && !isNaN(num)) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return '0.00'
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function setDatesOnUser(fromDate, toDate) {

    var context = nlapiGetContext();
    var user = context.user;

    var fields = new Array();
    fields[0] = 'custentity_financial_report_from_date';
    fields[1] = 'custentity_fin_report_to_date';
    var values = new Array();
    values[0] = fromDate;
    values[1] = toDate;

    nlapiSubmitField('employee', user, fields, values);

}
function pollenCalc(powder_products_kg, over, chocoUse, milkPrice, chocoPrice, milkUse) {
    if (!isNullOrEmpty(powder_products_kg) && !isNullOrEmpty(over) && !isNullOrEmpty(chocoUse) && !isNullOrEmpty(milkUse) &&
        !isNullOrEmpty(chocoPrice) && !isNullOrEmpty(milkPrice)) {
        //nlapiLogExecution('DEBUG', 'powder_products_kg: ', powder_products_kg);
        //nlapiLogExecution('DEBUG', 'over: ', over);
        //nlapiLogExecution('DEBUG', 'chocoUse: ', chocoUse);
        //nlapiLogExecution('DEBUG', 'milkUse: ', milkUse);
        //nlapiLogExecution('DEBUG', 'chocoPrice: ', chocoPrice);
        //nlapiLogExecution('DEBUG', 'milkPrice: ', milkPrice);
        var total = Number(milkUse) + Number(chocoUse);
        //nlapiLogExecution('DEBUG', 'total: ', total);
        var ratio_milk = Number(milkUse) / total;
        //nlapiLogExecution('DEBUG', 'ratio_milk: ', ratio_milk);

        var ratio_choco = Number(chocoUse) / total;
        //nlapiLogExecution('DEBUG', 'ratio_choco: ', ratio_choco);
        var milk_ils = ratio_milk * over * Number(milkPrice);
        //nlapiLogExecution('DEBUG', 'milk_ils: ', milk_ils);

        var choco_ils = ratio_choco * over * Number(chocoPrice);
        //nlapiLogExecution('DEBUG', 'choco_ils: ', choco_ils);
        var res = Number(milk_ils) + Number(choco_ils);
        //nlapiLogExecution('DEBUG', 'res: ', res);
        if (isNaN(res)) res = 0;
        return res;
    }
    else return 0;

}
function NumberToRate(number) {

    return number.replace(new RegExp(",", "g"), "")
}
function getUrl(customer) {

    var res = "https://" + company + '.app.netsuite.com/app/site/hosting/scriptlet.nl?script=453&deploy=1&customer=' + customer;
    //var res = 'https://' + company + '.app.netsuite.com/app/accounting/transactions/' + getTypeUrl(type) + '.nl?id=' + internalid;
    return res;
}
function getAgreementsTrans(BillingIns_id, agreement) {

    var loadedSearch = nlapiLoadSearch(null, 'customsearch_df_ff_dril_down');
    loadedSearch.addFilter(new nlobjSearchFilter('custbody_agreement', null, 'anyof', agreement));

    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (s.length > 0) {
        for (var i = 0; i < s.length; i++) {
            nlapiSubmitField('itemfulfillment', s[i].getValue("internalid", null, "GROUP"), 'custbody_related_billing_instruction', BillingIns_id);
        }

    }
}
function billing_type_val(type) {
    var res = '';
    if (type == 'חיוב מסלול') {
        res = '1';
    }
    else if (type == 'שכירות מכונה') {
        res = '2';
    }
    else if (type == 'חיוב מיוחד') {
        res = '3';
    }
    else if (type == 'ללא חיוב') {
        res = '4';
    }
    return res;
}
function billing_type(billing_type, sugg_monthly_charge, rate) {
    if (!isNullOrEmpty(billing_type)) { return billing_type }
    else if (sugg_monthly_charge == rate) { return '1' }
    else return '3';
}
//DS FF Screen Search FR NEW
function BillingInstructionApproval(agreement_type, salesrep, customer, price_change, status, billing_type) {
  
    var loadedSearch = nlapiLoadSearch(null, 'customsearch1248');
  

    if (!isNullOrEmpty(agreement_type)) { loadedSearch.addFilter(new nlobjSearchFilter('custrecord_agreement_type', 'custbody_agreement', 'anyof', agreement_type)); }
    if (!isNullOrEmpty(salesrep)) { loadedSearch.addFilter(new nlobjSearchFilter('salesrep', 'customer', 'anyof', salesrep)); }
    if (!isNullOrEmpty(customer)) { loadedSearch.addFilter(new nlobjSearchFilter('entity', null, 'anyof', customer)); }
    if (!isNullOrEmpty(price_change)) { loadedSearch.addFilter(new nlobjSearchFilter('custbody_price_change', null, 'is', price_change)); }
    if (!isNullOrEmpty(status)) { loadedSearch.addFilter(new nlobjSearchFilter('custbody_billing_instraction_status', null, 'anyof', status)); }
    if (!isNullOrEmpty(billing_type)) { loadedSearch.addFilter(new nlobjSearchFilter('custbody_billing_type', null, 'anyof', billing_type)); }


    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
            results.push({
                trandate: s[i].getValue(cols[41]),
                customer_name: s[i].getText(cols[0]),
                doc_num: s[i].getValue(cols[44]),
                agreement_name: s[i].getValue(cols[2]),
                agreement_id: s[i].getValue(cols[35]),
                sugg_monthly_charge: formatNumber(s[i].getValue(cols[43])),
                amount_sales_rep: s[i].getValue(cols[34]),
                amount_manager: s[i].getValue(cols[40]),
                memo: s[i].getValue(cols[36]),
                pul: s[i].getValue(cols[4]),
                kaps: s[i].getValue(cols[5]),
                avk: s[i].getValue(cols[7]),
                pul_use: s[i].getValue(cols[10]),
                kasp_use: s[i].getValue(cols[11]),
                shko_use: s[i].getValue(cols[26]),
                milk_use: s[i].getValue(cols[29]),
                status: s[i].getValue(cols[8]),
                over_pul: s[i].getValue(cols[17]),
                over_avk: s[i].getValue(cols[25]),
                over_kaps: s[i].getValue(cols[31]),
                over_pul_price: s[i].getValue(cols[18]),
                over_kaps_price: s[i].getValue(cols[20]),
                over_milk_price: s[i].getValue(cols[27]),
                over_shoko_price: s[i].getValue(cols[28]),
                billing_type: s[i].getValue(cols[39]),
                color: s[i].getValue(cols[47]),
                salesrep: s[i].getValue(cols[46]),
                last_month_charge: formatNumber(s[i].getValue(cols[14])), // חיוב חודש קודם
                last2_month_charge: formatNumber(s[i].getValue(cols[15])),
                last3_month_charge: formatNumber(s[i].getValue(cols[16])),
                monthly_charge: formatNumber(s[i].getValue(cols[3])),
            });
        }
    }
    nlapiLogExecution('DEBUG', 'results: ' + results.length, JSON.stringify(results));
    return results;
}
////////////////////////////////////////////////////////////////
function matalSummaryTab(salesrep) {
    nlapiLogExecution('DEBUG', 'matalSummaryTab salesrep', salesrep);
    var loadedSearch = nlapiLoadSearch(null, 'customsearch801');
    loadedSearch.addFilter(new nlobjSearchFilter('salesrep', 'customer', 'anyof', salesrep))
    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
            results.push({
                customer_id: s[i].getValue(cols[0]),
                customer_name: s[i].getText(cols[0]),
                sap_num: s[i].getValue(cols[1]),
                sales_rep: s[i].getValue(cols[2]),
                agreement: s[i].getValue(cols[3]),
                start_date: s[i].getValue(cols[4]),
                bi: s[i].getValue(cols[5]),
                status: s[i].getValue(cols[6]),
                sys_calc: s[i].getValue(cols[7]),
                matal_sum: s[i].getValue(cols[8]),
                menael_sum: s[i].getValue(cols[9]),
                memo: s[i].getValue(cols[10]),
                type: s[i].getValue(cols[11]),
                bi_id: s[i].getValue(cols[12]),
                sum_charge: s[i].getValue(cols[13]),
                agreement_id: s[i].getValue(cols[14]),
                approved_bi: s[i].getValue(cols[16]),
            });
        }
    }
    nlapiLogExecution('DEBUG', 'matalSummaryTab results: ' + results.length, JSON.stringify(results));
    return results;
}
function menaelSummaryTab(salesrep) {
    //nlapiLogExecution('DEBUG', 'agreement_type', agreement_type);
    var loadedSearch = nlapiLoadSearch(null, 'customsearch803');
    if (!isNullOrEmpty(salesrep)) {
        loadedSearch.addFilter(new nlobjSearchFilter('salesrep', null, 'anyof', salesrep))
    }
    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
            results.push({
                customer_id: s[i].getValue(cols[0]),
                customer_name: s[i].getText(cols[0]),
                sap_num: s[i].getValue(cols[1]),
                sales_rep: s[i].getValue(cols[2]),
                agreement: s[i].getValue(cols[3]),
                start_date: s[i].getValue(cols[4]),
                bi: s[i].getValue(cols[5]),
                status: s[i].getValue(cols[6]),
                sys_calc: s[i].getValue(cols[7]),
                matal_sum: s[i].getValue(cols[8]),
                menael_sum: s[i].getValue(cols[9]),
                memo: s[i].getValue(cols[10]),
                type: s[i].getValue(cols[11]),
                bi_id: s[i].getValue(cols[12]),
                sum_charge: s[i].getValue(cols[13]),
                agreement_id: s[i].getValue(cols[14]),
                approved_bi: s[i].getValue(cols[15]),
            });
        }
    }
    nlapiLogExecution('DEBUG', 'menaelSummaryTab results: ' + results.length, JSON.stringify(results));
    return results;
}
function representativeSummaryTab(price_change, salesrep) {
    nlapiLogExecution('DEBUG', 'price_change', price_change);
    var loadedSearch = nlapiLoadSearch(null, 'customsearch804');
    if (!isNullOrEmpty(price_change)) {
        var strFormula = "case when {type} = 'Billing Instruction' and {trandate} between {user.custentity_financial_report_from_date} and  {user.custentity_fin_report_to_date} then {custbody_price_change} else null end";
        loadedSearch.addFilter(new nlobjSearchFilter("formulatext", null, 'is', price_change).setFormula(strFormula));
    }
    if (!isNullOrEmpty(salesrep)) {
        loadedSearch.addFilter(new nlobjSearchFilter('salesrep', null, 'anyof', salesrep))
    }

    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
            results.push({
                customer_id: s[i].getValue(cols[0]),
                customer_name: s[i].getText(cols[0]),
                sap_num: s[i].getValue(cols[1]),
                sales_rep: s[i].getValue(cols[2]),
                agreement: s[i].getValue(cols[3]),
                start_date: s[i].getValue(cols[4]),
                bi: s[i].getValue(cols[5]),
                status: s[i].getValue(cols[6]),
                sys_calc: s[i].getValue(cols[7]),
                matal_sum: s[i].getValue(cols[8]),
                menael_sum: s[i].getValue(cols[9]),
                memo: s[i].getValue(cols[10]),
                type: s[i].getValue(cols[11]),
                bi_id: s[i].getValue(cols[12]),
                sum_charge: s[i].getValue(cols[13]),
                agreement_id: s[i].getValue(cols[14]),
                approved_bi: s[i].getValue(cols[16]),
            });
        }
    }
    nlapiLogExecution('DEBUG', 'results: ' + results.length, JSON.stringify(results));
    return results;
}
function GetAGRLink(source, sourceID) {

    var link = "<a href='https://" + company + ".app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=140&&id=" + sourceID + "'" + 'target="_blank">' + source + "</a>";
    return link;

}
function GetBILink(name, id) {

    var link = "<a href='https://" + company + ".app.netsuite.com/app/accounting/transactions/cutrsale.nl?id=" + id + "'" + 'target="_blank">' + name + "</a>";
    return link;

}
