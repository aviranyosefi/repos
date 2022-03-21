/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Apr 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function saveOriginalPDF_ss(type){

	try{
		
		var allFiles = getAllFiles();
		var recs = getAllRecs();
		if(recs == '') {
			nlapiLogExecution('debug', 'empty', 'empty')
		}
		else{
			nlapiLogExecution('debug', 'saving..', JSON.stringify(recs))
			recs.forEach(function(inv) {
				 
				
				var recID = inv.internalid;
				
				var rec = nlapiLoadRecord('invoice', recID)
				
				var currTranID = rec.getFieldValue('tranid');
				var currDraft = rec.getFieldValue('custbodycustbody_ilo_print_draft');
				var currOriginal = rec.getFieldValue('custbody_ilo_org_printed');
				
				var currBillCountry = rec.getFieldValue('billcountry');
				
				nlapiLogExecution('debug', 'currTranID', currTranID);
				
				var checkSave = allFiles.indexOf(currTranID);
				nlapiLogExecution('debug', 'checkSave', checkSave)

				if (checkSave == -1 && currDraft == 'F' && currOriginal == 'F') {
					
				
					
					var pdfToSave = nlapiPrintRecord('TRANSACTION',recID, 'PDF',null);
					pdfToSave.setFolder('178'); // the folder ID we care about
					nlapiSubmitFile(pdfToSave);
					nlapiSubmitField('invoice', recID, 'custbody_ilo_org_printed', 'T', null);
					
					nlapiLogExecution('debug', 'submitted', pdfToSave)
				}				
				});
		}
		
		
	}catch(err){
		nlapiLogExecution('debug', 'try/catch - err', err)
	
	}
	
}


function getAllRecs() {

	var searchItems= nlapiLoadSearch(null, 'customsearch_ctrlup_last_mod');

	var allItems = [];
	var items =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchItems.runSearch();
	var rs;
	
		var cols = searchItems.getColumns();

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allItems.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allItems != null) {
				allItems.forEach(function(line) {
					
					items.push({
					
					internalid : line.getText(cols[0]),

					});
					
				});

			};
			
			return items;

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