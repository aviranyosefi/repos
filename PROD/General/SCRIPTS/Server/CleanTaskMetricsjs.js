/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/email','N/error','N/file','N/format','N/log','N/record','N/render','N/runtime','N/search','../Common/BE.Lib.Common'],

function(email,error,file,format,logger,record,render,runtime,search,common) {
   
    function getInputData() {
    	try {
    		
			return search.load({
				id: 'customsearch_clean_case_metrics'
			})

    	}
    	catch (err) {   		
    		logger.error({title: 'ERROR: getInputData.', details: JSON.stringify(err) });
    	}
    }

    function map(context) {
    	try {
    		var result = JSON.parse(context.value);
    		var values = result.values;
			
			record.submitFields({
				type: record.Type.SUPPORT_CASE,
				id: values.internalid.value,
				values: {
					custevent_df_sla_t1reseller_timer: '',
					custevent_df_sla_rd_timer: '',
					custevent_df_sla_rma_timer: '',
					custevent_df_sla_technical_support_time: ''
				}
			});	
			
		} catch (err) {
			logger.error({title: 'ERROR: map.', details: JSON.stringify(err) });
		}   	
    }

    function reduce(context) {
    	try {
			

    		
			record.submitFields({
				type: 'customrecord_df_sla_case_status',
				id: oldRec.id,
				values: values
			});	
    		
		} catch (err) {
			logger.error({title: 'ERROR: recude.', details: JSON.stringify(err) });
		}   
    }

    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
