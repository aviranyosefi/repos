var BuResults;
var BcuRsults;
var AccResults;

function aftersubmit() {
    BuResults = searchBU();
    BcuRsults = searchBCU();
    AccResults = searchAccounts();

    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var properties = {
        department: rec.getFieldValue('department'),
        subsidiary: rec.getFieldValue('subsidiary'),
        parentAccount: '-1',
        date: rec.getFieldValue('trandate'),
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

        //move to function get dep + parent dep
        var dep = rec.getLineItemValue(itemType, 'department', i);
        if (dep != null && dep != undefined && dep != '') {
            properties.department = dep;
            var Pdep = nlapiLookupField('department', dep, 'custrecord_department_budgetary_control');
            if (Pdep != null && Pdep != undefined && Pdep != '' && Pdep != '-1') {
                properties.parentDepartment = Pdep;
            }
        }

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
            if (expanseFlag) {
                if (transType == 'expensereport') {
                    var category = rec.getLineItemValue('expense', 'category', i);
                    properties.account = nlapiLookupField("expensecategory", category, 'account');
                    nlapiLogExecution('debug', ' expense report avcount: ', properties.account);
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
                if (AccResults[properties.account].crossSub == 'T') { properties.subsidiary = null; }
                properties.code = AccResults[properties.account].controlLevel;

                if (nlapiGetRecordType() == 'purchaseorder' && (rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i) != null)) {
                    properties.date = rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i);
                }
                else {
                    properties.date = rec.getFieldValue('trandate');
                }
                nlapiLogExecution('debug', ' deparment: ', properties.department);
                nlapiLogExecution('debug', ' subsudiary: ', properties.subsidiary);
                nlapiLogExecution('debug', ' paarant department: ', properties.parentDepartment);
                nlapiLogExecution('debug', ' account: ', properties.account);
                nlapiLogExecution('debug', ' Parant account: ', properties.parentAccount);
                nlapiLogExecution('debug', ' Code: ', properties.code);

                nlapiLogExecution('debug', ' BuResults length: ', BuResults.length);
                nlapiLogExecution('debug', ' BcuResults length:: ', BcuRsults.length);
                nlapiLogExecution('debug', ' AccResults length: ', AccResults.length);

                var BU = getBu(properties);
                nlapiLogExecution('debug', ' reutrned BU: ', BU);
                if (BU != -1) {
                    rec.setLineItemValue(itemType, 'custcol_budgeting_unit', i, BU);
                    nlapiLogExecution('debug', ' submit BU: ', BU);
                    var BCU = getBcu(BU, properties.date);
                    nlapiLogExecution('debug', ' reutrned BCU: ', BCU);
                    if (BCU != -1) {
                        rec.setLineItemValue(itemType, 'custcol_budget_control_unit', i, BCU);
                        nlapiLogExecution('debug', ' submit BCU: ', BCU);
                    }
                }

            }
            //var account_rec = nlapiLoadRecord('account', properties.account);
            //underBusgetControl = account_rec.getFieldValue('custrecord_under_budgetary_control');
            //if (underBusgetControl == 'T') {
            //if (account_rec.getFieldValue('custrecord_cross_subsidiary_budgeting') == 'T') { properties.subsidiary = '-1'; }
            //properties.parentAccount = account_rec.getFieldValue('custrecord_budget_section');
            //properties.code = account_rec.getFieldValue('custrecord_budgetary_control_level');
            //var annuallyBcu = searchBUs(properties);
            //if (annuallyBcu != '-1') {
            //   rec.setLineItemValue(itemType, 'custcol_budgeting_unit', i, annuallyBcu.id);
            //    if (rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i) != null) {
            //        properties.date = rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i);
            //     }
            //   else {
            //       properties.date = rec.getFieldValue('trandate');
            //   }

            //   var periodicBCU = searchBCUs(annuallyBcu.id, properties.date);
            //   if (periodicBCU != '-1') {
            //      rec.setLineItemValue(itemType, 'custcol_budget_control_unit', i, periodicBCU.id);
            //  }
            //}
            //}
        }
    }
    var subrec = nlapiSubmitRecord(rec);
    nlapiLogExecution('debug', ' submited record: ', subrec);
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
                /*         if (curr.account == properties.account) { 
                             nlapiLogExecution('curr.account', curr.account);
                             nlapiLogExecution('debug', 'properties.account: ', properties.account);
                             nlapiLogExecution('debug', 'curr.pDepartment: ', curr.pDepartment);
                             nlapiLogExecution('debug', 'properties.parentDepartment: ', properties.parentDepartment);
                         }*/
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
            default:
        }
        /*        if (code == '1' || code == '2' || code == '3') {
                    filters[counter] = new nlobjSearchFilter('custrecord_bcu_account', null, 'anyof', properties.account);
                    counter++;
                }
                if (properties.code == '2' || properties.code == '5' || properties.code == '7') {
                    filters[counter] = new nlobjSearchFilter('custrecord_bcu_department', null, 'anyof', properties.department);
                    counter++;
                }
                if (properties.code == '4' || properties.code == '5' || properties.code == '6') {
                    filters[counter] = new nlobjSearchFilter('custrecord_bcu_parent_account', null, 'anyof', properties.parentAccount);
                    counter++;
                }
                if (properties.code == '3' || properties.code == '6' || properties.code == '8') {
                    filters[counter] = new nlobjSearchFilter('custrecord_parent_department', null, 'anyof', properties.parentDepartment);
                    counter++;
                }
                if (properties.subsidiary != '-1') {
                    filters[counter] = new nlobjSearchFilter('custrecord_bcu_subsidiary', null, 'anyof', properties.subsidiary);
                    counter++;
                }*/
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
/*
 var search = nlapiLoadSearch(null, 'customsearch274217');
	search.addFilter(new nlobjSearchFilter( 'elementdate', null, 'onorbefore', toDate));
	search.addFilter(new nlobjSearchFilter( 'trandate', 'sourcetransaction', 'onorbefore', toDate));

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
			s.forEach(function(line) {
				Results[line.getText(cols[0])] ={
						cols1 : line.getValue(cols[0]),
						cols2 : line.getValue(cols[2]),
						cols3 : line.getValue(cols[7]),

				}

			});
	}

	 keys = Object.keys(Results);
	 nlapiLogExecution('debug', 'keys ' + keys.length , keys)
	 return Results;

 */