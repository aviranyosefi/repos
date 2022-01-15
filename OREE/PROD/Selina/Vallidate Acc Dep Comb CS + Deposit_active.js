var context = nlapiGetContext();

function ValidateLines(type, name) {
    var start = new Date();
    if (nlapiGetRecordType() != "customerdeposit") {
        //alert('enter')
        var counter = 0;
        var itemType = 'item';
        var account;
        var expanseFlag = false;
        var journalFlag = false;
        var allow = true;
        var restrictFlag = false;

        var mainDep = nlapiGetFieldValue('department');// get department from header
        nlapiLogExecution('debug', 'ValidateLines - department from header: ', mainDep);
        //nlapiLogExecution('debug', 'ValidateLines - department from header: ', mainDep);


        //var roleExclude = nlapiLookupField('role', context.role, 'custrecord_exclude_from_rrc');

        var rolesExclude = nlapiLookupField('customrecord_role_mgmt_cust_dprt_validat', 1, 'custrecord_roles_exclude_from_validation');
        var isExclude = rolesExclude.indexOf(context.role);// check if current role is exluded from validation.

        var roleAllow = nlapiLookupField('customrecord_role_mgmt_cust_dprt_validat', 1, 'custrecord_allow_access_restricted_acc');
        var isAllow = roleAllow.indexOf(context.role);// check if curren role have access to restricted accoounts

        if (context.roleid != 'administrator' && isExclude == -1) { // if role is not admin and not exclude from restriction   //&& roleExclude != 'T'

            //var expenseCount = rec.getLineItemCount('expense');
            //if (expenseCount > 0) {     //case line item == 'expense'
            //    expanseFlag = true;
            //    counter = expenseCount;
            //    itemType = 'expense';
            //}
            //else {
            //    if (rec.getLineItemCount('line') > 0) { //case line item == 'line'
            //        journalFlag = true;
            //        itemType = 'line';
            //        var lineCount = rec.getLineItemCount('line');
            //        counter = lineCount;
            //    }
            //    else {      //case line item == 'item'
            //        var itemCount = rec.getLineItemCount('item');
            //        counter = itemCount;
            //    }
            //}

            //var changeFlag = false;
            //alert(type);
            if (type == 'item') {// line item type == 'item'

                var item = nlapiGetCurrentLineItemValue(type, 'item');// get the actual item record
                if (item != null && item != undefined && item != '') {
                    if (nlapiGetRecordType() == 'invoice' || nlapiGetRecordType() == 'creditmemo' || nlapiGetRecordType() == 'cashsale' || nlapiGetRecordType() == 'cashrefund') {
                        account = nlapiLookupField('item', item, 'incomeaccount');// test item's income account
                        nlapiLogExecution('debug', 'item type: ', 'income account:' + account);
                    }
                    else {
                        if (nlapiGetRecordType() == 'purchaseorder') {
                            account = nlapiGetCurrentLineItemValue('item', 'custcol_income_account');
                            nlapiLogExecution('debug', 'PO - item type: item', 'expense account:' + account);
                        }
                        else {
                            account = nlapiLookupField('item', item, 'expenseaccount');// test item's expense account
                            nlapiLogExecution('debug', 'item type: ', 'expense account:' + account);
                        }
                    }
                }
                else {
                    nlapiLogExecution('debug', 'no item inserted: ', 'item type: item');// no item selected while "Add" pressed
                    var endtime = new Date;
                    var diffInMillies = Math.abs(start.getTime() - endtime.getTime());
                    nlapiLogExecution('debug', 'Exexution time in seconds: ', diffInMillies / 1000);
                    return true;
                }
            }
            else if (type == 'expense') {// line item type == 'expense'
                if (nlapiGetRecordType() == 'expensereport') {
                    var category = nlapiGetCurrentLineItemValue(type, 'category');
                    if (category != null && category != undefined && category != '') {
                        account = nlapiLookupField("expensecategory", category, 'account');// test category's expense account
                    }
                    else {
                        nlapiLogExecution('debug', 'no category inserted: ', 'item type: expense');// no category selected while "Add" pressed
                        var endtime = new Date;
                        var diffInMillies = Math.abs(start.getTime() - endtime.getTime());
                        nlapiLogExecution('debug', 'Exexution time in seconds: ', diffInMillies / 1000);
                        return true;
                    }
                }
                else {
                    account = nlapiGetCurrentLineItemValue(type, 'account');// no expensereport trx- tested account from the line
                }
            }
            else if (type == 'line') {// line item type == 'line'
                if (nlapiGetRecordType() == 'journalentry' || nlapiGetRecordType() == 'advintercompanyjournalentry') {//journalentry trx- tested account from the line
                    account = nlapiGetCurrentLineItemValue(type, 'account');
                    //alert(account)
                }
                else {
                    var item = nlapiGetCurrentLineItemValue(type, 'item');
                    if (item != null && item != undefined && item != '') {
                        account = nlapiLookupField('item', item, 'expenseaccount');//no journalentry trx - tested expense account from the item record
                    }
                    else {
                        nlapiLogExecution('debug', 'no item inserted: ', 'item type: line');
                        var endtime = new Date;
                        var diffInMillies = Math.abs(start.getTime() - endtime.getTime());
                        nlapiLogExecution('debug', 'Exexution time in seconds: ', diffInMillies / 1000);
                        return true;
                    }
                }
            }
            var rec = nlapiLoadRecord('account', account);
            nlapiLogExecution('debug', 'account id: ', account);

            var classification = nlapiLookupField('account', account, 'custrecord_account_classification');
            var department = nlapiGetCurrentLineItemValue(type, 'department'); // get Department from line level
            if (department != '' && department != null && department != undefined) {
                nlapiLogExecution('debug', 'department from line: ', department);
                mainDep = department;// if line level department exist - overwrite head level department
            }

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
                                nlapiSetCurrentLineItemValue(type, 'department', '461'); // set up dummy department
                            }
                            else {// role does not allow equity
                                //allow = search_combination(account, mainDep);
                                nlapiLogExecution('debug', 'account restricted and role does not allow:', 'no combination check  ');
                                //prevent wrong combination  MSG- 'current role cannot access qeuity account'
                            }
                        }
                        else { // account type is not restricted
                            nlapiLogExecution('debug', 'account type is not restricted: ', 'dummy department');
                            if (nlapiGetCurrentLineItemValue(type, 'department') != '461') {
                                alert('Balance sheet account can only combined with Dummy department');
                                nlapiSetCurrentLineItemValue(type, 'department', '461'); // set up dummy department
                            }
                        }
                    }

                    else { // account is balance sheet trx not journal
                        nlapiLogExecution('debug', 'account is balance sheet trx not journal ', 'dummy department');
                        nlapiSetCurrentLineItemValue(type, 'department', '461'); // set up dummy department
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
                var parentAccount = rec.getFieldValue('parent');
                if (parentAccount != null && parentAccount != undefined) {
                    nlapiLogExecution('debug', 'parentAccount id: ', parentAccount);
                    account = parentAccount;
                }
                allow = search_combination(account, mainDep);
                nlapiLogExecution('debug', 'account is not balance sheet ', 'combination: ' + allow);
            }
            if (restrictFlag) {//!allow &&
                var endtime = new Date;
                var diffInMillies = Math.abs(start.getTime() - endtime.getTime());
                nlapiLogExecution('debug', 'Exexution time in seconds: ', diffInMillies / 1000);
                alert('Current role cannot access restricted account');
                return false;
            }
            if (allow) {
                var accName = nlapiLookupField('account', account, 'name');
                if (mainDep != null && mainDep != undefined && mainDep != '') {
                    var depName = nlapiLookupField('department', mainDep, 'name');
                    //alert('account:' + accName + ' (and its sub accounts) and Department: ' + depName + 'is a valid combination ');
                }
                var endtime = new Date;
                var diffInMillies = Math.abs(start.getTime() - endtime.getTime());
                nlapiLogExecution('debug', 'Exexution time in seconds: ', diffInMillies / 1000);
                return true;
            }
            else {
                var accName = nlapiLookupField('account', account, 'name');
                if (mainDep != null && mainDep != undefined && mainDep != '') {
                    var depName = nlapiLookupField('department', mainDep, 'name');
                    var endtime = new Date;
                    var diffInMillies = Math.abs(start.getTime() - endtime.getTime());
                    nlapiLogExecution('debug', 'Exexution time in seconds: ', diffInMillies / 1000);
                    alert('account:' + accName + ' (and its sub accounts) and Department: ' + depName + ' are not valid combination ');
                    return false;
                }
                else {
                    var endtime = new Date;
                    var diffInMillies = Math.abs(start.getTime() - endtime.getTime());
                    nlapiLogExecution('debug', 'Exexution time in seconds: ', diffInMillies / 1000);
                    alert('account:' + accName + ' (and its sub accounts) and No Department are not valid combination ');
                    return false;
                }

            }

            //for (var i = 1; i <= counter; i++) {        // Loop through each of the items in the sublist
            //    var department = rec.getLineItemValue(itemType, 'department', i); // get Department from line level
            //    if (department != '' && department != null && department != undefined) {
            //        mainDep = department;
            //    }

            //    //var itype = rec.getLineItemValue(itemType, 'itemtype', i); // Get the item type
            //    //var Id = rec.getLineItemValue(itemType, 'item', i);
            //    //var recordtype = '';

            //    //switch (itype) {   // Compare item type to its record type counterpart
            //    //    case 'InvtPart':
            //    //        recordtype = 'inventoryitem';
            //    //        break;
            //    //    case 'NonInvtPart':
            //    //        recordtype = 'noninventoryitem';
            //    //        break;
            //    //    case 'Service':
            //    //        recordtype = 'serviceitem';
            //    //        break;
            //    //    case 'Assembly':
            //    //        recordtype = 'assemblyitem';
            //    //        break;
            //    //    case 'GiftCert':
            //    //        recordtype = 'giftcertificateitem';
            //    //        break;
            //    //    default:
            //    //}

            //    if ((recordtype == 'noninventoryitem' && transType == 'purchaseorder') || transType != 'purchaseorder') {
            //        if (expanseFlag) {//case line item == 'expense'
            //            if (transType == 'expensereport') {//case transaction type = expense report, getting expense account from expense category
            //                var category = rec.getLineItemValue('expense', 'category', i);
            //                account = nlapiLookupField("expensecategory", category, 'account');
            //            }
            //            else {//  getting expense account from inline value
            //                account = rec.getLineItemValue('expense', 'account', i);
            //            }
            //        }
            //        else {
            //            if (journalFlag) {
            //                account = rec.getLineItemValue('line', 'account', i);
            //            }
            //            else {//getting expense account from item entity
            //                account = nlapiLookupField(recordtype, Id, 'expenseaccount');
            //            }
            //        }

            //        var classification = nlapiLookupField('account', account, 'custrecord_account_classification'); 

            //        if (classification == 'balance sheet') { 
            //            if (nlapiGetRecordType() == "journalentry") {
            //                var accType = nlapiLookupField('account', account, 'accttype');
            //                if (accType == 'Equity') {
            //                    var equFlag = nlapiLookupField('role', context.role, 'custrecord_allow_equity_journals');
            //                    if (equFlag == 'T') { // role alloed equity
            //                        rec.setLineItemValue(itemType, 'department', i, '461'); // set up dummy department
            //                    }
            //                    else {// role does not allow equity
            //                        allow = search_combination(account, mainDep);
            //                        //prevent wrong combination
            //                    }
            //                }
            //                else { // account type is not Equity
            //                    rec.setLineItemValue(itemType, 'department', i, '461'); // set up dummy department
            //                }
            //            }
            //            else { // account is balance sheet trx not journal
            //                rec.setLineItemValue(itemType, 'department', i, '461'); // set up dummy department
            //            }
            //        }
            //        else { // account is not balance sheet
            //            allow = search_combination(account, mainDep);
            //        }

            //        return true;
            //    }
            //    else {
            //        return true;
            //    }
            //}
            var endtime = new Date;
            var diffInMillies = Math.abs(start.getTime() - endtime.getTime());
            nlapiLogExecution('debug', 'Exexution time in seconds: ', diffInMillies / 1000);
            return true;
        }
        else {
            var endtime = new Date;
            var diffInMillies = Math.abs(start.getTime() - endtime.getTime());
            nlapiLogExecution('debug', 'Exexution time in seconds: ', diffInMillies / 1000);
            //alert('else')
            return true;
        }
    }
}


