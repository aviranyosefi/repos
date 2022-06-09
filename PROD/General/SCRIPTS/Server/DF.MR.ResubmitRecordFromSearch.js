/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 * Created By: Nadav Julius (BE NetSuite)
 */
define(['N/email','N/error','N/file','N/email','N/format','N/log','N/record','N/render','N/runtime','N/search','../Common/BE.Lib.Common'],

function(email,error,file,email,format,logger,record,render,runtime,search,common) {
   
    function getInputData() {
    	try {
    		
			return search.load({
				id: 'customsearch_resubmit_recordd'
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
			
//			logger.error({title: 'values', details: JSON.stringify(values) });
			
			var rec = record.load({ 
				type: values.recordtype, 
				id: values.internalid.value
			});
			
			rec.save();

    	}
    	catch (err) {   		
    		logger.error({title: 'ERROR: Map.', details: JSON.stringify(err) });
    	}
    }

    function reduce(context) {

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
