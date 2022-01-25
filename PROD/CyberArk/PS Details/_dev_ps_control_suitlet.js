function ps_control(request, response) {

    if (request.getMethod() == 'GET') {

        var form = nlapiCreateForm('Manage Fulfillment/Invoice');

        var batchGroup = form.addFieldGroup('custpage_batch_group', 'Select Batch');
        var transactionGroup = form.addFieldGroup('custpage_transaction_group', 'Select Transaction Type');
        //var dateGroup = form.addFieldGroup('custpage_date_group', 'Select Transaction Date')


        var selectValues = getSelectValues();
        var selectSubsids = removeDuplicates(selectValues, 'subsid_id')
        var selectSubRegions = removeDuplicates(selectValues, 'subRegion_id')
        var selectCustomer_id = removeDuplicates(selectValues, 'customer_id')
        var selectSO_id = removeDuplicates(selectValues, 'SO_id')        
        //var selectPSCreator = removeDuplicates(selectValues, 'createdby_id')

        var selectFromDate = form.addField('custpage_select_fromdate', 'date', 'From Date', null, 'custpage_batch_group');
        selectFromDate.setLayoutType('midrow');
        var selectToDate = form.addField('custpage_select_todate', 'date', 'To Date', null, 'custpage_batch_group');
        selectToDate.setLayoutType('midrow');

        var selectCustomer = form.addField('custpage_select_cust', 'select', 'Customer', null, 'custpage_batch_group');
        selectCustomer.addSelectOption('', '');
        for (var i = 0; i < selectCustomer_id.length; i++) {
            selectCustomer.addSelectOption(selectCustomer_id[i].customer_id, selectCustomer_id[i].customer_text);
        }

        var selectSO = form.addField('custpage_select_so', 'select', 'Sales Order', null, 'custpage_batch_group');
        selectSO.addSelectOption('', '');
        for (var i = 0; i < selectSO_id.length; i++) {
            selectSO.addSelectOption(selectSO_id[i].SO_id, selectSO_id[i].SO_text);           
        }

        var selectSubsid = form.addField('custpage_select_subsid', 'select', 'Subsidiary', null, 'custpage_batch_group');
        selectSubsid.setLayoutType('normal', 'startcol')
        selectSubsid.addSelectOption('', '');
        for (var i = 0; i < selectSubsids.length; i++) {
            selectSubsid.addSelectOption(selectSubsids[i].subsid_id, selectSubsids[i].subsid_text);
        }

        var selectSubRegion = form.addField('custpage_select_subregion', 'select', 'Sub Region', null, 'custpage_batch_group');
        selectSubRegion.addSelectOption('', '');
        for (var i = 0; i < selectSubRegions.length; i++) {
            selectSubRegion.addSelectOption(selectSubRegions[i].subRegion_id, selectSubRegions[i].subRegion_id);
        }

        //	 var selectCreatedBy = form.addField('custpage_select_createdby','select', 'Created By', null,'custpage_batch_group');
        //	 selectCreatedBy.addSelectOption('','');
        //	 for(var i = 0; i<selectPSCreator.length; i++) {
        //		 selectCreatedBy.addSelectOption(selectPSCreator[i].createdby_id,selectPSCreator[i].createdby_text);
        //	 }

        var createBatchName = form.addField('custpage_create_batch', 'text', 'Batch Name to Create', null, 'custpage_transaction_group');
        createBatchName.setMandatory(true);

        var selectTransaction = form.addField('custpage_select_transaction', 'select', 'Transaction Type', null, 'custpage_transaction_group');
        selectTransaction.setLayoutType('midrow');
        selectTransaction.setMandatory(true);
        selectTransaction.addSelectOption('', '');
        selectTransaction.addSelectOption('1', 'Fulfill');
        selectTransaction.addSelectOption('2', 'Invoice');

        var selectDate = form.addField('custpage_select_date', 'date', 'Transaction Date', null, 'custpage_transaction_group');
        selectDate.setMandatory(true);
        selectDate.setLayoutType('midrow');

        var toNextPage = form.addField('custpage_tonextpage', 'text', 'Next Page', null, 'custpage_search_group');
        toNextPage.setDisplayType('hidden');
        toNextPage.setDefaultValue('next');
        form.addSubmitButton('Continue');
        response.writePage(form);
    }

    else if (request.getParameter('custpage_tonextpage') == 'next') {

        var today = new Date();
        var todayStr = nlapiDateToString(today)

        //var batchID =  request.getParameter('custpage_select_batch');
        var batchName = request.getParameter('custpage_create_batch') + ' - ' + todayStr;
        var dateToUse = request.getParameter('custpage_select_date')


        var customerSelected = request.getParameter('custpage_select_cust')
        var soSelected = request.getParameter('custpage_select_so')
        var fromDateSelected = request.getParameter('custpage_select_fromdate')
        var toDateSelected = request.getParameter('custpage_select_todate')
        var subsidSelected = request.getParameter('custpage_select_subsid')
        var subRegionSelected = request.getParameter('custpage_select_subregion')
        var createdBySelected = request.getParameter('custpage_select_createdby')

        nlapiLogExecution('debug', 'createdBySelected', createdBySelected)

        var dateRange = [fromDateSelected, toDateSelected]

        var hasClosedOrders = false;


        var resForm = nlapiCreateForm('Batch - ' + batchName);
        resForm.addSubmitButton('Submit');

        ///////////////hidden fields//////////////////
        var tranType = request.getParameter('custpage_select_transaction');
        var tranTypeName = '';
        var tranTypeToNextPage = resForm.addField('custpage_trantype', 'text', 'Next Page', null, null);
        tranTypeToNextPage.setDisplayType('hidden');

        if (tranType == '1') {
            tranTypeName = 'To Fulfill'
        }
        if (tranType == '2') {
            tranTypeName = 'To Invoice'
        }
        tranTypeToNextPage.setDefaultValue(tranTypeName);

        var dateToNextPage = resForm.addField('custpage_datetouse', 'text', 'Next Page', null, null);
        dateToNextPage.setDisplayType('hidden');
        dateToNextPage.setDefaultValue(dateToUse);

        var batchNameToNextPage = resForm.addField('custpage_batchnametouse', 'text', 'Next Page', null, null);
        batchNameToNextPage.setDisplayType('hidden');
        batchNameToNextPage.setDefaultValue(batchName);

        var customerSelectedToNextPage = resForm.addField('custpage_customertouse', 'text', 'Next Page', null, null);
        customerSelectedToNextPage.setDisplayType('hidden');
        customerSelectedToNextPage.setDefaultValue(customerSelected);

        var SOSelectedToNextPage = resForm.addField('custpage_sotouse', 'text', 'Next Page', null, null);
        SOSelectedToNextPage.setDisplayType('hidden');
        SOSelectedToNextPage.setDefaultValue(soSelected);

        var dateRangeToNextPage = resForm.addField('custpage_daterangetouse', 'text', 'Next Page', null, null);
        dateRangeToNextPage.setDisplayType('hidden');
        dateRangeToNextPage.setDefaultValue(JSON.stringify(dateRange));

        var subsidToNextPage = resForm.addField('custpage_subsidtouse', 'text', 'Next Page', null, null);
        subsidToNextPage.setDisplayType('hidden');
        subsidToNextPage.setDefaultValue(JSON.stringify(subsidSelected));

        var subRegionToNextPage = resForm.addField('custpage_subregiontouse', 'text', 'Next Page', null, null);
        subRegionToNextPage.setDisplayType('hidden');
        subRegionToNextPage.setDefaultValue(JSON.stringify(subRegionSelected));

        var createdByToNextPage = resForm.addField('custpage_createdbytouse', 'text', 'Next Page', null, null);
        createdByToNextPage.setDisplayType('hidden');
        createdByToNextPage.setDefaultValue(JSON.stringify(createdBySelected));

        ///////////////hidden fields//////////////////

        //var timeSheets = getTimeSheets(batchID, null, tranTypeName)

        var timeSheets = getTimeSheets(customerSelected, dateRange, soSelected, subsidSelected, tranTypeName, [subRegionSelected], [createdBySelected])

        var timeSheetGroup = resForm.addFieldGroup('custpage_timesheet_group', ' ');


        var subList = resForm.addSubList('custpage_res_sublist', 'list', tranTypeName + ' - ' + dateToUse, 'custpage_timesheet_group');
        subList.addMarkAllButtons()

        var internalIDColumn = subList.addField('custpage_res_internalid', 'text', 'Internal ID');
        internalIDColumn.setDisplayType('hidden');
        subList.addField('custpage_res_process', 'checkbox', 'Process')
        subList.addField('custpage_res_psday', 'text', 'PS Day');
        subList.addField('custpage_res_startdate', 'text', 'Start Date');
        subList.addField('custpage_res_enddate', 'text', 'End Date');
        subList.addField('custpage_res_duration', 'text', 'Days Delivered');
        subList.addField('custpage_res_so_id', 'text', 'Sales Order #');
        subList.addField('custpage_res_so_status', 'text', 'Status');
        subList.addField('custpage_res_psitem', 'text', 'PS Item');
        subList.addField('custpage_res_engineer', 'text', 'Engineer');
        subList.addField('custpage_res_fulfill', 'text', 'Fulfillment #');
        subList.addField('custpage_res_inv', 'text', 'Invoice #');
        subList.addField('custpage_res_op_line', 'text', 'Opportunity Line');
        subList.addField('custpage_res_customer', 'text', 'Customer');
        subList.addField('custpage_res_endcustomer', 'text', 'End Customer');
        subList.addField('custpage_res_po_num', 'text', 'PS PO Entry');
        subList.addField('custpage_res_op_num', 'text', 'PS Opportunity');
        subList.addField('custpage_res_locationtype', 'text', 'Location Type');
        subList.addField('custpage_res_servicetype', 'text', 'Service Type');
        subList.addField('custpage_res_subregion', 'text', 'Sub Region');
        subList.addField('custpage_res_createdby', 'text', 'Created By');


        if (timeSheets != [] || timeSheets != null) {
            nlapiLogExecution('debug', 'timeSheets', JSON.stringify(timeSheets, null, 2))
            for (var i = 0; i < timeSheets.length; i++) {

                if (timeSheets[i].SO_id_status != 'Closed' && timeSheets[i].SO_id_status != 'Billed' && timeSheets[i].SO_id_status != 'Canceled') {
                    subList.setLineItemValue('custpage_res_process', i + 1, 'T');
                }

                subList.setLineItemValue('custpage_res_internalid', i + 1, timeSheets[i].internalid);
                subList.setLineItemValue('custpage_res_psday', i + 1, timeSheets[i].psDay);
                subList.setLineItemValue('custpage_res_startdate', i + 1, timeSheets[i].startDate);
                subList.setLineItemValue('custpage_res_enddate', i + 1, timeSheets[i].endDate);
                subList.setLineItemValue('custpage_res_duration', i + 1, timeSheets[i].duration);
                subList.setLineItemValue('custpage_res_so_id', i + 1, timeSheets[i].SO_id_text.replace('Sales Order', ''));
                subList.setLineItemValue('custpage_res_so_status', i + 1, timeSheets[i].SO_id_status);
                subList.setLineItemValue('custpage_res_psitem', i + 1, timeSheets[i].psItem_text);
                subList.setLineItemValue('custpage_res_engineer', i + 1, timeSheets[i].engineer);
                subList.setLineItemValue('custpage_res_inv', i + 1, timeSheets[i].invTransaction_text.replace('Invoice', ''));
                subList.setLineItemValue('custpage_res_fulfill', i + 1, timeSheets[i].fulfillTransaction_text.replace('Item Fulfillment', ''));
                subList.setLineItemValue('custpage_res_op_line', i + 1, timeSheets[i].opportunityLine);
                subList.setLineItemValue('custpage_res_customer', i + 1, timeSheets[i].customer_text);
                subList.setLineItemValue('custpage_res_endcustomer', i + 1, timeSheets[i].endCustomer_text);
                subList.setLineItemValue('custpage_res_po_num', i + 1, timeSheets[i].PO_number);
                subList.setLineItemValue('custpage_res_op_num', i + 1, timeSheets[i].OP_number);
                subList.setLineItemValue('custpage_res_locationtype', i + 1, timeSheets[i].locationType);
                subList.setLineItemValue('custpage_res_servicetype', i + 1, timeSheets[i].serviceType);
                subList.setLineItemValue('custpage_res_subregion', i + 1, timeSheets[i].subRegion);
                subList.setLineItemValue('custpage_res_createdby', i + 1, timeSheets[i].createdBy_text);




                if (timeSheets[i].SO_id_status == 'Closed' || timeSheets[i].SO_id_status == 'Billed' || timeSheets[i].SO_id_status == 'Canceled') {
                    hasClosedOrders = true;
                }
            }
        }



        var batchIDHiddenField = resForm.addField('custpage_batchid', 'text', 'Next Page', null, null);
        batchIDHiddenField.setDisplayType('hidden');
        batchIDHiddenField.setDefaultValue(batchID);

        if (hasClosedOrders == true) {

            var htmlHeader = resForm.addField('custpage_header', 'inlinehtml');
            htmlHeader.setDefaultValue("<p style='font-size:20px;'><span style='color:red; font-weight:bold;'>WARNING:</span> There are orders in this batch that are already closed/billed or canceled and cannot be proccesed.</p>");

        }

        var res = JSON.stringify(timeSheets, null, 2)
        resForm.setScript('customscript_dev_ps_control_client')
        response.writePage(resForm)
    }

    else if (request.getParameter('custpage_trantype') == 'To Fulfill') { //fulfill

        var batchName = request.getParameter('custpage_batchnametouse');
        var dateToUse = request.getParameter('custpage_datetouse');

        //		 var customerToUse = request.getParameter('custpage_customertouse');
        //		 var soToUse = request.getParameter('custpage_sotouse');
        //		 var dateRangeToUse = request.getParameter('custpage_daterangetouse');
        //		 var subsidToUse = request.getParameter('custpage_subsidtouse');
        //		 
        //		 
        //		 nlapiLogExecution('debug', 'customerToUse', customerToUse)
        //		 		 nlapiLogExecution('debug', 'soToUse', soToUse)
        //		 		 nlapiLogExecution('debug', 'dateRangeToUse', dateRangeToUse)
        //		 		 nlapiLogExecution('debug', 'subsidToUse', subsidToUse)


        nlapiLogExecution('debug', 'batchName', batchName)

        var lineCount = request.getLineItemCount('custpage_res_sublist');
        var selectedSheets = [];

        for (var i = 0; i < lineCount; i++) {

            var selected = request.getLineItemValue('custpage_res_sublist', 'custpage_res_process', i + 1);
            if (selected == 'T') {

                selectedSheets.push(request.getLineItemValue('custpage_res_sublist', 'custpage_res_internalid', i + 1))
            }

        }


        var resFulfillform = nlapiCreateForm('Processing Fulfillments For Batch : ' + batchIDName);

        var today = new Date();
        var todayStr = nlapiDateToString(today);

        var htmlHeader = resFulfillform.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
        htmlHeader.setDefaultValue("<p style='font-size:20px'>The Item Fulfillment transactions are currently being created.</p><br><br>Please click <a href='https://system.eu1.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&datefrom=" + todayStr + "&dateto=" + todayStr + "&scripttype=1024&primarykey=5344'>here</a> in order to be redirected to the status page.");

        response.writePage(resFulfillform)

        // nlapiLogExecution('debug', 'selectedsheets', JSON.stringify(selectedSheets))



        var selectedTimeSheets = getSelectedSheets(selectedSheets)
        var uniqueSelectedTimeSheets = removeDuplicates(selectedTimeSheets, "internalid");

        nlapiLogExecution('debug', 'selectedTimeSheets', JSON.stringify(selectedTimeSheets, null, 2))

        var params = {
            custscript_ps_recs_tofulfill: JSON.stringify(uniqueSelectedTimeSheets, null, 2),
            custscript_ps_date_tofulfill: dateToUse,
            custscript_ps_batchid_tofulfill: batchName
        };

        nlapiScheduleScript('customscript_dev_ps_fulfill_ss', 'customdeploy_dev_ps_fulfill_ss_dep', params);


    }

    else if (request.getParameter('custpage_trantype') == 'To Invoice') { //fulfill

        var batchID = request.getParameter('custpage_batchid');
        var batchIDName = request.getParameter('custpage_batchnametouse');


        var dateToUse = request.getParameter('custpage_datetouse')

        var lineCount = request.getLineItemCount('custpage_res_sublist');
        var selectedSheets = [];

        for (var i = 0; i < lineCount; i++) {

            var selected = request.getLineItemValue('custpage_res_sublist', 'custpage_res_process', i + 1);
            if (selected == 'T') {

                selectedSheets.push(request.getLineItemValue('custpage_res_sublist', 'custpage_res_internalid', i + 1))
            }

        }


        var resInvoiceform = nlapiCreateForm('Processing Invoices For Batch : ' + batchIDName);

        var today = new Date();
        var todayStr = nlapiDateToString(today);

        var htmlHeader = resInvoiceform.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
        htmlHeader.setDefaultValue("<p style='font-size:20px'>The invoices are currently being created.</p><br><br>Please click <a href='https://system.eu1.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&datefrom=" + todayStr + "&dateto=" + todayStr + "&scripttype=1023&primarykey=5343'>here</a> in order to be redirected to the status page.");
        //htmlHeader.setDefaultValue("<p style='font-size:20px'>Invoicing timesheets in development......</p>")	 
        response.writePage(resInvoiceform)


        var selectedTimeSheets = getSelectedSheets(selectedSheets)
        var uniqueSelectedTimeSheets = removeDuplicates(selectedTimeSheets, "internalid");

        // var selectedTimeSheets = getTimeSheets(batchID, selectedSheets, null)



        var params = {
            custscript_ps_recs_toinvoice: JSON.stringify(uniqueSelectedTimeSheets),
            custscript_ps_date_toinvoice: dateToUse,
            custscript_ps_batchid_toinvoice: batchIDName
        };

        nlapiScheduleScript('customscript_dev_ps_invoice_ss', 'customdeploy_dev_ps_invoice_ss_dep', params);


    }

}//end of suitlet




