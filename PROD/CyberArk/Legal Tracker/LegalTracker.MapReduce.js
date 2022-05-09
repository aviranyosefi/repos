/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
var ErrorList = [];
var SuccessList = [];
define(['N/search', 'N/record', 'N/log', 'N/error', 'N/runtime', '../Common/NCS.Lib.Common', './dev_legal_tracker_sftp', 'N/file', 'N/email', 'N/cache', 'N/format'],
    function (search, record, logger, error, runtime, common, hypCore, file, email, cache, formatter) {
        var lineFolder, LineFileName, linesFieldId, secondrun;
        var SummaryName = ['Tracker Invoice Spreadsheetaccountspayable il', 'Tracker Invoice Spreadsheetaccountspayable apj', 'Tracker Invoice Spreadsheetaccountspayable emea', 'Tracker Invoice Spreadsheetaccounts payable']
        var RowName = ['Tracker Invoices.accountspayable il.', 'Tracker Invoices.accountspayable apj.', 'Tracker Invoices.accountspayable emea.', 'Tracker Invoices.accounts payable.']
        var folderNs = '1164026';
        var itemID = 2184;
        var formID = 199;
        var lineFolderPrefix = 'LegalTracker/New/'
        function getInputData() {
            var script = runtime.getCurrentScript();
            var secondrun = script.getParameter({ name: 'custscript_legal_tracker_secondrun' });
            //logger.debug('secondrun', secondrun);
            var data = [];
            if (secondrun) {
                var data = getSecondRunData();
            }
            else {
                var integId = hypCore.GetIntegrationId('legal_tracker');
                var connection = hypCore.GetSftpConnection(integId);
                var date = getDateFormat()
                logger.debug('date', date);
                for (var i = 0; i < SummaryName.length; i++) {
                    var SummaryFileName = SummaryName[i] + '2022-04-29 to 2022-04-29' + '.csv';  
                    //var SummaryFileName = SummaryName[i] + date + ' to ' + date + '.csv';  
                    var SummaryFileObj = hypCore.DownloadFile(connection, SummaryFileName, integId, null);
                    if (!common.isNullOrEmpty(SummaryFileObj)) {
                        var SummaryFileId = createFile(SummaryFileName, file.Type.CSV, SummaryFileObj.getContents())
                        var SummaryFile = file.load({ id: SummaryFileId });
                        SummaryFile = SummaryFile.getContents();
                        var fileLines = SummaryFile.split('\r\n');
                        var line = 1;
                        var lineFolder = RowName[i] + '2022-04-29 to 2022-04-29';
                        //var lineFolder = RowName[i] + date + ' to ' + date;
                        for (var i = 2; i <= fileLines.length; i++) {
                            if (!common.isNullOrEmpty(fileLines[i])) {
                                var cols = fileLines[i].replace(/\"/g, '').split(',');
                                data.push({
                                    secondrun: secondrun,
                                    SummaryFileName: SummaryFileName,
                                    SummaryFileId: SummaryFileId,
                                    line: line,
                                    integId: integId,
                                    lineFolder: lineFolder,
                                    entityName: cols[0], //Vendor Name
                                    entityShortName: cols[1], // Vendor Name (short)
                                    entity: cols[2], //Vendor ID
                                    tranid: cols[3], //Invoice Number
                                    currency: cols[5], //Invoice Currency
                                    trandate: cols[6], //Date of Invoice
                                    custbody_bill_po_reciever: cols[10], //Final Approver's Employee ID
                                    custbody_il_bill_creator: cols[10], //Final Approver's Employee ID


                                });
                                line++;
                            }
                        }
                    }
                }
            }

            logger.debug({ title: 'data ' + data.length, details: JSON.stringify(data) });
            return data;
        }
        function getSecondRunData() {

            var searchObj = search.create({
                type: "customrecord_legal_tracker_errors",
                filters:
                    [
                        ["custrecord_lt_date", "on", "today"],
                        "AND",
                        ["custrecord_lt_second_run", "is", false],
                    ],
                columns: [
                ]
            });
            var res = [];
            var resultset = searchObj.run();
            var s = [];
            var searchid = 0;
            do {
                var resultslice = resultset.getRange(searchid, searchid + 1000);
                for (var rs in resultslice) {
                    s.push(resultslice[rs]);
                    searchid++;
                }
            } while (resultslice != null && resultslice.length >= 1000);

            if (s != null) {
                for (var i = 0; i < s.length; i++) {
                    res.push({
                        secondrun: true,
                        logId: s[i].id,
                    });
                }
            }
            return res
        }
        function map(context) {
            try {
                logger.debug('mapContext', context.value);
                var ObjLine = JSON.parse(context.value)
               secondrun = ObjLine.secondrun;
                if (secondrun) {
                    var logId = ObjLine.logId;
                    var recId = record.load({ type: 'customrecord_legal_tracker_errors', id: logId });
                    linesFieldId = recId.getValue('custrecord_lt_lines_file_id');
                    LineFileName = recId.getValue('custrecord_lt_lines_file');
                    SummaryFileName = recId.getValue('custrecord_lt_summary_file')
                    line = recId.getValue('custrecord_lt_line_on_summary');
                    integId = recId.getValue('custrecord_lt_integration_id');
                    entityName = recId.getValue('custrecord_lt_vendor_name') //Vendor Name
                    entityShortName = recId.getValue('custrecordlt_vendor_name_short') // Vendor Name (short)
                    lineFolder = recId.getValue('custrecord_lt_sftp_line_folder')
                    var ObjLine = {
                        logId: logId,
                        entity: recId.getValue('custrecord_lt_vendor'),//cols[2], Vendor ID
                        tranid: recId.getValue('custrecord_lt_tranid'), //Invoice Number
                        currency: recId.getValue('custrecord_lt_currency'), //Invoice Currency
                        trandate: recId.getValue('custrecordlt_trandate'), //Date of Invoice
                        custbody_bill_po_reciever: recId.getValue('custrecord_lt_receiver'), //Final Approver's Employee ID
                        custbody_il_bill_creator: recId.getValue('custrecord_lt_receiver'), //Final Approver's Employee ID
                        linesFieldId: recId.getValue('custrecord_lt_lines_file_id'),
                        LineFileName: recId.getValue('custrecord_lt_lines_file'),
                        SummaryFileName: recId.getValue('custrecord_lt_summary_file'),
                        line: recId.getValue('custrecord_lt_line_on_summary'),
                        integId: recId.getValue('custrecord_lt_integration_id'),
                        entityName: recId.getValue('custrecord_lt_vendor_name'), //Vendor Name
                        entityShortName: recId.getValue('custrecordlt_vendor_name_short'), // Vendor Name (short)
                        lineFolder: recId.getValue('custrecord_lt_sftp_line_folder'),
                    }
                    if (common.isNullOrEmpty(linesFieldId)) {
                        getLineFile(ObjLine);
                    }
                    else { createVendorBill(ObjLine, linesFieldId) }
                }
                else {
                    getLineFile(ObjLine);

                }//else              
            } catch (e) {
                logger.debug('error map', e);
                addErrorLog(e.message, ObjLine, lineFolder, LineFileName, linesFieldId, secondrun);

            }
        }
        function getLineFile(ObjLine) {

            var integId = ObjLine.integId
            var connection = hypCore.GetSftpConnection(integId);
            lineFolder = buildLineFolder(ObjLine.lineFolder)//lineFolderPrefix + ObjLine.lineFolder + '.zip';
            LineFileName = ObjLine.entityName + ' - ' + ObjLine.tranid + '.txt'
            var fileObj = hypCore.DownloadFile(connection, LineFileName, integId, lineFolder);
            if (common.isNullOrEmpty(fileObj)) {
                LineFileName = ObjLine.entityShortName + ' - ' + ObjLine.tranid + '.txt'
                var fileObj = hypCore.DownloadFile(connection, LineFileName, integId, lineFolder);
            }
            if (!common.isNullOrEmpty(fileObj)) {
                var listFiles = connection.list({ path: lineFolder });
                var AttatchmentID = buildAttatchment(listFiles, connection, integId, lineFolder )
                //logger.debug('list', JSON.stringify(list));
                var linesFieldId = createFile(LineFileName, file.Type.PLAINTEXT, fileObj.getContents())            
                if (!common.isNullOrEmpty(linesFieldId)) {
                    createVendorBill(ObjLine, linesFieldId, AttatchmentID);
                }

            }

        }
        function createVendorBill(ObjLine, lineFile, AttatchmentID) {

            HeaderFields = ['entity', 'tranid', 'currency', 'trandate', 'custbody_bill_po_reciever', 'custbody_il_bill_creator']
            VendBillRec = record.create({ type: record.Type.VENDOR_BILL, isDynamic: true, defaultValues: { customform: formID } });
            for (var key in HeaderFields) {
                field = HeaderFields[key]
                if (HeaderFields[key] == 'currency') {
                    val = getCurrencyId(ObjLine[HeaderFields[key]])

                }
                else if (HeaderFields[key] == 'trandate') {
                    val = new Date(ObjLine[HeaderFields[key]])
                    VendBillRec.setValue({ fieldId: 'custbody_budgetdate_cc', value: val });
                }
                else { val = ObjLine[HeaderFields[key]] }
                //logger.debug(HeaderFields[key], val);
                VendBillRec.setValue({ fieldId: field, value: val });
            }
            VendBillRec.setValue({ fieldId: 'location', value: 5 });
            VendBillRec.setValue({ fieldId: 'approvalstatus', value: 2 }); // OPEN    
            VendBillRec.setValue({ fieldId: 'paymenthold', value: false });
            VendBillRec.setValue({ fieldId: 'custbody_receiver_approval', value: 1 });
            VendBillRec.setValue({ fieldId: 'memo', value: 'Synced from Legal Tracker' });

            //logger.debug('lineFile: ', lineFile);
            var txtFile = file.load({ id: lineFile });
            txtFile = txtFile.getContents();
            var allTextLines = txtFile.split(/\r\n|\n/);
            logger.debug('lines allTextLines: ', allTextLines.length);
            for (var i = 2; i < allTextLines.length; i++) {
                if (!common.isNullOrEmpty(allTextLines[i])) {
                    var data = allTextLines[i].replace(/\"/g, '').split('|');
                    var qty = data[10];
                    var desc = data[18]
                    var amount = data[12];
                    var rate = amount / qty
                    logger.debug('qty: ' + qty, 'desc: ' + desc + ' ,rate: ' + rate);
                    VendBillRec.selectNewLine({ sublistId: 'item' });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: itemID });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: rate });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'description', value: desc });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: qty });
                    VendBillRec.commitLine({ sublistId: 'item' });
                }
            }
            var VendBillID = VendBillRec.save({ enableSourcing: true, ignoreMandatoryFields: true });
            setAttach(AttatchmentID, VendBillID)
            logger.debug('vendor bill id: ', VendBillID);
            if (secondrun && VendBillID != -1 && common.isNullOrEmpty(VendBillID)) {
                 // todo
            }
       
            return VendBillID
        }
        function getCurrencyId(currency) {
            var SearchObj = search.create({
                type: 'currency',
                filters:
                    [
                        ["name", "is", currency]
                    ],
                columns:
                    [
                        "internalid"
                    ]
            });
            var val;
            SearchObj.run().each(function (result) {
                val = result.getValue({ name: "internalid" });
                return true;
            });
            return val
        }
        function getDateFormat() {
            var date = new Date();
            var dd = date.getDate();
            var mm = date.getMonth() + 1; //January is 0!
            var yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            return yyyy + '-' + mm + '-' + dd;

        }
        function addErrorLog(message, ObjLine, lineFolder, LineFileName, linesFieldId, secondrun) {
            var logRecord = record.create({
                type: 'customrecord_legal_tracker_errors',
                isDynamic: true,
            });
            logRecord.setValue({ fieldId: 'custrecord_lt_summary_file', value: ObjLine.SummaryFileName });
            logRecord.setValue({ fieldId: 'custrecord_lt_summary_file_id', value: ObjLine.SummaryFileId });
            logRecord.setValue({ fieldId: 'custrecord_lt_line_on_summary', value: ObjLine.line });
            logRecord.setValue({ fieldId: 'custrecord_lt_lines_file', value: LineFileName });
            if (!common.isNullOrEmpty(linesFieldId)) {
                logRecord.setValue({ fieldId: 'custrecord_lt_lines_file_id', value: linesFieldId });
            }
            logRecord.setValue({ fieldId: 'custrecord_lt_error_massage', value: message });
            logRecord.setValue({ fieldId: 'custrecord_lt_vendor', value: ObjLine.entity });
            logRecord.setValue({ fieldId: 'custrecord_lt_vendor_name', value: ObjLine.entityName });
            logRecord.setValue({ fieldId: 'custrecordlt_vendor_name_short', value: ObjLine.entityShortName });
            logRecord.setValue({ fieldId: 'custrecord_lt_tranid', value: ObjLine.tranid });
            logRecord.setValue({ fieldId: 'custrecord_lt_currency', value: ObjLine.currency });
            logRecord.setValue({ fieldId: 'custrecordlt_trandate', value: ObjLine.trandate });
            logRecord.setValue({ fieldId: 'custrecord_lt_sftp_line_folder', value: lineFolder });
            logRecord.setValue({ fieldId: 'custrecord_lt_receiver', value: ObjLine.custbody_bill_po_reciever });
            logRecord.setValue({ fieldId: 'custrecord_lt_second_run', value: secondrun });

            logRecord.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
        }
        function buildLineFolder(lineFolder) {
            return lineFolderPrefix + lineFolder + '.zip'

        }
        function buildAttatchment(listFiles, connection, integId,lineFolder) {
            for (var i = 0; i < listFiles.length; i++) {
                var currFileName = listFiles[i].name;              
                if (currFileName.indexOf('.pdf') != -1) {
                    logger.debug('buildAttatchment file.name: ', currFileName);
                    var fileObj = hypCore.DownloadFile(connection, currFileName, integId, lineFolder);
                    logger.debug('buildAttatchment fileObj: ', fileObj);
                    if (!common.isNullOrEmpty(fileObj)) {
                        var linesFieldId = createFile(currFileName, file.Type.PDF, fileObj.getContents())
                        return linesFieldId
                    }
                }
            }
            return '';
        }
        function createFile(fileName ,fileType , fileBody) {
            var savedFile = file.create({
                name: fileName,
                fileType: fileType,
                contents: fileBody,
                encoding: file.Encoding.UTF8,
                folder: folderNs
            });
            linesFieldId = savedFile.save();
            return linesFieldId

        }
        function setAttach(fileId, recId) {
            if (!common.isNullOrEmpty(fileId)) {
                logger.debug('setAttach fileId : ', fileId);
                record.attach({
                    record: {
                        type: 'file',
                        id: fileId
                    },
                    to: {
                        type: record.Type.VENDOR_BILL,
                        id: recId,
                    }
                });
            }         
        }
        function summarize(summary) {
            //handleErrorIfAny(summary);
            logger.debug('SuccessList ' + SuccessList.length, JSON.stringify(SuccessList))
            logger.debug('ErrorList ' + ErrorList.length, JSON.stringify(ErrorList))
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
                details: stage
            });
            var csvFile = null;
            var new_e = e || null;
            if (stage == 'reduce') {// &&(!common.isNullOrEmpty(summary.errors)) && (JSON.stringify(summary.errors) != "{}")) {

                // Create the header line of the CSV output file
                var csvContent = "EmpID|Error Msg\n";
                var innerContent = "";

                // fill content with the execution errors
                summary.errors.iterator().each(function (key, value) {
                    innerContent += key + '|' + JSON.parse(value).message + '\n';
                    logger.debug({
                        title: "error saving employee " + key,
                        details: value
                    });
                    return true;
                });
                logger.debug({
                    title: 'innerContent',
                    details: innerContent
                });

                if (innerContent != "") {
                    new_e = error.create({
                        name: 'REDUCE_STAGE_FAILED',
                        message: 'REDUCE_STAGE_FAILED'
                    });

                    csvContent += innerContent

                    // Create file
                    csvFile = file.create({
                        name: 'SuccessFactor-Netsuite Employee Sync Errors.csv',
                        fileType: file.Type.CSV,
                        contents: csvContent
                    });
                }
            }
            if (!common.isNullOrEmpty(new_e)) {
                var subject = 'Map/Reduce script ' + runtime.getCurrentScript().id + ' failed for stage: ' + stage;
                var body = 'An error occurred with the following information:\n' +
                    'Error msg: ' + new_e.message;
                var cachedIntegID = hypCore.GetIntegrationId('success_factors');

                // Get Recipients
                var rcps = search.lookupFields({
                    type: 'customrecord_nc_ba_integration_types',
                    id: cachedIntegID,
                    columns: ['custrecord_nc_ba_int_types_notifyemploye']
                }).custrecord_nc_ba_int_types_notifyemploye;

                var author = search.lookupFields({
                    type: 'customrecord_nc_batch_integration_setup',
                    id: 1,
                    columns: ['custrecord_nc_ba_int_user']
                }).custrecord_nc_ba_int_user;

                if (common.isArrayAndNotEmpty(author)) {
                    author = author[0].value;
                    var recipients = [author];
                    if (common.isArrayAndNotEmpty(rcps)) {
                        var recpList = [];
                        for (var i = 0; i < rcps.length; i++) {
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
                        isInternalOnly: false
                    };

                    if (!common.isNullOrEmpty(csvFile)) {
                        emailContent.attachments = [csvFile];
                    }

                    email.send(emailContent);
                }
            }
        }




        return {
            getInputData: getInputData,
            map: map,
            //reduce: reduce,
            summarize: summarize

        };
    });
