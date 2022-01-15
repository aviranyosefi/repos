function TaxExemptionReason(type) {
    try {
        if (type != 'delete') {
            var taxcode = nlapiGetLineItemValue('item', 'taxcode', 1)
            if (!isNullOrEmpty(taxcode)) {
                rec = nlapiLoadRecord('salestaxitem', taxcode)
                var eccode = rec.getFieldValue('eccode')
                if (eccode == 'F') {
                    nlapiLogExecution('debug', "|rec.getFieldText('custrecord_tax_exemption_reason')", rec.getFieldText("custrecord_tax_exemption_reason"))
                    nlapiSetFieldValue('custbody_tax_exemption_reason', rec.getFieldValue('custrecord_tax_exemption_reason'))
                }
            }
        }
    } catch (e) { }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}