/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Mar 2018     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function check_tran_sequence(request, response){
	
	var accPeriods = getAccountingPeriods();
	
	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('בדיקת רצף מספור');
		form.addSubmitButton('המשך');
			
		var typeFilterGroup = form.addFieldGroup('custpage_type_group','סוג תנועה');

		
		var selectType = form.addField('custpage_select_trantype','select','תנועה', null, 'custpage_type_group');
		selectType.addSelectOption('','');
		selectType.addSelectOption('invoice','Invoice');
		selectType.addSelectOption('creditmemo','Credit Memo');
		selectType.addSelectOption('customerpayment','Reciept');
		
		
		var selectSubsidiary = form.addField('custpage_select_subsidiary','select', 'בחר חברה', 'SUBSIDIARY', 'custpage_type_group');
		selectSubsidiary.setMandatory( true );
		selectSubsidiary.setDefaultValue('1');
			
		var toNextPage = form.addField('custpage_ilo_tonextpage','text', 'tosend');
		toNextPage.setDefaultValue('next');
		toNextPage.setDisplayType('hidden');

		response.writePage(form);

		}//end of first if

	else if(request.getParameter('custpage_ilo_tonextpage') == 'next') {
		
		var tranType = request.getParameter('custpage_select_trantype')
		var subsid = request.getParameter('custpage_select_subsidiary')
		
		var results = getAllActivities(tranType);
		nlapiLogExecution('debug', 'results', results)

		var array = [];
		for(var k=0; k<results.length; k++)
		{
			array[results[k].docNum] = '1';
		}
		var firstDocNum = results[0].docNum
		
		nlapiLogExecution('debug', 'firstDocNum', JSON.stringify(firstDocNum));
		
		

		function getDiscreps(array, firstDocNum) {

		var discreps = [];
		var first = parseInt(firstDocNum);
		nlapiLogExecution('debug', 'first', first);

		for(var i= first; i<array.length; i++){
		if (array[i] == null)
			discreps.push(i)
		}

		return discreps;
		}


var discrep_results = getDiscreps(array, firstDocNum)
		
		var resultsForm = nlapiCreateForm('תוצאות');
		resultsForm.addSubmitButton('הורדת קובץ');
		

		var detailsGroup = resultsForm.addFieldGroup('custpage_detail_group','פרטים');
		var resultsGroup = resultsForm.addFieldGroup('custpage_result_group','תוצאות');


		
		var companyNamefield = resultsForm.addField('custpage_companyname','text','שם החברה', null, 'custpage_detail_group');
		companyNamefield.setDefaultValue(nlapiLookupField('subsidiary', subsid, 'name'));
		companyNamefield.setDisplayType('disabled')
		
		var companyRegNumber = resultsForm.addField('custpage_regnumber','text','מס ח.פ.', null, 'custpage_detail_group');
		companyRegNumber.setDefaultValue(nlapiLookupField('subsidiary', subsid, 'custrecordil_tax_payer_id_subsidary'));
		companyRegNumber.setDisplayType('disabled')
		
		var companyTikNikuim = resultsForm.addField('custpage_tiknikum','text','תיק ניכויים', null, 'custpage_detail_group');
		companyTikNikuim.setDefaultValue(nlapiLookupField('subsidiary', subsid, 'custrecordil_tiknik'));
		companyTikNikuim.setDisplayType('disabled')
		
		var type = '';
		if(tranType == 'invoice'){
			type = 'Invoice'
		}
		if(tranType == 'creditmemo'){
			type = 'Credit Memo'
		}
		if(tranType == 'customerpayment'){
			type = 'Receipt'
		}
		var tranTypefield = resultsForm.addField('custpage_trantype','text','ישות', null, 'custpage_detail_group');
		tranTypefield.setDefaultValue(type);
		tranTypefield.setDisplayType('disabled')

		var firstTran;
		var lastTran;
		var htmlHeader;
		
		if(tranType == 'invoice'){
			
			 firstTran ="INIL"+JSON.stringify(results[0].docNum)
			 lastTran = "INIL"+JSON.stringify(results[results.length-1].docNum);
			
			htmlHeader = resultsForm.addField('custpage_header', 'inlinehtml', null, null, 'custpage_result_group');
			if(JSON.stringify(discrep_results) == "[]") {
			    htmlHeader.setDefaultValue("<span style='font-size:18px'>בדיקת רציפות עבור חשבוניות מס<br>" + "INIL17 קידומת<br>" +
			    		firstTran+' - '+lastTran +"</span><br>" +
			    				"<span style='font-size:20px'>.נמצא רצף מלא</span><br>") 
		
			}
			if(JSON.stringify(discrep_results) != "[]") {
				
			    htmlHeader.setDefaultValue("<span style='font-size:18px'>בדיקת רציפות עבור חשבוניות מס<br>" + "INIL17 קידומת<br>" +
			    		firstTran+' - '+lastTran +"</span><br>" +
				"<span style='font-size:20px'>.התנועות הבאות אינן קיימות ברצף המספור</span><br>") 		
			}
			
			
		}// if invoice
		
		if(tranType == 'creditmemo'){
			
			 firstTran ="CMIL"+JSON.stringify(results[0].docNum)
			 lastTran = "CMIL"+JSON.stringify(results[results.length-1].docNum);
			
			htmlHeader = resultsForm.addField('custpage_header', 'inlinehtml', null, null, 'custpage_result_group');
			if(JSON.stringify(discrep_results) == "[]") {
			    htmlHeader.setDefaultValue("<span style='font-size:18px'>בדיקת רציפות עבור חשבוניות זיכוי<br>" + "CMIL17 קידומת<br>" +
			    		firstTran+' - '+lastTran +"</span><br>" +
			    				"<span style='font-size:20px'>.נמצא רצף מלא</span><br>") 
		
			}
			if(JSON.stringify(discrep_results) != "[]") {
				
			    htmlHeader.setDefaultValue("<span style='font-size:18px'>בדיקת רציפות עבור חשבוניות זיכוי<br>" + "CMIL17 קידומת<br>" +
			    		firstTran+' - '+lastTran +"</span><br>" +
				"<span style='font-size:20px'>.התנועות הבאות אינן קיימות ברצף המספור</span><br>") 		
			}
			
			
		}// if creditmemo
		
		if(tranType == 'customerpayment'){
			
			 firstTran ="RCIL"+JSON.stringify(results[0].docNum)
			 lastTran = "RCIL"+JSON.stringify(results[results.length-1].docNum);
			
			htmlHeader = resultsForm.addField('custpage_header', 'inlinehtml', null, null, 'custpage_result_group');
			if(JSON.stringify(discrep_results) == "[]") {
			    htmlHeader.setDefaultValue("<span style='font-size:18px'>בדיקת רציפות עבור קבלות<br>" + "RCIL17 קידומת<br>" +
			    		firstTran+' - '+lastTran +"</span><br>" +
			    				"<span style='font-size:20px'>.נמצא רצף מלא</span><br>") 
		
			}
			if(JSON.stringify(discrep_results) != "[]") {
				
			    htmlHeader.setDefaultValue("<span style='font-size:18px'>בדיקת רציפות עבור קבלות<br>" + "RCIL17 קידומת<br>" +
			    		firstTran+' - '+lastTran +"</span><br>" +
				"<span style='font-size:20px'>.התנועות הבאות אינן קיימות ברצף המספור</span><br>") 		
			}
			
			
		}// if customerpayments
		

			var resultsSubList = resultsForm.addSubList('custpage_results_sublist', 'list', null, 'custpage_result_group');		
			var res_tran = resultsSubList.addField('custpage_resultssublist_tran', 'text','מסמך');

			for(var x = 0; x<discrep_results.length; x++) {
				if(tranType == 'invoice'){
					resultsSubList.setLineItemValue('custpage_resultssublist_tran',x+1 ,'INIL'+discrep_results[x]);
				}
				if(tranType == 'creditmemo'){
					resultsSubList.setLineItemValue('custpage_resultssublist_tran',x+1 ,'CMIL'+discrep_results[x]);
				}
				if(tranType == 'customerpayment'){
					resultsSubList.setLineItemValue('custpage_resultssublist_tran',x+1 ,'RCIL'+discrep_results[x]);
				}
	
				
			}
	     var jsonStr = JSON.stringify(results)
	     
	    var toPrint = resultsForm.addField('custpage_ilo_toprint','text', 'tosend');
	     toPrint.setDefaultValue('print');
	     toPrint.setDisplayType('hidden');
	     
		    var theTrantype = resultsForm.addField('custpage_ilo_thetrantype','text', 'tosend');
		    theTrantype.setDefaultValue(tranType);
		    theTrantype.setDisplayType('hidden');
		     
			    var theSubsid = resultsForm.addField('custpage_ilo_thesubsid','text', 'tosend');
			    theSubsid.setDefaultValue(subsid);
			    theSubsid.setDisplayType('hidden');
	     
	     
		response.writePage(resultsForm);		
	}//end of else if ('custpage_ilo_tonextpage') == 'next') 
	
	else if(request.getParameter('custpage_ilo_toprint') == 'print') {
		
		var tranType = request.getParameter('custpage_ilo_thetrantype');
		var subsid = request.getParameter('custpage_ilo_thesubsid');
		var results = request.getParameter('custpage_header')
		nlapiLogExecution('debug', 'custpage_header', results)
		
		
		var theResults = getAllActivities(tranType);

		var array = [];
		for(var k=0; k<theResults.length; k++)
		{
			array[theResults[k].docNum] = '1';
		}
		var firstDocNum = theResults[0].docNum
		
//		nlapiLogExecution('debug', 'firstDocNum', JSON.stringify(firstDocNum));
		
		

		function getDiscreps(array, firstDocNum) {

		var discreps = [];
		var first = parseInt(firstDocNum);
		nlapiLogExecution('debug', 'first', first);

		for(var i= first; i<array.length; i++){
		if (array[i] == null)
			discreps.push(i)
		}

		return discreps;
		}


var discrep_results = getDiscreps(array, firstDocNum)
		
		var type = '';
		var results = '';
		var firstTran;
		var lastTran;
		
		
		if(tranType == 'invoice'){
			type = 'חשבוניות מס'
				
			firstTran ="INIL"+JSON.stringify(theResults[0].docNum)
			lastTran = "INIL"+JSON.stringify(theResults[theResults.length-1].docNum);
				if(JSON.stringify(discrep_results) == "[]") {
				    results = "בדיקת רציפות עבור חשבוניות מס<br/>" + "INIL17 קידומת<br/>" +
				    		firstTran+' - '+lastTran +"<br/>" +
				    				".נמצא רצף מלא<br/>";
				}
				if(JSON.stringify(discrep_results) != "[]") {
					  results = "בדיקת רציפות עבור חשבוניות מס<br/>" + "INIL17 קידומת<br/>" +
				    		firstTran+' - '+lastTran +"<br/>" +
					".התנועות הבאות אינן קיימות ברצף המספור<br/>";	
				}
		}
		if(tranType == 'creditmemo'){
			type = 'חשבוניות זיכוי'
				
				firstTran ="CMIL"+JSON.stringify(theResults[0].docNum)
				lastTran = "CMIL"+JSON.stringify(theResults[theResults.length-1].docNum);
					if(JSON.stringify(discrep_results) == "[]") {
					    results = "בדיקת רציפות עבור חשבוניות זיכוי<br/>" + "CMIL17 קידומת<br/>" +
					    		firstTran+' - '+lastTran +"<br/>" +
					    				".נמצא רצף מלא<br/>";
					}
					if(JSON.stringify(discrep_results) != "[]") {
						  results = "בדיקת רציפות עבור חשבוניות זיכוי<br/>" + "CMIL17 קידומת<br/>" +
					    		firstTran+' - '+lastTran +"<br/>" +
						".התנועות הבאות אינן קיימות ברצף המספור<br/>";	
					}
		}
		if(tranType == 'customerpayment'){
			type = 'קבלות'
				
				
				firstTran ="RCIL"+JSON.stringify(theResults[0].docNum)
				lastTran = "RCIL"+JSON.stringify(theResults[theResults.length-1].docNum);
					if(JSON.stringify(discrep_results) == "[]") {
					    results = "בדיקת רציפות עבור קבלות<br/>" + "RCIL17 קידומת<br/>" +
					    		firstTran+' - '+lastTran +"<br/>" +
					    				".נמצא רצף מלא<br/>";
					}
					if(JSON.stringify(discrep_results) != "[]") {
						  results = "בדיקת רציפות עבור קבלות<br/>" + "RCIL17 קידומת<br/>" +
					    		firstTran+' - '+lastTran +"<br/>" +
						".התנועות הבאות אינן קיימות ברצף המספור<br/>";	
					}
		}
		
		
		var temp = nlapiLoadFile('235331').getValue();
		var a = temp.toString();
		//get head tag 
			var first_headTag = a.indexOf("head") -1 ; 
		    var end_headTag = a.indexOf("/head") +6 ; 
			var head_tag = a.substr(first_headTag, end_headTag - first_headTag);
			
//		//get table tag (actual template of invoice)
			var first_tableTag = a.indexOf("table class") -4 ;
			var end_tableTag = a.indexOf("/body") -1;
			
			var inv_template = a.substr(first_tableTag, end_tableTag - first_tableTag);

			
//		//concatenate all parts of xml file	
			var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
			xml += "<pdf>";
								
			xml += head_tag + '<body padding="0.5in 0.5in 0.5in 0.5in" size="A4">';

	
			var pattern = /_TODAYSDATE|_COMPANYNAME|_TAXPAYERID|_TIKNIKUIM|_TRANTYPE|_RESULTS/ig;

				try
				{					
					//Payee Information
					 todaysDate = getTodaysDate();
					 companyname = nlapiLookupField('subsidiary', subsid, 'name');
					 taxpayerid = nlapiLookupField('subsidiary', subsid, 'custrecordil_tax_payer_id_subsidary');
					 tiknikuim = nlapiLookupField('subsidiary', subsid, 'custrecordil_tiknik');
					 trantype = type;
					 results = results;

					
					
					
					var mapObj = {
					_TODAYSDATE : todaysDate,
					_COMPANYNAME : companyname,
					_TAXPAYERID : taxpayerid,
					_TIKNIKUIM : tiknikuim,
					_TRANTYPE : trantype,
					_RESULTS : results
					
				};
					

						var str = inv_template.replace(/\{\{(.*?)\}\}/g, function(i, match) {
						    return mapObj[match];
						});
			
				
						//must clean all amps
						var clean = str.replaceAll("&", "&amp;");
					
					xml += clean;
					
					
					xml = xml += '</body></pdf>';
				}
					
				catch(e) {
					nlapiLogExecution('ERROR', 'error pdfbuild', e);
				}

		
				downloadDataPDF(xml, response, form);
		
	}
}//end of script




