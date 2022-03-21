/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Jan 2019     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function createPayments(request, response){
	
	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('Create Customer Payments')
		var importInfo = form.addField('custpage_info','inlinehtml', null, null, null);
		importInfo.setDefaultValue('<font size="2"><b>Submitting this screen will transform these open invoices to customer payments.</b>');
		form.addSubmitButton('Submit');
		
		var allInvoices = invSearch()
			
		var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'Results', null);
	    resultsSubList.addMarkAllButtons();
	    
	    var res_InternalID = resultsSubList.addField('custpage_resultssublist_internalid', 'text', 'internalid');
	    res_InternalID.setDisplayType('hidden');
	    
	    var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
		    
	    var res_TranId = resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Document Number');
	
	    var res_TranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'date', 'Sales Order Date');
	
	    var res_Customer = resultsSubList.addField('custpage_resultssublist_customer', 'text', 'Customer');
	    
	    var res_Status = resultsSubList.addField('custpage_resultssublist_status', 'text', 'Status');
	  
	    var res_TotalAmt = resultsSubList.addField('custpage_resultssublist_totalamt', 'currency', 'Total');
	    
	    if(allInvoices != null) {
    	
    	for(var i = 0 ; i<allInvoices.length; i++) {

    		resultsSubList.setLineItemValue('custpage_resultssublist_internalid', i +1, allInvoices[i].internalid);
    		resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', i +1, 'T');
    		resultsSubList.setLineItemValue('custpage_resultssublist_tranid', 	i +1, allInvoices[i].docNum);	
    		resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i +1, allInvoices[i].trandate);	
    		resultsSubList.setLineItemValue('custpage_resultssublist_customer', i +1, allInvoices[i].customerName);
    		resultsSubList.setLineItemValue('custpage_resultssublist_status', i +1, allInvoices[i].status);
    		resultsSubList.setLineItemValue('custpage_resultssublist_totalamt', i +1, allInvoices[i].total);

	    	}
	    }
		
		var hiddenFieldJobs = form.addField('custpage_jfrog_invtouse', 'text', 'check', null, null);
		hiddenFieldJobs.setDisplayType('hidden');
		
		var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
		checkStage.setDefaultValue('stageOne');
		checkStage.setDisplayType('hidden');
		
		form.setScript('customscript_jfrog_pymt_creation_client')
		response.writePage(form);

	} 
	else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne'){
		
		var endForm = nlapiCreateForm('Creating Customer Payments...')
		
		var today = new Date();
		var todayStr = nlapiDateToString(today);	
		
		var htmlHeader = endForm.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
		    htmlHeader.setDefaultValue("<p style='font-size:20px'>The payments are currently being created.</p><br><br>Please click <a href='https://system.eu1.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&datefrom="+todayStr+"&dateto="+todayStr+"&scripttype=563&primarykey=6595'>here</a> in order to be redirected to the status page.");
		var params = {
				'custscript_invoices_to_transform' : request.getParameter('custpage_jfrog_invtouse'),
		}
		nlapiScheduleScript('customscript_jfrog_payment_creation_ss', 'customdeploy_jfrog_pymt_creation_ss_dep', params)

		
		response.writePage(endForm);
		
	}

}

function invSearch() {


	var filters = new Array();
	filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T')
	filters[1] = new nlobjSearchFilter('status', null, 'anyof', ["CustInvc:A"])
	filters[2] = new nlobjSearchFilter('custbody_po_type', null, 'anyof', [1])

	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'internalid' );
	columns[1] = new nlobjSearchColumn( 'tranid' );
	columns[2] = new nlobjSearchColumn( 'altname', 'customer' );
	columns[3] = new nlobjSearchColumn( 'amount');
	columns[4] = new nlobjSearchColumn( 'status');
	columns[5] = new nlobjSearchColumn( 'trandate', 'createdfrom' ).setSort();


	var searchFAM = nlapiCreateSearch('invoice', filters, columns)
	
	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();
	

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allSelection
					.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);
	
	if (allSelection != null) {
	allSelection.forEach(function(line) {

		theResults.push({

			internalid : line.getValue('internalid'),
			docNum : line.getValue('tranid'),
			trandate : line.getValue('trandate', 'createdfrom' ),
			customerName : line.getValue('altname', 'customer'),
			total : line.getValue('amount'),
			status : line.getValue('status').capitalize(),
		});

		});

	};
	
	return theResults;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}