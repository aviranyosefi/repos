var BuResults;
var BcuRsults;
var AccResults;
var statusVal = '';
function beforeLoad(type, form) {
    if (type == 'view') {
        var transType = nlapiGetRecordType();
        if (transType == 'purchaserequisition' || transType == 'purchaseorder') {
            var rec = nlapiLoadRecord(transType, nlapiGetRecordId());
            var status = rec.getFieldValue('approvalstatus');
            var currstatusVal = rec.getFieldValue('custbody_budgetary_control_status');
            if (status == 1) {
                var budgetary_control_type = nlapiLookupField('subsidiary', rec.getFieldValue('subsidiary'), 'custrecord_budgetary_control_type');
                var cbuType = 'customrecord_control_budgeting_unit';
                var exceeded = false, budgetunits = false;
                var err_msg = [], cbuArray = [], NotExsitUnit = [];
                var unitName = '';
                var cbuRecord;
                var itemCount = rec.getLineItemCount('item');
                for (i = 1; i <= itemCount; i++) {
                    currCbu = rec.getLineItemValue('item', 'custcol_budget_control_unit', i);
                    if (!isNullOrEmpty(currCbu)) {
                        currAmount = rec.getLineItemValue('item', 'amount', i);
                        if (currAmount != '0') {
                            currAmount = parseFloat(currAmount);
                            cbuRecord = loadRecByType(cbuType, currCbu);//need the record also for the next if
                            var available_Funds = parseFloat(cbuRecord.getFieldValue('custrecord_cbu_available_funds'));
                            if (cbuArray[currCbu] == null || cbuArray[currCbu] == undefined) {//currCbu seen for the first time
                                budgetunits = true;
                                cbuArray[currCbu] = { availableFunds: available_Funds, firstAmount: currAmount }
                            }
                            else {
                                cbuArray[currCbu].availableFunds -= cbuArray[currCbu].firstAmount;
                                cbuArray[currCbu].firstAmount += currAmount;
                            }
                            if (cbuArray[currCbu].availableFunds < 0) {
                                exceeded = true;
                                unitName = cbuRecord.getFieldValue('name');
                                err_msg.push(unitName);
                            }
                        }
                    }
                    else if (rec.getLineItemValue('item', 'custcol_not_exist_unit', i) == 'T') {
                        NotExsitUnit.push(i);
                    }
                }

                if (NotExsitUnit.length > 0) {
                    statusVal = 2;
                    var msg = NotExsitUnitMsg(NotExsitUnit);
                    var htmlfield = form.addField('custpage_not_exsit_unit', 'inlinehtml', '', null, null);
                    var html = "<script>" + msg + "</script>";
                    htmlfield.setDefaultValue(html);
                }
                if ((budgetary_control_type == 1 && NotExsitUnit.length > 0) || budgetary_control_type == 2 && NotExsitUnit.length == 0) {
                    var UniqueArray = toUniqueArray(err_msg);
                    var msg = showmsg(exceeded, UniqueArray, budgetunits);
                    var htmlfield = form.addField('custpage_field_check', 'inlinehtml', '', null, null);
                    var totalMsg = msg.toString();
                    var html = "<script>" + totalMsg + "</script>";
                    htmlfield.setDefaultValue(html);
                }
                setStatus(currstatusVal, rec);
            }
        }
    }
}

function toUniqueArray(a) {
    var newArr = [];
    for (var i = 0; i < a.length; i++) {
        if (newArr.indexOf(a[i]) === -1) {
            newArr.push(a[i]);
        }
    }
    return newArr;
}
function loadRecByType(typeRec, RecID) {
    var rec = null;
    try {
        rec = nlapiLoadRecord(typeRec, RecID);

    } catch (e) {

    }
    return rec;
}
function showmsg(exceeded, err, budgetunits) {
    var msg = [];
    if (budgetunits == false) {
        msg[0] = 'showAlertBox("my_element_id","Verified","No budget units to be evaluated", 0,"", "", "", "")';
        statusVal = 1;
    } else {
        if (exceeded == false) {
            msg[0] = 'showAlertBox("my_element_id","Verified","All containing units are within their budget", 0,"", "", "", "")';
            statusVal = 1;
        }
        else {
            for (var i = 0; i < err.length; i++) {
                msg[i] = 'showAlertBox("my_element_id","The following units exceeded their budget:","' + err[i] + '", 3,"", "", "", "")';
            }
            statusVal = 2;
        }
    }


    return msg;
}
function NotExsitUnitMsg(NotExsitUnit) {
    var lines = 'line: ';
    for (var i = 0; i < NotExsitUnit.length; i++) {
        if (i == 0) {
            lines += NotExsitUnit[i];
        } else {
            lines += ' ,' + NotExsitUnit[i];
        }
    }
    var msg = 'showAlertBox("my_element_id","The account is under budgetary control but no budget record was found for the account and relevant class/department:","' + lines + '", 3,"", "", "", "")';
    return msg;
}
function setStatus(currstatusVal, rec) {
    if (currstatusVal != statusVal) {
        rec.setFieldValue('custbody_budgetary_control_status', statusVal);
        nlapiSubmitRecord(rec);
    }
}

