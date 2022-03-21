function InvoiceCreatedWorkato() {
	try {
		
		var invRecordID = nlapiGetRecordId();
		var invRec = nlapiLoadRecord('invoice', invRecordID);
		var invDocNumber = invRec.getFieldValue('tranid')
		var SalesOrder = invRec.getFieldValue('createdfrom');
		
		nlapiLogExecution('audit', 'createdfrom: ', SalesOrder);
		if (SalesOrder != "" || SalesOrder != null || SalesOrder != undefined) {
			var rec = nlapiLoadRecord('salesorder', SalesOrder);
			rec.setFieldValue('custbody_invoice_created', invDocNumber);
			nlapiSubmitRecord(rec);
		}
	} catch (e) {
		nlapiLogExecution('error', 'InvoiceCreatedWorkato()', e);
	}
	return true;
}
