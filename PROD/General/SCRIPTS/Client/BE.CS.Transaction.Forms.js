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
var addItemsWindow = {
    window: null,
    bckgndDiv: null,
    nsTranRec: null,
};

var selectedItemsDataPopUp = {
    selectedItems: null,
    addSelectedItems: false,
};

define([
    "require",
    "N/format",
    "N/log",
    "N/ui/message",
    "N/record",
    "N/error",
    "N/runtime",
    "N/url",
    "N/https",
    "N/search",
    "N/ui/dialog",
    "../Common/BE.Lib.Common",
], function (
    require,
    format,
    logger,
    messageLib,
    record,
    error,
    runtime,
    url,
    https,
    search,
    dialog,
    common
) {
    var rec, sublistName, fieldId, lineNum, pageMode;
    var pageInitiated = false;

    function pageInit(scriptContext) {
        pageMode = scriptContext.mode;
        initializeScript(scriptContext);
        pageInitiated = true;
        createSOfromRMA(scriptContext);

        if (pageMode == "create" && rec.type == record.Type.ITEM_FULFILLMENT) {
            setWarrantyAndSerialNumInIF();
        }
    }

    function fieldChanged(scriptContext) {
        if (!pageInitiated) {
            return true;
        }
        initializeScript(scriptContext);
        console.log("fieldChanged", fieldId);
        if (fieldId == "custbody_geo_country") {
            var geoCountry = rec.getValue({ fieldId: "custbody_geo_country" });

            if (!common.isNullOrEmpty(geoCountry)) {
                var plugTypes = getPlugTypesFromCountry(geoCountry);
                if (!common.isNullOrEmpty(plugTypes)) {
                    rec.setValue({
                        fieldId: "custbody_plug_type",
                        value: plugTypes.split(","),
                    });
                } else {
                    rec.setValue({ fieldId: "custbody_plug_type", value: [""] });
                }
            }
        }
        /*Date:'31/3/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1208', Desc: ''*/
        if (rec.type == record.Type.RETURN_AUTHORIZATION) {
            if (fieldId == "quantity") {
                var quantity = rec.getCurrentSublistValue({
                    sublistId: "item",
                    fieldId: "quantity",
                });
                var isSerial = rec.getCurrentSublistValue({
                    sublistId: "item",
                    fieldId: "isserial",
                });
                if (isSerial && quantity != 1) {
                    rec.setCurrentSublistValue({
                        sublistId: "item",
                        fieldId: "quantity",
                        ignoreFieldChange: true,
                        value: 1,
                    });
                    dialog.alert({
                        title: "Invalid quantity",
                        message:
                            "This item is serialized item, the quantity of this line must be 1!",
                    });
                }
            }
        }

        if (rec.type == record.Type.INVENTORY_DETAIL) {
            if (fieldId == "receiptinventorynumber") {
                var parentRecType = window.parent.nlapiGetRecordType();
                if (parentRecType == record.Type.RETURN_AUTHORIZATION) {
                    if (lineNum == 0) {
                        var sn = rec.getCurrentSublistValue({
                            sublistId: "inventoryassignment",
                            fieldId: "receiptinventorynumber",
                        });
                        window.parent.nlapiSetCurrentLineItemValue(
                            "item",
                            "custcol_df_serial_number",
                            sn
                        );
                        var itemId = window.parent.nlapiGetCurrentLineItemValue(
                            "item",
                            "item"
                        );
                        var warranttyExpirationDate = getWarranttyExpirationDate(
                            itemId,
                            sn
                        );
                        if (warranttyExpirationDate != "") {
                            window.parent.nlapiSetCurrentLineItemValue(
                                "item",
                                "custcol_warranty_expiration_date",
                                warranttyExpirationDate
                            );
                        }
                    }
                }
            }
        }

        /*** Date:'31-05-2022', Editor: 'Sapir Heletz', Task: 'DR1253', Desc: '' ***/
        debugger;
        if (rec.type == record.Type.SALES_ORDER) {
            if (sublistName == "item") {
                if (fieldId == "item") {
                    calculationCustomPrice();
                }
            }
        }

        /*** Date:'01-05-2022', Editor: 'Nadav Julius', Task: 'DR1228', Desc: '' ***/
        debugger;
        if (rec.type == record.Type.VENDOR_BILL) {
            if (sublistName === "item") {
                if (fieldId == "billreceipts") {
                    matchBillQtyToReceipt();
                }
            }
        }
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
        var isValid = true;

        console.log("Nadav recType is: " + rec.type);
        if (
            rec.type == record.Type.PURCHASE_REQUISITION ||
            rec.type == record.Type.PURCHASE_ORDER
        ) {
            if (sublistName == "item") {
                if (fieldId == "item") {
                    var userObj = runtime.getCurrentUser();
                    var roleId = userObj.roleId;
                    if (roleId != "administrator") {
                        isValid = validatePurchaseItem();
                    }
                }
            }
        }

        return isValid;
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
        var doSave = true;
        if (
            rec.type == record.Type.OPPORTUNITY ||
            rec.type == record.Type.ESTIMATE
        ) {
            // return validatePlugTypesPerCountry('saveRecord');
        }

        if (rec.type == record.Type.RETURN_AUTHORIZATION) {
            doSave = checkInvDetailsMandatory();
            if (!doSave) {
                return false;
            }
        }

        if (rec.type == record.Type.ITEM_FULFILLMENT) {
            doSave = checkRmaQuantityVsReturned();
            if (!doSave) {
                return false;
            }
        }
        return doSave;
    }

    /*
     * HELPERS
     */

    /*** Date:'19-05-2022', Editor: 'Nadav Julius', Task: 'DR1241', Desc: 'Prevent "Do Not Purchase" Items' ***/
    function validatePurchaseItem() {
        var itemId = rec.getCurrentSublistValue({
            sublistId: "item",
            fieldId: "item",
        });

        var proxy = url.resolveScript({
            scriptId: "customscript_be_sl_proxy_adm",
            deploymentId: "customdeploy_be_sl_proxy_adm",
            returnExternalUrl: false,
        }),
            resp = https.request({
                method: https.Method.GET,
                url: proxy + "&actionType=checkForDontPurchaseFlag&itemId=" + itemId,
            }).body;

        console.log("Nadav resp is: " + resp);
        if (resp) {
            resp = JSON.parse(resp);

            if (resp.status == "success" && resp.data.isMarkedAsDontPurchase) {
                alert(
                    'You can’t select an item with life cycle phase "Don\'t purchase"'
                );
                return false;
            } else if (resp.status == "failed") {
                alert(
                    "Error validating item was purchasable via  the Don't Purchase flag on the item. This item may not be valid."
                );
            }
        }

        return true;
    }

    /*** Date:'31-05-2022', Editor: 'Sapir Heletz', Task: 'DR1253', Desc: '' ***/
    function calculationCustomPrice() {
        var itemId = rec.getCurrentSublistValue({
            sublistId: "item",
            fieldId: "item"
        });

        var locationId = rec.getValue({
            fieldId: "custbody_cross_subsidiary_location",
        });

        var proxy = url.resolveScript({
            scriptId: "customscript_be_sl_proxy_adm", // suietlet ID
            deploymentId: "customdeploy_be_sl_proxy_adm", // deploymentId
            returnExternalUrl: false,
        });

        var resp = https.request({
            method: https.Method.GET,
            url: proxy + "&actionType=calculationCustomPrice&itemId=" + itemId + "&locationId=" + locationId
        }).body;

        if (resp) {
            resp = JSON.parse(resp);

            if (resp.status == "success") {
                if (!common.isNullOrEmpty(resp.data)) {
                    rec.setCurrentSublistValue({
                        sublistId: "item",
                        fieldId: "custcol_custom_price",
                        value: resp.data,
                    });
                }

                // if the value not empty - set in custom price
                // do what you do on success
            } else {
                dialog.alert({
                    title: "Unable to calculate custom price",
                    message:
                        "Error calculation custom price field: " +
                        resp.errMessage +
                        ". <br/> Please try again and if the issue persists contact your administartor.",
                });
            }
        } else {
            logger.error({
                title: "System Error",
                message:
                    "System failed to fetch custom price. <br/> Please try again and if the issue persists contact your administartor.",
            });
        }
    }

    /*** Date:'01-05-2022', Editor: 'Nadav Julius', Task: 'DR1228', Desc: '' ***/
    function matchBillQtyToReceipt() {
        var ibrIds = rec.getCurrentSublistValue({
            sublistId: "item",
            fieldId: "billreceipts",
        });
        var itemId = rec.getCurrentSublistValue({
            sublistId: "item",
            fieldId: "item",
        });
        var poInternalId = rec.getCurrentSublistValue({
            sublistId: "item",
            fieldId: "orderdoc",
        });
        var orderLine = rec.getCurrentSublistValue({
            sublistId: "item",
            fieldId: "orderline",
        });

        var proxy = url.resolveScript({
            scriptId: "customscript_be_sl_proxy_adm",
            deploymentId: "customdeploy_be_sl_proxy_adm",
            returnExternalUrl: false,
        }),
            resp = https.request({
                method: https.Method.GET,
                url:
                    proxy +
                    "&actionType=getItemReceiptsSum&itemId=" +
                    itemId +
                    "&poInternalId=" +
                    poInternalId +
                    "&orderLine=" +
                    orderLine +
                    "&ibrIds=" +
                    ibrIds,
            }).body;
        //debugger
        if (resp) {
            resp = JSON.parse(resp);

            if (resp.status == "success") {
                rec.setCurrentSublistValue({
                    sublistId: "item",
                    fieldId: "quantity",
                    value: resp.data,
                });
            } else if (resp.status == "failed") {
                alert(
                    "The quantity may not be accurate. Error gettings rates from receipts due to " +
                    resp.msg
                );
            } else {
                alert(
                    "The quantity may not be accurate. Unknown status type: ",
                    resp.status
                );
            }
        } else {
            alert(
                "The quantity may not be accurate. An error occurred and the quantity was not updated."
            );
        }
    }

    function createSOfromRMA(scriptContext) {
        var rmaData = null;

        if (pageMode == "create" && rec.type == record.Type.SALES_ORDER) {
            var urlParams = window.location.search.replace(/^\?/, "").split(/\&/g);
            for (var i = 0; i < urlParams.length; i++) {
                var param = {
                    fldname: urlParams[i].split(/=/)[0],
                    value: unescape(urlParams[i].split(/=/)[1]),
                };

                if (param.fldname.indexOf("rmaData") > -1) {
                    //Handle date values due to formatting difference
                    //The passed date must be in the format dd/MM/yyyy
                    rmaData = param.value;
                }
            }
            //qtyArr = scriptContext.request.parameters.qtyArr;
            if (!common.isNullOrEmpty(rmaData)) {
                rmaData = JSON.parse(rmaData);

                var headerLine = rmaData.body;
                var items = rmaData.lines;

                var bodyDataDict = {
                    entity: headerLine.customer,
                    custbody6: headerLine.endCustomer,
                    custbody9: headerLine.caseNum,
                    custbody_commercial_invoice_num: headerLine.commercialInv,
                    custbody_rma_number: headerLine.rmaId,
                    custbody_contact_customer: headerLine.contactName,
                    custbody_contact_address: headerLine.contactEmail,
                    custbody_contact_phone_number: headerLine.contactPhone,
                    custbody7: headerLine.apiReferance,
                    custbody_so_type: 2,
                    custbody_to_be_charged: headerLine.toBeCharged,
                    custbody_enable_advance_replacement:
                        headerLine.enableAdvReplacementRMA,
                    // , 'custbody_df_approve_advance_replacemen': headerLine.enableAdvReplacementRMA
                };
                for (var key in bodyDataDict) {
                    if (!common.isNullOrEmpty(bodyDataDict[key])) {
                        rec.setValue({
                            fieldId: key,
                            value: bodyDataDict[key],
                            forceSyncSourcing: true,
                        });
                    }
                }

                for (var line in items) {
                    var lineObj = items[line];
                    var warranttyExpirationDate = "";
                    if (!common.isNullOrEmpty(lineObj.warranttyExpirationDate)) {
                        var date = new Date(lineObj.warranttyExpirationDate);
                        var yyyy = date.getFullYear();
                        var mm = date.getMonth() + 1; // Months start at 0!
                        var dd = date.getDate();
                        warranttyExpirationDate = mm + "/" + dd + "/" + yyyy;
                        warranttyExpirationDate = format.format({
                            value: warranttyExpirationDate,
                            type: format.Type.DATE,
                        });
                    }

                    var lineDataDict = {
                        item: lineObj.item,
                        description: decodeURIComponent(lineObj.description),
                        rate: lineObj.rate,
                        quantity: lineObj.quantity,
                        inventorylocation: lineObj.invLocation,
                        custcol_df_rma_line_unique_key: lineObj.lineUniqueKey,
                        taxCode: lineObj.taxCode,
                        custcol_df_serial_number: lineObj.sn,
                        custcol_warranty_expiration_date: warranttyExpirationDate,
                    };
                    var sublistId = "item";
                    //rec.cancelLine({sublistId: sublistId});
                    rec.selectNewLine({ sublistId: sublistId });
                    for (var key in lineDataDict) {
                        if (!common.isNullOrEmpty(lineDataDict[key])) {
                            try {
                                rec.setCurrentSublistValue({
                                    sublistId: sublistId,
                                    fieldId: key,
                                    //line: lineObj.line - 1,
                                    value: lineDataDict[key],
                                    forceSyncSourcing: true,
                                });
                            } catch (err) {
                                rec.setCurrentSublistText({
                                    sublistId: sublistId,
                                    fieldId: key,
                                    //line: lineObj.line - 1,
                                    text: lineDataDict[key],
                                    forceSyncSourcing: true,
                                });
                            }
                        }
                    }
                    rec.commitLine({ sublistId: sublistId });
                }
            }
        }
    }
    function validatePlugTypesPerCountry() {
        var geoCountry = rec.getValue({ fieldId: "custbody_geo_country" });

        logger.error({ title: "geoCountry", details: geoCountry });

        if (common.isNullOrEmpty(geoCountry)) {
            dialog.alert({
                title: "MISSING MANDETORY FIELD",
                message:
                    'Field "GEO COUNTRY" is a mandetory field! Please populate & trying again.',
            });
            return false;
        } else {
            var plugTypesFromCountry = getPlugTypesFromCountry(geoCountry);

            if (
                common.isNullOrEmpty(plugTypesFromCountry) ||
                common.isNullOrEmpty(plugTypesFromCountry[0])
            ) {
                var geoCountryTxt = rec.getText({ fieldId: "custbody_geo_country" });
                dialog.alert({
                    title: "Missing Plug Type Per Country Record",
                    message:
                        "The country " +
                        geoCountryTxt +
                        " has no refrance in the custom record Plug Type Per Country.",
                });
                return false;
            }

            var plugType = rec.getValue({ fieldId: "custbody_plug_type" });

            if (common.isNullOrEmpty(plugType) || common.isNullOrEmpty(plugType[0])) {
                dialog.alert({
                    title: "MISSING MANDETORY FIELD",
                    message:
                        'The field "PLUG TYPE" is manditory. Please set a value and try again.',
                });
                return false;
            }
        }

        return true;
    }

    function getPlugTypesFromCountry(geoCountry) {
        var proxy = url.resolveScript({
            scriptId: "customscript_be_sl_proxy_adm",
            deploymentId: "customdeploy_be_sl_proxy_adm",
            returnExternalUrl: false,
        });

        var resp = https.request({
            method: https.Method.GET,
            url:
                proxy + "&actionType=getPlugTypesFromCountry&geoCountry=" + geoCountry,
        }).body;

        console.log(JSON.stringify("resp: " + resp));

        if (resp) {
            resp = JSON.parse(resp);

            if (resp.status == "success") {
                return resp.data;
            } else {
                dialog.alert({
                    title: "getPlugTypesFromCountry",
                    message:
                        "Error getting the plug types: " +
                        resp.errMessage +
                        ". <br/> Please try again and if the issue persists contact your administartor.",
                });
            }
        } else {
            logger.error({
                title: "getPlugTypesFromCountry",
                message:
                    "There was a error getting the plug types. <br/> Please try again and if the issue persists contact your administartor.",
            });
        }

        return "";
    }

    function openAddItemsPopUp(recId) {
        var recName = rec.getValue({
            fieldId: "tranid",
        });

        var geoCountry = rec.getValue({
            fieldId: "custbody_geo_country",
        });

        var plugType = rec.getValue({
            fieldId: "custbody_plug_type",
        });
        console.log(
            "common.isNullOrEmpty(geoCountry)",
            common.isNullOrEmpty(geoCountry)
        );
        console.log(
            "!common.isNullOrEmpty(plugType)",
            !common.isNullOrEmpty(plugType)
        );
        console.log('plugType != ""', plugType != "");

        if (!common.isNullOrEmpty(geoCountry) && plugType != "") {
            var addItemsData = {};
            addItemsData.proxyAdminUrl = url.resolveScript({
                scriptId: "customscript_df_sl_add_items_popup",
                deploymentId: "customdeploy_df_sl_add_items_popup",
                returnExternalUrl: false,
            });

            var addItemsUrl =
                addItemsData.proxyAdminUrl +
                "&actionType=openAddItemsPopUp&poId=" +
                recId +
                "&poName=" +
                recName +
                "&geoCountry=" +
                geoCountry +
                "&plugType=" +
                plugType;
            if (!addItemsWindow.bckgndDiv || addItemsWindow.bckgndDiv == null) {
                addItemsWindow.bckgndDiv = document.createElement("div");
                addItemsWindow.bckgndDiv.style.position = "absolute";
                addItemsWindow.bckgndDiv.style.zIndex = "999";
                addItemsWindow.bckgndDiv.style.top = "0px";
                addItemsWindow.bckgndDiv.style.left = "0px";
                addItemsWindow.bckgndDiv.style.width =
                    Math.max(document.body.scrollWidth, jQuery(window).width()) + "px";
                addItemsWindow.bckgndDiv.style.height =
                    Math.max(document.body.scrollHeight, jQuery(window).height()) + "px";
                setObjectOpacity(50, addItemsWindow.bckgndDiv);
                addItemsWindow.bckgndDiv.style.backgroundColor = "gray";
                document.body.appendChild(addItemsWindow.bckgndDiv);
            }
            addItemsWindow.bckgndDiv.style.display = "block";
            addItemsWindow.bckgndDiv.style.top = "0px";
            addItemsWindow.nsTranRec = rec;
            addItemsWindow.window = window.open(
                addItemsUrl,
                "Add Items to  " + recName,
                "width=1200,height=800,resizable=yes,scrollbars=yes"
            );
            addItemsaddItemsItems_checkWindowOpennedUrl();
        } else {
            dialog.alert({
                title: "MISSING MANDETORY FIELD",
                message:
                    'Fields "GEO COUNTRY" and "PLUG TYPE" are mandetory fields! please populate theme before trying again',
            });
        }
    }

    /***************************************************************/
    /*Date:'3/3/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1186', Desc: ''
          /***************************************************************/
    function createSalesOrderFromRMA(rmaData) {
        try {
            logger.error({ title: "rmaData", details: rmaData });
            var proxy = url.resolveScript({
                scriptId: "customscript_be_sl_proxy_adm",
                deploymentId: "customdeploy_be_sl_proxy_adm",
                returnExternalUrl: false,
                params: { actionType: "createSalesOrderFromRMA", rmaData: rmaData },
            });

            window.location.href = proxy;
        } catch (err) {
            alert(err.message);
        }
    }

    /***************************************************************/
    /*Date:'6/3/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1193', Desc: ''
          /***************************************************************/
    function checkInvDetailsMandatory() {
        var numLines = rec.getLineCount({
            sublistId: "item",
        });

        for (var line = 0; line < numLines; line++) {
            rec.selectLine({
                sublistId: "item",
                line: line,
            });

            var isInvDetails = rec.getCurrentSublistValue({
                sublistId: "item",
                fieldId: "inventorydetailavail",
            });

            var currentLine = rec.getCurrentSublistIndex({
                sublistId: "item",
            });

            var isInvDetailsAvailable = common.toBoolean(isInvDetails);
            if (isInvDetailsAvailable) {
                var invLocation = rec.getCurrentSublistValue({
                    sublistId: "item",
                    fieldId: "inventorylocation",
                });
                var lineNum = currentLine + 1;

                if (!common.isNullOrEmpty(invLocation)) {
                    var invDetail = rec.getCurrentSublistSubrecord({
                        sublistId: "item",
                        fieldId: "inventorydetail",
                    });
                    var invDetLineNum = invDetail.getLineCount({
                        sublistId: "inventoryassignment",
                    }); // trandate = invDetail.getValue({fieldId: 'trandate'});

                    if (invDetLineNum == 0) {
                        dialog.alert({
                            title: "INVENTORY ITEM",
                            message:
                                "The item in line " +
                                lineNum +
                                " is serialized. Please provide serial numbers under inventory details for this record." +
                                "The quantity of the serial numbers must be equal to quantity in the transaction’s line.",
                        });
                        return false;
                    } else {
                        var invQuantityCount = 0;
                        for (var i = 0; i < invDetLineNum; i++) {
                            invDetail.selectLine({
                                sublistId: "inventoryassignment",
                                line: i,
                            });
                            var invLineQuantity = invDetail.getCurrentSublistValue({
                                sublistId: "inventoryassignment",
                                fieldId: "quantity",
                            });
                            invQuantityCount += invLineQuantity;
                        }
                        var lineQuantity = rec.getCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "quantity",
                        });

                        if (lineQuantity > invQuantityCount) {
                            dialog.alert({
                                title: "INVENTORY DETAILS ERROR",
                                message:
                                    "The overall quantity in the inventory details must match the quantity in line " +
                                    lineNum,
                            });
                            return false;
                        }
                    }
                } else {
                    dialog.alert({
                        title: "INVENTORY ITEM",
                        message:
                            "The item in line " +
                            lineNum +
                            " is an inventory item. please provide inventory location for this item before you provide inventory details.",
                    });
                    return false;
                }
            }
        }
        return true;
    }

    function openNotifyCustomerPopUp(
        recId,
        emailValidationStr,
        downloadValidationStr
    ) {
        /*** Date:'14-03-2022', Editor: 'Nadav Julius', Task: 'DR1185', Desc: '' ***/

        var validationObject = {
            fieldIds: [
                {
                    type: "email",
                    id: "custbody_contact_address",
                    errorMsg: "Please populate CONTACT EMAIL field and try again.",
                },
                {
                    type: "email",
                    id: "custbody_df_nc_email_subject",
                    errorMsg: "Please populate EMAIL SUBJECT field and try again.",
                },
                {
                    type: "email",
                    id: "custbody_df_nc_email_body",
                    errorMsg: "Please populate EMAIL BODY field and try again.",
                },
                {
                    type: "all",
                    id: "location",
                    errorMsg: "Please populate LOCATION field and try again.",
                },
                {
                    type: "all",
                    id: "custbody9",
                    errorMsg: "Please populate CASE# field and try again.",
                },
            ],
            errorMessage: "",
            hasConditionsToNotifyCustomer: true,
        };

        dialog
            .create({
                title: "PL Prints",
                message: "Select a method of notification",
                buttons: [
                    { label: "X", value: "close" },
                    { label: "Dowload", value: "download" },
                    { label: "Email", value: "email" },
                ],
            })
            .then(function (userResp) {
                if (userResp == "email") {
                    if (emailValidationStr.length == 0) {
                        var proxy = url.resolveScript({
                            scriptId: "customscript_be_sl_proxy_adm",
                            deploymentId: "customdeploy_be_sl_proxy_adm",
                            returnExternalUrl: false,
                        });

                        var resp = https.request({
                            method: https.Method.GET,
                            url: proxy + "&actionType=notifyCustomerRMA&recId=" + recId,
                        }).body;

                        // console.log(JSON.stringify('resp: ' + resp));

                        if (resp) {
                            resp = JSON.parse(resp);

                            if (resp.status == "success") {
                                dialog.alert({
                                    title: "Success",
                                    message: "Email Succesfully Sent!",
                                });
                            } else {
                                dialog.alert({
                                    title: "Error Notifying Customer",
                                    message:
                                        "Error preparing the pdf: <br/>" +
                                        resp.errMessage +
                                        ". <br/><br/> Please try again and if the issue persists contact your administartor.",
                                });
                            }
                        } else {
                            dialog.alert({
                                title: "Error Connecting To Server: Notify Customer",
                                message:
                                    "There was a error connecting to the server. <br/><br/> Please try again and if the issue persists contact your administartor.",
                            });
                        }
                    } else {
                        dialog.alert({
                            title: "Missing Data",
                            message: emailValidationStr,
                        });
                    }
                } else if (userResp == "download") {
                    if (downloadValidationStr.length == 0) {
                        window.open(
                            url.resolveScript({
                                scriptId: "customscript_be_sl_proxy_adm",
                                deploymentId: "customdeploy_be_sl_proxy_printer",
                                returnExternalUrl: false,
                                params: {
                                    isInline: "T",
                                    printType: "rma_notify_customer",
                                    recId: recId,
                                },
                            })
                        );
                    } else {
                        dialog.alert({
                            title: "Missing Data",
                            message: downloadValidationStr,
                        });
                    }
                }
            });
    }

    /*Date:'20/3/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1203', Desc: ''*/
    function checkRmaQuantityVsReturned() {
        var rmaId = rec.getValue({ fieldId: "custbody_rma_number" });
        if (!common.isNullOrEmpty(rmaId)) {
            var createdFrom = rec.getValue({ fieldId: "createdfrom" });
            var numLines = rec.getLineCount({
                sublistId: "item",
            });

            var itemsData = {};
            for (var line = 0; line < numLines; line++) {
                var item = rec.getSublistValue({
                    sublistId: "item",
                    line: line,
                    fieldId: "item",
                });

                var rmaLineKey = rec.getSublistValue({
                    sublistId: "item",
                    line: line,
                    fieldId: "custcol_df_rma_line_unique_key",
                });

                var quantity = rec.getSublistValue({
                    sublistId: "item",
                    line: line,
                    fieldId: "itemquantity",
                });

                itemsData[rmaLineKey] = {
                    item: item,
                    quantity: quantity,
                };
            }
            var proxy = url.resolveScript({
                scriptId: "customscript_be_sl_proxy_adm",
                deploymentId: "customdeploy_be_sl_proxy_adm",
                returnExternalUrl: false,
            });

            var resp = https.request({
                method: https.Method.GET,
                url:
                    proxy +
                    "&actionType=checkRmaQuantityVsReturned&createdFrom=" +
                    createdFrom +
                    "&rmaId=" +
                    rmaId +
                    "&itemsData=" +
                    JSON.stringify(itemsData),
            }).body;

            if (resp) {
                resp = JSON.parse(resp);

                if (resp.status == "success") {
                    if (!resp.data) {
                        dialog.alert({
                            title: "ERROR",
                            message:
                                "You can't generate a SO from the RMA because not all lines were returned from the customer",
                        });
                        return false;
                    }
                } else {
                    dialog.alert({
                        title: "Error getting data",
                        message:
                            "Error getting data from proxy, please contact your administartor.",
                    });
                    return false;
                }
            }
        }

        return true;
    }

    function setWarrantyAndSerialNumInIF() {
        var rmaId = rec.getValue({ fieldId: "custbody_rma_number" });
        if (!common.isNullOrEmpty(rmaId)) {
            var createdFrom = rec.getValue({ fieldId: "createdfrom" });

            var soLineData = {};

            var proxy = url.resolveScript({
                scriptId: "customscript_be_sl_proxy_adm",
                deploymentId: "customdeploy_be_sl_proxy_adm",
                returnExternalUrl: false,
            });

            var resp = https.request({
                method: https.Method.GET,
                url:
                    proxy +
                    "&actionType=setWarrantyAndSerialNumInIF&createdFrom=" +
                    createdFrom,
            }).body;

            if (resp) {
                resp = JSON.parse(resp);

                if (resp.status == "success") {
                    soLineData = resp.data;
                    var numLines = rec.getLineCount({
                        sublistId: "item",
                    });

                    for (var line = 0; line < numLines; line++) {
                        var rmaLineKey = rec.getSublistValue({
                            sublistId: "item",
                            line: line,
                            fieldId: "custcol_df_rma_line_unique_key",
                        });
                        if (soLineData.hasOwnProperty(rmaLineKey)) {
                            rec.setSublistValue({
                                sublistId: "item",
                                fieldId: "custcol_df_serial_number",
                                line: line,
                                value: soLineData[rmaLineKey].sn,
                                forceSyncSourcing: true,
                            });
                            rec.setCurrentSublistText({
                                sublistId: "item",
                                fieldId: "custcol_warranty_expiration_date",
                                line: line,
                                text: soLineData[rmaLineKey].warrantyExpDate,
                                forceSyncSourcing: true,
                            });
                        }
                    }
                } else {
                    dialog.alert({
                        title: "Error getting data",
                        message:
                            "Error getting data from proxy, please contact your administartor.",
                    });
                    return false;
                }
            }
        }

        return true;
    }

    /*Date:'3/4/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1208', Desc: ''*/
    function getWarranttyExpirationDate(itemId, sn) {
        var proxy = url.resolveScript({
            scriptId: "customscript_be_sl_proxy_adm",
            deploymentId: "customdeploy_be_sl_proxy_adm",
            returnExternalUrl: false,
        });

        var resp = https.request({
            method: https.Method.GET,
            url:
                proxy +
                "&actionType=getWarranttyExpirationDate&itemId=" +
                itemId +
                "&sn=" +
                sn,
        }).body;

        console.log(JSON.stringify("resp: " + resp));

        if (resp) {
            resp = JSON.parse(resp);

            if (resp.status == "success") {
                return resp.data;
            } else {
                dialog.alert({
                    title: "getWarranttyExpirationDate",
                    message:
                        "Error getting the Warrantty Expiration Date from search. <br/> Please try again and if the issue persists contact your administartor.",
                });
            }
        }
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
        saveRecord: saveRecord,
        openAddItemsPopUp: openAddItemsPopUp,
        createSalesOrderFromRMA: createSalesOrderFromRMA,
        openNotifyCustomerPopUp: openNotifyCustomerPopUp,
    };
});

