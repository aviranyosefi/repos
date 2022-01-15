
function counter_field(type, name) {
    
    if (name == 'custpage_resultssublist_checkbox') {
        $toggleBoxes = document.querySelectorAll('.checkbox_ck');
        nlapiSetFieldValue('custpage_ilo_counter', $toggleBoxes.length, null, null);
    }
    if (name == 'custpage_ilo_auto_mark') {

        var number = nlapiGetFieldValue('custpage_ilo_auto_mark')
        var LineCount = nlapiGetLineItemCount('custpage_results_sublist');
        for (var i = 1;  i<= LineCount; i++) {
            if (i <= number) {
                nlapiSetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i, 'T');
            }
            else {
                nlapiSetLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i, 'F');

            }
            
        }
        $toggleBoxes = document.querySelectorAll('.checkbox_ck');
        nlapiSetFieldValue('custpage_ilo_counter', $toggleBoxes.length, null, null);

    }


}
//jQuery(document).ready(function () {
//    jQuery("#custpage_results_sublist_splits tbody tr ").on("click", function () {
//        $toggleBoxes = document.querySelectorAll('.checkbox_ck');
//        nlapiSetFieldValue('custpage_ilo_counter', $toggleBoxes.length, null, null);
//    });
//});


function go_back() {
    var linkBack = nlapiGetFieldValue('custpage_ilo_to_back_home');
    window.location.href = linkBack;
}