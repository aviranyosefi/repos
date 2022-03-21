/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 Aug 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function icc_pageInit(type){
	
	var toUpdate = [];
		var lines = nlapiGetLineItemCount('custpage_conv_sublist');

		for (var x = 0; x<lines; x++) {
			
			var initialitem = nlapiGetLineItemValue('custpage_conv_sublist', 'custpage_convsublist_initial', x +1);
			var description = nlapiGetLineItemValue('custpage_conv_sublist', 'custpage_convsublist_description', x +1);
			var converteditem = nlapiGetLineItemValue('custpage_conv_sublist', 'custpage_convsublist_converted', x +1);
			var units = nlapiGetLineItemValue('custpage_conv_sublist', 'custpage_convsublist_units', x +1);
			var qty_onhand = nlapiGetLineItemValue('custpage_conv_sublist', 'custpage_convsublist_quantity_hand', x +1);
			var qty_initial = nlapiGetLineItemValue('custpage_conv_sublist', 'custpage_convsublist_quantity_initial', x +1);
			var qty_converted = nlapiGetLineItemValue('custpage_conv_sublist', 'custpage_convsublist_quantity_converted', x +1);	
			var bin = nlapiGetLineItemValue('custpage_conv_sublist', 'custpage_convsublist_bin', x +1);	
			var invdetail = nlapiGetLineItemValue('custpage_conv_sublist', 'custpage_convsublist_inv_detail', x +1);	

		
			
			toUpdate.push({
				
				initialitem : initialitem,
				description : description,
				converteditem: converteditem,
				qty_onhand : qty_onhand,
				units: units,
				qty_initial : qty_initial,
				qty_converted : qty_converted,
				bin : bin,
				invdetail : invdetail
			
				
				});

					
		

		};// end of lineCount loop
		
		var JSONdata = JSON.stringify(toUpdate)
		
		nlapiSetFieldValue('custpage_data_field', JSONdata)
   
};


function save_continue(type){
	
	return true;

}