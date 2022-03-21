function fixAvaTaxfromBillRemaining() {
	
	try{

	var rec = nlapiLoadRecord('invoice', nlapiGetRecordId());
	
	var checkForAva = rec.getFieldValue('custbody_ps_billremained_executed');
	
	if(checkForAva == 'T') {
		
		var getAva = rec.getFieldValue('taxitem');
		
		if (getAva != null) {
			nlapiLogExecution('debug', 'isAVATAX', 'fixing after submit')
			rec.setFieldValue('taxitem', '');
			rec.setFieldValue('istaxable', 'F');
			nlapiSubmitRecord(rec)
		}
		
	}
	}catch(err){
		nlapiLogExecution('debug', 'err', err)
	}
	
	
	
}