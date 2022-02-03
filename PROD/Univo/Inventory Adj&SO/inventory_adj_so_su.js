var targetType = '';
var error;

function creteICTran(request, response) {
    try {
        var id = request.getParameter('id');
        try {
            var rec = nlapiLoadRecord('itemfulfillment', id);
        } catch (e) {
            nlapiLogExecution('debug', 'error details', e);
        }
        var itemsArr = [];
        var itemCount = rec.getLineItemCount('item');
        var DefualtData = getDefualtData() 
        for (var i = 1; i <= itemCount; i++) {
            var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
            if (subrecord != "" && subrecord != null) {
                nlapiLogExecution('debug', ' subrecord', subrecord.id);

                var invDetailID = subrecord.id;
                nlapiLogExecution('debug', ' invDetailID', invDetailID);

                if (invDetailID != "" && invDetailID != null) {
                    var serials = getInventoryDetails(invDetailID);

                    if (serials.length > 0) {
                        nlapiLogExecution('debug', 'serials length() ' + serials.length, serials);

                        itemsArr.push({
                            itemID: rec.getLineItemValue('item', 'item', i),
                            description: rec.getLineItemValue('item', 'description', i),
                            location: DefualtData[0],
                            account: DefualtData[1],
                            units: rec.getLineItemValue('item', 'units', i),
                            quantity: rec.getLineItemValue('item', 'quantity', i),
                            serials: serials
                        });
                    }
                }
            }
        }
        nlapiLogExecution('debug', 'itemsArr: ', JSON.stringify(itemsArr));

        var soRecId = rec.getFieldValue('createdfrom');
        nlapiLogExecution('debug', 'soRecId: ', soRecId);
        try {
            var soRec = nlapiLoadRecord('salesorder', soRecId);
        } catch (e) {
            nlapiLogExecution('debug', 'error details', e);
        }
        var binsID = searchBin(rec.getFieldValue('entity'));

        var inventoryAdjId = createAndUpadteTran(itemsArr, rec, binsID, soRec);
        if (inventoryAdjId != -1) {
            rec.setFieldValue('custbody_inventoryadjustment', inventoryAdjId);        
            nlapiSubmitRecord(rec, null, true);
        }
        //inventoryAdjId = createInvAdj(itemsArr, rec, binsID);
        //if (inventoryAdjId != -1) {
        //    rec.setFieldValue('custbody_inventoryadjustment', inventoryAdjId);
        //    duplicateSolines(soRec, itemsArr, binsID, rec);
        //    nlapiSubmitRecord(rec, null, true);
        //}

        response.write(inventoryAdjId);
    } catch (e) {
        response.write('error to create target record: ' + e);
    }
}

