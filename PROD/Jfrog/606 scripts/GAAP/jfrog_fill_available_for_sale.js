function afterSubmit() {

	var res = getBuyGaapsSearchEachNumber();

	for (var i = 0 ; i < res.length; i++) {

		var rec = nlapiLoadRecord('customrecord_gaap_trx', res[i].id)
		var transcation_type = rec.getFieldValue('custrecord_trx_type');
		if (transcation_type == 1) {

			var qty = rec.getFieldValue('custrecord_curr_unit');
			if (qty != '' && qty != null && qty != undefined) {

				rec.setFieldValue('custrecord_available_for_sale', qty);
				nlapiSubmitRecord(rec);
			
			}
		}

	}

	
}

function getBuyGaapsSearchEachNumber() {


	var search = nlapiLoadSearch(null, 'customsearch_get_all_gaap');
	search.addFilter(new nlobjSearchFilter('custrecord_trx_type', null, 'is', 1));


	var s = [];
	var results = [];
	var searchid = 0;
	var resultset = search.runSearch();


	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);

		for (var rs in resultslice) {
			s.push(resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);


	if (s != null) {

		for (var i = 0; i < s.length; i++) {

			results.push({

				id: s[i].id,
				name: s[i].getValue('custrecord_identifier_num'),
				availavle_qty: s[i].getValue('custrecord_available_for_sale'),
				price_unit_price: s[i].getValue('custrecord_price_per_unit'),

			});

		}


	}

	return results;
}