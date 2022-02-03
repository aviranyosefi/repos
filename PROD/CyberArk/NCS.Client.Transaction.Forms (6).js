/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/log', 'N/record','N/search', '../Common/NCS.Lib.Common', 'N/url', 'N/https','N/ui/dialog','N/error'],

function(currentRecord, logger, record, search, common, url, https,dialog,error) {
	var rec;
	var lineFields = ['item', 'location', 'department', 'class', 'customer', 'custcol_cseg_cbr_countries'];
    pageInit = function(scriptContext) {
    	if ((scriptContext.mode == 'create') || (scriptContext.mode == 'edit')|| (scriptContext.mode == 'copy')) {
	    	// Get Record, and filter types
	    	rec = rec || currentRecord.get(); 
	    	if (rec.type == record.Type.PURCHASE_ORDER){
		    	var sublistName = 'item';
		    	var count = rec.getLineCount(sublistName);
		    	var wasDetermined = false;
		    	var i = 0;
		    	while ((i<count)&&(!wasDetermined)){
			    	// Get source record
					var sourceRecord = rec.getSublistValue({
						sublistId: sublistName,
						fieldId: 'linkedorder',
						line: i
					});
					
					if(!common.isNullOrEmpty(sourceRecord)){
						var type = search.lookupFields({
							type:'transaction',
							id : sourceRecord,
							columns:['type']
						})['type'];
			
						if(!common.isNullOrEmpty(type)){
							type = type[0].value;
							// If source record is of type 'requisition'
							if((type == "PurchReq") &&(i!= length)){
								wasDetermined = true;
								jQuery(document).ready(function(){
								jQuery('#clearsplitsitem').attr("disabled", "disabled");
								jQuery('#clearsplitsitem').hide();
								});
							}
						}
					}
					i++;
		    	}
	    	}
    	}
    };
    
    fieldChanged = function(scriptContext) {

    };

    postSourcing = function(scriptContext) {
    	// Get Record, and filter types
    	rec = rec || currentRecord.get(); 
    	
    	// Start DT# 474 
			// Perform on Item sublist on item field posting
		if(scriptContext.sublistId == 'item' && scriptContext.fieldId == 'item') {
			var hasRegionCountryFld = rec.getCurrentSublistValue({
				sublistId: 	'item',
				fieldId: 	'custcol_cseg_cbr_countries'
			}) !== null; 			
			hasRegionCountryFld && (defaultDeptRegion(rec, scriptContext, false, true)
					// Ensure lineInit for Disable fields action
					,lineInit(scriptContext));        		
		}	
    	// End DT# 474
    };

    sublistChanged = function(scriptContext) {

    };

    lineInit = function(scriptContext) {
    	rec = rec || currentRecord.get(); 
    	var sublistName = scriptContext.sublistId;
    	// Applies only for PO record
    	if((rec.type == record.Type.PURCHASE_ORDER)&&(sublistName =='item')){
	    	var currLineIndx = rec.getCurrentSublistIndex({
	    		sublistId: sublistName
	    	}),
			length = rec.getLineCount({
			    sublistId: sublistName
			});
			sourceRecord = rec.getCurrentSublistValue({
				sublistId: sublistName,
				fieldId: 'linkedorder'
			});
			
			if(sourceRecord){
				var linkOrderType = (search.lookupFields({
					type:'transaction',
					id : sourceRecord,
					columns:['type']
				})['type'] || [])[0].value;

				// If source record is of type 'requisition'
				if('PurchReq' == linkOrderType){
					lineFields.forEach(function(fldName) {
						var fld = rec.getSublistField({
							sublistId: 'item',
							fieldId: fldName,
							line: currLineIndx
						});
						fld && (fld.isDisabled = true);
					});
				}
			}
    	}
    	
    	if (rec.type == record.Type.SALES_ORDER 
    			|| rec.type == record.Type.RETURN_AUTHORIZATION
    			|| rec.type == record.Type.PURCHASE_REQUISITION) {
    		if (sublistName =='item') {
    			//Reset Custom Line Id on copy of lines in RMA SO
    			var currentLineIndex = rec.getCurrentSublistIndex({
    	    		sublistId: 'item'
    	    	});
    			var itemsLineCount = rec.getLineCount({
        			sublistId: 'item'
        		});
    			if(currentLineIndex == itemsLineCount){
    				rec.setCurrentSublistValue({
    					sublistId: 'item',
    					fieldId: 'custcol_cbr_custom_line_id',
    					value: '',
    					fireSlavingSync:false,
    					ignoreFieldChange:true
    				});
    			}
			}
    	}
	};

    validateField =function(scriptContext) {
    	
    	// Get Record, and filter types
    	rec = rec || currentRecord.get(); 
    	
    	// get field id 
    	var fieldId = scriptContext.fieldId;
    	if(fieldId == 'custcol_cbr_employee'){
    		var useCountryRegion = (rec.type == record.Type.VENDOR_BILL)? true: false;
    		logger.debug({
				title: 'useCountryRegion',
				details:useCountryRegion
			});
	    	if((rec.type == record.Type.VENDOR_BILL)||
				(rec.type == record.Type.VENDOR_CREDIT)||
				(rec.type == record.Type.JOURNAL_ENTRY)||
				(rec.type == record.Type.CHECK)||
				(rec.type.toLowerCase() == "intercompanyjournalentry")){
	    		
	    		logger.debug({
	    			title : 'fieldId',
	    			details : fieldId
	    		});
	    		
	    		defaultDeptRegion(rec, scriptContext, true, false);
//	    		defaultDeptRegion(rec, scriptContext, true, useCountryRegion);
			}
    	}
    	else if(fieldId == 'custcol_cseg_cbr_countries'){
    		// if region country was set, and record is requisition or vendor bill -> get & set the matching region
    		// 
    		// 
    		// ***CR 11/12/2018 - added JE/PO/BILL CREDIT and Advanced Journal Entry record types to defaultDeptRegion function
    	if((rec.type == record.Type.VENDOR_BILL)||(rec.type == record.Type.PURCHASE_REQUISITION)||(rec.type == record.Type.JOURNAL_ENTRY)||(rec.type == record.Type.PURCHASE_ORDER)||(rec.type == record.Type.VENDOR_CREDIT)||(rec.type == record.Type.ADV_INTER_COMPANY_JOURNAL_ENTRY)){ 
	    		var sublistName = scriptContext.sublistId;
	    		// get selected country
	    		var country = rec.getCurrentSublistValue({
	        		sublistId: sublistName,
	        		fieldId: 'custcol_cseg_cbr_countries',
	        	});
	    		
	    		if(!common.isNullOrEmpty(country)){
		    		// find matching region (using proxy)
		    		var proxy = url.resolveScript({
						scriptId : 'customscript_ncs_ss_proxy_admin',
						deploymentId : 'customdeploy_ncs_ss_proxy_adm',
						returnExternalUrl : false
					}),
					
		    		region = https.request({
					    method: https.Method.GET,
					    url: proxy+"&actionType=GetCountrysRegion&country="+country 
					}).body;

		    		if(!common.isNullOrEmpty(region)){
						region = JSON.parse(region);
						// Set Region
						rec.setCurrentSublistValue({
							sublistId: sublistName,
							fieldId: 'location',
							value:region,
							fireSlavingSync:true,
							ignoreFieldChange:false
						});
					}
	    		}
    		}
    	}else if(fieldId == 'item'){//DT535
    		
    		// Get current record
        	var sublistName = scriptContext.sublistId;

        	logger.debug({
        		title: '[fieldId, sublistName, rec.type]',
        		details:[fieldId, sublistName, rec.type]
        	});
        	// Check that Record type is "Requisition"
        	if(rec.type == record.Type.PURCHASE_REQUISITION){
        		
    	    	// Get Selected item
                if (sublistName === 'item'){
                	validatePaChange(rec, sublistName);
                }
        	}
    	}//End dt535

    	return true;
    };

    validateLine = function(scriptContext) {
    	
    	rec = rec || currentRecord.get(); 
    	var sublistName = scriptContext.sublistId;

    	// Get Selected item
    	if (sublistName == 'item'){

    		// Check that Record type is "Requisition"
    		if(rec.type == record.Type.PURCHASE_REQUISITION){

		    	// Get item's professional approval
		    	var itemId = rec.getCurrentSublistValue({
	        		sublistId: sublistName,
	        		fieldId: 'item',
	        	});

		    	if(!common.isNullOrEmpty(itemId)){
		    		
					// Get server side script to execute search of employee's fields (in case the current user does not have permissions for it)
					var proxy = url.resolveScript({
						scriptId : 'customscript_ncs_ss_proxy_admin',
						deploymentId : 'customdeploy_ncs_ss_proxy_adm',
						returnExternalUrl : false
					});

    				var paId = https.request({
    				    method: https.Method.GET,
    				    url: proxy+"&actionType=GetItemDefaultValues&itemId="+itemId 
    				}).body;
		    		
    				/*
    				logger.debug({
						title:'paId',
						details :paId
					});
    				*/
		            if(!common.isNullOrEmpty(paId)){
			            paId = JSON.parse(paId);
		            
			            // if selected item has a p.a
			            if(common.isArrayAndNotEmpty(paId)){
			            	/*
			            	logger.debug({
								title:'paId',
								details :paId
							});
							*/
			            	paId = paId[0].value;
				            // Get relevant field from the record
				            var currPA = rec.getValue({
				            	fieldId:'custbody_cbr_req_prof_app_ind'
				            });
		
				            // Check if transaction P.A fields are empty
				            if(common.isNullOrEmpty(currPA)){
				            	
						    	// If so- fill them up with values taken from the P.A record
				            	rec.setValue({
				            		fieldId:'custbody_cbr_req_prof_app_ind',
				            		value:paId,
				            		fireSlavingSync:true,
				            		ignoreFieldChange:true
				            	});
				            	/*
				            	logger.debug({
									title:'custbody_cbr_req_prof_app_ind is set to : ',
									details :paId
								});
				            	*/
		
					    	// If not - alert error (all items must have the same P.A)
				            }else if(currPA != paId){
				            	alert('All items must have the same Professional Approval.');
				            	return false;
				            }
		            	}
		            }
	            }
    		}
    		var length = rec.getLineCount({
    			sublistId: sublistName
    		});
    		
    		var idx = rec.getCurrentSublistIndex({
    			sublistId: sublistName
    		});
    		
    		// if this is a new line
    		if((length > 0)&&(idx == length)){
	    		// Get source record (line field - first line will determine)
				var sourceRecord = rec.getSublistValue({
					sublistId: sublistName,
					fieldId: 'linkedorder',
					line:0
				});
	
				// if source record exist
				if(!common.isNullOrEmpty(sourceRecord)){
					var type = search.lookupFields({
						type:'transaction',
						id : sourceRecord,
						columns:['type']
					})['type'];
	
					// get source record type
					if(!common.isNullOrEmpty(type)){
						type = type[0].value;
	
			    		// prevent adding new lines to a requisition-sourced-PO
			    		if((rec.type == record.Type.PURCHASE_ORDER)&&(type == "PurchReq")){
			    			alert("Adding lines is not allowed.");
		    				return false;
			    		}
					}  
				}
    		}
    		
    		if (rec.type == record.Type.RETURN_AUTHORIZATION) {
    			//Prevent adding lines to RMA created from integration or SO
    			var currentLineIndex = rec.getCurrentSublistIndex({
    	    		sublistId: sublistName
    	    	});
    			var itemsLineCount = rec.getLineCount({
        			sublistId: sublistName
        		});
    			if(currentLineIndex == itemsLineCount){
    				//New line, perform testing
    				var doPrevent = false;
    				var createdFrom = rec.getValue({
        				fieldId: 'createdfrom'
        			});	
    				var integrationType = rec.getValue({
    					fieldId: 'custbody_nc_ba_createdfrom_integration'
    				});	
    				if (!common.isNullOrEmpty(integrationType)) {
    					doPrevent = true;
    				}
    				else if (!common.isNullOrEmpty(createdFrom)) {        				
    					var createdFromType = search.lookupFields({
    						type: 'transaction',
    						id: createdFrom,
    						columns: 'recordtype'
    					})['recordtype'];
    					if (createdFromType == 'salesorder') {
    						doPrevent = true;
    					}
        			}
    				if (doPrevent) {
    					alert('Adding a line to RMA originating from SalesForce or from Sales Order is prohibitted');
    					return false;
    				}
    			}
    		}
    	}
    	
    	return true;
    };

    validateInsert = function(scriptContext) {
    	return true;
    };

    validateDelete = function(scriptContext) {
    	
    	// Get current record
    	rec = rec || currentRecord.get(); 
    	var sublistName = scriptContext.sublistId;

    	// Check that Record type is "Requisition"
    	if(rec.type == record.Type.PURCHASE_REQUISITION){
    		
	    	// Get Selected item
            if (sublistName === 'item'){
            	validatePaChange(rec, sublistName, true);
            }
    	}
    	return true;
    };

    saveRecord =function(scriptContext) {
    	rec = rec || currentRecord.get();
    	if (rec.type == record.Type.PURCHASE_ORDER) {
    		//validate tolerance
    		try{
    			validatePO_tolerance(rec);
    		}
    		catch(err){
    			dialog.alert({
		            title: 'Requisition Tolerance',
		            message: err.message
		        });	
    			return false;
    		}
    	}
    	return true;
    };
    
    defaultDeptRegion = function(rec, scriptContext, doOverwrite, useRegionCountry){
    	if(common.isNullOrEmpty(doOverwrite)){
    		doOverwrite = false;
    	}
    	if(common.isNullOrEmpty(useRegionCountry)){
    		useRegionCountry = false;
    	}
    	logger.debug({
			title: 'useRegionCountry',
			details:useRegionCountry
		});
    	// Get Sublist id
		var sublistName = scriptContext.sublistId;

    	if(!common.isNullOrEmpty(sublistName)){
	    	// get current line's department and region
			var currDept =rec.getCurrentSublistValue({
				sublistId: sublistName,
				fieldId: 'department',
			});
			var currRegion =rec.getCurrentSublistValue({
				sublistId: sublistName,
				fieldId: 'location',
			});
			var currCountry =rec.getCurrentSublistValue({
				sublistId: sublistName,
				fieldId: 'custcol_cseg_cbr_countries',
			});
	
			if((common.isNullOrEmpty(currDept))||(common.isNullOrEmpty(currRegion)) || doOverwrite){
				try {
					// Get server side script to execute search of employee's fields (in case the current user does not have permissions for it)
					var proxy = url.resolveScript({
						scriptId : 'customscript_ncs_ss_proxy_admin',
						deploymentId : 'customdeploy_ncs_ss_proxy_adm',
						returnExternalUrl : false
					}),
    				entityId = null;
					
	    			if(rec.type == record.Type.PURCHASE_ORDER){
	    		    	// Get employee id from header field
	    		    	entityId = rec.getValue({
	    		    		fieldId: 'employee'
	    		    	});
	    			}
					else if(rec.type == record.Type.PURCHASE_REQUISITION) { 
						// Get entity id from header field
						entityId = rec.getValue({
							fieldId:'entity'
						});
					}
	    			else {
		    			// Get employee id from line field
		    			entityId = rec.getCurrentSublistValue({
		    				sublistId: sublistName,
		    				fieldId: 'custcol_cbr_employee',
		    			});
		    			
		    			if(!entityId) {
		    				entityId = rec.getValue({ // SALES_ORDER, etc..
		    		    		fieldId: 'entity'
		    		    	});	
		    			}
		    		}

	    			if(entityId) {
						var entityJson = https.request({
	    				    method: https.Method.GET,
	    				    url: proxy + '&actionType=GetEntityDefaultValues&entityId=' + entityId
	    				}).body;

	    				if(entityJson){
		    				// Get relevant fields from employee record
		    				entityData = JSON.parse(entityJson);
	
		    				var dept 		= entityData['department'],
		    					location 	= entityData['location'],
		    					country 	= entityData['custentity_cseg_cbr_countries'];
		    				
		    				// for requisition and vendor bill defaulting is of region country, for all other -> it is of region (=location)
		    				if(useRegionCountry && country && common.isArrayAndNotEmpty(country) && !currCountry){
		    					rec.setCurrentSublistValue({
		    						sublistId: sublistName,
		    						fieldId: 'custcol_cseg_cbr_countries',
		    						value: country[0].value,
		    						fireSlavingSync:true,
		    						ignoreFieldChange:false
		    					});
		    				}
		    				
		    				// Set line fields department and location to be the employee's field values 
		    				else if((!currRegion || doOverwrite) && (location && common.isArrayAndNotEmpty(location))) {
		    					rec.setCurrentSublistValue({
		    						sublistId: sublistName,
		    						fieldId: 'location',
		    						value: location[0].value,
		    						fireSlavingSync:true,
		    						ignoreFieldChange:false
		    					});
		    					logger.debug({
									title: '"location was set"',
									details:"location was set"
								});
		    				}
		    				
		    				if((!currDept || doOverwrite) && common.isArrayAndNotEmpty(dept)){	    					
		    					rec.setCurrentSublistValue({
			    	        		sublistId: sublistName,
			    	        		fieldId: 'department',
			    	        		value: dept[0].value,
			    	        		fireSlavingSync:true,
		    						ignoreFieldChange:false
			    	        	});
	    					}
	    				}
	    			}
	
				} 
				catch(e){
					alert("Something went wrong with filling up default values. error:"+e.message);
				}
			}
		}
    };
    
    //This function has twin function on USER Event, when modifying, modify both
    validatePO_tolerance = function(rec){
    	var poTolData = rec.getValue({
			fieldId: 'custpage_po_req_data'
		});
		if(common.isNullOrEmpty(poTolData)){
			return;			
		}	
		poTolData = JSON.parse(poTolData);
    	if (poTolData.doValidate) {
    		var invalidLines = [];
    		var itemsLineCount = rec.getLineCount({
        	    sublistId: 'item'
        	});
    		for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {
    			var line = rec.getSublistValue({
    	    	    sublistId: 'item',
    	    	    fieldId: 'custcol_cbr_custom_line_id',
    	    	    line: lineNumber
    	    	});
    			var lineAmount = Number(rec.getSublistValue({
    	    	    sublistId: 'item',
    	    	    fieldId: 'amount',
    	    	    line: lineNumber
    	    	}));
    			var lineAmount_base =  parseFloat(lineAmount * poTolData.exRate);   
    			
    			if (poTolData.lines.hasOwnProperty(line)) {
    				var estimatedAmount = parseFloat(poTolData.lines[line]);
    				 
    				if (estimatedAmount > 0) {    					
        				if (!common.isNullOrEmpty(poTolData.tolAmount)) {        					 
    						if (lineAmount_base > (estimatedAmount + parseFloat(poTolData.tolAmount))) {
    							invalidLines.push((lineNumber + 1).toString() + ' (' + lineAmount_base + ' ' + poTolData.baseCurrency + ')');    							
    							continue;
    						}								
    					}
    					if (!common.isNullOrEmpty(poTolData.tolPercent)) {
    						var disPercent = (lineAmount_base - estimatedAmount) * 100 / estimatedAmount;
    						if (disPercent > poTolData.tolPercent) {
    							invalidLines.push((lineNumber + 1).toString() + ' (' + disPercent.toFixed(2) + '%)');
    							continue;
    						}
    					}
					}
    			}
    		}
    		
    		if (invalidLines.length > 0) {
    			throw error.create({
    				name : 'validatePO_Req_Tolerance',
    				message : "The discrepancy of the following lines is higher than the allowed tolerance : " + invalidLines.join(','),
    				notifyOff : true
    			});    			
			}
		};
    };
    
    function validatePaChange(rec, sublistName, isDelete){//DT535
    	
    	// Get current (about to be deleted) line P.A value
    	var currPA = rec.getCurrentSublistValue({
    		sublistId: sublistName,
    		fieldId: 'custcol_cbr_professional_approval',
    	});
    	
//    	logger.debug({
//    		title: '["validatePaChange", sublistName, currPA, isDelete]',
//    		details:["validatePaChange", sublistName, currPA, isDelete]
//    	});

    	if(((!common.isNullOrEmpty(currPA)) && isDelete) || !isDelete){
        	var length = rec.getLineCount({
			    sublistId: sublistName
			});
        	var occupied = false; 
        	if(length >= 1){

        		currLine = rec.getCurrentSublistIndex({
        		    sublistId: sublistName
        		});

	        	// loop through all remaining lines -> 
	        	// if no remaining lines were left, or all remaining items do not have a p.a -> 
	        	// remove value from header P.A field
            	for(var i=0; ((i<length) && (!occupied)); i++){
            		
            		// make sure not to mark current line as occupied 
            		if(i!= currLine){
	            		// Get line P.A value
	            		var linePA = rec.getSublistValue({
	            			sublistId:sublistName,
		            		fieldId:'custcol_cbr_professional_approval',
		            		line:i
		            	});
	            		// if value is not empty
	            		if(!common.isNullOrEmpty(linePA)){
	            			occupied = true;
	            		}
            		}
            	}
        	}
//        	else if (length == 1 && (!isDelete)){// if there is only one line, and the item was replaced in it
//        		rec.setValue({
//            		fieldId:'custbody_cbr_req_prof_app_ind',
//            		value:(common.isNullOrEmpty(currPA)?"":currPA),
//            		fireSlavingSync:true
//            	});
//        	}
        	
        	// Remove value from body field of professional approval
        	if((length == 1 && isDelete)||(!occupied)){
            	rec.setValue({
            		fieldId:'custbody_cbr_req_prof_app_ind',
            		value:"",
            		fireSlavingSync:true
            	});
        	}
        }
    }
    
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        sublistChanged: sublistChanged,
        lineInit: lineInit,
        validateField: validateField,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete,
        saveRecord: saveRecord
    };
    
});
