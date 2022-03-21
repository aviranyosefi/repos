/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Feb 2019     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function travelRec_toPO(request, response){
	
	
	
	
	 if ( request.getMethod() == 'GET' )  {
			
		 var form = nlapiCreateForm('Travel Record to Purchase Order');
		
		 var searchGroup = form.addFieldGroup( 'custpage_search_group', 'Search');

		 var selectSubsid = form.addField('custpage_select_subsid','select', 'Subsidiary', 'SUBSIDIARY','custpage_search_group');
		 selectSubsid.setLayoutType('normal','startcol')
		 
		 var selectTraveler = form.addField('custpage_select_traveler','select', 'Traveler', 'EMPLOYEE','custpage_search_group');

		 var selectBudgetOwner = form.addField('custpage_select_owner','select', 'Budget Owner', 'EMPLOYEE','custpage_search_group');

		 var attachmentFile = form.addField('file', 'file', 'Select Attachment', null, null);
		 attachmentFile.setMandatory(true);
		 
		 var toNextPage = form.addField('custpage_tonextpage', 'text', 'Next Page', null,'custpage_search_group');
		 toNextPage.setDisplayType('hidden');
		 toNextPage.setDefaultValue('next');
		 form.addSubmitButton('Continue');
		 response.writePage( form );
		 }
	 
	 else if (request.getParameter('custpage_tonextpage') == 'next') {
		 

		 var subsidSelected = request.getParameter('custpage_select_subsid')
		 var travelerSelected = request.getParameter('custpage_select_traveler')
		 var ownerSelected = request.getParameter('custpage_select_owner')
		 
		 
		 var folderID = findFolder()
		 var attachmentSelected = request.getFile('file');
		 attachmentSelected.setEncoding('UTF-8');
		 attachmentSelected.setFolder(folderID)
		 attachmentSelected.setIsOnline(true)
		 var FileID = nlapiSubmitFile(attachmentSelected)
			
		 nlapiLogExecution('debug', 'attachmentSelected', FileID)
		 
		 var resForm = nlapiCreateForm('Travel Record to Purchase Order');
		 resForm.addSubmitButton('Submit');
		 
		  var htmlHeader = resForm.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
		  var totalArr = [];
		
		 
		 
		 var travelRecs = getTravelRecords(subsidSelected,travelerSelected,ownerSelected)
		 
		 var travelRecGroup = resForm.addFieldGroup( 'custpage_travelrec_group', ' ');

		 var travelRecLength = travelRecs.length
		 
		 var subList = resForm.addSubList('custpage_res_sublist', 'list', 'Count : ' + travelRecLength, 'custpage_travelrec_group');
		 subList.addMarkAllButtons()
		 
		 var internalIDColumn =  subList.addField('custpage_res_internalid', 'text', 'Internal ID');
		 internalIDColumn.setDisplayType('hidden');
		 subList.addField('custpage_res_process', 'checkbox', 'Process')
		 subList.addField('custpage_res_travelnumber', 'text', 'Travel Number');
		 subList.addField('custpage_res_traveler', 'text', 'Traveler');
		 subList.addField('custpage_res_subsid', 'text', 'Subsidiary');
		 subList.addField('custpage_res_budgetclass', 'text', 'Budget Classification');
		 subList.addField('custpage_res_budgetowner', 'text', 'Budget Owner');
		 subList.addField('custpage_res_vendor', 'text', 'Vendor');	
		 subList.addField('custpage_res_amount', 'currency', 'Amount');
		 subList.addField('custpage_res_currency', 'text', 'Currency');	
		 subList.addField('custpage_res_podate', 'text', 'PO Date');
		 subList.addField('custpage_res_memo', 'text', 'Header Memo');
		 subList.addField('custpage_res_attachments', 'textarea', 'Attachments');
	

		 if(travelRecs != [] || travelRecs != null) {
			 nlapiLogExecution('debug', 'travelRecs', JSON.stringify(travelRecs, null ,2))
			 for(var i = 0; i<travelRecs.length; i++) {
				 
				 var getAttachments = getPOAttachments(travelRecs[i].internalid);

				 	 subList.setLineItemValue('custpage_res_process', i+1, 'T');	
				 	 subList.setLineItemValue('custpage_res_internalid', i+1, travelRecs[i].internalid);
					 subList.setLineItemValue('custpage_res_travelnumber', i+1, travelRecs[i].travelNumber_text);
					 subList.setLineItemValue('custpage_res_traveler', i+1, travelRecs[i].traveler_text);
					 subList.setLineItemValue('custpage_res_subsid', i+1, travelRecs[i].subsid_text);
				 	 subList.setLineItemValue('custpage_res_budgetclass', i+1, travelRecs[i].budgetClass_text);
                     subList.setLineItemValue('custpage_res_budgetowner', i+1, travelRecs[i].budgetOwner_text);
                     subList.setLineItemValue('custpage_res_vendor', i+1, travelRecs[i].vendor_text);
                     subList.setLineItemValue('custpage_res_amount', i+1, travelRecs[i].amount);
                     subList.setLineItemValue('custpage_res_currency', i+1, travelRecs[i].currency);
                     subList.setLineItemValue('custpage_res_podate', i+1, travelRecs[i].podate);
                     subList.setLineItemValue('custpage_res_memo', i+1, travelRecs[i].memo);
                     
                     if(getAttachments[0].fileID != '') {
                    	 
                    	 var attachmentStr = ''
                    	 
                    	 for(var x = 0; x<getAttachments.length; x++) {
                    		 
                    		 attachmentStr += getAttachments[x].fileName +'\n' 
                    	 }
                    	 subList.setLineItemValue('custpage_res_attachments', i+1, attachmentStr);
                     }
                    

                     
                     totalArr.push(travelRecs[i].amount)

			 } 
		 }
		 
		 //set total field
		 var total = totalArr.reduce(add, 0).toFixed(2);
		 htmlHeader.setDefaultValue("<p style='font-size:20px'>Total Amount : "+total+"</p>");
		 
		 
		 var attachmentHiddenField = resForm.addField('custpage_attachment', 'text', 'Last Page', null,'custpage_search_group');
		 attachmentHiddenField.setDisplayType('hidden');
		 attachmentHiddenField.setDefaultValue(FileID);
		 
		 var toLastPage = resForm.addField('custpage_tolastpage', 'text', 'Last Page', null,'custpage_search_group');
		 toLastPage.setDisplayType('hidden');
		 toLastPage.setDefaultValue('last');

		 
		 response.writePage(resForm)
	 }
	 
	 else if (request.getParameter('custpage_tolastpage') == 'last') {
		 
		 var lineCount = request.getLineItemCount('custpage_res_sublist');
		 var selectedTravelRecs = [];
		 
		 for(var i = 0; i<lineCount; i++) {
			 
			 var selected = request.getLineItemValue('custpage_res_sublist','custpage_res_process',i+1);
			 if (selected == 'T') {

				 selectedTravelRecs.push(request.getLineItemValue('custpage_res_sublist','custpage_res_internalid',i+1))
			 }		 
		 }		 		 
		 var resCreatePOform = nlapiCreateForm('Processing - Travel Record to Purchase Order');
			 
			var today = new Date();
			var todayStr = nlapiDateToString(today);	
			
		  var htmlHeader = resCreatePOform.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
		  htmlHeader.setDefaultValue("<p style='font-size:20px'>The selected Travel Records are currently being transformed to Purchase Orders.</p><br><br>Please click <a href='https://system.eu2.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&datefrom="+todayStr+"&dateto="+todayStr+"&scripttype=584&primarykey=7179'>here</a> in order to be redirected to the status page.");
		 		 
		
		  var getAttachment = request.getParameter('custpage_attachment')
		 
		 
		 nlapiLogExecution('debug', 'params sent', selectedTravelRecs)
		 var params = {custscript_jfrog_travelrecs_toprocess: JSON.stringify(selectedTravelRecs),
			 			custscript_jfrog_attachment : getAttachment};
		 
		 nlapiScheduleScript('customscript_jfrog_travel_po_scheduled', 'customdeploy_jfrog_travel_po_scheduled', params);
       
        response.writePage(resCreatePOform)
	 }

}


