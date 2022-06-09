/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/record', 'N/search', 'N/url', 'N/error', 'N/ui/serverWidget', 'N/runtime', '../Common/BE.Lib.Common.js'],

    function (logger, record, search, url, error, serverWidget, runtime, common) {
        var selectedItems = {};
        function onRequest(context) {
            var isRefresh = !common.isNullOrEmpty(context.request.parameters['machine']);
            var isProxy = nsBoolToBool(context.request.parameters['isProxy']);
            var isInitialLoad = true;
            var sessionObjects = {};
            var sessionObj = runtime.getCurrentSession();
            var filtersParams = {
                item_type: '',
                colors: '',
                sellable_item_types: '',
                deployment_type: '',
                desc_filter: ''
            };
            for (var param in filtersParams) {
                if (filtersParams.hasOwnProperty(param)) {
                    sessionObjects[param] = 'session_' + param;
                }
            };
            sessionObjects['selectedItems'] = 'session_selectedItems';

            if (isProxy) {
                items_handleProxy(context.request, context.response, selectedItems);
                return;
            }

            if (context.request.method == "GET") {
                if (!isRefresh) {
                    for (var param in sessionObjects) {
                        if (sessionObjects.hasOwnProperty(param)) {
                            sessionObj.set({ name: sessionObjects[param], value: null });
                        }
                    }
                    isInitialLoad = true; //!storedFiltersExists;

                } else {

                    isInitialLoad = false;
                    for (var param in filtersParams) {
                        if (filtersParams.hasOwnProperty(param)) {
                            filtersParams[param] = sessionObj.get({ name: sessionObjects[param] });
                        }
                    };
                    selectedItems = JSON.parse(sessionObj.get({ name: 'session_selectedItems' }));
                }

                var actionType = context.request.parameters.actionType
                if (actionType == 'openAddItemsPopUp') {

                    sessionObj.set({ name: "memberItems", value: null }); // TODO

                    try {
                        var form = build_form(context, isInitialLoad, filtersParams, selectedItems);
                        context.response.writePage(form);
                    } catch (err) {
                        context.response.write(err.message);
                    }

                }
            } else { // POST
                var actionType = context.request.parameters.custpage_action_type;
                logger.debug({ title: "actionType in else", details: JSON.stringify(actionType) });

                if (actionType == 'openAddItemsPopUp') {

                    var form = serverWidget.createForm({ title: '  ', hideNavBar: true });

                    field = form.addField({
                        id: 'custpage_closepage',
                        type: serverWidget.FieldType.INLINEHTML,
                        label: 'close'
                    });

                    var selectedItems = runtime.getCurrentSession().get({ name: 'session_selectedItems' });

                    log.debug({
                        title: 'SL selectedItems',
                        details: selectedItems
                    })

                    var closeFld_script =
                        '<script>' +
                        'debugger;' +
                        'window.opener.selectedItemsDataPopUp.selectedItems = ' + selectedItems + ';' +
                        'window.opener.selectedItemsDataPopUp.addSelectedItems = ' + true + ';' +
                        'window.close()' +
                        '</script>';
                    form.updateDefaultValues({
                        custpage_closepage: closeFld_script
                    });
                    context.response.writePage(form);
                }
            }

        }

        function build_form(context, isInitialLoad, filtersParams, selectedItems) {

            var form = serverWidget.createForm({ title: 'Add Items to ' + context.request.parameters.poName, hideNavBar: true });
            form.clientScriptModulePath = '../Client/DF.CS.Add.Items.PopUp.js';

            form.addSubmitButton({
                label: 'Add Selection'
            });

            var itemType = form.addField({
                id: 'custpage_item_type',
                type: serverWidget.FieldType.SELECT,
                label: 'Type',
            });

            itemType.addSelectOption({
                value: '',
                text: ''
            });

            search.create({
                type: "item",
                filters: [],
                columns: [search.createColumn({ name: "type", summary: "GROUP" })]
            }).run().each(function (result) {
                var selectOptVal = result.getValue({ name: "type", summary: "GROUP" });
                var doNotDisplayItemTypes = ['Discount', 'Assembly', 'Group']
                if (doNotDisplayItemTypes.indexOf(selectOptVal) < 0) {
                    itemType.addSelectOption({
                        value: selectOptVal,
                        text: result.getText({ name: "type", summary: "GROUP" })
                    });
                }
                return true;
            });


            var colors = form.addField({
                id: 'custpage_colors',
                type: serverWidget.FieldType.SELECT,
                label: 'Color',
            });

            colors.addSelectOption({
                value: '',
                text: ''
            });

            search.create({
                type: "customlist_color",
                filters:
                    [
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC
                        }),
                        "internalid"
                    ]
            }).run().each(function (result) {
                var colorsText = result.getValue({ name: "name", sort: search.Sort.ASC })
                var colorsVal = result.getValue({ name: "internalid" })
                if (colorsText != 'N/A') {
                    colors.addSelectOption({
                        value: colorsVal,
                        text: colorsText
                    });
                }
                return true;
            });


            form.addField({
                id: 'custpage_desc_filter',
                type: serverWidget.FieldType.TEXT,
                label: 'Description'
            });

            var sellableItemTypes = form.addField({
                id: 'custpage_sellable_item_types',
                type: serverWidget.FieldType.SELECT,
                label: 'Sellable Item Types',
            });

            sellableItemTypes.addSelectOption({
                value: '',
                text: ''
            });

            search.create({
                type: "customlist_item_type",
                filters:
                    [
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC
                        }),
                        "internalid"
                    ]
            }).run().each(function (result) {
                var sellableText = result.getValue({ name: "name", sort: search.Sort.ASC })
                var sellableVal = result.getValue({ name: "internalid" })
                if (sellableText != 'N/A') {
                    sellableItemTypes.addSelectOption({
                        value: sellableVal,
                        text: sellableText
                    });
                }
                return true;
            });


            var deploymentTypes = form.addField({
                id: 'custpage_deployment_type',
                type: serverWidget.FieldType.SELECT,
                label: 'Deployment Types',
            });

            deploymentTypes.addSelectOption({
                value: '',
                text: ''
            });
            search.create({
                type: "customlist_deployment_type",
                filters:
                    [
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC
                        }),
                        "internalid"
                    ]
            }).run().each(function (result) {
                var deploymentText = result.getValue({ name: "name", sort: search.Sort.ASC })
                var deploymentVal = result.getValue({ name: "internalid" })
                if (deploymentText != 'N/A') {
                    deploymentTypes.addSelectOption({
                        value: deploymentVal,
                        text: deploymentText
                    });
                }
                return true;
            });


            form.addField({
                id: 'custpage_action_type',
                type: serverWidget.FieldType.TEXT,
                label: ' ',
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            form.updateDefaultValues({
                custpage_action_type: 'openAddItemsPopUp'
            });

            form.addField({
                id: 'custpage_payments_img_modal',
                label: 'aaa',
                type: serverWidget.FieldType.INLINEHTML
            }).defaultValue = '<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">' +
            '<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>' +
            '<script defer src="https://use.fontawesome.com/releases/v5.0.4/js/all.js"></script>' +
            '<style type="text/css"> .ui-dialog .ui-dialog-title { text-align: center; width: 100%; } </style>' +
                '<div id="_img_modal" title="Image"></div>';

            var formData = {
                srvProviderUrl: url.resolveScript({
                    scriptId: 'customscript_df_sl_add_items_popup',
                    deploymentId: 'customdeploy_df_sl_add_items_popup',
                    returnExternalUrl: false
                }),

                srvProviderAdminUrl: url.resolveScript({
                    scriptId: 'customscript_df_sl_add_items_popup',
                    deploymentId: 'customdeploy_df_sl_add_items_popup',
                    returnExternalUrl: false
                }),

                formFilters: Object.keys(filtersParams)
            };

            form.addField({
                id: 'custpage_formdata',
                type: serverWidget.FieldType.LONGTEXT,
                label: ' '
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            var defaultValues = {
                custpage_formdata: JSON.stringify(formData)
            };

            for (var param in filtersParams) {

                if (filtersParams.hasOwnProperty(param)) {
                    var val = filtersParams[param];

                    if (!common.isNullOrEmpty(val)) {
                        defaultValues['custpage_' + param] = val
                    };
                }
            };

            form.updateDefaultValues(defaultValues);
            buildSublist(context, form, filtersParams, isInitialLoad, selectedItems);
            return form;
        }

        function buildSublist(context, form, filtersParams, isInitialLoad, selectedItems) {
            try {

                var sublist = form.addSublist({ id: 'custpage_items_list', type: serverWidget.SublistType.LIST, label: 'Items To Add' });
                sublist.addRefreshButton('Refresh');

                sublist.addField({
                    id: 'cutpage_core_line_checked',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'Main'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.ENTRY
                });
                sublist.addField({
                    id: 'cutpage_optional_line_checked',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'Optional'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.ENTRY
                });
                var bundelFld = sublist.addField({
                    id: 'cutpage_bundel',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Bundel'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.ENTRY
                });
                bundelFld.updateDisplaySize({
                    height: 60,
                    width: 6
                });
                var itemFld = sublist.addField({
                    id: 'cutpage_item',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Item'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.ENTRY
                });
                itemFld.updateDisplaySize({
                    height: 60,
                    width: 30
                });
                var descFld = sublist.addField({
                    id: 'cutpage_item_discription',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Item Description'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.ENTRY
                });
                descFld.updateDisplaySize({
                    height: 60,
                    width: 90
                });
                var qtyFld = sublist.addField({
                    id: 'cutpage_quantity',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Quantity'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.ENTRY
                });
                qtyFld.updateDisplaySize({
                    height: 60,
                    width: 6
                });
                var imgFld = sublist.addField({
                    id: 'cutpage_image_popup',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Item image'
                });
                imgFld.updateDisplaySize({
                    height: 60,
                    width: 6
                });


                // Data Fields (Hidden)
                sublist.addField({
                    id: 'cutpage_image_url',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Item image Url'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublist.addField({
                    id: 'cutpage_item_id',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Item Id'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublist.addField({
                    id: 'cutpage_extraction_key',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Extraction Key'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                sublist.addField({
                    id: 'cutpage_is_power_pack',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'Power Pack'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var sublistData = getItems(context, filtersParams, isInitialLoad, selectedItems);
                // logger.debug({ title: 'sublistData', details: JSON.stringify(sublistData) })

                var lineIndex = 0;
                var tdColor = '#B2FF33';
                for (var lineKey in sublistData) {
                    if (sublistData.hasOwnProperty(lineKey)) {
                        var lineData = sublistData[lineKey];
                        // logger.error({ title: 'setSublistVal lineData', details: JSON.stringify(lineData) })
                        var isCore = common.boolToNsBool(lineData.isCore);
                        var isOptional = common.boolToNsBool(lineData.isOptional);
                        // if (isCore || isOptional) {
                        //     var trDom = addItemsWindow.window.document.getElementById('custpage_listrow' + lineIndex);
                        //     var trDomChild = trDom.children;
                        //     for (var t = 0; t < (trDomChild.length - 1); t += 1) {
                        //         var tdDom = trDomChild[t];
                        //         tdDom.setAttribute('style', 'background-color: ' + tdColor + '!important;border-color: white ' + tdColor + ' ' + tdColor + ' ' + tdColor + '!important;');
                        //     }
                        // }
                        // Line Object Marker
                        sublist.setSublistValue({ id: 'cutpage_core_line_checked', line: lineIndex, value: isCore });
                        sublist.setSublistValue({ id: 'cutpage_optional_line_checked', line: lineIndex, value: isOptional });
                        sublist.setSublistValue({ id: 'cutpage_item', line: lineIndex, value: lineData.itemName });
                        sublist.setSublistValue({ id: 'cutpage_item_id', line: lineIndex, value: lineData.itemId });
                        if (!common.isNullOrEmpty(lineData.desc)) {
                            sublist.setSublistValue({ id: 'cutpage_item_discription', line: lineIndex, value: lineData.desc });
                        }
                        sublist.setSublistValue({ id: 'cutpage_quantity', line: lineIndex, value: lineData.qty });
                        if (!common.isNullOrEmpty(lineData.bundel)) {
                            sublist.setSublistValue({ id: 'cutpage_bundel', line: lineIndex, value: lineData.bundel });
                        }
                        sublist.setSublistValue({ id: 'cutpage_extraction_key', line: lineIndex, value: lineData.extractionKey });
                        sublist.setSublistValue({ id: 'cutpage_is_power_pack', line: lineIndex, value: lineData.isPowerPack });
                        sublist.setSublistValue({ id: 'cutpage_image_url', line: lineIndex, value: lineData.imgUrl });
                        lineIndex++
                    }
                }

            } catch (err) {
                logger.error({ title: 'Error in buildSublist', details: JSON.stringify(err) })
            }
        }

        function getItems(context, filtersParams, isInitialLoad, selectedItems) {
            try {
                var itemsData = {};
                // if (isInitialLoad) {
                //     return itemsData;
                // };

                var geoCountry = context.request.parameters['geoCountry'];
                // logger.error({ title: 'geoCountryt', details: JSON.stringify(geoCountry) })

                var plugType = context.request.parameters['plugType'].split(",");
                // logger.error({ title: 'plugType', details: JSON.stringify(plugType) })

                var filters = addFiltersToSearch(filtersParams, plugType, [geoCountry]);
                logger.debug({ title: 'filters', details: JSON.stringify(filters) })
                var uid = '_' + Date.now();

                search.create({
                    type: "item",
                    filters: filters,
                    columns: [
                        "itemid",
                        "displayname",
                        "custitem_consider_power_pack",
                        "storedisplayimage"
                    ]
                }).run().each(function (result) {
                    // Line Object Marker
                    var itemName = result.getValue({ name: 'itemid' });
                    var isPowerPack = 'F';
                    var considerPowerPack = result.getValue({ name: 'custitem_consider_power_pack' });
                    if (considerPowerPack == '2') {
                        isPowerPack = 'T';
                    }
                    var imgUrl = result.getText({ name: 'storedisplayimage' });
                    imgUrl = common.isNullOrEmpty(imgUrl) ? null : imgUrl;
                    itemsData[itemName + uid] = {
                        itemName: itemName,
                        itemId: result.id,
                        desc: result.getValue({ name: 'displayname' }),
                        qty: 1,
                        isCore: false,
                        isOptional: false,
                        bundel: null,
                        extractionKey: itemName + uid,
                        isPowerPack: isPowerPack,
                        imgUrl: imgUrl
                    }

                    return true;
                });

                var sessionObj = runtime.getCurrentSession();
                var selectedItems = sessionObj.get({ name: 'session_selectedItems' });
                // logger.debug({ title: 'selectedItems for build', details: selectedItems })

                if (!common.isNullOrEmpty(selectedItems) && typeof selectedItems == 'string') {
                    selectedItems = JSON.parse(selectedItems);
                    // logger.debug({ title: 'post parse selectedItems', details: JSON.stringify(selectedItems) })
                }
                if (common.isNullOrEmpty(selectedItems)) {
                    selectedItems = {};
                }

                for (var selectedItem in selectedItems) {
                    // Line Object Marker
                    var selectedItemData = selectedItems[selectedItem];
                    itemsData[selectedItem + uid] = {
                        itemName: selectedItemData.itemName,
                        itemId: selectedItemData.itemId,
                        desc: selectedItemData.desc,
                        qty: selectedItemData.qty,
                        isCore: selectedItemData.isCore,
                        isOptional: selectedItemData.isOptional,
                        bundel: selectedItemData.bundel,
                        extractionKey: selectedItemData.extractionKey,
                        isPowerPack: selectedItemData.isPowerPack,
                        imgUrl: selectedItemData.imgUrl
                    }
                }

                return itemsData;
            } catch (error) {
                logger.error({ title: 'Error in getItems', details: JSON.stringify(err) })
            }
        }

        function addFiltersToSearch(filtersParams, plugTypes, countrys) {
            var filters = [
                ["isinactive", "is", "F"],
                "AND",
                ["custitem_sellable", "is", "T"],
                "AND",
                [[["custitem_geo_country_for_item", "anyof", countrys]], "OR", [["custitem_geo_country_for_item", "is", "@NONE@"]]]
            ];

            var plugTypeFilter = ["custitem_plug_type_2", "anyof", "@NONE@"];
            plugTypes.push('1');
            plugTypeFilter = plugTypeFilter.concat(plugTypes)
            logger.error({ title: 'plugTypeFilter', details: JSON.stringify(plugTypeFilter) })
            filters.push('AND');
            filters.push(plugTypeFilter);

            for (param in filtersParams) {

                if (filtersParams.hasOwnProperty(param)) {
                    var val = filtersParams[param];
                    var custFilter = null;

                    if (!common.isNullOrEmpty(val)) {
                        switch (param) {
                            case 'item_type':
                                custFilter = ["type", "anyof", val]
                                break;

                            case 'colors':
                                custFilter = ["custitem2", "anyof", val]
                                break;

                            case 'sellable_item_types':
                                custFilter = ["custitem_item_type", "anyof", val]
                                break;

                            case 'deployment_type':
                                custFilter = ["custitem_deployment_type", "anyof", val]
                                break;

                            case 'desc_filter':
                                if (val.trim().length != 0) {
                                    custFilter = ["description", "contains", val.trim()]
                                }
                                break;

                            default:
                                logger.error({ title: 'error', details: 'Unhandaled param - ' + param + ' - in function addFiltersToSearch please contact your administrator.' });
                                break;
                        }
                    }
                    if (!common.isNullOrEmpty(custFilter)) {
                        if (filters.length == 0) {
                            filters.push(custFilter);
                        }
                        else {
                            filters.push('AND');
                            filters.push(custFilter);
                        }
                    }
                }
            }
            return filters;
        }

        function items_handleProxy(request, response, selectedItems) {
            var actionType = request.parameters['actionType'];
            var res = {
                status: 'success',
                errMessage: '',
                data: null
            };
            try {
                switch (actionType) {
                    case 'setSessionFilter':
                        var sessionObj = runtime.getCurrentSession();

                        //Set session parameter 
                        var filterType = request.parameters['filterType'];
                        var val = request.parameters['val'];
                        var sessionObject = 'session_' + filterType;
                        sessionObj.set({ name: sessionObject, value: val });
                        // logger.error({ title: 'setSessionFilter', details: sessionObj.get({ name: sessionObject }) })
                        break;

                    case 'setSelectedItems':
                        var sessionObj = runtime.getCurrentSession();
                        var updatedSelectedItems = sessionObj.get({ name: 'session_selectedItems' });
                        if (!common.isNullOrEmpty(updatedSelectedItems)) {
                            var updatedSelectedItems = JSON.parse(updatedSelectedItems);
                        } else {
                            updatedSelectedItems = {};
                        }
                        //Set session parameter 
                        var filterType = request.parameters['filterType'];
                        var sessionObject = 'session_' + filterType;
                        var lineData = request.parameters['lineData'];
                        if (!common.isNullOrEmpty(lineData)) {
                            lineData = JSON.parse(lineData)
                        };
                        // logger.error({ title: 'sessionObject', details: JSON.stringify(sessionObject) })
                        // logger.error({ title: 'lineData', details: JSON.stringify(lineData) })
                        if (!common.isNullOrEmpty(lineData)) {

                            var extractionKey = lineData.extractionKey;

                            if (updatedSelectedItems.hasOwnProperty(extractionKey) && !lineData.isOptional && !lineData.isCore) {
                                //  Delete
                                delete updatedSelectedItems[extractionKey];
                            } else if (!updatedSelectedItems.hasOwnProperty(extractionKey) && !lineData.isOptional && !lineData.isCore) {
                                // Do Nothing
                            } else {
                                // Update / Add New Line
                                updatedSelectedItems[extractionKey] = lineData;
                            }

                        }

                        logger.error({ title: 'lineData', details: JSON.stringify(lineData) })
                        sessionObj.set({ name: sessionObject, value: JSON.stringify(updatedSelectedItems) });
                        logger.error({ title: 'selectedItems', details: sessionObj.get({ name: sessionObject }) })
                        break;

                    default:
                        throw error.create({
                            title: 'backLogRevRecReport',
                            message: 'The action type ' + actionType + ' is not supported',
                            notifyOff: true
                        });
                }
            }
            catch (err) {
                res.status = 'failed';
                res.errMessage = err.message;
                logger.error({
                    title: 'backlogRevRecPlan',
                    details: 'Action Type : ' + actionType + ' ,Error : ' + res.errMessage
                });
            }
            response.write(JSON.stringify(res));
        }

        function nsBoolToBool(val) {
            if (!common.isNullOrEmpty(val)) {
                if (typeof (val) === "boolean") {
                    return val;
                }
                else {
                    if (val == 'T') {
                        return true;
                    }
                }
            }
            return false;
        };

        return {
            onRequest: onRequest
        };

    });
