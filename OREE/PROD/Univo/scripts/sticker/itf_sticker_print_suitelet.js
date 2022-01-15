function suitelet_print(request, response) {

    var id = request.getParameter('id');   
    nlapiLogExecution('DEBUG', 'id: ', id);
    var record = nlapiLoadRecord('itemfulfillment', id);
    var renderer = nlapiCreateTemplateRenderer();
    //var template = nlapiLoadFile(215577);   // sendbox
    var template = nlapiLoadFile(2878);   // prod
    nlapiLogExecution('DEBUG', 'template: ', template);
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    nlapiLogExecution('DEBUG', 'xml: ', xml);
    var pdf = nlapiXMLToPDF(xml);
    response.setContentType('PDF', 'itemlabel.pdf', 'inline');
    response.write(pdf.getValue());

}