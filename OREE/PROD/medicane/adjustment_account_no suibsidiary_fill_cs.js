// JavaScript source code
function fieldchangePost(type, name) {
    if ((name == 'subsidiary') && !isNullOrEmpty(nlapiGetFieldValue('custbody_adjustment_reason')) && !isNullOrEmpty(nlapiGetFieldValue('subsidiary'))) {
        var reason = nlapiGetFieldValue('custbody_adjustment_reason');
        //var subsidiary = nlapiGetFieldValue('subsidiary');
        var acc = search_account(reason,1);
        if (acc != -1) {
            nlapiSetFieldValue('account', acc);
            nlapiLogExecution('debug', 'reason: ' + reason, 'acc: ' + acc + ' sub: ' + nlapiGetFieldValue('subsidiary'));
            if (nlapiGetFieldValue('account') == '' || nlapiGetFieldValue('account') == undefined) {
                alert('The selected subsidiary does not include the chosen account (id: ' + acc +')');
            }
        }
        else {
            nlapiLogExecution('debug', 'no custom record for the reason', reason);
            alert('there is no custom record for the selected adjustment reason');
        }
    }

}

function fieldchange(type, name) {
    if ((name == 'custbody_adjustment_reason') && !isNullOrEmpty(nlapiGetFieldValue('custbody_adjustment_reason')) && !isNullOrEmpty(nlapiGetFieldValue('subsidiary'))) {
        var reason = nlapiGetFieldValue('custbody_adjustment_reason');
        //var subsidiary = nlapiGetFieldValue('subsidiary');
        var acc = search_account(reason,1);
        if (acc != -1) {
            nlapiSetFieldValue('account', acc);
            nlapiLogExecution('debug', 'reason: ' + reason, 'acc: ' + acc + ' sub: ' + nlapiGetFieldValue('subsidiary'));
            if (nlapiGetFieldValue('account') == '' || nlapiGetFieldValue('account') == undefined) {
                alert('The selected subsidiary does not include the chosen account (id: ' + acc + ')');
            }
        }
        else {
            nlapiLogExecution('debug', 'no custom record for the reason', reason);
            alert('there is no custom record for the selected adjustment reason');
        }
    }

}

function search_account(reason,mode) {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord13');
    columns[1] = new nlobjSearchColumn('custrecord12');
    columns[2] = new nlobjSearchColumn('custrecord_positive_negative_qty');
    

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord12', null, 'anyof', reason);
    //filters[1] = new nlobjSearchFilter('custrecord18', null, 'anyof', subsidiary);

    var search = nlapiCreateSearch('customrecord_adjustment_reasons', filters, columns);

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

    if (s.length > 0) {
        if (mode == 1) {
            return s[0].getValue('custrecord13');
        }
        else {
            return s[0].getValue('custrecord_positive_negative_qty');
        }
    }
    else {
        return -1;
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function ValidateLines(type, name) {
    var reason = nlapiGetFieldValue('custbody_adjustment_reason');
    //var subsidiary = nlapiGetFieldValue('subsidiary');
    if (!isNullOrEmpty(reason)) {
        var sign = search_account(reason, 2);
        if (sign != -1) {
            var adjustBy = nlapiGetCurrentLineItemValue(type, 'adjustqtyby');
            if (sign == 2) {
                if (parseInt(adjustBy) > 0) {
                    alert('The Qty adjusts has to be negetive for the reason: ' + nlapiGetFieldText('custbody_adjustment_reason'));
                    return false;
                }
                else {
                    return true;
                }
            }
            else if (sign == 1) {
                if (parseInt(adjustBy) < 0) {
                    alert('The Qty adjusts has to be positive for the reason: ' + nlapiGetFieldText('custbody_adjustment_reason'));
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return true;
            }
        }
        return true;
    }
    else {
        alert('please enter values for Adjusnment Reason fields first');
        return false;
    }
}