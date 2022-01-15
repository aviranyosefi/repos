var targetType = '';
var error;

function creteICTran(request, response) {
    try {
        var id = request.getParameter('id');
        var type = request.getParameter('type');
        var targetId = createTargetRec(type, id);
        if (targetId != '') {
            var messageResponse = buildMessage(targetId)
        }
        else {
            var messageResponse = 'error to create target record: ' + error;
        }
        response.write(messageResponse);
    } catch (e) {
        response.write('error to create target record: ' + e);
    }
}
function createTargetRec(type, id) {
    try {       
        var headerFields = headerFieldsMappings(type);
        var lineFields = lineFieldsMappings(type);
        if (headerFields != null && headerFields.length > 0) { targetType = headerFields[0].target_record_id; }
        else if (lineFields != null && lineFields.length > 0) { targetType = lineFields[0].target_record_id; }
        if (targetType != '') {            
            try {
                var rec = nlapiLoadRecord(type, id);
                var itemsLineCount = rec.getLineItemCount('item');
                var targetRec = nlapiCreateRecord(targetType);
                var entity = rec.getFieldValue('entity')
                var ic_customer = nlapiLookupField('vendor', entity, 'custentity_related_ic_customer');
                var ic_location = nlapiLookupField('vendor', entity, 'custentity_ic_location');
                targetRec.setFieldValue('entity', ic_customer);
                targetRec.setFieldValue('location', ic_location)
                targetRec.setFieldValue('custbody_ic_source_tran', id);
                targetRec.setFieldValue('intercotransaction', id); 
                targetRec.setFieldValue('intercostatus', 2); 
                for (var i = 0; i < headerFields.length; i++) {
                    targetRec.setFieldValue(recFields[i].target_field_id, rec.getFieldValue(recFields[i].source_field_id));
                }                
                for (var line = 1; line <= itemsLineCount; line++) {
                    targetRec.selectNewLineItem('item');
                    for (var m = 0; m < lineFields.length; m++) {
                        var source_field_id = lineFields[m].source_field_id;
                            targetRec.setCurrentLineItemValue('item', lineFields[m].target_field_id, rec.getLineItemValue('item', source_field_id, line));                    
                    }
                    targetRec.commitLineItem('item');
                }               
                var targetId = nlapiSubmitRecord(targetRec, { disabletriggers: true, enablesourcing: false, ignoremandatoryfields: true });
                if (targetId != -1) {
                    rec.setFieldValue('custbody_ic_target_tran', targetId);
                    rec.setFieldValue('intercotransaction', targetId); 
                    rec.setFieldValue('intercostatus', 2);
                    rec.setFieldValue('custbody_ic_target_type', targetType);                    
                    nlapiSubmitRecord(rec);
                    return targetId;
                }
            } catch (e) {
                nlapiLogExecution('error', 'createTargetRec error', e);
                error = e;
            }
        }
    } catch (e) {
        error = e;
        return '';
    }
    return '';
}
function buildMessage(targetId) {
    var messageType = '';
    var tranid = nlapiLookupField(targetType, targetId, 'tranid');
    if (targetType == 'salesorder') {
        messageType = 'sales order: #' + tranid
    }
    return messageType;
}


