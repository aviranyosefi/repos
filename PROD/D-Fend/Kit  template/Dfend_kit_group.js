var bundle_number = '';
var j;
var description = '';
var lineCore = '';
var sumOfRate = 0;
var sumOfAmount = 0;
var prodocts_to = '';
var opt_prodocts_to = '';
var line = 1;
var recType = nlapiGetRecordType();
var KitExists = false;
var PercentForDebit;
var soRec;
var createdfrom;
var qty_to_bill;
var soRec = null;

function beforeLoad_addButton(type, form) {
    if (type == 'view' && recType == 'itemfulfillment') {
        form.setScript('customscript_kit_print_client'); // client script id
        form.addButton('custpage_button_print', 'Print ', 'printButton()');
        //form.addButton('custpage_button_print', 'CI Print ', 'printButtonCI()');
    }
    else if (type == 'view' && recType == 'estimate') {
        var role = nlapiGetContext().role;
        if (role == '3' || nlapiGetFieldValue('custbody_trx_approval_status') == '2' || nlapiLookupField('role', role, 'custrecord_unapproved_quote') == 'T') {
            form.setScript('customscript_kit_print_client'); // client script id
            form.addButton('custpage_button_print', 'Print ', 'printButton()');
        }
    }
    else if (type == 'view' && recType == 'salesorder') {
        var delivert_num = nlapiGetFieldValue('custbody_df_delivery_num_for_print_txt');
        if (!isNullOrEmpty(delivert_num)) {
            form.setScript('customscript_kit_print_client'); // client script id
            form.addButton('custpage_button_print', 'PI Printout', 'printButton()');
            form.addButton('custpage_button_print', 'CI Print', 'printButtonCI()');
        }

    }

}

