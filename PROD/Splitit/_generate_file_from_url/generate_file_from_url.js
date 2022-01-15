function afterSubmit() {
    var id = nlapiGetRecordId()
    var rec = nlapiLoadRecord(nlapiGetRecordType(), id );
    var url = rec.getFieldValue('custbody_integration_url')
    if (url != '' && url != null && url != undefined) {
        try { 
            var tranid = rec.getFieldValue('tranid');
            var myCSV_data = nlapiRequestURL(url, null, null);
            var body = myCSV_data.getBody(); // returns your csv data in a string format
            nlapiLogExecution('debug', 'string_data', body);
            var file = nlapiCreateFile(tranid+'.xls', 'EXCEL', body);
            file.setFolder(6560);
            var FileID = nlapiSubmitFile(file);
            nlapiAttachRecord("file", FileID, 'invoice', id);
        } catch (e) {

        }


    }


}