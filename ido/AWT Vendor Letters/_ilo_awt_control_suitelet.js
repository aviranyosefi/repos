/**
 * Module Description

 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Jul 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */


	var taxcodes = getAllTaxCodes();
	var accPeriods = getAccountingPeriods();

function awt_control(request, response){
	
	
	if (request.getMethod() == 'GET') {
	
	var form = nlapiCreateForm('AWT Reports For Vendors');
	form.addSubmitButton('Continue');
	
	var searchFilterGroup = form.addFieldGroup('custpage_search_group','Filters');
	var vendorFilterGroup = form.addFieldGroup('custpage_vendor_group','Vendors');
		
	
	
	var selectPeriodFrom = form.addField('custpage_select_periodfrom','select','From Period', null, 'custpage_search_group');
	selectPeriodFrom.setMandatory( true );
	selectPeriodFrom.addSelectOption('', '');
	for(var i = 0; i<accPeriods.length; i++) {
		selectPeriodFrom.addSelectOption(accPeriods[i].periodID, accPeriods[i].periodname);
	}

	var selectPeriodTo = form.addField('custpage_select_periodto','select', 'To Period', null, 'custpage_search_group');
	selectPeriodTo.setMandatory( true );
	selectPeriodTo.addSelectOption('', '');
	for(var i = 0; i<accPeriods.length; i++) {
		selectPeriodTo.addSelectOption(accPeriods[i].periodID, accPeriods[i].periodname);
	}

	
	var subsid = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_il_subsidiary')	
	
	var selectSubsidiary = form.addField('custpage_select_subsidiary','select', 'Subsidary', 'SUBSIDIARY', 'custpage_search_group');
	selectSubsidiary.setMandatory( true );
	selectSubsidiary.setDefaultValue(subsid);

	
	
	
	var selectAllVendors = form.addField('custpage_select_all_vendors', 'checkbox', 'All Vendors', 'custpage_vendor_group');
	var selectOnlyActual = form.addField('custpage_select_only_actual', 'checkbox', 'Only if deducted in actual', null, 'custpage_vendor_group');
	selectOnlyActual.setLayoutType('normal', 'startcol')
	var selectVendor = form.addField('custpage_select_vendor','multiselect', 'Vendor', 'VENDOR', 'custpage_vendor_group');
//	selectVendor.setLayoutType('normal', 'startcol')
	//field to send to next stage;
	var toNextPage = form.addField('custpage_ilo_tonextpage','text', 'tosend');
	toNextPage.setDefaultValue('next');
	toNextPage.setDisplayType('hidden');

	response.writePage(form);

	}//end of first if
	
	else if(request.getParameter('custpage_ilo_tonextpage') == 'next') {
      
      try{
		nlapiLogExecution('debug', 'got to next', 'next')
		//Payer Information
		var subsidSelected = request.getParameter('custpage_select_subsidiary');
	
		var onlyActual = request.getParameter('custpage_select_only_actual')
		nlapiLogExecution('debug', 'onlyActual', onlyActual)
		
		var subsidRec = nlapiLoadRecord('subsidiary', subsidSelected);
		
		var payerName = subsidRec.getFieldValue('name');
		var payerAddress = subsidRec.getFieldValue('mainaddress_text');
		var payerTikNikuim = subsidRec.getFieldValue('custrecordil_tiknik');
		var payerTaxID = subsidRec.getFieldValue('custrecordil_tax_payer_id_subsidary');
		
		var companyLogo = subsidRec.getFieldValue('pagelogo');
		var logoUrl = nlapiLoadFile(companyLogo).getURL()
		
		
		var fromDate = request.getParameter('custpage_select_periodfrom');
		var toDate = request.getParameter('custpage_select_periodto');

		nlapiLogExecution('debug', 'fromDate', fromDate)
		nlapiLogExecution('debug', 'toDate', toDate)

		//check which vendors have been selected
		var selectedVendors = request.getParameterValues('custpage_select_vendor');
		var res = JSON.stringify(selectedVendors);
		
		
		//check if all vendor checkbox is selected
		var checkIfAllVendors = JSON.stringify(request.getParameter('custpage_select_all_vendors'));
		
		
		
		var allVendors = getSelectionAllVendors(fromDate, toDate, onlyActual);
		nlapiLogExecution('debug', 'get allVendors', JSON.stringify(allVendors))
		var allVendorsArr = [];
		for(var i = 0; i<allVendors.length; i++) {
			
			allVendorsArr.push(allVendors[i].vendor_internalid);
			
		}
		nlapiLogExecution('debug', 'allVendorsArr', JSON.stringify(allVendorsArr))
		var results;
		var vendorArray;
		
		
		//single or multiple selected
		try{
			results = getSelection(fromDate, toDate, selectedVendors, allVendorsArr, onlyActual);	
			nlapiLogExecution('debug', 'get getSelection', 'get getSelection')
			vendorArray = getOneVendor(selectedVendors, results);
		}
		//none selected - All vendors
		catch (err) {
		 results = getSelection(fromDate, toDate, allVendorsArr, allVendorsArr, onlyActual);	
		 nlapiLogExecution('debug', 'catch - get getSelection', ' catch -  get getSelection')
		 vendorArray = getOneVendor(allVendorsArr, results);
		 
		 nlapiLogExecution('debug', 'err', err)
		}
		
		
		function separate(vendorArray) {
			
			var oneArr = [];
			for (var i = 0; i < vendorArray.length; i++) {

				var one = returnOne(vendorArray[i]);

				oneArr.push(one);

			}

			function returnOne(arr) {

				return arr[0];

			}

			return oneArr;
		}
				
		
				var separateReports = separate(vendorArray);
		
				function uniqueVendor(array) {
				    var processed = [];
				    for (var i=array.length-1; i>=0; i--){
				        if (processed.indexOf(array[i].v_internalid)<0) {
				            processed.push(array[i].v_internalid);
				        } else {
				            array.splice(i, 1);
				        }
				    }
				    return array;
				}

				separateReports = uniqueVendor(separateReports);
		
		
				var context = nlapiGetContext();
				var usageRemaining = context.getRemainingUsage();
				nlapiLogExecution('debug', 'usageRemaining', usageRemaining)
				
				nlapiLogExecution('debug', 'about to print', 'about to print')
		
//		function multiplePrint(invoiceArr) {
			//get full template and convert to string
				
				var templateID = findTemplate()
				
				var temp = nlapiLoadFile(templateID).getValue();
				var a = temp.toString();
			//get head tag 
				var first_headTag = a.indexOf("head") -1 ; 
			    var end_headTag = a.indexOf("/head") +6 ; 
				var head_tag = a.substr(first_headTag, end_headTag - first_headTag);
				
//			//get table tag (actual template of invoice)
				var first_tableTag = a.indexOf("table class") -4 ;
				var end_tableTag = a.indexOf("/body") -1;
				
				var inv_template = a.substr(first_tableTag, end_tableTag - first_tableTag);

				
//			//concatenate all parts of xml file	
				var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
				xml += "<pdf>";
									
				xml += head_tag + '<body padding="0.2in 0.5in 0.5in 0.5in" size="A4">';
				
				
				
	
//						
				var vendor = separateReports;              
				
		
				var pattern = /_selected_dates|tax_year|_payer_name|_payer_address|_payer_tik_nikuim|_payer_tax_id|_payee_name|_payee_number|_payee_address|_payee_tax_id|_payee_vat_reg|_payee_occup_description|_payee_payment_amt|_payee_payment_gross|_payee_wht_amt|_payee_tax_code|_payee_tax_officer|_report_date|_company_logo|_company_info/ig;
//
				var singleReport = '';
				for(var i = 0; i < vendor.length; i++){
					try
					{					
						//Payee Information
						 payeeName = vendor[i].v_legalname;
						 payeeNumber = vendor[i].v_number;
						 payeeAddress = vendor[i].v_address;
						 payeeTax_id = vendor[i].v_tax_id;
						 payeeTaxReg = vendor[i].v_tax_reg;
						 payeeOccupDesc = vendor[i].v_occup;
						 payeePymtAmt = formatNumber(getTotals(vendor[i].tot_net));
						 payeePymtGross = formatNumber(getTotals(vendor[i].tot_gross));
						 payeeWHTAmt = formatNumber(getTotals(vendor[i].tot_wht));
						 payeeTaxOfficer = vendor[i].v_officer_num;
						 payeeTaxCode = vendor[i].v_tax_code;
						 companyLogo = logoUrl;
						 companyInfo = 'COMPANY INFO';
						
						
						
						
						var mapObj = {
						selected_dates : "(" + nlapiLookupField('accountingperiod', fromDate, 'periodname') + " - " + nlapiLookupField('accountingperiod', toDate, 'periodname') + ")",
						payer_name : payerName,
						payer_address : payerAddress,
						payer_tik_nikuim : payerTikNikuim,
						payer_tax_id : payerTaxID,
						
						
						payee_name : payeeName,
						payee_number : payeeNumber,
						payee_address : payeeAddress,
						payee_tax_id : payeeTax_id,
						payee_vat_reg : payeeTaxReg,
						payee_tax_code : payeeTaxCode,
						payee_occup_description : payeeOccupDesc,
						payee_payment_amt : payeePymtAmt,
						payee_payment_gross : payeePymtGross,
						payee_wht_amt : payeeWHTAmt,
						payee_tax_officer : payeeTaxOfficer,
						report_date : getTodaysDate(),
						company_logo : companyLogo,
						company_info : companyInfo
					};
						

							var str = inv_template.replace(/\{\{(.*?)\}\}/g, function(i, match) {
							    return mapObj[match];
							});
				
					
							//must clean all amps
							var clean = str.replaceAll("&", "&amp;");
						
						xml += clean;
						
						
					xml = xml + '<pbr/>';
					}
						
						
						
						
					catch(e) {
						nlapiLogExecution('ERROR', 'error pdfbuild', e);
					}
						
					}
				
				xml = xml += '</body></pdf>';

		
		
		
				


		
		
		downloadDataPDF(xml, response, form);
		
		var context = nlapiGetContext();
		var usageRemaining = context.getRemainingUsage();
		nlapiLogExecution('debug', 'usageRemaining', usageRemaining)
//				var jsonString = JSON.stringify(separateReports);
//		response.write(jsonString);
		    	}catch(err){
    		
    		 var errorForm = nlapiCreateForm('AWT Reports For Vendors');
    		var htmlHeader = errorForm.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
    		htmlHeader.setDefaultValue("<p style='font-size:20px'>No results were returned. Please check parameters and try again.</p>");
    		
    		response.writePage(errorForm)
    	}
		
	}

}





