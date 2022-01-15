function createRmaFromCase() {
    try {
        var context = nlapiGetContext();
        var location = context.getSetting('SCRIPT', 'custscript_wf_location');
        var itemField = context.getSetting('SCRIPT', 'custscript_wf_item');
        var rmaType = context.getSetting('SCRIPT', 'custscript_wf_rma_type');
        var department = context.getSetting('SCRIPT', 'custscript_wf_department');
        nlapiLogExecution('debug', ' Location: ' + location, 'Item: ' + itemField + ' RMA Type: ' + rmaType + ' Department: ' + department);
        var recID = nlapiGetRecordId();
        var recTYPE = nlapiGetRecordType();
        var rec = nlapiLoadRecord(recTYPE, recID);
        nlapiLogExecution('debug', ' recTYPE: ' + recTYPE, 'recID: ' + recID);
        var entity = rec.getFieldValue('company');
        var dangot_item = rec.getFieldValue('custevent_dangot_item');
        var serial = rec.getFieldText('custevent_dangot_serial_number');
        var dataFromCase = [];
        dataFromCase.push({
            entity: entity,
            qty: '1',
            item: dangot_item,
            location: location,
            serial: serial,
            caseID: recID,
            rmaType: rmaType,
            department: department,
        });
        nlapiLogExecution('DEBUG', 'data: ' + dataFromCase.length, JSON.stringify(dataFromCase));
        var rmaId = createRma(dataFromCase);
        if (rmaId != -1) {
            rec.setFieldValue('custevent_related_rma', rmaId);
            nlapiSubmitRecord(rec, false, true); // try to avoid mandatory field
        }
    } catch (e) {
        nlapiLogExecution('error', 'error', e);
    }
}

function createRma(data) {
    try {
        for (var i = 0; i < data.length; i++) {
            var rec = nlapiCreateRecord('returnauthorization');
            //Header Fields
            rec.setFieldValue('entity', data[i].entity);
            rec.setFieldValue('custbody_related_support_case', data[i].caseID);
            rec.setFieldValue('custbody_dangot_rma_type', data[i].rmaType);
            rec.setFieldValue('location', data[i].location);
            rec.setFieldValue('department', data[i].department);
            try {
                // Lines Fields
                rec.selectNewLineItem('item');
                rec.setCurrentLineItemValue('item', 'item', data[i].item);
                rec.setCurrentLineItemValue('item', 'quantity', data[i].qty)
                rec.setCurrentLineItemValue('item', 'rate', '0');
                //rec.setCurrentLineItemValue('item', 'location', data[i].location);
                var inventorydetailrecord = rec.createCurrentLineItemSubrecord('item', 'inventorydetail');
                inventorydetailrecord.selectNewLineItem('inventoryassignment');
                inventorydetailrecord.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', data[i].serial);
                inventorydetailrecord.setCurrentLineItemValue('inventoryassignment', 'quantity', '1');
                inventorydetailrecord.commitLineItem('inventoryassignment');
                inventorydetailrecord.commit();
                rec.commitLineItem('item');
            } catch (err) {
                nlapiLogExecution('DEBUG', 'error createRma - lines', err);
            }
            var id = nlapiSubmitRecord(rec, false, true);
            nlapiLogExecution('debug', 'rma id: ', id);
            if (id != -1) {
                return id;
            }
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error createRma ', e);
    }

    return -1;

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}