function setAssignedGroup() {
    try { 
        var context = nlapiGetContext();
        var assign_to = context.getSetting('SCRIPT', 'custscript_assign_to_opp');  
        nlapiLogExecution('debug', ' assign_to: ', assign_to);
        var recID = nlapiGetRecordId();
        var rec = nlapiLoadRecord('opportunity', recID);
        nlapiLogExecution('debug', '', 'recID: ' + recID);
        if (!isNullOrEmpty(assign_to)) {
            rec.setFieldValue('salesrep', assign_to);
            nlapiSubmitRecord(rec);
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'error',  e);
    }
    
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

