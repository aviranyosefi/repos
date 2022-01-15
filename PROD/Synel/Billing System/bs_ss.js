var context = nlapiGetContext();
function afterSubmitSS() {
    try {
        var recId = context.getSetting('SCRIPT', 'custscript_bs_ss_id');
        nlapiLogExecution('debug', 'recId', recId);
        var rec = nlapiLoadRecord('invoice', recId)
        var count = rec.getLineItemCount('item');
        for (var i = 1; i <= count; i++) {
            checkContext(context)
            var bpId = rec.getLineItemValue('item', 'custcol_bill_plan', i);
            if (!isNullOrEmpty(bpId)) {
                nlapiSubmitField('customrecord_billing_plan', bpId, 'custrecord_bill_plan_inv_on', recId);
            }
        }
        nlapiSubmitRecord(rec, null, true);        
    } catch (e) {
        nlapiLogExecution('ERROR', 'error afterSubmitSS', e);
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function checkContext(context) {
    if (context.getRemainingUsage() < 150) {
        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }
}
