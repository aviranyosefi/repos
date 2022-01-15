/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

define(['N/record', 'N/email', 'N/render', 'N/runtime', 'N/url', 'N/search'],
    function (record, email, render, runtime, url, search) {
        function beforeSubmit(context) {
            var rec = context.newRecord;
            log.debug('rec', JSON.stringify(rec))
            var recTYPE = rec.type;
            if (recTYPE == record.Type.MESSAGE) {
                var template = rec.getValue('template');
                log.debug('template', template)
                if (template == 45) {
                    var emailBody = rec.getValue('message');
                    //log.debug('emailBody', emailBody)
                    var vendRecId = rec.getValue('entity')
                    log.debug('vendRecId', vendRecId)
                    var logData = createLog(vendRecId, '');
                    var pass = logData[1];
                    var logID = logData[0];
                    var urlScript = getURL();
                    urlScript += '&log=' + logID
                    emailBody = emailBody.replace('#url#', urlScript);
                    emailBody = emailBody.replace('#pass#', pass);
                    rec.setValue('message', emailBody);
                    record.submitFields({
                        type: record.Type.VENDOR,
                        id: vendRecId,
                        values: {
                            'custentity_nc_vqa_vend_auth_status': 3,
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }
            }
        }
        function afterSubmit(context) {
            try {
                if (context.type == context.UserEventType.CREATE) {
                    var rec = context.newRecord;
                    var recTYPE = rec.type;
                    if (recTYPE == 'customrecord_vendors_quick_add') {
                        var vendor_name = rec.getValue('custrecord_quick_add_vendor_name');
                        var ven_email = rec.getValue('custrecord_quick_add_vendor_email');
                        var sub = rec.getValue('custrecord_quick_add_vendor_sub');
                        var currency = rec.getValue('custrecord_quick_add_primary_currency');
                        vendRecord = record.create({
                            type: record.Type.VENDOR,
                            isDynamic: true,
                            defaultValues: { customform: 102 }
                        });
                        vendRecord.setValue({
                            fieldId: 'companyname',
                            value: vendor_name
                        });
                        vendRecord.setValue({
                            fieldId: 'email',
                            value: ven_email
                        });
                        vendRecord.setValue({
                            fieldId: 'custentity_2663_email_address_notif',
                            value: ven_email
                        });                       
                        vendRecord.setValue({
                            fieldId: 'subsidiary',
                            value: sub
                        });
                        vendRecord.setValue({
                            fieldId: 'currency',
                            value: currency
                        });
                        var terms = 18
                        if (sub == 18 || sub == 23 ) {
                            terms= 2
                        }
                        vendRecord.setValue({
                            fieldId: 'terms',
                            value: terms
                        });
                        if (sub == 18 ) {
                            vendRecord.setValue({
                                fieldId: 'payablesaccount',
                                value: 115
                            });
                        }                   
                        vendRecord.setValue({
                            fieldId: 'custentity_nc_vqa_vend_auth_status',
                            value: 3
                        });
                        vendRecord.setValue({
                            fieldId: 'custentity_vendor_creator',
                            value: runtime.getCurrentUser().id
                        });

                        vendRecId = vendRecord.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                        log.debug('vendRecId id:', vendRecId);
                        if (vendRecId != -1) {
                            var vqa_rec = record.load({
                                type: 'customrecord_vendors_quick_add',
                                id: rec.id,
                                isDynamic: false,
                            });
                            vqa_rec.setValue('custrecord_quick_add_vendor_id', vendRecId);
                            vqa_rec.save();
                            var logData = createLog(vendRecId, rec.id);
                            var pass = logData[1];
                            var logID = logData[0];
                            log.debug('pass id:', pass);
                            createFolder(vendRecId);
                            sendEmailToVend(vendRecId, logID, pass);

                        }
                    }
                }
            } catch (e) { }
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function createLog(vendRecId, id) {
            try {
                var pass = Math.random().toString(36).slice(-8);
                logRecord = record.create({
                    type: 'customrecord_vendors_quick_add_logs',
                    isDynamic: true,
                });
                logRecord.setValue({
                    fieldId: 'custrecord_vend_password',
                    value: pass
                });
                logRecord.setValue({
                    fieldId: 'custrecord_vend_id',
                    value: vendRecId
                });
                logRecord.setValue({
                    fieldId: 'custrecord_vendors_quick_add_id',
                    value: id
                });
                logRecId = logRecord.save();
                var logData = [];
                logData[0] = logRecId
                logData[1] = pass

                //log.debug(' 1 logData:', JSON.stringify(logData));
                return logData;

            } catch (e) {
                log.error('error createLog :', e);
            }
        }
        function sendEmailToVend(vendRecId, logID, pass) {
            try {
                log.debug('log:', logID);
                if (logID != -1 && !isNullOrEmpty(logID)) {
                    var urlScript = getURL();
                    urlScript += '&log=' + logID
                    var mergeResult = render.mergeEmail({
                        templateId: 45,
                        entity: {
                            type: 'vendor',
                            id: parseInt(vendRecId)
                        },
                        recipient: null,
                        supportCaseId: null,
                        transactionId: null,
                        customRecord: null
                    });
                    var emailSubject = mergeResult.subject;
                    log.error('emailSubject:', emailSubject);
                    var emailBody = mergeResult.body;
                    emailBody = emailBody.replace('#pass#', pass);
                    emailBody = emailBody.replace('#url#', urlScript);

                    email.send({
                        author: runtime.getCurrentUser().id,
                        recipients: vendRecId,
                        subject: emailSubject,
                        body: emailBody,
                        relatedRecords: {
                            entityId: vendRecId
                        }
                    });
                    log.debug('send email:', emailBody);
                }
            } catch (e) {
                log.error('error sendEmail :', e);
            }
        }
        function getURL() {

            var suitletURL = url.resolveScript({
                scriptId: 'customscript_dev_ven_quick_add_su',
                deploymentId: 'customdeploy1',
                returnExternalUrl: true
            });
            return suitletURL;
        }
        function createFolder(vendRecId) {
            var folderId = getFolder(vendRecId);
            if (isNullOrEmpty(folderId)) {
                folderRecord = record.create({
                    type: record.Type.FOLDER,
                    isDynamic: true,
                });
                // VENDORS QUICK ADD folder
                folderRecord.setValue({
                    fieldId: 'parent',
                    value: 1057074  
                });
                folderRecord.setValue({
                    fieldId: 'name',
                    value: vendRecId
                });
                folderRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });
            }
        }
        function getFolder(vendRecId) {
            var SearchObj = search.create({
                type: 'folder',
                filters:
                    [
                        ["name", "is", vendRecId]
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

        return {
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit,
        };
    });

