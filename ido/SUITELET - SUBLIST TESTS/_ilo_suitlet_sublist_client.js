/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Jun 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function sublistClient_pageLoad(type){
	
	try{
		
		var sublistBtn = document.getElementById('custpage_transaction_list_buttons');
		sublistBtn.style.display = 'none'
	
	}catch(err){
		console.log(err)
	}
   
}
