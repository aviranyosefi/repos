var context = nlapiGetContext();
//var context = nlapiGetContext().getExecutionContext()


function ValidateLines() {
    if (context == 'csvimport') {
        var transType = nlapiGetRecordType();
        var rec = nlapiLoadRecord(transType, nlapiGetRecordId());
        var counter = 0;
        var itemType = 'item';
        var account;
        var expanseFlag = false;
        var journalFlag = false;
        var allow = true;
        var restrictFlag = false;

        var errArr = new Array();
        var equityFlag = false;

        var mainDep = nlapiGetFieldValue('department');
        nlapiLogExecution('debug', 'ValidateLines - department from header: ', mainDep);
       // var roleExclude = nlapiLookupField('role', context.role, 'custrecord_exclude_from_rrc');

        var rolesExclude = nlapiLookupField('customrecord_role_mgmt_cust_dprt_validat', 1, 'custrecord_roles_exclude_from_validation');
        var isExclude = rolesExclude.indexOf(context.role);

        var roleAllow = nlapiLookupField('customrecord_role_mgmt_cust_dprt_validat', 1, 'custrecord_allow_access_restricted_acc');
        var isAllow = roleAllow.indexOf(context.role);

        if (context.roleid != 'administrator' && isExclude == -1) { // if role is not admin and not exclude from restriction
            var expenseCount = rec.getLineItemCount('expense');
            if (expenseCount > 0) {     //case line item == 'expense'
                expanseFlag = true;
                counter = expenseCount;
                itemType = 'expense';
            }
            else {
                if (rec.getLineItemCount('line') > 0) {        //case line item == 'line'
                    journalFlag = true;
                    itemType = 'line';
                    var lineCount = rec.getLineItemCount('line');
                    counter = lineCount;
                }
                else {          //case line item == 'item'
                    var itemCount = rec.getLineItemCount('item');
                    counter = itemCount;
                }
            }

            //var changeFlag = false;

            for (var i = 1; i <= counter; i++) {        // Loop through each of the items in the sublist
                var department = rec.getLineItemValue(itemType, 'department', i); // get Department from line level
                if (department != '' && department != null && department != undefined) {
                    mainDep = department;
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

                if (expanseFlag) {//case line item == 'expense'
                    if (transType == 'expensereport') {//case transaction type = expense report, getting expense account from expense category
                        var category = rec.getLineItemValue('expense', 'category', i);
                        if (category != null && category != undefined && category != '') {
                            account = nlapiLookupField("expensecategory", category, 'account');// test category's expense account
                        }
                        else {
                            nlapiLogExecution('debug', 'no category inserted: ', 'item type: expense');// no category selected while "Add" pressed
                        }
                    }
                    else {//  getting expense account from inline value
                        account = rec.getLineItemValue('expense', 'account', i);// no expensereport trx- tested account from the line
                    }
                }
                else {
                    if (journalFlag || nlapiGetRecordType() == 'advintercompanyjournalentry') {
                        account = rec.getLineItemValue('line', 'account', i);
                    }
                    else {//getting expense account from item entity
                        if (nlapiGetRecordType() == 'invoice' || nlapiGetRecordType() == 'creditmemo' || nlapiGetRecordType() == 'cashsale' || nlapiGetRecordType() == 'cashrefund') {
                            account = nlapiLookupField(recordtype, Id, 'expenseaccount');// test item's income account
                            nlapiLogExecution('debug', 'item type: ' + recordtype, 'income account:' + account);
                        }
                        else {
                            account = nlapiLookupField(recordtype, Id, 'expenseaccount');// test item's expense account
                            nlapiLogExecution('debug', 'item type: ' + recordtype, 'expense account:' + account);
                        }
                            
                    }
                }


                var classification = nlapiLookupField('account', account, 'custrecord_account_classification');

                if (classification == '2') {// account is balance sheet
                    var accType = nlapiLookupField('account', account, 'type');
                    if (accType != 'FixedAsset') {
                        nlapiLogExecution('debug', 'account type: ', 'balance sheet');
                        if (nlapiGetRecordType() == "journalentry" || nlapiGetRecordType() == 'advintercompanyjournalentry') {
                            nlapiLogExecution('debug', 'trx type: ', 'journalentry');
                            //var accType = nlapiLookupField('account', account, 'accttype');
                            var accRestricted = nlapiLookupField('account', account, 'custrecord_restricted_for_manual_je')
                            if (accRestricted == 'T') {
                                restrictFlag = true;                        //var restrictedFlag = nlapiLookupField('role', context.role, 'custrecord_allow_restricted_account');
                                if (isAllow != -1) { // role allowed restricted  ///  restrictedFlag == 'T'
                                    nlapiLogExecution('debug', 'account reestricted and role allowed restricted: ', 'dummy department');
                                    rec.setLineItemValue(itemType, 'department', i, '461'); // set up dummy department
                                }
                                else {// role does not allow equity
                                    //allow = search_combination(account, mainDep);
                                    nlapiLogExecution('debug', 'account restricted and role does not allow:', 'no combination check  ');
                                    //prevent wrong combination  MSG- 'current role cannot access qeuity account'
                                }
                            }
                            else { // account type is not restricted
                                nlapiLogExecution('debug', 'account type is not restricted: ', 'dummy department');
                                if (rec.getLineItemValue(itemType, 'department', i) != '461') {
                                    alert('Balance sheet account can only combined with Dummy department');
                                    rec.setLineItemValue(itemType, 'department', i, '461'); // set up dummy department
                                }
                            }
                        }

                        else { // account is balance sheet trx not journal
                            nlapiLogExecution('debug', 'account is balance sheet trx not journal ', 'dummy department');
                            rec.setLineItemValue(itemType, 'department', i, '461'); // set up dummy department
                            var accRestricted = nlapiLookupField('account', account, 'custrecord_restricted_for_manual_je')
                            if (accRestricted == 'T' && (nlapiGetRecordType() == "vendorbill" || nlapiGetRecordType() == "vendorcredit" || nlapiGetRecordType() == "purchaseorder")) {
                                if (accType == "Equity")
                                    restrictFlag = true;
                            }

                        }
                    }
                    else {
                        allow = search_combination(account, mainDep);
                        nlapiLogExecution('debug', 'account is balance sheet && fixed asset ', 'combination: ' + allow);
                    }
                }
                else { // account is not balance sheet
                    var accountRec = nlapiLoadRecord('account', account);
                    var parentAccount = accountRec.getFieldValue('parent');
                    if (parentAccount != null && parentAccount != undefined) {
                        nlapiLogExecution('debug', 'parentAccount id: ', parentAccount);
                        account = parentAccount;
                    }
                    allow = search_combination(account, mainDep);
                    nlapiLogExecution('debug', 'account is not balance sheet ', 'combination: ' + allow);
                }


                /*
                if (classification == '2') {
                    nlapiLogExecution('debug', 'account type: ', 'balance sheet');
                    var accType = nlapiLookupField('account', account, 'type');
                    if (accType != 'FixedAsset') {
                        
                        var accRestricted = nlapiLookupField('account', account, 'accttype');
                        if (accRestricted == 'T') {
                            var restrictedFlag = nlapiLookupField('role', context.role, 'custrecord_allow_restricted_account');
                            if (restrictedFlag == 'T') { // role allowed restricted
                                nlapiLogExecution('debug', 'account reestricted and role allowed restricted: ', 'dummy department');
                                rec.setLineItemValue(itemType, 'department', i, '461'); // set up dummy department
                            }
                            else {// role does not allow equity
                                allow = search_combination(account, mainDep);
                                equityFlag = true;
                                nlapiLogExecution('debug', 'account restricted and role does not allow:', 'combination: ' + allow);
                                //prevent wrong combination
                            }
                        }
                        else { // account type is not restricted
                            nlapiLogExecution('debug', 'account type is not restricted: ', 'dummy department');
                            rec.setLineItemValue(itemType, 'department', i, '461'); // set up dummy department
                        }
                    }
                    else { // account is balance sheet trx not journal
                        nlapiLogExecution('debug', 'account is balance sheet trx not journal ', 'dummy department');
                        rec.setLineItemValue(itemType, 'department', i, '461'); // set up dummy department
                    }
                }
                else { // account is not balance sheet
                    allow = search_combination(account, mainDep);
                    nlapiLogExecution('debug', 'account is not balance sheet ', 'combination: ' + allow);
                }
                */




                ///////////////////////////////////////////////////////////////////
                if (restrictFlag) {//!allow && equityFlag
                    //alert('Current role cannot access restricted account');
                    errArr.push({
                        trxType: transType,
                        line: i,
                        account: accName,
                        departmet: depName,
                        message: 'Current role cannot access restricted account',
                    })
                    throw nlapiCreateError("ERROR",
                        "Current role cannot access restricted account", false);
                }
                if (!allow) {
                    //var acc = nlapiLoadRecord('account', account);
                    var accName = nlapiLookupField('account', account, 'name');  // acc.getFieldValue('acctname');

                    //var dep = nlapiLoadRecord('department', mainDep);
                    var depName = nlapiLookupField('department', mainDep, 'name'); // dep.getFieldValue('name');

                    errArr.push({
                        trxType: transType,
                        line: i,
                        account: accName,
                        departmet: depName,
                        message: 'Not valid combination',
                    })
                    nlapiLogExecution('debug', 'ValidateLines - account:' + accName + ' (and its sub accounts): ', 'Department: ' + depName);
                    nlapiDeleteRecord(transType, rec.id);
                    throw nlapiCreateError("ERROR",
                        'account:' + accName + ' (and its sub accounts) and Department: ' + depName + ' are not valid combination ', false);
                }
            }// end for
            if (errArr.length > 0) {
                nlapiDeleteRecord(transType, rec.id);
            }
        }
        else{

        }
    }
} 

function search_combination(acc, dep) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    var search = nlapiCreateSearch('customrecord_se_role_restriction_comb', null, null);

    search.addFilter(new nlobjSearchFilter('custrecord_rrc_account', null, 'is', acc));
    search.addFilter(new nlobjSearchFilter('custrecord_rrc_all_departments', null, 'is', "T"));
    search.addFilter(new nlobjSearchFilter('custrecord_rrc_department', null, 'anyof', dep));
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

    } while (resultslice != null && resultslice.length >= 1000);

    if (s.length > 0) { return true; }
    else {
        search = nlapiCreateSearch('customrecord_se_role_restriction_comb', null, null);
        search.addFilter(new nlobjSearchFilter('custrecord_rrc_account', null, 'is',acc));
        search.addFilter(new nlobjSearchFilter('custrecord_rrc_department', null, 'anyof', dep));

        resultset = search.runSearch();
        //var cols = search.getColumns();

        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }

        } while (resultslice != null && resultslice.length >= 1000);
        if (s.length > 0) { return true; }
        else { return false; }
    }
}