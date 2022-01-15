var SO_rec;
var context = nlapiGetContext();
var obj_for_bi = [];

function createIb_SS() {
       
    var fulfillment = context.getSetting('SCRIPT', 'custscript_obj_for_bi');
    nlapiLogExecution('debug', 'fulfillment id:  ', fulfillment)
    var rec = nlapiLoadRecord('itemfulfillment', fulfillment);
    var customer = rec.getFieldValue('entity');
    var createdfrom = rec.getFieldValue('createdfrom');
    try { SO_rec = nlapiLoadRecord('salesorder', createdfrom); } catch (e) { SO_rec = null }
    if (SO_rec != null && SO_rec != undefined) {
        //try { nlapiScheduleScript('customscript_update_subscription_ss', 'customdeploy_update_subscription_ss_dep', { custscript_fulfillment_id: nlapiGetRecordId() }) } catch (e) { }
        var SO_itemCount = SO_rec.getLineItemCount('item');
        var createIB = false;
        var itemCount = rec.getLineItemCount('item');
        if (itemCount > 0) {
            for (var i = 1; i <= itemCount; i++) {

                if (context.getRemainingUsage() < 150) {
                    nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                    if (state.status == 'FAILURE') {
                        nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                    }
                    else if (state.status == 'RESUME') {
                        nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                    }
                }

                nlapiLogExecution('debug', 'i ', i)
                var not_create = true;
                var item = rec.getLineItemValue('item', 'item', i);
                var line = rec.getLineItemValue('item', 'custcol_so_line_numberdisp', i);
                for (var j = 1; j <= SO_itemCount; j++) {
                    var S0_line = SO_rec.getLineItemValue('item', 'line', j);
                    var S0_item = SO_rec.getLineItemValue('item', 'item', j);
                    if (item == S0_item && S0_line == line) {
                        //nlapiLogExecution('debug', 'item == S0_item ', item == S0_item)
                        var install_base = SO_rec.getLineItemValue('item', 'custcol_install_base', j);
                        //var action_type = SO_rec.getLineItemValue('item', 'custcol_action_type', j);
                        var install_base_so = '';
                        if (install_base != '' && install_base != null) {
                            var install_base_so = nlapiLookupField('customrecord_ib_service_type', install_base, 'custrecord_ib_source_so');
                        }
                        var subrecord = '';
                        subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);           
                        if (install_base != '' && install_base != null && install_base_so != createdfrom) {  // line from services update screen
                            not_create = false;
                            var Transmit_Dedicated = SO_rec.getLineItemValue('item', 'custcol_transmit_dedicated', j);
                            var Transmit_Burst = SO_rec.getLineItemValue('item', 'custcol_transmit_burst', j);
                            var Receive_Dedicated = SO_rec.getLineItemValue('item', 'custcol_receive_dedicated', j);
                            var Receive_Burst = SO_rec.getLineItemValue('item', 'custcol_receive_burst', j);
                            var billing_date = SO_rec.getLineItemValue('item', 'custcol_billing_date', j);
                            var rate = SO_rec.getLineItemValue('item', 'rate', j);
                            var quantity = SO_rec.getLineItemValue('item', 'quantity', j);
                            var So_type = SO_rec.getFieldValue('custbody_topic');
                            var siteId = SO_rec.getLineItemValue('item', 'custcol_site', j);
                            var subscription = SO_rec.getLineItemValue('item', 'custcol_subscription', j);
                            updateIb(install_base, So_type, billing_date, rate, quantity, Transmit_Dedicated, Transmit_Burst, Receive_Dedicated, Receive_Burst, siteId, subscription);
                        } //    if (install_base != '' && action_type == '1')
                        else if (install_base != '' && install_base != null && install_base_so == createdfrom && (subrecord == '' || subrecord == null || subrecord == undefined)) {
                            createIB = false;
                            //var currQty = rec.getLineItemValue('item', 'quantity', i);
                            // updateQtyIb(install_base, currQty );
                            var update = false;
                            var fullfi_list = nlapiLookupField('customrecord_ib_service_type', install_base, 'custrecord_ib_fulfillment_list');
                            var fullfi_list_split = fullfi_list.split(',');
                            for (var m = 0; m < fullfi_list_split.length; m++) {
                                if (fullfi_list_split[m] == fulfillment) {
                                    update = false;
                                }
                                else { update = true; }
                            }
                            nlapiLogExecution('debug', 'update updateQtyIb()', update)
                            if (update) {
                                fullfi_list_split.push(fulfillment)
                                var currQty = rec.getLineItemValue('item', 'quantity', i);
                                updateQtyIb(install_base, currQty, fullfi_list_split );
                            }                                                                                    
                        }
                        else {
                            createIB = true;
                        }
                        nlapiLogExecution('debug', 'not_create', not_create)
                        nlapiLogExecution('debug', 'createIB', createIB)
                        if (createIB && not_create) {
                            var itemType_text = SO_rec.getLineItemValue('item', 'itemtype', j);
                            var itemType = item_type_value(itemType_text);                 
                            var is_service = nlapiLookupField('item', item, 'custitem_is_service')
                            nlapiLogExecution('debug', 'is_service ', is_service)
                            var siteId = SO_rec.getLineItemValue('item', 'custcol_site', j);
                            if (siteId == null || siteId == undefined) { siteId = ''; }
                            var description = SO_rec.getLineItemValue('item', 'description', j);
                            var itemClass = SO_rec.getLineItemValue('item', 'class', j);
                            var quantity = rec.getLineItemValue('item', 'quantity', i);
                            var rate = SO_rec.getLineItemValue('item', 'rate', j);
                            var currency = SO_rec.getFieldValue('currency');
                            var charging_method = SO_rec.getLineItemValue('item', 'custcol_charging_method', j);
                            var customer_po = SO_rec.getLineItemValue('item', 'custcol_customer_po', j);
                            var profit = SO_rec.getFieldValue('custbody_profit_margin_percentage');

                            if (is_service == 'T') {
                                var billing_date = SO_rec.getLineItemValue('item', 'custcol_billing_date', j);
                                nlapiLogExecution('debug', 'billing_date()', billing_date)
                            }
                            else { var billing_date = ''; }

                            var service_period = SO_rec.getLineItemValue('item', 'custcol_service_period', j);

                            if (is_service == 'T') {
                                var service_auto_renewal = SO_rec.getLineItemValue('item', 'custcol_service_auto_renewal', j);
                                nlapiLogExecution('debug', 'service_auto_renewal()', service_auto_renewal)
                                var serviceStatus = '1';
                            }
                            else { var service_auto_renewal = ''; var serviceStatus = ''; }
                            if (So_type == '27') { serviceStatus = '3' } // Suspended =>  add on 20.7.20
                            var subscription = SO_rec.getLineItemValue('item', 'custcol_subscription', j);
                            var Transmit_Dedicated = SO_rec.getLineItemValue('item', 'custcol_transmit_dedicated', j);
                            var Transmit_Burst = SO_rec.getLineItemValue('item', 'custcol_transmit_burst', j);
                            var Receive_Dedicated = SO_rec.getLineItemValue('item', 'custcol_receive_dedicated', j);


                            var Receive_Burst = SO_rec.getLineItemValue('item', 'custcol_receive_burst', j);


                            var serviceEndDate;
                            if (billing_date != null && billing_date != '' && service_period != null && service_period != '') {
                                var billing_date_obj = nlapiStringToDate(billing_date)
                                serviceEndDate = nlapiAddMonths(billing_date_obj, service_period);
                                serviceEndDate = nlapiDateToString(serviceEndDate)

                            }
                            else serviceEndDate = '';

                            var subrecord = '';
                            subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
                            if (subrecord != "" && subrecord != null) {
                                nlapiLogExecution('debug', 'subrecord()', subrecord.id)
                                var invDetailID = subrecord.id;
                                if (invDetailID != "" && invDetailID != null) {
                                    serials = "";
                                    serials = getInventoryDetails(invDetailID);
                                    if (serials != "" && serials != null) {
                                        var serialCount = serials.split(',');
                                        nlapiLogExecution('debug', 'serialCount length()', serialCount.length)
                                        for (var m = 0; m < serialCount.length; m++) {
                                            if (serialCount[m] != '') {
                                                obj_for_bi.push({         /// for serial items

                                                    bi_customer: customer,
                                                    bi_site: siteId,
                                                    bi_subscription: subscription,
                                                    bi_item: item,
                                                    bi_description: description,
                                                    bi_itemType: itemType,
                                                    bi_isService: is_service,
                                                    bi_serialNumber: serialCount[m],
                                                    bi_class: itemClass,
                                                    bi_quantity: '1',
                                                    bi_rate: rate,
                                                    bi_origTrxCurrency: currency,
                                                    bi_chargingMethod: charging_method,
                                                    bi_customerPo: customer_po, 
                                                    bi_effectiveStartBillingDate: billing_date,
                                                    bi_effectiveEndBillingDate: '',
                                                    bi_serviceStatus: serviceStatus,
                                                    bi_activationDate: billing_date,
                                                    bi_deactivationDate: '',
                                                    bi_suspensionDate: '',
                                                    bi_servicePeriod: service_period,
                                                    bi_serviceEndDate: serviceEndDate,
                                                    bi_serviceAutoRenewal: service_auto_renewal,
                                                    bi_dedicatedUplink: Transmit_Dedicated,
                                                    bi_burstUplink: Transmit_Burst,
                                                    bi_dedicateDownlink: Receive_Dedicated,
                                                    bi_burstDownlink: Receive_Burst,
                                                    bi_sourceSalesOrder: createdfrom,
                                                    bi_sourceSalesOrderLine: j,
                                                    custrecord_ib_fulfillment_list: fulfillment,
                                                    profit: profit,
                                                    
                                                });
                                            }

                                        }
                                    }
                                }
                            }
                            else {
                                //nlapiLogExecution('debug', 'test()', 'test')
                                obj_for_bi.push({

                                    bi_customer: customer,
                                    bi_site: siteId,
                                    bi_subscription: subscription,
                                    bi_item: item,
                                    bi_description: description,
                                    bi_itemType: itemType,
                                    bi_isService: is_service,
                                    bi_serialNumber: '',
                                    bi_class: itemClass,
                                    bi_quantity: quantity,
                                    bi_rate: rate,
                                    bi_origTrxCurrency: currency,
                                    bi_chargingMethod: charging_method,
                                    bi_customerPo: customer_po,
                                    bi_effectiveStartBillingDate: billing_date,
                                    bi_effectiveEndBillingDate: '',
                                    bi_serviceStatus: serviceStatus,
                                    bi_activationDate: billing_date,
                                    bi_deactivationDate: '',
                                    bi_suspensionDate: '',
                                    bi_servicePeriod: service_period,
                                    bi_serviceEndDate: serviceEndDate,
                                    bi_serviceAutoRenewal: service_auto_renewal,
                                    bi_dedicatedUplink: Transmit_Dedicated,
                                    bi_burstUplink: Transmit_Burst,
                                    bi_dedicateDownlink: Receive_Dedicated,
                                    bi_burstDownlink: Receive_Burst,
                                    bi_sourceSalesOrder: createdfrom,
                                    bi_sourceSalesOrderLine: j,
                                    custrecord_ib_fulfillment_list: fulfillment,
                                    profit: profit,                                    
                                });

                            }

                        } // if (createIB) - end

                    }// if item equals




                } // foor itemCount - end
            }

        } // if (itemCount > 0) - end

        nlapiLogExecution('debug', ' obj_for_bi', JSON.stringify(obj_for_bi));
        //
        if (obj_for_bi.length > 0) {
            //try { nlapiScheduleScript('customscript_create_install_base_ss', 'customdeploy_create_install_base_ss_dep', { custscript_obj_for_bi: JSON.stringify(obj_for_bi) }) } catch (e) { }
            createIb(obj_for_bi);
        }

    }//   if (SO_rec != null && SO_rec != undefined) - end
      
}

