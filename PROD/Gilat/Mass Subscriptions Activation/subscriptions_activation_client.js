function go_back() {
    var linkBack = nlapiGetFieldValue('custpage_ilo_to_back_home');
    window.location.href = linkBack;   
}

function counter_field(type, name) {
    debugger;
    if (name == 'custpage_resultssublist_checkbox') {
        $toggleBoxes = document.querySelectorAll('.checkbox_ck');
        nlapiSetFieldValue('custpage_ilo_counter', $toggleBoxes.length, null, null);
    }
 
}


function MarkAll() {
    var LineCount = nlapiGetLineItemCount('custpage_results_sublist');
    if (LineCount != 0) {

        for (var i = 0; i < LineCount; i++) {
            nlapiSetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i + 1, 'T');
        }
        $toggleBoxes = document.querySelectorAll('.checkbox_ck');
        nlapiSetFieldValue('custpage_ilo_counter', $toggleBoxes.length, null, null);
    }
}


function UnmarkAll() {
    var LineCount = nlapiGetLineItemCount('custpage_results_sublist');
    if (LineCount != 0) {

        for (var i = 0; i < LineCount; i++) {
            nlapiSetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i + 1, 'F');
        }
        nlapiSetFieldValue('custpage_ilo_counter', 0, null, null);
    }
}