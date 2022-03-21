/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Dec 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Operation types: create, edit, delete, xedit, approve,
 *            cancel, reject (SO, ER, Time Bill, PO & RMA only) pack, ship (IF
 *            only) dropship, specialorder, orderitems (PO only) paybills
 *            (vendor payments)
 * @returns {Void}
 */
function populateTerritoryAfterSubmit(type) {
	
	

	try {
		
		var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId());

		var endUserCountry = rec.getFieldText('custbody_enduser_country');
		var terr = setTerritories(endUserCountry, null);

		if (endUserCountry != "") {

			if (terr != undefined) {

				var territory = terr.territory
				var terr_level1 = terr.territory_level1
				var terr_level2 = terr.territory_level2

				if (territory == '') {
					territory = 'Other'
				}
				if (terr_level1 == '') {
					terr_level1 = 'Other'
				}
				if (terr_level2 == '') {
					terr_level2 = 'Other'
				}

				rec.setFieldValue('custbody_ter', territory)
				rec.setFieldValue('custbody_ter_level1', terr_level1)
				rec.setFieldValue('custbody_ter_level2', terr_level2)

			} else {

				rec.setFieldValue('custbody_ter', 'Other')
				rec.setFieldValue('custbody_ter_level1', 'Other')
				rec.setFieldValue('custbody_ter_level2', 'Other')

			}
		}// checkIfEmpty != ''

		nlapiSubmitRecord(rec)
		nlapiLogExecution('debug', 'saved successfully', 'true')
		} catch (err) {
		nlapiLogExecution('debug', 'err', err)
	}

}


function setTerritories(country, state) {

	var res;
	var allTerritories = getTerritories();

	for (var i = 0; i < allTerritories.length; i++) {
		if (state == null) {
			if (country == allTerritories[i].country) {
				res = allTerritories[i]
			}
		}// if state == null
		if (state != null) {
			if (country == allTerritories[i].country
					&& state == allTerritories[i].state) {
				res = allTerritories[i]
			}
		}// if state != null
	}
	return res;
}

function getTerritories() {

	var results = [];
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('custrecord_jfrog_enduser_country',null, null);
	columns[1] = new nlobjSearchColumn('custrecord_jfrog_enduser_state', null,null);
	columns[2] = new nlobjSearchColumn('custrecord_jfrog_territory', null, null);
	columns[3] = new nlobjSearchColumn('custrecord_jfrog_territory_level1',null, null);
	columns[4] = new nlobjSearchColumn('custrecord_jfrog_territory_level2',null, null);
	columns[5] = new nlobjSearchColumn('isinactive', null, null);

	var search = nlapiSearchRecord('customrecord_jfrog_territory', null, null,columns);

	for (var i = 0; i < search.length; i++) {

		if (search[i].getValue(columns[5]) != 'T') {

			results.push({
				country : search[i].getValue(columns[0]),
				state : search[i].getValue(columns[1]),
				territory : search[i].getValue(columns[2]),
				territory_level1 : search[i].getValue(columns[3]),
				territory_level2 : search[i].getValue(columns[4]),

			});

		}// check if inactive
	}
	return results;

}