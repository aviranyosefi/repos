function redirect_with_params() {
    var context = nlapiGetContext();
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    nlapiLogExecution('debug', ' nlapiGetRecordId()', nlapiGetRecordId());
    var suiteletid = context.getSetting('SCRIPT', 'custscript_suitelet_id');
    var depid = context.getSetting('SCRIPT', 'custscript_suitelet_dep_id');
    var params = { RecId: nlapiGetRecordId() }
    nlapiLogExecution('debug', ' custscript_suitelet_id', suiteletid);
    nlapiLogExecution('debug', ' params', params);
    nlapiSetRedirectURL('SUITELET', suiteletid, depid, null, params);
}