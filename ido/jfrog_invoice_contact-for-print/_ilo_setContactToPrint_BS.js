
function setContactToPrint_BS(type) {

	var currentID = nlapiGetRecordId();
	
	nlapiLogExecution('DEBUG', 'setContactToPrint_BS', 'before submit fired - setContactToPrint_BS');
	
	nlapiScheduleScript('customscript_ilo_contact_adder_ss', 'customdeploy_ilo_contact_adder_ss_dep', {custscript_ilo_invoice_id: currentID});
}
