function suitelet_print(request, response) {

    var id = request.getParameter('id');  
    //var woRec = nlapiLoadRecord('workorder', id);
    //var mdLotId = woRec.getFieldValue('custbody_medicane_sub_lot')
    nlapiLogExecution('DEBUG', 'id: ', id);
    var record = nlapiLoadRecord('workordercompletion', id);
    var renderer = nlapiCreateTemplateRenderer();
    //var template = nlapiLoadFile(215577);   // sendbox
    var template = nlapiLoadFile(6328);   // prod
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    nlapiLogExecution('DEBUG', 'xml: ', xml);
    var pdf = nlapiXMLToPDF(xml);
    response.setContentType('PDF', 'itemlabel.pdf', 'inline');
    response.write(pdf.getValue());
}