function getTimeSheets(customerSelected, dateRange, soSelected, subsidSelected, tranType, subRegionSelected, createdBySelected) {

    var createdByArr = [];
    createdByArr.push(createdBySelected.toString())
    nlapiLogExecution('debug', 'createdBySelected in search', JSON.stringify(createdByArr))

    var filters = new Array();

    var transactionTypeToFilter = ''

    if (soSelected != '') {

        filters.push(new nlobjSearchFilter('custbody_ps_order', null, 'anyof', soSelected));

    }

    if (customerSelected != '') {

        filters.push(new nlobjSearchFilter('custbody_ps_customer', null, 'anyof', customerSelected));

    }

    if (subsidSelected != '') {

        filters.push(new nlobjSearchFilter('subsidiary', null, 'anyof', subsidSelected));

    }


    if (dateRange.length == 2) {

        filters.push(new nlobjSearchFilter('trandate', null, 'within', dateRange));

    }

    if (subRegionSelected != '') {

        filters.push(new nlobjSearchFilter('custbody_ps_sub_region', null, 'is', subRegionSelected));

    }

    if (createdBySelected != '') {

        filters.push(new nlobjSearchFilter('custbody_ps_createdby', null, 'anyof', createdByArr));

    }

    if (tranType != null) {

        if (tranType == 'To Fulfill') {
            transactionTypeToFilter = 'fulfill'

        }
        if (tranType == 'To Invoice') {
            transactionTypeToFilter = 'invoice'

        }

    }

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custbody_ps_billing_batch')
    columns[2] = new nlobjSearchColumn('custbody_ps_day');
    columns[3] = new nlobjSearchColumn('custbody_ps_start_date');
    columns[4] = new nlobjSearchColumn('custbody_ps_end_date');
    columns[5] = new nlobjSearchColumn('custbody_ps_engineer');
    columns[6] = new nlobjSearchColumn('custbody_ps_days_delivered');
    columns[7] = new nlobjSearchColumn('custbody_ps_fulfillment_trx');
    columns[8] = new nlobjSearchColumn('custbody_ps_invoice_number');
    columns[9] = new nlobjSearchColumn('custbody_ps_billed_upfront');
    columns[10] = new nlobjSearchColumn('custbody_ps_item');
    columns[11] = new nlobjSearchColumn('custcol_cbr_ps_location');
    columns[12] = new nlobjSearchColumn('custbody_ps_order');
    columns[13] = new nlobjSearchColumn('custbody_location_type');
    columns[14] = new nlobjSearchColumn('custbody_ps_opportunity_line_number');
    columns[15] = new nlobjSearchColumn('custcol_cbr_ps_task_name');
    columns[16] = new nlobjSearchColumn('custbody_ps_exclude_from_billing');
    columns[17] = new nlobjSearchColumn('custbody_ps_customer');
    columns[18] = new nlobjSearchColumn('subsidiary');
    columns[19] = new nlobjSearchColumn('custbody_ps_end_customer');
    columns[20] = new nlobjSearchColumn('custbody_location_type');
    columns[21] = new nlobjSearchColumn('custbody_ps_po_entry');
    columns[22] = new nlobjSearchColumn('custbody_service_type');
    columns[23] = new nlobjSearchColumn('custbody_ps_opportunity');
    columns[24] = new nlobjSearchColumn('subsidiarynohierarchy');
    columns[25] = new nlobjSearchColumn('custbody_ps_exclude_from_fulfillment');
    columns[26] = new nlobjSearchColumn('custbody_ps_sub_region');
    columns[27] = new nlobjSearchColumn('statusref', 'CUSTBODY_PS_ORDER');
    //columns[28] = new nlobjSearchColumn( 'custbody_ps_createdby' );

    var savedSearch = nlapiCreateSearch('customtransaction_ps_timesheet_report', filters, columns)

    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = [];
    var cols = savedSearch.getColumns();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        returnSearchResults.forEach(function (element) {

            if (tranType != null) {

                if (transactionTypeToFilter == 'fulfill') {
                    if (element.getValue('custbody_ps_fulfillment_trx') == '' && element.getValue('custbody_ps_exclude_from_fulfillment') == 'F') {


                        results.push({

                            internalid: element.getValue('internalid'),
                            psDay: element.getValue('custbody_ps_day'),
                            startDate: element.getValue('custbody_ps_start_date'),
                            endDate: element.getValue('custbody_ps_end_date'),
                            duration: element.getValue('custbody_ps_days_delivered'),
                            SO_id: element.getValue('custbody_ps_order'),
                            SO_id_text: element.getText('custbody_ps_order'),
                            SO_id_status: element.getText('statusref', 'CUSTBODY_PS_ORDER'),
                            psItem: element.getValue('custbody_ps_item'),
                            psItem_text: element.getText('custbody_ps_item'),
                            engineer: element.getValue('custbody_ps_engineer'),
                            //engineer_text : element.getText('custbody_ps_engineer'),
                            invTransaction: element.getValue('custbody_ps_invoice_number'),
                            invTransaction_text: element.getText('custbody_ps_invoice_number'),
                            fulfillTransaction: element.getValue('custbody_ps_fulfillment_trx'),
                            fulfillTransaction_text: element.getText('custbody_ps_fulfillment_trx'),
                            opportunityLine: element.getValue('custbody_ps_opportunity_line_number'),
                            subRegion: element.getValue('custbody_ps_sub_region'),
                            customer_text: element.getText('custbody_ps_customer'),
                            endCustomer_text: element.getText('custbody_ps_end_customer'),
                            PO_number: element.getValue('custbody_ps_po_entry'),
                            OP_number: element.getValue('custbody_ps_opportunity'),
                            locationType: element.getText('custbody_location_type'),
                            serviceType: element.getText('custbody_service_type'),
                            //createdBy : element.getValue('custbody_ps_createdby'),
                            //createdBy_text : element.getText('custbody_ps_createdby')

                        });
                    }//	if(element.getValue('custbody_ps_fulfillment_trx') == '') 
                }//if(transactionTypeToFilter == 'fulfill')

                if (transactionTypeToFilter == 'invoice') {
                    if (element.getValue('custbody_ps_invoice_number') == '' && element.getValue('custbody_ps_exclude_from_billing') == 'F') {

                        if (element.getValue('custbody_ps_billed_upfront') == 'F') {
                            results.push({

                                internalid: element.getValue('internalid'),
                                psDay: element.getValue('custbody_ps_day'),
                                startDate: element.getValue('custbody_ps_start_date'),
                                endDate: element.getValue('custbody_ps_end_date'),
                                duration: element.getValue('custbody_ps_days_delivered'),
                                SO_id: element.getValue('custbody_ps_order'),
                                SO_id_text: element.getText('custbody_ps_order'),
                                SO_id_status: element.getText('statusref', 'CUSTBODY_PS_ORDER'),
                                psItem: element.getValue('custbody_ps_item'),
                                psItem_text: element.getText('custbody_ps_item'),
                                engineer: element.getValue('custbody_ps_engineer'),
                                //engineer_text : element.getText('custbody_ps_engineer'),
                                invTransaction: element.getValue('custbody_ps_invoice_number'),
                                invTransaction_text: element.getText('custbody_ps_invoice_number'),
                                fulfillTransaction: element.getValue('custbody_ps_fulfillment_trx'),
                                fulfillTransaction_text: element.getText('custbody_ps_fulfillment_trx'),
                                opportunityLine: element.getValue('custbody_ps_opportunity_line_number'),
                                subRegion: element.getValue('custbody_ps_sub_region'),
                                customer_text: element.getText('custbody_ps_customer'),
                                endCustomer_text: element.getText('custbody_ps_end_customer'),
                                PO_number: element.getValue('custbody_ps_po_entry'),
                                OP_number: element.getValue('custbody_ps_opportunity'),
                                locationType: element.getText('custbody_location_type'),
                                serviceType: element.getText('custbody_service_type'),
                                //createdBy : element.getValue('custbody_ps_createdby'),
                                //createdBy_text : element.getText('custbody_ps_createdby')
                            });
                        } //if(element.getValue('custbody_ps_billed_upfront') == 'F')
                    }//	if(element.getValue('custbody_ps_fulfillment_trx') != '') 
                }//if(transactionTypeToFilter == 'invoice')
            }


        });

    }

    var uniqueArray = removeDuplicates(results, "internalid");


    if (subRegionSelected != '') {


    }
    return uniqueArray;

}

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}


