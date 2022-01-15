function fnExcelReport() {
    nlapiLogExecution('DEBUG', 'fnExcelReport', 'fnExcelReport');
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

function printPackingSlips() {
    nlapiLogExecution('DEBUG', 'printPackingSlips', 'printPackingSlips');
    var ff_arr = '';
    var line_count = nlapiGetLineItemCount('custpage_results_sublist');
    for (i = 1; i <= line_count; i++) {
        if (nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i) == 'T') {
            ff_arr += nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_itf_id', i) + ',';
        }
    }
    if (!isNullOrEmpty(ff_arr)) {
        ff_arr = ff_arr.substring(0, ff_arr.length - 1);
        nlapiSubmitField('customrecord_ff_for_ship_print', 1, 'custrecord_ff_for_print', ff_arr);
        nlapiLogExecution('DEBUG', 'ff_arr', ff_arr);

        var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_print_packing_slip_screen', 'customdeploy_print_packing_slip_scrn_dep', false);
        window.open(createdPdfUrl);
    }
}


function printPackingStickers() {
    nlapiLogExecution('DEBUG', 'printPackingStickers', 'printPackingStickers');
    var ff_arr = '';
    var line_count = nlapiGetLineItemCount('custpage_results_sublist');
    for (i = 1; i <= line_count; i++) {
        if (nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i) == 'T') {
            ff_arr += nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_itf_id', i) + ',';
        }
    }
    if (!isNullOrEmpty(ff_arr)) {
        ff_arr = ff_arr.substring(0, ff_arr.length - 1);
        nlapiSubmitField('customrecord_ff_for_ship_print', 1, 'custrecord_ff_for_print', ff_arr);
        nlapiLogExecution('DEBUG', 'ff_arr', ff_arr);

        var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_print_packing_stiker_screen', 'customdeploy_print_packing_stic_scrn_dep', false);
        window.open(createdPdfUrl);
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

