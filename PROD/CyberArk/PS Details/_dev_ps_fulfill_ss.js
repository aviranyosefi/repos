var currentContext = nlapiGetContext();

function createFulfillments() {

    var fulfillRecs = currentContext.getSetting('SCRIPT', 'custscript_ps_recs_tofulfill');
    var dateToUse = currentContext.getSetting('SCRIPT', 'custscript_ps_date_tofulfill')
    var batchName = currentContext.getSetting('SCRIPT', 'custscript_ps_batchid_tofulfill')

    nlapiLogExecution('debug', 'dateToUse', dateToUse);
    nlapiLogExecution('debug', 'fulfillRecs', fulfillRecs)
    nlapiLogExecution('debug', 'batchName', batchName)
    var recs = JSON.parse(fulfillRecs);
    var recs = validateSheet(recs);
    nlapiLogExecution('debug', 'invoiceRecs after validateSheet ', recs)
    var recIDS = pluck(recs, 'SO_id');

    var allRecs = {};
    recIDS.forEach(function (rec) {
        allRecs[rec] = [];
    })
    var recKeys = Object.keys(allRecs);


    var psTraining_item = '1770';
    var psItemsArr = getAllPSItems();
    psItemsArr.push(psTraining_item);




    //this loop is to create an object with arrays combining timesheets if they are from the same sales order and have the same item
    for (var i = 0; i < recs.length; i++) {
        for (var j = 0; j < recKeys.length; j++) {

            if (recs[i].SO_id == recKeys[j]) {
                allRecs[recKeys[j]].push(recs[i]);
            }
        }
    }



    recKeys.forEach(function (so_rec) {

        var psSheetsError = [];

        try {


            var fulFillRec = nlapiTransformRecord('salesorder', so_rec, 'itemfulfillment');
            fulFillRec.setFieldValue('trandate', nlapiStringToDate(dateToUse))
            var lineCount = fulFillRec.getLineItemCount('item');

            var currObj = allRecs[so_rec];

            nlapiLogExecution('debug', 'currobj', JSON.stringify(currObj, null, 2))
            var psSheetID = [];
            var itemsFromSheet = [];
            var itemsToFulfill = pluck(currObj, 'psItem');
            var allItems = {}
            var uniqueItemsToFulfill = itemsToFulfill.filter(function (item, pos) {
                return itemsToFulfill.indexOf(item) == pos;
            })
            uniqueItemsToFulfill.forEach(function (item) {
                allItems[item] = [];
            })


            //nlapiLogExecution('debug', 'allItems', JSON.stringify(allItems, null, 2))

            for (var x = 0; x < currObj.length; x++) {

                var currItem = currObj[x].psItem;
                itemsFromSheet.push(currItem);
                //var currServiceNum = currObj[x].servicenum
                var currDuration = parseFloat(currObj[x].duration);
                var itemsToWork = []
                if (uniqueItemsToFulfill.indexOf(currObj[x].psItem) != -1) {
                    for (var m = 0; m < currObj.length; m++) {
                        itemsToWork.push({
                            item: currObj[m].psItem,
                            qty: parseFloat(currObj[m].duration)
                        })
                    }
                }

                //nlapiLogExecution('debug', 'itemsToWork', JSON.stringify(itemsToWork, null, 2))

                var toUseArr = itemsToWork.reduce(function (r, a) {
                    r[a.item] = r[a.item] || [];
                    r[a.item].push(a);
                    return r;
                }, Object.create(null));


                var res = [];

                var keysToUse = Object.keys(toUseArr)
                for (var y = 0; y < keysToUse.length; y++) {

                    var sortOut = getAllQty(toUseArr[keysToUse[y]]);
                    res.push(sortOut)
                }

                //nlapiLogExecution('debug', 'res', JSON.stringify(res, null, 2))

                var currLineCount = fulFillRec.getLineItemCount('item');

                var fulfilled = 0;
                var remainder;

                for (var i = 0; i < currLineCount; i++) {

                    for (var j = 0; j < res.length; j++) {

                        var currLineItem = fulFillRec.getLineItemValue('item', 'item', i + 1);
                        var currLineRemain = fulFillRec.getLineItemValue('item', 'quantityremaining', i + 1);

                        var qtyToUse = [];

                        remainder = res[j].qty

                        if (currLineItem == res[j].item) {

                            if (currLineRemain > remainder && fulfilled === 0) {
                                fulFillRec.setLineItemValue('item', 'quantity', i + 1, res[j].qty);
                                nlapiLogExecution('debug', '----ALL FITS!!----', fulfilled)
                                res[j].qty = 0;
                                remainder = 0;
                                continue;
                            }
                            if (parseFloat(currLineRemain) === parseFloat(remainder) && fulfilled === 0) {
                                fulFillRec.setLineItemValue('item', 'quantity', i + 1, res[j].qty);
                                nlapiLogExecution('debug', '----ALL FITS!!----', fulfilled)
                                res[j].qty = 0;
                                remainder = 0;
                                continue;
                            }

                            nlapiLogExecution('debug', 'currLineItem currLineRemain CurrLine', currLineItem + '----' + currLineRemain + '----lineNum' + i + 1)
                            nlapiLogExecution('debug', '----remainder----', remainder)
                            nlapiLogExecution('debug', '----fulfilled----', fulfilled)

                            if (fulfilled !== 0 && parseFloat(remainder) === parseFloat(currLineRemain)) {

                                nlapiLogExecution('debug', '----fulfilled IS NOT ZERO!!----', fulfilled)
                                nlapiLogExecution('debug', 'SETTING THIS VALUE FOR BIGGER THAN FULFILLED NOT ZERO ', remainder - fulfilled)
                                fulFillRec.setLineItemValue('item', 'quantity', i + 1, remainder - fulfilled);
                                fulfilled = fulfilled + parseFloat(currLineRemain)
                                nlapiLogExecution('debug', 'fulfilled', fulfilled)
                                nlapiLogExecution('debug', 'remainder', remainder)
                                nlapiLogExecution('debug', 'qty remaining bigger than', remainder - fulfilled)
                                continue;
                            }


                            if (remainder > currLineRemain && fulfilled === 0) {

                                nlapiLogExecution('debug', 'SETTING THIS VALUE FOR BIGGER THAN ', currLineRemain)
                                fulFillRec.setLineItemValue('item', 'quantity', i + 1, currLineRemain);
                                remainder = remainder - currLineRemain;
                                fulfilled = fulfilled + parseFloat(currLineRemain)
                                nlapiLogExecution('debug', 'fulfilled', fulfilled)
                                nlapiLogExecution('debug', 'remainder', remainder)
                                nlapiLogExecution('debug', 'qty remaining bigger than', currLineRemain)
                                continue;
                            }

                            if (remainder > currLineRemain && fulfilled !== 0) {

                                nlapiLogExecution('debug', 'SETTING THIS VALUE FOR BIGGER THAN FULFILLED NOT ZERO ', remainder - fulfilled)
                                fulFillRec.setLineItemValue('item', 'quantity', i + 1, remainder - fulfilled);
                                fulfilled = fulfilled + parseFloat(currLineRemain)
                                nlapiLogExecution('debug', 'fulfilled', fulfilled)
                                nlapiLogExecution('debug', 'remainder', remainder)
                                nlapiLogExecution('debug', 'qty remaining bigger than', remainder - fulfilled)
                                continue;
                            }

                            if (remainder < currLineRemain) {

                                nlapiLogExecution('debug', 'SETTING THIS VALUE FOR LESS THAN ', remainder - fulfilled)
                                fulFillRec.setLineItemValue('item', 'quantity', i + 1, remainder - fulfilled);
                                //qty = qty - currLineRemain;
                                nlapiLogExecution('debug', 'fulfilled', fulfilled)
                                nlapiLogExecution('debug', 'qty remaining less than', remainder)
                            }



                        }


                    }//loop over res

                    if (itemsToFulfill.indexOf(currLineItem) == -1) {

                        //	nlapiLogExecution('debug', 'psItemsArr does not exsist', currLineItem)
                        fulFillRec.setLineItemValue('item', 'itemreceive', i + 1, 'F');
                    }
                }// loop over lineitems


                //var itemOnLine = fulFillRec.getLineItemValue('item', 'item', i+1)
                //nlapiLogExecution('debug', 'item on Line', itemOnLine)
                //nlapiLogExecution('debug', 'itemsFromSheet', JSON.stringify(itemsFromSheet))



                psSheetID.push(currObj[x].internalid);

                //nlapiLogExecution('debug', 'psSheetID -arr', JSON.stringify(psSheetID))

            }// end of loop over currObj


            //Last check for Israeli exchange rates adjustments
            var checkSubsid = nlapiLookupField('salesorder', so_rec, 'subsidiary')

            if (checkSubsid == '22') {

                var ogSORec = nlapiLoadRecord('salesorder', so_rec);
                var soBillCountry = ogSORec.getFieldValue('billcountry');
                var soCurrency = ogSORec.getFieldText('currency');
                var soCustomer = ogSORec.getFieldValue('entity');

                var checkIfAdjust = nlapiLookupField('customer', soCustomer, 'custentity_ps_adjust_rate');

                if (checkIfAdjust == 'T') {
                    nlapiLogExecution('debug', 'checkIfAdjust', true)

                    var newExRate = nlapiExchangeRate(soCurrency, 'USD', dateToUse);
                    fulFillRec.setFieldValue('exchangerate', newExRate)

                    nlapiLogExecution('debug', 'checkIfAdjust', 'exrate adjusted!')
                }

            }

            fulFillRec.setFieldValue('custbody_ps_fulfillment_batch', batchName)

            var fullfillId = nlapiSubmitRecord(fulFillRec);


            for (var x = 0; x < psSheetID.length; x++) {

                var fields = new Array();
                fields[0] = 'custbody_ps_fulfillment_trx';
                fields[1] = 'custbody_ps_fulfillment_batch';
                var values = new Array();
                values[0] = fullfillId;
                values[1] = batchName;

                nlapiSubmitField('customtransaction_ps_timesheet_report', psSheetID[x], fields, values);
            }

            nlapiLogExecution('debug', 'fullfillId', 'fullfillId would be submitted')
            var context = nlapiGetContext();
            var usageRemaining = context.getRemainingUsage();
            nlapiLogExecution('debug', 'usageRemaining', usageRemaining)
        } catch (err) {
            nlapiLogExecution('debug', 'error in fulfillment', err);
            nlapiLogExecution('debug', 'salesOrderID', so_rec)
            var psSheetsToUpdate = getSelectedSheets(so_rec)
            nlapiLogExecution('debug', 'PS_sheets_to_update', JSON.stringify(psSheetsToUpdate))
            for (var x = 0; x < psSheetsToUpdate.length; x++) {
                nlapiSubmitField('customtransaction_ps_timesheet_report', psSheetsToUpdate[x], 'custbody_ps_fulfillment_error_message', err.toString());
            }
            //if any error occurs during the foreach loop the error is caught and by using 'return' it acts as 'conitnue' like in a normal for loop
            return;
        }

    });

}


