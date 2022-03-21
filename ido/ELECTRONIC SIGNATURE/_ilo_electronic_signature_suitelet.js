

function electronic_signature(request, response){
	
	
	if (request.getMethod() == 'GET') {
	
		var form = nlapiCreateForm('Electronic Signature')
		form.addSubmitButton('Continue');
		
		form.addFieldGroup('custpage_ilo_selectaction_group', 'Select Action');
		var selectAction = form.addField('custpage_ilo_selectaction', 'select', 'Document', null, 'custpage_ilo_selectaction_group');
		selectAction.addSelectOption('a', 'Export Invoices');
		selectAction.addSelectOption('b', 'Import Signed Invoices');
		selectAction.setMandatory(true);
		
		response.writePage(form);
		

	} 
	
	else if(request.getParameter('custpage_ilo_selectaction') == 'b') {
		
		var form = nlapiCreateForm('Import Signed Invoices');
		form.addSubmitButton('Import');	

		var checkStage = form.addField('custpage_ilo_file_imported', 'text', 'check', null, null);
		checkStage.setDefaultValue('imported');
		checkStage.setDisplayType('hidden');
		response.writePage(form);
	}
	
	else if(request.getParameter('custpage_ilo_file_imported') == 'imported') {
		var folderID = findFolder('process');
		var signedInvoices = getSignedInvoices(folderID)
		var filesToImport =  getFilesToImport(signedInvoices)
		
		var finalFolder = findFolder('import');
		
		if(filesToImport != []) {
			
			for(var i = 0; i<filesToImport.length; i++) {

				try{

					nlapiAttachRecord('file',filesToImport[i].fileID, 'invoice', filesToImport[i].invoiceID, null)
					
						nlapiLogExecution('debug', 'record attached','record attached');
					
					var fileRec = nlapiLoadFile(filesToImport[i].fileID);
					fileRec.setFolder(finalFolder);
					nlapiSubmitFile(fileRec)
					
					nlapiLogExecution('debug', 'record moved','record moved');
				
			}catch(err){
				nlapiLogExecution('error', 'Error attaching File', err);
				continue;
			}
			}

		}
		
		var importForm = nlapiCreateForm('Signed Invoices Imported');
		var importInfo = importForm.addField('custpage_import_info','inlinehtml', null, null, null);
		importInfo.setDefaultValue('<font size="2"><b>Signed invoices have been imported <u>successfully</u>.</b><br><br> The .pdf file can be viewed on the invoice record.<br> Go to the <b>Communications</b> subtab and select <b>Files</b>');
	
		response.writePage(importForm)

	}
	
	else if(request.getParameter('custpage_ilo_selectaction') == 'a') {
		
		var form = nlapiCreateForm('Electronic Signature');
		form.addSubmitButton('Retrieve');
		form.addFieldGroup("custpage_ilo_batchloadgroup", "Select Invoices");
		form.addFieldGroup("custpage_ilo_searchdetails", "Details");

		var fromInvoice = form.addField('custpage_frominvoice', 'text', 'From Invoice', null, 'custpage_ilo_batchloadgroup');
		var toInvoice = form.addField('custpage_toinvoice', 'text', 'To Invoice', null, 'custpage_ilo_batchloadgroup');
				
		var docType = form.addField('custpage_ilo_multi_doc', 'text', 'Document', null, 'custpage_ilo_searchdetails');
		docType.setDefaultValue('Invoice') //invoice only
		docType.setDisplayType('inline')

		var subsid = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_il_subsidiary')	
		
		var selectSubsidiary = form.addField('custpage_select_subsidiary','select', 'Subsidary', 'SUBSIDIARY', 'custpage_search_group');
		selectSubsidiary.setDefaultValue(subsid);
		
		var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
		checkStage.setDefaultValue('stageOne');
		checkStage.setDisplayType('hidden');

		response.writePage(form);
		
		
	}
	
	else if(request.getParameter('custpage_ilo_check_stage') == 'stageOne') { 
		
		var startInv = request.getParameter('custpage_frominvoice');
		var endInv = request.getParameter('custpage_toinvoice');
		
		var subsidSelected = request.getParameter('custpage_select_subsidiary');

		var allInvoices = invSearch(startInv,endInv,subsidSelected)
		
	    var invToPrint = [];  
		
		var printChoiceForm = nlapiCreateForm('Electronic Signature');
		var executeBtn = printChoiceForm.addSubmitButton('Execute');
			
		var resultsSubList = printChoiceForm.addSubList('custpage_results_sublist', 'list', 'Results', null);
	   // resultsSubList.addMarkAllButtons();
	    
	    var res_InternalID = resultsSubList.addField('custpage_resultssublist_internalid', 'text', 'internalid');
	    res_InternalID.setDisplayType('hidden');
	    
	    //var res_CheckBox = resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
		    
	    var res_TranId = resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Document Number');
	
	    var res_TranDate = resultsSubList.addField('custpage_resultssublist_trandate', 'date', 'Date');
	
	    var res_Customer = resultsSubList.addField('custpage_resultssublist_customer', 'text', 'Customer');
	  
	    var res_TotalAmt = resultsSubList.addField('custpage_resultssublist_totalamt', 'currency', 'Total');
	    
	    if(allInvoices != null) {
    	
    	for(var i = 0 ; i<allInvoices.length; i++) {

    		resultsSubList.setLineItemValue('custpage_resultssublist_internalid', i +1, allInvoices[i].internalid);
    		//resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', i +1, 'T');
    		resultsSubList.setLineItemValue('custpage_resultssublist_tranid', 	i +1, allInvoices[i].docNum);	
    		resultsSubList.setLineItemValue('custpage_resultssublist_trandate', i +1, allInvoices[i].trandate);	
    		resultsSubList.setLineItemValue('custpage_resultssublist_customer', i +1, allInvoices[i].customerName);
    		resultsSubList.setLineItemValue('custpage_resultssublist_totalamt', i +1, allInvoices[i].total);

    		
    		invToPrint.push(allInvoices[i].internalid)
    	}
    }

    
	var hiddenFieldForInvToPrint = printChoiceForm.addField('custpage_ilo_invtoprint', 'longtext', 'check', null, null);
	hiddenFieldForInvToPrint.setDefaultValue(JSON.stringify(invToPrint));
	hiddenFieldForInvToPrint.setDisplayType('hidden');
	
	var checkStage = printChoiceForm.addField('custpage_ilo_last_stage', 'text', 'check', null, null);
	checkStage.setDefaultValue('lastStage');
	checkStage.setDisplayType('hidden');
	
	 var originValueField = printChoiceForm.addField('custpage_originvalue', 'text', 'URL Origin Value')
	 originValueField.setDisplayType('hidden');
	 

	 printChoiceForm.setScript('customscript_ilo_elec_sign_client')
     response.writePage(printChoiceForm)
	

	}//end of first else
	
	else if(request.getParameter('custpage_ilo_last_stage') == 'lastStage') { 
		
		var ENV_ORIGIN = request.getParameter('custpage_originvalue');

		var folderID = findFolder('export')
		//before we do anything first delete all previous invoices from folder.		
		var files = getAllFiles(folderID);
		
		
		if (files[0] != "") {
			for(var x = 0; x<files.length; x++) {
				nlapiDeleteFile(files[x]);
			}			
		}
		
		var invoiceArr = JSON.parse(request.getParameter('custpage_ilo_invtoprint'));
		
		for(var i=0; i<invoiceArr.length; i++) {
			
			var InvoicePDF = nlapiPrintRecord('TRANSACTION', invoiceArr[i]);
			InvoicePDF.setFolder(folderID)
			var fileName = InvoicePDF.getName()
			var justFileName = fileName.replace('.pdf', '')
			InvoicePDF.setName(invoiceArr[i]+'-'+justFileName+'.pdf')
			InvoicePDF.setIsOnline(true)		
			nlapiSubmitFile(InvoicePDF)
		}	
		 var finalForm = nlapiCreateForm('Download Files');
		 
		 var fileLink = finalForm.addField('custpage_new_req_link','inlinehtml', null, null, null);
		 fileLink.setDefaultValue('<font size="2"><b>Click<a href="'+ENV_ORIGIN+'/core/media/downloadfolder.nl?id='+folderID+'&_xt=&_xd=T&e=T"> here</a> to download.</b>');

		 
		 response.writePage(finalForm)
	}

}


