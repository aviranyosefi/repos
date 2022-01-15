var context = nlapiGetContext();

function suitelet_print(request, response) {

    var id = request.getParameter('id'); 
    var mail = request.getParameter('mail'); 
    var caseRec = nlapiLoadRecord('supportcase', id);
    var emp_phone = nlapiLookupField('employee', caseRec.getFieldValue('assigned'), 'phone');
    //var custRec = nlapiLoadRecord('customer', caseRec.getFieldValue('company'));
    var cust_name = nlapiLookupField('customer', caseRec.getFieldValue('company'), 'altname');
    //var mdLotId = woRec.getFieldValue('custbody_medicane_sub_lot')
    nlapiLogExecution('DEBUG', 'id: ', id);
    var record = nlapiLoadRecord('supportcase', id);
    var renderer = nlapiCreateTemplateRenderer();
    var template = nlapiLoadFile(10215);   // sendbox
    //var template = nlapiLoadFile(6305);   // prod
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    xml = xml.replace('TECH_PHONE', emp_phone);
    xml = xml.replace('CUSTOMER_NAME', cust_name);
    nlapiLogExecution('DEBUG', 'xml: ', xml);
    var pdf = nlapiXMLToPDF(xml);
    response.setContentType('PDF', 'itemlabel.pdf', 'inline');
    if (mail != -1) {
        nlapiSendEmail(context.user, mail, 'Case Report', 'Case Report from Netsuite system.', null, null, null, pdf);
    }
    response.write(pdf.getValue());
}