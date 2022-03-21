/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 May 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function savedsearch_suitlet(request, response){
	
    //Create the form and add fields to it 
    var form = nlapiCreateForm("Saved Search Advanced Viewer");
    
    var allSavedSearches = nlapiLoadSearch('customsearch_ilo_all_savedsearches');
    var ssArr = [];
    
	if (allSavedSearches != null) {

		for (var i = 0; i < allSavedSearches.length; i++) {

			ssArr.push({
				ss_id : allSavedSearches[i].internalid,
				title : allSavedSearches[i].title,
			});

		}

	}
    
    form.addField('subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY');


    form.addSubmitButton('Load');

    if (request.getMethod() == 'GET') {
        response.writePage(form);
    }

}






function getSavedSearch(ss_id) {

	var obj = {};

	var search = nlapiLoadSearch(null, ss_id);

	var allresults = [];
	var resultObjs = [];
	var resultArr = [];
	var searchid = 0;
	var resultset = search.runSearch();
	var rs;

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allresults.push(resultArr[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allresults != null) {
		allresults.forEach(function(line) {

			var cols = search.getColumns();

			for (var i = 0; i < cols.length; i++) {

				var colName = renameField(cols[i].name);

				obj[colName] = line.getValue(cols[i]);
			}

			resultObjs.push(obj);

		});

	}
	;

	return resultObjs;



function renameField(field) {

	var check = /custrecord|custbody|custentity|custcol/.test(field);

	if (check == true) {

		field = field.split('_').pop();
	}

	return field;
}

// PolyFills

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

}







