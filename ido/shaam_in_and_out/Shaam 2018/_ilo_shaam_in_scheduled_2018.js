
var currentContext = nlapiGetContext();

var whatFormat;

var dateMMDD = '3/31/17';

var check = nlapiStringToDate(dateMMDD);

whatFormat = isNaN(check);

//if false = MM-DD-YY
//if true = DD-MM-YY

var VAT_mismatch = [];
var noCert = [];

var allVendors;

function shaam_in_scheduled(type) {
	
	var dstart = new Date();
	
	var shaamFile = currentContext.getSetting('SCRIPT', 'custscript_ilo_shaam_file');
	var emailToUse = currentContext.getSetting('SCRIPT', 'custscript_ilo_shaam_email')
	var senderToUse = currentContext.getSetting('SCRIPT', 'custscript_ilo_shaam_sender')
	var subsidToUse = currentContext.getSetting('SCRIPT', 'custscript_ilo_shaam_subsid')
	
	nlapiLogExecution('debug', 'shaamFile', shaamFile)
	nlapiLogExecution('debug', 'emailToUse', emailToUse)
	nlapiLogExecution('debug', 'subsidToUse', subsidToUse)
	nlapiLogExecution('debug', 'senderToUse', senderToUse)
	
	
	  allVendors = vendSearchAll(subsidToUse);

	// / here we get all vendor IDs and vendor VatRegNo from the system and
	// put them into respective arrays
	var vID = '';
	var vVRN = '';
	var allVendorsID = [];
	var allVendorsVRN = [];
	var expiredCertifs = [];

	function vendSearch() {
		
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('subsidiary', null, 'is', subsidToUse);
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
	var file = nlapiLoadFile(shaamFile)
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

	    var dnow = new Date();
	    var timeexe = (dnow - dstart) / 1000 / 3600;
	    if (currentContext.getRemainingUsage() < 800 || timeexe >= 0.2) {
	        var state = nlapiYieldScript();
	        if (state.status == 'FAILURE') {
	            nlapiLogExecution('ERROR', 'Error', ' Failed to yield script _ilo_shaam_in_scheduled');
	        }
	        else if (state.status == 'RESUME') {
	            nlapiLogExecution("AUDIT", '_ilo_shaam_in_scheduled', "Resuming script due to: " + state.reason + ",  " + state.size);
	        }
	    }
		
		//for vendor id's that are longer than 4 digits
    	  shaamUpdates[i].vendorID = shaamUpdates[i].vendorID.replace(/\s/g, "");
    	  
    	  var vID = shaamUpdates[i].vendorID;
    	  
    	  
    	var vendTaxReg = shaamUpdates[i].vendorTaxRegNo;
    	var alt_vendTaxReg = shaamUpdates[i].alt_vendorTaxRegNo;

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
			
			try{
				
		
			
			if (myHash.hasOwnProperty(parseInt(vendID)) == false
					|| (vendPercent != parseInt(myHash[parseInt(vendID)].vendPercent))
					|| (vendBKBdate != myHash[parseInt(vendID)].whtCertFromDate)
					|| (vendBKExpdate != myHash[parseInt(vendID)].whtCertEndDate)){
				
				
				
				//nlapiLogExecution('debug', 'vendID to update', vendID)
				if(vendID == '1561') {
					nlapiLogExecution('debug', 'vendID 1561', vendID)
					nlapiLogExecution('debug', 'vendID vendPercent', vendPercent)
					nlapiLogExecution('debug', 'vendID vendBKBdate', vendBKBdate)
					nlapiLogExecution('debug', 'vendID vendBKExpdate', vendBKExpdate)
				}
		

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
//				 update and submit vendor-level form
				var updatefieldsSecond = nlapiSubmitField('vendor', parseInt(vendID),
						fieldstwo, valuestwo, 'T');

			}
			else {
				
				//nlapiLogExecution('debug', 'vendID else', vendID)
				
				if ((vendPercent == parseInt(myHash[parseInt(vendID)].whtCertPercent))
						&& (vendBKBdate == myHash[parseInt(vendID)].whtCertFromDate)
						&& (vendBKExpdate == myHash[parseInt(vendID)].whtCertEndDate)) {
					continue;
				}
			}
			}catch(err) {
				VAT_mismatch.push(shaamUpdates[i])
				nlapiLogExecution('debug', 'error caught - pushing to mismatch', err)
				continue;
			}
			}	//end of contains if statement
		
			}
			catch(err){
				nlapiLogExecution('debug', 'err updating', err)
			}
		
		
		} // end of else(part where the check is made on existing WHT certs and whether or not to add a new one)
		   
	} // end of loop over shaamUpdates
	
	
	//Set up for emailing results
	
	var totalrecs = JSON.stringify(shaamUpdates.length);
	var totalupdates = shaamUpdates.length - (VAT_mismatch.length+noCert.length);
	var totalmismatches = JSON.stringify(VAT_mismatch.length);
	var totalnocerts = JSON.stringify(noCert.length);
	
	
