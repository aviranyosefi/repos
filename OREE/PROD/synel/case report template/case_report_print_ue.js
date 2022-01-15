function beforeLoad_addButton(type, form) { 
    if (type == 'view' && nlapiGetFieldValue('status') == '5') {   
        form.setScript('customscript_cae_report_print_cs'); // client script id
        form.addButton('custpage_button_print', 'Print Case Report', 'printButton()');
        form.addButton('custpage_button_mailprint', 'Mail Case Report', 'mailAndPrintButton()');
        }
}










