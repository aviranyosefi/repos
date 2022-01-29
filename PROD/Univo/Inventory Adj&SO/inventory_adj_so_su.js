var targetType = '';
var error;

function creteICTran(request, response) {
    try {
        var id = request.getParameter('id');
        // get the inventory details id
        // create inv adj
        // create so lines
        //var targetId = createTargetRec('itemfulfillment', id);

        try {
            var rec = nlapiLoadRecord('itemfulfillment', id);
        } catch (e) {
            nlapiLogExecution('debug', 'error details', e);
        }

        var itemsArr = [];
        var itemCount = rec.getLineItemCount('item');

        for (var i = 1; i <= itemCount; i++) {


            var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
            if (subrecord != "" && subrecord != null) {
                nlapiLogExecution('debug', ' subrecord', subrecord.id);
                var invDetailID = subrecord.id;
                nlapiLogExecution('debug', ' invDetailID', invDetailID);
                if (invDetailID != "" && invDetailID != null) {
                    var serials = getInventoryDetails(invDetailID);
                    if (serials != "" && serials != null) {
                        nlapiLogExecution('debug', 'serials length() ' + serials.length, serials);
                        var countLines = 1;
                        for (var m = 0; m < serials.length; m++) {
                            if (serials[m] != '') {
                                var invId = getInventoryNumnerId(serials[m], rec.getLineItemValue('item', 'item', 1));
                                countLines++;
                                nlapiLogExecution('debug', 'invId', invId);
                                itemsArr.push({
                                    itemID: rec.getLineItemValue('item', 'item', i),
                                    description: rec.getLineItemValue('item', 'description', i),
                                    location: rec.getLineItemValue('item', 'location', i),
                                    units: rec.getLineItemValue('item', 'units', i),
                                    quantity: rec.getLineItemValue('item', 'quantity', i),
                                    serial: serials[m]
                                });
                                nlapiLogExecution('debug', ' itemsArr', JSON.stringify(itemsArr));
                            }
                        }
                    }

                }
            }
        }
        nlapiLogExecution('debug', 'itemsArr', JSON.stringify(itemsArr));


        var soRecId = rec.getFieldValue('createdfrom');
        try {
            var soRec = nlapiLoadRecord('salesorder', soRecId);
        } catch (e) {
            nlapiLogExecution('debug', 'error details', e);
        }

        createInvAdj(itemsArr, rec);

        //duplicateSolines(soRec, itemsArr);

        response.write('');
    } catch (e) {
        response.write('error to create target record: ' + e);
    }
}

function getInventoryDetails(invDetailID) {
    var serials = [];
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));

    count = 0;
    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    if (results != null) {
        results.forEach(function (line) {
            var inventname = line.getValue('inventorynumber', 'inventorynumber');
            serials.push(inventname);
            count++;
        });
    }

    return serials;
}

function getInventoryNumnerId(serial, item) {
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('inventorynumber', null, 'is', serial));
    filters.push(new nlobjSearchFilter('item', null, 'anyof', item));
    columns.push(new nlobjSearchColumn('internalid'));
    //columns.push(new nlobjSearchColumn('baserecordtype'));

    count = 0;
    results = nlapiSearchRecord('inventorynumber', null, filters, columns) || [];
    if (results != null) {
        var res = [];
        res.push({
            invId: results[0].getValue('internalid'),
            //invType: results[0].getValue('baserecordtype'),
        })
        nlapiLogExecution('debug', 'res', JSON.stringify(res));
        return res;
    }
    return '';
}

function getItem(rec, i, serial) {
    var itemLine = [];
    itemLine.push({
        itemID: rec.getLineItemValue('item', 'item', i),
        description: rec.getLineItemValue('item', 'description', i),
        location: rec.getLineItemValue('item', 'location', i),
        units: rec.getLineItemValue('item', 'units', i),
        quantity: rec.getLineItemValue('item', 'quantity', i),
        serial: serial
    })
    nlapiLogExecution('debug', 'itemLine', JSON.stringify(itemLine));

    return itemLine;
}

function createInvAdj(itemsArr, rec) {
    nlapiLogExecution('debug', 'createInvAdj-itemsArr', JSON.stringify(itemsArr));

    var adjRec = nlapiCreateRecord('inventoryadjustment', { recordmode: "dynamic" });
    //rec.setFieldValue('tranid', '');
    //rec.setFieldValue('subsidiary', '3');

    adjRec.setFieldValue('subsidiary', rec.getFieldValue('subsidiary'));
    adjRec.setFieldValue('account', 1348);
    //rec.setFieldValue('custbody_adjustment_reason', '13');
    //rec.setFieldValue('estimatedtotalvalue', '0.00');

    //var location = rec.getFieldText('custbody_adjustment_reason');
    //nlapiLogExecution('debug', 'location', location);

    for (i = 0; i < itemsArr.length; i++) {     
        adjRec.selectNewLineItem('inventory');
        adjRec.setCurrentLineItemValue('inventory', 'item', itemsArr[i].itemID);      
        adjRec.setCurrentLineItemValue('inventory', 'adjustqtyby', itemsArr[i].quantity);
        adjRec.setCurrentLineItemValue('inventory', 'location', itemsArr[i].location);

        // subrecord
        var compSubRecord = adjRec.createCurrentLineItemSubrecord('inventory', 'inventorydetail');
        compSubRecord.selectNewLineItem('inventoryassignment');
        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', itemsArr[i].serial);
        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', searchBin(rec.getFieldValue('entity')));
        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', itemsArr[i].quantity);
        compSubRecord.commitLineItem('inventoryassignment');
        compSubRecord.commit();
        // subrecord

        adjRec.commitLineItem('inventory');
    }

   
    var submitID = nlapiSubmitRecord(adjRec, null, true);
    nlapiLogExecution('debug', 'submitID', submitID);

}

function duplicateSolines(soRec, itemsArr) {
    nlapiLogExecution('DEBUG', 'duplicateSolines()', 'run');

    //to add lines to the end of sublist in so
    for (var i = 0; i < itemsArr.length; i++) {
        soRec.selectNewLineItem('item');
        soRec.setCurrentLineItemValue('item', 'item', itemsArr[i].itemID);
        //soRec.setCurrentLineItemValue('item', 'quantity', itemsArr[i].quantity);

        soRec.setCurrentLineItemValue('item', 'quantity', 96);
        soRec.setCurrentLineItemValue('item', 'rate', 0);
        soRec.commitLineItem('item');

        var submitId = nlapiSubmitRecord(soRec);
        nlapiLogExecution('DEBUG', 'submitId', submitId);
    }
}
function searchBin(entity) {

    var binSearch = nlapiSearchRecord("bin", null,
        [
            ["custrecord_customer", "anyof", entity]
        ],
        [
            new nlobjSearchColumn("binnumber").setSort(false),
            new nlobjSearchColumn("location"),
            new nlobjSearchColumn("memo"),
            new nlobjSearchColumn("custrecord_customer")
        ]
    );


}


