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
    nsTranRec: null
};

var selectedItemsDataPopUp = {
    selectedItems: null,
    addSelectedItems: false
};


define(['require', 'N/log', 'N/ui/message', 'N/record', 'N/error', 'N/runtime', 'N/url', 'N/https', 'N/search', 'N/ui/dialog', '../Common/BE.Lib.Common'],
    function (require, logger, messageLib, record, error, runtime, url, https, search, dialog, common) {

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
            console.log('fieldChanged', fieldId)
            if (fieldId == 'custbody_geo_country') {
                var geoCountry = rec.getValue({ fieldId: 'custbody_geo_country' });

                if (!common.isNullOrEmpty(geoCountry)) {
                    var plugTypes = getPlugTypesFromCountry(geoCountry);
                    if (!common.isNullOrEmpty(plugTypes)) {
                        rec.setValue({ fieldId: 'custbody_plug_type', value: plugTypes.split(',') })
                    } else {
                        rec.setValue({ fieldId: 'custbody_plug_type', value: [''] })
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
            var doSave = true;
            if (rec.type == record.Type.OPPORTUNITY || rec.type == record.Type.ESTIMATE) {
                // return validatePlugTypesPerCountry('saveRecord');
            }

            if (rec.type == record.Type.RETURN_AUTHORIZATION) {
                doSave = checkInvDetailsMandatory();
                if (!doSave) {
                    return false;
                }
            }
              debugger;

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

        function validatePlugTypesPerCountry() {

            var geoCountry = rec.getValue({ fieldId: 'custbody_geo_country' });

            logger.error({ title: 'geoCountry', details: geoCountry })

            if (common.isNullOrEmpty(geoCountry)) {
                dialog.alert({
                    title: 'MISSING MANDETORY FIELD',
                    message: 'Field "GEO COUNTRY" is a mandetory field! Please populate & trying again.'
                });
                return false;
            } else {

                var plugTypesFromCountry = getPlugTypesFromCountry(geoCountry);

                if (common.isNullOrEmpty(plugTypesFromCountry) || common.isNullOrEmpty(plugTypesFromCountry[0])) {
                    var geoCountryTxt = rec.getText({ fieldId: 'custbody_geo_country' });
                    dialog.alert({
                        title: 'Missing Plug Type Per Country Record',
                        message: 'The country ' + geoCountryTxt + ' has no refrance in the custom record Plug Type Per Country.'
                    });
                    return false;
                }

                var plugType = rec.getValue({ fieldId: 'custbody_plug_type' });

                if (common.isNullOrEmpty(plugType) || common.isNullOrEmpty(plugType[0])) {
                    dialog.alert({
                        title: 'MISSING MANDETORY FIELD',
                        message: 'The field "PLUG TYPE" is manditory. Please set a value and try again.'
                    });
                    return false;
                }

            }

            return true;

        }

        function getPlugTypesFromCountry(geoCountry) {

            var proxy = url.resolveScript({
                scriptId: 'customscript_be_sl_proxy_adm',
                deploymentId: 'customdeploy_be_sl_proxy_adm',
                returnExternalUrl: false
            });

            var resp = https.request({
                method: https.Method.GET,
                url: proxy + '&actionType=getPlugTypesFromCountry&geoCountry=' + geoCountry
            }).body;

            console.log(JSON.stringify('resp: ' + resp));

            if (resp) {

                resp = JSON.parse(resp);

                if (resp.status == 'success') {

                    return resp.data;

                } else {
                    dialog.alert({
                        title: 'getPlugTypesFromCountry',
                        message: 'Error getting the plug types: ' + resp.errMessage + '. <br/> Please try again and if the issue persists contact your administartor.'
                    });
                }

            } else {
                logger.error({
                    title: 'getPlugTypesFromCountry',
                    message: 'There was a error getting the plug types. <br/> Please try again and if the issue persists contact your administartor.'
                });
            }

            return '';

        }

        function openAddItemsPopUp(recId) {
            var recName = rec.getValue({
                fieldId: 'tranid'
            });

            var geoCountry = rec.getValue({
                fieldId: 'custbody_geo_country'
            });

            var plugType = rec.getValue({
                fieldId: 'custbody_plug_type'
            });
            console.log('common.isNullOrEmpty(geoCountry)', common.isNullOrEmpty(geoCountry))
            console.log('!common.isNullOrEmpty(plugType)', !common.isNullOrEmpty(plugType))
            console.log('plugType != ""', plugType != '')

            // debugger;
            if (!common.isNullOrEmpty(geoCountry) && plugType != '') {

                var addItemsData = {};
                addItemsData.proxyAdminUrl = url.resolveScript({
                    scriptId: 'customscript_df_sl_add_items_popup',
                    deploymentId: 'customdeploy_df_sl_add_items_popup',
                    returnExternalUrl: false
                });

                var addItemsUrl = addItemsData.proxyAdminUrl + '&actionType=openAddItemsPopUp&poId=' + recId + '&poName=' + recName + '&geoCountry=' + geoCountry + '&plugType=' + plugType;
                if (!addItemsWindow.bckgndDiv || addItemsWindow.bckgndDiv == null) {
                    addItemsWindow.bckgndDiv = document.createElement("div");
                    addItemsWindow.bckgndDiv.style.position = "absolute";
                    addItemsWindow.bckgndDiv.style.zIndex = "999";
                    addItemsWindow.bckgndDiv.style.top = '0px';
                    addItemsWindow.bckgndDiv.style.left = '0px';
                    addItemsWindow.bckgndDiv.style.width = (Math.max(document.body.scrollWidth, jQuery(window).width())) + 'px';
                    addItemsWindow.bckgndDiv.style.height = (Math.max(document.body.scrollHeight, jQuery(window).height())) + 'px';
                    setObjectOpacity(50, addItemsWindow.bckgndDiv);
                    addItemsWindow.bckgndDiv.style.backgroundColor = 'gray';
                    document.body.appendChild(addItemsWindow.bckgndDiv);
                }
                addItemsWindow.bckgndDiv.style.display = "block";
                addItemsWindow.bckgndDiv.style.top = '0px';
                addItemsWindow.nsTranRec = rec;
                addItemsWindow.window = window.open(addItemsUrl, "Add Items to  " + recName, 'width=1200,height=800,resizable=yes,scrollbars=yes');
                addItemsaddItemsItems_checkWindowOpennedUrl();

            }
            else {
                dialog.alert({
                    title: 'MISSING MANDETORY FIELD',
                    message: 'Fields "GEO COUNTRY" and "PLUG TYPE" are mandetory fields! please populate theme before trying again'
                });

            }
        }

        /***************************************************************/
        /*Date:'3/3/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1186', Desc: ''
        /***************************************************************/
        function createSalesOrderFromRMA(rmaData) {
            try {
                logger.error({ title: 'rmaData', details: rmaData })
                var proxy = url.resolveScript({
                    scriptId: 'customscript_be_sl_proxy_adm',
                    deploymentId: 'customdeploy_be_sl_proxy_adm',
                    returnExternalUrl: false,
                    params: { actionType: "createSalesOrderFromRMA", rmaData: rmaData }

                });

                window.location.href = proxy;
            }
            catch (err) {
                alert(err.message);
            }

        }

        /***************************************************************/
        /*Date:'6/3/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1193', Desc: ''
        /***************************************************************/
        function checkInvDetailsMandatory() {

            var numLines = rec.getLineCount({
                sublistId: 'item'
            });

            for (var line = 0; line < numLines; line++) {
                rec.selectLine({
                    sublistId: 'item',
                    line: line
                });

                var isInvDetails = rec.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'inventorydetailavail'
                });

                var currentLine = rec.getCurrentSublistIndex({
                    sublistId: 'item'
                });

                var isInvDetailsAvailable = common.toBoolean(isInvDetails);
                if (isInvDetailsAvailable) {
                    var invLocation = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'inventorylocation'
                    });
                    var lineNum = currentLine + 1;

                    if (!common.isNullOrEmpty(invLocation)) {
                        var invDetail = rec.getCurrentSublistSubrecord({ sublistId: 'item', fieldId: 'inventorydetail' });
                        var invDetLineNum = invDetail.getLineCount({ sublistId: 'inventoryassignment' }); // trandate = invDetail.getValue({fieldId: 'trandate'});

                        if (invDetLineNum == 0) {
                            dialog.alert({
                                title: 'INVENTORY ITEM',
                                message: 'The item in line ' + lineNum + ' is serialized. Please provide serial numbers under inventory details for this record.' +
                                    'The quantity of the serial numbers must be equal to quantity in the transaction’s line.'
                            });
                            return false;
                        }
                        else {
                            var invQuantityCount = 0;
                            for (var i = 0; i < invDetLineNum; i++) {
                                invDetail.selectLine({
                                    sublistId: 'inventoryassignment',
                                    line: i
                                });
                                var invLineQuantity = invDetail.getCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'quantity' });
                                invQuantityCount += invLineQuantity;
                            }
                            var lineQuantity = rec.getCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity'
                            });

                            if (lineQuantity > invQuantityCount) {
                                dialog.alert({
                                    title: 'INVENTORY DETAILS ERROR',
                                    message: 'The overall quantity in the inventory details must match the quantity in line ' + lineNum
                                });
                                return false;
                            }

                        }
                    }
                    else {
                        dialog.alert({
                            title: 'INVENTORY ITEM',
                            message: 'The item in line ' + lineNum + ' is an inventory item. please provide inventory location for this item b efore you provide inventory details.'
                        });
                        return false;
                    }
                }
            }
            return true;
        }

        function openNotifyCustomerPopUp(recId, emailValidationStr, downloadValidationStr) {
            /*** Date:'14-03-2022', Editor: 'Nadav Julius', Task: 'DR1185', Desc: '' ***/

            var validationObject = {
                fieldIds: [
                    { type: 'email', id: 'custbody_contact_address', errorMsg: 'Please populate CONTACT EMAIL field and try again.' },
                    { type: 'email', id: 'custbody_df_nc_email_subject', errorMsg: 'Please populate EMAIL SUBJECT field and try again.' },
                    { type: 'email', id: 'custbody_df_nc_email_body', errorMsg: 'Please populate EMAIL BODY field and try again.' },
                    { type: 'all', id: 'location', errorMsg: 'Please populate LOCATION field and try again.' },
                    { type: 'all', id: 'custbody9', errorMsg: 'Please populate CASE# field and try again.' }
                ],
                errorMessage: '',
                hasConditionsToNotifyCustomer: true
            }

            dialog.create({
                title: 'PL Prints',
                message: 'Select a method of notification',
                buttons: [{ label: 'X', value: 'close' }, { label: 'Dowload', value: 'download' }, { label: 'Email', value: 'email' }]
            }).then(function (userResp) {

                if (userResp == 'email') {

                    if (emailValidationStr.length == 0) {
                        var proxy = url.resolveScript({
                            scriptId: 'customscript_be_sl_proxy_adm',
                            deploymentId: 'customdeploy_be_sl_proxy_adm',
                            returnExternalUrl: false
                        });

                        var resp = https.request({
                            method: https.Method.GET,
                            url: proxy + '&actionType=notifyCustomerRMA&recId=' + recId
                        }).body;

                        // console.log(JSON.stringify('resp: ' + resp));

                        if (resp) {

                            resp = JSON.parse(resp);

                            if (resp.status == 'success') {

                                dialog.alert({
                                    title: 'Success',
                                    message: 'Email Succesfully Sent!'
                                });

                            } else {
                                dialog.alert({
                                    title: 'Error Notifying Customer',
                                    message: 'Error preparing the pdf: <br/>' + resp.errMessage + '. <br/><br/> Please try again and if the issue persists contact your administartor.'
                                });
                            }

                        } else {
                            dialog.alert({
                                title: 'Error Connecting To Server: Notify Customer',
                                message: 'There was a error connecting to the server. <br/><br/> Please try again and if the issue persists contact your administartor.'
                            });
                        }
                    } else {
                        dialog.alert({
                            title: 'Missing Data',
                            message: emailValidationStr
                        });
                    }

                } else if (userResp == 'download') {

                    if (downloadValidationStr.length == 0) {
                        window.open(url.resolveScript({
                            scriptId: 'customscript_be_sl_proxy_adm',
                            deploymentId: 'customdeploy_be_sl_proxy_printer',
                            returnExternalUrl: false,
                            params: { isInline: 'T', printType: 'rma_notify_customer', recId: recId }
                        }));
                    } else {
                        dialog.alert({
                            title: 'Missing Data',
                            message: downloadValidationStr
                        });
                    }

                }

            });

        }

        /*Date:'20/3/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1203', Desc: ''*/
        function checkRmaQuantityVsReturned() {
            var rmaId = rec.getValue({ fieldId: 'custbody_rma_number' });
            if (common.isNullOrEmpty(rmaId)) {
                var createdFrom = rec.getValue({ fieldId: 'createdfrom' });

                var numLines = rec.getLineCount({
                    sublistId: 'item'
                });

                var itemsData = [];
                for (var line = 0; line < numLines; line++) {
                    rec.selectLine({
                        sublistId: 'item',
                        line: line
                    });

                    var item = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });

                    var rmaLineKey = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_df_rma_line_unique_key'
                    });

                    var quantity = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemquantity'
                    });

                    itemsData[lineUniqueKey]={
                        item: item,
                        quantity: quantity
                    };

                }
                var proxy = url.resolveScript({
                    scriptId: 'customscript_be_sl_proxy_adm',
                    deploymentId: 'customdeploy_be_sl_proxy_adm',
                    returnExternalUrl: false
                });

                var resp = https.request({
                    method: https.Method.GET,
                    url: proxy + '&actionType=checkRmaQuantityVsReturned&createdFrom=' + createdFrom +'&rmaId=' + rmaId + '&itemsData=' + JSON.stringify(itemsData)
                }).body;

                if (resp) {

                    resp = JSON.parse(resp);

                    if (resp.status == 'success') {

                        dialog.alert({
                            title: 'Success',
                            message: 'Email Succesfully Sent!'
                        });

                    } else {
                        dialog.alert({
                            title: 'Error Notifying Customer',
                            message: 'Error preparing the pdf: <br/>' + resp.errMessage + '. <br/><br/> Please try again and if the issue persists contact your administartor.'
                        });
                    }

                }


            }

            return true;
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
            openNotifyCustomerPopUp: openNotifyCustomerPopUp
        };

    });


