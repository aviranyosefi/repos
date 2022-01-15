var context = nlapiGetContext();

function setFieldDisable() {
    if (context.roleid != 'administrator') {
        if (nlapiGetRecordType() == 'assemblybuild' || nlapiGetRecordType() == 'workorder') {
            var LotField = nlapiGetField('custbody_wo_lot_number');
            var expField = nlapiGetField('custbody_wo_lot_expiration_date');

            LotField.setDisplayType('disabled');
            //expField.setDisplayType('disabled');
        }
        else if (nlapiGetRecordType() == 'customrecord_lot_number_sequence') {
            var LotField = nlapiGetField('custrecord_lot_number_sequence');
            LotField.setDisplayType('disabled');
        }

    }

}
