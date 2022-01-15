
function services_update_screen(request, response) {
    var form = nlapiCreateForm('Monthly Billing Report');
    if (request.getMethod() == 'GET') {
        var editMode = false;
        nlapiLogExecution('DEBUG', 'stage one', 'stage one');
        form.addSubmitButton('Submit');
        form.addFieldGroup('custpage_ilo_searchdetails', 'Date Range');
        var fromDate = form.addField('custpage_from_date', 'Date', 'From Date', null, 'custpage_ilo_searchdetails')
        var toDate = form.addField('custpage_to_date', 'Date', 'To Date', null, 'custpage_ilo_searchdetails');
        toDate.setMandatory(true);

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');

        response.writePage(form);
    }
    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');

        var FromD = request.getParameter('custpage_from_date');
        var ToD = request.getParameter('custpage_to_date');
        var editMode = false
        //var strFrom = nlapiDateToString(FromD);
        //var strTo = nlapiDateToString(ToD);

        var formTitle = 'Sales Orders for Fulfillment ' + FromD + ' - ' + ToD;
        var SecondForm = nlapiCreateForm(formTitle);

        nlapiLogExecution('DEBUG', 'dates has been setted!', 'dates: ' + FromD + ' - ' + ToD);

        //nlapiSetRedirectURL('tasklink', 'LIST_SEARCHRESULTS', null, null, 'customsearch_nr_monthly_billing'); 
 
        var fromDate = SecondForm.addField('custpage_from_date_second', 'Date', 'From', null, null);
        fromDate.setDefaultValue(FromD);
        var toDate = SecondForm.addField('custpage_to_date_second', 'Date', 'To', null, null);
        toDate.setDefaultValue(ToD);

        if (FromD != '' && ToD != '') {
            var results = Search(ToD,FromD);
            SecondForm.addButton('custpage_edit_button', 'Edit Fields', 'field_edit');
        }
        if (editMode == true) {
            //var resultsSubList = SecondForm.addSubList('custpage_results_sublist', 'editor', 'Results', null);
        }
        else {
            var resultsSubList = SecondForm.addSubList('custpage_results_sublist', 'list', 'Results', null);
        }

        var res_CheckBox2 = resultsSubList.addField('custpage_resultssublist_checkbox2', 'checkbox', 'check');
        var res_tranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'text', 'Date');
        var res_SoId = resultsSubList.addField('custpage_resultssublist_soid', 'text', 'salsorderid');
        var res_tranId = resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Sale Order');   
        var res_customer = resultsSubList.addField('custpage_resultssublist_customer', 'text', 'Customer');
        var res_status = resultsSubList.addField('custpage_resultssublist_status', 'text', 'Status');
        var res_shipDate = resultsSubList.addField('custpage_resultssublist_shipdate', 'text', 'Ship Date');
        var res_shipTo = resultsSubList.addField('custpage_resultssublist_shipto', 'text', 'Ship To');
        var res_region = resultsSubList.addField('custpage_resultssublist_region', 'text', 'Region');
        var res_item = resultsSubList.addField('custpage_resultssublist_item', 'text', 'Item');
        var res_description = resultsSubList.addField('custpage_resultssublist_description', 'text', 'Description');
        resultsSubList.addField('custpage_resultssublist_quantity', 'text', 'Quantity');
        resultsSubList.addField('custpage_resultssublist_fulfilled', 'text', 'Fulfilled');
        resultsSubList.addField('custpage_resultssublist_lotinformarion', 'text', 'Lot Information');
        resultsSubList.addField('custpage_resultssublist_regiontest', 'text', 'Region test');
        resultsSubList.addField('custpage_resultssublist_soline', 'text', 'So Line');
        resultsSubList.addField('custpage_resultssublist_invlocation', 'text', 'So Line');
        

        if (results != null && results != []) {
            for (var i = 0; i < results.length; i++) {
                resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i + 1, results[i].trandate);
                resultsSubList.setLineItemValue('custpage_resultssublist_soid', i + 1, results[i].saleOrderId);
                resultsSubList.setLineItemValue('custpage_resultssublist_tranid', i + 1, results[i].tranId);
                resultsSubList.setLineItemValue('custpage_resultssublist_customer', i + 1, results[i].entity);
                resultsSubList.setLineItemValue('custpage_resultssublist_status', i + 1, results[i].status);
                resultsSubList.setLineItemValue('custpage_resultssublist_shipdate', i + 1, results[i].shipDate);
                resultsSubList.setLineItemValue('custpage_resultssublist_shipto', i + 1, results[i].shipAdd);
                resultsSubList.setLineItemValue('custpage_resultssublist_region', i + 1, results[i].region);
                resultsSubList.setLineItemValue('custpage_resultssublist_item', i + 1, results[i].item);
                resultsSubList.setLineItemValue('custpage_resultssublist_description', i + 1, results[i].itemName);
                resultsSubList.setLineItemValue('custpage_resultssublist_quantity', i + 1, results[i].quantity);
                resultsSubList.setLineItemValue('custpage_resultssublist_fulfilled', i + 1, results[i].fulfilled);
                resultsSubList.setLineItemValue('custpage_resultssublist_lotinformarion', i + 1, results[i].invDtail);
                resultsSubList.setLineItemValue('custpage_resultssublist_regiontest', i + 1, results[i].custRegion);
                resultsSubList.setLineItemValue('custpage_resultssublist_soline', i + 1, results[i].so_line);
                resultsSubList.setLineItemValue('custpage_resultssublist_invlocation', i + 1, results[i].inv_location);
                nlapiLogExecution('DEBUG', 'resultsSubList_Load_End', results[i].custRegion);
            }
        }

        var checkStage = SecondForm.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stagetwo');
        checkStage.setDisplayType('hidden');
        SecondForm.addSubmitButton('Execute');
        response.writePage(SecondForm);
        
    }

    else if (request.getParameter('custpage_ilo_check_stage') == 'stagetwo') {

        //////////////
        nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');
        //var lastFormName = 'Ready for Print';

        // GET PARAMETERS FROM LAST SCREEN
        //var Machine = request.getParameter('custpage_machine_select');
        //nlapiLogExecution('DEBUG', 'Machine', Machine);
        //var client = request.getParameter('custpage_client_select');
        //nlapiLogExecution('DEBUG', 'client', client);
        //var relatedSC = request.getParameter('custpage_relatedsc_select');
        //nlapiLogExecution('DEBUG', 'relatedSC', relatedSC);
        //var assignedLocation = request.getParameter('custpage_location_select');
        //nlapiLogExecution('DEBUG', 'Location', assignedLocation);
        //var caseType = nlapiLookupField('supportcase', relatedSC, 'category');
        //var internalCaseType = nlapiLookupField('supportcase', relatedSC, 'custevent_internal_case_type');

        var form = nlapiCreateForm('Summery Report');
        var sumArr = new Array();

        var compArr = [];
        var checkBox;
        var lineCount = request.getLineItemCount('custpage_results_sublist');

        for (var x = 1; x <= lineCount; x++) {
            //list = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_list', x);
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox2', x);

            if (checkBox == 'T') {// list == 'b'
                compArr.push({
                    salesOrderId: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_soid', x),
                    tranid: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_tranid', x),
                    lineId: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_soline', x),
                    inv_Location: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_invlocation', x),
                });

            }
            //nlapiLogExecution('DEBUG', 'InvArr', InvArr.id + 'type : ' + InvArr.type);
        }

        nlapiLogExecution('DEBUG', 'so_to_fulfilment', 'compArr: ' + JSON.stringify(compArr));
        if (compArr.length > 0) {
            try { nlapiScheduleScript('customscript_fulfill_so_schedule', 'customdeploy_fulfill_so_schedule_dep', { custscript_fileid: JSON.stringify(compArr) }) } catch (e) { }
        }

        

        response.writePage(form);

        ////
        //var thirdForm = nlapiCreateForm('Services Update Screen - finish');
        //var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        //form.addFieldGroup('custpage_ilo_searchdetails_two', 'Search Again');
        //var secFromDate = form.addField('custpage_from_date', 'Date', 'From', null, 'custpage_ilo_searchdetails_two');
        //secFromDate.setDefaultValue(request.getParameter('FromD'));
        //var secToDate = form.addField('custpage_to_date', 'Date', 'To', null, 'custpage_ilo_searchdetails_two');
        //secToDate.setDefaultValue(request.getParameter('ToD'));
        //checkStage.setDefaultValue('stageOne');
        //checkStage.setDisplayType('hidden');
        //response.writePage(thirdForm);
    }
    else {
        var lastForm = nlapiCreateForm('Services Update Screen - finish');
        response.writePage(lastForm);
    }

} // services_update_screen function - end

