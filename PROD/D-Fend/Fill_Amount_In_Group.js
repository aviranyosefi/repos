// JavaScript source code
function Fill_Amount() {

    try {

        var recType = nlapiGetRecordType();

        var isUpdate = false;
        var rec = nlapiLoadRecord(recType, nlapiGetRecordId());
        var itemCount = rec.getLineItemCount('item');
        if (itemCount > 0) {
            for (var i = 1; i <= itemCount; i++) {
                ingroup = rec.getLineItemValue('item', 'ingroup', i);
                if (ingroup == null) {
                    if (rec.getLineItemValue('item', 'itemtype', i) == 'Group') {
                        for (var j = i + 1; j <= itemCount; j++) {
                            if (rec.getLineItemValue('item', 'itemtype', j) == 'EndGroup') {
                                //item = rec.getLineItemValue('item', 'item_display', i);

                                //quantity = rec.getLineItemValue('item', 'quantity', i);
                                amount = rec.getLineItemValue('item', 'amount', j)
                                //amount = amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                rec.setLineItemValue('item', 'custcol_group_amount', i, amount);
                                isUpdate = true;

                                break;

                            }
                        }
                    }

                }
            }
            if (isUpdate) nlapiSubmitRecord(rec);

        }
    } catch (err) {
        nlapiLogExecution('error', 'Fill_Amount()', err)
    }


}



