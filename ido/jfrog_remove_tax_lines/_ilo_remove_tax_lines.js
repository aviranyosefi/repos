/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Sep 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function remove_taxLines(type){
	
	if (type == 'create') {
		
		var subsid = nlapiGetFieldValue('subsidiary');
		
		if(subsid == '1') { //JFROG LTD 
			
			
		}
			
	if(subsid == '2') { //JFROG INC 
			
			
		}
		
		
		
		
	}
	
	
  
}







