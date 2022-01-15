function suitelet_print(request, response) {

    var id = request.getParameter('id');   
    var record = nlapiLoadRecord('itemfulfillment', id);

    var ordertype = record.getFieldValue('ordertype');
    var createdfrom = record.getFieldValue('createdfrom');

    if (ordertype == 'SalesOrd') {
        var entity = record.getFieldValue('entity')
        var entityRec = nlapiLoadRecord('customer', entity);
        //var companyname = entityRec.getFieldValue('companyname')
        var custentity_sap_number = entityRec.getFieldValue('custentity_sap_number');
        if (isNullOrEmpty(custentity_sap_number)) { custentity_sap_number = ''; }
        var custentity_service_technician = entityRec.getFieldValue('custentity_service_technician');
        if (!isNullOrEmpty(custentity_service_technician)) {
            custentity_service_technician = nlapiLookupField('employee', custentity_service_technician, 'entityid');
        }
        else { custentity_service_technician = ''; }

        var salesrep = entityRec.getFieldValue('salesrep');
        if (!isNullOrEmpty(salesrep)) {
            salesrep = nlapiLookupField('employee', salesrep, 'entityid');
        }
        else { salesrep = ''; }
        var soRec = nlapiLoadRecord('salesorder', createdfrom);
        var contact_phone_number = soRec.getFieldValue('custbody_contact_phone_number');
        if (isNullOrEmpty(contact_phone_number)) {
            contact_phone_number = entityRec.getFieldValue('phone');
        }
        var custbody_contact_person = soRec.getFieldValue('custbody_contact_person');
        if (isNullOrEmpty(custbody_contact_person)) {
            custbody_contact_person = '';
        }
    }
    else if (ordertype == 'TrnfrOrd') {
        var troRec = nlapiLoadRecord('transferorder', createdfrom);
        var transferlocation = troRec.getFieldValue('transferlocation');
        if (!isNullOrEmpty(transferlocation)) {
            var toRec = nlapiLoadRecord('location', transferlocation);
            var to_loc_mainaddress_text = toRec.getFieldValue('mainaddress_text');
            var to_loc_representative = toRec.getFieldValue('custrecord_representative');
            var to_loc_representative_phone = toRec.getFieldValue('custrecord_representative_phone');
        }
        var location = troRec.getFieldValue('location');
        if (!isNullOrEmpty(location)) {
            var fromRec = nlapiLoadRecord('location', location);
            var from_loc_mainaddress_text = fromRec.getFieldValue('mainaddress_text');
            var from_loc_representative = fromRec.getFieldValue('custrecord_representative');
            var from_loc_representative_phone = fromRec.getFieldValue('custrecord_representative_phone');
        }      
    }
   
    var user = nlapiGetContext().name
    var renderer = nlapiCreateTemplateRenderer();
    var template = nlapiLoadFile(3990);   // prod
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    //xml = xml.replace('/companyname/', companyname)
   
    xml = xml.replace('/user/', user)
    if (ordertype == 'SalesOrd') {
        xml = xml.replace('/custentity_sap_number/', custentity_sap_number)
        xml = xml.replace('/custbody_contact_phone_number/', contact_phone_number)
        xml = xml.replace('/custbody_contact_person/', custbody_contact_person)
        xml = xml.replace('/custentity_service_technician/', custentity_service_technician)
        xml = xml.replace('/salesrep/', salesrep)
    }
    else if (ordertype == 'TrnfrOrd') {
        xml = xml.replace('/to_loc_mainaddress_text/', to_loc_mainaddress_text)
        xml = xml.replace('/to_loc_representative/', to_loc_representative)
        xml = xml.replace('/to_loc_representative_phone/', to_loc_representative_phone)
        xml = xml.replace('/from_loc_mainaddress_text/', from_loc_mainaddress_text)
        xml = xml.replace('/from_loc_representative/', from_loc_representative)
        xml = xml.replace('/from_loc_representative_phone/', from_loc_representative_phone)
    }


    var pdf = nlapiXMLToPDF(xml);
    response.setContentType('PDF', 'itemlabel.pdf', 'inline');
    response.write(pdf.getValue());

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}