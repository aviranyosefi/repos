function after_submit(type) {

    nlapiLogExecution('debug', 'type', type)

    if (type != 'create') {
        var newRec = nlapiGetNewRecord();
        var oldRec = nlapiGetOldRecord();
        var new_status = newRec.getFieldValue('transtatus')
        var old_status = oldRec.getFieldValue('transtatus')

        if (new_status == 'C' && (old_status != new_status)) {
       
            var rec = nlapiLoadRecord( 'customtransaction_price_list', nlapiGetRecordId())	
            var itemCount = rec.getLineItemCount('line');
            if (itemCount > 0) {
                var update = false;
                var today = nlapiDateToString(new Date());
                var Expiration_Date = rec.getFieldValue('custbody_expiration_date')
                for (var i = 1; i <= itemCount; i++) {

                    var approved = rec.getLineItemValue('line', 'custcol_pl_line_approval_status', i)
                    if (approved != 'T') {
                        rec.setLineItemValue('line', 'custcol_pl_line_approval_status', i, 'T')
                        rec.setLineItemValue('line', 'custcol_approval_date', i, today)
                        rec.setLineItemValue('line', 'custcol_pl_start_effective_date', i, today)
                        rec.setLineItemValue('line', 'custcol_pl_end_effective_date', i, Expiration_Date)
                        update = true;
                    }
                    
                    
                } // for (var i = 1; i <= itemCount; i++)
                if (update) { nlapiSubmitRecord(rec); }

            } // if (itemCount > 0) - end
        } //  if (new_status == 'C' && (old_status != new_status)) - end
    } //  if (type != 'create') - end


}