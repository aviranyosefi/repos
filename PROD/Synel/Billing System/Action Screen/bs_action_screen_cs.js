function Continue() {
    var action = nlapiGetFieldValue('custpage_action')
    var type = nlapiGetFieldValue('custpage_type')
    if (isNullOrEmpty(type)) {
        alert("Please enter value(s) for: TYPE")
        return;
    }
    if (!isNullOrEmpty(action)) {
        var res = validateActionToType(action, type)
        if (!res) {
            alert('This option cannot be selected')
            return false;
        }
        else {
            if (action == 3) {
                if (!ValidationField('custpage_customer')) { return; }
                if (!ValidationField('custpage_new_fromdate')) { return; }
                if (!ValidationField('custpage_new_todate')) { return; }
                if (!ValidationData()) { return; }
            }
            else if (action == 4) {
                if (!ValidationField('custpage_new_fromdate')) { return; }
                if (!ValidationField('custpage_new_todate')) { return; }
                if (!ValidationField('custpage_percent')) { return; }
                if (!ValidationField('custpage_agr')) { return; }
                if (!ValidationData()) { return; }
            }
            else if (action == 5) {
                if (!ValidationField('custpage_agr')) { return; }
                if (!ValidationData()) { return; }
            }
            else if (action == 6) {
                if (!ValidationField('custpage_percent')) { return; }
            }
        } 
    }
    else {
        alert("Please enter value(s) for: ACTION")
        return;
    }
    nlapiSetFieldValue('custpage_page', '1')
    document.getElementById("submitter").click()
}
//Agreement Line Action Screen
//Agreement for Action Screen
function EXCLUDE() {
    var custpage_action = nlapiGetFieldValue('custpage_action');
    var agr = nlapiGetFieldValue('custpage_agr');
    var employee = nlapiGetFieldValue('custpage_employee');
    var customer = nlapiGetFieldValue('custpage_customer');
    var business_line = nlapiGetFieldValue('custpage_business_line');
    var fromdate = nlapiGetFieldValue('custpage_select_fromdate');
    var todate = nlapiGetFieldValue('custpage_select_todate');
    if (custpage_action == 6) {
        Url = 'https://system.netsuite.com/app/common/search/searchresults.nl?searchid=792&whence='
        if (!isNullOrEmpty(agr)) {
            Url += '&CUSTRECORD_AGR_LINE_AGREEMENT=' + agr
        }
        if (!isNullOrEmpty(employee)) {
            Url += '&AIH_CUSTRECORD_AGR_HANDLED_BY=' + employee
        }
        if (!isNullOrEmpty(customer)) {
            Url += '&AIH_CUSTRECORD_AGR_BILL_CUST=' + customer
        }
        if (!isNullOrEmpty(business_line)) {
            Url += '&CUSTRECORD_AGR_LINE_BUS_LINE=' + business_line
        }
        if (!isNullOrEmpty(fromdate) && isNullOrEmpty(todate)) {
            Url += '&CUSTRECORD_BILL_PLAN_BILLING_ON_DATErange=CUSTOM&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfrom=' + fromdate + '&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel_formattedValue=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromreltype=DAGO&style=NORMAL&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEmodi=WITHIN&CUSTRECORD_BILL_PLAN_BILLING_ON_DATE=CUSTOM'
        }
        if (!isNullOrEmpty(todate) && isNullOrEmpty(fromdate)) {
            Url += '&CUSTRECORD_BILL_PLAN_BILLING_ON_DATErange=CUSTOM&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEto=' + todate + '&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel_formattedValue=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtoreltype=DAGO&style=NORMAL&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEmodi=WITHIN&CUSTRECORD_BILL_PLAN_BILLING_ON_DATE=CUSTOM'
        }
        if (!isNullOrEmpty(todate) && !isNullOrEmpty(fromdate)) {
            Url += '&rectype=129&CUSTRECORD_BILL_PLAN_BILLING_ON_DATErange=CUSTOM&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfrom=' + fromdate + '&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel_formattedValue=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromreltype=DAGO&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEto=' + todate + '&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel_formattedValue=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtoreltype=DAGO&style=NORMAL&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEmodi=WITHIN&CUSTRECORD_BILL_PLAN_BILLING_ON_DATE=CUSTOM&report=&grid=&dle=T&sortcol=Custom_ID_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=NY3m359y3fysT7jpf6kC-Wp8m89pC_JKQmMVJpf_1xJEsXB4n8FUozTTJfdEUWJVzKjqngoiTV0sdwdXbcVmxo8EXdDJBRLRC7Mz49y98qih0BlfV74kFe950PeE4vgLTUtQ2CpgZUgVzyjSW9pEMVYp-b6JLL90Pv_kZ9oFicI%3D&twbx=F'
        }
    }
    else if (custpage_action == 1 || custpage_action == 2) {
        Url = 'https://system.netsuite.com/app/common/search/searchresults.nl?searchid=789&whence='
        if (!isNullOrEmpty(agr)) {
            Url += '&Custom_INTERNALID=' + agr
        }
        if (!isNullOrEmpty(employee)) {
            Url += '&AIH_CUSTRECORD_AGR_HANDLED_BY=' + employee
        }
        if (!isNullOrEmpty(customer)) {
            Url += '&AIH_CUSTRECORD_AGR_BILL_CUST=' + customer
        }
        if (!isNullOrEmpty(fromdate) && isNullOrEmpty(todate)) {
            Url += '&searchtype=Custom&CUSTRECORD_AGR_RENEW_DATErange=CUSTOM&CUSTRECORD_AGR_RENEW_DATEfrom=' + fromdate+'&CUSTRECORD_AGR_RENEW_DATEfromrel_formattedValue=&CUSTRECORD_AGR_RENEW_DATEfromrel=&CUSTRECORD_AGR_RENEW_DATEfromreltype=DAGO&CUSTRECORD_AGR_RENEW_DATEto=&CUSTRECORD_AGR_RENEW_DATEtorel_formattedValue=&CUSTRECORD_AGR_RENEW_DATEtorel=&CUSTRECORD_AGR_RENEW_DATEtoreltype=DAGO&style=NORMAL&CUSTRECORD_AGR_RENEW_DATEmodi=WITHIN&CUSTRECORD_AGR_RENEW_DATE=CUSTOM&report=&grid=&searchid=789&dle=T&sortcol=Custom_NAME_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=wIH7zdMZKMkHdMs89nFWG4LECMKnWdTeq8wysAH3UX3kvhA7uVyNgIeP6v_HNXXHemBGRpmsFH_5mB4Co2r4Yn4E8whDuAxZL51U3m5NytxGjaU-zfaPvIgouldAVkZ2GoCWfiS24Yj1UoSin5dH6hZm70xnckc0KetsxMADWL0%3D&twbx=F'
        }
        if (!isNullOrEmpty(todate) && isNullOrEmpty(fromdate)) {
            Url += 'searchtype=Custom&CUSTRECORD_AGR_RENEW_DATErange=CUSTOM&CUSTRECORD_AGR_RENEW_DATEfrom=&CUSTRECORD_AGR_RENEW_DATEfromrel_formattedValue=&CUSTRECORD_AGR_RENEW_DATEfromrel=&CUSTRECORD_AGR_RENEW_DATEfromreltype=DAGO&CUSTRECORD_AGR_RENEW_DATEto=' + todate + '&CUSTRECORD_AGR_RENEW_DATEtorel_formattedValue=&CUSTRECORD_AGR_RENEW_DATEtorel=&CUSTRECORD_AGR_RENEW_DATEtoreltype=DAGO&style=NORMAL&CUSTRECORD_AGR_RENEW_DATEmodi=WITHIN&CUSTRECORD_AGR_RENEW_DATE=CUSTOM&report=&grid=&searchid=789&dle=T&sortcol=Custom_NAME_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=wIH7zdMZKMkHdMs89nFWG4LECMKnWdTeq8wysAH3UX3kvhA7uVyNgIeP6v_HNXXHemBGRpmsFH_5mB4Co2r4Yn4E8whDuAxZL51U3m5NytxGjaU-zfaPvIgouldAVkZ2GoCWfiS24Yj1UoSin5dH6hZm70xnckc0KetsxMADWL0%3D&twbx=F'
        }
        if (!isNullOrEmpty(todate) && !isNullOrEmpty(fromdate)) {
            Url += '&searchtype=Custom&CUSTRECORD_AGR_RENEW_DATErange=CUSTOM&CUSTRECORD_AGR_RENEW_DATEfrom=' + fromdate + '&CUSTRECORD_AGR_RENEW_DATEfromrel_formattedValue=&CUSTRECORD_AGR_RENEW_DATEfromrel=&CUSTRECORD_AGR_RENEW_DATEfromreltype=DAGO&CUSTRECORD_AGR_RENEW_DATEto=' + todate + '&CUSTRECORD_AGR_RENEW_DATEtorel_formattedValue=&CUSTRECORD_AGR_RENEW_DATEtorel=&CUSTRECORD_AGR_RENEW_DATEtoreltype=DAGO&style=NORMAL&CUSTRECORD_AGR_RENEW_DATEmodi=WITHIN&CUSTRECORD_AGR_RENEW_DATE=CUSTOM&report=&grid=&searchid=789&dle=T&sortcol=Custom_NAME_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=wIH7zdMZKMkHdMs89nFWG4LECMKnWdTeq8wysAH3UX3kvhA7uVyNgIeP6v_HNXXHemBGRpmsFH_5mB4Co2r4Yn4E8whDuAxZL51U3m5NytxGjaU-zfaPvIgouldAVkZ2GoCWfiS24Yj1UoSin5dH6hZm70xnckc0KetsxMADWL0%3D&twbx=F'
        }
        Url += '&CUSTRECORD_AGR_RENEW_TYPE=' + custpage_action
       

    }
    else {
        Url = '';
        alert('this button is not available for this action')
    }
    if (Url != '') {
        window.open(Url);
    }
    else { alert('please choose action') }
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
function save() {
    var action = nlapiGetFieldValue('custpage_action')
    var type = nlapiGetFieldValue('custpage_type')
    var res = validateActionToType(action, type)
    if (!res) {
        alert('This option cannot be selected')
        return false;
    }
    else {
        if (action == 3) {
            if (!ValidationField('custpage_customer')) { return; }
            if (!ValidationField('custpage_new_fromdate')) { return; }
            if (!ValidationField('custpage_new_todate')) { return; }
        }
        else if (action == 4) {
            if (!ValidationField('custpage_percent')) { return; }
            if (!ValidationField('custpage_new_fromdate')) { return; }
            if (!ValidationField('custpage_new_todate')) { return; }
            if (!ValidationField('custpage_agr')) { return; }
        }
        else if (action == 5) {
            if (!ValidationField('custpage_agr')) { return; }
        }
        else if (action == 6) {
            if (!ValidationField('custpage_percent')) { return; }
        } 

    }
 
    return true;
}
function pageload() {
    var action = nlapiGetFieldValue('custpage_action')
    if (action == 6) {
        nlapiSetFieldMandatory('custpage_select_fromdate', false)
        nlapiSetFieldMandatory('custpage_select_todate', false)
        nlapiGetField('custpage_select_fromdate').setDisplayType('hidden')
        nlapiGetField('custpage_select_todate').setDisplayType('hidden')
    }
    else {
        nlapiGetField('custpage_new_fromdate').setDisplayType('hidden')
        nlapiGetField('custpage_new_todate').setDisplayType('hidden')
        nlapiGetField('custpage_business_line').setDisplayType('hidden')
    }
    if (action == '3') { // איחוד הסכמים
        nlapiSetFieldMandatory('custpage_customer', true)
        nlapiSetFieldMandatory('custpage_new_fromdate', true)
        nlapiSetFieldMandatory('custpage_new_todate', true)
        nlapiGetField('custpage_new_fromdate').setDisplayType('normal')
        nlapiGetField('custpage_new_todate').setDisplayType('normal');
        nlapiGetField('custpage_business_line').setDisplayType('hidden')
        return;
    }
    else {
        nlapiSetFieldMandatory('custpage_new_fromdate', false)
        nlapiSetFieldMandatory('custpage_new_todate', false)
        nlapiGetField('custpage_new_fromdate').setDisplayType('hidden')
        nlapiGetField('custpage_new_todate').setDisplayType('hidden')
    }
}
function fieldChange(type, name) {
    if (name == 'custpage_action' && !isNullOrEmpty(nlapiGetFieldValue('custpage_action'))) {
        var action = nlapiGetFieldValue('custpage_action')
        if (action == '3') { // איחוד הסכמים
            nlapiSetFieldMandatory('custpage_customer', true)
            nlapiSetFieldMandatory('custpage_new_fromdate', true)
            nlapiSetFieldMandatory('custpage_new_todate', true)
            nlapiGetField('custpage_new_fromdate').setDisplayType('normal')
            nlapiGetField('custpage_new_todate').setDisplayType('normal');
            nlapiGetField('custpage_business_line').setDisplayType('hidden')
            return;
        }
        else {
            nlapiSetFieldMandatory('custpage_new_fromdate', false)
            nlapiSetFieldMandatory('custpage_new_todate', false)
            nlapiGetField('custpage_new_fromdate').setDisplayType('hidden')
            nlapiGetField('custpage_new_todate').setDisplayType('hidden')
        }
        if (action == '4') { // הנחה תקופתית
            nlapiSetFieldMandatory('custpage_new_fromdate', true)
            nlapiSetFieldMandatory('custpage_new_todate', true)
            nlapiGetField('custpage_new_fromdate').setDisplayType('normal')
            nlapiGetField('custpage_new_todate').setDisplayType('normal')
            nlapiSetFieldMandatory('custpage_percent', true)
            nlapiSetFieldMandatory('custpage_agr', true)
            nlapiSetFieldMandatory('custpage_select_fromdate', false)
            nlapiSetFieldMandatory('custpage_select_todate', false)
            nlapiGetField('custpage_select_fromdate').setDisplayType('hidden')
            nlapiGetField('custpage_select_todate').setDisplayType('hidden')
            nlapiGetField('custpage_business_line').setDisplayType('hidden')
            return;
        }
        else {
            nlapiSetFieldMandatory('custpage_customer', false)
            nlapiSetFieldMandatory('custpage_new_fromdate', false)
            nlapiSetFieldMandatory('custpage_new_todate', false)
            nlapiGetField('custpage_new_fromdate').setDisplayType('hidden')
            nlapiGetField('custpage_new_todate').setDisplayType('hidden')
            nlapiSetFieldMandatory('custpage_percent', false)
            nlapiSetFieldMandatory('custpage_agr', false)
        }
        if (action == '5') { // הסרת שורות ,הנחות תקופתיות
            nlapiSetFieldMandatory('custpage_agr', true)
            nlapiGetField('custpage_business_line').setDisplayType('hidden')
            return;
        }
        else {
            nlapiSetFieldMandatory('custpage_agr', false)
        }
        if (action == '6') { // העלאת תעריפים
            nlapiGetField('custpage_business_line').setDisplayType('normal')
            nlapiSetFieldMandatory('custpage_select_fromdate', false)
            nlapiSetFieldMandatory('custpage_select_todate', false)
            nlapiGetField('custpage_select_fromdate').setDisplayType('hidden')
            nlapiGetField('custpage_select_todate').setDisplayType('hidden')
            nlapiSetFieldMandatory('custpage_percent', true)
            return;
        }
        else {
            nlapiGetField('custpage_business_line').setDisplayType('hidden')
            nlapiGetField('custpage_select_fromdate').setDisplayType('normal')
            nlapiGetField('custpage_select_todate').setDisplayType('normal')
            nlapiSetFieldMandatory('custpage_percent', false)
        }
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
        alert("Please enter value(s) for: "+label)
        return false;
    }
    return true;
}
function ValidationData() {
    debugger;
    var lineCount = nlapiGetLineItemCount('custpage_res_sublist')
    if (lineCount == 0 || lineCount == -1 ) {
        alert("Please Press On Refresh Button and Choose Data before ")
        return false
    }
    return true
}
// document.getElementById("tbl_customscript_continue").style.display ='none'
// document.getElementById("tbl_customscript_continue").style.display ='table'