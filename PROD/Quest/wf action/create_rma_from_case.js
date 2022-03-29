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
        var serial = rec.getFieldText('custevent_dangot_serial_number');
        var dataFromCase = [];
        itemList = getSparParts(recID)
        dataFromCase.push({
            entity: entity,
            location: location,
            serial: serial,
            caseID: recID,
            rmaType: rmaType,
            department: department,
            itemList: itemList,
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
        
        var rec = nlapiCreateRecord('returnauthorization');
        //Header Fields
        rec.setFieldValue('entity', data[0].entity);
        rec.setFieldValue('custbody_related_support_case', data[0].caseID);
        rec.setFieldValue('custbody_dangot_rma_type', data[0].rmaType);
        rec.setFieldValue('location', data[0].location);
        rec.setFieldValue('department', data[0].department);
        try {
            var itemList = data[0].itemList
            for (var i = 0; i < itemList.length; i++) {
                // Lines Fields
                rec.selectNewLineItem('item');
                rec.setCurrentLineItemValue('item', 'item', itemList[i].item);
                rec.setCurrentLineItemValue('item', 'quantity', itemList[i].qty)
                rec.setCurrentLineItemValue('item', 'rate', '0');
                rec.setCurrentLineItemValue('item', 'custcol_action_type', itemList[i].action_type)
                rec.setCurrentLineItemValue('item', 'custcol_inventory_report_id', itemList[i].id)
                rec.setCurrentLineItemValue('item', 'location', data[0].location)
                //if (itemList[i].serial != '') {
                //    var inventorydetailrecord = rec.createCurrentLineItemSubrecord('item', 'inventorydetail');
                //    inventorydetailrecord.selectNewLineItem('inventoryassignment');
                //    inventorydetailrecord.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', itemList[i].serial);
                //    inventorydetailrecord.setCurrentLineItemValue('inventoryassignment', 'quantity', '1');
                //    inventorydetailrecord.commitLineItem('inventoryassignment');
                //    inventorydetailrecord.commit();
                //}
                rec.commitLineItem('item');
            }
        } catch (err) {
            nlapiLogExecution('DEBUG', 'error createTech - lines - line ' + i, err);
        }
        var id = nlapiSubmitRecord(rec, false, true);
        nlapiLogExecution('debug', 'rma id: ', id);
        if (id != -1) {
            return id;
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
function getSparParts(caseID) {

    var columns = new Array();
    columns.push(new nlobjSearchColumn('custrecord_spare_part_item'));
    columns.push(new nlobjSearchColumn('custrecord_spare_part_qty'));
    columns.push(new nlobjSearchColumn('custrecord_returning_serial_number'));
    columns.push(new nlobjSearchColumn('custrecord_sp_action_type'));

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_sp_related_case', null, 'anyof', caseID)
    filters[1] = new nlobjSearchFilter('custrecord_sp_incorrect_reporting', null, 'is', 'F')
    filters[2] = new nlobjSearchFilter('custrecord_sp_action_type', null, 'anyof', ["2","3"])

    var search = nlapiCreateSearch('customrecord_spare_parts', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    for (var i = 0; i < s.length; i++) {
        results.push({
            id: s[i].id,
            item: s[i].getValue('custrecord_spare_part_item'),
            qty: s[i].getValue('custrecord_spare_part_qty'),
            serial: s[i].getValue('custrecord_returning_serial_number'),
            action_type: s[i].getValue('custrecord_sp_action_type')
        });
    }
    return results;

}