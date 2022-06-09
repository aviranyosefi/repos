var context = nlapiGetContext();
function afterSubmitSS(recId) {
    try {
        var rec = nlapiLoadRecord('invoice', recId)
        var count = rec.getLineItemCount('item');
        for (var i = 1; i <= count; i++) {
            checkContext(context)
            var bs_bp = rec.getLineItemValue('item', 'custcol_bs_bp', i);
            if (!isNullOrEmpty(bs_bp)) {
                nlapiSubmitField('customrecord_bp', bs_bp, 'custrecord_bp_invoice_on', recId);
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