function validateSheet(invoiceRecs) {
    var newRecs = [];
    var sheetsId = pluck(invoiceRecs, 'internalid');
    for (var i = 0; i < sheetsId.length; i++) {
        var ps_fulfillment_number = nlapiLookupField('customtransaction_ps_timesheet_report', sheetsId[i], 'custbody_ps_fulfillment_trx')
        if (ps_fulfillment_number == '' || ps_fulfillment_number == null || ps_fulfillment_number == undefined) {
            newRecs.push(invoiceRecs[i])
        }
    }
    return newRecs;
}

function pluck(array, key) {
    return array.map(function (obj) {
        return obj[key];
    });
}

function getAllPSItems() {

    try {

        var res = [];

        var res = [];
        var columns = new Array();
        columns[0] = new nlobjSearchColumn('internalid');

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custitem_cbr_item_category', null, 'anyof', ['8', '17']); //Professional Services & TAM



        // Create the saved search
        var search = nlapiCreateSearch('item', filters, columns);
        var runSearch = search.runSearch();
        var results = runSearch.getResults(0, 1000);

        if (results != null) {

            results.forEach(function (element) {

                res.push(element.getValue('internalid'));
            });

        }

        return res;
    } catch (err) {
        return res;
    }

}

function add(a, b) {
    return a + b;
}

