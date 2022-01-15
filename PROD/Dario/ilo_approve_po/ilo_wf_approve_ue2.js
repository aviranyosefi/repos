/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

define(['N/record', 'N/search', ' N/ui/message', 'N/ui/serverWidget'],
    function (record, search, message, serverWidget) {
        function beforeLoad(context) {

            if (context.type == context.UserEventType.VIEW) {
                var rec = context.newRecord;
                var form = context.form;
                var approver_1 = rec.getValue('custbody_approver_1');
                if (isNullOrEmpty(approver_1)) {
                    var myMsg = message.create({
                        title: "Approval Process",
                        message: "Please insert a valid budget code combination, the department and business line/Class inserted don’t match budget owner's authorized budget code combinations",
                        type: message.Type.ERROR,
                        duration: 50000
                    });
                    context.form.addPageInitMessage({ message: myMsg });
                }
                else {
                    var pageScript =
                        '<script> \n'
                        + 'jQuery(document).ready(function () { \n'
                        + '      $(".uir-message-buttons").last().hide();'
                        + '		if(jQuery("input[value*=\'Reject\']").length > 0){ \n'
                        + '			var reject_original_onclick_string = jQuery("input[value*=\'Reject\']").attr("onclick"); \n'
                        + '			jQuery("input[value*=\'Reject\']").attr("onclick", "") \n'
                        + '			jQuery("input[value*=\'Reject\']").on("click", function(){\n'
                        + ' 	        require([\'N/ui/dialog\',\'N/record\'], function(dialogLib ,record) { \n'
                        + ' 		        dialogLib.create({ \n'
                        + ' 			    title: \'Please write reject reason\',\n'
                        + ' 			    message: \'Write Here. <textarea id="rejectText" rows="5" cols="40"></textarea> <div class="uir-message-buttons"><button value="cancel" onclick="CLOSEWIN()">Cancel</button><button value="shadow-1" onclick="onClick(1)">OK</button></div> \',\n'
                        + ' 			    buttons: [{label: \'close\',value: \'close\'},{ label: \'Save\', value: 1 }], \n'
                        + ' 		        }).then(function (result) { \n'
                        + '				        if(result == 1) {  new Function(reject_original_onclick_string)()} ; \n'
                        + '			        }); \n'
                        + '          $(".uir-message-buttons").last().hide();'
                        + ' 	        }); \n'
                        + '         }); \n'
                        + '		} \n'
                        + '}); \n'
                        + 'function onClick(id){' +
                        '       var val=jQuery("#rejectText").val(); nlapiSubmitField ("' + rec.type + '", ' + rec.id + ',"custbody_transaction_rejection_notes",val);' +
                        'jQuery(`:button[value=1]`).click();' +
                        '}; ' +
                        'function CLOSEWIN(){' +
                        'jQuery(`:button[value=close]`).click();' +
                        '}; ' +
                        '(function($){' +
                        '$(function($, undefined){' +
                        '$(".uir-message-buttons").last().hide();' +
                        '});' +
                        '})(jQuery);' +
                        '\n</script>';
                    var rejectWindow = form.addField({
                        id: 'custpage_reject_win',
                        label: 'reject Window',
                        type: serverWidget.FieldType.INLINEHTML
                    });
                    rejectWindow.defaultValue = pageScript
                }               
            }          
        }      
        function afterSubmit(context) {
            if (context.type != context.UserEventType.DELETE) {
                var newRec = context.newRecord;
                var trnType = newRec.type;  
                var trnID = newRec.id;  
                var rec = record.load({type: trnType,id: trnID,isDynamic: false,});
                var updateAprrovers = false;
                if (context.type == context.UserEventType.EDIT) {
                    var oldRec = context.oldRecord;
                    var newRecTotal = newRec.getValue('total');
                    var oldRecTotal = oldRec.getValue('total');
                    if (oldRecTotal != newRecTotal) {
                        updateAprrovers = true;
                    }
                    if (!updateAprrovers) {
                        var newdepartment = newRec.getValue('department');
                        var olddepartment = oldRec.getValue('department');
                        if (newdepartment != olddepartment) {
                            updateAprrovers = true;
                        }
                    }
                    if (!updateAprrovers) {
                        var newclass = newRec.getValue('class');
                        var oldclass = oldRec.getValue('class');
                        if (newclass != oldclass) {
                            updateAprrovers = true;
                        }
                    }
                    if (updateAprrovers) {
                        for (var i = 1; i <= 3; i++) {
                            rec.setValue('custbody_approver_' + i, '')
                            rec.setValue('custbody_approver_' + i + '_indication', '')
                        }
                    }
                }
                var settings = getSettings(trnType);
                log.debug('settings:', JSON.stringify(settings));
                if (settings.length > 0) {
                    try {
                        var aprroval_type = settings[0].aprroval_type
                        if (aprroval_type == 1) { // FROM TRANSACTION
                            var sent_to = settings[0].sent_to
                            var reciever = newRec.getValue(sent_to)
                        } else {
                            var filter_by_department = settings[0].filter_by_department
                            var filter_by_class = settings[0].filter_by_class
                            var custom_record_id = settings[0].custom_record_id
                            pac_subsidiary = newRec.getValue('subsidiary');
                            pac_department = newRec.getValue('department');
                            pac_class = newRec.getValue('class');
                            var getApproverList = getApprover(custom_record_id, filter_by_department, filter_by_class, newRec);
                            log.debug('getApproverList:', JSON.stringify(getApproverList));
                            if (getApproverList.length > 0) {                    
                                if ((newRec.getValue('custbody_draft') == true && isNullOrEmpty(newRec.getValue('custbody_approver_1'))) || updateAprrovers) {                      
                                    var CountOfRecievers = 3;
                                    if (!isNullOrEmpty(getApproverList[0].amount_settings)) {
                                        var custrecord_trx_app_currency = getApproverList[0].custrecord_trx_app_currency
                                        var amount = calcAmount(trnType, custrecord_trx_app_currency, newRec);
                                        log.debug('amount:', amount);
                                        CountOfRecievers = getRecieverCount(getApproverList, amount);
                                        log.debug('CountOfRecievers:', CountOfRecievers);
                                    }
                                    for (var i = 1; i <= Number(CountOfRecievers); i++) {
                                        rec.setValue('custbody_approver_' + i, getApproverList[0]['approver' + i])
                                    }
                                }
                                else {
                                    var reciever = getNextReciever(newRec)
                                    log.debug('reciever:', reciever);
                                }
                            }
                        }
                        if (!isNullOrEmpty(reciever) && newRec.getValue('approvalstatus') !='3') {
                            rec.setValue('nextapprover', reciever)
                        }
                    }
                    catch (e) {
                        log.error('ERROR:', e);
                    }
                }
                //rec.save();
                rec.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
            }        
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function getSettings(trnType) {
            try {
                var SearchObj = search.create({
                    type: 'customrecord_one_trx_approval_settings',
                    filters:
                        [
                            ["custrecord_trx_transaction", "is", trnType]
                        ],
                    columns:
                        [
                            "custrecord_trx_email_template", "custrecord_trx_approval_type", "custrecord_trx_attach_files", "custrecord_trx_filter_by_department", "custrecord_trx_filter_by_class",
                            "custrecord_trx_email_sent_from","custrecord_trx_email_sent_to"
                        ]
                });
                var results = [];
                SearchObj.run().each(function (result) {
                    results.push({
                        email_template: result.getValue('custrecord_trx_email_template'),
                        aprroval_type: result.getValue('custrecord_trx_approval_type'),
                        custom_record_id: 'customrecord_classification_combination',
                        attach_files: result.getValue('custrecord_trx_attach_files'),
                        filter_by_department: result.getValue('custrecord_trx_filter_by_department'),
                        filter_by_class: result.getValue('custrecord_trx_filter_by_class'),
                        sent_from: result.getValue('custrecord_trx_email_sent_from'),
                        sent_to: result.getValue('custrecord_trx_email_sent_to'),
                    })
                    return true;
                });
                return results      
            } catch (e) { return ''; }
        }
        function getApprover(custom_record_id, filter_by_department, filter_by_class, rec) {
            pac_subsidiary = rec.getValue('subsidiary');
            var filters = new Array();
            filters.push(['custrecord_occ_subsidiary', 'anyof', pac_subsidiary])
            if (filter_by_department == 2) {
                pac_department = rec.getValue('department');
                if (!isNullOrEmpty(pac_department)) {
                    filters.push("and")
                    filters.push(['custrecord_occ_department', 'anyof', pac_department])
                }
            }
            if (filter_by_class == 2) {
                pac_class = rec.getValue('class');
                if (!isNullOrEmpty(pac_class)) {
                    filters.push("and")
                    filters.push(['custrecord_occ_class', 'anyof', pac_class])
                }
            }
            log.debug("filters", JSON.stringify(filters))
            var SearchObj = search.create({
                type: custom_record_id,
                filters:
                    filters,
                columns:
                    [
                        "custrecord_occ_approver_1", "custrecord_occ_approver_2", "custrecord_occ_approver_3", "custrecord_trx_amount_settings", 
                        search.createColumn({ name: "custrecord_up_to_amount_1", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                        search.createColumn({ name: "custrecord_trx_app_approval_1", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                        search.createColumn({ name: "custrecord_up_to_amount_2", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                        search.createColumn({ name: "custrecord_trx_app_approval_2", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                        search.createColumn({ name: "custrecord_up_to_amount_3", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                        search.createColumn({ name: "custrecord_trx_app_approval_3", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                        search.createColumn({ name: "custrecord_trx_app_currency", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                    ]
            });
            var results = [];
            SearchObj.run().each(function (result) {
                results.push({
                    approver1: result.getValue('custrecord_occ_approver_1'),
                    approver2: result.getValue('custrecord_occ_approver_2'),
                    approver3: result.getValue('custrecord_occ_approver_3'),
                    amount_settings: result.getValue('custrecord_trx_amount_settings'),
                    custrecord_up_to_amount_1: result.getValue({ name: "custrecord_up_to_amount_1", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                    custrecord_trx_app_approval_1: result.getValue({ name: "custrecord_trx_app_approval_1", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                    custrecord_up_to_amount_2: result.getValue({ name: "custrecord_up_to_amount_2", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                    custrecord_trx_app_approval_2: result.getValue({ name: "custrecord_trx_app_approval_2", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                    custrecord_up_to_amount_3: result.getValue({ name: "custrecord_up_to_amount_3", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                    custrecord_trx_app_approval_3: result.getValue({ name: "custrecord_trx_app_approval_3", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                    custrecord_trx_app_currency: result.getValue({ name: "custrecord_trx_app_currency", join: "CUSTRECORD_TRX_AMOUNT_SETTINGS", label: "Approval 1" }),
                })
                return true;
            });
            return results   
        }
        function calcAmount(trnType, custrecord_trx_app_currency, rec) {   
            if (trnType == 'purchaseorder') {
                var total = rec.getValue('total');
            }
            else {
                var total = rec.getValue('usertotal');
            }
            var currency = rec.getValue('currency');
            if (currency != custrecord_trx_app_currency && !isNullOrEmpty(custrecord_trx_app_currency)) {
                var exchangerate = rec.getValue('exchangerate');
                total = total * exchangerate;
            }
            return total
        }
        function getRecieverCount(getApproverList, amount) {
            debugger;
            var custrecord_up_to_amount_1 = getApproverList[0].custrecord_up_to_amount_1
            var custrecord_trx_app_approval_1 = getApproverList[0].custrecord_trx_app_approval_1
            var custrecord_up_to_amount_2 = getApproverList[0].custrecord_up_to_amount_2
            var custrecord_trx_app_approval_2 = getApproverList[0].custrecord_trx_app_approval_2
            var custrecord_up_to_amount_3 = getApproverList[0].custrecord_up_to_amount_3
            var custrecord_trx_app_approval_3 = getApproverList[0].custrecord_trx_app_approval_3

            var res = '';
            if (Number(amount) > Number(custrecord_up_to_amount_1) && !isNullOrEmpty(custrecord_trx_app_approval_1)) { res = custrecord_trx_app_approval_1 }
            if (Number(amount) > Number(custrecord_up_to_amount_2) && !isNullOrEmpty(custrecord_trx_app_approval_2)) { res = custrecord_trx_app_approval_2 }
            if (Number(amount) > Number(custrecord_up_to_amount_3) && !isNullOrEmpty(custrecord_trx_app_approval_3)) { res = custrecord_trx_app_approval_3 }

            return res;
        }
        function getNextReciever(rec) {
            var approver1 = rec.getValue('custbody_approver_1')
            var approver2 = rec.getValue('custbody_approver_2')
            var approver3 = rec.getValue('custbody_approver_3')
            if (!isNullOrEmpty(approver1) && isNullOrEmpty(rec.getValue('custbody_approver_1_indication'))) {
                if (isNullOrEmpty(approver2)) { final = 'T' }
                //CurrReciver = 1
                return approver1
            }
            else if (!isNullOrEmpty(approver2) && isNullOrEmpty(rec.getValue('custbody_approver_2_indication'))) {
                if (isNullOrEmpty(approver3)) { final = 'T' }
                //CurrReciver = 2
                return approver2
            }
            else if (!isNullOrEmpty(approver3) && isNullOrEmpty(rec.getValue('custbody_approver_3_indication'))) {
                final = 'T'
                //CurrReciver = 3
                return approver3
            }
            return '';
        }
        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit
        };
    });

