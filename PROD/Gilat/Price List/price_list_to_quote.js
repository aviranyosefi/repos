var CurritemsCount = nlapiGetLineItemCount('item');
var today = new Date();
var isCheck = false;
var generic_isCheck = false;

var customer = nlapiGetFieldValue('entity')

var customer_price_list = nlapiLookupField('customer', customer, 'custentity_customer_price_list');
var customer_pl_approval = nlapiLookupField('customer', customer, 'custentity_customer_pl_approval');

var currency = nlapiGetFieldValue('currency');
var trandate = nlapiGetFieldValue('trandate');
var exechange = nlapiExchangeRate('USD', currency, trandate);


//nlapiLogExecution('debug', 'exechange()', exechange)

if (customer_price_list != '' && customer_price_list != undefined && customer_price_list != null && customer_pl_approval == 'T') {
    var customer_price_list_text = nlapiLookupField('customer', customer, 'custentity_customer_price_list', true);

    if (customer_price_list_text != '' && customer_price_list_text != null) { var customer_price_list_name = customer_price_list_text.split('#')[1]; }
    else { var customer_price_list_name = ''; }
    try {
        var pl_currency = nlapiLookupField('customtransaction_price_list', customer_price_list, 'currency');
        var pl_exechange = nlapiExchangeRate(pl_currency, currency, trandate);
        var plRec = nlapiLoadRecord('customtransaction_price_list', customer_price_list);
        var plRec_items = plRec.getLineItemCount('line');
        var plRec_status = plRec.getFieldValue('transtatus');
        if (plRec_status != 'D') { isCheck = true; }
    } catch (e) { }


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

function validateLine(type, name) {

    if (name == 'entity' || name == 'currency'  ) {


        isCheck = false;
        generic_isCheck = false;

        customer = nlapiGetFieldValue('entity')

        customer_price_list = nlapiLookupField('customer', customer, 'custentity_customer_price_list');
        customer_pl_approval = nlapiLookupField('customer', customer, 'custentity_customer_pl_approval');

        currency = nlapiGetFieldValue('currency');
        trandate = nlapiGetFieldValue('trandate');
        //exechange = nlapiExchangeRate('USD', currency, trandate);


        //nlapiLogExecution('debug', 'exechange()', exechange)

        if (customer_price_list != '' && customer_price_list != undefined && customer_price_list != null && customer_pl_approval == 'T') {
            customer_price_list_text = nlapiLookupField('customer', customer, 'custentity_customer_price_list', true);

            if (customer_price_list_text != '' && customer_price_list_text != null) { customer_price_list_name = customer_price_list_text.split('#')[1]; }
            else { customer_price_list_name = ''; }
            try {
                pl_currency = nlapiLookupField('customtransaction_price_list', customer_price_list, 'currency');
                pl_exechange = nlapiExchangeRate(pl_currency, currency, trandate);
                plRec = nlapiLoadRecord('customtransaction_price_list', customer_price_list);
                plRec_items = plRec.getLineItemCount('line');
                plRec_status = plRec.getFieldValue('transtatus');
                if (plRec_status != 'D') { isCheck = true; }
            } catch (e) { }


        }


        customer_generic_price_list = nlapiLookupField('customer', customer, 'custentity_generic_price_list');
        generic_pl_approval = nlapiLookupField('customer', customer, 'custentity_generic_pl_approval');

        if (customer_generic_price_list != '' && customer_generic_price_list != undefined && customer_generic_price_list != null && generic_pl_approval == 'T') {

            customer_generic_price_list_text = nlapiLookupField('customer', customer, 'custentity_generic_price_list', true);
            if (customer_generic_price_list_text != '' && customer_generic_price_list_text != null) { customer_generic_price_list_name = customer_generic_price_list_text.split('#')[1]; }
            else { customer_generic_price_list_name = ''; }

            generic_pl_currency = nlapiLookupField('customtransaction_price_list', customer_generic_price_list, 'currency');
            generic_pl_exechange = nlapiExchangeRate(generic_pl_currency, currency, trandate);
            generic_plRec = nlapiLoadRecord('customtransaction_price_list', customer_generic_price_list);
            generic_plRec_items = generic_plRec.getLineItemCount('line');
            generic_status = generic_plRec.getFieldValue('transtatus');
            if (generic_status != 'D') { generic_isCheck = true; }


        }


    }

    if (name == 'item') {

        var itemm = nlapiGetCurrentLineItemValue('item', 'item');
        nlapiLogExecution('debug', 'isCheck()', isCheck)
        nlapiLogExecution('debug', 'generic_isCheck', generic_isCheck)


        if (itemm != '') {
            if (isCheck) {
                get_individual_price(itemm)
                return true;

            }
            else if (generic_isCheck) {
                get_generic_price(itemm);
                return true;

            }
            else {
                gilat_price(itemm);
                return true;

            }
        }
        return true;
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
                var amount = plRec.getLineItemValue('line', 'amount', j);
                nlapiSetCurrentLineItemValue('item', 'custcol_price_list_price', amount * pl_exechange);
                nlapiSetCurrentLineItemValue('item', 'custcol_price_list', customer_price_list_name);

                return true;

            }
        }
        else if (j == plRec_items) {
            if (generic_isCheck) {
                get_generic_price(itemm);
                return true;
            } else {
                gilat_price(itemm);
                return true;
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
                nlapiSetCurrentLineItemValue('item', 'custcol_price_list_price', amount * generic_pl_exechange);
                nlapiSetCurrentLineItemValue('item', 'custcol_price_list', customer_generic_price_list_name);
                return true;
            }
        }
        else if (j == generic_plRec_items) {

            gilat_price(itemm);
            return true;
        }

    }

}

