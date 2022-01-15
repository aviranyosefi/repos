
function fieldChange(type,name) {
    if (name == 'custpage_measure') {
        var measureData = nlapiGetFieldValue('custpage_measure');        
        if (!isNullOrEmpty(measureData) && measureData != '2' && measureData != '1') {
            nlapiGetField('custpage_dimension').setDisplayType('disabled');
        }
        else {
            nlapiGetField('custpage_dimension').setDisplayType('normal');
        }
    
    }
}

function fnExcelReport() {
    debugger;
    var tab_text = '<h3> Type:' + nlapiGetFieldText('custpage_ilo_type') + '</h3>';
     tab_text += '<h3> Year:' + nlapiGetFieldText('custpage_ilo_year') + '</h3>'
    tab_text += "<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange;
    var j = 0;
    tab = document.getElementById('custpage_re_sublist_splits'); // id of table

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
    debugger;
    var custpage_ilo_type = nlapiGetFieldValue("custpage_ilo_type");
    if (custpage_ilo_type == '1') {
        var custpage_from_mounth = nlapiGetFieldValue("custpage_from_mounth");
        var custpage_to_mounth = nlapiGetFieldValue("custpage_to_mounth");
        if (Number(custpage_from_mounth) > Number(custpage_to_mounth) ) {
            alert('TO month cant be bigger from FROM month')
            nlapiSetFieldValue("custpage_from_mounth" ,1);
            nlapiSetFieldValue("custpage_to_mounth",12);
            return false;
        }
        return true;
    }
    return true;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}