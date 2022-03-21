/**

 * Version    Date            Author           Remarks
 * 1.00       3 mar 2022  Maya Katz Libhaber
*/

function suitelet_quantityLabels(request, response) {

    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'stage one', 'stage one');
        var Recid = request.getParameter('Recid');
        var Rectype = request.getParameter('Rectype');
        nlapiLogExecution('DEBUG', 'Rectype', Rectype);

        var form = nlapiCreateForm('Label Quantity');

        var labelQuantity = form.addField('custpage_label_quantity', 'integer', 'Quantity');
        labelQuantity.setLayoutType('normal', 'startcol');
        labelQuantity.setMandatory(true);

        var checkStage = form.addField('custpage_rec_id', 'text', 'check', null, null);
        checkStage.setDefaultValue(Recid);
        checkStage.setDisplayType('hidden');

        var checkType = form.addField('custpage_rec_type', 'text', 'check', null, null);
        checkType.setDefaultValue(Rectype);
        checkType.setDisplayType('hidden');

        form.addSubmitButton('Submit');
        response.writePage(form);

    }
    else {
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');

        var Recid = request.getParameter('custpage_rec_id');
        var Rectype = request.getParameter('custpage_rec_type');
        nlapiLogExecution('DEBUG', 'stage two Rectype', Rectype);

        var labelQuantity = request.getParameter('custpage_label_quantity');
        //labelQuantity = Number(labelQuantity)
        var printItem = createItemLableTempalte(Recid, Rectype);
        var pdfItem = nlapiXMLToPDF(printItem);
        var pdfFile = nlapiCreateFile(Recid + '.pdf', 'PDF', pdfItem.getValue());
        pdfFile.setFolder('-15');
        pdfFile.setIsOnline(true);
        var fileId = nlapiSubmitFile(pdfFile);
        var fileUrl = nlapiLoadFile(fileId).getURL();
        fileUrl = nlapiEscapeXML(fileUrl);
        nlapiLogExecution('DEBUG', 'fileUrl ', fileUrl);
        nlapiLogExecution('DEBUG', 'Recid ' + Recid, 'labelQuantity: ' + labelQuantity);

        var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
        xml += "<pdfset>";
        for (var i = 0; i < labelQuantity; i++) {
            xml += "<pdf src='" + fileUrl + "'/>";
        }

        xml += "</pdfset>";
        nlapiLogExecution('DEBUG', 'xml ', xml);
        var pdf = nlapiXMLToPDF(xml);
        nlapiLogExecution('DEBUG', 'pdf ', pdf);
        nlapiDeleteFile(fileId);
        response.setContentType('PDF', 'printLabels.pdf', 'inline');
        response.write(pdf.getValue());
        //var xml = createItemLableTempalte(Recid);
        //nlapiLogExecution('DEBUG','xml', xml);

        //var finalXml = xml;

        //for (var i = 0; i < labelQuantity; i++) {
        //    finalXml += xml;
        //}
        //var pdf = nlapiXMLToPDF(finalXml);

        //nlapiLogExecution('debug', 'pdf', pdf);

        //response.setContentType('PDF', 'printLabels.pdf', 'inline');
        //response.write(pdf.getValue());
    }
}
function createItemLableTempalte(Recid, Rectype) {
    nlapiLogExecution('DEBUG', 'Rectype', Rectype);

    //if (Rectype == 'inventoryItem' || Rectype == 'serializedinventoryitem' ) {
    //    record = nlapiLoadRecord('inventoryItem', Recid);
    //} else if (Rectype == 'assemblyitem' || Rectype =='serializedassemblyitem') {
    //    record = nlapiLoadRecord('assemblyitem', Recid);
    //}
    record = nlapiLoadRecord(Rectype, Recid);
    nlapiLogExecution('DEBUG', 'record', JSON.stringify(record));

    var renderer = nlapiCreateTemplateRenderer();
    if (nlapiGetContext().getEnvironment() == "PRODUCTION") {
        var template = nlapiLoadFile(2199612);   // prod
    } else {
        var template = nlapiLoadFile(2199612);   // sb
    }

    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    return xml;
}

