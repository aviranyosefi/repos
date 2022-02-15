
function Search(request, response) {
    var Recid = request.getParameter('Recid');
    nlapiLogExecution('debug', 'Recid', Recid)
    var rec = nlapiLoadRecord('inventorycount', Recid)
    rec.setFieldValue('custbody_already_started' , 'T')
    nlapiSubmitRecord(rec, null, true);
    response.write('finish')

}