//functions
function Search(To,From) {
    var filters = new Array();
    var s = [];
    var searchid = 0;
    var columns = new Array();

    var search = nlapiLoadSearch(null, 'customsearch_so_item_fulfill');
    search.addFilter(new nlobjSearchFilter('trandate', null, 'within', [From, To]));
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
                trandate: s[i].getValue('trandate'),
                saleOrderId: s[i].id,
                tranId: s[i].getValue('tranid'),
                entity: s[i].getText('entity'),
                status: s[i].getValue('statusref'),
                shipDate: s[i].getValue('shipdate'),
                shipAdd: s[i].getValue('shipaddress', "customer", null),
                region: s[i].getText('custbody_so_region'),
                item: s[i].getValue('item'),
                itemName: s[i].getValue('displayname', "item", null),
                quantity: s[i].getValue('quantity'),
                fulfilled: s[i].getValue('quantityshiprecv'),
                invDtail: s[i].getText("inventorynumber", "inventoryDetail", null),
                custRegion: s[i].getText("cseg_region_test", "customer", null),
                so_line: s[i].getValue("line"),
                inv_location: s[i].getValue("inventorylocation"),
            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach result ', JSON.stringify(result));
    return result;
}

function field_edit() {
    var flowcontrol = document.getElementById('custpage_ilo_check_stage');
    flowcontrol.value = 'EditMode';
}


