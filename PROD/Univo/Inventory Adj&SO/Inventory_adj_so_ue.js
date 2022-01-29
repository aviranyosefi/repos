function beforeLoad_addButton(type, form) {
	var typeRec = nlapiGetRecordType();
	var idRec = nlapiGetRecordId();
	if (1 == 1) { // TODO check if STORAGE SERVICES checked
		form.setScript('customscript_inventory_adj_so_cs');
		form.addButton('custpage_button_create', 'Create Trn', 'CreateTrn()');
	}
}