/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
var ErrorList = [];
var SuccessList = [];
define(['N/search', 'N/record', 'N/log', 'N/error', 'N/runtime', '../Common/NCS.Lib.Common', './dev_legal_tracker_sftp', 'N/file', 'N/email', 'N/cache', 'N/format'],
    function (search, record, logger, error, runtime, common, hypCore, file, email, cache, formatter) {
        var SummaryName = ['Tracker Invoice Spreadsheetaccountspayable il', 'Tracker Invoice Spreadsheetaccountspayable apj', 'Tracker Invoice Spreadsheetaccountspayable emea', 'Tracker Invoice Spreadsheetaccounts payable']
        var RowName = ['Tracker Invoices.accountspayable il.', 'Tracker Invoices.accountspayable apj.', 'Tracker Invoices.accountspayable emea.', 'Tracker Invoices.accounts payable.']
        var folderNs = '1164026'
        function getInputData() {
            var integId = hypCore.GetIntegrationId('legal_tracker');
            var connection = hypCore.GetSftpConnection(integId);
            var date = getDateFormat()
            logger.debug('date', date);
            for (var i = 0; i < SummaryName.length; i++) {
                var SummaryFileName = SummaryName[i] + '2022-02-20 to 2022-02-20' + '.csv';  
                //var SummaryFileName = SummaryName[i] + date + ' to ' + date+ '.csv';  
                var fileObj = hypCore.DownloadFile(connection, SummaryFileName, integId, null);              
                if (!common.isNullOrEmpty(fileObj)) {
                    var savedFile = file.create({
                        name: SummaryFileName,
                        fileType: file.Type.CSV,
                        contents: fileObj.getContents(),
                        folder: folderNs
                    });
                    SummaryFileId = savedFile.save();
                    var SummaryFile = file.load({ id: SummaryFileId });
                    SummaryFile = SummaryFile.getContents();
                    var fileLines = SummaryFile.split('\r\n');
                    var data = [];
                    var line = 1;
                    var lineFolder = RowName[i] + '2022-02-20 to 2022-02-20';   
                    //var lineFolder = RowName[i] + date + ' to ' + date;
                    for (var i = 2; i <= fileLines.length; i++) {
                        if (!common.isNullOrEmpty(fileLines[i])) {
                            var cols = fileLines[i].replace(/\"/g, '').split(',');
                            data.push({
                                SummaryFileName: SummaryFileName,
                                line: line,
                                integId: integId,
                                lineFolder: lineFolder,
                                entityName: cols[0],
                                entityShortName: cols[1],
                                entity:  '618100' ,//cols[2],
                                tranid: cols[3],
                                currency: cols[5],
                                trandate: cols[6]
                            });
                            line++;
                        }
                    }
                }
            }
            logger.debug({ title: 'data ' + data.length, details: JSON.stringify(data) });
            return data;
        }

        function map(context) {
            try {
                logger.debug('mapContext', context.value);
                var ObjLine = JSON.parse(context.value)
                var integId = ObjLine.integId 
                var connection = hypCore.GetSftpConnection(integId);
                var lineFolder = 'LegalTracker/New/' + ObjLine.lineFolder + '.zip';              
                var LineFileName = ObjLine.entityName + ' - ' + ObjLine.tranid+ '.txt'                   
                var fileObj = hypCore.DownloadFile(connection, LineFileName , integId, lineFolder);
                if (common.isNullOrEmpty(fileObj)) {
                    var LineFileName = ObjLine.entityShortName + ' - ' + ObjLine.tranid + '.txt'
                    var fileObj = hypCore.DownloadFile(connection, LineFileName, integId, lineFolder);
                }
                if (!common.isNullOrEmpty(fileObj)) {
                    var savedFile = file.create({
                        name: LineFileName,
                        fileType: file.Type.PLAINTEXT,
                        contents: fileObj.getContents(),
                        encoding: file.Encoding.UTF8,
                        folder: folderNs
                    });
                    linesFieldId = savedFile.save();
                    var id = createVendorBill(ObjLine, linesFieldId);
                    if (id != -1) {
                        SuccessList.push({
                            line: ObjLine.line,
                            entityName: ObjLine.entityName,
                            billID: id
                        })
                    }
                }       
            } catch (e) {
                logger.debug('error map', e);
                addErrorLog(e.message, ObjLine, lineFolder, LineFileName, linesFieldId  );
          
            }
        }
        function createVendorBill(ObjLine, lineFile) {
             
            HeaderFields = ['entityName', 'tranid', 'currency' , 'trandate' ]
            VendBillRec = record.create({ type: record.Type.VENDOR_BILL, isDynamic: true, defaultValues: { customform: 199 } });
            for (var key in HeaderFields) {
                field = HeaderFields[key]
                if (HeaderFields[key] == 'currency') {
                    val = getCurrencyId(ObjLine[HeaderFields[key]])
                    
                }
                else if (HeaderFields[key] == 'trandate') {
                    val = new Date(ObjLine[HeaderFields[key]])
                }
                else if (HeaderFields[key] == 'entityName') {
                    val =  '618100' // getEntityId(ObjLine[HeaderFields[key]]);
                    field= 'entity'
                }
                else { val = ObjLine[HeaderFields[key]] }
                //logger.debug(HeaderFields[key], val);
                VendBillRec.setValue({ fieldId: field, value: val });
            }
            VendBillRec.setValue({ fieldId: 'memo', value: 'Synced from Legal Tracker' });
            VendBillRec.setValue({ fieldId: 'location', value: 5 });
            VendBillRec.setValue({ fieldId: 'custbody_il_bill_creator', value: 32229 });// TODO
            VendBillRec.setValue({ fieldId: 'custbody_bill_po_reciever', value: 32229 });// TODO
            //VendBillRec.setValue({ fieldId: 'custbody_budgetdate_cc', value: 32229 }); // TODO
            VendBillRec.setValue({ fieldId: 'paymenthold', value: false }); 
            VendBillRec.setValue({ fieldId: 'custbody_receiver_approval', value: 1 }); // YES
               
                             
            var txtFile = file.load({ id: lineFile });
            txtFile = txtFile.getContents();              
            var allTextLines = txtFile.split(/\r\n|\n/);
            for (var i = 2; i < allTextLines.length; i++) {
                if (!common.isNullOrEmpty(allTextLines[i])) {
                        var data = allTextLines[i].replace(/\"/g, '').split('|');         
                    var qty = data[10];
                    var desc = data[18]
                    var amount = data[12];
                    var rate = amount / qty
                    logger.debug('qty: ' + qty, 'desc: ' + desc + ' ,rate: ' + rate);  
                    VendBillRec.selectNewLine({ sublistId: 'item' });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: '' });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: rate });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'description', value: desc });
                    VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: qty });
                    VendBillRec.commitLine({ sublistId: 'item'});
                }      
            }  
            var id = VendBillRec.save({ enableSourcing: true, ignoreMandatoryFields: true });
            logger.debug('id: ', id);
            return id
        }
        function getEntityId(vendorName) {
            var SearchObj = search.create({
                type: 'vendor',
                filters:
                    [
                        ["entityid", "is", vendorName]
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
            logRecord.setValue({fieldId: 'custrecord_lt_summary_file',value: ObjLine.SummaryFileName});
            logRecord.setValue({fieldId: 'custrecord_lt_line_on_summary',value: ObjLine.line});
            logRecord.setValue({fieldId: 'custrecord_lt_lines_file',value: LineFileName});
            if (!common.isNullOrEmpty(linesFieldId)) {
                logRecord.setValue({fieldId: 'custrecord_lt_lines_file_id',value: linesFieldId});
            }
            logRecord.setValue({ fieldId: 'custrecord_lt_error_massage', value: message });
            logRecord.setValue({ fieldId: 'custrecord_lt_vendor', value: ObjLine.entity });
            logRecord.setValue({ fieldId: 'custrecord_lt_vendor_name', value: ObjLine.entityName });
            logRecord.setValue({ fieldId: 'custrecordlt_vendor_name_short', value: ObjLine.entityShortName });
            logRecord.setValue({ fieldId: 'custrecord_lt_tranid', value: ObjLine.tranid });
            logRecord.setValue({ fieldId: 'custrecord_lt_currency', value: ObjLine.currency });
            logRecord.setValue({ fieldId: 'custrecordlt_trandate', value: ObjLine.trandate });
            logRecord.setValue({ fieldId: 'custrecord_lt_sftp_line_folder', value: lineFolder });
                  
            logRecord.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
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
