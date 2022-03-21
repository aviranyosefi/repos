	
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
		selectPeriodFrom.setDefaultValue('120')

		var selectPeriodTo = form.addField('custpage_select_periodto','select', 'To Period', null, 'custpage_search_group');
		selectPeriodTo.setMandatory( true );
		selectPeriodTo.addSelectOption('', '');
		for(var i = 0; i<accPeriods.length; i++) {
			selectPeriodTo.addSelectOption(accPeriods[i].periodID, accPeriods[i].periodname);
		}
		selectPeriodTo.setDefaultValue('134')
		
	        var selectSubsidiary = form.addField('custpage_select_subsidiary', 'select', 'Subsidary', 'SUBSIDIARY', 'custpage_search_group');
	        selectSubsidiary.setMandatory(true);
	        try
	        {
	            var subsid = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_il_subsidiary')

	            selectSubsidiary.setMandatory(true);
	            selectSubsidiary.setDefaultValue(subsid);
	        }
	        catch (e)
	        { }
	
		
		var selectOnlyActual = form.addField('custpage_select_only_actual', 'checkbox', 'Only if deducted in actual', null, 'custpage_vendor_group');
		selectOnlyActual.setLayoutType('normal', 'startcol')
		var selectVendor = form.addField('custpage_select_vendor','multiselect', 'Vendor', 'VENDOR', 'custpage_vendor_group');
		response.writePage(form);

		}//end of first if
	
	else{
		
		try{
			
		
		 var getUserMail = nlapiGetContext().getEmail();
		 var getUserID =  nlapiGetContext().getUser();
		 var getSubsid = request.getParameter('custpage_select_subsidiary')
		 
		 var fromPeriod = request.getParameter('custpage_select_periodfrom')
		 var toPeriod = request.getParameter('custpage_select_periodto')
		 
		 var onlyActual = request.getParameter('custpage_select_only_actual')
		 var selectedVendors = request.getParameter('custpage_select_vendor')
		 var range = fromPeriod+'-'+toPeriod
		 
		 var checkIfSingleVendor = selectedVendors.split('')

		 var filteredArr = checkIfSingleVendor.filter(function (el) {
			  return el != "";
			});
		 
		 nlapiLogExecution('debug', 'filtered', filteredArr.length)
		 var isSingleVendor = false;
		 if(filteredArr.length === 1){
			 isSingleVendor = true;
		 }
		 
		 if(!isSingleVendor) {
			
			 var sendForm = nlapiCreateForm('Creating AWT Reports...');
			 

			 nlapiLogExecution('debug', 'isSingleVendor', isSingleVendor)
			
			 var htmlField1 = sendForm.addField('custpage_header1', 'inlinehtml');
			 htmlField1.setDefaultValue("<span style='font-size:18px'>An email with the documents will be sent to : <b> " +getUserMail+ "</b> once completed.<br></span>"); 

				
				 var params = {custscript_ilo_awt_range: range,
								custscript_ilo_awt_email : getUserMail,
								custscript_ilo_awt_sender : getUserID,
								custscript_ilo_awt_subsid : getSubsid,
								custscript_ilo_awt_vendors : selectedVendors,
								custscript_ilo_awt_onlyactual : onlyActual};
				 
				 nlapiScheduleScript('customscript_ilo_awt_scheduled', 'customdeploy_ilo_awt_scheduled', params);
			
			response.writePage(sendForm);
		 }
		 
		 if(isSingleVendor) {
			 
			 var singleVendor = getSelection(fromPeriod, toPeriod, filteredArr[0]);
			 
			 var oneVendor = getOneVendor(filteredArr[0], singleVendor)
			 
			 	
	function separate(oneVendor) {
		
		var oneArr = [];
		for (var i = 0; i < oneVendor.length; i++) {
			
			var one = returnOne(oneVendor[i]);
			oneArr.push(one);

		}

		function returnOne(arr) {
			return arr[0];
		}
		return oneArr;
	}
			
	
			var separateReports = separate(oneVendor);
	
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
			
	nlapiLogExecution('debug', 'separateReports', JSON.stringify(separateReports, null, 2))


			
			
			printSingleVendor(separateReports, getSubsid, fromPeriod, toPeriod,response)
			
	
		 }
		 
		}catch(err){
			
	  		 	var errorForm = nlapiCreateForm('AWT Reports For Vendors - Error');
	    		var htmlHeader = errorForm.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
	    		htmlHeader.setDefaultValue("<p style='font-size:20px'>No results were returned for this vendor. Please check parameters and try again.</p>");
	    		
	    		response.writePage(errorForm)
			
		}
		 

		
	}
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

