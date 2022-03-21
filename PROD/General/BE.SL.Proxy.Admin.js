/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
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
 * BE.SL.Proxy.Admin.js
 */
define(['require', 'N/runtime', 'N/log', 'N/http', 'N/https', 'N/redirect', 'N/error', '../Common/BE.Lib.Common', 'N/record', 'N/file', 'N/url', '../Common/DF.Helpers'],

    function (require, runtime, logger, http, https, redirect, error, common, record, file, url, helper) {

        function onRequest(context) {
            var res = {
                status: 'success',
                errMessage: '',
                data: {}
            };
            try {
                if (context.request.method == http.Method.GET) {
                    var script = runtime.getCurrentScript();

                    var isUrlRedirect = script.getParameter({
                        name: 'custscript_be_is_url_redirect'
                    });

                    if (script.deploymentId == 'customdeploy_be_sl_proxy_printer') {
                        return performPrint(context)
                    }
                    else if (isUrlRedirect) {
                        return redirectToNetsuiteUrl(script.getParameter({
                            name: 'custscript_be_actiontype'
                        }));
                    }
                    else {
                        return performGetRequest(context);
                    }
                }
                else if (context.request.method == http.Method.POST) {
                    throw error.create({
                        name: 'METHOD_NOT_SUPPORTED',
                        message: context.request.method + ' is not supported',
                        notifyOff: true
                    });
                }
            }
            catch (err) {
                res.status = 'failed';
                res.errMessage = err.message;
                res.err = JSON.stringify(err);
                logger.error({
                    title: 'BE.SL.Proxy.Admin.js',
                    details: err.message
                });
            }
            context.response.write(JSON.stringify(res));
        }

        // Dedicated function to handle requests for redirect  
        function redirectToNetsuiteUrl(actionType) {
            switch (actionType) {
                //			case 'Global_Settings':
                //				// redirect to the single global settings record
                //				redirect.toRecord({
                //					type : 'customrecord_dp_global_settings',
                //					id : 1
                //				});
                //			break;
                default: {
                    throw error.create({
                        name: 'ACTION_NOT_SUPPORTED',
                        message: actionType + ' is not supported',
                        notifyOff: true
                    });
                    break;
                }
            }
        }

        function performPrint(context) {
            var printType = context.request.parameters.printType;
            var isInline = common.nsBoolToBool(context.request.parameters.isInline);
            var recId = context.request.parameters.recId;
            var additionalParams = context.request.parameters.additionalParams;
            if (!common.isNullOrEmpty(additionalParams)) {
                additionalParams = JSON.parse(additionalParams);
            }

            try {
                var renderedFile = null;
                require(['../Common/BE.Lib.Printer'], function (printer) {
                    renderedFile = printer.executePrint(printType, recId, null, additionalParams);
                });
                context.response.writeFile({
                    file: renderedFile,
                    isInline: isInline
                });
            } catch (err) {
                context.response.write('Error occured while printing : ' + JSON.stringify(err));
            }

        }

        function performGetRequest(context) {
            var res = {
                status: 'success',
                errMessage: '',
                data: {}
            };
            var actionType = context.request.parameters.actionType;

            switch (actionType) {

                case 'getNetsuiteIPAddress':
                    context.response.write(https.get({
                        url: 'https://api.ipify.org/?format=json'
                    }).body)
                    break;

                case 'validateAccDeptCombination':

                    try {

                        var accountId = context.request.parameters.accountId;
                        var departmentId = context.request.parameters.departmentId;

                        var result = helper.validateAccDeptCombination(accountId, departmentId);
                        res.data = result

                        context.response.write(JSON.stringify(res));

                    } catch (err) {

                        res.status = 'failed';
                        res.errMessage = err.msg;

                    }

                    break;
                case 'getPlugTypesFromCountry':

                    try {

                        var geoCountry = context.request.parameters.geoCountry;

                        res.data = helper.getPlugTypesFromCountry(geoCountry, null);
                        logger.debug({ title: 'getPlugTypesFromCountry res.data', details: res.data })

                        context.response.write(JSON.stringify(res));

                    } catch (err) {

                        res.status = 'failed';
                        res.errMessage = err.msg;

                    }

                    break;

                case 'validateCountry':

                    try {

                        var country = context.request.parameters.country;
                        var pageMode = context.request.parameters.pageMode;
                        var recId = context.request.parameters.recId;

                        res.data = helper.validateCountry(country, pageMode, recId);
                        logger.debug({ title: 'res.data', details: res.data })

                        context.response.write(JSON.stringify(res));

                    } catch (err) {

                        res.status = 'failed';
                        res.errMessage = err.msg;

                    }

                    break;

                default: {
                    throw error.create({
                        name: 'ACTION_NOT_SUPPORTED',
                        message: actionType + ' is not supported',
                        notifyOff: true
                    });
                }
            }
        }
        return {
            onRequest: onRequest
        };
    });