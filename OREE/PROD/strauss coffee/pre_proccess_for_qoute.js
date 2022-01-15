function beforeSubmit(type) {
    if (type != 'delete') {
        try {
            var Data = '';
            var count = nlapiGetLineItemCount('recmachcustrecord_pl_quote');
            if (count > 0) {
                for (var i = 1; i <= count; i++) {                   
                    Data += nlapiGetLineItemValue('recmachcustrecord_pl_quote', 'custrecord_customer_price', i) + '{t}';
                    Data += nlapiGetLineItemValue('recmachcustrecord_pl_quote', 'custrecord_item_description', i) + '{t}';
                    Data += nlapiGetLineItemValue('recmachcustrecord_pl_quote', 'custrecord_pl_units_in_pkg', i) + '{br}';   
                    
                } //   for (var i = 1; i <= count; i++) 
                nlapiSetFieldValue('custbody_pl_for_print', Data)
            } //   if (count > 0)
            nlapiLogExecution('debug', 'Data', Data);

        } catch (e) {
            nlapiLogExecution('debug', 'error', e);
        }


        var itemCount = nlapiGetLineItemCount('item');
        for (y = 1; y <= itemCount; y++) {
            if (nlapiLookupField('item', nlapiGetLineItemValue('item', 'item',y), 'custitem_primary_category') == '53') {
                var picFile = nlapiLookupField('item', nlapiGetLineItemValue('item', 'item', y), 'custitem_picture');
                if (!isNullOrEmpty(picFile)) {
                    picUrl = nlapiLoadFile(picFile).getURL();
                    if (!isNullOrEmpty(picUrl)) {
                        picUrl = "https://6208757-sb1.app.netsuite.com" + picUrl;
                        nlapiSetLineItemValue('item', 'custcol_pic_url', y, picUrl);
                    }
                }

            }
        }
    }
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}