function createTechFromCase() {
    try {
        var context = nlapiGetContext();
        var location = context.getSetting('SCRIPT', 'custscript_wf_tech_location');       
        nlapiLogExecution('debug', ' Location: ', location);
        if (isNullOrEmpty(location)) { location = 38}
        var recID = nlapiGetRecordId();
        var recTYPE = nlapiGetRecordType();
        var rec = nlapiLoadRecord(recTYPE, recID);
        nlapiLogExecution('debug', ' recTYPE: ' + recTYPE, 'recID: ' + recID);
        var entity = rec.getFieldValue('company');
        var product_line = rec.getFieldValue('custevent_dangot_product_line');
        var replacement_type = rec.getFieldValue('custevent_replacement_type');
        var sparPartsList = getSparParts(recID)
        var data = [];
        data.push({
            entity: entity,
            product_line: product_line,
            location: location,
            caseID: recID,
            sparPartsList: sparPartsList,
            replacement_type: replacement_type
        });
        nlapiLogExecution('DEBUG', 'data: ' + data.length, JSON.stringify(data));
        var id = createTech(data);
        if (id != -1) {
            rec.setFieldValue('custevent_related_tech_inventory', id);
            nlapiSubmitRecord(rec, false, true); // try to avoid mandatory field
        }
    } catch (e) {
        nlapiLogExecution('error', 'error', e);
    }
}

function createTech(data) {
    try {
        var rec = nlapiCreateRecord('customsale101');
        //Header Fields
        rec.setFieldValue('entity', data[0].entity);
        rec.setFieldValue('custbody_dangot_product_line', data[0].product_line);
        rec.setFieldValue('custbody_related_support_case', data[0].caseID);
        rec.setFieldValue('location', data[0].location);
        rec.setFieldValue('department', 21);   
        rec.setFieldValue('custbody_dangot_replacement_type', data[0].replacement_type);   
        try {
            var sparPartsList = data[0].sparPartsList
            for (var i = 0; i < sparPartsList.length; i++) {
                // Lines Fields
                rec.selectNewLineItem('item');
                rec.setCurrentLineItemValue('item', 'item', sparPartsList[i].item);
                rec.setCurrentLineItemValue('item', 'quantity', sparPartsList[i].qty)
                rec.setCurrentLineItemValue('item', 'rate', '0');
                //rec.setCurrentLineItemValue('item', 'location', data[i].location);
                //var inventorydetailrecord = rec.createCurrentLineItemSubrecord('item', 'inventorydetail');
                //inventorydetailrecord.selectNewLineItem('inventoryassignment');
                //inventorydetailrecord.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', data[i].serial);
                //inventorydetailrecord.setCurrentLineItemValue('inventoryassignment', 'quantity', '1');
                //inventorydetailrecord.commitLineItem('inventoryassignment');
                //inventorydetailrecord.commit();
                rec.commitLineItem('item');
            }       
        } catch (err) {
            nlapiLogExecution('DEBUG', 'error createTech - lines', err);
        }
        var id = nlapiSubmitRecord(rec, false, true);
        nlapiLogExecution('debug', 'tech id: ', id);
        if (id != -1) {
            return id;
        }
        
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error createTech ', e);
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
    columns.push(new nlobjSearchColumn('custrecord_sp_serial_number'));

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_related_case', null, 'anyof', caseID)

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
            item: s[i].getValue('custrecord_spare_part_item'),
            qty: s[i].getValue('custrecord_spare_part_qty') ,
            serial: s[i].getValue('custrecord_sp_serial_number')
        });
    }
    return results;
    
}
