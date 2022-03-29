function Continue() {
    var action = nlapiGetFieldValue('custpage_action')
    if (action == 1) {
        if (!ValidationField('custpage_new_fromdate')) { return; }
        if (!ValidationField('custpage_months')) { return; }
        if (!ValidationField('custpage_billing_cycle')) { return; }
        if (!ValidationField('custpage_renewal_type')) { return; }
        if (!ValidationField('custpage_billing_on')) { return; }
        if (!ValidationField('custpage_description')) { return; }
    }
    else if (action == 2) {
        if (!ValidationField('custpage_agr_second')) { return; }
    }
    else {
        if (!ValidationField('custpage_agr_target')) { return; }
    }
    nlapiSetFieldValue('custpage_page', '1')
    document.getElementById("submitter").click()
}

function pageLoad() {
    var lines = nlapiGetLineItemCount('custpage_res_sublist');
    var action = nlapiGetFieldValue('custpage_action');

    if (lines > 0 && action == 1) {
        nlapiSetFieldMandatory('custpage_new_fromdate', true)
        nlapiSetFieldMandatory('custpage_months', true)
        nlapiSetFieldMandatory('custpage_billing_cycle', true)
        nlapiSetFieldMandatory('custpage_renewal_type', true)
        nlapiSetFieldMandatory('custpage_billing_on', true)
        nlapiSetFieldMandatory('custpage_description', true)
    }
    if (isNullOrEmpty(action)) {
        nlapiGetField('custpage_agr').setDisplayType('hidden');
        nlapiGetField('custpage_agr_second').setDisplayType('hidden');
        nlapiGetField('custpage_percent').setDisplayType('hidden');
    }
    else if (action == 1) {
        nlapiGetField('custpage_agr_second').setDisplayType('hidden');
        nlapiGetField('custpage_percent').setDisplayType('normal');
        nlapiGetField('custpage_agr_target').setDisplayType('hidden');
        calcTotalReneual()

    }
    else if (action == 2) {
        nlapiGetField('custpage_agr').setDisplayType('hidden');
        nlapiGetField('custpage_percent').setDisplayType('hidden');
        nlapiGetField('custpage_agr_target').setDisplayType('hidden');

    }
    else {
        nlapiGetField('custpage_agr_second').setDisplayType('hidden');
        nlapiGetField('custpage_agr').setDisplayType('normal');
        nlapiGetField('custpage_percent').setDisplayType('normal');
        nlapiGetField('custpage_agr_target').setDisplayType('normal');
        nlapiSetFieldMandatory('custpage_agr_target', true)
        calcTotalReneual();
        debugger;
        for (var i = 1; i <= lines; i++) {
            var agreement_id = nlapiGetLineItemValue('custpage_res_sublist', 'custpage_agr_line_new_agr', i)
            var targetAgr = nlapiGetFieldValue('custpage_agr_target')
            if (agreement_id == targetAgr) {
                //nlapiSetLineItemValue('custpage_res_sublist', 'custpage_process', i, 'F')
                nlapiSelectLineItem('custpage_res_sublist', i)
                nlapiSetCurrentLineItemValue('custpage_res_sublist', 'custpage_process', 'F');
                nlapiCommitLineItem('custpage_res_sublist');
                nlapiSetLineItemDisabled('custpage_res_sublist', 'custpage_process', true, i)     
            }
        }
    }

}
function save() {
    var action = nlapiGetFieldValue('custpage_action')
    if (action == 2) {
        if (!ValidationField('custpage_agr_second')) { return; }
    }
    return true;
}
function fieldChange(type, name, linenum) {
    debugger;
    if (name == 'custpage_customer' || name == 'custpage_action') {
        var customer = nlapiGetFieldValue('custpage_customer');
        var action = nlapiGetFieldValue('custpage_action');
        if (!isNullOrEmpty(customer) && !isNullOrEmpty(action)) {
            var field2 = '';
            if (action == 1) {
                var field = 'custpage_agr'
                nlapiGetField('custpage_agr').setDisplayType('normal');
                nlapiGetField('custpage_agr_second').setDisplayType('hidden');
                nlapiGetField('custpage_percent').setDisplayType('normal');
                nlapiGetField('custpage_agr_target').setDisplayType('hidden');
                hidden('custpage_renewal_amount_val', false)
                hidden('custpage_dis_val', true)

            }
            else if (action == 2) {
                field = 'custpage_agr_second'
                nlapiGetField('custpage_agr_second').setDisplayType('normal');
                nlapiGetField('custpage_agr').setDisplayType('hidden');
                nlapiGetField('custpage_percent').setDisplayType('hidden');
                nlapiGetField('custpage_agr_target').setDisplayType('hidden');
                hidden('custpage_renewal_amount_val', true)
                hidden('custpage_dis_val', true)

            }
            else {
                field = 'custpage_agr'
                field2 = 'custpage_agr_target'
                action = 1
                nlapiGetField('custpage_agr_second').setDisplayType('hidden');
                nlapiGetField('custpage_agr').setDisplayType('normal');
                nlapiGetField('custpage_percent').setDisplayType('normal');
                nlapiGetField('custpage_agr_target').setDisplayType('normal');
                nlapiSetFieldMandatory('custpage_agr_target', true)
                hidden('custpage_renewal_amount_val', false)
                hidden('custpage_dis_val', false)

            }

            nlapiSetFieldMandatory(field, true)
            var agrList = customer_agr(customer, action);
            nlapiRemoveSelectOption(field);
            if (agrList.length > 0) {
                nlapiInsertSelectOption(field, '', '', false)
                for (var i = 0; i < agrList.length; i++) {
                    nlapiInsertSelectOption(field, agrList[i].id, agrList[i].name, false);
                }
            }
            if (!isNullOrEmpty(field2)) {
                var agrList = customer_agr(customer, 3);
                nlapiRemoveSelectOption(field2);
                if (agrList.length > 0) {
                    nlapiInsertSelectOption(field2, '', '', false)
                    for (var i = 0; i < agrList.length; i++) {
                        nlapiInsertSelectOption(field2, agrList[i].id, agrList[i].name, false);
                    }
                }
            }
        }
    }
    else if (name == 'custpage_new_amount' && type == null) {
        var new_amount = nlapiGetFieldValue('custpage_new_amount');
        if (!isNullOrEmpty(new_amount)) {
            var lines = nlapiGetLineItemCount('custpage_res_sublist');
            for (var i = 1; i <= lines; i++) {
                nlapiSelectLineItem('custpage_res_sublist', i)
                nlapiSetCurrentLineItemValue('custpage_res_sublist', 'custpage_new_amount', new_amount);
                nlapiCommitLineItem('custpage_res_sublist');
            }
        }
        calcTotalReneual()
    }
    else if (name == 'custpage_update' || name == 'custpage_new_amount') {
        calcTotalReneual()
    }
    else if (name == 'custpage_agr_target') {
        var agr = nlapiGetFieldValue('custpage_agr_target')
        if (!isNullOrEmpty(agr)) {

        }
        else {
            nlapiSetFieldValue('custpage_dis', "<p style='font-size:20px'>Discount: No target agreement has been selected yet")
        }
        calcTotalReneual()

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
function customer_agr(customer, action) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_agr_bill_cust', null, 'is', customer)
    filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F')
    filters[2] = new nlobjSearchFilter('custrecord_agr_type', null, 'noneof', '2')

    if (action == 2 || action == 3) {
        filters[2] = new nlobjSearchFilter('custrecord_agr_status', null, 'anyof', 3)
    }
    else {
        filters[2] = new nlobjSearchFilter('custrecord_agr_status', null, 'anyof', 1)
    }

    var search = nlapiCreateSearch('customrecord_agreement', filters, columns);

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
function calcTotalReneual() {
    var linecount = nlapiGetLineItemCount('custpage_res_sublist');
    var sum = 0;
    for (var i = 1; i <= linecount; i++) {
        if (nlapiGetLineItemValue('custpage_res_sublist', 'custpage_update', i) == 'F') {
            sum += Number(nlapiGetLineItemValue('custpage_res_sublist', 'custpage_rate', i))
        }
        else {
            sum += Number(nlapiGetLineItemValue('custpage_res_sublist', 'custpage_new_amount', i))
        }
    }
    var action = nlapiGetFieldValue('custpage_action');
    var agr = nlapiGetFieldValue('custpage_agr_target')
    if (!isNullOrEmpty(agr) && action == 3) {
        var dis = nlapiLookupField('customrecord_agreement', agr, 'custrecord_agr_discount')
        nlapiSetFieldValue('custpage_dis', "<p style='font-size:20px'>Discount: " + dis)
        if (!isNullOrEmpty(dis) && dis != '0.0%') {
            sum = sum - (sum * parseFloat(dis) / 100)
        }
    }
    nlapiSetFieldValue('custpage_renewal_amount', "<p style='font-size:20px'>Renewal Amount: " + formatNumber(sum))
}
function formatNumber(num) {
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return num

}
function hidden(field, type) {
    var field = document.getElementById(field)
    if (!isNullOrEmpty(field)) {
        field.hidden = type;
    }
}
//document.getElementById("custpage_res_sublistmarkall").onclick = function () { calcTotalReneual() };
document.getElementById("custpage_res_sublistmarkall").addEventListener("click", calcTotalReneual);
document.getElementById("custpage_res_sublistunmarkall").addEventListener("click", calcTotalReneual);
// document.getElementById("tbl_customscript_continue").style.display ='none'
// document.getElementById("tbl_customscript_continue").style.display ='table'