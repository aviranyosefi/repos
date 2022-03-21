/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 Oct 2018     idor
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
function updateRevRecBodyDates(type){
	
	
  
}



function updateRevRec(inv_id) {
	
	var startdate = '';
	var enddate = '';
	
	var rec = nlapiLoadRecord('invoice', inv_id);
	
	var lineCount = rec.getLineItemCount('item');
	
	for(var x = 0; x<lineCount; x++) {
	
		var currItem = rec.getLineItemValue('item', 'item', x+1);
		
		if(currItem == '28') { //Subscriptions Item internal id
			
			startdate = rec.getLineItemValue('item', 'custcol_optibus_rev_rec_start_date', x+1);
			enddate = rec.getLineItemValue('item', 'custcol_optibus_rev_rec_end_date', x+1)	
		}
		
	}	
	
	if(startdate != '' && enddate != '') {
		rec.setFieldValue('startdate', startdate)
		rec.setFieldValue('enddate', enddate)
	}

	
	nlapiSubmitRecord(rec);
	
}