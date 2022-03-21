var currentContext = nlapiGetContext();


function travelRec_toPO_scheduled(type) {

	var dstart = new Date();
	
	var recsFromParams = currentContext.getSetting('SCRIPT', 'custscript_jfrog_travelrecs_toprocess');
	var paramAttach = currentContext.getSetting('SCRIPT', 'custscript_jfrog_attachment');
	paramAttach = paramAttach.split('.');
	var amsalemAttach = paramAttach[0];
	
	nlapiLogExecution('debug', 'amsalemAttach', amsalemAttach)
	var recs = JSON.parse(recsFromParams);	
	var allCurrencies = getAllCurrencies();
	
	var domainURL = 'https://4511400-sb1.app.netsuite.com';
	if(currentContext.getEnvironment()=='PRODUCTION'){
		domainURL = 'https://system.eu2.netsuite.com';
	}   
	
	
	if (recs.length > 0) {
		
			

		var travelRecs = getTravelRecords(recs)
		
		var recsGrouped = groupBy(travelRecs, function(item){
				return [item.subsid, item.budgetOwner, item.traveler, item.currency, item.podate]});
		
		nlapiLogExecution('debug', 'recsGrouped', JSON.stringify(recsGrouped))
		
		
		//recsGrouped.forEach(function(group) {
			for( var t = 0; t<recsGrouped.length; t++) {
				
				try{
				var travPOstoUpdate = [];
				var ogTravelRecsToUpdate = [];
				
				var currentGroup = recsGrouped[t];
				
			    var dnow = new Date();
			    var timeexe = (dnow - dstart) / 1000 / 3600;
			    if (currentContext.getRemainingUsage() < 800 || timeexe >= 0.2) {
			        var state = nlapiYieldScript();
			        if (state.status == 'FAILURE') {
			            nlapiLogExecution('ERROR', 'Error', ' Failed to yield script _jfrog_travel_po_scheduled');
			        }
			        else if (state.status == 'RESUME') {
			            nlapiLogExecution("AUDIT", '_jfrog_travel_po_scheduled', "Resuming script due to: " + state.reason + ",  " + state.size);
			        }
			    }


			nlapiLogExecution('debug', 'currentGroup', currentGroup.length)
			nlapiLogExecution('debug', 'currentGroup', JSON.stringify(currentGroup))

			
			if(currentGroup.length != 1) {
				
				
				nlapiLogExecution('debug', 'more than one line', 'more than one line')
				nlapiLogExecution('debug', 'currentGroup', JSON.stringify(currentGroup))
				
				var newPOMulti = nlapiCreateRecord('purchaseorder');
				
				newPOMulti.setFieldValue('entity',currentGroup[0].vendor);
				newPOMulti.setFieldValue('subsidiary', currentGroup[0].subsid);
				newPOMulti.setFieldValue('memo',currentGroup[0].traveler_text != '' ? currentGroup[0].traveler_text : 'N/A'  +' | ' + currentGroup[0].vendor_text);
				newPOMulti.setFieldValue('employee',currentGroup[0].budgetOwner);
				newPOMulti.setFieldValue('custbody5',currentGroup[0].budgetOwner); //Buyer
				newPOMulti.setFieldValue('trandate',currentGroup[0].podate); 
				newPOMulti.setFieldValue('currency',getCurrency(currentGroup[0].currency, allCurrencies)); 
				//newPOMulti.setFieldValue('custbody10','28'); //Keren Sivia for LTD //PO Creator //This fields default is Current User
				
				var exp_dep = getExpenseItemAndDepartment(currentGroup[0].budgetClass, currentGroup[0].budgetOwner, currentGroup[0].subsid)
				nlapiLogExecution('debug', 'exp_dep', JSON.stringify(exp_dep, null, 2))
				
				

				for(var x = 0; x<currentGroup.length; x++) {

					
				newPOMulti.selectNewLineItem('item');
				
				newPOMulti.setCurrentLineItemValue('item', 'item', exp_dep[0].expenseItem);
				newPOMulti.setCurrentLineItemValue('item', 'quantity', 1);
				newPOMulti.setCurrentLineItemValue('item', 'description', currentGroup[x].memo);
				newPOMulti.setCurrentLineItemValue('item', 'rate', currentGroup[x].amount);
				newPOMulti.setCurrentLineItemValue('item', 'custcol_cseg3', currentGroup[0].budgetClass);
				newPOMulti.setCurrentLineItemValue('item', 'department', exp_dep[0].department);
				newPOMulti.setCurrentLineItemValue('item', 'custcol_jfrog_travel_po_link_col', nlapiResolveURL('RECORD', 'customrecord_jfrog_travel_po', currentGroup[x].internalid));
	            newPOMulti.commitLineItem('item');
	            
	            travPOstoUpdate.push(currentGroup[x].internalid)
	            ogTravelRecsToUpdate.push(currentGroup[x].travelNumber)
				
			}
				
				var attachments = getPOAttachments(travPOstoUpdate)
				
	            var POCreated = nlapiSubmitRecord(newPOMulti);
	            
	            nlapiLogExecution('debug', 'POCreated', POCreated)
	            nlapiLogExecution('debug', 'travPOstoUpdate', JSON.stringify(travPOstoUpdate))
	            
	            	if(attachments[0].fileID != '') {
		            	for(var x = 0; x<attachments.length; x++) {
		            		nlapiAttachRecord('file', attachments[x].fileID, 'purchaseorder', POCreated, null)
		            	}
		            	
		            }
	            nlapiAttachRecord('file', amsalemAttach, 'purchaseorder', POCreated, null)
	        
	            for(var n = 0; n<travPOstoUpdate.length; n++) {
	            	
	            	nlapiSubmitField('customrecord_jfrog_travel_po', travPOstoUpdate[n], 'custrecord_jfrog_travel_related_po', POCreated)
	            }
	            for(var m = 0; m<ogTravelRecsToUpdate.length; m++) {
	            	
	            	nlapiSubmitField('customrecord_ilo_travel_record', ogTravelRecsToUpdate[m], 'custrecord_ilo_travel_createdpo', POCreated)
	            }
	            
			}

			if(currentGroup.length === 1){
				
					
				nlapiLogExecution('debug', 'SINGLE PO', 'SINGLE PO')
				nlapiLogExecution('debug', 'SINGLE PO - currentGroup', JSON.stringify(currentGroup, null, 2))
				
				for( var i = 0; i<currentGroup.length; i++) {
					
					var POTRavelRecID =  currentGroup[i].internalid
					var OGTravelRecID =  currentGroup[i].travelNumber

					var attachments = getPOAttachments(POTRavelRecID)
									
					var newPO = nlapiCreateRecord('purchaseorder');
					
					newPO.setFieldValue('entity',currentGroup[i].vendor);
					newPO.setFieldValue('subsidiary', currentGroup[i].subsid);
					newPO.setFieldValue('memo',currentGroup[i].memo);
					newPO.setFieldValue('employee',currentGroup[i].budgetOwner);
					newPO.setFieldValue('custbody5',currentGroup[i].budgetOwner); //Buyer
					newPO.setFieldValue('trandate',currentGroup[i].podate); 
					newPO.setFieldValue('currency',getCurrency(currentGroup[i].currency, allCurrencies)); 
					//newPO.setFieldValue('custbody10','28'); //Keren Sivia for LTD //PO Creator //This fields default is Current User
					
					var exp_dep = getExpenseItemAndDepartment(currentGroup[i].budgetClass, currentGroup[i].budgetOwner, currentGroup[i].subsid)
					nlapiLogExecution('debug', 'exp_dep', JSON.stringify(exp_dep, null, 2))
					
					
					newPO.selectNewLineItem('item');
					
					newPO.setCurrentLineItemValue('item', 'item', exp_dep[0].expenseItem);
					newPO.setCurrentLineItemValue('item', 'quantity', 1);
					newPO.setCurrentLineItemValue('item', 'description', currentGroup[i].memo);
					newPO.setCurrentLineItemValue('item', 'rate', currentGroup[i].amount);
					newPO.setCurrentLineItemValue('item', 'custcol_cseg3', currentGroup[i].budgetClass);
					newPO.setCurrentLineItemValue('item', 'department', exp_dep[0].department);
					newPO.setCurrentLineItemValue('item', 'custcol_jfrog_travel_po_link_col', nlapiResolveURL('RECORD', 'customrecord_jfrog_travel_po', currentGroup[i].internalid));
			
		            newPO.commitLineItem('item');
		   


		                var SinglePOCreated = nlapiSubmitRecord(newPO);
			            nlapiLogExecution('debug', 'POCreated', SinglePOCreated)
			            
			            		            if(attachments[0].fileID != '') {
		            	for(var x = 0; x<attachments.length; x++) {
		            		nlapiAttachRecord('file', attachments[x].fileID, 'purchaseorder', SinglePOCreated, null)
		            	}
		            	
		            }
			            nlapiAttachRecord('file', amsalemAttach, 'purchaseorder', SinglePOCreated, null)
		            	
		            	nlapiSubmitField('customrecord_jfrog_travel_po', POTRavelRecID, 'custrecord_jfrog_travel_related_po', SinglePOCreated);
						nlapiSubmitField('customrecord_ilo_travel_record', OGTravelRecID, 'custrecord_ilo_travel_createdpo', SinglePOCreated);


				}
			
			}
			}catch(err) {
				nlapiLogExecution('debug', 'err', err)
			}
			};
		
		
	}else{
		nlapiLogExecution('debug', 'nothing to search!', 'nothing to search!')
	}


}



