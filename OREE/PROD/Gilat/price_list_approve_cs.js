var rec = nlapiLoadRecord('customtransaction_price_list', nlapiGetRecordId())
var draft = rec.getFieldValue('custbody_draft');

var oldExpDate = nlapiGetFieldValue('custbody_expiration_date');

function validateLine(type) {

    if (draft == 'F') {
        var line = nlapiGetCurrentLineItemValue('line', 'line')
        if (line != '') {
            var old_price = rec.getLineItemValue('line', 'amount', line);
            var current_price = nlapiGetCurrentLineItemValue('line', 'amount')
            var pl_line_approval_status = nlapiGetCurrentLineItemValue('line', 'custcol_pl_line_approval_status')
            if (old_price != current_price && pl_line_approval_status == 'T') {
                nlapiSetCurrentLineItemValue('line', 'custcol_price_list_actions', 3)
                nlapiSetCurrentLineItemValue('line', 'custcol_pl_line_approval_status', 'F')
                nlapiSetCurrentLineItemValue('line', 'custcol_approval_date', '')
                return true;
            }

            return true;
        }
        else {
            nlapiSetCurrentLineItemValue('line', 'custcol_price_list_actions', 1)
            nlapiSetCurrentLineItemValue('line', 'account', 1493)
        }
    }
    else {
        nlapiSetCurrentLineItemValue('line', 'account', 1493)
    }
    return true;

}

function fieldchanged(type, name) { // block update expiration date to older date
    //nlapiLogExecution('DEBUG', 'FieldChanged:  ', "script trigered");

    if (name == 'custbody_expiration_date') {

        if (nlapiStringToDate(nlapiGetFieldValue('custbody_expiration_date')) < nlapiStringToDate(oldExpDate)) {
            alert('New expiration date must be greater then the old expiration date');
            //nlapiSetFieldValue('custbody_expiration_date', oldExpDate);
        } 
    }
}