function beforeSubmit(type) {
    if (type != 'delete') {
        try {
            var count = nlapiGetLineItemCount('item');
            if (recType == 'estimate') {
                line = 1;
                if (count > 0) {
                    for (var i = 1; i <= count; i++) {
                        nlapiLogExecution('DEBUG', 'i:' + i, '')
                        var bundle_number = nlapiGetLineItemValue('item', 'custcol_bundle_number', i);
                        if (!isNullOrEmpty(bundle_number)) {
                            //description = nlapiGetLineItemValue('item', 'description', i).toString().replaceAll('\u0005', '<br>');
                            sumOfRate = parseFloat(nlapiGetLineItemValue('item', 'rate', i));
                            sumOfAmount = parseFloat(nlapiGetLineItemValue('item', 'amount', i));
                            var item = nlapiGetLineItemValue('item', 'item', i);
                            var itemName = '<table class="description"><tr><td><p style="width:100%;text-align:left;">' + nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', i), 'itemid') + '</p></td><td><p style="width:100%;text-align:left;">' + nlapiGetLineItemValue('item', 'description', i).toString().replaceAll('\u0005', '<br>') + "</p></td></tr></table>";
                            if (nlapiLookupField('item', item, 'custitem_item_type') == '3') {
                                lineCore = i;
                            }
                            for (var j = i + 1; j <= count; j++) {
                                var Next_bundle_number = nlapiGetLineItemValue('item', 'custcol_bundle_number', j);
                                if (bundle_number == Next_bundle_number) {
                                    var Second_item = nlapiGetLineItemValue('item', 'item', j);
                                    if (lineCore == '') {
                                        if (nlapiLookupField('item', Second_item, 'custitem_item_type') == '3') {
                                            lineCore = j;
                                        }
                                    }
                                    //description += '<br><br>' + nlapiGetLineItemValue('item', 'description', j).toString().replaceAll('\u0005', '<br>');
                                    sumOfRate += parseFloat(nlapiGetLineItemValue('item', 'rate', j));
                                    sumOfAmount += parseFloat(nlapiGetLineItemValue('item', 'amount', j));
                                    //itemName += '<br><br>' + nlapiGetLineItemText('item', 'item', j);
                                    itemName += '<br><br><table class="description"><tr><td><p style="width:100%;text-align:left;">' + nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', j), 'itemid') + '</p></td><td><p style="width:100%;text-align:left;">' + nlapiGetLineItemValue('item', 'description', j).toString().replaceAll('\u0005', '<br>') + '</p></td></tr></table>'
                                }
                                else {
                                    break;
                                }
                            } //  for (var j = i+1 ; j <= count; j++)
                            if (lineCore == '') {
                                lineCore = i;
                            }
                            prodocts_to += line + '^';
                            prodocts_to += itemName + '^';
                            //prodocts_to += description + '^';
                            prodocts_to += nlapiGetLineItemValue('item', 'quantity', lineCore) + '^';
                            prodocts_to += formatNumber(sumOfRate.toFixed(2)) + '^';
                            prodocts_to += formatNumber(sumOfAmount.toFixed(2)) + '~~';
                            description = '';
                            lineCore = '';
                            sumOfRate = 0;
                            sumOfAmount = 0;
                            i = j - 1;
                            line = line + 1
                        }
                        else if (nlapiGetLineItemText('item', 'item', i) == 'Subtotal') {
                            prodocts_to += '^';
                            prodocts_to += 'Subtotal^';
                            //prodocts_to += '^';
                            prodocts_to += '^';
                            prodocts_to += 'sub^';
                            prodocts_to += formatNumber(getVal('amount', i)) + '~~';
                        }
                        else {
                            prodocts_to += line + '^';
                            //prodocts_to += "<table><tr>"nlapiGetLineItemText('item', 'item', i) + '^';
                            prodocts_to += '<table  class="description"><tr><td><p style="width:100%;text-align:left;">' + nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', i), 'itemid') + '</p></td><td><p style="width:100%;text-align:left;">' + getVal('description', i).toString().replaceAll('\u0005', '<br>') + '</p></td></tr></table>^'
                            //prodocts_to += getVal('description', i).toString().replaceAll('\u0005', '<br>') + '^';
                            prodocts_to += getVal('quantity', i) + '^';
                            prodocts_to += formatNumber(getVal('rate', i)) + '^';
                            prodocts_to += formatNumber(getVal('amount', i)) + '~~';
                            line = line + 1;
                        }
                    }
                } // if (count > 0) 
                var opt_count = nlapiGetLineItemCount('recmachcustrecord_optional_item_quote');
                line = 1;
                lineCore = '';
                sumOfRate = 0;
                sumOfAmount = 0;
                if (opt_count > 0) {
                    for (var i = 1; i <= opt_count; i++) {
                        var bundle_number = nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_bundle_number', i);
                        if (!isNullOrEmpty(bundle_number)) {
                            rate = getOptVal('custrecord_optional_rate', i)
                            qty = getOptVal('custrecord_quantity_optional_item', i)
                            amount = (qty * rate).toFixed(2);
                            //description = nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_optional_items_description', i).toString().replaceAll('\u0005', '<br>');
                            sumOfRate = parseFloat(rate);
                            sumOfAmount = parseFloat(amount);
                            var item = nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_optional_item', i);
                            var itemName = '<table class="description"><tr><td><p style="width:100%;text-align:left;">' + nlapiLookupField('item', nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_optional_item', i), 'itemid') + '</p></td><td><p style="width:100%;text-align:left;">' + nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_optional_items_description', i).toString().replaceAll('\u0005', '<br>') + "</p></td></tr></table>";
                            if (nlapiLookupField('item', item, 'custitem_item_type') == '3') {
                                lineCore = i;
                            }
                            for (var j = i + 1; j <= opt_count; j++) {
                                var Next_bundle_number = nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_bundle_number', j);
                                if (bundle_number == Next_bundle_number) {
                                    var Second_item = nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_optional_item', j);
                                    if (lineCore == '') {
                                        if (nlapiLookupField('item', Second_item, 'custitem_item_type') == '3') {
                                            lineCore = j;
                                        }
                                    }
                                    rate = getOptVal('custrecord_optional_rate', j)
                                    qty = getOptVal('custrecord_quantity_optional_item', j)
                                    amount = (qty * rate).toFixed(2);
                                    //description += '<br><br>' + nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_optional_items_description', j).toString().replaceAll('\u0005', '<br>');
                                    sumOfRate += parseFloat(rate);
                                    sumOfAmount += parseFloat(amount);
                                    itemName += '<br><br><table class="description"><tr><td><p style="width:100%;text-align:left;">' + nlapiLookupField('item', nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_optional_item', j), 'itemid') + '</p></td><td><p style="width:100%;text-align:left;">' + nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_optional_items_description', j).toString().replaceAll('\u0005', '<br>') + '</p></td></tr></table>';
                                }
                                else {
                                    break;
                                }
                            } //  for (var j = i+1 ; j <= count; j++)
                            if (lineCore == '') {
                                lineCore = i;
                            }
                            opt_prodocts_to += line + '^';
                            opt_prodocts_to += itemName + '^';
                            //opt_prodocts_to += description + '^';
                            opt_prodocts_to += nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_quantity_optional_item', lineCore) + '^';
                            opt_prodocts_to += formatNumber(sumOfRate.toFixed(2)) + '^';
                            opt_prodocts_to += formatNumber(sumOfAmount.toFixed(2)) + '~~';
                            description = '';
                            lineCore = '';
                            sumOfRate = 0;
                            sumOfAmount = 0;
                            i = j - 1;
                            line = line + 1
                        }
                        else {
                            rate = getOptVal('custrecord_optional_rate', i)
                            qty = getOptVal('custrecord_quantity_optional_item', i)
                            amount = (qty * rate).toFixed(2);
                            opt_prodocts_to += line + '^';
                            opt_prodocts_to += '<table  class="description"><tr><td><p style="width:100%;text-align:left;">' + nlapiLookupField('item', nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', 'custrecord_optional_item', i), 'itemid') + '</p></td><td><p style="width:100%; text-align:left;">' + getOptVal('custrecord_optional_items_description', i).toString().replaceAll('\u0005', '<br>') + "</p></td></tr></table>^";
                            //opt_prodocts_to += getOptVal('custrecord_optional_items_description', i).toString().replaceAll('\u0005', '<br>') + '^';
                            opt_prodocts_to += qty + '^';
                            opt_prodocts_to += formatNumber(rate) + '^';
                            opt_prodocts_to += formatNumber(amount) + '~~';
                            line = line + 1;
                        }
                    }
                }
            }
            else if (recType == 'itemfulfillment') {
                if (count > 0) {
                    var line = 1;
                    var so_type = nlapiGetFieldValue('custbody_so_type');
                    var ignore_hide_in_print = nlapiGetFieldValue('custbody_ignore_hide_in_print');
                    if (!isNullOrEmpty(so_type)) { so_type = nlapiLookupField('customrecord_so_type_list', so_type, 'custrecord_class_type') }
                    for (var i = 1; i <= count; i++) {
                        var itemreceive = nlapiGetLineItemValue('item', 'itemreceive', i);
                        if (itemreceive == 'T') {
                            var manual_price = nlapiGetLineItemValue('item', 'custcol_manual_price', i);
                            if (manual_price == 'F') {
                                var rate = getCustomPrice(so_type, i)
                                //nlapiLogExecution('DEBUG', i, rate)
                                nlapiSetLineItemValue('item', 'custcol_custom_price', i, rate);
                            }
                            var itemtype = nlapiGetLineItemValue('item', 'itemtype', i);
                            var item = nlapiGetLineItemValue('item', 'item', i);
                            //if (!isNullOrEmpty(location)) { location = nlapiLookupField('location', location, 'usebins') }
                            if (itemtype == 'Kit') {
                                var location = nlapiGetLineItemValue('item', 'location', i);

                                prodocts_to += parseInt(line) + '^';
                                prodocts_to += nlapiLookupField('item', item, 'itemid') + '@@' + '^';
                                prodocts_to += getVal('itemdescription', i).toString().replaceAll('\u0005', '<br>') + '@@' + '^';
                                var kitQty = getVal('quantity', i);
                                prodocts_to += kitQty + '@@' + '~~';
                                line = parseInt(line) + 1;
                                if (location == 'F') {
                                    var ItemRec = nlapiLoadRecord('kititem', item);
                                    var ItemCount = ItemRec.getLineItemCount('member');
                                    if (ItemCount > 0) {
                                        for (var j = 1; j <= ItemCount; j++) {
                                            var KitItem = ItemRec.getLineItemValue('member', 'item', j);
                                            if ((ignore_hide_in_print == 'F' && nlapiLookupField('item', KitItem, 'custitem_hide_in_print') == 'F' && nlapiLookupField('item', KitItem, 'isserialitem') != 'T') || ignore_hide_in_print == 'T' ) {
                                                prodocts_to += parseInt(line) + '^';
                                                prodocts_to += nlapiLookupField('item', ItemRec.getLineItemValue('member', 'item', j), 'itemid') + '^';
                                                prodocts_to += getValItemRec(ItemRec, 'memberdescr', j) + '^';
                                                prodocts_to += getValItemRec(ItemRec, 'quantity', j) * kitQty + '~~';
                                                line = parseInt(line) + 1;
                                            }
                                        }
                                    }
                                }
                            }// if (itemtype == 'Kit')                   
                            else if ((nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', i), 'custitem_hide_in_print') == 'F' && ignore_hide_in_print == 'F') || ignore_hide_in_print == 'T') {

                                prodocts_to += line + '^';
                                prodocts_to += nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', i), 'itemid') + '^';
                                prodocts_to += getVal('itemdescription', i).toString().replaceAll('\u0005', '<br>') + '^';
                                prodocts_to += getVal('quantity', i) + '~~';
                                line = parseInt(line) + 1;
                            }// else if
                            //nlapiLogExecution('DEBUG', i, nlapiViewLineItemSubrecord('item', 'inventorydetail', i))
                        }
                    }
                } // if (count > 0)
            }
            else if (recType == 'invoice') {
                PercentForDebit = nlapiGetFieldValue('custbody_df_advance_payment_percent')
                if (!isNullOrEmpty(PercentForDebit)) { PercentForDebit = parseFloat(PercentForDebit) }
                if (count > 0) {
                    var lineItem = 1;
                    for (var i = 1; i <= count; i++) {
                        var line = nlapiGetLineItemValue('item', 'line', i);
                        qty_to_bill = nlapiGetLineItemValue('item', 'custcol_df_quantity_to_bill', i)
                        var bundle_number = nlapiGetLineItemValue('item', 'custcol_bundle_number', i);
                        if (!isNullOrEmpty(bundle_number)) {
                            description = nlapiGetLineItemValue('item', 'description', i).toString().replaceAll('\u0005', '<br>');
                            sumOfRate = parseFloat(nlapiGetLineItemValue('item', 'rate', i));
                            sumOfAmount = parseFloat(nlapiGetLineItemValue('item', 'amount', i));
                            var item = nlapiGetLineItemValue('item', 'item', i);
                            if (nlapiLookupField('item', item, 'custitem_item_type') == '3') {
                                lineCore = i;
                                var core_qty_to_bill = qty_to_bill
                            }
                            for (var j = i + 1; j <= count; j++) {
                                var line = nlapiGetLineItemValue('item', 'line', j);
                                qty_to_bill = nlapiGetLineItemValue('item', 'custcol_df_quantity_to_bill', j);
                                var Next_bundle_number = nlapiGetLineItemValue('item', 'custcol_bundle_number', j);
                                if (bundle_number == Next_bundle_number) {
                                    var Second_item = nlapiGetLineItemValue('item', 'item', j);
                                    if (lineCore == '') {
                                        if (nlapiLookupField('item', Second_item, 'custitem_item_type') == '3') {
                                            lineCore = j;
                                        }
                                    }
                                    description += '<br><br>' + nlapiGetLineItemValue('item', 'description', j).toString().replaceAll('\u0005', '<br>');
                                    sumOfRate += parseFloat(nlapiGetLineItemValue('item', 'rate', j));
                                    sumOfAmount += parseFloat(nlapiGetLineItemValue('item', 'amount', j));
                                }
                                else {
                                    break;
                                }
                            } //  for (var j = i+1 ; j <= count; j++)
                            if (lineCore == '') {
                                lineCore = i;
                            }
                            //nlapiLogExecution('DEBUG', 'core_qty_to_bill core_qty_to_bill', core_qty_to_bill)
                            if (!isNullOrEmpty(PercentForDebit)) {
                                var AdditionalSumOfAmount = (sumOfAmount / PercentForDebit * 100);
                                prodocts_to += lineItem + '^';
                                prodocts_to += nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', lineCore), 'itemid') + '^';
                                prodocts_to += description + '^';
                                prodocts_to += core_qty_to_bill + '^';
                                prodocts_to += formatNumber(sumOfRate.toFixed(2)) + '^';
                                prodocts_to += formatNumber(AdditionalSumOfAmount.toFixed(2)) + '^';
                                prodocts_to += formatNumber(sumOfAmount.toFixed(2)) + '~~';

                                //prodocts_to += formatNumber(AdditionalSumOfAmount.toFixed(2)) + '~~';
                            }
                            else {
                                prodocts_to += lineItem + '^';
                                prodocts_to += nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', lineCore), 'itemid') + '^';
                                prodocts_to += description + '^';
                                prodocts_to += nlapiGetLineItemValue('item', 'quantity', lineCore) + '^';
                                prodocts_to += formatNumber(sumOfRate.toFixed(2)) + '^';
                                prodocts_to += formatNumber(sumOfAmount.toFixed(2)) + '~~';

                            }
                            description = '';
                            lineCore = '';
                            sumOfRate = 0;
                            sumOfAmount = 0;
                            i = j - 1;
                            lineItem = lineItem + 1
                            KitExists = true;
                        } //   if (!isNullOrEmpty(bundle_number))
                        else { //  The item is not included in the bundle
                            debugger;
                            if (!isNullOrEmpty(PercentForDebit)) {
                                var AdditionalSumOfAmount = (nlapiGetLineItemValue('item', 'amount', i) / PercentForDebit) * 100;
                                prodocts_to += lineItem + '^';
                                prodocts_to += nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', i), 'itemid') + '^';
                                prodocts_to += getVal('description', i).toString().replaceAll('\u0005', '<br>') + '^';
                                prodocts_to += get_qty_to_bill(qty_to_bill) + '^';
                                prodocts_to += formatNumber(getVal('rate', i)) + '^';
                                prodocts_to += formatNumber(AdditionalSumOfAmount.toFixed(2)) + '^';
                                prodocts_to += formatNumber(getVal('amount', i)) + '~~';
                                //prodocts_to += formatNumber(AdditionalSumOfAmount.toFixed(2)) + '~~';
                            }
                            else {
                                var itemLast = nlapiGetLineItemValue('item', 'item', i)
                                if (!isNullOrEmpty(itemLast) && itemLast != 0) {
                                    prodocts_to += lineItem + '^';
                                    prodocts_to += nlapiLookupField('item', itemLast, 'itemid') + '^';
                                    prodocts_to += getVal('description', i).toString().replaceAll('\u0005', '<br>') + '^';
                                    prodocts_to += getVal('quantity', i) + '^';
                                    prodocts_to += formatNumber(getVal('rate', i)) + '^';
                                    prodocts_to += formatNumber(getVal('amount', i)) + '~~';
                                }
                            }
                            lineItem = lineItem + 1;
                        }
                    }
                } // if (count > 0) 
                //}
            } //   else if (recType == 'invoice')
            else if (recType == 'salesorder') {
                line = 1;
                if (count > 0) {
                    for (var i = 1; i <= count; i++) {
                        nlapiLogExecution('DEBUG', 'i:' + i, '')
                        var bundle_number = nlapiGetLineItemValue('item', 'custcol_bundle_number', i);
                        var line_delivery_number = nlapiGetLineItemValue('item', 'custcol10', i);
                        var delivery_num_for_print_txt = nlapiGetFieldValue('custbody_df_delivery_num_for_print_txt');
                        if (line_delivery_number != delivery_num_for_print_txt)
                            continue;
                        if (!isNullOrEmpty(bundle_number)) {
                            //description = nlapiGetLineItemValue('item', 'description', i).toString().replaceAll('\u0005', '<br>');
                            sumOfRate = parseFloat(getLineRate(i)[0]);
                            sumOfAmount = parseFloat(getLineRate(i)[1]);
                            var item = nlapiGetLineItemValue('item', 'item', i);
                            var itemName = '<table class="description"><tr><td style="border:0px solid white"><p style="width:100%;text-align:left;">' + nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', i), 'itemid') + '</p></td><td style="border: 0px solid white"><p style="width:100%;text-align:left;">' + nlapiGetLineItemValue('item', 'description', i).toString().replaceAll('\u0005', '<br>') + '</p></td></tr></table>';
                            if (nlapiLookupField('item', item, 'custitem_item_type') == '3') {
                                lineCore = i;
                            }
                            for (var j = i + 1; j <= count; j++) {
                                var Next_bundle_number = nlapiGetLineItemValue('item', 'custcol_bundle_number', j);
                                if (bundle_number == Next_bundle_number) {
                                    var Second_item = nlapiGetLineItemValue('item', 'item', j);
                                    if (lineCore == '') {
                                        if (nlapiLookupField('item', Second_item, 'custitem_item_type') == '3') {
                                            lineCore = j;
                                        }
                                    }
                                    //description += '<br><br>' + nlapiGetLineItemValue('item', 'description', j).toString().replaceAll('\u0005', '<br>');
                                    sumOfRate += parseFloat(getLineRate(j)[0]);
                                    sumOfAmount += parseFloat(getLineRate(j)[1]);
                                    //itemName += '<br><br>' + nlapiGetLineItemText('item', 'item', j);
                                    itemName += '<br><br><table class="description"><tr><td style="border: 0px solid white"><p style="width:100%;text-align:left;">' + nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', j), 'itemid') + '</p></td><td style="border: 0px solid white"><p style="width:100%;text-align:left;">' + nlapiGetLineItemValue('item', 'description', j).toString().replaceAll('\u0005', '<br>') + '</p></td></tr></table>'
                                }
                                else {
                                    break;
                                }
                            } //  for (var j = i+1 ; j <= count; j++)
                            if (lineCore == '') {
                                lineCore = i;
                            }
                            var unitsid = nlapiLookupField('item', item, 'unitstype')
                            if (!isNullOrEmpty(unitsid))
                                var units = nlapiLoadRecord('unitstype', unitsid).getFieldValue('name');
                            else
                                var units = '';

                            prodocts_to += line + '^';
                            prodocts_to += itemName + '^';
                            //prodocts_to += description + '^';
                            prodocts_to += nlapiGetLineItemValue('item', 'custcol_df_quantity_for_delivery', lineCore) + '^';
                            prodocts_to += units + '^';
                            prodocts_to += formatNumber(sumOfRate.toFixed(2)) + '^';

                            var itemtype = nlapiGetLineItemValue("item", "itemtype", lineCore);
                            var itemT = getitemType(itemtype);
                            var itemrec = nlapiLoadRecord(itemT, item);
                            var coo = itemrec.getFieldText('custitem_coo');
                            var hs_c = itemrec.getFieldValue('custitem_hs_code');



                            prodocts_to += swap_null(coo) + '^';
                            prodocts_to += swap_null(hs_c) + '^';
                            prodocts_to += formatNumber(sumOfAmount.toFixed(2)) + '~~';
                            description = '';
                            lineCore = '';
                            sumOfRate = 0;
                            sumOfAmount = 0;
                            i = j - 1;
                            line = line + 1
                        }
                        else if (nlapiGetLineItemText('item', 'item', i) == 'Subtotal') {
                            prodocts_to += '^';
                            prodocts_to += 'Subtotal^';
                            //prodocts_to += '^';
                            prodocts_to += '^';
                            prodocts_to += '^';
                            prodocts_to += '^';
                            prodocts_to += '^';
                            prodocts_to += 'sub^';
                            prodocts_to += formatNumber(getVal('amount', i)) + '~~';
                        }
                        else {
                            var item = nlapiGetLineItemValue('item', 'item', i);
                            var unitsid = nlapiLookupField('item', item, 'unitstype')
                            if (!isNullOrEmpty(unitsid))
                                var units = nlapiLoadRecord('unitstype', unitsid).getFieldValue('name');
                            else
                                var units = '';

                            prodocts_to += line + '^';
                            //prodocts_to += "<table><tr>"nlapiGetLineItemText('item', 'item', i) + '^';
                            prodocts_to += '<table  class="description"><tr><td style="border: 0px solid white"><p style="width:100%;text-align:left;">' + nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', i), 'itemid') + '</p></td><td style="border: 0px solid white"><p style="width:100%;text-align:left;">' + getVal('description', i).toString().replaceAll('\u0005', '<br>') + '</p></td></tr></table>^'
                            //prodocts_to += getVal('description', i).toString().replaceAll('\u0005', '<br>') + '^';
                            prodocts_to += getVal('custcol_df_quantity_for_delivery', i) + '^';
                            prodocts_to += units + '^';
                            prodocts_to += formatNumber(parseFloat(getLineRate(i)[0]).toFixed(2)) + '^';

                            var itemtype = nlapiGetLineItemValue("item", "itemtype", i);
                            var itemT = getitemType(itemtype);
                            var itemrec = nlapiLoadRecord(itemT, item);
                            var coo = itemrec.getFieldText('custitem_coo');
                            var hs_c = itemrec.getFieldValue('custitem_hs_code');



                            prodocts_to += swap_null(coo) + '^';
                            prodocts_to += swap_null(hs_c) + '^';
                            prodocts_to += formatNumber(parseFloat(getLineRate(i)[1]).toFixed(2)) + '~~';
                            line = line + 1;
                        }
                    }
                } // if (count > 0) 
            }

            if (recType == 'estimate') {
                nlapiSetFieldValue('custbody_prodocts_optional', opt_prodocts_to)
            }
            if (prodocts_to != '') {
                nlapiSetFieldValue('custbody_prodocts', prodocts_to)
            }

        } catch (e) {
            nlapiLogExecution('DEBUG', 'error beforeSubmit', e)
        }
    }
}

function afterSubmit(type) {
    if (type != 'delete') {
        var recId = nlapiGetRecordId();
        nlapiLogExecution('DEBUG', 'recType:' + recType, 'id:' + recId)
        if (type == 'create' && recType == 'invoice') {
            if (checkIfSoBilled()) { nlapiSubmitField(recType, recId, 'custbody_last_invoice', 'T'); }
        }
    }
}

//FUNCATION
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function getVal(field, line) {
    //nlapiLogExecution('DEBUG', field, line)
    var val = nlapiGetLineItemValue('item', field, line)
    if (isNullOrEmpty(val)) { return ' '; }
    return val;

}
function getOptVal(field, line) {
    //nlapiLogExecution('DEBUG', field, line)
    var val = nlapiGetLineItemValue('recmachcustrecord_optional_item_quote', field, line)
    if (isNullOrEmpty(val)) { return ' '; }
    return val;

}
function getAmountVal(line) {
    //nlapiLogExecution('DEBUG', field, line)
    var quantity = nlapiGetLineItemValue('item', 'quantity', line)
    var custcol_custom_price = nlapiGetLineItemValue('item', 'custcol_custom_price', line)
    if (isNullOrEmpty(quantity) || isNullOrEmpty(custcol_custom_price)) { return '0.00'; }
    return formatNumber((quantity * custcol_custom_price).toFixed(2));

}
function getValItemRec(ItemRec, field, line) {
    var val = ItemRec.getLineItemValue('member', field, line)
    if (isNullOrEmpty(val)) { return ''; }
    return val;

}
function formatNumber(num) {
    debugger;
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return num

}
function get_qty_to_bill(qty_to_bill) {
    //var val = qty_to_bill;
    if (isNullOrEmpty(qty_to_bill)) { return ''; }
    return qty_to_bill;

}
function qtyToBill(line) {
    var soCount = soRec.getLineItemCount('item');
    for (var i = 1; i <= soCount; i++) {

        var soLine = soRec.getLineItemValue('item', 'line', i);
        if (soLine == line)
            return soRec.getLineItemValue('item', 'quantity', i);
    }
    return '';

}
function checkIfSoBilled() {
    createdfrom = nlapiGetFieldValue('createdfrom');
    if (!isNullOrEmpty(createdfrom)) {
        soRec = nlapiLoadRecord('salesorder', createdfrom);
        var soCount = soRec.getLineItemCount('item');
        for (var i = 1; i <= soCount; i++) {
            var quantity = soRec.getLineItemValue('item', 'quantity', i);
            var quantitybilled = soRec.getLineItemValue('item', 'quantitybilled', i);
            if (quantity != quantitybilled)
                return false;
        }
        var linkCount = soRec.getLineItemCount('links');
        var invoiceCount = 0;
        for (var i = 1; i <= linkCount; i++) {
            if (soRec.getLineItemValue('links', 'type', i) == 'Invoice') {
                invoiceCount += 1;
            }
        }
        if (invoiceCount > 2) {
            return true;
        }
    }
    return false;
}
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement)
}
function getCustomPrice(so_type, i) {
    try {
        var item = nlapiGetLineItemValue('item', 'item', i);
        if (so_type == 3) { // sale
            var ordertype = nlapiGetFieldValue('ordertype');
            if (ordertype == 'SalesOrd') {
                if (soRec == null) {
                    var createdfrom = nlapiGetFieldValue('createdfrom');
                    soRec = nlapiLoadRecord('salesorder', createdfrom)
                }
                var orderline = nlapiGetLineItemValue('item', 'orderline', i);
                var lineNum = soRec.findLineItemValue('item', 'line', orderline);
                if (lineNum != "-1") {
                    var rate = soRec.getLineItemValue('item', 'rate', lineNum);
                    return rate
                }
            }
        }
        else if (so_type == 2) { //RMA          
            return getItemPriceLevel(item);
        }
        else if (so_type == 1) { //internal
            var itemtype = nlapiGetLineItemValue('item', 'itemtype', i);
            var location = nlapiGetLineItemValue('item', 'location', i);
            if (itemtype == "InvtPart" || itemtype == "Assembly") {
                return getItemLocationCost(item, location)
            }
            else if (itemtype == "Kit") {
                return getKititemsCost(item)
            }
        }
        return '';
    } catch (e) {
        return '';
    }
}
function getItemPriceLevel(item) {
    var search = nlapiLoadSearch(null, 'customsearch_item_price_level');
    search.addFilter(new nlobjSearchFilter('internalid', null, 'anyof', item));
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null && s.length > 0) {
        return s[0].getValue("unitprice", "pricing", null)
    }
    return '';
}
function getItemLocationCost(item, location) {
    var search = nlapiLoadSearch(null, 'customsearch_item_location_cost');
    search.addFilter(new nlobjSearchFilter('internalid', null, 'anyof', item));
    search.addFilter(new nlobjSearchFilter('inventorylocation', null, 'anyof', location));
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null && s.length > 0) {
        return s[0].getValue("locationaveragecost")
    }
    return '';
}
function getKititemsCost(item) {
    var search = nlapiLoadSearch(null, 'customsearch_kit_items_cost');
    search.addFilter(new nlobjSearchFilter('internalid', null, 'anyof', item));
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null && s.length > 0) {
        return s[0].getValue("locationaveragecost", "memberItem", "SUM")
    }
    return '';
}