function getSelection(dateFrom, dateTo, vendors) {
	
	nlapiLogExecution('debug', 'inSearch - dateFrom', dateFrom)
	nlapiLogExecution('debug', 'inSearch - dateTo', dateTo)
	nlapiLogExecution('debug', 'inSearch - vendors', vendors)

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('type', null, 'anyof', ['VendPymt'])
	filters[1] = new nlobjSearchFilter('custentity_ilo_include_in_shaam_report', 'vendor', 'anyof', ['1'])
	filters[2] = new nlobjSearchFilter('mainline', null, 'is', ['T'])
	filters[3] = new nlobjSearchFilter('internalid', 'vendor', 'anyof', vendors)

	
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
		
	//additional filters
	if(dateTo || dateFrom != '') {
	    var frompp = nlapiLoadRecord('accountingperiod', dateFrom);
	    var tpp = nlapiLoadRecord('accountingperiod', dateTo);
	    nlapiLogExecution('debug', 'getSelection', frompp.getFieldValue('startdate')+' - ' +tpp.getFieldValue('enddate'))
		searchAWT.addFilter(new nlobjSearchFilter('trandate', null, 'onorafter', frompp.getFieldValue('startdate')));
		searchAWT.addFilter(new nlobjSearchFilter('trandate', null, 'onorbefore', tpp.getFieldValue('enddate')));
	}
	

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

function getOneVendor(vendor, results) {

	var vendArr = [];

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

		
		return vendArr;

	}



function printSingleVendor(oneVendor, subsidRec, fromDate, toDate, response){
	

	var subsid = nlapiLoadRecord('subsidiary', subsidRec)
	var companyLogo = subsid.getFieldValue('pagelogo');
	var logoUrl = nlapiLoadFile(companyLogo).getURL()
		
	var payerName = subsid.getFieldValue('name');
	var payerAddress = subsid.getFieldValue('mainaddress_text');
	var payerTikNikuim = subsid.getFieldValue('custrecordil_tiknik');
	var payerTaxID = subsid.getFieldValue('custrecordil_tax_payer_id_subsidary');
	
	var templateID = findTemplate()
	
	var temp = nlapiLoadFile(templateID).getValue();
	var a = temp.toString();
//get head tag 
	var first_headTag = a.indexOf("head") -1 ; 
    var end_headTag = a.indexOf("/head") +6 ; 
	var head_tag = a.substr(first_headTag, end_headTag - first_headTag);
	
////get table tag (actual template of invoice)
	var first_tableTag = a.indexOf("table class") -4 ;
	var end_tableTag = a.indexOf("/body") -1;
	
	var inv_template = a.substr(first_tableTag, end_tableTag - first_tableTag);

	
////concatenate all parts of xml file	
	var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
	xml += "<pdf>";
						
	xml += head_tag + '<body padding="0.2in 0.5in 0.5in 0.5in" size="A4">';
	
	
	nlapiLogExecution('debug', 'in print single vendor', JSON.stringify(oneVendor, null, 2))
	var vendor = oneVendor;              
	

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
			
			
		}
			
			
			
			
		catch(e) {
			nlapiLogExecution('ERROR', 'error pdfbuild', e);
		}
			
		}
	
	xml = xml += '</body></pdf>';


	downloadDataPDF(xml, response, vendor[0].v_legalname)
	//var fileID = downloadDataPDF(xml)
	


function downloadDataPDF(data, response, vendorname) {
	
	var file = nlapiXMLToPDF( data );
	response.setEncoding('UTF-8');
	response.setContentType('PDF', 'AWT Vendor Letter.pdf');
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
	nlapiLogExecution('debug', 'getTotals - arr', JSON.stringify(arr))
	 var filteredArr = arr.filter(function (el) {
		  return el != "";
		});
	

	for (var i = 0; i < filteredArr.length; i++) {

		if (filteredArr[i] == "") {

			continue;
		}
		arrTotal.push(parseFloat(filteredArr[i]))
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

function getAllFiles() {

	var awtFolder = findFolder()

	var folder = awtFolder // the folder ID we care about

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
				

			theResults.push({

				filename : line.getValue(columns[0]),
				fileid : line.getValue(columns[1]),


			});

			});

		};
		


		return theResults;

	}

function findFolder() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('internalid');
	var fils = new Array();;
	fils[0] = new nlobjSearchFilter('name', null, 'is', 'AWT Vendor Letters')		

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