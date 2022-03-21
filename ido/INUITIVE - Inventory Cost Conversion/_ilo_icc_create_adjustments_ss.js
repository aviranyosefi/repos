/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Sep 2017     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function createInvAdjustments(type) {
	
	var context = nlapiGetContext();
	var icc_id = context.getSetting('SCRIPT', 'custscript_ilo_ss_icc_id');


	var rec = nlapiLoadRecord('customtransaction_ilo_icc_transaction', icc_id);

	var subsid = rec.getFieldValue('subsidiary');
	var cogsAcc = rec.getFieldValue('custbody_ilo_icc_cogs_acc');
	var locationAdj = rec.getFieldValue('custbody_ilo_icc_location');
	var headerDescription = rec.getFieldValue('custbody_ilo_icc_description');


	var adjData = [];

		var itemCount = rec.getLineItemCount('line');
		for (var i=0; i<itemCount ; i++ ) { 
		
		adjData.push({
		
		initialitem : rec.getLineItemValue('line', 'custcol_ilo_icc_initial_item', i+1),
		converteditem : rec.getLineItemValue('line', 'custcol_ilo_icc_converted_item', i+1),
		description : rec.getLineItemValue('line', 'custcol_ilo_icc_description', i+1),
		units : rec.getLineItemValue('line', 'custcol_ilo_icc_units', i+1),
		qty_onhand : rec.getLineItemValue('line', 'custcol_ilo_icc_qty_onhand', i+1),
		qty_initial : rec.getLineItemValue('line', 'custcol_ilo_icc_qty_initial', i+1),
		qty_converted : rec.getLineItemValue('line', 'custcol_ilo_icc_qty_converted', i+1),
		bin : rec.getLineItemValue('line', 'custcol_ilo_icc_bin', i+1),
		invdetail : rec.getLineItemValue('line', 'custcol_ilo_icc_inv_detail', i+1),
		subsid : subsid,
		cogsAcc : cogsAcc,
		lineLocation : locationAdj,
		header_description : headerDescription
		});
		}
		
if(adjData != null) {
	
	
	
	adjData.forEach(function(element) {
		
		//OUT
		var adjRecOut = nlapiCreateRecord('inventoryadjustment');
		
		adjRecOut.setFieldValue('subsidiary', element.subsid);
		adjRecOut.setFieldValue('memo', element.header_description);
		
		
		adjRecOut.selectNewLineItem('inventory');
		adjRecOut.setCurrentLineItemValue('inventory', 'item', element.initialitem);
		adjRecOut.setCurrentLineItemValue('inventory', 'memo', element.description);
		adjRecOut.setCurrentLineItemValue('inventory', 'adjustqtyby', pos_to_neg(parseInt(element.qty_initial)));
		adjRecOut.setCurrentLineItemValue('inventory', 'location', element.lineLocation);

		adjRecOut.commitLineItem('inventory'); 
		
		
		//IN
		var adjRecIn = nlapiCreateRecord('inventoryadjustment');
		
		adjRecIn.setFieldValue('subsidiary', element.subsid);
		adjRecIn.setFieldValue('memo', element.header_description);
		
		
		adjRecIn.selectNewLineItem('inventory');
		adjRecIn.setCurrentLineItemValue('inventory', 'item', element.converteditem);
		adjRecIn.setCurrentLineItemValue('inventory', 'memo', element.description);
		adjRecIn.setCurrentLineItemValue('inventory', 'adjustqtyby', parseInt(element.qty_converted));
		adjRecIn.setCurrentLineItemValue('inventory', 'location', element.lineLocation);

		adjRecIn.commitLineItem('inventory'); 
		
		nlapiSubmitRecord(adjRecOut);
		nlapiSubmitRecord(adjRecIn);
	    
	});
}
			  
};



function pos_to_neg(num)
{
return -Math.abs(num);
}