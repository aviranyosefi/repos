function fill_not_printed_field(type) {
    nlapiLogExecution('debug', 'type', type);
    if (type != 'delete') {

        var type_rec = nlapiGetRecordType();
        nlapiLogExecution('debug', 'type_rec', type_rec);
        nlapiLogExecution('debug', 'nlapiGetRecordId()', nlapiGetRecordId());
        var rec = nlapiLoadRecord(type_rec, nlapiGetRecordId());
        var itemCount = rec.getLineItemCount('item');
        var createdfrom = rec.getFieldValue('createdfrom');
        var total_inv_amount = 0;

        var isUpdate = false;
        if (itemCount > 0 && type_rec != 'returnauthorization') {

            for (var i = 1; i <= itemCount; i++) {
                item = rec.getLineItemValue('item', 'item', i);
                var amount_before_discount = rec.getLineItemValue('item', 'custcol_usd_line_amount', i);              
                if (amount_before_discount != '' && amount_before_discount != null) {
                    total_inv_amount += parseFloat(amount_before_discount );
                }
                var not_printed_item = nlapiLookupField('noninventoryitem', item, 'custitem_jfrog_not_printed_item')
                if (not_printed_item == 'T') {
                    rec.setLineItemValue('item', 'custcol_jfrog_not_printed_item', i, not_printed_item);
                    isUpdate = true;
                }

            }
        }


        if (type_rec == 'invoice' && createdfrom != null && createdfrom != '') {
            isUpdate = true;
            var so_rec = nlapiLoadRecord('salesorder', createdfrom);
            var so_total = so_rec.getFieldValue('subtotal');
            var total = rec.getFieldValue('subtotal');
            if (parseFloat(total) < parseFloat(so_total)) {
                var precent = so_total / total;
                nlapiLogExecution('debug', 'billing Schedule', precent);
                rec.setFieldValue('custbody_jfrog_billing_percent', precent);

            }
            else {
                rec.setFieldValue('custbody_jfrog_billing_percent', '');
            }
        }

        if (type_rec == 'returnauthorization' && createdfrom != null && createdfrom != '') { 
            isUpdate = true;
            var so_rec = nlapiLoadRecord('salesorder', createdfrom);
            var so_total = so_rec.getFieldValue('subtotal');            
            var total = rec.getFieldValue('subtotal');
            if (parseFloat(total) < parseFloat(so_total)) {
                so_total = so_rec.getFieldValue('total');
                var precent = so_total / total;
                nlapiLogExecution('debug', 'billing Schedule', precent);
                rec.setFieldValue('custbody_jfrog_billing_percent', precent);

            }
            else {
                rec.setFieldValue('custbody_jfrog_billing_percent', '');
            }

        }

        if (isUpdate) nlapiSubmitRecord(rec);
    }

}

