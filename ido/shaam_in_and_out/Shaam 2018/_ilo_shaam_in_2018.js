/**
 * Module Description
 * 
 * Version Date Author Remarks 1.00 06 Nov 2016 idor
 * 
 */


var whatFormat;

var dateMMDD = '3/31/17';

var check = nlapiStringToDate(dateMMDD);

whatFormat = isNaN(check);

//if false = MM-DD-YY
//if true = DD-MM-YY

var VAT_mismatch = [];
var noCert = [];

var allVendors;

function shaam_in(request, response) {
	if (request.getMethod() == 'GET') {
		var form = nlapiCreateForm('Upload Shaam File');
		
		var fileField = form.addField('file', 'file', 'Select File');
		var subsidSelect = form.addField('subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY');

	   
		fileField.setMandatory(true);
		subsidSelect.setMandatory(true);

		form.addSubmitButton();
		form.addResetButton();
		response.writePage(form);

	} else {
		  var Subsidiary = request.getParameter("subsidiary");
		  allVendors = vendSearchAll(Subsidiary);

		// / here we get all vendor IDs and vendor VatRegNo from the system and
		// put them into respective arrays
		var vID = '';
		var vVRN = '';
		var allVendorsID = [];
		var allVendorsVRN = [];
		var expiredCertifs = [];

		function vendSearch() {
			
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('subsidiary', null, 'is', Subsidiary);
			filters[1] = new nlobjSearchFilter('custentity_ilo_include_in_shaam_report', null, 'noneof', '2');
			var columns = new Array();
			columns[0] = new nlobjSearchColumn('vatregnumber');

			var search = nlapiSearchRecord('vendor', null, filters, columns);
			search.forEach(function(ven) {

				allVendorsID.push(ven.id);
				allVendorsVRN.push(ven.getValue('vatregnumber'));

			});

		}
		vendSearch();

		var vendCounter = 0;
		
		// /here we get all WHT Certificates from the system and create an array
		// where the index is the vendor ID
		// if there are no certificates, myHash === [];
		var myHash = [];

		var whtCertFromDate = '';
		var whtCertEndDate = '';
		var whtCertPercent = '';

		var whtCertcolumns = new Array();
		whtCertcolumns[0] = new nlobjSearchColumn(
				'custrecord_vendor_cert_fromdate');
		whtCertcolumns[1] = new nlobjSearchColumn(
				'custrecord_vendor_cert_enddate');
		whtCertcolumns[2] = new nlobjSearchColumn(
				'custrecord_vendor_cert_percent');
		whtCertcolumns[3] = new nlobjSearchColumn(
				'custrecord_vendor_cert_vendorid');
		whtCertcolumns[4] = new nlobjSearchColumn('internalid').setSort();


		var whtCertsearch = nlapiSearchRecord('customrecord_oil_vendor_cert',
				null, null, whtCertcolumns);

		if (whtCertsearch != null) {
			whtCertsearch.forEach(function(whtCert) {
				
				myHash[whtCert.getValue('custrecord_vendor_cert_vendorid')] = {
					whtCertFromDate : whtCert
							.getValue('custrecord_vendor_cert_fromdate'),
					whtCertEndDate : whtCert
							.getValue('custrecord_vendor_cert_enddate'),
					whtCertPercent : whtCert
							.getValue('custrecord_vendor_cert_percent')
				};
				
				
			});

		};
		

		// here we create the array for all of the transaction lines from the
		// shaam file
		var shaamUpdates = [];
		var file = request.getFile("file");
		file.setEncoding('UTF-8');
		var fileContent = file.getValue();

		

       var arrLines = fileContent.split("B", 1000);
 
     
      for (var line = 1; line < arrLines.length; line++) {


          shaamUpdates.push({
              vendorID: arrLines[line].substr(9, 6),
              vendorTaxRegNo: arrLines[line].substr(42, 9),
              alt_vendorTaxRegNo : arrLines[line].substr(24, 9),
              BKCert: arrLines[line].substr(73, 1),
              taxPercent: arrLines[line].substr(74, 10),
            
               BKBeginDate: convertShaamDate(arrLines[line].substr(84, 8)),
              BKExpDate: convertShaamDate(arrLines[line].substr(92, 8))
          });

      
      };
  


		var containsID = '';
		var containsVRN = '';
		var containsAltVRN = '';
		

		// here we are looping over all the objects in the shaamUpdates Array
		for (var i = 0; i < shaamUpdates.length ; i++) {
			
			//for vendor id's that are longer than 4 digits
	    	  shaamUpdates[i].vendorID = shaamUpdates[i].vendorID.replace(/\s/g, "");
	    	  
	    	  var vID = shaamUpdates[i].vendorID;
	    	  
	    	  
	    	  var vendTaxReg = shaamUpdates[i].vendorTaxRegNo;
	    	  var alt_vendTaxReg = shaamUpdates[i].alt_vendorTaxRegNo;
	    	  
//	    	  if(vendTaxReg.charAt(0) === '0') {		
//	    		  vendTaxReg = vendTaxReg.substr(1);
//	    		  shaamUpdates[i].vendorTaxRegNo = vendTaxReg
//	    	  }
//	    	  if(alt_vendTaxReg.charAt(0) === '0') {		
//	    		  alt_vendTaxReg = alt_vendTaxReg.substr(1);
//	    		  shaamUpdates[i].alt_vendorTaxRegNo = alt_vendTaxReg
//	    	  }
	

//			if(vID.endsWith('0')) {
//				vID = vID.substring(0, vID.length - 1);
//			}
//			if(vID.charAt(3) == '3') {
//				vID = vID;
//			}
			
//			if(vID.charAt(4) == '3') {
//			vID = vID;
//			}
//			if()

		
			
			var vendID = vID;
			var vendVRN = shaamUpdates[i].vendorTaxRegNo;
			var altVendCRN = shaamUpdates[i].alt_vendorTaxRegNo;
			var vendBKCert = shaamUpdates[i].BKCert;
			var vendBKBdate = shaamUpdates[i].BKBeginDate;
			var vendBKExpdate = shaamUpdates[i].BKExpDate;
			var vendPercent = shaamUpdates[i].taxPercent;
			
			
			 //this if statement for vendors that have a "tik
			 //meshutaf"
			if(vendVRN == '000000000') {
				vendVRN = altVendCRN;
			}

			
            // /checks if expdate is valid or not - (skip this line)
          if ((vendBKExpdate == "//0000") || vendBKExpdate == "//0000" ) {
        	  
        	  noCert.push(shaamUpdates[i]);
              continue;
              
             
          }
          

          

			function formatVendPercent() {
				// checks if percent is '9900009999' (if true change
				// value to 0)
				// if there is a percent then turn value to correct
				// format(single digit, double digit & fractions of
				var d = '0099';
				var otherd = '9900000000';

				if (vendPercent.match(d)) {
					vendPercent = 0;
				}
					else if(vendPercent.match(otherd)) {
						vendPercent = 0;
					
				} else {
					

					var res = vendPercent.substr(0, 5);
					var a = parseFloat(res) / 1000;
					vendPercent = a;
		
				}
			}
			formatVendPercent();
	
			if(vendPercent > 50) { //if percent is bigger than 50 - skip (99% issue)
				// rejects.push(shaamUpdates[i])
				continue;
				
				nlapiLogExecution('DEBUG', 'Check Vendor', 'Check VendorID : ' +vendID+ 'vendPercent : '+vendPercent);
			}
			
	//*******************************************************************************************************************//		
	//****this runs only when it is the first time running shaamIn scripts (no checks just adds new WHT certs for all)***//
	//*******************************************************************************************************************//	

			if(Object.keys(myHash).length == '0') {	
				//nlapiLogExecution("DEBUG", "myhashisempty", "true");
				var WHTCertfirst = nlapiCreateRecord('customrecord_oil_vendor_cert');
				WHTCertfirst.setFieldValue("name", vendID + ' WHT Certificate');
				WHTCertfirst.setFieldValue(
						"custrecord_vendor_cert_vendorid", vendID);
				WHTCertfirst.setFieldValue(
						"custrecord_vendor_cert_percent", vendPercent);
				WHTCertfirst.setFieldValue(
						"custrecord_vendor_cert_fromdate", vendBKBdate);
				WHTCertfirst.setFieldValue(
						"custrecord_vendor_cert_enddate", vendBKExpdate);

				nlapiSubmitRecord(WHTCertfirst);
				
				
				// get fields and values to change on vendor-level form
				var fields = new Array();
				var values = new Array();
				fields[0] = 'custentityil_bookkeeping_certification';
				values[0] = '2';
				fields[1] = 'custentityil_expiry_date';
				values[1] = vendBKExpdate;
				fields[2] = 'custentity_ilo_shaam_update';
				values[2] = 'T';
				 //update and submit vendor-level form
				var updatefields = nlapiSubmitField('vendor', parseInt(vendID),
						fields, values, 'T');
				
		//*******************************************************************************************************************//		
		//*******************************************************************************************************************//
		//*******************************************************************************************************************//			
			}else{
				
				try{
					
			
			//here we check if vendorID && vendorVRN match values from file recieved from SHAAM
			containsID = allVendorsID.indexOf(vendID);
			containsVRN = allVendorsVRN.indexOf(vendVRN);
			containsAltVRN = allVendorsVRN.indexOf(vendVRN);
			
			
			if(containsID && (containsVRN || containsAltVRN) == -1) {
				
				VAT_mismatch.push(shaamUpdates[i])
			}
			
						
			if(containsID && (containsVRN || containsAltVRN) != -1) {
				
				if (myHash.hasOwnProperty(parseInt(vendID)) == false
						|| (vendPercent != parseInt(myHash[parseInt(vendID)].whtCertPercent))
						|| (vendBKBdate != myHash[parseInt(vendID)].whtCertFromDate)
						|| (vendBKExpdate != myHash[parseInt(vendID)].whtCertEndDate)){
			

					var WHTCertfirst = nlapiCreateRecord('customrecord_oil_vendor_cert');
					WHTCertfirst.setFieldValue("name", vendID + ' WHT Certificate');
					WHTCertfirst.setFieldValue(
							"custrecord_vendor_cert_vendorid", vendID);
					WHTCertfirst.setFieldValue(
							"custrecord_vendor_cert_percent", vendPercent);
					WHTCertfirst.setFieldValue(
							"custrecord_vendor_cert_fromdate", vendBKBdate);
					WHTCertfirst.setFieldValue(
							"custrecord_vendor_cert_enddate", vendBKExpdate);

					nlapiSubmitRecord(WHTCertfirst);

					
					// get fields and values to change on vendor-level form
					var fieldstwo = new Array();
					var valuestwo = new Array();
					fieldstwo[0] = 'custentityil_bookkeeping_certification';
					valuestwo[0] = '2';
					fieldstwo[1] = 'custentityil_expiry_date';
					valuestwo[1] = vendBKExpdate;
					fieldstwo[2] = 'custentity_ilo_shaam_update';
					valuestwo[2] = 'T';
//					 update and submit vendor-level form
					var updatefieldsSecond = nlapiSubmitField('vendor', parseInt(vendID),
							fieldstwo, valuestwo, 'T');
	
				}
				else {
					if ((vendPercent == parseInt(myHash[parseInt(vendID)].whtCertPercent))
							&& (vendBKBdate == myHash[parseInt(vendID)].whtCertFromDate)
							&& (vendBKExpdate == myHash[parseInt(vendID)].whtCertEndDate)) {
						continue;
					}
				}
						
				}	//end of contains if statement
			
				}
				catch(err){
					nlapiLogExecution('debug', 'err updating', err)
				}
			
			
			} // end of else(part where the check is made on existing WHT certs and whether or not to add a new one)
			   
		} // end of loop over shaamUpdates
		
		var endForm = nlapiCreateForm('Shaam Updated');
		

		var totalrecs = JSON.stringify(shaamUpdates.length);
		var totalupdates = shaamUpdates.length - (VAT_mismatch.length+noCert.length);
		var totalmismatches = JSON.stringify(VAT_mismatch.length);
		var totalnocerts = JSON.stringify(noCert.length);
		
		
	var mismatchSubList = endForm.addSubList('custpage_mismatch_sublist', 'list', 'Discrepancies', null);
	var noCertSubList = endForm.addSubList('custpage_nocert_sublist', 'list', 'No Certifications', null);
		
	 var htmlField1 = endForm.addField('custpage_header1', 'inlinehtml');
	 htmlField1.setDefaultValue("<span style='font-size:18px'>Total vendors loaded : <b>"+totalrecs+"</b><br></span>" +
	 		"<span style='font-size:18px'>Total vendors checked/updated : <b>"+totalupdates+"</b><br></span>" +
	 		"<span style='font-size:18px'>Total vendors with discrepancies : <b>"+totalmismatches+"</b><br></span>" +
	 		"<span style='font-size:18px'>Total vendors without certifications : <b>"+totalnocerts+"</b><br><br></span>" +
	 		"<span style='font-size:18px'><u>Discrepancies:</u> The vendor's VAT Registration number or Tax Payer ID contradicts values held in Israel Tax Authority's records.<br><br>" +
	 		"<u>No Certification:</u> The vendor does not have a valid book-keeping certificate in Israel Tax Authority's records</span>");
	 	
	
		var res_view_mismatch = mismatchSubList.addField('custpage_vendor_view_mismatch', 'url',' ');
		res_view_mismatch.setLinkText('View');
		var res_vendorName = mismatchSubList.addField('custpage_vendor_name_mismatch', 'text','Vendor ID');
		var res_vendorVatReg = mismatchSubList.addField('custpage_vendor_vatreg_mismatch', 'text','VAT Registration #');
		var res_vendorPayerID = mismatchSubList.addField('custpage_vendor_taxpayerid_mismatch', 'text', 'Tax Payer ID');

		
		var res_view_noCert = noCertSubList.addField('custpage_vendor_view_nocert', 'url',' ');
		res_view_noCert.setLinkText('View');
		var res_vendorName_nocert = noCertSubList.addField('custpage_vendor_name_nocert', 'text','Vendor ID');

	if(VAT_mismatch.length > 0){	
for(var i = 0; i<VAT_mismatch.length; i++) {
	mismatchSubList.setLineItemValue('custpage_vendor_view_mismatch',i+1 ,vendorView(VAT_mismatch[i].vendorID));
	mismatchSubList.setLineItemValue('custpage_vendor_name_mismatch',i+1 ,getVendorName(VAT_mismatch[i].vendorID));	
	mismatchSubList.setLineItemValue('custpage_vendor_vatreg_mismatch',i+1 ,VAT_mismatch[i].vendorTaxRegNo);
	mismatchSubList.setLineItemValue('custpage_vendor_taxpayerid_mismatch',i+1 ,VAT_mismatch[i].alt_vendorTaxRegNo);
}
	}
	
	if(noCert.length > 0){	
		for(var x = 0; x<noCert.length; x++) {
			noCertSubList.setLineItemValue('custpage_vendor_view_nocert',x+1 ,vendorView(noCert[x].vendorID));
			noCertSubList.setLineItemValue('custpage_vendor_name_nocert',x+1 ,getVendorName(noCert[x].vendorID));	
		}
			}
	

	} // end of main else

	//var all = JSON.stringify(Object.keys(myHash));
	
	var v = nlapiGetContext();
	var y = v.getRemainingUsage();
	nlapiLogExecution('debug', 'usage-remaining', y)

	var mismatch = JSON.stringify(VAT_mismatch);
	var no_Cert = JSON.stringify(noCert)
	//var all = JSON.stringify(Object.keys(myHash));
	response.writePage(endForm);

}; // end of upload_update_shaam function

