/* **************************************************************************************
 ** Copyright (c) 2019 One1 LTD
 ** All Rights Reserved.
 **
 * Version    Date            Author           Remarks
 * 5.40       26 FEB 2019     Moshe Barel     
 *
 *************************************************************************************** */
var malam_org_maggping = [];
var projects_malam_code = [];
var arremp = [];
var projects_mapped_types = [];

function update_project_times_from_malam(type) {
    var file = nlapiLoadFile('60782')
    file.setEncoding('UTF-8')
    var contents = file.getValue();

    var arrLines = contents.split('\n');
    arrLines.shift();
    arrLines.pop();

    var excelRecs = [];
    get_employees();
    get_peojects_codes();

    arrLines.forEach(function (line) {
        var oneLine = line.split(',');
        excelRecs.push({
            empid: oneLine[0],
            date: oneLine[2],
            code: oneLine[4],
            hours: oneLine[5],
            memo: oneLine[6].replace('\r', '')
        });
    });

    var errors = [];
    var created = [];

    for (var i = 0; i < excelRecs.length; i++) {
        try {
            var updated = [];

            nlapiLogExecution('debug', 'excelRecs', JSON.stringify(excelRecs[i], null, 2));
            var timebillrec = nlapiCreateRecord('timebill');
            var projectid = projects_malam_code[excelRecs[i].code];
            timebillrec.setFieldValue('customform', '113')
            timebillrec.setFieldValue('subsidiary', '15'); //Israeli Subsidiary
            timebillrec.setFieldValue('customer', projectid);
            timebillrec.setFieldValue('employee', arremp[excelRecs[i].empid]);
            timebillrec.setFieldValue('trandate', excelRecs[i].date);
            timebillrec.setFieldValue('hours', excelRecs[i].hours);
            timebillrec.setFieldValue('memo', excelRecs[i].memo);
            timebillrec.setFieldValue('approvalstatus', '3'); //approved
            timebillrec.setFieldValue('department', nlapiLookupField('job', projectid, 'custentity_department'));
            timebillrec.setFieldValue('location', nlapiLookupField('job', projectid, 'custentity_location'));
            timebillrec.setFieldValue('class', nlapiLookupField('job', projectid, 'custentity_class'));
            


            try {
                // Search for matching owner by employee email
                var search = nlapiSearchRecord('projectTask', null, [new nlobjSearchFilter('title', null, 'is', 'Standard Time'), new nlobjSearchFilter('company', null, 'is', projectid)])
                var taskId = 0;
                for (result in search) {
                    taskId = search[result].id;
                }
                timebillrec.setFieldValue('casetaskevent', taskId);
            }
            catch (e) {
                var lineNum = i+1;
        		errors.push({
    						error : JSON.stringify(err.code+'|'+err.message+'|'+err.details+'|'+err),
    						employee :{id1: excelRecs[i].empid,
    									id2: 'Line Number :'+ lineNum}
    						})
                nlapiLogExecution('error', 'err', e)
            }
            timebillrec.setFieldValue('item', 304); //Consulting/Testing Services;

            nlapiSubmitRecord(timebillrec, true)
            created.push(excelRecs[i])
        } //if(exsists == '') 
        catch (err) {
            var lineNum = i+1;
    		errors.push({
    			error : JSON.stringify(err.code+'|'+err.message+'|'+err.details+'|'+err),
						employee :{id1: excelRecs[i].empid,
									id2: 'Line Number :'+ lineNum}
						})
            nlapiLogExecution('error', 'err', err)
        }
    } //end of excelRecs loop

    //Send mail with results
    
	var emailObj = {
			sender : '3173',
			reciever : 'shlomit.rosner@one1up.com',
			thisType: 'PROJECT TIMES'	
	}

    try {
        buildResultReport(excelRecs, errors, created, updated, emailObj)
    }
    catch (err) {
        nlapiLogExecution('debug', 'err', err)

       nlapiSendEmail(emailObj.sender, emailObj.reciever, 'An error occured.', err, null, null, null, null, null, null, null)

    }


}

