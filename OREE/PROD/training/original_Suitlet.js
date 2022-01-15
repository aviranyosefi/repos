// JavaScript source code

function changeduedate(type) {

    if (nlapiGetFieldValue('custbody_duedatechanged') == 'F') {
        var record = nlapiLoadRecord('customer', nlapiGetFieldValue('entity'));
        var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId());
        var temp = record.getFieldText('terms');
        if (temp != '') {
            var matches = temp.match(/\d+/g);
            if (matches.length > 0) {
                var EstCloseDate = nlapiStringToDate(nlapiGetFieldValue('enddate'));
                var NewDueDate = nlapiDateToString(nlapiAddDays(EstCloseDate, matches[0]));
                rec.SetFieldValue('enddate', NewDueDate);

                rec.setFieldValue('custbody_duedatechanged', 'T');
                var verification = nlapiSubmitRecord(nlapiLoadRecord(rec));
                nlapiLogExecution('DEBUG', 'verification ID= ', verification);
            }
        }
    }
}


/*    var Rec = nlapiLoadRecord();
    var senderInfo = nlapiGetContext();
    var mailRec = nlapiMergeRecord(1, 'customer', newRec.getId());
    var records = new Object();
    records['entity'] = newRec.getId();
    nlapiSendEmail(senderInfo.getUser(), newRec.getFieldValue('email'), mailRec.getName(),
        mailRec.getValue(), null, null, records);
    nlapiLogExecution('DEBUG', 'text= ', record.getFieldText('terms'));
    nlapiLogExecution('DEBUG', 'value= ', record.getFieldValue('terms'));
        */