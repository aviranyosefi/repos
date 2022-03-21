/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Mar 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */

function beforeLoad_creditmemo(type) {
	try{
		

	if(type == 'create') {
		
		
		var recType = nlapiGetRecordType();
		
		if(recType == 'creditmemo') {
			
			var rec = nlapiGetNewRecord();
			
					rec.setFieldValue('custbody_ilo_org_printed', 'F');
					rec.setFieldValue('custbody_ctrlup_og_pdf_saved', 'F');
					rec.setFieldValue('custbody_ctrlup_sf_sync_complete', 'F');
					rec.setFieldValue('source', '');
			
		}

		
	}
	}catch(err) {
		nlapiLogExecution('error', 'beforeLoad_creditmemo - err', err)
	}
	
}

function saveOriginalPDF(type){
	
	
	try{
		
		var allFiles = getAllFiles();
		
		var recID = nlapiGetRecordId();
		var recType = nlapiGetRecordType();
		
		var rec = nlapiLoadRecord(recType, recID)
		
		var currTranID = rec.getFieldValue('tranid');
		var currDraft = rec.getFieldValue('custbodycustbody_ilo_print_draft');
		var currOriginal = rec.getFieldValue('custbody_ilo_org_printed');
		var salesForceSync = rec.getFieldValue('custbody_ctrlup_sf_sync_complete');
		
		var checkToPrint = rec.getFieldValue('custbody_ctrlup_og_pdf_saved')
		
		
		var emailSalesRep = 'morz@controlup.com';
		var salesRepID = rec.getFieldValue('salesrep');
		if( salesRepID != '' || null || undefined) {

		 emailSalesRep = nlapiLookupField('employee', salesRepID, 'email')
		}
		nlapiLogExecution('debug', 'emailSalesRep', emailSalesRep)
		
		var source = rec.getFieldValue('source')
		
		var currBillCountry = rec.getFieldValue('billcountry');
		
		nlapiLogExecution('debug', 'currBillCountry', currBillCountry);
		
		var checkSave = allFiles.indexOf(currTranID);
		nlapiLogExecution('debug', 'checkSave', checkSave)
		

		if (checkSave == -1 && currDraft == 'F' && currOriginal == 'F' && salesForceSync == 'T' && source == 'Web Services') {
			
			nlapiLogExecution('debug', 'ready to submit', 'ready to submit - salesforce');
			nlapiLogExecution('debug', 'checkSave', checkSave);
			
			if(currBillCountry == 'IL' && checkToPrint == 'F') {
				nlapiLogExecution('debug', 'currBillCountry is IL', 'currBillCountry is IL')
				nlapiSubmitField(recType, recID, 'custbodycustbody_ilo_print_draft', 'T', null);
				return true;
			}
			
			if(currBillCountry == 'IL' && checkToPrint == 'T') {
				nlapiLogExecution('debug', 'ready to submit', 'ready to submit - manual')
				nlapiLogExecution('debug', 'checkSave', checkSave)
				
				var pdfToSave = nlapiPrintRecord('TRANSACTION',recID, 'PDF',null);
				pdfToSave.setFolder('178'); // the folder ID we care about
				nlapiSubmitFile(pdfToSave);
				
				var fields = new Array();
				var values = new Array();
				fields[0] = 'custbody_ilo_org_printed';
				values[0] = 'T';
				fields[1] = 'custbody_ctrlup_og_pdf_saved';
				values[1] = 'T';

				 //update and submit invoice-level form
				var updatefields = nlapiSubmitField(recType,recID ,fields, values, null);
				
				var sender = '3258' //1085 SalesForce Operations
					var recipient =  emailSalesRep;
					var sbj = currTranID+' - new invoice created.';
					var msg = 'A new invoice has been succesfully created and saved in NetSuite.\n\r Please see attached.'
					nlapiSendEmail(sender, emailSalesRep, sbj, msg, 'morz@controlup.com', null, null, pdfToSave)
					
				return true;
			}
			
			if(currBillCountry != 'IL') {
			
			var pdfToSave = nlapiPrintRecord('TRANSACTION',recID, 'PDF',null);
			pdfToSave.setFolder('178'); // the folder ID we care about
			nlapiSubmitFile(pdfToSave);
			
			var fields = new Array();
			var values = new Array();
			fields[0] = 'custbody_ilo_org_printed';
			values[0] = 'T';
			fields[1] = 'custbody_ctrlup_og_pdf_saved';
			values[1] = 'T';

			 //update and submit invoice-level form
			var updatefields = nlapiSubmitField(recType,recID ,fields, values, null);
		
			
					var sender = '3258' //1085 SalesForce Operations
					var recipient =  emailSalesRep;
					var sbj = currTranID+' - new transaction created.';
					var msg = 'A new transaction has been succesfully created and saved in NetSuite.\n\r Please see attached.'
					nlapiSendEmail(sender, emailSalesRep, sbj, msg, 'morz@controlup.com', null, null, pdfToSave)
			
			}
		}
		
		if (checkSave == -1 && currDraft == 'F' && currOriginal == 'F' && salesForceSync == 'F' && source == null) {
			
			nlapiLogExecution('debug', 'ready to submit', 'ready to submit - manual')
			nlapiLogExecution('debug', 'checkSave', checkSave)
			
			var pdfToSave = nlapiPrintRecord('TRANSACTION',recID, 'PDF',null);
			pdfToSave.setFolder('178'); // the folder ID we care about
			nlapiSubmitFile(pdfToSave);
			
			var fields = new Array();
			var values = new Array();
			fields[0] = 'custbody_ilo_org_printed';
			values[0] = 'T';
			fields[1] = 'custbody_ctrlup_og_pdf_saved';
			values[1] = 'T';

			 //update and submit invoice-level form
			var updatefields = nlapiSubmitField(recType,recID ,fields, values, null);
			
		}
	
		return true;
		
		
	}catch(err){
		nlapiLogExecution('debug', 'try/catch - err', err)
		return true;
	}
	
}


function getAllFiles() {


	var folder = '178' // the folder ID we care about

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
				
				var filename = line.getValue(columns[0]);

			theResults.push(filename.replace('.pdf', '').replace('Invoice_', '').replace('Credit Memo_', ''));

			});

		};
		


		return theResults;

	}