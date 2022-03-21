var maamRagil;
var maamPatur;

var allTaxCodes = [];
var allTax = [];
var secondaryExRates = [];
var searchmulti = nlapiLoadSearch(null, 'customsearch_ilo_alltaxcodes_search');
var resultsmulti = [];
var searchid = 0;
var resultset = searchmulti.runSearch();
var rs;

do {
	var resultslice = resultset.getResults(searchid, searchid + 1000);
	for (rs in resultslice) {

		allTax.push(resultsmulti[resultslice[rs].id] = resultslice[rs]);
		searchid++;
	}
} while (resultslice.length >= 1000);

if (allTax != null) {

	for (var i = 0; i < allTax.length; i++) {

		allTaxCodes.push({

			tax_id : allTax[i].id,
			tax_name : allTax[i].getValue('itemid')
		});

	}

};

function vendor_taxcode_BS(type) {

	if (type == 'create') {
		
		try{
		
		var getSubsid = nlapiGetFieldValue('subsidiary');
		var checkCountry = nlapiLookupField('subsidiary', getSubsid, 'country');

		var vendorBillCountry = nlapiGetFieldValue('billcountry');

		if (checkCountry == "IL" && vendorBillCountry == "IL") {

			for (var x = 0; x < allTaxCodes.length; x++) {

				var currTaxCode = allTaxCodes[x].tax_name;

				if (currTaxCode.includes('מ תשומות רגילות')) {

					maamRagil = allTaxCodes[x].tax_id;

				}

			}

			nlapiSetFieldValue('taxitem', maamRagil, null, null);
			nlapiCommitLineItem('taxitem');

		}

		if (checkCountry == "IL" && vendorBillCountry != "IL") {

			for (var x = 0; x < allTaxCodes.length; x++) {

				var currTaxCode = allTaxCodes[x].tax_name;

				if (currTaxCode.includes('באפס לא לדיווח')) {

					maamPatur = allTaxCodes[x].tax_id;

				}

			}

			nlapiSetFieldValue('taxitem', maamPatur, null, null);
		}

		}
		catch(err) {
			nlapiLogExecution("DEBUG", 'err', err);
		}
	}

}

if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}
