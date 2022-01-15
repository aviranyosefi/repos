debugger;
var BuResults = searchBU();
var BcuRsults = searchBCU();
var AccResults = searchAccounts();


var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
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

//var dep = rec.getFieldValue('department');
//var subsidiary = rec.getFieldValue('subsidiary');
var expenseCount = rec.getLineItemCount('expense');
if (expenseCount > 0) {
    expanseFlag = true;
    counter = expenseCount;
    itemType = 'expense';
}
else if (rec.getLineItemCount('line') > 0) {
    journalFlag = true;
    itemType = 'line';
    var lineCount = rec.getLineItemCount('line');
    counter = lineCount;
}
else {
    var itemCount = rec.getLineItemCount('item');
    counter = itemCount;
}

var changeFlag = false;
for (var i = 1; i <= counter; i++) {        // Loop through each of the items in the sublist
    properties.parentRegion = '-1';
    properties.parentAccount = '-1';
    properties.subAccount = '-1';
    //move to function get dep + parent dep
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
    if ((recordtype == 'noninventoryitem' && nlapiGetRecordType() == 'purchaseorder') || nlapiGetRecordType() != 'purchaseorder') {
        if (expanseFlag) {
            if (transType == 'expensereport') {
                var category = rec.getLineItemValue('expense', 'category', i);
                properties.account = nlapiLookupField("expensecategory", category, 'account');
            }
            else {
                properties.account = rec.getLineItemValue('expense', 'account', i);
            }
        }
        else if (journalFlag) {
            properties.account = rec.getLineItemValue('line', 'account', i);
        }
        else {
            properties.account = nlapiLookupField(recordtype, Id, 'expenseaccount');
        }

        if (AccResults[properties.account] != null) {
            properties.parentAccount = AccResults[properties.account].Paccount;
            if (AccResults[properties.account].crossSub == 'T') { properties.subsidiary = '-1'; }
            properties.code = AccResults[properties.account].controlLevel;

            var postingPeriod = rec.getFieldValue('postingperiod');
            if (postingPeriod != null && postingPeriod != '' && postingPeriod != undefined) {
                properties.date = nlapiLookupField('accountingperiod', postingPeriod, 'startdate');
            }
            else if (nlapiGetRecordType() == 'purchaseorder' && (rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i) != null)) {
                properties.date = rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i);
            }
            else {
                properties.date = rec.getFieldValue('trandate');
            }

            var BU = getBu(properties);
            debugger;
            if (BU != -1) {
                rec.setLineItemValue(itemType, 'custcol_budgeting_unit', i, BU);
                console.log('set field BU: ' + BU);
                var BCU = getBcu(BU, properties.date);
                debugger;
                if (BCU != -1) {
                    rec.setLineItemValue(itemType, 'custcol_budget_control_unit', i, BCU);
                    console.log('set field BCU: ' + BCU);
                }
            }

        }

    }
}
debugger;
//var subrec = nlapiSubmitRecord(rec);
console.log('record submit');

function searchBU() {
    nlapiLogExecution('debug', ' inside override  script: ', 'searchBU');
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custrecord_bcu_parent_account');
    columns[2] = new nlobjSearchColumn('custrecord_bcu_account');
    columns[3] = new nlobjSearchColumn('custrecord_parent_department');
    columns[4] = new nlobjSearchColumn('custrecord_bcu_department');
    columns[5] = new nlobjSearchColumn('custrecord_bcu_subsidiary');
    columns[6] = new nlobjSearchColumn('custrecord_abu_subaccount');
    var search = nlapiCreateSearch('customrecord_annual_budgeting_unit', null, columns);

    var s = [];
    var Results = [];

    var searchid = 0
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
                sAccount: s[i].getValue('custrecord_abu_subaccount'),
                isempty: [0, 0, 0, 0, 0, 0],
            }
            if (s[i].getValue('custrecord_bcu_account') != '') { Results[i].isempty[0] = 1; }
            if (s[i].getValue('custrecord_bcu_parent_account') != '') { Results[i].isempty[1] = 1; }
            if (s[i].getValue('custrecord_bcu_department') != '') { Results[i].isempty[2] = 1; }
            if (s[i].getValue('custrecord_parent_department') != '') { Results[i].isempty[3] = 1; }
            if (s[i].getValue('custrecord_bcu_subsidiary') != '') { Results[i].isempty[4] = 1; }
            if (s[i].getValue('custrecord_abu_subaccount') != '') { Results[i].isempty[5] = 1; }
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
    nlapiLogExecution('debug', ' inside override  script: ', 'getBu');
    for (y = 0; y < BuResults.length; y++) {
        var curr = BuResults[y];
        var arr = [];
        switch (properties.code) {
            case '1':
                arr = [1, 2, 3];
                if (curr.account == properties.account && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '2':
                arr = [1, 3];
                if (curr.account == properties.account && curr.department == properties.department && checkifempty(curr, arr)) {
                    return curr.id;
                }
                break;
            case '3':
                arr = [1, 2];
                if (curr.account == properties.account && curr.pDepartment == properties.parentDepartment && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '4':
                arr = [0, 2, 3];
                if (curr.pAccount == properties.parentAccount && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '5':
                arr = [0, 3];
                if (curr.pAccount == properties.parentAccount && curr.department == properties.department && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '6':
                arr = [0, 2];
                if (curr.pAccount == properties.parentAccount && curr.pDepartment == properties.parentDepartment && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '7':
                arr = [0, 1, 3];
                if (curr.department == properties.department && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '8':
                arr = [0, 1, 2];
                if (curr.pDepartment == properties.parentDepartment && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '9'://account + department + subaccount
                arr = [1, 3];
                if (curr.account == properties.account && curr.department == properties.department && curr.sAccount == properties.sAccount && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '10'://account + subaccount
                arr = [1, 2, 3];
                if (curr.account == properties.account && curr.sAccount == properties.sAccount && checkifempty(curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            default:
        }
    }
    return -1;
}

function checkifempty(curr, arr) {
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
    nlapiLogExecution('debug', ' inside override  script: ', '');
    var subaccount = record.getLineItemValue(itemType, 'custcol_sub_account_trans', index); //change 'cseg1' to sub account 
    if (subaccount != null && subaccount != undefined && subaccount != '') {
        prop.sAccount = subaccount;
        return prop;
    }
    return prop;
}