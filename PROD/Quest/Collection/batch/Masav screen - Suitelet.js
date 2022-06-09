var user_name = nlapiGetContext().user
var wire_id = 8;//wire list value
var credit_card_id = 10;//credit card id value
var payment_account = 440

function masav_screen(request, response) {

    nlapiLogExecution('DEBUG', 'SCRIPT', 'RUN');
    try {

        var form = nlapiCreateForm('Masav/Credit Guard');
        form.addFieldGroup('custpage_searchdetails', 'Details');


        if (request.getMethod() == 'GET') {
            //****************************************************First Charge*********************************************************
            nlapiLogExecution('DEBUG', 'stage one', 'stage one');

            var select = form.addField('custpage_selectfield', 'select', 'Payment Method');
            select.addSelectOption('w', 'Wire');
            select.addSelectOption('c', 'Credit Guard');

            var duedate = form.addField('custpage_duedate', 'date', 'Due Date');
            duedate.setMandatory(true);
            duedate.setDefaultValue(getdate());
            duedate.setDisplayType('inline');

            var batch = form.addField('custpage_batch', 'text', 'Batch');
            batch.setDisplayType('inline');

            //batch.setMandatory(true);

            var stage = form.addField('custpage_stage', 'integer', 'Stage');
            stage.setDefaultValue(1);
            stage.setDisplayType('hidden');


            /*var fieldSrch = paymentmethodValueSearch();
            nlapiLogExecution('DEBUG', 'paymentmethodValueSearch - fieldSrch', JSON.stringify(fieldSrch));
            var coafield = form.addField('custpage_payment_account', 'select', 'Payment Account');
            coafield.addSelectOption('', '');
            fieldSrch.forEach(function (opt) {
                coafield.addSelectOption(opt.id, opt.name);
            });
            coafield.setMandatory(true);*/


            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Sublist!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



            /*if (request.getParameter('custid') == null) {
                throw nlapiCreateError('Value Missing', 'This screen can be opened from the invoice record only', true);
            }*/

            form.addSubmitButton('Present Customers');
            response.writePage(form);
        }
        else {
            //****************************************************Second Charge*********************************************************

            //var scust = request.getParameter('custpage_customer');
            var sSelectfield = request.getParameter('custpage_selectfield');
            var sStage = parseInt(request.getParameter('custpage_stage')) + 1;
            var sduedate = request.getParameter('custpage_duedate');
            //var payment_account = request.getParameter('custpage_payment_account');



            var sbatch = request.getParameter('custpage_batch');

            nlapiLogExecution('DEBUG', 'Stage + sSelectfield', sStage + ' + ' + sSelectfield);


            //var customer = form.addField('custpage_customer', 'select', 'Customer ', 'customer');
            //customer.setMandatory(true);
            //customer.setDefaultValue(scust);
            //customer.setDisplayType('inline');

            var select = form.addField('custpage_selectfield', 'select', 'Payment Method');
            select.addSelectOption('w', 'Wire');
            select.addSelectOption('c', 'Credit Guard');
            select.setDefaultValue(sSelectfield);
            select.setDisplayType('inline');

            var stage = form.addField('custpage_stage', 'integer', 'Stage');
            stage.setDefaultValue(sStage);
            stage.setDisplayType('hidden');

            var duedate = form.addField('custpage_duedate', 'date', 'Due Date');
            duedate.setDefaultValue(sduedate);
            duedate.setDisplayType('inline');

            nlapiLogExecution('DEBUG', 'sduedate ', sduedate);

            //if (sSelectfield == 'w')
                //payment_account = 440;// 10050 - Hapoalim Bank ILS (Dangot) 346046
            //else if (sSelectfield == 'c')
                //payment_account = 440; // 10050 - Hapoalim Bank ILS (Dangot) 346046

            nlapiLogExecution('DEBUG', 'payment_account', payment_account);

            /*var fieldSrch = paymentmethodValueSearch();
            nlapiLogExecution('DEBUG', 'paymentmethodValueSearch - fieldSrch', JSON.stringify(fieldSrch));
            var coafield = form.addField('custpage_payment_account', 'select', 'Payment Account');
            coafield.addSelectOption('', '');
            fieldSrch.forEach(function (opt) {
                coafield.addSelectOption(opt.id, opt.name);
            });
            coafield.setDefaultValue(payment_account);
            coafield.setDisplayType('inline');*/



            if (sStage == 2) {

                //***********************************************SUBLIST********************************************************
                var batch = form.addField('custpage_batch', 'text', 'Batch');
                batch.setDefaultValue(sbatch + dateaddition());
                batch.setDisplayType('inline');



                //var sublist = form.addSubList('custpage_results_sublist', 'list', 'Customers With Open Invoices');
                //sublist.addMarkAllButtons();
                //sublist.addRefreshButton(); // can make use of this method to perform refresh of list

                form.setScript('customscript_cg_extract_to_excel');
                //sublist.addButton('custpage_excel_button', 'Extract To Excel', 'fnExcelReport()');

                //Collection Batch (Script)
                var search = nlapiLoadSearch(null, 'customsearch_collection_batch');

                // var formula = "case when decode({type},'invoice',{duedate},{trandate})<='" + sduedate + "' then 1 else 0 end"
                //nlapiLogExecution('debug', 'formula', formula);
                //search.addFilter(new nlobjSearchFilter('duedate', null, 'onorbefore', sduedate));

                //var strFormula = "case when {type} = 'Billing Instruction' and {trandate} between {user.custentity_financial_report_from_date} and  {user.custentity_fin_report_to_date} then {custbody_price_change} else null end";
                //search.addFilter(new nlobjSearchFilter("formulanumeric", null, "equalto", "1").setFormula(formula));


                if (sSelectfield == 'w')//wire
                    search.addFilter(new nlobjSearchFilter('custentity_customer_payment_method', 'customermain', 'anyof', wire_id));//wire - MASAV
                else if (sSelectfield == 'c')//credit guard
                    search.addFilter(new nlobjSearchFilter('custentity_customer_payment_method', 'customermain', 'anyof', credit_card_id));//credit guard


                var results = search.runSearch().getResults(0, 500);


                if (results.length > 0) {
                    //sublist.addField('custpage_internalid', 'text', 'Internal ID').setDisplayType('hidden');
                    // Get the the search result columns
                    var columns = results[0].getAllColumns();
                    // sublist.addField('custpage_linestatus', 'text', 'Status').setDisplayType('disabled');
                    // sublist.addField('custpage_checkbox', 'checkbox', 'Make Payment');


                    var subList = form.addSubList('custpage_results_sublist', 'list', 'Number Of Customers: ' + results.length + ' With Open Invoices');
                    subList.addMarkAllButtons()
                    subList.addRefreshButton()
                    subList.addButton('custpage_excel_button', 'Extract To Excel', 'fnExcelReport()');

                    subList.addField('custpage_checkbox', 'checkbox', 'Make Payment');
                    subList.addField('custpage_internal_id', 'text', 'Count Of Trans.')
                    subList.addField('custpage_id', 'text', 'ID')
                    subList.addField('custpage_company_name', 'text', 'Company Name')
                    subList.addField('custpage_limit_of_collection', 'text', 'limit of out collection')
                    subList.addField('custpage_amount_remaining', 'text', 'amount remaining');
                    subList.addField('custpage_due_to_service', 'text', 'DUE TO SERVICE CONTRACT')
                    subList.addField('custpage_defference', 'text', 'defference');
                    subList.addField('custpage_paymentmethod', 'text', 'payment method');
                    subList.addField('custpage_amountcorrection', 'currency', 'amount correction').setDisplayType('entry');
                    subList.addField('entity', 'text', 'customer internal id').setDisplayType('hidden')
                    for (var i = 0; i < results.length; i++) {
                        subList.setLineItemValue('custpage_internal_id', i + 1, results[i].getValue('internalid', null, 'COUNT'));
                        subList.setLineItemValue('custpage_id', i + 1, results[i].getValue('entityid', 'customerMain', 'GROUP'));
                        subList.setLineItemValue('custpage_company_name', i + 1, results[i].getValue('companyname', 'customerMain', 'GROUP'));
                        subList.setLineItemValue('custpage_limit_of_collection', i + 1, results[i].getValue('custentity_limit_of_out_collection', 'customerMain', 'MAX'));
                        subList.setLineItemValue('custpage_amount_remaining', i + 1, results[i].getValue(columns[4]));
                        subList.setLineItemValue('custpage_due_to_service', i + 1, results[i].getValue(columns[5]));
                        subList.setLineItemValue('custpage_defference', i + 1, results[i].getValue(columns[6]));
                        subList.setLineItemValue('custpage_paymentmethod', i + 1, results[i].getText('custentity_customer_payment_method', 'customerMain', 'GROUP'));
                        subList.setLineItemValue('custpage_amountcorrection', i + 1, results[i].getValue(columns[5]));
                        subList.setLineItemValue('entity', i + 1, results[i].getValue('internalid', 'customerMain', 'GROUP'));
                    }

                }



                form.addSubmitButton('Make Batch of Payments');


            }
            //**********************************************end SUBLIST************************************************************

            //**********************************************insert SUBLIST fields**************************************************

            if (sStage == 3) {

                var batch = form.addField('custpage_batch', 'text', 'Batch');
                batch.setDefaultValue(sSelectfield + '_' + sbatch);
                batch.setDisplayType('inline');

                var LinesNo = request.getLineItemCount('custpage_results_sublist');
                var SumOfAmount = 0;
                //var batchArr = '';
                var entitiesObj = {};
                var entitiesArr = [];
                nlapiLogExecution('DEBUG', 'LinesNo ', LinesNo);
                for (var i = 1; i <= LinesNo; i++) {
                    checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_checkbox', i);
                    if (checkBox == 'T') {
                        //SumOfAmount += Number(request.getLineItemValue('custpage_results_sublist', 'amountremaining', i));
                        //batchArr += request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_serial', i) + ', ';
                        var invoicesJSON = {};
                        //invoicesJSON.internalid = request.getLineItemValue('custpage_results_sublist', 'internalid', i);
                        invoicesJSON.entity = request.getLineItemValue('custpage_results_sublist', 'entity', i);
                        invoicesJSON.amount = Number(request.getLineItemValue('custpage_results_sublist', 'custpage_amount_remaining', i));
                        invoicesJSON.amountcorrection = Number(request.getLineItemValue('custpage_results_sublist', 'custpage_amountcorrection', i));
                        invoicesJSON.discamount = Number(request.getLineItemValue('custpage_results_sublist', 'custpage_amount_remaining', i)) - Number(request.getLineItemValue('custpage_results_sublist', 'custpage_amountcorrection', i));

                        entitiesArr.push(invoicesJSON);
                    }
                    //entitiesObj = { "batch": sbatch, "payment_account": payment_account, "duedate": sduedate, 'entities': entitiesArr };
                }
                nlapiLogExecution('DEBUG', 'entitiesArr ', JSON.stringify(entitiesArr));

                //**********************************************end of insert SUBLIST fields***************************************
                //if (sSelectfield == 'w') {//wire
                //   nlapiLogExecution('DEBUG', 'Wire', '');



                //insertBatch(sbatch, payment_account, sduedate, entitiesArr);

                if (JSON.stringify(entitiesArr).length >= 100000) {
                    throw nlapiCreateError('Errpr', 'You selected a maximum number of lines, please select less lines');

                }

                var params = {
                    'custscript_batch': sSelectfield + '_' + sbatch,
                    'custscript_method': sSelectfield,
                    'custscript_user': user_name,
                    'custscript_arr': JSON.stringify(entitiesArr),
                    'custscript_payment_account': payment_account,
                    'custscript_duedate': sduedate
                }

                var status = nlapiScheduleScript('customscript_batch_payment_creation', 'customdeploy_creation', params);

                nlapiLogExecution('DEBUG', 'status', status);

                //}
                /*else if (sSelectfield == 'c') {//credit guard
                    nlapiLogExecution('DEBUG', 'Credit Guard', '');
 
                    insertBatch(entitiesObj);
 
                    var params = {
                        'custscript_batch': JSON.stringify(entitiesObj),
                        'custscript_method': sSelectfield,
                    }
                    var status = nlapiScheduleScript('customscript_batch_payment_creation', 'customdeploy_creation', params);
 
                    nlapiLogExecution('DEBUG', 'status', status);
 
                }*/
            }

            //form.addSubmitButton('Make Batch of Payments');
            response.writePage(form);
        }


    } catch (e) {
        nlapiLogExecution('DEBUG', 'Error', e);
        throw nlapiCreateError('Error', e, true);

    }








}



