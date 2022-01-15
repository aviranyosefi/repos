function aftersubmit() {
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
    else{
        var itemCount = rec.getLineItemCount('item');
        counter = itemCount;
    }
    
    var changeFlag = false;
    for (var i = 1; i <= counter; i++) {        // Loop through each of the items in the sublist

        //move to function get dep + parent dep
        var dep = rec.getLineItemValue(itemType,'department',i);
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
        if ((recordtype == 'noninventoryitem' && nlapiGetRecordType() == 'purchaseorder') || nlapiGetRecordType() != 'purchaseorder') {
            if (expanseFlag) {
                properties.account = rec.getLineItemValue('expense', 'account', i);
            }
            else if (journalFlag) {
                properties.account = rec.getLineItemValue('line', 'account', i);
            }
            else {
                properties.account = nlapiLookupField(recordtype, Id, 'expenseaccount');
            } 
            //var item_rec = nlapiLoadRecord(recordtype, Id);
            //properties.account = getFieldValue('expenseaccount');
            var account_rec = nlapiLoadRecord('account', properties.account);
            underBusgetControl = account_rec.getFieldValue('custrecord_under_budgetary_control');
            if (underBusgetControl == 'T') {
                if (account_rec.getFieldValue('custrecord_cross_subsidiary_budgeting') == 'T') { properties.subsidiary = '-1'; }
                properties.parentAccount = account_rec.getFieldValue('custrecord_budget_section');
                properties.code = account_rec.getFieldValue('custrecord_budgetary_control_level');
                var annuallyBcu = searchBUs(properties);
                if (annuallyBcu != '-1') {
                    rec.setLineItemValue(itemType, 'custcol_budgeting_unit', i, annuallyBcu.id);
                    if (rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i) != null) {
                        properties.date = rec.getLineItemValue(itemType, 'custcol_line_encumbrance_date', i);
                    }
                    else {
                        properties.date = rec.getFieldValue('trandate');
                    }
                    
                    var periodicBCU = searchBCUs(annuallyBcu.id, properties.date);
                    if (periodicBCU != '-1') {
                        rec.setLineItemValue(itemType, 'custcol_budget_control_unit', i, periodicBCU.id);
                    }
                }
            }
        }
    }
    var subrec = nlapiSubmitRecord(rec);
}

function searchBUs(properties) {
    var filters = new Array();
    var counter = 0;
    if (properties.code == '1' || properties.code == '2' || properties.code == '3') {
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
    }

    var search = nlapiCreateSearch('customrecord_annual_budgeting_unit', filters, null);

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
    if (s.length > 0) {
        return s[0];
    }
    else {
        return '-1';
    }

}

function searchBCUs(ABU,date) {
    var filters = new Array();

    filters[0] = new nlobjSearchFilter('custrecord_budgeting_unit', null, 'anyof', ABU);
    filters[1] = new nlobjSearchFilter('custrecord_buc_start_date', null, 'before', date);
    filters[2] = new nlobjSearchFilter('custrecord_buc_end_date', null, 'after', date);

    var search = nlapiCreateSearch('customrecord_control_budgeting_unit', filters, null);

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
    if (s.length > 0) {
        return s[0];
    }
    else {
        return '-1';
    }

}

// for console
/*debugger;
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var properties = {
        department: rec.getFieldValue('department'),
        subsidiary: rec.getFieldValue('subsidiary'),
        parentAccount: '-1',
    }
    //var dep = rec.getFieldValue('department');
    //var subsidiary = rec.getFieldValue('subsidiary');
    var count = rec.getLineItemCount('item');
    var changeFlag = false;
    for (var i = 1; i <= count; i++) {        // Loop through each of the items in the sublist

        //move to function get dep + parent dep
        var dep = rec.getLineItemValue('item','department',i);
        if (dep != null && dep != undefined && dep != '') {
            properties.department = dep;
            var Pdep = nlapiLookupField('department', dep, 'custrecord_department_budgetary_control');
            if (Pdep != null && Pdep != undefined && Pdep != '' && Pdep != '-1') {
                properties.parentDepartment = Pdep;
            }
        }
        
        var itype = rec.getLineItemValue('item', 'itemtype', i); // Get the item type
        var Id = rec.getLineItemValue('item', 'item', i);
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
        if (recordtype == 'noninventoryitem') {
            properties.account = nlapiLookupField('noninventoryitem', Id, 'expenseaccount');
            //var item_rec = nlapiLoadRecord(recordtype, Id);
            //properties.account = getFieldValue('expenseaccount');
            var account_rec = nlapiLoadRecord('account', properties.account);
            underBusgetControl = account_rec.getFieldValue('custrecord_under_budgetary_control');
            if (underBusgetControl == 'True') {
                if (account_rec.getFieldValue('custrecord_cross_subsidiary_budgeting') == 'T') { properties.subsidiary = '-1'; }
                properties.parentAccount = account_rec.getFieldValue('custrecord_budget_section');
                properties.code = account_rec.getFieldValue('custrecord_budgetary_control_level');
            }
        }
        var annuallyBcu = searchBUs(properties);
        if (annuallyBcu != '-1') {
            rec.setLineItemValue('item', 'custcol_budgeting_unit', i, annuallyBcu[0] );
        }
        var subrec = nlapiSubmitRecord(rec);
    }


function searchBUs(properties) {
debugger;
    var filters = new Array();
    var counter = 0;
    if (properties.code == '1' || properties.code == '2' || properties.code == '3') {
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
    }
    

    var search = nlapiCreateSearch('customrecord_annual_budgeting_unit', filters, null);

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
    if (s.length > 0) {
        return s[0];
    }
    else {
        return '-1';
    }
}

*/