function getInventoryDetails(invDetailID) {
    var serials = [], filters = [], columns = [];

    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('quantity'));
    columns.push(new nlobjSearchColumn('expirationdate'));

    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];

    if (results != null) {
        results.forEach(function (line) {
            serials.push({
                serial: line.getValue('inventorynumber', 'inventorynumber'),
                quantity: line.getValue('quantity'),
                expirationdate: line.getValue('expirationdate')
            });
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
    var res = '';
    count = 0;
    results = nlapiSearchRecord('inventorynumber', null, filters, columns) || [];
    if (results.length > 0) {
        res = results[0].getValue('internalid');
        return res;
    }
    return '';
}
function createInvAdj(itemsArr, rec, binsID) {   
    try {
        var adjRec = nlapiCreateRecord('inventoryadjustment', { recordmode: "dynamic" });

        adjRec.setFieldValue('subsidiary', rec.getFieldValue('subsidiary'));
        adjRec.setFieldValue('account', 1348);

        for (i = 0; i < itemsArr.length; i++) {
            adjRec.selectNewLineItem('inventory');
            adjRec.setCurrentLineItemValue('inventory', 'item', itemsArr[i].itemID);
            adjRec.setCurrentLineItemValue('inventory', 'adjustqtyby', itemsArr[i].quantity);
            adjRec.setCurrentLineItemValue('inventory', 'location', itemsArr[i].location);

            // subrecord
            var compSubRecord = adjRec.createCurrentLineItemSubrecord('inventory', 'inventorydetail');
            var seraialsData = itemsArr[i].serials;
            for (var m = 0; m < seraialsData.length; m++) {
                compSubRecord.selectNewLineItem('inventoryassignment');
                compSubRecord.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', seraialsData[m].serial);
                compSubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', binsID);
                compSubRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', seraialsData[m].quantity);
                compSubRecord.setCurrentLineItemValue('inventoryassignment', 'expirationdate', seraialsData[m].expirationdate);
                compSubRecord.commitLineItem('inventoryassignment');
            }

            compSubRecord.commit();

            adjRec.commitLineItem('inventory');
        }

        var submitID = nlapiSubmitRecord(adjRec, null, true);
        nlapiLogExecution('debug', 'submitID', submitID);
        return submitID;
    } catch (e) {
        return -1;
    }
}
function duplicateSolines(soRec, itemsArr, binsID, rec) {
    //nlapiLogExecution('DEBUG', 'duplicateSolines()', 'run');

    for (var i = 0; i < itemsArr.length; i++) {
        soRec.selectNewLineItem('item');
        soRec.setCurrentLineItemValue('item', 'item', itemsArr[i].itemID);
        soRec.setCurrentLineItemValue('item', 'inventorylocation', itemsArr[i].location);
        soRec.setCurrentLineItemValue('item', 'inventorysubsidiary', rec.getFieldValue('subsidiary'));
        soRec.setCurrentLineItemValue('item', 'quantity', itemsArr[i].quantity);
        soRec.setCurrentLineItemValue('item', 'rate', 0);

        var seraialsData = itemsArr[i].serials;
        //nlapiLogExecution('DEBUG', 'seraialsData: ', seraialsData);

        var bodySubRecord = soRec.createCurrentLineItemSubrecord('item', 'inventorydetail');

        for (var j = 0; j < seraialsData.length; j++) {
            var inventoryID = getInventoryNumnerId(seraialsData[j].serial, itemsArr[i].itemID);
            bodySubRecord.selectNewLineItem('inventoryassignment');
            bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', inventoryID);
            //bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', binsID);
            bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', seraialsData[j].quantity);
            bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'expirationdate', seraialsData[j].expirationdate);
            bodySubRecord.commitLineItem('inventoryassignment');

        }

        bodySubRecord.commit();
        soRec.commitLineItem('item');
    }
    var submitId = nlapiSubmitRecord(soRec, null, true);
    nlapiLogExecution('DEBUG', 'submitId', submitId);
}
function searchBin(customer) {
    var filters = [new nlobjSearchFilter('custrecord_customer', null, 'anyof', customer)];

    var search = nlapiSearchRecord("bin", null, filters, null);
    var res = '';

    if (search.length > 0) {
        res = search[0].id
    }

    return res;
}
function createAndUpadteTran(itemsArr, rec, binsID, soRec) {
    try {
        var adjRec = createAdjHeader(rec, itemsArr[0].account);
        for (i = 0; i < itemsArr.length; i++) {
            var itemsArrLine = itemsArr[i];
            createAdjLine(itemsArrLine, adjRec, binsID)
            createSoLine(itemsArrLine, soRec, rec )
        }
        var submitID = nlapiSubmitRecord(adjRec, null, true);
        nlapiLogExecution('debug', 'adjRec', submitID);
        if (submitID != -1) {
            nlapiSubmitRecord(soRec, null, true);
            return submitID;
        }           
    } catch (e) {
        return e;
    }
}
function createAdjHeader(rec , account) {

    var adjRec = nlapiCreateRecord('inventoryadjustment', { recordmode: "dynamic" });
    adjRec.setFieldValue('subsidiary', rec.getFieldValue('subsidiary'));
    adjRec.setFieldValue('account', account);

    return adjRec
}
function createAdjLine(itemsArrLine, adjRec, binsID) {

    adjRec.selectNewLineItem('inventory');
    adjRec.setCurrentLineItemValue('inventory', 'item', itemsArrLine.itemID);
    adjRec.setCurrentLineItemValue('inventory', 'adjustqtyby', itemsArrLine.quantity);
    adjRec.setCurrentLineItemValue('inventory', 'location', itemsArrLine.location);
    // subrecord
    var compSubRecord = adjRec.createCurrentLineItemSubrecord('inventory', 'inventorydetail');
    var seraialsData = itemsArrLine.serials;
    for (var m = 0; m < seraialsData.length; m++) {
        compSubRecord.selectNewLineItem('inventoryassignment');
        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', seraialsData[m].serial);
        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', binsID);
        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', seraialsData[m].quantity);
        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'expirationdate', seraialsData[m].expirationdate);
        compSubRecord.commitLineItem('inventoryassignment');
    }

    compSubRecord.commit();
    adjRec.commitLineItem('inventory');
}
function createSoLine(itemsArrLine, soRec, rec) {

    soRec.selectNewLineItem('item');
    soRec.setCurrentLineItemValue('item', 'item', itemsArrLine.itemID);
    soRec.setCurrentLineItemValue('item', 'inventorylocation', itemsArrLine.location);
    soRec.setCurrentLineItemValue('item', 'inventorysubsidiary', rec.getFieldValue('subsidiary'));
    soRec.setCurrentLineItemValue('item', 'quantity', itemsArrLine.quantity);
    soRec.setCurrentLineItemValue('item', 'rate', 0);

    var seraialsData = itemsArrLine.serials;
    var bodySubRecord = soRec.createCurrentLineItemSubrecord('item', 'inventorydetail');
    for (var j = 0; j < seraialsData.length; j++) {
        var inventoryID = getInventoryNumnerId(seraialsData[j].serial, itemsArrLine.itemID);
        bodySubRecord.selectNewLineItem('inventoryassignment');
        bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', inventoryID);
        //bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', binsID);
        bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', seraialsData[j].quantity);
        bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'expirationdate', seraialsData[j].expirationdate);
        bodySubRecord.commitLineItem('inventoryassignment');

    }
    bodySubRecord.commit();
    soRec.commitLineItem('item');
}
function getDefualtData() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_customer_inventory_location');
    columns[1] = new nlobjSearchColumn('custrecord_inventory_account');

    var search = nlapiCreateSearch('customrecord_customer_inventory_adjustme', null, columns);

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

    if (s.length > 0) {
        results.push(s[0].getValue('custrecord_customer_inventory_location'))
        results.push(s[0].getValue('custrecord_inventory_account'))     
        }     
    return results;
}