function invSearch(startInv,endInv, subsidSelected) {
			
	var start = getDigit(startInv)
	var end = getDigit(endInv)
	
	nlapiLogExecution('debug', 'start', start)
	nlapiLogExecution('debug', 'end', end)
	
	var invRange = [start, end]
	var searchFAM;
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T')
	filters[1] = new nlobjSearchFilter('number', null, 'between', invRange)
	if(subsidSelected != '' || subsidSelected != null || subsidSelected != undefined) {
	filters[2] = new nlobjSearchFilter('subsidiary', null, 'anyof', [subsidSelected])
	}

	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'internalid' );
	columns[1] = new nlobjSearchColumn( 'tranid' ).setSort();
	columns[2] = new nlobjSearchColumn( 'trandate' );
	columns[3] = new nlobjSearchColumn( 'entity' );
	columns[4] = new nlobjSearchColumn( 'fxamountremaining' );
	columns[5] = new nlobjSearchColumn( 'taxtotal' );
	//columns[6] = new nlobjSearchColumn( 'custbody_ilo_org_printed' );

	

		 searchFAM = nlapiCreateSearch('invoice', filters, columns)


	
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

		//var checkIfOriginal = line.getValue('custbody_ilo_org_printed')
		
		//if(checkIfOriginal == 'F') {
			

			theResults.push({

				internalid : line.getValue('internalid'),
				docNum : line.getValue('tranid'),
				trandate : line.getValue('trandate'),
				customerName : line.getText('entity'),
				total : line.getValue('fxamountremaining'),
				taxtotal : line.getValue('taxtotal'),
			});
			
		//}

		});

	};
	nlapiLogExecution('debug', 'theResults', JSON.stringify(theResults))
	return theResults;
}


