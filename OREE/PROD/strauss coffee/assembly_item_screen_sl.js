
var itemArr = [];

var context = nlapiGetContext();

function item_assembly_suitelet(request, response) {

    if (request.getMethod() == 'GET') {

        nlapiLogExecution('DEBUG', 'stage one', 'stage one');

        var recId = request.getParameter('RecId');
        nlapiLogExecution('DEBUG', 'recId = ', recId);

        var caseRecord = nlapiLoadRecord('supportcase', recId);

        var customMachine = caseRecord.getFieldValue('custevent_machine');
        var customer = caseRecord.getFieldValue('company');
        var machine = nlapiLookupField('supportcase', recId, 'custevent_machine_item');
        


        var form = nlapiCreateForm('דיווח חלקי חילוף');
        form.addSubmitButton('הבא');

        form.addFieldGroup('custpage_ilo_searchdetails', 'פרטים');

        var Machine = form.addField('custpage_machine_select', 'select', 'מכונה', 'customrecord_coffee_machine_equip', 'custpage_ilo_searchdetails');
        Machine.setDefaultValue(customMachine);//
        Machine.setDisplayType('disabled');

        var Client = form.addField('custpage_client_select', 'select', 'לקוח', 'customer', 'custpage_ilo_searchdetails');
        Client.setDefaultValue(customer);
        Client.setDisplayType('disabled');

        var relatedSC = form.addField('custpage_relatedsc_select', 'select', 'קריאת שירות מקורית', 'supportcase', 'custpage_ilo_searchdetails');
        relatedSC.setDefaultValue(recId);
        relatedSC.setDisplayType('disabled');


        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');


        var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'תוצאות', null);//inlineeditor
        resultsSubList.addMarkAllButtons();
        var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'בחירה');
        
        // test

        //var res_CheckBoxList = resultsSubList.addField('custpage_resultssublist_list', 'select', 'רשימה');
        //res_CheckBoxList.addSelectOption('a', 'Print');
        //res_CheckBoxList.addSelectOption('b', 'Mail');

       //res_CheckBox.setDisplayType('disabled');

        var res_itemInterId = resultsSubList.addField('custpage_resultssublist_iteminterid', 'text', 'מזהה פריט');

        res_itemInterId.setDisplayType('disabled');

        var res_Name = resultsSubList.addField('custpage_resultssublist_name', 'text', 'פריט');

        res_Name.setDisplayType('disabled');

        var res_Description = resultsSubList.addField('custpage_resultssublist_description', 'text', 'תיאור');

        res_Description.setDisplayType('disabled');
        //var res_QtyToSelect = resultsSubList.addField('custpage_resultssublist_qtyToSelect', 'float', 'Selected Qty');
        var res_QtyInTree = resultsSubList.addField('custpage_resultssublist_qtyintree', 'float', 'כמות בעץ מוצר');
        res_QtyInTree.setDisplayType('disabled');

        var res_Qty = resultsSubList.addField('custpage_resultssublist_qty', 'float', 'כמות לדיווח').setDisplayType('entry');

        invSearch(machine)

        for (var j = 0; j < itemArr.length; j++) {
            resultsSubList.setLineItemValue('custpage_resultssublist_iteminterid', j + 1, itemArr[j].Id);
            resultsSubList.setLineItemValue('custpage_resultssublist_name', j + 1, itemArr[j].name);
            resultsSubList.setLineItemValue('custpage_resultssublist_description', j + 1, itemArr[j].displayName);
            resultsSubList.setLineItemValue('custpage_resultssublist_qtyintree', j + 1, itemArr[j].qty);
            resultsSubList.setLineItemValue('custpage_resultssublist_qty', j + 1, itemArr[j].qty);
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

        var compArr = [];
        var checkBox;
        var lineCount = request.getLineItemCount('custpage_results_sublist');

        for (var x = 1; x <= lineCount; x++) {
            //list = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_list', x);
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', x);

            if (checkBox == 'T') {//list == 'b'
                compArr.push({
                    componentID: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_iteminterid', x),
                    componentQty: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_qty', x),
                });

            }
            //nlapiLogExecution('DEBUG', 'InvArr', InvArr.id + 'type : ' + InvArr.type);
        }

        var rec = nlapiCreateRecord('inventoryadjustment');
        rec.setFieldValue('subsidiary', '2');
        rec.setFieldValue('account', '214');
        rec.setFieldValue('customer', client);
        rec.setFieldValue('custbody_machine', Machine);
        rec.setFieldValue('custbody_related_support_case', relatedSC);

        for (z = 0; z < compArr.length; z++) {
            rec.setLineItemValue('inventory', 'item', z + 1, compArr[z].componentID);
            rec.setLineItemValue('inventory', 'location', z+1, '9');
            rec.setLineItemValue('inventory', 'adjustqtyby', z+1, '-' + compArr[z].componentQty);
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



function invSearch(machine) {

    var search = nlapiLoadSearch(null, 'customsearch509');
    search.addFilter(new nlobjSearchFilter('internalid', null, 'is', machine));
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
                Id: s[i].getValue("internalid",'memberItem'),
                name: s[i].getText('memberitem'),
                displayName: s[i].getValue('displayname',"memberItem"),
                qty: s[i].getValue('memberquantity'), 
            }
        }
    }
    //customerArr = Results;
    //customerArr = Object.keys(toPrintArr);
}

/// oree additions