function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
};

function addItemsaddItemsItems_checkWindowOpennedUrl() {
    if (!addItemsWindow.window) {
        alert('Unable to open pop up');
    } else {
        // debugger;
        if (addItemsWindow.window.closed) {
            addItemsItems_popUPCloseHandler();
        } else {
            setTimeout('addItemsaddItemsItems_checkWindowOpennedUrl()', 100);
        }
    }

}

function addItemsItems_popUPCloseHandler() { //add lines to transaction

    // debugger;
    var selectedItems = window.selectedItemsDataPopUp.selectedItems;
    var rec = addItemsWindow.nsTranRec;
    console.log('rec.type', rec.type);

    console.log('CS selectedItems', selectedItems);
    if (!isNullOrEmpty(selectedItems) && window.selectedItemsDataPopUp.addSelectedItems) {
        for (var itemId in selectedItems) {
            if (selectedItems.hasOwnProperty(itemId)) {

                console.log('selectedItems[item]', JSON.stringify(selectedItems[itemId]));

                //TODO HAS OWN PROPERTY
                var lineData = selectedItems[itemId];
                if (rec.type == 'opportunity' || rec.type == 'estimate') {
                    if (lineData.isCore) {
                        rec.selectNewLine({ sublistId: 'item' });

                        rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: lineData.itemId, forceSyncSourcing: true });
                        rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: Number(lineData.qty), forceSyncSourcing: true });
                        rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'description', value: lineData.desc, forceSyncSourcing: true });
                        rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_bundle_number', value: lineData.bundel, forceSyncSourcing: true });

                        var currentRate = rec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_optional_item_quote', fieldId: 'rate' });
                        if (isNullOrEmpty(currentRate)) {
                            try {
                                rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: 0, forceSyncSourcing: true });
                            } catch (err) {
                                console.log(err);
                            }
                        }

                        rec.commitLine({ sublistId: 'item' });
                    }

                }
                if (rec.type == 'estimate') {

                    if (lineData.isOptional) {
                        rec.selectNewLine({ sublistId: 'recmachcustrecord_optional_item_quote' });

                        rec.setCurrentSublistValue({ sublistId: 'recmachcustrecord_optional_item_quote', fieldId: 'custrecord_optional_item', value: lineData.itemId, forceSyncSourcing: true });
                        rec.setCurrentSublistValue({ sublistId: 'recmachcustrecord_optional_item_quote', fieldId: 'custrecord_quantity_optional_item', value: Number(lineData.qty), forceSyncSourcing: true });
                        rec.setCurrentSublistValue({ sublistId: 'recmachcustrecord_optional_item_quote', fieldId: 'custrecord_optional_items_description', value: lineData.desc, forceSyncSourcing: true });
                        rec.setCurrentSublistValue({ sublistId: 'recmachcustrecord_optional_item_quote', fieldId: 'custrecord_bundle_number', value: lineData.bundel, forceSyncSourcing: true });

                        rec.commitLine({ sublistId: 'recmachcustrecord_optional_item_quote' });
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


