/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/log', 'N/error', 'N/runtime', '../Common/NCS.Lib.Common', './dev_legal_tracker_sftp', 'N/file', 'N/email', 'N/render'],
    function (search, record, logger, error, runtime, common, hypCore, file, email, render) {
        var lineFolder, LineFileName, linesFieldId, errorLodId, recId;
        var SummaryName = ['Tracker Invoice Spreadsheetaccountspayable il', 'Tracker Invoice Spreadsheetaccountspayable apj', 'Tracker Invoice Spreadsheetaccountspayable emea', 'Tracker Invoice Spreadsheetaccounts payable']
        var RowName = ['Tracker Invoices.accountspayable il.', 'Tracker Invoices.accountspayable apj.', 'Tracker Invoices.accountspayable emea.', 'Tracker Invoices.accounts payable.']
        var FOLDER_NS = 1164026;
        var ITEM_ID = 2184;
        var FORM_ID = 199;
        var GLOBAL_EMAIL_TEMPLATE = 47;
        var GLOBAL_ERRORS_EMAIL_TEMPLATE = 48;
        var GLOBAL_ERROR_RECIVER = 208493; // SHAY S
        var lineFolderPrefix = 'LegalTracker/New/'
        function getInputData() {
            var script = runtime.getCurrentScript();
            var errorLodId = script.getParameter({ name: 'custscript_legal_tracker_errorid' });
            logger.debug('errorLodId', errorLodId);          
            var data = [];
            if (!common.isNullOrEmpty(errorLodId) ) {
                var data = getSecondRunData(errorLodId);
            }
            else {    
                var integId = hypCore.GetIntegrationId('legal_tracker');
                var connection = hypCore.GetSftpConnection(integId);
                var date = getDateFormat() //'2022-06-08'
                logger.debug('date', date);
                for (var z = 0; z < SummaryName.length; z++) {
                    //var SummaryFileName = SummaryName[i] + '2022-05-15 to 2022-05-15' + '.csv';  
                    var SummaryFileName = SummaryName[z] + date + ' to ' + date + '.csv';  
                    logger.debug('SummaryFileName', SummaryFileName);
                    var SummaryFileObj = hypCore.DownloadFile(connection, SummaryFileName, integId, null);
                    if (!common.isNullOrEmpty(SummaryFileObj)) {
                        var SummaryFileId = createFile(SummaryFileName, file.Type.CSV, SummaryFileObj.getContents())
                        var SummaryFile = file.load({ id: SummaryFileId });
                        SummaryFile = SummaryFile.getContents();
                        var fileLines = SummaryFile.split('\r\n');
                        var line = 1;
                        //var lineFolder = RowName[i] + '2022-05-15 to 2022-05-15';
                        var lineFolder = RowName[z] + date + ' to ' + date;
                        for (var i = 2; i <= fileLines.length; i++) {
                            if (!common.isNullOrEmpty(fileLines[i])) {
                                //logger.debug('fileLines[i]', fileLines[i]);
                                //var cols = fileLines[i].replace(/\"/g, '').split(','); 
                                var cols = fileLines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                                data.push({
                                    errorLodId: errorLodId,
                                    SummaryFileName: SummaryFileName,
                                    SummaryFileId: SummaryFileId,
                                    line: line,
                                    integId: integId,
                                    lineFolder: lineFolder,
                                    entityName: fixString(cols[0]), //Vendor Name
                                    entityShortName: fixString(cols[1]), // Vendor Name (short)
                                    entity: fixString(cols[2]), //Vendor ID
                                    tranid: fixString(cols[3]), //Invoice Number
                                    currency: fixString(cols[5]), //Invoice Currency
                                    trandate: fixString(cols[6]), //Date of Invoice
                                    custbody_bill_po_reciever: fixString(cols[9]), //Final Approver's Employee ID
                                    custbody_il_bill_creator: fixString(cols[9]), //Final Approver's Employee ID
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
        function getSecondRunData(errorLodId) {

            var searchObj = search.create({
                type: "customrecord_legal_tracker_errors",
                filters:
                    [
                        ["internalid", "anyof", errorLodId],
                        "AND",
                        ["custrecord_lt_bill", "anyof", '@NONE@'],
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
                        errorLodId: errorLodId,
                        logId: s[i].id,
                    });
                }
            }
            return res
        }
        function fixString(str) {
            if (!common.isNullOrEmpty(str))
                return str.replace(/\"/g, '')
        }
        function map(context) {
            try {
                logger.debug('mapContext', context.value);
                var ObjLine = JSON.parse(context.value)
                errorLodId = ObjLine.errorLodId;
                if (!common.isNullOrEmpty(errorLodId)) {
                    var logId = ObjLine.logId;
                    recId = record.load({ type: 'customrecord_legal_tracker_errors', id: logId });                 
                    SummaryFileName = recId.getValue('custrecord_lt_summary_file')                   
                    integId = recId.getValue('custrecord_lt_integration_id');
                    var connection = hypCore.GetSftpConnection(integId);
                    var SummaryFileObj = hypCore.DownloadFile(connection, SummaryFileName, integId, null);
                    if (!common.isNullOrEmpty(SummaryFileObj)) {
                        var SummaryFileId = createFile(SummaryFileName, file.Type.CSV, SummaryFileObj.getContents())                       
                        var SummaryFile = file.load({ id: SummaryFileId });
                        SummaryFile = SummaryFile.getContents();
                        var fileLines = SummaryFile.split('\r\n');
                        line = recId.getValue('custrecord_lt_line_on_summary');
                        lineFolder = recId.getValue('custrecord_lt_sftp_line_folder')
                        lineOnSummaryFile = Number(line) + 1
                        //var cols = fileLines[lineOnSummaryFile].replace(/\"/g, '').split(',');
                        var cols = fileLines[lineOnSummaryFile].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                        //logger.debug('cols', cols);
                        var ObjLine = {
                            errorLodId: errorLodId,
                            SummaryFileName: SummaryFileName,
                            SummaryFileId: SummaryFileId,
                            line: line,
                            integId: integId,
                            lineFolder: lineFolder,
                            entityName: fixString(cols[0]), //Vendor Name
                            entityShortName: fixString(cols[1]), // Vendor Name (short)
                            entity: fixString(cols[2]), //Vendor ID
                            tranid: fixString(cols[3]), //Invoice Number
                            currency: fixString(cols[5]), //Invoice Currency
                            trandate: fixString(cols[6]), //Date of Invoice
                            custbody_bill_po_reciever: fixString(cols[9]), //Final Approver's Employee ID
                            custbody_il_bill_creator: fixString(cols[9]), //Final Approver's Employee ID
                        }
                        getLineFile(ObjLine);
                    }
                }
                else {
                    getLineFile(ObjLine);

                }//else              
            } catch (e) {
                logger.error('error map', e);
                if (common.isNullOrEmpty(errorLodId)) {
                    addErrorLog(e.message, ObjLine, lineFolder, LineFileName, linesFieldId);
                }
                else {
                    recId.setValue('custrecord_lt_error_massage', e.message)
                    recId.save({enableSourcing: true,ignoreMandatoryFields: true});
                }
            }
        }
        function getLineFile(ObjLine) {
            logger.debug('getLineFile ObjLine', JSON.stringify(ObjLine));
            var integId = ObjLine.integId
            if (!common.isNullOrEmpty(errorLodId)) {
                lineFolder = ObjLine.lineFolder
            } else {
                lineFolder = buildLineFolder(ObjLine.lineFolder)//lineFolderPrefix + ObjLine.lineFolder + '.zip';
            }
            var connection = hypCore.GetSftpConnection(integId);      
            var listFiles = connection.list({ path: lineFolder });         
            var AttatchmentID = buildAttatchment(listFiles, connection, integId, lineFolder ) 
            var linesFieldId = saveLinesFile(listFiles, connection, integId, lineFolder)
            if (!common.isNullOrEmpty(linesFieldId)) {
                createVendorBill(ObjLine, linesFieldId, AttatchmentID);
            }
        }
        function createVendorBill(ObjLine, lineFile, AttatchmentID) {
            logger.debug('createVendorBill ObjLine', JSON.stringify(ObjLine));
            var reciver = ObjLine.custbody_bill_po_reciever
            HeaderFields = ['entity', 'tranid', 'currency', 'trandate', 'custbody_bill_po_reciever', 'custbody_il_bill_creator']
            VendBillRec = record.create({ type: record.Type.VENDOR_BILL, isDynamic: true, defaultValues: { customform: FORM_ID } });
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
            VendBillRec.setValue({ fieldId: 'custbody_source_system', value: 2 }); // Legal Tracker
            

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
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: ITEM_ID });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: rate });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'description', value: desc });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: qty });
                    VendBillRec.commitLine({ sublistId: 'item' });
                }
            }
            var VendBillID = VendBillRec.save({ enableSourcing: true, ignoreMandatoryFields: true });
            setAttach(AttatchmentID, VendBillID)
            logger.debug('vendor bill id: ', VendBillID);
            if (!common.isNullOrEmpty(errorLodId)  && VendBillID != -1 && !common.isNullOrEmpty(VendBillID)) {
                // update
                recId.setValue({ fieldId: 'custrecord_lt_bill', value: VendBillID });
                recId.setValue({ fieldId: 'custrecord_lt_summary_file_id', value: ObjLine.SummaryFileId });
                recId.setValue({ fieldId: 'custrecord_lt_lines_file_id', value: lineFile });
                recId.save({ enableSourcing: true, ignoreMandatoryFields: true });
                sendEmail(reciver, VendBillID)
            } 
            else if (VendBillID != -1 && !common.isNullOrEmpty(VendBillID)) {
                sendEmail(reciver, VendBillID)
            }
            return VendBillID
        }
        function saveLinesFile(listFiles, connection, integId, lineFolder) {
            for (var i = 0; i < listFiles.length; i++) {
                var currFileName = listFiles[i].name;
                if (currFileName.indexOf('.txt') != -1) {
                    logger.debug('buildAttatchment file.name: ', currFileName);
                    var fileObj = hypCore.DownloadFile(connection, currFileName, integId, lineFolder);
                    logger.debug('buildAttatchment fileObj: ', fileObj);
                    if (!common.isNullOrEmpty(fileObj)) {
                        var linesFieldId = createFile(currFileName, file.Type.PLAINTEXT, fileObj.getContents()) 
                        return linesFieldId
                    }
                }
            }
            return '';
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
        function addErrorLog(message, ObjLine, lineFolder, LineFileName, linesFieldId) {
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
            //logRecord.setValue({ fieldId: 'custrecord_lt_second_run', value: secondrun });

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
                folder: FOLDER_NS
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
        function sendEmail(reciver, VendBillID ) {
            var mergeResult = render.mergeEmail({
                templateId: GLOBAL_EMAIL_TEMPLATE,
                entity: null,
                recipient: null,
                supportCaseId: null,
                transactionId: VendBillID,
                customRecord: null
            });
            var emailSubject = mergeResult.subject;
            var emailBody = mergeResult.body;

            email.send({
                author: reciver,
                recipients: reciver,
                subject: emailSubject,
                body: emailBody,
                relatedRecords: {
                    transactionId: VendBillID
                }
            });           
        }
        function summarize(summary) {
            try { 
                var errArr = getDodayErrors()
                logger.debug('errorsList ' + errArr.length, JSON.stringify(errArr))                         
                if (errArr.length > 0) {
                    //var htmlbBody = BuildHtml();
                    //failTbl = htmlbBody
                    var failTbl = ' <p style= \'font-weight: bold ;color: red; font-size:140%; \'> Total: ' + errArr.length + ' failed</p><br>';
                    failTbl += "<table class='errtable' style = \"width: 100 %;\" >";
                    // for th
                    failTbl += "<tr><th class='errtable' >Vendor</th><th  class='errtable'>Bill#</th><th  class='errtable'>Summary File</th><th  class='errtable'>Line</th><th  class='errtable'>Error</th></tr>";
                    for (var s in errArr) {
                        failTbl += "<tr><td class='errtable'>" + errArr[s].vendor + "</td><td  class='errtable'>" + errArr[s].tranid + "</td><td class='errtable'>" + errArr[s].summary_file + "</td><td class='errtable'>" + errArr[s].line + "</td><td class='errtable'>" + errArr[s].error + "</td></tr > ";
                    }
                    failTbl += "</table>"

                    var mergeResult = render.mergeEmail({
                        templateId: GLOBAL_ERRORS_EMAIL_TEMPLATE,
                        entity: {
                            type: 'employee',
                            id: GLOBAL_ERROR_RECIVER
                        },
                        recipient: null,
                        supportCaseId: null,
                        transactionId: null,
                        customRecord: null
                    });
                    var emailSubject = mergeResult.subject;
                    var emailBody = mergeResult.body;
                    emailBody = emailBody.replace('//failTbl//', failTbl);
                    email.send({
                        author: GLOBAL_ERROR_RECIVER,
                        recipients: GLOBAL_ERROR_RECIVER,
                        subject: emailSubject,
                        body: emailBody,
                        relatedRecords: null
                    }); 
                } 
            } catch (e) {
                logger.error('error summary', e);
            }
        }
        function getDodayErrors() {

            var searchObj = search.create({
                type: "customrecord_legal_tracker_errors",
                filters:
                    [
                        ["created", "on", "today"],
                        "AND",
                        ["custrecord_lt_bill", "anyof", '@NONE@'],
                    ],
                columns: [
                    "custrecord_lt_tranid", "custrecord_lt_error_massage", "custrecord_lt_summary_file", "custrecord_lt_vendor_name", "custrecord_lt_line_on_summary"
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
                        tranid: s[i].getValue("custrecord_lt_tranid"),
                        error: s[i].getValue("custrecord_lt_error_massage"),
                        summary_file: s[i].getValue("custrecord_lt_summary_file"),
                        vendor: s[i].getValue("custrecord_lt_vendor_name"),
                        line: s[i].getValue("custrecord_lt_line_on_summary"),
                    });
                }
            }
            return res
        }
   
        return {
            getInputData: getInputData,
            map: map,
            summarize: summarize

        };
    });
