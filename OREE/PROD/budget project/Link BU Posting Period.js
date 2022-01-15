var BuResults;
var BcuRsults;
var AccResults;

function aftersubmit() {
    BuResults = searchBU(); // return all Annual Budget  Units into array of Jsons containing required properties
    BcuRsults = searchBCU();// // return all Budget Control Units into array of Jsons containing required properties
    AccResults = searchAccounts();// return all accounts that is under Budget Control 

    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    nlapiLogExecution('audit', ' record type, ID =  ', nlapiGetRecordType() + nlapiGetRecordId());
    var properties = {
        department: rec.getFieldValue('department'),
        subsidiary: rec.getFieldValue('subsidiary'),
        parentAccount: '-1',
        date: rec.getFieldValue('trandate'),
        parentRegion: '-1',
    }
    var itemType = 'item';
    var expanseFlag = false;
    var journalFlag = false;
    var counter = 0;
    var transType = nlapiGetRecordType();

    if (transType == 'inventoryadjustment') {
        nlapiLogExecution('debug', ' transType ', transType);
        properties.account = rec.getFieldValue('account');

        nlapiLogExecution('debug', transType + 'accont: ', properties.account);

        if (properties.department != null && properties.department != undefined && properties.department != '') {
            nlapiLogExecution('debug', transType + ' department: ', properties.department);
            var Pdep = nlapiLookupField('department', properties.department, 'custrecord_department_budgetary_control');
            nlapiLogExecution('debug', transType + 'parent department: ', Pdep);
            if (Pdep != null && Pdep != undefined && Pdep != '' && Pdep != '-1') {
                properties.parentDepartment = Pdep;
            }
        }

        if (AccResults[properties.account] != null) { // if account under budgetary control
            properties.parentAccount = AccResults[properties.account].Paccount; // get parent account value from account
            if (AccResults[properties.account].crossSub == 'T') { properties.subsidiary = null; } // if cross subsidiary on 
            properties.code = AccResults[properties.account].controlLevel;

            var BU = getBu(properties);
            nlapiLogExecution('debug', ' reutrned BU: ', BU);
            if (BU != -1) {
                rec.setFieldValue('custbody_annual_budgeting_unit', BU);
                changeFlag = true;
                var BCU = getBcu(BU, properties.date);
                nlapiLogExecution('debug', ' reutrned BCU: ', BCU);
                if (BCU != -1) {
                    rec.setFieldValue('custbody_control_budgeting_unit', BCU);
                    changeFlag = true;
                }
            }
        }
    }
    else {
        var expenseCount = rec.getLineItemCount('expense');
        if (expenseCount > 0) {     //case line item == 'expense'
            expanseFlag = true;
            counter = expenseCount;
            itemType = 'expense';
        }
        else if (rec.getLineItemCount('line') > 0) {        //case line item == 'line'
            journalFlag = true;
            itemType = 'line';
            var lineCount = rec.getLineItemCount('line');
            counter = lineCount;
        }
        else {      //case line item == 'item'
            var itemCount = rec.getLineItemCount('item');
            counter = itemCount;
        }

        var changeFlag = false;
        for (var i = 1; i <= counter; i++) {        // Loop through each of the items in the sublist

            properties.parentRegion = '-1';
            properties.parentAccount = '-1';
            properties.sAccount = '-1';
            //get department and parent department inline value 

            var dep = rec.getLineItemValue(itemType, 'department', i);
            if (dep != null && dep != undefined && dep != '') {
                properties.department = dep;
                var Pdep = nlapiLookupField('department', dep, 'custrecord_department_budgetary_control');
                if (Pdep != null && Pdep != undefined && Pdep != '' && Pdep != '-1') {
                    properties.parentDepartment = Pdep;
                }
            }
            properties = properties_addition1(properties, rec, i, itemType);
            var itype = rec.getLineItemValue(itemType, 'itemtype', i); // Get the item type
            var Id = rec.getLineItemValue(itemType, 'item', i);
            var recordtype = '';

            switch (itype) {   // Compare item type to its record type counterpart
                case 'InvtPart':
                    recordtype = 'inventoryitem';
                    break;
                case 'NonInvtPart':
                    recordtype = 'noninventoryitem';
                    break;
                case 'Service':
                    recordtype = 'serviceitem';
                    break;
                case 'Assembly':
                    recordtype = 'assemblyitem';
                    break;

                case 'GiftCert':
                    recordtype = 'giftcertificateitem';
                    break;
                default:
            }
            if ((recordtype == 'noninventoryitem' && transType == 'purchaseorder') || transType != 'purchaseorder') {
                if (expanseFlag) {//case line item == 'expense'
                    if (transType == 'expensereport') {//case transaction type = expense report, getting expense account from expense category
                        var category = rec.getLineItemValue('expense', 'category', i);
                        properties.account = nlapiLookupField("expensecategory", category, 'account');
                    }
                    else {//  getting expense account from inline value
                        properties.account = rec.getLineItemValue('expense', 'account', i);
                    }
                }
                else if (journalFlag) {
                    properties.account = rec.getLineItemValue('line', 'account', i);
                }
                else {//getting expense account from item entity
                    properties.account = nlapiLookupField(recordtype, Id, 'expenseaccount');
                }

                if (AccResults[properties.account] != null) { // if account under budgetary control
                    properties.parentAccount = AccResults[properties.account].Paccount; // get parent account value from account
                    if (AccResults[properties.account].crossSub == 'T') { properties.subsidiary = ""; } // if cross subsidiary on 
                    properties.code = AccResults[properties.account].controlLevel;
                    var postingPeriod = rec.getFieldValue('postingperiod');

                    if (nlapiGetRecordType() == 'purchaseorder' && (rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i) != null)) {
                        properties.date = rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i);
                    }
                    else if (postingPeriod != null && postingPeriod != '' && postingPeriod != undefined) {
                        properties.date = nlapiLookupField('accountingperiod', postingPeriod, 'startdate');
                    }
                    else {
                        properties.date = rec.getFieldValue('trandate');
                    }

                    var BU = getBu(properties);
                    nlapiLogExecution('debug', ' reutrned BU: ', BU);
                    if (BU != -1) {
                        rec.setLineItemValue(itemType, 'custcol_budgeting_unit', i, BU);
                        changeFlag = true;
                        var BCU = getBcu(BU, properties.date);
                        nlapiLogExecution('debug', ' reutrned BCU: ', BCU);
                        if (BCU != -1) {
                            rec.setLineItemValue(itemType, 'custcol_budget_control_unit', i, BCU);
                            changeFlag = true;
                        }
                    }
                }
            }
        }
    }
    if (changeFlag == true) {
        var subrec = nlapiSubmitRecord(rec);
        nlapiLogExecution('debug', ' submited record: ', subrec);
    }
}

