var context = nlapiGetContext();
var GLOBAL_DEFAULT_LOCATION = 37 // Dangot - Vendor Repairs (תיקוני יצרן)
function createITRSS() {
    try {
        var fulfillment = context.getSetting('SCRIPT', 'custscript_fulfillment_id');
        nlapiLogExecution('debug', 'fulfillment', fulfillment);
        if (isNullOrEmpty(fulfillment)) return
        var rec = nlapiLoadRecord('itemfulfillment', fulfillment);
        var shipstatus = rec.getFieldValue('shipstatus')
        if (shipstatus != 'C') return;
        var ordertype = rec.getFieldValue('ordertype')
        if (ordertype == 'TrnfrOrd') {
            var createdfrom  = rec.getFieldValue('createdfrom')
            var troRec = nlapiLoadRecord('transferorder', createdfrom);
            var order_type = troRec.getFieldValue('custbody_transfer_order_type')
            var status = troRec.getFieldValue('status')
            if (order_type == '2' && status == 'Pending Receipt') { // vendor repair
                var vendor = troRec.getFieldText('custbody_tro_vendor');
                var bin = searchBin(vendor);
                nlapiLogExecution('debug', 'bin', bin);
                if (isNullOrEmpty(bin)) return
                createItr(createdfrom, bin)
            }
            else if (order_type == '3' && status == 'Pending Receipt') {
                createItr(createdfrom, null)
            }
        }

    } catch (e) {
        nlapiLogExecution('error', 'error: ' +e, 'fulfillment: ' +fulfillment);
    }
}
function searchBin(vendor) {
    nlapiLogExecution('debug', 'vendor', vendor);
    var binSearch = nlapiSearchRecord("bin", null,
        [
            ["binnumber", "is", vendor.toString()]
        ],
        [    
        ]
    );
    var id = '';

    if (binSearch != null && binSearch.length > 0) {
        id = binSearch[0].id
    }
    else {  id= createBin(vendor) }
    return id;
}
function createBin(vendor) {
    var binRec = nlapiCreateRecord('bin', { recordmode: "dynamic" });
    binRec.setFieldValue('binnumber', vendor.substring(0, 20));
    binRec.setFieldValue('location', GLOBAL_DEFAULT_LOCATION);
    var id = nlapiSubmitRecord(binRec, null, true);
    return id;
}
function createItr(createdfrom, bin) {
    var itrRec = nlapiTransformRecord('transferorder', createdfrom, 'itemreceipt');
    itrRec.setFieldValue('location', GLOBAL_DEFAULT_LOCATION)
    if (!isNullOrEmpty(bin)) {
        var itemCount = itrRec.getLineItemCount('item')
        for (j = 1; j <= itemCount; j++) {
            itrRec.selectLineItem('item', j);
            invDetail = itrRec.editCurrentLineItemSubrecord('item', 'inventorydetail');
            if (!isNullOrEmpty(invDetail)) {
                var assign_count = invDetail.getLineItemCount('inventoryassignment')
                nlapiLogExecution('DEBUG', 'inventory count: ' + assign_count);
                for (var i = 1; i <= assign_count; i++) {
                    invDetail.selectLineItem('inventoryassignment', i);
                    invDetail.setCurrentLineItemValue('inventoryassignment', 'binnumber', bin);
                    invDetail.commitLineItem('inventoryassignment')
                }
                invDetail.commit();
                itrRec.commitLineItem('item');

            }
        }
    }    
    var id = nlapiSubmitRecord(itrRec, null, true);
    nlapiLogExecution('debug', 'createItr id', id);
}
function checkContext(context) {
    if (context.getRemainingUsage() < 150) {
        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}



