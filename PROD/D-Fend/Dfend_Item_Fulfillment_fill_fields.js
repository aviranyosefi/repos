function fill() {
    try {

        var serial, serials, subrecord;
        var isUpdate = false;
        var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
        var itemCount = rec.getLineItemCount('item');

        var gruop = [];
        var createdfrom = rec.getFieldValue('createdfrom');
        if (createdfrom != "" && createdfrom != null && createdfrom != undefined) {
            gruop = Itemsgroup(createdfrom)            
            if (itemCount > 0) {
                for (var i = 1; i <= itemCount; i++) {
                    //            
                    var item = rec.getLineItemValue('item', 'item', i);
                    for (var t = 0; t < gruop.length; t++) {
                        if (item == gruop[t].item) {
                            nlapiLogExecution('debug', 'equals()', item)
                            rec.setLineItemValue('item', 'custcol_parent_grop', i, 'aviran');
                            isUpdate = true;
                            break;
                        }
                    }
                    //                   
              
                        var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i); 
                        //subrecord = rec.getLineItemValue('item', 'inventorydetail', i); 
                        if (subrecord != "" && subrecord != null) {
                            var invDetailID = subrecord.id;
                            if (invDetailID != "" && invDetailID != null) {
                                serials = "";
                                serials = getInventoryDetails(invDetailID);
                                nlapiLogExecution('debug', 'serials', serials)
                                if (serials != "" && serials != null) {
                                    rec.setLineItemValue('item', 'custcol_invserials', i, serials);
                                    isUpdate = true;
                                   
                                }
                            }
                        }
                    
                }
                if (isUpdate) { nlapiSubmitRecord(rec) };
            }
        }
    } catch (err) {
        nlapiLogExecution('error', 'fillFields()', err)
    }
}


function getInventoryDetails(invDetailID) {
    var serials = "";
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('quantity'));
    count = 0;
    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    if (results != null) {
        results.forEach(function (line) {
            var inventname = line.getValue('inventorynumber', 'inventorynumber');
            var quantity = line.getValue('quantity');
            //           if (serials.length > 990)
            //               return serials;
            if (quantity != null && quantity > 1)
                serials += inventname + " " + quantity + "<br>";
            else
                serials += inventname + " ";
            count++;
        });
    }

    return serials;
}

function Itemsgroup(createdfrom) {
    var gruop = [];
    var SOrec = nlapiLoadRecord('salesorder', createdfrom);
    var SOitemCount = SOrec.getLineItemCount('item');
    for (var j = 1; j <= SOitemCount; j++) {
        ingroup = SOrec.getLineItemValue('item', 'ingroup', j);
        if (ingroup == null) {
            if (SOrec.getLineItemValue('item', 'itemtype', j) == 'Group') {
                for (var h = j + 1; h <= SOitemCount; h++) {
                    if (SOrec.getLineItemValue('item', 'ingroup', h) == 'T' && SOrec.getLineItemValue('item', 'itemtype', h) != 'EndGroup') {
                        gruop.push({
                            parent: SOrec.getLineItemValue('item', 'item_display', j) + ' ' + SOrec.getLineItemValue('item', 'description', j) ,
                            item: SOrec.getLineItemValue('item', 'item', h)
                        });
                    }
                    else if (SOrec.getLineItemValue('item', 'itemtype', h) == 'EndGroup') { j = h + 1; }
                }
            }
        }
    }
    return gruop
}

function fillbefore() {
    try {

        var serial, serials, subrecord;
        var isUpdate = false;
        //var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
        var itemCount = nlapiGetLineItemCount('item');

        var gruop = [];
        var createdfrom = nlapiGetFieldValue('createdfrom');
        if (createdfrom != "" && createdfrom != null && createdfrom != undefined) {
            gruop = Itemsgroup(createdfrom)
            if (itemCount > 0) {
                for (var i = 1; i <= itemCount; i++) {
                    //            
                    var item = nlapiGetLineItemValue('item', 'item', i);
                    for (var t = 0; t < gruop.length; t++) {
                        if (item == gruop[t].item) {
                            nlapiLogExecution('debug', 'equals()', item)
                            nlapiSetLineItemValue('item', 'custcol_parent_grop', i, gruop[t].parent);
                            isUpdate = true;
                            break;
                        }
                    }
                    //
                    if (serial == "" || serial == null) {
                        subrecord = "";
                        subrecord = nlapiViewLineItemSubrecord('item', 'inventorydetail', i);
                        //subrecord = rec.getLineItemValue('item', 'inventorydetail', i); 
                        if (subrecord != "" && subrecord != null) {
                            var invDetailID = subrecord.id;
                            if (invDetailID != "" && invDetailID != null) {
                                serials = "";
                                serials = getInventoryDetails(invDetailID);
                                nlapiLogExecution('debug', 'serials', serials)
                                if (serials != "" && serials != null) {
                                    nlapiSetLineItemValue('item', 'custcol_tt', i, serials);
                                    isUpdate = true;
                                }
                            }
                        }
                    }
                }             
            }
        }
    } catch (err) {
        nlapiLogExecution('error', 'fillFields()', err)
    }
}

