/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Mar 2019     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function updateEmployees_malam(type) {
	
	var ctx = nlapiGetContext();
			
		var allEmps = getAll_Employees();

		
		var file = nlapiLoadFile('60783')
		file.setEncoding('UTF-8')
		var contents = file.getValue();

		var arrLines = contents.split('\n');		
		arrLines.shift()
		arrLines.pop()
		
		var empUpdates = [];
		var malamCodes = getAll_Location_Dept();
		
		arrLines.forEach(function(line) {
		var oneLine = line.split(',');


			  empUpdates.push({
          TZ: oneLine[0],
          empNum: oneLine[0],
          heb_firstname : oneLine[2],
          heb_lastname: oneLine[3],
          eng_firstname : oneLine[4],
          eng_lastname: oneLine[5],
          dob: oneLine[6],
          workstart :oneLine[7],
		  workend :oneLine[8],
          email:oneLine[9],
          phone:oneLine[10],
          unit:oneLine[11].replace('\r', '')
      });

			});
		
		var errors = [];
		var created = [];
		var updated = [];
		
		nlapiLogExecution('debug', 'empUpdates', JSON.stringify(empUpdates, null, 2))

		for(var i = 0; i<empUpdates.length; i++) {
			
			var exsists = '';
			
			for(var x = 0; x<allEmps.length; x++) {
				
				if(empUpdates[i].TZ == allEmps[x].externalid) {
					
					exsists = allEmps[x].internalid
				}
				} //end of allEmps loop
			
			nlapiLogExecution('debug', 'exsists', exsists)

			try{
				
				if(exsists == '') { //New Employee
					
				var currDprtLoc = getLocDept(empUpdates[i].unit, malamCodes) 
				var currLocation = currDprtLoc[0].location
				var currDepartment = currDprtLoc[0].department
				var currSupervisor  = currDprtLoc[0].supervisor
				
				var currEmail = empUpdates[i].email;
				if(currEmail == '') {
					currEmail = empUpdates[i].eng_firstname+'.'+empUpdates[i].eng_lastname+'@qualitestgroup.com';
				}
				

					
					var newEmpRec = nlapiCreateRecord('employee');
					newEmpRec.setFieldValue('customform', '106')
					newEmpRec.setFieldValue('subsidiary', '15'); //Israeli Subsidiary
				    newEmpRec.setFieldValue('externalid', empUpdates[i].TZ);
					newEmpRec.setFieldValue('custentity_il_id_number', empUpdates[i].TZ);
					newEmpRec.setFieldValue('entityid', empUpdates[i].TZ);
					newEmpRec.setFieldValue('custentity_first_name_hebrew', empUpdates[i].heb_firstname);
					newEmpRec.setFieldValue('custentity_last_name_hebrew', empUpdates[i].heb_lastname);
					newEmpRec.setFieldValue('firstname', empUpdates[i].eng_firstname);
					newEmpRec.setFieldValue('lastname', empUpdates[i].eng_lastname);
					newEmpRec.setFieldValue('birthdate', empUpdates[i].dob);
					if(currEmail == '.@qualitestgroup.com') {
						currEmail = 'First.Last@qualitestgroup.com'
					}
					newEmpRec.setFieldValue('email', currEmail);
					newEmpRec.setFieldValue('phone', empUpdates[i].phone);
					newEmpRec.setFieldValue('location', currLocation);
				    newEmpRec.setFieldValue('department', currDepartment);
				    newEmpRec.setFieldValue('employeetype', '3'); //Regular Employee
					newEmpRec.setFieldValue('hiredate', empUpdates[i].workstart);
					newEmpRec.setFieldValue('releasedate', empUpdates[i].workend);
					newEmpRec.setFieldValue('workcalendar', '2') //Work Calendar (ISRAEL)
					newEmpRec.setFieldValue('isjobresource', 'T') //  PROJECT RESOURCE
					newEmpRec.setFieldValue('supervisor', currSupervisor) 
					
					nlapiSubmitRecord(newEmpRec, true)
					
					created.push(empUpdates[i])
				
				} //if(exsists == '') 
				
				else { // Update exsisting Employee
					
					var currDprtLoc = getLocDept(empUpdates[i].unit, malamCodes) 
					var currLocation = currDprtLoc[0].location
					var currDepartment = currDprtLoc[0].department
					var currSupervisor  = currDprtLoc[0].supervisor
					
					var currEmail = empUpdates[i].email;
					if(currEmail == '') {
						currEmail = empUpdates[i].eng_firstname+'.'+empUpdates[i].eng_lastname+'@qualitestgroup.com';
					}
						
						var exsistEmpRec = nlapiLoadRecord('employee', exsists);
						exsistEmpRec.setFieldValue('customform', '106')
						exsistEmpRec.setFieldValue('subsidiary', '15'); //Israeli Subsidiary
						exsistEmpRec.setFieldValue('externalid', empUpdates[i].TZ);
						exsistEmpRec.setFieldValue('custentity_il_id_number', empUpdates[i].TZ);
						exsistEmpRec.setFieldValue('entityid', empUpdates[i].TZ);
						exsistEmpRec.setFieldValue('custentity_first_name_hebrew', empUpdates[i].heb_firstname);
						exsistEmpRec.setFieldValue('custentity_last_name_hebrew', empUpdates[i].heb_lastname);
						exsistEmpRec.setFieldValue('firstname', empUpdates[i].eng_firstname);
						exsistEmpRec.setFieldValue('lastname', empUpdates[i].eng_lastname);
						exsistEmpRec.setFieldValue('birthdate', empUpdates[i].dob);
						if(currEmail == '.@qualitestgroup.com') {
							currEmail = 'First.Last@qualitestgroup.com'
						}
						exsistEmpRec.setFieldValue('email', currEmail);
						exsistEmpRec.setFieldValue('phone', empUpdates[i].phone);
						exsistEmpRec.setFieldValue('location', currLocation);
						exsistEmpRec.setFieldValue('department', currDepartment);
						exsistEmpRec.setFieldValue('employeetype', '3'); //Regular Employee
						exsistEmpRec.setFieldValue('hiredate', empUpdates[i].workstart);
						exsistEmpRec.setFieldValue('releasedate', empUpdates[i].workend);
						exsistEmpRec.setFieldValue('workcalendar', '2') //Work Calendar (ISRAEL)
						exsistEmpRec.setFieldValue('isjobresource', 'T') //  PROJECT RESOURCE
						exsistEmpRec.setFieldValue('supervisor', currSupervisor) //  
						
						nlapiSubmitRecord(exsistEmpRec, true)	

						updated.push(empUpdates[i])
				}

			}catch(err){
				errors.push({
				error : JSON.stringify(err.message+'|'+err.details),
				employee :{id1: empUpdates[i].TZ,
							id2: empUpdates[i].heb_firstname +' '+empUpdates[i].heb_lastname}
				})
				nlapiLogExecution('debug', 'err', err)
				//continue;
			}
	
		} //end of empUpdates loop

		
		//Send mail with results
		
		try{
			
			var emailObj = {
					sender : '3173',
					reciever : 'shlomit.rosner@one1up.com',
					thisType: 'EMPLOYEE'	
			}

			buildResultReport(empUpdates,errors,created,updated, emailObj)
			
		}
		catch(err){
			nlapiLogExecution('debug', 'err', err)

			
			nlapiSendEmail('3173', 'shlomit.rosner@one1up.com', 'An error occured.', err, null, null, null, null, null, null, null)
			
		}
		
	 
}



