function createInvFromTech() {
    try {
        var context = nlapiGetContext();
        var recID = nlapiGetRecordId();
        var recTYPE = nlapiGetRecordType();
        var TechRec = nlapiLoadRecord(recTYPE, recID);
        nlapiLogExecution('debug', ' recTYPE: ' + recTYPE, 'recID: ' + recID);
        var item = context.getSetting('SCRIPT', 'custscript_wf_inv_item');       
       
        //var entity = rec.getFieldValue('company');
        //var related_support_case = rec.getFieldValue('custbody_related_support_case');
        //var itemCount = rec.getLineItemCount('item');
        //for (var i = 1; i <= itemCount; i++) {
        //    itemList.push({
        //        item: item,
        //        des: rec.getLineItemValue('item', 'description', i),
        //        qty: 1,
        //    });
        //}
       
      
        //var data = [];
        //data.push({
        //    entity: entity,
        //    related_support_case: related_support_case,
        //    itemList: itemList,
        //    department: 21,
        //});
        //nlapiLogExecution('DEBUG', 'data: ' + data.length, JSON.stringify(data));
        var id = createINV(recID, item, TechRec)
        //if (id != -1) {
        //    rec.setFieldValue('custevent_related_tech_inventory', id);
        //    nlapiSubmitRecord(rec, false, true); // try to avoid mandatory field
        //}
    } catch (e) {
        nlapiLogExecution('error', 'error', e);
    }
}

function createINV(recID, item, TechRec) {
    try {
        var rec = nlapiTransformRecord('customsale101', recID, 'invoice')
       
        ////Header Fields
        //rec.setFieldValue('entity', data[0].entity);
        //rec.setFieldValue('custbody_related_support_case', data[0].product_line);
 
        //rec.setFieldValue('department', data[0].department);   
        //rec.setFieldValue('custbody_dangot_replacement_type', data[0].replacement_type);   
        try {
            var itemCount = rec.getLineItemCount('item');
            for (var i = 1; i <= itemCount; i++) {
                rec.selectLineItem('item',i);
                rec.setCurrentLineItemValue('item', 'item', item);
                rec.setCurrentLineItemValue('item', 'custcol_dangot_original_item', TechRec.getLineItemValue('item', 'item', i));
                rec.setCurrentLineItemValue('item', 'description', TechRec.getLineItemValue('item', 'description', i));
                rec.setCurrentLineItemValue('item', 'quantity', 1);
                rec.setCurrentLineItemValue('item', 'rate', '0');
                rec.commitLineItem('item');
            }        
        } catch (err) {
            nlapiLogExecution('DEBUG', 'error createINV - lines', err);
        }
        var id = nlapiSubmitRecord(rec, false, true);
        nlapiLogExecution('debug', 'inv id: ', id);
        if (id != -1) {
            return id;
        }
        
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error createINV ', e);
    }

    return -1;

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

