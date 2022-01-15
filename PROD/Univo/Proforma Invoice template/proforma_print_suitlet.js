function suitelet_print(request, response) {

    var id = request.getParameter('id');   
    var record = nlapiLoadRecord('invoice', id);
    var subsidiary = record.getFieldValue('subsidiary');
    var subRec  = nlapiLoadRecord('subsidiary', subsidiary)
    //var custrecordil_tax_payer_id_subsidary = subRec.getFieldValue('custrecordil_tax_payer_id_subsidary');// nlapiLookupField('subsidiary', subsidiary, 'custrecordil_tax_payer_id_subsidary')
    //var custrecord_ilo_subsid_hebrew_address = subRec.getFieldValue('custrecord_ilo_subsid_hebrew_address');  //nlapiLookupField('subsidiary', subsidiary, 'custrecord_ilo_subsid_hebrew_address')
    //var custrecord_ilo_subsid_heb_companyname = subRec.getFieldValue('custrecord_ilo_subsid_heb_companyname'); //nlapiLookupField('subsidiary', subsidiary, 'custrecord_ilo_subsid_heb_companyname')

    var mainaddress_text = subRec.getFieldValue('mainaddress_text');
    var federalidnumber = subRec.getFieldValue('federalidnumber'); //nlapiLookupField('subsidiary', subsidiary, 'federalidnumber')

    var renderer = nlapiCreateTemplateRenderer(); 
    //var template = nlapiLoadFile(1514); // SB
    var template = nlapiLoadFile(1771); // PROD
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    //xml = xml.replace('custrecordil_tax_payer_id_subsidary', custrecordil_tax_payer_id_subsidary)
    //xml = xml.replace('custrecord_ilo_subsid_hebrew_address', custrecord_ilo_subsid_hebrew_address.replace(/\n/ig, '<br />'))
    //xml = xml.replace('custrecord_ilo_subsid_heb_companyname', custrecord_ilo_subsid_heb_companyname)
    xml = xml.replace('mainaddress_text', mainaddress_text.replace(/\n/ig, '<br />'))
    xml = xml.replace('federalidnumber', federalidnumber)
    //nlapiLogExecution('debug', 'xml', xml);
    var pdf = nlapiXMLToPDF(xml);
    nlapiLogExecution('debug', 'pdf', pdf);
    response.setContentType('PDF', 'itemlabel.pdf', 'inline');
    response.write(pdf.getValue());

}