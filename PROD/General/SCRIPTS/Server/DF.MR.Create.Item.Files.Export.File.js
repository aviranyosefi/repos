/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/email','N/error','N/file','N/email','N/format','N/log','N/record','N/render','N/runtime','N/search','../Common/BE.Lib.Common'],

function(email,error,file,email,format,logger,record,render,runtime,search,common) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {
    	return search.load({
			id: 'customsearch_df_item_files_export' //Items To Export Files [System]
		})
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	var result = JSON.parse(context.value);
		var values = result.values;
		
		
		var lineObj = {
    			itemId : 					context.key,
    			itemRecType :				result.recordType,
    			name : 						result.values.itemid
    			
    	};
		
		context.write({
    		key : lineObj.itemId,
    		value : JSON.stringify(lineObj)
    	})
		
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
    	var itemId = context.key;
    	var lineObj = JSON.parse(context.values[0]);
    	
    	var itemRec = record.load({
		    type: lineObj.itemRecType,
		    id: itemId,
		    isDynamic : true
		});
    	
    	var userObj = runtime.getCurrentUser();
    	var userId = userObj.id;
    	var filesCount = itemRec.getLineCount({ sublistId: 'mediaitem' }); //Not working for items....
    	logger.error({title: itemId + ' : ' + userId, details: filesCount });
    	/*
    	email.send({
		    author: 2547,
		    recipients: 2547,
		    subject: 'Test',
		    body: JSON.stringify(itemRec) ,
		    //attachments: [fileObj]
		});
    	*/
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
