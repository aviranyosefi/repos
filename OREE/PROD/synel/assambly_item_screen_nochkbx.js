var itemArr = [];

var context = nlapiGetContext();

function item_assembly_suitelet(request, response) {

    if (request.getMethod() == 'GET') {

        nlapiLogExecution('DEBUG', 'stage one', 'stage one');
        nlapiLogExecution('DEBUG', 'Role Id', context.role);
        var isApp = request.getParameter('isApp');
        nlapiLogExecution('DEBUG', 'isApp = ', isApp);

        var recId = request.getParameter('RecId');
        nlapiLogExecution('DEBUG', 'recId = ', recId);

        var caseRecord = nlapiLoadRecord('supportcase', recId);

        //var customMachine = caseRecord.getFieldValue('custevent_machine');
        var customer = caseRecord.getFieldValue('company');
        var supportItem = nlapiLookupField('supportcase', recId, 'item');
        var locationToAssign = nlapiLookupField('employee', caseRecord.getFieldValue('assigned'), 'location');

        var form = nlapiCreateForm('דיווח חלקי חילוף');
        form.addSubmitButton('בצע');
        form.addButton('custpage_return_button', 'חזור', 'cancel();');
        form.setScript('customscript_assembly_suitlet_client');
        form.addFieldGroup('custpage_ilo_searchdetails', 'פרטים');

        var isAppField = form.addField('custpage_isapp', 'text', 'מכונה',null, 'custpage_ilo_searchdetails');
        isAppField.setDefaultValue(isApp);//
        isAppField.setDisplayType('hidden');

        var storage = form.addField('custpage_storage', 'text', 'מכונה', null, 'custpage_ilo_searchdetails');
        storage.setDefaultValue(locationToAssign);//
        storage.setDisplayType('hidden');

        if (caseRecord.getFieldValue('category') == '5' || isNullOrEmpty(locationToAssign)) { locationToAssign = '4'; } //locationToAssign = '9';- SandBox

        //var Machine = form.addField('custpage_machine_select', 'select', 'מכונה', 'customrecord_coffee_machine_equip', 'custpage_ilo_searchdetails');
        //Machine.setDefaultValue(customMachine);//
        //Machine.setDisplayType('inline');

        var MachineSerial = form.addField('custpage_machineserial_select', 'select', 'מק"ט', 'item', 'custpage_ilo_searchdetails');
        MachineSerial.setDefaultValue(supportItem);
        MachineSerial.setDisplayType('inline');

        var Client = form.addField('custpage_client_select', 'select', 'לקוח', 'customer', 'custpage_ilo_searchdetails');
        Client.setDefaultValue(customer);
        Client.setDisplayType('inline');

        var relatedSC = form.addField('custpage_relatedsc_select', 'select', 'קריאת שירות מקורית', 'supportcase', 'custpage_ilo_searchdetails');
        relatedSC.setDefaultValue(recId);
        relatedSC.setDisplayType('inline');

        var assignLocation = form.addField('custpage_location_select', 'select', 'מחסן', 'location', 'custpage_ilo_searchdetails');
        assignLocation.setDefaultValue(locationToAssign);
        assignLocation.setDisplayType('inline');

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');

        var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'תוצאות', null);//inlineeditor

        //var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'בחירה');
        // test

        var res_CheckBoxList = resultsSubList.addField('custpage_resultssublist_list', 'select', 'בחירה');
        res_CheckBoxList.addSelectOption('a', 'לא');
        res_CheckBoxList.addSelectOption('b', 'כן');

        //var res_CheckBox2 = resultsSubList.addField('custpage_resultssublist_checkbox2', 'checkbox', '2בחירה');
        //res_CheckBox.setDisplayType('disabled');

        var res_Name = resultsSubList.addField('custpage_resultssublist_name', 'text', 'פריט');

        res_Name.setDisplayType('disabled');

        var res_Description = resultsSubList.addField('custpage_resultssublist_description', 'text', 'תיאור');
        res_Description.setDisplayType('disabled');

        //var res_QtyToSelect = resultsSubList.addField('custpage_resultssublist_qtyToSelect', 'float', 'Selected Qty');
        var res_QtyInTree = resultsSubList.addField('custpage_resultssublist_qtyintree', 'float', 'כמות ברכב');
        res_QtyInTree.setDisplayType('disabled');

        //var res_QtyInTree = resultsSubList.addField('custpage_resultssublist_avgcost', 'float', 'עלות פריט');
        //res_QtyInTree.setDisplayType('disabled');

        var res_Qty = resultsSubList.addField('custpage_resultssublist_qty', 'float', 'כמות לדיווח').setDisplayType('entry');
        res_Qty.setDisplayType('disabled');

        var res_Memo = resultsSubList.addField('custpage_resultssublist_memo', 'text', 'הערות').setDisplayType('entry');
        res_Memo.setDisplayType('disabled');

        var res_itemInterId = resultsSubList.addField('custpage_resultssublist_iteminterid', 'text', 'מזהה פריט');
        res_itemInterId.setDisplayType('hidden');

        invSearch(assignLocation)

        for (var j = 0; j < itemArr.length; j++) {
            resultsSubList.setLineItemValue('custpage_resultssublist_iteminterid', j + 1, itemArr[j].Id);
            resultsSubList.setLineItemValue('custpage_resultssublist_name', j + 1, itemArr[j].name);
            //resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', j + 1, 'T');
            //resultsSubList.setLineItemValue('custpage_resultssublist_checkbox2', j + 1, 'F');
            resultsSubList.setLineItemValue('custpage_resultssublist_description', j + 1, itemArr[j].displayName);
            resultsSubList.setLineItemValue('custpage_resultssublist_qtyintree', j + 1, itemArr[j].qty);
            resultsSubList.setLineItemValue('custpage_resultssublist_qty', j + 1, itemArr[j].qty);
            /*if (itemArr[j].avgCost == '') {
                resultsSubList.setLineItemValue('custpage_resultssublist_avgcost', j + 1, '0.00');
            }
            else {
                resultsSubList.setLineItemValue('custpage_resultssublist_avgcost', j + 1, parseFloat(itemArr[j].avgCost).toFixed(2));
            }*/
        }

        response.writePage(form);
        //customsearch805
    }
    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') {

        nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');
        //var lastFormName = 'Ready for Print';


        var Machine = request.getParameter('custpage_machine_select');
        nlapiLogExecution('DEBUG', 'Machine', Machine);

        var client = request.getParameter('custpage_client_select');
        nlapiLogExecution('DEBUG', 'client', client);

        var relatedSC = request.getParameter('custpage_relatedsc_select');
        nlapiLogExecution('DEBUG', 'relatedSC', relatedSC);

        var assignedLocation = request.getParameter('custpage_location_select');
        nlapiLogExecution('DEBUG', 'Location', assignedLocation);

        //var caseType = nlapiLookupField('supportcase', relatedSC, 'category');
        //var internalCaseType = nlapiLookupField('supportcase', relatedSC, 'custevent_internal_case_type');

        var compArr = [];
        var checkBox;
        var lineCount = request.getLineItemCount('custpage_results_sublist');

        for (var x = 1; x <= lineCount; x++) {
            list = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_list', x);
            //checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', x);

            if (list == 'b') {//checkBox == 'T'
                compArr.push({
                    componentID: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_iteminterid', x),
                    componentQty: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_qty', x),
                    componentMemo: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_memo', x), 
                });

            }
            //nlapiLogExecution('DEBUG', 'InvArr', InvArr.id + 'type : ' + InvArr.type);
        }

        var rec = nlapiCreateRecord('inventoryadjustment');
        rec.setFieldValue('subsidiary', '2');
        rec.setFieldValue('account', '214');
        rec.setFieldValue('customer', client);
        //rec.setFieldValue('custbody_machine', Machine);
        rec.setFieldValue('custbody_related_support_case', relatedSC);
        //if (caseType == "5") {
            rec.setFieldValue('custbody_adjustment_reason', '1');
        //}
       // else if (caseType == "1" || caseType == "3") {
        //    rec.setFieldValue('custbody_adjustment_reason', '3');
        //}

        for (z = 0; z < compArr.length; z++) {
            rec.setLineItemValue('inventory', 'item', z + 1, compArr[z].componentID);
            rec.setLineItemValue('inventory', 'location', z + 1, assignedLocation);
            //if (caseType == '5' && internalCaseType == '12') {
            //    rec.setLineItemValue('inventory', 'adjustqtyby', z + 1, compArr[z].componentQty);
            //}
            //else {
                rec.setLineItemValue('inventory', 'adjustqtyby', z + 1, '-' + compArr[z].componentQty);
            //}
            rec.setLineItemValue('inventory', 'memo', z + 1, compArr[z].componentMemo);
            nlapiLogExecution('DEBUG', z + ' componentID :', compArr[z].componentID);
            nlapiLogExecution('DEBUG', z + ' componentQty :', compArr[z].componentQty);
        }
        var submition = nlapiSubmitRecord(rec, null, true);

        nlapiSubmitField('supportcase', relatedSC, 'custevent_related_adjustment', submition);

        nlapiSetRedirectURL('record', 'supportcase', relatedSC, 'view', null);

        //var Url = 'https://5455345-sb2.app.netsuite.com/app/accounting/transactions/workord.nl?id=' + Id + '&whence='; //nlapiSetRedirectURL('record', 'workorder', Id, 'edit', null);
        //window.open(Url);

        lastFormName = 'Adjusment Id: ' + submition;

        var lastForm = nlapiCreateForm(lastFormName);

        response.writePage(lastForm);
    };
};



function invSearch(assignLocation) {

    var search = nlapiLoadSearch(null, 'customsearch_on_hand_qty_at_car');
    //search.addFilter(new nlobjSearchFilter('internalid', null, 'is', machine));

    if (!isNullOrEmpty(assignLocation)) {
        search.addFilter(new nlobjSearchFilter('inventorylocation', null, 'anyof', assignLocation));
    }

    //if (context.role == '1059') {// context.role == '1016' - SandBox
    //    search.addFilter(new nlobjSearchFilter('custitem_field_service_spare_part', 'memberitem', 'is', "T"));
    //}
    var s = [];
    var Results = [];

    var searchid = 0;
    var resultset = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }

    } while (resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            itemArr[i] = {
                Id: s[i].getValue("internalid"),
                name: s[i].getValue('itemid'),
                displayName: s[i].getValue('displayname'),
                qty: s[i].getValue('locationquantityonhand'),
                //avgCost: s[i].getValue("averagecost", "memberItem"),
            }
        }
    }
    //customerArr = Results;
    //customerArr = Object.keys(toPrintArr);
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

/// oree additions

