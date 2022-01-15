function createsOFromRma() {
    try { 
        var context = nlapiGetContext();
        var location = context.getSetting('SCRIPT', 'custscript_wf_so_location');
        var sale_type = context.getSetting('SCRIPT', 'custscript_sale_type');
        
        nlapiLogExecution('debug', ' location: ' + location, '');
        var recID = nlapiGetRecordId();
        var recTYPE = nlapiGetRecordType();
        var rec = nlapiLoadRecord(recTYPE, recID);
        nlapiLogExecution('debug', ' recTYPE: ' + recTYPE, 'recID: ' + recID);
        var entity = rec.getFieldValue('entity');
        var contact_person = rec.getFieldValue('custbody_contact_person');
        var contact_phone_number = rec.getFieldValue('custbody_contact_phone_number');

        
        var itemCount = rec.getLineItemCount('item');
        var data = [];
        for (var line = 1; line <= itemCount; line++) {

            var item = nlapiGetLineItemValue('item', 'item', line);
            var qty = nlapiGetLineItemValue('item', 'quantity', line);
            var rate = nlapiGetLineItemValue('item', 'rate', line);

            data.push({
                entity: entity,
                qty: qty,
                item: item,
                rate : rate,
                location: location,
                rmaID: recID,
                sale_type: sale_type,
                contact_person: contact_person,
                contact_phone_number: contact_phone_number
              
            });
        }
                   
        nlapiLogExecution('DEBUG', 'data: ' + data.length, JSON.stringify(data));
        var soId = createSO(data);
        if (soId != -1) {
            rec.setFieldValue('custbody_replacement_so', soId);
            nlapiSubmitRecord(rec);
            //nlapiSetRedirectURL('record', 'returnauthorization', id, 'edit', null)
            
        }

    } catch (e) {
        nlapiLogExecution('error', 'error',  e);
    }
    
}

function createSO(data) {

    try {  
        var rec = nlapiCreateRecord('salesorder');
        //Header Fields 
        rec.setFieldValue('entity', data[0].entity);
        rec.setFieldValue('custbody_related_rma', data[0].rmaID);
        rec.setFieldValue('custbody_sale_type', data[0].sale_type);
        rec.setFieldValue('custbody_contact_person', data[0].contact_person);
        rec.setFieldValue('custbody_contact_phone_number', data[0].contact_phone_number);
               
        for (var i = 0; i < data.length; i++) {
                       
            try {
                // lines Fields
                rec.selectNewLineItem('item');
                rec.setCurrentLineItemValue('item', 'item', data[i].item);
                rec.setCurrentLineItemValue('item', 'quantity', data[i].qty)
                rec.setCurrentLineItemValue('item', 'rate', data[i].qty);
                rec.setCurrentLineItemValue('item', 'location', data[i].location);               
                rec.commitLineItem('item');
            } catch (err) {
                nlapiLogExecution('DEBUG', 'error createSO - lines', err);
            }
            var id = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', 'so id: ', id);
            if (id != -1) {     
                return id;
            }
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error createSO ', e);
        return -1;
    }

    return -1;

}