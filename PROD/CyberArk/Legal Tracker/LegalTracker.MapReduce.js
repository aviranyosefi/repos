/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
var ErrorList = [];
var SuccessList = [];
define(['N/search', 'N/record', 'N/log', 'N/error', 'N/runtime', '../Common/NCS.Lib.Common', './dev_legal_tracker_sftp', 'N/file', 'N/email', 'N/cache', 'N/format'],
    function (search, record, logger, error, runtime, common, hypCore, file, email, cache, formatter) {
        var fielsName = ['Tracker Invoice Spreadsheetaccountspayable il', 'Tracker Invoice Spreadsheetaccountspayable apj', 'Tracker Invoice Spreadsheetaccountspayable emea', 'Tracker Invoice Spreadsheetaccounts payable']
        function getInputData() {

            var integId = hypCore.GetIntegrationId('legal_tracker');
            var connection = hypCore.GetSftpConnection(integId);
           
            //=============== Download File From SFTP server ===========
            var fileName = 'Tracker Invoice Spreadsheetaccountspayable il2021-12-07 to 2021-12-07'
            var fileObj = hypCore.DownloadFile(connection, fileName+'.csv', integId , null);


            var savedFile = file.create({
                name: fileName+'.csv',
                fileType: file.Type.CSV,
                contents: fileObj.getContents(),
                folder: '1164026'
            });       
            savedFileId = savedFile.save();

            var csvFile = file.load({ id: savedFileId });
            csvFile = csvFile.getContents();
            var fileLines = csvFile.split('\r\n');
            var data = [];
            var line = 1;
            for (var i = 2; i <= fileLines.length; i++) {
                if (!common.isNullOrEmpty(fileLines[i])) {
                    var cols = fileLines[i].replace(/\"/g, '').split(',');
                    data.push({ 
                        line: line,
                        integId: integId,
                        folder: fileName,
                        entityName: cols[0],
                        entityShortName: cols[1],
                        entity: cols[2],
                        tranid: cols[3],
                        currency: cols[5],
                        trandate: cols[6]
                    });
                    line++;
                }
            }
            logger.debug({title: 'data',details: JSON.stringify(data)});
            return data;
        }

        function map(context) {
            try {
                logger.debug('mapContext', context.value);
                var ObjLine = JSON.parse(context.value)
                var integId = ObjLine.integId 
                var connection = hypCore.GetSftpConnection(integId);
                var folder = ObjLine.folder + '.zip';              
                folder = 'Tracker Invoices.accountspayable il.2021-12-07 to 2021-12-07.zip'
                var fileName = ObjLine.entityName + ' - ' + ObjLine.tranid                     
                var fileObj = hypCore.DownloadFile(connection, fileName + '.txt', integId, 'LegalTracker/New/' + folder);
                if (common.isNullOrEmpty(fileObj)) {
                    var fileName = ObjLine.entityShortName + ' - ' + ObjLine.tranid
                    var fileObj = hypCore.DownloadFile(connection, fileName + '.txt', integId, 'LegalTracker/New/' + folder);
                }
                //logger.debug('fileObj', fileObj);
                var savedFile = file.create({
                    name: fileName,
                    fileType: file.Type.PLAINTEXT,
                    contents: fileObj.getContents(),
                    encoding: file.Encoding.UTF8,
                    folder: '1164026'
                });
                savedFileId = savedFile.save();               
                var id = createVendorBill(ObjLine, savedFileId);
                if (id != -1) {
                    SuccessList.push({
                        line: ObjLine.line,
                        entityName: ObjLine.entityName,
                        billID: id
                    })
                }
            } catch (e) {
                logger.debug('error map', e);
                ErrorList.push({               
                    line: ObjLine.line,
                    error: e.message,                    
                })
            }
        }
        function createVendorBill(ObjLine, lineFile) {
            try { 
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
                VendBillRec.setValue({ fieldId: 'memo', value: 'legal bills' });
                VendBillRec.setValue({ fieldId: 'location', value: 5 });
                VendBillRec.setValue({ fieldId: 'custbody_il_bill_creator', value: 32229 });
                VendBillRec.setValue({ fieldId: 'custbody_bill_po_reciever', value: 32229 });
                var txtFile = file.load({ id: lineFile });
                txtFile = txtFile.getContents();              
                var allTextLines = txtFile.split(/\r\n|\n/);
                for (var i = 2; i < allTextLines.length; i++) {
                    if (!common.isNullOrEmpty(allTextLines[i])) {
                         var data = allTextLines[i].replace(/\"/g, '').split('|');         
                        var qty = data[10];
                        var desc = data[18]
                        var rate = data[20]
                        //logger.debug('qty: ' + qty, 'desc: ' + desc + ' ,rate: ' + rate);  
                        VendBillRec.selectNewLine({ sublistId: 'item' });
                        VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: 2184 });
                        VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: rate });
                        VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'description', value: desc });
                        VendBillRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: qty });
                        VendBillRec.commitLine({ sublistId: 'item'});
                    }      
                }  
                var id = VendBillRec.save({ enableSourcing: true, ignoreMandatoryFields: true });
                logger.debug('id: ', id);
                return id
            } catch (e) {
                logger.debug('error createVendorBill', e);
                ErrorList.push({
                    line: ObjLine.line,
                    error: e.message,
                })
            }
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
