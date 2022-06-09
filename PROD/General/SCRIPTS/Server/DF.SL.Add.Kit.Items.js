/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/log','N/record','N/search','N/url','N/error','N/ui/serverWidget','N/runtime','../Common/BE.Lib.Common.js'],

function(logger,record,search,url,error,serverWidget,runtime,common) {
   
    function onRequest(context) {
		if( context.request.method == "GET"){
			var actionType = context.request.parameters.actionType
			if(actionType == 'openAddKitItemsPopUp'){
				var sessionObj = runtime.getCurrentSession();
				sessionObj.set({
				    name: "memberItems", 
				    value: null
				});
	            var params = {
	            		poId : context.request.parameters.poId
	            }
	            try {
	            	var form = build_form(params, context);
	            	context.response.writePage(form);
	            } catch(err) {
	            	context.response.write(err.message);
	            }
	        }
		} else {
			var actionType = context.request.parameters.custpage_action_type;
			if (actionType == 'openAddKitItemsPopUp') {
				var lineCount = context.request.getLineCount({ group: 'custpage_kit_items_list' });
				var itemIds = [];
				for (var i = 0; i < lineCount; i++) {
					var memberItems = context.request.getSublistValue({
					    group: 'custpage_kit_items_list',
					    name: 'cutpage_member_items',
					    line: i
					});
					var isChecked = common.toBoolean(context.request.getSublistValue({
					    group: 'custpage_kit_items_list',
					    name: 'cutpage_line_checked',
					    line: i
					}));
					
					if (isChecked) {
						memberItems = JSON.parse(memberItems)
						var numOfKits = context.request.getSublistValue({
							group: 'custpage_kit_items_list',
							name: 'cutpage_quantity',
							line: i
						});
						if(!common.isNullOrEmpty(numOfKits) && numOfKits > 1) {
							memberItems.forEach(function(item) {
								item.qty = item.qty * numOfKits
								return item
							});
						};
						itemIds = itemIds.concat(memberItems) // TODO JSON.parse (?)
					};
				};
				var sessionObj = runtime.getCurrentSession();
				sessionObj.set({
				    name: "memberItems", 
				    value: JSON.stringify(itemIds)
				});
				logger.debug({ title: 'itemIds', details: JSON.stringify(itemIds) })
				var form = serverWidget.createForm({title: '  ', hideNavBar : true});
				field = form.addField({
		    	    id : 'custpage_closepage',
		    	    type : serverWidget.FieldType.INLINEHTML,
		    	    label : 'close'
		    	});
				var closeFld_script = 
					'<script>' +
					 	'window.close()' +
					'</script>';
				form.updateDefaultValues({
					custpage_closepage : closeFld_script					
		    	});
				context.response.writePage(form);
			}
		}

    }
    
    function build_form(params, context) {
    	
		var form = serverWidget.createForm({title: 'Add Kit Items to ' + context.request.parameters.poName , hideNavBar : true});
		form.addSubmitButton({
		    label : 'Add Selected Kit Items'
		});
		form.addButton({
		    id : 'custpage_cancel',
		    label : 'Cancel',
		    functionName : 'window.close()'
		});
		form.addField({
    	    id : 'custpage_action_type',
    	    type : serverWidget.FieldType.TEXT,
    	    label : ' ',
    	}).updateDisplayType({
    	    displayType : serverWidget.FieldDisplayType.HIDDEN
    	});
    	
		form.updateDefaultValues({
			custpage_action_type : 'openAddKitItemsPopUp'
		});
		
		buildSublist(form,params);
		return form;
		
    }
    
    function buildSublist(form, params) {
    	
		var sublist = form.addSublist({
    	    id : 'custpage_kit_items_list',
    	    type : serverWidget.SublistType.LIST,
    	    label : 'Kit Items'
    	});
    	
		sublist.addMarkAllButtons();
		sublist.addField({
    	    id : 'cutpage_line_checked',
    	    type : serverWidget.FieldType.CHECKBOX,
    	    label : 'Add'
    	}).updateDisplayType({
    	    displayType : serverWidget.FieldDisplayType.ENTRY
    	});
		sublist.addField({
    	    id : 'cutpage_item',
    	    type : serverWidget.FieldType.TEXT,
    	    label : 'Item'
    	});
		sublist.addField({
    	    id : 'cutpage_member_items',
    	    type : serverWidget.FieldType.TEXTAREA,
    	    label : 'Item Id'
    	}).updateDisplayType({
    	    displayType : serverWidget.FieldDisplayType.HIDDEN
    	});	
		sublist.addField({
    	    id : 'cutpage_item_discription',
    	    type : serverWidget.FieldType.TEXT,
    	    label : 'Item Description'
    	});
		sublist.addField({
    	    id : 'cutpage_quantity',
    	    type : serverWidget.FieldType.TEXT,
    	    label : 'Quantity'
    	}).updateDisplayType({
    	    displayType : serverWidget.FieldDisplayType.ENTRY
    	});
		
		var sublistData = getKitItems();
		var line = 0;
		
		for (var itemName in sublistData) {
			if(sublistData.hasOwnProperty(itemName)) {
				
				var kitItem = sublistData[itemName]
								
				sublist.setSublistValue({
					id : 'cutpage_member_items',
					line : line,
					value : JSON.stringify(kitItem.memberItems)
				});
				sublist.setSublistValue({
					id : 'cutpage_item',
					line : line,
					value : itemName				
				});
				if(!common.isNullOrEmpty(kitItem.desc)) {
					sublist.setSublistValue({
						id : 'cutpage_item_discription',
						line : line,
						value : kitItem.desc				
					});						
				}
				
				line++			
				
			}
		}					

    }
    
    function getKitItems() {
    	
    	var kitItemsData = {};
    	
    	search.create({
    		   type: "kititem",
    		   filters: [ ["type","anyof","Kit"] ],
    		   columns: [ 
    		              "itemid", 
    		              "salesdescription", 
    		              "memberitem",
    		              "memberquantity",
    		              search.createColumn({
    		                 name: "averagecost",
    		                 join: "memberItem"
    		              })
    		            ]
    	}).run().each(function(result){
    		var item = result.getValue({ name: 'itemid' })
    		
    		if(!kitItemsData.hasOwnProperty(item)) {
    			kitItemsData[item] = {
    					itemId: null,
    					desc: null,
    					memberItems: []
    			}
    		}
    		
    		kitItemsData[item].itemId = result.id;
    		kitItemsData[item].desc = result.getValue({ name: 'salesdescription' });
    		kitItemsData[item].memberItems.push({
    			item: result.getValue({ name: 'memberitem' }),
    			qty: result.getValue({ name: 'memberquantity' }),
    			rate: common.zeroIfNullOrEmpty(result.getValue({ name: 'averagecost', join: "memberItem" })),
    			memberOf: result.id
    		});

    		return true;
    	});
    	
    	return kitItemsData;
    }

    return {
        onRequest: onRequest
    };
    
});