function getSelectValues() {


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custbody_ps_order');
    columns[1] = new nlobjSearchColumn('custbody_ps_customer');
    columns[2] = new nlobjSearchColumn('subsidiarynohierarchy');
    columns[3] = new nlobjSearchColumn('custbody_ps_sub_region');
    // columns[4] = new nlobjSearchColumn( 'custbody_ps_createdby' );


    var filters = new Array();
    var strFormula = "{today}-{datecreated}";
    filters[0] = new nlobjSearchFilter("formulanumeric", null, 'lessthanorequalto', '180').setFormula(strFormula);


    var savedSearch = nlapiCreateSearch('customtransaction_ps_timesheet_report', filters, columns)
    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = [];
    var cols = savedSearch.getColumns();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        returnSearchResults.forEach(function (element) {

            results.push({

                SO_id: element.getValue('custbody_ps_order'),
                SO_text: element.getText('custbody_ps_order'),
                customer_id: element.getValue('custbody_ps_customer'),
                customer_text: element.getText('custbody_ps_customer'),
                subsid_id: element.getValue('subsidiarynohierarchy'),
                subsid_text: element.getText('subsidiarynohierarchy'),
                subRegion_id: element.getValue('custbody_ps_sub_region'),
                createdby_id: element.getValue('custbody_ps_createdby'),
                createdby_text: element.getText('custbody_ps_createdby'),

            });
        });

    }

    return results;

}



