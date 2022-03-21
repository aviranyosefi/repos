/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Dec 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function tran_SaveRecord() {

    var tran_type = nlapiGetRecordType();
    
    var checkBookSpecific = nlapiGetFieldValue('isbookspecific');
    nlapiLogExecution('debug', 'checkBookSpecific', checkBookSpecific);
    if(checkBookSpecific == 'T'){
    	return true;
    }
    
    if (tran_type == "journalentry") {
        var found = setBudget("line");
        nlapiLogExecution('debug', 'found', found)
        if (found == false){
        	nlapiSetFieldValue('trandate', 'You cannot save this Journal Entry.') 
        }
  	
    }
    else {
        setBudget("item");
        setBudget("expense");
    }
    return true;

}

function setBudget(line_type) {
    try {
        var retval = true;
        var subsidiary = nlapiGetFieldValue("subsidiary");
        var recType = nlapiGetRecordType();
        var lineItemCount = nlapiGetLineItemCount(line_type);
        for (var line = 1; line <= lineItemCount; line++) {
            var department = nlapiGetLineItemValue(line_type, 'department', line);
            var accounttype = nlapiGetLineItemValue(line_type, 'accounttype', line)
            var expenseacc = nlapiGetLineItemValue(line_type, 'custcol_ava_expenseaccount', line);
            var accountingbook = nlapiGetFieldValue('accountingbook');
            var sched = nlapiGetLineItemValue(line_type, 'schedule', line);
            var budgetclass = nlapiGetLineItemValue(line_type, 'custcol_cseg3', line);
           
            nlapiLogExecution('debug', 'recType:' + recType, 'accounttype: ' + accounttype);
            //if (budgetclass == '2') //don't update salaraies for now.
            //    continue;
            if (recType == 'journalentry' && ((accounttype != 'FixedAsset' && accounttype != 'Expense') || (accountingbook == null && sched == '1' ))) {
                nlapiSetLineItemValue('line', 'custcol_ilo_col_budget_display', line, '');
                nlapiSetLineItemValue('line', 'custcol_ilo_col_budget', line, null);
                continue;
            }
            if (budgetclass == null) //don't update salaraies for now.
                continue;


            var filters = new Array();
            filters[0] = new nlobjSearchFilter('custrecord_ilo_budget_class', null, 'anyof', budgetclass);
            //filters[1] = new nlobjSearchFilter('custrecord_ilo_budget_exp_account', null, 'anyof', expenseacc);
            filters[1] = new nlobjSearchFilter('custrecord_ilo_budget_type', null, 'is', '1');
            //if (budgetclass == '2') //salaraies
            {
                filters[2] = new nlobjSearchFilter('custrecord_ilo_budget_department', null, 'anyof', department);
                filters.push(new nlobjSearchFilter('custrecord_ilo_budget_subsidiary', null, 'anyof', subsidiary));
            }
            var searchBudgets = nlapiSearchRecord('customrecord_ilo_budget_control_record', null, filters, null);
            var budgetid = -1;
            if (searchBudgets != null && searchBudgets[0] != null) {
                budgetid = searchBudgets[0].id;
            }
            nlapiLogExecution('debug', 'budgetid', 'budgetid: ' + budgetid);
            if (budgetid != -1) {
                nlapiLogExecution('debug', 'custcol_ilo_col_budget', 'custcol_ilo_col_budget: ' + budgetid + 'line' + line);
                nlapiSetLineItemValue(line_type, 'custcol_ilo_col_budget', line, budgetid);
                // nlapiCommitLineItem(line_type);
            }
            else {
                retval = false;   
                nlapiSetLineItemValue('line', 'custcol_ilo_col_budget_display', line, '');
                nlapiSetLineItemValue('line', 'custcol_ilo_col_budget', line, null);
           
            }
        }

    }
    catch (e) {
        nlapiLogExecution('error', 'get_expense_item_id_SaveRecord', 'error: ' + e.message);
    }
    return retval;
}

function dailyupdate() {
    var results = nlapiSearchRecord('journalentry', null, [new nlobjSearchFilter('mainline', null, 'is', 'T'), new nlobjSearchFilter('custcol_cseg3', null, 'noneof', "@NONE@"), new nlobjSearchFilter('custcol_ilo_col_budget', null, 'anyof', "@NONE@"), new nlobjSearchFilter('datecreated', null, 'notbefore', 'startoflastmonth'), new nlobjSearchFilter('type', null, 'anyof', 'Journal')], [new nlobjSearchColumn('internalid', null, 'group')]);
    if (results == null)
        return;
    for (var i = 0; i < results.length; i++) {
        try
        {
            var rec = results[i];
            var jrec = nlapiLoadRecord('journalentry', rec.getValue('internalid', null, 'group'));
            nlapiSubmitRecord(jrec, { disabletriggers: false, enablesourcing: false });
        }
        catch (e) {
            nlapiLogExecution('error', 'dailyupdate', 'error: ' + e.message);

        }
    }
}