function searchBU() {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custrecord_bcu_parent_account');
    columns[2] = new nlobjSearchColumn('custrecord_bcu_account');
    columns[3] = new nlobjSearchColumn('custrecord_parent_department');
    columns[4] = new nlobjSearchColumn('custrecord_bcu_department');
    columns[5] = new nlobjSearchColumn('custrecord_bcu_subsidiary');
    var search = nlapiCreateSearch('customrecord_annual_budgeting_unit', null, columns);

    var s = [];
    var Results = [];

    var searchid = 0;
    var resultset = search.runSearch();
    //var cols = search.getColumns();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }

    } while (resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            Results[i] = {
                id: s[i].id,
                account: s[i].getValue('custrecord_bcu_account'),
                pAccount: s[i].getValue('custrecord_bcu_parent_account'),
                department: s[i].getValue('custrecord_bcu_department'),
                pDepartment: s[i].getValue('custrecord_parent_department'),
                subsidiary: s[i].getValue('custrecord_bcu_subsidiary'),
                isempty: [0, 0, 0, 0, 0],
            }
            if (s[i].getValue('custrecord_bcu_account') != '') { Results[i].isempty[0] = 1; }
            if (s[i].getValue('custrecord_bcu_parent_account') != '') { Results[i].isempty[1] = 1; }
            if (s[i].getValue('custrecord_bcu_department') != '') { Results[i].isempty[2] = 1; }
            if (s[i].getValue('custrecord_parent_department') != '') { Results[i].isempty[3] = 1; }
            if (s[i].getValue('custrecord_bcu_subsidiary') != '') { Results[i].isempty[4] = 1; }
        }
    }
    return Results;
}

function searchBCU() {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custrecord_budgeting_unit');
    columns[2] = new nlobjSearchColumn('custrecord_buc_start_date');
    columns[3] = new nlobjSearchColumn('custrecord_buc_end_date');
    var search = nlapiCreateSearch('customrecord_control_budgeting_unit', null, columns);

    var s = [];
    var Results = [];


    var searchid = 0;
    var resultset = search.runSearch();
    //var cols = search.getColumns();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }

    } while (resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            Results[i] = {
                id: s[i].id,
                Abu: s[i].getValue('custrecord_budgeting_unit'),
                startDate: s[i].getValue('custrecord_buc_start_date'),
                endDate: s[i].getValue('custrecord_buc_end_date'),
            }
        }
    }
    return Results;
}

function searchAccounts() {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custrecord_under_budgetary_control');
    columns[2] = new nlobjSearchColumn('custrecord_cross_subsidiary_budgeting');
    columns[3] = new nlobjSearchColumn('custrecord_budget_section');
    columns[4] = new nlobjSearchColumn('custrecord_budgetary_control_level');

    var search = nlapiCreateSearch('account', null, columns);

    var s = [];
    var Results = [];


    var searchid = 0;
    var resultset = search.runSearch();
    //var cols = search.getColumns();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }

    } while (resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            if (s[i].getValue('custrecord_under_budgetary_control') == 'T') {
                Results[s[i].id] = {
                    crossSub: s[i].getValue('custrecord_cross_subsidiary_budgeting'),
                    Paccount: s[i].getValue('custrecord_budget_section'),
                    controlLevel: s[i].getValue('custrecord_budgetary_control_level'),
                }
            }
        }
    }
    return Results;
}