var emailSubject = 'Shaam In Completed - Results';
var emailBody = '';


var discrepHeader = '';
var noCertsHeader = '';
var discrepTable = '';
var noCertsTable = '';
var discrepLines = [];
var discrepLine = '';
var noCertLines = [];
var noCertLine = ''

var header = "<span style='font-size:21px'>Shaam In process : <b>completed</b>.<br><br></span>" +
	"<span style='font-size:18px'>Total vendors loaded : <b>"+totalrecs+"</b><br></span>" +
 		"<span style='font-size:18px'>Total vendors checked/updated : <b>"+totalupdates+"</b><br></span>" +
 		"<span style='font-size:18px'>Total vendors with discrepancies : <b>"+totalmismatches+"</b><br></span>" +
 		"<span style='font-size:18px'>Total vendors without certifications : <b>"+totalnocerts+"</b><br><br></span>";



if(VAT_mismatch.length > 0){	
	for(var i = 0; i<VAT_mismatch.length; i++) {
		 discrepLine = "<tr>" +
		 "<td data-attribute='internalid' style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'><a href = "+vendorView(VAT_mismatch[i].vendorID)+">View</a></td>"+
		 "<td data-attribute='asset' style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+getVendorName(VAT_mismatch[i].vendorID)+"</td>"+
		 "<td data-attribute='assettype' style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+VAT_mismatch[i].vendorTaxRegNo+"</td>"+
		 "<td data-attribute='assetdescription' style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+VAT_mismatch[i].alt_vendorTaxRegNo+"</td>"+
		 "</tr>";
		 discrepLines.push(discrepLine)
	}
	 discrepHeader = "<span style='font-size:18px'><u><b>Discrepancies:</b></u> The vendor's VAT Registration number or Tax Payer ID contradicts values held in Israel Tax Authority's records.</span>"

	var htmlLines = discrepLines.toString().replace(/,/g,'');
	
	 discrepTable = "<table style='width:100%; border-collapse: collapse; border: 1px solid black;'> "+
	 "<thead> "+
	 "<tr>"+
	 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>View Vendor</th>"+
	 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Vendor</th> "+
	 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Vat Registration #</th>"+
	 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Tax Payer ID</th>"+
	 "</tr>"+
	 "</thead> "+
	 htmlLines+
	 "</table><br><br>";
	
		}



if(noCert.length > 0){	
	for(var x = 0; x<noCert.length; x++) {
		noCertLine = "<tr>" +
		 "<td data-attribute='internalid' style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'><a href = "+vendorView(noCert[x].vendorID)+">View</a></td>"+
		 "<td data-attribute='asset' style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+getVendorName(noCert[x].vendorID)+"</td>"+
		 "</tr>";
		noCertLines.push(noCertLine)
	}
	 noCertsHeader = "<span style='font-size:18px'><u><b>No Certification:</b></u> The vendor does not have a valid book-keeping certificate in Israel Tax Authority's records.</span>"
	var htmlLines_noCert = noCertLines.toString().replace(/,/g,'');
	 
	 noCertsTable = "<table  style='width:100%; border-collapse: collapse; border: 1px solid black;'> "+
	 "<thead> "+
	 "<tr>"+
	 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>View Vendor</th>"+
	 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Vendor</th> "+
	 "</tr>"+
	 "</thead> "+

	 htmlLines_noCert+

	 "</table>";
		}



emailBody = header + discrepHeader + discrepTable + noCertsHeader + noCertsTable

//var tests1 = JSON.stringify(shaamUpdates, null, 2);
//var tests2 = JSON.stringify(myHash)
//nlapiSendEmail(senderToUse, emailToUse, emailSubject, tests1+'------'+tests2, null, null, null, null, null, null, null)
	nlapiSendEmail(senderToUse, emailToUse, emailSubject, emailBody, null, null, null, null, null, null, null)
	
	
}


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
		
		viewURL = "https://system.eu2.netsuite.com" + nlapiResolveURL( 'RECORD', 'vendor', checkid);
		
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
			
			
