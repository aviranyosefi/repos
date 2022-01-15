function Continue() {
    nlapiSetFieldValue('custpage_page', nlapiGetFieldValue('custpage_type'))
       document.getElementById("submitter").click()  
}

function fnExcelReport() {
    debugger;
    var tab_text = "<head><meta charset='UTF-8'></head>"; 
    tab_text += "<table border='2px'><tr bgcolor='#87AFC6'>";
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

//Billing Plan Invoice Screen
//Agreement Invoice Screen 
function EXCLUDE() {
    var agrType = nlapiGetFieldValue('custpage_type');
    var agr = nlapiGetFieldValue('custpage_agr');
    var agr_line = nlapiGetFieldValue('custpage_agr_line');
    var employee = nlapiGetFieldValue('custpage_employee');
    var customer = nlapiGetFieldValue('custpage_customer');
    var fromdate = nlapiGetFieldValue('custpage_select_fromdate');
    var todate = nlapiGetFieldValue('custpage_select_todate');
    if (agrType == 1) {   
        //&CUSTRECORD_BILL_PLAN_BILLING_ON_DATErange=CUSTOM&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfrom=01%2F01%2F2021&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel_formattedValue=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromreltype=DAGO&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEto=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel_formattedValue=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtoreltype=DAGO&style=NORMAL&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEmodi=WITHIN&CUSTRECORD_BILL_PLAN_BILLING_ON_DATE=CUSTOM&report=&grid=&searchid=830&dle=T&sortcol=Custom_ID_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=NY3m359y3fysT7jpf6kC-Wp8m89pC_JKQmMVJpf_1xJEsXB4n8FUozTTJfdEUWJVzKjqngoiTV0sdwdXbcVmxo8EXdDJBRLRC7Mz49y98qih0BlfV74kFe950PeE4vgLTUtQ2CpgZUgVzyjSW9pEMVYp-b6JLL90Pv_kZ9oFicI%3D&twbx=F
        Url = 'https://system.netsuite.com/app/common/search/searchresults.nl?searchid=830&saverun=T&whence='
        //Url = "https://system.netsuite.com" + nlapiResolveURL('mediaitem', 830, 'customsearch_agreement_service')
        if (!isNullOrEmpty(agr)) {
            Url += '&CUSTRECORD_BILL_PLAN_AGR=' + agr
        }
        if (!isNullOrEmpty(agr_line)) {
            Url += '&CUSTRECORD_BILL_PLAN_AGR_LINE=' + agr_line
        }
        if (!isNullOrEmpty(fromdate) && isNullOrEmpty(todate)) {
            Url += '&CUSTRECORD_BILL_PLAN_BILLING_ON_DATErange=CUSTOM&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfrom=' + fromdate + '&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel_formattedValue=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromreltype=DAGO&style=NORMAL&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEmodi=WITHIN&CUSTRECORD_BILL_PLAN_BILLING_ON_DATE=CUSTOM'
        }
        if (!isNullOrEmpty(todate) && isNullOrEmpty(fromdate)) {
            Url += '&CUSTRECORD_BILL_PLAN_BILLING_ON_DATErange=CUSTOM&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEto=' + todate +'&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel_formattedValue=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtoreltype=DAGO&style=NORMAL&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEmodi=WITHIN&CUSTRECORD_BILL_PLAN_BILLING_ON_DATE=CUSTOM'
        }
        if (!isNullOrEmpty(todate) && !isNullOrEmpty(fromdate)) {
            Url += '&rectype=129&CUSTRECORD_BILL_PLAN_BILLING_ON_DATErange=CUSTOM&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfrom=' + fromdate + '&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel_formattedValue=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromreltype=DAGO&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEto=' + todate+'&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel_formattedValue=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel=&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtoreltype=DAGO&style=NORMAL&CUSTRECORD_BILL_PLAN_BILLING_ON_DATEmodi=WITHIN&CUSTRECORD_BILL_PLAN_BILLING_ON_DATE=CUSTOM&report=&grid=&dle=T&sortcol=Custom_ID_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=NY3m359y3fysT7jpf6kC-Wp8m89pC_JKQmMVJpf_1xJEsXB4n8FUozTTJfdEUWJVzKjqngoiTV0sdwdXbcVmxo8EXdDJBRLRC7Mz49y98qih0BlfV74kFe950PeE4vgLTUtQ2CpgZUgVzyjSW9pEMVYp-b6JLL90Pv_kZ9oFicI%3D&twbx=F'

        }

    }
    else if (agrType == 2) {
        Url = 'https://system.netsuite.com/app/common/search/searchresults.nl?scrollid=793&searchid=793&refresh=&whence='
        //Url ='https://system.netsuite.com'+nlapiResolveURL('mediaitem', 793, 'customsearch_agreement_invoice_screen')
        if (!isNullOrEmpty(agr)) {
            Url += '&Custom_INTERNALID=' + agr
        }
        if (!isNullOrEmpty(employee)) {
            Url += '&CUSTRECORD_AGR_HANDLED_BY=' + employee
        } 
        if (!isNullOrEmpty(fromdate) && isNullOrEmpty(todate)) {
            Url += '&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATErange=CUSTOM&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfrom=' + fromdate+'&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel_formattedValue=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromreltype=DAGO&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEto=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel_formattedValue=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtoreltype=DAGO&style=NORMAL&Custom_NAMEtype=STARTSWITH&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEmodi=WITHIN&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATE=CUSTOM&report=&grid=&searchid=793&dle=T&sortcol=Custom_NAME_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=NY3m359y3fysT7jpf6kC-Wp8m89pC_JKQmMVJpf_1xJEsXB4n8FUozTTJfdEUWJVzKjqngoiTV0sdwdXbcVmxo8EXdDJBRLRC7Mz49y98qih0BlfV74kFe950PeE4vgLTUtQ2CpgZUgVzyjSW9pEMVYp-b6JLL90Pv_kZ9oFicI%3D&twbx=F'
        }
        if (!isNullOrEmpty(todate) && isNullOrEmpty(fromdate)) {
            Url += '&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATErange=CUSTOM&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfrom=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel_formattedValue=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromreltype=DAGO&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEto=' + todate+'&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel_formattedValue=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtoreltype=DAGO&style=NORMAL&Custom_NAMEtype=STARTSWITH&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEmodi=WITHIN&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATE=CUSTOM&report=&grid=&searchid=793&dle=T&sortcol=Custom_NAME_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=NY3m359y3fysT7jpf6kC-Wp8m89pC_JKQmMVJpf_1xJEsXB4n8FUozTTJfdEUWJVzKjqngoiTV0sdwdXbcVmxo8EXdDJBRLRC7Mz49y98qih0BlfV74kFe950PeE4vgLTUtQ2CpgZUgVzyjSW9pEMVYp-b6JLL90Pv_kZ9oFicI%3D&twbx=F'
        }
        if (!isNullOrEmpty(todate) && !isNullOrEmpty(fromdate)) {
            Url += '&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATErange=CUSTOM&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfrom=' + fromdate + '&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel_formattedValue=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromrel=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEfromreltype=DAGO&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEto=' + todate+'&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel_formattedValue=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtorel=&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEtoreltype=DAGO&style=NORMAL&Custom_NAMEtype=STARTSWITH&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATEmodi=WITHIN&AII_CUSTRECORD_BILL_PLAN_BILLING_ON_DATE=CUSTOM&report=&grid=&searchid=793&dle=T&sortcol=Custom_NAME_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=NY3m359y3fysT7jpf6kC-Wp8m89pC_JKQmMVJpf_1xJEsXB4n8FUozTTJfdEUWJVzKjqngoiTV0sdwdXbcVmxo8EXdDJBRLRC7Mz49y98qih0BlfV74kFe950PeE4vgLTUtQ2CpgZUgVzyjSW9pEMVYp-b6JLL90Pv_kZ9oFicI%3D&twbx=F'

        }  


        
    }
    else { Url = ''; }
    if (Url != '') {
        console.log(Url)
        window.open(Url);
    }
    else {alert('please choose type')}  
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
