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
		var updateArr = [];

		function vendSearch() {
			var columns = new Array();
			columns[0] = new nlobjSearchColumn('vatregnumber');

			var search = nlapiSearchRecord('vendor', null, null, columns);
			search.forEach(function(ven) {

				allVendorsID.push(ven.id);
				allVendorsVRN.push(ven.getValue('vatregnumber'));

			});

		}
		vendSearch();

		var vendCounter = 0;
		
		//for (var k = 0; k < 150; k++) {
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
		whtCertcolumns[4] = new nlobjSearchColumn('internalid');


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
		}
		;

		// here we create the array for all of the transaction lines from the
		// shaam file
		var shaamUpdates = [];
		var noCertVendors = [];

		var file = request.getFile("file");
		file.setEncoding('UTF-8');
		var fileContent = file.getValue();

		var arrLines = fileContent.split(/\n|\n\r/);

		for (var line = 0; line < arrLines.length; line++) {

			if (arrLines[line].charAt(0) == 'A') {
				firstLine = arrLines.shift();
			}
			if (arrLines[line].charAt(0) == 'Z') {
				lastLine = arrLines.pop();
				lastLine = arrLines.pop();
			} else {

				shaamUpdates
						.push({
							vendorID : arrLines[line].substr(10, 4),
							vendorTaxRegNo : arrLines[line].substr(36, 9),
							taxPercent : arrLines[line].substr(64, 10),
							BKCert : arrLines[line].substr(74, 1),
							BKBeginDate : convertShaamDate(arrLines[line]
									.substr(75, 8)),
							BKExpDate : convertShaamDate(arrLines[line].substr(
									83, 8))
						});

			}

		}

		var containsID = '';
		var containsVRN = '';

		// here we are looping over all the objects in the shaamUpdates Array
		for (var i = 0; i < shaamUpdates.length; i++) {
			
			vendCounter++;
			nlapiLogExecution('DEBUG', 'vendCounter', vendCounter);
         
									

			var vendID = shaamUpdates[i].vendorID;
			var vendVRN = shaamUpdates[i].vendorTaxRegNo;
			var vendBKCert = shaamUpdates[i].BKCert;
			var vendBKBdate = shaamUpdates[i].BKBeginDate;
			var vendBKExpdate = shaamUpdates[i].BKExpDate;
			var vendPercent = shaamUpdates[i].taxPercent;

			// this if statement skips over vendors that have a "tik
			// meshutaf"
			if (shaamUpdates[i].vendorTaxRegNo == '000000000') {
				continue;
			}

			containsID = allVendorsID.indexOf(shaamUpdates[i].vendorID);
			containsVRN = allVendorsVRN.indexOf(shaamUpdates[i].vendorTaxRegNo);

			if (containsID && containsVRN != -1) {

				// /checks if expdate is valid or not - (skip this line
				// and push object ot noCertVendors array)
				if (vendBKExpdate == "  /  /    ") {
					noCertVendors.push(shaamUpdates[i]);
					continue;
				}

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



				// if there are no WHTCerts create new ones or if there are
				// different from exsisting create new
				if (myHash.hasOwnProperty(parseInt(vendID)) == false
						|| (vendPercent != parseInt(myHash[parseInt(vendID)].whtCertPercent))
						|| (vendBKBdate != myHash[parseInt(vendID)].whtCertFromDate)
						|| (vendBKExpdate != myHash[parseInt(vendID)].whtCertEndDate)) {
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
					fields[0] = 'custentity_ilo_bookkeeping_certification';
					values[0] = vendBKCert;
					fields[1] = 'custentity_ilo_expiry_date';
					values[1] = vendBKExpdate;
					fields[2] = 'custentity_ilo_shaam_update';
					values[2] = 'T';
					// update and submit vendor-level form
					var updatefields = nlapiSubmitField('vendor', parseInt(vendID),
							fields, values);
					
					
					
					
//					if (myHash.hasOwnProperty(parseInt(vendID)) == true) {
//					nlapiLogExecution('DEBUG', 'vendID', vendID);
//					nlapiLogExecution('DEBUG', 'hashKeys', Object
//							.keys(myHash));
//					nlapiLogExecution('DEBUG', 'vendPercent', vendPercent);
//					nlapiLogExecution(
//							'DEBUG',
//							'whtCertPercent',
//							parseInt(myHash[parseInt(vendID)].whtCertPercent));
//					nlapiLogExecution('DEBUG', 'vendBKBdate', vendBKBdate);
//					nlapiLogExecution('DEBUG', 'whtCertFromDate',
//							myHash[parseInt(vendID)].whtCertFromDate);
//					nlapiLogExecution('DEBUG', 'vendBKExpdate',
//							vendBKExpdate);
//					nlapiLogExecution('DEBUG', 'whtCertEndDate',
//							myHash[parseInt(vendID)].whtCertEndDate);
//
//				}
				// submit new WHT to vendor record
				}

				else {
					if ((vendPercent == parseInt(myHash[parseInt(vendID)].whtCertPercent))
							&& (vendBKBdate == myHash[parseInt(vendID)].whtCertFromDate)
							&& (vendBKExpdate == myHash[parseInt(vendID)].whtCertEndDate)) {
						continue;
					}
				}

			}// end of if containsID && contains VRN =-1//
			   
		} // end of loop over shaamUpdates

		var noCertVendID = [];
		var noCertVendorID = '';
		noCertVendors.forEach(function(noCert) {

			var noCertUpdate = nlapiSubmitField('vendor',
					parseInt(noCert.vendorID),
					'custentity_ilo_bookkeeping_certification', '2');
			noCertVendID.push(parseInt(noCert.vendorID));

			// var usageRemainingsubmitVendorNoCert =
			// context.getRemainingUsage();
			// nlapiLogExecution('DEBUG', 'submitVendorNoCert',
			// usageRemainingsubmitVendorNoCert);

		});

		var endForm = nlapiCreateForm('Shaam Updated');
		var endText = endForm.addField('custentity_ilo_shaamin_info',
				'inlinehtml', 'shaam update info', null, null);
		endText.setDefaultValue('<font size="2"><b> Shaam certificates updated for '
				+ shaamUpdates.length + ' vendors</b>');
		endText.setLayoutType('normal', 'startcol');
	
		var endExceptions = endForm.addField(
				'custentity_ilo_shaamin_exceptions', 'inlinehtml',
				'Exceptions', null, null);

		endExceptions.setDefaultValue('<br><font size="2"><b>' + noCertVendID.length
				+ ' vendors do not have a Bookkeeping Certification</b>');
		
		
		
//usage alert when reaching towards the end;		

		var context = nlapiGetContext();
		var usageRemaining = context.getRemainingUsage();
		
		if(usageRemaining <= 15) {
			nlapiLogExecution('DEBUG', 'usageLimit', 'Stopping at line :' + vendID);
		}
	


		//} // end of big loop on everything
		
	} // end of main else

	var all = JSON.stringify(shaamUpdates);
	response.writePage(endForm);

}; // end of upload_update_shaam function

function convertShaamDate(a) {
	var dateYear = a.substring(0, 4);
	var dateMonth = a.substring(4, 6);
	var dateMonthFix = dateMonth.replace(/^0+/, '');
	var dateDay = a.substring(6, 8);
	var dateDayFix = dateDay.replace(/^0+/, '');
	var res = dateDayFix.concat('/' + dateMonthFix);
	var fullDate = res.concat('/' + dateYear);
	return fullDate;
}
