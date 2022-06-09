/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

/**
* Copyright (c) 2006-2019 BE NetSuite
* All Rights Reserved.
* 
* User may not copy, modify, distribute, re-bundle or reuse this code in any way.
*/
/**
 * Author: Igor Povolotski
 */

/**
 * BE.CS.Transaction.Forms.js
 */
define(['require', 'N/log', 'N/record', 'N/error', 'N/runtime', 'N/url', 'N/https', 'N/ui/dialog', '../Common/BE.Lib.Common'],
    function (require, logger, record, error, runtime, url, https, dialog, common) {

        var rec, sublistName, fieldId, lineNum, pageMode;
        var pageInitiated = false;

        function pageInit(scriptContext) {
            pageMode = scriptContext.mode;
            initializeScript(scriptContext);
            pageInitiated = true;
        }

        function fieldChanged(scriptContext) {
            if (!pageInitiated) {
                return true;
            }
            initializeScript(scriptContext);
        }

        function postSourcing(scriptContext) {
            if (!pageInitiated) {
                return true;
            }
            initializeScript(scriptContext);
        }

        function sublistChanged(scriptContext) {
            if (!pageInitiated) {
                return true;
            }
            initializeScript(scriptContext);
        }

        function lineInit(scriptContext) {
            if (!pageInitiated) {
                return true;
            }
            initializeScript(scriptContext);
        }

        function validateField(scriptContext) {
            if (!pageInitiated) {
                return true;
            }
            initializeScript(scriptContext);

            if (rec.type == 'customrecord_df_account_mapping') {
                if (fieldId == 'custrecord_df_mapping_account' || fieldId == 'custrecord_df_mapping_department') {


                    var accountId = rec.getValue({ fieldId: 'custrecord_df_mapping_account' });
                    var departmentId = rec.getValue({ fieldId: 'custrecord_df_mapping_department' });

                    if (!common.isNullOrEmpty(accountId) && !common.isNullOrEmpty(departmentId)) {

                        return validateAccDeptCombination(scriptContext, accountId, departmentId)

                    }

                }
            }

            return true;
        }

        function validateLine(scriptContext) {
            if (!pageInitiated) {
                return true;
            }
            initializeScript(scriptContext);
            return true;
        }

        function validateInsert(scriptContext) {
            if (!pageInitiated) {
                return true;
            }
            initializeScript(scriptContext);
            return true;
        }

        function validateDelete(scriptContext) {
            if (!pageInitiated) {
                return true;
            }
            initializeScript(scriptContext);
            return true;
        }

        function saveRecord(scriptContext) {
            if (!pageInitiated) {
                return true;
            }
            initializeScript(scriptContext);

            if (rec.type == 'customrecord_plug_type_per_country') {
                return validateCountry();
            }

            return true;
        }

        //// Helpers ////

        function validateCountry() {

            var country = rec.getValue({
                fieldId: 'custrecord_ptpc_country'
            });
            var recId = rec.id;

            var proxy = url.resolveScript({
                scriptId: 'customscript_be_sl_proxy_adm',
                deploymentId: 'customdeploy_be_sl_proxy_adm',
                returnExternalUrl: false
            });
            var resp = https.request({
                method: https.Method.GET,
                url: proxy + '&actionType=validateCountry&country=' + country + '&pageMode=' + pageMode + '&recId=' + recId
            }).body;

            if (resp) {

                resp = JSON.parse(resp)

                if (resp.status == 'success') {

                    if (resp.data.isValid) {
                        return true;
                    } else {
                        dialog.alert({
                            title: resp.data.dialogTitle,
                            message: resp.data.dialogDescription
                        });
                        return false;
                    }

                } else {
                    isValid = false;
                    dialog.alert({
                        title: 'Field Validation Error',
                        message: 'Error validating field value: ' + resp.errMessage + '. <br/> Please try again and if the issue persists contact your administartor.'
                    });
                }

            } else {

                dialog.alert({
                    title: 'Field Validation Error',
                    message: 'There was a error validating field value. <br/> Please try again and if the issue persists contact your administartor.'
                });
                return false;

            }
        }

        function validateAccDeptCombination(scriptContext, accountId, departmentId) {

            var isValid = true;

            // Validate that Account / Department combination dose not exist
            var proxy = url.resolveScript({
                scriptId: 'customscript_be_sl_proxy_adm',
                deploymentId: 'customdeploy_be_sl_proxy_adm',
                returnExternalUrl: false
            }),
                resp = https.request({
                    method: https.Method.GET,
                    url: proxy + '&actionType=validateAccDeptCombination&accountId=' + accountId + '&departmentId=' + departmentId
                }).body;

            if (resp) {

                resp = JSON.parse(resp)

                if (resp.status == 'success') {

                    if (!resp.data.isUnique) {

                        isValid = false;
                        dialog.alert({
                            title: 'Account/Department combination Already Exists',
                            message: resp.data.usrMsg
                        });

                    }

                } else if (resp.status == 'failed') {
                    isValid = false;
                    dialog.alert({
                        title: 'Account Mapping',
                        message: 'Error validating Account/Department combination: ' + resp.errMessage
                    });
                } else {
                    isValid = false;
                    dialog.alert({
                        title: 'Account Mapping',
                        message: 'Error validating Account/Department combination: ' + resp.errMessage + '. <br/> Please try again and if the issue persists contact your administartor.'
                    });
                }


            } else {

                isValid = false
                dialog.alert({
                    title: 'Account Mapping',
                    message: 'There was a error validating the account/department combination. <br/> Please try again and if the issue persists contact your administartor.'
                });

            }

            console.log('isValid: ' + isValid)

            return isValid

        }

        function initializeScript(scriptContext) {
            rec = scriptContext.currentRecord;
            sublistName = scriptContext.sublistId;
            fieldId = scriptContext.fieldId;
            lineNum = scriptContext.line;
        }


        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            postSourcing: postSourcing,
            sublistChanged: sublistChanged,
            lineInit: lineInit,
            validateField: validateField,
            validateLine: validateLine,
            validateInsert: validateInsert,
            validateDelete: validateDelete,
            saveRecord: saveRecord
        };

    });
