function suitelet_print(request, response) {
    try {
        var id = request.getParameter('Recid');   
        var record = nlapiLoadRecord('inventorytransfer', id);            
        var renderer = nlapiCreateTemplateRenderer();       
        //var template = nlapiLoadFile(67759);
        var template = nlapiLoadFile(96445);            
        renderer.setTemplate(template.getValue());
        renderer.addRecord('record', record);
        var xml = renderer.renderToString();
        var pdf = nlapiXMLToPDF(xml);                 
        response.setContentType('PDF', 'itemlabel.pdf', 'inline');
        response.write(pdf.getValue());
            
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error suitelet_print', e)
    }

}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}