//************************************************************* FUNCTIONS ********************************************************************************************************************************





function isEmpty(val) {
    return (val == undefined || val == null || val == '');
}

function getdate() {
    var d = new Date();
    d.setHours(d.getHours() + 9)
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();


    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    var formatdate = [day, month, year].join('/')/* + ' ' + d.toTimeString().substring(0, 8)*/
    return formatdate;
}



function insertBatch(batch, payment_account, duedate, arr) {

    nlapiLogExecution('DEBUG', ' W/C- insertBatch', JSON.stringify(arr));


    var search = nlapiLoadSearch(null, 'customsearch_collection_batch');
    var sfilters = search.getFilterExpression();


    for (var fld in arr) {
        var val = arr[fld];
        nlapiLogExecution('debug', fld, JSON.stringify(val));

        for (var fldEnt in val) {
            var valEnt = val[fldEnt];

            nlapiLogExecution('debug', fldEnt, valEnt);

            if (fldEnt == 'entity') {

                var results = [];
                var columns = new Array();
                columns[0] = new nlobjSearchColumn('internalid');
                columns[1] = new nlobjSearchColumn('tranid');
                columns[2] = new nlobjSearchColumn('recordtype');
                var filters = new Array();
                /*filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
                if (method == 'w')//wire - masav
                    filters[1] = new nlobjSearchFilter('custentity_customer_payment_method', 'customermain', 'anyof', wire_id);
                if (method == 'c')//credit guard
                    filters[1] = new nlobjSearchFilter('custentity_customer_payment_method', 'customermain', 'anyof', credit_card_id);
                filters[2] = new nlobjSearchFilter('status', null, 'anyof', 'CustInvc:A');
                filters[3] = new nlobjSearchFilter('duedate', null, 'onorbefore', duedate);
                filters[4] = new nlobjSearchFilter('internalid', 'customermain', 'anyof', valEnt);*/


                var search = nlapiCreateSearch('transaction', sfilters, columns);
                search.addFilter(new nlobjSearchFilter('internalid', 'customermain', 'anyof', valEnt));
                search.addFilter(new nlobjSearchFilter('trandate', null, 'onorbefore', duedate));
                search.addFilter(new nlobjSearchFilter('mainline', null, 'is', 'T'));


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

                //nlapiLogExecution('DEBUG', 's: ', JSON.stringify(s));


                if (s != null) {
                    for (var i = 0; i < s.length; i++) {
                        try {
                            //var rec = nlapiLoadRecord('invoice',s[i].id);
                            // rec.setFieldValue( 'custbody_batch', batch);
                            nlapiLogExecution('DEBUG', 's[i].id: ', s[i].id);
                            nlapiSubmitField('invoice', s[i].id, 'custbody_batch', batch);
                            //nlapiSubmitRecord(rec, true,true);
                            //nlapiLogExecution('DEBUG', 'invoice saved', rec.id);

                            /* results.push({
                                 id: s[i].id,
                                 tranid: s[i].getValue('tranid')
                             });*/
                        } catch (e) {
                            continue;
                        }

                    }
                    //return results;
                }

                // nlapiLogExecution('DEBUG', 'entity: ' + valEnt + ' results', JSON.stringify(results));








            }
        }


    }
}


function dateaddition() {

    // attaching date

    var d = new Date();
    var hour = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    var formatdate = [year, month, day].join('') + [hour, minutes, seconds].join('');

    return formatdate;



}



function paymentmethodValueSearch() {

    var results = [];
    var columns = new Array();
    columns[0] = new nlobjSearchColumn("internalid");
    columns[1] = new nlobjSearchColumn("name");
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
    filters[1] = new nlobjSearchFilter('type', null, 'anyof', 'Bank');
    //filters[2] = new nlobjSearchFilter('currency', null, 'anyof', '1');//1 - ILS
    filters[2] = new nlobjSearchFilter('issummary', null, 'is', 'F');

    var search = nlapiCreateSearch('account', filters, columns);
    //var search = nlapiLoadSearch('customer', 'customsearch_receipts_screen_currencies');
    //var filters = new nlobjSearchFilter('internalid', null, 'anyof', custid);
    //search.addFilter(filters)



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
                id: s[i].getValue('internalid'),
                name: s[i].getValue('name')
            });
        }

        return results;
    }

}

