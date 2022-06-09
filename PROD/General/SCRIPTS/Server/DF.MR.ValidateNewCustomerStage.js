/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/error', 'N/file', 'N/email', 'N/format', 'N/log', 'N/record', 'N/render', 'N/runtime', 'N/search', '../Common/BE.Lib.Common'],

    function (error, file, email, format, logger, record, render, runtime, search, common) {

        function getInputData() {
            try {

                return search.load({ id: 'customsearch_df_customers_created_yester' });

            } catch (err) {
                logger.error({ title: 'ERROR: getInputData', details: JSON.stringify(err) });
            }
        }

        function map(context) {
            try {

                var result = JSON.parse(context.value);
                var customerData = result.values;

                customerData = validateCustomerStage(customerData);

                if (customerData.stage.value != customerData.correctStage) {
                    context.write({
                        key: customerData.internalid.value,
                        value: {
                            customerId: customerData.internalid.value,
                            customerStatus: customerData.entityStatus,
                            customerStage: customerData.stage.value
                        }
                    });
                }

            } catch (err) {
                logger.error({ title: 'ERROR: map', details: JSON.stringify(err) });
            }
        }

        function reduce(context) {
            try {

                var customerData = context.values.map(JSON.parse)[0];

                record.submitFields({
                    type: customerData.customerStage,
                    id: customerData.customerId,
                    values: {
                        'entitystatus': customerData.customerStatus
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

        function validateCustomerStage(customerData) {

            var internalId = customerData.internalid.value
            customerData.correctStage = 'LEAD';
            customerData.entityStatus = '25'
            var hasSalesOrder = false;
            var hasQuote = false;
            var hasOpprtnty = false;

            search.create({
                type: "transaction",
                filters:
                    [
                        [[["custbody6", "anyof", internalId]], "OR", [["custbody6_2", "anyof", internalId]], "OR", [["customer.internalid", "anyof", internalId]]],
                        "AND",
                        ["type", "anyof", "CustInvc", "Opprtnty", "Estimate", "SalesOrd", "CustPymt"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "type", summary: "GROUP" })
                    ]
            }).run().each(function (result) {

                var recType = result.getValue({ name: "type", summary: "GROUP" });

                switch (recType) {
                    case 'SalesOrd':
                        hasSalesOrder = true;
                        break;
                    case 'Estimate':
                        hasQuote = true;
                        break;
                    case 'Opprtnty':
                        hasOpprtnty = true;
                        break;
                    case 'CustPymt': // same as if it has SO
                        hasSalesOrder = true;
                        break;
                    case 'CustInvc': // same as if it has SO
                        hasSalesOrder = true;
                        break;
                    default:
                        break;
                }

                return true;
            });

            if (hasSalesOrder) {
                customerData.correctStage = 'CUSTOMER';
                customerData.entityStatus = '13'
            } else if (hasQuote) {
                customerData.correctStage = 'PROSPECT';
                customerData.entityStatus = '10'
            } else if (hasOpprtnty) {
                customerData.correctStage = 'PROSPECT';
                customerData.entityStatus = '8'
            }

            return customerData;

        }

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };

    });