function beforSubmit(type) {
    //nlapiLogExecution('debug', 'type: ' + type , nlapiGetContext().getExecutionContext());
    if (type != 'delete' && type != 'xedit') {
        var transType = nlapiGetRecordType();
        //nlapiLogExecution('debug', ' transType ', transType);
        var properties = {
            department: nlapiGetFieldValue('department'),
            subsidiary: nlapiGetFieldValue('subsidiary'),
            parentAccount: '-1',
            date: nlapiGetFieldValue('trandate'),
            parentRegion: '-1',
            class: '-1',
        }
        //nlapiLogExecution('debug', ' properties: ', JSON.stringify(properties));
        BuResults = searchBU(properties.date); // return all Annual Budget  Units into array of Jsons containing required properties
        AccResults = searchAccounts(); // return all accounts that is under Budget Control 
        var itemType = 'item';
        var expanseFlag = false;
        var journalFlag = false;
        if (transType == 'inventoryadjustment') {
            properties.account = nlapiGetFieldValue('account');
            properties.class = nlapiGetFieldValue('class');
            //nlapiLogExecution('debug', ' properties class: ', JSON.stringify(properties));

            if (!isNullOrEmpty(properties.department)) {
                var Pdep = nlapiLookupField('department', properties.department, 'custrecord_department_budgetary_control');
                if (!isNullOrEmpty(Pdep)) {
                    properties.parentDepartment = Pdep;
                }
            }
            if (AccResults[properties.account] != null) { // if account under budgetary control
                properties.parentAccount = AccResults[properties.account].Paccount; // get parent account value from account
                if (AccResults[properties.account].crossSub == 'T') { properties.subsidiary = ""; } // if cross subsidiary on 
                properties.code = AccResults[properties.account].controlLevel;
                var BU = getBu(properties);
                if (BU == -1 && AccResults[properties.account] != null) {// in case of edit of transaction that before was account under budgetary control and after save there is not account under budgetary control
                    nlapiSetFieldValue('custbody_annual_budgeting_unit', '');
                    nlapiSetFieldValue('custbody_control_budgeting_unit', '');
                }
                else if (BU != -1) {
                    nlapiSetFieldValue('custbody_annual_budgeting_unit', BU);
                    var BCU = getBcu(BU, properties.date);

                    //nlapiLogExecution('debug', ' reutrned BCU: ', BCU);
                    if (BCU != -1) {
                        nlapiSetFieldValue('custbody_control_budgeting_unit', BCU);
                    }
                }
            } else {
                nlapiSetFieldValue('custbody_annual_budgeting_unit', '');
                nlapiSetFieldValue('custbody_control_budgeting_unit', '');
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
                var dep = nlapiGetLineItemValue(itemType, 'department', i);
                if (!isNullOrEmpty(dep)) {
                    properties.department = dep;
                    var Pdep = nlapiLookupField('department', dep, 'custrecord_department_budgetary_control');
                    if (!isNullOrEmpty(Pdep)) {
                        properties.parentDepartment = Pdep;
                    }
                }
                var ItemID = nlapiGetLineItemValue(itemType, 'item', i);
                if (expanseFlag) {//case line item == 'expense'
                    if (transType == 'expensereport') {//case transaction type = expense report, getting expense account from expense category
                        var category = nlapiGetLineItemValue('expense', 'category', i);
                        if (!isNullOrEmpty(category)) {
                            properties.account = nlapiLookupField("expensecategory", category, 'account');
                            properties.class = nlapiLookupField("expensecategory", category, 'class');
                        }
                    }
                    else {//  getting expense account from inline value
                        properties.account = nlapiGetLineItemValue('expense', 'account', i);
                        properties.class = nlapiGetLineItemValue('expense', 'class', i);
                    }
                }
                else if (journalFlag) {
                    properties.account = nlapiGetLineItemValue('line', 'account', i);
                    properties.class = nlapiGetLineItemValue('line', 'class', i);

                }
                else {//getting expense account from item entity
                    properties.account = nlapiLookupField('item', ItemID, 'expenseaccount');
                    var classLine = nlapiGetLineItemValue(itemType, 'class', i);
                    if (isNullOrEmpty(classLine)) { classLine = nlapiLookupField('item', ItemID, 'class'); }
                    properties.class = classLine;
                }
                if (AccResults[properties.account] != null) { // if account under budgetary control
                    properties.parentAccount = AccResults[properties.account].Paccount; // get parent account value from account
                    if (AccResults[properties.account].crossSub == 'T') { properties.subsidiary = ""; } // if cross subsidiary on 
                    properties.code = AccResults[properties.account].controlLevel;

                    if ((transType == 'purchaseorder' || transType == 'purchaserequisition') && (nlapiGetLineItemValue(itemType, 'custcol_line_encumbrance_date', i) != null)) {
                        properties.date = nlapiGetLineItemValue(itemType, 'custcol_line_encumbrance_date', i);
                    }
                    else {
                        properties.date = nlapiGetFieldValue('trandate');
                    }
                    var BU = getBu(properties);
                    //nlapiLogExecution('debug', ' reutrned BU: ', BU);
                    if (BU == -1 && AccResults[properties.account] != null) {
                        nlapiSetLineItemValue(itemType, 'custcol_budgeting_unit', i, '');
                        nlapiSetLineItemValue(itemType, 'custcol_budget_control_unit', i, '');
                        nlapiSetLineItemValue(itemType, 'custcol_not_exist_unit', i, 'T');
                    }
                    else if (BU != -1) {
                        nlapiSetLineItemValue(itemType, 'custcol_budgeting_unit', i, BU);
                        BcuRsults = searchBCU(BU)
                        var BCU = getBcu(BU, properties.date);
                        //nlapiLogExecution('debug', ' reutrned BCU: ', JSON.stringify(BCU));
                        if (BCU != -1) {
                            nlapiSetLineItemValue(itemType, 'custcol_budget_control_unit', i, BCU);
                            nlapiSetLineItemValue(itemType, 'custcol_not_exist_unit', i, 'F');
                        }
                    }
                }
                else {
                    nlapiSetLineItemValue(itemType, 'custcol_budgeting_unit', i, '');
                    nlapiSetLineItemValue(itemType, 'custcol_budget_control_unit', i, '');
                }
            }
        }
    }
}

