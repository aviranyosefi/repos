function setAssignedGroup() {
    try {
        var context = nlapiGetContext();
        var assigned_to = context.getSetting('SCRIPT', 'custscript_assigned_to');
        nlapiLogExecution('DEBUG', ' Assigned To: ', assigned_to);
        //var recID = nlapiGetRecordId();
        //var rec = nlapiLoadRecord('supportcase', recID);
        nlapiLogExecution('DEBUG', '', 'recID: ' + recID);
        if (!isNullOrEmpty(assigned_to)) {
            nlapiSetFieldValue('assigned', assigned_to);
            //nlapiSubmitRecord(rec);
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

