function aftersubmit() {
    var itemType = 'item';
    var amount = 0;
    var billRate = 0;
    var qty = 0;
    var billRec = nlapiLoadRecord('vendorbill', nlapiGetRecordId());
    
    var lineCount = billRec.getLineItemCount('expense');
    if (lineCount > 0) {     //case line item == 'expense'
        itemType = 'expense';
    }
    else {
        lineCount = billRec.getLineItemCount('item');  
    }

    for (i = 1; i <= lineCount; i++) {
        try {
            amount = billRec.getLineItemValue(itemType, 'amount', i);
            qty = billRec.getLineItemValue(itemType, 'quantity', i);
            if (!isNullOrEmptyOrZero(amount) && !isNullOrEmptyOrZero(qty)) {
                billRate = (parseFloat(amount) / parseFloat(qty)).toFixed(3);
                billRec.setLineItemValue(itemType, 'rate', i, billRate);
                nlapiLogExecution('debug', 'bill: '+billRec.id+' line: ' + i, 'rate: '+ billRate);
            }
        } catch (e) {
            nlapiLogExecution('debug', 'error with line: ', i);
            nlapiLogExecution('debug', 'exception:  ', e);
            continue;
        }
    }

    var submition = nlapiSubmitRecord(billRec, null, true);

    if (!isNullOrEmptyOrZero(submition)) {
        var poList = searchBills(submition);
        var itrRec = null;
        if (poList.length > 0) {
            var sortedPoList = sort(poList);
            for (i = 0; i < sortedPoList.length; i++) {
                try {
                    var poLines = sortedPoList[i].lines.split(',');
                    var billLinerates = sortedPoList[i].rates.split(',');
                    var itrList = searchPos(sortedPoList[i].purchase_order);
                    var curItrId = '0';
                    for (y = 0; y < itrList.length; y++) {
                        if (curItrId != itrList[y].itrId) {
                            itrRec = nlapiLoadRecord('itemreceipt', itrList[y].itrId);
                            nlapiLogExecution('debug', ' Load Record - tranID: ' + itrList[y].itrId, ' type: itemreceipt');
                            var itemCount = itrRec.getLineItemCount('item');
                        }
                        var postingPeriod = itrRec.getFieldValue('postingperiod');

                        if (!isNullOrEmptyOrZero(postingPeriod)) {
                            if (nlapiLookupField('accountingperiod', postingPeriod, 'closed') == 'T') {
                                nlapiLogExecution('debug', 'accounting period is closed', 'itemreceipt Id: ' + itrList[y].itrId);
                                continue;
                            }
                        }
                        if (itemCount > 0) {
                            for (x = 1; x <= itemCount; x++) {
                                for (j = 0; j < poLines.length; j++) {
                                    if (itrRec.getLineItemValue('item', 'orderline', x) == poLines[j]) {
                                        itrRec.setLineItemValue('item', 'rate', x, billLinerates[j]);
                                        if (((y + 1) == itrList.length) || (itrList[y + 1].itrId != curItrId)) {
                                            var submitedItr = nlapiSubmitRecord(itrRec);
                                            nlapiLogExecution('debug', 'Submittion-ITR ID: ' + submitedItr, 'line: ' + poLines[j] + ',bill line rate: ' + billLinerates[j]);
                                        }
                                        else {
                                            nlapiLogExecution('debug', 'Update-ITR ID: ' + submitedItr, 'line: ' + poLines[j] + ',bill line rate: ' + billLinerates[j]);
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            nlapiLogExecution('debug', 'item count is equal or less then zero ', '');
                        }
                        curItrId = itrList[y].itrId;
                    }
                } catch (e) {
                    nlapiLogExecution('debug', 'error with ITR rec: ', itrList[y].itrId);
                    nlapiLogExecution('debug', 'exception:  ', e);
                    continue;
                }
            }
        }
    }
    

}

function isNullOrEmptyOrZero(val) {

    if (typeof (val) == 'undefined' || val == null || parseFloat(val) == 0 || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function searchBills(billId) {
    var filters = new Array();
    var s = [];
    var result = [];
    var searchid = 0;
    var columns = new Array();

    var search = nlapiLoadSearch(null, 'customsearch340');
    if (!isNullOrEmptyOrZero(billId)) {
        search.addFilter(new nlobjSearchFilter('internalid', null, 'anyof', billId));
    }

    var runSearch = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s.length > 0) {
        for (var i = 0; i < s.length; i++) {
            result.push({
                poId: s[i].getValue("internalid", "appliedToTransaction", null),
                poLine: s[i].getValue("line", "appliedToTransaction", null),
                BillLineRate: s[i].getValue('rate'),
            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach bill result ', JSON.stringify(result));
    return result;

/*
    tranId: s[i].getValue('tranid'),
tranInternalId: s[i].getValue('internalid'),
line: s[i].getValue('line'),
item: s[i].getValue('item'),
rate: s[i].getValue('rate'),
appliedTo: s[i].getText('appliedtotransaction'),
*/
}

function searchPos(poId) {
    var filters = new Array();
    var s = [];
    var result = [];
    var searchid = 0;
    var columns = new Array();

    var search = nlapiLoadSearch(null, 'customsearch341');
    if (!isNullOrEmptyOrZero(poId)) {
        search.addFilter(new nlobjSearchFilter('internalid', 'appliedtotransaction', 'anyof', poId));
    }

    var runSearch = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s.length > 0) {
        for (var i = 0; i < s.length; i++) {
            result.push({
                itrId: s[i].getValue("internalid", null, null),
                itrLine: s[i].getValue("line", null, null),
                itrLineRate: s[i].getValue("rate", null, null),
            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach po result ', JSON.stringify(result));
    return result;

}

function sort(poList) {
    poList.sort(function (a, b) {
        return a.poId - b.poId;
    });

    var count = 0;
    var curr_po;
    var ratesArr = '';
    var array = '';
    var poList_sorted = [];

    for (var i = 0; i < poList.length; i++) {

        if (i == 0) {
            count += 1;
            array += poList[i].poLine;
            ratesArr += poList[i].BillLineRate;
        }
        else if (curr_po == poList[i].poId) {
            count += 1;
            array += ',' + poList[i].poLine;
            ratesArr += ',' + poList[i].BillLineRate;
        }
        else {
            poList_sorted.push({
                purchase_order: curr_po,
                countt: count,
                lines: array,
                rates: ratesArr,
            });
            array = poList[i].poLine;
            ratesArr = poList[i].BillLineRate; 
            count = 1;
        }

        curr_po = poList[i].poId;

    }
    poList_sorted.push({
        purchase_order: curr_po,
        countt: count,
        lines: array,
        rates: ratesArr,
    });

    nlapiLogExecution('DEBUG', 'Be_To_Invoice_Sort', JSON.stringify(poList_sorted));

    return poList_sorted;

}