function update_project_attendance(type) {
    var file = nlapiLoadFile('60781')
    file.setEncoding('UTF-8')
    var contents = file.getValue();

    var arrLines = contents.split('\n');
    arrLines.shift();
    arrLines.pop();

    var excelRecs = [];
    get_employees();
    get_malam_unit_map();
    get_peojects_codes();
    get_peojects_mapped_types();

    arrLines.forEach(function (line) {
        var oneLine = line.split(',');
        excelRecs.push({
            empid: oneLine[0],
            date: oneLine[2],
            hours: oneLine[7],
            report: oneLine[8],
            code: oneLine[9],
            memo: oneLine[10].replace('\r', '')
        });
    });

    var errors = [];
    var created = [];

    for (var i = 0; i < excelRecs.length; i++) {
        try {
            var updated = [];

            nlapiLogExecution('debug', 'excelRecs', JSON.stringify(excelRecs[i], null, 2));
            var timebillrec = nlapiCreateRecord('timebill');
            var Attendance = (excelRecs[i].report == "12") || (excelRecs[i].report == "13"); //Attendance == 12/13;
            nlapiLogExecution('debug', 'Attendance', Attendance);
            var gen_code = get_project_malam_codes(excelRecs[i].code, Attendance);
            var projectid = projects_malam_code[gen_code];
            var projecttypeText = projects_mapped_types[excelRecs[i].report];

            nlapiLogExecution('debug', 'gen_code', gen_code + ' projectid:' + projectid + ' projecttype:' + projecttypeText);
            timebillrec.setFieldValue('customform', '113')
            timebillrec.setFieldValue('subsidiary', '15'); //Israeli Subsidiary
            timebillrec.setFieldValue('customer', projectid);
            timebillrec.setFieldValue('employee', arremp[excelRecs[i].empid]);
            timebillrec.setFieldValue('trandate', excelRecs[i].date);
            timebillrec.setFieldValue('hours', excelRecs[i].hours);
            timebillrec.setFieldValue('memo', excelRecs[i].memo);
            timebillrec.setFieldValue('approvalstatus', '3'); //approved
            timebillrec.setFieldValue('department', nlapiLookupField('job', projectid, 'custentity_department'));
            timebillrec.setFieldValue('location', nlapiLookupField('job', projectid, 'custentity_location'));
            timebillrec.setFieldValue('class', nlapiLookupField('job', projectid, 'custentity_class'));

            try {
                // Search for matching owner by employee email
                var search = nlapiSearchRecord('projectTask', null, [new nlobjSearchFilter('title', null, 'contains', projecttypeText), new nlobjSearchFilter('company', null, 'is', projectid)])
                var taskId = 0;
                for (result in search) {
                    taskId = search[result].id;
                }
                timebillrec.setFieldValue('casetaskevent', taskId);
            }
            catch (e) {
                nlapiLogExecution('error', 'err', e)
                var lineNum = i+1;
                
                var errorObj = err;
                var errMsg = '';
                if(err == undefined) {
                	errMsg = "This code does not exsist, or has not been configured"
                }else{
                	errMsg = err.message+'|'+err.details
                }
                    		errors.push({
				error : JSON.stringify(errMsg),
				employee :{id1: excelRecs[i].empid,
							id2: 'Line Number :'+ lineNum}
				})
            }

            nlapiSubmitRecord(timebillrec, true)
            created.push(excelRecs[i])
        } //if(exsists == '') 
        catch (err) {
            var lineNum = i+1;
    		errors.push({
						error : JSON.stringify(err.message+'|'+err.details),
						employee :{id1: excelRecs[i].empid,
									id2: 'Line Number :'+ lineNum}
						})
            nlapiLogExecution('error', 'err', err)
        }
    } //end of excelRecs loop

    //Send mail with results
	var emailObj = {
			sender : '3173',
			reciever : 'shlomit.rosner@one1up.com',
			thisType: 'PROJECT ATTENDANCE'	
	}

    try {
        buildResultReport(excelRecs, errors, created, updated, emailObj)
    }
    catch (err) {
        nlapiLogExecution('debug', 'err', err)

       nlapiSendEmail(emailObj.sender, emailObj.reciever, 'An error occured.', err, null, null, null, null, null, null, null)

    }


}

