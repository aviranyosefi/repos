/**
 * Helpers
 * @NApiVersion 2.x
 * @NModuleScope public
 */
define(['require', './NCS.Lib.Common', './NCS.Lib.Extenders', 'N/log', 'N/record', 'N/error', 'N/runtime', 'N/search', 'N/format'], 
		function(require, common, extenders, logger, record, error, runtime, search, format) {
	
	getRecordValuesByNames = function(recType,namesArray,resultColumns,customNameField){
		if (common.isNullOrEmpty(customNameField)) {
			customNameField = 'name';
		}
		var columns = [search.createColumn({
	         name: customNameField
	    })];
		if (!common.isNullOrEmpty(resultColumns) && resultColumns.length > 0) {
			columns = resultColumns;
		}
		var res = {};
		var batchSize = 200;
		while (namesArray.length > 0) {	
			var splicedNames = namesArray.splice(0, batchSize);	
			var formula = "case when {" + customNameField + "} in ('" + splicedNames.join("','") + "') then 1 else 0 end";			
			var filter = search.createFilter({
			    name: 'formulanumeric',
			    operator: search.Operator.EQUALTO,
			    formula : formula,
			    values : 1
			});
			search.create({
				type: recType,
			    filters: [
			             filter
			    ],
			    columns: columns
			}).run().each(function(resLine){
				var dataObj = {};
				var recName = 'NoName_' + i.toString();
				if (common.isNullOrEmpty(resultColumns) || resultColumns.length == 0) {
					var recId = resLine.id;
					dataObj = recId;
					recName = resLine.getValue({
			            name: customNameField
			        });	
				}
				else {
					for ( var j = 0; j < columns.length; j++) {
						var col = columns[j];
						var colName = col.name;
						var colVal = resLine.getValue(col);
						if (colName == customNameField) {
							recName = colVal;
						}
						dataObj[colName] = colVal;
					}
				}
				res[recName] = dataObj;
				return true;
			});
		}
		return res;
	};
	
	getRecordTypeNumericId = function(recType){
		var res = null;		
		require(['N/search'], function(search) {
			search.create({
				type: "customrecord_ncs_rec_type_numeric_id_map",
			    filters: [
					['custrecord_ncs_rec_type_num_id_map_gs', 'noneof', '@NONE@'],
					'AND',
			        ["custrecord_ncs_rec_type_num_id_map_id","is",recType]
			    ],
			    columns: [
			      search.createColumn({
			         name: "custrecord_ncs_rec_type_num_id_map_type"
			      })
			    ]
			}).run().each(function(result){
				if (!common.isNullOrEmpty(res)) {
					throw error.create({
						name : 'getRecordTypeNumericId',
						message : 'More than 1 mapping was found for record type ' + recType,
						notifyOff : true
					});
				}
				res = result.getValue({
		            name: "custrecord_ncs_rec_type_num_id_map_type"
		        });
				return true;
			});
		});
		if (common.isNullOrEmpty(res)) {
			throw error.create({
				name : 'getRecordTypeNumericId',
				message : 'Unable to find record type mapping for record type : ' + recType,
				notifyOff : true
			});
		}
		return res;
	};
	
	createProjectForSO = function(rec) {

		var projectNamePrefix = ''; // 'PR'
		var professionalServicesId = '8';

		var projectId = rec.getValue({
			fieldId: 'custbody_cbr_so_project'
		});
		if (common.isNullOrEmpty(projectId)) {
			var isProfessionalServices = false;
			var lineCount = rec.getLineCount({
	    	    sublistId: 'item'
	    	});
			for (var lineNumber = 0; lineNumber < lineCount; lineNumber++) {
				// look for at least 1 item with Professional Services category and not Excluded Charge Base   	
			 	var itemCategory = rec.getSublistValue({
	        	    sublistId: 'item',
	        	    fieldId: 'custcol_cbr_trn_item_category',
	        	    line: lineNumber
	        	});
			   	
			   	var itemExcludedChargeBase = rec.getSublistValue({
	        	    sublistId: 'item',
	        	    fieldId: 'custcol_cbr_excluded_cb',
	        	    line: lineNumber
	        	});
				
			   	if (!common.isNullOrEmpty(itemCategory) && !common.isNullOrEmpty(itemExcludedChargeBase) && itemCategory == professionalServicesId && itemExcludedChargeBase == false) {
			   		isProfessionalServices = true;
			   		break;
			   	}
			}

			if (isProfessionalServices == true) {
				require(['N/search'], function(search) {
					var projectTemplate = search.lookupFields({
		    		    type: 'customrecord_ncs_global_settings',
		    		    id: '1',
		    		    columns: ['custrecord_cbr_project_template']
		    		});
					
					if (projectTemplate.custrecord_cbr_project_template.length == 1 && projectTemplate.custrecord_cbr_project_template[0].hasOwnProperty('value')) {
						var projectTemplateId = projectTemplate.custrecord_cbr_project_template[0].value;
						if (common.isNullOrEmpty(projectTemplateId)) {
							throw error.create({
								name : 'createProjectForSO',
								message : 'missing Default Project Template at Globla Settings',
								notifyOff : true
							});
						}
						var subsidiary = rec.getValue({
							fieldId: 'subsidiary'
						});
						var opportunityNumber = rec.getValue({
							fieldId: 'custbody_cbr_so_opp_num'
						});
						var customerId = rec.getValue({
							fieldId: 'entity'
						});
						var currency = rec.getValue({
							fieldId: 'currency'
						});
						var endUserId = rec.getValue({
							fieldId: 'custbody_cbr_so_end_user'
						});
						var project = record.create({
						    type: record.Type.JOB, 
						    isDynamic: true
						});
						if (common.isNullOrEmpty(opportunityNumber)) {
							opportunityNumber = Date.now();
						} else {
							project.setValue({
								fieldId: 'autoname',
								value: false
							});
							
							project.setValue({
								fieldId: 'entityid',
								value: customerId + ' ' + opportunityNumber
							});
						}
						project.setValue({
							fieldId: 'subsidiary',
							value: subsidiary
						});
						project.setValue({
							fieldId: 'projecttemplate',
							value: projectTemplateId
						});
						project.setValue({
							fieldId: 'parent',
							value: customerId
						});
						project.setValue({
							fieldId: 'custentity_cbr_end_user',
							value: endUserId
						});
						project.setValue({
							fieldId: 'currency',
							value: currency
						});
						project.setValue({
							fieldId: 'companyname',
							value: projectNamePrefix + opportunityNumber
						});
						project.setValue({
							fieldId: 'entitystatus',
							value: '2' // In Progress
						});

						projectId = project.save();
						
						rec.setValue({
							fieldId: 'custbody_cbr_so_project',
							value: projectId
						});
					}
				});
			}
		}
	};
	
	getRevenueArrangementsElemtnsBySOId = function (soId) {
		var revenueArrangementsMap = {};
		// returns
		// {
		//  revenueArrangementInternalId: {revenueArrangementCustomLineId: revenueElementInternalId}
		//	"17074":{"1":"12505","2":"12406","3":"12507"},
		//	"17381":{"1":"12506","2":"12407","3":"12508"}
		// }
		require(['N/search'], function(search) {
			var revenueelementSearchObj = search.create({
				type: "revenueelement",
			    filters: [
			        ["sourcetransaction.internalid","anyof", soId],
			        'AND',
			        ['revenueArrangement.internalid',"noneof","@NONE@"]
			    ],
			    columns: [
			      search.createColumn({
			         name: "internalid",
			         join: "revenueArrangement",
			         summary: "GROUP",
			         sort: search.Sort.ASC
			      }),
			      search.createColumn({
			         name: "custcol_cbr_custom_line_id",
			         join: "revenueArrangement",
			         summary: "GROUP"
			      }),
			      search.createColumn({
			         name: "internalid",
			         summary: "GROUP"
			      })
			    ]
			}).run().each(function(result){

				var revenueArrangementInternalId = result.getValue({
		            name: "internalid",
		            join: "revenueArrangement",
		            summary: "GROUP"
		        });

				if (!revenueArrangementsMap.hasOwnProperty(revenueArrangementInternalId)) {
			    	revenueArrangementsMap[revenueArrangementInternalId] = {};
			    }
				var revenueElementInternalId = result.getValue({
			        name: "internalid",
			        summary: "GROUP"
			    });

			    var revenueArrangementCustomLineId = result.getValue({
			        name: "custcol_cbr_custom_line_id",
			        join: "revenueArrangement",
			        summary: "GROUP"
			    });
	
			    if (!common.isNullOrEmpty(revenueArrangementCustomLineId)) {
			    	revenueArrangementsMap[revenueArrangementInternalId][revenueArrangementCustomLineId] = revenueElementInternalId
			    }
				return true;
			});
		});
		return revenueArrangementsMap;
	};
	
	getRevenueArrangementsBySOId = function(soId) {
		var revenueArrangementIds = [];
		require(['N/search'], function(search) {
			if (common.isNullOrEmpty(soId)) {
				throw error.create({
					name : 'getRevenueArrangementsBySOId',
					message : 'missing Sales Order : soId parameter',
					notifyOff : true
				});
			}
			
			var revenueelementSearchObj = search.create({
			   type: "revenueelement",
			   filters: [
			      ["sourcetransaction.internalid","anyof", soId]
			   ],
			   columns: [
			      search.createColumn({
			         name: "internalid",
			         join: "revenueArrangement",
			         summary: "GROUP",
			         sort: search.Sort.ASC
			      })
			   ]
			}).run().each(function(result){
				var revenueArrangementId = result.getValue({
			         name: "internalid",
			         join: "revenueArrangement",
			         summary: "GROUP"
			      });
				if (!common.isNullOrEmpty(revenueArrangementId) && revenueArrangementIds.indexOf(revenueArrangementId) == -1) {
					revenueArrangementIds.push(revenueArrangementId);
				}
				return true;
			});
		});
		return revenueArrangementIds;
	};
	
	/**
	 * 
	 * @param rec : nlobjRecord of the transaction
	 * @param sublistId : sublist id
	 * @param fieldId : column id
	 * @returns array
	 * This function returns distinct values in the field "fieldId" from the sublist "sublistId"
	 */
	getSublistDistinctValues = function(rec, sublistId, fieldId) {
		var itemsIds = [];
		if (!common.isNullOrEmpty(sublistId)) {
			
			var itemsLineCount = rec.getLineCount({
	    	    sublistId: sublistId
	    	});
		   	for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {

    			var itemInternalId = rec.getSublistValue({
            	    sublistId: sublistId,
            	    fieldId: fieldId,
            	    line: lineNumber
            	});
    			if (itemsIds.indexOf(itemInternalId) == -1) {
    				itemsIds.push(itemInternalId);
    			}
	    	}
		}
		return itemsIds;
	}
	
	updateNewBizDates = function(rec) {
		if (!common.isNullOrEmpty(rec) && rec.type == record.Type.ITEM_FULFILLMENT) {
			var endUserId = rec.getValue({
			    fieldId: 'custbody_cbr_so_end_user'
			});
			if (!common.isNullOrEmpty(endUserId)) {
				// endUserFields ~ {"custentity_cbr_sf_new_account":false,"custentity_cbr_new_biz_date":""}
				var endUserFields = search.lookupFields({
	    		    type: search.Type.CUSTOMER,
	    		    id: endUserId,
	    		    columns: ['custentity_cbr_sf_new_account', 'custentity_cbr_new_biz_date']
	    		});
				
				// if End User is New Account and has no New Biz Date
				if (common.nsBoolToBool(endUserFields.custentity_cbr_sf_new_account) == true && common.isNullOrEmpty(endUserFields.custentity_cbr_new_biz_date)) {
					// ensure no item fulfillments exists with current end user 
					var itemFulfillemtsCount = Number(search.create({
	        			type: search.Type.ITEM_FULFILLMENT,
	        			columns: [
							search.createColumn({
								name: 'internalid',
							    summary: search.Summary.COUNT
							 })
	        			], 
	        			filters: [
							['mainline', 'is', 'T'],
							'AND',
							['internalid', 'noneof', rec.id],
							'AND',
	          		        ['custbody_cbr_so_end_user', 'anyof', endUserId]
	        			]
	        		}).run().getRange(0, 1)[0].getValue({
						name: 'internalid',
					    summary: search.Summary.COUNT
					 }));
					
					if (itemFulfillemtsCount == 0) {
						var tranDate = rec.getValue({
						    fieldId: 'trandate'
						});
						var toSubmitTranDate = format.format({value: tranDate, type: format.Type.DATE});
						rec.setValue({
						    fieldId: 'custbody_cbr_end_user_new_biz_date',
						    value: tranDate
						});
						var soId = rec.getValue({fieldId: 'createdfrom'});
						var revenueArrangementsIds = this.getRevenueArrangementsBySOId(soId);
						
						var recTypeSubmitFieldsMap = {};
						// update Item Fulfillment's New Biz Date
						recTypeSubmitFieldsMap[record.Type.ITEM_FULFILLMENT] = {
							internalIds: [rec.id],
							values: {custbody_cbr_end_user_new_biz_date: toSubmitTranDate}
						};
						// update End User's New Biz Date
						recTypeSubmitFieldsMap[record.Type.CUSTOMER] = {
							internalIds: [endUserId],
							values: {custentity_cbr_new_biz_date: toSubmitTranDate}
						};
						// update Sales Orerder's New Biz Date
						recTypeSubmitFieldsMap[record.Type.SALES_ORDER] = {
							internalIds: [soId],
							values: {custbody_cbr_end_user_new_biz_date: toSubmitTranDate}
						};

						for (var recordType in recTypeSubmitFieldsMap) {
							if (recTypeSubmitFieldsMap.hasOwnProperty(recordType)) {
								var submitFieldsCustomData = recTypeSubmitFieldsMap[recordType];
								if (common.isArrayAndNotEmpty(submitFieldsCustomData.internalIds)) {
									submitFieldsCustomData.internalIds.forEach(function(internalId, index) {
										record.submitFields({
										    type: recordType,
										    id: internalId,
										    values: submitFieldsCustomData.values
										});
									});
								}
							}
						}
						
						// update Revenue Arrangement's New Biz Date by loading record (submit fields not working for this field)
						revenueArrangementsIds.forEach(function(internalId, index) {
							var revenueArrangement = record.load({
							    type: record.Type.REVENUE_ARRANGEMENT, 
							    id: internalId
							});
							var revenueElementsLineCount = revenueArrangement.getLineCount({
					    	    sublistId: 'revenueelement'
					    	});
							
							for (var lineNumber = 0; lineNumber < revenueElementsLineCount; lineNumber++) {
					    		revenueArrangement.setSublistValue({
					        	    sublistId: 'revenueelement',
					        	    fieldId: 'custcol_cbr_rr_end_user_new_biz_date',
					        	    line: lineNumber,
					        	    value: tranDate
					        	});
							}
							revenueArrangement.save();
						});
					}
				}
			}
		}
	};
	
	populateSublistEndDates = function(rec) {
		if (rec.type == record.Type.SALES_ORDER || rec.type == record.Type.ITEM_FULFILLMENT || rec.type == record.Type.RETURN_AUTHORIZATION) {
			var sublistId = 'item';
			var distinctFieldId = 'item';
				
			// updated lines start and end dates by transaction date and period of each line
			var tranDate = rec.getValue({
			    fieldId: 'trandate'
			});

			// load created from (Sales Order) for Item Fulfillment
			var createdFromSalesOrder = null;
			var createdFromSalesOrderId = null;
			if (rec.type == record.Type.ITEM_FULFILLMENT) {
				createdFromSalesOrderId = rec.getValue({
					fieldId: 'createdfrom'
				});
				
				if (!common.isNullOrEmpty(createdFromSalesOrderId)) {
					createdFromSalesOrder = record.load({
					    type: record.Type.SALES_ORDER, 
					    id: createdFromSalesOrderId
					});
				}
			}
			
			// map start end dates each line by custom line ids
			var itemsStartEndPeriodValuesMap = {}; 
			var itemsLineCount = rec.getLineCount({
	    	    sublistId: sublistId
	    	});
	    	for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {
	    		
	    		var endDateUpdated = rec.getSublistValue({
	        	    sublistId: sublistId,
	        	    fieldId: 'custcol_cbr_end_date_updated',
	        	    line: lineNumber
	        	});
	    		
	    		var itemInternalId = rec.getSublistValue({
	        	    sublistId: sublistId,
	        	    fieldId: distinctFieldId,
	        	    line: lineNumber
	        	});
	    		
	    		var startDate = rec.getSublistValue({
	        	    sublistId: sublistId,
	        	    fieldId: 'custcol_cbr_start_date',
	        	    line: lineNumber
	        	});
	    		var period = rec.getSublistValue({
	        	    sublistId: sublistId,
	        	    fieldId: 'custcol_cbr_period',
	        	    line: lineNumber
	        	});
	    		var endDate = rec.getSublistValue({
	        	    sublistId: sublistId,
	        	    fieldId: 'custcol_cbr_end_date',
	        	    line: lineNumber
	        	});
	    				    		
	    		// if SO and item is cal end date category then cal end date
	    		// else set (empty start) and end dates with trandate and period to 0
				if (rec.type == record.Type.SALES_ORDER || rec.type == record.Type.RETURN_AUTHORIZATION) {
					var requestedDeliveryDate = rec.getValue({
					    fieldId: 'custbody_cbr_delayed_delivery_date'
					});
											
		    		if (common.isNullOrEmpty(startDate)) {
		    			startDate = common.isNullOrEmpty(requestedDeliveryDate) ? tranDate : requestedDeliveryDate;
		    			rec.setSublistValue({
			        	    sublistId: sublistId,
			        	    fieldId: 'custcol_cbr_start_date',
			        	    line: lineNumber,
			        	    value: startDate
			        	});
		    		}
		    		
		    		if (startDate == endDate || common.isNullOrEmpty(period) && common.isNullOrEmpty(endDate)) {
		    			period = 0;
		    			rec.setSublistValue({
			        	    sublistId: sublistId,
			        	    fieldId: 'custcol_cbr_period',
			        	    line: lineNumber,
			        	    value: period
			        	});
		    		} else if (!common.isNullOrEmpty(startDate) && !common.isNullOrEmpty(endDate) && common.isNullOrEmpty(period)) {
						period = startDate.getMonthDiff_fractional(endDate);
						rec.setSublistValue({
			        	    sublistId: sublistId,
			        	    fieldId: 'custcol_cbr_period',
			        	    line: lineNumber,
			        	    value: period
			        	});
						continue;
					}
		    		
		    		if (common.isNullOrEmpty(endDate)) {
		    			endDate = startDate;
			    		if (period != 0) {
			    			endDate = common.getPeriodEndDate(startDate, period);		    		
		    			} 
			    		rec.setSublistValue({
			        	    sublistId: sublistId,
			        	    fieldId: 'custcol_cbr_end_date',
			        	    line: lineNumber,
			        	    value: endDate
			        	});
			    		rec.setSublistValue({
			        	    sublistId: sublistId,
			        	    fieldId: 'custcol_cbr_end_date_updated',
			        	    line: lineNumber,
			        	    value: true
			        	});
	    			}
				}
              /*
				else if (rec.type == record.Type.ITEM_FULFILLMENT && (endDateUpdated == true) && !common.isNullOrEmpty(period)) {
					
					var itemReceive = rec.getSublistValue({
		        	    sublistId: sublistId,
		        	    fieldId: 'itemreceive',
		        	    line: lineNumber
		        	});
		    		if (common.isNullOrEmpty(itemReceive) || itemReceive == false) {
		    			continue;
		    		} 
		    		
					startDate = tranDate;
					rec.setSublistValue({
		        	    sublistId: sublistId,
		        	    fieldId: 'custcol_cbr_start_date',
		        	    line: lineNumber,
		        	    value: startDate
		        	});
					endDate = common.getPeriodEndDate(startDate, period);
		    		rec.setSublistValue({
		        	    sublistId: sublistId,
		        	    fieldId: 'custcol_cbr_end_date',
		        	    line: lineNumber,
		        	    value: endDate
		        	});
		    		
		    		var customLineId = rec.getSublistValue({
		        	    sublistId: sublistId,
		        	    fieldId: 'custcol_cbr_custom_line_id',
		        	    line: lineNumber
		        	});
		    		itemsStartEndPeriodValuesMap[customLineId] = {
    					startDate: startDate,
    					endDate: endDate,
    					period: period
	    			};
				}
              */
	    	}
	    	
	    	if (rec.type == record.Type.ITEM_FULFILLMENT) {
	    		// over on all split items and update dates from parent items
		    	for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {
		    		
		    		var customLineId = rec.getSublistValue({
		        	    sublistId: sublistId,
		        	    fieldId: 'custcol_cbr_custom_line_id',
		        	    line: lineNumber
		        	});
		    		var splitFromCustomLineId = rec.getSublistValue({
		        	    sublistId: sublistId,
		        	    fieldId: 'custcol_cbr_split_from_custom_line_id',
		        	    line: lineNumber
		        	});
		    		
		    		if (!common.isNullOrEmpty(splitFromCustomLineId) && !itemsStartEndPeriodValuesMap.hasOwnProperty(customLineId) && itemsStartEndPeriodValuesMap.hasOwnProperty(splitFromCustomLineId)) {
		    			var startDate = itemsStartEndPeriodValuesMap[splitFromCustomLineId].startDate;
		    			var endDate = itemsStartEndPeriodValuesMap[splitFromCustomLineId].endDate;

		    			rec.setSublistValue({
			        	    sublistId: sublistId,
			        	    fieldId: 'custcol_cbr_start_date',
			        	    line: lineNumber,
			        	    value: startDate
			        	});
			    		rec.setSublistValue({
			        	    sublistId: sublistId,
			        	    fieldId: 'custcol_cbr_end_date',
			        	    line: lineNumber,
			        	    value: endDate
			        	});
		    			
		    		}
		    	}
	    	}


	    	// Copy and save parent records with start end dates
	    	if (rec.type == record.Type.ITEM_FULFILLMENT && !common.isNullOrEmpty(createdFromSalesOrder)) {
	    		// Update lines of Sales Order with start end dates
	    		
		    	this.copyStartEndDatesAndRatesToSO(rec, createdFromSalesOrder, itemsStartEndPeriodValuesMap);
		    	// Load Aevenue Arrangement records of Sales Order and Update Start End Dates of relevant lines
		    	
		    	var revenueArrangementsMap = this.getRevenueArrangementsElemtnsBySOId(createdFromSalesOrderId);
		    	// {
				//  revenueArrangementInternalId: {revenueArrangementCustomLineId: revenueElementInternalId}
				//	"17074":{"1":"12505","2":"12406","3":"12507"},
				//	"17381":{"1":"12506","2":"12407","3":"12508"}
				// }
		    	var revenueArrangementIds = Object.keys(revenueArrangementsMap);
		    	for (var i = 0; i < revenueArrangementIds.length; i++) {
		    		var revenueArrangementInternalId = revenueArrangementIds[i];
		    		if (revenueArrangementsMap.hasOwnProperty(revenueArrangementInternalId)) {
			    		var revenueArrangement = record.load({
						    type: record.Type.REVENUE_ARRANGEMENT, 
						    id: revenueArrangementInternalId
						});
			    		
			    		var itemsCustomLineIdRevenueElementInternalIdMap = revenueArrangementsMap[revenueArrangementInternalId];
			    		// Update lines of Revenue Arrangement with start end dates
			    		this.copyStartEndDatesToRevenueArrangement(revenueArrangement, itemsStartEndPeriodValuesMap, itemsCustomLineIdRevenueElementInternalIdMap, createdFromSalesOrderId);
		    		}
		    	}
	    	}
		}
	};
	
	copyStartEndDatesToRevenueArrangement = function(revenueArrangement, itemsStartEndPeriodValuesMap, itemsCustomLineIdRevenueElementInternalIdMap, createdFromSalesOrderId) {
		var sublistId = 'revenueelement';
		var itemsLineCount = revenueArrangement.getLineCount({
    	    sublistId: sublistId
    	});
		var doSaveRec = false;
    	for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {
    		var customLineId = revenueArrangement.getSublistValue({
        	    sublistId: sublistId,
        	    fieldId: 'custcol_cbr_custom_line_id',
        	    line: lineNumber
        	});
    		var revenueElementId = revenueArrangement.getSublistValue({
        	    sublistId: sublistId,
        	    fieldId: 'revenueelement',
        	    line: lineNumber
        	});
    		
    		if (common.isNullOrEmpty(customLineId) || common.isNullOrEmpty(revenueElementId)) {
    			continue;
    		}
    		
    		// current Revenue Element item is not source from the SO
    		if (!itemsCustomLineIdRevenueElementInternalIdMap.hasOwnProperty(customLineId) || common.isNullOrEmpty(itemsCustomLineIdRevenueElementInternalIdMap[customLineId])) {
    			continue;
    		}
    		var mappedRevenueElementId = itemsCustomLineIdRevenueElementInternalIdMap[customLineId];
    		if (mappedRevenueElementId != revenueElementId) {
    			continue;
    		}
    		
    		if (itemsStartEndPeriodValuesMap.hasOwnProperty(customLineId)) { // && !common.isNullOrEmpty(soSourceId) && soSourceId == createdFromSalesOrderId
    			if (!common.isNullOrEmpty(itemsStartEndPeriodValuesMap[customLineId].startDate)) {
    				var startDate = itemsStartEndPeriodValuesMap[customLineId].startDate;
    				revenueArrangement.setSublistValue({
		        	    sublistId: sublistId,
		        	    fieldId: 'revrecstartdate',
		        	    line: lineNumber,
		        	    value: startDate
		        	});
    				doSaveRec = true;
    			}
    			
    			if (!common.isNullOrEmpty(itemsStartEndPeriodValuesMap[customLineId].endDate)) {
    				var endDate = itemsStartEndPeriodValuesMap[customLineId].endDate;
    				revenueArrangement.setSublistValue({
		        	    sublistId: sublistId,
		        	    fieldId: 'revrecenddate',
		        	    line: lineNumber,
		        	    value: endDate
		        	});
    				doSaveRec = true;
    			}
    		}
    	}
    	if (doSaveRec == true) {
    		revenueArrangement.save();
    	}
	};
	generateListPriceExchangerate = function (rec, transactionDate) {
		if (common.isNullOrEmpty(rec) || common.isNullOrEmpty(transactionDate)) {
    		throw error.create({
				name : 'generateListPriceExchangerate',
				message : 'all parameters (rec, transactionDate) are required',
				notifyOff : true
			});
    	}
    	// calc exchangeRate for: set item rates from custcol_cbr_so_original_unit_price * exchangerate
		var listPriceExchangeRate = null;
		var listPriceCurrency = rec.getValue({
		    fieldId: 'custbody_cbr_so_list_price_currency'
		});
		var transactionCurrency = rec.getValue({
		    fieldId: 'currency'
		});  
		if (!common.isNullOrEmpty(listPriceCurrency) && !common.isNullOrEmpty(transactionCurrency)) {
			if (listPriceCurrency != transactionCurrency) {
				// if list price currency is not equal to transaction currency then recalc items rate
				if (!common.isNullOrEmpty(transactionDate)) {
					require(['N/currency'], function(currency) {
						listPriceExchangeRate = currency.exchangeRate({
        				    source: listPriceCurrency,
        				    target: transactionCurrency,
        				    date: transactionDate
        				});
	    			});
				}
			} else {
				listPriceExchangeRate = 1;
			}
		}
		return listPriceExchangeRate;
    }; 
    
	setItemRatesByExchangeRate = function (rec, lineNumber, exchangeRate) {
    	if (common.isNullOrEmpty(rec) || common.isNullOrEmpty(lineNumber) || common.isNullOrEmpty(exchangeRate)) {
    		throw error.create({
				name : 'setItemRatesByExchangeRate',
				message : 'all parameters (rec, lineNumber, exchangeRate) are required',
				notifyOff : true
			});
    	}
    	var rate = null;
    	var originalUnitPrice = rec.getSublistValue({
    	    sublistId: 'item',
    	    fieldId: 'custcol_cbr_so_original_unit_price',
    	    line: lineNumber
    	});
    	if (!common.isNullOrEmpty(originalUnitPrice) && !common.isNullOrEmpty(exchangeRate)) {
    		rate = parseFloat(originalUnitPrice) * parseFloat(exchangeRate);
    		rec.setSublistValue({
        	    sublistId: 'item',
        	    fieldId: 'rate',
        	    line: lineNumber,
        	    value: rate
        	});
		}
    	return rate;
	};
		
	copyStartEndDatesAndRatesToSO = function(rec, targetRec, itemsStartEndPeriodValuesMap) {
		if (common.isNullOrEmpty(targetRec) || common.isNullOrEmpty(itemsStartEndPeriodValuesMap)) {
			throw error.create({
				name : 'copyStartEndDatesAndRatesToSO',
				message : 'all parameters are required',
				notifyOff : true
			});
		}

		var sublistId = 'item';
		var startDateFieldId = 'custcol_cbr_start_date';
		var endDateFieldId = 'custcol_cbr_end_date';
		var itemsLineCount = targetRec.getLineCount({
    	    sublistId: sublistId
    	});
		var doSaveRec = false;
		
		// calculate item rates
		var isIndexationInd = targetRec.getValue({
			fieldId: 'custbody_cbr_indexation_ind'
		});
		var listPriceExchangeRate = null;
	
		if (isIndexationInd == true) {
			var transactionDate = rec.getValue({
			    fieldId: 'trandate'
			});
			listPriceExchangeRate = this.generateListPriceExchangerate(targetRec, transactionDate);
		}

    	for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {
    		var customLineId = targetRec.getSublistValue({
        	    sublistId: sublistId,
        	    fieldId: 'custcol_cbr_custom_line_id',
        	    line: lineNumber
        	});
    		if (itemsStartEndPeriodValuesMap.hasOwnProperty(customLineId)) {
    			
    			if (!common.isNullOrEmpty(itemsStartEndPeriodValuesMap[customLineId].startDate)) {
    				targetRec.setSublistValue({
		        	    sublistId: sublistId,
		        	    fieldId: startDateFieldId,
		        	    line: lineNumber,
		        	    value: itemsStartEndPeriodValuesMap[customLineId].startDate
		        	});
    				doSaveRec = true;
    			}
    			if (!common.isNullOrEmpty(itemsStartEndPeriodValuesMap[customLineId].endDate)) {
    				targetRec.setSublistValue({
		        	    sublistId: sublistId,
		        	    fieldId: endDateFieldId,
		        	    line: lineNumber,
		        	    value: itemsStartEndPeriodValuesMap[customLineId].endDate
		        	});
    				doSaveRec = true;
    			}
    		}
    		
    		if (!common.isNullOrEmpty(listPriceExchangeRate)) {
    			var newRate = this.setItemRatesByExchangeRate(targetRec, lineNumber, listPriceExchangeRate);
    			if (!common.isNullOrEmpty(newRate)) {
    				targetRec.setSublistValue({
                	    sublistId: 'item',
                	    fieldId: 'custcol_cbr_ind_calc_rate',
                	    line: lineNumber,
                	    value: newRate
                	});
    			}
    			doSaveRec = true;
    		}
    	}
    	
    	if (doSaveRec == true) {
    		targetRec.save();
    	}
	}
	splitMaintenanceItems = function(rec, eventType, endUserCountry) {
		var _this = this;
		require(['N/search'], function(search) {
			var isEndUserIsrael = (!common.isNullOrEmpty(endUserCountry) && endUserCountry == 'israel') ? true : false;
			
			// to split only 1 time
			var isSplitedBasic = false;
			var isSplitedSubscription = false;
			var isSplitedMSSP = false;

			if (eventType.toLowerCase() == 'edit' || (eventType.toLowerCase() == 'create' && rec.type == record.Type.RETURN_AUTHORIZATION)) {
				// search for lines with splited items to avoid resplit and only once for each type of split item
	    		var maintenanceItemsIds = search.lookupFields({
	    		    type: 'customrecord_ncs_global_settings',
	    		    id: '1',
	    		    columns: ['custrecord_cbr_split_basic_main_item', 'custrecord_cbr_split_subsc_main_item','custrecord_cbr_split_mssp_main_item']
	    		});
	    		
	    		var splitedBasicLineIndex = rec.findSublistLineWithValue({
				    sublistId: 'item',
				    fieldId: 'item',
				    value: maintenanceItemsIds.custrecord_cbr_split_basic_main_item[0].value
				});
	    		if (!common.isNullOrEmpty(splitedBasicLineIndex) && splitedBasicLineIndex > -1) {
	    			isSplitedBasic = true;
	    		}
	    		
	    		var splitedSubscriptionLineIndex = rec.findSublistLineWithValue({
				    sublistId: 'item',
				    fieldId: 'item',
				    value: maintenanceItemsIds.custrecord_cbr_split_subsc_main_item[0].value
				});
	    	
	    		
	    		if (!common.isNullOrEmpty(splitedSubscriptionLineIndex) && splitedSubscriptionLineIndex > -1) {
	    			isSplitedSubscription = true;
	    		}
	    		
	    		var splitedMSSPLineIndex = rec.findSublistLineWithValue({
				    sublistId: 'item',
				    fieldId: 'item',
				    value: maintenanceItemsIds.custrecord_cbr_split_mssp_main_item[0].value
				});
	    	
	    		
	    		if (!common.isNullOrEmpty(splitedMSSPLineIndex) && splitedMSSPLineIndex > -1) {
	    			isSplitedMSSP = true;
	    		}
			}
			if (isSplitedBasic == true && isSplitedSubscription == true && isSplitedMSSP == true) {
				// no need to split more maintenance items more then one time for each maintenance item
				return;
			}

			var tranRecTypeNumId = getRecordTypeNumericId(rec.type.toLowerCase());

			var itemsLineCount = rec.getLineCount({
	    	    sublistId: 'item'
	    	});
			
			function isLineSplitted(lineNumber, eventType) {
				if (eventType == 'create') {
					return false;
				}
				var splitFromCustomLineId = rec.getSublistValue({
	        	    sublistId: 'item',
	        	    fieldId: 'custcol_cbr_split_from_custom_line_id',
	        	    line: lineNumber
	        	});
				if (!common.isNullOrEmpty(splitFromCustomLineId) ) {
					return true;
				}
				else {
					var customLineId = rec.getSublistValue({
		        	    sublistId: 'item',
		        	    fieldId: 'custcol_cbr_custom_line_id',
		        	    line: lineNumber
		        	});
					var splitedLineIndex = rec.findSublistLineWithValue({
					    sublistId: 'item',
					    fieldId: 'custcol_cbr_split_from_custom_line_id',
					    value: customLineId
					});
					if (splitedLineIndex > -1) {
						return true;
					}
					return false;
				}
			}
			
	    	var itemsIdsForSearch = [];
	    	for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {
	    		if (!isLineSplitted(lineNumber, eventType)) {
	    			var itemInternalId = rec.getSublistValue({
	            	    sublistId: 'item',
	            	    fieldId: 'item',
	            	    line: lineNumber
	            	});
	    			if (itemsIdsForSearch.indexOf(itemInternalId) == -1) {
	        			itemsIdsForSearch.push(itemInternalId);
	    			}
	    		}
	    	}
	    	
	    	if (itemsIdsForSearch.length > 0) {
	    		// items that has split item true checked
	    		var itemsMap = {};
	    			
    			//{
    			//	"custrecord_cbr_split_basic_main_item":[{"value":"512","text":"MS – Basic IL (15%)"}],
    			//	"custrecord_cbr_split_subsc_main_item":[{"value":"514","text":"MS – Subscription (20%)"}]
    			//}	
        		var maintenanceItemsIds = search.lookupFields({
        		    type: 'customrecord_ncs_global_settings',
        		    id: '1',
        		    columns: ['custrecord_cbr_split_basic_main_item', 'custrecord_cbr_split_subsc_main_item','custrecord_cbr_split_mssp_main_item']
        		});
        		
        		var copyFields = {};
        		
        		search.create({
        			type: 'customrecord_cbr_split_copy_fields',
        			columns: [
        			    'custrecord_cbr_sscf_column_id', 
        			    'custrecord_cbr_sscf_constant_value'
        			],
        			filters: [
        			    ['isinactive', 'is', 'F'],
          		        'AND',
          		        ['custrecord_cbr_sscf_global_settings', 'noneof', '@NONE@'],
          		      	'AND',
          		        ['custrecord_cbr_sscf_record_type', 'anyof', tranRecTypeNumId]
        			]
        		}).run().each(function(result) {
        			var columnId = result.getValue('custrecord_cbr_sscf_column_id');
        			var columnConstantValue = result.getValue('custrecord_cbr_sscf_constant_value');

    				if (!common.isNullOrEmpty(columnId)) {
    					copyFields[columnId] = columnConstantValue;
    				}
        			return true;
        		});
        		
        		search.create({
        		    type: search.Type.ITEM,
        		    columns: [
	        		    {
	        		        name: 'custrecord_cbr_split_basic_main',
	        		        join: 'custitem_cbr_item_category'
	        		    }, 
	        		    {
	        		        name: 'custrecord_cbr_split_subscrip_main',
	        		        join: 'custitem_cbr_item_category'
	        		    },
	        		    {
	        		        name: 'custrecord_cbr_split_mssp_main',
	        		        join: 'custitem_cbr_item_category'
	        		    }
        		    ],
        		    filters: [
        		        ['internalid', 'anyof', itemsIdsForSearch],
        		        'AND',
        		        [
							['custitem_cbr_item_category.custrecord_cbr_split_basic_main', 'is', 'T'],
							'OR',
							['custitem_cbr_item_category.custrecord_cbr_split_subscrip_main', 'is', 'T'],
							'OR',
							['custitem_cbr_item_category.custrecord_cbr_split_mssp_main', 'is', 'T']
        		        ]
        		    ]
        		}).run().each(function(itemResult) {
        			var isSplitBasicMaintenance = isEndUserIsrael && itemResult.getValue({
        	            name: 'custrecord_cbr_split_basic_main',
        	            join: 'custitem_cbr_item_category'
        	        });
        			var isSplitSubscriptionMaintenance = itemResult.getValue({
        	            name: 'custrecord_cbr_split_subscrip_main',
        	            join: 'custitem_cbr_item_category'
        	        });
        			var isSplitMSSPMaintenance = itemResult.getValue({
        	            name: 'custrecord_cbr_split_mssp_main',
        	            join: 'custitem_cbr_item_category'
        	        });
        			itemsMap[itemResult.id] = {
    					isSplitBasicMaintenance: isSplitBasicMaintenance,
    					isSplitSubscriptionMaintenance: isSplitSubscriptionMaintenance,
    					isSplitMSSPMaintenance : isSplitMSSPMaintenance
        			};
        			
        			return true;
        	    });
        		
    	    	for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {
    	    		if (isSplitedBasic && isSplitedSubscription && isSplitedMSSP) {
    	    			break;
    	    		}
    	    		
    	    		if (!isLineSplitted(lineNumber, eventType)) {
    	    			var itemInternalId = rec.getSublistValue({
    	            	    sublistId: 'item',
    	            	    fieldId: 'item',
    	            	    line: lineNumber
    	            	});
    	    			if (itemsMap.hasOwnProperty(itemInternalId)) {

         	    			if (itemsMap[itemInternalId].isSplitBasicMaintenance == true && !isSplitedBasic) {
         	    				isSplitedBasic = true;
        	    				if (maintenanceItemsIds.custrecord_cbr_split_basic_main_item.length == 1) {
        	    					var itemId = maintenanceItemsIds.custrecord_cbr_split_basic_main_item[0].value;
        	    					_this.duplicateItemLine(rec, itemId, lineNumber, copyFields);
        	    				} else {
    	    						throw error.create({
    	    							name : 'NCS.Lib.Helpers splitMaintenanceItems',
    	    							message : 'SPLIT BASIC MAINTENANCE ITEM is not defined at Global Settings',
    	    							notifyOff : true
    	    						});
        	    				}
        	    			}
        	    			
        	    			if (itemsMap[itemInternalId].isSplitSubscriptionMaintenance == true && !isSplitedSubscription) {
        	    				isSplitedSubscription = true;
        	    				if (maintenanceItemsIds.custrecord_cbr_split_subsc_main_item.length == 1) {
        	    					var itemId = maintenanceItemsIds.custrecord_cbr_split_subsc_main_item[0].value;
        	    					_this.duplicateItemLine(rec, itemId, lineNumber, copyFields);
        	    				} else {
    	    						throw error.create({
    	    							name : 'NCS.Lib.Helpers splitMaintenanceItems',
    	    							message : 'SPLIT SUBSCRIP MAINTENANCE ITEM is not defined at Global Settings',
    	    							notifyOff : true
    	    						});
        	    				}
        	    			}
        	    			
        	    			if (itemsMap[itemInternalId].isSplitMSSPMaintenance == true && !isSplitedMSSP) {
        	    				isSplitedMSSP = true;
        	    				if (maintenanceItemsIds.custrecord_cbr_split_mssp_main_item.length == 1) {
        	    					var itemId = maintenanceItemsIds.custrecord_cbr_split_mssp_main_item[0].value;
        	    					_this.duplicateItemLine(rec, itemId, lineNumber, copyFields);
        	    				} else {
    	    						throw error.create({
    	    							name : 'NCS.Lib.Helpers splitMaintenanceItems',
    	    							message : 'SPLIT MSSP MAINTENANCE ITEM is not defined at Global Settings',
    	    							notifyOff : true
    	    						});
        	    				}
        	    			}
    	    			}
    	    		}
    	    	}
	    	}
		});
	};
	
	duplicateItemLine = function (rec, itemId, lineNumber, copyFields) {
		var newLineIndex = rec.getLineCount({
			sublistId : 'item'
		});
		
		rec.setSublistValue({
		    sublistId: 'item',
		    fieldId: 'item',
		    line : newLineIndex,
		    value: itemId
		});
		
		var customLineId = rec.getSublistValue({
    	    sublistId: 'item',
    	    fieldId: 'custcol_cbr_custom_line_id',
    	    line: lineNumber
    	});
		rec.setSublistValue({
		    sublistId: 'item',
		    fieldId: 'custcol_cbr_split_from_custom_line_id',
    	    line : newLineIndex,
		    value: customLineId
		});

		for (var columnId in copyFields) {
			if (copyFields.hasOwnProperty(columnId)) {
				var columnValue = copyFields[columnId];
				if (common.isNullOrEmpty(columnValue)) {
					columnValue = rec.getSublistValue({
			    	    sublistId: 'item',
			    	    fieldId: columnId,
			    	    line: lineNumber
			    	});
				}
				rec.setSublistValue({
				    sublistId: 'item',
				    fieldId: columnId,
				    line : newLineIndex,
				    value: columnValue
				});
			}
		}
	}
	
	populateDisclaimer = function(rec) {

		try {
			require(['N/search'], function(search) {

				var subsidiary = rec.getValue({
					fieldId : 'subsidiary'
				});
				var currency = rec.getValue({
					fieldId : 'currency'
				});

				var filterExpr;
				filterExpr = [
						[ 'isinactive', 'is', 'F' ],
						'and',
						[ 'custrecord_ncs_disclaimer_subsidiary', 'anyof', subsidiary ],
						'and',
						[ [ 'custrecord_ncs_disclaimer_currency', 'anyof', currency ], 'or',
								[ 'custrecord_ncs_disclaimer_is_default', 'is', 'T' ] ] ];

				var priorityColumn = search.createColumn({
					name : 'formulanumeric',
					formula : "Case when {custrecord_ncs_disclaimer_is_default} = 'T'  Then 1  Else 0  End",
					sort : search.Sort.ASC
				});

				var columns = [ priorityColumn ];

				// get the first disclaimer
				var results = search.create({
					type : 'customrecord_ncs_disclaimer',
					filters : filterExpr,
					columns : columns
				}).run().getRange({
					start : 0,
					end : 1
				});

				if (common.isArrayAndNotEmpty(results) && results.length > 0) {
					/*
					logger.debug({
						title : 'results',
						details : JSON.stringify(results)
					});
					*/
					rec.setValue({
						fieldId : 'custbody_ncs_transaction_disclaimer',
						value : results[0].id
					});

				} else {
					throw error.create({
						name : 'NCS.HELPERS.populateDisclaimer',
						message : 'Unable to find disclaimer to this subsidiary or currency',
						notifyOff : true
					});
				}
			});
		} catch (err) {
			var isDisclaimerRequired = common.get_Global_Setting('custrecord_ncs_require_disclaimer');
			if (isDisclaimerRequired) {
				throw err;
			}
		}
	};
	/**
	 * 
	 * @param rec : nlobjRecord of the transaction
	 * @param type : event type
	 * @returns void
	 * This function updates the custom line id of the line item in order to allow easy matching between transformmed transactions
	 */
	populateCustomLineIds = function(rec,type){	
		var _sublistId = 'item';
		var customLineIdfieldId = 'custcol_cbr_custom_line_id';
		var itemCount = itemsCount = rec.getLineCount({
			sublistId : _sublistId
		});
		var maxLineId = 0;
		
		//Get Maximum line id
		for (var linenum = 0; linenum < itemCount; linenum++) {
			var customLineId  = rec.getSublistValue({
				sublistId: _sublistId,
				fieldId : customLineIdfieldId,
				line : linenum
			});			
			if (!common.isNullOrEmpty(customLineId)) {
				var customLineId  = Number(rec.getSublistValue({
					sublistId: _sublistId,
					fieldId : customLineIdfieldId,
					line : linenum
				}));
				if (customLineId > maxLineId) {
					maxLineId = customLineId;
				}
			}
		}
		
		//Update Custom Line Id for missing lines
		for (var linenum = 0; linenum < itemCount; linenum++) {
				var customLineId  = rec.getSublistValue({
					sublistId: _sublistId,
					fieldId : customLineIdfieldId,
					line : linenum
				});	
				if (common.isNullOrEmpty(customLineId)) {					
					var customLineId = maxLineId + 1;
					rec.setSublistValue({
					    sublistId: _sublistId,
					    fieldId: customLineIdfieldId,
					    line: linenum,
					    value: customLineId.toString()
					});
					maxLineId += 1;
				}
		}	
	};
	
	// Help function to retreive all possible locales (2 at most) of a record
	retreiveLocales = function(rec){
		var locales = [];
		
		// Get local from user preferences
		var userLocale = runtime.getCurrentUser().getPreference({
			name:'language'
		});
		
		locales.push(userLocale);
		
		
		var entityId = rec.getValue({
			fieldId:'entity'
		});
		if(!common.isNullOrEmpty(entityId)){
			var arTransaction = [record.Type.INVOICE,record.Type.CREDIT_MEMO,record.Type.SALES_ORDER];
			var apTransaction = [record.Type.PURCHASE_ORDER];
			
			if (arTransaction.indexOf(rec.type) > -1){
				//AR Transactions
				var customerLocal = search.lookupFields({
					type: record.Type.CUSTOMER,
					id: entityId,
					columns:['language']
				})['language'];
				
				if(!common.isNullOrEmpty(customerLocal) && customerLocal.length > 0){
					
					var entityLocale = customerLocal[0].value;
					locales.push(entityLocale);
				}
			}
			else if (apTransaction.indexOf(rec.type) > -1){
				//AP Transactions - Use custom Language Field ad transform it to locale
				var vendorLang = search.lookupFields({
					type: record.Type.VENDOR,
					id: entityId,
					columns:['custentity_ncs_vendor_language']
				})['custentity_ncs_vendor_language'];
				
				if(!common.isNullOrEmpty(vendorLang) && vendorLang.length > 0){
					vendorLang = vendorLang[0].value;
					require(['./NCS.Lib.Form.Translation'], function(translator) {
						var locByLang = translator.getLocaleByLanguages(vendorLang);
						if (locByLang.hasOwnProperty(vendorLang)) {
							var entityLocale = locByLang[vendorLang].localeText;
							locales.push(entityLocale);							
						}
					});
					
				}
			}
		}
		return locales;
	};
	
	
	return {
		populateDisclaimer : populateDisclaimer,
		populateCustomLineIds : populateCustomLineIds,
		splitMaintenanceItems : splitMaintenanceItems,
		duplicateItemLine: duplicateItemLine,
		populateSublistEndDates: populateSublistEndDates,
		getSublistDistinctValues: getSublistDistinctValues,
		getRevenueArrangementsBySOId: getRevenueArrangementsBySOId,
		copyStartEndDatesAndRatesToSO: copyStartEndDatesAndRatesToSO,
		copyStartEndDatesToRevenueArrangement: copyStartEndDatesToRevenueArrangement,
		getRevenueArrangementsElemtnsBySOId: getRevenueArrangementsElemtnsBySOId,
		createProjectForSO: createProjectForSO,
		setItemRatesByExchangeRate: setItemRatesByExchangeRate,
		generateListPriceExchangerate: generateListPriceExchangerate,
		retreiveLocales:retreiveLocales,
		getRecordTypeNumericId : getRecordTypeNumericId,
		getRecordValuesByNames : getRecordValuesByNames,
		updateNewBizDates: updateNewBizDates
	};
});