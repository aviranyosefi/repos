
function beforeLoad_addButton(type, form) {
   
    if (type == 'view') {
            form.setScript('customscript_qoute_print_client'); // client script id
            form.addButton('custpage_button_print', 'Print With Ts&Cs', 'printButton()');
        }            
}









