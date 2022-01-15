function checkFieldsChanges(type) {
    try {
        if (type == 'edit' ) {
            var newRec = nlapiGetNewRecord();         
            var approved = newRec.getFieldValue('custbody_approved_transaction');         
            if (approved == 1) {
                var oldRec = nlapiGetOldRecord();
                var newRecTotal = newRec.getFieldValue('usertotal');
                var oldRecTotal = oldRec.getFieldValue('usertotal');
                if (oldRecTotal != newRecTotal) {
                    updateRec();
                    return;
                }
                var newRecapproved_by = newRec.getFieldValue('custbody_approved_by');
                var oldRecapproved_by = oldRec.getFieldValue('custbody_approved_by');
                if (newRecapproved_by != oldRecapproved_by) {
                    updateRec();
                    return;
                }
                var newRecCount = newRec.getLineItemCount('expense');
                var oldRecCount = oldRec.getLineItemCount('expense');             
                if (newRecCount != oldRecCount) {
                    updateRec();
                    return;
                }
                for (var i = 1; i <= newRecCount; i++) {
                    var newRecaccount = newRec.getLineItemValue('expense', 'account', i);
                    var oldRecaccount = oldRec.getLineItemValue('expense', 'account', i);    
                    if (newRecaccount != oldRecaccount) {
                        updateRec();
                        return;
                    }
                    var newRecdepartment = newRec.getLineItemValue('expense', 'department', i);
                    var oldRecdepartment = oldRec.getLineItemValue('expense', 'department', i);
                    if (newRecdepartment != oldRecdepartment) {
                        updateRec();
                        return;
                    }
                }
            }
        }
      
    } catch (e) { }
}

function updateRec() {
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());  
    rec.setFieldValue('custbody_approved_transaction', '');
    nlapiSubmitRecord(rec);

}