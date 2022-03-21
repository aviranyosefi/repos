function Continue() {
    var action = nlapiGetFieldValue('custpage_action');
    if (action == 2) {
        if (!ValidationField('custpage_agr_target')) { return; }
    }
    nlapiSetFieldValue('custpage_page', '1');
    document.getElementById("submitter").click()
}
function pageLoad() {
    var lines = nlapiGetLineItemCount('custpage_res_sublist');
    var action = nlapiGetFieldValue('custpage_action');
    if (action == 1) {
        nlapiGetField('custpage_agr_target').setDisplayType('hidden');
        nlapiGetField('custpage_cust_target').setDisplayType('hidden');    
        nlapiGetField('custpage_status_target').setDisplayType('hidden');    
    }
    if (action == 2 && lines > 0) {
        nlapiSetFieldMandatory('custpage_agr_target', true)    
        for (var i = 1; i <= lines; i++) {
            if (nlapiGetLineItemValue('custpage_res_sublist', 'custpage_disabled', i) == 'T') {
                nlapiSetLineItemDisabled('custpage_res_sublist', 'custpage_process', true, i)
            }
        }
    }
}
function save() {
    var action = nlapiGetFieldValue('custpage_action');
    if (action == 1) {
        if (!ValidationField('custpage_agr')) { return; }
    }
    else { if (!ValidationField('custpage_agr_target')) { return; }}
    return true
}
function fieldChange(type, name, linenum) {
    debugger;
    if (name == 'custpage_customer' || name == 'custpage_action' || name == 'custpage_status') {
        var customer = nlapiGetFieldValue('custpage_customer');
        var action = nlapiGetFieldValue('custpage_action');
        var status = nlapiGetFieldValue('custpage_status');
        if (!isNullOrEmpty(action) && !isNullOrEmpty(customer) ) {
            if (action == 1) { // עריכת הסכם
                var field = 'custpage_agr'
                nlapiSetFieldMandatory(field, true)
                nlapiGetField('custpage_agr').setDisplayType('normal');
                nlapiGetField('custpage_status').setDisplayType('normal');
                nlapiGetField('custpage_percent').setDisplayType('normal');
                nlapiGetField('custpage_agr_target').setDisplayType('hidden');
                nlapiGetField('custpage_cust_target').setDisplayType('hidden');
                nlapiGetField('custpage_status_target').setDisplayType('hidden'); 
            }          
            else if (action == 2) {
                nlapiSetFieldMandatory('custpage_agr', false)      
                field = 'custpage_agr'
                nlapiGetField('custpage_status').setDisplayType('hidden');
                nlapiSetFieldValue('custpage_status', 1, false, false);
                status = 1;
                nlapiGetField('custpage_agr_target').setDisplayType('normal');
                nlapiGetField('custpage_cust_target').setDisplayType('normal');
                nlapiGetField('custpage_status_target').setDisplayType('normal');   
                nlapiSetFieldMandatory('custpage_agr_target', true);
                nlapiSetFieldValue('custpage_cust_target', nlapiGetFieldValue('custpage_customer'))
            }  
            if (!isNullOrEmpty(customer) && !isNullOrEmpty(status)) {
                var agrList = customer_agr(customer, status);
                nlapiRemoveSelectOption(field);
                nlapiInsertSelectOption(field, '', '', false);
                if (agrList.length > 0) {
                    for (var i = 0; i < agrList.length; i++) {
                        nlapiInsertSelectOption(field, agrList[i].id, agrList[i].name, false);
                    }
                }
            }      
        }
    }
    else if (name == 'custpage_cust_target' || name == 'custpage_status_target') {
        var cust_target = nlapiGetFieldValue('custpage_cust_target');
        var status_target = nlapiGetFieldValue('custpage_status_target');     
        field = 'custpage_agr_target'
        var agrList = customer_agr(cust_target, status_target);
        nlapiRemoveSelectOption(field);
        if (agrList.length > 0) {
            for (var i = 0; i < agrList.length; i++) {
                nlapiInsertSelectOption(field, agrList[i].id, agrList[i].name, false);
            }
        }
    }
    else if (name == 'custpage_discount') {
        var index = nlapiGetCurrentLineItemIndex('custpage_res_sublist');
        renewal_amount = nlapiGetCurrentLineItemValue('custpage_res_sublist', 'custpage_ib_renewal_amount')
        exclude_month_warr = nlapiGetLineItemValue('custpage_res_sublist', 'custpage_exclude_month_warr', index )
        discount = nlapiGetCurrentLineItemValue('custpage_res_sublist', 'custpage_discount')
        var charge_amount = chargeAmtCalc(renewal_amount, exclude_month_warr, discount)
        //nlapiSelectLineItem('custpage_res_sublist', index)
        //nlapiSetCurrentLineItemValue('custpage_res_sublist', 'custpage_charge_amount', charge_amount);
        //nlapiCommitLineItem('custpage_res_sublist');
        //nlapiSetCurrentLineItemValue('custpage_res_sublist', 'custpage_charge_amount', charge_amount)
        var sublistLine = 'custpage_res_sublistrow' + (index - 1);
        var row = document.getElementById(sublistLine);
        cells = row.getElementsByTagName('td');
        var td = cells[12];
        td.innerHTML = charge_amount
    }
}
function validateActionToType(action, type) {
    if (type == '2') {
        if (action == '1' || action == '2' || action == '3' || action == '5') { return true }
        else return false
    }
    else if (type == '1') {
        if (action == '4' || action == '6') { return true }
        else return false
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function ValidationField(field) {
    var val = nlapiGetFieldValue(field)
    if (isNullOrEmpty(val)) {
        var label = nlapiGetField(field).label.toUpperCase();
        alert("Please enter value(s) for: " + label)
        return false;
    }
    return true;
}
function ValidationData() {
    debugger;
    var lineCount = nlapiGetLineItemCount('custpage_res_sublist')
    if (lineCount == 0 || lineCount == -1) {
        alert("Please Press On Refresh Button and Choose Data before ")
        return false
    }
    return true
}
function fnExcelReport() {
    debugger;
    var tab_text = '<h3> Type:' + nlapiGetFieldText('custpage_ilo_type') + '</h3>';
    tab_text += '<h3> Year:' + nlapiGetFieldText('custpage_ilo_year') + '</h3>'
    tab_text += "<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange;
    var j = 0;
    tab = document.getElementById('custpage_res_sublist_splits'); // id of table

    for (j = 0; j < tab.rows.length; j++) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
    }
    else                 //other browser not tested on IE 11
        //sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
        var myBlob = new Blob([tab_text], { type: 'application/vnd.ms-excel' });
    var url = window.URL.createObjectURL(myBlob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = "download.xls";
    a.click();
    //adding some delay in removing the dynamically created link solved the problem in FireFox
    setTimeout(function () { window.URL.revokeObjectURL(url); }, 0);

    return (sa);
}
function customer_agr(customer,status) {

    var screenType = nlapiGetFieldValue('custpage_screen_type')
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_agr_customer', null, 'anyof', customer)
    filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F')
    filters[2] = new nlobjSearchFilter('custrecord_agr_status', null, 'anyof', status)
    filters[3] = new nlobjSearchFilter('custrecord_agr_type', null, 'anyof', screenType) 

    var search = nlapiCreateSearch('customrecord_agr', filters, columns);

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
                name: s[i].getValue('name'),
            });
        }
        return results;
    }
}
function hidden(field, type) {
    var field = document.getElementById(field)
    if (!isNullOrEmpty(field)) {
        field.hidden = type;
    }
}
function chargeAmtCalc(renewal_amount, exclude_month_warr, discount) {
    var clc = (renewal_amount / 12) * exclude_month_warr;
    if (!isNullOrEmpty(discount)) {
        discount = Number(discount.substring(0, discount.length - 1))
        clc = ((100 - discount) * clc) / 100;
    }
    return clc.toFixed(2);
}
//document.getElementById("custpage_res_sublistmarkall").onclick = function () { calcTotalReneual() };
//document.getElementById("custpage_res_sublistmarkall").addEventListener("click", calcTotalReneual);
//document.getElementById("custpage_res_sublistunmarkall").addEventListener("click", calcTotalReneual);
// document.getElementById("tbl_customscript_continue").style.display ='none'
// document.getElementById("tbl_customscript_continue").style.display ='table'