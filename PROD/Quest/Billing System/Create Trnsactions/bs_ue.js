function afterSubmit(type) {
    try {      
        var recId = nlapiGetRecordId()
        var rec = nlapiLoadRecord('invoice', recId)
        var agr = rec.getFieldValue('custbody_agreement');
        if (!isNullOrEmpty(agr)) {
            try { nlapiScheduleScript('customscript_bs_ss', null, { custscript_bp_ss_id: recId }) } catch (e) { }

        }                                   
    } catch (e) {
        nlapiLogExecution('ERROR', 'error afterSubmit', e);
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

