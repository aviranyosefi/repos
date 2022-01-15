var context = nlapiGetContext().getExecutionContext();
if (context == 'suitelet') {
    var today = new Date();
    var isCheck = false;
    var generic_isCheck = false;

    var customer = nlapiGetFieldValue('entity')

    var customer_price_list = nlapiLookupField('customer', customer, 'custentity_customer_price_list');
    var customer_pl_approval = nlapiLookupField('customer', customer, 'custentity_customer_pl_approval');

    var currency = nlapiGetFieldValue('currency');
    var trandate = nlapiGetFieldValue('trandate');

    var exechange = nlapiExchangeRate('USD', currency, trandate);
    nlapiLogExecution('debug', 'exechange()', exechange)

    if (customer_price_list != '' && customer_price_list != undefined && customer_price_list != null && customer_pl_approval == 'T') {
        var customer_price_list_text = nlapiLookupField('customer', customer, 'custentity_customer_price_list', true);

        if (customer_price_list_text != '' && customer_price_list_text != null) { var customer_price_list_name = customer_price_list_text.split('#')[1]; }
        else { var customer_price_list_name = ''; }

        var pl_currency = nlapiLookupField('customtransaction_price_list', customer_price_list, 'currency');
        var pl_exechange = nlapiExchangeRate(pl_currency, currency, trandate);
        var plRec = nlapiLoadRecord('customtransaction_price_list', customer_price_list);
        var plRec_items = plRec.getLineItemCount('line');
        var plRec_status = plRec.getFieldValue('transtatus');
        if (plRec_status != 'D') { isCheck = true; }

    }
    var customer_generic_price_list = nlapiLookupField('customer', customer, 'custentity_generic_price_list');
    var generic_pl_approval = nlapiLookupField('customer', customer, 'custentity_generic_pl_approval');

    if (customer_generic_price_list != '' && customer_generic_price_list != undefined && customer_generic_price_list != null && generic_pl_approval == 'T') {

        var customer_generic_price_list_text = nlapiLookupField('customer', customer, 'custentity_generic_price_list', true);
        if (customer_generic_price_list_text != '' && customer_generic_price_list_text != null) { var customer_generic_price_list_name = customer_generic_price_list_text.split('#')[1]; }
        else { var customer_generic_price_list_name = ''; }

        var generic_pl_currency = nlapiLookupField('customtransaction_price_list', customer_generic_price_list, 'currency');
        var generic_pl_exechange = nlapiExchangeRate(generic_pl_currency, currency, trandate);
        var generic_plRec = nlapiLoadRecord('customtransaction_price_list', customer_generic_price_list);
        var generic_plRec_items = generic_plRec.getLineItemCount('line');
        var generic_status = generic_plRec.getFieldValue('transtatus');
        if (generic_status != 'D') { generic_isCheck = true; }

    }
}





var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId())
var line;
var price_for_rate;

function Price_list_to_quote() {
   
    nlapiLogExecution('debug', 'nlapiGetContext().getExecutionContext(): ' + context, 'id: ' + nlapiGetRecordId())

    if (context == 'suitelet') {

        try {
            var custbody_topic = rec.getFieldValue('custbody_topic')
            var itemsCount = rec.getLineItemCount('item');
            nlapiLogExecution('debug', 'itemsCount', itemsCount)
            nlapiLogExecution('debug', 'isCheck', isCheck)
            nlapiLogExecution('debug', 'generic_isCheck', generic_isCheck)

            if (itemsCount > 0) {
                for (var i = 1; i <= itemsCount; i++) {
                    line = i
                    var item = rec.getLineItemValue('item', 'item', i);
                    var replacing_service_id = rec.getLineItemValue('item', 'custcol_replacing_service_id', i);
                    ///
                    if (isCheck) {
                        get_individual_price(item)
                    }
                    else if (generic_isCheck) {
                        get_generic_price(item);

                    }
                    else {
                        gilat_price(item);

                    }

                    if ((replacing_service_id != '' && replacing_service_id != null && (custbody_topic != '30' || custbody_topic != '8')) || custbody_topic == '24') {
                        nlapiLogExecution('error', 'INSIDE RATE: ' + i, price_for_rate)
                        rec.setLineItemValue('item', 'rate', i, price_for_rate)
                    }
                } // for - end
            } // if - end


            nlapiSubmitRecord(rec)
        } catch (err) {
            nlapiLogExecution('error', 'Price_list_to_quote()', err)
        }
    }


}

function get_individual_price(itemm) {

    for (var j = 1; j <= plRec_items; j++) {
        var pl_item = plRec.getLineItemValue('line', 'custcol_pl_item', j);
        if (itemm == pl_item) {
            var approval = plRec.getLineItemValue('line', 'custcol_pl_line_approval_status', j);
            var start_date = plRec.getLineItemValue('line', 'custcol_pl_start_effective_date', j);
            var start_date_obj = nlapiStringToDate(start_date);
            var expiration_date = plRec.getLineItemValue('line', 'custcol_pl_end_effective_date', j);
            var expiration_date_obj = nlapiStringToDate(expiration_date);

            if ((start_date_obj <= today && today <= expiration_date_obj) && approval == 'T') {
                nlapiLogExecution('debug', 'pl_exechange()', pl_exechange)
                var amount = plRec.getLineItemValue('line', 'amount', j);
                nlapiLogExecution('debug', 'amount()', amount)
                rec.setLineItemValue('item', 'custcol_price_list_price', line, amount * pl_exechange);
                rec.setLineItemValue('item', 'custcol_price_list', line, customer_price_list_name);
                price_for_rate = amount * pl_exechange
                j = plRec_items;
            }
        }
        else if (j == plRec_items) {
            if (generic_isCheck) {
                get_generic_price(itemm);

            } else {
                gilat_price(itemm);

            }

        }

    }

}

function get_generic_price(itemm) {

    for (var j = 1; j <= generic_plRec_items; j++) {
        var generic_pl_item = generic_plRec.getLineItemValue('line', 'custcol_pl_item', j);
        if (itemm == generic_pl_item) {
            var approval = generic_plRec.getLineItemValue('line', 'custcol_pl_line_approval_status', j);
            var start_date = generic_plRec.getLineItemValue('line', 'custcol_pl_start_effective_date', j);
            var start_date_obj = nlapiStringToDate(start_date);
            var expiration_date = generic_plRec.getLineItemValue('line', 'custcol_pl_end_effective_date', j);
            var expiration_date_obj = nlapiStringToDate(expiration_date);

            if ((start_date_obj <= today && today <= expiration_date_obj) && approval == 'T') {
                var amount = generic_plRec.getLineItemValue('line', 'amount', j);
                rec.setLineItemValue('item', 'custcol_price_list_price', line, amount * generic_pl_exechange);
                rec.setLineItemValue('item', 'custcol_price_list', line, customer_generic_price_list_name);
                price_for_rate = amount * generic_pl_exechange
                j = generic_plRec_items;
            }
        }
        else if (j == generic_plRec_items) {

            gilat_price(itemm);

        }

    }

}

function gilat_price(itemm) {

    nlapiLogExecution('debug', 'item()', itemm)
    var gilat_price = nlapiLookupField('item', itemm, 'custitem_gilat_price');
    if (gilat_price != '' && gilat_price != null) {
        rec.setLineItemValue('item', 'custcol_price_list_price', line, gilat_price * exechange);
        rec.setLineItemValue('item', 'custcol_price_list', line, 'Gilat Price');
        price_for_rate = gilat_price * exechange
    }


}

function getType(type) {
    nlapiLogExecution('debug', 'getType()', type)
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


