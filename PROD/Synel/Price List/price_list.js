var isCheck = false;
var customer;
var customer_price_list;
var currency;
var trandate;
var exechange;
var customer_price_list_text;
var customer_price_list_name;
var plRec;
var plRec_items;
var plItems = [];
checkPL();
var software_isCheck = false;
var softwarePlRec;
var softwarePl_items;
var softwarePlItems = [];
checkSoftwerPL();
var generic_isCheck = false;
var genericPlRec;
var genericPl_items;
var genericPlItems = [];
checkGenericPL();



function fieldChange(type, name) {
    debugger;
    if (name == 'entity') {
        checkPL()
    }
}
function validateLine() {
    debugger;
    var customer = nlapiGetFieldValue('entity');
    var itemm = nlapiGetCurrentLineItemValue('item', 'item');
    if (!isNullOrEmpty(itemm)) {
        var organization_size = nlapiGetCurrentLineItemValue('item', 'custcol_organization_size');
        var itemType = nlapiLookupField('item', itemm, 'custitem_item_service_type');
        var up = getLastUP(customer, itemm)
        if (itemType != '3' && up.length >0) {
            nlapiSetCurrentLineItemValue('item', 'custcol_calculated_amount', up[0]); 
            nlapiSetCurrentLineItemValue('item', 'custcol_last_customer_price', up[1]);  
        }
        else if (isCheck && itemType != '3') {
            get_individual_price(itemm)
        }
        else if (generic_isCheck && itemType != '3') {
            get_generic_price(itemm);
        }

        else if (software_isCheck && itemType == '3') { // תוכנה       
            if (!isNullOrEmpty(organization_size)) {
                get_software_price(itemm, organization_size);
            }
            else {
                alert("Please enter value(s) for: ORGANIZATION SIZE")
                return false
            }
        }
    }
    return true;  
}
function get_individual_price(itemm) {
    if (plItems[itemm] != undefined) {
        //nlapiSetCurrentLineItemValue('item', 'rate', plItems[itemm].amt);    
        nlapiSetCurrentLineItemValue('item', 'custcol_calculated_amount', plItems[itemm].amt);                    
    }
    return true;     
}
function get_software_price(itemm, organization_size) {
    if (softwarePlItems[itemm] != undefined) {
        debugger;
        var type = get_organization_size(organization_size)
        //nlapiSetCurrentLineItemValue('item', 'rate', softwarePlItems[itemm]['ot_' + type]);
        if (!isNullOrEmpty(softwarePlItems[itemm]['ot_' + type])) {
            nlapiSetCurrentLineItemValue('item', 'custcol_calculated_amount', softwarePlItems[itemm]['ot_' + type]);
        }
        if (!isNullOrEmpty(softwarePlItems[itemm]['mf_' + type])) {
            nlapiSetCurrentLineItemValue('item', 'custcol_monthly_charge', softwarePlItems[itemm]['mf_' + type]);
        }           
        return true;
    }
}
function get_generic_price(itemm) {
    if (genericPlItems[itemm] != undefined) {
        //nlapiSetCurrentLineItemValue('item', 'rate', genericPlItems[itemm].amt);
        nlapiSetCurrentLineItemValue('item', 'custcol_calculated_amount', genericPlItems[itemm].amt);
        return true;
    }
    else if (isCheck) {
        get_individual_price(itemm)
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function checkPL() {
    customer = nlapiGetFieldValue('entity')
    customer_price_list = nlapiLookupField('customer', customer, 'custentity_price_list');
    //customer_price_list= checkIndividualPL(customer)
    currency = nlapiGetFieldValue('currency');
    trandate = nlapiGetFieldValue('trandate');
    exechange = nlapiExchangeRate('USD', currency, trandate);
    nlapiLogExecution('debug', 'exechange()', exechange)

    if (!isNullOrEmpty(customer_price_list)) {
        customer_price_list_text = nlapiLookupField('customer', customer, 'custentity_price_list', true);
        try {
            plRec = nlapiLoadRecord('customsale_price_list', customer_price_list);
            plRec_items = plRec.getLineItemCount('item');
            for (var j = 1; j <= plRec_items; j++) {
                var item = plRec.getLineItemValue('item', 'custcol_subitem', j)
                if (isNullOrEmpty(item)) {
                    item = plRec.getLineItemValue('item', 'item', j)
                }                
                plItems[item] = {
                    amt: plRec.getLineItemValue('item', 'amount', j),
                }                                 
            }      
            isCheck = true;            
        } catch (e) { }
    }
}
function checkIndividualPL(customer) {
    try {

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('entity', null, 'is', customer)

        var search = nlapiCreateSearch('customsale_price_list', filters, null);

        var resultset = search.runSearch();
        var s = [];
        var searchid = 0;
        var id = '';
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        if (s != null && s.length > 0) {
            id = s[0].id         
        }
    } catch (e) {
    }
    return id
}
function checkSoftwerPL() {
    try {

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custbody_software_price_list', null, 'is', 'T')

        var search = nlapiCreateSearch('customsale_price_list', filters, null);

        var resultset = search.runSearch();
        var s = [];
        var searchid = 0;
        var id = '';
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        if (s != null && s.length>0) {
            id = s[0].id
            softwarePlRec = nlapiLoadRecord('customsale_price_list', id);
            softwarePl_items = softwarePlRec.getLineItemCount('item');
            for (var j = 1; j <= softwarePl_items; j++) {
                softwarePlItems[softwarePlRec.getLineItemValue('item', 'item', j)] = {                
                    ot_s: softwarePlRec.getLineItemValue('item', 'custcol_pl_one_time_s', j),
                    mf_s: softwarePlRec.getLineItemValue('item', 'custcol_pl_monthly_fee_s', j),
                    ot_m: softwarePlRec.getLineItemValue('item', 'custcol_pl_one_time_m', j),
                    mf_m: softwarePlRec.getLineItemValue('item', 'custcol_pl_monthly_fee_m', j),                 
                    ot_l: softwarePlRec.getLineItemValue('item', 'custcol_pl_one_time_l', j),
                    mf_l: softwarePlRec.getLineItemValue('item', 'custcol_pl_monthly_fee_l', j),                  
                    ot_vl: softwarePlRec.getLineItemValue('item', 'custcol_pl_one_time_vl', j),
                    mf_vl: softwarePlRec.getLineItemValue('item', 'custcol_pl_monthly_fee_vl', j),               
                }
            } 
            software_isCheck = true;
        }              
    } catch (e) {
    }
}
function get_organization_size(organization_size) {
    if (organization_size == 1) { return 's' }
    else if (organization_size == 2) { return 'm'}
    else if (organization_size == 3) { return 'l' }
    else if (organization_size == 4) { return 'vl' }
}
function checkGenericPL() {
    try {

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custbody_generical_pricelist', null, 'is', 'T')

        var search = nlapiCreateSearch('customsale_price_list', filters, null);

        var resultset = search.runSearch();
        var s = [];
        var searchid = 0;
        var id = '';
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        if (s != null && s.length > 0) {
            id = s[0].id
            genericPlRec = nlapiLoadRecord('customsale_price_list', id);
            genericPl_items = genericPlRec.getLineItemCount('item');
            for (var j = 1; j <= genericPl_items; j++) {
                var item = genericPlRec.getLineItemValue('item', 'custcol_subitem', j)
                if (isNullOrEmpty(item)) {
                    item = genericPlRec.getLineItemValue('item', 'item', j)
                }  
                genericPlItems[item] = {
                    amt: genericPlRec.getLineItemValue('item', 'amount', j),
                }
            }
            generic_isCheck = true;
        }
    } catch (e) {
    }
}
function getLastUP(customer, item) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_lcup_unit_price');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_lcup_customer', null, 'is', customer)
    filters[1] = new nlobjSearchFilter('custrecord_lcup_item', null, 'is', item)

    var search = nlapiCreateSearch('customrecord_last_customer_unit_price', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var res = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null && s.length >0) {
        res[0] = s[0].getValue('custrecord_lcup_unit_price');  
        res[1] = s[0].id;
        return res;
    }
    return res;
}



