function afterSubmit(type){
	
	 if (type == 'create') {
		 
		 var params = {
			custscript_type: nlapiGetRecordType(),
			custscript_id: nlapiGetRecordId(),
		};
		

		try { nlapiScheduleScript('customscript_gilat_customer_po_ss', 'customdeploy_gilat_customer_po_ss',  params ) 
		} catch (e) {}		
	
		 
	 }
	
}



	
	
	
