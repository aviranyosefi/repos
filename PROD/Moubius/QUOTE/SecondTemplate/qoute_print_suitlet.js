function suitelet_print(request, response) {

    var id = request.getParameter('id');   
    var record = nlapiLoadRecord('customrecord_quote', id);
    var renderer = nlapiCreateTemplateRenderer();
    //var template = nlapiLoadFile(215577);   // sendbox
    var template = nlapiLoadFile(275444);   // prod
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    var pdf = nlapiXMLToPDF(xml);
    response.setContentType('PDF', 'itemlabel.pdf', 'inline');
    response.write(pdf.getValue());

}