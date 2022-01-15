function beforeLoad_addButton(type, form) {
    var typeRec = nlapiGetRecordType();
    if (typeRec == 'purchaseorder' && type == 'view' && isNullOrEmpty(nlapiGetFieldValue('custbody_ic_target_tran')) && nlapiLookupField('vendor', nlapiGetFieldValue('entity'), 'custentity_is_ic_entity') == 'T') {   
        form.setScript('customscript_ic_client'); 
        form.addButton('custpage_button_ic', 'Intercompany', 'Intercompany()');
        }
}
function afterSubmitIC(type) {
    try { 
        if (type != 'delete' && type != 'create') {
            var typeRec = nlapiGetRecordType();
            var rec = nlapiLoadRecord(typeRec, nlapiGetRecordId());
            if (typeRec == 'purchaseorder') {
                var ic_target_tran = rec.getFieldValue('custbody_ic_target_tran')
                var ic_target_type = rec.getFieldValue('custbody_ic_target_type');
                if (!isNullOrEmpty(ic_target_tran) && !isNullOrEmpty(ic_target_type)) {
                    var targetRec = nlapiLoadRecord(ic_target_type, ic_target_tran);
                    deleteTragetLines(targetRec);
                    var lineFields = lineFieldsMappings(typeRec);
                    var itemsLineCount = rec.getLineItemCount('item');
                    for (var line = 1; line <= itemsLineCount; line++) {
                        targetRec.selectNewLineItem('item');
                        for (var m = 0; m < lineFields.length; m++) {
                            var source_field_id = lineFields[m].source_field_id;
                            var LineFieldVal = rec.getLineItemValue('item', source_field_id, line);
                            if (!isNullOrEmpty(LineFieldVal)) {
                                targetRec.setCurrentLineItemValue('item', lineFields[m].target_field_id, LineFieldVal);
                            }
                        }
                        targetRec.commitLineItem('item');
                    }
                    var targetId = nlapiSubmitRecord(targetRec, { disabletriggers: true, enablesourcing: false, ignoremandatoryfields: true });
                    nlapiLogExecution('debug', 'target id', targetId);
                }
            }     
        }
        else if (type == 'create') {
            var typeRec = nlapiGetRecordType();       
            if (typeRec == 'itemfulfillment') {
                var rec = nlapiLoadRecord(typeRec, nlapiGetRecordId());
                var createdfrom = rec.getFieldValue('createdfrom');
                var ordertype = rec.getFieldValue('ordertype');
                if (ordertype == "SalesOrd") {
                    var SOrec = nlapiLoadRecord('salesorder', createdfrom);
                    var ic_source_tran = SOrec.getFieldValue('custbody_ic_source_tran');
                    if (!isNullOrEmpty(ic_source_tran)) {
                        nlapiSubmitField('purchaseorder', ic_source_tran, 'custbody_ic_already_fulfill', 'T')
                    }
                }           
            }
        }         
    } catch (e) { nlapiLogExecution('debug', 'error: ', e);	 }
}
function deleteTragetLines(targetRec) {
    var itemsLineCount = targetRec.getLineItemCount('item');
    for (var j = itemsLineCount; j >= 1; j--) {             
        targetRec.removeLineItem('item', j);    
    }
}
function getItemFullfilmentRec(so) {

}