function getOneVendor(vendors, results) {

	var vendArr = [];

	vendors.forEach(function(vendor) {

		var vendObj = [];
		
		var v_legalname;
		var v_internalid;
		var v_companyname;
		var v_number;
		var v_address;
		var v_tax_id;
		var v_tax_reg;
		var v_occup;
		var v_officer_num;
		var v_tax_code;
		var total_net_amt = [];
		var total_gross_amt = [];
		var total_wht_amt = [];
		
		for(var i = 0; i<results.length; i++) {
		
		if(results[i].vendor_internalid == vendor) {
		
		total_net_amt.push(results[i].bill_amt);
		total_gross_amt.push(results[i].bill_gross);
		total_wht_amt.push(results[i].bill_wht);
		
		vendObj.push({
		
		v_legalname : results[i].legalname,
		v_internalid : results[i].vendor_internalid,
		v_companyname : results[i].companyname,
		v_number : results[i].vendor_number,
		v_address : results[i].vendor_address,
		v_tax_id : results[i].vendor_tax_id,
		v_tax_reg : results[i].vendor_tax_reg,
		v_occup : results[i].vendor_occup,
		v_officer_num : results[i].vendor_officer_num,
		v_tax_code : results[i].vendor_tax_code,

		tot_net : total_net_amt,
		tot_gross : total_gross_amt,
		tot_wht : total_wht_amt
		
		
		});
		

		
		}
		
	}
		
		vendArr.push(vendObj);
	});
		
		return vendArr;


	}


