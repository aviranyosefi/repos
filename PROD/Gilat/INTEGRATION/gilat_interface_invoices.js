/**
 * @NApiVersion 2.x
 * @NScriptType restlet
 * Version    Date            Author           Remarks
 * 1.00       28 NOV 2019  Moshe Barel
 */
define(['N/record', 'N/error', 'N/search', 'N/format', 'N/file'],
    function (record, error, search, format, file) {
        function doValidation(args, argNames, methodName) {
            for (var i = 0; i < args.length; i++)
                if (!args[i] && args[i] !== 0)
                    throw error.create({
                        name: 'MISSING_REQ_ARG',
                        message: 'Missing a required argument: [' + argNames[i] + '] for method: ' + methodName
                    });
        }
        // insert or update a NetSuite record from request param
        var arrItems = [];
        function post(context) {
            //{
            //    "entity":"12046 Urban Rest Apartments", 
            //    "tranid":" 5d918984a6ba7400201fd51d ", 
            //    "trandate":"30/09/19", 
            //    "currncy":"USD", 
            //    "exchangerate" :"1.0000",
            //    "duedate": "7/12/2019",
            //    "postingperiod": "Nov 2019",
            //    "otherrefnum" : "",
            //    "location" : "01-Sales - Israel",
            //    "custbody_part_of_deal": "F",
            //    "custbody_profitability_approval_level": "1",
            //    "custbody_report_timestamp": "7/11/2019 1:23:54",
            //    "custbody_stc_amount_after_discount": "150.00",
            //    "custbody_stc_tax_after_discount": "25.50",
            //    "custbody_stc_total_after_discount": "175.50",
            //    "items" : [{
            //        "item":"AN00189",
            //        "amount":"150.00",
            //        "rate":"150.00",
            //        "quantity":"1.00",
            //        "description": "Skyware 2.4m Antenna Ku-Band Linear Cross-pol Rx/Tx CPR137 Type 243 Class III"
            //        "price": "-1", 
            //        "custcol_gilat_so_number" : "",
            //        "custcol_so_line_number" : "",
            //        "custcol_subscription" : "",
            //        "custcol_site" : "",
            //    }]
            //}
            //try {
            doValidation(['invoice', context.tranid], ['recordtype', 'tranid'], 'POST');
            log.debug('json:', JSON.stringify(context));

            var typeRec = 'invoice';
            if (context.trantype == 'CreditMemo') {
                typeRec = 'creditmemo'
            }

            rec = record.create({
                type: typeRec,
                isDynamic: true,
            });

            var myFilters = [['custentity_legacy_system_number', 'is', context.entity]];
            var myColumns = ['internalid'];
            var srch = search.create({ type: 'customer', filters: myFilters, columns: myColumns });
            var srchResults = srch.run();
            var customerid, siteid = -1;
            srchResults.each(function (result) {
                customerid = result.id;
            });

            // if not customer - then site
            if (customerid != -1 && customerid != '' && customerid != null && customerid != undefined) {
                log.debug('entity customer 1', customerid);
                rec.setValue('entity', customerid);
            }
            else {
                log.debug('entity site 1', 'entity site 1');
                log.debug('context.entity', context.entity);
                var myFilters = [['custrecord_site_sap_customer_number', 'is', context.entity]];
                var myColumns = ['internalid', 'custrecord_site_customer'];
                var srch = search.create({ type: 'customrecord_site', filters: myFilters, columns: myColumns });
                var srchResults = srch.run();
                var customerid = -1;
                srchResults.each(function (result) {
                    siteid = result.id;
                    customerid = result.getValue('custrecord_site_customer');
                });
                log.debug('entity site 2', customerid);
                if (customerid != -1) {
                    rec.setValue('entity', customerid);
                }
            }
            var res_mobile_use_outside_il = search.lookupFields({
                type: search.Type.CUSTOMER,
                id: customerid,
                columns: ['custentity_mobile_use_outside_il']
            });
            log.debug('mobile_use_outside_il:', JSON.stringify(mobile_use_outside_il));
            var mobile_use_outside_il = res_mobile_use_outside_il.custentity_mobile_use_outside_il
            if (context.docsum != null)
                rec.setValue('custbody_sap_gross', context.docsum);

            var itemsearch = search.create({
                type: "item",
                columns: ['internalid', 'name'],
            });

            itemsearch.run().each(function (result) {
                var name = result.getValue({
                    name: 'name'
                });
                var id = result.id;
                arrItems[id] = name.toLowerCase();
                return true;
            });
            var filebase64;
            for (var fldName in context)
                if (context.hasOwnProperty(fldName)) {
                    var val = context[fldName];
                    if (val == null || fldName == "trantype" || fldName == "exchangerate" || fldName == "docsum" || fldName == "discountsum" || fldName == "custcol_site")
                        continue;
                    if (typeRec == 'creditmemo' && fldName == "duedate") continue;
                    var type = "";
                    if (fldName == "base64") {
                        filebase64 = val;
                    }
                    else if (fldName == "invoiceExternalId")
                        rec.setValue('externalid', val);
                    else if (fldName == "entity")
                        continue;
                    else if (fldName !== 'items') {
                        var field = rec.getField(fldName);
                        if (field == null)
                            continue;
                        type = rec.getField(fldName).type;
                    }
                    if (type === "datetime" || type === "date") {
                        var splitedDate = val.split("/");
                        var val = new Date(new Number(splitedDate[2]).valueOf(), (new Number(splitedDate[1]).valueOf()) - 1, new Number(splitedDate[0]).valueOf(), 0, 0, 0, 0);
                    }
                    log.debug('fldName:' + fldName + ' ' + type, val);
                    if (type === "select") {
                        rec.setText(fldName, val);
                    }
                    else if (fldName == 'tranid') {
                        rec.setValue(fldName, val.toString());
                        rec.setValue('externalid', val.toString());
                    }
                    else if (fldName !== 'recordtype' && fldName !== 'id' && fldName !== 'items')
                        rec.setValue(fldName, val);
                    if (fldName === 'items') {
                        var items = val;
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            rec.selectNewLine({
                                sublistId: "item"
                            });
                            for (var fldName in item) {
                                var val = item[fldName];
                                if (val == null)
                                    continue;
                                var field = rec.getSublistField({
                                    sublistId: "item",
                                    fieldId: fldName,
                                    line: 0
                                })
                                if (field == null)
                                    continue;
                                log.audit('fldName ITEM:' + fldName + ' ' + type, val + ' ' + arrItems.indexOf(val));
                                if (fldName == "price" || fldName == "revReqStartDate" || fldName == "revReqEndDate" || fldName == "custcol_site" || fldName == "rate1")
                                    continue;
                                //if (fldName == "amount")
                                //    fldName = "grossamt";
                                if (fldName == "otherrefnum") {
                                    var myFilters = [['name', 'is', val], ['custrecord_cpo_customer', 'is', customerid]];
                                    var myColumns = ['internalid'];
                                    var srch = search.create({ type: 'customrecord_custom_po', filters: myFilters, columns: myColumns });
                                    var srchResults = srch.run();
                                    var customerpoid = -1;
                                    srchResults.each(function (result) {
                                        customerpoid = result.id;
                                    });
                                    if (customerpoid != "-1") {
                                        rec.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: "custcol_customer_po",
                                            value: customerpoid
                                        });
                                    }
                                    continue;
                                }
                                var type = field.type;
                                if ((type === "datetime" || type === "date") && val != '') {
                                    val = val.replace(' ', '/');
                                    var splitedDate = val.split("/");
                                    if (splitedDate[3] != null)
                                        val = new Date(new Number(splitedDate[2]).valueOf(), (new Number(splitedDate[1]).valueOf()) - 1, new Number(splitedDate[0]).valueOf(), 0, 0, 0, 0);
                                    else
                                        val = new Date(new Number(splitedDate[2]).valueOf(), (new Number(splitedDate[1]).valueOf()) - 1, new Number(splitedDate[0]).valueOf(), 0, 0, 0, 0);
                                }
                                log.debug('fldName:' + fldName + ' ' + type, val);
                                if (type === "select" && fldName != 'item' && fldName != 'taxcode')
                                    rec.setCurrentSublistText({
                                        sublistId: "item",
                                        fieldId: fldName,
                                        value: val
                                    });
                                else if (fldName === "item") {
                                    if (item.is_consumption != null && item.is_consumption && mobile_use_outside_il) {

                                     
                                        log.debug('ttttt:' + fldName, val);
                                        rec.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: "item",
                                            value: arrItems.indexOf(val.toLowerCase())
                                        })
                                        rec.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: "taxcode",
                                            value: 70 //vat-y
                                        });
                                    }
                                    else {
                                        rec.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: "item",
                                            value: arrItems.indexOf(val.toLowerCase())
                                        })

                                    }
                                    //val = "MSS Consumption";
                                    //rec.setCurrentSublistValue({
                                    //    sublistId: "item",
                                    //    fieldId: "item",
                                    //    value: arrItems.indexOf(val.toLowerCase())
                                    //})
                                    //if (val == "MSS Consumption")
                                    //    rec.setCurrentSublistValue({
                                    //        sublistId: "item",
                                    //        fieldId: "taxcode",
                                    //        value: 70 //vat-y
                                    //    });
                                }
                                else if (fldName == 'custcol_pivotal_so_number') {
                                    if (val == '1') {

                                        rec.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: fldName,
                                            value: item['custcol_gilat_so_number']
                                        });
                                    }
                                     else if (val == '0') {
                                            rec.setCurrentSublistValue({
                                                sublistId: "item",
                                                fieldId: 'custcol_gilat_so_number',
                                                value: item['custcol_gilat_so_number']
                                            });
                                        }                                   
                                }                              
                                else
                                    rec.setCurrentSublistValue({
                                        sublistId: "item",
                                        fieldId: fldName,
                                        value: val
                                    });
                               
                            }
                            var sublistValue = rec.getCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'taxcode'
                            });
                            if (siteid != -1) {
                                rec.setCurrentSublistValue({
                                    sublistId: "item",
                                    fieldId: 'custcol_site',
                                    value: siteid
                                });
                            }

                            log.debug('sublistValue: ' + sublistValue, rec.getValue('subsidiary'));

                            rec.commitLine({ sublistId: "item" });
                        }
                    }
                }
            rec.setValue('custbody_topic', '');
            var invid = rec.save();
            //if (invid != -1) {
            //    record.submitFields({
            //        type: record.Type.INVOICE,
            //        id: invid,
            //        values: {
            //            'tranid': context.tranid
            //        },
            //        options: {
            //            enableSourcing: false,
            //            ignoreMandatoryFields: true
            //        }
            //    });
            //}


            // now add discount if gross amount != sap gross amount
            try {
                if (rec.getValue('total') != context.docsum && context.docsum != "") {
                    var gap = parseFloat(context.docsum) - parseFloat(rec.getValue('total'));
                    if (gap > 5 || gap < -5) {
                        rec.delete();
                        return JSON.stringify({ "status": "Error", "Details": "Difference in gross amount is bigger then 5. the gap is: " + gap });
                    }

                    rec.selectNewLine({
                        sublistId: "item"
                    });

                    rec.setCurrentSublistValue({
                        sublistId: "item",
                        fieldId: 'item',
                        value: 1951 //rounding item
                    });

                    rec.setCurrentSublistValue({
                        sublistId: "item",
                        fieldId: 'grossamt',
                        value: gap
                    });


                    rec.commitLine({ sublistId: "item" });
                    rec.save();
                }
            }
            catch (e) {
                log.error('Error on discount:', e);
            }

            return JSON.stringify({ "status": "OK", "Id:": rec.id });


            if (filebase64 && invid) {
                //add file as attachment;

                // Save the PDF to File Cabinet
                var pdfFileObj = file.create({
                    name: 'invoice_' + invid + '.pdf',
                    fileType: file.Type.PDF,
                    contents: filebase64,
                    folder: 1587, // <--- change this to your own folder id
                });
                var createdFileId = pdfFileObj.save();

                record.attach({
                    record: {
                        id: createdFileId,
                        type: 'file'
                    },
                    to: {
                        id: invid,
                        type: record.Type.INVOICE
                    }
                });

            }

            //}
            //catch (e) {
            //    log.error('Error:', e);
            //    throw error.create({
            //        name: 'Error',
            //        message: e.message
            //    });
            //}
        }
        return {
            post: post
        };
    });