/**
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 */
define(['N/sftp', 'N/file', 'N/log', 'N/search', '../Common/NCS.Lib.Common', 'N/record', 'N/format', 'N/error', 'N/runtime', 'N/format'],

    function (sftp, file, logger, search, common, record, format, error, runtime, formatter) {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        function GetSftpConnection(integId) {
            try {
                // get integration system from given integration type
                integSys = search.lookupFields({
                    type: "customrecord_nc_ba_integration_types",
                    id: integId,
                    columns: ['custrecord_nc_ba_int_types_target_sys']
                })['custrecord_nc_ba_int_types_target_sys'];

                if (!common.isNullOrEmpty(integSys)) {
                    integSys = integSys[0].value;

                    // check if this is production or sendbox
                    var isProduction = (runtime.envType == 'PRODUCTION');

                    // get SFTP server URL
                    var urlField = (isProduction) ? 'custrecord_nc_ba_systems_consumer_url' : 'custrecord_nc_ba_sys_consumer_url_sb';

                    // get host key
                    var hostKeyField = (isProduction) ? 'custrecord_nc_ba_systems_token_key' : 'custrecord_nc_ba_systems_token_key_sb';

                    // get password GUID
                    var pwdGUIDField = (isProduction) ? 'custrecord_nc_ba_systems_password' : 'custrecord_nc_ba_systems_password_sb';

                    // get user name
                    var userNameField = (isProduction) ? 'custrecord_nc_ba_systems_user_name' : 'custrecord_nc_ba_systems_user_name_sb';

                    var credentials = search.lookupFields({
                        type: "customrecord_nc_ba_systems",
                        id: integSys,
                        columns: [urlField, hostKeyField, pwdGUIDField, userNameField]
                    });

                    if (!common.isNullOrEmpty(credentials)) {

                        var url = credentials[urlField];
                        var hostkey = credentials[hostKeyField];
                        var pwdGUID = credentials[pwdGUIDField];
                        var userName = credentials[userNameField];

                        if ((!common.isArrayAndNotEmpty(url)) && (!common.isArrayAndNotEmpty(hostkey)) &&
                            (!common.isArrayAndNotEmpty(pwdGUID)) && (!common.isArrayAndNotEmpty(userName))) {

                            //var myHostKey = "AAAAB3NzaC1yc2EAAAABEQAAAQEA2rHzZK6MtRHtHwfWLba9UN8u2uy7zhBrRR/ZgTfzrLAZzINcV1DwehXJAv7OHYGAOeNEOKo4dkZ1gCoO4thfhLrkv5hlTydZuBylKpSDr0GxYIOaWKWfHVXxgCQUCAyMkopIMYQfUhcMfGBXPRLEEPqTWA1zflSf9yrJgNxL/oGZkF+40ZjeBaUPW8/JOLeWtKnh3hyxzMmw5P6OVqUl58iALGjLRcYzvELxneOgn4wTlvEenNJrANbD/9L6cDUPbfZEqTFOpLznjW68yPZ+L7f6KIDmiWXIJA2PturoSbjAvbZQU9oR8ZMtF4aAs1RsKxckjGpLyhDyTWnq3/C34Q==";
                            var connection = sftp.createConnection({
                                username: userName,//'19251717T'
                                passwordGuid: pwdGUID, // password: 'KxIOdvKecZFw3', 
                                url: url, //'sftp012.successfactors.eu',
                                hostKey: hostkey,// myHostKey,
                                port: 22,
                                hostKeyType: 'rsa'
                            });
                            return connection;
                        }
                    } else {
                        throw error.create({
                            name: "SFTP Connection credentials are missing.",
                            message: "SFTP Connection credentials are missing.",
                            notifyOff: false
                        });
                    }
                }
            } catch (e) {
                addLog('connection to the SFTP server was not established successfully.' + e.message, false, integId);
                throw error.create({
                    name: 'CBR.Lib.SFTP.Core -> GetSftpConnection',
                    message: e,
                    notifyOff: false
                });;
            }
        }

        function GetSearchResults(searchId, addedFilter) {

            // Load dedicated saved search 
            srch = search.load({
                id: searchId
                //id:'customsearch235' // id of search named "Hyperion"
            });

            // add given filters
            if (!common.isNullOrEmpty(addedFilter)) {

                // combine existing filters array with the new filters array
                srch.filters.push(addedFilter);
            }

            var resultSet = srch.run();
            var searchResults = [];
            var nextPageExits = true;
            var nextPage = 1000;
            while (nextPageExits) {
                var pageResults = resultSet.getRange(nextPage - 1000, nextPage);
                if (pageResults.length > 0) {
                    searchResults.addRange(pageResults);
                }
                nextPage += 1000;
                if (pageResults.length < 1000) {
                    nextPageExits = false;
                }
            }

            return searchResults;
        }

        function CreateCsv(resultSet, fileName, scenario, fixedValue1, fixedValue2, integId, isRequisition) {
            try {
                // make sure that results were found
                if (common.isArrayAndNotEmpty(resultSet)) {

                    // Create the header line
                    var csvContent = "Account,Act_Temp,Point-of-View Data Load Cube Name,,,,,,,,,,\n";

                    // Get formula fields ids
                    var dateColumn = getFormulaColumnByLabel(resultSet, "Date");
                    var customerProjColumn = getFormulaColumnByLabel(resultSet, "Customer/project");
                    var budgetProjColumn = getFormulaColumnByLabel(resultSet, "Budgetary Project");

                    if (!common.isNullOrEmpty(budgetProjColumn) &&
                        !common.isNullOrEmpty(customerProjColumn) &&
                        !common.isNullOrEmpty(dateColumn)) {

                        // Loop through the given result set, and create a line in the file for each result
                        for (var i = 0; i < resultSet.length; i++) {
                            var currentLine = resultSet[i];
                            var accountingBook = currentLine.getValue('accountingtransaction_accountingbook');
                            var isScondaryAccountBook = (accountingBook != 1);
                            var budgetLineItem = currentLine.getValue({ name: 'number', join: 'account' });
                            var amount = currentLine.getValue('amount');
                            var foreignAmount = currentLine.getValue('fxamount');
                            var reqAmount = currentLine.getValue('estimatedamount');
                            var watedAmount = (isRequisition) ? reqAmount : (!isScondaryAccountBook) ? amount : foreignAmount;
                            var projectPo = currentLine.getValue({ name: "custrecord_cbr_proj_code", join: "CUSTCOL1" });
                            //					var projectPo = currentLine.getText('custbody_cbr_po_proj');
                            var project = currentLine.getValue({ name: 'altname', join: 'customer' });
                            var proj = ((common.isNullOrEmpty(project)) ? projectPo : project);
                            proj = (common.isNullOrEmpty(proj)) ? 'Project_ND' : proj;
                            var currency = (isScondaryAccountBook) ? currentLine.getText('currency') : currentLine.getValue('accountingtransaction_basecurrency') + '_REP';
                            var region = currentLine.getText('custcol_cseg_cbr_countries');
                            //					var region = currentLine.getText('location');
                            region = (common.isNullOrEmpty(region)) ? 'Region_ND' : region;
                            var subsidiaryCode = currentLine.getValue({ name: 'custrecord_cbr_subsidiary_code', join: 'subsidiary' });
                            var department = currentLine.getValue({
                                name: 'custrecord_cbr_hyperion_department_final',
                                join: 'department'
                            });
                            if (common.isNullOrEmpty(department) || (department == " : ")) {
                                department = "";
                            }
                            var trandate = format.parse({
                                //					    value: currentLine.getValue('trandate'), // was changed at 25/03/2018 to be a formula field
                                value: currentLine.getValue(dateColumn),
                                type: format.Type.DATE
                            });
                            var year = "FY" + trandate.getFullYear() % 1000;
                            var month = months[trandate.getMonth()];
                            //scenario = (currentLine.getText('statusref'));

                            var tran_scenario = (common.isNullOrEmpty(scenario)) ? (currentLine.getText('statusref')) : scenario;
                            fixedValue1 = (common.isNullOrEmpty(fixedValue1)) ? (currentLine.getText('item')) : fixedValue1;

                            csvContent += budgetLineItem + ',' +
                                watedAmount + ',' +
                                proj + ',' +
                                currency + ',' +
                                region + ',' +
                                subsidiaryCode + ',' +
                                department + ',' +
                                year + ',' +
                                tran_scenario + ',' +
                                fixedValue1 + ',' +
                                month + ',' +
                                fixedValue2 + '\n';
                        }

                        // Create file and return it
                        var csvFile = file.create({
                            name: fileName,
                            fileType: file.Type.CSV,
                            contents: csvContent
                        });

                        return csvFile;
                    } else {
                        throw error.create({
                            name: 'ERROR EXECUTING SEARCH',
                            message: 'failed to execute hyperion search. Expected search columns are missing.',
                            notifyOff: false
                        });
                    }
                }
                else {
                    addLog('failed to execute hyperion search.', true, integId);
                    throw error.create({
                        name: 'ERROR EXECUTING SEARCH',
                        message: 'failed to execute hyperion search.',
                        notifyOff: false
                    });
                }
            } catch (e) {
                addLog('failed to create csv file.' + e.message, true, integId);
                throw error.create({
                    name: 'ERROR CREATING CSV',
                    message: 'failed to create csv file.',
                    notifyOff: false
                });;
            }
        }

        function getFormulaColumnByLabel(resultSet, label) {
            var i = 0;

            // loop through search columns, and locate the column with the given label
            if (common.isArrayAndNotEmpty(resultSet)) {
                var columns = resultSet[i].columns;

                while (i < columns.length) {

                    if (columns[i].label == label) {
                        return columns[i]; // if matching column was found -> return it
                    }
                    i++;
                }
            }
            return null;
        }

        function UploadFile(connection, file, fileName, integId) {
            var folder;
            //		try {
            // Get the folder name from the integration type record
            folder = search.lookupFields({
                type: "customrecord_nc_ba_integration_types",
                id: integId,
                columns: ['custrecord_nc_ba_int_types_custompushurl']
            })['custrecord_nc_ba_int_types_custompushurl'];

            if (!common.isNullOrEmpty(folder) && !common.isNullOrEmpty(file)) {
                var fld = '/' + folder;

                log.debug({
                    title: 'connection',
                    details: fld + ' - ' + fileName + ' - ' + file,
                });
                connection.upload({
                    directory: fld,
                    filename: fileName,
                    file: file,
                    replaceExisting: true
                });

            } else {
                addLog('file upload fail. file was not created.', true, integId);
                throw error.create({
                    name: 'CBR.Lib.SFTP.Core -> UploadFile',
                    message: 'file upload fail. file was not created.',
                    notifyOff: false
                });
            }
            //		} catch (e) { 
            //			addLog('ERROR ON UPLOAD. Details: connection: '+connection+', file: '+file+', //fileName: '+fileName+', folder: '+folder+', integId: '+integId
            //					, false, integId);
            //			addLog('Upload file failed due to the following error: '+e.message, false, //integId);
            //			throw error.create({
            //				name : 'CBR.Lib.SFTP.Core -> UploadFile',
            //				message : 'Upload file failed due to the following error: '+e.message +', //integration id: '+ integId,
            //				notifyOff : false
            //		});
            //	}
        }

        function DownloadFile(connection, fileName, integId , folder) {
            try {
                if (!common.isNullOrEmpty(integId)) {
                    if (common.isNullOrEmpty(folder)) {
                        folder = search.lookupFields({
                            type: "customrecord_nc_ba_integration_types",
                            id: integId,
                            columns: ['custrecord_nc_ba_int_types_custompushurl']
                        })['custrecord_nc_ba_int_types_custompushurl'];
                    }
                    // Get the folder name from the integration type record                
                    if (!common.isNullOrEmpty(folder) && !common.isNullOrEmpty(fileName)) {
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
        function ProcessCSV(csv, integId, dateFields) {
            try {
                var allTextLines = csv.split(/\r\n|\n/);
                //	        var allTextLines = csv.replace(/\"/g, '').split(/\r\n|\n/);
                var lines = [];

                // first line is headlines, therefore start with then second line (that is index =1) 
                for (var i = 1; i < allTextLines.length; i++) {
                    var data = allTextLines[i].replace(/\"/g, '').split('|');

                    var key = '';
                    if (data[28] == '') { key = '1' }
                    else { key = GetCurrencyKey(data[28]) }

                    var isManager = false ;
                    if (data[35] == 'Yes') {
                        isManager = true
                    }
                    var terminated_date = '';
                    if (!common.isNullOrEmpty(data[22])) {
                        var date = data[22]
                        var parts = date.split(/\-|T/g);
                        var terminated_date = parts[1] + '/' + parts[2] + '/' + parts[0];
                    }
                        

                    var tempEmp = {
                        subsidiary: data[0],
                        custentity_cbr_sfc_record_id: data[1], // empId is the same as external id (so both gets the same cell)
                        externalid: data[1],
                        entityid: data[1],
                        custentity_cbr_role: data[2],
                        title: data[3],
                        employeestatus: data[4],
                        entityid: data[5],
                        firstname: data[6],
                        lastname: data[7],
                        employeetype: data[8],
                        custentity_cbr_hr_region: data[9],
                        location: data[10],
                        department: data[11],
                        custentity_cbr_hr_dep: data[12],
                        email: data[13],
                        supervisor: data[14],
                        hiredate: data[15],
                        officephone: data[16],
                        mobilephone: data[17],
                        custentity_cseg_cbr_countries: data[18],
                        custentity_cbr_office_city: data[19],
                        custentity_cbr_hr_manager: data[20],
                        custentity_cbr_division_manager: data[21],
                        releasedate: data[22],
                        custentity_cbr_extension_office: data[23],
                        custentity_cbr_last_business_change_date: data[24],
                        custentity_cbr_emp_floor: data[25],
                        custentity_cbr_emp_room: data[26],
                        custentity_cbr_department_code: data[27],
                        defaultexpensereportcurrency: key,
                        custentity_ct_emp_terminated: terminated_date,
                        custentity_ct_emp_product: data[29],
                        custentity_ct_emp_product_group: data[31],
                        custentity_ct_employee_office: data[33],
                        custentity_ct_emp_is_manager: isManager,
                        custentity_ct_emp_position_code: data[36],
                        custentity_ct_emp_fte: data[37],

                    };

                    var currEmp = {};
                    for (var prop in tempEmp) {
                        if (tempEmp.hasOwnProperty(prop)) {
                            var propVal = tempEmp[prop];

                            // if field is date
                            if (dateFields.indexOf(prop) > (-1)) {
                                var playDate = tempEmp[prop];

                                if (!common.isNullOrEmpty(playDate)) {

                                    // re-format the date to NetSuite acceptable format
                                    var parts = playDate.split(/\-|T/g);
                                    var realDate = parts[1] + '/' + parts[2] + '/' + parts[0];
                                    currEmp[prop] = realDate
                                }
                                // Ignore all empty fields
                            } else if (!common.isNullOrEmpty(propVal)) {
                                currEmp[prop] = propVal;
                            }
                        }
                    }
                    lines.push([currEmp, allTextLines[i]]);
                }
                return lines;
            } catch (e) {
                addLog("Falied to process input CSV file due to the following error: " + e.message, false, integId);
                throw error.create({
                    name: 'Falied to process input CSV file',
                    message: "Falied to process input CSV file due to the following error: " + e.message,
                    notifyOff: false
                });
            }
        }

        function CreateErrorsCsv(objList) {

            if (common.isArrayAndNotEmpty(objList)) {

                // Create the header line
                var csvContent = "EmpID,Error Msg\n";

                // Loop through the given result set, and create a line in the file for each result
                for (var i = 0; i < objList.length; i++) {

                    cuurEmp = objList[i];
                    csvContent += cuurEmp.empId + ',' +
                        cuurEmp.errMsg + '\n';
                }

                // Create file and return it
                var csvFile = file.create({
                    name: fileName,
                    fileType: file.Type.CSV,
                    contents: csvContent
                });

                //			logger.debug({
                //				title : 'csvFile',
                //				details : csvFile.getContents()
                //			});

                return csvFile;
            }
        }

        function addLog(message, success, integType) {
            // Create Log record, and submit it.
            var logRecord = record.create({
                type: 'customrecord_nc_ba_integration_types_log',
                isDynamic: true,
            });

            logRecord.setValue({
                fieldId: 'custrecord_nc_ba_integration_log_type',
                value: integType
            });
            logRecord.setValue({
                fieldId: 'custrecord_nc_ba_log_finished',
                value: success
            });
            logRecord.setValue({
                fieldId: 'custrecord_nc_ba_log_last_error',
                value: message
            });

            logRecord.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
        }

        function getFieldsMapping(integrationTypeId) {
            var mappings = null;

            //Populate all fields
            search.create({
                type: 'customrecord_nc_ba_field_mappings',
                filters: [search.createFilter({
                    name: 'isinactive',
                    operator: 'is',
                    values: ['F']
                }),
                search.createFilter({
                    name: 'custrecord_nc_ba_fld_map_int_type',
                    operator: 'is',
                    values: [integrationTypeId]
                })],
                columns: ['custrecord_bc_ba_fld_map_src_system_fld',
                    'custrecord_nc_ba_fld_map_parent',
                    'custrecord_nc_ba_fld_map_ns_fld_id',
                    'custrecord_nc_ba_fld_map_ns_fld_src_id',
                    'custrecord_nc_ba_fld_map_ns_src_key_id',
                    'custrecord_nc_ba_fld_map_is_show_stopper',
                    'custrecord_nc_ba_fld_map_set_txt']
            }).run().each(function (result) {
                mappings = mappings || {};
                var id = result.id;
                var key = result.getValue({
                    name: 'custrecord_bc_ba_fld_map_src_system_fld'
                });
                var parentRecordId = result.getValue({
                    name: 'custrecord_nc_ba_fld_map_parent'
                });
                var hasParent = !common.isNullOrEmpty(parentRecordId);

                var nsFieldId = result.getValue({
                    name: 'custrecord_nc_ba_fld_map_ns_fld_id'
                });
                var nsLookup = result.getValue({
                    name: 'custrecord_nc_ba_fld_map_ns_fld_src_id'
                });
                var nsLookup_key = result.getValue({
                    name: 'custrecord_nc_ba_fld_map_ns_src_key_id'
                });
                var isLookupStopper = result.getValue({
                    name: 'custrecord_nc_ba_fld_map_is_show_stopper'
                });
                var setTextAsIs = result.getValue({
                    name: 'custrecord_nc_ba_fld_map_set_txt'
                });

                var childs = {};

                var map = {
                    id: id,
                    key: key,
                    parentRecordId: parentRecordId,
                    hasParent: hasParent,
                    nsFieldId: nsFieldId,
                    nsLookup: nsLookup,
                    nsLookup_key: nsLookup_key,
                    isLookupStopper: isLookupStopper,
                    childs: childs,
                    setTextAsIs: setTextAsIs
                };

                mappings[map.id] = map;
                return true;
            });

            return mappings;
        }

        getMapByKey = function (key, parentFld, mappings) {
            for (var mapId in mappings) {
                if (mappings.hasOwnProperty(mapId)) {
                    var fld = mappings[mapId];
                    if (fld.key == key && ((!parentFld && !fld.hasParent) || (parentFld && fld.hasParent && parentFld.id == fld.parentRecordId))) {
                        return fld;
                    }
                }
            }
            return null;
        };
        function executeMappings(obj, parentFld, doMapKey, doMapVal, mappings) {

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    var fld = getMapByKey(key, parentFld, mappings);
                    if (fld && (!common.isNullOrEmpty(value))) {
                        var newKey = key;
                        var newVal = value;
                        //					logger.debug({
                        //						title : 'newKey, newVal',
                        //						details : newKey+' , '+ newVal
                        //					});
                        if (!common.isNullOrEmpty(fld.nsFieldId) && doMapKey) {
                            newKey = fld.nsFieldId.toLowerCase();
                        }
                        if (typeof value != 'object') {
                            if ((!common.isNullOrEmpty(fld.nsLookup)) &&
                                (!common.isNullOrEmpty(fld.nsLookup_key)) &&
                                (doMapVal && !isNullOrEmpty(value))) {
                                var sRes = search.create({
                                    type: fld.nsLookup,
                                    filters: [search.createFilter({
                                        name: 'isinactive',
                                        operator: 'is',
                                        values: ['F']
                                    }),
                                    search.createFilter({
                                        name: fld.nsLookup_key,
                                        operator: 'is',
                                        values: [value]
                                    })]
                                }).run().getRange({
                                    start: 0,
                                    end: 1
                                });
                                var aaa = search.createFilter({
                                    name: fld.nsLookup_key,
                                    operator: 'is',
                                    values: [value]
                                });

                                if (common.isArrayAndNotEmpty(sRes) && sRes.length > 0) {
                                    if (sRes.length > 1) {
                                        throw error.create({
                                            name: 'MAPPING ERROR',
                                            message: 'More than one lookup mapping was found: Field - ' + key + ' ,Value - ' + value,
                                            notifyOff: false
                                        });
                                    }
                                    newVal = sRes[0].id;
                                }
                                else {
                                    if (fld.isLookupStopper) {
                                        throw error.create({
                                            name: 'MAPPING ERROR',
                                            message: 'This lookup value was not found: Field - ' + key + ' ,Value - ' + value,
                                            notifyOff: false
                                        });
                                    }
                                    else {
                                        newVal = '';
                                    }
                                }
                            }

                            obj[newKey] = newVal;
                            if (newKey != key) {
                                delete obj[key];
                            }
                        }
                        else {
                            if (value instanceof Array) {
                                for (var i = 0; i < value.length; i++) {
                                    var arrayLine = value[i];
                                    value[i] = executeMappings(arrayLine, fld, doMapKey, doMapVal, mappings);
                                }
                            }
                            else {
                                value = executeMappings(value, fld, doMapKey, doMapVal, mappings);
                            }
                            if (newKey != key) {
                                obj[newKey] = value;
                                delete obj[key];
                            }
                        }
                    }
                }
            }
            return obj;
        }
        function getTextFieldsList(mappings) {
            var textFields = [];
            for (var mapId in mappings) {
                if (mappings.hasOwnProperty(mapId)) {
                    var fld = mappings[mapId];
                    if (fld.setTextAsIs) {
                        var realFldID = (!common.isNullOrEmpty(fld.nsFieldId)) ? fld.nsFieldId : fld.key;
                        textFields.push(realFldID);
                    }
                }
            }
            return textFields;
        }

        function retrieveMappings(integrationTypeId) {

            // check if current integration requires mapping 
            var mapInstractions = search.lookupFields({
                type: 'customrecord_nc_ba_integration_types',
                id: integrationTypeId,
                columns: ['custrecord_nc_ba_incoming_map_fields', 'custrecord_nc_ba_incoming_map_values']
            });
            if (!common.isNullOrEmpty(mapInstractions)) {
                var doMapKey = mapInstractions.custrecord_nc_ba_incoming_map_fields;
                var doMapVal = mapInstractions.custrecord_nc_ba_incoming_map_values;

                // Only if at least one form of mapping is required, perform mapping
                if (doMapKey || doMapVal) {
                    // fetch all field mapping records relevant to the this transaction 
                    var mappings = getFieldsMapping(integrationTypeId);
                    return {
                        mappings: mappings,
                        doMapKey: doMapKey,
                        doMapVal: doMapVal
                    };
                }
            }
            return null;
        }
        function mapFields(mappings, doMapKey, doMapVal, obj) {

            // if there are mapping records for this integration
            if (!common.isNullOrEmpty(mappings)) {

                // perform the mapping -(replacement of fields ids or values based on given configuration)
                var newObj = executeMappings(obj, null, doMapKey, doMapVal, mappings);
                //			logger.debug({
                //				title: 'mapFields-> newObj',
                //				details:newObj
                //			});

                return newObj;
            }
        }
        function GetIntegrationId(integCode) {

            // Search for integration type record with the given code
            var integ = search.create({
                type: "customrecord_nc_ba_integration_types",
                filters: [
                    ['custrecord_nc_ba_int_types_code', 'is', integCode]
                ]
            }).run().getRange({
                start: 0,
                end: 1
            });

            if (!common.isNullOrEmpty(integ)) {
                integId = integ[0].id;
                return integ[0].id;
            }

            return null;
        }
        function GetSufaFileName(isSecondRun) {

            //Get Date Stamp for file naming
            var now = new Date(),

                // Format time to Israel time zone
                dateStamp = formatter.format({
                    value: now,
                    type: formatter.Type.DATETIME,
                    timezone: formatter.Timezone.ASIA_JERUSALEM
                });

            // Add leading 0 to single digit numbers   
            dateStamp = dateStamp.split(' ')[0].split('/').map(function (x) { return ((x < 10) ? '0' + x : x) }).join('');
            var secondFileIndex = (isSecondRun) ? 'N' : '';
            return ("Daily" + secondFileIndex + dateStamp + '.txt');
        }
        function GetCurrencyKey(currency) {
            var key = '';
            if (currency == 'USD') { key = '1' }
            else if (currency == 'CAD') { key = '3' }
            else if (currency == 'EUR') { key = '4' }
            else if (currency == 'ILS') { key = '5' }
            else if (currency == 'GBP') { key = '6' }
            else if (currency == 'SGD') { key = '7' }
            else if (currency == 'AUD') { key = '8' }
            else if (currency == 'CNY') { key = '39' }
            else if (currency == 'DKK') { key = '12' }
            else if (currency == 'HKD') { key = '17' }
            else if (currency == 'JPY') { key = '9' }
            else if (currency == 'SEK') { key = '13' }
            else if (currency == 'ZAR') { key = '14' }
            else if (currency == 'CHF') { key = '16' }
            else if (currency == 'INR') { key = '18' }
            else if (currency == 'KRW') { key = '1' }
            else if (currency == 'TWD') { key = '1' }
            else if (currency == 'IDR') { key = '42' }
            else if (currency == 'VND') { key = '44' }


            return key;
        }

        return {
            GetSftpConnection: GetSftpConnection,
            GetSearchResults: GetSearchResults,
            CreateCsv: CreateCsv,
            UploadFile: UploadFile,
            DownloadFile: DownloadFile,
            ProcessCSV: ProcessCSV,
            CreateErrorsCsv: CreateErrorsCsv,
            addLog: addLog,
            mapFields: mapFields,
            retrieveMappings: retrieveMappings,
            getTextFieldsList: getTextFieldsList,
            GetIntegrationId: GetIntegrationId,
            GetSufaFileName: GetSufaFileName,
            GetCurrencyKey: GetCurrencyKey
        };
    });