function getSelection(dateFrom, dateTo, vendors, checkIfAllVendors, onlyActual) {

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('type', null, 'anyof', ['VendPymt'])
	filters[1] = new nlobjSearchFilter('custentity_ilo_include_in_shaam_report', 'vendor', 'anyof', ['1'])
	filters[2] = new nlobjSearchFilter('mainline', null, 'is', ['T'])

	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'trandate' );
	columns[1] = new nlobjSearchColumn( 'legalname', 'vendor' );
	columns[2] = new nlobjSearchColumn( 'internalid', 'vendor' ).setSort();
	columns[3] = new nlobjSearchColumn( 'entityid', 'vendor');
	columns[4] = new nlobjSearchColumn( 'address', 'vendor');
	columns[5] = new nlobjSearchColumn( 'custentityil_tax_payer_id', 'vendor');
	columns[6] = new nlobjSearchColumn( 'vatregnumber', 'vendor');
	columns[7] = new nlobjSearchColumn( 'custentityil_occupation_description', 'vendor');
	columns[8] = new nlobjSearchColumn( 'custbody_ilo_net_amount');
	columns[9] = new nlobjSearchColumn( 'custbody_ilo_gross_amount');
	columns[10] = new nlobjSearchColumn( 'custbody_ilo_wht_amount');
	columns[11] = new nlobjSearchColumn( 'custentityil_tax_officer_number', 'vendor');
	columns[12] = new nlobjSearchColumn( 'companyname', 'vendor');
	columns[13] = new nlobjSearchColumn( 'custentity_4601_defaultwitaxcode', 'vendor');

	
	if(onlyActual == 'T') {
		
		searchAWT.addFilter(new nlobjSearchFilter('custbody_ilo_wht_amount', null, 'isnot', '0.00'));	
	}
	
	//additional filters
	if(dateTo || dateFrom != '') {
	    var frompp = nlapiLoadRecord('accountingperiod', dateFrom);
	    var tpp = nlapiLoadRecord('accountingperiod', dateTo);
	    nlapiLogExecution('debug', 'getSelection', frompp.getFieldValue('startdate')+' - ' +tpp.getFieldValue('enddate'))
		searchAWT.addFilter(new nlobjSearchFilter('trandate', null, 'onorafter', frompp.getFieldValue('startdate')));
		searchAWT.addFilter(new nlobjSearchFilter('trandate', null, 'onorbefore', tpp.getFieldValue('enddate')));
	}
	
	if(vendors != '' || vendors != 'null' || vendors != 'undefined' || vendors != []) {
		
		searchAWT.addFilter(new nlobjSearchFilter('internalid', 'vendor', 'anyof', vendors));
	}
	
		var searchAWT = nlapiCreateSearch('vendorpayment', filters, columns)


	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchAWT.runSearch();
	var rs;
	var cols = searchAWT.getColumns();
	

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
					date : line.getValue('trandate'),
					legalname : line.getValue('legalname', 'vendor'),
					companyname : line.getValue('companyname', 'vendor'),
					vendor_internalid : line.getValue('internalid', 'vendor'),
					vendor_number : line.getValue('entityid', 'vendor'),
					vendor_address : line.getValue('address', 'vendor'),
					vendor_tax_id : line.getValue('custentityil_tax_payer_id', 'vendor'),
					vendor_tax_reg : line.getValue('vatregnumber', 'vendor'),
					vendor_occup : line.getText('custentityil_occupation_description', 'vendor'),
					vendor_officer_num : line.getText('custentityil_tax_officer_number', 'vendor'),
					vendor_tax_code : getWHT_TaxCode(line.getValue('custentity_4601_defaultwitaxcode', 'vendor')),
					bill_amt : line.getValue('custbody_ilo_net_amount'),
					bill_gross : line.getValue('custbody_ilo_gross_amount'),
					bill_wht : line.getValue('custbody_ilo_wht_amount')
						
		});

		});

	};
	
	return theResults;
}


