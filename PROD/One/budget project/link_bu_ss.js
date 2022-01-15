var context = nlapiGetContext();
function abuCbuEditSave(){
	try{		
		var tran_id = context.getSetting('SCRIPT', 'custscript_tran_id');
		var tran_type = context.getSetting('SCRIPT', 'custscript_tran_type');		
		nlapiLogExecution('debug', 'tran_id: '+tran_id,'tran_type: '+ tran_type )
        var rec = nlapiLoadRecord(tran_type, tran_id);
        if (tran_type == 'inventoryadjustment') {
            abu = rec.getFieldValue('custbody_annual_budgeting_unit');
            if (!isNullOrEmpty(abu)) {
                var abuRec = nlapiLoadRecord("customrecord_annual_budgeting_unit", abu);
                nlapiSubmitRecord(abuRec);
            }
            var cbu = rec.getFieldValue('custbody_control_budgeting_unit');
            if (!isNullOrEmpty(cbu)) {
                var cbuRec = nlapiLoadRecord("customrecord_control_budgeting_unit", cbu);
                nlapiSubmitRecord(cbuRec);
            }
        }
        else {
            if (rec.getLineItemCount('expense') > 0) {     //case line item == 'expense'
                expanseFlag = true;
                itemType = 'expense';
            }
            else if (rec.getLineItemCount('line') > 0) {        //case line item == 'line'
                journalFlag = true;
                itemType = 'line';
            }
            else {      //case line item == 'item'
                itemType = 'item';
            }
            var itemCount = rec.getLineItemCount(itemType);
            for (var i = 1; i <= itemCount; i++) {
                if (context.getRemainingUsage() < 150) {
                    nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
                    var state = nlapiYieldScript();
                    if (state.status == 'FAILURE') {
                        nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                    }
                    else if (state.status == 'RESUME') {
                        nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                    }
                }
                var abu = rec.getLineItemValue(itemType, 'custcol_budgeting_unit', i)
                if (!isNullOrEmpty(abu)) {
                    var abuRec = nlapiLoadRecord("customrecord_annual_budgeting_unit", abu);
                    nlapiSubmitRecord(abuRec);
                }
                var cbu = rec.getLineItemValue(itemType, 'custcol_budget_control_unit', i)
                if (!isNullOrEmpty(cbu)) {
                    var cbuRec = nlapiLoadRecord("customrecord_control_budgeting_unit", cbu);
                    nlapiSubmitRecord(cbuRec);
                }
            }
        }
	
	
	}catch(e){		
         nlapiLogExecution('ERROR', 'e: ', e)
	}
		
	
}
function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
	