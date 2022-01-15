var context = nlapiGetContext();

function loadFile() {
    try {
        var loadedFile = nlapiLoadFile(46905);        
        //loadedFile.setEncoding('UTF-8')  
        //var fileName = loadedFile.getName()
        var loadedString = loadedFile.getValue();      
        //nlapiLogExecution('DEBUG', 'loadedString ', loadedString)   
        var fileLines = loadedString.split('\r\n');
        for (var i = 0; i <= 0; i++) {
            Context(context);
            //nlapiLogExecution('DEBUG', 'fileLines[i]: ' + i, fileLines[i]);
            if (!isNullOrEmpty( fileLines[i]) ) {
                var lines = fileLines[i].split(',');              
                var id = substringjs(lines[0]);// C
                var type = getType(lines[1]); // D
                var fileID = substringjs(lines[4]); // F
                nlapiLogExecution('DEBUG', 'line :' + i +', id :' + id + ' ,type: ' + type, 'fileID: ' + fileID);                                                                                             
                nlapiAttachRecord("file", fileID, type, id);
            } //if (fileLines[i] != undefined)
            error = '';
        }// for (var i = 1; i <= fileLines.length; i++)
        
    } catch (e) {
        nlapiSendEmail(getUserID, getUserMail, 'SLA Sales report', 'An error occurred while trying to create SLA Sales report \n Error description: ' + e);
    }  
}   
function sla_Generate(slaItem, qty, customerNumber, total, date, city , period , i) {
    //nlapiLogExecution('DEBUG', 'data: ' + data.length, JSON.stringify(data));
    try {
        var createRec = true;
        var error = validateData(slaItem, qty, customerNumber, total, date, city);
        if (error != '') { createRec = false;}
        if (!isNullOrEmpty(slaItem)) {
            var itemData = getItemData(slaItem) 
            nlapiLogExecution('DEBUG', 'itemData:', JSON.stringify(itemData));
            if (itemData.length > 0) {
                var itemId = itemData[0].id;
            }
            else {                
                createRec = false;
                error += 'Item whit sla item: ' + slaItem + ' not found in system.<br>';               
            }            
        }
        if (!isNullOrEmpty(customerNumber)) {
            var CustomerData = getCustomerData(customerNumber)
            nlapiLogExecution('DEBUG', 'CustomerData:', JSON.stringify(CustomerData));
            if (CustomerData == '') {
                createRec = false;
                error += 'Customer whit number: ' + customerNumber + ' not found in system.<br>';               
            }
        }
        if (!isNullOrEmpty(city)) {
            var CityData = getCityData(city) 
            nlapiLogExecution('DEBUG', 'CityData:', JSON.stringify(CityData));
            if (CityData == '') {
                createRec = false;
                error += 'City whit number: ' + city + ' not found in system.';                            
            }
        }
        if (createRec) {
            var rec = nlapiCreateRecord('customrecord_sla_sales_report');
            //Header Fields 
            rec.setFieldValue('custrecord_sla_ns_item_number', itemId);
            rec.setFieldValue('custrecord_sla_quantity', qty / 100);
            rec.setFieldValue('custrecord_sla_amount_ils', total);
            rec.setFieldValue('custrecord_sla_ns_item_name', itemId);
            rec.setFieldValue('custrecord_sla_customer_name', CustomerData);
            rec.setFieldValue('custrecord_sla_transaction_date', date);
            rec.setFieldValue('custrecord_sla_customer_city', CityData);
            rec.setFieldValue('custrecord_sla_city_number', city);
            rec.setFieldValue('custrecord_sla_customer_number', customerNumber);
            rec.setFieldValue('custrecord_sla_transaction_period', period);
            rec.setFieldValue('custrecord_sla_item', slaItem);
            var id = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', 'billing_instruction id: ', id);
        }
        else {
            generateErrorTable(i, error);
            error = '';
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error sla_Generate ', e);
        generateErrorTable(i, 'An error occurred while trying to save SLA Sales report for line ' + i +': '+ e);
    }
}
function dateFormattt(date) {
    nlapiLogExecution('DEBUG', 'date ' + date, date.length);
    if (date.length == 5) {
        var newDate = date.substring(0, 1) + '/' + date.substring(1, 3) + '/' + date.substring(3, 5)
    }
    else {
        var newDate = date.substring(0, 2) + '/' + date.substring(2, 4) + '/' + date.substring(4, 6)
    }
    return newDate
}
function getItemData(slaItem) {
    nlapiLogExecution('DEBUG', 'slaItem ', slaItem);
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('itemid');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custitem_sla_item', null, 'is', slaItem)

    var search = nlapiCreateSearch('item', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results  =[];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null && s.length>0) {
        results.push({
            id: s[0].id,
            name: s[0].getValue('itemid')
        });   
    }
    return results


}
function getPeriod(date) {
    date = nlapiStringToDate(date);
    var mm = date.getMonth();
    var yyyy = date.getFullYear();
    return months[mm] + ' ' + yyyy;
}
function getAccountingPeriodByName(name) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('periodname', null, 'is', name);

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');

    var searchresults = nlapiSearchRecord('accountingperiod', null, filters, columns);

    if (searchresults != null) {

        return searchresults[0].getValue('internalid')
    }

    return '';
}
function dateFormat(date){
   
    var s = date.split('/');
    return s[1] + '/' + s[0] + '/' + s[2];

}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function deletesla(period) {
    //var columns = new Array();
    //columns[0] = new nlobjSearchColumn('itemid');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_sla_transaction_period', null, 'is', period)

    var search = nlapiCreateSearch('customrecord_sla_sales_report', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null && s.length > 0) {
        for (var i = 0; i < s.length; i++) {
            nlapiDeleteRecord('customrecord_sla_sales_report', s[i].id)
        }
     
    }



}
function substringjs(val) {
    if (!isNullOrEmpty(val))
        if (val.toString().indexOf("\"") == 0) {
            return val.substring(1, val.length - 1);
        }
        else { return val }
      
    else return '';
}
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
function generateSublist(i, error) {
    line = line + 1;
    if (resultsSubList == null) {
        resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'error result', null);
        resultsSubList.addField('custpage_result_line', 'text', 'line').setDisplayType('disabled');
        resultsSubList.addField('custpage_result_error', 'text', 'error').setDisplayType('disabled');
    }
    resultsSubList.setLineItemValue('custpage_result_line', line, parseInt(i + 1).toString());
    resultsSubList.setLineItemValue('custpage_result_error', line, error);   
}
function generateErrorTable(i, error) {
    nlapiLogExecution('DEBUG', 'generateErrorTable ', i);
    line = line + 1;
    if (errorTable == '') {
        errorTable = '<table style="width: 400px;" border=1>';
        // for th
        errorTable += "<tr> <th>Line</th> <th>Error</th></tr>"
    }
    errorTable += '<tr><td>' + i + '</td><td>' + error + '</td></tr>';
}
function validateData(slaItem, qty, customerNumber, total, date, city, period) {   
    var error = '';
    if (isNullOrEmpty(slaItem)) {
        error += 'Missing item in file.<br>'
    }
    if (isNullOrEmpty(qty)) {
        error += 'Missing quantity in file.<br>'
    }
    if (isNullOrEmpty(customerNumber)) {
        error += 'Missing customer Number in file.<br>'
    }
    if (isNullOrEmpty(total)) {
        error += 'Missing total in file.<br>'
    }
    if (isNullOrEmpty(date)) {
        error += 'Missing date in file.<br>'
    }
    if (isNullOrEmpty(city)) {
        error += 'Missing city Number in file.<br>'
    }
    return error;
}
function Context(context) {

    //nlapiLogExecution('DEBUG', 'context.getRemainingUsage()', context.getRemainingUsage());
    if (context.getRemainingUsage() < 1250) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        //nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }

}
function getCustomerData(customerNumber) {
    nlapiLogExecution('DEBUG', 'customerNumber ', customerNumber);
    //var columns = new Array();
    //columns[0] = new nlobjSearchColumn('');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_sla_customer_number_mapp', null, 'is', customerNumber)

    var search = nlapiCreateSearch('customrecord_sla_customer_mapping', filters, null);

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

    if (s != null && s.length > 0) {
        
             return s[0].id  
        
    }
    return '';


}
function getCityData(city) {
    nlapiLogExecution('DEBUG', 'city ', city);
    //var columns = new Array();
    //columns[0] = new nlobjSearchColumn('');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord__sla_city_simbol_number_mapp', null, 'is', city)

    var search = nlapiCreateSearch('customrecord_sla_city_mapping', filters, null);

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

    if (s != null && s.length > 0) {

        return s[0].id

    }
    return '';


}
function getType(type) {
    if (type == 'Expense Report') {
        return 'expensereport'
    }
    else if (type == 'Bill') {
        return 'vendorbill'
    }
    else if (type == 'Bill Credit') {
        return 'vendorcredit'
    }
    else if (type == 'Bill Payment') {
        return 'vendorpayment'
    }
    else if (type == 'Journal') {
        return 'journalentry'
    }
}