function getSelectionAllVendors(dateFrom, dateTo, onlyActual) {

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('type', null, 'anyof', ['VendPymt'])
	filters[1] = new nlobjSearchFilter('custentity_ilo_include_in_shaam_report', 'vendor', 'anyof', ['1'])
	filters[2] = new nlobjSearchFilter('mainline', null, 'is', ['T'])

	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'trandate' );
	columns[1] = new nlobjSearchColumn( 'legalname', 'vendor' );
	columns[2] = new nlobjSearchColumn( 'internalid', 'vendor' ).setSort();
	columns[3] = new nlobjSearchColumn( 'entityid', 'vendor');
	columns[4] = new nlobjSearchColumn( 'address', 'vendor');
	columns[5] = new nlobjSearchColumn( 'custentityil_tax_payer_id', 'vendor');
	columns[6] = new nlobjSearchColumn( 'vatregnumber', 'vendor');
	columns[7] = new nlobjSearchColumn( 'custentityil_occupation_description', 'vendor');
	columns[8] = new nlobjSearchColumn( 'custbody_ilo_net_amount');
	columns[9] = new nlobjSearchColumn( 'custbody_ilo_gross_amount');
	columns[10] = new nlobjSearchColumn( 'custbody_ilo_wht_amount');
	columns[11] = new nlobjSearchColumn( 'custentityil_tax_officer_number', 'vendor');
	columns[12] = new nlobjSearchColumn( 'companyname', 'vendor');
	columns[13] = new nlobjSearchColumn( 'custentity_4601_defaultwitaxcode', 'vendor');

	
		var searchAWT = nlapiCreateSearch('vendorpayment', filters, columns)
	
	if(onlyActual == 'T') {
		
		searchAWT.addFilter(new nlobjSearchFilter('custbody_ilo_wht_amount', null, 'isnot', '0.00'));	
	}
	
	//additional filters
	if(dateTo || dateFrom != '') {
	    var frompp = nlapiLoadRecord('accountingperiod', dateFrom);
	    var tpp = nlapiLoadRecord('accountingperiod', dateTo);
	    nlapiLogExecution('debug', 'getSelection', frompp.getFieldValue('startdate')+' - ' +tpp.getFieldValue('enddate'))
		searchAWT.addFilter(new nlobjSearchFilter('trandate', null, 'onorafter', frompp.getFieldValue('startdate')));
		searchAWT.addFilter(new nlobjSearchFilter('trandate', null, 'onorbefore', tpp.getFieldValue('enddate')));
	}

	var allBills = [];
	var selection =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchAWT.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allBills.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allBills != null) {
				allBills.forEach(function(line) {
					
					selection.push({
					
					vendor_internalid : line.getValue('internalid', 'vendor'),

					
					
					});
				
					
					
				});

			};
			
			return selection;

	}


