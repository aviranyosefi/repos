function suitelet_print(request, response) {
    var Recid = request.getParameter('Recid');
    var record = nlapiLoadRecord('inventorytransfer', Recid);
    var renderer = nlapiCreateTemplateRenderer();
    var template = nlapiLoadFile(12489);   // prod
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    //xml = xml.replace('custrecord_agr_current_user.entityid', context.name)
    var pdf = nlapiXMLToPDF(xml);
    response.setContentType('PDF', 'itemlabel.pdf', 'inline');
    response.write(pdf.getValue());
}