///////////////


function getInventoryDetails(invDetailID) {
    var serials = "";
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));

    count = 0;
    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    if (results != null) {
        results.forEach(function (line) {
            var inventname = line.getValue('inventorynumber', 'inventorynumber');

            serials += inventname + ",";
            count++;
        });
    }
    nlapiLogExecution('debug', ' serials serials', serials);
    return serials;
}

function createIb(obj_for_bi) {
    try {
        nlapiLogExecution('debug', ' obj_for_bi length', obj_for_bi.length);
        for (var i = 0; i < obj_for_bi.length; i++) {

            if (context.getRemainingUsage() < 150) {
                nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }

            var BI_rec = nlapiCreateRecord('customrecord_ib_service_type');

            BI_rec.setFieldValue('custrecord_ib_customer', obj_for_bi[i].bi_customer); // 2.Customer
            BI_rec.setFieldValue('custrecord_ib_site', obj_for_bi[i].bi_site); // 3.Site
            BI_rec.setFieldValue('custrecord_ib_subscription', obj_for_bi[i].bi_subscription); // 4.Subscription
            BI_rec.setFieldValue('custrecord_ib_item', obj_for_bi[i].bi_item); // 5.Item
            BI_rec.setFieldValue('custrecord_ib_item_description', obj_for_bi[i].bi_description); // 6.Description
            BI_rec.setFieldValue('custrecord_ib_item_type', obj_for_bi[i].bi_itemType); // 7.Item Type
            BI_rec.setFieldValue('custrecord_ib_is_service', obj_for_bi[i].bi_isService); // 8.Is Service
            BI_rec.setFieldValue('custrecord_ib_serial_number', obj_for_bi[i].bi_serialNumber); // 9.Serial Number
            BI_rec.setFieldValue('custrecord_ib_class', obj_for_bi[i].bi_class); // 10.Class
            BI_rec.setFieldValue('custrecord_ib_quantity', obj_for_bi[i].bi_quantity); // 11.Quantity
            BI_rec.setFieldValue('custrecord_ib_rate', obj_for_bi[i].bi_rate); // 12.Rate
            BI_rec.setFieldValue('custrecord_ib_orig_trx_currency', obj_for_bi[i].bi_origTrxCurrency); // 13.Orig Trx Currency
            BI_rec.setFieldValue('custrecord_ib_charging_method', obj_for_bi[i].bi_chargingMethod); // 14.Charging Method
            BI_rec.setFieldValue('custrecord_ib_customer_po', obj_for_bi[i].bi_customerPo); // 15.Customer PO
            BI_rec.setFieldValue('custrecord_ib_start_billing_date', obj_for_bi[i].bi_effectiveStartBillingDate); // 16.Effective Start Billing Date
            BI_rec.setFieldValue('custrecord_ib_end_billing_date', obj_for_bi[i].bi_effectiveEndBillingDate); // 17.Effective End Billing Date
            BI_rec.setFieldValue('custrecord_ib_service_status', obj_for_bi[i].bi_serviceStatus); // 18.Service Status
            BI_rec.setFieldValue('custrecord_ib_activation_date', obj_for_bi[i].bi_activationDate); // 19.Activation Date
            BI_rec.setFieldValue('custrecord_ib_deactivation_date', obj_for_bi[i].bi_deactivationDate); // 20.Deactivation Date
            BI_rec.setFieldValue('custrecord_ib_suspension_date', obj_for_bi[i].bi_suspensionDate); // 21.Suspension Date
            BI_rec.setFieldValue('custrecord_ib_service_period', obj_for_bi[i].bi_servicePeriod); // 22.Service Period(months)
            BI_rec.setFieldValue('custrecord_ib_service_end_date', obj_for_bi[i].bi_serviceEndDate); // 23.Service End Date
            BI_rec.setFieldValue('custrecord_ib_service_auto_renewal', obj_for_bi[i].bi_serviceAutoRenewal); // 24.Service Auto Renewal
            BI_rec.setFieldValue('custrecord_ib_dedicated_uplink_kb', obj_for_bi[i].bi_dedicatedUplink); // 25.Dedicated Uplink(KB)
            BI_rec.setFieldValue('custrecord_ib_burst_uplink_kb', obj_for_bi[i].bi_burstUplink); //  26.Burst Uplink(KB)
            BI_rec.setFieldValue('custrecord_ib_dedicated_downlink_kb', obj_for_bi[i].bi_dedicateDownlink); //27.Dedicate Downlink(KB)
            BI_rec.setFieldValue('custrecord_ib_burst_downlink_kb', obj_for_bi[i].bi_burstDownlink); // 28.Burst Downlink(KB)
            BI_rec.setFieldValue('custrecord_ib_source_so', obj_for_bi[i].bi_sourceSalesOrder); // 29.Source Sales Order
            BI_rec.setFieldValue('custrecord_ib_source_so_line', obj_for_bi[i].bi_sourceSalesOrderLine); // 30.Source Sales Order Line
            BI_rec.setFieldValue('custrecord_ib_fulfillment_list', obj_for_bi[i].custrecord_ib_fulfillment_list); // 
            BI_rec.setFieldValue('custrecord_profit_margin_percentage', obj_for_bi[i].profit); 
            

            var id = nlapiSubmitRecord(BI_rec);

            if (obj_for_bi[i].bi_serviceStatus == 1 && obj_for_bi[i].bi_site != '' && obj_for_bi[i].bi_site != null) {
                nlapiSubmitField('customrecord_site', obj_for_bi[i].bi_site, 'custrecord_site_status', 1) //  Active

            }


            if (id != -1) {
                SO_rec.setLineItemValue('item', 'custcol_install_base', obj_for_bi[i].bi_sourceSalesOrderLine, id) //ENTER INSTALL BASE ID TO SO LINE ITEM
                if (!isNullOrEmpty(obj_for_bi[i].bi_serviceStatus) && !isNullOrEmpty(obj_for_bi[i].bi_subscription)) {
                    updateSubscription(obj_for_bi[i].bi_serviceStatus, obj_for_bi[i].bi_subscription)
                }
            }
            nlapiLogExecution('debug', ' id', id);
        }
        try { nlapiSubmitRecord(SO_rec) } catch (e) { nlapiLogExecution('ERROR', 'nlapiSubmitRecord(SO_rec) : ', e);}
        
    } catch (e) {
        nlapiLogExecution('ERROR', 'error createIb - obj_for_bi :' + obj_for_bi[i], e);
    }

}

