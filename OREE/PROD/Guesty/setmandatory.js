function setmandatory() {
    var val = nlapiGetCurrentLineItemValue('line', 'account');
    if (val == '' || val == null || val == undefined) {
        var rec = nlapiLoadRecord('account', val);
        var acctype = rec.getFieldValue('accttype');

        if (acctype == 'Expense' || acctype == 'Income' || acctype == 'OthExpense' || acctype == 'OthIncome' || acctype == 'Cogs') {
            var siteVal = nlapiGetCurrentLineItemValue('line', 'cseg_site');
            if (siteVal == '' || siteVal == null || siteVal == undefined) {
                nlapiLogExecution('DEBUG', 'site is empty, acc type:  ', acctype);
                alert('The field \'site\' is mandatory for account type ' + acctype);
                return false;
            }
            else {
                //alert('desc is full ');
                nlapiLogExecution('DEBUG', 'site is okey, acc type:  ', acctype);
                return true;
            }
        }
    }
    nlapiLogExecution('DEBUG', 'site is not mandatory, acc type:  ', acctype);
    return true;
}