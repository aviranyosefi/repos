


function go_back() {
    var linkBack = nlapiGetFieldValue('custpage_ilo_to_back_home');
    window.location.href = linkBack;
}


function pageLoad() {

    var check = 'Not in Stock';

    var checkStatus = nlapiGetFieldValue('custpage_summary_location');

    if (checkStatus != "") {

        check = 'In Stock';
    }
    nlapiSetFieldValue('custpage_summary_status', check, null, null);
}