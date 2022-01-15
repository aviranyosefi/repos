function beforeLoad_addButton(type, form) { 
    if (type == 'view') {   
            form.setScript('customscript_itf_sticker_print_cs'); // client script id
            form.addButton('custpage_button_print', 'Print Stiker', 'printButton()');
        }
}

function beforeSubmit(type) {
    if (type != 'delete') {
        try {
            var Data = '';
            var currQty=0;
            var count = nlapiGetLineItemCount('item');
            if (count > 0) {
                for (var i = 1; i <= count; i++) {
                    var subrecord = '';
                    subrecord = nlapiViewLineItemSubrecord('item', 'inventorydetail', i);
                    ItemType = nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', i), 'custitem_product_line', true);

                    //ItemType = nlapiGetLineItemValue('item', 'custcol_product_linedisp', i);
                    ItemName = nlapiGetLineItemValue('item', 'description', i);
                    //ItemName = nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', i), 'description');
                    //if (ItemName != null && ItemName != undefined && ItemName[ItemName.length - 1] == '\n') {
                    //    ItemName = ItemName.substring(0, ItemName.length - 2);
                    //}
                    ItemBarcode = nlapiGetLineItemValue('item', 'custcol_barcode', i);
                    if (subrecord != "" && subrecord != null) {
                        var invDetailID = subrecord.id;
                        if (invDetailID != "" && invDetailID != null) {                        
                            var serials = getInventoryDetails(invDetailID);
                            if (serials != [] && serials != null) {                                
                                for (var m = 0; m < serials.length; m++) {
                                    var NunerOfpack = NoOfPack(ItemType, serials[m].qty);
                                    var qty = serials[m].qty;
                                    for (var j = 1; j <= NunerOfpack[0]; j++) {                                       
                                        if (qty - NunerOfpack[1] > 0) {
                                            currQty = NunerOfpack[1];
                                            qty = qty - currQty;
                                        }
                                        else {
                                            if (j != 1) {
                                                currQty = serials[m].qty - (NunerOfpack[1] * (j - 1));
                                                nlapiLogExecution('debug', ' J != 1 ', ' qty= ' + qty);
                                                nlapiLogExecution('debug', ' J != 1 ', ' NunerOfpack[1]= ' + NunerOfpack[1]);
                                                nlapiLogExecution('debug', ' J != 1 ', ' j= ' + j);
                                            }
                                            else {
                                                currQty = qty;
                                                nlapiLogExecution('debug', ' else ', ' j = 1, j = ' + j);
                                            }
                                            
                                        }
                                        Data += ItemType + '^';
                                        Data += ItemName + '^';
                                        Data += serials[m].inventorynumber + '^';
                                        Data += serials[m].exp + '^';
                                        Data += currQty + '/' + serials[m].qty + '^';
                                        Data += ItemBarcode + '^';                                        
                                        Data += j + '/' + NunerOfpack[0] + '~~';                                     
                                    }
                                }
                            }
                        }
                    }  
                } //   for (var i = 1; i <= count; i++) 
                nlapiSetFieldValue('custbody_packages_data' , Data)
            } //   if (count > 0)
            nlapiLogExecution('debug', 'Data', Data);

        } catch (e) {
            nlapiLogExecution('debug', 'error', e);
        }
    }
}

function NoOfPack(type, qty) {
   
    if (type == 'Inflorescence') {
        var delimiter = nlapiLookupField('customrecord_box_capacity', '1', 'custrecord_inflorescence_box_capacity');
    }
    else {
        var delimiter = nlapiLookupField('customrecord_box_capacity', '1', 'custrecord_cannabis_box_capacity');
    }
    var numberofpacks = [];
    numberofpacks[0] = Math.ceil(qty / delimiter);
    numberofpacks[1] = delimiter;
    return numberofpacks;
}

function getInventoryDetails(invDetailID) {
    //var serials = [];
    ////hunt for related inventory detail records
    //filters = [];
    //columns = [];
    //filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    //columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));
    //columns.push(new nlobjSearchColumn('quantity'));
    //columns.push(new nlobjSearchColumn('expirationdate'));

    //count = 0;
    //results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    //var cols = results.getColumns();
    //if (results != null) {
    //    results.forEach(function (line) {
    //        var inventname = line.getValue('inventorynumber', 'inventorynumber');
    //        var qty = line.getValue('quantity');
    //        var expd = line.getValue(cols[2]);
    //        serials.push({
    //            inventorynumber: inventname,
    //            qty: qty,
    //            exp: expd
    //        })
            
    //        count++;
    //    });
    //}
    //nlapiLogExecution('debug', ' serials serials', JSON.stringify(serials));
    //return serials;

    //////////////

    var serials = [];
  
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('quantity'));
    columns.push(new nlobjSearchColumn('expirationdate'));

    var search = nlapiCreateSearch('inventorydetail', filters, columns);
 
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        //var cols = resultslice.getColumns();
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {

        for (var i = 0; i < returnSearchResults.length; i++) {
            var inventname = returnSearchResults[i].getValue('inventorynumber', 'inventorynumber');
            var qty = returnSearchResults[i].getValue('quantity');
            var exp = returnSearchResults[i].getValue('expirationdate');

            serials.push({
                inventorynumber: inventname,
                qty: qty,
                exp: exp
            })

        }
        nlapiLogExecution('debug', ' serials serials', JSON.stringify(serials));       
    }
    return serials;
}