function convertShaamDate(a) {
	var dateYear = a.substring(0, 4);
	var dateMonth = a.substring(4, 6);
	var dateMonthFix = dateMonth.replace(/^0+/, '');
	var dateDay = a.substring(6, 8);
	var dateDayFix = dateDay.replace(/^0+/, '');
	var res = dateDayFix.concat('/' + dateMonthFix );
	if(whatFormat == false) {
		res = dateMonthFix.concat('/' + dateDayFix );
	}
	var fullDate = res.concat('/' + dateYear);
	return fullDate;
}





//polyfill for endsWith()
if (!String.prototype.endsWith) {
	  String.prototype.endsWith = function(searchString, position) {
	      var subjectString = this.toString();
	      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
	        position = subjectString.length;
	      }
	      position -= searchString.length;
	      var lastIndex = subjectString.lastIndexOf(searchString, position);
	      return lastIndex !== -1 && lastIndex === position;
	  };
	}

function getILS() {

	var currencies = [];
	var ILS;

	var filters = new Array();
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('name');
	columns[0] = new nlobjSearchColumn('symbol');

	var search = nlapiSearchRecord('currency', null, filters, columns);

	if (search != null) {

		for (var i = 0; i < search.length; i++) {

			currencies.push({
				currency_id : search[i].id,
				currency_name : search[i].getValue('name'),
				currency_ISO : search[i].getValue('symbol')
			});
		}
	}

	for (var x = 0; x < currencies.length; x++) {

		if (currencies[x].currency_ISO == "ILS") {

			ILS = currencies[x].currency_id;
		}

	}

	return ILS;
}

