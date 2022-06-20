var GLOBAL_STATUS = 'B' //	Approved (Posting)
var GLOBAL_DEPARTMENT = 25; // Service Department
function createTechFromCase() {
    try {
        //var context = nlapiGetContext();
        var recID = nlapiGetRecordId();
        var recTYPE = nlapiGetRecordType();
        var spareRec = nlapiLoadRecord(recTYPE, recID);
        nlapiLogExecution('debug', ' recTYPE: ' + recTYPE, 'recID: ' + recID);
        var val = null;
        var incorrect_reporting = spareRec.getFieldValue('custrecord_sp_incorrect_reporting');
        var custrecord_ctl_indication = spareRec.getFieldValue('custrecord_ctl_indication');
        if (incorrect_reporting == 'F' && isNullOrEmpty(custrecord_ctl_indication)) {
            var caseId = spareRec.getFieldValue('custrecord_sp_related_case');
            var rec = nlapiLoadRecord('supportcase', caseId);
            var related_tech_inventory = rec.getFieldValue('custevent_related_tech_inventory')
            if (isNullOrEmpty(related_tech_inventory)) {
                var entity = rec.getFieldValue('company');
                var product_line = rec.getFieldValue('custevent_dangot_product_line');
                var data = [];
                data.push({
                    entity: entity,
                    product_line: product_line,
                    caseID: caseId,
                    id: recID,
                    item: spareRec.getFieldValue('custrecord_issued_item'),
                    qty: spareRec.getFieldValue('custrecord_spare_part_qty'),
                    serial: spareRec.getFieldValue('custrecord_sp_serial_number'),
                    action_type: spareRec.getFieldValue('custrecord_sp_action_type'),
                    location: spareRec.getFieldValue('custrecord_sp_location'),
                });
                nlapiLogExecution('DEBUG', 'data: ' + data.length, JSON.stringify(data));
                var id = createTech(data);
                if (id != -1) {
                    rec.setFieldValue('custevent_related_tech_inventory', id);
                    nlapiSubmitRecord(rec, false, true); // try to avoid mandatory field
                    val = 1// create

                }
            }
            else {
                var data = [];
                data.push({
                    id: recID,
                    item: spareRec.getFieldValue('custrecord_issued_item'),
                    qty: spareRec.getFieldValue('custrecord_spare_part_qty'),
                    serial: spareRec.getFieldValue('custrecord_sp_serial_number'),
                    action_type: spareRec.getFieldValue('custrecord_sp_action_type'),
                    location: spareRec.getFieldValue('custrecord_sp_location'),
                });

                var id = updateTech(data, related_tech_inventory);
                if (id != -1) {
                    val = 2// update
                }

            }
            if (val != null) {
                spareRec.setFieldValue('custrecord_ctl_indication', val)
                nlapiSubmitRecord(spareRec, false, true);
            }

        }

    } catch (e) {
        nlapiLogExecution('error', 'error', e);
    }
}

function createTech(data) {
    try {
        var rec = nlapiCreateRecord('customsale101', { recordmode: 'dynamic' });
        //Header Fields
        rec.setFieldValue('entity', data[0].entity);
        rec.setFieldValue('custbody_dangot_product_line', data[0].product_line);
        rec.setFieldValue('custbody_related_support_case', data[0].caseID);
        rec.setFieldValue('location', data[0].location);
        rec.setFieldValue('department', GLOBAL_DEPARTMENT);
        rec.setFieldValue('transtatus', GLOBAL_STATUS);
        //rec.setFieldValue('custbody_dangot_replacement_type', data[0].replacement_type);
        try {
            // Lines Fields
            rec.selectNewLineItem('item');
            rec.setCurrentLineItemValue('item', 'item', data[0].item);
            rec.setCurrentLineItemValue('item', 'quantity', data[0].qty)
            rec.setCurrentLineItemValue('item', 'rate', '0');
            rec.setCurrentLineItemValue('item', 'custcol_action_type', data[0].action_type)
            rec.setCurrentLineItemValue('item', 'custcol_inventory_report_id', data[0].id)
            rec.setCurrentLineItemValue('item', 'location', data[0].location)
            if (!isNullOrEmpty(data[0].serial)) {
                var inventorydetailrecord = rec.createCurrentLineItemSubrecord('item', 'inventorydetail');
                inventorydetailrecord.selectNewLineItem('inventoryassignment');
                inventorydetailrecord.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', data[0].serial);
                inventorydetailrecord.setCurrentLineItemValue('inventoryassignment', 'quantity', '1');
                inventorydetailrecord.commitLineItem('inventoryassignment');
                inventorydetailrecord.commit();
            }
            rec.commitLineItem('item');

        } catch (err) {
            nlapiLogExecution('DEBUG', 'error createTech - lines - line ', err);
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

function updateTech(data, id) {
    try {

        var rec = nlapiLoadRecord('customsale101', id);
        try {
            // Lines Fields
            rec.selectNewLineItem('item');
            rec.setCurrentLineItemValue('item', 'item', data[0].item);
            rec.setCurrentLineItemValue('item', 'quantity', data[0].qty)
            rec.setCurrentLineItemValue('item', 'rate', '0');
            rec.setCurrentLineItemValue('item', 'custcol_action_type', data[0].action_type)
            rec.setCurrentLineItemValue('item', 'custcol_inventory_report_id', data[0].id)
            rec.setCurrentLineItemValue('item', 'location', data[0].location)
            if (!isNullOrEmpty(data[0].serial)) {
                var inventorydetailrecord = rec.createCurrentLineItemSubrecord('item', 'inventorydetail');
                inventorydetailrecord.selectNewLineItem('inventoryassignment');
                inventorydetailrecord.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', data[0].serial);
                inventorydetailrecord.setCurrentLineItemValue('inventoryassignment', 'quantity', '1');
                inventorydetailrecord.commitLineItem('inventoryassignment');
                inventorydetailrecord.commit();
            }
            rec.commitLineItem('item');

        } catch (err) {
            nlapiLogExecution('DEBUG', 'error createTech - lines - line ', err);
        }
        var id = nlapiSubmitRecord(rec, false, true);
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error updateTech ', e);
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
    columns.push(new nlobjSearchColumn('custrecord_issued_item'));
    columns.push(new nlobjSearchColumn('custrecord_spare_part_qty'));
    columns.push(new nlobjSearchColumn('custrecord_sp_serial_number'));
    columns.push(new nlobjSearchColumn('custrecord_sp_action_type'));
    columns.push(new nlobjSearchColumn('custrecord_sp_location'));

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_sp_related_case', null, 'anyof', caseID)
    filters[1] = new nlobjSearchFilter('custrecord_sp_incorrect_reporting', null, 'is', 'F')

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
            item: s[i].getValue('custrecord_issued_item'),
            qty: s[i].getValue('custrecord_spare_part_qty'),
            serial: s[i].getValue('custrecord_sp_serial_number'),
            action_type: s[i].getValue('custrecord_sp_action_type'),
            location: s[i].getValue('custrecord_sp_location'),
        });
    }
    return results;

}
