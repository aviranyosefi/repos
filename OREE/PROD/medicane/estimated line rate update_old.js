function FieldChanged(type, name, linenum) {
    nlapiLogExecution('DEBUG', 'FieldChanged:  ', "script trigered");
    debugger;
    if ((type == 'item' && name == 'rate')) {
        setTimeout(function () {
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
                var record = nlapiLoadRecord(typet, itemid);
                var purchaseprice = record.getLineItemValue('itemvendor', 'purchaseprice', 1);
                var vendorprices = record.getLineItemValue('itemvendor', 'vendorprices', 1);
                if (vendorprices != "" && vendorprices != null) {
                    var length = vendorprices.length;
                    var vendstr = vendorprices.substring(5);
                    var num = parseFloat(vendstr);
                    nlapiSelectLineItem('item', linenum);
                    nlapiSetCurrentLineItemValue('item', 'estimatedrate', num, true, true);//purchaseprice
                }
            }
        }, 25);
    }
}


/*   var vendorCurrency = nlapiGetFieldValue('custbody_vendor_currency');
             var vendorCurrencySymbol = nlapiLookupField('currency', vendorCurrency, 'symbol');
        var date=  nlapiGetFieldValue('trandate');
                  var exchangeRate1 = nlapiExchangeRate('USD',vendorCurrencySymbol, date);
           //var exchangerate = nlapiGetLineItemValue('accountingbookdetail', 'exchangerate', 1);
           var rate = nlapiGetCurrentLineItemValue('item', 'rate');
       //var quantity = nlapiGetCurrentLineItemValue('item', 'quantity');
       //var count = nlapiGetLineItemCount('item');
       var estimaterates = Math.round(rate*exchangeRate1);*/