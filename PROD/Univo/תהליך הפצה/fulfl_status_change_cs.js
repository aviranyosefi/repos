function fnExcelReport() {

    var tab_text = "<head><meta charset='UTF-8'></head><table border='2px'><tr bgcolor='#87AFC6'>";
    tab = document.getElementById('custpage_results_sublist_splits'); // id of table

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