function updateSO_afterSubmit() {

	try {

		var RMA_rec = nlapiLoadRecord('returnauthorization', nlapiGetRecordId());

		var SO_internalid = RMA_rec.getFieldValue('createdfrom');

		if (SO_internalid != null && SO_internalid != undefined && SO_internalid != '') {
			nlapiLogExecution('debug', 'SO_internalid', SO_internalid)
			
			try{

					var rec = nlapiLoadRecord('salesorder', SO_internalid);
					var lineCount = rec.getLineItemCount('item');
					
					var RMALineNumber; 
					var SFLineID;
					var update = false;
														
					for(var i = 1; i<= lineCount; i++) {
						
						 RMALineNumber = rec.getLineItemValue('item', 'custcol_cbr_rma_custom_line_id', i);
						 SFLineID = rec.getLineItemValue('item', 'custcol_sf_so_lineid', i);
						
						 if(RMALineNumber != undefined && RMALineNumber != null && SFLineID == null) {
							
							nlapiLogExecution('debug', 'i', i)
							
							update = true;
							
							//SF SO LINE ID		
							 var getSFLineID = rec.getLineItemValue('item', 'custcol_sf_so_lineid', parseInt(RMALineNumber));							 
							 rec.setLineItemValue('item', 'custcol_sf_so_lineid', i, getSFLineID)
							 
							//FV PRICE LIST REGION	
							 var Region = rec.getLineItemValue('item', 'custcol_cbr_price_list_region', parseInt(RMALineNumber));
							 if (Region != null && Region != undefined && Region != '') {
								  rec.setLineItemValue('item', 'custcol_cbr_price_list_region', i, Region)
							 }
							
							 
							 //TIER
							 var Tier = rec.getLineItemValue('item', 'custcol_item_tier', parseInt(RMALineNumber));							 
							 if (Tier != null && Tier != undefined && Tier != '') {
								rec.setLineItemValue('item', 'custcol_item_tier', i, Tier)	 
                             }

                             //CONTRACT MODIFICATION
                             var contmodification = rec.getLineItemValue('item', 'custcol_cbr_contmodification', parseInt(RMALineNumber));
                             if (contmodification != null && contmodification != undefined && contmodification != '') {
                                 rec.setLineItemValue('item', 'custcol_cbr_contmodification', i, contmodification)
                             }

                             //Term Dis Schedule
                             var term_dis_schedule = rec.getLineItemValue('item', 'custcol_cbr_term_dis_schedule', parseInt(RMALineNumber));
                             if (term_dis_schedule != null && term_dis_schedule != undefined && term_dis_schedule != '') {
                                 rec.setLineItemValue('item', 'custcol_cbr_term_dis_schedule', i, term_dis_schedule)
                             }

                             //Annual Maintenance
                             var cpq_annualmaint = rec.getLineItemValue('item', 'custcol_cbr_cpq_annualmaint', parseInt(RMALineNumber));
                             if (cpq_annualmaint != null && cpq_annualmaint != undefined && cpq_annualmaint != '') {
                                 rec.setLineItemValue('item', 'custcol_cbr_cpq_annualmaint', i, cpq_annualmaint)
                             }

                             
							 

						 }
					}
					nlapiLogExecution('debug', 'update', update)
									
					if (update){nlapiSubmitRecord(rec)}
	
					}catch(err){
						nlapiLogExecution('debug', 'err', err)
					}
		}
	} catch (err) {
		nlapiLogExecution('debug', 'err', err)
	}

}


