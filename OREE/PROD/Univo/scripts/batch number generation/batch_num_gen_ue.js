// JavaScript source code
function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        var productType = nlapiGetFieldValue('custbody_product_category'); 
        if (productType == '3') {
            form.setScript('customscript_batch_num_gen_cs'); // client script id
            form.addButton('custpage_button_print', 'create final product', 'createWorkOrder(' + nlapiGetFieldValue('assemblyitem')  +')');
        }
    }
}

function beforeSubmit(type) {
    if (type == 'create') {
        var productType = nlapiGetFieldValue('custbody_product_category');
        var date = new Date();
        var year = date.getFullYear().toString().substring(2, 4);
        if (productType == '3') {
            var productLine = nlapiGetFieldValue('custbody_product_line');
            if (productLine == '1') {
                var prefix = 'FLR';
                var seqNum = nlapiLookupField('customrecord_lot_number_sequence', '1', 'custrecord_lot_number_sequence');
                var expdate = nlapiLookupField('customrecord_lot_number_sequence', '1', 'custrecord_expiration_date');
                var sequense = prefix + year + getZero(seqNum) + seqNum;
                nlapiSetFieldValue('custbody_wo_lot_number', sequense);
                nlapiSetFieldValue('custbody_wo_lot_expiration_date', nlapiAddMonths(date, expdate));
                nlapiSubmitField('customrecord_lot_number_sequence', '1', 'custrecord_lot_number_sequence', parseInt(seqNum) + 1);
            }
            else if (productLine == '2') {
                var prefix = 'OIL';
                var seqNum = nlapiLookupField('customrecord_lot_number_sequence', '2', 'custrecord_lot_number_sequence');
                var expdate = nlapiLookupField('customrecord_lot_number_sequence', '2', 'custrecord_expiration_date');
                var sequense = prefix + year + getZero(seqNum) + seqNum;
                nlapiSetFieldValue('custbody_wo_lot_number', sequense);
                nlapiSetFieldValue('custbody_wo_lot_expiration_date', nlapiAddMonths(date, expdate));
                nlapiSubmitField('customrecord_lot_number_sequence', '2', 'custrecord_lot_number_sequence', parseInt(seqNum) + 1);
            }
        }
        else if (productType == '4') {
            var prefix = 'CRD';
            var seqNum = nlapiLookupField('customrecord_lot_number_sequence', '3', 'custrecord_lot_number_sequence');
            var expdate = nlapiLookupField('customrecord_lot_number_sequence', '3', 'custrecord_expiration_date');
            var sequense = prefix + year + getZero(seqNum) + seqNum;
            nlapiSetFieldValue('custbody_wo_lot_number', sequense);
            nlapiSetFieldValue('custbody_wo_lot_expiration_date', nlapiAddMonths(date, expdate));
            nlapiSubmitField('customrecord_lot_number_sequence', '3', 'custrecord_lot_number_sequence', parseInt(seqNum) + 1);
        }
    }
}

function getZero(seqNum) {
    var dif = 4 - seqNum.toString().length;
    var zero = '';
    for (var i = 1; i <= dif; i++) {

        zero += '0';
    }
    return zero;
}