function getLocDept(code, malamCodes) {
	
	var toReturn = [];
	
	if (code != '') {
		
		for(var x = 0; x<malamCodes.length; x++) {
			
			if(code == malamCodes[x].code) {
				
				toReturn.push({
					department : malamCodes[x].dprt,
					location : malamCodes[x].location,
					supervisor : malamCodes[x].supervisor
				})
			}
		}
	}
	return toReturn
}


function getAll_Location_Dept() {
	
	var columns = new Array();
		columns[0] = new nlobjSearchColumn('custrecord_qt_il_department');
		columns[1] = new nlobjSearchColumn('custrecord_qt_il_location');
		columns[2] = new nlobjSearchColumn('custrecord_qt_il_business_unit');
		columns[3] = new nlobjSearchColumn('custrecord_unit_manager');

var searchMalamCodes = nlapiCreateSearch('customrecord_malam_ns_org_units_map', null, columns)

	var allResults = [];
	var results =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchMalamCodes.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allResults.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allResults != null) {
				allResults.forEach(function(line) {
					
					results.push({
					
					code : line.getValue('custrecord_qt_il_business_unit'),
					dprt : line.getValue('custrecord_qt_il_department'),
					location : line.getValue('custrecord_qt_il_location'),
					supervisor : line.getValue('custrecord_unit_manager')
					
					});

				});

			};
			
			return results;
}