function getBu(properties) {

    for (y = 0; y < BuResults.length; y++) {
        var curr = BuResults[y];
        var arr = [];
        switch (properties.code) {
            case '1':
                arr = [1, 2, 3];
                if (curr.account == properties.account && checkifempty(properties, curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '2':
                arr = [1, 3];
                if (curr.account == properties.account && curr.department == properties.department && checkifempty(properties, curr, arr)) {
                    return curr.id;
                }
                break;
            case '3':
                arr = [1, 2];
                if (curr.account == properties.account && curr.pDepartment == properties.parentDepartment && checkifempty(properties, curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '4':
                arr = [0, 2, 3];
                if (curr.pAccount == properties.parentAccount && checkifempty(properties, curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '5':
                arr = [0, 3];
                if (curr.pAccount == properties.parentAccount && curr.department == properties.department && checkifempty(properties, curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '6':
                arr = [0, 2];
                if (curr.pAccount == properties.parentAccount && curr.pDepartment == properties.parentDepartment && checkifempty(properties, curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '7':
                arr = [0, 1, 3];
                if (curr.department == properties.department && checkifempty(properties, curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '8':
                arr = [0, 1, 2];
                if (curr.pDepartment == properties.parentDepartment && checkifempty(properties, curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            default:
        }
    }
    return -1;
}

function checkifempty(properties, curr, arr) {
    nlapiLogExecution('debug', ' logic code: ', properties.code);
    nlapiLogExecution('debug', ' arr length : ', arr.length);
    for (x = 0; x < arr.length; x++) {
        nlapiLogExecution('debug', ' is empty ' + x + ': ', curr.isempty[arr[x]]);
        if (curr.isempty[arr[x]] == 1) {
            return false
        }
    }
    return true;
}

function getBcu(BU, date) {
    for (z = 0; z < BcuRsults.length; z++) {
        if (BcuRsults[z].Abu == BU && nlapiStringToDate(BcuRsults[z].startDate) <= nlapiStringToDate(date) && nlapiStringToDate(BcuRsults[z].endDate) >= nlapiStringToDate(date)) {
            return BcuRsults[z].id;
        }
    }
    return -1;
}


function properties_addition1(prop, record, index, itemType) {
    nlapiLogExecution('debug', ' inside original script: ', '');

    return prop;
}


function beforeLoad_addButt(type, form) {
    var rectype = nlapiGetRecordType();
    if (rectype == 'purchaserequisition' || rectype == 'purchaseorder') {
        if (type == 'view') {
            var divhtml = "<div><b>Processing.....</b></div>";
            var style = "left: 25%; top: 25%; z-index: 10001; position:absolute;width:620px;height:40px;line-height:1.5em;cursor:pointer;margin:5px;list-style-type: none;font-size:12px; padding:5px; background-color:#FFF; border: 2px solid gray;border-radius:10px;";
            var stylebg = "position: absolute; z-index: 10000; top: 0px; left: 0px; height: 100%; width: 100%; margin: 5px 0px; background-color: rgb(204, 204, 204); opacity: 0.6;";
            var function_click = "var bgdiv=document.createElement('div'); bgdiv.id='bgdiv'; bgdiv.onclick=bgdiv.style.display = 'none'; bgdiv.style.cssText='" + stylebg + "';var loadingdiv=document.createElement('div');loadingdiv.id='loadingdiv'; loadingdiv.innerHTML='" + divhtml + "'; loadingdiv.style.cssText='" + style + "'; document.body.appendChild(loadingdiv);document.body.appendChild(bgdiv);setTimeout(budgetrefresh,200)";
            form.addButton('custpage_ilo_po_showbudget', 'Verify Budget', function_click);
            form.setScript('customscript_ilo_po_refreshbudget');
        }
    }
}


/*
nlapiLogExecution('debug', ' expense report avcount: ', properties.account);
nlapiLogExecution('debug', ' deparment: ', properties.department);
nlapiLogExecution('debug', ' subsudiary: ', properties.subsidiary);
nlapiLogExecution('debug', ' paarant department: ', properties.parentDepartment);
nlapiLogExecution('debug', ' account: ', properties.account);
nlapiLogExecution('debug', ' Parant account: ', properties.parentAccount);
nlapiLogExecution('debug', ' Code: ', properties.code);


nlapiLogExecution('debug', ' BuResults length: ', BuResults.length);
nlapiLogExecution('debug', ' BcuResults length:: ', BcuRsults.length);
nlapiLogExecution('debug', ' AccResults length: ', AccResults.length);


nlapiLogExecution('curr.account', curr.account);
nlapiLogExecution('debug', 'properties.account: ', properties.account);
nlapiLogExecution('debug', 'curr.pDepartment: ', curr.pDepartment);
nlapiLogExecution('debug', 'properties.parentDepartment: ', properties.parentDepartment);
 */