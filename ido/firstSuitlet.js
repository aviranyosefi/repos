var folderId;

function suitelet(request, response) {

	if (request.getMethod() == 'GET') {

		
		//here we create the form
		var form = nlapiCreateForm('Update Record Notes');
		var fldName = form.addField('custpage_ilo_name', 'text', 'Name');
		var fldNotes = form.addField('custpage_ilo_notes', 'textarea', 'Notes');
		var fldPhone = form.addField('custpage_ilo_phone', 'phone', 'Phone');

		var select = form.addField('selectfield', 'select', 'Employee',
				'employee');
		


		
		form.addSubmitButton('Continue');
		response.writePage(form);
	}

	else {

		//after clicking the continue button we rebuild the form on the postback and populate the fields
		
		var reqName = request.getParameter('custpage_ilo_name');
		var reqNotes = request.getParameter('custpage_ilo_notes');
		var reqPhone = request.getParameter('custpage_ilo_phone');
		var reqEmployee = request.getParameter('selectfield');

		var date = new Date();
		var curr_date = date.getDate();
		var curr_month = date.getMonth();
		curr_month++;
		var curr_year = date.getFullYear();
		var today = curr_date + "/" + curr_month + "/" + curr_year;

		var emprec = nlapiLoadRecord('employee', reqEmployee, null);
		var empName = emprec.getFieldValue('entityid');
		var empInitials = emprec.getFieldValue('initials');
		var empEmail = emprec.getFieldValue('email');
		var empSubsidiary = emprec.getFieldText('subsidiary');

		//here we populate an object that will be turned into a file.
		var empData = {
			'Name' : reqName,
			'Notes' : reqNotes,
			'Phone' : reqPhone,
			'Employee' : empName,
			'Email' : empEmail,
			'Date' : today
		};

		var empData2 = {
			'Name' : 'John Smith',
			'Notes' : 'Some notes about John...',
			'Phone' : '0800-555-555',
			'Employee' : 'Ido Rozen',
			'Email' : 'email@example.com',
			'Date' : today
		};

		var empDaString = JSON.stringify(empData);
		var empDaString2 = JSON.stringify(empData2);

		
		//here we create the files
		var empFile = nlapiCreateFile('empfile.txt', 'PLAINTEXT', empDaString);
		empFile.setIsOnline(true);

		var empFile2 = nlapiCreateFile('empfile2.txt', 'PLAINTEXT',
				empDaString2);
		empFile2.setIsOnline(true);
		
		//here we search for the folder ID (the folder already exists in the file cabinet 

		// Upload the file to the File Cabinet by 'Internal Id' of the
		// SuiteScripts (id = -15) folder 
		
//	      var folder = nlapiCreateRecord('folder');
//
//	      if (folder) {
//
//	         folder.setFieldValue('parent', '-15'); // create root level folder
//
//	         folder.setFieldValue('name', "ido-tests");
//
//	         var folderSubmit = nlapiSubmitRecord(folder);
//
//	      }
	      
	      var filename = 'empFile.txt';//your file name goes here
	      var filter = new nlobjSearchFilter('name', 'file', 'is', filename);
	      var column = new nlobjSearchColumn('internalid', 'file');
	      var searchResult = nlapiSearchRecord('folder', null , filter , column);

	      if(searchResult != null){
	         var folderId = searchResult[0].getId();
	         var fileId = searchResult[0].getValue('internalid','file');       
	      }
		
	      
		folderId = '23';
		
		empFile.setFolder(23);
		empFile.setEncoding('UTF-8');
		var id = nlapiSubmitFile(empFile);

		empFile2.setFolder(23);
		empFile2.setEncoding('UTF-8');
		var id2 = nlapiSubmitFile(empFile2);
		


		var respForm = nlapiCreateForm('Updated Record Notes');
		var respName = respForm.addField('custpage_ilo_name', 'text', 'Name');
		var respNotes = respForm.addField('custpage_ilo_notes', 'textarea',
				'Notes');
		var respPhone = respForm.addField('custpage_ilo_phone', 'phone', 'Phone');

		var respEmployee = respForm.addField('selectfield', 'select',
				'Employee', 'employee');
		var respDate = respForm.addField('custpage_ilo_date', 'label', today);
		respName.setDefaultValue(reqName);
		respNotes.setDefaultValue(reqNotes);
		respPhone.setDefaultValue(reqPhone);
		respDate.setDefaultValue(today);
		respEmployee.setDefaultValue(reqEmployee);

		
		var link = respForm.addField("custpage_ilo_downloads", "url", "", null, "downloads")
		.setDisplayType("inline")
		.setLinkText("Click Here to Download Files")
		.setDefaultValue("/core/media/downloadfolder.nl?id=" + folderId + "&_xt=&_xd=T&e=T");

		// response.setContentType('PLAINTEXT', files);
		// response.write(files.getValue()); //autodownload//
		// response.setContentType('PLAINTEXT', 'empfile2.txt');
		// response.write(empFile2.getValue());
		response.writePage(respForm);

	}

}
