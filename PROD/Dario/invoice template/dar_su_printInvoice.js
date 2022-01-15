/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/render', 'N/file', 'N/record', 'N/search'],
    function (render, file, record, search) {
        function onRequest(context) {
            renderRecordToPdfWithTemplate(context); 

            function renderRecordToPdfWithTemplate(context) {
                xmlTmplFile = file.load('Templates/PDF Templates/Dario invoice template.html');
                var renderer = render.create();
                renderer.templateContent = xmlTmplFile.getContents();

                var recId = context.request.parameters.recId;
                log.debug('recId:', recId);

                var recType = record.Type.INVOICE;
                log.debug('recType:', recType);

                var invoiceRec = record.load({
                    type: recType,
                    id: recId
                });
                renderer.addRecord('record', invoiceRec);

                var printData = {
                    itemList: [],
                    states: {
                        taxStates: {},
                        beforeTax: 0,
                        totalInvoice: 0,
                  
                    }
                };

                var taxStates = { General: 0, TotalGeneral: 0, Alabama: 0, Alaska: 0, Arizona: 0, Arkansas: 0, ArmedForcesAmericas: 0, ArmedForcesEurope: 0, ArmedForcesPacific: 0, California: 0, Colorado: 0, Connecticut: 0, Delaware: 0, DistrictofColumbia: 0, Florida: 0, Georgia: 0, Hawaii: 0, Idaho: 0, Illinois: 0, Indiana: 0, Iowa: 0, Kansas: 0, Kentucky: 0, Louisiana: 0, Maine: 0, Maryland: 0, Massachusetts: 0, Michigan: 0, Minnesota: 0, Mississippi: 0, Missouri: 0, Montana: 0, Nebraska: 0, Nevada: 0, NewHampshire: 0, NewJersey: 0, NewMexico: 0, NewYork: 0, NorthCarolina: 0, NorthDakota: 0, Ohio: 0, Oklahoma: 0, Oregon: 0, Pennsylvania: 0, PuertoRico: 0, RhodeIsland: 0, SouthCarolina: 0, SouthDakota: 0, Tennessee: 0, Texas: 0, Utah: 0, Vermont: 0, Virginia: 0, Washington: 0, WestVirginia: 0, Wisconsin: 0, Wyoming: 0 };
                var beforeTax = 0, totalInvoice = 0;

                printData.states.taxStates = taxStates;
                printData.states.beforeTax = beforeTax;
                printData.states.totalInvoice = totalInvoice;

                log.debug('printData before', printData.states);

                var itemList = [];
                var lineCount = invoiceRec.getLineCount({ sublistId: 'item' });

                for (var i = 0; i < lineCount; i++) {
                    var q = 0, p = 0;

                    q = invoiceRec.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i });
                    p = invoiceRec.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: i });

                    var item = {
                        partNo: invoiceRec.getSublistValue({ sublistId: 'item', fieldId: 'item_display', line: i }),
                        itemType: invoiceRec.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: i }),
                        state: invoiceRec.getSublistValue({ sublistId: 'item', fieldId: 'custcol_dario_state_display', line: i }),
                        description: invoiceRec.getSublistValue({ sublistId: 'item', fieldId: 'description', line: i }),
                        qty: invoiceRec.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i }),
                        price: invoiceRec.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: i }),
                        itemId: invoiceRec.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i }),
                        HSc: invoiceRec.getSublistValue({ sublistId: 'item', fieldId: 'custcol_hts_code', line: i }),
                        total: (p * q),
                    };

                    itemList[i] = item;
                    log.debug('itemList:' + i, JSON.stringify(itemList));
                    printData.itemList.push(itemList[i]);
                    log.debug('printData.itemList:' + i, JSON.stringify(printData.itemList));

                    if (item.partNo == "Sales Tax") {
                        if (!isNullOrEmpty(item.state)) {//sales tax are related to one of the states
                            log.debug('state', JSON.stringify(item.state));

                            if (taxStates[item.state] == 0) {//first time seen this state
                                taxStates[item.state] = item.total;
                                log.debug('in if: States', JSON.stringify(taxStates));
                            }
                            else {
                                taxStates[item.state] = (taxStates[item.state] + item.total);
                                log.debug('in else: States', JSON.stringify(taxStates));
                            }
                            printData.states.taxStates[item.state] = taxStates[item.state];
                            log.debug('after: printData', JSON.stringify(printData));
                        } else if (isNullOrEmpty(item.state)) {//sales tax are stand alone and not related to any of the states
                            taxStates[General] = taxStates[General] + item.total;
                            printData.states.taxStates[TotalGeneral] = taxStates[General] + taxStates[TotalGeneral];
                        }
                    }

                    else if (item.partNo != "Sales Tax") {//its line with some item , rather not "sales tax"
                        beforeTax += item.total;
                        printData.states.beforeTax = beforeTax;
                        log.debug('printData.states.beforeTax : ', printData.states.beforeTax);
                    }
                
                }
                calcAllTotals(printData);
                //deleteEmptyVal(printData);

                renderer.addCustomDataSource({
                    format: render.DataSource.JSON,
                    alias: "printData",
                    data: JSON.stringify(printData)
                });

                var renderedFile = render.xmlToPdf({
                    xmlString: resolveXmlAmpersand(renderer.renderAsString())
                });	

      
            context.response.writeFile({
                file: renderedFile,
                isInline: true
            });

            }

            //function deleteEmptyVal(printData) {
            //    Object.keys(printData.states.taxStates).forEach(function (key1) {
            //        if (printData.states.taxStates[key1] == 0 || key1 == "General" || key1 == "TotalGeneral") {
            //            delete printData.states.taxStates[key1];
            //        }
            //    });
            
            //    log.debug('deleteEmptyVal:', JSON.stringify(printData.states.taxStates));
            //}

            function calcAllTotals(printData) {
                var totalInvoice = 0;
                Object.keys(printData.states.taxStates).forEach(function (key1) {
                    if (printData.states.taxStates[key1] != 0 && printData.states.taxStates.key1 != "General") {
                        totalInvoice += printData.states.taxStates[key1];
                        log.debug('totalInvoice:' + key1, totalInvoice);
                       
                    }                 
                });
                totalInvoice += printData.states.beforeTax;
                printData.states.totalInvoice = totalInvoice;
                log.debug('printData.states.totalInvoice: ' , JSON.stringify(printData.states.totalInvoice));

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

            function isNullOrEmpty(val) {

                if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                    return true;
                }
                return false;
            }

            function resolveXmlAmpersand(content) {
            return content ? content.replace(new RegExp(/&(?!(?:apos|quot|[gl]t|amp|nbsp);|\\#)/g), '&amp;') : '';
        }

        }
        return {
            onRequest: onRequest
        };
    });



  