function getAccountingPeriods() {

	var searchPeriods = nlapiLoadSearch(null,'customsearch_ilo_acc_period_search');
	searchPeriods.addFilter(new nlobjSearchFilter('startdate', null, 'notbefore', '01/01/2016'));

	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchPeriods.runSearch();
	var rs;

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

			allResults.push({

				periodname : line.getValue('periodname'),
				periodID : line.getValue('internalid')

			});

		});
	}
	;

	return allResults;
};




function getAllActivities(trantype, fromperiod, toperiod) {
	
	var search = '';
	if(trantype == 'invoice'){
		search = 'customsearch_ilo_audit_invoice_search';
	}
	if(trantype == 'creditmemo'){
		search = 'customsearch_ilo_audit_credit_search';
	}
	if(trantype == 'customerpayment'){
		search = 'customsearch_ilo_audit_receipt_search';
	}
	
	var searchFAM = nlapiLoadSearch(null, search);


	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;

	

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

			docNum : parseInt(line.getValue('tranid').substring(4)),
			internalid: line.getValue('internalid')

		});

		});

	};

	return theResults;
}

function getTodaysDate(){
	var todaysDate = new Date();
	var dd = todaysDate.getDate();
	var mm = todaysDate.getMonth()+1; //January is 0!
	var yyyy = todaysDate.getFullYear();

	if(dd<10) {
	    dd='0'+dd;
	}; 

	if(mm<10) {
	    mm='0'+mm;
	};

	todaysDate = dd+'/'+mm+'/'+yyyy;
	return todaysDate;
	}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


function downloadDataPDF(data, response, form) {
	
	var file = nlapiXMLToPDF( data );
//	response.setEncoding('windows-1252');
	var todaysDate = getTodaysDate();
	response.setContentType('PDF','בדיקת רצף מספור -'+todaysDate+'.pdf');
	response.write( file.getValue() ); 

}

function downloadData(data, response, form) {
    // set content type, file name, and content-disposition (inline means display in browser)
	response.setEncoding('UTF-8');
    response.setContentType('PLAINTEXT', 'test.txt');
    // write response to the client
    response.write(data);
}