function isNullOrEmpty(val) {
    if (
        typeof val == "undefined" ||
        val == null ||
        (typeof val == "string" && val.length == 0)
    ) {
        return true;
    }
    return false;
}

function addItemsaddItemsItems_checkWindowOpennedUrl() {
    if (!addItemsWindow.window) {
        alert("Unable to open pop up");
    } else {
        if (addItemsWindow.window.closed) {
            addItemsItems_popUPCloseHandler();
        } else {
            setTimeout("addItemsaddItemsItems_checkWindowOpennedUrl()", 100);
        }
    }
}

function addItemsItems_popUPCloseHandler() {
    //add lines to transaction

    var selectedItems = window.selectedItemsDataPopUp.selectedItems;
    var rec = addItemsWindow.nsTranRec;
    console.log("rec.type", rec.type);

    console.log("CS selectedItems", selectedItems);
    if (
        !isNullOrEmpty(selectedItems) &&
        window.selectedItemsDataPopUp.addSelectedItems
    ) {
        for (var itemId in selectedItems) {
            if (selectedItems.hasOwnProperty(itemId)) {
                console.log(
                    "selectedItems[item]",
                    JSON.stringify(selectedItems[itemId])
                );

                //TODO HAS OWN PROPERTY
                var lineData = selectedItems[itemId];
                if (rec.type == "opportunity" || rec.type == "estimate") {
                    if (lineData.isCore) {
                        rec.selectNewLine({ sublistId: "item" });

                        rec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "item",
                            value: lineData.itemId,
                            forceSyncSourcing: true,
                        });
                        rec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "quantity",
                            value: Number(lineData.qty),
                            forceSyncSourcing: true,
                        });
                        rec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "description",
                            value: lineData.desc,
                            forceSyncSourcing: true,
                        });
                        rec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "custcol_bundle_number",
                            value: lineData.bundel,
                            forceSyncSourcing: true,
                        });

                        var currentRate = rec.getCurrentSublistValue({
                            sublistId: "recmachcustrecord_optional_item_quote",
                            fieldId: "rate",
                        });
                        if (isNullOrEmpty(currentRate)) {
                            try {
                                rec.setCurrentSublistValue({
                                    sublistId: "item",
                                    fieldId: "rate",
                                    value: 0,
                                    forceSyncSourcing: true,
                                });
                            } catch (err) {
                                console.log(err);
                            }
                        }

                        rec.commitLine({ sublistId: "item" });
                    }
                }
                if (rec.type == "estimate") {
                    if (lineData.isOptional) {
                        rec.selectNewLine({
                            sublistId: "recmachcustrecord_optional_item_quote",
                        });

                        rec.setCurrentSublistValue({
                            sublistId: "recmachcustrecord_optional_item_quote",
                            fieldId: "custrecord_optional_item",
                            value: lineData.itemId,
                            forceSyncSourcing: true,
                        });
                        rec.setCurrentSublistValue({
                            sublistId: "recmachcustrecord_optional_item_quote",
                            fieldId: "custrecord_quantity_optional_item",
                            value: Number(lineData.qty),
                            forceSyncSourcing: true,
                        });
                        rec.setCurrentSublistValue({
                            sublistId: "recmachcustrecord_optional_item_quote",
                            fieldId: "custrecord_optional_items_description",
                            value: lineData.desc,
                            forceSyncSourcing: true,
                        });
                        rec.setCurrentSublistValue({
                            sublistId: "recmachcustrecord_optional_item_quote",
                            fieldId: "custrecord_bundle_number",
                            value: lineData.bundel,
                            forceSyncSourcing: true,
                        });

                        rec.commitLine({
                            sublistId: "recmachcustrecord_optional_item_quote",
                        });
                    }
                }
            }
        }
        window.selectedItemsDataPopUp.addSelectedItems = false;
    }

    // reset gloabl vals
    window.selectedItemsDataPopUp.selectedItems = null;
    addItemsWindow.bckgndDiv.style.display = "none";
}
