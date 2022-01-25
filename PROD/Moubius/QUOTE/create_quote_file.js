function createFileAfterSubmit(type) {
    if (type != 'delete') {
        try {
            var Rectype=nlapiGetRecordType()
            var Recid= nlapiGetRecordId()
            var record = nlapiLoadRecord(Rectype, Recid);
            if (Rectype == 'customrecord_product') {
                var quote = record.getFieldValue('custrecord_quote_number')
                var record = nlapiLoadRecord('customrecord_quote', quote);
            }
            createFile(record) 

        } catch (e) {

        }
    }
}
function createFile(record) {

    var renderer = nlapiCreateTemplateRenderer();
    var template = nlapiLoadFile(448225);   // sand box
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    var pdf = nlapiXMLToPDF(xml);
    var file = nlapiCreateFile(record.getFieldValue('name') + '.pdf', 'PDF', pdf.getValue());
    file.setFolder(381206);
    file.setIsOnline(true);
    //nlapiLogExecution('debug', 'before submit: ', '')
    var FileID = nlapiSubmitFile(file);
    record.setFieldValue('custrecord_printout_attachment', FileID)
    nlapiSubmitRecord(record);
}