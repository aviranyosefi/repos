//example - GDG2114CU710FG054_001
//example - GDG2114CU710FG054_002 
//example - GDG2114CU710FG054_003


function aftersubmit(type) {
    if (type == 'edit') {
        nlapiLogExecution('DEBUG', 'Edit', 'carton id: ' + nlapiGetRecordId());
        var oldRec = nlapiGetOldRecord();
        var old_line_count = oldRec.getLineItemCount('recmachcustrecord_md_carton');
        rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
        var line_count = rec.getLineItemCount('recmachcustrecord_md_carton');
        if (old_line_count != line_count) {
            for (i = line_count; i > old_line_count; i--) {
                nlapiSubmitField('inventorynumber', rec.getLineItemValue('recmachcustrecord_md_carton', 'custrecord_md_bag_number', i), 'custitemnumber_carton_number', rec.id);
                nlapiLogExecution('DEBUG', 'inventorynumber:' + rec.getLineItemValue('recmachcustrecord_md_carton', 'custrecord_md_bag_number', i), 'carton id: ' + rec.id);
            }
        }
    }
    if (type == 'create') {
        nlapiLogExecution('DEBUG', 'create', 'carton id: ' + nlapiGetRecordId());
        rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
        var line_count = rec.getLineItemCount('recmachcustrecord_md_carton');

        for (i = 1; i <= line_count; i++) {
            nlapiSubmitField('inventorynumber', rec.getLineItemValue('recmachcustrecord_md_carton', 'custrecord_md_bag_number', i), 'custitemnumber_carton_number', rec.id);
            nlapiLogExecution('DEBUG', 'inventorynumber:' + rec.getLineItemValue('recmachcustrecord_md_carton', 'custrecord_md_bag_number', i), 'carton id: ' + rec.id);
        }

    }
}
/*
function saverecord() {
    var inv_num_id = nlapiGetFieldValue('custrecord_md_bag_number');
    var carton_num = nlapiGetFieldValue('custrecord_md_carton');
    if (!isNullOrEmpty(inv_num_id) && !isNullOrEmpty(carton_num)) {
        nlapiSubmitField('inventorynumber', inv_num_id, 'custitemnumber_carton_number', carton_num);
    }
    return true;
}*/

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

