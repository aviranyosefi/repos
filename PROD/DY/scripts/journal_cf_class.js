var msg = '';
var message = 'Please enter value to CF CLASSIFICATION Field.\n';
function SaveRecordCf() {
    debugger;
    var lines = nlapiGetLineItemCount('line');
    for (var i = 1; i <= lines; i++) {
        nlapiGetContext().getRemainingUsage = function () { return 1000; }
        var account = nlapiGetLineItemValue('line', 'account', i)
        var accountType = nlapiLookupField('account', account, 'type');
        var custrecord_bank_account_for_cf = nlapiLookupField('account', account, 'custrecord_bank_account_for_cf');
        if (accountType == 'Bank' && custrecord_bank_account_for_cf == 'T') {
            for (var j = 1; j <= lines; j++) {
                if (j != i) {
                    var accountLine = nlapiGetLineItemValue('line', 'account', j);
                    var custcol_cf_classification = nlapiGetLineItemValue('line', 'custcol_cf_classification', j);
                    if (isNullOrEmpty(custcol_cf_classification)) {
                        var cf_classification = nlapiLookupField('account', accountLine, 'custrecord_default_cf_classification');
                        var accountTypeLine = nlapiLookupField('account', accountLine, 'type');
                        var accountLine_bank_account_for_cf = nlapiLookupField('account', accountLine, 'custrecord_bank_account_for_cf');
                        if (!isNullOrEmpty(cf_classification)) {
                            nlapiSelectLineItem('line', j)
                            nlapiSetCurrentLineItemValue('line', 'custcol_cf_classification', cf_classification);
                            nlapiCommitLineItem('line');

                        }
                        else if (accountLine_bank_account_for_cf == 'T' && accountTypeLine == 'Bank' && isNullOrEmpty(cf_classification)) { }
                        else {
                            var accountLineName = nlapiGetLineItemText('line', 'account', j);
                            nlapiSetLineItemDisabled('line', 'custcol_cf_classification', false, j);
                            addLine(accountLineName, j);
                        }
                    }
                }

            } // for (var j = 1; j <= lines; j++)

        } // if (accountType == 'Bank')

    }
    if (msg != '') {
        alert(message + msg);
        msg = '';
        return false;
    }

    return true;
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function addLine(item, i) {
    msg += 'Line:' + i + '  Account: ' + item + '\n';
}