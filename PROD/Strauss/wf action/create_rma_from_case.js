function createRmaFromCase() {
    try { 
        var context = nlapiGetContext();
        var location = context.getSetting('SCRIPT', 'custscript_wf_location');
        var itemField = context.getSetting('SCRIPT', 'custscript_wf_item');
        nlapiLogExecution('debug', ' location: ' + location, 'item: ' + item);
        var recID = nlapiGetRecordId();
        var recTYPE = nlapiGetRecordType();
        var rec = nlapiLoadRecord(recTYPE, recID);
        nlapiLogExecution('debug', ' recTYPE: ' + recTYPE, 'recID: ' + recID);
        var entity = rec.getFieldValue('company');
        var custevent_machine = rec.getFieldValue('custevent_machine');
        //var serial = nlapiLookupField('customrecord_coffee_machine_equip', custevent_machine, 'custrecord_inventory_number', true)
        var item = rec.getFieldValue('custevent_machine_item');
        var status_reason = rec.getFieldValue('custevent_status_reason');
        var first_name = rec.getFieldValue('custevent_first_name');
        if (isNullOrEmpty(first_name)) { first_name = ''; }
        var last_name = rec.getFieldValue('custevent_last_name');
        if (isNullOrEmpty(last_name)) { last_name = ''; }
        var phone = rec.getFieldValue('phone');
        if (isNullOrEmpty(phone)) { phone = ''; }
        var dataForCase = [];
        dataForCase.push({
            entity: entity,
            qty: '1',
            item: item,
            location: location,
            serial: custevent_machine,
            rmaType : '5',
            caseID: recID,
            status_reason: status_reason,
            name: first_name + ' ' + last_name ,
            phone: phone,
        });
        nlapiLogExecution('DEBUG', 'data: ' + dataForCase.length, JSON.stringify(dataForCase));
        var rmaId = createRma(dataForCase);
        if (id != -1) {
            rec.setFieldValue('custevent_related_rma', rmaId);
            nlapiSubmitRecord(rec);     
        }
    } catch (e) {
        nlapiLogExecution('error', 'error',  e);
    }  
}

function createRma(data) {

    
    try {      
        for (var i = 0; i < data.length; i++) {
            var rec = nlapiCreateRecord('returnauthorization');
            //Header Fields 
            rec.setFieldValue('entity', data[i].entity);
            rec.setFieldValue('custbody_related_support_case', data[i].caseID);
            rec.setFieldValue('custbody_rma_type', data[i].rmaType);
            rec.setFieldValue('location', data[i].location);
            rec.setFieldValue('custbody_return_reason', data[i].status_reason);
            rec.setFieldValue('custbody_contact_person', data[i].name);
            rec.setFieldValue('custbody_contact_phone_number', data[i].phone);
            
           
            try {
                // lines Fields
                rec.selectNewLineItem('item');
                rec.setCurrentLineItemValue('item', 'item', data[i].item);
                rec.setCurrentLineItemValue('item', 'quantity', data[i].qty)
                rec.setCurrentLineItemValue('item', 'rate', '0');
                //rec.setCurrentLineItemValue('item', 'location', data[i].location);
                rec.setCurrentLineItemValue('item', 'custcol_serial_number', data[i].serial);

                //var inventorydetailrecord = rec.createCurrentLineItemSubrecord('item', 'inventorynumber');

                //inventorydetailrecord.selectNewLineItem('inventorynumber');
                //inventorydetailrecord.setCurrentLineItemValue('inventorynumber', 'inventorynumber', data[i].serial);
                //inventorydetailrecord.commitLineItem('inventorynumber');
                //inventorydetailrecord.commit();
            
                rec.commitLineItem('item');
            } catch (err) {
                nlapiLogExecution('DEBUG', 'error createRma - lines', err);
            }
            var id = nlapiSubmitRecord(rec);
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