var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var form;
var resultsSubList = null;
var error = '';
var line = 0;
function loadFile(request, response) {
    if (request.getMethod() == 'GET') {

        form = nlapiCreateForm('Upload File');
        var fileField = form.addField('file', 'file', 'Select File');
        fileField.setMandatory(true);
        form.addSubmitButton('Upload');
        form.addResetButton();  
        response.writePage(form);
    }
    else {

        var getUserMail = nlapiGetContext().getEmail();

        form = nlapiCreateForm('Uploading File');

        var htmlField1 = form.addField('custpage_header1', 'inlinehtml');
        htmlField1.setDefaultValue("<span style='font-size:18px'>An email with the summary of results will be sent to : <b> " + getUserMail + "</b> once completed.<br></span>");
       
        //var alredyDelete = false;
        var file = request.getFile("file");
        file.setEncoding('UTF-8');
        //file.setFolder(5414)
        file.setFolder(5921)
        file.setIsOnline(true)
        var FileID = nlapiSubmitFile(file)

        try { nlapiScheduleScript('customscript_file_load_ss', 'customdeploy_file_load_ss', { custscript_fileid: FileID }) } catch (e) { }


        //var loadedFile = nlapiLoadFile(FileID);        
        //loadedFile.setEncoding('UTF-8')    
        //var loadedString = loadedFile.getValue();      
        //nlapiLogExecution('DEBUG', 'loadedString ', loadedString)   
        //var fileLines = loadedString.split('\r\n');
        //for (var i = 1; i <= fileLines.length; i++) {
        //    nlapiLogExecution('DEBUG', 'fileLines[i]: ' + i, fileLines[i]);
        //    if (!isNullOrEmpty( fileLines[i]) ) {
        //        var lines = fileLines[i].split(',');              
        //        var slaItem = substringjs(lines[2]);
        //        var qty = substringjs(lines[3]);
        //        var customerNumber = substringjs(lines[5]);
        //        var total = substringjs(lines[6]);
        //        var customerName = substringjs(lines[10]);
        //        var date = substringjs(lines[12]);
        //        var city = substringjs(lines[20]);
        //        //nlapiLogExecution('DEBUG', 'slaItem ', slaItem);
        //        validateData(slaItem, qty, customerNumber, total, customerName, date, city)
        //        if (error != '') {                   
        //            generateSublist( i,  error);                   
        //        }
        //        //if (!isNullOrEmpty(slaItem)) {
        //            if (!isNullOrEmpty(date)) {
        //                date = dateFormattt(date);
        //                //nlapiLogExecution('DEBUG', 'date ', date);
        //                if (!alredyDelete) {
        //                    var period = getAccountingPeriodByName(getPeriod(date));
        //                    deletesla(period);
        //                    alredyDelete = true;
        //                }
        //            }                
        //        if (error == ''){ sla_Generate(slaItem, qty, customerNumber, total, customerName, date, city, period, line, i); }
        //       // }                                         
        //    } //if (fileLines[i] != undefined)
        //    error = '';
        //}// for (var i = 1; i <= fileLines.length; i++)
        //nlapiLogExecution('DEBUG', 'fileLines ', fileLines.length)
    
        response.writePage(form);

    }
}
function sla_Generate(slaItem, qty, customerNumber, total, customerName, date, city , period , line , i) {
    //nlapiLogExecution('DEBUG', 'data: ' + data.length, JSON.stringify(data));
    try {
        if (!isNullOrEmpty(slaItem)) {
            var itemDate = getItemData(slaItem) 
            nlapiLogExecution('DEBUG', 'itemDate:', JSON.stringify(itemDate));
            if (itemDate.length > 0) {
                var itemId = itemDate[0].id;
            }
            else {              
                itemId = '';
                error = 'item whit sla item: ' + slaItem + ' not found in system';
                generateSublist(i, error);
                error = '';
            }
            
        }                 
        var rec = nlapiCreateRecord('customrecord_sla_sales_report');
        //Header Fields 
        rec.setFieldValue('custrecord_sla_ns_item_number', itemId);
        rec.setFieldValue('custrecord_sla_quantity',qty/100);
        rec.setFieldValue('custrecord_sla_amount_ils', total );
        rec.setFieldValue('custrecord_sla_ns_item_name', itemId );
        rec.setFieldValue('custrecord_sla_customer_name', customerName );
        rec.setFieldValue('custrecord_sla_transaction_date', date);
        rec.setFieldValue('custrecord_sla_customer_city', city);
        rec.setFieldValue('custrecord_sla_customer_number', customerNumber );
        rec.setFieldValue('custrecord_sla_transaction_period', period);
        rec.setFieldValue('custrecord_sla_item', slaItem);
        
        var id = nlapiSubmitRecord(rec);
        nlapiLogExecution('debug', 'billing_instruction id: ', id);
        if (id != -1) {            
        }
        
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error sla_Generate ', e);
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
        return val.substring(1, val.length - 1)
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
function validateData(slaItem, qty, customerNumber, total, customerName, date, city, period) {   
    if (isNullOrEmpty(slaItem)) {
        error += 'Missing item\n'
    }
    if (isNullOrEmpty(qty)) {
        error += 'Missing quantity\n'
    }
    if (isNullOrEmpty(customerNumber)) {
        error += 'Missing customer Number\n'
    }
    if (isNullOrEmpty(total)) {
        error += 'Missing total\n'
    }
    if (isNullOrEmpty(customerName)) {
        error += 'Missing customer Name\n'
    }
    if (isNullOrEmpty(date)) {
        error += 'Missing date\n'
    }
    if (isNullOrEmpty(city)) {
        error += 'Missing city\n'
    }

}




