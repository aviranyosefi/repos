/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['require', 'N/log','N/record', '../Common/NCS.Lib.Common', 'N/search', 'N/format','N/error', 'N/url'], 
		function(require, logger, record, common, search, format,error, url) {

	beforeLoad = function(scriptContext) {
		var form = scriptContext.form;
    	var rec = scriptContext.newRecord;
    	
    	
    	if (scriptContext.type == scriptContext.UserEventType.CREATE) {
    		try {
    			// to ensure created from integration wont be transformed from transaction to transaction
    	    	rec.setValue({
    				fieldId: 'custbody_nc_ba_createdfrom_integration',
    				value: ''
    			});
    		} catch(err) {}
    		
    		try {
    			// to ensure "cbr layout settings" wont be transformed from transaction to transaction
        		rec.setValue({
    				fieldId : 'custbody_cbr_layout_settings',
    				value : ''
    			});
    		} catch(err) {}
    	}
    	//debug - igor
    	/*
    	if (rec.type == record.Type.REVENUE_ARRANGEMENT) {    		
    		if (scriptContext.type == scriptContext.UserEventType.VIEW && rec.id == '3234') {
    			verifyRevRecFairValue(rec);
    		}
    	}  
    	*/
    	//end debug
    	
    	//Prepare Print
    	var supportedTypes = [scriptContext.UserEventType.EMAIL, scriptContext.UserEventType.PRINT];
		if (supportedTypes.indexOf(scriptContext.type.toLowerCase()) > -1 && !common.isNullOrEmpty(rec.id)) {
			require(['./Print/NCS.Lib.DocumentsPrinter'], function(printer){
				printer.preparePrintRecord(scriptContext, rec, form);
			});
		}
			
		//Handle Localization
		if (scriptContext.type == scriptContext.UserEventType.VIEW) {
			
			if (rec.type == record.Type.INVOICE || rec.type == record.Type.CREDIT_MEMO) {
				// Override IL Print Handler
				require([ 'N/url', 'N/ui/serverWidget' ], function(url, serverWidget) {

					var printHandler = url.resolveScript({
						scriptId : 'customscript_ncs_ss_proxy_admin',
						deploymentId : 'customdeploy_ncs_ss_proxy_perform_print',
						returnExternalUrl : false,
						params : {
							actionType : 'print'
						}
					});
					
					var pageScript = 
							  '\n<script>' 
							+ '\n	jQuery(document).ready(function() {'
							+ '\n		if(typeof(_localizationPdfPrintUrl) != "undefined") {'
							+ '\n			_localizationPdfPrintUrl = "' + printHandler + '";' 
							+ '\n		}' 
							+ '\n}	);' 
							+ '\n</script>';

					form.addField({
						id : 'custpage_override_ilprint',
						label : 'custpage_override_ilprint',
						type : serverWidget.FieldType.INLINEHTML
					});
					form.updateDefaultValues({
						custpage_override_ilprint : pageScript
					});
				});
			}
		}	
		
		//Create JE for deduction bank account amounts
		var supportedRecType = ['customerrefund','customerpayment','customerdeposit','journalentry'];
		if (supportedRecType.indexOf(rec.type.toLowerCase()) > -1) {
			if (scriptContext.type == scriptContext.UserEventType.COPY) {
				//Reset link field
				rec.setValue({
					fieldId : 'custbody_cbr_bank_deduction_link',
					value : ''
				});
			}
		}
		
		if (rec.type == record.Type.SALES_ORDER) {
			if (scriptContext.type == scriptContext.UserEventType.COPY) {
				//Reset Proejct field
				rec.setValue({
					fieldId : 'custbody_cbr_so_project',
					value : ''
				});
			}
			if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT || scriptContext.type == scriptContext.UserEventType.EDIT) {
				require([ 'N/runtime', 'N/ui/serverWidget' ], function(runtime, serverWidget) {
					if (runtime.executionContext === runtime.ContextType.USER_INTERFACE){
						if (form) {
							var userObj = runtime.getCurrentUser();
							var role = userObj.role;
							var isRoleSalesRepRestricted = false;
							var restrictedRolesRes = common.get_Global_Setting('custrecord_cbr_role_restrict_sale_team');
							var restrictedRoles = [];
							if (common.isArrayAndNotEmpty(restrictedRolesRes)) {
								for (var i = 0; i < restrictedRolesRes.length; i++) {
									var restrictedRoleId = restrictedRolesRes[i].value;
									restrictedRoles.push(restrictedRoleId);									
								};
							};
							if (restrictedRoles.indexOf(role.toString()) > -1) {
								isRoleSalesRepRestricted = true;
							};
							var isSalesTeamRestrictedFld = form.addField({
								id : 'custpage_is_sales_team_restricted',
								label : 'custpage_is_sales_team_restricted',
								type : serverWidget.FieldType.CHECKBOX
							});
							form.updateDefaultValues({
								custpage_is_sales_team_restricted : isRoleSalesRepRestricted ? 'T' : 'F'
							});
							isSalesTeamRestrictedFld.updateDisplayType({
							    displayType : serverWidget.FieldDisplayType.HIDDEN
							});
						}
					}
				});
			}
		}
		if ((scriptContext.type == scriptContext.UserEventType.CREATE) || (scriptContext.type == scriptContext.UserEventType.EDIT)){
			if (rec.type == record.Type.PURCHASE_ORDER) {
				require(['N/ui/serverWidget' ], function(serverWidget) {
					var reqData = poGetReqData(rec,scriptContext.type);
					var formFieldPoReqData = form.addField({
						id : 'custpage_po_req_data',
						label : 'custpage_po_req_data',
						type : serverWidget.FieldType.LONGTEXT
					});
					formFieldPoReqData.updateDisplayType({
						displayType: serverWidget.FieldDisplayType.HIDDEN
					});
					form.updateDefaultValues({
						custpage_po_req_data : JSON.stringify(reqData)
					});
					/*
					throw error.create({
						message:"test",
						name : JSON.stringify(reqData),
						notifyOff : false
					});
					*/
				});
			}
		}		
    };

    beforeSubmit = function(scriptContext) {
    	// Default values=========================================================
    	if ((scriptContext.type == scriptContext.UserEventType.CREATE) || (scriptContext.type == scriptContext.UserEventType.EDIT)){
	    	var rec = scriptContext.newRecord;
	    	var recTypeToList = {};
	    	recTypeToList[record.Type.VENDOR_BILL] = ['item','expense'];
	    	recTypeToList[record.Type.VENDOR_CREDIT] = ['item'];
	    	recTypeToList[record.Type.PURCHASE_ORDER] = ['item'];
	    	recTypeToList[record.Type.PURCHASE_REQUISITION] = ['item'];
	    	recTypeToList['intercompanyjournalentry'] = ['line'];
	    	recTypeToList[record.Type.CHECK] = ['item'];
	    	recTypeToList[record.Type.JOURNAL_ENTRY] = ['line'];
	    	// Get Sublist id    
	    	
	    	if (recTypeToList.hasOwnProperty(rec.type)){
	    		var sublists = recTypeToList[rec.type];
	    		for (var sublistIndx = 0; sublistIndx < sublists.length; sublistIndx++) {
					var sublistName = sublists[sublistIndx];
					// get line count
					var lineCount = rec.getLineCount({
						sublistId: sublistName
					});
					
					for (var i=0; i<lineCount; i++){
				    	
				    	// get current line's department and region
						var currDept =rec.getSublistValue({
							sublistId: sublistName,
							fieldId: 'department',
							line:i
						});
						
						var currRegion =rec.getSublistValue({
							sublistId: sublistName,
							fieldId: 'location',
							line:i
						});
				
						if((common.isNullOrEmpty(currDept))||(common.isNullOrEmpty(currRegion))){
							try{
								
				    			var empId = null;
				    			if(rec.type == record.Type.PURCHASE_ORDER){
				    	    		
				    		    	// Get employee id from header field
				    		    	empId = rec.getValue({
				    		    		fieldId:'employee'
				    		    	});
				    		    	
				    			}else if(rec.type == record.Type.PURCHASE_REQUISITION){
				    				// Get employee id from header field
				    		    	empId = rec.getValue({
				    		    		fieldId:'entity'
				    		    	});
					    		}else{
					    			// Get employee id from line field
					    			empId = rec.getSublistValue({
					    				sublistId: sublistName,
					    				fieldId: 'custcol_cbr_employee',
					    				line:i
					    			});
					    		}

				    			if(!common.isNullOrEmpty(empId)){
				    				
				    				var empF = search.lookupFields({
				    					type :'employee',
				    					id : empId,
				    					columns : [ 'location', 'department' ]
				    	            });

				    				if(!common.isNullOrEmpty(empF)){
					    				// Get relevant fields from employee record
					    				empFields = empF;//JSON.parse(empF);
				
					    				var dept = empFields['department'];
					    				var location = empFields['location'];
					    				
					    				
					    				// Set line fields department and location to be the employee's field values 
					    				if((common.isNullOrEmpty(currRegion))&&(common.isArrayAndNotEmpty(location))){
					    					
					    					
					    					rec.setSublistValue({
					    						sublistId: sublistName,
					    						fieldId: 'location',
					    						value: location[0].value,
					    						line:i,
					    						fireSlavingSync:true,
					    						ignoreFieldChange:false
					    					});
					    				}
					    				
					    				if((common.isNullOrEmpty(currDept))&&(common.isArrayAndNotEmpty(dept))){
			
					    					rec.setSublistValue({
						    	        		sublistId: sublistName,
						    	        		fieldId: 'department',
						    	        		value: dept[0].value,
						    	        		line:i,
						    	        		fireSlavingSync:true,
					    						ignoreFieldChange:false
						    	        	});
				    					}
				    				}
				    			}
							}catch(e){
								throw error.create({
									message:"Something went wrong with filling up default values. error:"+e.message,
									name : "ERROR_SETTING_DEFAULT_VALUES",
									notifyOff : false
								});
							}
						}
					}
	    		}
			}
    	}
    	//========================================================================
    	//========== CREATE EVENTS
    	if (scriptContext.type == scriptContext.UserEventType.CREATE) {   		   		
    		
    		//====== CHARGE events
    		if (rec.type == record.Type.CHARGE) {
    			var salesOrderId = rec.getValue({
    				fieldId:'salesorder'
    			});
    			if (!common.isNullOrEmpty(salesOrderId)) {
    				rec.setValue({
        				fieldId: 'custrecord_cbr_chrg_create_fr_so',
        				value: salesOrderId
        			});
    			}
    			var salesOrderLineNumber = rec.getValue({
    				fieldId:'salesorderline'
    			});
    			
    			// load units
    			var DayUnits = {};
    			var timeUnitsTypeId = null;
    			search.create({
					type: search.Type.UNITS_TYPE,
					filters: [
						["name", "is", "Time"],
					],
					columns: []
				}).run().each(function (result) {
					timeUnitsTypeId = result.id;
					return true;
				});
    			if (!common.isNullOrEmpty(timeUnitsTypeId)) {
    				var unitsType = record.load({
    				    type: record.Type.UNITS_TYPE,
    				    id: timeUnitsTypeId
    				});
    				var uomLineCount = unitsType.getLineCount({
			    	    sublistId: 'uom'
			    	});
    				for (var lineNumber = 0; lineNumber < uomLineCount; lineNumber++) {
    					var conversionRate = unitsType.getSublistValue({
    	            	    sublistId: 'uom',
    	            	    fieldId: 'conversionrate',
    	            	    line: lineNumber
    	            	});
    					var uomLineId = unitsType.getSublistValue({
    	            	    sublistId: 'uom',
    	            	    fieldId: 'internalid',
    	            	    line: lineNumber
    	            	});
    					
    					if (!common.isNullOrEmpty(conversionRate) && !DayUnits.hasOwnProperty(conversionRate)) {
    						DayUnits[conversionRate] = uomLineId;
    					}
    				}
    			}
    			
    			if (!common.isNullOrEmpty(salesOrderId) && !common.isNullOrEmpty(salesOrderLineNumber)) {
    				search.create({
    					type: search.Type.SALES_ORDER,
    					filters: [
    						["mainline", "is", "F"],
    						"AND", 
    						["taxline", "is", "F"],
    						"AND", 
    						["internalid", "anyof", salesOrderId],
    						"AND", 
    						["line", "equalto", salesOrderLineNumber]
    					],
    					columns: [
    						"line",
    						"custcol_cbr_so_day_unit",
    						search.createColumn({
    							name: "formulanumeric",
    							formula: "{rate} / {exchangerate}"
    						})
    					]
    				}).run().each(function (result) {
    					var line = result.getValue("line");
    					if (!common.isNullOrEmpty(line) && !common.isNullOrEmpty(salesOrderLineNumber) && line == salesOrderLineNumber) {
    						var soLineCustomDayUnit = result.getValue("custcol_cbr_so_day_unit");
    						
    						// set Units
    						if (DayUnits.hasOwnProperty(soLineCustomDayUnit)) {
    							var chargeUnits = rec.setValue({
        	        				fieldId: 'units',
        	        				value: DayUnits[soLineCustomDayUnit]
        	        			});
    						}
    						
    						// set Charge quantity
    						var chargeQuantity = rec.getValue({
    	        				fieldId: 'quantity'
    	        			});
    	    				if (!common.isNullOrEmpty(soLineCustomDayUnit) && soLineCustomDayUnit != 0) {
    	    					chargeQuantity = (Number(chargeQuantity) / Number(soLineCustomDayUnit)).toFixed(2);
    	        				rec.setValue({
    	            				fieldId: 'quantity',
    	            				value: chargeQuantity
    	            			});
    	    				}
    	    				
    	    				// set Charge rate
    	    				var soLineRate = result.getValue({
    							name: "formulanumeric",
    							formula: "{rate} / {exchangerate}"
    						});
    	    				rec.setValue({
    	        				fieldId: 'rate',
    	        				value: Number(soLineRate)
    	        			});
    					}
    					return true;
    				});
    			}
       		}
    		
       		//======ITEM_FULFILLMENT events
    		if (rec.type == record.Type.ITEM_FULFILLMENT) {
              
    			require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
    				helpers.populateSublistEndDates(rec);
    			});
               
    			
    			//==========Customer First Delivery Date ================
    			// Get Transaction Date
    			var date = rec.getValue({
    				fieldId:'trandate'
    			});
    			date = format.format({
    				value:date,
    				type: format.Type.DATE
    			});
    			
    			// Get Transaction Customer
    			var customer = rec.getValue({
    				fieldId:'custbody_cbr_so_end_user'
    			});

    			if(!common.isNullOrEmpty(customer)){
    				
    				// Check if field is already occupied 
    				var fdd = search.lookupFields({
    					type :record.Type.CUSTOMER,
    					id : customer,
    					columns : ['custentity_cbr_first_delivery_date' ]
    	            })['custentity_cbr_first_delivery_date'];
    				
    				
    				// Do not overwrite the field - make sure it is unoccupied before inserting a value
    				if(common.isNullOrEmpty(fdd)){
    					
		    			// Set Customer's First Delivery Date (field) to be the transaction date
		    			record.submitFields({
		    				type:record.Type.CUSTOMER, 
		    				id: customer,
		    				values:{
		    					custentity_cbr_first_delivery_date: date
		    				}
		    			});
    				}
    			}
    		}
    		
    		//======INVOICE & Credit memo events
    		if (rec.type == record.Type.INVOICE || rec.type == record.Type.CREDIT_MEMO) {   
    			
    			//populate disclaimer for prints
    			require(['../Common/NCS.Lib.Helpers'], function(helpers) {
    				helpers.populateDisclaimer(rec);
    			});
    			
    			//populate invoice Layout settings
    			populateLayoutSettings(rec);   			
       		}
		}
    	
    	//========== CREATE & EDIT EVENTS
    	if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {

    		//======REVENUE_ARRANGEMENT events
    		if (rec.type == record.Type.REVENUE_ARRANGEMENT) {
    			var tranIsAllocBundle = rec.getValue({
    				fieldId: 'tranisvsoebundle'
    			});
    			if (tranIsAllocBundle == true) {
    				
    				require(['N/search'], function(search) { 
            			var tranIsNotAllocBundle = search.lookupFields({
                		    type: 'customrecord_ncs_global_settings',
                		    id: '1',
                		    columns: ['custrecord_cbr_tran_is_not_alloc_bundle']
                		});
            			if (tranIsNotAllocBundle.custrecord_cbr_tran_is_not_alloc_bundle.length == 1 && tranIsNotAllocBundle.custrecord_cbr_tran_is_not_alloc_bundle[0].hasOwnProperty('value')) {
        					var itemRevenueCategoryId = tranIsNotAllocBundle.custrecord_cbr_tran_is_not_alloc_bundle[0].value;
        					if (!common.isNullOrEmpty(itemRevenueCategoryId)) {
        				    	var revenueElementsLineCount = rec.getLineCount({
        				    	    sublistId: 'revenueelement'
        				    	}),
        				    	revenueElementsHash = {},
        				    	revenueElementsIds = [];
        				    	
        				    	for (var lineNumber = 0; lineNumber < revenueElementsLineCount; lineNumber++) {
        				    		var revenueElementInternalId = rec.getSublistValue({
        				        	    sublistId: 'revenueelement',
        				        	    fieldId: 'item',
        				        	    line: lineNumber
        				        	});
        				    		
        				    		if(revenueElementInternalId && !revenueElementsHash[revenueElementInternalId]) {
        				    			revenueElementsIds.push(revenueElementInternalId);
        				    			revenueElementsHash[revenueElementInternalId] = true;
        				    		}
        				    	}
        				    	
        				    	if (revenueElementsIds.length > 0) {
//        				    		logger.debug({
//        				    			title: 'Update Rev.Arngmt',
//        				    			details: revenueElementsIds
//        				    		});
        				    		
    				        		var results = search.create({
    				        		    type: search.Type.ITEM,
    				        		    columns: [
											search.createColumn({
											    name: 'internalid',
											    summary: search.Summary.COUNT
											})
    				        		    ],
    				        		    filters: [
    				        		        ['isinactive', 'is', 'F'],
    				        		        'AND',
    				        		        ['internalid', 'anyof', revenueElementsIds],
    				        		        'AND',
    				        		        ['itemrevenuecategory', 'is', itemRevenueCategoryId]
    				        		    ]
    				        		}).run().each(function(result) {
    				        			var count = result.getValue({
										    name: 'internalid',
										    summary: search.Summary.COUNT
										});
    					        		if (!common.isNullOrEmpty(count) && count == 0) {
        				        			rec.setValue({
        				        				fieldId: 'tranisvsoebundle',
        				        				value: false
        				        			});
        				        		}
									});
        				    	}
        					}
            			} 
    				});
    			};
    			
    			//Remove compliant checkbox in order to run the the allocation detail on the after submit
    			if (scriptContext.type == scriptContext.UserEventType.CREATE) {
    				rec.setValue({
        				fieldId: 'compliant',
        				value: false
        			});
				}; 
    		};
    		
    		// map to detect enduser israel
    		var countryMap = {
				'103': 'israel'
			};
    		
    		//=========POPULATE CUSTOM LINE ID ON REQUIRED TRANSACTION TYPES
    		if (rec.type == record.Type.SALES_ORDER || 
    				rec.type == record.Type.RETURN_AUTHORIZATION || 
    				rec.type == record.Type.PURCHASE_REQUISITION
    		) {
    			//Populate custom line ids
    			require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
    				// populate Custom LineIds again
    				helpers.populateCustomLineIds(rec, scriptContext.type);
    			});	
    		}
    		
    		
    		//====== RETURN AUTHORIZATION events
    		if (rec.type == record.Type.RETURN_AUTHORIZATION) {
				try {
					require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
						helpers.populateSublistEndDates(rec);
	    			});

    				// create maintenance lines
    				var endUserCountry = rec.getValue({
        			    fieldId: 'custbody_cbr_so_end_user_country'
        			});
    				if (!common.isNullOrEmpty(endUserCountry) && countryMap.hasOwnProperty(endUserCountry)) {
    					endUserCountry = countryMap[endUserCountry];
    				}
    				updateOrderAndRMALines(rec, scriptContext);
    				/*
					require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
						helpers.splitMaintenanceItems(rec, scriptContext.type, endUserCountry);

        				// Populate Custom LineIds again after split
        				helpers.populateCustomLineIds(rec,scriptContext.type);
        			});
					*/
				} catch (err) {
    				throw err;
    			}
    		}
    		
    		//====== SALESORDER events
    		if (rec.type == record.Type.SALES_ORDER) {
    			try {
    				require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
    					helpers.createProjectForSO(rec);
						helpers.populateSublistEndDates(rec);
	    			});
    				
    				// create maintenance lines
    				var endUserCountry = rec.getValue({
        			    fieldId: 'custbody_cbr_so_end_user_country'
        			});
    				if (!common.isNullOrEmpty(endUserCountry) && countryMap.hasOwnProperty(endUserCountry)) {
    					endUserCountry = countryMap[endUserCountry];
    				}
    				updateOrderAndRMALines(rec, scriptContext);
					/*
        			require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
						helpers.splitMaintenanceItems(rec, scriptContext.type, endUserCountry);

        				// Populate Custom LineIds again after split
        				helpers.populateCustomLineIds(rec,scriptContext.type);
        			});
					*/
        			
        			
        			// set split deal True if Sales Team count is more then 1 else False
        			var salesTeamLineCount = rec.getLineCount({
        	    	    sublistId: 'salesteam'
        	    	});
    				rec.setValue({
    				    fieldId: 'custbody_cbr_so_split_deal',
    				    value: (salesTeamLineCount > 1)
    				});
    			} catch (err) {
    				throw err;
    			}
    		}
    		//Populate RR Reference Numbers
    		populateRR_ReferenceNumber(rec,'beforeSubmit');
    		
    		//Create JE for deduction bank account amounts
    		var supportedRecType = ['customerrefund','customerpayment','customerdeposit'];
    		if (supportedRecType.indexOf(rec.type.toLowerCase()) > -1) {
    			createBankJEDeduction(rec,scriptContext);
    		}
    		
    		//======Validate Tolerance On PO From Requisition    		
    		if (rec.type == record.Type.PURCHASE_ORDER) {
    			validatePO_tolerance(rec,scriptContext.type);    			
    		}
    	}
    };

    afterSubmit = function(scriptContext) {
    	if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {
    		var rec = scriptContext.newRecord;
    		populateRR_ReferenceNumber(rec,'afterSubmit');
    		
    		//======REVENUE_ARRANGEMENT events
    		if (rec.type == record.Type.REVENUE_ARRANGEMENT) {
    			//REV REC Fair Value Range Checking - Allocation Type
    			
    			//Deprecated on 19/12/2017 due to CyberArc's request
    			//verifyRevRecFairValue(rec);
    		}    		
    	}
    	
    	if (scriptContext.type == scriptContext.UserEventType.CREATE){
    		var rec = scriptContext.newRecord;
    		updateSO_OnRMA(rec);
    		
    		//Create JE for deduction bank account amounts
        	//Set transaction id and line memos on target je
    		var supportedRecType = ['customerrefund','customerpayment','customerdeposit'];
    		if (supportedRecType.indexOf(rec.type.toLowerCase()) > -1) {
    			var jeTranId = rec.getValue({
    				fieldId : 'custbody_cbr_bank_deduction_link'
    			});
    	    	if (!common.isNullOrEmpty(jeTranId)){
    	    		//Get Current transaction number
    	    		var tranNumber = search.lookupFields({
	        		    type: rec.type,
	        		    id: rec.id,
	        		    columns: 'tranid'
	        		})['tranid'];
    	    		
    	    		//Update linked JE
    	    		var jeRec = record.load({
    				    type: record.Type.JOURNAL_ENTRY,
    				    id: jeTranId
    				});
                  jeRec.setValue({
    					fieldId : 'custbody_cbr_bank_deduction_link',
    					value : rec.id
    				});
    	    		var lineCount = jeRec.getLineCount({
    		    	    sublistId: 'line'
    		    	});
    	    		for (var lineNumber = 0; lineNumber < lineCount; lineNumber++) {
    	    			jeRec.setSublistValue({
		            	    sublistId: 'line',
		            	    fieldId: 'memo',
		            	    line: lineNumber,
		            	    value: tranNumber
		            	});
    	    		}
    	    		jeRec.save();
    			}			
    		}
    		
       		//======ITEM_FULFILLMENT events
    		if (rec.type == record.Type.ITEM_FULFILLMENT) {
	    		require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
	    			helpers.updateNewBizDates(rec);
	    		});
    		}
    	}
    };
    
    function updateOrderAndRMALines(rec, scriptContext) {
    	require(['N/search', '../Common/NCS.Lib.Helpers'], function(search, helpers) {
    		var professionalServicesId = '8';
    		var timeBasedId = '-13';
    		
			// Load Region Countries
			var ragionCountriesMap = {};
			search.create({
			   type: 'customrecord_cbr_countries',
			   filters: [['custrecord_cbr_country', 'noneof', '@NONE@']], // DT# 474
			   columns: [
			      'custrecord_cbr_region',
			      'custrecord_cbr_country' // DT# 474
			   ]
			}).run().each(function(result){
				var region 	= result.getValue('custrecord_cbr_region'),
					country = result.getValue('custrecord_cbr_country'); // DT# 474
				ragionCountriesMap[country] = region; // DT# 474
			    return true;
			});
			var transactionDate = rec.getValue({
			    fieldId: 'trandate'
			});
			var listPriceExchangeRate = helpers.generateListPriceExchangerate(rec, transactionDate);

			var itemsLineCount = rec.getLineCount({
	    	    sublistId: 'item'
	    	});
			
			var isNonTimeBase = rec.getValue({
				fieldId: 'custbody_cbr_non_time_base'
			});	
			
    		var projectId = rec.getValue({
    			fieldId: 'custbody_cbr_so_project'
    		});
    		
	    	for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {
				// set line item's chargetype default value for Professional Services items
	    		if (rec.type == record.Type.SALES_ORDER) {
		    		var itemCategoyId = rec.getSublistValue({
		        	    sublistId: 'item',
		        	    fieldId: 'custcol_cbr_trn_item_category',
		        	    line: lineNumber
		        	});
		    		
		    		var isItemExcludedChargeBase = common.nsBoolToBool(rec.getSublistValue({
		        	    sublistId: 'item',
		        	    fieldId: 'custcol_cbr_excluded_cb',
		        	    line: lineNumber
		        	}));
		    		
		    		if (isNonTimeBase == false) {
		    			if (isItemExcludedChargeBase == false) {
					   		var chargeType = rec.getSublistValue({
				        	    sublistId: 'item',
				        	    fieldId: 'chargetype',
				        	    line: lineNumber
				        	});

					   		if (!common.isNullOrEmpty(itemCategoyId) && itemCategoyId == professionalServicesId) {
					   			rec.setSublistValue({
					        	    sublistId: 'item',
					        	    fieldId: 'chargetype',
					        	    line: lineNumber,
					        	    value: timeBasedId
					        	});
					   		};
		    			};
			   		};
		    		
		    		if (!common.isNullOrEmpty(itemCategoyId) && itemCategoyId == professionalServicesId) {
		    			
		    			// add created project to items which has item category professionalServices and are not excluded charge base
		    			if (!common.isNullOrEmpty(projectId) && !common.isNullOrEmpty(isItemExcludedChargeBase) && isItemExcludedChargeBase == false) {
		    				rec.setSublistValue({
				        	    sublistId: 'item',
				        	    fieldId: 'job',
				        	    line: lineNumber,
				        	    value: projectId
				        	});
		    			};
		    			
			    		if (scriptContext.type == scriptContext.UserEventType.CREATE) {
			    			var rate = rec.getSublistValue({
			            	    sublistId: 'item',
			            	    fieldId: 'rate',
			            	    line: lineNumber
			            	});
			    			rec.setSublistValue({
				        	    sublistId: 'item',
				        	    fieldId: 'price',
				        	    line: lineNumber,
				        	    value: '-1' // Custom
				        	});
			    			//Changing pricelevel is resetting the line rate.
			    			rec.setSublistValue({
				        	    sublistId: 'item',
				        	    fieldId: 'rate',
				        	    line: lineNumber,
				        	    value: rate
				        	});
			    		};
		    		};
	    		};

	    		if (!common.isNullOrEmpty(listPriceExchangeRate)) {
	    			// copied rate from last calcualter unit price (rate)
	    			var indCalcRate = rec.getSublistValue({
	            	    sublistId: 'item',
	            	    fieldId: 'custcol_cbr_ind_calc_rate',
	            	    line: lineNumber
	            	});
	    			var rate = rec.getSublistValue({
	            	    sublistId: 'item',
	            	    fieldId: 'rate',
	            	    line: lineNumber
	            	});
	    			// item Indicator for calculated Rate is empty (exmp, first time) or unit price (rate) equals to indicator calculated rate then recalculate
	    			if (common.isNullOrEmpty(indCalcRate)) {
	    				// removed but dont delete
	    				// || (!common.isNullOrEmpty(rate) && !common.isNullOrEmpty(indCalcRate) && rate == indCalcRate)
	    				
	    				var newRate = helpers.setItemRatesByExchangeRate(rec, lineNumber, listPriceExchangeRate);
		    			if (!common.isNullOrEmpty(newRate)) {
		    				rec.setSublistValue({
			            	    sublistId: 'item',
			            	    fieldId: 'custcol_cbr_ind_calc_rate',
			            	    line: lineNumber,
			            	    value: newRate
			            	});
		    			};
	    			};
	    		};
	    		
    			copyItemRagionToLocation(rec, lineNumber, ragionCountriesMap);
	    	};
    	});
	};
    
    function copyItemRagionToLocation(rec, lineNumber, ragionCountriesMap) {
    	// Koby test
    	logger.debug({
			title : 'Test ragionCountriesMap',
			details : JSON.stringify(ragionCountriesMap)
		});
    	if (common.isNullOrEmpty(rec) || common.isNullOrEmpty(lineNumber) || common.isNullOrEmpty(ragionCountriesMap)) {
    		throw error.create({
				name : 'copyItemRagionToLocation',
				message : 'all parameters (rec, lineNumber, ragionCountriesMap) are required',
				notifyOff : true
			});
    	}
    	var region = rec.getSublistValue({
    	    sublistId: 'item',
    	    fieldId: 'custcol_cseg_cbr_countries',
    	    line: lineNumber
    	});
    	if (!common.isNullOrEmpty(region) && ragionCountriesMap.hasOwnProperty(region)) {
    		var regionLocation = ragionCountriesMap[region];
    		rec.setSublistValue({
        	    sublistId: 'item',
        	    fieldId: 'location',
        	    line: lineNumber,
        	    value: regionLocation
        	});
		}
	};
    
    function populateRR_ReferenceNumber(originalRec,trigger) {
    	if (trigger == 'afterSubmit') {
    		if (originalRec.type == record.Type.REVENUE_ARRANGEMENT) {
    			//Update RR Reference for Revenue Arrangment
    			
        		var revenueElementsLineCount = originalRec.getLineCount({
    	    	    sublistId: 'revenueelement'
    	    	});
        		
        		//Get SO Transaction Ids
        		var tranIds = [];
        		var tranMap = {};
        		for (var lineNumber = 0; lineNumber < revenueElementsLineCount; lineNumber++) {	 
        			var tranIdRaw = originalRec.getSublistValue({
    	        	    sublistId: 'revenueelement',
    	        	    fieldId: 'referenceid',
    	        	    line: lineNumber
    	        	}); 
        			var tranNumber = originalRec.getSublistValue({
    	        	    sublistId: 'revenueelement',
    	        	    fieldId: 'custcol_cbr_rr_reference_num',
    	        	    line: lineNumber
    	        	}); 
        			if (!common.isNullOrEmpty(tranIdRaw) && common.isNullOrEmpty(tranNumber)){
        				var tranId = tranIdRaw.substring(tranIdRaw.indexOf('_')+1);
        				if (tranIds.indexOf(tranId) == -1) {
    	    				tranIds.push(tranId);
    	    			}
        			}
        		}    		
        		if (tranIds.length > 0) {        			
        			//Map Orders to transaction Numbers
        			var salesorderSearchObj = search.create({
        				   type: "transaction",
        				   filters: [
        				      ["mainline","is","T"],
        				      "AND",
        				      ["internalid","anyof",tranIds]
        				   ],
        				   columns: [
        				      "tranid"
        				   ]
        				});
        			
    				salesorderSearchObj.run().each(function(result){
    					var tranInternalId = result.id;
    					var tranNumber = result.getValue({
    				         name: "tranid"
    				    });
    					tranMap[tranInternalId] = tranNumber;
    					return true;
    				});
        			//Update transaction numbers
    				
    				//There is a bug on the Revenue Arrangment record - editing sublist lines on user event will result in an error
        			//Therefore, the record is loaded again and then manipulated
        			var rec = record.load({
    				    type: record.Type.REVENUE_ARRANGEMENT, 
    				    id: originalRec.id
    				});
        			for (var lineNumber = 0; lineNumber < revenueElementsLineCount; lineNumber++) {	    		
        				var tranIdRaw = rec.getSublistValue({
        	        	    sublistId: 'revenueelement',
        	        	    fieldId: 'referenceid',
        	        	    line: lineNumber
        	        	});
        				var tranNumber = rec.getSublistValue({
        	        	    sublistId: 'revenueelement',
        	        	    fieldId: 'custcol_cbr_rr_reference_num',
        	        	    line: lineNumber
        	        	}); 
        				if (!common.isNullOrEmpty(tranIdRaw)  && common.isNullOrEmpty(tranNumber)){
            				var tranId = tranIdRaw.substring(tranIdRaw.indexOf('_')+1);        				
            				rec.setSublistValue({
        		        	    sublistId: 'revenueelement',
        		        	    fieldId: 'custcol_cbr_rr_reference_num',
        		        	    line: lineNumber,
        		        	    value: tranMap[tranId]
        		        	});    		        	
            			}
        	    	}
        			rec.save();
    			}
    		}
		}
    	else if (trigger == 'beforeSubmit') {
    		var rec = originalRec;
    		var createdFromTranTypes = [
    	                            	record.Type.INVOICE,
    	                            	record.Type.CREDIT_MEMO,
    	                            	record.Type.CASH_SALE,
    	                            	record.Type.CASH_REFUND
    	                            ];
	    	if (createdFromTranTypes.indexOf(rec.type) > -1) {  
	    		//Get the Reference from the created from field
	    		var createdFrom = rec.getValue({
					fieldId: 'createdfrom'
				});	
	    		
	    		if (!common.isNullOrEmpty(createdFrom)) {	    			
	    			var lineNumber = rec.findSublistLineWithValue({
	        		    sublistId: 'item',
	        		    fieldId: 'custcol_cbr_rr_reference_num',
	        		    value: ''
	        		});
	    			var emptyLineExists = (lineNumber > -1);
	    			if (emptyLineExists) {
	    				var tranNumber = search.lookupFields({
		        		    type: 'transaction',
		        		    id: createdFrom,
		        		    columns: 'tranid'
		        		})['tranid'];
		    			var itemsLineCount = rec.getLineCount({
		    	    	    sublistId: 'item'
		    	    	});
		    			for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {
		    				var lineTranNumber = rec.getSublistValue({
		    	        	    sublistId: 'item',
		    	        	    fieldId: 'custcol_cbr_rr_reference_num',
		    	        	    line: lineNumber
		    	        	});
		    				if (common.isNullOrEmpty(lineTranNumber)) {
		    					rec.setSublistValue({
					        	    sublistId: 'item',
					        	    fieldId: 'custcol_cbr_rr_reference_num',
					        	    line: lineNumber,
					        	    value: tranNumber
					        	});
		    				}		    				
		    			}
					}
				}
	    	}
    	}
	}
    
    updateSO_OnRMA = function(rec){
    	//Update SO RMA Line on RMA Creation
    	if (rec.type == record.Type.RETURN_AUTHORIZATION) {
    		var createdFrom = rec.getValue({
    			fieldId: 'createdfrom'
    		});
    		var customCreatedFrom = rec.getValue({
    			fieldId: 'custbody_cbr_created_from_so'
    		});
    		var createdFromIntegration = rec.getValue({
    			fieldId: 'custbody_nc_ba_createdfrom_integration'
    		});
    		var cancelationReasonId = rec.getValue({
    			fieldId: 'custbody_cbr_so_cancelation_reason'
    		});
    		var createSoLine = false;
    		if (!common.isNullOrEmpty(cancelationReasonId)) {
    			createSoLine = search.lookupFields({
        		    type: 'customrecord_cbr_cancelation_reason',
        		    id: cancelationReasonId,
        		    columns: 'custrecord_cbr_cancelatio_create_so_line'
        		})['custrecord_cbr_cancelatio_create_so_line'];
    		}
    		
        	if ((!common.isNullOrEmpty(createdFrom) || !common.isNullOrEmpty(customCreatedFrom) && common.isNullOrEmpty(createdFromIntegration)) && createSoLine == true) {	
        		if (common.isNullOrEmpty(createdFrom)) {
        			createdFrom = customCreatedFrom;
        		}
        		
        		var createdFromType = search.lookupFields({
        		    type: 'transaction',
        		    id: createdFrom,
        		    columns: 'recordtype'
        		})['recordtype'];
        		if (createdFromType == 'salesorder') {
        			var rmaItemsLineCount = rec.getLineCount({
	    	    	    sublistId: 'item'
	    	    	});
        			var soRecord = null;
        			var copyFields = null;
        			var newLineIndex = null;
        			for (var lineNumber = 0; lineNumber < rmaItemsLineCount; lineNumber++) {
        				var customLineId = rec.getSublistValue({
	    	        	    sublistId: 'item',
	    	        	    fieldId: 'custcol_cbr_custom_line_id',
	    	        	    line: lineNumber
	    	        	});
        				if (!common.isNullOrEmpty(customLineId)) {
        					if (common.isNullOrEmpty(soRecord)) {
        						soRecord = record.load({
        	    				    type: record.Type.SALES_ORDER, 
        	    				    id: createdFrom
        	    				});
        						newLineIndex = soRecord.getLineCount({
            						sublistId : 'item'
            					});
							}
        					var rmaQty = rec.getSublistValue({
    	    	        	    sublistId: 'item',
    	    	        	    fieldId: 'quantity',
    	    	        	    line: lineNumber
    	    	        	});
        					var rmaItemId = rec.getSublistValue({
    	    	        	    sublistId: 'item',
    	    	        	    fieldId: 'item',
    	    	        	    line: lineNumber
    	    	        	});
        					/*
        					logger.error({
    							title : 'rmaLine ' + lineNumber,
    							details : [rmaItemId,rmaQty].join(',')
    						});
        					*/
        					//Update original SO Line
        					var soLineNumber = soRecord.findSublistLineWithValue({
        	        		    sublistId: 'item',
        	        		    fieldId: 'custcol_cbr_custom_line_id',
        	        		    value: customLineId
        	        		});
        					
        					soRecord.setSublistValue({
				        	    sublistId: 'item',
				        	    fieldId: 'custcol_cbr_so_rma_qty_returned',
				        	    line: soLineNumber,
				        	    value: rmaQty
				        	});
        					soRecord.setSublistValue({
				        	    sublistId: 'item',
				        	    fieldId: 'custcol_cbr_so_rma',
				        	    line: soLineNumber,
				        	    value: rec.id
				        	});
        					
        					//Add RMA Line to SO        					
        					soRecord.setSublistValue({
        					    sublistId: 'item',
        					    fieldId: 'item',
        					    line : newLineIndex,
        					    value: rmaItemId
        					});
        					
        					soRecord.setSublistValue({
        					    sublistId: 'item',
        					    fieldId: 'custcol_cbr_rma_custom_line_id',
        			    	    line : newLineIndex,
        					    value: customLineId
        					});
        					
        					
        					if (common.isNullOrEmpty(copyFields)) {
        						copyFields = {};
        						var soRecTypeNumId = '';
        						require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
        							soRecTypeNumId = helpers.getRecordTypeNumericId('salesorder');
        		    			});
        						search.create({
            	        			type: 'customrecord_cbr_split_copy_fields',
            	        			columns: [
            	        			    'custrecord_cbr_sscf_column_id'
            	        			],
            	        			filters: [
            	        			    ['isinactive', 'is', 'F'],
            	        			    'AND',
            	          		        ['custrecord_cbr_sscf_global_settings', 'noneof', '@NONE@'],
            	          		        'AND',
            	          		        ['custrecord_cbr_sscf_record_type', 'anyof', soRecTypeNumId]
            	        			]
            	        		}).run().each(function(result) {
            	        			var columnId = result.getValue('custrecord_cbr_sscf_column_id');

            	    				if (!common.isNullOrEmpty(columnId)) {
            	    					copyFields[columnId] = {};
            	    				}
            	        			return true;
            	        		});
							}
        	        		
        	        		for (var columnId in copyFields) {
        	        			if (copyFields.hasOwnProperty(columnId)) {
        	        				if (columnId == 'amount') {
										continue;
									}
        	        				/*
        	        				logger.error({
            							title : 'columnId',
            							details : columnId
            						});
            						*/
        	        				var columnValue = rec.getSublistValue({
    	        			    	    sublistId: 'item',
    	        			    	    fieldId: columnId,
    	        			    	    line: lineNumber
    	        			    	});
        	        				soRecord.setSublistValue({
        	        				    sublistId: 'item',
        	        				    fieldId: columnId,
        	        				    line : newLineIndex,
        	        				    value: columnValue
        	        				});
        	        			}
        	        		}
        	        		
        	        		soRecord.setSublistValue({
				        	    sublistId: 'item',
				        	    fieldId: 'quantity',
				        	    line: newLineIndex,
				        	    value: rmaQty
				        	});
        	        		
        	        		newLineIndex += 1;
        				}
        			}
        			if (!common.isNullOrEmpty(soRecord)) {
        				require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
            				helpers.populateCustomLineIds(soRecord);
            			});
        				soRecord.save();
        			}
				}
        	}
    	}
    };
    
    populateLayoutSettings = function(rec){
    	var settingsRecId = null;
    	var subId = rec.getValue({
			fieldId: 'subsidiary'
		});
    	/*
    	var subName = rec.getText({
			fieldId: 'subsidiary'
		});
		*/
    	var soRecTypeNumId = null;
    	try{
    		//Get Setting Record if exists
        	require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
        		soRecTypeNumId = getRecordTypeNumericId(rec.type.toLowerCase());
    		});
        	
        	search.create({
    			type: "customrecord_cbr_layout_setting",
    		    filters: [
    		              ['isinactive','is','F'],
    		              'AND',
    		              ["custrecord_cbr_layout_subsidiary","anyof",subId],
    		              'AND',
    		              ['custrecord_cbr_layout_transaction_type', 'anyof', soRecTypeNumId]
    		    ]
    		}).run().each(function(result){
    			if (!common.isNullOrEmpty(settingsRecId)) {
    				throw error.create({
    					name : 'getInvoiceLayoutSettings',
    					message : 'More than 1 setting was found for subsidiary',
    					notifyOff : true
    				});
    			};
    			
    			settingsRecId = result.id;
    			return true;
    		});    	
        	
        	if (!common.isNullOrEmpty(settingsRecId)) {
        		rec.setValue({
    				fieldId : 'custbody_cbr_layout_settings',
    				value : settingsRecId
    			});
        	}
    	}
    	catch(err){
    		throw error.create({
				name : 'populateLayoutSettings',
				message : err.message,
				notifyOff : true
			});
    	}
    	
    };
    
    verifyRevRecFairValue = function(revRecRecord){
    	var supportedCategories = getSupportedCategories();
    	if (supportedCategories.length == 0) {
			return;
		}
    	
    	var revRecData = getReveueArrangmentData();
    	
    	if (common.isNullOrEmpty(revRecData)){ 
    		//No qualified Rev Rec lines exist
    		return;
    	}
    	
    	if (revRecData.totalLinesToVerify < 2) {
			//For not qualified lines, or only 1 qualifed line, no verification is required
    		return;
		}
    	
    	if (common.isNullOrEmpty(revRecData.sourceTranId)){ 
    		return;
    	}
    	
    	var sourceTranType = search.lookupFields({
		    type: 'transaction',
		    id: revRecData.sourceTranId,
		    columns: 'recordtype'
		})['recordtype'];
    	
		if (sourceTranType != record.Type.SALES_ORDER && sourceTranType != record.Type.RETURN_AUTHORIZATION) {
			return;
		}
		
		var allocationDetails = getNSAllocationsDetails();
		
		var summaryResult =  summarizeItemCategories();
		/*
		throw error.create({
			name : 'revRecData',
			message : JSON.stringify(summaryResult),
			notifyOff : true
		});
		*/
		/*
		if (revRecRecord.id == 23492) {	
			throw error.create({
				name : 'test',
				message : JSON.stringify(revRecData.lines),
				notifyOff : true
			});
		}
		*/
		if (summaryResult.isUpdateRequired) {
			var itemCategoriesSummary = summaryResult.sumCategories;
			
			//Perform Update (This event is triggered on after submit, so reloading of the record is required
			var newRevRecRecord = record.load({
			    type: revRecRecord.type, 
			    id: revRecRecord.id
			});
			for ( var revRecLineNumber in revRecData.lines) {
				if (revRecData.lines.hasOwnProperty(revRecLineNumber)) {					
					var revRecLine = revRecData.lines[revRecLineNumber];
					if (revRecLine.isSupportedCategory) {
						var categorySum = itemCategoriesSummary[revRecLine.itemCategory];
						if (!categorySum.doUpdate) {
							//No update is required if there is only 1 line in category
							continue;
						}
						var calculatedAmount = null;
						if (categorySum.isInRange) {							
							//IF in range, get value from discounted amount
							calculatedAmount = revRecLine.discountedAmount;
						}
						else {
							//Get value from fair price base price
							calculatedAmount = Number(allocationDetails[revRecLine.revElementId].baseFairValue) * Number(revRecLine.quantity);
						}
						newRevRecRecord.setSublistValue({
			        	    sublistId: 'revenueelement',
			        	    fieldId: 'fairvalueoverride',
			        	    line: revRecLine.lineNumber,
			        	    value: true
			        	});
						
						newRevRecRecord.setSublistValue({
			        	    sublistId: 'revenueelement',
			        	    fieldId: 'calculatedamount',
			        	    line: revRecLine.lineNumber,
			        	    value: calculatedAmount
			        	});	
					}
				}
			}
			newRevRecRecord.save();
			//Run reallocation again to take calculated value price into account			
			require(['N/https'], function(https){				
				//resolve domain
				var domain = url.resolveDomain({
				    hostType: url.HostType.APPLICATION				    
				});
				allocateUrl = 'https://' + domain + '/app/accounting/revrec/RevenueArrangementButtonHandler.nl?id=' + revRecRecord.id + '&type=allocate';
								
				https.get({
					url: allocateUrl
                });
                
			});
						
		}		
    	//======Revenue Arrangment Prototyping======
        function getReveueArrangmentData(){
        	//Build a dictinary of all rev rec lines
        	var res = null;
        	var revenueElementsLineCount = revRecRecord.getLineCount({
        	    sublistId: 'revenueelement'
        	});
        	
        	for (var lineNumber = 0; lineNumber < revenueElementsLineCount; lineNumber++) {	
        		var tranIdRaw = revRecRecord.getSublistValue({
            	    sublistId: 'revenueelement',
            	    fieldId: 'referenceid',
            	    line: lineNumber
            	});
        		
        		if (!common.isNullOrEmpty(tranIdRaw)){
        			var tranId = tranIdRaw.substring(tranIdRaw.indexOf('_')+1);
        			if (common.isNullOrEmpty(res)){
            			res = {
            					sourceTranId : tranId,
            					itemIds : [],
            					lines : {},
            					revenueElementIds : [],
            					totalLinesToVerify : 0
            			};
            		};
            		var revLine = new revRecLine(lineNumber);
        			res.lines[lineNumber] = revLine;
        			if (res.itemIds.indexOf(revLine.itemId) == -1) {
						res.itemIds.push(revLine.itemId);
					}
        			res.revenueElementIds.push(revLine.revElementId);
        		}
        		
        	}
        	if (!isNullOrEmpty(res)) {
				//Get Item Categories for items
        		search.create({
        		    type: search.Type.ITEM,
        		    columns: [
						search.createColumn({
						    name: 'custitem_cbr_item_category'
						})
        		    ],
        		    filters: [
        		        ['internalid', 'anyof', res.itemIds]
        		    ]
        		}).run().each(function(result) {
        			var itemId = result.id;
        			var itemCategory = result.getValue({
					    name: 'custitem_cbr_item_category'
					});
        			if (!common.isNullOrEmpty(itemCategory)){
        				for ( var lineNumber in res.lines) {
    						if (res.lines.hasOwnProperty(lineNumber) && res.lines[lineNumber].itemId == itemId) {
    							res.lines[lineNumber].itemCategory = itemCategory;
    							if (supportedCategories.indexOf(itemCategory) > -1) {
    								res.lines[lineNumber].isSupportedCategory = true;
    								res.totalLinesToVerify += 1;
    							}
    						}
    					}
        			};
        			return true;
				});
        		
			}
        	
        	function revRecLine(lineIndex){
        		this.lineNumber = lineIndex;
        		this.itemId = revRecRecord.getSublistValue({
				            	    sublistId: 'revenueelement',
				            	    fieldId: 'item',
				            	    line: lineNumber
				            	});
        		this.quantity = revRecRecord.getSublistValue({
				            	    sublistId: 'revenueelement',
				            	    fieldId: 'quantity',
				            	    line: lineNumber
				            	});
        		this.discountedAmount = revRecRecord.getSublistValue({
					            	    sublistId: 'revenueelement',
					            	    fieldId: 'discountedamount',
					            	    line: lineNumber
					            	});
        		this.customLineId = revRecRecord.getSublistValue({
				            	    sublistId: 'revenueelement',
				            	    fieldId: 'custcol_cbr_custom_line_id',
				            	    line: lineNumber
				            	});
        		this.revElementId = revRecRecord.getSublistValue({
					            	    sublistId: 'revenueelement',
					            	    fieldId: 'revenueelement',
					            	    line: lineNumber
					            	});
        		this.project = revRecRecord.getSublistValue({
				            	    sublistId: 'revenueelement',
				            	    fieldId: 'custcol_cbr_rr_project',
				            	    line: lineNumber
				            	});
        		this.itemCategory = null;
        		this.isSupportedCategory = false;        		
        	};
        	return res;
        };
        
        
        function getSupportedCategories(){
        	var res = [];
        	search.create({
    			type: "customrecord_cbr_item_category",
    		    filters: [
    		              ['isinactive','is','F'],
    		              'AND',
    		              ["custrecord_cbr_do_check_rev_range","is",'T']
    		    ]
    		}).run().each(function(result){
    			res.push(result.id); 
    			return true;
    		}); 
        	return res;
        };
        
        function getNSAllocationsDetails(){
        	var res = {};
        	var nsAllocationsRaw = [];
        	var allocationNames = [];
        	var revenuearrangementSearchObj = search.create({
        		   type: "revenuearrangement",
        		   filters: [
        		      ["type","anyof","RevArrng"], 
        		      "AND", 
        		      ["internalid","anyof",revRecRecord.id],
        		      "AND", 
        		      ["mainline","is","F"], 
        		      "AND", 
        		      ["allocationdetail.discountedsalesamount","isnotempty",""]
        		   ],
        		   columns: [
        		      search.createColumn({
        		         name: "fairvalue",
        		         join: "allocationDetail",
        		         summary: "GROUP"
        		      }),
        		      search.createColumn({
        		         name: "calculatedamount",
        		         join: "allocationDetail",
        		         summary: "GROUP"
        		      }),
        		      search.createColumn({
        		         name: "discountedsalesamount",
        		         join: "allocationDetail",
        		         summary: "GROUP"
        		      }),
        		      search.createColumn({
        		         name: "fairvalueprice",
        		         join: "allocationDetail",
        		         summary: "GROUP"
        		      }),
        		      search.createColumn({
        		          name: "lowvalue",
        		          join: "allocationDetail",
        		          summary: "GROUP"
        		       }),
        		      search.createColumn({
        		         name: "highvalue",
        		         join: "allocationDetail",
        		         summary: "GROUP"
        		      }),
        		      search.createColumn({
        		    	 name: "formulatext",
             	         summary: "GROUP",
             	         formula: "{allocationdetail.revenueelement}"
        		      }),
        		      search.createColumn({
        		         name: "internalid",
        		         summary: "COUNT",
        		         sort: search.Sort.ASC
        		      })
        		   ]
        	}).run().each(function(result){
        		   var allocationDetailLine = new allocationDetail(result);
        		   nsAllocationsRaw.push(allocationDetailLine);
        		   allocationNames.push(allocationDetailLine.revElementText);
        		   return true;
        	});
        	
        	var allocationIdsByName = {};
        	
        	require(['../Common/NCS.Lib.Helpers' ], function(helpers) {
        		allocationIdsByName = helpers.getRecordValuesByNames('revenueelement',allocationNames,null,'recordnumber');
			});
        	for (var allocationIndex = 0; allocationIndex < nsAllocationsRaw.length; allocationIndex++) {
				var allocationDetailLine = nsAllocationsRaw[allocationIndex];
				var revElementText = allocationDetailLine.revElementText;
				var revElementId = allocationIdsByName[revElementText];
				allocationDetailLine.revElementId = revElementId;
				res[revElementId] = allocationDetailLine;
			}
        	return res;
        	
        	function allocationDetail(result){
        		//Revenue element column always return text. Therefore, all the matching will be done by text.
        		//In order to handle a scenario if NetSuite will fix this bug, the retrieval is always textual
        		
        		this.revElementId = '';
        		this.revElementText = result.getValue({
	       			 name: "formulatext",
	    	         summary: "GROUP",
	    	         formula: "{allocationdetail.revenueelement}"
				});
        		this.fairValueRecId = result.getValue({
				    name: 'fairvalueprice',
				    join : 'allocationDetail',
				    summary: "GROUP"
				});
        		
        		this.calculatedValueAmount = result.getValue({
				    name: 'calculatedamount',
				    join : 'allocationDetail',
				    summary: "GROUP"
				});
        		/*
        		this.discountedSalesAmount = result.getValue({
				    name: 'discountedsalesamount',
				    join : 'revenueelement',
				    summary: "GROUP"
				});
        		*/
        		this.baseFairValue = result.getValue({
				    name: 'fairvalue',
				    join : 'allocationDetail',
				    summary: "GROUP"
				});
        		
        		this.lowFairValue = result.getValue({
				    name: 'lowvalue',
				    join : 'allocationDetail',
				    summary: "GROUP"
				});
        		
        		this.highFairValue = result.getValue({
				    name: 'highvalue',
				    join : 'allocationDetail',
				    summary: "GROUP"
				});
        	};
                	
        };
    
        function summarizeItemCategories(){
    		var res = {
    				isUpdateRequired : false,
    				sumCategories : {}
    		};
    		
    		//Initialize Dicionary
    		for (var i = 0; i < supportedCategories.length; i++) {
				var catId = supportedCategories[i];
				res.sumCategories[catId] = {
						isValid : true,
						doUpdate : false,
						totalLines : 0,
						itemCategory : catId,
						totalArrangmentAmount : 0,
						totalLowValue : 0,
						totalHighValue : 0,
						isInRange : null,
						rangeStats : {
							below: 0,
							inside : 0,
							above : 0
						}
				};
				
			}
    		for ( var revRecLineNumber in revRecData.lines) {
				if (revRecData.lines.hasOwnProperty(revRecLineNumber)) {
					var revRecLine = revRecData.lines[revRecLineNumber];
					addItemCategorySummary(revRecLine);
				}
			}
    		
    		for ( var catId in res.sumCategories) {
				if (res.sumCategories.hasOwnProperty(catId)) {
					var sumCategory = res.sumCategories[catId];
					sumCategory.isInRange = (sumCategory.totalArrangmentAmount >= sumCategory.totalLowValue && sumCategory.totalArrangmentAmount <= sumCategory.totalHighValue);
					
					
					/* Deprecated - Update the Arrangment even if one of the categories is invalid
					if (!sumCategory.isValid){ 
						//If one of the categories is not valid, break the process and perform no update
						res.isUpdateRequired = false;
						break;
					}	
					*/				
					if (sumCategory.isValid && sumCategory.totalLines > 1) {
						//Update is required only if the items in the category are mixed, meaning, some out of range and some inside range
						
						var existingRangeStats = 0;
						for (var rangeStat in sumCategory.rangeStats) {
						    if (sumCategory.rangeStats[rangeStat] > 0) {
						    	existingRangeStats += 1;
							}
						};
						if (existingRangeStats > 1) {
							//lines exists in more than 1 range type. Perform Update.
							sumCategory.doUpdate = true;
							res.isUpdateRequired = true;
						};
					}
				}
			}
    		
    		function addItemCategorySummary(revRecLine) {
    			var sumCategory = res.sumCategories[revRecLine.itemCategory];
    			if (revRecLine.isSupportedCategory) {
    				sumCategory.totalLines += 1;
    				var discountAmount = Number(revRecLine.discountedAmount);
    				sumCategory.totalArrangmentAmount += discountAmount;
    				var revElementId = revRecLine.revElementId;
    				
    				if (allocationDetails.hasOwnProperty(revElementId)) {
    					var lowPrice = Number(allocationDetails[revElementId].lowFairValue);
    					var highPrice = Number(allocationDetails[revElementId].highFairValue);
    					sumCategory.totalLowValue += lowPrice;
    					sumCategory.totalHighValue += highPrice;
    					var isInRange = (discountAmount >= lowPrice && discountAmount <= highPrice);
    					if (isInRange) {
    						sumCategory.rangeStats.inside += 1;
						}
    					else {
    						if (discountAmount < lowPrice) {
    							sumCategory.rangeStats.below += 1;
							}
    						else {
    							sumCategory.rangeStats.above += 1;
    						}
    					}
					}
    				else {
    					sumCategory.isValid = false;
    				}
				}
    		}
    		
    		return res;
    	};
    };
    
    createBankJEDeduction = function(rec,scriptContext){
    	var jeTranId = rec.getValue({
			fieldId : 'custbody_cbr_bank_deduction_link'
		});
    	if (!common.isNullOrEmpty(jeTranId)){
			return;
		}
    	//This field has weird behaviour, still resolves to T and F instead of boolen
    	var isUndepfunds = common.nsBoolToBool( 
				    		rec.getValue({
							fieldId : 'undepfunds'
						}));
    	
    	var account = null;
    	if (!isUndepfunds) {
    		account = rec.getValue({
    			fieldId : 'account'
    		});
		}
    	else {    		
    		var gsAccount = search.lookupFields({
    		    type: 'customrecord_ncs_global_settings',
    		    id: 1,
    		    columns: 'custrecord_cbr_def_undep_funds_acc'
    		})['custrecord_cbr_def_undep_funds_acc'];
    		if (common.isArrayAndNotEmpty(gsAccount)) {
    			account = gsAccount[0].value;
			}
    		if (common.isNullOrEmpty(account)){
    			throw error.create({
    				name : 'createBankJEDeduction',
    				message : 'Default undeposited Funds Account is not defined. Please contact support.',
    				notifyOff : true
    			});
    		}
    	}		
    	var reclassTypes = {
    			bankReclass : new reclassType(
    					rec.getValue({
    						fieldId : 'custbody_cbr_bank_charges_amount'
    					}),
    					rec.getValue({
    						fieldId : 'custbody_cbr_bank_charges_account'
    					})
    			),
    			WHTReclass : new reclassType(
    					rec.getValue({
    						fieldId : 'custbody_cbr_withholding_tax_amount'
    					}),
    					rec.getValue({
    						fieldId : 'custbody_crb_withholding_tax_account'
    					})
    			),
    			exRateReclass : new reclassType(
    					rec.getValue({
    						fieldId : 'custbody_cbr_currency_excha_diff'
    					}),
    					rec.getValue({
    						fieldId : 'custbody_cbr_currency_excha_diff_accou'
    					})
    			)
    	};
    	
    	var jeRecord = null;
    	var totalCR = 0;
    	var additionalColumns = null;
    	for ( var reclassTypeName in reclassTypes) {
    		if (reclassTypes.hasOwnProperty(reclassTypeName)) {
    			var reclassType = reclassTypes[reclassTypeName];
    			if (!reclassType.doReclass) {
    				continue;
    			}
    			if (common.isNullOrEmpty(jeRecord)){
    				//Initialize JE record
    				jeRecord = record.create({
    				    type: record.Type.JOURNAL_ENTRY, 
    				    isDynamic: true
    				});
                  	jeRecord.setValue({
        					fieldId : 'approvalstatus',
        					value : '2'
        			});
    				jeRecord.setValue({
    					fieldId : 'subsidiary',
    					value : rec.getValue({
    						fieldId : 'subsidiary'
    					})
    				});
    				jeRecord.setValue({
    					fieldId : 'trandate',
    					value : rec.getValue({
    						fieldId : 'trandate'
    					})
    				});
    				jeRecord.setValue({
    					fieldId : 'currency',
    					value : rec.getValue({
    						fieldId : 'currency'
    					})
    				});    				
    				jeRecord.setValue({
    					fieldId : 'memo',
    					value : 'This JE was generated automatically by bank deduction process(CBR)'
    				});
    				additionalColumns = {
        					'class' :  rec.getValue({
        						fieldId : 'class'
        					}),
        					'department' :  rec.getValue({
        						fieldId : 'department'
        					}),
        					'location' :  rec.getValue({
        						fieldId : 'location'
        					}),
        					'memo' : null
        			};
    				if (scriptContext.type != scriptContext.UserEventType.CREATE) {
    					jeRecord.setValue({
        					fieldId : 'custbody_cbr_bank_deduction_link',
        					value : rec.id
        				});
    					additionalColumns.memo = rec.getValue({
    						fieldId : 'tranid'
    					});
					};
    			};
    			
    			totalCR += Number(reclassType.amount);
    			addSublistLine(true);
    		}
    	}
    	if (!common.isNullOrEmpty(jeRecord)){
			//Add Credit Line
    		addSublistLine(false);    		
    		var jeRecId = jeRecord.save();
    		rec.setValue({
				fieldId : 'custbody_cbr_bank_deduction_link',
				value : jeRecId
			});
		}
    	
    	function reclassType(amount,account){
			this.amount = null;
			this.account = null;
			this.doReclass = false;
			if (!common.isNullOrEmpty(amount) && Number(amount) > 0 && !common.isNullOrEmpty(account)) {
				this.doReclass = true;
				this.amount = amount;
				this.account = account;
			}
    	}
    	
    	function addSublistLine(isDebit,tranNumber){    		
    		jeRecord.selectNewLine({
    		    sublistId: 'line'
    		});
    		jeRecord.setCurrentSublistValue({
    			sublistId: 'line',
    			fieldId: 'account',
    			value: (isDebit? Number(reclassType.account): account),
    		});
    		jeRecord.setCurrentSublistValue({
    			sublistId: 'line',
    			fieldId: (isDebit? 'debit' : 'credit'),
    			value: (isDebit? Number(reclassType.amount): totalCR),
    		});
    		for ( var fldId in additionalColumns) {
				if (additionalColumns.hasOwnProperty(fldId)) {
					if (!common.isNullOrEmpty(additionalColumns[fldId])){
						jeRecord.setCurrentSublistValue({
			    			sublistId: 'line',
			    			fieldId: fldId,
			    			value: additionalColumns[fldId]
			    		}); 
					}
				}
			}
    		jeRecord.commitLine({
    		    sublistId: 'line'
    		});
    	};
    };
    
    //=================PO REQUISITION TOLERANCE=========================
    poGetReqData = function(rec,type){
    	var res = {
    			doValidate : false,
    			reqId : null,
    			subsidiaryId : null,
    			exRate : null,
    			baseCurrency : null,
    			tolAmount : null,
    			tolPercent : null,
    			lines : {}
    	};
    	res.subsidiaryId = rec.getValue({
			fieldId : 'subsidiary'
		});
    	res.exRate = rec.getValue({
			fieldId : 'exchangerate'
		});
    	
    	var itemsLineCount = rec.getLineCount({
    	    sublistId: 'item'
    	});
    	for (var lineNumber = 0; lineNumber < itemsLineCount; lineNumber++) {
    		if (type == 'edit') {
    			var reqIdRaw = rec.getSublistValue({
    	    	    sublistId: 'item',
    	    	    fieldId: 'linkedorder'/*'orderdoc'*/,
    	    	    line: lineNumber
    	    	});
    			if (!common.isNullOrEmpty(reqIdRaw)&& reqIdRaw.length > 0){
    				res.reqId = reqIdRaw[0];
				}
			}
    		else {
    			res.reqId = rec.getSublistValue({
    	    	    sublistId: 'item',
    	    	    fieldId: 'orderdoc',
    	    	    line: lineNumber
    	    	});
    		}
    		if (!common.isNullOrEmpty(res.reqId)){
    			res.doValidate = true;
    			break;
    		};
    	}
    	if (res.doValidate) {
    		var subsidiaryData = search.lookupFields({
			    type: 'subsidiary',
			    id: res.subsidiaryId,
			    columns: ['custrecord_cbr_po_req_tol_precent','custrecord_cbr_po_req_tol_amount','currency']
			});
    		res.tolPercent = subsidiaryData['custrecord_cbr_po_req_tol_precent'];
    		res.tolAmount = subsidiaryData['custrecord_cbr_po_req_tol_amount'];
    		res.baseCurrency = subsidiaryData['currency'][0].text;
    		if (common.isNullOrEmpty(res.tolAmount) && common.isNullOrEmpty(res.tolPercent)) {
    			res.doValidate = false;
			}
    		else {
    			if (!common.isNullOrEmpty(res.tolAmount)){
    				res.tolAmount = parseFloat(res.tolAmount);
    			};
    			if (!common.isNullOrEmpty(res.tolPercent)){
    				res.tolPercent = parseFloat(res.tolPercent);
    			}
    			search.create({
 				   type: "purchaserequisition",
 				   filters: [
 				      ["type","anyof","PurchReq"], 
 				      "AND", 
 				      ["internalid","anyof",res.reqId], 
 				      "AND", 
 				      ["mainline","is","F"]
 				   ],
 				   columns: [
 				      "estimatedamount",
 				      "custcol_cbr_custom_line_id"
 				   ]
 				}).run().each(function(resLine){
 					var line = resLine.getValue('custcol_cbr_custom_line_id');
 					var estimatedAmount = Number(resLine.getValue('estimatedamount'));						
 					res.lines[line] = estimatedAmount;
 					return true;
 				});
    		}
		}
    	return res;
    };
    
    validatePO_tolerance = function(rec,type){ 
		var poTolData =  poGetReqData(rec,type);		  
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
    			//Throw JS error so that only the text will appear in the UI
    			throw "The discrepancy of the following lines is higher than the allowed tolerance : " + invalidLines.join(', ');
    			/*
    			throw error.create({
    				name : 'validatePO_Req_Tolerance',
    				message : "the discrepancy of the following lines is bigger than the allowed tolerance : " + invalidLines.join(','),
    				notifyOff : true
    			}); 
    			*/       			
			}
		};
    };
    
    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
