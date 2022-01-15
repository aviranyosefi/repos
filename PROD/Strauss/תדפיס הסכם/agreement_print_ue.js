
function beforeLoad_addButton(type, form) {
   
    if (type == 'view') {   
        form.setScript('customscript_agreement_print_client'); // client script id
        form.addButton('custpage_button_print', 'Print', 'printButton()');    
    }
}