//Old version before biil 
/*
 function aftersubmit() {
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var properties = {
        department: rec.getFieldValue('department'),
        subsidiary: rec.getFieldValue('subsidiary'),
        parentAccount: '-1',
        date: rec.getFieldValue('trandate'),
    }
    //var dep = rec.getFieldValue('department');
    //var subsidiary = rec.getFieldValue('subsidiary');
    var count = rec.getLineItemCount('item');
    var changeFlag = false;
    for (var i = 1; i <= count; i++) {        // Loop through each of the items in the sublist

        //move to function get dep + parent dep
        var dep = rec.getLineItemValue('item','department',i);
        if (dep != null && dep != undefined && dep != '') {
            properties.department = dep;
            var Pdep = nlapiLookupField('department', dep, 'custrecord_department_budgetary_control');
            if (Pdep != null && Pdep != undefined && Pdep != '' && Pdep != '-1') {
                properties.parentDepartment = Pdep;
            }
        }

        var itype = rec.getLineItemValue('item', 'itemtype', i); // Get the item type
        var Id = rec.getLineItemValue('item', 'item', i);
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
        if (recordtype == 'noninventoryitem') {
            properties.account = nlapiLookupField('noninventoryitem', Id, 'expenseaccount');
            //var item_rec = nlapiLoadRecord(recordtype, Id);
            //properties.account = getFieldValue('expenseaccount');
            var account_rec = nlapiLoadRecord('account', properties.account);
            underBusgetControl = account_rec.getFieldValue('custrecord_under_budgetary_control');
            if (underBusgetControl == 'T') {
                if (account_rec.getFieldValue('custrecord_cross_subsidiary_budgeting') == 'T') { properties.subsidiary = '-1'; }
                properties.parentAccount = account_rec.getFieldValue('custrecord_budget_section');
                properties.code = account_rec.getFieldValue('custrecord_budgetary_control_level');
                var annuallyBcu = searchBUs(properties);
                if (annuallyBcu != '-1') {
                    rec.setLineItemValue('item', 'custcol_budgeting_unit', i, annuallyBcu.id);
                    if (rec.getLineItemValue('item', 'custcol_line_encumbrance_date', i) != null) {
                        properties.date = rec.getLineItemValue('item', 'custcol_line_encumbrance_date', i);
                    }
                    else {
                        properties.date = rec.getFieldValue('trandate');
                    }

                    var periodicBCU = searchBCUs(annuallyBcu.id, properties.date);
                    if (periodicBCU != '-1') {
                        rec.setLineItemValue('item', 'custcol_budget_control_unit', i, periodicBCU.id);
                    }
                }
            }
        }
    }
    var subrec = nlapiSubmitRecord(rec);
}

function searchBUs(properties) {
    var filters = new Array();
    var counter = 0;
    if (properties.code == '1' || properties.code == '2' || properties.code == '3') {
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
    }


    var search = nlapiCreateSearch('customrecord_annual_budgeting_unit', filters, null);

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
    if (s.length > 0) {
        return s[0];
    }
    else {
        return '-1';
    }

}

function searchBCUs(ABU,date) {
    var filters = new Array();

    filters[0] = new nlobjSearchFilter('custrecord_budgeting_unit', null, 'anyof', ABU);
    filters[1] = new nlobjSearchFilter('custrecord_buc_start_date', null, 'before', date);
    filters[2] = new nlobjSearchFilter('custrecord_buc_end_date', null, 'after', date);

    var search = nlapiCreateSearch('customrecord_control_budgeting_unit', filters, null);

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
    if (s.length > 0) {
        return s[0];
    }
    else {
        return '-1';
    }

}
 */