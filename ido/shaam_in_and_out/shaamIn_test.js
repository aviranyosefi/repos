/**
 * Module Description
 * 
 * Version Date Author Remarks 1.00 06 Nov 2016 idor
 * 
 */



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
		  var ILS = getILS();
		  var Subsidiary = request.getParameter("subsidiary");

	

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
      
      for(var x = 0; x < shaamUpdates.length; x++) {
    	  
    	  shaamUpdates[x].vendorID = shaamUpdates[x].vendorID.replace(/\s/g, "");
    	  
    	  var vendTaxReg = shaamUpdates[x].vendorTaxRegNo;
    	  var alt_vendTaxReg = shaamUpdates[x].alt_vendorTaxRegNo;
    	  
    	  if(vendTaxReg.charAt(0) === '0') {		
    		  vendTaxReg = vendTaxReg.substr(1);
    		  shaamUpdates[x].vendorTaxRegNo = vendTaxReg
    	  }
    	  if(alt_vendTaxReg.charAt(0) === '0') {		
    		  alt_vendTaxReg = alt_vendTaxReg.substr(1);
    		  shaamUpdates[x].alt_vendorTaxRegNo = alt_vendTaxReg
    	  }
    	  
      }

				
  	
  	

  	var shaamup = JSON.stringify(shaamUpdates.length);
  	//var all = JSON.stringify(Object.keys(myHash));
  	response.write(shaamup);


	} // end of main else

	//var all = JSON.stringify(Object.keys(myHash));


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