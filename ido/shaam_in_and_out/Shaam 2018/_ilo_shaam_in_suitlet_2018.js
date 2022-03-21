/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Mar 2019     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function shaam_in(request, response){
	
	if (request.getMethod() == 'GET') {
		var form = nlapiCreateForm('Upload Shaam File');
		
		var fileField = form.addField('file', 'file', 'Select File');
		var subsidSelect = form.addField('subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY');

		fileField.setMandatory(true);
		subsidSelect.setMandatory(true);

		form.addSubmitButton('Upload');
		form.addResetButton();
		
		response.writePage(form);

}
	else{
		
		 var getUserMail = nlapiGetContext().getEmail();
		 var getUserID =  nlapiGetContext().getUser();
		 var getSubsid = request.getParameter('subsidiary')
		nlapiLogExecution('debug', 'getSubsid', getSubsid)
		 var sendForm = nlapiCreateForm('Uploading Shaam File');
		
		 var htmlField1 = sendForm.addField('custpage_header1', 'inlinehtml');
		 htmlField1.setDefaultValue("<span style='font-size:18px'>An email with the summary of results will be sent to : <b> " +getUserMail+ "</b> once completed.<br></span>"); 

		
		var folderID = findFolder();
		
		if(folderID != null || folderID != undefined || folderID != '') {
			
			var file = request.getFile("file");
			file.setEncoding('UTF-8');
			file.setFolder(folderID)
			file.setIsOnline(true)
			var FileID = nlapiSubmitFile(file)
			
			
			 var params = {custscript_ilo_shaam_file: FileID,
							custscript_ilo_shaam_email : getUserMail,
							custscript_ilo_shaam_sender : getUserID,
							custscript_ilo_shaam_subsid : getSubsid};
			 
			 nlapiScheduleScript('customscript_ilo_shaam_in_scheduled', 'customdeploy_ilo_shaam_in_scheduled', params);

		}
		
		response.writePage(sendForm);
		
	}

}






function findFolder() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('internalid');
	
	var fils = new Array();
	fils[0] = new nlobjSearchFilter('name', null, 'is', 'IL_WHT')		

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