function getTravelRecords(subsidSelected,travelerSelected,ownerSelected) {

    var filters = new Array();
    
    filters[0] = new nlobjSearchFilter('custrecord_jfrog_travel_related_po', null, 'anyof', ["@NONE@"])  
	
	if(travelerSelected != '' ) {
		
		 filters.push(new nlobjSearchFilter('custrecord_jfrog_travel_traveler', null, 'anyof', travelerSelected));	
	}	
	if(subsidSelected != '' ) {
		
		 filters.push(new nlobjSearchFilter('custrecord_jfrog_travel_subsidiary', null, 'anyof', subsidSelected));	
	}
	if(ownerSelected != '' ) {
		
		filters.push(new nlobjSearchFilter('custrecord_jfrog_travel_budget_owner', null, 'anyof', ownerSelected));	
	}
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
				memo : element.getValue('custrecord_ilo_travel_purpose', 'custrecord_jfrog_travel_number'),
				currency : element.getValue('custrecord_jfrog_travel_currency'),
				
					
		});	

  
		  
		});

	}
	

	return results;
	
}

function add(a, b) {
    return parseFloat(a) + parseFloat(b);
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

function findFolder() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('internalid');
	
	var fils = new Array();
	fils[0] = new nlobjSearchFilter('name', null, 'is', 'Amsalem Attachments')		

	var s = nlapiSearchRecord('folder', null, fils, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {

			resultsArr.push({
				folder_name : s[i].getValue('name'),
				folder_id : s[i].getValue('internalid'),
			});
		}
	}

return resultsArr[0].folder_id;

}