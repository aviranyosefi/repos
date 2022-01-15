function getAllSerials() {

    var searchSerials = nlapiLoadSearch(null, 'customsearch_ilo_icc_allserials_search');

    var allserials = [];
    var resultsSerials = [];
    var resultContacts = [];
    var searchid = 0;
    var resultset = searchSerials.runSearch();
    var rs;


    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (rs in resultslice) {

            allserials.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (allserials != null) {
        allserials.forEach(function (line) {


            resultsSerials.push({

                serialName: line.getValue('inventorynumber'),
                serialID: line.getValue('internalid'),
                serialLocation: line.getValue('location')


            });




        });

    };

    return resultsSerials;

}


/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       06 Sep 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function userEventBeforeLoad(type, form, request) {


}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function createInvAdjAfterSubmit(type) {

    var adjExecute = nlapiGetFieldValue('custbody_ilo_icc_execute_conversion');// EXECUTE CONVERSION
    var adjCreated = nlapiGetFieldValue('custbody_ilo_icc_created'); //CONVERSION CREATED

    var iccName = nlapiGetFieldValue('tranid');
    var iccInternalId = nlapiGetRecordId();
    var iccUrl = nlapiResolveURL('RECORD', 'customtransaction_ilo_icc_transaction', iccInternalId, false);

    var allSerials = getAllSerials();




    if ((adjExecute == 'T') && (adjCreated == 'F')) {

        var recid = nlapiGetRecordId();

        var adjData = [];


        //header fields
        var header_description = nlapiGetFieldValue('custbody_ilo_icc_description');
        var draft_invoice = nlapiGetFieldValue('custbody_ilo_icc_draft_inv');
        var draft_customer = nlapiGetFieldValue('custbody_ilo_icc_customer');
        var cogsAcc = nlapiGetFieldValue('custbody_ilo_icc_cogs_acc');
        var iccLocation = nlapiGetFieldValue('custbody_ilo_icc_location');
        var subsid = nlapiGetFieldValue('subsidiary');
        var iccDepartment = nlapiGetFieldValue('custbody_ilo_icc_department');


        var initialitem;
        var convertedItem;
        var descriptionLine;
        var units;
        var qtyonhand;
        var qty_out;
        var qty_in;
        var bin;
        var serialNum;
        var serialText;
        var initialCost;
        var convertedCost;


        var itemCount = nlapiGetLineItemCount('line'); // Get line Item count

        for (var i = 1; i <= itemCount; i++) {


            initialitem = nlapiGetLineItemValue('line', 'custcol_ilo_icc_initial_item', i);
            convertedItem = nlapiGetLineItemValue('line', 'custcol_ilo_icc_converted_item', i);
            descriptionLine = nlapiGetLineItemValue('line', 'custcol_ilo_icc_description', i);
            units = nlapiGetLineItemValue('line', 'custcol_ilo_icc_units', i);
            qtyonhand = nlapiGetLineItemValue('line', 'custcol_ilo_icc_qty_onhand', i);
            qty_out = nlapiGetLineItemValue('line', 'custcol_ilo_icc_qty_initial', i);
            qty_in = nlapiGetLineItemValue('line', 'custcol_ilo_icc_qty_converted', i);
            //bin = nlapiGetLineItemValue('line', 'custcol_ilo_icc_bin', i);
            serialNum = nlapiGetLineItemValue('line', 'custcol_ilo_icc_serial_num', i);
            serialText = nlapiGetLineItemText('line', 'custcol_ilo_icc_serial_num', i);
            serialMultipleOut = nlapiGetLineItemValue('line', 'custcol_ilo_icc_serials_out', i);
            serialMultipleIn = nlapiGetLineItemValue('line', 'custcol_ilo_icc_serials_in', i);
            newLot_expdate = nlapiGetLineItemValue('line', 'custcol_ilo_icc_expdate', i),
                initialCost = nlapiGetLineItemValue('line', 'custcol_ilo_icc_initital_cost', i);
            convertedCost = nlapiGetLineItemValue('line', 'custcol_ilo_icc_converted_cost', i);

            adjData.push({

                initialitem: initialitem,
                convertedItem: convertedItem,
                descriptionLine: descriptionLine,
                units: units,
                qtyonhand: qtyonhand,
                qty_out: pos_to_neg(parseInt(qty_out)),
                qty_in: parseInt(qty_in),
                //bin: bin,
                serialNum: serialNum,
                serialText: serialText,
                serialMultipleOut: serialMultipleOut,
                serialMultipleIn: serialMultipleIn,
                initialCost: initialCost,
                convertedCost: convertedCost,
                subsid: subsid,
                cogsAcc: cogsAcc,
                location_header: iccLocation,
                header_description: header_description,
                header_department: iccDepartment,
                draft_invoice: draft_invoice,
                draft_customer: draft_customer,
                lineNum: i,
                newLot_expdate: newLot_expdate



            });

        }


        //		
        //	

        //Creating Inventory Adjustments per Line

        adjData.forEach(function (element) {


            if (element.serialMultipleOut != null || element.serialMultipleOut != "[]") {

                nlapiLogExecution('DEBUG', 'is serial', 'is serial');

                try {
                    //OUT - WITH SERIAL
                    var adjRecOut = nlapiCreateRecord('inventoryadjustment');

                    adjRecOut.setFieldValue('subsidiary', element.subsid);
                    adjRecOut.setFieldValue('memo', element.header_description);
                    adjRecOut.setFieldValue('account', element.cogsAcc);
                    adjRecOut.setFieldValue('custbody_ilo_draft_invoice', element.draft_invoice);
                    adjRecOut.setFieldValue('customer', element.draft_customer);
                    adjRecOut.setFieldValue('department', element.header_department);


                    adjRecOut.setFieldValue('custbody_ilo_icc_created_from', iccInternalId);

                    adjRecOut.selectNewLineItem('inventory');
                    adjRecOut.setCurrentLineItemValue('inventory', 'item', element.initialitem);
                    adjRecOut.setCurrentLineItemValue('inventory', 'memo', element.descriptionLine);
                    adjRecOut.setCurrentLineItemValue('inventory', 'adjustqtyby', element.qty_out);
                    adjRecOut.setCurrentLineItemValue('inventory', 'location', element.location_header);

                    var compSubRecord = adjRecOut.createCurrentLineItemSubrecord('inventory', 'inventorydetail');


                    var serialLocation = element.location_header
                    var serialMultipleOut = element.serialMultipleOut.split('\u0005');

                    var serialObjOut = makeSerialObj(serialMultipleOut, allSerials, serialLocation);

                    nlapiLogExecution('debug', 'serialObjOut', JSON.stringify(serialObjOut));

                    //check if this is good!
                    for (var i = 0; i < serialObjOut.length; i++) {

                        nlapiLogExecution('debug', 'element.qty_out', element.qty_out)

                        compSubRecord.selectNewLineItem('inventoryassignment');
                        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', serialObjOut[i].serialID);
                        //compSubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', element.bin);
                        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', element.qty_out);
                        compSubRecord.commitLineItem('inventoryassignment');

                    }

                    compSubRecord.commit();

                    adjRecOut.commitLineItem('inventory');
                    var adjOut = nlapiSubmitRecord(adjRecOut);

                    var lineNumber = element.lineNum;
                    updateParentRecOut(adjOut, recid, lineNumber);
                    nlapiSubmitRecord(adjRecOut);
                }
                catch (err) {
                    nlapiLogExecution('DEBUG', 'err(inventory detail out - serialized)', err);
                }
            }

            if (element.serialMultipleOut == null || element.serialMultipleOut == "[]") {
                nlapiLogExecution('DEBUG', 'element.serialMultipleOut', element.serialMultipleOut);

                try {
                    //OUT - NO SERIAL
                    var adjRecOut = nlapiCreateRecord('inventoryadjustment', { recordmode: 'dynamic' });

                    adjRecOut.setFieldValue('subsidiary', element.subsid);
                    adjRecOut.setFieldValue('memo', element.header_description);
                    adjRecOut.setFieldValue('account', element.cogsAcc);
                    adjRecOut.setFieldValue('custbody_ilo_draft_invoice', element.draft_invoice);
                    adjRecOut.setFieldValue('customer', element.draft_customer);
                    adjRecOut.setFieldValue('department', element.header_department);


                    adjRecOut.setFieldValue('custbody_ilo_icc_created_from', iccInternalId);



                    adjRecOut.selectNewLineItem('inventory');
                    adjRecOut.setCurrentLineItemValue('inventory', 'item', element.initialitem);
                    adjRecOut.setCurrentLineItemValue('inventory', 'memo', element.descriptionLine);
                    adjRecOut.setCurrentLineItemValue('inventory', 'adjustqtyby', element.qty_out);
                    adjRecOut.setCurrentLineItemValue('inventory', 'location', element.location_header);

                    adjRecOut.commitLineItem('inventory');
                    var adjOut = nlapiSubmitRecord(adjRecOut);

                    var lineNumber = element.lineNum;
                    updateParentRecOut(adjOut, recid, lineNumber);

                    serverTimeOut();



                }
                catch (err) {
                    nlapiLogExecution('DEBUG', 'err - No Serial out', err);
                }


            }


            if (element.serialMultipleIn != null || element.serialMultipleIn != "[]") {
                nlapiLogExecution('DEBUG', 'element.serialMultipleIn', element.serialMultipleIn);
                nlapiLogExecution('DEBUG', 'is serial', 'is serial');

                try {
                    //IN - WITH SERIAL
                    var adjRecIn = nlapiCreateRecord('inventoryadjustment', { recordmode: 'dynamic' });

                    adjRecIn.setFieldValue('subsidiary', element.subsid);
                    adjRecIn.setFieldValue('memo', element.header_description);
                    adjRecIn.setFieldValue('account', element.cogsAcc);
                    adjRecIn.setFieldValue('custbody_ilo_draft_invoice', element.draft_invoice);
                    adjRecIn.setFieldValue('customer', element.draft_customer);
                    adjRecIn.setFieldValue('department', element.header_department);

                    adjRecIn.setFieldValue('custbody_ilo_icc_created_from', iccInternalId);


                    adjRecIn.selectNewLineItem('inventory');
                    adjRecIn.setCurrentLineItemValue('inventory', 'item', element.convertedItem);
                    adjRecIn.setCurrentLineItemValue('inventory', 'memo', element.descriptionLine);
                    adjRecIn.setCurrentLineItemValue('inventory', 'adjustqtyby', element.qty_in);
                    adjRecIn.setCurrentLineItemValue('inventory', 'location', element.location_header);
                    adjRecIn.setCurrentLineItemValue('inventory', 'unitcost', element.convertedCost);







                    var compSubRecord = adjRecIn.createCurrentLineItemSubrecord('inventory', 'inventorydetail');


                    var serialObjIn = element.serialMultipleIn.split('\u0005');

                    for (var i = 0; i < serialObjIn.length; i++) {

                        compSubRecord.selectNewLineItem('inventoryassignment');
                        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', serialObjIn[i]);
                        //compSubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', element.bin);
                        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', element.qty_in);
                        compSubRecord.setCurrentLineItemValue('inventoryassignment', 'expirationdate', nlapiStringToDate(element.newLot_expdate))
                        compSubRecord.commitLineItem('inventoryassignment');


                    }

                    compSubRecord.commit();

                    adjRecIn.commitLineItem('inventory');

                    var adjIn = nlapiSubmitRecord(adjRecIn);

                    var lineNumber = element.lineNum;
                    updateParentRecIn(adjIn, recid, lineNumber);
                }
                catch (err) {
                    nlapiLogExecution('DEBUG', 'err(inventory detail in - serialized)', err);
                }
            }

            if (element.serialMultipleIn == null || element.serialMultipleIn == "[]") {

                try {
                    //In - NO SERIAL
                    var adjRecIn = nlapiCreateRecord('inventoryadjustment', { recordmode: 'dynamic' });

                    adjRecIn.setFieldValue('subsidiary', element.subsid);
                    adjRecIn.setFieldValue('memo', element.header_description);
                    adjRecIn.setFieldValue('account', element.cogsAcc);
                    adjRecIn.setFieldValue('custbody_ilo_draft_invoice', element.draft_invoice);
                    adjRecIn.setFieldValue('customer', element.draft_customer);
                    adjRecIn.setFieldValue('department', element.header_department);

                    adjRecIn.setFieldValue('custbody_ilo_icc_created_from', iccInternalId);


                    adjRecIn.selectNewLineItem('inventory');
                    adjRecIn.setCurrentLineItemValue('inventory', 'item', element.convertedItem);
                    adjRecIn.setCurrentLineItemValue('inventory', 'memo', element.descriptionLine);
                    adjRecIn.setCurrentLineItemValue('inventory', 'adjustqtyby', element.qty_in);
                    adjRecIn.setCurrentLineItemValue('inventory', 'location', element.location_header);
                    adjRecIn.setCurrentLineItemValue('inventory', 'unitcost', element.convertedCost);

                    adjRecIn.commitLineItem('inventory');
                    var adjIn = nlapiSubmitRecord(adjRecIn);
                    var lineNumber = element.lineNum;
                    updateParentRecIn(adjIn, recid, lineNumber);
                }
                catch (err) {
                    nlapiLogExecution('DEBUG', 'err - No Serial out', err);
                }

            }


        });
        var jstr = JSON.stringify(adjData);

        nlapiLogExecution('DEBUG', 'recid', recid);
        nlapiLogExecution('DEBUG', 'adjData', jstr);
    } else {

        nlapiLogExecution('DEBUG', 'did not create adjustments', 'did not create adjustments')
    }

}





function pos_to_neg(num) {
    return -Math.abs(num);
}



function updateParentRecOut(adjOut, recid, lineNumber) {
    try {
        var iccRec = nlapiLoadRecord('customtransaction_ilo_icc_transaction', recid);
        var viewUrl = nlapiResolveURL('RECORD', 'inventoryadjustment', adjOut, false);
        iccRec.setLineItemValue('line', 'custcol_ilo_icc_adj_out', lineNumber, viewUrl);
        iccRec.setFieldValue('custbody_ilo_icc_created', 'T')
        nlapiSubmitRecord(iccRec);
    }
    catch (err) {
        nlapiLogExecution('DEBUG', 'updateParentRecOut -err', err);
    }
}

function updateParentRecIn(adjIn, recid, lineNumber) {
    try {
        var iccRec = nlapiLoadRecord('customtransaction_ilo_icc_transaction', recid);
        var viewUrl = nlapiResolveURL('RECORD', 'inventoryadjustment', adjIn, false);
        iccRec.setLineItemValue('line', 'custcol_ilo_icc_adj_in', lineNumber, viewUrl);
        iccRec.setFieldValue('custbody_ilo_icc_created', 'T')
        nlapiSubmitRecord(iccRec);
    }
    catch (err) {
        nlapiLogExecution('DEBUG', 'updateParentRecIn -err', err);
    }
}


function makeSerialObj(arr, allSerials, serialLocation) {

    var serialsObj = [];
    nlapiLogExecution('debug', 'makeSerialObj - arr', arr.length);
    nlapiLogExecution('debug', 'makeSerialObj - allSerials', allSerials.length);
    nlapiLogExecution('debug', 'makeSerialObj - serialLocation', serialLocation.length);
    for (var i = 0; i < allSerials.length; i++) {

        for (var x = 0; x < arr.length; x++) {

            if ((arr[x] == allSerials[i].serialName) && (serialLocation == allSerials[i].serialLocation)) {


                serialsObj.push({

                    serialName: arr[x],
                    serialID: allSerials[i].serialID

                });

            }

        }

    }
    return serialsObj;
}


function serverTimeOut() {

    var a;

    for (var i = 0; i < 50000; i++) {

        if (i <= 49999) {

            a = a;
        }
    }


}