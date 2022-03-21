/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 Jun 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function update_revArrangments(type) {
	
	
	try{

		//get population of saved search
		var all = getAllArrangements();

		
		if (all != []) {
			all.forEach(function(element) {
				
				
				var rec = nlapiLoadRecord('revenuearrangement', element.internalid);
				
				var lineCount = rec.getLineItemCount('revenueelement');
							
				for(var i = 0; i<lineCount; i++) {
					try{
						
		
				var exchangeRate = rec.setLineItemValue('revenueelement', 'custcol_opportunity_type', i+1, element.opp_type);
					}
					catch(err) {
						nlapiLogExecution('error', 'err - in loop', err);
						continue;
					}
				}
		
				nlapiSubmitRecord(rec);
				
				});
			
		}// end of if (all != [])
		
		
		}catch(err){
			nlapiLogExecution('error', 'update_revArrangments -err', err)
		}

}





function getAllArrangements() {


	var searchAssets = nlapiLoadSearch(null, 'customsearch268');

	var allassets = [];
	var resultsAssets =[];
	var resultContacts = [];
	var searchid = 0;
	var resultset = searchAssets.runSearch();
	var rs;
	var cols = searchAssets.getColumns();
	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allassets.push(resultContacts[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allassets != null) {
				allassets.forEach(function(line) {
					
						if(line.getValue(cols[0]) != '') {
											 

					resultsAssets.push({
			                            	  
			                              internalid : line.getValue(cols[0]),
			                              opp_type : line.getValue(cols[1]),
										  opp_type_name : getTypeName(line.getValue(cols[1]))
			                
			  
										  

			                              });

						}
			               });

			};
		
			return resultsAssets;

}




function getTypeName(type) {


var res = '' ;
var oppType = [

{name : '- New -', internalid : '-1'},
{name : 'Churn', internalid : '5'},
{name : 'Expand', internalid : '4'},
{name : 'New', internalid : '1'},
{name : 'One time', internalid : '6'},
{name : 'Renew', internalid : '2'},
{name : 'Renew and Expand', internalid : '3'},
{name : 'Returning after Churn', internalid : '7'},

]


for(var i = 0; i<oppType.length; i++) {

if(type == oppType[i].internalid) {

res = oppType[i].name;
}
}
return res;

}