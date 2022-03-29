/**
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 */

define(['require', 'N/render', 'N/file', 'N/error', 'N/format', 'N/runtime', 'N/search', '../Common/BE.Lib.Common', 'N/record', 'N/log', 'N/config'],

    function (require, render, file, error, format, runtime, search, common, record, logger, conf) {

        function executePrint(printType, recId, printMode, additionalParams) {
            /*
            throw error.create({
                name : 'MISSING_SETUP',
                message : JSON.stringify({printType : printType,recId : recId,printMode : printMode,additionalParams : additionalParams}),
                notifyOff : true
            });
            */
            var renderedFile = null;
            if (common.isNullOrEmpty(printMode)) {
                printMode = render.PrintMode.PDF;
            }
            switch (printType) {

                case 'rma_notify_customer':

                    var xmlTmplFile = file.load('../Advanced Print Templates/rma_notifyCustomer.ftl');
                    var renderer = render.create();
                    renderer.templateContent = xmlTmplFile.getContents().replace(/html/g, 'pdf'); //hacky replace;

                    var rmaRec = record.load({
                        type: record.Type.RETURN_AUTHORIZATION,
                        id: recId
                    });

                    var itemToSerialsMap = {};
			
                    var lineCount = rmaRec.getLineCount({ sublistId: 'item' })
                    
                    for (var i = 0; i < lineCount; i++) {
                        var itemId = rmaRec.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i })
                        // var itemNumber = rmaRec.getSublistValue({ sublistId: 'item', fieldId: 'custcol_item_number', line: i })
                        
                        var invDetSubRec = rmaRec.getSublistSubrecord({ sublistId: 'item', fieldId: 'inventorydetail', line: i });
                        var invDetLineCount = 0;
                        if(!common.isNullOrEmpty(invDetSubRec)) {
                            invDetLineCount = invDetSubRec.getLineCount({ sublistId: 'inventoryassignment' })					
                        }
                        
                        if(invDetLineCount > 0) {
                            
                            itemToSerialsMap['match' + i] = [];
                            
                            for (var j = 0; j < invDetLineCount; j++) {
                                itemToSerialsMap['match' + i].push(invDetSubRec.getSublistValue({ sublistId: 'inventoryassignment', fieldId: 'receiptinventorynumber', line: j }) || invDetSubRec.getSublistValue({ sublistId: 'inventoryassignment', fieldId: 'issueinventorynumber', line: j })) 
                            }
                          	itemToSerialsMap['match' + i] = itemToSerialsMap['match' + i].join(', ')
                        }
                        
                    };

                    if(!objIsEmpty(itemToSerialsMap)) {
                        renderer.addCustomDataSource({
                            format: render.DataSource.JSON,
                            alias: "itemToSerialsMap",
                            data: JSON.stringify(itemToSerialsMap)
                        });				
                    }
                    
                    var caseId = rmaRec.getValue({ fieldId: 'custbody9' });
                    if(!common.isNullOrEmpty(caseId)) {
                        var caseRec = record.load({
                            type: record.Type.SUPPORT_CASE,
                            id: caseId
                        });
                        renderer.addRecord('case', caseRec);
                    }
                    
                    var locationId = rmaRec.getValue({ fieldId: 'location' });
                    if(!common.isNullOrEmpty(locationId)) {
                        var locationRec = record.load({
                            type: record.Type.LOCATION,
                            id: locationId
                        });
                        renderer.addRecord('location', locationRec);
                    }

                    renderer.addRecord('record', rmaRec);

                    var notifyCustomerForm = render.xmlToPdf({
                        xmlString: resolveXmlAmpersand(renderer.renderAsString())
                    });

                    var pdfFile = file.load('../Advanced Print Templates/rmaFormFirstPage.pdf');

                    var rma_notify_customer_content = [
                        '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">',
                        '<pdfset>',
                        '<pdf src="data:application/pdf;base64,' + pdfFile.getContents() + '" />',
                        '<pdf src="data:application/pdf;base64,' + notifyCustomerForm.getContents() + '" />',
                        '</pdfset>'
                    ].join('');
                    renderedFile = render.xmlToPdf({
                        xmlString: resolveXmlAmpersand(rma_notify_customer_content)
                    });

                    break;
                case 'itemfulfillment_printcoc':

                    var xmlTmplFile = file.load('../Advanced Print Templates/if_cocprint.ftl');

                    var renderer = render.create();

                    renderer.templateContent = xmlTmplFile.getContents();
                    var frRec = record.load({
                        type: record.Type.ITEM_FULFILLMENT,
                        id: recId
                    });
                    var subsidiaryId = frRec.getValue({
                        fieldId: 'subsidiary'
                    });
                    var subsidiaryRec = record.load({
                        id: subsidiaryId,
                        type: record.Type.SUBSIDIARY
                    });
                    var cocEmployeeId = subsidiaryRec.getValue({
                        fieldId: 'custrecord_coc_certified_employee'
                    });
                    var cocEmployeeRec = record.load({
                        id: cocEmployeeId,
                        type: record.Type.EMPLOYEE
                    });

                    var printData = {
                        signatureUrl: '',
                        watermarkUrl: ''
                    }

                    var account = runtime.accountId;
                    account = account.replace('_', '-');
                    var baseUrl = 'https://' + account + '.app.netsuite.com'

                    var signatureImgId = cocEmployeeRec.getValue({ fieldId: 'custentity7' });
                    var signatureImg = file.load({ id: signatureImgId });
                    var imgURLForPDF = signatureImg.url;

                    if (!common.isNullOrEmpty(imgURLForPDF)) {
                        printData.signatureUrl = baseUrl + imgURLForPDF
                    }

                    printData.watermarkUrl = baseUrl + common.getFileURL('dfend_watermark.png');

                    renderer.addCustomDataSource({
                        format: render.DataSource.JSON,
                        alias: "printData",
                        data: JSON.stringify(printData)
                    });

                    renderer.addRecord('cocEmployee', cocEmployeeRec);
                    renderer.addRecord('subsidiary', subsidiaryRec);
                    renderer.addRecord('record', frRec);

                    var ifCocPrint = render.xmlToPdf({
                        xmlString: resolveXmlAmpersand(renderer.renderAsString())
                    });

                    // 
                    var transactionFile = render.transaction({
                        entityId: Number(recId),
                        printMode: render.PrintMode.HTML
                    });

                    var transXmlStringContents = transactionFile.getContents().replace(/html/g, 'pdf'); //hacky replace
                    var transRenderer = render.create();
                    transRenderer.templateContent = transXmlStringContents;

                    var transPrint = render.xmlToPdf({
                        xmlString: resolveXmlAmpersand(transRenderer.renderAsString())
                    });

                    var commercialInvoiceContent = [
                        '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">',
                        '<pdfset>',
                        '<pdf src="data:application/pdf;base64,' + transPrint.getContents() + '" />',
                        '<pdf src="data:application/pdf;base64,' + ifCocPrint.getContents() + '" />',
                        '</pdfset>'
                    ].join('');
                    var renderedFile = render.xmlToPdf({
                        xmlString: resolveXmlAmpersand(commercialInvoiceContent)
                    });

                    break;
                case 'salesorder_printkittinglist':

                    var xmlTmplFile;
                    if (additionalParams.includeImages) {
                        xmlTmplFile = file.load('../Advanced Print Templates/so_kitting_list__w_imgs.ftl');
                    } else {
                        xmlTmplFile = file.load('../Advanced Print Templates/so_kitting_list.ftl');
                    }

                    var account = runtime.accountId;
                    account = account.replace('_', '-');

                    var urlPrefix = 'https://' + account + '.app.netsuite.com';

                    var renderer = render.create();

                    renderer.templateContent = xmlTmplFile.getContents();
                    var soRec = record.load({
                        type: record.Type.SALES_ORDER,
                        id: recId
                    });
                    renderer.addRecord('record', soRec);

                    var deliveryNumber = soRec.getValue({ fieldId: 'custbody_df_delivery_num_for_print_txt' })
                    var printData = {
                        committedDate: '',
                        hasImgs: false
                    }

                    if (additionalParams.includeImages) {
                        printData.imgData = [];
                        printData.hasImgs = true;
                    }

                    var itemIdsForImgs = [];

                    var lineCount = soRec.getLineCount({ sublistId: 'item' });
                    var kittingList = []
                    for (var i = 0; i < lineCount; i++) {
                        var lineDeliveryNum = soRec.getSublistValue({ sublistId: 'item', fieldId: 'custcol10', line: i })
                        var isMissingDeliveryNum = common.isNullOrEmpty(lineDeliveryNum)
                        var itemType = soRec.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: i })
                        if (isMissingDeliveryNum || itemType == 'Group' || itemType == 'EndGroup' || itemType == 'Subtotal' || lineDeliveryNum != deliveryNumber) {
                            continue;
                        }
                        var item = {}

                        if (common.isNullOrEmpty(printData.committedDate)) {
                            var committedDate = soRec.getSublistValue({ sublistId: 'item', fieldId: 'custcol8', line: i })
                            if (!common.isNullOrEmpty(committedDate)) {
                                printData.committedDate = format.format({ value: committedDate, type: format.Type.DATE })
                            }
                        }

                        var itemId = soRec.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i })

                        var fieldLookUp = search.lookupFields({
                            type: getItemTypeFromType(itemType),
                            id: itemId,
                            columns: ['itemid', 'description', 'storedisplayimage']
                        });

                        if (additionalParams.includeImages && (fieldLookUp.storedisplayimage.length > 0) && !common.isNullOrEmpty(fieldLookUp.storedisplayimage[0].text) && (itemIdsForImgs.indexOf(itemId) < 0)) {
                            var imgUrl = fieldLookUp.storedisplayimage[0].text;
                            if (!common.isNullOrEmpty(imgUrl)) {
                                if (imgUrl.indexOf('netsuite.com') > -1) {
                                    imgUrl = imgUrl.split('netsuite.com').pop()
                                }
                                printData.imgData.push({
                                    itemid: fieldLookUp.itemid,
                                    imgUrl: urlPrefix + imgUrl
                                })
                            }

                            itemIdsForImgs.push(itemId);

                        }

                        item.name = fieldLookUp.itemid
                        item.description = fieldLookUp.description
                        item.qty = soRec.getSublistValue({ sublistId: 'item', fieldId: 'custcol_df_quantity_for_delivery', line: i })
                        item.members = []

                        if (itemType == 'Kit') {

                            search.create({
                                type: "item",
                                filters: [["internalid", "anyof", itemId]],
                                columns: [
                                    "memberitem",
                                    search.createColumn({
                                        name: "salesdescription",
                                        join: "memberItem"
                                    }),
                                    search.createColumn({
                                        name: "imageurl",
                                        join: "memberItem"
                                    }),
                                    "memberquantity"
                                ]
                            }).run().each(function (result) {

                                item.members.push({
                                    name: result.getText({ name: 'memberitem' }),
                                    description: result.getValue({ name: 'salesdescription', join: "memberItem" }),
                                    qty: result.getValue({ name: 'memberquantity' })
                                });

                                if (additionalParams.includeImages) {
                                    var memberImgUrl = result.getValue({ name: 'imageurl', join: "memberItem" });
                                    if (!common.isNullOrEmpty(memberImgUrl)) {
                                        if (memberImgUrl.indexOf('netsuite.com') > -1) {
                                            memberImgUrl = memberImgUrl.split('netsuite.com').pop()
                                        }
                                        printData.imgData.push({
                                            itemid: result.getText({ name: 'memberitem' }),
                                            imgUrl: urlPrefix + memberImgUrl
                                        })
                                    }
                                }

                                return true;
                            });


                        }

                        kittingList.push(item)

                    }

                    printData.kittingList = kittingList
                    logger.error({ title: 'printData', details: JSON.stringify(printData) })
                    renderer.addCustomDataSource({
                        format: render.DataSource.JSON,
                        alias: "printData",
                        data: JSON.stringify(printData)
                    });

                    var soKittingList = render.xmlToPdf({
                        xmlString: resolveXmlAmpersand(renderer.renderAsString())
                    });
                    var renderedFile = soKittingList;

                    break;


                default:
                    throw error.create({
                        name: 'MISSING_SETUP',
                        message: 'Printing type ' + printType + ' is not supported',
                        notifyOff: true
                    });
                    break;
            }

            return renderedFile;
        }

        function resolveXmlAmpersand(content) {
            return content ? content.replace(new RegExp(/&(?!(?:apos|quot|[gl]t|amp|nbsp);|\\#)/g), '&amp;') : '';
            //  return content ? content.replace(new RegExp('&(?!(?:apos|quot|[gl]t|amp|nbsp);|\\#)'), '&amp;') : '';
            //  return content ? content.replace(new RegExp('&(?!quot;|apos;|amp;|lt;|gt;#x?.*?;)'), '&amp;') : '';
        }

        function objIsEmpty(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        }

        function getItemTypeFromType(type) {
            var ITEM_TYPE = {
                'Assembly': record.Type.ASSEMBLY_ITEM,
                'Description': record.Type.DESCRIPTION_ITEM,
                'Discount': record.Type.DISCOUNT_ITEM,
                'GiftCert': record.Type.GIFT_CERTIFICATE_ITEM,
                'InvtPart': record.Type.INVENTORY_ITEM,
                'Group': record.Type.ITEM_GROUP,
                'Kit': record.Type.KIT_ITEM,
                'Markup': record.Type.MARKUP_ITEM,
                'NonInvtPart': record.Type.NON_INVENTORY_ITEM,
                'OthCharge': record.Type.OTHER_CHARGE_ITEM,
                'Payment': record.Type.PAYMENT_ITEM,
                'Service': record.Type.SERVICE_ITEM,
                'Subtotal': record.SUBTOTAL_ITEM
            };
            return ITEM_TYPE[type]
        }

        return {
            executePrint: executePrint
        };

    });