function getLineRate(line) {
    //nlapiLogExecution('DEBUG', field, line)
    var calc = {};
    var custcol_custom_price = nlapiGetLineItemValue('item', 'custcol_custom_price', line)
    if (!isNullOrEmpty(custcol_custom_price)) {
        calc[0] = custcol_custom_price;
        calc[1] = nlapiGetLineItemValue('item', 'custcol_df_quantity_for_delivery', line) * custcol_custom_price;
    }
    else {
        var rate = nlapiGetLineItemValue('item', 'rate', line)
        calc[0] = rate;
        calc[1] = nlapiGetLineItemValue('item', 'custcol_df_quantity_for_delivery', line) * rate;
    }
    /*if (isNullOrEmpty(quantity) || isNullOrEmpty(custcol_custom_price)) { return '0.00'; }
    return formatNumber((quantity * custcol_custom_price).toFixed(2));*/
    return calc

}
function getLineAmount(rate, line) {




    //nlapiLogExecution('DEBUG', field, line)
    var quantity_for_delivery = nlapiGetLineItemValue('item', 'custcol_df_quantity_for_delivery', line);
    if (isNullOrEmpty(quantity_for_delivery) || isNullOrEmpty(rate)) { return '0.00'; }
    return formatNumber((quantity_for_delivery * rate).toFixed(2));




}

function getitemType(itemtype) {
    nlapiLogExecution('debug', 'itemtype', itemtype)
    var recordtype = "";

    switch (itemtype) {
        case 'InvtPart':
            recordtype = 'inventoryitem';
            break;
        case 'NonInvtPart':
            recordtype = 'noninventoryitem';
            break;
        case 'Service':
            recordtype = 'serviceitem';
            break;
        case 'Assembly':
            recordtype = 'assemblyitem';
            break;
        case 'GiftCert':
            recordtype = 'giftcertificateitem';
            break;
        case 'Kit':
            recordtype = 'kititem';
            break;
        default:
    }
    return recordtype;
}

function swap_null(val) {
    if (val == null)
        return ''
    return val;
}