var BuResults;
var BcuRsults;
var AccResults;

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

function aftersubmit() {
    var transType = nlapiGetRecordType();
    //var rec = nlapiLoadRecord(transType, nlapiGetRecordId());
    var properties = {
        department: nlapiGetFieldValue('department'),
        subsidiary: nlapiGetFieldValue('subsidiary'),
        parentAccount: '-1',
        date: nlapiGetFieldValue('trandate'),
        parentRegion: '-1'
    }
    BuResults = searchBU(properties.date); // return all Annual Budget  Units into array of Jsons containing required properties
    BcuRsults = searchBCU(properties.date); // return all Budget Control Units that are applicable to the transaction date, into array of Jsons containing required properties
    AccResults = searchAccounts(); // return all accounts that is under Budget Control 
    var itemType = 'item';
    var expanseFlag = false;
    var journalFlag = false;
    var changeFlag = false;

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
            if (AccResults[properties.account].crossSub == 'T') { properties.subsidiary = ""; } // if cross subsidiary on 
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
        if (nlapiGetLineItemCount('expense') > 0) {     //case line item == 'expense'
            expanseFlag = true;
            itemType = 'expense';
        }
        else if (nlapiGetLineItemCount('line') > 0) {        //case line item == 'line'
            journalFlag = true;
            itemType = 'line';           
        }
        else {      //case line item == 'item'
            itemType = 'item'; 
        }
        var counter = nlapiGetLineItemCount(itemType);
        for (var i = 1; i <= counter; i++) {        // Loop through each of the items in the sublist
            var dep = nlapiGetLineIteValue(itemType, 'department', i);
            if (!isNullOrEmpty(dep)) {
                properties.department = dep;
                var Pdep = nlapiLookupField('department', dep, 'custrecord_department_budgetary_control');
                if (!isNullOrEmpty(Pdep)) {
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
                    properties.account = nlapiLookupField('item', Id, 'expenseaccount');
                }

                if (AccResults[properties.account] != null) { // if account under budgetary control
                    properties.parentAccount = AccResults[properties.account].Paccount; // get parent account value from account
                    if (AccResults[properties.account].crossSub == 'T') { properties.subsidiary = ""; } // if cross subsidiary on 
                    properties.code = AccResults[properties.account].controlLevel;

                    if ((nlapiGetRecordType() == 'purchaseorder' || nlapiGetRecordType() == 'purchaserequisition') && (rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i) != null)) {
                        properties.date = rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i);
                    }
                    else {
                        properties.date = rec.getFieldValue('trandate');
                    }

                    debugger;

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

function searchBU(trandate) {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn("custrecord_buc_start_date");
    columns[1] = new nlobjSearchColumn("custrecord_buc_end_date");
    columns[2] = new nlobjSearchColumn("custrecord_budgeting_unit");
    columns[3] = new nlobjSearchColumn("internalid", "CUSTRECORD_BUDGETING_UNIT", null);//of abu
    columns[4] = new nlobjSearchColumn("custrecord_bcu_parent_account", "CUSTRECORD_BUDGETING_UNIT", null);
    columns[5] = new nlobjSearchColumn("custrecord_bcu_account", "CUSTRECORD_BUDGETING_UNIT", null);
    columns[6] = new nlobjSearchColumn("custrecord_parent_department", "CUSTRECORD_BUDGETING_UNIT", null);
    columns[7] = new nlobjSearchColumn("custrecord_bcu_department", "CUSTRECORD_BUDGETING_UNIT", null);
    columns[8] = new nlobjSearchColumn("custrecord_bcu_subsidiary", "CUSTRECORD_BUDGETING_UNIT", null);

    var search = nlapiCreateSearch('customrecord_control_budgeting_unit', null, columns);

    var newFilters = [
        new nlobjSearchFilter('custrecord_buc_start_date', null, 'onorbefore', trandate),
        new nlobjSearchFilter('custrecord_buc_end_date', null, 'onorafter', trandate)
    ];
    search.addFilters(newFilters);

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
                account: s[i].getValue("custrecord_bcu_account", "CUSTRECORD_BUDGETING_UNIT", null),
                pAccount: s[i].getValue("custrecord_bcu_parent_account", "CUSTRECORD_BUDGETING_UNIT", null),
                department: s[i].getValue("custrecord_bcu_department", "CUSTRECORD_BUDGETING_UNIT", null),
                pDepartment: s[i].getValue("custrecord_parent_department", "CUSTRECORD_BUDGETING_UNIT", null),
                subsidiary: s[i].getValue("custrecord_bcu_subsidiary", "CUSTRECORD_BUDGETING_UNIT", null),
                isempty: [0, 0, 0, 0, 0],
                abu: s[i].getValue('custrecord_budgeting_unit'),
                startDate: s[i].getValue('custrecord_buc_start_date'),
                endDate: s[i].getValue('custrecord_buc_end_date'),
            }
            if (s[i].getValue("custrecord_bcu_account", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[0] = 1; } // account
            if (s[i].getValue("custrecord_bcu_parent_account", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[1] = 1; } // parent account
            if (s[i].getValue("custrecord_bcu_department", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[2] = 1; } // department
            if (s[i].getValue("custrecord_parent_department", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[3] = 1; } //parent department
            if (s[i].getValue("custrecord_bcu_subsidiary", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[4] = 1; } // subsidiary
        }
    }
    return Results;
}

function searchBCU(trandate) {
    var columns = [
        new nlobjSearchColumn('internalid'),
        new nlobjSearchColumn('custrecord_budgeting_unit'),
        new nlobjSearchColumn('custrecord_buc_start_date'),
        new nlobjSearchColumn('custrecord_buc_end_date')
    ];

    var search = nlapiCreateSearch('customrecord_control_budgeting_unit', null, columns);

    var newFilters = [
        new nlobjSearchFilter('custrecord_buc_start_date', null, 'onorbefore', trandate),
        new nlobjSearchFilter('custrecord_buc_end_date', null, 'onorafter', trandate)
    ];

    // Call addFilters to add filters to the existing search
    search.addFilters(newFilters);

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
    nlapiLogExecution('debug', 'Results', JSON.stringify(Results));
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
        nlapiLogExecution('debug', 'curr: ', JSON.stringify(curr));

        nlapiLogExecution('debug', 'getBu properties: ', JSON.stringify(properties));
        switch (properties.code) {
            case '1':// Control By Account
                arr = [1, 2, 3];
                if (curr.account == properties.account && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    nlapiLogExecution('debug', 'case1: ', curr.id);
                    return curr.abu;
                }
                continue;

            case '2': // Control By Account And Department
                arr = [1, 3];
                if (curr.account == properties.account && curr.department == properties.department && checkifempty(curr, arr)) {
                    nlapiLogExecution('debug', 'case2: ', curr.id);
                    return curr.abu;
                }
                continue;

            case '3': // Control By Account And Parent Department
                arr = [1, 2];
                if (curr.account == properties.account && curr.pDepartment == properties.parentDepartment && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    nlapiLogExecution('debug', 'case3: ', curr.id);
                    return curr.abu;
                }
                continue;

            case '4': // Control By Parent Account
                arr = [0, 2, 3];
                if (curr.pAccount == properties.parentAccount && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    nlapiLogExecution('debug', 'case4: ', curr.id);
                    return curr.abu;
                }
                continue;

            case '5': // Control By Parent Account And Department
                arr = [0, 3];
                if (curr.pAccount == properties.parentAccount && curr.department == properties.department && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    nlapiLogExecution('debug', 'case5: ', curr.id);
                    return curr.abu;
                }
                continue;

            case '6': // Control By Parent Account And Parent Department
                arr = [0, 2];
                if (curr.pAccount == properties.parentAccount && curr.pDepartment == properties.parentDepartment && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    nlapiLogExecution('debug', 'case6: ', curr.id);
                    return curr.abu;
                }
                continue;

            case '7': // Control By Department
                arr = [0, 1, 3];
                if (curr.department == properties.department && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    nlapiLogExecution('debug', 'case7: ', curr.id);
                    return curr.abu;
                }
                continue;

            case '8': // Control By Parent Department
                arr = [0, 1, 2];
                if (curr.pDepartment == properties.parentDepartment && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    nlapiLogExecution('debug', 'case8: ', curr.id);
                    return curr.abu;
                }
                continue;

            default:
                nlapiLogExecution('debug', 'case9: ', 'default');
                continue;
        }
    }

    return -1;
}

function checkifempty(curr, arr) {
    for (x = 0; x < arr.length; x++) {
        if (curr.isempty[arr[x]] == '1') {
            nlapiLogExecution('debug', ' is empty ' + x + ': ', curr.isempty[arr[x]]);
            return false;
        }
    }
    return true;
}

function getBcu(BU, date) {
    for (z = 0; z < BcuRsults.length; z++) {
        if (BcuRsults[z].Abu == BU && nlapiStringToDate(BcuRsults[z].startDate) <= nlapiStringToDate(date)
            && nlapiStringToDate(BcuRsults[z].endDate) >= nlapiStringToDate(date)) {
            return BcuRsults[z].id;
        }
    }
    return -1;
}

function properties_addition1(prop, record, index, itemType) {
    nlapiLogExecution('debug', ' inside original script: ', '');

    return prop;
}


function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

