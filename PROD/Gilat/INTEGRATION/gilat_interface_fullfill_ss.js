/**
 *@NApiVersion 2.x
 *@NScriptType scheduledscript
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 NOV 2019  Moshe Barel
 *
 */
define(['N/record', 'N/http', 'N/search', 'N/format', 'N/runtime'],
    function (record, http, search, format, runtime) {
        function execute(scriptContext) {

            var ff = runtime.getCurrentScript().getParameter('custscript_ff_itegration_id');
            log.debug('ff id:', ff);
            try {

                var newRecord = record.load({
                    type: record.Type.ITEM_FULFILLMENT,
                    id: ff,
                });
                var status = newRecord.getValue({ fieldId: 'shipstatus' });
                var ffId = newRecord.getValue("id")
                //var topic = newRecord.getValue({ fieldId: 'custbody_topic' });                 
                var headerObj = {
                    "Content-Type": "application/json",
                }

                var soRecord = record.load({
                    type: record.Type.SALES_ORDER,
                    id: newRecord.getValue("createdfrom"),
                });



                var custRercord = record.load({
                    type: record.Type.CUSTOMER,
                    id: newRecord.getValue("entity"),
                });
                var jsonToSend = [];
                var so_tranid = newRecord.getValue("createdfrom");  //  BasenEtry
                var so_currency = soRecord.getValue({ fieldId: 'currencysymbol' });  //  Currency
                var so_salesrep = soRecord.getValue({ fieldId: 'salesrep' });  //  
                var so_topic = soRecord.getText({ fieldId: 'custbody_topic' });  //  FreeText4
                var lineOfBusinessValue = custRercord.getValue({ fieldId: 'custentity_customer_line_of_business' });
                var so_item_count = soRecord.getLineCount({ sublistId: 'item' });
                var ff_item_count = newRecord.getLineCount({ sublistId: 'item' });
                var FulfillmentNumber = newRecord.getValue({ fieldId: 'tranid' });  //  FulfillmentNumber   
                if (FulfillmentNumber == 'To Be Generated') {
                    var tranId = search.lookupFields({
                        type: search.Type.ITEM_FULFILLMENT,
                        id: ffId,
                        columns: ['tranid']
                    });
                    FulfillmentNumber = tranId.tranid
                }
                if (!isNullOrEmpty(so_salesrep)) {
                    var sap_code = search.lookupFields({
                        type: search.Type.EMPLOYEE,
                        id: so_salesrep,
                        columns: ['custentity_sap_sales_rep_code']
                    });
                    var sap_code_value = sap_code.custentity_sap_sales_rep_code;
                    if (isNullOrEmpty(sap_code_value)) sap_code_value = null;
                }
                else { var sap_code_value = null }

                var CardCode = '', Freetext2 = '', MonthQuantity = '';
                var errorMessagge = '', successMessagge = '';
                var errorExists = false;
                log.debug('ff_item_count:', ff_item_count);
                for (var ffLine = 0; ffLine < ff_item_count; ffLine++) {

                    var ff_item = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'item', line: ffLine });
                    var ff_orderline = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'orderline', line: ffLine });
                    var itemreceive = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'itemreceive', line: ffLine });
                    //log.debug('itemreceive:', itemreceive);
                    if (itemreceive) {
                        for (var soLine = 0; soLine < so_item_count; soLine++) {
                            var so_item = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'item', line: soLine });
                            var so_line = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'line', line: soLine });

                            if (ff_orderline == so_line && ff_item == so_item) {
                                //log.debug('equals:', 'equals');
                                var description = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'description', line: soLine });
                                var itemId = search.lookupFields({
                                    type: search.Type.ITEM,
                                    id: so_item,
                                    columns: ['itemid']
                                });
                                var itemName = itemId.itemid//soRecord.getSublistValue({ sublistId: 'item', fieldId: 'item_display', line: soLine });
                                if (lineOfBusinessValue == '1') { // FSS
                                    var site = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_site', line: soLine });
                                    CardCode = SiteCustomerNumber(site)
                                    var FreeText1 = description;
                                    Freetext2 = Site(site);
                                    MonthQuantity = SiteBillingCycle(site)
                                    var FreeText3 = null;
                                }
                                else if (lineOfBusinessValue == '2') { // MSS
                                    CardCode = custRercord.getValue({ fieldId: 'custentity_legacy_system_number' });
                                    var subscription = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_subscription', line: soLine });
                                    var FreeText1 = SubscriptionFreeText1(subscription);
                                    var status = SubscriptionStatus(subscription)
                                    Freetext2 = status;
                                    var FreeText3 = SubscriptionSecond(subscription)
                                    var custentity_billing_cycle = custRercord.getText({ fieldId: 'custentity_billing_cycle' });
                                    MonthQuantity = translationBillingCycle(custentity_billing_cycle)

                                }
                                var action_type = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_action_type', line: soLine });
                                var quantity = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: ffLine });
                                var qtyCalc = activeType(action_type, quantity)
                                var rate = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: soLine });
                                var price = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_price_list_price', line: soLine });

                                var DiscountPercent = '0';
                                //if (parseFloat(price) != '0' && !isNullOrEmpty(price)) {
                                //     DiscountPercent = (price - rate) / price * 100;                                      
                                //}
                                //if (isNullOrEmpty(DiscountPercent)) { DiscountPercent = '0' }

                                var BillingDate = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_billing_date', line: soLine });
                                if (!isNullOrEmpty(BillingDate)) {
                                    var parsedDateStringAsRawDateObject = format.parse({
                                        value: BillingDate,
                                        type: format.Type.DATE
                                    });
                                }
                                else {
                                    var tranDate = newRecord.getValue("trandate");  //  BasenEtry
                                    //var parsedDateStringAsRawDateObject = new Date();
                                    var parsedDateStringAsRawDateObject = format.parse({
                                        value: tranDate,
                                        type: format.Type.DATE
                                    });
                                }
                                var ChargingMethod = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_charging_method', line: soLine });
                                if (ChargingMethod != '1') { ChargingMethod = '0' };
                                var subscription = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_subscription', line: soLine });
                                var customer_po = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_customer_po', line: soLine });
                                if (!isNullOrEmpty(customer_po)) { var NumAtCard = CustomerPoName(customer_po) }
                                else { var NumAtCard = null }
                                var BaseLineID = soRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_so_line_number', line: soLine });


                                jsonToSend.push({
                                    "BaseEntry": so_tranid,
                                    "CardCode": CardCode,
                                    "ItemCode": itemName,
                                    "ItemDesc": description,
                                    "Quantity": qtyCalc,
                                    "Price": rate,
                                    "DiscountPercent": DiscountPercent,
                                    "Currency": so_currency,
                                    "StartDate": parsedDateStringAsRawDateObject,
                                    "IsOneType": ChargingMethod,
                                    "SlpCode": sap_code_value,
                                    "FreeText1": FreeText1,
                                    "FreeText4": so_topic,
                                    "FreeText3": FreeText3,
                                    "Freetext2": Freetext2,
                                    "MonthQuantity": MonthQuantity,
                                    "NumAtCard": NumAtCard,
                                    "FulfillmentNumber": FulfillmentNumber,
                                    "BaseLineID": BaseLineID,
                                    "FulfillmentInternalNum": ffId,
                                });



                            } //  if (ff_orderline == so_line && ff_item == so_item)                      
                        } //    for (var ffLine = 1; ffLine <= ff_item_count; ffLine++)
                    }
                } // for (var ffLine = 1; ffLine <= ff_item_count; ffLine++)


                //////
                if (jsonToSend.length > 0) {
                    var string = JSON.stringify(jsonToSend);
                    log.debug('jsonToSend data : ', string);
                    try {
                        var url = environment();
                        log.debug('url : ', url);
                        var response = http.request({
                            method: http.Method.POST,
                            url: url,
                            body: string,
                            headers: headerObj
                        });

                        //url: 'http://192.116.143.209:80/WebAPI/api/bill/input', prod

                        log.debug('response  : ', JSON.stringify(response.body));
                        var body = JSON.parse(response.body);
                        if (body.IsSuccess == false) {
                            errorExists = true;
                            errorMessagge += 'error: ' + body.ResponseMessage + '<br>';
                        }
                        else if (body.IsSuccess == true) {
                            successMessagge += 'EntryID: ' + body.Data.EntryID + ' LineID: ' + body.Data.LineID + ' LinesAdded: ' + body.Data.LinesAdded + '<br>';
                        }
                        else { errorExists = true; errorMessagge += 'error: ' + response + '<br>' }
                    } catch (e) {
                        log.debug('ERROR http.request : ', e);
                        errorExists = true;
                        errorMessagge += e.message;
                        record.submitFields({
                            type: record.Type.ITEM_FULFILLMENT,
                            id: ffId,
                            values: {
                                'custbody_error_messages': errorMessagge,
                                'custbody_not_for_billing': true,
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });
                        return;
                    }
                    if (!errorExists) {

                        record.submitFields({
                            type: record.Type.ITEM_FULFILLMENT,
                            id: ffId,
                            values: {
                                'custbody_bd_succeeded': true,
                                'custbody_bd_connection_date': new Date(),
                                'custbody_bd_ref_number': successMessagge,
                                'custbody_error_messages': ''

                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });

                    }
                    else {
                        record.submitFields({
                            type: record.Type.ITEM_FULFILLMENT,
                            id: ffId,
                            values: {
                                'custbody_error_messages': errorMessagge,
                                'custbody_not_for_billing': true,
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });

                    }
                }

            } catch (e) {
                log.error(e.message);
            }


        }

        function activeType(action_type, quantity) {
            //log.debug('activeType', 'activeType' + action_type + ',' + 'quantity' + quantity);
            var res = quantity;
            if (action_type == '2' || action_type == '7' || action_type == '9' || isNullOrEmpty(action_type)) { // 2-Activate , 7-Reactivate, 9-Unsuspend
                res = quantity;
            }
            else if (action_type == '1' || action_type == '6') {  // 1- Deactivate  , 6- Suspend 
                res = quantity * -1;
            }

            return res;
        }
        function SubscriptionFreeText1(subscription) {
            var res = '';
            if (!isNullOrEmpty(subscription)) {

                var data = search.lookupFields({
                    type: 'customrecord_subscription',
                    id: subscription,
                    columns: ['custrecord_id_for_billing']
                });

                res = data.custrecord_id_for_billing;
                //log.debug('res', res);
            }

            return res;
        }
        function SubscriptionSecond(subscription) {
            var res = '';
            if (!isNullOrEmpty(subscription)) {

                var imsi = search.lookupFields({
                    type: 'customrecord_subscription',
                    id: subscription,
                    columns: ['custrecord_subs_voice_phone_number']
                });

                res = imsi.custrecord_subs_voice_phone_number;

            }

            return res;
        }
        function Site(site) {
            //log.debug('site', site )
            var res = '';
            if (!isNullOrEmpty(site)) {

                var fields = search.lookupFields({
                    type: 'customrecord_site',
                    id: site,
                    columns: ['altname', 'custrecord_site_status']
                });
                //log.debug('fields', fields)
                var altname = fields.altname;
                if (fields.custrecord_site_status.length > 0)
                    var status = fields.custrecord_site_status[0].text;
                else status = '';
                res = altname + ' ' + status;
            }

            return res;
        }
        function SiteBillingCycle(site) {
            var res = '';
            if (!isNullOrEmpty(site)) {

                var fields = search.lookupFields({
                    type: 'customrecord_site',
                    id: site,
                    columns: ['custrecord_billing_cycle']
                });
                if (fields.custrecord_billing_cycle.length > 0) {
                    var billing_cycle = fields.custrecord_billing_cycle[0].text;
                    res = translationBillingCycle(billing_cycle);
                }
                else res = '';
            }

            return res;
        }
        function SiteCustomerNumber(site) {
            var res = '';
            if (!isNullOrEmpty(site)) {

                var fields = search.lookupFields({
                    type: 'customrecord_site',
                    id: site,
                    columns: ['custrecord_site_sap_customer_number']
                });
                res = fields.custrecord_site_sap_customer_number;

            }

            return res;
        }
        function translationBillingCycle(billing_cycle) {
            var res = '';
            if (billing_cycle == 'Monthly') {
                res = '1'
            }
            else if (billing_cycle == 'Quarterly') {
                res = '3'
            }
            else if (billing_cycle == 'Semiannual') {
                res = '6'
            }
            else if (billing_cycle == 'Annual') {
                res = '12'
            }
            return res;

        }
        function SubscriptionStatus(subscription) {

            var res = '';
            if (!isNullOrEmpty(subscription)) {

                var result = search.lookupFields({
                    type: 'customrecord_subscription',
                    id: subscription,
                    columns: ['custrecord_subs_activation_status', 'custrecord_subs_operator', 'altname']
                });
                if (result.custrecord_subs_activation_status.length > 0) {
                    var status = result.custrecord_subs_activation_status[0].text;
                }
                else var status = '';

                if (result.custrecord_subs_operator.length > 0) {

                    var operator = result.custrecord_subs_operator[0].text;
                }
                else var operator = '';
                var name = result.altname;

                //if (!isNullOrEmpty(act_status)) {
                //    var status_text = search.lookupFields({
                //        type: 'customlist351',
                //        id: act_status,
                //        columns: ['name']
                //    });

                res = operator + ' ' + name + ' ' + status;

            }
            return res;
        }
        function CustomerPoName(customer_po) {

            var res = '';
            var result = search.lookupFields({
                type: 'customrecord_custom_po',
                id: customer_po,
                columns: ['altname']
            });

            var name = result.altname;
            res = name;
            return res;

        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function environment() {
            var url;
            //nlapiLogExecution('audit', 'nlapiGetContext().getEnvironment():', nlapiGetContext().getEnvironment());
            //log.debug('runtime.EnvType ', runtime.EnvType);
            var CurrEnvironment = runtime.envType;
            //log.debug('CurrEnvironment', CurrEnvironment);
            if (CurrEnvironment == 'PRODUCTION') {              
                url = "http://192.116.79.26:80/WebAPI/api/bill/input";
            }
            else url = "http://81.199.108.27:80/WebAPI/api/bill/input";

            return url;
        }
        return {
            execute: execute
        };
    });
