// JavaScript source code
function Update() {
    try {

        var rec_type = nlapiGetRecordType();
        var rec_id = nlapiGetRecordId()
           
        var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_update_serial_detail_suitel', 'customdeploy_update_serial_detail_dep', false);
        createdPdfUrl += '&rec_type=' + rec_type;
        createdPdfUrl += '&rec_id=' + rec_id;
        newWindow = window.open(createdPdfUrl);
        }
 
    catch (e) {
        nlapiLogExecution('error', 'onclick_payment_request().', e);
    }
}


function MarkAll() {
    var LineCount = nlapiGetLineItemCount('custpage_results_sublist');
    if (LineCount != 0) {

        for (var i = 0; i < LineCount; i++) {
            nlapiSetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i + 1, 'T');
        }
    }
}


function UnmarkAll() {
    var LineCount = nlapiGetLineItemCount('custpage_results_sublist');
    if (LineCount != 0) {

        for (var i = 0; i < LineCount; i++) {
            nlapiSetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i + 1, 'F');
        }
    }
}



function FieldChange(type, name) {

    if (name == 'custpage_ilo_multi_version') {

        var version = nlapiGetFieldValue('custpage_ilo_multi_version');
       
        var LineCount = nlapiGetLineItemCount('custpage_results_sublist');
       
        if (LineCount != 0) {

            for (var i = 0; i < LineCount; i++) {               
               var cb =  nlapiGetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i + 1);
                if (cb == 'T') {
                    nlapiSetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_version_new', i + 1, version);
                }
            }
        }
        return true;

    }

    return true;

}