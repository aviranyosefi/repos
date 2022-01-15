var counter = 0;

function FieldChanged(type, name, linenum) {
  debugger;
    console.log('field changed name=' + name);
    nlapiLogExecution('DEBUG', 'FieldChanged:  ', "script trigered");
    if (type == 'item' && (name == 'rate')) {
        setTimeout(function () {
            nlapiLogExecution('DEBUG', 'inside timeout:  ', "name: " + name);
            var itemid = nlapiGetCurrentLineItemValue("item", "item");
            var itemtype = nlapiGetCurrentLineItemValue("item", "itemtype");
            var typet = "";

            switch (itemtype) {
                case 'NonInvtPart':
                    typet = 'noninventoryitem'
                    break;
                case 'InvtPart':
                    typet = 'inventoryitem'
                    break;
                case 'Assembly':
                    typet = 'lotnumberedassemblyitem'
                    break;
                case 'Assembly':
                    typet = 'lotnumberedassemblyitem'
                    break;
                case 'Subtotal':
                    typet = 'subtotalitem'
                    break;
                case 'Subtotal':
                    typet = 'subtotalitem'
                    break;
                case 'Description':
                    typet = 'descriptionitem'
                    break;
                case 'OthCharge':
                    typet = 'otherchargeitem'
                    break;
                default:
                // code block
            }
            if (typet != "") {
                nlapiLogExecution('DEBUG', 'typet != null  ', "typet: " + typet);
                var record = nlapiLoadRecord(typet, itemid);
                var purchaseprice = record.getLineItemValue('itemvendor', 'purchaseprice', 1);
                var vendorprices = record.getLineItemValue('itemvendor', 'vendorprices', 1);
                if (isNullOrEmpty(vendorprices)) {
                    var res = Search(itemid);
                    if (res.length > 0) {
                        vendorprices = res[0].item_last_rate;
                        nlapiLogExecution('DEBUG', 'purchase rate for item' + itemid, "rate: " + vendorprices + 'last po date: ' + res[0].trandate);
                    }
                    else {
                        nlapiLogExecution('DEBUG', 'there is no last purchase rate for this item', "item: " + itemid);
                    }
                }
                if (vendorprices != "" && vendorprices != null) {
                    nlapiLogExecution('DEBUG', 'vendorprices != null  ', "vendorprices: " + vendorprices);
                    var length = vendorprices.length;
                    if (vendorprices.indexOf(':') > 0) {
                        var vendstr = vendorprices.substring(5);
                    }
                    else {
                        var vendstr = vendorprices;
                    }
                    var num = parseFloat(vendstr);
                    nlapiSelectLineItem('item', linenum);
                    nlapiSetCurrentLineItemValue('item', 'estimatedrate', num, true, true);//purchaseprice
                    nlapiSetCurrentLineItemValue('item', 'custcol_rate_change_to_ils', "T");
                    nlapiLogExecution('DEBUG', 'SetCurrentLineItem ', "estimatedrate: " + num);
                } else {
                    nlapiLogExecution('DEBUG', 'no vendor price nor last purchase rate for this item', "item: " + itemid);
                }
            }
        }, 125);
    }
}




function recalc(type, name) {
  console.log('recalc');
    counter++;
    console.log('recalc counter:' + counter);
    console.log('recalc item count:' + nlapiGetLineItemCount(type));
    console.log('recalc name:' + name);
    if (counter == 2) {//counter==2
        setTimeout(function () {
            for (i = 1; i <= nlapiGetLineItemCount(type); i++) {
                if (nlapiGetLineItemValue(type, 'custcol_rate_change_to_ils', i) != 'T') {//nlapiGetLineItemValue(type, 'custcol_rate_change_to_ils', i) != 'T'
                    var itemid = nlapiGetLineItemValue("item", "item", i);
                    var itemtype = nlapiGetLineItemValue("item", "itemtype", i);
                    var typet = "";

                    switch (itemtype) {
                        case 'NonInvtPart':
                            typet = 'noninventoryitem'
                            break;
                        case 'InvtPart':
                            typet = 'inventoryitem'
                            break;
                        case 'Assembly':
                            typet = 'lotnumberedassemblyitem'
                            break;
                        case 'Assembly':
                            typet = 'lotnumberedassemblyitem'
                            break;
                        case 'Subtotal':
                            typet = 'subtotalitem'
                            break;
                        case 'Subtotal':
                            typet = 'subtotalitem'
                            break;
                        case 'Description':
                            typet = 'descriptionitem'
                            break;
                        case 'OthCharge':
                            typet = 'otherchargeitem'
                            break;
                        default:
                        // code block
                    }
                    if (typet != "") {
                        nlapiLogExecution('DEBUG', 'typet != null  ', "typet: " + typet);
                        var record = nlapiLoadRecord(typet, itemid);
                        var purchaseprice = record.getLineItemValue('itemvendor', 'purchaseprice', 1);
                        var vendorprices = record.getLineItemValue('itemvendor', 'vendorprices', 1);
                        if (vendorprices != "" && vendorprices != null) {
                            nlapiLogExecution('DEBUG', 'vendorprices != null  ', "vendorprices: " + vendorprices);
                            var length = vendorprices.length;
                            var vendstr = vendorprices.substring(5);
                            var num = parseFloat(vendstr);
                            nlapiSelectLineItem('item', i, false);
                            nlapiSetCurrentLineItemValue('item', 'estimatedrate', num, true, true);
                            //nlapiSetLineItemValue('item', 'estimatedrate', i, num);//purchaseprice
                            nlapiSetCurrentLineItemValue('item', 'custcol_rate_change_to_ils', "T", true,true);
                            nlapiCommitLineItem('item');
                            nlapiLogExecution('DEBUG', 'SetCurrentLineItem Recalc function ', "estimatedrate: " + num);
                            counter = 0;
                        }
                    }
                }
            }
        }, 25);
    }
}


