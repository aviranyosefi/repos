function pageLoad(){

}

function FieldChange(type, name) {
    debugger;
    if (name == 'custpage_result_view') {

        var result_view = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_result_view');
        if (result_view == 'T') {
            var link = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_result_link');
            window.open(link);         
            nlapiSetCurrentLineItemValue('custpage_results_sublist', 'custpage_result_view', 'F', false);
        }       
    }
    if (name == 'custpage_cb_as_matal') {
        if (nlapiGetFieldValue('custpage_cb_as_matal') == 'T') {
            nlapiSetFieldMandatory('custpage_sales_rep', true)
        }
        else {
            nlapiSetFieldMandatory('custpage_sales_rep', false)
        }  
    }
    if (name == 'custpage_result_cb' ) {     
            if (!isNullOrEmpty(nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_sales_manager_approver'))) {
                nlapiSetLineItemDisabled('custpage_results_sublist', 'custpage_result_curr_monthly_charge', true, nlapiGetCurrentLineItemIndex('custpage_results_sublist'))
                alert('לא ניתן לערוך')
                nlapiSetCurrentLineItemValue('custpage_results_sublist', 'custpage_result_cb', 'F', false)               
            }            
        
        
    }
}

function save() {

    var fromDate = nlapiGetFieldValue('custpage_ilo_multi_fromdate');
    var toDate = nlapiGetFieldValue('custpage_ilo_multi_todate');
    if (!isNullOrEmpty(fromDate)) {
        fromDate = fromDate.split('/')
        toDate = toDate.split('/')
        if (fromDate[1] == toDate[1] && fromDate[2] == toDate[2])
        {}
        else {
            alert('לא ניתן לבחור תאריכים בחודשים שונים');
            return false;
            }
    }
    var sales_rep = nlapiGetFieldValue('custpage_sales_rep')
    if (nlapiGetFieldValue('custpage_cb_as_matal') == 'T' && isNullOrEmpty(sales_rep)) {
        alert("בחר איש מכירות")
        return false;
    }
    if (!isNullOrEmpty(sales_rep)) {
        var logList = logSearch(sales_rep);
        if (logList.length > 0) {
            alert('לא ניתן להיכנס למסך מאחר וקיים תהליך שלא הסתיים ע"י ' + logList[0].owner + ' לאיש מכירות ' + logList[0].sales_rep)
            return false;
        }
    }   
    return true;
}

function ValidateLine() {
    var salesrole = nlapiGetFieldValue('custpage_ilo_salesrole');
    if (salesrole == '1') {
        var status = nlapiGetCurrentLineItemValue('custpage_results_sublist', 'custpage_result_status');
        if (status == 'Waiting for sale manager approval' || status=='' ) {
            //
            return true;
        }
        else {
            alert('לא ניתן לערוך');
            //nlapiSetLineItemDisabled('custpage_results_sublist', 'custpage_result_curr_monthly_charge', true, nlapiGetCurrentLineItemIndex('custpage_results_sublist'))
            return false;
        }
    }
    return true;
}

function MarkAll() {
    var LineCount = nlapiGetLineItemCount('custpage_results_sublist');
    if (LineCount != 0) {
        for (var i = 0; i < LineCount; i++) {
            nlapiSelectLineItem('custpage_results_sublist', i + 1)
            nlapiSetCurrentLineItemValue('custpage_results_sublist', 'custpage_result_cb', 'T');
            nlapiCommitLineItem('custpage_results_sublist')
            //nlapiSetLineItemValue('custpage_results_sublist', 'custpage_result_cb', i + 1, 'F');
        }
    }
}

function UnmarkAll() {
    debugger;
    var LineCount = nlapiGetLineItemCount('custpage_results_sublist');
    if (LineCount != 0) {
        for (var i = 0; i < LineCount; i++) {
            nlapiSelectLineItem('custpage_results_sublist', i+1)
            nlapiSetCurrentLineItemValue('custpage_results_sublist', 'custpage_result_cb', 'F');
            nlapiCommitLineItem('custpage_results_sublist')
            //nlapiSetLineItemValue('custpage_results_sublist', 'custpage_result_cb', i + 1, 'F');
        }
    }
}

function formatNumber(num) {
    var num = parseFloat(num).toFixed(2)
    if (num != '' && num != undefined && num != null && !isNaN(num)) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return ''
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function fnExcelReport() {

    exportExcel('custpage_results_second_splits')
}
function fnExcelReport2() {

    exportExcel2('custpage_results_sublist_splits')
}
function exportExcel(sublist) {

    var tab_text = "<head><meta charset='UTF-8'></head><table border='2px'><tr bgcolor='#87AFC6'>";
    tab = document.getElementById(sublist); // id of table

    for (var j = 0; j < tab.rows.length; j++) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    sa = window.open('data:application/vnd.ms-excel,base64,' + encodeURIComponent(tab_text));

    return (sa);
}
function exportExcel2(sublist) {

    var tab_text = "<head><meta charset='UTF-8'></head><table border='2px'><tr bgcolor='#87AFC6'>";
    tab = document.getElementById(sublist); // id of table

    for (var j = 0; j < tab.rows.length; j++) {
        tab_text += '<tr>'
        row = tab.rows[j];
        cells = row.getElementsByTagName('td');
        for (var m = 0; m < cells.length; m++) {
            if ((m == 12 || m == 13) && j !=0) {
                f = cells[m]            
                tab_text += '<td>'
                tab_text += f.getElementsByTagName('input')[0].value
                 tab_text += '</td>'

            }
            else {
                tab_text += '<td>'
                tab_text += cells[m].innerText
                tab_text += '</td>'
            }
        }
        tab_text += '</tr>'    
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    sa = window.open('data:application/vnd.ms-excel,base64,' + encodeURIComponent(tab_text));

    return (sa);
}
function logSearch(saleRep) {


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('entityid', 'owner');
    columns[1] = new nlobjSearchColumn('custrecord_log_sales_rep');
   
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_log_sales_rep', null, 'anyof', saleRep)
    filters[1] = new nlobjSearchFilter('custrecord_log_processed_finished', null, 'is', 'F')

    var search = nlapiCreateSearch('customrecord_customer_agreement_log', filters, columns);

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

    if (s != null && s.length >0) {
        results.push({
            owner: s[0].getValue('entityid', 'owner'),
            sales_rep: s[0].getText('custrecord_log_sales_rep'),
        });        
        
    }
    return results;

}