function getSelectedSheets(selected) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custbody_ps_order', null, 'anyof', selected)
    filters[1] = new nlobjSearchFilter('custbody_ps_exclude_from_fulfillment', null, 'is', 'F')

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');

    var savedSearch = nlapiCreateSearch('customtransaction_ps_timesheet_report', filters, columns)


    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = [];
    var cols = savedSearch.getColumns();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        returnSearchResults.forEach(function (element) {

            results.push(element.getValue('internalid'));
        });

    }


    var uniqueArray = results.filter(function (item, pos) {
        return results.indexOf(item) == pos;
    })

    return uniqueArray;

}

function fifoLines(res, fulFillRec) {

    var currLineCount = fulFillRec.getLineItemCount('item');

    var fifoArr = [];
    var available = [];

    var item = res.item;
    var qty = res.qty;
    var remainder;

    nlapiLogExecution('debug', 'res', JSON.stringify(res))


    var fulfilled = 0;
    var remainder = qty

    for (var i = 0; i < currLineCount; i++) {

        var currLineItem = fulFillRec.getLineItemValue('item', 'item', i + 1);
        var currLineRemain = fulFillRec.getLineItemValue('item', 'quantityremaining', i + 1);



        if (currLineItem == item) {


            nlapiLogExecution('debug', 'currLineItem currLineRemain CurrLine', currLineItem + '----' + currLineRemain + '----lineNum' + i + 1)
            nlapiLogExecution('debug', '----remainder----', remainder)

            if (remainder > currLineRemain) {

                nlapiLogExecution('debug', 'SETTING THIS VALUE FOR BIGGER THAN ', currLineRemain)
                fulFillRec.setLineItemValue('item', 'quantity', i + 1, currLineRemain);
                remainder = remainder - currLineRemain;
                fulfilled = fulfilled + parseFloat(currLineRemain)
                nlapiLogExecution('debug', 'fulfilled', fulfilled)
                nlapiLogExecution('debug', 'qty remaining bigger than', currLineRemain)


            }

            if (remainder < currLineRemain) {

                nlapiLogExecution('debug', 'SETTING THIS VALUE FOR LESS THAN ', remainder)
                fulFillRec.setLineItemValue('item', 'quantity', i + 1, remainder);
                //qty = qty - currLineRemain;
                nlapiLogExecution('debug', 'fulfilled', fulfilled)
                nlapiLogExecution('debug', 'qty remaining less than', remainder)
            }

        }
    }


    //nlapiLogExecution('debug', 'fifoArr', JSON.stringify(fifoArr))


}

function getAllQty(arr) {

    var qtys = [];

    for (var i = 0; i < arr.length; i++) {
        qtys.push(arr[i].qty)
    }


    var qtyToUse = qtys.reduce(add, 0);
    var obj = {

        item: arr[0].item,
        qty: qtyToUse

    }

    return obj;

}