/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/email','N/error','N/file','N/email','N/format','N/log','N/record','N/render','N/runtime','N/search','../Common/BE.Lib.Common'],

function(email,error,file,email,format,logger,record,render,runtime,search,common) {
   
    function getInputData() {
    	try {
    		
			return search.load({
				id: 'customsearch1050_2'
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
			
			if(values['oldvalue.systemNotes'].toLowerCase() == 'rma considred') {
				values['oldvalue.systemNotes'] = 'Item considered to be RMA'
			}
			if (values['newvalue.systemNotes'].toLowerCase() == 'rma considred') {
				values['newvalue.systemNotes'] = 'Item considered to be RMA'				
			}

			// Check for SLA Group 
			var slaGroup = getSLAGroup(values['oldvalue.systemNotes']);
			
			slaGroup = common.isNullOrEmpty(slaGroup) ? null : slaGroup.split(',');

			// write the lines if the record exists -> this validation dose not take into account same minute changes
			if(!checkIfRecordExists(values.internalid.value, values['date.systemNotes'], getStatusIdFromText(values['oldvalue.systemNotes']), getStatusIdFromText(values['newvalue.systemNotes']))) {
				
				context.write({
					key: values.casenumber, 
					value: {
						internalId: values.internalid.value,
						date: values['date.systemNotes'],
						newStatus: values['newvalue.systemNotes'],
						oldStatus: values['oldvalue.systemNotes'],
						slaGroup: slaGroup
					}
				});
				
			}
			
    	} catch (err) {   		
			logger.error({title: 'ERROR: map', details: JSON.stringify(err) });
			logStatus(values.internalid.value, err, values, 'map')
    	}
    }
	
    function reduce(context) {   	
		try {

			// var caseNumber = context.key;
			var values = context.values.map(JSON.parse);
			
//			logger.debug({ title: 'values', details: JSON.stringify(values) })
			values = values.sort(function(a,b) {
				var aTime = formatDate(a.date).getTime() 
				var bTime = formatDate(b.date).getTime()
				if(aTime - bTime != 0) {
					return aTime - bTime
				} else {
					return (b.newStatus == a.oldStatus) ? 1 : (a.newStatus == b.oldStatus) ? -1 : 0;
				}
			})
//			logger.debug({ title: 'sorted values', details: JSON.stringify(values) })

			for(var i = 0; i < values.length; i++) {
				var statusChange = values[i];
				statusChange.date = formatDate(statusChange.date);
				
				// CREATE NEW RECORD
				var newRec = record.create({ type: 'customrecord_df_sla_case_status', isDynamic: true });
				
				newRec.setValue({ fieldId: 'custrecord_df_sla_case', value: statusChange.internalId });
				newRec.setValue({ fieldId: 'custrecord_df_sla_from_status', value: getStatusIdFromText(statusChange.oldStatus) });
				newRec.setValue({ fieldId: 'custrecord_df_sla_to_status', value: getStatusIdFromText(statusChange.newStatus) });
				newRec.setValue({ fieldId: 'custrecord_df_sla_date_of_status_change', value: statusChange.date });
				if(!common.isNullOrEmpty(statusChange.slaGroup)) {
					newRec.setValue({ fieldId: 'custrecord_df_sla_group', value: statusChange.slaGroup });					
				}

				// Check for older record on same case
				var oldRec = getOldRec(statusChange.internalId)
				var duration = 0;
				
				if(!common.isNullOrEmpty(oldRec)) {
					// If oldRec exists it is not first instance of record for this case. Update duration for last record on this case.		
					duration = getDaysBetweenDates(formatDate(oldRec.date), statusChange.date)
					
				} else {
					
					var dateCreated = search.lookupFields({
						type: record.Type.SUPPORT_CASE,
						id: statusChange.internalId,
						columns: [ 'createddate' ]
					}).createddate;
					duration = getDaysBetweenDates(formatDate(dateCreated), statusChange.date)
					
				}
				
				newRec.setValue({ fieldId: 'custrecord_df_sla_status_duration', value: duration });								
				
				if(!common.isNullOrEmpty(statusChange.slaGroup) && statusChange.slaGroup.length > 0) {
					
					updateTimeSpentOnSLAGroup(statusChange.internalId, duration, statusChange.slaGroup);
					
				}
				
				var newRecId = newRec.save();
				
				if(!common.isNullOrEmpty(oldRec)) {
					record.submitFields({
						type: 'customrecord_df_sla_case_status',
						id: oldRec.id,
						values: {
							'custrecord_df_sla_following_record' : newRecId
						}
					});					
				}

			}

    	} catch (err) {
    		logger.error({title: 'ERROR: reduce', details: JSON.stringify(err) });
    		logStatus(statusChange.internalId, err, values, 'reduce')
    	}
    }

    function summarize(summary) {



    }


	/**
	 *  HELPERS
	 */
    
    function updateTimeSpentOnSLAGroup(caseId, duration, SLAGroup) {
    	
    	var fieldIds = [];
    	
//    	logger.debug({ title: 'caseId', details: caseId })
//    	logger.debug({ title: 'duration', details: duration })
//    	logger.debug({ title: 'SLAGroup', details: SLAGroup })
    	
    	search.create({
    		type: "customrecord_df_sla_group_name",
    		filters: [ ["internalid","anyof",SLAGroup] ],
    		columns: [ "custrecord_df_sla_field" ]
    	}).run().each(function(result){
    		
    		fieldIds.push(result.getValue({ name: 'custrecord_df_sla_field' }))
    		
    		return true;
    	});
    	
//    	logger.debug({ title: 'fieldIds', details: fieldIds })
    	var durationFieldLookup = search.lookupFields({
    	    type: record.Type.SUPPORT_CASE,
    	    id: caseId,
    	    columns: fieldIds
    	});
//    	logger.debug({ title: 'durationFieldLookup', details: durationFieldLookup })
    	var values = {};
    	
    	for(var i = 0; i < fieldIds.length; i++) {
    		var pastDuration = durationFieldLookup[fieldIds[i]]
    		pastDuration = common.isNullOrEmpty(pastDuration) ? 0 : Number(pastDuration);
    		values[fieldIds[i]] = pastDuration + duration
    	};
    	
//    	logger.debug({ title: 'values', details: JSON.stringify(values) })
    	
		record.submitFields({
			type: record.Type.SUPPORT_CASE,
			id: caseId,
			values: values
		});
    	
    }
    
    function checkIfRecordExists(caseId, dateOfChange, fromStatus, toStatus) {
    	var exists = false;
    	//logger.debug({ title: 'toStatus', details: toStatus });
    	var checkIfRecordExistsSearch = search.create({
    		type: "customrecord_df_sla_case_status",
    		filters:
    			[
    			 ["custrecord_df_sla_case","anyof",caseId], 
    			 "AND", 
    			 ["custrecord_df_sla_date_of_status_change","on",dateOfChange], 
    			 "AND", 
    			 ["custrecord_df_sla_from_status","anyof",fromStatus], 
    			 "AND", 
    			 ["custrecord_df_sla_to_status","anyof",toStatus]
    			 ],
    		columns:
    			[
    			 "custrecord_df_sla_date_of_status_change"
    			]
    	});
    	
    	var searchResultCount = checkIfRecordExistsSearch.runPaged().count;

    	if(searchResultCount > 0) {
    		exists = true
    	}
    	
    	return exists;
    }

	function getOldRec(internalId)	{
		var res = {
			id: null,
			date: null
		}

		var caseSearch = search.create({
			type: "customrecord_df_sla_case_status",
			filters:
			[
			   ["custrecord_df_sla_case","anyof",internalId], 
			   "AND", 
			   ["custrecord_df_sla_following_record","anyof","@NONE@"]
			],
			columns:
			[
			   search.createColumn({
				  name: "internalid",
				  sort: search.Sort.DESC
			   }),
			   "custrecord_df_sla_date_of_status_change"
			]
		 });

		 var caseSearchResCount = caseSearch.runPaged().count;

		 if(caseSearchResCount > 0) {
			 
			 caseSearch.run().each(function(result){
				 res.id = result.getValue({ name: "internalid" })
				 res.date = result.getValue({ name: "custrecord_df_sla_date_of_status_change" })
				 return true;
				});

				if(caseSearchResCount > 1) {
					// if more then one older record is found something went wrong
					logger.error({title: 'Error in getOldRec', details: caseSearchResCount + ' match\'s found for case: ' + internalId + '. Used: ' + res.id });
				}

			}

		 return (common.isNullOrEmpty(res.id)) ? null : res ;
	}
	
	function getSLAGroup(status) {
		//logger.debug({ title: 'status', details: status });
		var statusId = getStatusIdFromText(status);
		var slaGroup = null;
		//logger.debug({ title: 'statusId', details: statusId });
		search.create({
			type: "customrecord_df_sla_group",
			filters:[ ["custrecord_df_sla_group_case_status","anyof",statusId] ],
			columns:[ "custrecord_sla_group_name" ]
		}).run().each(function(result){
			slaGroup = result.getValue({ name: 'custrecord_sla_group_name' })
			return true;
		});
		
		return slaGroup
	}
	
	function getStatusIdFromText(statusTxt) {
		var statusId = null;
		
		search.create({
			type: "customrecord_df_sla_group",
			filters:[],
			columns: [ "custrecord_df_sla_group_case_status" ]
		}).run().each(function(result){
			
			if(result.getText({ name: 'custrecord_df_sla_group_case_status' }).toLowerCase() == statusTxt.toLowerCase()) {
				statusId = result.getValue({ name: 'custrecord_df_sla_group_case_status' })
			}
				
			return true;
		});
		if(common.isNullOrEmpty(statusId)){
        	logger.debug({ title: 'statusTxt', details: 'statusTxt is: ' + statusTxt + ' and statusId is: ' + statusId });
        }
		return statusId
	}

	function formatDate(d) {
		if (!common.isNullOrEmpty(d)) {
			if(typeof(d) === "object"){
				return d;
			} else {
				return format.parse({
					value: d,
					type: format.Type.DATETIME 
				});
			}
		}
		return null;
	}
	
	function getDaysBetweenDates(oldDate, newDate) {
		// To calculate the time difference of two dates
		var diffInTime = newDate.getTime() - oldDate.getTime();
		
		// To calculate the no. of days between two dates
		return diffInTime / (1000 * 3600 * 24);
	}
	
    function logStatus(caseId, err, valSet, stage) {
    	
    	var errLogRec = record.create({
		    type: 'customrecord_df_sla_case_status_err_log'
		});
    	
    	errLogRec.setValue({
			fieldId : 'custrecord_df_sla_case_err_log_case',
			value : caseId
		});
    	errLogRec.setValue({
    		fieldId : 'custrecord_df_sla_case_err_log_err_msg',
    		value : err.message
    	});
    	errLogRec.setValue({
    		fieldId : 'custrecord_df_sla_case_err_log_full_err',
    		value : JSON.stringify(err)
    	});
    	errLogRec.setValue({
    		fieldId : 'custrecord_df_sla_case_err_log_vals_set',
    		value : JSON.stringify(valSet)
    	});
    	errLogRec.setValue({
    		fieldId : 'custrecord_df_sla_case_err_log_stage',
    		value : stage
    	});
    	
    	var errLogRecId = errLogRec.save();
    	
    	try {
          
    		var d = new Date();
    		email.send({
    			author: '2466',
    			recipients: '2466',
    			subject: 'Error in SLA Case status script' + [d.getDate(),d.getMonth() + 1,d.getFullYear()].join('/'),
    			body: 'Please check the SLA Case Status Error Log for more details'
    		});
			
		} catch (err) {
			logger.error({title: 'ERROR: sending email', details: JSON.stringify(err) });
		}
    	
    	return errLogRecId;
    }
	
	
    return {
		getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});