function Search(item) {
    var filters = new Array();
    var s = [];
    var result = [];
    var searchid = 0;
    var columns = new Array();

    var search = nlapiLoadSearch(null, 'customsearch_last_item_purchase_rate');
    if (!isNullOrEmpty(item)) {
        search.addFilter(new nlobjSearchFilter('internalid', null, 'anyof', item));
    }

    var runSearch = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
            result.push({
                trandate: s[i].getValue('trandate', 'transaction', 'MAX'),
                item_last_rate: s[i].getValue('rate', 'transaction', 'MAX'),
            })
        }
    }
    nlapiLogExecution('DEBUG', 'serach result ', JSON.stringify(result));
    return result;
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}



/*
 * function postsource(type, name, linenum) {
    debugger;
    console.log('field changed name=' + name);
    nlapiLogExecution('DEBUG', 'FieldChanged:  ', "script trigered");
    if (type == 'item' && (name == 'rate' || name == 'povendor')) {
        setTimeout(function () {
            nlapiLogExecution('DEBUG', 'inside timeout:  ', "name: " + name);
            var itemid = nlapiGetCurrentLineItemValue("item", "item");
            var itemtype = nlapiGetCurrentLineItemValue("item", "itemtype");
            var typet = "";

            switch (itemtype) {
                case 'NonInvtPart':
                    typet = 'noninventoryitem'
                    break;
                case 'InvtPart':
                    typet = 'inventoryitem'
                    break;
                case 'Assembly':
                    typet = 'lotnumberedassemblyitem'
                    break;
                case 'Assembly':
                    typet = 'lotnumberedassemblyitem'
                    break;
                case 'Subtotal':
                    typet = 'subtotalitem'
                    break;
                case 'Subtotal':
                    typet = 'subtotalitem'
                    break;
                case 'Description':
                    typet = 'descriptionitem'
                    break;
                case 'OthCharge':
                    typet = 'otherchargeitem'
                    break;
                default:
                // code block
            }
            if (typet != "") {
                nlapiLogExecution('DEBUG', 'typet != null  ', "typet: " + typet);
                var record = nlapiLoadRecord(typet, itemid);
                var purchaseprice = record.getLineItemValue('itemvendor', 'purchaseprice', 1);
                var vendorprices = record.getLineItemValue('itemvendor', 'vendorprices', 1);
                if (vendorprices != "" && vendorprices != null) {
                    nlapiLogExecution('DEBUG', 'vendorprices != null  ', "vendorprices: " + vendorprices);
                    var length = vendorprices.length;
                    if (vendorprices.indexOf(':') > 0) {
                        var vendstr = vendorprices.substring(5);
                    }
                    else {
                        var vendstr = vendorprices;
                    }
                    var num = parseFloat(vendstr);
                    nlapiSelectLineItem('item', linenum);
                    nlapiSetCurrentLineItemValue('item', 'estimatedrate', num,false);//purchaseprice
                    nlapiSetCurrentLineItemValue('item', 'custcol_rate_change_to_ils', "T");
                    nlapiLogExecution('DEBUG', 'SetCurrentLineItem ', "estimatedrate: " + num);
                }
            }
        }, 125);
    }
}*/




/*   var vendorCurrency = nlapiGetFieldValue('custbody_vendor_currency');
             var vendorCurrencySymbol = nlapiLookupField('currency', vendorCurrency, 'symbol');
        var date=  nlapiGetFieldValue('trandate');
                  var exchangeRate1 = nlapiExchangeRate('USD',vendorCurrencySymbol, date);
           //var exchangerate = nlapiGetLineItemValue('accountingbookdetail', 'exchangerate', 1);
           var rate = nlapiGetCurrentLineItemValue('item', 'rate');
       //var quantity = nlapiGetCurrentLineItemValue('item', 'quantity');
       //var count = nlapiGetLineItemCount('item');
       var estimaterates = Math.round(rate*exchangeRate1);*/