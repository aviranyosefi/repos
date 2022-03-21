
function searchWHTbyDate(date) {
	
	var whtResults = [];

	var whtCertfilters = new Array();
	whtCertfilters[0] = new nlobjSearchFilter('custrecord_vendor_cert_fromdate', null, 'onorbefore', date);
	whtCertfilters[1] = new nlobjSearchFilter('custrecord_vendor_cert_enddate', null, 'onorafter', date);
	
	var whtCertcolumns = new Array();
	whtCertcolumns[0] = new nlobjSearchColumn(
			'custrecord_vendor_cert_fromdate');
	whtCertcolumns[1] = new nlobjSearchColumn(
			'custrecord_vendor_cert_enddate');
	whtCertcolumns[2] = new nlobjSearchColumn(
			'custrecord_vendor_cert_percent');
	whtCertcolumns[3] = new nlobjSearchColumn(
			'custrecord_vendor_cert_vendorid');


	var whtCertsearch = nlapiSearchRecord('customrecord_oil_vendor_cert', null, whtCertfilters, whtCertcolumns);
	
	if (whtCertsearch != null) {
		whtCertsearch.forEach(function(whtCert) {

			whtResults[whtCert.getValue('custrecord_vendor_cert_vendorid')] = {
				whtCertPercent : whtCert
						.getValue('custrecord_vendor_cert_percent')
			};

		});
	};
	console.log(whtResults);
	
}

searchWHTbyDate('16/4/2016');