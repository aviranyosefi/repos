
function properties_addition1(prop, record, index, itemType) {
    nlapiLogExecution('debug', ' inside override  script: ', '');
    var subaccount = record.getLineItemValue(itemType, 'custcol_sub_account_trans', index); //change 'cseg1' to sub account 
    if (subaccount != null && subaccount != undefined && subaccount != '') {
        prop.sAccount = subaccount;
        return prop;
    }
    return prop;
}


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

function getBu(properties) {
    nlapiLogExecution('debug', ' inside override  script: ', 'getBu');
    for (y = 0; y < BuResults.length; y++) {
        var curr = BuResults[y];
        var arr = [];
        switch (properties.code) {
            case '1':
                arr = [1, 2, 3];
                if (curr.account == properties.account && checkifempty(properties,curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '2':
                arr = [1, 3];
                if (curr.account == properties.account && curr.department == properties.department && checkifempty(properties,curr, arr)) {
                    return curr.id;
                }
                break;
            case '3':
                arr = [1, 2];
                if (curr.account == properties.account && curr.pDepartment == properties.parentDepartment && checkifempty(properties,curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '4':
                arr = [0, 2, 3];
                if (curr.pAccount == properties.parentAccount && checkifempty(properties,curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '5':
                arr = [0, 3];
                if (curr.pAccount == properties.parentAccount && curr.department == properties.department && checkifempty(properties,curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '6':
                arr = [0, 2];
                if (curr.pAccount == properties.parentAccount && curr.pDepartment == properties.parentDepartment && checkifempty(properties,curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '7':
                arr = [0, 1, 3];
                if (curr.department == properties.department && checkifempty(properties,curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '8':
                arr = [0, 1, 2];
                if (curr.pDepartment == properties.parentDepartment && checkifempty(properties,curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '9'://account + department + subaccount
                arr = [1, 3];
                if (curr.account == properties.account && curr.department == properties.department && curr.sAccount == properties.sAccount && checkifempty(properties,curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            case '10'://account + subaccount
                arr = [1, 2, 3];
                if (curr.account == properties.account &&  curr.sAccount == properties.sAccount && checkifempty(properties,curr, arr) && curr.subsidiary == properties.subsidiary) {
                    return curr.id;
                }
                break;
            default:
        }
    }
    return -1;
}