function getDigit(invoice) {

	var res = invoice.match(/[0-9]+/g);
	var digit = parseInt(res[0])
	return digit
}

function findFolder(type) {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('internalid');
	var fils;
	
	if(type == 'export') {
		 fils = new Array();
		fils[0] = new nlobjSearchFilter('name', null, 'is', 'Electronic Signature Folder')		
	}
	if(type == 'import') {
		 fils = new Array();
		fils[0] = new nlobjSearchFilter('name', null, 'is', 'Signed Invoices')		
	}
	if(type == 'process') {
		 fils = new Array();
		fils[0] = new nlobjSearchFilter('name', null, 'is', 'Processing Signed Invoices')		
	}


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

function getAllFiles(folderID) {


	var folder = folderID // the folder ID we care about

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('internalid', null, 'is', folder);


	var columns = new Array();
	var filename = new nlobjSearchColumn('name', 'file');
	var fileid = new nlobjSearchColumn('internalid', 'file');

	columns[0] = filename;
	columns[1] = fileid;


	var searchResult = nlapiSearchRecord('folder', null , filters , columns);

	var theResults = [];

		if (searchResult != null) {
			searchResult.forEach(function(line) {
				

			theResults.push(line.getValue(columns[1]));

			});

		};
		return theResults;

	}

function getSignedInvoices(folderID) {
	
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'is', folderID)


    var columns = new Array();
    columns[0] = new nlobjSearchColumn( 'internalid', 'file' );
    columns[1] = new nlobjSearchColumn( 'name', 'file' );

    var searchFAM = nlapiCreateSearch('folder', filters, columns)
    
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

                fileID : line.getValue('internalid', 'file'),
                fileName : line.getValue('name', 'file'),

          });

          });

    };
    
    return theResults;

	
}

function getFilesToImport(arr) {

	var results = [];

	for(var i = 0; i<arr.length; i++) {

	var first = JSON.stringify(arr[i].fileName)
	var endIndex = first.indexOf('-Invoice')
	var res = first.substr(0, endIndex);
	var invoiceID = res;
	while(invoiceID.charAt(0) === '"')
	{
	 invoiceID = invoiceID.substr(1);
	}
	var fileID = arr[i].fileID

	results.push({
	invoiceID : invoiceID,
	fileID : fileID

	})
	}

	return results;
	}