//******************************************************************
function ValidateField(type, name) {
    nlapiLogExecution('debug', 'function ValidateField ', 'name= ' + name + ' rectype = ' + nlapiGetRecordType());
    if (name == 'account' && nlapiGetRecordType() == "customerdeposit") {
        nlapiLogExecution('debug', 'function ValidateField ', 'name= ' + name + ' rectype = ' + nlapiGetRecordType());
        //alert('enter')
        var counter = 0;
        var itemType = 'item';
        var account;
        var expanseFlag = false;
        var journalFlag = false;
        var allow = true;
        var restrictFlag = false;

        var mainDep = nlapiGetFieldValue('department');
        nlapiLogExecution('debug', 'department from header: ', mainDep);


        //var roleExclude = nlapiLookupField('role', context.role, 'custrecord_exclude_from_rrc');

        var rolesExclude = nlapiLookupField('customrecord_role_mgmt_cust_dprt_validat', 1, 'custrecord_roles_exclude_from_validation');
        var isExclude = rolesExclude.indexOf(context.role);

        var roleAllow = nlapiLookupField('customrecord_role_mgmt_cust_dprt_validat', 1, 'custrecord_allow_access_restricted_acc');
        var isAllow = roleAllow.indexOf(context.role);

        if (context.roleid != 'administrator' && isExclude == -1) { // if role is not admin and not exclude from restriction   //&& roleExclude != 'T'


            //*******************************  for deposit *********************
            /*
            if (type == 'item') {
    
                var item = nlapiGetCurrentLineItemValue(type, 'item');
                if (item != null && item != undefined && item != '') {
                    if (nlapiGetRecordType() == 'invoice' || nlapiGetRecordType() == 'creditmemo' || nlapiGetRecordType() == 'cashsale' || nlapiGetRecordType() == 'cashrefund') {
                        account = nlapiLookupField('item', item, 'incomeaccount');
                        nlapiLogExecution('debug', 'item type: ', 'income account:' + account);
                    }
                    else {
                        account = nlapiLookupField('item', item, 'expenseaccount');
                        nlapiLogExecution('debug', 'item type: ', 'expense account:' + account);
                    }
                }
                else {
                    nlapiLogExecution('debug', 'no item inserted: ', 'item type: item');
                    return true;
                }
            }
            else if (type == 'expense') {
                if (nlapiGetRecordType() == 'expensereport') {
                    var category = nlapiGetCurrentLineItemValue(type, 'category');
                    if (category != null && category != undefined && category != '') {
                        account = nlapiLookupField("expensecategory", category, 'account');
                    }
                    else {
                        nlapiLogExecution('debug', 'no category inserted: ', 'item type: expense');
                        return true;
                    }
                }
                else {
                    account = nlapiGetCurrentLineItemValue(type, 'account');
                }
            }
            else if (type == 'line') {
                if (nlapiGetRecordType() == 'journalentry' || nlapiGetRecordType() == 'advintercompanyjournalentry' ) {
                    account = nlapiGetCurrentLineItemValue(type, 'account');
                    //alert(account)
                }
                else {
                    var item = nlapiGetCurrentLineItemValue(type, 'item');
                    if (item != null && item != undefined && item != '') {
                        account = nlapiLookupField('item', item, 'expenseaccount');
                    }
                    else {
                        nlapiLogExecution('debug', 'no item inserted: ', 'item type: line');
                        return true;
                    }
                }
            }
            */

            account = nlapiGetFieldValue('account');
            if (account != "" && account != undefined && account != null) {
                var rec = nlapiLoadRecord('account', account);
                nlapiLogExecution('debug', 'account id: ', account);

                var classification = nlapiLookupField('account', account, 'custrecord_account_classification');

                /*var department = nlapiGetCurrentLineItemValue(type, 'department'); // get Department from line level
                if (department != '' && department != null && department != undefined) {
                    nlapiLogExecution('debug', 'department from line: ', department);
                    mainDep = department;
                }*/

                if (classification == '2') {
                    var accType = nlapiLookupField('account', account, 'type');
                    if (accType != 'FixedAsset') {
                        nlapiLogExecution('debug', 'account type: ', 'balance sheet');
                        // account is balance sheet trx not journal
                        nlapiLogExecution('debug', 'account is balance sheet trx not journal ', 'dummy department');
                        nlapiSetFieldValue("department", "461") // set up dummy department
                        var accRestricted = nlapiLookupField('account', account, 'custrecord_restricted_for_manual_je')
                        if (accRestricted == 'T' && (nlapiGetRecordType() == "vendorbill" || nlapiGetRecordType() == "vendorcredit" || nlapiGetRecordType() == "purchaseorder")) {
                            if (accType == "Equity")
                                restrictFlag = true;
                        }
                    }
                    else {
                        allow = search_combination(account, mainDep);
                        nlapiLogExecution('debug', 'account is balance sheet && fixed asset ', 'combination: ' + allow);
                    }
                }
                else { // account is not balance sheet
                    var parentAccount = rec.getFieldValue('parent');
                    if (parentAccount != null && parentAccount != undefined && parentAccount != '') {
                        nlapiLogExecution('debug', 'parentAccount id: ', parentAccount);
                        account = parentAccount;
                    }
                    allow = search_combination(account, mainDep);
                    nlapiLogExecution('debug', 'account is not balance sheet ', 'combination: ' + allow);
                }
            }
            else {
                return true;
            }
            if (restrictFlag) {//!allow &&
                alert('Current role cannot access restricted account');
                return false;
            }
            if (allow) {
                var accName = nlapiLookupField('account', account, 'name');
                if (mainDep != null && mainDep != undefined && mainDep != '') {
                    var depName = nlapiLookupField('department', mainDep, 'name');
                    //alert('account:' + accName + ' (and its sub accounts) and Department: ' + depName + 'is a valid combination ');
                }
                return true;
            }
            else {
                var accName = nlapiLookupField('account', account, 'name');
                if (mainDep != null && mainDep != undefined && mainDep != '') {
                    var depName = nlapiLookupField('department', mainDep, 'name');
                    alert('account:' + accName + ' (and its sub accounts) and Department: ' + depName + ' are not valid combination ');
                    return false;
                }
                else {
                    alert('account:' + accName + ' (and its sub accounts) and No Department are not valid combination ');
                    return false;
                }

            }

            return true;
        }
        else {
            //alert('else')
            return true;
        }
    }
}
//********************************************************************************************




function search_combination(acc, dep) {

    console.log('acc: ' + acc);
    console.log('dep: ' + dep);

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    var search = nlapiCreateSearch('customrecord_se_role_restriction_comb', null, null);

    search.addFilter(new nlobjSearchFilter('custrecord_rrc_account', null, 'is', acc));
    search.addFilter(new nlobjSearchFilter('custrecord_rrc_all_departments', null, 'is', "T"));
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
        if (dep != '' && dep != null && dep != undefined) {
            search = nlapiCreateSearch('customrecord_se_role_restriction_comb', null, null);
            search.addFilter(new nlobjSearchFilter('custrecord_rrc_account', null, 'is', acc));
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
        else {
            nlapiLogExecution('debug', 'no all department flag on custom rec for acc: ' + acc, 'no departement inserted ');
            return false;
        }
    }
}





//var context = nlapiGetContext().getExecutionContext()

//context == 'suitelet'