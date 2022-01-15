//client script
function InvoiceCreated() {
    try {
        var SalesOrder = nlapiGetFieldValue('createdfrom');
        nlapiLogExecution('audit', 'createdfrom: ', SalesOrder);
        //var InvocieNo = nlapiGetFieldValue('tranid');
        //nlapiLogExecution('audit', 'tranid : ', InvocieNo);
        if (SalesOrder != "" && SalesOrder != null ) {
            var rec = nlapiLoadRecord('salesorder', SalesOrder);
            var res = rec.setFieldValue('custbody_invoice_created', 'true');
            nlapiLogExecution('audit', 'setFieldValue : ', res);
            var ress =nlapiSubmitRecord(rec);
            nlapiLogExecution('audit', 'nlapiSubmitRecord : ', ress);
        }
    } catch (e) {
        nlapiLogExecution('error', 'InvoiceCreated()', e);
    }
    return true;
}