function get_malam_unit_map() {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_qt_il_department');
    columns[1] = new nlobjSearchColumn('custrecord_qt_il_location');
    columns[2] = new nlobjSearchColumn('custrecord_qt_il_business_unit');
    columns[3] = new nlobjSearchColumn('custrecord_qt_il_malam_code');
    columns[4] = new nlobjSearchColumn('custentity_malam_code', "CUSTRECORD_QT_IL_GEN_HOURS_PROJECT");
    columns[5] = new nlobjSearchColumn('custentity_malam_code', "custrecord_qt_il_absence_project");
    var searchMalamCodes = nlapiCreateSearch('customrecord_malam_ns_org_units_map', null, columns)
    var allResults = [];
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
        allResults.forEach(function (line) {
            malam_org_maggping.push({
                id: line.getId(),
                code: line.getValue('custrecord_qt_il_business_unit'),
                dprt: line.getValue('custrecord_qt_il_department'),
                location: line.getValue('custrecord_qt_il_location'),
                malam_code: line.getValue('custrecord_qt_il_malam_code'),
                gen_prject_malam_code: line.getValue('custentity_malam_code', "CUSTRECORD_QT_IL_GEN_HOURS_PROJECT"),
                absence_prject_malam_code: line.getValue('custentity_malam_code', "custrecord_qt_il_absence_project"),
            });

        });

    };
}

function get_project_malam_codes(code, Attendance) {
    nlapiLogExecution('debug', 'get_project_malam_codes', 'code:' + code + ' Attendance:' + Attendance);

    if (code != '') {
        for (var x = 0; x < malam_org_maggping.length; x++) {
            if (code == malam_org_maggping[x].code) {
                if (!Attendance)
                    return malam_org_maggping[x].absence_prject_malam_code;
                else
                    return malam_org_maggping[x].gen_prject_malam_code;
            }
        }
    }
    return '';
}

function get_peojects_mapped_types() {
    var cols = new Array();
    cols.push(new nlobjSearchColumn('custrecord_mapped_time_type'));
    cols.push(new nlobjSearchColumn('custrecord_malam_code'));   
    var search = nlapiCreateSearch('customrecord597', null, cols);
    var allResults = [];
    var resultItems = [];
    var searchid = 0;
    var resultset = search.runSearch();
    var rs;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (rs in resultslice) {
            allResults.push(resultItems[resultslice[rs].id] = resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (allResults != null) {
        allResults.forEach(function (line) {
            projects_mapped_types[line.getValue('custrecord_malam_code')] = line.getText('custrecord_mapped_time_type');
        });
    };
}


function get_peojects_codes() {
    var cols = new Array();
    cols.push(new nlobjSearchColumn('custentity_malam_code'));
    cols.push(new nlobjSearchColumn('altname'));
    cols.push(new nlobjSearchColumn('custentity_malam_interface_updated'));
    cols.push(new nlobjSearchColumn('internalid'));
    var search = nlapiCreateSearch('job', [new nlobjSearchFilter('subsidiary', null, 'is', 15)], cols);
    var allResults = [];
    var resultItems = [];
    var searchid = 0;
    var resultset = search.runSearch();
    var rs;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (rs in resultslice) {
            allResults.push(resultItems[resultslice[rs].id] = resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (allResults != null) {
        allResults.forEach(function (line) {
            projects_malam_code[line.getValue('custentity_malam_code')] = line.getId();
        });
    };
}

function get_employees() {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custentity_il_id_number');
    columns[1] = new nlobjSearchColumn('internalid');
    columns[2] = new nlobjSearchColumn('externalid')

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('subsidiary', null, 'is', ['15']);
    filters[1] = new nlobjSearchFilter('custentity_il_id_number', null, 'isnotempty', null)

    var searchEmployees = nlapiCreateSearch('employee', filters, columns)

    var allResults = [];
    var results = [];
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
        allResults.forEach(function (line) {
            arremp[line.getValue('custentity_il_id_number')] = line.getId();
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
		 
		 errorsTable = "<table style='width:100%; border-collapse: collapse; border: 1px solid black;'> "+
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

		
		nlapiSendEmail(emailObj.sender, emailObj.reciever, emailSubject, emailBody, null, null, null, null, null, null, null)
	
	
}