// JavaScript source code
function aftersumbmit(type) {
    

    if (type == 'create') {
        var so_id = nlapiGetFieldValue('createdfrom');
        if (so_id != '' && so_id != null) {
            var so_memo = nlapiLookupField('salesorder', so_id, 'memo');
            if (so_memo != '' && so_memo != null) {
               
                nlapiSetFieldValue('memo', so_memo);
                
            }
        } //     if (so_id != '' && so_id != null)
    } //   if (type == 'create') - end
} //aftersumbmit(type) - end





/*// JavaScript source code
function aftersumbmit(type) {

    if (type == 'create') {
        var record = nlapiLoadRecord('salesorder', nlapiGetFieldValue('createdfrom'));
        var rec = nlapiLoadRecord('itemfulfillment', nlapiGetRecordId());
        var temp = record.getFieldValue('memo');

        if (temp != '') {
            nlapiLogExecution('DEBUG', 'temp= ', temp);
            rec.setFieldValue('memo', temp);

            var verification = nlapiSubmitRecord(rec);
            nlapiLogExecution('DEBUG', 'verification ID= ', verification);
        }
    }
}
*/