function afterSubmit(type) {
    if (type != 'delete') {
        try {
            nlapiScheduleScript('customscript_link_bu_ss', null, { custscript_tran_id: nlapiGetRecordId(), custscript_tran_type: nlapiGetRecordType() })
        } catch (e) { }
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
    columns[9] = new nlobjSearchColumn("custrecord_bu_class", "CUSTRECORD_BUDGETING_UNIT", null);

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
                class: s[i].getValue("custrecord_bu_class", "CUSTRECORD_BUDGETING_UNIT", null),
                isempty: [0, 0, 0, 0, 0, 0],
                abu: s[i].getValue('custrecord_budgeting_unit'),
                startDate: s[i].getValue('custrecord_buc_start_date'),
                endDate: s[i].getValue('custrecord_buc_end_date'),
            }
            if (s[i].getValue("custrecord_bcu_account", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[0] = 1; } // account
            if (s[i].getValue("custrecord_bcu_parent_account", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[1] = 1; } // parent account
            if (s[i].getValue("custrecord_bcu_department", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[2] = 1; } // department
            if (s[i].getValue("custrecord_parent_department", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[3] = 1; } //parent department
            if (s[i].getValue("custrecord_bcu_subsidiary", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[4] = 1; } // subsidiary
            if (s[i].getValue("custrecord_bu_class", "CUSTRECORD_BUDGETING_UNIT", null) != '') { Results[i].isempty[5] = 1; } // class

        }
    }
    return Results;
}

function searchBCU(abu) {
    var columns = [
        new nlobjSearchColumn('internalid'),
        new nlobjSearchColumn('custrecord_budgeting_unit'),
        new nlobjSearchColumn('custrecord_buc_start_date'),
        new nlobjSearchColumn('custrecord_buc_end_date')
    ];

    var search = nlapiCreateSearch('customrecord_control_budgeting_unit', null, columns);

    var newFilters = [
        new nlobjSearchFilter('custrecord_budgeting_unit', null, 'anyof', abu)

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
    //nlapiLogExecution('debug', 'Results', JSON.stringify(Results));
    return Results;
}

function searchAccounts() {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custrecord_under_budgetary_control');
    columns[2] = new nlobjSearchColumn('custrecord_cross_subsidiary_budgeting');
    columns[3] = new nlobjSearchColumn('custrecord_budget_section');
    columns[4] = new nlobjSearchColumn('custrecord_budgetary_control_level');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_under_budgetary_control', null, 'is', 'T')

    var search = nlapiCreateSearch('account', filters, columns);
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
            Results[s[i].id] = {
                crossSub: s[i].getValue('custrecord_cross_subsidiary_budgeting'),
                Paccount: s[i].getValue('custrecord_budget_section'),
                controlLevel: s[i].getValue('custrecord_budgetary_control_level'),
            }
        }
    }
    return Results;
}

function getBu(properties) {
    debugger;
    for (y = 0; y < BuResults.length; y++) {
        var curr = BuResults[y];
        var arr = [];
        //nlapiLogExecution('debug', 'curr: ', JSON.stringify(curr));

        //nlapiLogExecution('debug', 'getBu properties: ', JSON.stringify(properties));
        switch (properties.code) {

            case '1':// Control By Account
                arr = [1, 2, 3];
                if (curr.account == properties.account && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    //nlapiLogExecution('debug', 'case1: ', curr.id);
                    return curr.abu;
                }
                continue;
            case '2': // Control By Account And Department
                arr = [1, 3];
                if (curr.account == properties.account && curr.department == properties.department && checkifempty(curr, arr)) {
                    //nlapiLogExecution('debug', 'case2: ', curr.id);
                    return curr.abu;
                }
                continue;
            case '3': // Control By Account And Parent Department
                arr = [1, 2];
                if (curr.account == properties.account && curr.pDepartment == properties.parentDepartment && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    //nlapiLogExecution('debug', 'case3: ', curr.id);
                    return curr.abu;
                }
                continue;
            case '4': // Control By Parent Account
                arr = [0, 2, 3];
                if (curr.pAccount == properties.parentAccount && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    //nlapiLogExecution('debug', 'case4: ', curr.id);
                    return curr.abu;
                }
                continue;
            case '5': // Control By Parent Account And Department
                arr = [0, 3];
                if (curr.pAccount == properties.parentAccount && curr.department == properties.department && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    //nlapiLogExecution('debug', 'case5: ', curr.id);
                    return curr.abu;
                }
                continue;
            case '6': // Control By Parent Account And Parent Department
                arr = [0, 2];
                if (curr.pAccount == properties.parentAccount && curr.pDepartment == properties.parentDepartment && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    //nlapiLogExecution('debug', 'case6: ', curr.id);
                    return curr.abu;
                }
                continue;
            case '7': // Control By Department
                arr = [0, 1, 3];
                if (curr.department == properties.department && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    //nlapiLogExecution('debug', 'case7: ', curr.id);
                    return curr.abu;
                }
                continue;
            case '8': // Control By Parent Department
                arr = [0, 1, 2];
                if (curr.pDepartment == properties.parentDepartment && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    //nlapiLogExecution('debug', 'case8: ', curr.id);
                    return curr.abu;
                }
                continue;
            case '9': // Control by Account and Class
                arr = [1, 3];
                if (curr.class == properties.class && curr.account == properties.account && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    //nlapiLogExecution('debug', 'case9: ', curr.id);
                    return curr.abu;
                }
                continue;
            case '10': // Control by Parent Account and Class
                arr = [0, 3];
                if (curr.class == properties.class && curr.pAccount == properties.parentAccount && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    //nlapiLogExecution('debug', 'case10: ', curr.id);
                    return curr.abu;
                }
                continue;
            default:
                //nlapiLogExecution('debug', 'case11: ', 'default');
                continue;
        }
    }
    return -1;
}

function checkifempty(curr, arr) {
    //nlapiLogExecution('debug', 'checkifempty curr: ', JSON.stringify(curr));
    //nlapiLogExecution('debug', 'checkifempty arr: ', arr);

    for (x = 0; x < arr.length; x++) {
        if (curr.isempty[arr[x]] == '1') {
            //nlapiLogExecution('debug', ' is empty ' + x + ': ', curr.isempty[arr[x]]);
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

function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

