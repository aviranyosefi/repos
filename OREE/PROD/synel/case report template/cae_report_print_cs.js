function printButton() {
    //lotId = nlapiGetFieldValue('custbody_medicane_sub_lot')
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_case_report_print_suitelet', 'customdeploy_case_report_print_suitelet', false);
    createdPdfUrl += '&id=' + nlapiGetRecordId() + '&mail=-1'; 
            window.open(createdPdfUrl);   
}

function mailAndPrintButton() {
    var rec = nlapiLoadRecord('supportcase', nlapiGetRecordId())
    defaultmail = rec.getFieldValue('email')
    var mail = prompt('please enter mail address:', defaultmail);
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_case_report_print_suitelet', 'customdeploy_case_report_print_suitelet', false);
    createdPdfUrl += '&id=' + nlapiGetRecordId() +'&mail=' + mail;
    window.open(createdPdfUrl);
}