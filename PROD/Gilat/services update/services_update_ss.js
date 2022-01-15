var rate;
var error;
function t() {

    var context = nlapiGetContext();
    var data_for_quote = context.getSetting('SCRIPT', 'custscript_data');
    rate = context.getSetting('SCRIPT', 'custscript_rate');
    var billing_date = context.getSetting('SCRIPT', 'custscript_date');
    nlapiLogExecution('DEBUG', 'rate ', rate);
    nlapiLogExecution('DEBUG', 'billing_date ', billing_date);
    //nlapiLogExecution('DEBUG', 'data_for_quote ', data_for_quote); 
    var data_for_quote_obj = JSON.parse(data_for_quote);
    nlapiLogExecution('DEBUG', 'data_for_quote_obj ', data_for_quote_obj.length);


    var data_for_quote_final = [];
    if (data_for_quote_obj != null) {
        for (var i = 0; i < data_for_quote_obj.length; i++) {

            var line = i + 1;
            data_for_quote_final.push({    //IB LINE

                quote_customer: data_for_quote_obj[i].quote_customer,
                quote_currency: data_for_quote_obj[i].quote_currency,
                quote_ib_item: data_for_quote_obj[i].quote_ib_item,
                quote_ib_description: data_for_quote_obj[i].quote_ib_description,
                quote_ib_quantity: data_for_quote_obj[i].quote_ib_quantity,
                quote_ib_rate: data_for_quote_obj[i].quote_ib_rate,
                quote_ib_class: data_for_quote_obj[i].quote_ib_class,
                quote_ib_site: data_for_quote_obj[i].quote_ib_site,
                iBId: data_for_quote_obj[i].iBId,
                quote_ib_replace: '',
                quote_ib_action_type: '1',  // Deactivate
                quote_billing_date: billing_date,
                quote_ib_subscription: data_for_quote_obj[i].quote_ib_subscription,


            });

            var item = data_for_quote_obj[i].quote_ib_item;
            var classItem = itemClass(item);
            var qty = data_for_quote_obj[i].quote_ib_quantity;
            var ib_subscription = data_for_quote_obj[i].quote_ib_subscription;


            data_for_quote_final.push({ // new line

                quote_customer: data_for_quote_obj[i].quote_customer,
                quote_currency: data_for_quote_obj[i].quote_currency,
                quote_ib_item: item,
                quote_ib_description: data_for_quote_obj[i].quote_ib_description,
                quote_ib_quantity: qty,
                quote_ib_rate: rate,
                quote_ib_class: classItem,
                quote_ib_site: data_for_quote_obj[i].quote_ib_site,
                quote_ib_replace: data_for_quote_obj[i].iBId,
                iBId: '',
                quote_ib_action_type: '2',  // Activate	 
                quote_billing_date: billing_date,
                quote_ib_subscription: ib_subscription

            });

        }
    }
    if (data_for_quote_final.length > 0) {
        var res = Quote_Generate(data_for_quote_final, 30);
        nlapiLogExecution('DEBUG', 'res ', res);
        if (res != '' && res != null && res != undefined) {
            var employee = nlapiGetContext();
            var employeeId = employee.user;
            var result = res.split(',')
            try {
                var baseURL = 'https://4998343-sb2.app.netsuite.com/app/accounting/transactions/' + result[2] +'.nl?id=';
                var s = '<h2><a style="color:blue;font-size:30px" target="_blank" href=' + baseURL + result[1] + '><b>' + result[0] + '</b></a></h2>';
                nlapiSendEmail(employeeId, employeeId, 'Services Update Screen ',s , null, null, null, null);
               

            } catch (err) {
                
            }
          
        }
        else {        
            nlapiSendEmail(employeeId, employeeId, 'Services Update Screen ', error.toString(), null, null, null, null);
        }
    }
 
}


