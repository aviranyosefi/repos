function aftersubmit(type) {
    nlapiLogExecution('debug', 'type is= ', type);
    var recType = nlapiGetRecordType();
    if (recType == 'itemfulfillment') {
        var rec = null;
        if (type != 'create') {
            var newRec = nlapiGetNewRecord();
            var oldRec = nlapiGetOldRecord();
            var new_status = newRec.getFieldValue('shipstatus')
            var old_status = oldRec.getFieldValue('shipstatus')
            
        }
        else {
            rec = nlapiLoadRecord('itemfulfillment', nlapiGetRecordId());
            var new_status = rec.getFieldValue('shipstatus');
            var old_status = '';
        }
        if (new_status == 'C' && (old_status != new_status)) {
            var recId = nlapiGetRecordId();
            if (rec == null) { rec = nlapiLoadRecord('itemfulfillment', nlapiGetRecordId());}
            
            if (recType != '' && recId != '' && recType != null && recId != null) {
                try {
                    var creditAmount = getGlImpact(recType, recId);
                    if (creditAmount != '' && creditAmount != null && creditAmount != undefined) {
                        creditAmount = parseInt(creditAmount).toFixed(2);
                        nlapiLogExecution('debug', 'creditAmount is= ', creditAmount);
                        rec.setLineItemValue('item', 'custcol_rma_rate', 1, creditAmount);// check what is the behavior for multiple lines
                        var IfOrderLine = rec.getLineItemValue('item', 'orderline', 1);
                        var soRec = nlapiLoadRecord('salesorder', rec.getFieldValue('createdfrom'));
                        var SoLineCount = soRec.getLineItemCount('item');
                        for (i = 1; i <= SoLineCount; i++) {
                            if (IfOrderLine == soRec.getLineItemValue('item', 'line', i)) {
                                soRec.setLineItemValue('item', 'custcol_rma_rate', i, creditAmount);
                            }
                        }
                        var soRecsubmition = nlapiSubmitRecord(soRec, null, true);
                        nlapiLogExecution('debug', 'sales order submition: ', soRecsubmition);
                        var itfRecsubmition = nlapiSubmitRecord(rec, null, true);
                        nlapiLogExecution('debug', 'item fulfillment submition: ', itfRecsubmition);
                    }
                } catch (e) {
                    nlapiLogExecution('debug', 'item fulfillment error: ', e);
                }

            }
        }
    }
    else {
        ItrRec = nlapiLoadRecord('itemreceipt', nlapiGetRecordId());
        try {
                //var IfOrderLine = nlapiGetLineItemValue('item', 'orderline', 1);
                //var soRec = nlapiLoadRecord('salesorder', nlapiGetFieldValue('createdfrom'));
                var ItrLineCount = ItrRec.getLineItemCount('item');
            for (i = 1; i <= ItrLineCount; i++) {
                    //if (IfOrderLine == soRec.nlapiGetLineItemValue('item', 'line', i)) {
                ItrRec.setLineItemValue('item', 'unitcostoverride', i, ItrRec.getLineItemValue('item', 'custcol_rma_rate', i));
                    //}
                }
                var submition = nlapiSubmitRecord(ItrRec, null, true);
            nlapiLogExecution('debug', ' item receipt submition: ', submition);
            
        } catch (e) {
            nlapiLogExecution('debug', 'item receipt error: ', e);
        }
    }

}

function getGlImpact(recordType, recordId) {
    var results = nlapiSearchRecord(recordType, null, [
        new nlobjSearchFilter('internalid', null, 'anyof', recordId)
    ], [
        new nlobjSearchColumn('number', 'account'),
        new nlobjSearchColumn('debitamount'),
        new nlobjSearchColumn('creditamount')
    ]);
    if (results != null) {
        for (i = 0; i < results.length; i++) {
            var account = results[i].getValue('number', 'account')
            if (account == '117001') {
                return results[i].getValue('creditamount');
            }
        }

        /*return (results || []).map(function(line) {
            return {
                account: line.getValue('number', 'account'),
                debit: line.getValue('debitamount'),
                credit: line.getValue('creditamount')
            };
        });*/
    }
}