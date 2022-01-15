function pageInit() {
	var createdFrom = nlapiGetFieldValue('createdfrom');
	if (createdFrom != '' && createdFrom != null && createdFrom != undefined) {
		var so_trandate = nlapiLookupField('salesorder', createdFrom, 'trandate');
		nlapiSetFieldValue('trandate', so_trandate);
	}
}



function saveRecord() {

	var createdFrom = nlapiGetFieldValue('createdfrom');
	if (createdFrom != '' && createdFrom != null && createdFrom != undefined) {
		var so_trandate = nlapiLookupField('salesorder', createdFrom, 'trandate');
		var rma_trandate = nlapiGetFieldValue('trandate');
		if (so_trandate != rma_trandate) {
			alert('The date of the RMA must be ' + so_trandate + ', same as ' + nlapiGetFieldText('createdfrom'))
			return false;
		}
		else return true;
	}
	else return true;

}