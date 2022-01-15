/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/log', 'N/error', 'N/runtime', './CyberArk/Common/NCS.Lib.Common', './CyberArk/Hyperion/CBR.Lib.SFTP.Core', 'N/file', 'N/email', 'N/cache', 'N/format', 'N/compress'],

    function (search, record, logger, error, runtime, common, hypCore, file, email, cache, formatter, compress) {
   
	var empsExternals = [];
   
        function getInputData() {
            // Sets a variable with a string-value
            // The value of this variable will become the name of a dynamic variable
            var vari1 = 'val';



            // As part of the name
            eval('var pre_' + vari1 + '= "Part of the name, pre_val";'); // the pre_val variable is set
                logger.debug({
                    title: 'vari1 vari1',
                    details: pre_val
		});

  
        var integId = hypCore.GetIntegrationId('legal_tracker');
        //var integId = hypCore.GetIntegrationId('success_factors');
  //      logger.debug({
  //          title: 'integId',
  //          details: integId
		//});
        var connection = hypCore.GetSftpConnection(integId);
        //logger.debug({
        //    title: 'connection',
        //    details: connection
        //});
    	//var script = runtime.getCurrentScript();
		//var customFileName = script.getParameter({
		//	name : 'custscript_cbr_sufa_custom_file_name'
		//});
		//var isSecondRun = script.getParameter({
		//	name : 'custscript_cbr_sufa_is_second_exe'
		////})
		//logger.debug({
		//	title: 'isSecondRun',
		//	details:isSecondRun
		//});

        //var fileName = 'Tracker Invoice Spreadsheetaccountspayable il2021-12-07 to 2021-12-07'; 
  //      fileName = hypCore.GetSufaFileName(isSecondRun);
          
	 //   //============ Get Date Stamp for file naming ============
		//var now = new Date();
		//now.setHours( now.getHours() + 5 );
          
	 //   logger.debug({
		//	title: 'now',
		//	details:now
		//});
	 //   var dateStamp = formatter.format({
		//	value: now, 
		//	type: formatter.Type.DATE, 
		//	timezone: formatter.Timezone.ASIA_JERUSALEM   
	 //   }); 
	 //   logger.debug({
		//	title: 'timz',
		//	details:dateStamp
		//});
	 //   dateStamp = dateStamp.split('/').map(function(x){return ((x<10)?'0'+x:x)}).join('');
	 //   logger.debug({
		//	title: 'formmated dateStamp',
		//	details:dateStamp
		//});
	    	
	 //   var secondFileIndex = (isSecondRun)?'N':'';
	 //   fileName ="Daily" + secondFileIndex+ dateStamp+ '.txt';
		
    	//=============== Download File From SFTP server ===========
        var fileObj = hypCore.DownloadFile(connection, 'Tracker Invoices.accountspayable il.2021-12-07 to 2021-12-07.zip', integId);
     
       
        var savedFile = file.create({
            name: 'FASDFSDF',
            fileType: file.Type.ZIP,
            contents: fileObj.getContents(),
            folder: '1164026'
        });
        var gzippedFile = compress.gzip({
            file: savedFile,
            level: 9
        });

        var gunzippedFile = compress.gunzip({
            file: gzippedFile
        });
        log.debug('Name: ' + gunzippedFile.name);
        log.debug('File size: ' + gunzippedFile.size + 'b');
        log.debug('Contents: ' + gunzippedFile.getContents());

        //savedFileId = savedFile.save();

        // Load the file from the file cabinet
        //var csvFile = file.load({
        //    id: 2766255
        //});

        //      logger.debug({
        //    title: '  fileObj.getContents()',
        //          details: csvFile.getContents()
        //});
        //var unzipped = compress.gunzip({ file: csvFile });
        //var txt = unzipped.getContents();
        //logger.debug({
        //    title: '  fileObj.getContents()',
        //    details: txt
        //});
    	//>>>>> Added to the script on 29/03/2018. This was instructed on NS Case #2971223
    	// Get destination folder
  //      var folderId =  '1162523' // common.getFolderId('SuFa Input Files');
  //  	if (common.isNullOrEmpty(folderId)) {
		//	throw error.create({
		//		name: 'SuFa Input Files',
		//		message: 'Unable to find destination folder in file cabinet',
		//		notifyOff: true
		//	});
		//}
    	
  //  	// Save file to the file cabinet
  //  	var savedFile = file.create({
  //  	    name: fileName,
  //  	    fileType: file.Type.PLAINTEXT,
  //  	    contents: fileObj.getContents(),
  //  	    encoding: file.Encoding.UTF8,
  //  	    folder: folderId
  //  	});
  //  	savedFileId = savedFile.save();
    	
  //  	// Load the file from the file cabinet
  //  	var csvFile = file.load({
  //  	    id: savedFileId
  //  	});
  //  	//<<<<<<<<<
    	
  //  	if(!common.isNullOrEmpty(csvFile)){
  //  		csvFile = csvFile.getContents();
  //  	}else{
  //  		throw error.create({
		//		name : 'File Not Found',
		//		message :"Failed To Download Target File",
		//		notifyOff : false
		//	});
  //  	}

		//var dateFields = ['hiredate', 'releasedate','custentity_cbr_last_business_change_date'];

    	// ======== Extract Employees list from input file ==============
    	//var objList = hypCore.ProcessCSV(csvFile, integId, dateFields);
    	return '';
    }

 
    function map(context) {
  //  	var originEmp = JSON.parse(context.value);
  //  	logger.debug({
		//	title: 'originEmp',
		//	details:originEmp
		//});
  //  	if((common.isArrayAndNotEmpty(originEmp)) &&(originEmp[0].hasOwnProperty("externalid"))&&(!common.isNullOrEmpty(originEmp[0].externalid))){
	 //   	context.write(originEmp[0].externalid, originEmp);
  //  	}else{
  //  		throw "external id is missing for employee:" + originEmp[1];
  //  	}
    }

  
    function reduce(context) {
  //  	var emp = null;
  //  	var externalID = context.key;
  //  	var extractedData = JSON.parse(context.values[0]);
  //  	var originEmp = extractedData[0];
  //  	var originFileLine = extractedData[1];
  //  	var isNew = true;
		//var cachedIntegID =hypCore.GetIntegrationId('success_factors');
		//try{
		//	// getMapping
		//	var map = hypCore.retrieveMappings(cachedIntegID);//'success_factors'
			
		//	// MAP- normalize all text-given fields (obtain the ids of list-value field's value)
		//	var currEmp = hypCore.mapFields(map.mappings, map.doMapKey, map.doMapVal, originEmp);
		//}catch(ee){
		//	logger.debug({
		//		title: 'ee.message',
		//		details:ee.message
		//	});
		//	throw error.create({
		//		name : 'Failure in field mapping',
		//		message :ee.message,
		//		notifyOff : false
		//	});
		//}

		//// Retrieve text fields list from mapping
		//var txtFields = hypCore.getTextFieldsList(map.mappings);
  //      var dateFields = ['hiredate', 'releasedate', 'custentity_cbr_last_business_change_date', 'custentity_ct_emp_terminated'];

		//// Validate Mandatory Fields
  //      if((common.isNullOrEmpty(currEmp.subsidiary))||
  //      		(common.isNullOrEmpty(currEmp.externalid))||
  //      		(common.isNullOrEmpty(currEmp.custentity_cseg_cbr_countries))){
		//	throw error.create({
		//		name : 'Mandatory fields were not supplied.',
		//		message : 'Mandatory fields were not supplied. The Mandatory fields are : externalid, subsidiary, region country.',
		//		notifyOff : false
		//	});
		//}
		
		//// First - Check if current employee already exists in NetSuite
		//var oldEmp = search.create({
		//	type: record.Type.EMPLOYEE,
		//	filters:[search.createFilter({
		//		name : 'externalid',
		//		operator : 'anyof',
		//		values:[externalID]
		//	})]
		//}).run().getRange({
		//	start : 0,
		//	end : 1
		//});

		//// If employee with that given external id was found -> extract he's internal id, and load him
		//if (common.isArrayAndNotEmpty(oldEmp)){
		//	oldEmp = oldEmp[0];
		//	var oldEmpId = oldEmp.id;//currEmp.exId
		//	isNew = false;
		//	emp = record.load({
		//		type:record.Type.EMPLOYEE,
		//		id:oldEmpId
		//	});
		//	var noChanges = true;
		//	var successFactorFields = ['subsidiary', 
  //              'custentity_cbr_sfc_record_id', 
  //              'externalid',
  //              'entityid',
  //              'custentity_cbr_role', 
  //              'title', 
  //              'employeestatus', 
  //              'entityid', 
  //              'firstname', 
  //              'lastname', 
  //              'employeetype', 
  //              'custentity_cbr_hr_region', 
  //              'location', 
  //              'department', 
  //              'custentity_cbr_hr_dep', 
  //              'email', 
  //              'supervisor', 
  //              'hiredate', 
  //              'officephone', 
  //              'mobilephone', 
  //              'custentity_cseg_cbr_countries', 
  //              'custentity_cbr_office_city', 
  //              'custentity_cbr_hr_manager', 
  //              'custentity_cbr_division_manager', 
  //              'releasedate', 
  //              'custentity_cbr_extension_office', 
  //              'custentity_cbr_last_business_change_date', 
  //              'custentity_cbr_prev_emp_record', 
  //              'custentity_cbr_emp_floor', 
  //              'custentity_cbr_emp_room', 
  //              'custentity_cbr_department_code', 
		//		'defaultexpensereportcurrency',
  //              'IsSubsidiaryChange',
  //              'custentity_ct_emp_product',
  //              'custentity_ct_emp_product_group',
  //              'custentity_ct_employee_office',
  //              'custentity_ct_emp_is_manager',
  //              'custentity_ct_emp_position_code',
  //              'custentity_ct_emp_fte',
  //          ];
		//	var i=0;
			
		//	// Loop through all fields and check if there were any updates 
		//	while((i<successFactorFields.length)&&(noChanges)){
		//		currFieldId = successFactorFields[i];
				
		//		if(currEmp.hasOwnProperty(currFieldId)){
		//			givenVal = currEmp[currFieldId];
					
		//			// Check if given current field is different then its current value in the record
		//			if(txtFields.indexOf(currFieldId) > (-1)){
		//				currVal = emp.getText({
		//					fieldId:currFieldId
		//				});
		//			}else if(dateFields.indexOf(currFieldId) > (-1)){
		//				var givenDate = emp.getValue({
		//					fieldId:currFieldId
		//				});

		//				givenDate = new Date (givenDate);
		//				var dd = givenDate.getDate();
		//				if (dd<10)
		//					dd= '0'+dd;
		//		    	var mm = givenDate.getMonth()+1; //January is 0!
		//		    		if(mm< 10)
		//		    			mm = '0'+mm;
		//		    	var yyyy = givenDate.getFullYear();
		//				var currVal = mm+'/'+dd+'/'+yyyy;
						
		//			}else{
		//				currVal = emp.getValue({
		//					fieldId:currFieldId
		//				});
		//			}

  //                  if (currVal.toString().trim() != givenVal.toString().trim()){
		//				noChanges = false;
		//			}
		//		}
		//		i++;
		//	}
			
		//	// If this is and existing employee, and no fields were changed/ updated, quit processing this employee.
		//	if(noChanges){
		//		logger.debug({
		//			title:'$$$$$$$$$$$$$$$$$ NO CHANGES $$$$$$$$$$$$$$$$$',
		//			details :'$$$$$$$$$$$$$$$$$ NO CHANGES $$$$$$$$$$$$$$$$$'
		//		});
		//		return;
		//	}

		//	// Check if subsidiary was changed
		//	// Get old employee's subsidiary
		//	var oldSubsidiary = emp.getValue({
		//		fieldId:'subsidiary'
		//	});
			
		//	// Get old Subsidiary name
		//	var oldSubName =  emp.getText({
		//		fieldId:'subsidiary'
		//	});

		//	// If so - change existing employee's external id, and turn it to inactive
		//	if (oldSubsidiary != currEmp.subsidiary) {
		//		logger.debug({
		//			title: 'subsidiary was changed on employee ' + oldEmp,
		//			details:'old sub: (id: '+oldSubsidiary+') '+ oldSubName+ ', new sub: '+currEmp.subsidiary
		//		});
		//		record.submitFields({
		//			type : record.Type.EMPLOYEE,
		//			id : oldEmpId,
		//			values : {
		//				externalid : 'NA_'+oldEmpId+'_' + oldEmp+ '_'+oldSubName,
		//				entityid : 'NA_'+oldEmpId+'_' + currEmp.externalid+ '_'+oldSubName,
		//				inactive : true
		//			},
		//			options : {
		//				enableSourcing : false,
		//				ignoreMandatoryFields : true
		//			}
		//		});
		//		currEmp.custentity_cbr_prev_emp_record = oldEmpId;
		//		isNew = true;
		//	}
		//}
		
		//// Create the Employee Record (if one was not loaded already)
		//if(isNew){
		//	emp = record.create({
		//		type:record.Type.EMPLOYEE
		//	});
		//}
		
		//// Set all given fields (only if values were given)
		//for (var key in currEmp) {
		//    if (currEmp.hasOwnProperty(key)) {

		//    	// If field was mapped to "SetTextAsIs" -> set text, otherwise- set value 
		//    	if(dateFields.indexOf(key) >(-1)){
		//    		if(!common.isNullOrEmpty(currEmp[key])){
  //                      var dat = new Date(currEmp[key]);
  //                      if (key == 'custentity_ct_emp_terminated') {
  //                          logger.debug({
  //                              title: 'custentity_ct_emp_terminated: ' + externalID,
  //                              details: currEmp[key]
  //                          });
  //                      }
		//	    		emp.setValue({
		//					fieldId:key,
		//					value:dat
		//				});
		//    		}
		    		
		//    	} else if(txtFields.indexOf(key) >(-1)){
		//			emp.setText({
		//				fieldId:key,
		//				text:currEmp[key]
		//			});
		//    	}else{
		//			emp.setValue({
		//				fieldId:key,
		//				value:currEmp[key]
		//			});
		//    	}
		//    }
		//}
		//try {
		//	AttemptSavingEmp(emp, externalID, oldEmpId);

		//} catch (e) {
		//	logger.error({
		//		title: 'error - emp:'+externalID,
		//		details:e
		//	});
		//	// Check if error created is of type "UNEXPECTED_ERROR"
		//	if((e.hasOwnProperty("name")) && (e.name == "UNEXPECTED_ERROR")){

		//		// Check if error indicates illegal chars or missing ';' (strange errors that started to show for reasons unknown)  
		//		if((e.hasOwnProperty("message"))&& (!common.isNullOrEmpty(e.message)) && (e.message.match("INVOCATION_WRAPPER#3"))){
					
		//			// Attempt to save the record 3 more times
		//			for(var i=1; i<=3; i++){
		//				try{
		//					logger.debug({
		//						title: 'Attempt to Re-save employee ' +externalID,
		//						details: 'Re-Attempt No:'+i
		//					});
		//					AttemptSavingEmp(emp, externalID, oldEmpId);
		//				}catch(err){
							
		//					// Log both file input of this specific employee, and char code  map of the line
		//					logger.error({
		//						title: 'FILE DATA & INTERPRETATION',
		//						details:extractedData
		//					});
		//					var charCodeMap = originFileLine.split('').map(function(x){return x.charCodeAt(0);});
		//					logger.error({
		//						title: 'FILE DATA CODE MAP',
		//						details:charCodeMap
		//					});
		//				}
		//			}
		//		}
		//	}
			
		//	throw error.create({
		//		name : 'Failed to submit record',
		//		message : e.message,
		//		notifyOff : false
		//	});
		//}
    }
    function AttemptSavingEmp(emp, externalID, oldEmpId){
    	logger.debug({
			title : 'Attempt to save the record to netsuite ' + externalID,
			details : emp
		});
		
		// Attempt to save the record to NetSuite
		var employeeID = emp.save({
		    enableSourcing: true,
		    ignoreMandatoryFields: true
		});
		record.submitFields({
			type : record.Type.EMPLOYEE,
			id : employeeID,
			values : {
				entityid : externalID
			},
			options : {
				enableSourcing : false,
				ignoreMandatoryFields : true
			}
		});
		
		// Add Reference, in the new employee record, to the old employee record
		if(!common.isNullOrEmpty(oldEmpId)){
			record.submitFields({
				type : record.Type.EMPLOYEE,
				id : employeeID,
				values : {
					custentity_nc_pba_app_deleg_rep_employee:employeeID
				},
				options : {
					enableSourcing : false,
					ignoreMandatoryFields : true
				}
			});
		}
    }

    
    function summarize(summary) {
    	handleErrorIfAny(summary);
    }
    
    function handleErrorIfAny(summary) {
		var inputSummary = summary.inputSummary;
//		var mapSummary = summary.mapSummary;
		var reduceSummary = summary.reduceSummary;

		if (inputSummary.error) {
			var e = error.create({
				name: 'INPUT_STAGE_FAILED',
				message: inputSummary.error
			});
			handleErrorInStage('input', inputSummary, e);
		}
		
		handleErrorInStage('reduce', reduceSummary);
		//handleErrorInStage('map', reduceSummary);
	}
    
    function handleErrorInStage(stage, summary, e) {
    	logger.debug({
			title: 'stage',
			details:stage
		});
    	var csvFile = null;
    	var new_e = e || null;
    	if (stage == 'reduce'){// &&(!common.isNullOrEmpty(summary.errors)) && (JSON.stringify(summary.errors) != "{}")) {

			// Create the header line of the CSV output file
			var csvContent = "EmpID|Error Msg\n";
			var innerContent = "";
			
			// fill content with the execution errors
			summary.errors.iterator().each(function (key, value) {
				innerContent +=  key + '|'+ JSON.parse(value).message+'\n';
				logger.debug({ 
					title: "error saving employee "+key,
					details:value
				});
				return true;
			});
			logger.debug({
				title: 'innerContent',
				details:innerContent
			});

			if(innerContent !=""){
	    		new_e = error.create({
					name: 'REDUCE_STAGE_FAILED',
					message: 'REDUCE_STAGE_FAILED'
				});
	    		
				csvContent +=innerContent
				
				// Create file
				csvFile = file.create({
					name: 'SuccessFactor-Netsuite Employee Sync Errors.csv',
					fileType: file.Type.CSV,
					contents: csvContent
				});
			}
    	}
		if(!common.isNullOrEmpty(new_e)){
	    	var subject = 'Map/Reduce script ' + runtime.getCurrentScript().id + ' failed for stage: ' + stage;
			var body = 'An error occurred with the following information:\n' +
				'Error msg: ' + new_e.message;
			var cachedIntegID = hypCore.GetIntegrationId('success_factors');
			
			// Get Recipients
			var rcps = search.lookupFields({
				type: 'customrecord_nc_ba_integration_types',
				id: cachedIntegID,
				columns : [ 'custrecord_nc_ba_int_types_notifyemploye']
			}).custrecord_nc_ba_int_types_notifyemploye;
			
			var author = search.lookupFields({
				type: 'customrecord_nc_batch_integration_setup',
				id: 1,
				columns : [ 'custrecord_nc_ba_int_user']
			}).custrecord_nc_ba_int_user;
			
			if(common.isArrayAndNotEmpty(author)){
				author = author[0].value;
				var recipients = [author];
				if(common.isArrayAndNotEmpty(rcps)){
					var recpList = [];
					for(var i=0; i<rcps.length; i++ ){
						recpList.push(Number(rcps[i].value));
					}
					
					// Send email to inform of the process failure 
					var recipients = recpList;
				}
				var emailContent = {
					author: author,
					recipients: recipients,
					subject: subject,
					body: body,
					isInternalOnly:false
				};
	
				if(!common.isNullOrEmpty(csvFile)){
					emailContent.attachments = [csvFile];
				}
		
				email.send(emailContent);
			}
		}
    }


    function DownloadFile(connection, fileName, integId) {
        var folder = '';
        try {
            if (!common.isNullOrEmpty(integId)) {
                // Get the folder name from the integration type record
                folder = search.lookupFields({
                    type: "customrecord_nc_ba_integration_types",
                    id: integId,
                    columns: ['custrecord_nc_ba_int_types_custompushurl']
                })['custrecord_nc_ba_int_types_custompushurl'];

                if (!common.isNullOrEmpty(folder) && !common.isNullOrEmpty(fileName)) {
                    var fld = '/' + folder;
                    return downloadedFile = connection.download({
                        directory: folder,
                        filename: fileName
                    });
                }
                else {
                    addLog("Failed to download input file. The file path is wrong.");
                }
            } else {
                throw error.create({
                    name: 'CBR.Lib.SFTP.Core -> DownloadFile',
                    message: "given integration id is invalid.",
                    notifyOff: false
                });
            }
        } catch (e) {
            addLog("Failed to download input file." + e.message, false, integId);
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize

    };
});