var salesorderSearch = nlapiSearchRecord("salesorder", null,
    [
        ["mainline", "is", "F"],
        "AND",
        ["type", "anyof", "SalesOrd"],
        "AND",
        ["status", "anyof", "SalesOrd:B", "SalesOrd:D", "SalesOrd:E"],
        "AND",
        ["taxline", "is", "F"],
        "AND",
        ["item.type", "anyof", "InvtPart", "Assembly"],
        "AND",
        ["inventorydetail.inventorynumber", "anyof", "@NONE@"]
    ],
    [
        new nlobjSearchColumn("trandate").setSort(true),
        new nlobjSearchColumn("tranid").setSort(true),
        new nlobjSearchColumn("entity"),
        new nlobjSearchColumn("statusref"),
        new nlobjSearchColumn("shipdate"),
        new nlobjSearchColumn("shipaddress", "customer", null),
        new nlobjSearchColumn("custbody_so_region"),
        new nlobjSearchColumn("item"),
        new nlobjSearchColumn("displayname", "item", null),
        new nlobjSearchColumn("quantity"),
        new nlobjSearchColumn("quantityshiprecv"),
        new nlobjSearchColumn("inventorynumber", "inventoryDetail", null),
        new nlobjSearchColumn("cseg_region_test", "customer", null)
    ]
);

/*
 * for (y = 0; y < compArr.length; y++) {
            try {

                var rec = nlapiTransformRecord('salesorder', compArr[y].salesOrderId, 'itemfulfillment');
                rec.setFieldValue('shipstatus', 'A');
                var count = rec.getLineItemCount('item');
                nlapiLogExecution('DEGUG', 'count= ' + count , '');


                var submition = nlapiSubmitRecord(rec, null, true);
                if (submition != -1) {
                    sumArr.push({
                        line: y,
                        so_tranid: compArr[y].tranid,
                        status: 'succeed',
                        ff_id: submition,
                        ff_tranid: nlapiLookupField('itemfulfillment', submition, 'tranid')
                    })
                }
            }
            catch (e) {
                sumArr.push({
                    line: y,
                    so_tranid: compArr[y].tranid,
                    status: 'Failed',
                    error: e,
                })
                nlapiLogExecution('ERROR', 'error  - sales order id:' + compArr[y].salesOrderId + ' ', e);
                continue;
            }
        }

        if (sumArr.length > 0) {
            var header = form.addField('custpage_ilo_header', "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
            header.setDefaultValue('<font size="3"><h1> Proccess Summery </h1>'); //url of pdf from filecabinet
            for (var i = 0; i < sumArr.length; i++) {
                var status = sumArr[i].status;
                if (status == 'succeed') {
                    var tranid = sumArr[i].so_tranid;
                    var line = sumArr[i].line;
                    var ff_tranid = sumArr[i].ff_tranid;
                    var ff_id = sumArr[i].ff_id;
                    var field_id = "custpage_bi" + i;
                    var tranidList = form.addField(field_id, "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                    tranidList.setDefaultValue('<font size="3"><b>' + line + '. ' + tranid + ' - ' + '</b><a style="color:blue;font-size:3"target="_blank" href =https://5455345-sb2.app.netsuite.com/app/accounting/transactions/itemship.nl?id=' + ff_id + '><b>' + ff_tranid + '</b></a>'); //url of pdf from filecabinet

                }
                else {
                    var tranid = sumArr[i].so_tranid;
                    var line = sumArr[i].line;
                    var error = sumArr[i].error;
                    var field_id = "custpage_bi" + i;
                    var tranidList = form.addField(field_id, "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
                    tranidList.setDefaultValue('<font size="3"><b>' + line + '. ' + tranid + ' - error:' + error+ '</b>'); //url of pdf from filecabinet
                }

            }
        }*/