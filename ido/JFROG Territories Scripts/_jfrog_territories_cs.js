

function populateTerritory_FieldChange(type, name, linenum){
	
	try{

if(name == 'custbody_enduser_country') {
	
	var countrySelected = nlapiGetFieldText('custbody_enduser_country');
		nlapiSetFieldMandatory('custbody_enduser_state', true);
	}else{
		var terr = setTerritories(countrySelected,null);
		if(terr == undefined) {
			
			var other = 'Other'
				
			if(countrySelected != '') {
			alert(countrySelected + ' does not have a Territory Record. Territory fields will be populated with '+other);
			}
			populateTerritoryFields(terr)
		}else{
			
			populateTerritoryFields(terr)
			
		}
	}
}

if(name == 'custbody_enduser_state' && nlapiGetFieldText('custbody_enduser_country') == 'United States') {
	
	var countrySelected = nlapiGetFieldText('custbody_enduser_country');
	var stateSelected = nlapiGetFieldText('custbody_enduser_state');

		var terr = setTerritories(countrySelected,stateSelected);
		
		if(terr != undefined) {
			populateTerritoryFields(terr)
		}
	
}
 
	}catch(err){
		console.log(err);
		return true;
	}

	
}



function territoryOnSave() {
	
	var checkCountry = nlapiGetFieldText('custbody_enduser_country');
	var checkState = nlapiGetFieldText('custbody_enduser_state');
	
	if(checkCountry == 'United States' && checkState == "") {
		
		alert('Please add an END USER - STATE');
		return false;
	}
	
	
	return true;
}



function populateTerritoryFields(terr) {
	
	var checkIfEmpty = nlapiGetFieldText('custbody_enduser_country');
	
	if(checkIfEmpty != "") {
	
	if(terr != undefined) {
	
	var territory = terr.territory
	var terr_level1 = terr.territory_level1
	var terr_level2 = terr.territory_level2
	
	if(territory == '') {
		territory = 'Other'
	}
	if(terr_level1 == '') {
		terr_level1 = 'Other'
	}
	if(terr_level2 == '') {
		terr_level2 = 'Other'
	}
	
	nlapiSetFieldValue('custbody_ter', territory, null, null)
	nlapiSetFieldValue('custbody_ter_level1', terr_level1, null, null)
	nlapiSetFieldValue('custbody_ter_level2', terr_level2, null, null)
	
	}else{
		
		nlapiSetFieldValue('custbody_ter', 'Other', null, null)
		nlapiSetFieldValue('custbody_ter_level1', 'Other', null, null)
		nlapiSetFieldValue('custbody_ter_level2', 'Other', null, null)
		
	}
	}//checkIfEmpty != ''
	
}



function setTerritories(country,state) {
	
	var res;
	
	var allTerritories = getTerritories();
	
	for(var i = 0; i<allTerritories.length; i++) {
		
		if(state == null) {
			
			if(country == allTerritories[i].country) {
				
				res = allTerritories[i]
			}
		}//if state == null
	
		if(state != null) {
			
			if(country == allTerritories[i].country && state == allTerritories[i].state) {
				
				res = allTerritories[i]
			}
		}//if state != null
		
		
	}
	
	
	
	return res;
}


function getTerritories() {
	


		var results = [];
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('custrecord_jfrog_enduser_country', null, null);
		columns[1] = new nlobjSearchColumn('custrecord_jfrog_enduser_state', null, null);
		columns[2] = new nlobjSearchColumn('custrecord_jfrog_territory', null, null);
		columns[3] = new nlobjSearchColumn('custrecord_jfrog_territory_level1', null, null);
		columns[4] = new nlobjSearchColumn('custrecord_jfrog_territory_level2', null, null);
		columns[5] = new nlobjSearchColumn('isinactive', null, null);
		
		var search = nlapiSearchRecord('customrecord_jfrog_territory', null, null, columns);
		
		for (var i = 0; i < search.length; i++) {
			
			if(search[i].getValue(columns[5]) != 'T') {
				
		
			results.push({
				country : search[i].getValue(columns[0]),
				state : search[i].getValue(columns[1]),
				territory : search[i].getValue(columns[2]),
				territory_level1 : search[i].getValue(columns[3]),
				territory_level2 : search[i].getValue(columns[4]),
			

			});
			
			}//check if inactive
		}
		return results;
	
	
	
	
}