/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/error', 'N/format', 'N/https', 'N/ui/dialog', 'N/ui/message', 'N/url', 'N/runtime', 'N/record', 'N/ui/message', '../Common/BE.Lib.Common.js'],

    function (error, format, https, dialog, message, url, runtime, record, message, common) {

        var rec, sublistName, fieldId, lineNum, pageMode, recType;
        var pageInitiated = false;
        var formData;

        // Consider Power pack vars
        var numOfConsiderPowerPackLines = 0;
        var considerPowerPackIsShown = false;
        var powerPackMsg = message.create({
            title: 'Consider Power Pack',
            message: 'please consider to select a power pack',
            type: message.Type.INFORMATION
        });

        function pageInit(scriptContext) {
            initializeScript(scriptContext);
            pageMode = scriptContext.mode;
            formData = JSON.parse(rec.getValue({ fieldId: 'custpage_formdata' }));
            pageInitiated = true;

            preventEnterDefault();
            initiateEventListeners();

        }

        function fieldChanged(scriptContext) {
            initializeScript(scriptContext);

            var filterType = null;
            var val = rec.getValue({ fieldId: fieldId });
            for (var i = 0; i < formData.formFilters.length; i++) {
                var filter = formData.formFilters[i];
                var fldId = 'custpage_' + filter;
                if (fieldId == fldId) {
                    filterType = filter;
                };
            };

            if (!common.isNullOrEmpty(filterType)) {
                console.log('val is: ' + val)
                console.log('text is: ' + rec.getText({ fieldId: fieldId }))
                handleUnbindedFilterChange(filterType, val);
            }

            if (fieldId == 'cutpage_core_line_checked' || fieldId == 'cutpage_optional_line_checked') {
                var isPowerPack = rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_is_power_pack' });
                if (isPowerPack) {

                    var val = rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: fieldId })
                    if (val) {
                        numOfConsiderPowerPackLines++;

                        if (!considerPowerPackIsShown) {
                            powerPackMsg.show();
                            considerPowerPackIsShown = true;
                        }

                    } else {
                        numOfConsiderPowerPackLines--;

                        if (considerPowerPackIsShown && numOfConsiderPowerPackLines < 1) {
                            setTimeout(powerPackMsg.hide, 300)
                            considerPowerPackIsShown = false;
                        }

                    }

                    console.log('numOfConsiderPowerPackLines is: ' + numOfConsiderPowerPackLines)

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

            initializeScript(scriptContext);

            if (scriptContext.operation == 'commit') {

                sendLineToSessionObject();

            }

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
            return true;
        }

        /** HELPERS **/

        function sendLineToSessionObject() {
            // Line Object Marker
            var imgUrl = rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_image_url' });
            var lineData = {
                itemName: rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_item' }),
                itemId: rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_item_id' }),
                desc: rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_item_discription' }),
                qty: rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_quantity' }),
                isCore: rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_core_line_checked' }),
                isOptional: rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_optional_line_checked' }),
                bundel: rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_bundel' }),
                extractionKey: rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_extraction_key' }),
                isPowerPack: common.boolToNsBool(rec.getCurrentSublistValue({ sublistId: 'custpage_items_list', fieldId: 'cutpage_is_power_pack' })),
                imgUrl: common.isNullOrEmpty(imgUrl) ? null : imgUrl
            }

            console.log('lineData', lineData)
            getSrvData('setSelectedItems', true, { filterType: 'selectedItems', lineData: JSON.stringify(lineData) });
        }

        function handleUnbindedFilterChange(filterType, val) {

            var srvResp = getSrvData('setSessionFilter', true, { filterType: filterType, val: val });

            if (srvResp.status == 'failed') {
                dialog.alert({
                    title: 'Error retrieving lines',
                    message: srvResp.errMessage
                });
                return false;
            };
            //refresh machine(sublistId); //Refresh sublist
            return true;
        }

        function getSrvData(type, isJson, urlParams, httpMethod, isAdmin) {
            if (common.isNullOrEmpty(httpMethod)) {
                httpMethod = https.Method.GET;
            };
            if (common.isNullOrEmpty(isAdmin)) {
                isAdmin = false;
            }
            var res = {
                status: 'success',
                data: null,
                errMessage: ''
            };

            var url = null;

            if (isAdmin) {
                url = formData.srvProviderAdminUrl;
            } else {
                url = formData.srvProviderUrl;
            }

            url += '&isProxy=T&actionType=' + type;
            try {
                var postObject = null;
                if (httpMethod == https.Method.GET) {
                    if (!common.isNullOrEmpty(urlParams)) {
                        for (var param in urlParams) {
                            if (urlParams.hasOwnProperty(param)) {
                                url += '&' + param + '=' + resolveUrlAmpersand(urlParams[param]);
                                // encodeURIComponent(urlParams[param]) another option if issue persists
                            }
                        }
                    }
                } else {
                    postObject = JSON.stringify(urlParams);
                }
                console.log('url is: ' + url)
                // console.log('postObject is: ' + postObject)
                var reqRes = https.request({
                    method: httpMethod,
                    body: postObject,
                    url: url
                });

                var resp = reqRes.body;
                if (isJson) {
                    res = JSON.parse(resp);
                } else {
                    res = resp;
                }
            }
            catch (err) {
                res.status = 'failed';
                res.errMessage = err.message;
            }
            return res;
        }

        function resolveUrlAmpersand(content) {
            return content ? content.replace(new RegExp(/&(?!(?:apos|quot|[gl]t|amp|nbsp);|\\#)/g), '%26') : '';
            //  return content ? content.replace(new RegExp('&(?!(?:apos|quot|[gl]t|amp|nbsp);|\\#)'), '&amp;') : '';
            //  return content ? content.replace(new RegExp('&(?!quot;|apos;|amp;|lt;|gt;#x?.*?;)'), '&amp;') : '';
        }

        function preventEnterDefault() {
            window.addEventListener('keydown', function (keyEvent) {
                if (keyEvent.key == 'Enter') {
                    keyEvent.preventDefault();
                    return false;
                }
            });
        }

        function initiateEventListeners() {
            jQuery('#custpage_items_list_splits').on('DOMSubtreeModified', function (event) {
                console.log('it changed')
                if (event.originalEvent.path[0].nodeName == 'TABLE') {
                    jQuery('#custpage_items_list_splits > tbody > tr').each(function (i, row) {
                        console.log('doin the do')
                        var imgUrl = jQuery(this).find('td:nth-child(8) > input[type=hidden]').val();

                        if (!common.isNullOrEmpty(imgUrl)) {
                            jQuery(this).find('td:nth-child(7)').html('<button style="cursor: pointer;" onClick="openImageUrl(\'' + encodeURIComponent(imgUrl) + '\')">View Image</button>');
                        }

                    });
                }
            });
            jQuery('#refreshcustpage_items_list').click();
        }

        function initializeScript(scriptContext) {
            rec = scriptContext.currentRecord;
            sublistName = scriptContext.sublistId;
            fieldId = scriptContext.fieldId;
            lineNum = scriptContext.line;
            recType = rec.type;
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

    //// GLOBAL FUNCTIONS ////

function openImageUrl(encodedImgUrl) {
    var imgUrl = decodeURIComponent(encodedImgUrl);

    var scrollLeft = jQuery(window).scrollLeft();
    var scrollTop = jQuery(window).scrollTop();
    var viewW = jQuery(window).width();
    var viewH = jQuery(window).height();

    jQuery('#_img_modal').html('<div style="display: flex; justify-content: center;"><img src="' + decodeURIComponent(imgUrl) + '" alt="Something went wrong..."></div>');
    jQuery('#_img_modal').dialog({
        modal: true,
        width: viewW * .5,
        height: 'auto',
        resizable: false,
        closeOnEscape: false,
        open: function (event, ui) {
            jQuery('.ui-widget-overlay').bind('click', function () {
                jQuery("#_img_modal").dialog('close');
            });
        }
    });

    jQuery('body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-draggable').css({
        top: scrollTop + 150 + 'px',
        left: scrollLeft + (viewW * 0.25)
    })

    jQuery('#_img_modal').on('dialogclose', function (event) {
        jQuery('#_img_modal').html();
    });
}