function gilat_price(itemm) {

    var currency = nlapiGetFieldValue('currency');
    var trandate = nlapiGetFieldValue('trandate');
    //var exechange = nlapiExchangeRate('USD', currency, trandate);
    var itemData = nlapiLookupField('item', itemm, ['custitem_gilat_price','custitem_gilat_price_currency']);
    var gilat_price_currency = itemData.custitem_gilat_price_currency
    var gilat_price = itemData.custitem_gilat_price
    if (isNullOrEmpty(gilat_price_currency)) {
        gilat_price_currency = 'USD';
    }
    var exechange = nlapiExchangeRate(gilat_price_currency, currency, trandate);
    //var gilat_price = getGilatPrice(itemm)
    nlapiLogExecution('debug', 'exechange', exechange)
    if (gilat_price != '' && gilat_price != null) {
        nlapiSetCurrentLineItemValue('item', 'custcol_price_list_price', gilat_price * exechange);
        nlapiSetCurrentLineItemValue('item', 'custcol_price_list', 'Gilat Price');
    }
    return true;

}

function getGilatPrice(itemm) {



    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custitem_gilat_price');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', itemm)

    var search = nlapiCreateSearch('item', filters, columns);
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (s != null) {

        return s[0].getValue('custitem_gilat_price')
    }


}

function saveRecord() {

    var itemsCount = nlapiGetLineItemCount('item');
    if (itemsCount != CurritemsCount) {
        for (var i = 1; i <= itemsCount; i++) {
            line = i
            var item = nlapiGetLineItemValue('item', 'item', i);
            var price = nlapiGetLineItemValue('item', 'custcol_price_list_price', i);
            var price_list = nlapiGetLineItemValue('item', 'custcol_price_list', i);
            var itemtype = nlapiGetLineItemValue('item', 'itemtype', i);            
            //var rate = nlapiGetLineItemValue('item', 'rate', i);
            if (isNullOrEmpty(price) && isNullOrEmpty(price_list) && itemtype !='EndGroup' ) {

                if (isCheck) {
                    get_individual_price_2(item, i)
                }
                else if (generic_isCheck) {
                    get_generic_price_2(item, i);

                }
                else {
                    gilat_price_2(item, i);

                }

            }
        } // for - end
    } // if - end

    return true;

}

function get_individual_price_2(itemm, line) {
    debugger;
    for (var j = 1; j <= plRec_items; j++) {
        var pl_item = plRec.getLineItemValue('line', 'custcol_pl_item', j);
        if (itemm == pl_item) {
            var approval = plRec.getLineItemValue('line', 'custcol_pl_line_approval_status', j);
            var start_date = plRec.getLineItemValue('line', 'custcol_pl_start_effective_date', j);
            var start_date_obj = nlapiStringToDate(start_date);
            var expiration_date = plRec.getLineItemValue('line', 'custcol_pl_end_effective_date', j);
            var expiration_date_obj = nlapiStringToDate(expiration_date);

            if ((start_date_obj <= today && today <= expiration_date_obj) && approval == 'T') {
                var amount = plRec.getLineItemValue('line', 'amount', j);
                nlapiSelectLineItem('item', line)
                nlapiSetCurrentLineItemValue('item', 'custcol_price_list_price', amount * pl_exechange);
                nlapiSetCurrentLineItemValue('item', 'custcol_price_list', customer_price_list_name);
                nlapiSetCurrentLineItemValue('item', 'rate', amount * pl_exechange);
                nlapiCommitLineItem('item');
                break;


            }
        }
        else if (j == plRec_items) {
            if (generic_isCheck) {
                get_generic_price_2(itemm, line);

            } else {
                gilat_price_2(itemm, line);

            }

        }

    }

}

function get_generic_price_2(itemm, line) {
    debugger;
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
                nlapiSelectLineItem('item', line)
                nlapiSetCurrentLineItemValue('item', 'custcol_price_list_price', amount * generic_pl_exechange);
                nlapiSetCurrentLineItemValue('item', 'custcol_price_list', customer_generic_price_list_name);
                nlapiSetCurrentLineItemValue('item', 'rate', amount * generic_pl_exechange);
                nlapiCommitLineItem('item');
                break;

            }
        }
        else if (j == generic_plRec_items) {

            gilat_price_2(itemm, line);

        }

    }

}

function gilat_price_2(itemm, line) {

    var currency = nlapiGetFieldValue('currency');
    var trandate = nlapiGetFieldValue('trandate');
    var itemData = nlapiLookupField('item', itemm, ['custitem_gilat_price', 'custitem_gilat_price_currency']);
    var gilat_price_currency = itemData.custitem_gilat_price_currency
    var gilat_price = itemData.custitem_gilat_price
    if (isNullOrEmpty(gilat_price_currency)) {
        gilat_price_currency = 'USD';
    }
    var exechange = nlapiExchangeRate(gilat_price_currency, currency, trandate);
    //var exechange = nlapiExchangeRate('USD', currency, trandate);
    //var gilat_price = getGilatPrice(itemm)
    //console.log('gilat_price: ' + gilat_price)
    //nlapiLogExecution('debug', 'exechange', exechange)

    if (gilat_price != '' && gilat_price != null) {
        nlapiSelectLineItem('item', line)
        nlapiSetCurrentLineItemValue('item', 'rate', gilat_price * exechange);
        //nlapiSetLineItemValue('item', 'amount', line, 11); 
        nlapiSetCurrentLineItemValue('item', 'custcol_price_list_price', gilat_price * exechange);
        nlapiSetCurrentLineItemValue('item', 'custcol_price_list', 'Gilat Price');
        nlapiCommitLineItem('item')
    }


}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}