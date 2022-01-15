function ValidateRec() {
    var typeRec = nlapiGetRecordType();
    nlapiLogExecution('DEBUG', 'typeRec ', typeRec) 
    if (typeRec == "customrecord_sla_city_mapping") {
        var RecId = nlapiGetRecordId();
        var block = true;
        var cityCode = nlapiGetFieldValue('custrecord__sla_city_simbol_number_mapp');
        if (!isNullOrEmpty(cityCode)) {
            var cityList = getCity(cityCode);
            if (RecId == "" && cityList.length > 0) { block = false } // type create
            else if (RecId != "") {
                if (cityList.length > 1) { block = false }
                else if (cityList.length == 1) {
                    if (RecId != cityList[0].id) { block = false }
                }
            }
        }
        if (block) { return true }
        else {
            alert('SLA city mapping whit: ' + cityCode + ' SLA CITY SIMBOL NUMBER alredy exist.\nID: ' + cityList[0].id + ', City: ' + cityList[0].name);
            return false;
        }
    }
    else if (typeRec == "customrecord_sla_customer_mapping") {
        var RecId = nlapiGetRecordId();
        var block = true;
        var customerCode = nlapiGetFieldValue('custrecord_sla_customer_number_mapp');
        if (!isNullOrEmpty(customerCode)) {
            var customerList = getCustomer(customerCode);
            if (RecId == "" && customerList.length > 0) { block = false } // type create
            else if (RecId != "") {
                if (customerList.length > 1) { block = false }
                else if (customerList.length == 1) {
                    if (RecId != customerList[0].id) { block = false }
                }
            }
        }
        if (block) { return true }
        else {
            alert('SLA customer mapping whit: ' + customerCode + ' SLA CUSTOMER NUMBER alredy exist.\nID: ' + customerList[0].id + ', Customer: ' + customerList[0].name);
            return false;
        }
    }
    else if (typeRec == "noninventoryitem" || typeRec == "lotnumberedinventoryitem") {
        var RecId = nlapiGetRecordId();
        var block = true;
        var itemCode = nlapiGetFieldValue('custitem_sla_item');
        if (!isNullOrEmpty(itemCode)) {
            var itemList = getItem(itemCode);
            if (RecId == "" && itemList.length > 0) { block = false } // type create
            else if (RecId != "") {
                if (itemList.length > 1) { block = false }
                else if (itemList.length == 1) {
                    if (RecId != itemList[0].id) { block = false }
                }
            }
        }
        if (block) { return true }
        else {
            alert('Item whit: ' + itemCode + ' SLA ITEM alredy exist.\nID: ' + itemList[0].id + ', Item: ' + itemList[0].name);
            return false;
        }
    }
    return true
}


function getCity(city) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord__sla_city_simbol_number_mapp', null, 'is', city)

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_sla_customer_city_mapp');

    var search = nlapiCreateSearch('customrecord_sla_city_mapping', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {

        for (var i = 0; i < s.length; i++) {

            results.push({
                id: s[i].id,
                name: s[i].getValue('custrecord_sla_customer_city_mapp')
            });  
        }
    
    }
    return results;
}
function getCustomer(customer) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_sla_customer_number_mapp', null, 'is', customer)

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_sla_customer_name_mapp');

    var search = nlapiCreateSearch('customrecord_sla_customer_mapping', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {

        for (var i = 0; i < s.length; i++) {

            results.push({
                id: s[i].id,
                name: s[i].getValue('custrecord_sla_customer_name_mapp')
            });
        }

    }
    return results;
}
function getItem(item) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custitem_sla_item', null, 'is', item)

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('itemid');

    var search = nlapiCreateSearch('item', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {

        for (var i = 0; i < s.length; i++) {

            results.push({
                id: s[i].id,
                name: s[i].getValue('itemid')
            });
        }

    }
    return results;
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}