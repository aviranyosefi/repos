/**
 * Module Description
 * 
 * Version Date Author Remarks 1.00 06 Nov 2016 idor
 * 
 */




function upload_update_shaam(request, response) {
	if (request.getMethod() == 'GET') {
		var form = nlapiCreateForm('Upload Shaam File');
		var fileField = form.addField('file', 'file', 'Select File');
		fileField.setMandatory(true);

		form.addSubmitButton();
		form.addResetButton();
		response.writePage(form);

	} else {

		// / here we get all vendor IDs and vendor VatRegNo from the system and
		// put them into respective arrays
		var vID = '';
		var vVRN = '';
		var allVendorsID = [];
		var allVendorsVRN = [];
		var expiredCertifs = [];

		function vendSearch() {
			
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('subsidiary', null, 'is', '1');
			filters[1] = new nlobjSearchFilter('currency', null, 'is', '5');
			filters[2] = new nlobjSearchFilter('custentity_ilo_include_in_shaam_report', null, 'noneof', '2');
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
		var stuff;
		
        var firstCutToBodyTag = fileContent.slice(161);
        var bodyTag = firstCutToBodyTag.substring(0, 8);

       if(bodyTag.indexOf('<BODY>') == 2) {

           stuff = firstCutToBodyTag.slice(36);
       }


       var arrLines = stuff.split("B", 247);
       arrLines.pop();
       var lastline = arrLines[arrLines.length-1];
       lastline = lastline.substring(0, lastline.indexOf('Z'));
      //arrLines.shift(lastline);
      
      for (var line = 1; line < arrLines.length; line++) {


          shaamUpdates.push({
              vendorID: arrLines[line].substr(9, 4),
              vendorTaxRegNo: arrLines[line].substr(37, 9),
              taxPercent: arrLines[line].substr(65, 10),
              BKCert: arrLines[line].substr(75, 1),
               BKBeginDate: convertShaamDate(arrLines[line].substr(76, 8)),
              BKExpDate: convertShaamDate(arrLines[line].substr(84, 8))
          });

      
      };
  


		var containsID = '';
		var containsVRN = '';
		

		// here we are looping over all the objects in the shaamUpdates Array
		for (var i = 0; i < shaamUpdates.length ; i++) {
			

			
			var vendID = shaamUpdates[i].vendorID;
			var vendVRN = shaamUpdates[i].vendorTaxRegNo;
			var vendBKCert = shaamUpdates[i].BKCert;
			var vendBKBdate = shaamUpdates[i].BKBeginDate;
			var vendBKExpdate = shaamUpdates[i].BKExpDate;
			var vendPercent = shaamUpdates[i].taxPercent;
			
			 //this if statement skips over vendors that have a "tik
			 //meshutaf"
//			if (shaamUpdates[i].vendorTaxRegNo == '000000000') {
//				continue;
//			}
			

			
            // /checks if expdate is valid or not - (skip this line)
          if (vendBKExpdate == "  /  /    ") {
              continue;
          }
          

          

			function formatVendPercent() {
				// checks if percent is '9900009999' (if true change
				// value to 0)
				// if there is a percent then turn value to correct
				// format(single digit, double digit & fractions of
				var d = '99';
				if (vendPercent.match(d)) {
					vendPercent = 0;
				} else {
					var res = vendPercent.substr(0, 5);
					var a = parseFloat(res) / 1000;
					vendPercent = a;
				}
			}
			formatVendPercent();
	
	
			
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
				values[0] = (parseInt(vendBKCert)+1).toString();
				fields[1] = 'custentityil_expiry_date';
				values[1] = vendBKExpdate;
				fields[2] = 'custentity_ilo_shaam_update';
				values[2] = 'T';
				 //update and submit vendor-level form
				var updatefields = nlapiSubmitField('vendor', parseInt(vendID),
						fields, values);
				
		//*******************************************************************************************************************//		
		//*******************************************************************************************************************//
		//*******************************************************************************************************************//			
			}else{
			//here we check if vendorID && vendorVRN match values from file recieved from SHAAM
			containsID = allVendorsID.indexOf(vendID);
			containsVRN = allVendorsVRN.indexOf(vendVRN);
						
			if(containsID && containsVRN != -1) {
				
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
					var fields = new Array();
					var values = new Array();
					fields[0] = 'custentityil_bookkeeping_certification';
					values[0] = (parseInt(vendBKCert)+1).toString();
					fields[1] = 'custentityil_expiry_date';
					values[1] = vendBKExpdate;
					fields[2] = 'custentity_ilo_shaam_update';
					values[2] = 'T';
					// update and submit vendor-level form
					//var updatefields = nlapiSubmitField('vendor', parseInt(vendID),
						//	fields, values);
	
				}
				else {
					if ((vendPercent == parseInt(myHash[parseInt(vendID)].whtCertPercent))
							&& (vendBKBdate == myHash[parseInt(vendID)].whtCertFromDate)
							&& (vendBKExpdate == myHash[parseInt(vendID)].whtCertEndDate)) {
						continue;
					}
				}
			
				
				}	//end of contains if statement
			
			} // end of else(part where the check is made on existing WHT certs and whether or not to add a new one)
			   
		} // end of loop over shaamUpdates
		
		var endForm = nlapiCreateForm('Shaam Updated');
		var endText = endForm.addField('custentity_ilo_shaamin_info',
				'inlinehtml', 'shaam update info', null, null);
		endText.setDefaultValue('<font size="2"><b> Shaam certificates updated for '
				+ shaamUpdates.length + ' vendors</b>');
		endText.setLayoutType('normal', 'startcol');
	
		var endExceptions = endForm.addField(
				'custentity_ilo_shaamin_exceptions', 'inlinehtml',
				'Exceptions', null, null);

		endExceptions.setDefaultValue('<br><font size="2"><b>' + expiredCertifs.length
				+ ' vendors do not have a Bookkeeping Certification</b>');

	} // end of main else

	//var all = JSON.stringify(Object.keys(myHash));
	
	

	var shaamup = JSON.stringify(shaamUpdates);
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
	var fullDate = res.concat('/' + dateYear);
	return fullDate;
}