function downloadData(data, response, form) {
    // set content type, file name, and content-disposition (inline means display in browser)
	response.setEncoding('UTF-8');
    response.setContentType('PLAINTEXT', 'test.txt');
    // write response to the client
    response.write(data);
}

function downloadDataPDF(data, response, form) {
	
	var file = nlapiXMLToPDF( data );
//	response.setEncoding('windows-1252');
	response.setContentType('PDF','AWT Vendor Certificates.pdf');
	response.write( file.getValue() ); 

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



function getTotals(arr) {

	var arrTotal = [];
	var theTotal;

	for (var i = 0; i < arr.length; i++) {

		if (arr[i] == "") {

			continue;
		}
		arrTotal.push(parseFloat(arr[i]))
	}

	theTotal = arrTotal.reduce(add, 0).toFixed(2);

	function add(a, b) {
		return a + b;
	}

	return theTotal;

}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


function formatNumber (num) {


	var numStr = num.toString();
	var res = numStr.split(".");
	
	var scndPart = res[1];
	
if(scndPart == undefined) {
	
	scndPart = '00';
}
	
	var firstPart = res[0].toString();
	
	var secondPart = parseInt(scndPart, 2);
//	
	var frstPrt = firstPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	

	
    return frstPrt+'.'+scndPart;
	
//	return num.toString();
}


function getWHT_TaxCode(value) {

      var taxcodeName = ''

      for (var i = 0; i < taxcodes.length; i++) {

            if (taxcodes[i].internalid == value) {

                  taxcodeName = taxcodes[i].name
            }

      }


      return taxcodeName;
}



function getAllTaxCodes() {

      var columns = new Array();
      columns[0] = new nlobjSearchColumn('custrecord_4601_wtc_name');
      columns[1] = new nlobjSearchColumn('internalid');

      var searchFAM = nlapiCreateSearch('customrecord_4601_witaxcode', null,
                  columns)

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

                        name : line.getValue(cols[0]),
                        internalid : line.getValue(cols[1]),

                  });

            });

      }
      ;

      return theResults;

}

function getAccountingPeriods() {

	var allResults = [];

	var filters = new Array();
    filters[0] = new nlobjSearchFilter('startdate', null, 'notbefore', '01/01/2016');



	var columns = new Array();
    columns[0] = new nlobjSearchColumn('periodname');
	columns[1] = new nlobjSearchColumn('internalid');
	columns[2] = new nlobjSearchColumn('startdate').setSort();
						


	var searchresults = nlapiSearchRecord('accountingperiod', null, filters, columns);
	
		if (searchresults != null) {
		searchresults.forEach(function(line) {

			allResults.push({
				periodname : line.getValue('periodname'),
				periodID : line.getValue('internalid')
			});

		});
	}

return allResults;
};



function findTemplate() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name', 'file');
	cols[1] = new nlobjSearchColumn('internalid', 'file');

	var fils = new Array();
	fils[0] = new nlobjSearchFilter('name', null, 'is', 'IL_Files')	
	fils[1]	= new nlobjSearchFilter('name', 'file', 'is', 'awt_template_xml.xml')	


	var s = nlapiSearchRecord('folder', null, fils, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {

			resultsArr.push({
				file_name : s[i].getValue('name', 'file'),
				file_id : s[i].getValue('internalid', 'file')
			});
		}
	}

return resultsArr[0].file_id;

}