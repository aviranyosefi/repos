/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/error', 'N/file', 'N/email', 'N/format', 'N/log', 'N/record', 'N/render', 'N/runtime', 'N/search', '../Common/BE.Lib.Common'],

    function (error, file, email, format, logger, record, render, runtime, search, common) {

        /**
         * This script dose not take the CUSTOMER field into account because it only PROGRESSES the stage meaning if the customer was placed in the CUSTOEMR
         * field the stage would progress automaticlly by the system.
         *  **/

        function getInputData() {
            try {

                var data = {};

                search.load({ id: 'customsearch_df_new_sales_transactions' }).run().each(function (result) {

                    var transType = result.getValue({ name: "type", summary: "GROUP" });
                    var endUserId = result.getValue({ name: "custbody6", summary: "GROUP" });
                    var endUserStage = result.getValue({ name: "stage", join: "CUSTBODY6", summary: "GROUP" });
                    var endCustomerId = result.getValue({ name: "custbody6_2", summary: "GROUP" });
                    var endCustomerStage = result.getValue({ name: "stage", join: "custbody6_2", summary: "GROUP" });

                    data = addData(endUserId, endUserStage, data, transType);
                    data = addData(endCustomerId, endCustomerStage, data, transType);

                    return true;
                });

                return data;

            } catch (err) {
                logger.error({ title: 'ERROR: getInputData', details: JSON.stringify(err) });
            }
        }

        function map(context) {
            try {

                var customerData = JSON.parse(context.value);
                customerData = validateCusrtomerStage(customerData);

                if (customerData.hasWrongStage) {

                    context.write({
                        key: customerData.customerId,
                        value: customerData
                    });

                }

            } catch (err) {
                logger.error({ title: 'ERROR: map', details: JSON.stringify(err) });
            }
        }

        function reduce(context) {
            try {

                var customerData = context.values.map(JSON.parse)[0];
                var entityStatus = null;

                if (customerData.hasSalesOrder) {
                    entityStatus = '13'
                } else if (customerData.hasQuote) {
                    entityStatus = '10'
                } else if (customerData.hasOppertunity) {
                    entityStatus = '8'
                } else {
                    entityStatus = '25'
                }

                record.submitFields({
                    type: customerData.stage,
                    id: customerData.customerId,
                    values: {
                        'entitystatus': entityStatus
                    }
                });

            } catch (err) {
                logger.error({ title: 'ERROR: reduce', details: JSON.stringify(err) });
            }
        }

        function summarize(summary) {
            try {

            } catch (err) {
                logger.error({ title: 'ERROR: summarize', details: JSON.stringify(err) });
            }
        }

        /*
        * Helpers
        */

        function validateCusrtomerStage(customerData) {

            customerData.hasWrongStage = false;

            // dose not take customer into account because we only progress and customer is the final stage
            switch (customerData.stage) {
                case 'PROSPECT':
                    if (customerData.hasSalesOrder || (!customerData.hasQuote && !customerData.hasOppertunity)) {
                        customerData.hasWrongStage = true;
                    }
                    break;

                case 'LEAD':
                    if (customerData.hasQuote || customerData.hasOppertunity || customerData.hasSalesOrder) {
                        customerData.hasWrongStage = true;
                    }
                    break;

                default:
                    logger.error({ title: 'Unhandeled Stage', details: 'Unhandeled Stage: ' + customerData.stage + ' on customer with ID: ' + customerData.customerId })
                    break;
            }

            return customerData;

        }

        function addData(customerId, customerStage, data, transType) {
            if (!isNullNoneOrEmpty(customerId) && customerStage != 'CUSTOMER') {

                // add customer to data object if is first instance of customer ID
                if (!data.hasOwnProperty(customerId)) {
                    data[customerId] = {
                        customerId: customerId,
                        stage: '',
                        hasSalesOrder: false,
                        hasQuote: false,
                        hasOppertunity: false
                    }
                }

                // set the customers current stage
                if (isNullNoneOrEmpty(data[customerId].stage)) {
                    data[customerId].stage = customerStage;
                }

                // update which transactions exist on the customer
                switch (transType) {
                    case 'SalesOrd':
                        data[customerId].hasSalesOrder = true;
                        break;

                    case 'Estimate':
                        data[customerId].hasQuote = true;
                        break;

                    case 'Opprtnty':
                        data[customerId].hasOppertunity = true;
                        break;

                    case 'CustPymt':
                        data[customerId].hasSalesOrder = true;
                        break;

                    case 'CustInvc':
                        data[customerId].hasSalesOrder = true;
                        break;

                    default:
                        logger.error({ title: 'Unhandeled transType', details: 'Unhandeled transType: ' + transType + ' on customer with ID: ' + customerId })
                        break;
                }

            }
            return data;
        }

        function isNullNoneOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0) || val == '- None -') {
                return true;
            }
            return false;
        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };

    });