function getAll_Employees() {
	
	var columns = new Array();
		columns[0] = new nlobjSearchColumn('custentity_il_id_number');
		columns[1] = new nlobjSearchColumn('internalid');
		columns[2] = new nlobjSearchColumn('externalid')
		
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('subsidiary', null, 'is', ['15']);
	filters[1] = new nlobjSearchFilter('custentity_il_id_number', null, 'isnotempty', null)
	
	var searchEmployees = nlapiCreateSearch('employee', filters, columns)

	var allResults = [];
	var results =[];
	var resultItems = [];
	var searchid = 0;
	var resultset = searchEmployees.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allResults.push(resultItems[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allResults != null) {
				allResults.forEach(function(line) {
					
					results.push({
					
					tz : line.getValue('custentity_il_id_number'),
					externalid: line.getValue('externalid'),
					internalid : line.getValue('internalid'),

					
					});

				});

			};
			
			return results;
}






function buildResultReport(allRecArray,allErrArray,allCreatedArray,allUpdatedArray, emailObj) {
	
	var totalRecs = JSON.stringify(allRecArray.length);
	var totalupdates = JSON.stringify(allUpdatedArray.length)
	var totalcreated = JSON.stringify(allCreatedArray.length);
	var totalerrors = JSON.stringify(allErrArray.length);
	
	
	
	var emailSubject = 'Malam '+emailObj.thisType+' Incoming Interface Completed - Results';
	var emailBody = '';


	var createdHeader = '';
	var errorsHeader = '';
	var createdTable = '';
	var errorsTable = '';
	var createdLines = [];
	var createdLine = '';
	var errorsLines = [];
	var errorsLine = ''

	var header = "<span style='font-size:21px'>Malam "+emailObj.thisType+" Incoming Interface : <b>completed</b>.<br><br></span>" +
		"<span style='font-size:18px'>Total loaded : <b>"+totalRecs+"</b><br></span>" +
	 		"<span style='font-size:18px'>Total checked/updated : <b>"+totalupdates+"</b><br></span>" +
	 		"<span style='font-size:18px'>Total created : <b>"+totalcreated+"</b><br></span>" +
	 		"<span style='font-size:18px'>Total with errors : <b>"+totalerrors+"</b><br><br></span>";



//	if(created.length > 0){	
//		for(var i = 0; i<created.length; i++) {
//			createdLine = "<tr>" +
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].TZ+"</a></td>"+
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].heb_firstname+"</td>"+
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].heb_lastname+"</td>"+
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].eng_firstname+"</td>"+
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].eng_lastname+"</td>"+
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].dob+"</td>"+
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].email+"</td>"+
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].phone+"</td>"+
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].unit+"</td>"+
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].workstart+"</td>"+
//			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+created[i].workend+"</td>"+
//			 "</tr>";
//			createdLines.push(createdLine)
//		}
//		createdHeader = "<span style='font-size:18px'><u><b>Employees Created:</b></u>These employees did not exsist in NetSuite and have been created.</span>"
//
//		var htmlLines = createdLines.toString().replace(/,/g,'');
//		
//		createdTable = "<table style='width:100%; border-collapse: collapse; border: 1px solid black;'> "+
//		 "<thead> "+
//		 "<tr>"+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Teudat Zeut</th>"+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Hebrew First Name</th> "+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Hebrew Last Name</th>"+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>English First Name</th>"+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>English Last Name</th>"+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>D.O.B.</th> "+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Email</th>"+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Phone</th>"+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Malam Unit</th> "+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Hire Date</th>"+
//		 "<th style='width:150px text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Termination Date</th>"+
//		 "</tr>"+
//		 "</thead> "+
//		 htmlLines+
//		 "</table><br><br>";
//			}

	if(allErrArray.length > 0){	
		
		//nlapiLogExecution('debug', 'errors to check', JSON.stringify(errors[0].employee, null,2))
		for(var x = 0; x<allErrArray.length; x++) {
			errorsLine = "<tr>" +
			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+allErrArray[x].employee.id1+"</a></td>"+
			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+allErrArray[x].employee.id2+"</td>"+
			 "<td style='width:150px;text-align:center;border: 1px solid black; padding: 5px; font-size:18px;'>"+allErrArray[x].error+"</td>"+
			 "</tr>";
			errorsLines.push(errorsLine)
		}
		errorsHeader = "<span style='font-size:18px'><u><b>"+emailObj.thisType+" with errors: </b></u>These records were not updated/created. (See error column)</span>"
		var htmlLines_error = errorsLines.toString().replace(/,/g,'');
		 
		 errorsTable = "<table  style='width:100%; border-collapse: collapse; border: 1px solid black;'> "+
		 "<thead> "+
		 "<tr>"+
		 "<th style='width:150px; text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>-</th>"+
		 "<th style='width:150px; text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>-</th> "+
		 "<th style='width:150px; text-align:center; font-weight: bold;border: 1px solid black; padding: 5px; font-size:18px;'>Error message</th>"+
		 "</tr>"+
		 "</thead> "+

		 htmlLines_error+

		 "</table>";
			}



	emailBody = header + errorsHeader + errorsTable

	//var tests1 = JSON.stringify(shaamUpdates, null, 2);
	//var tests2 = JSON.stringify(myHash)
	//nlapiSendEmail(senderToUse, emailToUse, emailSubject, tests1+'------'+tests2, null, null, null, null, null, null, null)
	
		
		nlapiSendEmail(emailObj.sender, emailObj.reciever, emailSubject, emailBody, null, null, null, null, null, null, null)
		
	
	
}