function getTravelRecords(recs) {
	
	try{
		
    var filters = new Array();
		 filters.push(new nlobjSearchFilter('internalid', null, 'anyof', recs));	

      var columns = new Array();
      columns[0] = new nlobjSearchColumn( 'internalid' );
      columns[1] = new nlobjSearchColumn( 'custrecord_jfrog_travel_number' )
      columns[2] = new nlobjSearchColumn( 'custrecord_jfrog_travel_budget_owner' );
      columns[3] = new nlobjSearchColumn( 'custrecord_jfrog_travel_budget_class' );
      columns[4] = new nlobjSearchColumn( 'custrecord_jfrog_travel_subsidiary' );
      columns[5] = new nlobjSearchColumn( 'custrecord_jfrog_travel_vendor' );
	  columns[6] = new nlobjSearchColumn( 'custrecord_jfrog_travel_traveler' );
	  columns[7] = new nlobjSearchColumn( 'custrecord_jfrog_travel_amount' );
	  columns[8] = new nlobjSearchColumn( 'custrecord_jfrog_travel_podate' );  
	  columns[9] = new nlobjSearchColumn( 'custrecord_jfrog_travel_currency' );
	  columns[10] = new nlobjSearchColumn( 'custrecord_ilo_travel_purpose', 'custrecord_jfrog_travel_number' );

      var savedSearch = nlapiCreateSearch('customrecord_jfrog_travel_po', filters, columns)
      
    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
	var results = [];
	var cols = savedSearch.getColumns();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for ( var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

	if(returnSearchResults != null) {
	returnSearchResults.forEach(function(element) {


			results.push({

				internalid : element.getValue('internalid'),
				travelNumber : element.getValue('custrecord_jfrog_travel_number'),
				travelNumber_text : element.getText('custrecord_jfrog_travel_number'),
				budgetOwner : element.getValue('custrecord_jfrog_travel_budget_owner'),
				budgetOwner_text : element.getText('custrecord_jfrog_travel_budget_owner'),
				budgetClass : element.getValue('custrecord_jfrog_travel_budget_class'),
				budgetClass_text : element.getText('custrecord_jfrog_travel_budget_class'),
				subsid : element.getValue('custrecord_jfrog_travel_subsidiary'),
				subsid_text : element.getText('custrecord_jfrog_travel_subsidiary'),
				vendor : element.getValue('custrecord_jfrog_travel_vendor'),
				vendor_text : element.getText('custrecord_jfrog_travel_vendor'),
				traveler : element.getValue('custrecord_jfrog_travel_traveler'),
				traveler_text : element.getText('custrecord_jfrog_travel_traveler'),
				amount : element.getValue('custrecord_jfrog_travel_amount'),
				podate : element.getValue('custrecord_jfrog_travel_podate'),
				currency : element.getValue('custrecord_jfrog_travel_currency'),
				memo : element.getValue('custrecord_ilo_travel_purpose', 'custrecord_jfrog_travel_number'),
				
					
		});	

  
		  
		});

	}
	

	return results;
	}
	catch(err) {
		nlapiLogExecution('error', 'err', err)
		return results;
	}
	
}

function getAllCurrencies() {	

	var sysExRates = [];
	    var columns = new Array();
		    columns[0] = new nlobjSearchColumn('symbol', null, null);
		    columns[1] = new nlobjSearchColumn('internalid', null, null);
		    var search = nlapiSearchRecord('currency', null, null, columns);
		    for(var i=0; i<search.length; i++) {
		    	sysExRates.push({
		    		symbol : search[i].getValue(columns[0]),
		    		internalid : search[i].getValue(columns[1])
		    		
		    	});
		    }
			return sysExRates;
			}

function getCurrency(symbol, allCurrencies) {
	
	var idToReturn = ''
	
	for(var x = 0; x<allCurrencies.length; x++) {
		
		if(allCurrencies[x].symbol == symbol) {
			idToReturn = allCurrencies[x].internalid
		}
		
		
	}
	return idToReturn
}

function getExpenseItemAndDepartment(budgetClass, budgetOwner, budgetSubid) {
	
	var results=[];
	
	var currentYear = new Date().getFullYear().toString()


	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_ilo_expense_item_id', null, 'doesnotstartwith', "");
	filters[1] = new nlobjSearchFilter('custrecord_ilo_budget_class', null,'anyof', budgetClass);
	filters[2] = new nlobjSearchFilter('custrecord_ilo_budget_owner', null,'anyof', budgetOwner);
	filters[3] = new nlobjSearchFilter('custrecord_ilo_budget_subsidiary', null,'anyof', budgetSubid);
	filters[4] = new nlobjSearchFilter('custrecord_ilo_budget_type', null,'anyof', ['1']);
	filters[5] =new nlobjSearchFilter('custrecord_ilo_budget_year', null,'is',currentYear);
	
	var cols = new Array();
	cols[0] = new nlobjSearchColumn('custrecord_ilo_budget_department');
    cols[1] = new nlobjSearchColumn('custrecord_ilo_expense_item_id');
  var savedSearch = nlapiCreateSearch('customrecord_ilo_budget_control_record', filters, cols)
  
var resultset = savedSearch.runSearch();
var returnSearchResults = [];
var searchid = 0;
var results = [];
var cols = savedSearch.getColumns();
do {
    var resultslice = resultset.getResults(searchid, searchid + 1000);
    for ( var rs in resultslice) {
        returnSearchResults.push(resultslice[rs]);
        searchid++;
    }
} while (resultslice.length >= 1000);

if(returnSearchResults != null) {
returnSearchResults.forEach(function(element) {


		results.push({

			expenseItem : element.getValue('custrecord_ilo_expense_item_id'),
			department : element.getValue('custrecord_ilo_budget_department'),

	});	

	});

};
return results

}

function groupBy( array , f )
{
  var groups = {};
  array.forEach( function( o )
  {
    var group = JSON.stringify( f(o) );
    groups[group] = groups[group] || [];
    groups[group].push( o );  
  });
  return Object.keys(groups).map( function( group )
  {
    return groups[group]; 
  })
}

function getPOAttachments(poTravelRecID) {

	var results = [];
	var toReturn = [];


	var columns = new Array();

	columns[0] = new nlobjSearchColumn( 'name', 'file' );
	columns[1] = new nlobjSearchColumn( 'internalid', 'file' );
	columns[2] = new nlobjSearchColumn( 'url', 'file' );
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyof', poTravelRecID)

	
	
	var search = nlapiCreateSearch( 'customrecord_jfrog_travel_po', filters, columns );
	var resultset = search.runSearch();
	results = resultset.getResults(0, 1000);


	if(results != []) {
	results.forEach(function(line) {
		
	toReturn.push({
	fileName: line.getValue('name', 'file'),
	fileID: line.getValue('internalid', 'file'),
	fileURL : line.getValue('url', 'file')
	})

	
	});
	}

	return toReturn;
	}