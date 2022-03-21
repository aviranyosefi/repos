
function updateCustomerCurrencies(type) {

	if (type == 'create') {

		try {

			var rec = nlapiLoadRecord('customer', nlapiGetRecordId(), {recordmode : 'dynamic'});

			rec.setFieldValue('currency', 1) //set primary currency to USD (or any currency whose internal id is 1)

			var currencies = allCurrencies();

			for (var i = 1; i < currencies.length; i++) {

				if (currencies[i].internalid != '1') { //check that sublist doesnt add primary currency twice

					rec.selectNewLineItem('currency');
					rec.setCurrentLineItemValue('currency', 'currency',currencies[i].internalid);
					rec.commitLineItem('currency');
				}
			}

			nlapiSubmitRecord(rec);

		} catch (err) {
			nlapiLogExecution('debug', 'err', err)
			return true;
		}
	}// end of -  if(type == 'create') 

}// end of script

function allCurrencies() {

	var sysExRates = [];
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('symbol', null, null);
	columns[1] = new nlobjSearchColumn('internalid', null, null);
	var search = nlapiSearchRecord('currency', null, null, columns);
	for (var i = 0; i < search.length; i++) {
		sysExRates.push({
			name : search[i].getValue(columns[0]),
			internalid : search[i].getValue(columns[1]),

		});
	}
	return sysExRates;
}