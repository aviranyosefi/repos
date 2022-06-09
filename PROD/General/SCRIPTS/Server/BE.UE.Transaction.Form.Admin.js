/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['require', 'N/url', 'N/log', 'N/record', 'N/search', 'N/ui/serverWidget', '../Common/BE.Lib.Common.js', 'N/error', 'N/runtime', '../Common/DF.Helpers'],
    function (require, url, logger, record, search, serverWidget, common, error, runtime, helpers) {

        var form, rec, recId, recType, eventType;
        function beforeLoad(scriptContext) {
            initiateScript(scriptContext);

            if (recType == record.Type.SALES_ORDER) {
                if (runtime.executionContext === runtime.ContextType.USER_INTERFACE) {
                    if (scriptContext.type == scriptContext.UserEventType.VIEW) {
                        createPrintKittingListBtn();
                        commandeerProformaPrintBtn();
                    }
                    if (scriptContext.type == scriptContext.UserEventType.EDIT) {
                        updateDeliveryNumberSelectOptions();
                    }
                    if (scriptContext.type == scriptContext.UserEventType.CREATE) {
                        // createSOfromRMA(scriptContext);
                    }
                }
            }

            if (recType == record.Type.FULFILLMENT_REQUEST) {
                if (runtime.executionContext === runtime.ContextType.USER_INTERFACE) {
                    if (scriptContext.type == scriptContext.UserEventType.VIEW) {

                        createPrintKittingListBtn();

                    }
                }
            }

            if (recType == record.Type.ITEM_FULFILLMENT) {
                if (runtime.executionContext === runtime.ContextType.USER_INTERFACE) {
                    if (scriptContext.type == scriptContext.UserEventType.VIEW) {

                        createPrintCocBtn();

                    }
                }
            }

            if (recType == record.Type.PURCHASE_ORDER || recType == record.Type.TRANSFER_ORDER) {
                if (runtime.executionContext === runtime.ContextType.USER_INTERFACE) {
                    if (scriptContext.type == scriptContext.UserEventType.EDIT || scriptContext.type == scriptContext.UserEventType.CREATE) {
                        generateAddKitItemsBtn()
                    }
                }
            }

            if (recType == record.Type.OPPORTUNITY || rec.type == record.Type.ESTIMATE) {


                if (runtime.executionContext === runtime.ContextType.USER_INTERFACE) {
                    if (scriptContext.type == scriptContext.UserEventType.EDIT || scriptContext.type == scriptContext.UserEventType.CREATE) {

                        generateAddItemsPopUpBtn()

                    }
                }
            }

            if (rec.type == record.Type.ESTIMATE) {
                if (scriptContext.type == scriptContext.UserEventType.CREATE) {
                    var geoCountry = rec.getValue({ fieldId: 'custbody_geo_country' });
                    var plugType = rec.getValue({ fieldId: 'custbody_plug_type' });
                    setPlugTypesFromCountry(geoCountry, plugType);
                }

            }
            if (rec.type == record.Type.RETURN_AUTHORIZATION) {
                if (scriptContext.type == scriptContext.UserEventType.VIEW) {
                    createSalesOrderBtn();
                    createNotifyCustomerPopUp();
                }

            }
        }

        function beforeSubmit(scriptContext) {
            initiateScript(scriptContext);

            if (recType == record.Type.SALES_ORDER) {

                if (scriptContext.type == scriptContext.UserEventType.EDIT) {

                    setQuantityForDelivery();
                    setDeliveryNumTxt(scriptContext.oldRecord);

                }

                if (runtime.executionContext === runtime.ContextType.USEREVENT) {
                    initiateICTransactions(scriptContext)
                }

            }

            if (recType == record.Type.PURCHASE_ORDER) {
                if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.COPY || scriptContext.type == scriptContext.UserEventType.EDIT) {

                    setCategoryMapping(scriptContext)

                }
            }

            if (recType == record.Type.SALES_ORDER || recType == record.Type.OPPORTUNITY || recType == record.Type.ESTIMATE || recType == record.Type.INVOICE || recType == record.Type.CUSTOMER_PAYMENT) {
                if (scriptContext.type == scriptContext.UserEventType.DELETE) {
                    validateCustomerStagesForDelete();
                }
            }
        }

        function afterSubmit(scriptContext) {
            initiateScript(scriptContext);

            /***************************************************************/
            /*Date:'7/2/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1179', Desc: 'add optional items to qoute when it is coppied'
            /***************************************************************/
            if (recType == record.Type.ESTIMATE) {
                if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.COPY) {
                    var copiedFrom = rec.getValue({ fieldId: 'copiedfrom' });
                    if (!common.isNullOrEmpty(copiedFrom)) {
                        setOptionalItems(copiedFrom);
                    }
                }
            }
        }

        /*
         * HELPER FUNCTIONS
         */

        function createNotifyCustomerPopUp() {
            /*** Date:'14-03-2022', Editor: 'Nadav Julius', Task: 'DR1185', Desc: '' ***/
            try {

                var validationObject = {
                    fieldIds: [
                        { type: 'email', id: 'custbody_contact_address', errorMsg: 'Please populate CONTACT EMAIL field and try again.' },
                        { type: 'email', id: 'custbody_df_nc_email_subject', errorMsg: 'Please populate EMAIL SUBJECT field and try again.' },
                        { type: 'email', id: 'custbody_df_nc_email_body', errorMsg: 'Please populate EMAIL BODY field and try again.' },
                        { type: 'all', id: 'location', errorMsg: 'Please populate LOCATION field and try again.' },
                        { type: 'all', id: 'custbody9', errorMsg: 'Please populate CASE# field and try again.' }
                    ],
                    emailErrorMessage: '',
                    downloadErrorMessage: '',
                }

                for (var i = 0; i < validationObject.fieldIds.length; i++) {
                    var validationObj = validationObject.fieldIds[i];
                    var eValidationVal = rec.getValue({ fieldId: validationObj.id });
                    if (common.isNullOrEmpty(eValidationVal)) {
                        if (validationObj.type == 'email' || validationObj.type == 'all') {
                            validationObject.emailErrorMessage += (validationObj.errorMsg + '<br/>');
                        }
                        if (validationObj.type == 'donload' || validationObj.type == 'all') {
                            validationObject.downloadErrorMessage += (validationObj.errorMsg + '<br/>');
                        }
                    }

                }
                // if (validationObj.type == 'email' || validationObj.type == 'all') {

                form.addButton({
                    id: 'custpage_df_print_coc',
                    label: 'Notify Customer',
                    functionName: 'openNotifyCustomerPopUp(\'' + recId + '\', \'' + validationObject.emailErrorMessage + '\', \'' + validationObject.downloadErrorMessage + '\')'
                });

            } catch (err) {
                logger.error({ title: 'Error', details: JSON.stringify(err) })
            }
        }

        function setOptionalItems(copiedFrom) {
            var searchObj = search.create({
                type: "customrecord_optional_items",
                filters:
                    [
                        ["custrecord_optional_item_quote", "anyof", copiedFrom]
                    ],
                columns:
                    [
                        "custrecord_bundle_number",
                        "custrecord_optional_item",
                        "custrecord_quantity_optional_item",
                        "custrecord_optinal_item_unit",
                        "custrecord_optional_items_description",
                        "custrecord_optional_item_amount",
                        "custrecord_optional_rate"
                    ]
            });
            var searchResultCount = searchObj.runPaged().count;

            if (searchResultCount > 0) {
                var qouteId = rec.id;
                searchObj.run().each(function (result) {
                    var bundle = result.getValue({ name: "custrecord_bundle_number" });
                    var itemId = result.getValue({ name: "custrecord_optional_item" });
                    var qnt = result.getValue({ name: "custrecord_quantity_optional_item" });
                    var units = result.getValue({ name: "custrecord_optinal_item_unit" });
                    var desc = result.getValue({ name: "custrecord_optional_items_description" });
                    var amount = result.getValue({ name: "custrecord_optional_item_amount" });
                    var rate = result.getValue({ name: "custrecord_optional_rate" });

                    var optionalItemRecord = record.create({
                        type: 'customrecord_optional_items'
                    });

                    optionalItemRecord.setValue({
                        fieldId: 'custrecord_bundle_number',
                        value: bundle
                    });
                    optionalItemRecord.setValue({
                        fieldId: 'custrecord_optional_item',
                        value: itemId
                    });
                    optionalItemRecord.setValue({
                        fieldId: 'custrecord_quantity_optional_item',
                        value: qnt
                    });
                    optionalItemRecord.setValue({
                        fieldId: 'custrecord_optinal_item_unit',
                        value: units
                    });
                    optionalItemRecord.setValue({
                        fieldId: 'custrecord_optional_items_description',
                        value: desc
                    });
                    optionalItemRecord.setValue({
                        fieldId: 'custrecord_optional_item_amount',
                        value: amount
                    });
                    optionalItemRecord.setValue({
                        fieldId: 'custrecord_optional_rate',
                        value: rate
                    });
                    optionalItemRecord.setValue({
                        fieldId: 'custrecord_optional_item_quote',
                        value: qouteId
                    });

                    var optionalItemRecordId = optionalItemRecord.save();
                    return true;
                });
            }

        }


        function validateCustomerStagesForDelete() {
            try {

                var entityId = rec.getValue({ fieldId: 'entity' });
                if (!common.isNullOrEmpty(entityId)) {
                    var entityCustomerData = getCustomerData(entityId);
                    validateCustomerStage(entityCustomerData)
                }

                var endCustomerId = rec.getValue({ fieldId: 'custbody6' });
                if (!common.isNullOrEmpty(endCustomerId)) {
                    var endCustomerData = getCustomerData(endCustomerId);
                    validateCustomerStage(endCustomerData)
                }

                var endCustomerNoApiId = rec.getValue({ fieldId: 'custbody6_2' });
                if (!common.isNullOrEmpty(endCustomerNoApiId)) {
                    var endCustomerNoApiData = getCustomerData(endCustomerNoApiId);
                    validateCustomerStage(endCustomerNoApiData)
                }

            } catch (err) {
                logger.error({ title: 'Error in validateCustomerStages', details: JSON.stringify(err) });
            }
        }

        function getCustomerData(customerId) {

            var customerLookup = search.lookupFields({
                type: search.Type.CUSTOMER,
                id: customerId,
                columns: ['stage']
            });

            return {
                customerStage: customerLookup.stage[0].value,
                customerId: customerId
            }

        }

        function validateCustomerStage(customerData) {

            var internalId = customerData.customerId
            var correctStage = 'LEAD';
            var entityStatus = '25'
            var hasSalesOrder = false;
            var hasQuote = false;
            var hasOpprtnty = false;

            search.create({
                type: "transaction",
                filters:
                    [
                        ["internalid", "noneof", recId],
                        "AND",
                        ["type", "anyof", "SalesOrd", "Estimate", "Opprtnty", "CustInvc", "Opprtnty"],
                        "AND",
                        [[["custbody6", "anyof", internalId]], "OR", [["custbody6_2", "anyof", internalId]], "OR", [["customer.internalid", "anyof", internalId]]]
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
                correctStage = 'CUSTOMER';
                entityStatus = '13'
            } else if (hasQuote) {
                correctStage = 'PROSPECT';
                entityStatus = '10'
            } else if (hasOpprtnty) {
                correctStage = 'PROSPECT';
                entityStatus = '8'
            } else {
                correctStage = 'LEAD';
                entityStatus = '25'
            }

            if (correctStage != customerData.customerStage) {
                record.submitFields({
                    type: customerData.customerStage,
                    id: internalId,
                    values: {
                        'entitystatus': entityStatus
                    }
                });
            }

        }

        function commandeerProformaPrintBtn() {
            try {

                var additionalParams = {
                    includeImages: true
                };

                var printHandler = url.resolveScript({
                    scriptId: 'customscript_be_sl_proxy_adm',
                    deploymentId: 'customdeploy_be_sl_proxy_printer',
                    returnExternalUrl: false,
                    params: { isInline: 'T', printType: recType + '_printkittinglist', recId: rec.id, additionalParams: JSON.stringify(additionalParams) }
                });

                var pageScript =
                    '<script> \n'
                    + 'jQuery(document).ready(function () { \n'
                    + '		if(jQuery("input[value*=\'PI Printout\']").length > 0){ \n'
                    + '			jQuery("input[value*=\'PI Printout\']").attr("onclick", \'piPrintModal()\') \n'
                    + '		} \n'
                    + '});'
                    + 'function piPrintModal() { \n'
                    + ' 	require([\'N/ui/dialog\'], function(dialogLib) { \n'
                    + ' 		dialogLib.create({ \n'
                    + ' 			title: \'PL Prints\', \n'
                    + ' 			message: \'Select a print type.\', \n'
                    + ' 			buttons: [{label: \'X\',value: \'close\'},{ label: \'PI Print\', value: \'pi_print\' },{ label: \'Kit Print imgs\', value: \'kit_img_print\' }], \n'
                    + ' 		}).then(function (result) { \n'
                    + '				if(result == \'pi_print\') { printButton(); } else if(result == \'kit_img_print\') { window.open(\'' + printHandler + '\') }; \n'
                    + '			}); \n'
                    + ' 	}); \n'
                    + '} \n'
                    + '\n</script>';

                require(['N/ui/serverWidget', 'N/file'], function (serverWidget, fileLib) {

                    var jqueryCode = form.addField({
                        id: 'custpage_jquery_code',
                        label: 'jquery code',
                        type: serverWidget.FieldType.INLINEHTML
                    });
                    jqueryCode.defaultValue = pageScript

                });

            } catch (err) {
                logger.error({ title: 'Error in setCategoryMapping', details: JSON.stringify(err) })
            }
        }

        function initiateICTransactions(scriptContext) {
            if (scriptContext.type == scriptContext.UserEventType.CREATE) {
                if (rec.type == record.Type.SALES_ORDER) {

                    var icPoId = rec.getValue({
                        fieldId: 'intercotransaction'
                    });

                    if (!common.isNullOrEmpty(icPoId)) {

                        var poRec = record.load({ type: record.Type.PURCHASE_ORDER, id: icPoId });

                        var soLineCount = rec.getLineCount({ sublistId: 'item' });
                        for (var i = 0; i < soLineCount; i++) {

                            var kitItemId = poRec.getSublistValue({ sublistId: 'item', fieldId: 'custcol_member_of_kit', line: i });

                            if (!common.isNullOrEmpty(kitItemId)) {
                                rec.setSublistValue({ sublistId: 'item', fieldId: 'custcol_member_of_kit', value: kitItemId, line: i });
                            }

                        }

                    }

                }
            }
        }

        function createPrintCocBtn() {

            var printHandler = url.resolveScript({
                scriptId: 'customscript_be_sl_proxy_adm',
                deploymentId: 'customdeploy_be_sl_proxy_printer',
                returnExternalUrl: false,
                params: { isInline: 'T', printType: recType + '_printcoc', recId: rec.id }
            });

            form.addButton({
                id: 'custpage_df_print_coc',
                label: 'Print',
                functionName: "(function() {" +
                    "window.open('" + printHandler + "') " +
                    "})"
            });

        }

        function createPrintKittingListBtn() {

            var additionalParams = {
                includeImages: false
            };

            var printHandler = url.resolveScript({
                scriptId: 'customscript_be_sl_proxy_adm',
                deploymentId: 'customdeploy_be_sl_proxy_printer',
                returnExternalUrl: false,
                params: { isInline: 'T', printType: recType + '_printkittinglist', recId: rec.id, additionalParams: JSON.stringify(additionalParams) }
            });

            form.addButton({
                id: 'custpage_print_kitting_list_btn',
                label: 'Print Kitting List',
                functionName: "(function() {" +
                    "window.open('" + printHandler + "')" +
                    "})"
            });

        }


        function setQuantityForDelivery() {

            var lineCount = rec.getLineCount({ sublistId: 'item' })

            for (var i = 0; i < lineCount; i++) {
                var itemtype = rec.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: i })
                if (itemtype == 'EndGroup') {
                    continue;
                }
                var qty = rec.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i })
                var qtyFulfilled = rec.getSublistValue({ sublistId: 'item', fieldId: 'quantityfulfilled', line: i })
                qtyFulfilled = common.isNullOrEmpty(qtyForDelivery) ? 0 : qtyFulfilled;
                var qtyForDelivery = rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol_df_quantity_for_delivery', line: i })

                if (common.isNullOrEmpty(qtyForDelivery) || qtyForDelivery > (qty - qtyFulfilled)) {
                    rec.setSublistValue({ sublistId: 'item', fieldId: 'custcol_df_quantity_for_delivery', line: i, value: qty - qtyFulfilled })
                }

            }

        }

        function updateDeliveryNumberSelectOptions() {

            form.getField({ id: 'custbody_df_delivery_num_for_print_txt' }).updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });

            var deliveryNums = [];

            var deliveryNumFld = form.addField({
                id: 'custpage_df_delivery_number_for_print',
                type: serverWidget.FieldType.SELECT,
                label: 'Delivery Number For Print',
            });

            form.insertField({
                field: deliveryNumFld,
                nextfield: 'custbody_df_delivery_num_for_print_txt'
            });

            var bodyVeliveryNum = rec.getValue({ fieldId: 'custbody_delivery_number' })

            deliveryNums.push(bodyVeliveryNum)

            deliveryNumFld.addSelectOption({
                value: bodyVeliveryNum,
                text: bodyVeliveryNum
            });

            var lineCount = rec.getLineCount({ sublistId: 'item' });

            for (var i = 0; i < lineCount; i++) {

                var lineDeliveryNum = rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol10', line: i })

                if (deliveryNums.indexOf(lineDeliveryNum) < 0 && !common.isNullOrEmpty(lineDeliveryNum)) {

                    deliveryNums.push(lineDeliveryNum)

                    deliveryNumFld.addSelectOption({
                        value: lineDeliveryNum,
                        text: lineDeliveryNum
                    });

                }

            }

        }

        function setDeliveryNumTxt(oldRec) {

            var oldDeliveryNumber = oldRec.getValue({ fieldId: 'custbody_delivery_number' })
            var deliveryNumber = rec.getValue({ fieldId: 'custbody_delivery_number' })
            var deliveryNumTxtVal = rec.getValue({ fieldId: 'custpage_df_delivery_number_for_print' })

            if (oldDeliveryNumber != deliveryNumber) {
                deliveryNumTxtVal = deliveryNumber
            }

            rec.setValue({ fieldId: 'custbody_df_delivery_num_for_print_txt', value: deliveryNumTxtVal })

        }

        function generateAddKitItemsBtn() {

            var itemSublist = form.getSublist({ id: 'item' });

            require(['N/ui/serverWidget', 'N/url'], function (widget, url) {

                itemSublist.addButton({
                    id: 'custpage_add_kit_items_btn',
                    label: 'Add Kit Items',
                    functionName: 'openAddKitItemsPopUp'
                });
                var ItemsData = form.addField({
                    type: widget.FieldType.TEXTAREA,
                    id: 'custpage_dp_add_items_data',
                    label: ' '
                });
                ItemsData.defaultValue = JSON.stringify({
                    proxyAdminUrl: url.resolveScript({
                        scriptId: 'customscript__df_sl_add_kit_items',
                        deploymentId: 'customdeploy_df_sl_add_kit_items',
                        returnExternalUrl: false
                    })
                });
                ItemsData.updateDisplayType({
                    displayType: widget.FieldDisplayType.HIDDEN
                });

            });

        }

        function generateAddItemsPopUpBtn() {

            var itemSublist = form.getSublist({ id: 'item' });
            form.clientScriptModulePath = '../Client/BE.CS.Transaction.Forms.js';

            require(['N/ui/serverWidget', 'N/url'], function (widget, url) {

                itemSublist.addButton({
                    id: 'custpage_add_kit_items_btn',
                    label: 'Add Items',
                    functionName: "openAddItemsPopUp('" + rec.id + "')"
                });
                var ItemsData = form.addField({
                    type: widget.FieldType.TEXTAREA,
                    id: 'custpage_dp_add_items_data',
                    label: ' '
                });
                ItemsData.defaultValue = JSON.stringify({
                    proxyAdminUrl: url.resolveScript({
                        scriptId: 'customscript_df_sl_add_items_popup',
                        deploymentId: 'customdeploy_df_sl_add_items_popup',
                        returnExternalUrl: false
                    })
                });
                ItemsData.updateDisplayType({
                    displayType: widget.FieldDisplayType.HIDDEN
                });

            });

        }

        function setCategoryMapping(scriptContext) {
            try {

                var itemMap = {};
                var catMap = {};
                var itemIds = [];
                var accountIds = [];
                var departmentId = rec.getValue({ fieldId: 'department' });
                var acceptedItemTypes = ["Assembly", "InvtPart", "NonInvtPart"];

                // Start Line Mapping
                var lineCount = rec.getLineCount({ sublistId: 'item' });

                for (var i = 0; i < lineCount; i++) {
                    var itemId = rec.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i });
                    itemMap[itemId] = null;
                    itemIds.push(itemId)
                }
                // End Line Mapping


                // Start Account Mapping
                itemIds.unshift("internalid", "anyof")

                search.create({
                    type: "item",
                    filters: [itemIds],
                    columns:
                        [
                            "itemid",
                            "internalid",
                            "expenseaccount"
                        ]
                }).run().each(function (result) {

                    var itemId = result.getValue({ name: 'internalid' });
                    var accId = result.getValue({ name: 'expenseaccount' })

                    if (!common.isNullOrEmpty(accId)) {
                        itemMap[itemId] = accId + '_' + departmentId;
                        accountIds.push(accId)
                    }

                    return true;
                });
                // End Account Mapping


                // Start Category Mapping
                accountIds.unshift("custrecord_df_mapping_account", "anyof");

                search.create({
                    type: "customrecord_df_account_mapping",
                    filters: [accountIds, "AND", ["custrecord_df_mapping_department", "anyof", departmentId]],
                    columns: ["custrecord_df_mapping_account", "custrecord_df_mapping_department", "custrecord_df_mapping_category"]
                }).run().each(function (result) {

                    var accId = result.getValue({ name: 'custrecord_df_mapping_account' });
                    var deptId = result.getValue({ name: 'custrecord_df_mapping_department' });

                    catMap[accId + '_' + deptId] = result.getValue({ name: 'custrecord_df_mapping_category' });

                    return true;
                });
                // End Category Mapping


                // Start Setting New Category's
                for (var i = 0; i < lineCount; i++) {

                    var itemId = rec.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i });

                    var lineAccDep = itemMap[itemId];

                    var valToSet = null;

                    if (!common.isNullOrEmpty(lineAccDep) && catMap.hasOwnProperty(lineAccDep)) {
                        valToSet = catMap[lineAccDep]
                    }

                    rec.setSublistValue({ sublistId: 'item', fieldId: 'custcol_df_category_mapping', line: i, value: valToSet })

                }
                // End Setting New Category's    		


            } catch (err) {
                logger.error({ title: 'Error in setCategoryMapping', details: JSON.stringify(err) })
            }
        }

        function setPlugTypesFromCountry(geoCountry, plugType) {

            if (!common.isNullOrEmpty(geoCountry) && plugType == '') {
                var plugTypes = helpers.getPlugTypesFromCountry(geoCountry, null, null);

                if (plugTypes.length > 0) {
                    rec.setValue({ fieldId: 'custbody_plug_type', value: plugTypes.split(',') })
                }
            }

        }

        /***************************************************************/
        /*Date:'3/3/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1186', Desc: ''
        /***************************************************************/
        function createSalesOrderBtn() {
            try {
                form.clientScriptModulePath = '../Client/BE.CS.Transaction.Forms.js';

                var customer = rec.getValue({ fieldId: 'entity' });
                var endCustomer = rec.getValue({ fieldId: 'custbody6' });
                var caseNum = rec.getValue({ fieldId: 'custbody9' });
                var rmaNum = rec.getValue({ fieldId: 'tranid' });
                var commercialInv = rec.getValue({ fieldId: 'custbody_commercial_invoice_num' });
                var apiReferance = rec.getValue({ fieldId: 'custbody7' });
                var contactName = rec.getValue({ fieldId: 'custbody_contact_customer' });
                var contactEmail = rec.getValue({ fieldId: 'custbody_contact_address' });
                var contactPhone = rec.getValue({ fieldId: 'custbody_contact_phone_number' });
                var toBeCharged = rec.getValue({ fieldId: 'custbody_to_be_charged' });
                var enableAdvReplacementRMA = rec.getValue({ fieldId: 'custbody_enable_advance_replacement' });
                // if (enableAdvReplacementRMA == 2) {
                //     enableAdvReplacementRMA = true;
                // }else{
                //     enableAdvReplacementRMA = false;
                // }

                var rmaData = {
                    body: {
                        customer: customer,
                        endCustomer: endCustomer,
                        caseNum: caseNum,
                        rmaId: rec.id,
                        rmaNum: rmaNum,
                        commercialInv: commercialInv,
                        apiReferance: apiReferance,
                        contactName: contactName,
                        contactEmail: contactEmail,
                        contactPhone: contactPhone,
                        toBeCharged: toBeCharged,
                        enableAdvReplacementRMA: enableAdvReplacementRMA
                    },
                    lines: []
                };

                var lines = []
                var numLines = rec.getLineCount({
                    sublistId: 'item'
                });
                var itemIds = [];

                for (var line = 0; line < numLines; line++) {
                    var itemName = rec.getSublistValue({ sublistId: 'item', fieldId: 'itemname', line: line });

                    var item = rec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: line
                    });
                    var invLocation = rec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'inventorylocation',
                        line: line
                    });
                    var description = rec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'description',
                        line: line
                    });
                    var rate = rec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        line: line
                    });
                    var quantity = rec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: line
                    });
                    var lineUniqueKey = rec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'lineuniquekey',
                        line: line
                    });
                    var taxCode = rec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'taxcode',
                        line: line
                    });
                    var sn = rec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_df_serial_number',
                        line: line
                    });
                    var warranttyExpirationDate = rec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_warranty_expiration_date',
                        line: line
                    });

                    lines.push({
                        itemName: itemName,
                        item: item,
                        description: encodeURIComponent(description),
                        rate: rate,
                        quantity: quantity,
                        invLocation: invLocation,
                        lineUniqueKey: lineUniqueKey,
                        taxCode: taxCode,
                        sn: sn,
                        warranttyExpirationDate: warranttyExpirationDate,
                        line: line + 1

                    })

                }

                rmaData.lines = lines;

                form.addButton({
                    id: 'custpage_create_sales_order_btn',
                    label: 'Create Order',
                    //  functionName: "createSOfromRMA(\'" + JSON.stringify(rmaData) + "\')"
                    functionName: "createSalesOrderFromRMA(\'" + JSON.stringify(rmaData) + "\')"
                });
            }
            catch (err) {
                logger.error({ title: 'Error', details: JSON.stringify(err) })
            }


        }

        function initiateScript(scriptContext) {
            form = scriptContext.form;
            rec = scriptContext.newRecord;
            recId = rec.id;
            recType = rec.type;
            eventType = scriptContext.type;
        }

        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        };

    });