function Quote_Generate(data_for_quote_final, action) {
    nlapiLogExecution('DEBUG', 'data_for_quote_final ' + data_for_quote_final.length, JSON.stringify(data_for_quote_final));
    nlapiLogExecution('DEBUG', 'action ', action);
    try {
        //var Service_Action = ServiceAction(action)

        //  Upgrade - Quote - 19
        //	Downgrade - Quote - 3
        //	Service Provider Change - Quote - 25
        //	Price Change Quote  - 8
        //	Permanent Disconnection - Sales Order - 7
        //	Temporary Disconnection - Sales Order - 17
        //	Temporary Disconnection – Stop Billing - Sales Order - 18
        //	Reconnect Sales Order - 10
        //	Reconnect – Start Billing Sales Order -11  
        //	BW Change Sales Order - 23
        //	Pipe Quality of Service Change Sales Order - 9

        //Subscription Service Deactivation - Quote - 26
        //	Subscription Service Suspension -27
        //	Subscription Service Unsuspension - 28
        //	Subscription Service Change - 29
        //	Subscription Service Price Change -30


        var rec_type;
        var form = 128;
        // create Quote - start
        if (action == '19' || action == '3' || action == '8' || action == '25'
            || action == '27' || action == '28' || action == '29' || action == '30') {
            rec_type = 'estimate';

        }
        else if (action == '7' || action == '17' || action == '18' || action == '10' || action == '11' || action == '23'
            || action == '9' || action == '26') {
            rec_type = 'salesorder';

        }

        var rec = nlapiCreateRecord(rec_type);
        //Header Fields 
        rec.setFieldValue('entity', data_for_quote_final[0].quote_customer);
        rec.setFieldValue('customform', form);
        rec.setFieldValue('currency', data_for_quote_final[0].quote_currency);
        rec.setFieldValue('custbody_topic', action);
        rec.setFieldValue('custbody_connection_period_in_months', 12);

        if (rec_type == 'salesorder') {
            rec.setFieldValue('orderstatus', 'B');
            rec.setFieldValue('custbody_transaction_approval_status', '2');
        }

        for (var i = 0; i < data_for_quote_final.length; i++) {
            try {
                // lines Fields

                rec.selectNewLineItem('item');
                rec.setCurrentLineItemValue('item', 'item', data_for_quote_final[i].quote_ib_item); // IB: Item
                if (data_for_quote_final[i].quote_ib_action_type == '1') {
                    rec.setCurrentLineItemValue('item', 'description', data_for_quote_final[i].quote_ib_description); //IB: Item Description
                }

                if (rec_type == 'estimate' && action == '30') {
                    rec.setCurrentLineItemValue('item', 'custcol_billing_date', data_for_quote_final[i].quote_billing_date)
                }

                rec.setCurrentLineItemValue('item', 'quantity', data_for_quote_final[i].quote_ib_quantity)
                rec.setCurrentLineItemValue('item', 'rate', data_for_quote_final[i].quote_ib_rate)
                rec.setCurrentLineItemValue('item', 'class', data_for_quote_final[i].quote_ib_class);
                rec.setCurrentLineItemValue('item', 'custcol_site', data_for_quote_final[i].quote_ib_site);
                rec.setCurrentLineItemValue('item', 'custcol_install_base', data_for_quote_final[i].iBId);
                rec.setCurrentLineItemValue('item', 'custcol_replacing_service_id', data_for_quote_final[i].quote_ib_replace);
                rec.setCurrentLineItemValue('item', 'custcol_action_type', data_for_quote_final[i].quote_ib_action_type);
                rec.setCurrentLineItemValue('item', 'custcol_subscription', data_for_quote_final[i].quote_ib_subscription);

                if (data_for_quote_final[i].iBId != '') {

                    var dedicated_uplink_kb = nlapiLookupField('customrecord_ib_service_type', data_for_quote_final[i].iBId, 'custrecord_ib_dedicated_uplink_kb')
                    rec.setCurrentLineItemValue('item', 'custcol_transmit_dedicated', dedicated_uplink_kb);
                    var burst_uplink_kb = nlapiLookupField('customrecord_ib_service_type', data_for_quote_final[i].iBId, 'custrecord_ib_burst_uplink_kb')
                    rec.setCurrentLineItemValue('item', 'custcol_transmit_burst', burst_uplink_kb);
                    var dedicated_downlink_kb = nlapiLookupField('customrecord_ib_service_type', data_for_quote_final[i].iBId, 'custrecord_ib_dedicated_downlink_kb')
                    rec.setCurrentLineItemValue('item', 'custcol_receive_dedicated', dedicated_downlink_kb);
                    var downlink_kb = nlapiLookupField('customrecord_ib_service_type', data_for_quote_final[i].iBId, 'custrecord_ib_burst_downlink_kb')
                    rec.setCurrentLineItemValue('item', 'custcol_receive_burst', downlink_kb);

                }
                rec.commitLineItem('item');
            } catch (err) {
                nlapiLogExecution('DEBUG', 'error Quote_Generate - lines', err);
                error = err;
            }
        }
        // create Quote - end

        var id = nlapiSubmitRecord(rec);
        nlapiLogExecution('debug', 'quote / so', id);
        if (rec_type == 'estimate') {
            var tranid = nlapiLookupField('estimate', id, 'tranid');
            tranid += ',' + id + ',estimate';
        }
        else {
            var tranid = nlapiLookupField('salesorder', id, 'tranid');
            tranid += ',' + id + ',salesorder';;
        }
        return tranid;
    } catch (e) {

        nlapiLogExecution('DEBUG', 'error Quote_Generate ', e);
        error = e;
    }
}

function itemClass(item) {

    var results;

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('class');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', item)

    var search = nlapiCreateSearch('item', filters, columns);
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        for (var i = 0; i < returnSearchResults.length; i++) {
            results = returnSearchResults[i].getValue('class')
        }
        return results;
    }
}