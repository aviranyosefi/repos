/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Feb 2018     idor
 *
 */

/**
 * @param {String}
 *            type Context Types: scheduled, ondemand, userinterface, aborted,
 *            skipped
 * @returns {Void}
 */
function cleanAddresses(type) {

	var allCustomers = getAllAddresses();

	for (var i = 0; i < allCustomers.length; i++) {

		var record = nlapiLoadRecord('customer', allCustomers[i].customer, {
			recordmode : 'dynamic'
		});
		record.selectLineItem('addressbook', 1);
		record.removeCurrentLineItemSubrecord('addressbook',
				'addressbookaddress');
		record.commitLineItem('addressbook');

		var x = nlapiSubmitRecord(record);

	}

}

function getAllAddresses() {

	try {

		var searchFAM = nlapiLoadSearch(null, 'customsearch212');

		var allSelection = [];
		var theResults = [];
		var allResults = [];
		var resultSelection = [];
		var searchid = 0;
		var resultset = searchFAM.runSearch();
		var rs;
		var cols = searchFAM.getColumns();

		do {
			var resultslice = resultset.getResults(searchid, searchid + 1000);
			for (rs in resultslice) {

				allSelection
						.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
				searchid++;
			}
		} while (resultslice.length >= 1000);

		if (allSelection != null) {
			allSelection.forEach(function(line) {

				theResults.push({

					customer : line.getValue(cols[0]),
					addressID : line.getValue(cols[1]),

				});

			});

		}
		;

	} catch (err) {
		nlapiLogExecution('debug', 'err', err)
	}

	return theResults;

}