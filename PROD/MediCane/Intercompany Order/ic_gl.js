function customizeGlImpact(transactionRecord, standardLines, customLines, book) {
    try {
        var recType = transactionRecord.getRecordType();
        nlapiLogExecution('debug', 'recType: ' + recType, '');
        if (book.isPrimary()) {

        }
        var createdfrom = transactionRecord.getFieldValue('createdfrom');
        if (!isNullOrEmpty(createdfrom)) {
            var SOrec = nlapiLoadRecord('salesorder', createdfrom);
            var ic_source_tran = SOrec.getFieldValue('intercotransaction');
            if (!isNullOrEmpty(ic_source_tran)) {
                for (var line = 0; line < standardLines.getCount(); line++) {
                    var currLine = standardLines.getLine(line);
                    var account = currLine.getAccountId();
                    var accttype = getAccountType(account)
                    if (accttype == 'Income') {
                        nlapiLogExecution('debug', 'account: ' + account, 'accttype: ' + accttype);
                        var CreditAmount = currLine.getCreditAmount();
                        if (CreditAmount != 0) {
                            nlapiLogExecution('debug', 'CreditAmount: ', CreditAmount);
                            var newLine = customLines.addNewLine();
                            newLine.setDebitAmount(CreditAmount);
                            newLine.setAccountId(account);
                            nlapiLogExecution('debug', 'newLine: ', 'newLine');
                            var newLine = customLines.addNewLine();
                            newLine.setCreditAmount(CreditAmount);
                            var ICaccount = getICaccount()
                            nlapiLogExecution('debug', 'ICaccount: ', ICaccount);
                            newLine.setAccountId(parseInt(ICaccount));
                            nlapiLogExecution('debug', 'newLine2: ', 'newLine2');
                            return;
                        }
                    }
                }
            }
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'ERROR:', e);
    }
}
function getAccountType(account) {
    var rec = nlapiLoadRecord('account', account);
    return rec.getFieldValue('accttype');
}
function getICaccount() {
    var account = nlapiLookupField('customrecord196', 1, 'custrecord_income_account')
    return account
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