function getSelectedSheets(selected) {



    var filters = new Array();
    filters.push(new nlobjSearchFilter('internalid', null, 'anyof', selected));
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custbody_ps_billing_batch')
    columns[2] = new nlobjSearchColumn('custbody_ps_day');
    columns[3] = new nlobjSearchColumn('custbody_ps_start_date');
    columns[4] = new nlobjSearchColumn('custbody_ps_end_date');
    columns[5] = new nlobjSearchColumn('custbody_ps_engineer');
    columns[6] = new nlobjSearchColumn('custbody_ps_days_delivered');
    columns[7] = new nlobjSearchColumn('custbody_ps_fulfillment_trx');
    columns[8] = new nlobjSearchColumn('custbody_ps_invoice_number');
    columns[9] = new nlobjSearchColumn('custbody_ps_billed_upfront');
    columns[10] = new nlobjSearchColumn('custbody_ps_item');
    columns[11] = new nlobjSearchColumn('custcol_cbr_ps_location');
    columns[12] = new nlobjSearchColumn('custbody_ps_order');
    columns[13] = new nlobjSearchColumn('custbody_location_type');
    columns[14] = new nlobjSearchColumn('custbody_ps_opportunity_line_number');
    columns[15] = new nlobjSearchColumn('custcol_cbr_ps_task_name');
    columns[16] = new nlobjSearchColumn('custbody_ps_exclude_from_billing');
    columns[17] = new nlobjSearchColumn('custbody_ps_customer');
    columns[18] = new nlobjSearchColumn('subsidiary');
    columns[19] = new nlobjSearchColumn('custbody_ps_end_customer');
    columns[20] = new nlobjSearchColumn('custbody_location_type');
    columns[21] = new nlobjSearchColumn('custbody_ps_po_entry');
    columns[22] = new nlobjSearchColumn('custbody_service_type');
    columns[23] = new nlobjSearchColumn('custbody_ps_opportunity');
    columns[24] = new nlobjSearchColumn('subsidiarynohierarchy');
    columns[25] = new nlobjSearchColumn('custbody_ps_exclude_from_fulfillment');
    columns[26] = new nlobjSearchColumn('custbody_ps_sub_region');
    columns[27] = new nlobjSearchColumn('statusref', 'CUSTBODY_PS_ORDER');
    columns[28] = new nlobjSearchColumn('custbody_ps_service_number')

    var savedSearch = nlapiCreateSearch('customtransaction_ps_timesheet_report', filters, columns)



    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = [];
    var cols = savedSearch.getColumns();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        returnSearchResults.forEach(function (element) {

            results.push({

                internalid: element.getValue('internalid'),
                psDay: element.getValue('custbody_ps_day'),
                startDate: element.getValue('custbody_ps_start_date'),
                endDate: element.getValue('custbody_ps_end_date'),
                duration: element.getValue('custbody_ps_days_delivered'),
                SO_id: element.getValue('custbody_ps_order'),
                SO_id_text: element.getText('custbody_ps_order'),
                SO_id_status: element.getText('statusref', 'CUSTBODY_PS_ORDER'),
                psItem: element.getValue('custbody_ps_item'),
                psItem_text: element.getText('custbody_ps_item'),
                engineer: element.getValue('custbody_ps_engineer'),
                engineer_text: element.getText('custbody_ps_engineer'),
                invTransaction: element.getValue('custbody_ps_invoice_number'),
                fulfillTransaction: element.getValue('custbody_ps_fulfillment_trx'),
                fulfillTransaction_text: element.getText('custbody_ps_fulfillment_trx'),
                opportunityLine: element.getValue('custbody_ps_opportunity_line_number'),
                customer_text: element.getText('custbody_ps_customer'),
                endCustomer_text: element.getValue('custbody_ps_end_customer'),
                PO_number: element.getValue('custbody_ps_po_entry'),
                OP_number: element.getValue('custbody_ps_opportunity'),
                locationType: element.getText('custbody_location_type'),
                serviceType: element.getText('custbody_service_type'),
                serviceNum: element.getValue('custbody_ps_service_number')

            });
        });

    }

    return results;

}