function vendorView(checkid) {
	
	try{
		
		var viewURL;
		
		viewURL = "https://system.eu1.netsuite.com" + nlapiResolveURL( 'RECORD', 'vendor', checkid);
		
		return viewURL;
	}
	catch(err) {
		var empty = '';
		nlapiLogExecution('DEBUG', 'transactionView err', err);
		return empty;
	}
	
}

function getVendorName(checkid) {
	
	try{
		
		var name = '';
		
	for(var i = 0; i<allVendors.length; i++) {
		
		if(checkid == allVendors[i].internalid) {
			
			name = allVendors[i].vendorName
		}
	}
		
		return name;
	}
	catch(err) {
		var empty = '';
		nlapiLogExecution('DEBUG', 'getVendorName err', err);
		return empty;
	}
	
}




function vendSearchAll(Subsidiary) {

	var filters = new Array();
		filters[0] = new nlobjSearchFilter('subsidiary', null, 'is', Subsidiary);
		filters[1] = new nlobjSearchFilter('custentity_ilo_include_in_shaam_report', null, 'noneof', '2');
		
		
	var columns = new Array();
		columns[0] = new nlobjSearchColumn('vatregnumber');
		columns[1] = new nlobjSearchColumn('internalid');
		columns[2] = new nlobjSearchColumn('entityid');
		columns[3] = new nlobjSearchColumn('companyname');



var searchVendors = nlapiCreateSearch('vendor', filters, columns)

	var allVendors = [];
	var vendors =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchVendors.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allVendors.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allVendors != null) {
				allVendors.forEach(function(line) {
					
					vendors.push({
					
					internalid : line.getValue('internalid'),
					vendorName : line.getValue('entityid')+" "+line.getValue('companyname')
					
					});
				
					
					
				});

			};
			
			return vendors;



}
			
			
		