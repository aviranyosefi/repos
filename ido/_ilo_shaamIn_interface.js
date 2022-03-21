/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Oct 2016     idor
 *
 */

/**
 * @param {nlobjRequest}
 *            request Request object
 * @param {nlobjResponse}
 *            response Response object
 * @returns {Void} Any output is written via response object
 */




function upload_update_shaam(request, response) {
	if (request.getMethod() == 'GET') {
		var form = nlapiCreateForm('Upload File');
		var fileField = form.addField('file', 'file', 'Select File');
		fileField.setMandatory(true);

		form.addSubmitButton();
		form.addResetButton();
		response.writePage(form);

	} else {

		var vID = '';
		var vVRN = '';
		var allVendorsID = [];
		var allVendorsVRN = [];

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
		

		var shaamUpdates = [];
		var noCertVendors = [];

		var file = request.getFile("file");
		file.setEncoding('UTF-8');
		var fileContent = file.getValue();

		var arrLines = fileContent.split(/\n|\n\r/);

		// for (var j = 0; j < 13; j++) {

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

		// }

		var containsID = '';
		var containsVRN = '';

		shaamUpdates
				.forEach(function(tranLine) {

					// nlapiLogExecution('DEBUG', 'foreach first', tranLine.vendorID);
					var vendID = tranLine.vendorID;
					var vendVRN = tranLine.vendorTaxRegNo;
					var vendBKCert = tranLine.BKCert;
					var vendBKBdate = tranLine.BKBeginDate;
					var vendBKExpdate = tranLine.BKExpDate;
					var vendPercent = tranLine.taxPercent;

					// this if statement skips over vendors that have a "tik
					// meshutaf"
					if (tranLine.vendorTaxRegNo == '000000000') {
						return;
					}
					containsID = allVendorsID.indexOf(tranLine.vendorID);
					containsVRN = allVendorsVRN
							.indexOf(tranLine.vendorTaxRegNo);

					// this if statement checks and makes sure that the ID and
					// VatRegNumber are associated/present
					if (containsID && containsVRN != -1) {

						// /this is where the rest of the logic needs to take
						// place.

						// /checks if expdate is valid or not - (skip this line
						// and do nothing if true)
						if (vendBKExpdate == "  /  /    ") {
							noCertVendors.push(tranLine);
							return;
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
							 nlapiLogExecution('DEBUG', 'typeofpercent', typeof vendPercent);
						}

						var fields = new Array();
						var values = new Array();
						fields[0] = 'custentity_ilo_bookkeeping_certification';
						values[0] = vendBKCert;
						fields[1] = 'custentity_ilo_expiry_date';
						values[1] = vendBKExpdate;
						fields[2] = 'custentity_ilo_shaam_update';
						values[2] = '1';
						// update and submit vendor-level form
						var updatefields = nlapiSubmitField('vendor', parseInt(vendID), fields, values);

						// this checks if WHTCertificate for given Vendor is the
						// same - so in turn if true not to create a new one
						
						var whtCertID = parseInt(vendID);
						
						
						 nlapiLogExecution('DEBUG', 'myash', myHash[whtCertID]);
						 nlapiLogExecution('DEBUG', 'myHash', typeof whtCertFromDate);
///////////////////---------------------///////////////////////
						 
						 //if WHTCert are empty
						 
						 
//						 if((typeof whtCertFromDate == 'undefined') == false) {
//						 
//								var WHTCert = nlapiCreateRecord('customrecord_oil_vendor_cert');
//								WHTCert.setFieldValue("name", 'shaam_test');
//								WHTCert.setFieldValue("custrecord_vendor_cert_vendorid", vendID);
//								WHTCert.setFieldValue("custrecord_vendor_cert_percent",vendPercent);
//								WHTCert.setFieldValue("custrecord_vendor_cert_fromdate", vendBKBdate);
//								WHTCert.setFieldValue("custrecord_vendor_cert_enddate",vendBKExpdate);
//
//								// submit new WHT to vendor record
//								nlapiSubmitRecord(WHTCert);
//								return;
//						
//						 }
//////----------------------------------------------//////						 
						 
						 
//						 if(typeof whtCertFromDate == 'undefined') {
						 
						 if(whtCertFromDate != vendBKBdate && whtCertEndDate != vendBKExpdate && whtCertPercent != vendPercent){

								// create new WHT Certificate
								var WHTCert = nlapiCreateRecord('customrecord_oil_vendor_cert');
								WHTCert.setFieldValue("name", 'shaam_test');
								WHTCert.setFieldValue("custrecord_vendor_cert_vendorid", vendID);
								WHTCert.setFieldValue("custrecord_vendor_cert_percent",vendPercent);
								WHTCert.setFieldValue("custrecord_vendor_cert_fromdate", vendBKBdate);
								WHTCert.setFieldValue("custrecord_vendor_cert_enddate",vendBKExpdate);

								// submit new WHT to vendor record
								nlapiSubmitRecord(WHTCert);
						}
						 if(whtCertFromDate == vendBKBdate && whtCertEndDate == vendBKExpdate && whtCertPercent == vendPercent) {
							 nlapiLogExecution('DEBUG', 'fromdate', 'true');
							 
							 return;
						 }
	
						// }
						//}
						 
					
					}

		return;
				});

		var noCertVendID = [];
		var noCertVendorID = '';
		noCertVendors.forEach(function(noCert) {

			var noCertUpdate = nlapiSubmitField('vendor',
					parseInt(noCert.vendorID),
					'custentity_ilo_bookkeeping_certification', '2');
			noCertVendID.push(parseInt(noCert.vendorID));



		});

		var endForm = nlapiCreateForm('Shaam Updated');
		var endText = endForm.addField('custentity_ilo_shaamin_info',
				'inlinehtml', 'shaam update info', null, null);
		endText.setDefaultValue('Shaam certificates updated for '
				+ shaamUpdates.length + ' vendors');
		endText.setLayoutType('normal', 'startcol');
		var endExceptions = endForm.addField(
				'custentity_ilo_shaamin_exceptions', 'inlinehtml',
				'Exceptions', null, null);

		endExceptions.setDefaultValue('<br>' + noCertVendID.length
				+ ' vendors do not have a Bookkeeping Certification');

		// var venlink;
		// var url =
		// 'https://system.na1.netsuite.com/app/common/entity/vendor.nl?id=';
		// var _blank = "_blank";
		// var links="";
		// var vendName = "";
		//		
		// for (var x = 0; x<noCertVendID.length; x++) {
		// vendName = nlapiLookupField('vendor', noCertVendID[x],
		// 'companyname');
		// links += "<br><a target=" + _blank + " href= " + url +
		// noCertVendID[x] + ">" + vendName + "</a><br>";
		// };
		// venlink = endForm.addField("custentity_ilo_vendlinks", "inlinehtml",
		// "Exceptions", null, null );
		// venlink.setDefaultValue(links);

	}

	// var all = JSON.stringify(shaamUpdates);
	//

	response.writePage(endForm);
};

function convertShaamDate(a) {
	var dateYear = a.substring(0, 4);
	var dateMonth = a.substring(4, 6);
	var dateMonthFix = dateMonth.replace(/^0+/, '');
	var dateDay = a.substring(6, 8);
	var dateDayFix = dateDay.replace(/^0+/, '');
	var res = dateMonthFix.concat('/' + dateDayFix);
	var fullDate = res.concat('/' + dateYear);
	return fullDate;
}





