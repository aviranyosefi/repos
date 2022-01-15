function afterSubmitFillFields(type)
{
    var rectype = nlapiGetRecordType();
    var recid = nlapiGetRecordId();
    if (type != 'delete') {
        var rec = nlapiLoadRecord(rectype, recid);
        var status = rec.getFieldValue('status')
        if (status == 5  ) { // סגור
            var replacement = rec.getFieldValue('custevent_replacement')
            var new_serial_number = rec.getFieldValue('custevent_new_serial_number')
            var agreement_line = rec.getFieldValue('custevent_agreement_line');
            if (isNullOrEmpty(agreement_line)) {
                agreement_line = rec.getFieldValue('custevent_site_agreement_line');
            }
            if (replacement == 'T' && !isNullOrEmpty(new_serial_number) && !isNullOrEmpty(agreement_line)) {
                nlapiSubmitField('customrecord_agr_line', agreement_line, 'custrecord_agr_line_sn_searchable', new_serial_number)
            }
            var related_fulfillment = rec.getFieldValue('custevent_related_fulfillment')
            var category = rec.getFieldValue('category')
            if (!isNullOrEmpty(related_fulfillment) && category == 5) { // קריאת התקנה
                nlapiSubmitField('itemfulfillment', related_fulfillment, 'shipstatus', 'C');
                //itfRec.setFieldValue('shipstatus', 'C');
                //var id = nlapiSubmitRecord(itfRec);
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