//serachIb('261', '5352', '1','3393','1')
function serachIb(item, createdfrom, line, customer, site) {

    var filtersInvoice = new Array();
    filtersInvoice[0] = new nlobjSearchFilter('custrecord_ib_item', null, 'anyof', item);
    filtersInvoice[1] = new nlobjSearchFilter('custrecord_ib_source_so', null, 'anyof', createdfrom);
    filtersInvoice[2] = new nlobjSearchFilter('custrecord_ib_source_so_line', null, 'is', line);
    filtersInvoice[3] = new nlobjSearchFilter('custrecord_ib_customer', null, 'anyof', customer);
    //filtersInvoice[4] = new nlobjSearchFilter('custrecord_ib_site', null, 'anyof', site);



    var search = nlapiCreateSearch('customrecord_ib_service_type', filtersInvoice, null);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    do {

        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    try { if (s.length > 0) return s[0].id }
    catch (e) {
        return 0;
    }


}

function updateIb(install_base, So_type, billing_date, rate, quantity, Transmit_Dedicated, Transmit_Burst, Receive_Dedicated, Receive_Burst, siteId, subscription) {

    //SERVICE STATUS -> custrecord_ib_service_status
    //Active => 1
    //Deactivated => 2
    //Suspended => 3

    //SO Type(Topic)  
    // Upgrade => 19
    // Downgrade => 3
    // Service Provider Change =>
    // Permanent Disconnection => 7
    // Temporary Disconnection => 17
    // Temporary Disconnection - Stop Billing => 18
    // Re-connection => 10
    // Reconnection - Start Billing => 11
    // Price Change => 8
    // BW Change => 23
    // Pipe QOS Change => 9
    nlapiLogExecution('debug', 'updateIb So_type:' + So_type, 'install_base:' + install_base);
    var status = '';

    if (So_type == '19' || So_type == '3' || So_type == '7' || So_type == '25'
        || So_type == '26' || So_type =='27' || So_type == '28'  || So_type == '29' || So_type == '30') {

        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_service_status', 2) //Service Status = 'Deactivated'
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_deactivation_date', billing_date)  //Deactivation Date = SO Line: Billing Date
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_end_billing_date', billing_date)  //Effective End Billing Date = SO Line: Billing Date
        status = '2';
    }
    else if (So_type == '17') { // Temporary Disconnection

        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_service_status', 3)//Service Status = ' Suspended'
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_suspension_date', billing_date) //Deactivation Date = SO Line: Billing Date
        status = '3';


    }
    else if (So_type == '18') { //Temporary Disconnection => Stop Billing

        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_service_status', 3) //Service Status = 'Suspended'
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_suspension_date', billing_date)  //Deactivation Date = SO Line: Billing Date
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_end_billing_date', billing_date)  //Effective End Billing Date = SO Line: Billing Date
        status = '3';
    }
    else if (So_type == '11') { //Reconnection - Start Billing

        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_service_status', 1) // Service Status = 'Active'
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_suspension_date', '')  // Suspension Date = Null
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_activation_date', billing_date)  //Activation Date = SO Line: Billing Date
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_start_billing_date', billing_date)  // Effective Start Billing Date = SO Line: Billing Date
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_end_billing_date', '')  //Effective End Billing Date = Null
        status = '1';
    }
    else if (So_type == '10') { //Reconnection 

        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_service_status', 1) // Service Status = 'Active'
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_suspension_date', '')  //  Suspension Date = Null
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_activation_date', billing_date)  //Activation Date = SO Line: Billing Date
        status = '1';
    }
    else if (So_type == '8') { //Price Change

        // add in 2.4.20
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_service_status', 2) // Service Status = 'Deactivated'
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_deactivation_date', billing_date)  //Deactivation Date = SO Line: Billing Date
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_end_billing_date', billing_date)  //Effective End Billing Date = SO Line: Billing Date
        // add in 2.4.20

        //nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_rate', rate) // Rate = SO Line: Rate
        //nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_start_billing_date', billing_date)  // Effective Start Billing Date = SO Line: Billing Date

    }
    else if (So_type == '23') { //BW Change

        // add in 2.4.20
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_service_status', 2) // Service Status = 'Deactivated'
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_deactivation_date', billing_date)  //Deactivation Date = SO Line: Billing Date
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_end_billing_date', billing_date)  //Effective End Billing Date = SO Line: Billing Date
        // add in 2.4.20        
    }
    else if (So_type == '9') { //Pipe QOS Change
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_dedicated_uplink_kb', Transmit_Dedicated)  // Dedicated Uplink = SO Line: Dedicated Uplink
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_burst_uplink_kb', Transmit_Burst)     //  Burst Uplink = SO Line: Burst Uplink
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_dedicated_downlink_kb', Receive_Dedicated)  // Dedicated Downlink = SO Line: Dedicated Downlink
        nlapiSubmitField('customrecord_ib_service_type', install_base, 'custrecord_ib_burst_downlink_kb', Receive_Burst)  // Burst Downlink = SO Line: Burst Downlink
    }
  
    if (siteId != '' && siteId != null && siteId != undefined) {
        updateSite(siteId, So_type)
    }


    if (subscription != '' && subscription != null && subscription != undefined && status != '') {
        updateSubscription(status, subscription)
   
    }
}

function updateQtyIb(ifExists, currQty, fulfillment) {
    try {
        nlapiLogExecution('debug', 'updateQtyIb', 'install_base:' + ifExists);
        var Qty = parseFloat(nlapiLookupField('customrecord_ib_service_type', ifExists, 'custrecord_ib_quantity'))
        var newQty = Qty + parseFloat(currQty);
        nlapiSubmitField('customrecord_ib_service_type', ifExists, 'custrecord_ib_quantity', newQty);
        nlapiSubmitField('customrecord_ib_service_type', ifExists, 'custrecord_ib_fulfillment_list', fulfillment);
        


    } catch (e) {

        nlapiLogExecution('debug', ' error', e);
    }

}

function item_type_value(itemType_text) {
    var res;
    if (itemType_text == 'InvtPart') {
        res = 1;
    }
    else if (itemType_text == 'NonInvtPart') {
        res = 2;

    }
    else if (type == 'Service') {
        res = 3;
    }
    else if (type == 'Other Charge') {
        res = 4;
    }
    else if (type == 'Assembly') {
        res = 5;
    }
    else if (type == 'Kit') {
        res = 6;
    }
    else if (type == 'Item Group') {
        res = 7;
    }
    else if (type == 'Discount') {
        res = 8;
    }
    else if (type == 'Markup') {
        res = 9;
    }




    return res;
}

function getType(type) {
    //nlapiLogExecution('debug', 'getType()', type)
    var serialized = 'serializedinventoryitem';
    var notSerialized = 'inventoryitem';

    var res = '';
    if (type == 'Yes') {
        res = serialized;
    }
    if (type == '' || type == 'No') {

        res = notSerialized;
    }
    if (type == 'NonInvtPart') {
        res = 'noninventoryitem';
    }
    if (type == 'Assembly') {
        res = 'serializedassemblyitem';
    }
    if (type == 'Kit') {
        res = 'kititem';
    }
    return res;

}

function updateSite(site, action) {

    var status = nlapiLookupField('customrecord_site', site, 'custrecord_site_status');

    if (action == '17' && status != 2) { // Temporary Disconnection
        nlapiSubmitField('customrecord_site', site, 'custrecord_site_status', 2)  // Temporary Disconnection
    }
    else if (action == '18' && status != 3) { // Temporary Disconnection - Stop Billing
        nlapiSubmitField('customrecord_site', site, 'custrecord_site_status', 4) // Temporary Disconnection - Stop Billing
    }

    else if (action == '10' || action == '11' && status != 1) {
        nlapiSubmitField('customrecord_site', site, 'custrecord_site_status', 1)
    }
    else if (action == '7' && status != 3) {
        var res = serachIbToUpdateSite(site);
        if (!res) {
            nlapiSubmitField('customrecord_site', site, 'custrecord_site_status', 3) // Not Active
        }
    }

}

function serachIbToUpdateSite(site) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ib_is_service', null, 'is', 'T');
    filters[1] = new nlobjSearchFilter('custrecord_ib_site', null, 'anyof', site);
    filters[2] = new nlobjSearchFilter('custrecord_ib_service_status', null, 'noneof', '2');


    var search = nlapiCreateSearch('customrecord_ib_service_type', filters, null);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    do {

        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    //nlapiLogExecution('debug', ' s.length', s.length);
    try {
        if (s.length > 0) { return true; }
        else { return false; }
    }
    catch (e) {
        return false;
    }


}

function updateSubscription(status, subscription) {
    nlapiLogExecution('debug', ' updateSubscription: ' + subscription, 'status: ' + status);
    if (status == '1') { // Activate
        var status = nlapiLookupField('customrecord_subscription', subscription, 'custrecord_subs_activation_status');  //subscription status 
        if (status != '2') { // Active
            nlapiSubmitField('customrecord_subscription', subscription, 'custrecord_subs_activation_status', '2');
        }
    }
    else if (status == '2') {   // Deactivated
        // check if all IB are  Deactivated
        if (!serachIbToUpdateSubscription(subscription, '2')) {
            nlapiSubmitField('customrecord_subscription', subscription, 'custrecord_subs_activation_status', '3'); // Deactivated
        }
    }
    else if (status == '3') {   // Suspended 
        // check if all IB are  Suspended
        if (!serachIbToUpdateSubscription(subscription, '3')) {
            nlapiSubmitField('customrecord_subscription', subscription, 'custrecord_subs_activation_status', '4'); // Suspended
        }
    }

}

function serachIbToUpdateSubscription(subscription, status) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ib_is_service', null, 'is', 'T');
    filters[1] = new nlobjSearchFilter('custrecord_ib_subscription', null, 'anyof', subscription);
   
    if (status == '3') {
        filters[2] = new nlobjSearchFilter('custrecord_ib_service_status', null, 'noneof', [status ,'2']);
        filters[3] = new nlobjSearchFilter('custrecord_ib_item', null, 'noneof', 4456);

    }
    else {
        filters[2] = new nlobjSearchFilter('custrecord_ib_service_status', null, 'noneof', status);
    }


    var search = nlapiCreateSearch('customrecord_ib_service_type', filters, null);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    do {

        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    //nlapiLogExecution('debug', ' s.length', s.length);
    try {
        if (s.length > 0) { return true; }
        else { return false; }
    }
    catch (e) {
        return false;
    }


}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
